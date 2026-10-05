import yaml from 'js-yaml';
import { html, nothing, type TemplateResult } from 'lit';
import type { CustomCard, CustomSection, Simon42StrategyConfig, WeatherStartLayoutItem } from '../../types/strategy';
import { localize } from '../../utils/localize';
import type { Simon42DashboardStrategyEditor } from '../StrategyEditor';
import { renderWeatherStartOrderPanel } from '../panels/WeatherStartPanel';
type PanelHost = ReturnType<Simon42DashboardStrategyEditor['createWeatherLayoutHost']>;

export function renderWeatherStartCustomCardEditor(host: PanelHost, card: CustomCard, index: number): TemplateResult {
  const validationMsg = card._yaml_error
    ? html`<div style="color: var(--error-color); font-size: 12px; margin-top: 4px;">&#x274C; ${card._yaml_error}</div>`
    : card.yaml
      ? html`<div style="color: var(--success-color, green); font-size: 12px; margin-top: 4px;">
          &#x2705; ${localize('editor.yaml_valid')}
        </div>`
      : nothing;

  return html`
    <label class="form-row" style="margin: 0 0 8px 0;">
      <span style="min-width: 150px;">${localize('editor.card_editor_title_label')}</span>
      <input
        type="text"
        style="flex: 1;"
        .value=${card.editor_title || ''}
        placeholder=${localize('editor.card_editor_title_placeholder')}
        @change=${(e: Event) =>
          host._updateCustomCardField(index, 'editor_title', (e.target as HTMLInputElement).value)}
      />
    </label>
    <div class="description" style="margin: 0 0 8px 0;">${localize('editor.card_editor_title_help')}</div>
    <label class="form-row" style="margin: 0 0 8px 0;">
      <span style="min-width: 150px;">${localize('editor.card_dashboard_title_label')}</span>
      <input
        type="text"
        style="flex: 1;"
        .value=${card.title || ''}
        placeholder=${localize('editor.card_title_placeholder')}
        @change=${(e: Event) => host._updateCustomCardField(index, 'title', (e.target as HTMLInputElement).value)}
      />
    </label>
    <div class="description" style="margin: 0 0 6px 0;">${localize('editor.weather_start_card_yaml_desc')}</div>
    <textarea
      rows="8"
      style="width:100%;box-sizing:border-box;font-family:monospace;font-size:12px;resize:vertical;"
      placeholder=${localize('editor.yaml_placeholder')}
      .value=${card.yaml || ''}
      @change=${(e: Event) => host._updateCustomCardYaml(index, (e.target as HTMLTextAreaElement).value)}
    ></textarea>
    <button class="btn-primary" style="margin-top: 6px;" @click=${() => host._openCardEditorForCustomCard(index)}>
      ${localize('editor.edit_card_with_ha_editor')}
    </button>
    ${validationMsg}
  `;
}

