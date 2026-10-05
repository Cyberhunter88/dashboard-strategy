import yaml from 'js-yaml';
import { html, nothing, type TemplateResult } from 'lit';
import type { AreaCustomCard, CustomCard } from '../../types/strategy';
import type { Simon42DashboardStrategyEditor } from '../StrategyEditor';
import { CARD_TYPES } from '../card-types';
type PanelHost = ReturnType<Simon42DashboardStrategyEditor['createCardPickerHost']>;

export function renderCardPickerOverlay(host: PanelHost): TemplateResult {
  if (host._cardPickerStep === 'type') return host._renderCardTypePicker();
  return host._renderCardEditor();
}

export function renderCardTypePicker(host: PanelHost): TemplateResult {
  const search = host._cardPickerSearch.toLowerCase();
  const filteredBuiltIn = CARD_TYPES.filter(
    (t) => !search || t.type.includes(search) || t.name.toLowerCase().includes(search)
  );
  const customCardTypes = (window.customCards || []).filter((c) => {
    const type = (c.type || '').toLowerCase();
    const name = (c.name || '').toLowerCase();
    if (type === 'webrtc-camera' || type === 'custom:webrtc-camera' || name.includes('webrtc')) return false;
    return !search || type.includes(search) || name.includes(search);
  });
  return html`
    <div class="card-picker-overlay" @click=${host._handlePickerOverlayClick}>
      <div class="card-picker-dialog" @click=${(e: Event) => e.stopPropagation()}>
        <div class="card-picker-header">
          <span class="card-picker-header-title">Karte hinzufügen</span>
          <button class="card-picker-icon-btn" @click=${host._closeCardPicker} title="Schließen">
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
        <div class="card-picker-search-row">
          <input
            type="text"
            placeholder="Kartentyp suchen…"
            .value=${host._cardPickerSearch}
            @input=${(e: Event) => {
              host._cardPickerSearch = (e.target as HTMLInputElement).value;
              host.requestUpdate();
            }}
          />
        </div>
        <div class="card-type-grid">
          ${filteredBuiltIn.map(
            (t) => html`
              <button class="card-type-btn" @click=${() => host._selectCardType(t.type)}>
                <ha-icon icon=${t.icon}></ha-icon>
                <span>${t.name}</span>
              </button>
            `
          )}
          ${customCardTypes.map(
            (c) => html`
              <button class="card-type-btn" @click=${() => host._selectCardType(c.type)}>
                <ha-icon icon="mdi:puzzle"></ha-icon>
                <span>${c.name || c.type}</span>
              </button>
            `
          )}
        </div>
      </div>
    </div>
  `;
}

export function renderCardEditor(host: PanelHost): TemplateResult {
  const typeName =
    CARD_TYPES.find((t) => t.type === host._cardPickerSelectedType)?.name || host._cardPickerSelectedType;
  return html`
    <div class="card-picker-overlay" @click=${host._handlePickerOverlayClick}>
      <div class="card-picker-dialog" @click=${(e: Event) => e.stopPropagation()}>
        <div class="card-picker-header">
          <button
            class="card-picker-icon-btn"
            @click=${() => {
              host._cardPickerStep = 'type';
              const visualHost = host.shadowRoot?.querySelector('.card-editor-visual-host') as HTMLElement | null;
              if (visualHost) visualHost.innerHTML = '';
              host._cardPickerHasVisualEditor = false;
            }}
            title="Zurück"
          >
            <ha-icon icon="mdi:arrow-left"></ha-icon>
          </button>
          <span class="card-picker-header-title">${typeName}</span>
          <button class="card-picker-icon-btn" @click=${host._closeCardPicker} title="Schließen">
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
        <div class="card-editor-content">
          <div class="card-editor-visual-host"></div>
          ${!host._cardPickerHasVisualEditor
            ? html`
                <div class="card-editor-yaml-label">YAML-Konfiguration:</div>
                <textarea
                  class="card-editor-yaml-area"
                  .value=${host._cardPickerYaml}
                  @input=${host._cardPickerYamlChanged}
                  spellcheck="false"
                ></textarea>
              `
            : nothing}
        </div>
        <div class="card-picker-footer">
          <button class="btn-secondary" @click=${host._closeCardPicker}>Abbrechen</button>
          <button class="btn-primary" @click=${host._confirmCardPicker}>Speichern</button>
        </div>
      </div>
    </div>
  `;
}

