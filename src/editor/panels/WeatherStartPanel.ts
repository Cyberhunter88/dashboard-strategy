import { html, nothing, type TemplateResult } from 'lit';

import type { AreaRegistryEntry } from '../../types/registries';
import type { CustomCard, CustomSection, WeatherStartLayoutItem } from '../../types/strategy';
import { localize } from '../../utils/localize';

export interface WeatherStartFloorOption {
  floor_id: string | null;
  name: string;
  icon?: string | null;
}

export interface WeatherStartPanelItem {
  item: WeatherStartLayoutItem;
  icon: string;
  label: string;
  disabled: boolean;
  expanded: boolean;
  customCard?: CustomCard;
  customCardIndex: number;
  customSection?: CustomSection;
  customSectionIndex: number;
  fixedGridCount: number;
}

export interface WeatherStartPanelOptions {
  items: WeatherStartPanelItem[];
  areas: AreaRegistryEntry[];
  floors: WeatherStartFloorOption[];
  unplacedAreas: AreaRegistryEntry[];
  hasSummariesBlock: boolean;
  hasLongStackChain: boolean;
  renderCustomCardEditor: (card: CustomCard, index: number) => TemplateResult;
  renderCustomSectionEditor: (section: CustomSection, index: number) => TemplateResult;
  onDragStart: (event: DragEvent) => void;
  onDragEnd: (event: DragEvent) => void;
  onDragOver: (event: DragEvent) => void;
  onDragLeave: (event: DragEvent) => void;
  onDrop: (event: DragEvent) => void;
  onToggleExpanded: (itemId: string) => void;
  onRemove: (itemId: string) => void;
  onSummarySizeChanged: (itemId: string, size: 'mini' | 'normal') => void;
  onStackChanged: (itemId: string, checked: boolean) => void;
  onYamlChanged: (itemId: string, value: string) => void;
  onResetYaml: (itemId: string) => void;
  onAddCard: () => void;
  onAddSummaries: () => void;
  onAddSection: () => void;
  onAddArea: (event: Event) => void;
  onAddFloor: (event: Event) => void;
}

