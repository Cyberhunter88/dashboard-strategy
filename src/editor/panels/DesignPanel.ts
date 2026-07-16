import { html, nothing, type TemplateResult } from 'lit';

import type { LovelaceViewBackgroundConfig, MediaSelectorValue } from '../../types/lovelace';
import type { Simon42StrategyConfig } from '../../types/strategy';
import { localize } from '../../utils/localize';
import type { StrategyEditorHost } from '../editor-host';

const BG_IMAGE_FORM_SCHEMA = [{
  name: 'image',
  selector: { media: { accept: ['image/*'], clearable: true, image_upload: true, hide_content_type: true } },
}];

export function renderDesignSection(host: StrategyEditorHost): TemplateResult {
  const selectedTheme = host._config.theme || '';
  const background = host._config.background || {};
  const backgroundImage = background.image;
  const opacity = typeof background.opacity === 'number' ? background.opacity : 100;
  const themeNames = Object.keys(host._hass?.themes.themes || {}).sort((a, b) => a.localeCompare(b));

  return html`
    <div class="form-row">
      <label style="margin-right: 8px; min-width: 120px;">${localize('editor.theme')}</label>
      <select style="flex: 1;" @change=${(event: Event) =>
        themeChanged(host, (event.target as HTMLSelectElement).value.trim())}>
        <option value="" ?selected=${!selectedTheme}>${localize('editor.theme_default')}</option>
        ${themeNames.map((theme) =>
          html`<option value=${theme} ?selected=${theme === selectedTheme}>${theme}</option>`)}
      </select>
    </div>
    <div class="form-row" style="display: block;">
      ${customElements.get('ha-form')
        ? html`<ha-form
            .hass=${host._hass}
            .data=${{ image: backgroundImage }}
            .schema=${BG_IMAGE_FORM_SCHEMA}
            .computeLabel=${() => localize('editor.background_image')}
            @value-changed=${(event: CustomEvent<{ value: { image?: string | MediaSelectorValue } }>) =>
              backgroundImageChanged(host, event.detail.value.image)}
          ></ha-form>`
        : html`<label>${localize('editor.background_image')}</label>
            <input type="text" .value=${typeof backgroundImage === 'string' ? backgroundImage : ''}
              placeholder="/local/background.jpg"
              @change=${(event: Event) =>
                backgroundImageChanged(host, (event.target as HTMLInputElement).value.trim())} />`}
      <div class="description">${localize('editor.background_image_desc')}</div>
    </div>
    ${backgroundImage
      ? html`<div class="form-row">
          <label style="margin-right: 8px; min-width: 120px;">${localize('editor.background_opacity')}</label>
          <input type="range" min="10" max="100" step="5" style="flex: 1;" .value=${String(opacity)}
            @change=${(event: Event) =>
              backgroundOptionChanged(host, 'opacity', Number((event.target as HTMLInputElement).value))} />
          <span>${opacity}%</span>
        </div>
        ${host._renderCheckbox(
          'dashboard-background-fixed',
          localize('editor.background_fixed'),
          background.attachment === 'fixed',
          (checked) => backgroundOptionChanged(host, 'attachment', checked ? 'fixed' : undefined)
        )}`
      : nothing}
  `;
}

function themeChanged(host: StrategyEditorHost, theme: string): void {
  const config: Simon42StrategyConfig = { ...host._config };
  if (theme) config.theme = theme;
  else delete config.theme;
  host._fireConfigChanged(config);
}

function backgroundImageChanged(
  host: StrategyEditorHost,
  image: string | MediaSelectorValue | undefined
): void {
  const config: Simon42StrategyConfig = { ...host._config };
  if (typeof image === 'string' ? image !== '' : !!image) {
    config.background = { ...(config.background || {}), image };
  } else {
    delete config.background;
  }
  host._fireConfigChanged(config);
}

function backgroundOptionChanged(
  host: StrategyEditorHost,
  option: 'opacity' | 'attachment',
  value: number | 'fixed' | undefined
): void {
  if (!host._config.background?.image) return;
  const background: LovelaceViewBackgroundConfig = { ...host._config.background };
  if (option === 'opacity') {
    if (typeof value === 'number' && value < 100) background.opacity = value;
    else delete background.opacity;
  } else if (value === 'fixed') {
    background.attachment = 'fixed';
  } else {
    delete background.attachment;
  }
  host._fireConfigChanged({ ...host._config, background });
}
