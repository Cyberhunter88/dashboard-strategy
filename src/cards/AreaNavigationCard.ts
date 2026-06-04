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

interface LovelaceCardHelpers {
  createCardElement(config: LovelaceCardConfig): NativeAreaCard;
}

declare global {
  interface Window {
    loadCardHelpers?: () => Promise<LovelaceCardHelpers>;
  }
}

class DashboardStrategyAreaNavigationCard extends HTMLElement {
  private _hass?: HomeAssistant;
  private _config?: AreaNavigationCardConfig;
  private _card?: NativeAreaCard;
  private _renderToken = 0;

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
    if (!this._config) return;

    if (this._card) {
      this._updateNativeCard();
      return;
    }

    const token = ++this._renderToken;
    const nativeConfig = this._createNativeConfig();

    void this._createNativeCard(nativeConfig)
      .then((card) => {
        if (token !== this._renderToken) return;

        this._card = card;
        if (this._hass) this._card.hass = this._hass;
        this.replaceChildren(this._card);
      })
      .catch(() => {
        if (token === this._renderToken) this._card = undefined;
      });
  }

  private async _createNativeCard(config: LovelaceCardConfig): Promise<NativeAreaCard> {
    if (window.loadCardHelpers) {
      const helpers = await window.loadCardHelpers();
      return helpers.createCardElement(config);
    }

    await customElements.whenDefined('hui-area-card');
    const card = document.createElement('hui-area-card') as NativeAreaCard;
    card.setConfig?.(config);
    return card;
  }

  private _createNativeConfig(): LovelaceCardConfig {
    if (!this._config) return { type: 'area' };
    const areaConfig: LovelaceCardConfig = Object.fromEntries(
      Object.entries(this._config).filter(([key]) => key !== 'navigation_path' && key !== 'type')
    ) as LovelaceCardConfig;

    return {
      ...areaConfig,
      type: 'area',
      tap_action: { action: 'none' },
    };
  }

  private _updateNativeCard(): void {
    if (!this._card || !this._config) return;

    const nativeConfig = this._createNativeConfig();
    if (typeof this._card.setConfig === 'function') {
      this._card.setConfig(nativeConfig);
      return;
    }

    this._card = undefined;
    this._ensureCard();
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