export function renderWeatherStartOrderPanel(options: WeatherStartPanelOptions): TemplateResult {
  return html`
    <div class="section">
      <div class="section-title">${localize('editor.weather_start_order')}</div>
      <div class="description" style="margin-left: 0; margin-bottom: 12px;">
        ${localize('editor.weather_start_order_desc')}
      </div>
      ${options.hasLongStackChain
        ? html`
            <div style="color:var(--warning-color,#f0a000);font-size:12px;margin:0 0 10px 0;">
              ${localize('editor.weather_start_stack_warning')}
            </div>
          `
        : nothing}
      <div class="section-order-list" id="weather-start-order-list">
        ${options.items.map(
          ({
            item,
            icon,
            label,
            disabled,
            expanded,
            customCard,
            customCardIndex,
            customSection,
            customSectionIndex,
            fixedGridCount,
          }) => {
            const hasOverride = !!item.yaml;
            const canRemove = item.type !== 'area' && item.type !== 'floor';
            return html`
              <div>
                <div
                  class="section-order-item ${disabled ? 'disabled' : ''}"
                  data-ws-id=${item.id}
                  draggable="true"
                  @dragstart=${options.onDragStart}
                  @dragend=${options.onDragEnd}
                  @dragover=${options.onDragOver}
                  @dragleave=${options.onDragLeave}
                  @drop=${options.onDrop}
                >
                  <span class="drag-handle" draggable="true">&#x2630;</span>
                  <ha-icon class="section-icon" icon=${icon}></ha-icon>
                  <span class="section-label">${label}</span>
                  ${disabled
                    ? html`<span class="section-hidden-tag">(${localize('editor.section_hidden')})</span>`
                    : nothing}
                  ${hasOverride
                    ? html`<span
                        class="section-hidden-tag"
                        style="background:var(--primary-color);color:#fff;margin-left:4px;"
                        >✎</span
                      >`
                    : nothing}
                  <button
                    class="icon-btn"
                    style="margin-left:auto;"
                    title=${localize('editor.weather_start_block_expand')}
                    @click=${(event: Event) => {
                      event.stopPropagation();
                      options.onToggleExpanded(item.id);
                    }}
                  >
                    <ha-icon icon=${expanded ? 'mdi:chevron-up' : 'mdi:chevron-down'}></ha-icon>
                  </button>
                  ${canRemove
                    ? html`<button
                        class="icon-btn"
                        title=${localize('editor.remove')}
                        @click=${(event: Event) => {
                          event.stopPropagation();
                          options.onRemove(item.id);
                        }}
                      >
                        <ha-icon icon="mdi:delete-outline"></ha-icon>
                      </button>`
                    : nothing}
                </div>
                ${expanded
                  ? html`
                      <div
                        style="padding: 8px 12px 12px 12px; background: var(--secondary-background-color); border-radius: 0 0 8px 8px; margin-bottom: 4px;"
                      >
                        ${customCard ? options.renderCustomCardEditor(customCard, customCardIndex) : nothing}
                        ${customSection
                          ? options.renderCustomSectionEditor(customSection, customSectionIndex)
                          : nothing}
                        ${!customCard && !customSection && item.type === 'summaries'
                          ? html`
                              <label class="form-row" style="margin: 0 0 8px 0;">
                                <span style="min-width: 120px;">${localize('editor.weather_start_summary_size')}</span>
                                <select
                                  style="flex:1;"
                                  .value=${item.summary_size || 'mini'}
                                  @change=${(event: Event) =>
                                    options.onSummarySizeChanged(
                                      item.id,
                                      (event.target as HTMLSelectElement).value as 'mini' | 'normal'
                                    )}
                                >
                                  <option value="mini">${localize('editor.weather_start_summary_size_mini')}</option>
                                  <option value="normal">
                                    ${localize('editor.weather_start_summary_size_normal')}
                                  </option>
                                </select>
                              </label>
                            `
                          : nothing}
                        ${!customCard && !customSection
                          ? html`
                              <label class="form-row" style="margin: 0 0 8px 0;">
                                <input
                                  type="checkbox"
                                  ?checked=${item.stack_with_previous === true}
                                  @change=${(event: Event) =>
                                    options.onStackChanged(item.id, (event.target as HTMLInputElement).checked)}
                                />
                                <span>${localize('editor.weather_start_stack_with_previous')}</span>
                              </label>
                              <div class="description" style="margin: 0 0 6px 0;">
                                ${localize('editor.weather_start_block_yaml_desc')}
                              </div>
                              <textarea
                                rows="6"
                                style="width:100%;box-sizing:border-box;font-family:monospace;font-size:12px;resize:vertical;"
                                placeholder=${localize('editor.yaml_placeholder')}
                                .value=${item.yaml || ''}
                                @change=${(event: Event) =>
                                  options.onYamlChanged(item.id, (event.target as HTMLTextAreaElement).value)}
                              ></textarea>
                              ${item._yaml_error
                                ? html`<div style="color:var(--error-color);font-size:12px;margin-top:4px;">
                                    ${item._yaml_error}
                                  </div>`
                                : nothing}
                              ${fixedGridCount > 0
                                ? html`<div style="color:var(--warning-color,#f0a000);font-size:12px;margin-top:4px;">
                                    ${localize('editor.weather_start_responsive_warning').replace(
                                      '{count}',
                                      String(fixedGridCount)
                                    )}
                                  </div>`
                                : nothing}
                              ${item.parsed_config
                                ? html`<div style="color:var(--success-color,green);font-size:12px;margin-top:4px;">
                                    ${localize('editor.yaml_valid')}
                                  </div>`
                                : nothing}
                              ${hasOverride
                                ? html`<button
                                    class="text-btn"
                                    style="margin-top:8px;"
                                    @click=${() => options.onResetYaml(item.id)}
                                  >
                                    ${localize('editor.weather_start_block_reset')}
                                  </button>`
                                : nothing}
                            `
                          : nothing}
                      </div>
                    `
                  : nothing}
              </div>
            `;
          }
        )}
      </div>
      <div class="description" style="margin: 12px 0 6px 0;">${localize('editor.weather_start_add_content_desc')}</div>
      <div class="custom-item-row weather-start-add-row">
        <button class="btn-primary" @click=${options.onAddCard}>${localize('editor.weather_start_add_card')}</button>
        ${!options.hasSummariesBlock
          ? html`<button class="btn-primary" @click=${options.onAddSummaries}>
              ${localize('editor.weather_start_add_summaries')}
            </button>`
          : nothing}
        <button class="btn-primary" @click=${options.onAddSection}>
          ${localize('editor.weather_start_add_section')}
        </button>
        <select @change=${options.onAddArea}>
          <option value="">${localize('editor.weather_start_add_area')}</option>
          ${options.unplacedAreas.map((area) => html`<option value=${area.area_id}>${area.name}</option>`)}
        </select>
        <select @change=${options.onAddFloor}>
          <option value="">${localize('editor.weather_start_add_floor')}</option>
          ${options.floors.map((floor) => html`<option value=${floor.floor_id || '__none__'}>${floor.name}</option>`)}
        </select>
      </div>
    </div>
  `;
}
