// ====================================================================
// Inline editable Lovelace card wrapper
// ====================================================================

import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import yaml from 'js-yaml';

import type { HomeAssistant } from '../types/homeassistant';
import type { LovelaceCardConfig } from '../types/lovelace';
import type { InlineEditorConfig, InlineViewEdits } from '../types/strategy';

const EDIT_MODE_STORAGE_KEY = 'dashboard-strategy-inline-edit-mode';
const EDIT_MODE_EVENT = 'dashboard-strategy-inline-edit-mode-changed';
const TOGGLE_ID = 'dashboard-strategy-inline-edit-toggle';

let editMode = localStorage.getItem(EDIT_MODE_STORAGE_KEY) === 'true';
let toggleCreated = false;

function setEditMode(enabled: boolean): void {
  editMode = enabled;
  localStorage.setItem(EDIT_MODE_STORAGE_KEY, enabled ? 'true' : 'false');
  window.dispatchEvent(new CustomEvent(EDIT_MODE_EVENT, { detail: { editMode } }));
  updateToggleButton();
}

function updateToggleButton(): void {
  const button = document.getElementById(TOGGLE_ID) as HTMLButtonElement | null;
  if (!button) return;
  button.classList.toggle('active', editMode);
  button.title = editMode ? 'Dashboard-Bearbeitung beenden' : 'Dashboard bearbeiten';
  button.textContent = editMode ? '✓' : '✎';
}

function ensureToggleButton(): void {
  if (toggleCreated) return;
  toggleCreated = true;

  const style = document.createElement('style');
  style.textContent = `
    #${TOGGLE_ID} {
      position: fixed;
      right: 18px;
      bottom: 18px;
      z-index: 2147483647;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: none;
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0, 0, 0, .3));
      font-size: 24px;
      line-height: 44px;
      cursor: pointer;
    }
    #${TOGGLE_ID}.active {
      background: var(--success-color, #43a047);
    }
  `;
  document.head.appendChild(style);

  const button = document.createElement('button');
  button.id = TOGGLE_ID;
  button.type = 'button';
  button.addEventListener('click', () => setEditMode(!editMode));
  document.body.appendChild(button);
  updateToggleButton();
}

