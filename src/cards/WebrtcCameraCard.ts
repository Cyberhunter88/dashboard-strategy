// ====================================================================
// WEBRTC CAMERA CARD - go2rtc stream with explicit Play/Stop lifecycle
// ====================================================================

import type { HomeAssistant } from '../types/homeassistant';
import type { LovelaceCardConfig } from '../types/lovelace';
import { localize } from '../utils/localize';

interface WebrtcCameraCardConfig extends LovelaceCardConfig {
  url: string;
  name?: string;
  start_mode?: 'manual' | 'auto';
}

type WebrtcCardElement = HTMLElement & {
  hass?: HomeAssistant;
  getCardSize?: () => number;
};

interface CameraWindow extends Window {
  loadCardHelpers?: () => Promise<{
    createCardElement(config: LovelaceCardConfig): WebrtcCardElement;
  }>;
}

class DashboardStrategyWebrtcCameraCard extends HTMLElement {
  private _hass?: HomeAssistant;
  private _config?: WebrtcCameraCardConfig;
  private _card?: WebrtcCardElement;
  private _active = false;
  private _renderToken = 0;

  set hass(hass: HomeAssistant | undefined) {
    this._hass = hass;
    if (this._card) this._card.hass = hass;
  }

  get hass(): HomeAssistant | undefined {
    return this._hass;
  }

  setConfig(config: WebrtcCameraCardConfig): void {
    if (!config?.url?.trim()) throw new Error('go2rtc stream name or URL must be specified');
    this._stop();
    this._config = { ...config, url: config.url.trim() };
    this._active = config.start_mode === 'auto';
    this._render();
  }

  connectedCallback(): void {
    this.style.display = 'block';
    this.style.position = 'relative';
    this._render();
  }

  disconnectedCallback(): void {
    this._renderToken++;
    this._card = undefined;
  }

  getCardSize(): number {
    return this._card?.getCardSize?.() ?? 3;
  }

  private _start(): void {
    if (this._active) return;
    this._active = true;
    this._render();
  }

  private _stop(): void {
    this._active = false;
    this._renderToken++;
    this._card = undefined;
    if (this.isConnected) this._render();
  }

  private _render(): void {
    if (!this._config || !this.isConnected) return;

    if (!this._active) {
      this._renderShell();
      return;
    }

    if (this._card) {
      if (this._hass) this._card.hass = this._hass;
      this._renderShell(this._card);
      return;
    }

    this._renderShell();
    const token = ++this._renderToken;
    void this._createWebrtcCard()
      .then((card) => {
        if (token !== this._renderToken || !this._active) return;
        this._card = card;
        if (this._hass) card.hass = this._hass;
        this._renderShell(card);
      })
      .catch(() => {
        if (token === this._renderToken) {
          this._active = false;
          this._renderShell();
        }
      });
  }

  private async _createWebrtcCard(): Promise<WebrtcCardElement> {
    const cameraWindow = window as CameraWindow;
    if (!cameraWindow.loadCardHelpers) throw new Error('Home Assistant card helpers are unavailable');
    const helpers = await cameraWindow.loadCardHelpers();
    return helpers.createCardElement({
      type: 'custom:webrtc-camera',
      url: this._config!.url,
      ...(this._config!.name ? { title: this._config!.name } : {}),
    });
  }

  private _renderShell(card?: WebrtcCardElement): void {
    const shell = document.createElement('div');
    shell.style.cssText = 'position:relative;min-height:180px;';

    if (card) {
      shell.appendChild(card);
    } else {
      const placeholder = document.createElement('ha-card');
      placeholder.style.cssText =
        'min-height:180px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;';
      const icon = document.createElement('ha-icon');
      icon.setAttribute('icon', 'mdi:cctv');
      icon.style.setProperty('--mdc-icon-size', '40px');
      placeholder.appendChild(icon);
      if (this._config?.name) {
        const title = document.createElement('div');
        title.textContent = this._config.name;
        placeholder.appendChild(title);
      }
      shell.appendChild(placeholder);
    }

    if (!this._active) {
      const button = document.createElement('button');
      button.type = 'button';
      button.style.cssText =
        'position:absolute;top:8px;right:8px;z-index:2;width:40px;height:40px;border:0;border-radius:50%;' +
        'display:flex;align-items:center;justify-content:center;cursor:pointer;color:white;' +
        'background:rgba(0,0,0,.55);backdrop-filter:blur(4px);';
      const buttonIcon = document.createElement('ha-icon');
      buttonIcon.setAttribute('icon', 'mdi:play');
      button.appendChild(buttonIcon);
      button.title = localize('room.start_camera_stream');
      button.setAttribute('aria-label', button.title);
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        this._start();
      });
      shell.appendChild(button);
    }
    this.replaceChildren(shell);
  }
}

customElements.define('dashboard-strategy-webrtc-camera-card', DashboardStrategyWebrtcCameraCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'dashboard-strategy-webrtc-camera-card',
  name: 'Dashboard Strategy WebRTC Camera Card',
  description: 'go2rtc WebRTC camera card with configurable manual or automatic start',
});
