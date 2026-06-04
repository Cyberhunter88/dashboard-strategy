// ====================================================================
// AREA NAVIGATION CARD
// ====================================================================
// Thin wrapper around HA's native area card. The native card keeps all
// rendering/features, while this wrapper performs room navigation reliably.
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
  private _tapStart: { pointerId: number; x: number; y: number } | null = null;
  private _lastPointerNavigation = 0;
  private readonly _boundHandleClick = (ev: MouseEvent) => this._handleClick(ev);
  private readonly _boundHandlePointerDown = (ev: PointerEvent) => this._handlePointerDown(ev);
  private readonly _boundHandlePointerUp = (ev: PointerEvent) => this._handlePointerUp(ev);

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
    this.style.cursor = 'pointer';
    this.style.touchAction = 'manipulation';
    this.addEventListener('pointerdown', this._boundHandlePointerDown, { capture: true });
    this.addEventListener('pointerup', this._boundHandlePointerUp, { capture: true });
    this.addEventListener('click', this._boundHandleClick, { capture: true });
    this._ensureCard();
  }

  disconnectedCallback(): void {
    this.removeEventListener('pointerdown', this._boundHandlePointerDown, { capture: true });
    this.removeEventListener('pointerup', this._boundHandlePointerUp, { capture: true });
    this.removeEventListener('click', this._boundHandleClick, { capture: true });
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

  private _isControlEvent(ev: Event): boolean {
    const path = ev.composedPath();
    for (const node of path) {
      if (!(node instanceof HTMLElement)) continue;
      if (node === this || node === this._card) continue;

      const tagName = node.tagName.toLowerCase();
      if (
        node.matches('a, button, input, select, textarea, mwc-button, ha-icon-button, ha-control-button') ||
        tagName.includes('control') ||
        tagName.includes('button')
      ) {
        return true;
      }
    }

    return false;
  }

  private _canNavigate(ev: Event): boolean {
    return !!this._config?.navigation_path && !ev.defaultPrevented && !this._isControlEvent(ev);
  }

  private _navigate(ev: Event): void {
    if (!this._config?.navigation_path) return;
    ev.preventDefault();
    ev.stopPropagation();
    window.history.pushState(null, '', this._config.navigation_path);
    window.dispatchEvent(new Event('location-changed'));
  }

  private _handlePointerDown(ev: PointerEvent): void {
    if (ev.pointerType === 'mouse' || !this._canNavigate(ev)) {
      this._tapStart = null;
      return;
    }

    this._tapStart = {
      pointerId: ev.pointerId,
      x: ev.clientX,
      y: ev.clientY,
    };
  }

  private _handlePointerUp(ev: PointerEvent): void {
    if (ev.pointerType === 'mouse' || !this._tapStart || this._tapStart.pointerId !== ev.pointerId || !this._canNavigate(ev)) {
      this._tapStart = null;
      return;
    }

    const dx = Math.abs(ev.clientX - this._tapStart.x);
    const dy = Math.abs(ev.clientY - this._tapStart.y);
    this._tapStart = null;

    if (dx > 12 || dy > 12) return;

    this._lastPointerNavigation = Date.now();
    this._navigate(ev);
  }

  private _handleClick(ev: MouseEvent): void {
    if (Date.now() - this._lastPointerNavigation < 750) {
      ev.preventDefault();
      ev.stopPropagation();
      return;
    }

    if (!this._canNavigate(ev)) return;
    this._navigate(ev);
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
