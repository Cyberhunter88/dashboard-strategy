import { preloadYaml, requireYaml, withParsedYaml, withYaml } from './editor-yaml';
import {
  getAdditionalBadgesForArea,
  getBadgeNamesConfig,
  getDefaultShowNameEntities,
  getEntityOrdersForArea,
  getHiddenEntitiesForArea,
  setAreaNavPinned,
  setAreaOrder,
  setAreaVisible,
  setBadgeAdditional,
  setBadgeShowName,
  setGroupEntitiesVisible,
  setGroupEntityVisible,
  updateAreaOptions,
} from './area-options-config';
import {
  cardPickerYamlChanged,
  closeCardPicker,
  confirmCardPicker,
  getEditableAreaCardConfig,
  getEditableYamlCardConfig,
  openCardPicker,
  renderCardEditor,
  renderCardPickerOverlay,
  renderCardTypePicker,
  selectCardType,
  tryMountVisualCardEditor,
} from './panels/CardPickerPanel';
import {
  renderAreaCustomCardItem,
  renderAreaCustomCardsSection,
  renderAreaDisplayTypeOverride,
  renderAreaEntities,
  renderAreaItems,
  renderAreaViewOverride,
  renderBadgeGroup,
  updateAreaViewOverride,
} from './panels/RoomOptionsPanel';
import { type RefDashboardOption } from './panels/CustomViewsPanel';
import {
  parseWeatherStartItemYaml,
  renderWeatherLayout,
  renderWeatherStartCustomCardEditor,
  renderWeatherStartCustomSectionEditor,
  resetWeatherStartItemYaml,
  saveWeatherStartLayoutItems,
  updateWeatherStartItemYaml,
} from './panels/WeatherLayoutPanel';
// ====================================================================
// SIMON42 DASHBOARD STRATEGY - EDITOR (LitElement)
// ====================================================================
// LitElement editor host with focused rendering panels under ./panels.
// ====================================================================

import { getOptionDefault } from '../utils/option-metadata';
import { html, LitElement, nothing, type TemplateResult } from 'lit';
import { hasHassPresentationChanged } from '../utils/card-element-utils';
import { timeEnd, timeStart } from '../utils/debug';
import { ConfigDiagnostics, isRestrictedEntity, isSelectableEntity } from './config-diagnostics';
import { haveEntityOptionSourcesChanged } from './entity-option-cache';

import type { HomeAssistant } from '../types/homeassistant';
import type { AreaRegistryEntry } from '../types/registries';
import type {
  AreaCustomCard,
  AreaDisplayType,
  AreasDisplay,
  CustomBadge,
  CustomCard,
  CustomSection,
  CustomView,
  Simon42StrategyConfig,
  StackKey,
  WeatherStartLayoutItem,
} from '../types/strategy';
import { DEFAULT_STACKS_ORDER } from '../types/strategy';
import {
  createRoomEntities,
  findUpsEntityGroups,
  getAreaBadgeCandidates,
  getAvailableBadgeEntities,
  getEditableAreaEntities,
} from '../utils/area-entity-utils';
import { isDefaultShowName } from '../utils/badge-utils';
import { getEffectiveDeviceAreaId } from '../utils/device-utils';
import { loadLanguage, localize, onLanguageLoaded } from '../utils/localize';
import './editor-translations';
import { formatEntityDisplayName, mergeStacksOrder, normalizeAreasDisplay } from '../utils/name-utils';
import { normalizeStrategyConfig } from '../utils/strategy-config';
import { withEnabledOptionalBlocks } from '../utils/weather-start-defaults';
import { setAreaDisplayTypeOverride, setGlobalAreaDisplayType } from './area-display-options';
import { stripLegacyAreaWebrtcCameras, stripLegacyOverviewLayoutConfig } from './editor-config-utils';
import { dispatchStrategyConfigChanged } from './editor-host';
import { editorPanelMeta, EDITOR_NAV_GROUPS, type EditorPanelKey } from './editor-panel-registry';
import { searchOptions } from './option-search';
import { strategyEditorStyles } from './editor-styles';
import { renderAreaOptionsPanel } from './panels/AreaOptionsPanel';
import { renderCustomContentPanel, type CustomContentPanelHost } from './panels/CustomContentPanel';
import { renderFavoritesSection, renderRoomPinsSection } from './panels/EntityListPanel';
import {
  renderAdvancedOptionsSection,
  renderBasicOverviewSection,
  renderOverviewDetailsSection,
  renderOverviewSectionsPanel,
} from './panels/OverviewPanel';
import { renderBasicSummariesSection, renderSummaryDetailsSection } from './panels/SummariesPanel';
import type { EntityListState, EntitySelectOption, OptionPanelHost } from './panels/option-panel-host';
import { renderViewsPanel } from './panels/ViewsPanel';
import { moveVisibleStack, presentStackKeys, renderRoomStackOrderPanel } from './panels/RoomStackOrderPanel';
import { renderRoomVisibilityPanel, renderUserVisibilityPanel } from './panels/VisibilityPanels';
import { type WeatherStartFloorOption } from './panels/WeatherStartPanel';
import { createDragSortHandlers, moveKey } from './drag-sort';
import {
  buildLegacyWeatherStartLayoutItems,
  computeWeatherStartAreaOptions,
  computeWeatherStartFloorOptions,
  countNestedFixedGrids,
  getCustomCardEditorLabel,
  getCustomCardRef,
  getCustomSectionRef,
  getSectionLabelKey,
  getWeatherStartItemMeta,
  isWeatherStartItemDisabled,
  normalizeWeatherStartLayoutItems,
} from './weather-start-layout';
import { loadExpandedPanels, openPanel, renderCollapsiblePanel } from './panels/panel-shell';

// -- Supporting types for the editor ------------------------------------

declare global {
  interface Window {
    customCards?: Array<{ type: string; name: string; description: string }>;
    cardTools?: unknown;
  }
}

// ====================================================================
// Editor Class
// ====================================================================

export class Simon42DashboardStrategyEditor extends LitElement {
  static properties = {
    _config: { state: true },
    _expandedAreas: { state: true },
    _expandedGroups: { state: true },
    _expandedWeatherBlocks: { state: true },
    _cardPickerOpen: { state: true },
    _cardPickerStep: { state: true },
    _cardPickerSearch: { state: true },
    _optionSearch: { state: true },
    _showChangedOnly: { state: true },
    _cardPickerSelectedType: { state: true },
    _cardPickerYaml: { state: true },
    _cardPickerHasVisualEditor: { state: true },
  };

  // hass is set externally by HA — use a setter, not a Lit property
  _hass: HomeAssistant | null = null;
  private _isUpdatingConfig = false;

  _config: Simon42StrategyConfig = {};
  _expandedAreas = new Set<string>();
  _expandedGroups = new Map<string, Set<string>>();
  _expandedWeatherBlocks = new Set<string>();

  // Entity list search/drag state (NOT @state — panels call requestUpdate manually)
  private readonly _entityListState: EntityListState = { search: {}, draggedId: null };
  _expandedPanels = loadExpandedPanels();
  private _diagnosticsChecked = false;
  private _optionSearch = '';
  private _showChangedOnly = false;
  private readonly _diagnostics = new ConfigDiagnostics();
  private _openingMeasured = false;
  // Cache for loaded area entities (avoid re-fetching on every render)
  private _areaEntitiesCache = new Map<
    string,
    {
      groupedEntities: Record<string, string[]>;
      hiddenEntities: Record<string, string[]>;
      entityOrders: Record<string, string[]>;
      badgeCandidates: string[];
      additionalBadges: string[];
      availableEntities: Array<{ entity_id: string; name: string }>;
      defaultShowNames: Set<string>;
      namesVisible: string[];
      namesHidden: string[];
    }
  >();
  private _entitySelectOptionsCache: {
    config: Simon42StrategyConfig;
    entities: HomeAssistant['entities'];
    devices: HomeAssistant['devices'];
    states: HomeAssistant['states'];
    options: EntitySelectOption[];
  } | null = null;
  private _weatherStartAreaOptionsCache: {
    areas: HomeAssistant['areas'];
    hiddenKey: string;
    orderKey: string;
    options: AreaRegistryEntry[];
  } | null = null;
  private _weatherStartFloorOptionsCache: {
    floors: HomeAssistant['floors'];
    areas: AreaRegistryEntry[];
    options: WeatherStartFloorOption[];
  } | null = null;
  private _sortedAreasCache: {
    areas: HomeAssistant['areas'];
    options: AreaRegistryEntry[];
  } | null = null;
  private _refDashboards: RefDashboardOption[] | null = null;
  private _refDashboardsLoading = false;

  // Drag state (not reactive — no render needed)

  // Card picker state (reactive via static properties)
  _cardPickerOpen = false;
  _cardPickerStep: 'type' | 'editor' = 'type';
  _cardPickerSearch = '';
  _cardPickerSelectedType = '';
  _cardPickerYaml = '';
  _cardPickerHasVisualEditor = false;
  private _cardPickerCallback: ((config: Record<string, any>) => void) | null = null;
  private _cardPickerConfig: Record<string, any> | null = null;

  // -- Lifecycle --------------------------------------------------------

  private _unsubscribeLanguage?: () => void;

  override connectedCallback(): void {
    super.connectedCallback();
    timeStart('editor-open');
    this._openingMeasured = false;
    this._unsubscribeLanguage = onLanguageLoaded(() => this.requestUpdate());
    // js-yaml is its own chunk; fetch it in the background so YAML actions run instantly.
    void preloadYaml().catch(() => undefined);
  }

  override disconnectedCallback(): void {
    this._unsubscribeLanguage?.();
    this._unsubscribeLanguage = undefined;
    super.disconnectedCallback();
  }

  set hass(hass: HomeAssistant) {
    const oldHass = this._hass;
    this._hass = hass;
    if (!oldHass || oldHass.language !== hass.language || oldHass.locale !== hass.locale) void loadLanguage(hass);
    if (
      oldHass &&
      (oldHass.entities !== hass.entities ||
        oldHass.devices !== hass.devices ||
        oldHass.language !== hass.language ||
        oldHass.locale !== hass.locale)
    ) {
      this._entitySelectOptionsCache = null;
    }
    if (oldHass && (oldHass.areas !== hass.areas || oldHass.floors !== hass.floors)) {
      this._weatherStartAreaOptionsCache = null;
      this._weatherStartFloorOptionsCache = null;
      this._sortedAreasCache = null;
    }
    if (oldHass && hasHassPresentationChanged(oldHass, hass)) {
      this._areaEntitiesCache.clear();
      for (const id of this._expandedAreas) void this._loadAreaEntities(id);
    }
    const visualEditor = this.shadowRoot?.querySelector('.card-editor-visual-host') as
      (HTMLElement & { hass?: HomeAssistant }) | null;
    if (visualEditor?.firstElementChild)
      (visualEditor.firstElementChild as HTMLElement & { hass?: HomeAssistant }).hass = hass;
    if (hasHassPresentationChanged(oldHass ?? undefined, hass) || this._expandedPanels.has('diagnostics'))
      this.requestUpdate();
  }

  setConfig(config: Simon42StrategyConfig): void {
    if (this._isUpdatingConfig) return;
    config = normalizeStrategyConfig(config);
    if (
      this._config.areas_display?.hidden !== config.areas_display?.hidden ||
      this._config.areas_display?.order !== config.areas_display?.order ||
      this._config.areas_display?.nav_items !== config.areas_display?.nav_items
    ) {
      this._invalidateWeatherStartOptionsCaches();
    }
    this._config = config;
    this._entitySelectOptionsCache = null;
  }

  private _invalidateWeatherStartOptionsCaches(): void {
    this._weatherStartAreaOptionsCache = null;
    this._weatherStartFloorOptionsCache = null;
  }

