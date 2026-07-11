import type { HomeAssistant } from '../types/homeassistant';

class DashboardStrategyVideoTipCard extends HTMLElement {
  private _hass?: HomeAssistant;
  set hass(value: HomeAssistant) {
    this._hass = value;
    this.render();
  }
  setConfig(): void { this.render(); }
  getCardSize(): number { return 1; }
  private render(): void {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    if (!this.shadowRoot) return;
    const language = this._hass?.language === 'de' ? 'de' : 'en';
    const text = language === 'de'
      ? 'Prüfe Updates einzeln und erstelle vor Firmware-Updates ein Backup.'
      : 'Review updates individually and create a backup before firmware updates.';
    this.shadowRoot.innerHTML = `<ha-card><div style="padding:16px;display:flex;gap:12px;align-items:center"><ha-icon icon="mdi:lightbulb-on-outline"></ha-icon><span>${text}</span></div></ha-card>`;
  }
}

customElements.define('dashboard-strategy-video-tip-card', DashboardStrategyVideoTipCard);
