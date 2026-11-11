// ====================================================================
// VIDEO TIP CARD — one curated tip with a "seen" button
// ====================================================================
// Built with DOM APIs (no innerHTML). The card only re-renders when its
// config or the language changes; hass updates arrive several times per
// second and carry nothing this card displays.
// ====================================================================

import type { HomeAssistant } from '../types/homeassistant';
import { localize, onLanguageLoaded, setupLocalize } from '../utils/localize';
import { dismissTip } from '../utils/video-tips';

interface VideoTipCardConfig {
  tip_id?: string;
  title?: string;
  url?: string;
}

const CARD_STYLE = `
  :host { display: block; }
  :host([hidden]) { display: none; }
  .tip { display: flex; align-items: center; gap: 12px; padding: 12px 16px; }
  .text { flex: 1; min-width: 0; overflow-wrap: anywhere; }
  .actions { display: flex; align-items: center; gap: 4px; flex: none; }
  a { color: var(--primary-color); font-weight: 500; text-decoration: none; }
  a:hover, a:focus-visible { text-decoration: underline; }
  button {
    display: flex; align-items: center; justify-content: center;
    width: 36px; height: 36px; border: 0; border-radius: 50%; padding: 0;
    background: transparent; color: var(--secondary-text-color); cursor: pointer;
  }
  button:hover, button:focus-visible { background: var(--secondary-background-color); }
`;

/** Only plain https links are rendered; anything else falls back to text. */
function safeUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    return new URL(value).protocol === 'https:' ? value : undefined;
  } catch {
    return undefined;
  }
}

class DashboardStrategyVideoTipCard extends HTMLElement {
  private _hass?: HomeAssistant;
  private _config: VideoTipCardConfig = {};
  private _renderedKey?: string;
  private _unsubscribeLanguage?: () => void;

  set hass(value: HomeAssistant) {
    const languageChanged = this._hass?.language !== value.language || this._hass?.locale !== value.locale;
    this._hass = value;
    if (!languageChanged) return;
    setupLocalize(value);
    this._render();
  }

  setConfig(config?: VideoTipCardConfig): void {
    this._config = config ?? {};
    this._render();
  }

  connectedCallback(): void {
    // Translations other than English load on demand; refresh once they arrive.
    this._unsubscribeLanguage = onLanguageLoaded(() => this._render(true));
    this._render();
  }

  disconnectedCallback(): void {
    this._unsubscribeLanguage?.();
    this._unsubscribeLanguage = undefined;
  }

  getCardSize(): number {
    return 1;
  }

  private _render(force = false): void {
    const root = this.shadowRoot ?? this.attachShadow({ mode: 'open' });
    const { tip_id: tipId, title } = this._config;
    const url = safeUrl(this._config.url);
    const key = JSON.stringify([tipId, title, url, this._hass?.language]);
    if (!force && key === this._renderedKey) return;
    this._renderedKey = key;

    const style = document.createElement('style');
    style.textContent = CARD_STYLE;

    const icon = document.createElement('ha-icon');
    icon.setAttribute('icon', 'mdi:lightbulb-on-outline');

    const text = document.createElement('span');
    text.className = 'text';
    text.textContent = title || localize('maintenance.video_tip_generic');

    const actions = document.createElement('div');
    actions.className = 'actions';
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = localize('maintenance.video_tip_watch');
      actions.appendChild(link);
    }
    if (tipId) {
      const dismiss = document.createElement('button');
      dismiss.type = 'button';
      dismiss.title = localize('maintenance.video_tip_dismiss');
      dismiss.setAttribute('aria-label', dismiss.title);
      const dismissIcon = document.createElement('ha-icon');
      dismissIcon.setAttribute('icon', 'mdi:check');
      dismiss.appendChild(dismissIcon);
      dismiss.addEventListener('click', () => {
        // Stored per browser; the next dashboard generation skips the tip.
        dismissTip(tipId);
        this.hidden = true;
      });
      actions.appendChild(dismiss);
    }

    const row = document.createElement('div');
    row.className = 'tip';
    row.append(icon, text, actions);

    const card = document.createElement('ha-card');
    card.appendChild(row);
    root.replaceChildren(style, card);
  }
}

customElements.define('dashboard-strategy-video-tip-card', DashboardStrategyVideoTipCard);