  // -- Entity helpers ---------------------------------------------------

  private _getAllEntitiesForSelect(): EntitySelectOption[] {
    if (!this._hass) return [];
    if (
      this._entitySelectOptionsCache &&
      this._entitySelectOptionsCache.config === this._config &&
      this._entitySelectOptionsCache.entities === this._hass.entities &&
      this._entitySelectOptionsCache.devices === this._hass.devices &&
      !haveEntityOptionSourcesChanged(this._entitySelectOptionsCache.states, this._hass.states)
    ) {
      this._entitySelectOptionsCache.states = this._hass.states;
      return this._entitySelectOptionsCache.options;
    }

    const entityMap = this._hass.entities || {};
    const devices = Object.values(this._hass.devices || {});

    // Build device-to-area lookup
    const devicesById = new Map(devices.map((device) => [device.id, device]));
    const deviceAreaMap = new Map<string, string>();
    devices.forEach((device) => {
      const areaId = getEffectiveDeviceAreaId(device, (id) => devicesById.get(id));
      if (areaId) deviceAreaMap.set(device.id, areaId);
    });

    const hass = this._hass;
    const selected = new Set(this._diagnostics.analyze(this._config).references.map((ref) => ref.entityId));
    const options = [...new Set([...Object.keys(hass.states), ...selected])]
      .filter((id) => isSelectableEntity(hass, id, selected))
      .map((entityId) => {
        const entity = entityMap[entityId];

        let areaId = entity?.area_id;
        if (!areaId && entity?.device_id) {
          areaId = deviceAreaMap.get(entity.device_id) ?? null;
        }

        return {
          entity_id: entityId,
          name:
            formatEntityDisplayName(entityId, hass) +
            (isRestrictedEntity(hass, entityId) ? ` (${localize('editor.entity_existing_restricted')})` : ''),
          area_id: areaId,
          device_area_id: areaId,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
    this._entitySelectOptionsCache = {
      config: this._config,
      entities: this._hass.entities,
      devices: this._hass.devices,
      states: this._hass.states,
      options,
    };
    return options;
  }

  _getSortedAreas(): AreaRegistryEntry[] {
    if (!this._hass) return [];
    if (this._sortedAreasCache?.areas === this._hass.areas) {
      return this._sortedAreasCache.options;
    }

    const options = Object.values(this._hass.areas).sort((a, b) => a.name.localeCompare(b.name));
    this._sortedAreasCache = { areas: this._hass.areas, options };
    return options;
  }

  private _getNormalizedAreasDisplay(config: Simon42StrategyConfig = this._config): AreasDisplay | undefined {
    if (!this._hass) return config.areas_display;
    return normalizeAreasDisplay(Object.values(this._hass.areas), config.areas_display);
  }

  private _getFilteredEntities(query: string, filterWithArea = false): EntitySelectOption[] {
    if (!this._hass || query.length < 2) return [];
    const q = query.toLowerCase();
    const all = this._getAllEntitiesForSelect();
    const filtered = all.filter((entity) => {
      if (filterWithArea && !entity.area_id && !entity.device_area_id) return false;
      return entity.name.toLowerCase().includes(q) || entity.entity_id.toLowerCase().includes(q);
    });
    // Prioritize: exact match > starts-with > contains
    filtered.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      const aId = a.entity_id.toLowerCase();
      const bId = b.entity_id.toLowerCase();
      const aExact = aName === q || aId === q;
      const bExact = bName === q || bId === q;
      if (aExact !== bExact) return aExact ? -1 : 1;
      const aStarts = aName.startsWith(q) || aId.startsWith(q) || aId.split('.')[1]?.startsWith(q);
      const bStarts = bName.startsWith(q) || bId.startsWith(q) || bId.split('.')[1]?.startsWith(q);
      if (aStarts !== bStarts) return aStarts ? -1 : 1;
      return aName.localeCompare(bName);
    });
    return filtered.slice(0, 21);
  }

  // -- Styles -----------------------------------------------------------

  static styles = strategyEditorStyles;

  // -- Main render ------------------------------------------------------

  protected render() {
    if (!this._hass) return nothing;
    const options = this._optionPanelHost;

    return html`
      <div class="card-config">
        ${this._renderPanelNavigation()} ${this._renderOptionSearch()}
        ${renderCollapsiblePanel(
          this,
          { key: 'diagnostics', icon: 'mdi:clipboard-check-outline', label: localize('editor.diagnostics_title') },
          () => this._renderDiagnostics()
        )}
        ${renderCollapsiblePanel(this, editorPanelMeta('overview'), () => renderBasicOverviewSection(options))}
        ${renderCollapsiblePanel(this, editorPanelMeta('summaries'), () => renderBasicSummariesSection(options))}
        ${renderCollapsiblePanel(this, editorPanelMeta('overviewSections'), () => renderOverviewSectionsPanel(options))}
        ${renderCollapsiblePanel(this, editorPanelMeta('favorites'), () => renderFavoritesSection(options))}

        <div class="section-divider">
          <div class="section-divider-title">${localize('editor.section_areas_rooms')}</div>
        </div>

        ${renderCollapsiblePanel(this, editorPanelMeta('areas'), () => this._renderAreasListSection())}
        ${renderCollapsiblePanel(this, editorPanelMeta('areaOptions'), () => this._renderAreasSection())}
        ${renderCollapsiblePanel(this, editorPanelMeta('roomPins'), () => renderRoomPinsSection(options))}
        ${renderCollapsiblePanel(this, editorPanelMeta('views'), () => this._renderViewsSection())}

        <div class="section-divider">
          <div class="section-divider-title">${localize('editor.section_advanced')}</div>
        </div>
        ${renderCollapsiblePanel(this, editorPanelMeta('appearance'), () => renderOverviewDetailsSection(options))}
        ${renderCollapsiblePanel(this, editorPanelMeta('details'), () => renderSummaryDetailsSection(options))}
        ${renderCollapsiblePanel(this, editorPanelMeta('sectionOrder'), () => this._renderWeatherStartOrderPanel())}
        ${renderCollapsiblePanel(this, editorPanelMeta('advanced'), () => renderAdvancedOptionsSection(options))}
        ${renderCollapsiblePanel(this, editorPanelMeta('customContent'), () => this._renderCustomContentSection())}
      </div>
      ${this._cardPickerOpen ? this._renderCardPickerOverlay() : nothing}
    `;
  }

  // ====================================================================
  // SECTION RENDERERS
  // ====================================================================

  // -- Section order panel -----------------------------------------------

  private _renderPanelNavigation(): TemplateResult {
    return html`<nav class="panel-navigation" aria-label=${localize('editor.panel_navigation')}>
      <label for="panel-navigation-select">${localize('editor.panel_navigation')}</label>
      <select
        id="panel-navigation-select"
        @change=${(event: Event) => {
          const select = event.target as HTMLSelectElement;
          const key = select.value as EditorPanelKey;
          select.value = '';
          if (key) void this._jumpToPanel(key);
        }}
      >
        <option value="">${localize('editor.panel_navigation')}</option>
        ${EDITOR_NAV_GROUPS.map(
          (group) =>
            html`<optgroup label=${localize(group.labelKey)}>
              ${group.panels.map((key) => html`<option value=${key}>${editorPanelMeta(key).label}</option>`)}
            </optgroup>`
        )}
      </select>
    </nav>`;
  }

  private _renderOptionSearch(): TemplateResult {
    const query = this._optionSearch.trim();
    const active = query !== '' || this._showChangedOnly;
    const results = active ? searchOptions(this._config, query, this._showChangedOnly) : [];
    return html`<section class="option-search" aria-label=${localize('editor.search_options')}>
      <input
        type="search"
        class="option-search-input"
        .value=${this._optionSearch}
        placeholder=${localize('editor.search_options_placeholder')}
        aria-label=${localize('editor.search_options')}
        @input=${(event: Event) => {
          this._optionSearch = (event.target as HTMLInputElement).value;
        }}
      />
      ${this._renderCheckbox(
        'option-search-changed',
        localize('editor.show_changed_only'),
        this._showChangedOnly,
        (checked) => {
          this._showChangedOnly = checked;
        }
      )}
      <div role="status" aria-live="polite">
        ${
          active && !results.length
            ? html`<p class="description">${localize(query ? 'editor.no_results' : 'editor.no_changed_options')}</p>`
            : nothing
        }
      </div>
      ${
        results.length
          ? html`<ul class="option-search-results">
              ${results.map(
                (result) =>
                  html`<li>
                    <button
                      type="button"
                      class="option-search-result"
                      ?disabled=${!result.panel}
                      @click=${() => {
                        if (result.panel) void this._jumpToPanel(result.panel);
                      }}
                    >
                      <span>${result.label}</span>
                      <span class="option-search-meta"
                        >${result.panelLabel || localize('editor.search_yaml_only')} · <code>${result.key}</code></span
                      >
                    </button>
                  </li>`
              )}
            </ul>`
          : nothing
      }
    </section>`;
  }

  private async _jumpToPanel(key: EditorPanelKey): Promise<void> {
    const panel = editorPanelMeta(key);
    openPanel(this, panel.key);
    await this.updateComplete;
    const header = this.shadowRoot?.querySelector<HTMLElement>(`[data-panel-key="${panel.key}"] .panel-header`);
    header?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    header?.focus({ preventScroll: true });
  }

  private async _openDiagnosticLocation(path: string): Promise<void> {
    const key = path.startsWith('areas_')
      ? 'areaOptions'
      : path.startsWith('room_pin')
        ? 'roomPins'
        : path.startsWith('weather_start')
          ? 'sectionOrder'
          : path.startsWith('custom_')
            ? 'customContent'
            : path.includes('favorite') || path.startsWith('quick_action')
              ? 'favorites'
              : 'overview';
    const panel = editorPanelMeta(key);
    this._expandedPanels.add(panel.key);
    const areaId = path.startsWith('areas_options.') ? path.split('.')[1] : undefined;
    if (areaId) {
      this._expandedAreas = new Set([...this._expandedAreas, areaId]);
      if (!this._areaEntitiesCache.has(areaId)) void this._loadAreaEntities(areaId);
    }
    this.requestUpdate();
    await this.updateComplete;
    const header = [...(this.shadowRoot?.querySelectorAll('.panel-header') ?? [])].find((element) =>
      element.textContent?.includes(panel.label)
    );
    const area = areaId
      ? [...(this.shadowRoot?.querySelectorAll<HTMLElement>('.area-item') ?? [])].find(
          (element) => element.dataset.areaId === areaId
        )
      : undefined;
    (area ?? header)?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    if (areaId && path.includes('view_override')) area?.querySelector('textarea')?.focus();
  }

  private _renderDiagnostics(): TemplateResult {
    const issues = this._diagnosticsChecked && this._hass ? this._diagnostics.inspect(this._config, this._hass) : [];
    return html`
      <p>${localize('editor.diagnostics_help')}</p>
      <button
        type="button"
        @click=${() =>
          // The check also reads entity references inside YAML blocks.
          withYaml(() => {
            this._diagnosticsChecked = true;
            this.requestUpdate();
          })}
      >
        ${localize('editor.diagnostics_check')}
      </button>
      <div role="status" aria-live="polite">
        ${this._diagnosticsChecked && !issues.length ? html`<p>${localize('editor.diagnostics_ok')}</p>` : nothing}
      </div>
      ${(['error', 'warning', 'info'] as const).map(
        (severity) =>
          html` ${
            issues.some((issue) => issue.severity === severity)
              ? html`<h3>${localize('editor.diagnostics_severity_' + severity)}</h3>`
              : nothing
          }
          ${issues
            .filter((issue) => issue.severity === severity)
            .map(
              (issue) =>
                html`<div class="custom-item" style="overflow-wrap:anywhere">
                  <strong>${localize('editor.diagnostics_' + (issue.status ?? issue.code))}</strong>${
                    issue.entityId ? html`: ${issue.entityId}` : nothing
                  }
                  <div>${issue.path}</div>
                  <button type="button" @click=${() => void this._openDiagnosticLocation(issue.path)}>
                    ${localize('editor.diagnostics_open')}
                  </button>
                </div>`
            )}`
      )}
    `;
  }

  // -- Weather-start block order panel -----------------------------------

  private _createWeatherStartItemId(prefix: string): string {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  private _getWeatherStartAreaOptions(): AreaRegistryEntry[] {
    if (!this._hass) return [];
    const normalizedAreasDisplay = this._getNormalizedAreasDisplay();
    const hiddenList = normalizedAreasDisplay?.hidden || [];
    const order = normalizedAreasDisplay?.order || [];
    const hiddenKey = hiddenList.join('\u0000');
    const orderKey = order.join('\u0000');
    if (
      this._weatherStartAreaOptionsCache &&
      this._weatherStartAreaOptionsCache.areas === this._hass.areas &&
      this._weatherStartAreaOptionsCache.hiddenKey === hiddenKey &&
      this._weatherStartAreaOptionsCache.orderKey === orderKey
    ) {
      return this._weatherStartAreaOptionsCache.options;
    }

    const options = computeWeatherStartAreaOptions(this._hass.areas, hiddenList, order);
    this._weatherStartAreaOptionsCache = {
      areas: this._hass.areas,
      hiddenKey,
      orderKey,
      options,
    };
    return options;
  }

  private _getWeatherStartFloorOptions(): WeatherStartFloorOption[] {
    if (!this._hass) return [];
    const areas = this._getWeatherStartAreaOptions();
    if (
      this._weatherStartFloorOptionsCache &&
      this._weatherStartFloorOptionsCache.floors === this._hass.floors &&
      this._weatherStartFloorOptionsCache.areas === areas
    ) {
      return this._weatherStartFloorOptionsCache.options;
    }

    const floors = computeWeatherStartFloorOptions(this._hass.floors, areas);

    this._weatherStartFloorOptionsCache = {
      floors: this._hass.floors,
      areas,
      options: floors,
    };
    return floors;
  }

  private _getCustomCardRef(card: CustomCard, index: number): string {
    return getCustomCardRef(card, index);
  }

  private _getCustomSectionRef(section: CustomSection, index: number): string {
    return getCustomSectionRef(section, index);
  }

  private _getCustomCardEditorLabel(card: CustomCard | AreaCustomCard | undefined, fallback: string): string {
    return getCustomCardEditorLabel(card, fallback);
  }

  private _normalizeWeatherStartLayoutItems(items: WeatherStartLayoutItem[]): WeatherStartLayoutItem[] {
    return normalizeWeatherStartLayoutItems(
      items,
      this._config,
      this._getWeatherStartAreaOptions(),
      this._getWeatherStartFloorOptions()
    );
  }

  private _getWeatherStartLayoutItems(): WeatherStartLayoutItem[] {
    const items = this._config.weather_start_layout_items?.length
      ? this._config.weather_start_layout_items.map((item) => ({ ...item }))
      : buildLegacyWeatherStartLayoutItems(
          this._config,
          this._getWeatherStartAreaOptions(),
          this._getWeatherStartFloorOptions()
        );

    return this._normalizeWeatherStartLayoutItems(withEnabledOptionalBlocks(items, this._config));
  }

  private _saveWeatherStartLayoutItems(items: WeatherStartLayoutItem[]): void {
    return saveWeatherStartLayoutItems(this._weatherLayoutHost, items);
  }

  private _toggleWeatherBlockExpanded(key: string): void {
    const expanded = new Set(this._expandedWeatherBlocks);
    if (expanded.has(key)) {
      expanded.delete(key);
    } else {
      expanded.add(key);
    }
    this._expandedWeatherBlocks = expanded;
  }

  private _parseWeatherStartItemYaml(
    yamlString: string
  ): Pick<WeatherStartLayoutItem, 'parsed_config' | '_yaml_error'> {
    return parseWeatherStartItemYaml(this._weatherLayoutHost, yamlString);
  }

  private _updateWeatherStartItemYaml(itemId: string, yamlString: string): void {
    return updateWeatherStartItemYaml(this._weatherLayoutHost, itemId, yamlString);
  }

  private _resetWeatherStartItemYaml(itemId: string): void {
    return resetWeatherStartItemYaml(this._weatherLayoutHost, itemId);
  }

  private _getWeatherStartCustomCardIndex(
    item: WeatherStartLayoutItem,
    customCards: CustomCard[] = this._config.custom_cards || []
  ): number {
    if (item.type !== 'custom_card') return -1;
    return customCards.findIndex((entry, index) => this._getCustomCardRef(entry, index) === item.custom_card_id);
  }

  private _getWeatherStartCustomSectionIndex(
    item: WeatherStartLayoutItem,
    customSections: CustomSection[] = this._config.custom_sections || []
  ): number {
    if (item.type !== 'custom_section') return -1;
    return customSections.findIndex(
      (entry, index) => this._getCustomSectionRef(entry, index) === item.custom_section_id
    );
  }

  private _renderWeatherStartCustomCardEditor(card: CustomCard, index: number): TemplateResult {
    return renderWeatherStartCustomCardEditor(this._weatherLayoutHost, card, index);
  }

  private _renderWeatherStartCustomSectionEditor(section: CustomSection, sectionIndex: number): TemplateResult {
    return renderWeatherStartCustomSectionEditor(this._weatherLayoutHost, section, sectionIndex);
  }

  private _removeWeatherStartItem(itemId: string): void {
    const items = this._getWeatherStartLayoutItems();
    const item = items.find((entry) => entry.id === itemId);
    const remainingItems = items.filter((entry) => entry.id !== itemId);

    if (!item) {
      this._saveWeatherStartLayoutItems(remainingItems);
      return;
    }

    if (item.type === 'custom_card') {
      const customCards = [...(this._config.custom_cards || [])];
      const cardIndex = this._getWeatherStartCustomCardIndex(item, customCards);
      if (cardIndex >= 0) customCards.splice(cardIndex, 1);
      const newConfig: Simon42StrategyConfig = { ...this._config, weather_start_layout_items: remainingItems };
      if (customCards.length > 0) newConfig.custom_cards = customCards;
      else delete newConfig.custom_cards;
      this._config = newConfig;
      this._fireConfigChanged(newConfig);
      return;
    }

    if (item.type === 'custom_section') {
      const customSections = [...(this._config.custom_sections || [])];
      const sectionIndex = this._getWeatherStartCustomSectionIndex(item, customSections);
      if (sectionIndex >= 0) customSections.splice(sectionIndex, 1);
      const newConfig: Simon42StrategyConfig = { ...this._config, weather_start_layout_items: remainingItems };
      if (customSections.length > 0) newConfig.custom_sections = customSections;
      else delete newConfig.custom_sections;
      this._config = newConfig;
      this._fireConfigChanged(newConfig);
      return;
    }

    this._saveWeatherStartLayoutItems(remainingItems);
  }

  private _addWeatherStartSummaries(): void {
    const items = this._getWeatherStartLayoutItems();
    if (items.some((item) => item.type === 'summaries')) return;
    items.push({ id: this._createWeatherStartItemId('summaries'), type: 'summaries', summary_size: 'mini' });
    this._saveWeatherStartLayoutItems(items);
    this._expandedWeatherBlocks = new Set([...this._expandedWeatherBlocks, items[items.length - 1].id]);
  }

  private _addWeatherStartArea(e: Event): void {
    const areaId = (e.target as HTMLSelectElement).value;
    if (!areaId) return;
    const items = this._getWeatherStartLayoutItems();
    items.push({ id: this._createWeatherStartItemId(`area-${areaId}`), type: 'area', area_id: areaId });
    this._saveWeatherStartLayoutItems(items);
    (e.target as HTMLSelectElement).value = '';
  }

  private _addWeatherStartFloor(e: Event): void {
    const value = (e.target as HTMLSelectElement).value;
    if (!value) return;
    const floorId = value === '__none__' ? null : value;
    const floor = this._getWeatherStartFloorOptions().find((entry) => entry.floor_id === floorId);
    const items = this._getWeatherStartLayoutItems();
    items.push({
      id: this._createWeatherStartItemId(`floor-${floorId || 'none'}`),
      type: 'floor',
      floor_id: floorId,
      title: floor?.name,
    });
    this._saveWeatherStartLayoutItems(items);
    (e.target as HTMLSelectElement).value = '';
  }

  private _toggleWeatherStartItemStack(itemId: string, stackWithPrevious: boolean): void {
    const items = this._getWeatherStartLayoutItems().map((item) => {
      if (item.id !== itemId) return item;
      const updated = { ...item };
      if (stackWithPrevious) updated.stack_with_previous = true;
      else delete updated.stack_with_previous;
      return updated;
    });
    this._saveWeatherStartLayoutItems(items);
  }

  private _weatherStartTitleChanged(itemId: string, title: string): void {
    const trimmed = title.trim();
    const items = this._getWeatherStartLayoutItems().map((item) => {
      if (item.id !== itemId) return item;
      const updated = { ...item };
      if (trimmed) updated.title = trimmed;
      else delete updated.title;
      return updated;
    });
    this._saveWeatherStartLayoutItems(items);
  }

  private _weatherStartSummarySizeChanged(itemId: string, size: 'mini' | 'normal'): void {
    const items = this._getWeatherStartLayoutItems().map((item) => {
      if (item.id !== itemId) return item;
      return { ...item, summary_size: size };
    });
    this._saveWeatherStartLayoutItems(items);
  }

  private _addWeatherStartSection(): void {
    const id = this._createWeatherStartItemId('section');
    const customSections: CustomSection[] = [
      ...(this._config.custom_sections || []),
      { id, title: '', icon: '', cards: [] },
    ];
    const items = [
      ...this._getWeatherStartLayoutItems(),
      { id: `custom-section-${id}`, type: 'custom_section', custom_section_id: id } as WeatherStartLayoutItem,
    ];
    const newConfig: Simon42StrategyConfig = {
      ...this._config,
      custom_sections: customSections,
      weather_start_layout_items: items,
    };
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
    this._expandedWeatherBlocks = new Set([...this._expandedWeatherBlocks, `custom-section-${id}`]);
  }

  private _openCardPickerForWeatherStartCard = (): void => {
    this._openCardPicker((config) => {
      const id = this._createWeatherStartItemId('card');
      const yamlStr = requireYaml().dump(config).trim();
      const customCards: CustomCard[] = [
        ...(this._config.custom_cards || []),
        { id, editor_title: '', yaml: yamlStr, parsed_config: config },
      ];
      const items = [
        ...this._getWeatherStartLayoutItems(),
        { id: `custom-card-${id}`, type: 'custom_card', custom_card_id: id } as WeatherStartLayoutItem,
      ];
      const newConfig: Simon42StrategyConfig = {
        ...this._config,
        custom_cards: customCards,
        weather_start_layout_items: items,
      };
      this._config = newConfig;
      this._fireConfigChanged(newConfig);
      this._expandedWeatherBlocks = new Set([...this._expandedWeatherBlocks, `custom-card-${id}`]);
    });
  };

  private _getWeatherStartItemMeta(
    item: WeatherStartLayoutItem,
    areas: AreaRegistryEntry[],
    customCards: CustomCard[],
    customSections: CustomSection[]
  ): { icon: string; label: string } {
    return getWeatherStartItemMeta(item, areas, this._getWeatherStartFloorOptions(), customCards, customSections);
  }

  private _isWeatherStartItemDisabled(
    item: WeatherStartLayoutItem,
    customCards: CustomCard[],
    customSections: CustomSection[]
  ): boolean {
    return isWeatherStartItemDisabled(
      item,
      this._config,
      this._getWeatherStartAreaOptions(),
      customCards,
      customSections
    );
  }

  private _countNestedFixedGrids(value: unknown, depth = 0): number {
    return countNestedFixedGrids(value, depth);
  }

  private _renderWeatherStartOrderPanel(): TemplateResult {
    return renderWeatherLayout(this._weatherLayoutHost);
  }
  // -- Weather-start block order drag & drop -----------------------------

  private readonly _weatherStartDragSort = createDragSortHandlers({
    itemSelector: '.section-order-item',
    keyOf: (item) => item.dataset.wsId,
    clearScope: () => this.shadowRoot?.querySelector('#weather-start-order-list'),
    onReorder: (draggedId, dropId) => {
      const newOrder = moveKey(this._getWeatherStartLayoutItems(), (item) => item.id, draggedId, dropId);
      if (newOrder) this._saveWeatherStartLayoutItems(newOrder);
    },
  });
  private _handleWeatherStartDragStart = this._weatherStartDragSort.onDragStart;
  private _handleWeatherStartDragEnd = this._weatherStartDragSort.onDragEnd;
  private _handleWeatherStartDragOver = this._weatherStartDragSort.onDragOver;
  private _handleWeatherStartDragLeave = this._weatherStartDragSort.onDragLeave;
  private _handleWeatherStartDrop = this._weatherStartDragSort.onDrop;

  // -- Room stack order panel -------------------------------------------

  private _getStacksOrder(areaId: string): StackKey[] {
    return mergeStacksOrder(this._config.areas_options?.[areaId]?.stacks_order);
  }

  private _updateStacksOrder(areaId: string, newOrder: StackKey[]): void {
    const isDefault = newOrder.join('|') === DEFAULT_STACKS_ORDER.join('|');
    this._applyConfig(
      updateAreaOptions(this._config, areaId, (options) => {
        if (isDefault) delete options.stacks_order;
        else options.stacks_order = newOrder;
        return options;
      })
    );
  }

  private _renderStackOrderPanel(
    areaId: string,
    data: NonNullable<ReturnType<typeof this._areaEntitiesCache.get>>
  ): TemplateResult {
    return renderRoomStackOrderPanel({
      areaId,
      order: this._getStacksOrder(areaId),
      visible: presentStackKeys(data.groupedEntities, this._config),
      onMove: (key, direction) => {
        const order = this._getStacksOrder(areaId);
        const moved = moveVisibleStack(order, presentStackKeys(data.groupedEntities, this._config), key, direction);
        if (moved !== order) this._updateStacksOrder(areaId, moved);
      },
      onDragStart: this._handleStackDragStart,
      onDragEnd: this._handleStackDragEnd,
      onDragOver: this._handleStackDragOver,
      onDragLeave: this._handleStackDragLeave,
      onDrop: this._handleStackDrop,
    });
  }
  private readonly _stackDragSort = createDragSortHandlers({
    itemSelector: '.section-order-item',
    keyOf: (item) => item.dataset.stackKey,
    clearScope: () => this.shadowRoot,
    onReorder: (draggedKey, dropKey, dropTarget) => {
      const areaId = dropTarget.dataset.areaId;
      if (!areaId) return;
      const newOrder = moveKey(this._getStacksOrder(areaId), (key) => key, draggedKey, dropKey);
      if (newOrder) this._updateStacksOrder(areaId, newOrder);
    },
  });
  private _handleStackDragStart = this._stackDragSort.onDragStart;
  private _handleStackDragEnd = this._stackDragSort.onDragEnd;
  private _handleStackDragOver = this._stackDragSort.onDragOver;
  private _handleStackDragLeave = this._stackDragSort.onDragLeave;
  private _handleStackDrop = this._stackDragSort.onDrop;

  // -- Overview section --------------------------------------------------

  private _renderAreasListSection(): TemplateResult {
    const allAreas = this._getSortedAreas();
    const normalizedAreasDisplay = this._getNormalizedAreasDisplay();
    const hiddenAreas = normalizedAreasDisplay?.hidden || [];
    const areaOrder = normalizedAreasDisplay?.order || [];
    const navItems = normalizedAreasDisplay?.nav_items || [];

    return html`
      <div class="section">
        <div class="section-title">${localize('editor.section_area_views')}</div>
        <div class="description" style="margin-left: 0;">${localize('editor.area_view_override_intro')}</div>
        <div class="description" style="margin-left: 0;">${localize('editor.area_entity_settings_desc')}</div>
        <div class="area-list" id="area-list">${this._renderAreaItems(allAreas, hiddenAreas, areaOrder, navItems)}</div>
      </div>
    `;
  }

  private _renderAreasSection(): TemplateResult {
    return renderAreaOptionsPanel(this._optionPanelHost, (displayType) =>
      this._globalAreaDisplayTypeChanged(displayType)
    );
  }

  private _renderViewsSection(): TemplateResult {
    const showSummaryViews = this._config.show_summary_views === true;
    const showRoomViews = this._config.show_room_views === true;
    const showCctvView = this._config.show_cctv_view === true;
    const cctvShowActivity = this._config.cctv_show_activity === true;
    const showCameraEvents = this._config.show_camera_events ?? cctvShowActivity;
    const showCamerasInSecurity = this._config.show_cameras_in_security === true;
    const showMaintenanceView = this._config.show_maintenance_view !== false;
    const showMaintenanceActivity = this._config.show_maintenance_activity !== false;
    const showVideoTips = this._config.show_video_tips !== false;
    const showEnergyView = this._config.show_energy_view === true;

    return html`${renderViewsPanel({
      showSummaryViews,
      showRoomViews,
      showCctvView,
      cctvShowActivity,
      showCameraEvents,
      showCamerasInSecurity,
      showMaintenanceView,
      showMaintenanceActivity,
      showVideoTips,
      showEnergyView,
      checkbox: (id, label, checked, change) => this._renderCheckbox(id, label, checked, change),
      change: (key, checked, defaultValue = false) => {
        if (key === 'show_camera_events') {
          this._setCctvOptions({ show_camera_events: checked });
        } else if (key === 'cctv_show_activity' && this._config.show_camera_events === undefined) {
          this._setCctvOptions({ cctv_show_activity: checked, show_camera_events: false });
        } else {
          this._toggleChanged(key, checked, defaultValue);
        }
      },
    })}${renderRoomVisibilityPanel(this)}${renderUserVisibilityPanel(this)}`;
  }

  private _renderCustomContentSection(): TemplateResult {
    return renderCustomContentPanel(this._customContentHost);
  }

  // ====================================================================
  // ITEM RENDERERS
  // ====================================================================

  _renderCheckbox(
    id: string,
    label: string,
    checked: boolean,
    onChange: (checked: boolean) => void,
    disabled = false
  ): TemplateResult {
    return html`
      <div class="form-row">
        <input
          type="checkbox"
          id=${id}
          ?checked=${checked}
          ?disabled=${disabled}
          @change=${(e: Event) => onChange((e.target as HTMLInputElement).checked)}
        />
        <label for=${id} class=${disabled ? 'disabled-label' : ''}>${label}</label>
      </div>
    `;
  }

  // ====================================================================
  // AREA RENDERERS
  // ====================================================================

  private _renderAreaItems(
    allAreas: AreaRegistryEntry[],
    hiddenAreas: string[],
    areaOrder: string[],
    navItems: string[]
  ): TemplateResult | TemplateResult[] {
    return renderAreaItems(this._roomOptionsHost, allAreas, hiddenAreas, areaOrder, navItems);
  }

  private _globalAreaDisplayTypeChanged(displayType: AreaDisplayType): void {
    const newConfig = setGlobalAreaDisplayType(this._config, displayType);
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  private _renderAreaDisplayTypeOverride(area: AreaRegistryEntry): TemplateResult {
    return renderAreaDisplayTypeOverride(this._roomOptionsHost, area);
  }

  private _areaDisplayTypeOverrideChanged(areaId: string, displayType: AreaDisplayType | ''): void {
    const newConfig = setAreaDisplayTypeOverride(this._config, areaId, displayType || undefined);
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  private _renderAreaViewOverride(areaId: string): TemplateResult {
    return renderAreaViewOverride(this._roomOptionsHost, areaId);
  }

  private _updateAreaViewOverride(areaId: string, yamlString: string): void {
    return updateAreaViewOverride(this._roomOptionsHost, areaId, yamlString);
  }

  private _renderAreaEntities(
    areaId: string,
    data: NonNullable<ReturnType<typeof this._areaEntitiesCache.get>>
  ): TemplateResult {
    return renderAreaEntities(this._roomOptionsHost, areaId, data);
  }

  // -- Area Custom Cards Renderers --------------------------------------

  private _renderAreaCustomCardItem(
    areaId: string,
    card: AreaCustomCard,
    index: number,
    availableEntities: Array<{ entity_id: string; name: string }>
  ): TemplateResult {
    return renderAreaCustomCardItem(this._roomOptionsHost, areaId, card, index, availableEntities);
  }

  private _renderAreaCustomCardsSection(
    areaId: string,
    availableEntities: Array<{ entity_id: string; name: string }>
  ): TemplateResult {
    return renderAreaCustomCardsSection(this._roomOptionsHost, areaId, availableEntities);
  }

  private _renderBadgeGroup(
    areaId: string,
    badgeCandidates: string[],
    additionalBadges: string[],
    availableEntities: Array<{ entity_id: string; name: string }>,
    hiddenEntities: Record<string, string[]>,
    defaultShowNames: Set<string>,
    namesVisible: string[],
    namesHidden: string[],
    expandedGroups: Set<string>
  ): TemplateResult {
    return renderBadgeGroup(
      this._roomOptionsHost,
      areaId,
      badgeCandidates,
      additionalBadges,
      availableEntities,
      hiddenEntities,
      defaultShowNames,
      namesVisible,
      namesHidden,
      expandedGroups
    );
  }

  // ====================================================================
  // AREA ENTITY LOADING
  // ====================================================================

  private async _loadAreaEntities(areaId: string): Promise<void> {
    if (!this._hass) return;

    const visibleEntities = getEditableAreaEntities(areaId, this._hass, this._config);
    const groupedEntities = createRoomEntities(
      visibleEntities,
      this._hass,
      findUpsEntityGroups(visibleEntities, this._hass),
      { includeCameras: false }
    );
    const hiddenEntities = getHiddenEntitiesForArea(areaId, this._config);
    const entityOrders = getEntityOrdersForArea(areaId, this._config);
    const badgeCandidates = getAreaBadgeCandidates(
      visibleEntities,
      this._hass,
      this._config.battery_critical_threshold
    );
    const additionalBadges = getAdditionalBadgesForArea(areaId, this._config);
    const availableEntities = getAvailableBadgeEntities(visibleEntities, this._hass, [
      ...badgeCandidates,
      ...additionalBadges,
    ]);
    const defaultShowNames = getDefaultShowNameEntities(badgeCandidates, this._hass);
    const { namesVisible, namesHidden } = getBadgeNamesConfig(areaId, this._config);

    this._areaEntitiesCache.set(areaId, {
      groupedEntities,
      hiddenEntities,
      entityOrders,
      badgeCandidates,
      additionalBadges,
      availableEntities,
      defaultShowNames,
      namesVisible,
      namesHidden,
    });

    this.requestUpdate();
  }

  private _refreshAreaCache(areaId: string): void {
    if (!this._hass || !this._areaEntitiesCache.has(areaId)) return;

    const groupedEntities = this._areaEntitiesCache.get(areaId)!.groupedEntities;
    const hiddenEntities = getHiddenEntitiesForArea(areaId, this._config);
    const entityOrders = getEntityOrdersForArea(areaId, this._config);
    const visibleEntities = getEditableAreaEntities(areaId, this._hass, this._config);
    const badgeCandidates = getAreaBadgeCandidates(
      visibleEntities,
      this._hass,
      this._config.battery_critical_threshold
    );
    const additionalBadges = getAdditionalBadgesForArea(areaId, this._config);
    const availableEntities = getAvailableBadgeEntities(visibleEntities, this._hass, [
      ...badgeCandidates,
      ...additionalBadges,
    ]);
    const defaultShowNames = getDefaultShowNameEntities(badgeCandidates, this._hass);
    const { namesVisible, namesHidden } = getBadgeNamesConfig(areaId, this._config);

    this._areaEntitiesCache.set(areaId, {
      groupedEntities,
      hiddenEntities,
      entityOrders,
      badgeCandidates,
      additionalBadges,
      availableEntities,
      defaultShowNames,
      namesVisible,
      namesHidden,
    });
  }

  // ====================================================================
  // EVENT HANDLERS — Toggle / Config changes
  // ====================================================================

  private _toggleChanged(key: string, value: boolean, defaultValue: boolean): void {
    if (!this._hass) return;

    const newConfig: Simon42StrategyConfig = {
      ...this._config,
      [key]: value,
    };

    // Remove property when set to default
    if (value === getOptionDefault(key, this._config, defaultValue)) {
      Reflect.deleteProperty(newConfig, key);
    }

    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  private _setCctvOptions(values: Pick<Simon42StrategyConfig, 'cctv_show_activity' | 'show_camera_events'>): void {
    if (!this._hass) return;
    const updated = { ...this._config, ...values };
    this._config = updated;
    this._fireConfigChanged(updated);
  }

  private _simpleOptionChanged(key: keyof Simon42StrategyConfig, value: unknown, defaultValue: unknown): void {
    const updated = { ...this._config } as Record<string, unknown>;
    if (value === getOptionDefault(key, this._config, defaultValue)) delete updated[key];
    else updated[key] = value;
    this._config = updated as Simon42StrategyConfig;
    this._fireConfigChanged(this._config);
  }

  // -- Custom Views -----------------------------------------------------

  private _addCustomView(): void {
    const customViews: CustomView[] = [...(this._config.custom_views || [])];
    customViews.push({
      title: localize('editor.new_view'),
      path: `custom-view-${customViews.length + 1}`,
      icon: 'mdi:card-text-outline',
      yaml: '',
      parsed_config: undefined,
    } as CustomView);

    const newConfig: Simon42StrategyConfig = { ...this._config, custom_views: customViews };
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  private _addCustomRefView = (): void => {
    const customViews: CustomView[] = [...(this._config.custom_views || [])];
    customViews.push({ title: '', path: '', icon: '', ref_dashboard: '', ref_view: '' });
    const newConfig = { ...this._config, custom_views: customViews };
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
    void this._loadRefDashboards();
  };

  private async _loadRefDashboards(): Promise<void> {
    if (this._refDashboardsLoading || !this._hass) return;
    this._refDashboardsLoading = true;
    const options: RefDashboardOption[] = [];
    try {
      const list = await this._hass.callWS<Array<{ url_path: string; title: string }>>({
        type: 'lovelace/dashboards/list',
      });
      const candidates = [
        { url_path: 'lovelace', title: localize('editor.ref_default_dashboard') },
        ...list.filter((dashboard) => dashboard.url_path && dashboard.url_path !== 'lovelace'),
      ];
      await Promise.all(
        candidates.map(async (candidate) => {
          try {
            const config = await this._hass!.callWS<{
              views?: Array<Record<string, unknown>>;
              strategy?: unknown;
            }>({
              type: 'lovelace/config',
              url_path: candidate.url_path === 'lovelace' ? null : candidate.url_path,
            });
            if (config.strategy) return;
            const views = (config.views || []).map((view, index) => ({
              path: typeof view.path === 'string' ? view.path : undefined,
              title: typeof view.title === 'string' ? view.title : undefined,
              icon: typeof view.icon === 'string' ? view.icon : undefined,
              index,
            }));
            if (views.length) options.push({ ...candidate, views });
          } catch {
            // Missing or inaccessible dashboards are not offered.
          }
        })
      );
    } catch {
      // Keep an empty list; the editor shows a non-blocking message.
    }
    options.sort((a, b) => a.title.localeCompare(b.title));
    this._refDashboards = options;
    this._refDashboardsLoading = false;
    this.requestUpdate();
  }

  private _refDashboardChanged(index: number, urlPath: string): void {
    const customViews = [...(this._config.custom_views || [])];
    if (!customViews[index]) return;
    customViews[index] = { ...customViews[index], ref_dashboard: urlPath, ref_view: '' };
    const newConfig = { ...this._config, custom_views: customViews };
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  private _refViewChanged(index: number, refView: string): void {
    const customViews = [...(this._config.custom_views || [])];
    const existing = customViews[index];
    if (!existing) return;
    const dashboard = this._refDashboards?.find((item) => item.url_path === existing.ref_dashboard);
    const source = dashboard?.views.find((item) => (item.path ?? String(item.index)) === refView);
    const updated: CustomView = { ...existing, ref_view: refView };
    if (!updated.title) updated.title = source?.title || localize('editor.new_view');
    if (!updated.icon) updated.icon = source?.icon || 'mdi:link-variant';
    if (!updated.path) updated.path = this._uniqueCustomViewPath(source?.path || `custom-view-${index + 1}`, index);
    customViews[index] = updated;
    const newConfig = { ...this._config, custom_views: customViews };
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  private _uniqueCustomViewPath(base: string, excludeIndex: number): string {
    const taken = new Set([
      'home',
      'lights',
      'covers',
      'security',
      'batteries',
      'climate',
      'maintenance',
      'cctv',
      ...Object.keys(this._hass?.areas || {}),
      ...(this._config.custom_views || [])
        .filter((_, index) => index !== excludeIndex)
        .map((view) => view.path)
        .filter((path): path is string => !!path),
    ]);
    if (!taken.has(base)) return base;
    let suffix = 1;
    let candidate = `${base}-ref`;
    while (taken.has(candidate)) candidate = `${base}-ref${++suffix}`;
    return candidate;
  }

  private _removeCustomView(index: number): void {
    const customViews: CustomView[] = [...(this._config.custom_views || [])];
    customViews.splice(index, 1);

    const newConfig: Simon42StrategyConfig = { ...this._config };
    if (customViews.length === 0) {
      delete newConfig.custom_views;
    } else {
      newConfig.custom_views = customViews;
    }

    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  private _updateCustomViewField(index: number, field: string, value: string): void {
    const customViews: CustomView[] = [...(this._config.custom_views || [])];
    if (!customViews[index]) return;

    customViews[index] = { ...customViews[index], [field]: value };

    const newConfig: Simon42StrategyConfig = { ...this._config, custom_views: customViews };
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  private _updateCustomViewAfterView(index: number, value: string): void {
    const customViews: CustomView[] = [...(this._config.custom_views || [])];
    const existing = customViews[index];
    if (!existing) return;

    const updated = { ...existing };
    if (value) updated.after_view = value;
    else delete updated.after_view;
    customViews[index] = updated;

    const newConfig: Simon42StrategyConfig = { ...this._config, custom_views: customViews };
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  private _updateCustomViewYaml(index: number, yamlString: string): void {
    withYaml(() => {
      const customViews: CustomView[] = [...(this._config.custom_views || [])];
      if (!customViews[index]) return;
      customViews[index] = withParsedYaml(customViews[index], yamlString, 'YAML muss ein Objekt ergeben');
      this._applyConfig({ ...this._config, custom_views: customViews });
    });
  }

  // -- Custom Cards -----------------------------------------------------

  private _customCardsHeadingChanged(e: Event): void {
    const value = (e.target as HTMLInputElement).value.trim();
    const newConfig: Simon42StrategyConfig = { ...this._config };
    if (value) {
      newConfig.custom_cards_heading = value;
    } else {
      delete newConfig.custom_cards_heading;
    }
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  private _customCardsIconChanged(e: Event): void {
    const value = (e.target as HTMLInputElement).value.trim();
    const newConfig: Simon42StrategyConfig = { ...this._config };
    if (value) {
      newConfig.custom_cards_icon = value;
    } else {
      delete newConfig.custom_cards_icon;
    }
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  private _removeCustomCard(index: number): void {
    const customCards: CustomCard[] = [...(this._config.custom_cards || [])];
    customCards.splice(index, 1);

    const newConfig: Simon42StrategyConfig = { ...this._config };
    if (customCards.length === 0) {
      delete newConfig.custom_cards;
    } else {
      newConfig.custom_cards = customCards;
    }

    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  private _updateCustomCardField(index: number, field: string, value: string): void {
    const customCards: CustomCard[] = [...(this._config.custom_cards || [])];
    if (!customCards[index]) return;

    customCards[index] = { ...customCards[index], [field]: value };

    const newConfig: Simon42StrategyConfig = { ...this._config, custom_cards: customCards };
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  private _updateCustomCardYaml(index: number, yamlString: string): void {
    withYaml(() => {
      const customCards: CustomCard[] = [...(this._config.custom_cards || [])];
      if (!customCards[index]) return;
      customCards[index] = withParsedYaml(customCards[index], yamlString, 'YAML muss ein Objekt oder Array ergeben');
      this._applyYamlConfig({ ...this._config, custom_cards: customCards }, customCards[index]._yaml_error);
    });
  }

  // -- Custom Sections (overview) ------------------------------------------

  private _addCustomSection(): void {
    const customSections: CustomSection[] = [...(this._config.custom_sections || [])];
    customSections.push({ title: '', icon: '', cards: [] });
    const newConfig: Simon42StrategyConfig = { ...this._config, custom_sections: customSections };
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  private _removeCustomSection(sectionIndex: number): void {
    const customSections: CustomSection[] = [...(this._config.custom_sections || [])];
    customSections.splice(sectionIndex, 1);
    const newConfig: Simon42StrategyConfig = { ...this._config };
    if (customSections.length === 0) {
      delete newConfig.custom_sections;
    } else {
      newConfig.custom_sections = customSections;
    }
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  private _updateCustomSectionField(sectionIndex: number, field: string, value: string): void {
    const customSections: CustomSection[] = [...(this._config.custom_sections || [])];
    if (!customSections[sectionIndex]) return;
    customSections[sectionIndex] = { ...customSections[sectionIndex], [field]: value };
    const newConfig: Simon42StrategyConfig = { ...this._config, custom_sections: customSections };
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  private _updateCustomSectionYaml(sectionIndex: number, yamlString: string): void {
    withYaml(() => {
      const customSections = [...(this._config.custom_sections || [])];
      if (!customSections[sectionIndex]) return;
      customSections[sectionIndex] = withParsedYaml(
        customSections[sectionIndex],
        yamlString,
        localize('editor.custom_section_yaml_invalid')
      );
      this._applyYamlConfig(
        { ...this._config, custom_sections: customSections },
        customSections[sectionIndex]._yaml_error
      );
    });
  }

  private _removeCardFromSection(sectionIndex: number, cardIndex: number): void {
    const customSections: CustomSection[] = [...(this._config.custom_sections || [])];
    if (!customSections[sectionIndex]) return;
    const section = { ...customSections[sectionIndex] };
    const cards = [...(section.cards || [])];
    cards.splice(cardIndex, 1);
    section.cards = cards;
    customSections[sectionIndex] = section;
    const newConfig: Simon42StrategyConfig = { ...this._config, custom_sections: customSections };
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  private _updateSectionCardField(sectionIndex: number, cardIndex: number, field: string, value: string): void {
    const customSections: CustomSection[] = [...(this._config.custom_sections || [])];
    if (!customSections[sectionIndex]) return;
    const section = { ...customSections[sectionIndex] };
    const cards = [...(section.cards || [])];
    if (!cards[cardIndex]) return;
    cards[cardIndex] = { ...cards[cardIndex], [field]: value };
    section.cards = cards;
    customSections[sectionIndex] = section;
    const newConfig: Simon42StrategyConfig = { ...this._config, custom_sections: customSections };
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  private _updateSectionCardYaml(sectionIndex: number, cardIndex: number, yamlString: string): void {
    withYaml(() => {
      const customSections: CustomSection[] = [...(this._config.custom_sections || [])];
      if (!customSections[sectionIndex]) return;
      const cards = [...(customSections[sectionIndex].cards || [])];
      if (!cards[cardIndex]) return;
      cards[cardIndex] = withParsedYaml(cards[cardIndex], yamlString, 'YAML muss ein Objekt oder Array ergeben');
      customSections[sectionIndex] = { ...customSections[sectionIndex], cards };
      this._applyYamlConfig({ ...this._config, custom_sections: customSections }, cards[cardIndex]._yaml_error);
    });
  }

  // -- Area Custom Cards (per-area room view) ---------------------------

  /** Liest die custom_cards-Liste einer Area (immer eine neue Kopie). */
  private _getAreaCustomCards(areaId: string): AreaCustomCard[] {
    return [...(this._config.areas_options?.[areaId]?.custom_cards || [])];
  }

  /**
   * Schreibt die custom_cards-Liste einer Area zurück in die Config.
   * Räumt leere Verschachtelungen auf (Delete-when-empty), damit die
   * gespeicherte Config minimal bleibt (siehe updateAreaOptions).
   */
  private _writeAreaCustomCards(areaId: string, cards: AreaCustomCard[]): void {
    this._applyConfig(
      updateAreaOptions(this._config, areaId, (options) => {
        if (cards.length === 0) delete options.custom_cards;
        else options.custom_cards = cards;
        return options;
      })
    );
  }

  private _addAreaCustomCard(areaId: string): void {
    const cards = this._getAreaCustomCards(areaId);
    cards.push({
      mode: 'yaml',
      position: 'bottom',
      editor_title: '',
      yaml: '',
      parsed_config: undefined,
    } as AreaCustomCard);
    this._writeAreaCustomCards(areaId, cards);
  }

  private _removeAreaCustomCard(areaId: string, index: number): void {
    const cards = this._getAreaCustomCards(areaId);
    if (index < 0 || index >= cards.length) return;
    cards.splice(index, 1);
    this._writeAreaCustomCards(areaId, cards);
  }

  private _updateAreaCustomCardField(areaId: string, index: number, field: string, value: string): void {
    withYaml(() => {
      const cards = this._getAreaCustomCards(areaId);
      if (!cards[index]) return;
      const updated: AreaCustomCard = { ...cards[index], [field]: value };
      if (field === 'mode' && value !== 'tile') {
        this._parseAreaCustomCardYamlConfig(updated, updated.yaml || '');
      }
      if (field === 'mode' && value === 'tile') {
        delete updated._yaml_error;
      }
      cards[index] = updated;
      this._writeAreaCustomCards(areaId, cards);
    });
  }

  private _parseAreaCustomCardYamlConfig(updated: AreaCustomCard, yamlString: string): void {
    updated.yaml = yamlString;
    delete updated._yaml_error;

    if (yamlString.trim()) {
      try {
        const parsed = requireYaml().load(yamlString);
        if (parsed && typeof parsed === 'object') {
          if (updated.mode === 'section') {
            const sections = Array.isArray(parsed) ? parsed : [parsed];
            const hasOnlySections = sections.every(
              (section) =>
                section && typeof section === 'object' && Array.isArray((section as Record<string, any>).cards)
            );
            if (!hasOnlySections) {
              updated._yaml_error = 'Section-YAML muss ein Objekt oder Array mit cards enthalten';
              updated.parsed_config = undefined;
              return;
            }
          }
          updated.parsed_config = parsed as Record<string, any> | Record<string, any>[];
        } else {
          updated._yaml_error = 'YAML muss ein Objekt oder Array ergeben';
          updated.parsed_config = undefined;
        }
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message.split('\n')[0] : 'Ungültiges YAML';
        updated._yaml_error = message || 'Ungültiges YAML';
        updated.parsed_config = undefined;
      }
    } else {
      updated.parsed_config = undefined;
    }
  }

  private _updateAreaCustomCardYaml(areaId: string, index: number, yamlString: string): void {
    withYaml(() => {
      const cards = this._getAreaCustomCards(areaId);
      if (!cards[index]) return;

      const updated: AreaCustomCard = { ...cards[index] };
      this._parseAreaCustomCardYamlConfig(updated, yamlString);

      cards[index] = updated;
      this._writeAreaCustomCards(areaId, cards);
    });
  }

  // -- Custom Badges ----------------------------------------------------

  private _addCustomBadge(): void {
    const customBadges: CustomBadge[] = [...(this._config.custom_badges || [])];
    customBadges.push({ yaml: '', parsed_config: undefined } as CustomBadge);

    const newConfig: Simon42StrategyConfig = { ...this._config, custom_badges: customBadges };
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  private _removeCustomBadge(index: number): void {
    const customBadges: CustomBadge[] = [...(this._config.custom_badges || [])];
    customBadges.splice(index, 1);

    const newConfig: Simon42StrategyConfig = { ...this._config };
    if (customBadges.length === 0) {
      delete newConfig.custom_badges;
    } else {
      newConfig.custom_badges = customBadges;
    }

    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  private _updateCustomBadgeYaml(index: number, yamlString: string): void {
    withYaml(() => {
      const customBadges: CustomBadge[] = [...(this._config.custom_badges || [])];
      if (!customBadges[index]) return;
      customBadges[index] = withParsedYaml(customBadges[index], yamlString, 'YAML muss ein Objekt ergeben');
      this._applyConfig({ ...this._config, custom_badges: customBadges });
    });
  }

  // ====================================================================
  // AREA MANAGEMENT
  // ====================================================================

  private _areaVisibilityChanged(areaId: string, isVisible: boolean): void {
    if (!this._hass) return;
    if (!isVisible) {
      // Collapse area when hidden
      this._expandedAreas.delete(areaId);
      this._expandedGroups.delete(areaId);
      this._areaEntitiesCache.delete(areaId);
    }
    this._invalidateWeatherStartOptionsCaches();
    this._applyConfig(setAreaVisible(this._config, areaId, isVisible));
  }

  private _areaNavPinChanged(areaId: string, isPinned: boolean): void {
    this._applyConfig(setAreaNavPinned(this._config, areaId, isPinned));
  }

  private _toggleAreaExpand(e: Event, areaId: string): void {
    e.stopPropagation();

    const newExpandedAreas = new Set(this._expandedAreas);

    if (newExpandedAreas.has(areaId)) {
      newExpandedAreas.delete(areaId);
      const newExpandedGroups = new Map(this._expandedGroups);
      newExpandedGroups.delete(areaId);
      this._expandedGroups = newExpandedGroups;
    } else {
      newExpandedAreas.add(areaId);
      // Load entities if not cached
      if (!this._areaEntitiesCache.has(areaId)) {
        void this._loadAreaEntities(areaId);
      }
    }

    this._expandedAreas = newExpandedAreas;
  }

  private _toggleGroupExpand(areaId: string, groupKey: string): void {
    const newExpandedGroups = new Map(this._expandedGroups);
    const areaGroups = new Set(newExpandedGroups.get(areaId) || []);

    if (areaGroups.has(groupKey)) {
      areaGroups.delete(groupKey);
    } else {
      areaGroups.add(groupKey);
    }

    if (areaGroups.size > 0) {
      newExpandedGroups.set(areaId, areaGroups);
    } else {
      newExpandedGroups.delete(areaId);
    }

    this._expandedGroups = newExpandedGroups;
  }

  private _groupVisibilityChanged(areaId: string, group: string, isVisible: boolean, entities: string[]): void {
    if (!this._hass) return;
    this._applyConfig(setGroupEntitiesVisible(this._config, areaId, group, entities, isVisible));
    this._refreshAreaCache(areaId);
  }

  private _entityVisibilityChanged(areaId: string, group: string, entityId: string, isVisible: boolean): void {
    if (!this._hass) return;

    // Handle badge additional entities
    if (group === 'badges_additional') {
      this._badgeAdditionalChanged(areaId, entityId, isVisible);
      return;
    }

    // Handle badge show_name toggle
    if (group === 'badges_show_name') {
      this._badgeShowNameChanged(areaId, entityId, isVisible);
      return;
    }

    this._applyConfig(setGroupEntityVisible(this._config, areaId, group, entityId, isVisible));
    this._refreshAreaCache(areaId);
  }

  // -- Badge additional and show_name -----------------------------------

  private _badgeAdditionalChanged(areaId: string, entityId: string, isAdd: boolean): void {
    if (!this._config) return;
    this._applyConfig(setBadgeAdditional(this._config, areaId, entityId, isAdd));
    this._refreshAreaCache(areaId);
  }

  private _badgeShowNameChanged(areaId: string, entityId: string, showName: boolean): void {
    if (!this._config || !this._hass) return;
    const deviceClass = this._hass.states[entityId]?.attributes?.device_class as string | undefined;
    this._applyConfig(setBadgeShowName(this._config, areaId, entityId, showName, isDefaultShowName(deviceClass)));
    this._refreshAreaCache(areaId);
  }

  private _addBadgeFromPicker(e: Event, areaId: string): void {
    e.stopPropagation();
    const picker = this.shadowRoot!.querySelector(
      `.badge-entity-picker[data-area-id="${areaId}"]`
    ) as HTMLSelectElement | null;
    if (!picker || !picker.value) return;

    const entityId = picker.value;
    this._badgeAdditionalChanged(areaId, entityId, true);
    picker.value = '';
  }

  // ====================================================================
  // DRAG AND DROP
  // ====================================================================

  private readonly _areaDragSort = createDragSortHandlers({
    itemSelector: '.area-item',
    keyOf: (item) => item.dataset.areaId,
    clearScope: () => this.shadowRoot?.querySelector('#area-list'),
    // The new order comes from the config state, never from the DOM.
    onReorder: (draggedAreaId, dropAreaId) => {
      const newOrder = moveKey(this._getAreaOrder(), (id) => id, draggedAreaId, dropAreaId);
      if (newOrder) this._updateAreaOrder(newOrder);
    },
  });
  private _handleDragStart = this._areaDragSort.onDragStart;
  private _handleDragEnd = this._areaDragSort.onDragEnd;
  private _handleDragOver = this._areaDragSort.onDragOver;
  private _handleDragLeave = this._areaDragSort.onDragLeave;
  private _handleDrop = this._areaDragSort.onDrop;

  private _getAreaOrder(): string[] {
    if (!this._hass) return [];
    const configOrder = this._getNormalizedAreasDisplay()?.order;
    if (configOrder && configOrder.length > 0) return [...configOrder];
    return Object.keys(this._hass.areas || {});
  }

  private _updateAreaOrder(newOrder: string[]): void {
    this._invalidateWeatherStartOptionsCaches();
    this._applyConfig(setAreaOrder(this._config, newOrder));
  }

  // ====================================================================
  // CONFIG DISPATCH
  // ====================================================================

  /** Store a new config and notify Home Assistant. */
  private _applyConfig(config: Simon42StrategyConfig): void {
    this._config = config;
    this._fireConfigChanged(config);
  }

  /**
   * Store a config after a YAML edit. With a parse error only re-render (the
   * user is still typing); otherwise notify Home Assistant.
   */
  private _applyYamlConfig(config: Simon42StrategyConfig, yamlError: string | undefined): void {
    if (yamlError) {
      this._config = config;
      this.requestUpdate();
      return;
    }
    this._applyConfig(config);
  }

  _fireConfigChanged(config: Simon42StrategyConfig): void {
    this._isUpdatingConfig = true;

    // Strip internal fields before saving
    const cleanConfig: Simon42StrategyConfig = stripLegacyOverviewLayoutConfig(config);
    delete (cleanConfig as Record<string, unknown>).inline_editor;
    if (cleanConfig.custom_views) {
      cleanConfig.custom_views = cleanConfig.custom_views.map((cv) => {
        const clean = { ...cv };
        delete clean._yaml_error;
        return clean;
      });
    }
    if (cleanConfig.custom_cards) {
      cleanConfig.custom_cards = cleanConfig.custom_cards.map((cc) => {
        const clean = { ...cc };
        delete clean._yaml_error;
        return clean;
      });
    }
    if (cleanConfig.custom_badges) {
      cleanConfig.custom_badges = cleanConfig.custom_badges.map((cb) => {
        const clean = { ...cb };
        delete clean._yaml_error;
        return clean;
      });
    }
    if (cleanConfig.custom_sections) {
      cleanConfig.custom_sections = cleanConfig.custom_sections.map((cs) => {
        const cleanSection = { ...cs };
        delete cleanSection._yaml_error;
        cleanSection.cards = (cs.cards || []).map((cc) => {
          const clean = { ...cc };
          delete clean._yaml_error;
          return clean;
        });
        return cleanSection;
      });
    }
    if (cleanConfig.weather_start_layout_items) {
      cleanConfig.weather_start_layout_items = cleanConfig.weather_start_layout_items.map((item) => {
        const clean = { ...item };
        delete clean._yaml_error;
        return clean;
      });
    }
    const normalizedAreasDisplay = this._getNormalizedAreasDisplay(cleanConfig);
    if (normalizedAreasDisplay) cleanConfig.areas_display = normalizedAreasDisplay;
    else delete cleanConfig.areas_display;

    const validAreaIds = this._hass ? new Set(Object.keys(this._hass.areas || {})) : null;
    if (cleanConfig.areas_options) {
      const areasOptionsWithoutLegacy = stripLegacyAreaWebrtcCameras(cleanConfig.areas_options);
      const cleanedAreasOptions: NonNullable<Simon42StrategyConfig['areas_options']> = {};
      for (const [areaId, areaOptions] of Object.entries(areasOptionsWithoutLegacy || {})) {
        if (validAreaIds && !validAreaIds.has(areaId)) continue;
        const cleanAreaOptions = { ...(areaOptions as Record<string, unknown>) };

        if (areaOptions.custom_cards) {
          cleanAreaOptions.custom_cards = areaOptions.custom_cards.map((cc) => {
            const clean = { ...cc };
            delete clean._yaml_error;
            return clean;
          });
        }
        if (areaOptions.view_override) {
          const clean = { ...areaOptions.view_override };
          delete clean._yaml_error;
          cleanAreaOptions.view_override = clean;
        }
        if (Object.keys(cleanAreaOptions).length > 0) {
          cleanedAreasOptions[areaId] = cleanAreaOptions;
        }
      }
      if (Object.keys(cleanedAreasOptions).length > 0) cleanConfig.areas_options = cleanedAreasOptions;
      else delete cleanConfig.areas_options;
    }

    // Keep editor-only validation errors locally while emitting only persistent fields.
    this._config = config;

    dispatchStrategyConfigChanged(this, cleanConfig);

    // Reset flag after one tick
    setTimeout(() => {
      this._isUpdatingConfig = false;
    }, 0);
  }

  // -- Card Picker -------------------------------------------------------

  private _openCardPickerForCustomCard = () => {
    this._openCardPicker((config) => {
      const yamlStr = requireYaml().dump(config).trim();
      const customCards: CustomCard[] = [...(this._config.custom_cards || [])];
      customCards.push({ editor_title: '', yaml: yamlStr, parsed_config: config });
      const newConfig = { ...this._config, custom_cards: customCards };
      this._config = newConfig;
      this._fireConfigChanged(newConfig);
    });
  };

  private _openCardPickerForSection(sectionIndex: number): void {
    this._openCardPicker((config) => {
      const yamlStr = requireYaml().dump(config).trim();
      const customSections = [...(this._config.custom_sections || [])];
      if (!customSections[sectionIndex]) return;
      const section = { ...customSections[sectionIndex] };
      section.cards = [...(section.cards || []), { editor_title: '', yaml: yamlStr, parsed_config: config }];
      customSections[sectionIndex] = section;
      const newConfig = { ...this._config, custom_sections: customSections };
      this._config = newConfig;
      this._fireConfigChanged(newConfig);
    });
  }

  private _openCardPickerForAreaCustomCard(areaId: string): void {
    this._openCardPicker((config) => {
      const yamlStr = requireYaml().dump(config).trim();
      const cards = this._getAreaCustomCards(areaId);
      cards.push({
        mode: 'yaml',
        position: 'bottom',
        editor_title: '',
        yaml: yamlStr,
        parsed_config: config,
      } as AreaCustomCard);
      this._writeAreaCustomCards(areaId, cards);
    });
  }

  private _openCardEditorForCustomCard(index: number): void {
    withYaml(() => {
      const card = this._config.custom_cards?.[index];
      const initialConfig = this._getEditableYamlCardConfig(card);
      if (!initialConfig) return;

      this._openCardPicker((config) => {
        this._updateCustomCardYaml(index, requireYaml().dump(config).trim());
      }, initialConfig);
    });
  }

  private _openCardEditorForSectionCard(sectionIndex: number, cardIndex: number): void {
    withYaml(() => {
      const card = this._config.custom_sections?.[sectionIndex]?.cards?.[cardIndex];
      const initialConfig = this._getEditableYamlCardConfig(card);
      if (!initialConfig) return;

      this._openCardPicker((config) => {
        this._updateSectionCardYaml(sectionIndex, cardIndex, requireYaml().dump(config).trim());
      }, initialConfig);
    });
  }

  private _openCardEditorForAreaCustomCard(areaId: string, index: number): void {
    withYaml(() => {
      const card = this._getAreaCustomCards(areaId)[index];
      const initialConfig = this._getEditableAreaCardConfig(card);
      if (!initialConfig) return;

      this._openCardPicker((config) => {
        const cards = this._getAreaCustomCards(areaId);
        if (!cards[index]) return;
        const updated: AreaCustomCard = {
          ...cards[index],
          mode: 'yaml',
          yaml: requireYaml().dump(config).trim(),
          parsed_config: config,
        };
        delete updated._yaml_error;
        cards[index] = updated;
        this._writeAreaCustomCards(areaId, cards);
      }, initialConfig);
    });
  }

  private _getEditableAreaCardConfig(card: AreaCustomCard | undefined): Record<string, any> | null {
    return getEditableAreaCardConfig(this._cardPickerHost, card);
  }

  private _getEditableYamlCardConfig(
    card: Pick<CustomCard | AreaCustomCard, 'parsed_config' | 'yaml'> | undefined
  ): Record<string, any> | null {
    return getEditableYamlCardConfig(this._cardPickerHost, card);
  }

  private _openCardPicker(callback: (config: Record<string, any>) => void, initialConfig?: Record<string, any>): void {
    withYaml(() => {
      openCardPicker(this._cardPickerHost, callback, initialConfig);
    });
  }

  private _closeCardPicker(): void {
    return closeCardPicker(this._cardPickerHost);
  }

  private _selectCardType(type: string): void {
    return selectCardType(this._cardPickerHost, type);
  }

  private _cardPickerYamlChanged(e: Event): void {
    return cardPickerYamlChanged(this._cardPickerHost, e);
  }

  private _confirmCardPicker(): void {
    return confirmCardPicker(this._cardPickerHost);
  }

  private _handlePickerOverlayClick = (e: Event) => {
    if (e.target === e.currentTarget) this._closeCardPicker();
  };

  override updated(changedProps: Map<string, unknown>): void {
    super.updated(changedProps);
    if (!this._openingMeasured) {
      timeEnd('editor-open');
      this._openingMeasured = true;
    }
    if (this._cardPickerOpen && this._cardPickerStep === 'editor' && !this._cardPickerHasVisualEditor) {
      this._tryMountVisualCardEditor();
    }
  }

  private _tryMountVisualCardEditor(): void {
    return tryMountVisualCardEditor(this._cardPickerHost);
  }

  private _renderCardPickerOverlay(): TemplateResult {
    return renderCardPickerOverlay(this._cardPickerHost);
  }

  private _renderCardTypePicker(): TemplateResult {
    return renderCardTypePicker(this._cardPickerHost);
  }

  private _renderCardEditor(): TemplateResult {
    return renderCardEditor(this._cardPickerHost);
  }
  /** Typed panel facade; editor state and config events remain owned by this host. */
  private readonly _weatherLayoutHost = this.createWeatherLayoutHost();

  createWeatherLayoutHost() {
    // Live facade getters intentionally refer to the owning LitElement.
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const editor = this;
    return {
      _addWeatherStartArea: this._addWeatherStartArea.bind(this),
      _addWeatherStartFloor: this._addWeatherStartFloor.bind(this),
      _addWeatherStartSection: this._addWeatherStartSection.bind(this),
      _addWeatherStartSummaries: this._addWeatherStartSummaries.bind(this),
      get _config() {
        return editor._config;
      },
      set _config(value: typeof editor._config) {
        editor._config = value;
      },
      _countNestedFixedGrids: this._countNestedFixedGrids.bind(this),
      get _expandedWeatherBlocks() {
        return editor._expandedWeatherBlocks;
      },
      set _expandedWeatherBlocks(value: typeof editor._expandedWeatherBlocks) {
        editor._expandedWeatherBlocks = value;
      },
      _getCustomCardEditorLabel: this._getCustomCardEditorLabel.bind(this),
      _getWeatherStartAreaOptions: this._getWeatherStartAreaOptions.bind(this),
      _getWeatherStartCustomCardIndex: this._getWeatherStartCustomCardIndex.bind(this),
      _getWeatherStartCustomSectionIndex: this._getWeatherStartCustomSectionIndex.bind(this),
      _getWeatherStartFloorOptions: this._getWeatherStartFloorOptions.bind(this),
      _getWeatherStartItemMeta: this._getWeatherStartItemMeta.bind(this),
      _getWeatherStartLayoutItems: this._getWeatherStartLayoutItems.bind(this),
      _handleWeatherStartDragEnd: this._handleWeatherStartDragEnd.bind(this),
      _handleWeatherStartDragLeave: this._handleWeatherStartDragLeave.bind(this),
      _handleWeatherStartDragOver: this._handleWeatherStartDragOver.bind(this),
      _handleWeatherStartDragStart: this._handleWeatherStartDragStart.bind(this),
      _handleWeatherStartDrop: this._handleWeatherStartDrop.bind(this),
      _isWeatherStartItemDisabled: this._isWeatherStartItemDisabled.bind(this),
      _openCardEditorForCustomCard: this._openCardEditorForCustomCard.bind(this),
      _openCardEditorForSectionCard: this._openCardEditorForSectionCard.bind(this),
      _openCardPickerForSection: this._openCardPickerForSection.bind(this),
      _openCardPickerForWeatherStartCard: this._openCardPickerForWeatherStartCard.bind(this),
      _removeCardFromSection: this._removeCardFromSection.bind(this),
      _removeWeatherStartItem: this._removeWeatherStartItem.bind(this),
      _renderWeatherStartCustomCardEditor: this._renderWeatherStartCustomCardEditor.bind(this),
      _renderWeatherStartCustomSectionEditor: this._renderWeatherStartCustomSectionEditor.bind(this),
      _resetWeatherStartItemYaml: this._resetWeatherStartItemYaml.bind(this),
      _toggleWeatherBlockExpanded: this._toggleWeatherBlockExpanded.bind(this),
      _toggleWeatherStartItemStack: this._toggleWeatherStartItemStack.bind(this),
      _updateCustomCardField: this._updateCustomCardField.bind(this),
      _updateCustomCardYaml: this._updateCustomCardYaml.bind(this),
      _updateCustomSectionField: this._updateCustomSectionField.bind(this),
      _updateSectionCardField: this._updateSectionCardField.bind(this),
      _updateSectionCardYaml: this._updateSectionCardYaml.bind(this),
      _updateWeatherStartItemYaml: this._updateWeatherStartItemYaml.bind(this),
      _weatherStartSummarySizeChanged: this._weatherStartSummarySizeChanged.bind(this),
      _weatherStartTitleChanged: this._weatherStartTitleChanged.bind(this),
      _parseWeatherStartItemYaml: this._parseWeatherStartItemYaml.bind(this),
      requestUpdate: this.requestUpdate.bind(this),
      _saveWeatherStartLayoutItems: this._saveWeatherStartLayoutItems.bind(this),
      _normalizeWeatherStartLayoutItems: this._normalizeWeatherStartLayoutItems.bind(this),
      _fireConfigChanged: this._fireConfigChanged.bind(this),
    };
  }

  /** Facade for the plain option panels; editor state and config events stay owned by this host. */
  private readonly _optionPanelHost = this.createOptionPanelHost();

  createOptionPanelHost(): OptionPanelHost {
    // Live facade getters intentionally refer to the owning LitElement.
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const editor = this;
    return {
      get hass() {
        return editor._hass;
      },
      get config() {
        return editor._config;
      },
      editor,
      entityListState: this._entityListState,
      checkbox: this._renderCheckbox.bind(this),
      toggle: this._toggleChanged.bind(this),
      setOption: this._simpleOptionChanged.bind(this),
      update: (change) => {
        const next: Simon42StrategyConfig = { ...editor._config };
        change(next);
        editor._config = next;
        editor._fireConfigChanged(next);
      },
      requestUpdate: this.requestUpdate.bind(this),
      entityOptions: this._getAllEntitiesForSelect.bind(this),
      filterEntities: this._getFilteredEntities.bind(this),
      sortedAreas: this._getSortedAreas.bind(this),
    };
  }

  /** Typed panel facade; editor state and config events remain owned by this host. */
  private readonly _roomOptionsHost = this.createRoomOptionsHost();

  createRoomOptionsHost() {
    // Live facade getters intentionally refer to the owning LitElement.
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const editor = this;
    return {
      _addAreaCustomCard: this._addAreaCustomCard.bind(this),
      _addBadgeFromPicker: this._addBadgeFromPicker.bind(this),
      _areaDisplayTypeOverrideChanged: this._areaDisplayTypeOverrideChanged.bind(this),
      get _areaEntitiesCache() {
        return editor._areaEntitiesCache;
      },
      set _areaEntitiesCache(value: typeof editor._areaEntitiesCache) {
        editor._areaEntitiesCache = value;
      },
      _areaNavPinChanged: this._areaNavPinChanged.bind(this),
      _areaVisibilityChanged: this._areaVisibilityChanged.bind(this),
      _badgeAdditionalChanged: this._badgeAdditionalChanged.bind(this),
      _badgeShowNameChanged: this._badgeShowNameChanged.bind(this),
      get _config() {
        return editor._config;
      },
      set _config(value: typeof editor._config) {
        editor._config = value;
      },
      _entityVisibilityChanged: this._entityVisibilityChanged.bind(this),
      get _expandedAreas() {
        return editor._expandedAreas;
      },
      set _expandedAreas(value: typeof editor._expandedAreas) {
        editor._expandedAreas = value;
      },
      get _expandedGroups() {
        return editor._expandedGroups;
      },
      set _expandedGroups(value: typeof editor._expandedGroups) {
        editor._expandedGroups = value;
      },
      _getAreaCustomCards: this._getAreaCustomCards.bind(this),
      _getCustomCardEditorLabel: this._getCustomCardEditorLabel.bind(this),
      _groupVisibilityChanged: this._groupVisibilityChanged.bind(this),
      _handleDragEnd: this._handleDragEnd.bind(this),
      _handleDragLeave: this._handleDragLeave.bind(this),
      _handleDragOver: this._handleDragOver.bind(this),
      _handleDragStart: this._handleDragStart.bind(this),
      _handleDrop: this._handleDrop.bind(this),
      get _hass() {
        return editor._hass;
      },
      set _hass(value: typeof editor._hass) {
        editor._hass = value;
      },
      _openCardEditorForAreaCustomCard: this._openCardEditorForAreaCustomCard.bind(this),
      _openCardPickerForAreaCustomCard: this._openCardPickerForAreaCustomCard.bind(this),
      _openDiagnosticLocation: this._openDiagnosticLocation.bind(this),
      _removeAreaCustomCard: this._removeAreaCustomCard.bind(this),
      _renderAreaCustomCardItem: this._renderAreaCustomCardItem.bind(this),
      _renderAreaCustomCardsSection: this._renderAreaCustomCardsSection.bind(this),
      _renderAreaDisplayTypeOverride: this._renderAreaDisplayTypeOverride.bind(this),
      _renderAreaEntities: this._renderAreaEntities.bind(this),
      _renderAreaViewOverride: this._renderAreaViewOverride.bind(this),
      _renderBadgeGroup: this._renderBadgeGroup.bind(this),
      _renderStackOrderPanel: this._renderStackOrderPanel.bind(this),
      _toggleAreaExpand: this._toggleAreaExpand.bind(this),
      _toggleGroupExpand: this._toggleGroupExpand.bind(this),
      _updateAreaCustomCardField: this._updateAreaCustomCardField.bind(this),
      _updateAreaCustomCardYaml: this._updateAreaCustomCardYaml.bind(this),
      _updateAreaViewOverride: this._updateAreaViewOverride.bind(this),
      _fireConfigChanged: this._fireConfigChanged.bind(this),
    };
  }

  /** Typed panel facade for the custom views panel; state and config events stay in this host. */
  private readonly _customViewsHost = this.createCustomViewsHost();

  createCustomViewsHost() {
    // Live facade getters intentionally refer to the owning LitElement.
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const editor = this;
    return {
      get _config() {
        return editor._config;
      },
      get _hass() {
        return editor._hass;
      },
      get _refDashboards() {
        return editor._refDashboards;
      },
      _getSortedAreas: editor._getSortedAreas.bind(editor),
      _addCustomView: editor._addCustomView.bind(editor),
      _addCustomRefView: editor._addCustomRefView,
      _loadRefDashboards: editor._loadRefDashboards.bind(editor),
      _refDashboardChanged: editor._refDashboardChanged.bind(editor),
      _refViewChanged: editor._refViewChanged.bind(editor),
      _removeCustomView: editor._removeCustomView.bind(editor),
      _updateCustomViewField: editor._updateCustomViewField.bind(editor),
      _updateCustomViewAfterView: editor._updateCustomViewAfterView.bind(editor),
      _updateCustomViewYaml: editor._updateCustomViewYaml.bind(editor),
    };
  }

  /** Typed panel facade for the custom content panel; state and config events stay in this host. */
  private readonly _customContentHost = this.createCustomContentHost();

  createCustomContentHost(): CustomContentPanelHost {
    // Live facade getters intentionally refer to the owning LitElement.
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const editor = this;
    return {
      get _config() {
        return editor._config;
      },
      customViewsHost: this._customViewsHost,
      _sectionLabelKey: getSectionLabelKey,
      _getCustomCardEditorLabel: this._getCustomCardEditorLabel.bind(this),
      _customCardsHeadingChanged: this._customCardsHeadingChanged.bind(this),
      _customCardsIconChanged: this._customCardsIconChanged.bind(this),
      _openCardPickerForCustomCard: () => editor._openCardPickerForCustomCard(),
      _removeCustomCard: this._removeCustomCard.bind(this),
      _updateCustomCardField: this._updateCustomCardField.bind(this),
      _updateCustomCardYaml: this._updateCustomCardYaml.bind(this),
      _openCardEditorForCustomCard: this._openCardEditorForCustomCard.bind(this),
      _addCustomSection: this._addCustomSection.bind(this),
      _removeCustomSection: this._removeCustomSection.bind(this),
      _updateCustomSectionYaml: this._updateCustomSectionYaml.bind(this),
      _updateCustomSectionField: this._updateCustomSectionField.bind(this),
      _removeCardFromSection: this._removeCardFromSection.bind(this),
      _updateSectionCardField: this._updateSectionCardField.bind(this),
      _updateSectionCardYaml: this._updateSectionCardYaml.bind(this),
      _openCardEditorForSectionCard: this._openCardEditorForSectionCard.bind(this),
      _openCardPickerForSection: this._openCardPickerForSection.bind(this),
      _addCustomBadge: this._addCustomBadge.bind(this),
      _removeCustomBadge: this._removeCustomBadge.bind(this),
      _updateCustomBadgeYaml: this._updateCustomBadgeYaml.bind(this),
    };
  }

  /** Typed panel facade; editor state and config events remain owned by this host. */
  private readonly _cardPickerHost = this.createCardPickerHost();

  createCardPickerHost() {
    // Live facade getters intentionally refer to the owning LitElement.
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const editor = this;
    return {
      get _cardPickerHasVisualEditor() {
        return editor._cardPickerHasVisualEditor;
      },
      set _cardPickerHasVisualEditor(value: typeof editor._cardPickerHasVisualEditor) {
        editor._cardPickerHasVisualEditor = value;
      },
      get _cardPickerSearch() {
        return editor._cardPickerSearch;
      },
      set _cardPickerSearch(value: typeof editor._cardPickerSearch) {
        editor._cardPickerSearch = value;
      },
      get _cardPickerSelectedType() {
        return editor._cardPickerSelectedType;
      },
      set _cardPickerSelectedType(value: typeof editor._cardPickerSelectedType) {
        editor._cardPickerSelectedType = value;
      },
      get _cardPickerStep() {
        return editor._cardPickerStep;
      },
      set _cardPickerStep(value: typeof editor._cardPickerStep) {
        editor._cardPickerStep = value;
      },
      get _cardPickerYaml() {
        return editor._cardPickerYaml;
      },
      set _cardPickerYaml(value: typeof editor._cardPickerYaml) {
        editor._cardPickerYaml = value;
      },
      _cardPickerYamlChanged: this._cardPickerYamlChanged.bind(this),
      _closeCardPicker: this._closeCardPicker.bind(this),
      _confirmCardPicker: this._confirmCardPicker.bind(this),
      _handlePickerOverlayClick: this._handlePickerOverlayClick.bind(this),
      _renderCardEditor: this._renderCardEditor.bind(this),
      _renderCardTypePicker: this._renderCardTypePicker.bind(this),
      _selectCardType: this._selectCardType.bind(this),
      requestUpdate: this.requestUpdate.bind(this),
      get shadowRoot() {
        return editor.shadowRoot;
      },
      get _cardPickerCallback() {
        return editor._cardPickerCallback;
      },
      set _cardPickerCallback(value: typeof editor._cardPickerCallback) {
        editor._cardPickerCallback = value;
      },
      get _cardPickerConfig() {
        return editor._cardPickerConfig;
      },
      set _cardPickerConfig(value: typeof editor._cardPickerConfig) {
        editor._cardPickerConfig = value;
      },
      get _cardPickerOpen() {
        return editor._cardPickerOpen;
      },
      set _cardPickerOpen(value: typeof editor._cardPickerOpen) {
        editor._cardPickerOpen = value;
      },
      get _hass() {
        return editor._hass;
      },
      set _hass(value: typeof editor._hass) {
        editor._hass = value;
      },
      _getEditableYamlCardConfig: this._getEditableYamlCardConfig.bind(this),
    };
  }
}

// Register custom element
customElements.define('dashboard-strategy-editor', Simon42DashboardStrategyEditor);
