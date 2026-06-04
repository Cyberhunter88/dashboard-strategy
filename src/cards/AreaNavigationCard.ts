// ====================================================================
// AREA NAVIGATION CARD
// ====================================================================
// Thin wrapper around HA's native area card. The native card keeps all
// rendering/features, while this wrapper performs room navigation reliably
// on first dashboard load.
// ====================================================================

import type { HomeAssistant } from '../types/homeassistant';
import type { LovelaceCardConfig } from '../types/lovelace';

interface AreaNavigationCardConfig extends LovelaceCardConfig {
  navigation_path: string;
}

type NativeAreaCard = HTMLElement & {
  hass?: HomeAssistant;
  setConfig?: (config: LovelaceCardConfig) => void;
  getCardSize?: () => number;
};

class DashboardStrategyAreaNavigationCard extends HTMLElement {
  private _hass?: HomeAssistant;
  private _config?: AreaNavigationCardConfig;
  private _card?: NativeAreaCard;
  private _nativeCardReady = false;

  set hass(hass: HomeAssistant | undefined) {
    this._hass = hass;
    if (this._card) this._card.hass = hass;
  }

  get hass(): HomeAssistant | undefined {
    return this._hass;
  }

  setConfig(config: AreaNavigationCardConfig): void {
    this._config = config;
    this._ensureCard();
    this._updateNativeCard();
  }

  connectedCallback(): void {
    this.style.display = 'block';
    this._ensureCard();
    this.addEventListener('click', this._handleClick);
  }

  disconnectedCallback(): void {
    this.removeEventListener('click', this._handleClick);
  }

  private _ensureCard(): void {
    if (this._card) return;

    this._card = document.createElement('hui-area-card') as NativeAreaCard;
    if (this.hass) this._card.hass = this.hass;
    this.appendChild(this._card);

    this._nativeCardReady = typeof this._card.setConfig === 'function';
    if (this._nativeCardReady) return;

    void customElements.whenDefined('hui-area-card')
      .then(() => {
        this._nativeCardReady = true;
        if (this._card && this._hass) this._card.hass = this._hass;
        this._updateNativeCard();
      })
      .catch(() => {
        this._nativeCardReady = false;
      });
  }

  private _updateNativeCard(): void {
    if (!this._card || !this._config || !this._nativeCardReady) return;

    const areaConfig: LovelaceCardConfig = Object.fromEntries(
      Object.entries(this._config).filter(([key]) => key !== 'navigation_path' && key !== 'type')
    ) as LovelaceCardConfig;

    this._card.setConfig?.({
      ...areaConfig,
      type: 'area',
      tap_action: { action: 'none' },
    });
  }

  private _isFeatureInteraction(event: MouseEvent): boolean {
    return event.composedPath().some((node) => {
      if (!(node instanceof HTMLElement)) return false;
      const tagName = node.tagName.toLowerCase();
      return (
        tagName === 'hui-card-features' ||
        tagName === 'ha-control-button' ||
        tagName === 'ha-control-button-group' ||
        tagName === 'button'
      );
    });
  }

  private _handleClick = (event: MouseEvent): void => {
    if (!this._config || event.defaultPrevented || this._isFeatureInteraction(event)) return;

    event.preventDefault();
    history.pushState(null, '', this._config.navigation_path);
    window.dispatchEvent(new Event('location-changed'));
  };

  getCardSize(): number {
    return this._card?.getCardSize?.() ?? 1;
  }
}

customElements.define('dashboard-strategy-area-card', DashboardStrategyAreaNavigationCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'dashboard-strategy-area-card',
  name: 'Dashboard Strategy Area Card',
  description: 'Native area card with reliable dashboard strategy navigation',
});
