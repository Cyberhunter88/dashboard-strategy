// ====================================================================
// WEBRTC CAMERA CARD - Visibility-aware wrapper for custom:webrtc-camera
// ====================================================================

import type { HomeAssistant } from '../types/homeassistant';
import type { LovelaceCardConfig } from '../types/lovelace';
import type { CameraWebrtcPreloadMode } from '../types/strategy';

interface WebrtcCameraCardConfig extends LovelaceCardConfig {
  card?: LovelaceCardConfig;
  preload?: CameraWebrtcPreloadMode;
  preload_margin?: number;
}

type WebrtcCameraElement = HTMLElement & {
  hass?: HomeAssistant;
  setConfig?: (config: LovelaceCardConfig) => void;
  getCardSize?: () => number;
};

class DashboardStrategyWebrtcCameraCard extends HTMLElement {
  private _hass?: HomeAssistant;
  private _config?: WebrtcCameraCardConfig;
  private _card?: WebrtcCameraElement;
  private _observer?: IntersectionObserver;
  private _renderedCardConfig?: LovelaceCardConfig;
  private _shouldMount = false;
  private _mountToken = 0;

  set hass(hass: HomeAssistant | undefined) {
    this._hass = hass;
    if (this._card) this._card.hass = hass;
  }

  get hass(): HomeAssistant | undefined {
    return this._hass;
  }

  setConfig(config: WebrtcCameraCardConfig): void {
    if (!config?.card || typeof config.card !== 'object') {
      throw new Error('WebRTC camera wrapper needs a card config');
    }
    this._config = config;
    this._restartObserver();
    this._updateMountState();
  }

  connectedCallback(): void {
    this.style.display = 'block';
    this._restartObserver();
    this._updateMountState();
  }

  disconnectedCallback(): void {
    this._observer?.disconnect();
    this._observer = undefined;
    this._shouldMount = false;
    this._unmountCard();
  }

  getCardSize(): number {
    return this._card?.getCardSize?.() ?? 3;
  }

  private _getPreloadMode(): CameraWebrtcPreloadMode {
    return this._config?.preload ?? 'near_viewport';
  }

  private _getPreloadMargin(): number {
    const margin = Number(this._config?.preload_margin);
    return Number.isFinite(margin) && margin >= 0 ? margin : 800;
  }

  private _createCardConfig(): LovelaceCardConfig {
    const preload = this._getPreloadMode();
    return {
      ...this._config!.card!,
      ...(preload === 'always' ? { background: true } : {}),
    };
  }

  private _restartObserver(): void {
    this._observer?.disconnect();
    this._observer = undefined;

    if (!this.isConnected || !this._config) return;

    const preload = this._getPreloadMode();
    if (preload === 'always') {
      this._shouldMount = true;
      return;
    }

    if (!('IntersectionObserver' in window)) {
      this._shouldMount = true;
      return;
    }

    this._shouldMount = false;
    const margin = this._getPreloadMargin();
    this._observer = new IntersectionObserver(
      ([entry]) => {
        const shouldMount = entry?.isIntersecting === true;
        if (shouldMount === this._shouldMount) return;
        this._shouldMount = shouldMount;
        this._updateMountState();
      },
      { rootMargin: `${margin}px 0px`, threshold: 0.01 }
    );
    this._observer.observe(this);
  }

  private _updateMountState(): void {
    if (!this._config || !this.isConnected) return;

    if (!this._shouldMount && this._getPreloadMode() !== 'always') {
      this._unmountCard();
      return;
    }

    const cardConfig = this._createCardConfig();
    const token = ++this._mountToken;
    if (!this._card) {
      this._card = document.createElement('webrtc-camera') as WebrtcCameraElement;
      this.replaceChildren(this._card);
    }

    const applyConfig = () => {
      if (token !== this._mountToken || !this._card) return;
      this._card.setConfig?.(cardConfig);
      this._renderedCardConfig = cardConfig;
      if (this._hass) this._card.hass = this._hass;
    };

    if (this._renderedCardConfig !== cardConfig) {
      if (this._card.setConfig) applyConfig();
      else void customElements.whenDefined('webrtc-camera').then(applyConfig);
    } else if (this._hass) {
      this._card.hass = this._hass;
    }
  }

  private _unmountCard(): void {
    if (!this._card) return;
    this._mountToken++;
    this.replaceChildren();
    this._card = undefined;
    this._renderedCardConfig = undefined;
  }
}

customElements.define('dashboard-strategy-webrtc-camera-card', DashboardStrategyWebrtcCameraCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'dashboard-strategy-webrtc-camera-card',
  name: 'Dashboard Strategy WebRTC Camera Card',
  description: 'Visibility-aware wrapper for custom:webrtc-camera',
});
