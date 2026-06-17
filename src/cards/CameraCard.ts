// ====================================================================
// CAMERA CARD - Native HA camera card with visibility-aware streaming
// ====================================================================

import type { HomeAssistant } from '../types/homeassistant';
import type { LovelaceCardConfig } from '../types/lovelace';
import { localize } from '../utils/localize';

type CameraStreamMode = 'snapshot' | 'on_demand' | 'live';

interface CameraCardConfig extends LovelaceCardConfig {
  entity: string;
  name?: string;
  entities?: Array<string | Record<string, unknown>>;
  stream_mode?: CameraStreamMode;
  fit_mode?: 'cover' | 'contain' | 'fill';
  aspect_ratio?: string;
}

type NativeCameraCard = HTMLElement & {
  hass?: HomeAssistant;
  setConfig?: (config: LovelaceCardConfig) => void;
  getCardSize?: () => number;
};

interface CameraWindow extends Window {
  loadCardHelpers?: () => Promise<{
    createCardElement(config: LovelaceCardConfig): NativeCameraCard;
  }>;
}
class DashboardStrategyCameraCard extends HTMLElement {
  private _hass?: HomeAssistant;
  private _config?: CameraCardConfig;
  private _card?: NativeCameraCard;
  private _streamButton?: HTMLButtonElement;
  private _observer?: IntersectionObserver;
  private _visible = false;
  private _streamRequested = false;
  private _renderToken = 0;

  set hass(hass: HomeAssistant | undefined) {
    this._hass = hass;
    if (this._card) this._card.hass = hass;
  }

  get hass(): HomeAssistant | undefined {
    return this._hass;
  }

  setConfig(config: CameraCardConfig): void {
    if (!config?.entity) throw new Error('Camera entity must be specified');
    this._config = config;
    this._streamRequested = false;
    this._ensureCard();
  }

  connectedCallback(): void {
    this.style.display = 'block';
    this.style.position = 'relative';
    this._startVisibilityObserver();
    this._ensureCard();
  }

  disconnectedCallback(): void {
    this._observer?.disconnect();
    this._observer = undefined;
    this._visible = false;
    this._updateNativeCard();
  }

  getCardSize(): number {
    return this._card?.getCardSize?.() ?? 3;
  }

  private _getStreamMode(): CameraStreamMode {
    return this._config?.stream_mode ?? 'on_demand';
  }

  private _shouldStream(): boolean {
    if (!this.isConnected || !this._visible) return false;
    const mode = this._getStreamMode();
    return mode === 'live' || (mode === 'on_demand' && this._streamRequested);
  }

  private _startVisibilityObserver(): void {
    if (this._observer) return;
    if (!('IntersectionObserver' in window)) {
      this._visible = true;
      return;
    }

    this._observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry?.isIntersecting === true;
        if (visible === this._visible) return;
        this._visible = visible;
        this._updateNativeCard();
      },
      { rootMargin: '120px 0px', threshold: 0.01 }
    );
    this._observer.observe(this);
  }

  private _ensureCard(): void {
    if (!this._config || !this.isConnected) return;

    if (this._card) {
      this._updateNativeCard();
      this._renderContents();
      return;
    }

    const token = ++this._renderToken;
    void this._createNativeCard(this._createNativeConfig())
      .then((card) => {
        if (token !== this._renderToken) return;
        this._card = card;
        this._updateNativeCard();
        this._renderContents();
      })
      .catch(() => {
        if (token === this._renderToken) this._card = undefined;
      });
  }

  private async _createNativeCard(config: LovelaceCardConfig): Promise<NativeCameraCard> {
    const cameraWindow = window as CameraWindow;
    if (cameraWindow.loadCardHelpers) {
      const helpers = await cameraWindow.loadCardHelpers();
      return helpers.createCardElement(config);
    }

    const tagName = config.type === 'picture-glance' ? 'hui-picture-glance-card' : 'hui-picture-entity-card';
    await customElements.whenDefined(tagName);
    const card = document.createElement(tagName) as NativeCameraCard;
    card.setConfig?.(config);
    return card;
  }

  private _createNativeConfig(): LovelaceCardConfig {
    const config = this._config!;
    const common = {
      camera_image: config.entity,
      camera_view: this._shouldStream() ? 'live' : 'auto',
      fit_mode: config.fit_mode ?? 'cover',
      aspect_ratio: config.aspect_ratio ?? '16:9',
    };

    if (config.entities?.length) {
      return {
        type: 'picture-glance',
        title: config.name,
        entities: config.entities,
        tap_action: { action: 'more-info' },
        ...common,
      };
    }

    return {
      type: 'picture-entity',
      entity: config.entity,
      name: config.name,
      show_name: true,
      show_state: false,
      tap_action: { action: 'more-info' },
      ...common,
    };
  }

  private _updateNativeCard(): void {
    if (!this._card || !this._config) return;
    this._card.setConfig?.(this._createNativeConfig());
    if (this._hass) this._card.hass = this._hass;
    this._updateStreamButton();
  }

  private _renderContents(): void {
    if (!this._card) return;
    this._streamButton = undefined;
    this.replaceChildren(this._card);

    if (this._getStreamMode() === 'on_demand') {
      const button = document.createElement('button');
      button.type = 'button';
      button.style.cssText =
        'position:absolute;top:8px;right:8px;z-index:2;width:40px;height:40px;border:0;border-radius:50%;' +
        'display:flex;align-items:center;justify-content:center;cursor:pointer;color:white;' +
        'background:rgba(0,0,0,.55);backdrop-filter:blur(4px);';
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        this._streamRequested = !this._streamRequested;
        this._updateNativeCard();
      });
      this._streamButton = button;
      this.appendChild(button);
      this._updateStreamButton();
    }
  }

  private _updateStreamButton(): void {
    if (!this._streamButton) return;
    const streaming = this._shouldStream();
    const icon = document.createElement('ha-icon');
    icon.setAttribute('icon', streaming ? 'mdi:stop' : 'mdi:play');
    this._streamButton.replaceChildren(icon);
    this._streamButton.title = localize(streaming ? 'room.stop_camera_stream' : 'room.start_camera_stream');
    this._streamButton.setAttribute('aria-label', this._streamButton.title);
  }
}

customElements.define('dashboard-strategy-camera-card', DashboardStrategyCameraCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'dashboard-strategy-camera-card',
  name: 'Dashboard Strategy Camera Card',
  description: 'Native Home Assistant camera card with visibility-aware streaming',
});