export function openCardPicker(
  host: PanelHost,
  callback: (config: Record<string, any>) => void,
  initialConfig?: Record<string, any>
): void {
  host._cardPickerCallback = callback;
  host._cardPickerConfig = initialConfig || null;
  host._cardPickerOpen = true;
  host._cardPickerStep = initialConfig ? 'editor' : 'type';
  host._cardPickerSearch = '';
  host._cardPickerSelectedType = typeof initialConfig?.type === 'string' ? initialConfig.type : '';
  host._cardPickerYaml = initialConfig ? yaml.dump(initialConfig).trim() : '';
  host._cardPickerHasVisualEditor = false;
}
export function closeCardPicker(host: PanelHost): void {
  host._cardPickerOpen = false;
  host._cardPickerCallback = null;
  host._cardPickerConfig = null;
  const visualHost = host.shadowRoot?.querySelector('.card-editor-visual-host') as HTMLElement | null;
  if (visualHost) visualHost.innerHTML = '';
}
export function selectCardType(host: PanelHost, type: string): void {
  host._cardPickerSelectedType = type;
  host._cardPickerStep = 'editor';
  const cardType = CARD_TYPES.find((t) => t.type === type);
  if (cardType) {
    host._cardPickerYaml = cardType.template;
    try {
      const parsed = yaml.load(cardType.template);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        host._cardPickerConfig = parsed as Record<string, any>;
      }
    } catch {
      /* ignore */
    }
  } else {
    host._cardPickerYaml = `type: ${type}\n`;
    host._cardPickerConfig = { type };
  }
  host._cardPickerHasVisualEditor = false;
}
export function cardPickerYamlChanged(host: PanelHost, e: Event): void {
  const yamlStr = (e.target as HTMLTextAreaElement).value;
  host._cardPickerYaml = yamlStr;
  try {
    const parsed = yaml.load(yamlStr);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      host._cardPickerConfig = parsed as Record<string, any>;
    }
  } catch {
    /* ignore — user still typing */
  }
}
export function confirmCardPicker(host: PanelHost): void {
  if (!host._cardPickerConfig || !host._cardPickerCallback) return;
  host._cardPickerCallback(host._cardPickerConfig);
  host._closeCardPicker();
}
export function tryMountVisualCardEditor(host: PanelHost): void {
  const visualHost = host.shadowRoot?.querySelector('.card-editor-visual-host') as HTMLElement | null;
  if (!visualHost || visualHost.firstChild) return;
  if (!customElements.get('hui-card-element-editor')) return;
  try {
    const el = document.createElement('hui-card-element-editor');
    (el as any).hass = host._hass;
    (el as any).value = host._cardPickerConfig || { type: host._cardPickerSelectedType };
    el.addEventListener('config-changed', (ev: Event) => {
      const config = (ev as CustomEvent).detail?.config;
      if (config && typeof config === 'object') {
        host._cardPickerConfig = config;
        host._cardPickerYaml = yaml.dump(config).trim();
        host.requestUpdate('_cardPickerYaml');
      }
    });
    visualHost.appendChild(el);
    host._cardPickerHasVisualEditor = true;
  } catch {
    /* visual editor unavailable — YAML fallback shown */
  }
}
export function getEditableAreaCardConfig(
  host: PanelHost,
  card: AreaCustomCard | undefined
): Record<string, any> | null {
  if (!card) return null;
  if ((card.mode || 'yaml') === 'tile' && card.entity) return { type: 'tile', entity: card.entity };
  return host._getEditableYamlCardConfig(card);
}
export function getEditableYamlCardConfig(
  _host: PanelHost,
  card: Pick<CustomCard | AreaCustomCard, 'parsed_config' | 'yaml'> | undefined
): Record<string, any> | null {
  if (card?.parsed_config && typeof card.parsed_config === 'object' && !Array.isArray(card.parsed_config)) {
    return card.parsed_config as Record<string, any>;
  }
  if (!card?.yaml?.trim()) return null;
  try {
    const parsed = yaml.load(card.yaml);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Record<string, any>) : null;
  } catch {
    return null;
  }
}
