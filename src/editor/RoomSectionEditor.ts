// ====================================================================
// Room section strategy editor
// ====================================================================
// Minimal visual editor for `custom:dashboard-strategy-room`: an area
// picker and the heading switch via Home Assistant's own ha-form. Every
// other dashboard option stays available in YAML and is passed through.
// ====================================================================

import { LitElement, html, type TemplateResult } from 'lit';
import type { HomeAssistant } from '../types/homeassistant';
import type { RoomSectionStrategyConfig } from '../sections/RoomSection';

const SCHEMA = [
  { name: 'area', required: true, selector: { area: {} } },
  { name: 'show_heading', selector: { boolean: {} } },
] as const;

type LocalizeFn = (key: string) => string;

function haLabel(hass: HomeAssistant | undefined, key: string, fallback: string): string {
  const localizeFn = (hass as unknown as { localize?: LocalizeFn } | undefined)?.localize;
  const value = typeof localizeFn === 'function' ? localizeFn(key) : '';
  return value || fallback;
}

export class RoomSectionEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
  };

  hass?: HomeAssistant;
  private _config: RoomSectionStrategyConfig = {};

  setConfig(config: RoomSectionStrategyConfig): void {
    this._config = { ...config };
  }

  private _computeLabel = (schema: { name: string }): string =>
    schema.name === 'area'
      ? haLabel(this.hass, 'ui.components.area-picker.area', 'Area')
      : haLabel(this.hass, 'ui.panel.lovelace.editor.card.heading.heading', 'Heading');

  private _valueChanged(event: CustomEvent<{ value: RoomSectionStrategyConfig }>): void {
    event.stopPropagation();
    const value = { ...this._config, ...event.detail.value };
    if (value.show_heading !== false) delete value.show_heading;
    this._config = value;
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: value }, bubbles: true, composed: true }));
  }

  protected render(): TemplateResult {
    return html`<ha-form
      .hass=${this.hass}
      .data=${{ show_heading: true, ...this._config }}
      .schema=${SCHEMA}
      .computeLabel=${this._computeLabel}
      @value-changed=${this._valueChanged}
    ></ha-form>`;
  }
}

if (!customElements.get('dashboard-strategy-room-section-editor')) {
  customElements.define('dashboard-strategy-room-section-editor', RoomSectionEditor);
}