export function renderWeatherStartCustomSectionEditor(
  host: PanelHost,
  section: CustomSection,
  sectionIndex: number
): TemplateResult {
  const cards = section.cards || [];

  return html`
    <div class="custom-item-row" style="margin-bottom: 8px;">
      <input
        type="text"
        .value=${section.title || ''}
        placeholder=${localize('editor.custom_section_title_placeholder')}
        style="flex: 2;"
        @change=${(e: Event) =>
          host._updateCustomSectionField(sectionIndex, 'title', (e.target as HTMLInputElement).value)}
      />
      <input
        type="text"
        .value=${section.icon || ''}
        placeholder=${localize('editor.custom_section_icon_placeholder')}
        style="flex: 1;"
        @change=${(e: Event) =>
          host._updateCustomSectionField(sectionIndex, 'icon', (e.target as HTMLInputElement).value)}
      />
    </div>
    <div class="description" style="margin: 0 0 8px 0;">${localize('editor.weather_start_section_cards_desc')}</div>
    ${cards.length === 0
      ? html`<div class="empty-state">${localize('editor.no_custom_cards')}</div>`
      : cards.map((card, cardIndex) => {
          const validationMsg = card._yaml_error
            ? html`<span style="color: var(--error-color);">&#x274C; ${card._yaml_error}</span>`
            : card.yaml
              ? html`<span style="color: var(--success-color, green);">&#x2705; ${localize('editor.yaml_valid')}</span>`
              : nothing;
          return html`
            <div class="custom-item" style="margin-bottom: 8px;">
              <div class="custom-item-header">
                <strong
                  >${host._getCustomCardEditorLabel(card, `${localize('editor.new_card')} ${cardIndex + 1}`)}</strong
                >
                <button class="btn-remove" @click=${() => host._removeCardFromSection(sectionIndex, cardIndex)}>
                  &#x2715;
                </button>
              </div>
              <div class="custom-item-fields">
                <label>${localize('editor.card_editor_title_label')}</label>
                <input
                  type="text"
                  .value=${card.editor_title || ''}
                  placeholder=${localize('editor.card_editor_title_placeholder')}
                  @change=${(e: Event) =>
                    host._updateSectionCardField(
                      sectionIndex,
                      cardIndex,
                      'editor_title',
                      (e.target as HTMLInputElement).value
                    )}
                />
                <div class="description" style="margin: 0 0 4px 0;">${localize('editor.card_editor_title_help')}</div>
                <label>${localize('editor.card_dashboard_title_label')}</label>
                <input
                  type="text"
                  .value=${card.title || ''}
                  placeholder=${localize('editor.card_title_placeholder')}
                  @change=${(e: Event) =>
                    host._updateSectionCardField(
                      sectionIndex,
                      cardIndex,
                      'title',
                      (e.target as HTMLInputElement).value
                    )}
                />
                <textarea
                  rows="5"
                  placeholder=${localize('editor.yaml_placeholder')}
                  .value=${card.yaml || ''}
                  style="width: 100%;"
                  @change=${(e: Event) =>
                    host._updateSectionCardYaml(sectionIndex, cardIndex, (e.target as HTMLTextAreaElement).value)}
                ></textarea>
                <button
                  class="btn-primary"
                  style="margin-top: 6px;"
                  @click=${() => host._openCardEditorForSectionCard(sectionIndex, cardIndex)}
                >
                  ${localize('editor.edit_card_with_ha_editor')}
                </button>
                <div class="custom-item-validation">${validationMsg}</div>
              </div>
            </div>
          `;
        })}
    <button class="btn-primary" style="margin-top: 4px;" @click=${() => host._openCardPickerForSection(sectionIndex)}>
      ${localize('editor.add_card_to_section')}
    </button>
  `;
}

export function renderWeatherLayout(host: PanelHost): TemplateResult {
  const items = host._getWeatherStartLayoutItems();
  const areas = host._getWeatherStartAreaOptions();
  const floors = host._getWeatherStartFloorOptions();
  const customCards = host._config.custom_cards || [];
  const customSections = host._config.custom_sections || [];
  const hasSummariesBlock = items.some((item) => item.type === 'summaries');
  const placedAreaIds = new Set(
    items.filter((item) => item.type === 'area' && item.area_id).map((item) => item.area_id as string)
  );
  for (const item of items) {
    if (item.type !== 'floor') continue;
    for (const area of areas) {
      if (item.floor_id ? area.floor_id === item.floor_id : !area.floor_id) placedAreaIds.add(area.area_id);
    }
  }
  const unplacedAreas = areas.filter((area) => !placedAreaIds.has(area.area_id));
  let stackRun = 0;
  const hasLongStackChain = items.some((item) => {
    stackRun = item.stack_with_previous ? stackRun + 1 : 0;
    return stackRun >= 2;
  });
  const panelItems = items.map((item) => {
    const meta = host._getWeatherStartItemMeta(item, areas, customCards, customSections);
    const customCardIndex = host._getWeatherStartCustomCardIndex(item, customCards);
    const customSectionIndex = host._getWeatherStartCustomSectionIndex(item, customSections);
    return {
      item,
      ...meta,
      disabled: host._isWeatherStartItemDisabled(item, customCards, customSections),
      expanded: host._expandedWeatherBlocks.has(item.id),
      customCard: customCardIndex >= 0 ? customCards[customCardIndex] : undefined,
      customCardIndex,
      customSection: customSectionIndex >= 0 ? customSections[customSectionIndex] : undefined,
      customSectionIndex,
      fixedGridCount: host._countNestedFixedGrids(item.parsed_config),
    };
  });

  return renderWeatherStartOrderPanel({
    items: panelItems,
    areas,
    floors,
    unplacedAreas,
    hasSummariesBlock,
    hasLongStackChain,
    renderCustomCardEditor: (card, index) => host._renderWeatherStartCustomCardEditor(card, index),
    renderCustomSectionEditor: (section, index) => host._renderWeatherStartCustomSectionEditor(section, index),
    onDragStart: host._handleWeatherStartDragStart,
    onDragEnd: host._handleWeatherStartDragEnd,
    onDragOver: host._handleWeatherStartDragOver,
    onDragLeave: host._handleWeatherStartDragLeave,
    onDrop: host._handleWeatherStartDrop,
    onToggleExpanded: (itemId) => host._toggleWeatherBlockExpanded(itemId),
    onRemove: (itemId) => host._removeWeatherStartItem(itemId),
    onSummarySizeChanged: (itemId, size) => host._weatherStartSummarySizeChanged(itemId, size),
    onStackChanged: (itemId, checked) => host._toggleWeatherStartItemStack(itemId, checked),
    onYamlChanged: (itemId, value) => host._updateWeatherStartItemYaml(itemId, value),
    onResetYaml: (itemId) => host._resetWeatherStartItemYaml(itemId),
    onAddCard: host._openCardPickerForWeatherStartCard,
    onAddSummaries: () => host._addWeatherStartSummaries(),
    onAddSection: () => host._addWeatherStartSection(),
    onAddArea: (event) => host._addWeatherStartArea(event),
    onAddFloor: (event) => host._addWeatherStartFloor(event),
  });
}

export function parseWeatherStartItemYaml(
  _host: PanelHost,
  yamlString: string
): Pick<WeatherStartLayoutItem, 'parsed_config' | '_yaml_error'> {
  const trimmed = yamlString.trim();
  if (!trimmed) return { parsed_config: undefined, _yaml_error: undefined };

  try {
    const raw = yaml.load(trimmed);
    if (Array.isArray(raw)) return { parsed_config: raw as Record<string, any>[] };
    if (raw && typeof raw === 'object') return { parsed_config: raw as Record<string, any> };
    return {
      parsed_config: undefined,
      _yaml_error: 'YAML must be a card, section, view with sections, or list of cards',
    };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message.split('\n')[0] : 'Invalid YAML';
    return { parsed_config: undefined, _yaml_error: message || 'Invalid YAML' };
  }
}
export function updateWeatherStartItemYaml(host: PanelHost, itemId: string, yamlString: string): void {
  const items = host._getWeatherStartLayoutItems().map((item) => {
    if (item.id !== itemId) return item;
    const updated: WeatherStartLayoutItem = { ...item, yaml: yamlString };
    const parsed = host._parseWeatherStartItemYaml(yamlString);
    updated.parsed_config = parsed.parsed_config;
    updated._yaml_error = parsed._yaml_error;
    if (!yamlString.trim()) {
      delete updated.yaml;
      delete updated.parsed_config;
      delete updated._yaml_error;
    }
    return updated;
  });
  const invalidItem = items.find((item) => item.id === itemId && item._yaml_error);
  if (invalidItem) {
    host._config = { ...host._config, weather_start_layout_items: items };
    host.requestUpdate();
    return;
  }
  host._saveWeatherStartLayoutItems(items);
}
export function resetWeatherStartItemYaml(host: PanelHost, itemId: string): void {
  const items = host._getWeatherStartLayoutItems().map((item) => {
    if (item.id !== itemId) return item;
    const updated = { ...item };
    delete updated.yaml;
    delete updated.parsed_config;
    delete updated._yaml_error;
    return updated;
  });
  host._saveWeatherStartLayoutItems(items);
}
export function saveWeatherStartLayoutItems(host: PanelHost, items: WeatherStartLayoutItem[]): void {
  const normalizedItems = host._normalizeWeatherStartLayoutItems(items);
  const newConfig: Simon42StrategyConfig = {
    ...host._config,
    weather_start_layout_items: normalizedItems,
  };
  host._config = newConfig;
  host._fireConfigChanged(newConfig);
}