function dashboardUrlPath(): string | null {
  const firstSegment = window.location.pathname.split('/').filter(Boolean)[0];
  return firstSegment && firstSegment !== 'lovelace' ? firstSegment : null;
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function cardElementTag(type: string): string | null {
  if (!type) return null;
  if (type.startsWith('custom:')) return type.replace(/^custom:/, '');
  if (type === 'entities') return 'hui-entities-card';
  if (type === 'entity') return 'hui-entity-card';
  if (type === 'picture-elements') return 'hui-picture-elements-card';
  return `hui-${type}-card`;
}

class DashboardStrategyEditableCard extends LitElement {
  static properties = {
    _editMode: { state: true },
    _editorOpen: { state: true },
    _yamlText: { state: true },
    _saving: { state: true },
    _error: { state: true },
    _hidden: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      position: relative;
    }

    :host([hidden]) {
      display: none;
    }

    .host {
      position: relative;
    }

    .overlay {
      position: absolute;
      top: 6px;
      right: 6px;
      z-index: 2;
      display: flex;
      gap: 6px;
      padding: 4px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--card-background-color, #111) 88%, transparent);
      box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0, 0, 0, .24));
    }

    .overlay button,
    .dialog-actions button {
      border: none;
      border-radius: 8px;
      padding: 8px 10px;
      cursor: pointer;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      font: inherit;
    }

    .overlay button.secondary,
    .dialog-actions button.secondary {
      background: var(--secondary-background-color, #333);
      color: var(--primary-text-color);
    }

    .modal {
      position: fixed;
      inset: 0;
      z-index: 2147483646;
      display: grid;
      place-items: center;
      background: rgba(0, 0, 0, .55);
      padding: 24px;
    }

    .dialog {
      width: min(760px, 100%);
      max-height: min(760px, 92vh);
      display: flex;
      flex-direction: column;
      background: var(--card-background-color, #1c1c1c);
      color: var(--primary-text-color);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, 0 12px 36px rgba(0, 0, 0, .42));
      overflow: hidden;
    }

    .dialog-header,
    .dialog-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 16px;
      border-bottom: 1px solid var(--divider-color, rgba(255,255,255,.12));
    }

    .dialog-actions {
      justify-content: flex-end;
      border-top: 1px solid var(--divider-color, rgba(255,255,255,.12));
      border-bottom: 0;
    }

    .dialog-body {
      overflow: auto;
      padding: 16px;
    }

    .editor-host:empty {
      display: none;
    }

    textarea {
      width: 100%;
      min-height: 220px;
      box-sizing: border-box;
      margin-top: 12px;
      padding: 10px;
      border: 1px solid var(--divider-color, #555);
      border-radius: 8px;
      background: var(--secondary-background-color, #222);
      color: var(--primary-text-color);
      font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
      font-size: 13px;
    }

    .error {
      margin-top: 8px;
      color: var(--error-color, #db4437);
      font-size: 13px;
    }
  `;

  private _hass?: HomeAssistant;
  private _child?: HTMLElement;
  private _childConfig?: LovelaceCardConfig;
  private _editorElement?: HTMLElement;

  _editMode = editMode;
  _editorOpen = false;
  _yamlText = '';
  _saving = false;
  _error = '';
  _hidden = false;

  edit_id = '';
  view_path = '';
  source_hash = '';
  card?: LovelaceCardConfig;
  original_card?: LovelaceCardConfig;
  has_override = false;

  setConfig(config: Record<string, unknown>): void {
    this.edit_id = String(config.edit_id || '');
    this.view_path = String(config.view_path || '');
    this.source_hash = String(config.source_hash || '');
    this.card = config.card as LovelaceCardConfig | undefined;
    this.original_card = config.original_card as LovelaceCardConfig | undefined;
    this.has_override = config.has_override === true;
    void this._renderChild();
  }

  set hass(hass: HomeAssistant) {
    this._hass = hass;
    if (this._child) (this._child as any).hass = hass;
    if (this._editorElement) (this._editorElement as any).hass = hass;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    ensureToggleButton();
    window.addEventListener(EDIT_MODE_EVENT, this._handleEditModeChange as EventListener);
  }

  override disconnectedCallback(): void {
    window.removeEventListener(EDIT_MODE_EVENT, this._handleEditModeChange as EventListener);
    super.disconnectedCallback();
  }

  override updated(): void {
    void this._renderChild();
    if (this._editorOpen) this._mountEditor();
  }

  private _handleEditModeChange = (event: CustomEvent<{ editMode: boolean }>): void => {
    this._editMode = event.detail.editMode;
  };

  private async _renderChild(): Promise<void> {
    if (!this.card) return;

    const host = this.shadowRoot?.querySelector('.card-host') as HTMLElement | null;
    if (!host) {
      this.requestUpdate();
      return;
    }

    if (this._child && stableSame(this._childConfig, this.card)) return;
    this._childConfig = clone(this.card);

    host.innerHTML = '';

    try {
      const helpers = await window.loadCardHelpers?.();
      let child: HTMLElement;

      if (helpers?.createCardElement) {
        child = helpers.createCardElement(this.card);
      } else {
        const tagName = cardElementTag(this.card.type);
        if (!tagName) {
          throw new Error(`Card helper not available for ${this.card.type}`);
        }
        if (!customElements.get(tagName)) {
          await customElements.whenDefined(tagName);
        }
        child = document.createElement(tagName);
      }

      if ('setConfig' in child) {
        (child as any).setConfig(this.card);
      }
      if (this._hass) (child as any).hass = this._hass;
      host.appendChild(child);
      this._child = child;
    } catch (error) {
      const fallback = document.createElement('hui-error-card');
      if ('setConfig' in fallback) {
        (fallback as any).setConfig({
          type: 'error',
          error: error instanceof Error ? error.message : 'Card konnte nicht geladen werden',
          origConfig: this.card,
        });
      }
      if (this._hass) (fallback as any).hass = this._hass;
      host.appendChild(fallback);
      this._child = fallback;
    }
  }

  private _openEditor(): void {
    if (!this.card) return;
    this._yamlText = yaml.dump(this.card).trim();
    this._error = '';
    this._editorElement = undefined;
    this._editorOpen = true;
  }

  private _closeEditor(): void {
    this._editorOpen = false;
    this._editorElement = undefined;
  }

  private _mountEditor(): void {
    if (this._editorElement || !this.card) return;
    const host = this.shadowRoot?.querySelector('.editor-host') as HTMLElement | null;
    if (!host || !customElements.get('hui-card-element-editor')) return;

    try {
      const editor = document.createElement('hui-card-element-editor');
      (editor as any).hass = this._hass;
      (editor as any).value = this.card;
      if ('setConfig' in editor) (editor as any).setConfig(this.card);
      editor.addEventListener('config-changed', (event: Event) => {
        const config = (event as CustomEvent).detail?.config;
        if (!config || typeof config !== 'object') return;
        this.card = config as LovelaceCardConfig;
        this._yamlText = yaml.dump(config).trim();
        this.requestUpdate();
      });
      host.appendChild(editor);
      this._editorElement = editor;
    } catch {
      this._editorElement = undefined;
    }
  }

  private _yamlChanged(event: Event): void {
    this._yamlText = (event.target as HTMLTextAreaElement).value;
    try {
      const parsed = yaml.load(this._yamlText);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        this.card = parsed as LovelaceCardConfig;
        this._error = '';
      }
    } catch {
      // Keep the user's text while they are typing.
    }
  }

  private async _saveOverride(): Promise<void> {
    if (!this._hass || !this.card) return;
    this._saving = true;
    this._error = '';

    try {
      const parsed = yaml.load(this._yamlText || yaml.dump(this.card));
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('YAML muss eine einzelne Lovelace-Karte sein.');
      }

      const nextCard = parsed as LovelaceCardConfig;
      await this._updateInlineConfig((viewEdits) => {
        const overrides = { ...(viewEdits.generated_card_overrides || {}) };
        overrides[this.edit_id] = {
          yaml: yaml.dump(nextCard).trim(),
          parsed_config: nextCard,
          source_hash: this.source_hash,
          updated_at: new Date().toISOString(),
        };
        viewEdits.generated_card_overrides = overrides;
      });

      this.has_override = true;
      this.card = nextCard;
      await this._renderChild();
      this._closeEditor();
    } catch (error) {
      this._error = error instanceof Error ? error.message : 'Speichern nicht moeglich.';
    } finally {
      this._saving = false;
    }
  }

  private async _hideCard(): Promise<void> {
    if (!this._hass) return;
    this._saving = true;
    this._error = '';

    try {
      await this._updateInlineConfig((viewEdits) => {
        const hidden = new Set(viewEdits.hidden_generated_cards || []);
        hidden.add(this.edit_id);
        viewEdits.hidden_generated_cards = [...hidden];
      });
      this._hidden = true;
      this.setAttribute('hidden', '');
    } catch (error) {
      this._error = error instanceof Error ? error.message : 'Karte konnte nicht ausgeblendet werden.';
    } finally {
      this._saving = false;
    }
  }

  private async _resetCard(): Promise<void> {
    if (!this._hass) return;
    this._saving = true;
    this._error = '';

    try {
      await this._updateInlineConfig((viewEdits) => {
        const overrides = { ...(viewEdits.generated_card_overrides || {}) };
        delete overrides[this.edit_id];
        viewEdits.generated_card_overrides = Object.keys(overrides).length > 0 ? overrides : undefined;
        viewEdits.hidden_generated_cards = (viewEdits.hidden_generated_cards || []).filter((id) => id !== this.edit_id);
      });

      this.has_override = false;
      this._hidden = false;
      this.removeAttribute('hidden');
      if (this.original_card) {
        this.card = clone(this.original_card);
        await this._renderChild();
      }
    } catch (error) {
      this._error = error instanceof Error ? error.message : 'Reset nicht moeglich.';
    } finally {
      this._saving = false;
    }
  }

  private async _updateInlineConfig(mutator: (viewEdits: InlineViewEdits) => void): Promise<void> {
    if (!this._hass) throw new Error('Home Assistant ist noch nicht bereit.');
    const urlPath = dashboardUrlPath();

    const lovelaceConfig = await this._hass.callWS<Record<string, any>>({
      type: 'lovelace/config',
      url_path: urlPath,
    } as any);

    if (!lovelaceConfig.strategy || typeof lovelaceConfig.strategy !== 'object') {
      throw new Error('Dieses Dashboard kann nicht automatisch gespeichert werden. YAML-Dashboards bitte manuell bearbeiten.');
    }

    const strategyConfig = clone(lovelaceConfig.strategy);
    const inlineEditor: InlineEditorConfig = {
      version: 1,
      ...(strategyConfig.inline_editor || {}),
      views: { ...(strategyConfig.inline_editor?.views || {}) },
    };
    const currentView = inlineEditor.views?.[this.view_path] || {};
    const viewEdits: InlineViewEdits = {
      ...currentView,
      generated_card_overrides: currentView.generated_card_overrides
        ? { ...currentView.generated_card_overrides }
        : undefined,
      hidden_generated_cards: currentView.hidden_generated_cards
        ? [...currentView.hidden_generated_cards]
        : undefined,
    };

    mutator(viewEdits);
    inlineEditor.views = { ...(inlineEditor.views || {}), [this.view_path]: compactViewEdits(viewEdits) };
    strategyConfig.inline_editor = inlineEditor;

    await this._hass.callWS({
      type: 'lovelace/config/save',
      url_path: urlPath,
      config: {
        ...lovelaceConfig,
        strategy: strategyConfig,
      },
    } as any);
  }

  override render(): TemplateResult {
    if (this._hidden) return html``;

    return html`
      <div class="host">
        <div class="card-host"></div>
        ${this._editMode
          ? html`
              <div class="overlay">
                <button type="button" @click=${this._openEditor}>Bearbeiten</button>
                ${this.has_override
                  ? html`<button type="button" class="secondary" @click=${this._resetCard}>Reset</button>`
                  : nothing}
                <button type="button" class="secondary" @click=${this._hideCard}>Ausblenden</button>
              </div>
            `
          : nothing}
        ${this._editorOpen ? this._renderEditorDialog() : nothing}
      </div>
    `;
  }

  private _renderEditorDialog(): TemplateResult {
    return html`
      <div class="modal" @click=${(event: Event) => event.target === event.currentTarget && this._closeEditor()}>
        <div class="dialog" @click=${(event: Event) => event.stopPropagation()}>
          <div class="dialog-header">
            <strong>Karte bearbeiten</strong>
            <button type="button" class="secondary" @click=${this._closeEditor}>Schliessen</button>
          </div>
          <div class="dialog-body">
            <div class="editor-host"></div>
            <textarea
              spellcheck="false"
              .value=${this._yamlText}
              @input=${this._yamlChanged}
            ></textarea>
            ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
          </div>
          <div class="dialog-actions">
            <button type="button" class="secondary" @click=${this._closeEditor}>Abbrechen</button>
            <button type="button" ?disabled=${this._saving} @click=${this._saveOverride}>
              ${this._saving ? 'Speichern...' : 'Speichern'}
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

function stableSame(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function compactViewEdits(viewEdits: InlineViewEdits): InlineViewEdits {
  const next: InlineViewEdits = { ...viewEdits };
  if (next.generated_card_overrides && Object.keys(next.generated_card_overrides).length === 0) {
    delete next.generated_card_overrides;
  }
  if (next.hidden_generated_cards && next.hidden_generated_cards.length === 0) {
    delete next.hidden_generated_cards;
  }
  if (next.section_order && next.section_order.length === 0) {
    delete next.section_order;
  }
  return next;
}

customElements.define('dashboard-strategy-editable-card', DashboardStrategyEditableCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'dashboard-strategy-editable-card',
  name: 'Dashboard Strategy Editable Card',
  description: 'Internal wrapper for Dashboard Strategy inline editing',
});
