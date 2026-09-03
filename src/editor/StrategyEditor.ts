// ====================================================================
// SIMON42 DASHBOARD STRATEGY - EDITOR (LitElement)
// ====================================================================
// Single-file LitElement editor replacing the previous 4-file
// vanilla HTMLElement + innerHTML pattern.
// ====================================================================

import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import yaml from 'js-yaml';

import type { HomeAssistant } from '../types/homeassistant';
import type {
  Simon42StrategyConfig,
  CustomView,
  CustomCard,
  CustomBadge,
  CustomSection,
  AreaCustomCard,
  AreasDisplay,
  PersonBadgeLayout,
  SectionKey,
  StackKey,
  AreaDisplayType,
  WeatherPresentation,
  WeatherSensorConfig,
  WeatherStartKey,
  WeatherStartLayoutItem,
} from '../types/strategy';
import {
  ALL_HEADING_KEYS,
  DEFAULT_SECTIONS_ORDER,
  DEFAULT_STACKS_ORDER,
  DEFAULT_WEATHER_START_ORDER,
} from '../types/strategy';
import type { AreaRegistryEntry } from '../types/registries';
import { localize } from '../utils/localize';
import { isDefaultShowName, resolveShowName } from '../utils/badge-utils';
import { mergeStacksOrder, normalizeAreasDisplay } from '../utils/name-utils';
import { stripLegacyAreaWebrtcCameras, stripLegacyOverviewLayoutConfig } from './editor-config-utils';
import { dispatchStrategyConfigChanged } from './editor-host';
import { extractedPanelStyles } from './editor-styles';
import { renderViewsPanel } from './panels/ViewsPanel';
import { renderRoomVisibilityPanel, renderUserVisibilityPanel } from './panels/VisibilityPanels';
import { renderDesignSection } from './panels/DesignPanel';
import { loadExpandedPanels, renderCollapsiblePanel } from './panels/panel-shell';
import { editorPanelMeta, WEATHER_START_BLOCK_META } from './editor-panel-registry';
import {
  createRoomEntities,
  findUpsEntityGroups,
  getAreaBadgeCandidates,
  getAvailableBadgeEntities,
  getEditableAreaEntities,
} from '../utils/area-entity-utils';
import { normalizeStrategyConfig } from '../utils/strategy-config';
import { setAreaDisplayTypeOverride, setGlobalAreaDisplayType } from './area-display-options';
import { isUtilityViewEnabled } from '../utils/summary-view-utils';

// -- Supporting types for the editor ------------------------------------

interface AlarmEntityOption {
  entity_id: string;
  name: string;
}

interface EntitySelectOption {
  entity_id: string;
  name: string;
  area_id?: string | null;
  device_area_id?: string | null;
}

interface DomainGroup {
  key: string;
  label: string;
  icon: string;
}

interface WeatherStartFloorOption {
  floor_id: string | null;
  name: string;
  icon?: string | null;
}

interface ParsedEditorYaml {
  parsed_config?: Record<string, any> | Record<string, any>[];
  _yaml_error?: string;
}

interface RefDashboardOption {
  url_path: string;
  title: string;
  views: Array<{ path?: string; title?: string; icon?: string; index: number }>;
}

function getYamlErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message.split('\n')[0] : 'UngÃ¼ltiges YAML';
  return message || 'UngÃ¼ltiges YAML';
}

function parseEditorYamlConfig(yamlString: string, invalidMessage: string): ParsedEditorYaml {
  if (!yamlString.trim()) return { parsed_config: undefined };

  try {
    const parsed = yaml.load(yamlString);
    if (parsed && typeof parsed === 'object') {
      return { parsed_config: parsed as Record<string, any> | Record<string, any>[] };
    }
    return { parsed_config: undefined, _yaml_error: invalidMessage };
  } catch (error: unknown) {
    return { parsed_config: undefined, _yaml_error: getYamlErrorMessage(error) };
  }
}

declare global {
  interface Window {
    customCards?: Array<{ type: string; name: string; description: string }>;
    cardTools?: unknown;
  }
}

// ====================================================================
// Card Type Registry (for visual card picker)
// ====================================================================

const CARD_TYPES: Array<{ type: string; name: string; icon: string; template: string }> = [
  { type: 'tile', name: 'Kachel', icon: 'mdi:square-rounded', template: 'type: tile\nentity: ""\n' },
  {
    type: 'entities',
    name: 'Entitätsliste',
    icon: 'mdi:format-list-bulleted',
    template: 'type: entities\nentities:\n  - entity: ""\n',
  },
  { type: 'glance', name: 'Glance', icon: 'mdi:eye', template: 'type: glance\nentities:\n  - entity: ""\n' },
  {
    type: 'button',
    name: 'Button',
    icon: 'mdi:gesture-tap-button',
    template: 'type: button\nentity: ""\ntap_action:\n  action: toggle\n',
  },
  {
    type: 'markdown',
    name: 'Text / Markdown',
    icon: 'mdi:language-markdown',
    template: 'type: markdown\ncontent: "**Text**"\n',
  },
  {
    type: 'heading',
    name: 'Überschrift',
    icon: 'mdi:format-header-1',
    template: 'type: heading\nheading: "Überschrift"\nheading_style: title\nicon: mdi:home\n',
  },
  {
    type: 'weather-forecast',
    name: 'Wettervorhersage',
    icon: 'mdi:weather-partly-cloudy',
    template: 'type: weather-forecast\nentity: ""\nshow_current: true\nshow_forecast: true\nforecast_type: daily\n',
  },
  { type: 'gauge', name: 'Messanzeige', icon: 'mdi:gauge', template: 'type: gauge\nentity: ""\nmin: 0\nmax: 100\n' },
  { type: 'thermostat', name: 'Thermostat', icon: 'mdi:thermostat', template: 'type: thermostat\nentity: ""\n' },
  {
    type: 'media-control',
    name: 'Mediensteuerung',
    icon: 'mdi:play-circle',
    template: 'type: media-control\nentity: ""\n',
  },
  {
    type: 'history-graph',
    name: 'Verlaufsgraph',
    icon: 'mdi:chart-line',
    template: 'type: history-graph\nentities:\n  - entity: ""\nhours_to_show: 24\n',
  },
  {
    type: 'statistics-graph',
    name: 'Statistikgraph',
    icon: 'mdi:chart-bar',
    template:
      'type: statistics-graph\nentities:\n  - entity: ""\nstat_types:\n  - mean\nchart_type: line\nperiod: 5minute\n',
  },
  { type: 'picture', name: 'Bild', icon: 'mdi:image', template: 'type: picture\nimage: ""\n' },
  {
    type: 'picture-entity',
    name: 'Entity-Bild',
    icon: 'mdi:image-outline',
    template: 'type: picture-entity\nentity: ""\n',
  },
  { type: 'map', name: 'Karte', icon: 'mdi:map', template: 'type: map\nentities:\n  - entity: ""\n' },
  {
    type: 'todo-list',
    name: 'Aufgabenliste',
    icon: 'mdi:checkbox-marked-circle',
    template: 'type: todo-list\nentity: ""\n',
  },
  { type: 'logbook', name: 'Logbuch', icon: 'mdi:history', template: 'type: logbook\nentity: ""\nhours_to_show: 24\n' },
  { type: 'alarm-panel', name: 'Alarmanlage', icon: 'mdi:shield-home', template: 'type: alarm-panel\nentity: ""\n' },
  {
    type: 'energy-distribution',
    name: 'Energieverteilung',
    icon: 'mdi:lightning-bolt',
    template: 'type: energy-distribution\n',
  },
  { type: 'grid', name: 'Raster', icon: 'mdi:grid', template: 'type: grid\ncards: []\n' },
];

// ====================================================================
// Editor Class
// ====================================================================

class Simon42DashboardStrategyEditor extends LitElement {
  static properties = {
    _config: { state: true },
    _expandedAreas: { state: true },
    _expandedGroups: { state: true },
    _expandedWeatherBlocks: { state: true },
    _cardPickerOpen: { state: true },
    _cardPickerStep: { state: true },
    _cardPickerSearch: { state: true },
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

  // Entity search state (NOT @state — we call requestUpdate manually)
  private _favoriteSearch = '';
  private _roomPinSearch = '';
  _expandedPanels = loadExpandedPanels();
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
  private _draggedElement: HTMLElement | null = null;
  private _sectionDraggedElement: HTMLElement | null = null;
  private _stackDraggedElement: HTMLElement | null = null;
  private _weatherStartDraggedElement: HTMLElement | null = null;

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

  set hass(hass: HomeAssistant) {
    const oldHass = this._hass;
    this._hass = hass;
    if (
      oldHass &&
      (oldHass.entities !== hass.entities || oldHass.devices !== hass.devices || oldHass.states !== hass.states)
    ) {
      this._entitySelectOptionsCache = null;
    }
    if (oldHass && (oldHass.areas !== hass.areas || oldHass.floors !== hass.floors)) {
      this._weatherStartAreaOptionsCache = null;
      this._weatherStartFloorOptionsCache = null;
      this._sortedAreasCache = null;
    }
    if (!oldHass) this.requestUpdate();
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
  }

  private _invalidateWeatherStartOptionsCaches(): void {
    this._weatherStartAreaOptionsCache = null;
    this._weatherStartFloorOptionsCache = null;
  }

  // -- Dependency check -------------------------------------------------

  private _checkSearchCardDependencies(): boolean {
    const hasSearchCard = customElements.get('search-card') !== undefined;
    const hasCardTools = customElements.get('card-tools') !== undefined;
    return hasSearchCard && hasCardTools;
  }

  // -- Entity helpers ---------------------------------------------------

  private _getAllEntitiesForSelect(): EntitySelectOption[] {
    if (!this._hass) return [];
    if (
      this._entitySelectOptionsCache &&
      this._entitySelectOptionsCache.entities === this._hass.entities &&
      this._entitySelectOptionsCache.devices === this._hass.devices &&
      this._entitySelectOptionsCache.states === this._hass.states
    ) {
      return this._entitySelectOptionsCache.options;
    }

    const entityMap = this._hass.entities || {};
    const devices = Object.values(this._hass.devices || {});

    // Build device-to-area lookup
    const deviceAreaMap = new Map<string, string>();
    devices.forEach((device) => {
      if (device.area_id) {
        deviceAreaMap.set(device.id, device.area_id);
      }
    });

    const hass = this._hass;
    const options = Object.keys(hass.states)
      .map((entityId) => {
        const stateObj = hass.states[entityId];
        const entity = entityMap[entityId];

        let areaId = entity?.area_id;
        if (!areaId && entity?.device_id) {
          areaId = deviceAreaMap.get(entity.device_id) ?? null;
        }

        return {
          entity_id: entityId,
          name: stateObj.attributes?.friendly_name || entityId.split('.')[1].replace(/_/g, ' '),
          area_id: areaId,
          device_area_id: areaId,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
    this._entitySelectOptionsCache = {
      entities: this._hass.entities,
      devices: this._hass.devices,
      states: this._hass.states,
      options,
    };
    return options;
  }

  private _getAlarmEntities(): AlarmEntityOption[] {
    if (!this._hass) return [];
    return Object.keys(this._hass.states)
      .filter((entityId) => entityId.startsWith('alarm_control_panel.'))
      .map((entityId) => {
        const stateObj = this._hass!.states[entityId];
        return {
          entity_id: entityId,
          name: stateObj.attributes?.friendly_name || entityId.split('.')[1].replace(/_/g, ' '),
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  private _getHouseModeEntities(): AlarmEntityOption[] {
    if (!this._hass) return [];
    return Object.keys(this._hass.states)
      .filter((entityId) => entityId.startsWith('input_select.') || entityId.startsWith('select.'))
      .filter((entityId) => {
        const category = this._hass?.entities[entityId]?.entity_category;
        return category !== 'config' && category !== 'diagnostic';
      })
      .map((entityId) => ({
        entity_id: entityId,
        name: this._hass!.states[entityId].attributes?.friendly_name || entityId.split('.')[1].replace(/_/g, ' '),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  private _getWeatherEntities(): { entity_id: string; name: string }[] {
    if (!this._hass) return [];
    return Object.keys(this._hass.states)
      .filter((entityId) => entityId.startsWith('weather.'))
      .map((entityId) => {
        const stateObj = this._hass!.states[entityId];
        return {
          entity_id: entityId,
          name: stateObj.attributes?.friendly_name || entityId.split('.')[1].replace(/_/g, ' '),
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  private _getEntitiesByDomains(domains: string[]): { entity_id: string; name: string }[] {
    if (!this._hass) return [];
    const allowed = new Set(domains);
    return Object.keys(this._hass.states)
      .filter((entityId) => allowed.has(entityId.split('.')[0]))
      .map((entityId) => {
        const stateObj = this._hass!.states[entityId];
        return {
          entity_id: entityId,
          name: stateObj.attributes?.friendly_name || entityId,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  private _formatEntityList(value?: string[]): string {
    return (value || []).join(', ');
  }

  private _formatWeatherSensors(value?: WeatherSensorConfig[]): string {
    return (value || [])
      .map((sensor) => [sensor.entity, sensor.icon || '', sensor.unit || '', sensor.round ?? ''].join('|'))
      .join('\n');
  }

  private _parseEntityList(value: string): string[] {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  private _parseWeatherSensors(value: string): WeatherSensorConfig[] {
    return value
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [entity, icon, unit, round] = line.split('|').map((part) => part.trim());
        const parsedRound = round === undefined || round === '' ? undefined : Number.parseInt(round, 10);
        return {
          entity,
          ...(icon ? { icon } : {}),
          ...(unit ? { unit } : {}),
          ...(Number.isInteger(parsedRound) ? { round: parsedRound } : {}),
        };
      })
      .filter((sensor) => sensor.entity.includes('.'));
  }

  private _getThemeNames(): string[] {
    if (!this._hass?.themes?.themes) return [];
    return Object.keys(this._hass.themes.themes).sort((a, b) => a.localeCompare(b));
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

  static styles = [
    extractedPanelStyles,
    css`
      /* -- Base layout --------------------------------------------------- */
      .card-config {
        padding: 16px;
        font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
        font-size: var(--mdc-typography-body1-font-size, 14px);
        color: var(--primary-text-color);
      }
      .section {
        margin-bottom: 16px;
        background: var(--card-background-color, #fff);
        border: 1px solid var(--divider-color, #e8e8e8);
        border-radius: var(--ha-card-border-radius, 12px);
        padding: 16px;
        transition: box-shadow 0.2s ease;
      }
      .section.panel {
        padding: 0;
        overflow: visible;
      }
      .section.panel.collapsed {
        overflow: hidden;
      }
      .panel-header {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        padding: 13px 16px;
        background: none;
        border: none;
        cursor: pointer;
        font: inherit;
        color: var(--primary-text-color);
        text-align: left;
      }
      .panel-header:hover {
        background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
      }
      .panel-icon {
        --mdc-icon-size: 20px;
        color: var(--primary-color);
      }
      .panel-title {
        flex: 1;
        font-size: 15px;
        font-weight: 500;
      }
      .panel-chevron {
        --mdc-icon-size: 22px;
        color: var(--secondary-text-color);
        transition: transform 0.2s ease;
      }
      .panel.collapsed .panel-chevron {
        transform: rotate(-90deg);
      }
      .panel-body {
        padding: 12px 16px 16px;
        border-top: 1px solid var(--divider-color, #e8e8e8);
      }
      .section-title {
        font-size: 15px;
        font-weight: 500;
        margin: 0 0 12px 0;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--divider-color, #e8e8e8);
        color: var(--primary-text-color);
        letter-spacing: 0.01em;
      }

      /* -- Form rows ----------------------------------------------------- */
      .form-row {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
      }
      .form-row input[type='checkbox'],
      .form-row input[type='radio'] {
        margin-right: 8px;
        width: 18px;
        height: 18px;
        cursor: pointer;
        accent-color: var(--primary-color);
      }
      .form-row input[type='checkbox']:disabled,
      .form-row input[type='radio']:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
      .form-row label {
        cursor: pointer;
        user-select: none;
        font-size: 14px;
        color: var(--primary-text-color);
      }
      .form-row label.disabled-label {
        cursor: not-allowed;
        opacity: 0.5;
      }
      .form-row .alarm-select {
        flex: 1;
        max-width: 300px;
      }
      .description {
        font-size: 12px;
        color: var(--secondary-text-color);
        margin: 2px 0 12px 26px;
        line-height: 1.4;
      }
      .description strong {
        font-weight: 600;
        color: var(--primary-text-color);
      }
      .option-groups {
        display: grid;
        gap: 12px;
        margin-bottom: 14px;
      }
      .option-group {
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        padding: 12px;
        background: var(--secondary-background-color);
      }
      .option-group-title {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 10px;
        font-size: 13px;
        font-weight: 600;
        color: var(--primary-text-color);
      }
      .option-group-title ha-icon {
        --mdc-icon-size: 18px;
        color: var(--secondary-text-color);
      }
      .option-group .description {
        margin-bottom: 10px;
      }
      .option-group .description:last-child {
        margin-bottom: 0;
      }

      /* -- Native <select> — HA-like ------------------------------------- */
      select,
      .form-row select {
        cursor: pointer;
        font-family: inherit;
        font-size: 14px;
        padding: 10px 32px 10px 12px;
        border: 1px solid var(--divider-color);
        border-radius: var(--ha-card-border-radius, 12px);
        background-color: var(--card-background-color);
        color: var(--primary-text-color);
        appearance: none;
        -webkit-appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24'%3E%3Cpath fill='%236e6e6e' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 10px center;
        background-size: 16px;
        transition: border-color 0.2s ease;
      }
      select:focus,
      .form-row select:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 1px var(--primary-color);
      }
      select:hover,
      .form-row select:hover {
        border-color: var(--primary-color);
      }

      /* -- Native <input type="text/number"> — HA-like ------------------- */
      input[type='text'],
      input[type='number'] {
        font-family: inherit;
        font-size: 14px;
        padding: 10px 12px;
        border: 1px solid var(--divider-color);
        border-radius: var(--ha-card-border-radius, 12px);
        background: var(--card-background-color);
        color: var(--primary-text-color);
        transition: border-color 0.2s ease;
        box-sizing: border-box;
      }
      input[type='text']:focus,
      input[type='number']:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 1px var(--primary-color);
      }
      input[type='text']:hover,
      input[type='number']:hover {
        border-color: var(--primary-color);
      }
      input[type='text']::placeholder {
        color: var(--secondary-text-color);
        opacity: 0.7;
      }

      /* -- Native <textarea> — YAML editors ------------------------------ */
      textarea {
        font-family: 'Roboto Mono', 'SFMono-Regular', 'Consolas', 'Liberation Mono', monospace;
        font-size: 12px;
        line-height: 1.5;
        padding: 12px;
        border: 1px solid var(--divider-color);
        border-radius: var(--ha-card-border-radius, 12px);
        background: var(--card-background-color);
        color: var(--primary-text-color);
        resize: vertical;
        min-height: 80px;
        box-sizing: border-box;
        transition: border-color 0.2s ease;
        tab-size: 2;
      }
      textarea:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 1px var(--primary-color);
      }
      textarea:hover {
        border-color: var(--primary-color);
      }
      textarea::placeholder {
        color: var(--secondary-text-color);
        opacity: 0.7;
        font-family: inherit;
      }

      /* -- Buttons — HA-like --------------------------------------------- */
      button {
        font-family: inherit;
        font-size: 14px;
      }
      .btn-primary {
        padding: 10px 20px;
        border-radius: var(--ha-card-border-radius, 12px);
        border: none;
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
        cursor: pointer;
        font-weight: 500;
        transition:
          opacity 0.2s ease,
          box-shadow 0.2s ease;
        white-space: nowrap;
      }
      .btn-primary:hover {
        opacity: 0.85;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
      }
      .btn-primary:active {
        opacity: 0.75;
      }
      .btn-remove {
        padding: 6px 10px;
        border-radius: 8px;
        border: 1px solid var(--divider-color);
        background: var(--card-background-color);
        color: var(--secondary-text-color);
        cursor: pointer;
        font-size: 14px;
        transition:
          color 0.2s ease,
          border-color 0.2s ease;
        line-height: 1;
      }
      .btn-remove:hover {
        color: var(--error-color, #db4437);
        border-color: var(--error-color, #db4437);
      }
      .icon-btn {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--secondary-text-color);
        padding: 4px;
        border-radius: 4px;
        display: inline-flex;
        align-items: center;
        transition: color 0.15s ease;
      }
      .icon-btn:hover {
        color: var(--primary-text-color);
      }
      .text-btn {
        background: none;
        border: 1px solid var(--divider-color);
        cursor: pointer;
        color: var(--secondary-text-color);
        padding: 6px 12px;
        border-radius: 8px;
        font-size: 13px;
        transition:
          color 0.15s ease,
          border-color 0.15s ease;
      }
      .text-btn:hover {
        color: var(--primary-text-color);
        border-color: var(--primary-color);
      }

      /* -- Area list ----------------------------------------------------- */
      .area-list {
        border: 1px solid var(--divider-color);
        border-radius: var(--ha-card-border-radius, 12px);
        overflow: hidden;
      }
      .area-item {
        border-bottom: 1px solid var(--divider-color);
        background: var(--card-background-color);
      }
      .area-item:last-child {
        border-bottom: none;
      }
      .area-item.dragging {
        opacity: 0.5;
      }
      .area-item.drag-over {
        border-top: 2px solid var(--primary-color);
      }
      .area-header {
        display: flex;
        align-items: center;
        padding: 12px 16px;
      }
      .drag-handle {
        margin-right: 12px;
        color: var(--secondary-text-color);
        cursor: grab;
        user-select: none;
        padding: 4px;
      }
      .drag-handle:active {
        cursor: grabbing;
      }
      .area-checkbox {
        margin-right: 12px;
        accent-color: var(--primary-color);
      }
      .area-name {
        flex: 1;
        font-size: 14px;
        font-weight: 500;
      }
      .area-icon {
        margin-left: 8px;
        margin-right: 12px;
        color: var(--secondary-text-color);
      }
      .nav-pin-button {
        background: none;
        border: none;
        padding: 4px;
        cursor: pointer;
        color: var(--secondary-text-color);
        opacity: 0.4;
        transition:
          opacity 0.15s,
          color 0.15s;
        display: flex;
        align-items: center;
      }
      .nav-pin-button.pinned {
        color: var(--primary-color);
        opacity: 1;
      }
      .nav-pin-button:hover:not(:disabled) {
        opacity: 1;
      }
      .nav-pin-button:disabled {
        opacity: 0.2;
        cursor: not-allowed;
      }
      .expand-button {
        background: none;
        border: none;
        padding: 4px 8px;
        cursor: pointer;
        color: var(--secondary-text-color);
        transition: transform 0.2s;
      }
      .expand-button:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }
      .expand-button.expanded .expand-icon {
        transform: rotate(90deg);
      }
      .expand-icon {
        display: inline-block;
        transition: transform 0.2s;
      }
      .area-content {
        padding: 0 12px 12px 48px;
        background: var(--secondary-background-color);
      }
      .loading-placeholder {
        padding: 12px;
        text-align: center;
        color: var(--secondary-text-color);
        font-style: italic;
      }

      /* -- Section order list --------------------------------------------- */
      .section-order-list {
        border: 1px solid var(--divider-color);
        border-radius: var(--ha-card-border-radius, 12px);
        overflow: hidden;
      }
      .section-order-item {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        border-bottom: 1px solid var(--divider-color);
        background: var(--card-background-color);
        transition: opacity 0.2s;
      }
      .section-order-item:last-child {
        border-bottom: none;
      }
      .section-order-item.dragging {
        opacity: 0.4;
      }
      .section-order-item.drag-over {
        border-top: 2px solid var(--primary-color);
      }
      .section-order-item.disabled {
        opacity: 0.5;
      }
      .section-order-item .drag-handle {
        margin-right: 12px;
        color: var(--secondary-text-color);
        cursor: grab;
        user-select: none;
        padding: 4px;
      }
      .section-order-item .drag-handle:active {
        cursor: grabbing;
      }
      .section-order-item .section-icon {
        margin-right: 10px;
        color: var(--secondary-text-color);
        --mdc-icon-size: 20px;
      }
      .section-order-item .section-label {
        flex: 1;
        font-size: 14px;
        font-weight: 500;
      }
      .section-order-item .section-hidden-tag {
        font-size: 12px;
        color: var(--secondary-text-color);
        font-style: italic;
        margin-left: 8px;
      }
      .section-order-item .section-toggle {
        margin-left: auto;
        cursor: pointer;
      }
      .section-order-item .section-toggle input {
        cursor: pointer;
        width: 16px;
        height: 16px;
      }
      .section-order-sub {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px 8px 56px;
        border-bottom: 1px solid var(--divider-color);
        font-size: 13px;
        color: var(--secondary-text-color);
      }
      .section-order-sub input {
        cursor: pointer;
      }
      .section-order-sub label {
        cursor: pointer;
      }
      .section-order-compact {
        margin-top: 8px;
        padding: 10px 12px;
        border: 1px dashed var(--divider-color);
        border-radius: 8px;
        background: var(--secondary-background-color);
      }
      .compact-title {
        margin-bottom: 8px;
        font-size: 12px;
        font-weight: 500;
        color: var(--secondary-text-color);
      }
      .compact-chip-list {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .compact-chip {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        border-radius: 999px;
        background: var(--card-background-color);
        color: var(--secondary-text-color);
        font-size: 12px;
        border: 1px solid var(--divider-color);
      }
      .compact-chip ha-icon {
        --mdc-icon-size: 14px;
      }

      /* -- Entity groups ------------------------------------------------- */
      .entity-groups {
        padding-top: 8px;
      }
      .entity-group {
        margin-bottom: 8px;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: var(--card-background-color);
        overflow: hidden;
      }
      .entity-group-header {
        display: flex;
        align-items: center;
        padding: 10px 12px;
        cursor: pointer;
        user-select: none;
        transition: background-color 0.15s ease;
      }
      .entity-group-header:hover {
        background: var(--secondary-background-color);
      }
      .group-checkbox {
        margin-right: 8px;
        width: 16px;
        height: 16px;
        cursor: pointer;
        accent-color: var(--primary-color);
      }
      .group-checkbox[data-indeterminate='true'] {
        opacity: 0.6;
      }
      .entity-group-header ha-icon {
        margin-right: 8px;
        --mdc-icon-size: 18px;
        color: var(--secondary-text-color);
      }
      .group-name {
        flex: 1;
        font-weight: 500;
        font-size: 14px;
      }
      .entity-count {
        color: var(--secondary-text-color);
        font-size: 12px;
        margin-right: 8px;
      }
      .expand-button-small {
        background: none;
        border: none;
        padding: 4px;
        cursor: pointer;
        color: var(--secondary-text-color);
      }
      .expand-button-small.expanded .expand-icon-small {
        transform: rotate(90deg);
      }
      .expand-icon-small {
        display: inline-block;
        font-size: 12px;
        transition: transform 0.2s;
      }

      /* -- Entity list --------------------------------------------------- */
      .entity-list {
        padding: 8px 12px 8px 36px;
        border-top: 1px solid var(--divider-color);
      }
      .entity-item {
        display: flex;
        align-items: center;
        padding: 6px 0;
      }
      .entity-checkbox {
        margin-right: 8px;
        width: 16px;
        height: 16px;
        cursor: pointer;
        accent-color: var(--primary-color);
      }
      .entity-name {
        flex: 1;
        font-size: 14px;
      }
      .entity-id {
        font-size: 11px;
        color: var(--secondary-text-color);
        font-family: 'Roboto Mono', monospace;
        margin-left: 8px;
      }
      .empty-state {
        padding: 24px;
        text-align: center;
        color: var(--secondary-text-color);
        font-style: italic;
      }

      /* -- Badge entity management --------------------------------------- */
      .badge-separator {
        padding: 8px 0 4px;
        font-size: 12px;
        font-weight: 500;
        color: var(--secondary-text-color);
        border-top: 1px dashed var(--divider-color);
        margin-top: 4px;
      }
      .badge-additional-item {
        padding-left: 0;
      }
      .badge-remove-btn {
        background: none;
        border: none;
        padding: 2px 6px;
        cursor: pointer;
        color: var(--error-color, #db4437);
        font-size: 14px;
        margin-left: 8px;
        border-radius: 4px;
        transition: background-color 0.15s ease;
      }
      .badge-remove-btn:hover {
        background: var(--secondary-background-color);
      }
      .badge-add-section {
        display: flex;
        gap: 8px;
        padding: 8px 0 4px;
        align-items: center;
      }
      .badge-entity-picker {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font-size: 13px;
      }
      .badge-add-button {
        padding: 8px 16px;
        border: none;
        border-radius: 8px;
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
        cursor: pointer;
        font-size: 13px;
        font-weight: 500;
        white-space: nowrap;
        transition: opacity 0.2s ease;
      }
      .badge-add-button:hover {
        opacity: 0.85;
      }
      .badge-name-checkbox {
        margin-left: auto;
        margin-right: 2px;
        width: 14px;
        height: 14px;
        cursor: pointer;
        accent-color: var(--primary-color);
      }
      .badge-name-label {
        font-size: 11px;
        color: var(--secondary-text-color);
        margin-right: 8px;
        white-space: nowrap;
      }

      /* -- Entity search picker ------------------------------------------ */
      .entity-search-picker {
        position: relative;
        flex: 1;
        min-width: 0;
      }
      .entity-search-input {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid var(--divider-color);
        border-radius: var(--ha-card-border-radius, 12px);
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font-family: inherit;
        font-size: 14px;
        box-sizing: border-box;
        transition: border-color 0.2s ease;
      }
      .entity-search-input:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 1px var(--primary-color);
      }
      .entity-search-input::placeholder {
        color: var(--secondary-text-color);
        opacity: 0.7;
      }
      .entity-search-results {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        z-index: 10;
        margin-top: 4px;
        border: 1px solid var(--divider-color);
        border-radius: var(--ha-card-border-radius, 12px);
        background: var(--card-background-color);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        overflow: hidden;
        max-height: 320px;
        overflow-y: auto;
      }
      .entity-search-result {
        display: flex;
        flex-direction: column;
        padding: 10px 14px;
        cursor: pointer;
        transition: background-color 0.1s ease;
        border-bottom: 1px solid var(--divider-color);
      }
      .entity-search-result:last-child {
        border-bottom: none;
      }
      .entity-search-result:hover {
        background: var(--secondary-background-color);
      }
      .entity-search-result .entity-search-name {
        font-size: 14px;
        font-weight: 500;
        color: var(--primary-text-color);
      }
      .entity-search-result .entity-search-id {
        font-size: 11px;
        color: var(--secondary-text-color);
        font-family: 'Roboto Mono', monospace;
        margin-top: 2px;
      }
      .entity-search-no-results {
        padding: 12px 14px;
        color: var(--secondary-text-color);
        font-style: italic;
        font-size: 13px;
      }

      /* -- Favorites / Room Pins list items ------------------------------ */
      .entity-list-container {
        border: 1px solid var(--divider-color);
        border-radius: var(--ha-card-border-radius, 12px);
        overflow: hidden;
      }
      .entity-list-item {
        display: flex;
        align-items: center;
        padding: 10px 14px;
        border-bottom: 1px solid var(--divider-color);
        background: var(--card-background-color);
        transition: background-color 0.1s ease;
      }
      .entity-list-item:last-child {
        border-bottom: none;
      }
      .entity-list-item:hover {
        background: var(--secondary-background-color);
      }
      .entity-list-item .drag-icon {
        margin-right: 12px;
        color: var(--secondary-text-color);
        font-size: 16px;
        cursor: grab;
        user-select: none;
        padding: 4px;
      }
      .entity-list-item .drag-icon:active {
        cursor: grabbing;
      }
      .entity-list-item.dragging {
        opacity: 0.5;
      }
      .entity-list-item.drag-over {
        border-top: 2px solid var(--primary-color);
      }
      .entity-list-item .item-info {
        flex: 1;
        min-width: 0;
        font-size: 14px;
      }
      .entity-list-item .item-name {
        font-weight: 500;
        color: var(--primary-text-color);
      }
      .entity-list-item .item-entity-id {
        margin-left: 8px;
        font-size: 12px;
        color: var(--secondary-text-color);
        font-family: 'Roboto Mono', monospace;
      }
      .entity-list-item .item-area {
        display: block;
        font-size: 11px;
        color: var(--secondary-text-color);
        margin-top: 2px;
      }

      /* -- Custom view/card/badge items ---------------------------------- */
      .custom-item {
        border: 1px solid var(--divider-color);
        border-radius: var(--ha-card-border-radius, 12px);
        padding: 16px;
        margin-bottom: 12px;
        background: var(--card-background-color);
      }
      .custom-item-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }
      .custom-item-header strong {
        font-size: 14px;
        font-weight: 500;
      }
      .custom-item-fields {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .area-custom-card-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .custom-card-target {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
      }
      .custom-card-target label {
        color: var(--secondary-text-color);
        white-space: nowrap;
      }
      .custom-card-target select {
        flex: 1;
        padding: 4px 8px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font-size: 13px;
      }
      .custom-item-row {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        min-width: 0;
      }
      .custom-item-row > * {
        min-width: 0;
      }
      .weather-start-add-row {
        align-items: stretch;
        margin-top: 10px;
      }
      .weather-start-add-row .btn-primary {
        flex: 0 1 auto;
        padding: 10px 14px;
      }
      .weather-start-add-row select {
        flex: 1 1 180px;
        min-width: 160px;
      }
      .custom-item-validation {
        font-size: 12px;
        min-height: 16px;
      }
      .custom-content-grid {
        display: grid;
        gap: 12px;
      }
      .editor-subsection {
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: var(--secondary-background-color);
        padding: 12px;
      }
      .subsection-title {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 10px;
        font-size: 14px;
        font-weight: 600;
        color: var(--primary-text-color);
      }
      .subsection-title a {
        margin-left: auto;
        color: var(--primary-color);
        text-decoration: none;
        font-size: 16px;
      }

      /* -- Section dividers ---------------------------------------------- */
      .section-divider {
        margin: 28px 0 12px;
        padding: 0;
      }
      .section-divider-title {
        font-size: 13px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--secondary-text-color);
      }

      /* -- Mobile responsive --------------------------------------------- */
      @media (max-width: 600px) {
        .card-config {
          padding: 12px 8px;
        }
        .section {
          margin-bottom: 16px;
        }
        .section-title {
          font-size: 15px;
          margin-bottom: 8px;
        }
        .form-row {
          flex-wrap: wrap;
          gap: 4px;
        }
        .form-row label {
          font-size: 13px;
        }
        .description {
          margin-left: 26px;
          margin-bottom: 12px;
          font-size: 11px;
        }

        select,
        .form-row select {
          width: 100%;
          min-width: 0;
          font-size: 13px;
          padding: 8px 28px 8px 10px;
        }
        input[type='text'],
        input[type='number'] {
          width: 100%;
          font-size: 13px;
          padding: 8px 10px;
        }
        textarea {
          font-size: 11px;
          padding: 10px;
          min-height: 60px;
        }

        .entity-search-picker {
          width: 100%;
        }
        .entity-search-results {
          max-height: 240px;
        }
        .entity-search-result {
          padding: 8px 10px;
        }

        .area-header {
          padding: 10px 12px;
        }
        .area-content {
          padding: 0 8px 8px 24px;
        }
        .entity-list {
          padding: 6px 8px 6px 16px;
        }

        .custom-item {
          padding: 12px;
        }
        .custom-item-row {
          flex-direction: column;
        }
        .weather-start-add-row .btn-primary,
        .weather-start-add-row select {
          width: 100%;
        }

        .entity-list-item {
          padding: 8px 10px;
        }
        .entity-list-item .item-entity-id {
          display: block;
          margin-left: 0;
          margin-top: 2px;
        }

        .badge-add-section {
          flex-wrap: wrap;
        }

        .btn-primary {
          padding: 8px 16px;
          font-size: 13px;
        }
      }

      /* -- Card Picker Overlay -------------------------------------------- */
      .card-picker-overlay {
        position: fixed;
        inset: 0;
        z-index: 9999;
        background: rgba(0, 0, 0, 0.55);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
      }
      .card-picker-dialog {
        background: var(--card-background-color, #fff);
        border-radius: var(--ha-card-border-radius, 12px);
        width: 100%;
        max-width: 560px;
        max-height: 82vh;
        display: flex;
        flex-direction: column;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        overflow: hidden;
      }
      .card-picker-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        border-bottom: 1px solid var(--divider-color);
        flex-shrink: 0;
      }
      .card-picker-header-title {
        flex: 1;
        font-weight: 500;
        font-size: 15px;
        color: var(--primary-text-color);
      }
      .card-picker-icon-btn {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--secondary-text-color);
        padding: 4px;
        border-radius: 4px;
        display: inline-flex;
        align-items: center;
        line-height: 1;
        transition: color 0.15s ease;
      }
      .card-picker-icon-btn:hover {
        color: var(--primary-text-color);
      }
      .card-picker-search-row {
        padding: 10px 16px 6px;
        flex-shrink: 0;
      }
      .card-picker-search-row input {
        width: 100%;
        box-sizing: border-box;
        padding: 8px 12px;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: var(--secondary-background-color);
        color: var(--primary-text-color);
        font-size: 13px;
        font-family: inherit;
        outline: none;
      }
      .card-picker-search-row input:focus {
        border-color: var(--primary-color);
      }
      .card-type-grid {
        flex: 1;
        overflow-y: auto;
        padding: 8px 16px 16px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
      }
      .card-type-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 12px 6px;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: var(--secondary-background-color);
        cursor: pointer;
        gap: 6px;
        transition:
          border-color 0.15s ease,
          background 0.15s ease;
        font-family: inherit;
        min-height: 72px;
      }
      .card-type-btn:hover {
        border-color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 8%, var(--card-background-color));
      }
      .card-type-btn ha-icon {
        color: var(--primary-color);
      }
      .card-type-btn span {
        font-size: 11px;
        color: var(--primary-text-color);
        text-align: center;
        line-height: 1.3;
      }
      .card-editor-content {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .card-editor-visual-host {
        display: block;
      }
      .card-editor-yaml-label {
        font-size: 12px;
        color: var(--secondary-text-color);
      }
      .card-editor-yaml-area {
        width: 100%;
        box-sizing: border-box;
        min-height: 160px;
        padding: 10px 12px;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: var(--secondary-background-color);
        color: var(--primary-text-color);
        font-size: 12px;
        font-family: monospace;
        resize: vertical;
        outline: none;
      }
      .card-editor-yaml-area:focus {
        border-color: var(--primary-color);
      }
      .card-picker-footer {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        padding: 12px 16px;
        border-top: 1px solid var(--divider-color);
        flex-shrink: 0;
      }
      .btn-secondary {
        padding: 10px 20px;
        border-radius: var(--ha-card-border-radius, 12px);
        border: 1px solid var(--divider-color);
        background: var(--card-background-color);
        color: var(--primary-text-color);
        cursor: pointer;
        font-weight: 500;
        font-family: inherit;
        font-size: 14px;
        transition: border-color 0.2s ease;
      }
      .btn-secondary:hover {
        border-color: var(--primary-color);
      }
      .advanced-toggle {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 14px 16px;
        border: 1px solid var(--divider-color);
        border-radius: var(--ha-card-border-radius, 12px);
        background: var(--secondary-background-color);
        color: var(--primary-text-color);
        cursor: pointer;
        font-size: 15px;
        font-weight: 600;
        text-align: left;
      }
      .advanced-toggle ha-icon:last-child {
        margin-left: auto;
        transition: transform 0.2s ease;
      }
      .advanced-toggle[aria-expanded='true'] ha-icon:last-child {
        transform: rotate(180deg);
      }
      .advanced-content {
        margin-top: 16px;
        padding-left: 12px;
        border-left: 3px solid var(--divider-color);
      }
    `,
  ];

  // -- Main render ------------------------------------------------------

  protected render() {
    if (!this._hass) return nothing;

    return html`
      <div class="card-config">
        ${renderCollapsiblePanel(this, editorPanelMeta('overview'), () => this._renderBasicOverviewSection())}
        ${renderCollapsiblePanel(this, editorPanelMeta('summaries'), () => this._renderBasicSummariesSection())}
        ${renderCollapsiblePanel(this, editorPanelMeta('favorites'), () => this._renderFavoritesSection())}

        <div class="section-divider">
          <div class="section-divider-title">${localize('editor.section_areas_rooms')}</div>
        </div>

        ${renderCollapsiblePanel(this, editorPanelMeta('areas'), () => this._renderAreasListSection())}
        ${renderCollapsiblePanel(this, editorPanelMeta('areaOptions'), () => this._renderAreasSection())}
        ${renderCollapsiblePanel(this, editorPanelMeta('roomPins'), () => this._renderRoomPinsSection())}
        ${renderCollapsiblePanel(this, editorPanelMeta('views'), () => this._renderViewsSection())}

        <div class="section-divider"><div class="section-divider-title">${localize('editor.section_advanced')}</div></div>
        ${renderCollapsiblePanel(this, editorPanelMeta('appearance'), () => this._renderOverviewSection())}
        ${renderCollapsiblePanel(this, editorPanelMeta('details'), () => this._renderSummariesSection())}
        ${renderCollapsiblePanel(this, editorPanelMeta('sectionOrder'), () => this._renderWeatherStartOrderPanel())}
        ${renderCollapsiblePanel(this, editorPanelMeta('advanced'), () => this._renderAdvancedOptionsSection())}
        ${renderCollapsiblePanel(this, editorPanelMeta('customContent'), () => this._renderCustomContentSection())}
      </div>
      ${this._cardPickerOpen ? this._renderCardPickerOverlay() : nothing}
    `;
  }

  // ====================================================================
  // SECTION RENDERERS
  // ====================================================================

  // -- Section order panel -----------------------------------------------

  private _renderAdvancedOptionsSection(): TemplateResult {
    const hideUnavailableEntities = this._config.hide_unavailable_entities === true;
    const denseSectionPlacement = this._config.dense_section_placement === true;

    return html`
      <div class="section">
        <div class="section-title">${localize('editor.section_advanced_options')}</div>

        ${this._renderCheckbox(
          'hide-unavailable-entities',
          localize('editor.hide_unavailable_entities'),
          hideUnavailableEntities,
          (checked) => this._toggleChanged('hide_unavailable_entities', checked, false)
        )}
        <div class="description">${localize('editor.hide_unavailable_entities_desc')}</div>

        ${this._renderCheckbox(
          'dense-section-placement',
          localize('editor.dense_section_placement'),
          denseSectionPlacement,
          (checked) => this._toggleChanged('dense_section_placement', checked, false)
        )}
        <div class="description">${localize('editor.dense_section_placement_desc')}</div>
      </div>
    `;
  }

  private _getSectionsOrder(): SectionKey[] {
    return this._config.sections_order || [...DEFAULT_SECTIONS_ORDER];
  }

  private _updateSectionsOrder(newOrder: SectionKey[]): void {
    const newConfig: Simon42StrategyConfig = {
      ...this._config,
      sections_order: newOrder,
    };
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  private _isSectionDisabled(key: SectionKey): boolean {
    switch (key) {
      case 'custom_cards':
        return (this._config.custom_cards || []).length === 0;
      case 'custom_sections':
        return (this._config.custom_sections || []).length === 0;
      case 'weather':
        return this._config.show_weather === false;
      case 'energy':
        return this._config.show_energy === false;
      case 'plants':
        return this._config.show_plants_section === false;
      case 'agenda':
        return this._config.show_agenda_section === false;
      case 'todos':
        return this._config.show_todos_section === false;
      case 'persons':
        return this._config.show_persons_section !== true;
      case 'vacuums':
        return this._config.show_vacuums_section === false;
      case 'maintenance':
        return this._config.show_maintenance_section === false;
      default:
        return false;
    }
  }

  private static _sectionMeta = new Map<SectionKey, { icon: string; labelKey: string }>([
    ['overview', { icon: 'mdi:home-outline', labelKey: 'sections.overview' }],
    ['custom_cards', { icon: 'mdi:cards', labelKey: 'sections.custom_cards' }],
    ['custom_sections', { icon: 'mdi:view-grid-plus-outline', labelKey: 'sections.custom_sections' }],
    ['areas', { icon: 'mdi:floor-plan', labelKey: 'sections.areas' }],
    ['weather', { icon: 'mdi:weather-partly-cloudy', labelKey: 'sections.weather' }],
    ['energy', { icon: 'mdi:lightning-bolt', labelKey: 'sections.energy' }],
    ['plants', { icon: 'mdi:flower-outline', labelKey: 'sections.plants' }],
    ['agenda', { icon: 'mdi:calendar-outline', labelKey: 'sections.agenda' }],
    ['todos', { icon: 'mdi:checkbox-marked-circle-outline', labelKey: 'sections.todos' }],
    ['persons', { icon: 'mdi:account-group-outline', labelKey: 'sections.persons' }],
    ['vacuums', { icon: 'mdi:robot-vacuum', labelKey: 'sections.vacuums' }],
    ['maintenance', { icon: 'mdi:wrench-outline', labelKey: 'sections.maintenance' }],
  ]);

  private _isSectionToggleable(key: SectionKey): boolean {
    return ['weather', 'energy', 'plants', 'agenda', 'todos', 'persons', 'vacuums', 'maintenance'].includes(key);
  }

  private _toggleSectionVisibility(key: SectionKey, visible: boolean): void {
    if (key === 'weather') {
      this._toggleChanged('show_weather', visible, true);
    } else if (key === 'energy') {
      this._toggleChanged('show_energy', visible, true);
    } else if (key === 'plants') {
      this._toggleChanged('show_plants_section', visible, false);
    } else if (key === 'agenda') {
      this._toggleChanged('show_agenda_section', visible, false);
    } else if (key === 'todos') {
      this._toggleChanged('show_todos_section', visible, false);
    } else if (key === 'persons') {
      this._toggleChanged('show_persons_section', visible, false);
    } else if (key === 'vacuums') {
      this._toggleChanged('show_vacuums_section', visible, false);
    } else if (key === 'maintenance') {
      this._toggleChanged('show_maintenance_section', visible, false);
    }
  }

  private _toggleHiddenHeading(key: string, hide: boolean): void {
    const current = new Set(this._config.hidden_section_headings || []);
    if (hide) current.add(key as any);
    else current.delete(key as any);

    const updated: Simon42StrategyConfig = { ...this._config };
    if (current.size === 0) delete updated.hidden_section_headings;
    else updated.hidden_section_headings = [...current] as any;

    this._config = updated;
    this._fireConfigChanged(updated);
  }

  private _sectionVisibilityChanged(sectionKey: SectionKey, field: 'entity' | 'state', value: string): void {
    const updated: Simon42StrategyConfig = { ...this._config };
    const current = { ...(updated.section_visibility || {}) };
    const rule = { ...(current[sectionKey] || { entity: '', state: '' }) };
    rule[field] = value.trim();

    if (!rule.entity && !rule.state) delete current[sectionKey];
    else current[sectionKey] = rule;

    if (Object.keys(current).length === 0) delete updated.section_visibility;
    else updated.section_visibility = current;

    this._config = updated;
    this._fireConfigChanged(updated);
  }

  private _renderSectionOrderPanel(): TemplateResult {
    const order = this._getSectionsOrder();
    const energyLinkDashboard = this._config.energy_link_dashboard !== false;
    const showEnergy = this._config.show_energy !== false;
    const weatherPresentation = this._config.weather_presentation || 'forecast_daily';
    const showDistributionCard = this._config.show_energy_distribution_card !== false;
    const powerBadgeEntity = this._config.power_badge_entity || '';
    const powerBadgeEntities = this._getEntitiesByDomains(['sensor', 'binary_sensor', 'number', 'input_number']);
    const hiddenHeadings = new Set(this._config.hidden_section_headings || []);

    return html`
      <div class="section">
        <div class="section-title">${localize('editor.section_order')}</div>
        <div class="description" style="margin-left: 0; margin-bottom: 12px;">
          ${localize('editor.section_order_desc')}
        </div>
        <div class="section-order-list" id="section-order-list">
          ${order.map((key) => {
            const meta = Simon42DashboardStrategyEditor._sectionMeta.get(key);
            if (!meta) return nothing;
            const disabled = this._isSectionDisabled(key);
            const toggleable = this._isSectionToggleable(key);
            return html`
              <div
                class="section-order-item ${disabled ? 'disabled' : ''}"
                data-section-key=${key}
                draggable="true"
                @dragstart=${this._handleSectionDragStart}
                @dragend=${this._handleSectionDragEnd}
                @dragover=${this._handleSectionDragOver}
                @dragleave=${this._handleSectionDragLeave}
                @drop=${this._handleSectionDrop}
              >
                <span class="drag-handle" draggable="true">&#x2630;</span>
                <ha-icon class="section-icon" icon=${meta.icon}></ha-icon>
                <span class="section-label">${localize(meta.labelKey)}</span>
                ${disabled && !toggleable
                  ? html`<span class="section-hidden-tag">(${localize('editor.section_hidden')})</span>`
                  : nothing}
                ${toggleable
                  ? html`
                      <label
                        class="section-toggle"
                        @mousedown=${(e: Event) => {
                          e.stopPropagation();
                        }}
                      >
                        <input
                          type="checkbox"
                          ?checked=${!disabled}
                          @change=${(e: Event) => {
                            this._toggleSectionVisibility(key, (e.target as HTMLInputElement).checked);
                          }}
                          @dragstart=${(e: Event) => {
                            e.stopPropagation();
                          }}
                        />
                      </label>
                    `
                  : nothing}
              </div>
              ${key === 'energy' && showEnergy
                ? html`
                    <div class="section-order-sub">
                      <input
                        type="checkbox"
                        id="energy-link-dashboard"
                        ?checked=${energyLinkDashboard}
                        @change=${(e: Event) => {
                          this._toggleChanged('energy_link_dashboard', (e.target as HTMLInputElement).checked, true);
                        }}
                      />
                      <label for="energy-link-dashboard">${localize('editor.energy_link_dashboard')}</label>
                    </div>
                    <div class="section-order-sub">
                      <input
                        type="checkbox"
                        id="show-energy-distribution-card"
                        ?checked=${showDistributionCard}
                        @change=${(e: Event) => {
                          this._toggleChanged(
                            'show_energy_distribution_card',
                            (e.target as HTMLInputElement).checked,
                            true
                          );
                        }}
                      />
                      <label for="show-energy-distribution-card"
                        >${localize('editor.show_energy_distribution_card')}</label
                      >
                    </div>
                    <div class="section-order-sub">
                      <label for="power-badge-entity" style="min-width: 140px;"
                        >${localize('editor.power_badge_entity')}</label
                      >
                      <select id="power-badge-entity" style="flex: 1;" @change=${this._powerBadgeEntityChanged}>
                        <option value="" ?selected=${!powerBadgeEntity}>${localize('editor.power_badge_none')}</option>
                        ${powerBadgeEntities.map(
                          (entity) => html`
                            <option value=${entity.entity_id} ?selected=${entity.entity_id === powerBadgeEntity}>
                              ${entity.name}
                            </option>
                          `
                        )}
                      </select>
                    </div>
                    <div class="description">${localize('editor.power_badge_entity_desc')}</div>
                  `
                : nothing}
              ${key === 'weather' && !disabled
                ? html`
                    <div class="section-order-sub">
                      <label for="weather-presentation" style="min-width: 140px;"
                        >${localize('editor.weather_presentation')}</label
                      >
                      <select id="weather-presentation" style="flex: 1;" @change=${this._weatherPresentationChanged}>
                        <option value="forecast_daily" ?selected=${weatherPresentation === 'forecast_daily'}>
                          ${localize('editor.weather_presentation_forecast_daily')}
                        </option>
                        <option value="forecast_hourly" ?selected=${weatherPresentation === 'forecast_hourly'}>
                          ${localize('editor.weather_presentation_forecast_hourly')}
                        </option>
                        <option
                          value="forecast_twice_daily"
                          ?selected=${weatherPresentation === 'forecast_twice_daily'}
                        >
                          ${localize('editor.weather_presentation_forecast_twice_daily')}
                        </option>
                        <option value="tile" ?selected=${weatherPresentation === 'tile'}>
                          ${localize('editor.weather_presentation_tile')}
                        </option>
                        <option value="none" ?selected=${weatherPresentation === 'none'}>
                          ${localize('editor.weather_presentation_none')}
                        </option>
                      </select>
                    </div>
                    ${this._renderCheckbox(
                      'show-weather-forecast-card',
                      localize('editor.show_weather_forecast_card'),
                      this._config.show_weather_forecast_card !== false,
                      (checked) => this._toggleChanged('show_weather_forecast_card', checked, true)
                    )}
                    <div class="description">${localize('editor.show_weather_forecast_card_desc')}</div>
                    <div class="form-row" style="align-items: flex-start;">
                      <label for="weather-sensors" style="min-width: 140px; margin-top: 6px;"
                        >${localize('editor.section_weather_sensors')}</label
                      >
                      <textarea
                        id="weather-sensors"
                        rows="4"
                        style="flex: 1;"
                        placeholder="sensor.outside_temperature|mdi:thermometer|°C|1"
                        @change=${this._weatherSensorsChanged}
                      >
${this._formatWeatherSensors(this._config.weather_sensors)}</textarea
                      >
                    </div>
                    <div class="description">${localize('editor.weather_sensors_desc')}</div>
                  `
                : nothing}
              ${key === 'agenda' && !disabled
                ? html`
                    <div class="form-row" style="align-items: flex-start;">
                      <label for="agenda-calendar-entities" style="min-width: 140px; margin-top: 6px;"
                        >${localize('editor.agenda_calendar_entities')}</label
                      >
                      <textarea
                        id="agenda-calendar-entities"
                        rows="3"
                        style="flex: 1;"
                        placeholder="calendar.family, calendar.work"
                        @change=${this._agendaCalendarEntitiesChanged}
                      >
${this._formatEntityList(this._config.agenda_calendar_entities)}</textarea
                      >
                    </div>
                    <div class="description">${localize('editor.agenda_calendar_entities_desc')}</div>
                  `
                : nothing}
              ${key === 'todos' && !disabled
                ? html`
                    <div class="form-row" style="align-items: flex-start;">
                      <label for="todos-entities" style="min-width: 140px; margin-top: 6px;"
                        >${localize('editor.todos_entities')}</label
                      >
                      <textarea
                        id="todos-entities"
                        rows="3"
                        style="flex: 1;"
                        placeholder="todo.home, todo.shopping"
                        @change=${this._todosEntitiesChanged}
                      >
${this._formatEntityList(this._config.todos_entities)}</textarea
                      >
                    </div>
                    <div class="description">${localize('editor.todos_entities_desc')}</div>
                  `
                : nothing}
            `;
          })}
        </div>
        <details style="margin-top: 12px;">
          <summary style="cursor: pointer; font-weight: 500;">${localize('editor.hidden_section_headings')}</summary>
          <div style="margin-left: 14px; margin-top: 6px;">
            <div class="description" style="margin-left: 0; margin-bottom: 8px;">
              ${localize('editor.hidden_section_headings_desc')}
            </div>
            ${ALL_HEADING_KEYS.map(
              (key) => html`
                <div class="form-row">
                  <input
                    type="checkbox"
                    id=${`hide-heading-${key}`}
                    ?checked=${hiddenHeadings.has(key)}
                    @change=${(e: Event) => this._toggleHiddenHeading(key, (e.target as HTMLInputElement).checked)}
                  />
                  <label for=${`hide-heading-${key}`}>${localize(`sections.${key}`)}</label>
                </div>
              `
            )}
          </div>
        </details>
        <details style="margin-top: 12px;">
          <summary style="cursor: pointer; font-weight: 500;">${localize('editor.section_visibility')}</summary>
          <div style="margin-left: 14px; margin-top: 6px;">
            <div class="description" style="margin-left: 0; margin-bottom: 8px;">
              ${localize('editor.section_visibility_desc')}
            </div>
            ${order.map((key) => {
              const meta = Simon42DashboardStrategyEditor._sectionMeta.get(key);
              if (!meta) return nothing;
              const rule = this._config.section_visibility?.[key];
              return html`
                <div
                  style="border: 1px solid var(--divider-color); border-radius: 6px; padding: 8px; margin-bottom: 8px;"
                >
                  <div style="font-weight: 500; margin-bottom: 6px;">${localize(meta.labelKey)}</div>
                  <div class="form-row">
                    <label for=${`visibility-entity-${key}`} style="min-width: 80px; font-size: 12px;"
                      >${localize('editor.section_visibility_entity')}</label
                    >
                    <input
                      type="text"
                      id=${`visibility-entity-${key}`}
                      style="flex: 1;"
                      placeholder="input_boolean.guest_mode"
                      .value=${rule?.entity || ''}
                      @change=${(e: Event) =>
                        this._sectionVisibilityChanged(key, 'entity', (e.target as HTMLInputElement).value)}
                    />
                  </div>
                  <div class="form-row">
                    <label for=${`visibility-state-${key}`} style="min-width: 80px; font-size: 12px;"
                      >${localize('editor.section_visibility_state')}</label
                    >
                    <input
                      type="text"
                      id=${`visibility-state-${key}`}
                      style="flex: 1;"
                      placeholder="on"
                      .value=${rule?.state || ''}
                      @change=${(e: Event) =>
                        this._sectionVisibilityChanged(key, 'state', (e.target as HTMLInputElement).value)}
                    />
                  </div>
                </div>
              `;
            })}
          </div>
        </details>
      </div>
    `;
  }

  // -- Weather-start block order panel -----------------------------------

  private _getWeatherStartOrder(): WeatherStartKey[] {
    return this._config.weather_start_order || [...DEFAULT_WEATHER_START_ORDER];
  }

  private _isWeatherStartBlockDisabled(key: WeatherStartKey): boolean {
    switch (key) {
      case 'clock':
        return this._config.show_clock_card === false;
      case 'weather_current':
      case 'weather_daily':
        return this._config.show_weather === false;
      case 'weather_hourly':
        return this._config.show_weather === false || this._config.weather_start_weather_mode === 'compact_hourly';
      case 'weather_details':
        return (this._config.weather_sensors || []).length === 0 && (this._config.pollen_entities || []).length === 0;
      case 'favorites':
        return (this._config.favorite_entities || []).length === 0;
      case 'light_favorites':
        return (this._config.light_favorite_entities || []).length === 0;
      case 'alarm':
        return !this._config.alarm_entity;
      case 'search':
        return this._config.show_search_card !== true;
      case 'overview':
        return !(this._config.custom_cards || []).some(
          (card) => (card.target_section || 'custom_cards') === 'overview'
        );
      case 'energy':
        return this._config.show_energy === false;
      case 'plants':
        return this._config.show_plants_section === false;
      case 'agenda':
        return this._config.show_agenda_section === false;
      case 'todos':
        return this._config.show_todos_section === false;
      case 'persons':
        return this._config.show_persons_section !== true;
      case 'vacuums':
        return this._config.show_vacuums_section === false;
      case 'maintenance':
        return this._config.show_maintenance_section === false;
      case 'custom_cards':
        return (this._config.custom_cards || []).length === 0;
      case 'custom_sections':
        return (this._config.custom_sections || []).length === 0;
      case 'summaries':
        return (
          this._config.show_light_summary === false &&
          this._config.show_covers_summary === false &&
          this._config.show_security_summary === false &&
          this._config.show_battery_summary === false &&
          this._config.show_climate_summary === false
        );
      default:
        return false;
    }
  }

  private static _weatherStartBlockMeta = new Map<WeatherStartKey, { icon: string; labelKey: string }>(
    Object.entries(WEATHER_START_BLOCK_META) as [WeatherStartKey, { icon: string; labelKey: string }][]
  );

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

    const hidden = new Set(hiddenList);
    const orderMap = new Map(order.map((areaId, index) => [areaId, index]));
    const options = Object.values(this._hass.areas || {})
      .filter((area) => !hidden.has(area.area_id))
      .sort((a, b) => {
        const ai = orderMap.get(a.area_id) ?? -1;
        const bi = orderMap.get(b.area_id) ?? -1;
        const ae = ai >= 0 ? ai : 9999;
        const be = bi >= 0 ? bi : 9999;
        return ae - be || a.name.localeCompare(b.name);
      });
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

    const floorIds = new Set<string>();
    let hasFloorlessAreas = false;
    for (const area of areas) {
      if (area.floor_id) floorIds.add(area.floor_id);
      else hasFloorlessAreas = true;
    }

    const floors: WeatherStartFloorOption[] = Object.values(this._hass.floors || {})
      .filter((floor) => floorIds.has(floor.floor_id))
      .sort((a, b) => {
        const aLevel = a.level ?? 9999;
        const bLevel = b.level ?? 9999;
        return aLevel - bLevel || a.name.localeCompare(b.name);
      })
      .map((floor) => ({ floor_id: floor.floor_id, name: floor.name, icon: floor.icon }));

    if (hasFloorlessAreas) {
      floors.push({ floor_id: null, name: localize('sections.areas_other'), icon: 'mdi:home-outline' });
    }

    this._weatherStartFloorOptionsCache = {
      floors: this._hass.floors,
      areas,
      options: floors,
    };
    return floors;
  }

  private _getCustomCardRef(card: CustomCard, index: number): string {
    return card.id || `legacy-custom-card-${index}`;
  }

  private _getCustomSectionRef(section: CustomSection, index: number): string {
    return section.id || `legacy-custom-section-${index}`;
  }

  private _getCustomCardEditorLabel(card: CustomCard | AreaCustomCard | undefined, fallback: string): string {
    return card?.editor_title || card?.title || fallback;
  }

  private _getLegacyWeatherStartLayoutItems(): WeatherStartLayoutItem[] {
    const order = this._getWeatherStartOrder();
    const items: WeatherStartLayoutItem[] = [];
    for (const key of order) {
      const blockCfg = this._config.weather_start_blocks_config?.[key];
      if (key === 'areas') {
        if (this._config.group_by_floors === true) {
          for (const floor of this._getWeatherStartFloorOptions()) {
            items.push({
              id: `floor-${floor.floor_id || 'none'}`,
              type: 'floor',
              floor_id: floor.floor_id,
              title: floor.name,
            });
          }
        } else {
          for (const area of this._getWeatherStartAreaOptions()) {
            items.push({ id: `area-${area.area_id}`, type: 'area', area_id: area.area_id });
          }
        }
      } else if (key === 'custom_cards') {
        (this._config.custom_cards || []).forEach((card, index) => {
          items.push({
            id: `custom-card-${this._getCustomCardRef(card, index)}`,
            type: 'custom_card',
            custom_card_id: this._getCustomCardRef(card, index),
          });
        });
      } else if (key === 'custom_sections') {
        (this._config.custom_sections || []).forEach((section, index) => {
          items.push({
            id: `custom-section-${this._getCustomSectionRef(section, index)}`,
            type: 'custom_section',
            custom_section_id: this._getCustomSectionRef(section, index),
          });
        });
      } else {
        items.push({
          id: key,
          type: key,
          ...(blockCfg?.yaml
            ? { yaml: blockCfg.yaml, parsed_config: blockCfg.parsed_config, _yaml_error: blockCfg._yaml_error }
            : {}),
        });
      }
    }
    return items;
  }

  private _normalizeWeatherStartLayoutItems(items: WeatherStartLayoutItem[]): WeatherStartLayoutItem[] {
    const areas = this._getWeatherStartAreaOptions();
    const visibleAreaIds = new Set(areas.map((area) => area.area_id));
    const representedAreaIds = new Set<string>();
    const result: WeatherStartLayoutItem[] = [];

    const addAreaItem = (areaId: string, item?: WeatherStartLayoutItem): void => {
      if (!visibleAreaIds.has(areaId) || representedAreaIds.has(areaId)) return;
      representedAreaIds.add(areaId);
      result.push({
        ...(item || {}),
        id: item?.id || `area-${areaId}`,
        type: 'area',
        area_id: areaId,
      });
    };

    const addFloorItem = (item: WeatherStartLayoutItem): void => {
      const floorAreas = areas.filter((area) => (item.floor_id ? area.floor_id === item.floor_id : !area.floor_id));
      if (floorAreas.length === 0) return;
      for (const area of floorAreas) representedAreaIds.add(area.area_id);
      result.push({ ...item });
    };

    for (const item of items) {
      if (item.type === 'area') {
        if (item.area_id) addAreaItem(item.area_id, item);
        continue;
      }

      if (item.type === 'floor') {
        addFloorItem(item);
        continue;
      }

      if (item.type === 'areas') {
        if (this._config.group_by_floors === true) {
          for (const floor of this._getWeatherStartFloorOptions()) {
            addFloorItem({
              id: `floor-${floor.floor_id || 'none'}`,
              type: 'floor',
              floor_id: floor.floor_id,
              title: floor.name,
            });
          }
        } else {
          for (const area of areas) addAreaItem(area.area_id);
        }
        continue;
      }

      result.push({ ...item });
    }

    for (const area of areas) {
      addAreaItem(area.area_id);
    }

    return result;
  }

  private _getWeatherStartLayoutItems(): WeatherStartLayoutItem[] {
    const items = this._config.weather_start_layout_items?.length
      ? this._config.weather_start_layout_items.map((item) => ({ ...item }))
      : this._getLegacyWeatherStartLayoutItems();

    return this._normalizeWeatherStartLayoutItems(items);
  }

  private _saveWeatherStartLayoutItems(items: WeatherStartLayoutItem[]): void {
    const normalizedItems = this._normalizeWeatherStartLayoutItems(items);
    const newConfig: Simon42StrategyConfig = {
      ...this._config,
      weather_start_layout_items: normalizedItems,
    };
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
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

  private _updateWeatherStartItemYaml(itemId: string, yamlString: string): void {
    const items = this._getWeatherStartLayoutItems().map((item) => {
      if (item.id !== itemId) return item;
      const updated: WeatherStartLayoutItem = { ...item, yaml: yamlString };
      const parsed = this._parseWeatherStartItemYaml(yamlString);
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
      this._config = { ...this._config, weather_start_layout_items: items };
      this.requestUpdate();
      return;
    }
    this._saveWeatherStartLayoutItems(items);
  }

  private _resetWeatherStartItemYaml(itemId: string): void {
    const items = this._getWeatherStartLayoutItems().map((item) => {
      if (item.id !== itemId) return item;
      const updated = { ...item };
      delete updated.yaml;
      delete updated.parsed_config;
      delete updated._yaml_error;
      return updated;
    });
    this._saveWeatherStartLayoutItems(items);
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
    const validationMsg = card._yaml_error
      ? html`<div style="color: var(--error-color); font-size: 12px; margin-top: 4px;">
          &#x274C; ${card._yaml_error}
        </div>`
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
            this._updateCustomCardField(index, 'editor_title', (e.target as HTMLInputElement).value)}
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
          @change=${(e: Event) => this._updateCustomCardField(index, 'title', (e.target as HTMLInputElement).value)}
        />
      </label>
      <div class="description" style="margin: 0 0 6px 0;">${localize('editor.weather_start_card_yaml_desc')}</div>
      <textarea
        rows="8"
        style="width:100%;box-sizing:border-box;font-family:monospace;font-size:12px;resize:vertical;"
        placeholder=${localize('editor.yaml_placeholder')}
        .value=${card.yaml || ''}
        @change=${(e: Event) => this._updateCustomCardYaml(index, (e.target as HTMLTextAreaElement).value)}
      ></textarea>
      <button class="btn-primary" style="margin-top: 6px;" @click=${() => this._openCardEditorForCustomCard(index)}>
        ${localize('editor.edit_card_with_ha_editor')}
      </button>
      ${validationMsg}
    `;
  }

  private _renderWeatherStartCustomSectionEditor(section: CustomSection, sectionIndex: number): TemplateResult {
    const cards = section.cards || [];

    return html`
      <div class="custom-item-row" style="margin-bottom: 8px;">
        <input
          type="text"
          .value=${section.title || ''}
          placeholder=${localize('editor.custom_section_title_placeholder')}
          style="flex: 2;"
          @change=${(e: Event) =>
            this._updateCustomSectionField(sectionIndex, 'title', (e.target as HTMLInputElement).value)}
        />
        <input
          type="text"
          .value=${section.icon || ''}
          placeholder=${localize('editor.custom_section_icon_placeholder')}
          style="flex: 1;"
          @change=${(e: Event) =>
            this._updateCustomSectionField(sectionIndex, 'icon', (e.target as HTMLInputElement).value)}
        />
      </div>
      <div class="description" style="margin: 0 0 8px 0;">${localize('editor.weather_start_section_cards_desc')}</div>
      ${cards.length === 0
        ? html`<div class="empty-state">${localize('editor.no_custom_cards')}</div>`
        : cards.map((card, cardIndex) => {
            const validationMsg = card._yaml_error
              ? html`<span style="color: var(--error-color);">&#x274C; ${card._yaml_error}</span>`
              : card.yaml
                ? html`<span style="color: var(--success-color, green);"
                    >&#x2705; ${localize('editor.yaml_valid')}</span
                  >`
                : nothing;
            return html`
              <div class="custom-item" style="margin-bottom: 8px;">
                <div class="custom-item-header">
                  <strong
                    >${this._getCustomCardEditorLabel(card, `${localize('editor.new_card')} ${cardIndex + 1}`)}</strong
                  >
                  <button class="btn-remove" @click=${() => this._removeCardFromSection(sectionIndex, cardIndex)}>
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
                      this._updateSectionCardField(
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
                      this._updateSectionCardField(
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
                      this._updateSectionCardYaml(sectionIndex, cardIndex, (e.target as HTMLTextAreaElement).value)}
                  ></textarea>
                  <button
                    class="btn-primary"
                    style="margin-top: 6px;"
                    @click=${() => this._openCardEditorForSectionCard(sectionIndex, cardIndex)}
                  >
                    ${localize('editor.edit_card_with_ha_editor')}
                  </button>
                  <div class="custom-item-validation">${validationMsg}</div>
                </div>
              </div>
            `;
          })}
      <button class="btn-primary" style="margin-top: 4px;" @click=${() => this._openCardPickerForSection(sectionIndex)}>
        ${localize('editor.add_card_to_section')}
      </button>
    `;
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
      const yamlStr = yaml.dump(config).trim();
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
    if (item.type === 'area') {
      const area = areas.find((entry) => entry.area_id === item.area_id);
      return {
        icon: area?.icon || 'mdi:home-outline',
        label: area?.name || item.area_id || localize('sections.areas'),
      };
    }
    if (item.type === 'floor') {
      const floor = this._getWeatherStartFloorOptions().find((entry) => entry.floor_id === (item.floor_id ?? null));
      return { icon: floor?.icon || 'mdi:floor-plan', label: item.title || floor?.name || localize('sections.areas') };
    }
    if (item.type === 'custom_card') {
      const card = customCards.find((entry, index) => this._getCustomCardRef(entry, index) === item.custom_card_id);
      return { icon: 'mdi:cards', label: this._getCustomCardEditorLabel(card, localize('editor.new_card')) };
    }
    if (item.type === 'custom_section') {
      const section = customSections.find(
        (entry, index) => this._getCustomSectionRef(entry, index) === item.custom_section_id
      );
      return {
        icon: section?.icon || 'mdi:view-grid-plus-outline',
        label: section?.title || localize('editor.section_custom_sections'),
      };
    }

    const meta = Simon42DashboardStrategyEditor._weatherStartBlockMeta.get(item.type);
    return { icon: meta?.icon || 'mdi:view-dashboard-outline', label: meta ? localize(meta.labelKey) : item.type };
  }

  private _isWeatherStartItemDisabled(
    item: WeatherStartLayoutItem,
    customCards: CustomCard[],
    customSections: CustomSection[]
  ): boolean {
    if (item.parsed_config) return false;
    if (item._yaml_error) return true;
    if (item.type === 'custom_card') {
      return !customCards.some(
        (entry, index) => this._getCustomCardRef(entry, index) === item.custom_card_id && entry.parsed_config
      );
    }
    if (item.type === 'custom_section') {
      return !customSections.some(
        (entry, index) =>
          this._getCustomSectionRef(entry, index) === item.custom_section_id &&
          (entry.cards || []).some((card) => card.parsed_config)
      );
    }
    if (item.type === 'floor') {
      return !this._getWeatherStartAreaOptions().some((area) =>
        item.floor_id ? area.floor_id === item.floor_id : !area.floor_id
      );
    }
    if (item.type === 'summaries') {
      return this._isWeatherStartBlockDisabled('summaries');
    }
    if (Simon42DashboardStrategyEditor._weatherStartBlockMeta.has(item.type as WeatherStartKey)) {
      return this._isWeatherStartBlockDisabled(item.type as WeatherStartKey);
    }
    return false;
  }

  private _countNestedFixedGrids(value: unknown, depth = 0): number {
    if (!value || typeof value !== 'object') return 0;
    if (Array.isArray(value))
      return value.reduce<number>((sum, entry) => sum + this._countNestedFixedGrids(entry, depth), 0);
    const record = value as Record<string, unknown>;
    const own = depth > 0 && record.type === 'grid' && typeof record.columns === 'number' ? 1 : 0;
    return (
      own + Object.values(record).reduce<number>((sum, entry) => sum + this._countNestedFixedGrids(entry, depth + 1), 0)
    );
  }

  private _renderWeatherStartOrderPanel(): TemplateResult {
    const items = this._getWeatherStartLayoutItems();
    const areas = this._getWeatherStartAreaOptions();
    const floors = this._getWeatherStartFloorOptions();
    const customCards = this._config.custom_cards || [];
    const customSections = this._config.custom_sections || [];
    const hasSummariesBlock = items.some((item) => item.type === 'summaries');
    const placedAreaIds = new Set(
      items.filter((item) => item.type === 'area' && item.area_id).map((item) => item.area_id as string)
    );
    for (const item of items) {
      if (item.type !== 'floor') continue;
      for (const area of areas) {
        if (item.floor_id ? area.floor_id === item.floor_id : !area.floor_id) {
          placedAreaIds.add(area.area_id);
        }
      }
    }
    const unplacedAreas = areas.filter((area) => !placedAreaIds.has(area.area_id));
    let stackRun = 0;
    const hasLongStackChain = items.some((item) => {
      stackRun = item.stack_with_previous ? stackRun + 1 : 0;
      return stackRun >= 2;
    });

    return html`
      <div class="section">
        <div class="section-title">${localize('editor.weather_start_order')}</div>
        <div class="description" style="margin-left: 0; margin-bottom: 12px;">
          ${localize('editor.weather_start_order_desc')}
        </div>
        ${hasLongStackChain
          ? html`
              <div style="color:var(--warning-color,#f0a000);font-size:12px;margin:0 0 10px 0;">
                ${localize('editor.weather_start_stack_warning')}
              </div>
            `
          : nothing}
        <div class="section-order-list" id="weather-start-order-list">
          ${items.map((item) => {
            const meta = this._getWeatherStartItemMeta(item, areas, customCards, customSections);
            const disabled = this._isWeatherStartItemDisabled(item, customCards, customSections);
            const isExpanded = this._expandedWeatherBlocks.has(item.id);
            const hasOverride = !!item.yaml;
            const canRemove = item.type !== 'area' && item.type !== 'floor';
            const customCardIndex = this._getWeatherStartCustomCardIndex(item, customCards);
            const customCard = customCardIndex >= 0 ? customCards[customCardIndex] : undefined;
            const customSectionIndex = this._getWeatherStartCustomSectionIndex(item, customSections);
            const customSection = customSectionIndex >= 0 ? customSections[customSectionIndex] : undefined;
            const fixedGridCount = this._countNestedFixedGrids(item.parsed_config);
            return html`
              <div>
                <div
                  class="section-order-item ${disabled ? 'disabled' : ''}"
                  data-ws-id=${item.id}
                  draggable="true"
                  @dragstart=${this._handleWeatherStartDragStart}
                  @dragend=${this._handleWeatherStartDragEnd}
                  @dragover=${this._handleWeatherStartDragOver}
                  @dragleave=${this._handleWeatherStartDragLeave}
                  @drop=${this._handleWeatherStartDrop}
                >
                  <span class="drag-handle" draggable="true">&#x2630;</span>
                  <ha-icon class="section-icon" icon=${meta.icon}></ha-icon>
                  <span class="section-label">${meta.label}</span>
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
                    @click=${(e: Event) => {
                      e.stopPropagation();
                      this._toggleWeatherBlockExpanded(item.id);
                    }}
                  >
                    <ha-icon icon=${isExpanded ? 'mdi:chevron-up' : 'mdi:chevron-down'}></ha-icon>
                  </button>
                  ${canRemove
                    ? html`
                        <button
                          class="icon-btn"
                          title=${localize('editor.remove')}
                          @click=${(e: Event) => {
                            e.stopPropagation();
                            this._removeWeatherStartItem(item.id);
                          }}
                        >
                          <ha-icon icon="mdi:delete-outline"></ha-icon>
                        </button>
                      `
                    : nothing}
                </div>
                ${isExpanded
                  ? html`
                      <div
                        style="padding: 8px 12px 12px 12px; background: var(--secondary-background-color); border-radius: 0 0 8px 8px; margin-bottom: 4px;"
                      >
                        ${customCard ? this._renderWeatherStartCustomCardEditor(customCard, customCardIndex) : nothing}
                        ${customSection
                          ? this._renderWeatherStartCustomSectionEditor(customSection, customSectionIndex)
                          : nothing}
                        ${!customCard && !customSection && item.type === 'summaries'
                          ? html`
                              <label class="form-row" style="margin: 0 0 8px 0;">
                                <span style="min-width: 120px;">${localize('editor.weather_start_summary_size')}</span>
                                <select
                                  style="flex:1;"
                                  .value=${item.summary_size || 'mini'}
                                  @change=${(e: Event) =>
                                    this._weatherStartSummarySizeChanged(
                                      item.id,
                                      (e.target as HTMLSelectElement).value as 'mini' | 'normal'
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
                                  @change=${(e: Event) =>
                                    this._toggleWeatherStartItemStack(item.id, (e.target as HTMLInputElement).checked)}
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
                                @change=${(e: Event) =>
                                  this._updateWeatherStartItemYaml(item.id, (e.target as HTMLTextAreaElement).value)}
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
                                ? html`
                                    <button
                                      class="text-btn"
                                      style="margin-top:8px;"
                                      @click=${() => this._resetWeatherStartItemYaml(item.id)}
                                    >
                                      ${localize('editor.weather_start_block_reset')}
                                    </button>
                                  `
                                : nothing}
                            `
                          : nothing}
                      </div>
                    `
                  : nothing}
              </div>
            `;
          })}
        </div>
        <div class="description" style="margin: 12px 0 6px 0;">
          ${localize('editor.weather_start_add_content_desc')}
        </div>
        <div class="custom-item-row weather-start-add-row">
          <button class="btn-primary" @click=${this._openCardPickerForWeatherStartCard}>
            ${localize('editor.weather_start_add_card')}
          </button>
          ${!hasSummariesBlock
            ? html`
                <button class="btn-primary" @click=${this._addWeatherStartSummaries}>
                  ${localize('editor.weather_start_add_summaries')}
                </button>
              `
            : nothing}
          <button class="btn-primary" @click=${this._addWeatherStartSection}>
            ${localize('editor.weather_start_add_section')}
          </button>
          <select @change=${this._addWeatherStartArea}>
            <option value="">${localize('editor.weather_start_add_area')}</option>
            ${unplacedAreas.map((area) => html`<option value=${area.area_id}>${area.name}</option>`)}
          </select>
          <select @change=${this._addWeatherStartFloor}>
            <option value="">${localize('editor.weather_start_add_floor')}</option>
            ${floors.map((floor) => html`<option value=${floor.floor_id || '__none__'}>${floor.name}</option>`)}
          </select>
        </div>
      </div>
    `;
  }

  // -- Weather-start block order drag & drop -----------------------------

  private _handleWeatherStartDragStart = (ev: DragEvent): void => {
    const dragHandle = (ev.target as HTMLElement).closest('.drag-handle');
    if (!dragHandle) {
      ev.preventDefault();
      return;
    }

    const item = (ev.target as HTMLElement).closest('.section-order-item') as HTMLElement | null;
    if (!item) {
      ev.preventDefault();
      return;
    }

    item.classList.add('dragging');
    if (ev.dataTransfer) {
      ev.dataTransfer.effectAllowed = 'move';
      ev.dataTransfer.setData('text/plain', item.dataset.wsId || '');
    }
    this._weatherStartDraggedElement = item;
  };

  private _handleWeatherStartDragEnd = (ev: DragEvent): void => {
    const item = (ev.target as HTMLElement).closest('.section-order-item') as HTMLElement | null;
    if (item) item.classList.remove('dragging');

    const list = this.shadowRoot?.querySelector('#weather-start-order-list');
    if (list) {
      list.querySelectorAll('.section-order-item').forEach((el) => {
        el.classList.remove('drag-over');
      });
    }
    this._weatherStartDraggedElement = null;
  };

  private _handleWeatherStartDragOver = (ev: DragEvent): void => {
    ev.preventDefault();
    if (ev.dataTransfer) ev.dataTransfer.dropEffect = 'move';

    const item = ev.currentTarget as HTMLElement;
    if (item !== this._weatherStartDraggedElement) {
      item.classList.add('drag-over');
    }
  };

  private _handleWeatherStartDragLeave = (ev: DragEvent): void => {
    (ev.currentTarget as HTMLElement).classList.remove('drag-over');
  };

  private _handleWeatherStartDrop = (ev: DragEvent): void => {
    ev.stopPropagation();
    ev.preventDefault();

    const dropTarget = ev.currentTarget as HTMLElement;
    dropTarget.classList.remove('drag-over');

    if (!this._weatherStartDraggedElement || this._weatherStartDraggedElement === dropTarget) return;

    const draggedId = this._weatherStartDraggedElement.dataset.wsId;
    const dropId = dropTarget.dataset.wsId;
    if (!draggedId || !dropId) return;

    const currentOrder = this._getWeatherStartLayoutItems();
    const draggedIndex = currentOrder.findIndex((item) => item.id === draggedId);
    const dropIndex = currentOrder.findIndex((item) => item.id === dropId);
    if (draggedIndex === -1 || dropIndex === -1) return;

    const newOrder = [...currentOrder];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(dropIndex, 0, currentOrder[draggedIndex]);

    this._saveWeatherStartLayoutItems(newOrder);
  };

  // -- Section order drag & drop -----------------------------------------

  private _handleSectionDragStart = (ev: DragEvent): void => {
    const dragHandle = (ev.target as HTMLElement).closest('.drag-handle');
    if (!dragHandle) {
      ev.preventDefault();
      return;
    }

    const item = (ev.target as HTMLElement).closest('.section-order-item') as HTMLElement | null;
    if (!item) {
      ev.preventDefault();
      return;
    }

    item.classList.add('dragging');
    if (ev.dataTransfer) {
      ev.dataTransfer.effectAllowed = 'move';
      ev.dataTransfer.setData('text/plain', item.dataset.sectionKey || '');
    }
    this._sectionDraggedElement = item;
  };

  private _handleSectionDragEnd = (ev: DragEvent): void => {
    const item = (ev.target as HTMLElement).closest('.section-order-item') as HTMLElement | null;
    if (item) item.classList.remove('dragging');

    const list = this.shadowRoot?.querySelector('#section-order-list');
    if (list) {
      list.querySelectorAll('.section-order-item').forEach((el) => {
        el.classList.remove('drag-over');
      });
    }
    this._sectionDraggedElement = null;
  };

  private _handleSectionDragOver = (ev: DragEvent): void => {
    ev.preventDefault();
    if (ev.dataTransfer) ev.dataTransfer.dropEffect = 'move';

    const item = ev.currentTarget as HTMLElement;
    if (item !== this._sectionDraggedElement) {
      item.classList.add('drag-over');
    }
  };

  private _handleSectionDragLeave = (ev: DragEvent): void => {
    (ev.currentTarget as HTMLElement).classList.remove('drag-over');
  };

  private _handleSectionDrop = (ev: DragEvent): void => {
    ev.stopPropagation();
    ev.preventDefault();

    const dropTarget = ev.currentTarget as HTMLElement;
    dropTarget.classList.remove('drag-over');

    if (!this._sectionDraggedElement || this._sectionDraggedElement === dropTarget) return;

    const draggedKey = this._sectionDraggedElement.dataset.sectionKey as SectionKey | undefined;
    const dropKey = dropTarget.dataset.sectionKey as SectionKey | undefined;
    if (!draggedKey || !dropKey) return;

    const currentOrder = this._getSectionsOrder();
    const draggedIndex = currentOrder.indexOf(draggedKey);
    const dropIndex = currentOrder.indexOf(dropKey);
    if (draggedIndex === -1 || dropIndex === -1) return;

    const newOrder = [...currentOrder];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(dropIndex, 0, draggedKey);

    this._updateSectionsOrder(newOrder);
  };

  // -- Room stack order panel -------------------------------------------

  private _getStacksOrder(areaId: string): StackKey[] {
    return mergeStacksOrder(this._config.areas_options?.[areaId]?.stacks_order);
  }

  private _updateStacksOrder(areaId: string, newOrder: StackKey[]): void {
    const currentAreaOptions = this._config.areas_options?.[areaId] || {};
    const newAreaOptions: Record<string, any> = { ...currentAreaOptions };

    if (newOrder.join('|') === DEFAULT_STACKS_ORDER.join('|')) {
      delete newAreaOptions.stacks_order;
    } else {
      newAreaOptions.stacks_order = newOrder;
    }

    const newAreasOptions: Record<string, any> = {
      ...this._config.areas_options,
      [areaId]: newAreaOptions,
    };

    if (Object.keys(newAreasOptions[areaId]).length === 0) {
      delete newAreasOptions[areaId];
    }

    const newConfig: Simon42StrategyConfig = { ...this._config };
    if (Object.keys(newAreasOptions).length === 0) {
      delete newConfig.areas_options;
    } else {
      newConfig.areas_options = newAreasOptions;
    }

    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  private static _stackMeta = new Map<StackKey, { icon: string; labelKey: string }>([
    ['energy', { icon: 'mdi:lightning-bolt', labelKey: 'stacks.energy' }],
    ['cameras', { icon: 'mdi:cctv', labelKey: 'stacks.cameras' }],
    ['lights', { icon: 'mdi:lightbulb', labelKey: 'stacks.lights' }],
    ['locks', { icon: 'mdi:lock', labelKey: 'stacks.locks' }],
    ['climate', { icon: 'mdi:thermostat', labelKey: 'stacks.climate' }],
    ['covers', { icon: 'mdi:window-shutter', labelKey: 'stacks.covers' }],
    ['covers_window', { icon: 'mdi:window-open-variant', labelKey: 'stacks.covers_window' }],
    ['media', { icon: 'mdi:speaker', labelKey: 'stacks.media' }],
    ['scenes', { icon: 'mdi:palette', labelKey: 'stacks.scenes' }],
    ['switches', { icon: 'mdi:toggle-switch', labelKey: 'stacks.switches' }],
    ['misc', { icon: 'mdi:light-switch', labelKey: 'stacks.misc' }],
    ['room_pins', { icon: 'mdi:pin', labelKey: 'stacks.room_pins' }],
  ]);

  private _presentStackKeys(data: NonNullable<ReturnType<typeof this._areaEntitiesCache.get>>): Set<StackKey> {
    const g = data.groupedEntities;
    const present = new Set<StackKey>();
    const has = (key: string): boolean => (g[key]?.length ?? 0) > 0;

    if (has('lights')) present.add('lights');
    if (has('locks')) present.add('locks');
    if (has('climate') || has('fan')) present.add('climate');
    if (has('covers') || has('covers_curtain')) present.add('covers');
    if (has('covers_window')) present.add('covers_window');
    if (has('media_player')) present.add('media');
    if (has('scenes') || has('automations') || has('scripts')) present.add('scenes');
    if (has('switches') && this._config.show_switches_section_in_rooms === true) present.add('switches');
    if (has('vacuum') || (has('switches') && this._config.show_switches_section_in_rooms !== true)) {
      present.add('misc');
    }
    if (has('energy')) present.add('energy');

    // These stacks are not reliably represented in the editor's area cache.
    present.add('cameras');
    present.add('room_pins');

    return present;
  }

  private _renderStackOrderPanel(
    areaId: string,
    data: NonNullable<ReturnType<typeof this._areaEntitiesCache.get>>
  ): TemplateResult {
    const order = this._getStacksOrder(areaId);
    const present = this._presentStackKeys(data);
    const visibleOrder = order.filter((key) => present.has(key));
    const inactiveOrder = order.filter((key) => !present.has(key));

    return html`
      <div class="entity-group" data-group="stack_order">
        <div class="entity-group-header">
          <ha-icon icon="mdi:sort"></ha-icon>
          <span class="group-name">${localize('editor.stack_order')}</span>
        </div>
        <div class="entity-list">
          <div class="description" style="margin-left: 0; margin-bottom: 8px;">
            ${localize('editor.stack_order_desc')}
          </div>
          <div class="section-order-list" data-area-id=${areaId}>
            ${visibleOrder.map((key) => {
              const meta = Simon42DashboardStrategyEditor._stackMeta.get(key);
              if (!meta) return nothing;
              return html`
                <div
                  class="section-order-item"
                  data-area-id=${areaId}
                  data-stack-key=${key}
                  draggable="true"
                  @dragstart=${this._handleStackDragStart}
                  @dragend=${this._handleStackDragEnd}
                  @dragover=${this._handleStackDragOver}
                  @dragleave=${this._handleStackDragLeave}
                  @drop=${this._handleStackDrop}
                >
                  <span class="drag-handle" draggable="true">&#x2630;</span>
                  <ha-icon class="section-icon" icon=${meta.icon}></ha-icon>
                  <span class="section-label">${localize(meta.labelKey)}</span>
                </div>
              `;
            })}
          </div>
          ${inactiveOrder.length > 0
            ? html`
                <div class="section-order-compact">
                  <div class="compact-title">${localize('editor.stack_order_inactive')}</div>
                  <div class="compact-chip-list">
                    ${inactiveOrder.map((key) => {
                      const meta = Simon42DashboardStrategyEditor._stackMeta.get(key);
                      if (!meta) return nothing;
                      return html`
                        <span class="compact-chip">
                          <ha-icon icon=${meta.icon}></ha-icon>
                          ${localize(meta.labelKey)}
                        </span>
                      `;
                    })}
                  </div>
                </div>
              `
            : nothing}
        </div>
      </div>
    `;
  }

  private _handleStackDragStart = (ev: DragEvent): void => {
    const dragHandle = (ev.target as HTMLElement).closest('.drag-handle');
    if (!dragHandle) {
      ev.preventDefault();
      return;
    }

    const item = (ev.target as HTMLElement).closest('.section-order-item') as HTMLElement | null;
    if (!item) {
      ev.preventDefault();
      return;
    }

    item.classList.add('dragging');
    if (ev.dataTransfer) {
      ev.dataTransfer.effectAllowed = 'move';
      ev.dataTransfer.setData('text/plain', item.dataset.stackKey || '');
    }
    this._stackDraggedElement = item;
  };

  private _handleStackDragEnd = (ev: DragEvent): void => {
    const item = (ev.target as HTMLElement).closest('.section-order-item') as HTMLElement | null;
    if (item) item.classList.remove('dragging');

    this.shadowRoot
      ?.querySelectorAll('.section-order-item.drag-over')
      .forEach((el) => el.classList.remove('drag-over'));
    this._stackDraggedElement = null;
  };

  private _handleStackDragOver = (ev: DragEvent): void => {
    ev.preventDefault();
    if (ev.dataTransfer) ev.dataTransfer.dropEffect = 'move';

    const item = ev.currentTarget as HTMLElement;
    if (item !== this._stackDraggedElement) {
      item.classList.add('drag-over');
    }
  };

  private _handleStackDragLeave = (ev: DragEvent): void => {
    (ev.currentTarget as HTMLElement).classList.remove('drag-over');
  };

  private _handleStackDrop = (ev: DragEvent): void => {
    ev.stopPropagation();
    ev.preventDefault();

    const dropTarget = ev.currentTarget as HTMLElement;
    dropTarget.classList.remove('drag-over');

    if (!this._stackDraggedElement || this._stackDraggedElement === dropTarget) return;

    const draggedKey = this._stackDraggedElement.dataset.stackKey as StackKey | undefined;
    const dropKey = dropTarget.dataset.stackKey as StackKey | undefined;
    const areaId = dropTarget.dataset.areaId;
    if (!draggedKey || !dropKey || !areaId) return;

    const currentOrder = this._getStacksOrder(areaId);
    const draggedIndex = currentOrder.indexOf(draggedKey);
    const dropIndex = currentOrder.indexOf(dropKey);
    if (draggedIndex === -1 || dropIndex === -1) return;

    const newOrder = [...currentOrder];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(dropIndex, 0, draggedKey);

    this._updateStacksOrder(areaId, newOrder);
  };

  // -- Overview section --------------------------------------------------

  private _renderBasicOverviewSection(): TemplateResult {
    const weatherEntitySelected = this._config.weather_entity || '';
    const weatherEntities = this._getWeatherEntities();
    const overviewMaxColumns = this._config.overview_max_columns ?? 3;
    const areaCardColumns = this._config.overview_area_card_columns ?? 'full';
    const weatherMode = this._config.weather_start_weather_mode ?? 'full';
    const dateCard = this._config.weather_start_date_card ?? 'button-card';

    return html`
      <div class="section">
        <div class="section-title">${localize('editor.section_overview')}</div>
        ${renderDesignSection(this)}
        <div class="form-row">
          <label for="basic-weather-entity" style="margin-right: 8px; min-width: 120px;"
            >${localize('editor.weather_entity')}</label
          >
          <select id="basic-weather-entity" style="flex: 1;" @change=${this._weatherEntityChanged}>
            <option value="" ?selected=${!weatherEntitySelected}>${localize('editor.weather_entity_auto')}</option>
            ${weatherEntities.map(
              (entity) => html`
                <option value=${entity.entity_id} ?selected=${entity.entity_id === weatherEntitySelected}>
                  ${entity.name}
                </option>
              `
            )}
          </select>
        </div>
        <div class="form-row">
          <label style="margin-right: 8px; min-width: 120px;">${localize('editor.overview_max_columns')}</label>
          <select
            style="flex: 1;"
            @change=${(e: Event) =>
              this._simpleOptionChanged('overview_max_columns', Number((e.target as HTMLSelectElement).value), 3)}
          >
            ${[1, 2, 3, 4].map(
              (value) => html`<option value=${value} ?selected=${overviewMaxColumns === value}>${value}</option>`
            )}
          </select>
        </div>
        <div class="form-row">
          <label style="margin-right: 8px; min-width: 120px;">${localize('editor.overview_area_card_columns')}</label>
          <select
            style="flex: 1;"
            @change=${(e: Event) =>
              this._simpleOptionChanged(
                'overview_area_card_columns',
                (e.target as HTMLSelectElement).value === 'full'
                  ? 'full'
                  : Number((e.target as HTMLSelectElement).value),
                'full'
              )}
          >
            <option value="full" ?selected=${areaCardColumns === 'full'}>${localize('editor.columns_full')}</option>
            <option value="6" ?selected=${areaCardColumns === 6}>2</option>
            <option value="4" ?selected=${areaCardColumns === 4}>3</option>
          </select>
        </div>
        <div class="form-row">
          <label style="margin-right: 8px; min-width: 120px;">${localize('editor.weather_start_weather_mode')}</label>
          <select
            style="flex: 1;"
            @change=${(e: Event) =>
              this._simpleOptionChanged('weather_start_weather_mode', (e.target as HTMLSelectElement).value, 'full')}
          >
            <option value="full" ?selected=${weatherMode === 'full'}>${localize('editor.weather_mode_full')}</option>
            <option value="compact_hourly" ?selected=${weatherMode === 'compact_hourly'}>
              ${localize('editor.weather_mode_compact_hourly')}
            </option>
          </select>
        </div>
        <div class="form-row">
          <label style="margin-right: 8px; min-width: 120px;">${localize('editor.weather_start_date_card')}</label>
          <select
            style="flex: 1;"
            @change=${(e: Event) =>
              this._simpleOptionChanged(
                'weather_start_date_card',
                (e.target as HTMLSelectElement).value,
                'button-card'
              )}
          >
            <option value="button-card" ?selected=${dateCard === 'button-card'}>button-card</option>
            <option value="markdown" ?selected=${dateCard === 'markdown'}>
              ${localize('editor.date_card_markdown')}
            </option>
          </select>
        </div>
      </div>
    `;
  }

  private _renderBasicSummariesSection(): TemplateResult {
    return html`
      <div class="section">
        <div class="section-title">${localize('editor.section_summaries')}</div>
        ${this._renderCheckbox(
          'basic-show-light-summary',
          localize('editor.show_light_summary'),
          this._config.show_light_summary !== false,
          (checked) => this._toggleChanged('show_light_summary', checked, true)
        )}
        ${this._renderCheckbox(
          'basic-show-covers-summary',
          localize('editor.show_covers_summary'),
          this._config.show_covers_summary !== false,
          (checked) => this._toggleChanged('show_covers_summary', checked, true)
        )}
        ${this._renderCheckbox(
          'basic-show-security-summary',
          localize('editor.show_security_summary'),
          this._config.show_security_summary !== false,
          (checked) => this._toggleChanged('show_security_summary', checked, true)
        )}
        ${this._renderCheckbox(
          'basic-show-climate-summary',
          localize('editor.show_climate_summary'),
          this._config.show_climate_summary !== false,
          (checked) => this._toggleChanged('show_climate_summary', checked, false)
        )}
        ${this._renderCheckbox(
          'basic-show-battery-summary',
          localize('editor.show_battery_summary'),
          this._config.show_battery_summary !== false,
          (checked) => this._toggleChanged('show_battery_summary', checked, true)
        )}
      </div>
    `;
  }

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

  private _renderOverviewSection(): TemplateResult {
    const showClockCard = this._config.show_clock_card !== false;
    const hasSearchCardDeps = this._checkSearchCardDependencies();
    const showSearchCard =
      this._config.show_search_card === true ||
      (this._config.show_search_card === undefined && hasSearchCardDeps);
    const showPersonBadges = this._config.show_person_badges !== false;
    const personBadgeLayout = this._config.person_badge_layout || 'with_state';
    const alarmEntity = this._config.alarm_entity || '';
    const alarmEntities = this._getAlarmEntities();
    const houseModeEntity = this._config.house_mode_entity || '';
    const houseModeEntities = this._getHouseModeEntities();

    return html`
      <div class="section">
        <div class="section-title">${localize('editor.section_overview_details')}</div>

        ${this._renderCheckbox(
          'show-person-badges',
          localize('editor.show_person_badges'),
          showPersonBadges,
          (checked) => this._toggleChanged('show_person_badges', checked, true)
        )}
        <div class="description">${localize('editor.show_person_badges_desc')}</div>

        <div class="form-row">
          <label for="person-badge-layout" style="margin-right: 8px; min-width: 120px;"
            >${localize('editor.person_badge_layout')}</label
          >
          <select id="person-badge-layout" style="flex: 1;" @change=${this._personBadgeLayoutChanged}>
            <option value="minimal" ?selected=${personBadgeLayout === 'minimal'}>
              ${localize('editor.person_badge_layout_minimal')}
            </option>
            <option value="with_state" ?selected=${personBadgeLayout === 'with_state'}>
              ${localize('editor.person_badge_layout_with_state')}
            </option>
            <option value="with_state_and_time" ?selected=${personBadgeLayout === 'with_state_and_time'}>
              ${localize('editor.person_badge_layout_with_state_and_time')}
            </option>
          </select>
        </div>
        <div class="description">${localize('editor.person_badge_layout_desc')}</div>

        ${this._renderCheckbox(
          'show-unavailable-alert-badge',
          localize('editor.show_unavailable_alert_badge'),
          this._config.show_unavailable_alert_badge === true,
          (checked) => this._toggleChanged('show_unavailable_alert_badge', checked, false)
        )}
        <div class="description">${localize('editor.show_unavailable_alert_badge_desc')}</div>

        ${this._renderCheckbox(
          'show-now-playing-badge',
          localize('editor.show_now_playing_badge'),
          this._config.show_now_playing_badge === true,
          (checked) => this._toggleChanged('show_now_playing_badge', checked, false)
        )}
        <div class="description">${localize('editor.show_now_playing_badge_desc')}</div>

        ${this._renderCheckbox(
          'show-sun-badge',
          localize('editor.show_sun_badge'),
          this._config.show_sun_badge === true,
          (checked) => this._toggleChanged('show_sun_badge', checked, false)
        )}
        <div class="description">${localize('editor.show_sun_badge_desc')}</div>

        ${this._renderCheckbox(
          'show-updates-badge',
          localize('editor.show_updates_badge'),
          this._config.show_updates_badge === true,
          (checked) => this._toggleChanged('show_updates_badge', checked, false)
        )}
        <div class="description">${localize('editor.show_updates_badge_desc')}</div>

        ${html`
          ${this._renderCheckbox('show-clock-card', localize('editor.show_clock_card'), showClockCard, (checked) =>
            this._toggleChanged('show_clock_card', checked, true)
          )}
          <div class="description">${localize('editor.show_clock_card_desc')}</div>

          <div class="form-row">
            <label for="alarm-entity" style="margin-right: 8px; min-width: 120px;"
              >${localize('editor.alarm_entity')}</label
            >
            <select id="alarm-entity" style="flex: 1;" @change=${this._alarmEntityChanged}>
              <option value="" ?selected=${!alarmEntity}>${localize('editor.alarm_none')}</option>
              ${alarmEntities.map(
                (entity) => html`
                  <option value=${entity.entity_id} ?selected=${entity.entity_id === alarmEntity}>
                    ${entity.name}
                  </option>
                `
              )}
            </select>
          </div>
          <div class="description">${localize('editor.alarm_desc')}</div>

          <div class="form-row">
            <label for="house-mode-entity" style="margin-right: 8px; min-width: 120px;">
              ${localize('editor.house_mode_entity')}
            </label>
            <select id="house-mode-entity" style="flex: 1;" @change=${this._houseModeEntityChanged}>
              <option value="" ?selected=${!houseModeEntity}>${localize('editor.house_mode_none')}</option>
              ${houseModeEntities.map(
                (entity) => html`<option value=${entity.entity_id} ?selected=${entity.entity_id === houseModeEntity}>
                  ${entity.name}
                </option>`
              )}
            </select>
          </div>
          <div class="description">${localize('editor.house_mode_desc')}</div>

          ${this._renderCheckbox(
            'show-search-card',
            localize('editor.show_search_card'),
            showSearchCard,
            (checked) => this._toggleChanged('show_search_card', checked, false),
            this._config.search_card_variant !== 'tip' && !hasSearchCardDeps
          )}
          <div class="description">
            ${this._config.search_card_variant === 'tip' || hasSearchCardDeps
              ? localize('editor.show_search_card_desc')
              : html`<span>&#x26A0;&#xFE0F; ${unsafeHTML(localize('editor.show_search_card_missing'))}</span>`}
          </div>
          ${showSearchCard ? html`
            <div class="form-row">
              <label>${localize('editor.search_card_variant')}</label>
              <select @change=${(event: Event) => this._searchCardVariantChanged((event.target as HTMLSelectElement).value)}>
                <option value="custom" ?selected=${this._config.search_card_variant !== 'tip'}>${localize('editor.search_card_variant_custom')}</option>
                <option value="tip" ?selected=${this._config.search_card_variant === 'tip'}>${localize('editor.search_card_variant_tip')}</option>
              </select>
            </div>
          ` : nothing}
        `}
      </div>
    `;
  }

  private _renderSummariesSection(): TemplateResult {
    const summariesColumns = this._config.summaries_columns || 2;
    const groupLightsByFloors = this._config.group_lights_by_floors === true;
    const groupCoversByFloors = this._config.group_covers_by_floors === true;
    const nestedLightGroups = this._config.nested_light_groups === true;
    const lightsSortByName = this._config.lights_sort_by === 'name';
    const showPartiallyOpenCovers = this._config.show_partially_open_covers === true;
    const hideMobileAppBatteries = this._config.hide_mobile_app_batteries === true;
    const hideBatteryNotesEntities = this._config.hide_battery_notes_entities === true;
    const showBatteryView = this._config.show_battery_view === true;
    const showAreaInBatteryView = this._config.show_area_in_battery_view === true;
    const batteryCriticalThreshold = this._config.battery_critical_threshold ?? 20;
    const batteryLowThreshold = this._config.battery_low_threshold ?? 50;
    const unavailableBatteriesBucket = this._config.unavailable_batteries_bucket === 'critical' ? 'critical' : 'good';
    const securityExtraEntities = this._config.security_extra_entities || [];
    const showLightSummary = this._config.show_light_summary !== false;
    const showCoversSummary = this._config.show_covers_summary !== false;
    const showSecuritySummary = this._config.show_security_summary !== false;
    const showBatterySummary = this._config.show_battery_summary !== false;
    const showClimateSummary = this._config.show_climate_summary !== false;

    return html`
      <div class="section">
        <div class="section-title">${localize('editor.section_summary_details')}</div>

        <div class="form-row">
          <input
            type="radio"
            id="summaries-2-columns"
            name="summaries-columns"
            value="2"
            ?checked=${summariesColumns === 2}
            @change=${() => this._summariesColumnsChanged(2)}
          />
          <label for="summaries-2-columns">${localize('editor.columns_2')}</label>
        </div>
        <div class="form-row">
          <input
            type="radio"
            id="summaries-4-columns"
            name="summaries-columns"
            value="4"
            ?checked=${summariesColumns === 4}
            @change=${() => this._summariesColumnsChanged(4)}
          />
          <label for="summaries-4-columns">${localize('editor.columns_4')}</label>
        </div>
        <div class="description">${localize('editor.columns_desc')}</div>

        <div class="subsection-title">${localize('editor.security_options')}</div>
        ${!showSecuritySummary
          ? html`${this._renderCheckbox(
              'show-security-view',
              localize('editor.show_security_view'),
              this._config.show_security_view === true,
              (checked) => this._toggleChanged('show_security_view', checked, false)
            )}<div class="description">${localize('editor.show_security_view_desc')}</div>`
          : nothing}
        ${this._renderCheckbox(
          'group-security-by-areas',
          localize('editor.group_security_by_areas'),
          this._config.group_security_by_areas === true,
          (checked) => this._toggleChanged('group_security_by_areas', checked, false)
        )}
        <div class="description">${localize('editor.group_security_by_areas_desc')}</div>
        ${this._renderCheckbox(
          'hide-hidden-areas-in-security',
          localize('editor.hide_hidden_areas_in_security'),
          this._config.hide_hidden_areas_in_security === true,
          (checked) => this._toggleChanged('hide_hidden_areas_in_security', checked, false)
        )}
        <div class="description">${localize('editor.hide_hidden_areas_in_security_desc')}</div>
        ${this._renderCheckbox(
          'show-security-activity',
          localize('editor.show_security_activity'),
          this._config.show_security_activity === true,
          (checked) => this._toggleChanged('show_security_activity', checked, false)
        )}
        <div class="description">${localize('editor.show_security_activity_desc')}</div>
        <div class="form-row">
          <label>${localize('editor.security_activity_position')}</label>
          <select @change=${(event: Event) => this._securityActivityPositionChanged((event.target as HTMLSelectElement).value)}>
            <option value="start" ?selected=${this._config.security_activity_position !== 'end'}>${localize('editor.position_start')}</option>
            <option value="end" ?selected=${this._config.security_activity_position === 'end'}>${localize('editor.position_end')}</option>
          </select>
        </div>
        <ha-textfield
          .value=${securityExtraEntities.join(', ')}
          label=${localize('editor.security_extra_entities')}
          @change=${(event: Event) => this._securityExtraEntitiesChanged((event.target as HTMLInputElement).value)}
        ></ha-textfield>

        ${!showLightSummary
          ? html`${this._renderCheckbox(
              'show-light-view',
              localize('editor.show_light_view'),
              this._config.show_light_view === true,
              (checked) => this._toggleChanged('show_light_view', checked, false)
            )}<div class="description">${localize('editor.show_light_view_desc')}</div>`
          : nothing}

        ${this._renderCheckbox(
          'group-lights-by-floors',
          localize('editor.group_lights_by_floors'),
          groupLightsByFloors,
          (checked) => this._toggleChanged('group_lights_by_floors', checked, false)
        )}
        <div class="description">${localize('editor.group_lights_by_floors_desc')}</div>
        ${this._renderCheckbox(
          'group-lights-by-areas',
          localize('editor.group_lights_by_areas'),
          this._config.group_lights_by_areas === true,
          (checked) => this._toggleChanged('group_lights_by_areas', checked, false)
        )}
        <div class="description">${localize('editor.group_lights_by_areas_desc')}</div>

        ${!showCoversSummary
          ? html`${this._renderCheckbox(
              'show-covers-view',
              localize('editor.show_covers_view'),
              this._config.show_covers_view === true,
              (checked) => this._toggleChanged('show_covers_view', checked, false)
            )}<div class="description">${localize('editor.show_covers_view_desc')}</div>`
          : nothing}

        ${this._renderCheckbox(
          'group-covers-by-floors',
          localize('editor.group_covers_by_floors'),
          groupCoversByFloors,
          (checked) => this._toggleChanged('group_covers_by_floors', checked, false)
        )}
        <div class="description">${localize('editor.group_covers_by_floors_desc')}</div>
        ${this._renderCheckbox(
          'group-covers-by-areas',
          localize('editor.group_covers_by_areas'),
          this._config.group_covers_by_areas === true,
          (checked) => this._toggleChanged('group_covers_by_areas', checked, false)
        )}
        <div class="description">${localize('editor.group_covers_by_areas_desc')}</div>

        ${!showClimateSummary
          ? html`${this._renderCheckbox(
              'show-climate-view',
              localize('editor.show_climate_view'),
              this._config.show_climate_view === true,
              (checked) => this._toggleChanged('show_climate_view', checked, false)
            )}<div class="description">${localize('editor.show_climate_view_desc')}</div>`
          : nothing}

        ${this._renderCheckbox(
          'nested-light-groups',
          localize('editor.nested_light_groups'),
          nestedLightGroups,
          (checked) => this._toggleChanged('nested_light_groups', checked, false)
        )}
        <div class="description">${localize('editor.nested_light_groups_desc')}</div>

        ${this._renderCheckbox(
          'lights-sort-by-name',
          localize('editor.lights_sort_by_name'),
          lightsSortByName,
          (checked) => this._lightsSortByNameChanged(checked)
        )}
        <div class="description">${localize('editor.lights_sort_by_name_desc')}</div>

        <div style="margin-left: 26px; margin-bottom: 8px;">
          ${this._renderCheckbox(
            'show-partially-open-covers',
            localize('editor.show_partially_open_covers'),
            showPartiallyOpenCovers,
            (checked) => this._toggleChanged('show_partially_open_covers', checked, false)
          )}
          <div class="description">${localize('editor.show_partially_open_covers_desc')}</div>
        </div>

        <div style="margin-left: 26px; margin-bottom: 8px;">
          ${this._renderCheckbox(
            'hide-mobile-app-batteries',
            localize('editor.hide_mobile_app_batteries'),
            hideMobileAppBatteries,
            (checked) => this._toggleChanged('hide_mobile_app_batteries', checked, false)
          )}
          <div class="description">${localize('editor.hide_mobile_app_batteries_desc')}</div>

          ${this._renderCheckbox(
            'hide-battery-notes-entities',
            localize('editor.hide_battery_notes_entities'),
            hideBatteryNotesEntities,
            (checked) => this._toggleChanged('hide_battery_notes_entities', checked, false)
          )}
          <div class="description">${localize('editor.hide_battery_notes_entities_desc')}</div>

          ${!showBatterySummary
            ? html`${this._renderCheckbox(
                'show-battery-view',
                localize('editor.show_battery_view'),
                showBatteryView,
                (checked) => this._toggleChanged('show_battery_view', checked, false)
              )}<div class="description">${localize('editor.show_battery_view_desc')}</div>`
            : nothing}

          ${this._renderCheckbox(
            'show-area-in-battery-view',
            localize('editor.show_area_in_battery_view'),
            showAreaInBatteryView,
            (checked) => this._toggleChanged('show_area_in_battery_view', checked, false)
          )}
          <div class="description">${localize('editor.show_area_in_battery_view_desc')}</div>
          ${this._renderCheckbox(
            'group-batteries-by-areas',
            localize('editor.group_batteries_by_areas'),
            this._config.group_batteries_by_areas === true,
            (checked) => this._toggleChanged('group_batteries_by_areas', checked, false)
          )}
          <div class="description">${localize('editor.group_batteries_by_areas_desc')}</div>

          <div
            style="font-size: 13px; font-weight: 500; color: var(--primary-text-color); margin-top: 12px; margin-bottom: 4px;"
          >
            ${localize('editor.battery_thresholds')}
          </div>
          <div class="form-row">
            <label for="battery-critical-threshold" style="min-width: 140px;"
              >${localize('editor.battery_critical_below')}</label
            >
            <input
              type="number"
              id="battery-critical-threshold"
              min="1"
              max="99"
              .value=${String(batteryCriticalThreshold)}
              style="width: 70px;"
              @change=${this._batteryCriticalChanged}
            />
            %
          </div>
          <div class="form-row">
            <label for="battery-low-threshold" style="min-width: 140px;">${localize('editor.battery_low_below')}</label>
            <input
              type="number"
              id="battery-low-threshold"
              min="1"
              max="99"
              .value=${String(batteryLowThreshold)}
              style="width: 70px;"
              @change=${this._batteryLowChanged}
            />
            %
          </div>
          <div class="description">${localize('editor.battery_thresholds_desc')}</div>

          <div
            style="font-size: 13px; font-weight: 500; color: var(--primary-text-color); margin-top: 12px; margin-bottom: 4px;"
          >
            ${localize('editor.unavailable_batteries_bucket')}
          </div>
          <div class="form-row">
            <input
              type="radio"
              id="battery-unavailable-good"
              name="battery-unavailable-bucket"
              value="good"
              ?checked=${unavailableBatteriesBucket === 'good'}
              @change=${() => this._unavailableBatteriesBucketChanged('good')}
            />
            <label for="battery-unavailable-good">${localize('batteries.good')}</label>
          </div>
          <div class="form-row">
            <input
              type="radio"
              id="battery-unavailable-critical"
              name="battery-unavailable-bucket"
              value="critical"
              ?checked=${unavailableBatteriesBucket === 'critical'}
              @change=${() => this._unavailableBatteriesBucketChanged('critical')}
            />
            <label for="battery-unavailable-critical">${localize('batteries.critical')}</label>
          </div>
          <div class="description">${localize('editor.unavailable_batteries_bucket_desc')}</div>
        </div>
      </div>
    `;
  }

  private _renderFavoritesSection(): TemplateResult {
    const favoriteEntities = this._config.favorite_entities || [];
    const allEntities = this._getAllEntitiesForSelect();
    const favoritesShowState = this._config.favorites_show_state === true;
    const favoritesHideLastChanged = this._config.favorites_hide_last_changed === true;

    const entityMap = new Map(allEntities.map((e) => [e.entity_id, e.name]));
    const filteredEntities = this._getFilteredEntities(this._favoriteSearch);

    const lightFavorites = this._config.light_favorite_entities || [];
    return html`
      <div class="section">
        <div class="section-title">${localize('editor.section_favorites')}</div>

        <div id="favorites-list" style="margin-bottom: 12px;">
          ${favoriteEntities.length === 0
            ? html`<div class="empty-state">${localize('editor.no_favorites')}</div>`
            : html`
                <div class="entity-list-container">
                  ${favoriteEntities.map((entityId) => {
                    const name = entityMap.get(entityId) || entityId;
                    return html`
                      <div
                        class="entity-list-item"
                        data-entity-id=${entityId}
                        draggable="true"
                        @dragstart=${(ev: DragEvent) => this._handleEntityDragStart(ev, 'favorites')}
                        @dragend=${this._handleEntityDragEnd}
                        @dragover=${this._handleEntityDragOver}
                        @dragleave=${this._handleEntityDragLeave}
                        @drop=${(ev: DragEvent) => this._handleEntityDrop(ev, 'favorites')}
                      >
                        <span class="drag-icon">&#x2630;</span>
                        <span class="item-info">
                          <span class="item-name">${name}</span>
                          <span class="item-entity-id">${entityId}</span>
                        </span>
                        <button class="btn-remove" @click=${() => this._removeFavoriteEntity(entityId)}>
                          &#x2715;
                        </button>
                      </div>
                    `;
                  })}
                </div>
              `}
        </div>

        <div class="entity-search-picker">
          <input
            type="text"
            class="entity-search-input"
            placeholder=${localize('editor.select_entity') + '...'}
            .value=${this._favoriteSearch}
            @input=${(e: Event) => {
              this._favoriteSearch = (e.target as HTMLInputElement).value;
              this.requestUpdate();
            }}
            @blur=${() => {
              setTimeout(() => {
                this._favoriteSearch = '';
                this.requestUpdate();
              }, 200);
            }}
          />
          ${this._favoriteSearch.length >= 2
            ? html`
                <div class="entity-search-results">
                  ${filteredEntities.length > 0
                    ? filteredEntities.map(
                        (entity) => html`
                          <div
                            class="entity-search-result"
                            @mousedown=${(e: Event) => {
                              e.preventDefault();
                              this._addFavoriteEntity(entity.entity_id);
                              this._favoriteSearch = '';
                              this.requestUpdate();
                            }}
                          >
                            <span class="entity-search-name">${entity.name}</span>
                            <span class="entity-search-id">${entity.entity_id}</span>
                          </div>
                        `
                      )
                    : html`<div class="entity-search-no-results">${localize('editor.no_results')}</div>`}
                </div>
              `
            : nothing}
        </div>
        <div class="description">${localize('editor.favorites_desc')}</div>

        ${this._renderCheckbox('favorites-show-state', localize('editor.show_state'), favoritesShowState, (checked) =>
          this._toggleChanged('favorites_show_state', checked, false)
        )}
        ${this._renderCheckbox(
          'favorites-hide-last-changed',
          localize('editor.hide_last_changed'),
          favoritesHideLastChanged,
          (checked) => this._toggleChanged('favorites_hide_last_changed', checked, false)
        )}
        <div class="subsection-title">${localize('editor.light_favorites')}</div>
        <ha-textfield
          .value=${lightFavorites.join(', ')}
          label=${localize('editor.light_favorites_entities')}
          helper=${localize('editor.light_favorites_desc')}
          @change=${(event: Event) => this._lightFavoritesChanged((event.target as HTMLInputElement).value)}
        ></ha-textfield>
      </div>
    `;
  }

  private _renderAreasSection(): TemplateResult {
    const groupByFloors = this._config.group_by_floors === true;
    const areaDisplayType = this._config.area_display_type ?? 'compact';
    const showSwitchesOnAreas = this._config.show_switches_on_areas === true;
    const showAlertsOnAreas = this._config.show_alerts_on_areas === true;
    const showLocksInRooms = this._config.show_locks_in_rooms === true;
    const showAutomationsInRooms = this._config.show_automations_in_rooms === true;
    const showScriptsInRooms = this._config.show_scripts_in_rooms === true;
    const showVacuumsSectionInRooms = this._config.show_vacuums_section_in_rooms === true;
    const showSwitchesSectionInRooms = this._config.show_switches_section_in_rooms === true;
    const cameraLiveToggle = this._config.camera_live_toggle === true;
    const showCoverControlsInRooms = this._config.show_cover_controls_in_rooms === true;
    const showEnergyInRooms = this._config.show_energy_in_rooms !== false;
    const showUpsInRooms = this._config.show_ups_in_rooms !== false;
    const showWindowContactsInRooms = this._config.show_window_contacts_in_rooms === true;
    const showDoorContactsInRooms = this._config.show_door_contacts_in_rooms === true;
    const useDefaultAreaSort = this._config.use_default_area_sort === true;

    return html`
      <div class="section">
        <div class="section-title">${localize('editor.section_areas')}</div>

        <div class="option-groups">
          <div class="option-group">
            <div class="option-group-title">
              <ha-icon icon="mdi:view-dashboard-outline"></ha-icon>
              <span>${localize('editor.area_overview_options')}</span>
            </div>
            ${this._renderCheckbox('group-by-floors', localize('editor.group_by_floors'), groupByFloors, (checked) =>
              this._toggleChanged('group_by_floors', checked, false)
            )}
            <div class="description">${localize('editor.group_by_floors_desc')}</div>

            <div class="form-row">
              <label for="area-display-type">${localize('editor.area_display_type')}</label>
              <select
                id="area-display-type"
                .value=${areaDisplayType}
                @change=${(event: Event) =>
                  this._globalAreaDisplayTypeChanged((event.target as HTMLSelectElement).value as AreaDisplayType)}
              >
                <option value="compact">${localize('editor.area_display_type_compact')}</option>
                <option value="picture">${localize('editor.area_display_type_picture')}</option>
              </select>
            </div>
            <div class="description">${localize('editor.area_display_type_desc')}</div>

            ${this._renderCheckbox(
              'show-switches-on-areas',
              localize('editor.show_switches_on_areas'),
              showSwitchesOnAreas,
              (checked) => this._toggleChanged('show_switches_on_areas', checked, false)
            )}
            <div class="description">${localize('editor.show_switches_on_areas_desc')}</div>

            ${this._renderCheckbox(
              'show-alerts-on-areas',
              localize('editor.show_alerts_on_areas'),
              showAlertsOnAreas,
              (checked) => this._toggleChanged('show_alerts_on_areas', checked, false)
            )}
            <div class="description">${localize('editor.show_alerts_on_areas_desc')}</div>
          </div>

          <div class="option-group">
            <div class="option-group-title">
              <ha-icon icon="mdi:door-open"></ha-icon>
              <span>${localize('editor.room_view_options')}</span>
            </div>
            ${this._renderCheckbox(
              'show-locks-in-rooms',
              localize('editor.show_locks_in_rooms'),
              showLocksInRooms,
              (checked) => this._toggleChanged('show_locks_in_rooms', checked, false)
            )}
            <div class="description">${localize('editor.show_locks_in_rooms_desc')}</div>

            ${this._renderCheckbox(
              'show-automations-in-rooms',
              localize('editor.show_automations_in_rooms'),
              showAutomationsInRooms,
              (checked) => this._toggleChanged('show_automations_in_rooms', checked, false)
            )}
            <div class="description">${localize('editor.show_automations_in_rooms_desc')}</div>

            ${this._renderCheckbox(
              'show-scripts-in-rooms',
              localize('editor.show_scripts_in_rooms'),
              showScriptsInRooms,
              (checked) => this._toggleChanged('show_scripts_in_rooms', checked, false)
            )}
            <div class="description">${localize('editor.show_scripts_in_rooms_desc')}</div>

            ${this._renderCheckbox(
              'show-vacuums-section-in-rooms',
              localize('editor.show_vacuums_section_in_rooms'),
              showVacuumsSectionInRooms,
              (checked) => this._toggleChanged('show_vacuums_section_in_rooms', checked, false)
            )}
            <div class="description">${localize('editor.show_vacuums_section_in_rooms_desc')}</div>

            ${this._renderCheckbox(
              'show-switches-section-in-rooms',
              localize('editor.show_switches_section_in_rooms'),
              showSwitchesSectionInRooms,
              (checked) => this._toggleChanged('show_switches_section_in_rooms', checked, false)
            )}
            <div class="description">${localize('editor.show_switches_section_in_rooms_desc')}</div>

            ${this._renderCheckbox(
              'show-cover-controls-in-rooms',
              localize('editor.show_cover_controls_in_rooms'),
              showCoverControlsInRooms,
              (checked) => this._toggleChanged('show_cover_controls_in_rooms', checked, false)
            )}
            <div class="description">${localize('editor.show_cover_controls_in_rooms_desc')}</div>

            ${this._renderCheckbox(
              'camera-live-toggle',
              localize('editor.camera_live_toggle'),
              cameraLiveToggle,
              (checked) => this._toggleChanged('camera_live_toggle', checked, false)
            )}
            <div class="description">${localize('editor.camera_live_toggle_desc')}</div>

            ${this._renderCheckbox(
              'show-energy-in-rooms',
              localize('editor.show_energy_in_rooms'),
              showEnergyInRooms,
              (checked) => this._toggleChanged('show_energy_in_rooms', checked, true)
            )}
            <div class="description">${localize('editor.show_energy_in_rooms_desc')}</div>

            ${this._renderCheckbox(
              'show-ups-in-rooms',
              localize('editor.show_ups_in_rooms'),
              showUpsInRooms,
              (checked) => this._toggleChanged('show_ups_in_rooms', checked, true)
            )}
            <div class="description">${localize('editor.show_ups_in_rooms_desc')}</div>

            ${this._renderCheckbox(
              'show-window-contacts-in-rooms',
              localize('editor.show_window_contacts_in_rooms'),
              showWindowContactsInRooms,
              (checked) => this._toggleChanged('show_window_contacts_in_rooms', checked, false)
            )}
            <div class="description">${localize('editor.show_window_contacts_in_rooms_desc')}</div>

            ${this._renderCheckbox(
              'show-door-contacts-in-rooms',
              localize('editor.show_door_contacts_in_rooms'),
              showDoorContactsInRooms,
              (checked) => this._toggleChanged('show_door_contacts_in_rooms', checked, false)
            )}
            <div class="description">${localize('editor.show_door_contacts_in_rooms_desc')}</div>
          </div>

          <div class="option-group">
            <div class="option-group-title">
              <ha-icon icon="mdi:sort-alphabetical-ascending"></ha-icon>
              <span>${localize('editor.area_management_options')}</span>
            </div>
            ${this._renderCheckbox(
              'use-default-area-sort',
              localize('editor.use_default_area_sort'),
              useDefaultAreaSort,
              (checked) => this._toggleChanged('use_default_area_sort', checked, false)
            )}
            <div class="description">${localize('editor.use_default_area_sort_desc')}</div>
          </div>
        </div>
      </div>
    `;
  }

  private _renderRoomPinsSection(): TemplateResult {
    const roomPinEntities = this._config.room_pin_entities || [];
    const allEntities = this._getAllEntitiesForSelect();
    const allAreas = this._getSortedAreas();
    const roomPinsShowState = this._config.room_pins_show_state === true;
    const roomPinsHideLastChanged = this._config.room_pins_hide_last_changed === true;

    const entityMap = new Map(allEntities.map((e) => [e.entity_id, e]));
    const areaMap = new Map(allAreas.map((a) => [a.area_id, a.name]));
    const filteredEntities = this._getFilteredEntities(this._roomPinSearch, true);

    return html`
      <div class="section">
        <div class="section-title">${localize('editor.section_room_pins')}</div>

        <div id="room-pins-list" style="margin-bottom: 12px;">
          ${roomPinEntities.length === 0
            ? html`<div class="empty-state">${localize('editor.no_room_pins')}</div>`
            : html`
                <div class="entity-list-container">
                  ${roomPinEntities.map((entityId) => {
                    const entity = entityMap.get(entityId);
                    const name = entity?.name || entityId;
                    const areaId = entity?.area_id || entity?.device_area_id;
                    const areaName = areaId ? areaMap.get(areaId) || areaId : localize('editor.no_room');

                    return html`
                      <div
                        class="entity-list-item"
                        data-entity-id=${entityId}
                        draggable="true"
                        @dragstart=${(ev: DragEvent) => this._handleEntityDragStart(ev, 'room_pins')}
                        @dragend=${this._handleEntityDragEnd}
                        @dragover=${this._handleEntityDragOver}
                        @dragleave=${this._handleEntityDragLeave}
                        @drop=${(ev: DragEvent) => this._handleEntityDrop(ev, 'room_pins')}
                      >
                        <span class="drag-icon">&#x2630;</span>
                        <span class="item-info">
                          <span class="item-name">${name}</span>
                          <span class="item-entity-id">${entityId}</span>
                          <span class="item-area">&#x1F4CD; ${areaName}</span>
                        </span>
                        <button class="btn-remove" @click=${() => this._removeRoomPinEntity(entityId)}>&#x2715;</button>
                      </div>
                    `;
                  })}
                </div>
              `}
        </div>

        <div class="entity-search-picker">
          <input
            type="text"
            class="entity-search-input"
            placeholder=${localize('editor.select_entity') + '...'}
            .value=${this._roomPinSearch}
            @input=${(e: Event) => {
              this._roomPinSearch = (e.target as HTMLInputElement).value;
              this.requestUpdate();
            }}
            @blur=${() => {
              setTimeout(() => {
                this._roomPinSearch = '';
                this.requestUpdate();
              }, 200);
            }}
          />
          ${this._roomPinSearch.length >= 2
            ? html`
                <div class="entity-search-results">
                  ${filteredEntities.length > 0
                    ? filteredEntities.map(
                        (entity) => html`
                          <div
                            class="entity-search-result"
                            @mousedown=${(e: Event) => {
                              e.preventDefault();
                              this._addRoomPinEntity(entity.entity_id);
                              this._roomPinSearch = '';
                              this.requestUpdate();
                            }}
                          >
                            <span class="entity-search-name">${entity.name}</span>
                            <span class="entity-search-id">${entity.entity_id}</span>
                          </div>
                        `
                      )
                    : html`<div class="entity-search-no-results">${localize('editor.no_results')}</div>`}
                </div>
              `
            : nothing}
        </div>
        <div class="description">${unsafeHTML(localize('editor.room_pins_desc'))}</div>

        ${this._renderCheckbox('room-pins-show-state', localize('editor.show_state'), roomPinsShowState, (checked) =>
          this._toggleChanged('room_pins_show_state', checked, false)
        )}
        ${this._renderCheckbox(
          'room-pins-hide-last-changed',
          localize('editor.hide_last_changed'),
          roomPinsHideLastChanged,
          (checked) => this._toggleChanged('room_pins_hide_last_changed', checked, false)
        )}
      </div>
    `;
  }

  private _renderViewsSection(): TemplateResult {
    const showSummaryViews = this._config.show_summary_views === true;
    const showRoomViews = this._config.show_room_views === true;
    const showCctvView = this._config.show_cctv_view === true;
    const cctvShowActivity = this._config.cctv_show_activity === true;
    const showCamerasInSecurity = this._config.show_cameras_in_security === true;
    const showMaintenanceView = this._config.show_maintenance_view !== false;
    const showMaintenanceActivity = this._config.show_maintenance_activity !== false;
    const showVideoTips = this._config.show_video_tips !== false;

    return html`${renderViewsPanel({
      showSummaryViews,
      showRoomViews,
      showCctvView,
      cctvShowActivity,
      showCamerasInSecurity,
      showMaintenanceView,
      showMaintenanceActivity,
      showVideoTips,
      checkbox: (id, label, checked, change) => this._renderCheckbox(id, label, checked, change),
      change: (key, checked, defaultValue = false) => this._toggleChanged(key, checked, defaultValue),
    })}${renderRoomVisibilityPanel(this)}${renderUserVisibilityPanel(this)}`;
  }

  private _renderRoomVisibilityRules(): TemplateResult {
    if (!this._hass) return html``;
    return html`<div class="section">
      <div class="section-title">${localize('editor.room_visibility')}</div>
      <div class="description" style="margin-left: 0;">${localize('editor.room_visibility_desc')}</div>
      ${this._getSortedAreas().map((area) => {
        const rule = this._config.room_visibility?.[area.area_id];
        return html`<div class="option-group">
          <div class="option-group-title">${area.name}</div>
          <div class="form-row">
            <ha-textfield label=${localize('editor.room_visibility_entity')} .value=${rule?.entity || ''}
              @change=${(event: Event) => this._roomVisibilityChanged(area.area_id, 'entity', (event.target as HTMLInputElement).value)}></ha-textfield>
            <ha-textfield label=${localize('editor.room_visibility_state')} .value=${rule?.state || ''}
              @change=${(event: Event) => this._roomVisibilityChanged(area.area_id, 'state', (event.target as HTMLInputElement).value)}></ha-textfield>
          </div>
        </div>`;
      })}
    </div>`;
  }

  private _roomVisibilityChanged(areaId: string, field: 'entity' | 'state', value: string): void {
    const rules = { ...(this._config.room_visibility || {}) };
    const next = { entity: rules[areaId]?.entity || '', state: rules[areaId]?.state || '', [field]: value.trim() };
    if (next.entity || next.state) rules[areaId] = next;
    else delete rules[areaId];
    const updated = { ...this._config };
    if (Object.keys(rules).length > 0) updated.room_visibility = rules;
    else delete updated.room_visibility;
    this._fireConfigChanged(updated);
  }

  private _renderUserVisibilityRules(): TemplateResult {
    if (!this._hass) return html``;
    const users = Object.entries(this._hass.states)
      .filter(([id, state]) => id.startsWith('person.') && typeof state.attributes.user_id === 'string')
      .map(([id, state]) => ({ id: state.attributes.user_id as string, name: String(state.attributes.friendly_name || id) }))
      .sort((a, b) => a.name.localeCompare(b.name));
    if (users.length === 0) return html``;
    const viewOptions = [
      ['home', localize('views.overview')], ['lights', localize('views.lights')],
      ['covers', localize('views.covers')], ['security', localize('views.security')],
      ['batteries', localize('views.batteries')], ['climate', localize('views.climate')],
      ['cctv', localize('views.cctv')], ['maintenance', localize('views.maintenance')],
      ...Object.values(this._hass.areas).map((area) => [area.area_id, area.name]),
      ...(this._config.custom_views || []).filter((view) => view.path && view.title).map((view) => [view.path, view.title]),
    ] as [string, string][];
    const sectionOptions = DEFAULT_WEATHER_START_ORDER.map((key) => [key, localize(`weather_start_blocks.${key}`)] as [string, string]);
    const renderRules = (kind: 'view' | 'section', options: [string, string][]) => options.map(([key, title]) => {
      const map = kind === 'view' ? this._config.view_visible_users : this._config.section_visible_users;
      const selected = Object.prototype.hasOwnProperty.call(map || {}, key) ? map?.[key] || [] : users.map((user) => user.id);
      return html`<div class="option-group"><div class="option-group-title">${title}</div>${users.map((user) =>
        this._renderCheckbox(`${kind}-${key}-${user.id}`, user.name, selected.includes(user.id), (checked) =>
          this._userVisibilityChanged(kind, key, user.id, users.map((entry) => entry.id), checked))
      )}</div>`;
    });
    return html`<div class="section"><div class="section-title">${localize('editor.user_visibility')}</div>
      <div class="description" style="margin-left: 0;">${localize('editor.user_visibility_warning')}</div>
      <div class="option-group-title">${localize('editor.user_visibility_views')}</div>${renderRules('view', viewOptions)}
      <div class="option-group-title">${localize('editor.user_visibility_sections')}</div>${renderRules('section', sectionOptions)}
    </div>`;
  }

  private _userVisibilityChanged(kind: 'view' | 'section', key: string, userId: string, knownUsers: string[], checked: boolean): void {
    const current = { ...((kind === 'view' ? this._config.view_visible_users : this._config.section_visible_users) || {}) };
    const selected = new Set(Object.prototype.hasOwnProperty.call(current, key) ? current[key] : knownUsers);
    if (checked) selected.add(userId); else selected.delete(userId);
    if (knownUsers.every((id) => selected.has(id)) && [...selected].every((id) => knownUsers.includes(id))) delete current[key];
    else current[key] = [...selected];
    const updated = { ...this._config };
    if (kind === 'view') {
      if (Object.keys(current).length) updated.view_visible_users = current; else delete updated.view_visible_users;
    } else if (Object.keys(current).length) updated.section_visible_users = current; else delete updated.section_visible_users;
    this._fireConfigChanged(updated);
  }

  private _renderCustomContentSection(): TemplateResult {
    const isWeatherStart = true;

    return html`
      <div class="section">
        <div class="section-title">${localize('editor.section_custom_content')}</div>
        <div class="description" style="margin-left: 0; margin-bottom: 12px;">
          ${localize('editor.section_custom_content_desc')}
        </div>
        ${isWeatherStart
          ? html`
              <div class="empty-state" style="margin-bottom: 12px;">
                ${localize('editor.custom_content_weather_start_hint')}
              </div>
            `
          : nothing}
        <div class="custom-content-grid">
          ${isWeatherStart ? nothing : this._renderCustomCardsSection(true)}
          ${isWeatherStart ? nothing : this._renderCustomSectionsSection(true)} ${this._renderCustomBadgesSection(true)}
          ${this._renderCustomViewsSection(true)}
        </div>
      </div>
    `;
  }

  private _renderCustomCardsSection(nested = false): TemplateResult {
    const customCards = this._config.custom_cards || [];
    const customCardsHeading = this._config.custom_cards_heading || '';
    const customCardsIcon = this._config.custom_cards_icon || '';

    return html`
      <div class=${nested ? 'editor-subsection' : 'section'}>
        <div
          class=${nested ? 'subsection-title' : 'section-title'}
          style="display: flex; align-items: center; gap: 8px;"
        >
          ${localize('editor.section_custom_cards')}
          <a
            href="https://github.com/Cyberhunter88/dashboard-strategy/blob/main/assets/Eigene-Karten-hinzufugen.gif"
            target="_blank"
            rel="noopener"
            style="color: var(--primary-color); text-decoration: none; font-size: 18px;"
            title=${localize('editor.video_tutorial')}
            >&#x1F3AC;</a
          >
        </div>
        <div class="custom-item-row" style="margin-bottom: 12px;">
          <input
            type="text"
            id="custom-cards-heading"
            .value=${customCardsHeading}
            placeholder=${localize('editor.custom_cards_heading_placeholder')}
            style="flex: 2;"
            @change=${this._customCardsHeadingChanged}
          />
          <input
            type="text"
            id="custom-cards-icon"
            .value=${customCardsIcon}
            placeholder="mdi:cards"
            style="flex: 1;"
            @change=${this._customCardsIconChanged}
          />
        </div>
        <div class="description" style="margin-bottom: 8px;">${localize('editor.custom_cards_desc')}</div>

        <div id="custom-cards-list">
          ${customCards.length === 0
            ? html`<div class="empty-state">${localize('editor.no_custom_cards')}</div>`
            : customCards.map((card, index) => this._renderCustomCardItem(card, index))}
        </div>

        <button class="btn-primary" style="margin-top: 8px;" @click=${this._openCardPickerForCustomCard}>
          ${localize('editor.add_custom_card')}
        </button>
        <div class="description">${localize('editor.custom_cards_help')}</div>
      </div>
    `;
  }

  private _renderCustomSectionsSection(nested = false): TemplateResult {
    const customSections = this._config.custom_sections || [];

    return html`
      <div class=${nested ? 'editor-subsection' : 'section'}>
        <div class=${nested ? 'subsection-title' : 'section-title'}>${localize('editor.section_custom_sections')}</div>
        <div class="description" style="margin-bottom: 8px;">${localize('editor.custom_sections_help')}</div>

        <div id="custom-sections-list">
          ${customSections.length === 0
            ? html`<div class="empty-state">${localize('editor.no_custom_sections')}</div>`
            : customSections.map((section, sectionIndex) => this._renderCustomSectionItem(section, sectionIndex))}
        </div>

        <button class="btn-primary" style="margin-top: 8px;" @click=${this._addCustomSection}>
          ${localize('editor.add_custom_section')}
        </button>
      </div>
    `;
  }

  private _renderCustomBadgesSection(nested = false): TemplateResult {
    const customBadges = this._config.custom_badges || [];

    return html`
      <div class=${nested ? 'editor-subsection' : 'section'}>
        <div
          class=${nested ? 'subsection-title' : 'section-title'}
          style="display: flex; align-items: center; gap: 8px;"
        >
          ${localize('editor.section_custom_badges')}
          <a
            href="https://github.com/Cyberhunter88/dashboard-strategy/blob/main/assets/Custom-Badges-hinzufugen.gif"
            target="_blank"
            rel="noopener"
            style="color: var(--primary-color); text-decoration: none; font-size: 18px;"
            title=${localize('editor.video_tutorial')}
            >&#x1F3AC;</a
          >
        </div>

        <div id="custom-badges-list">
          ${customBadges.length === 0
            ? html`<div class="empty-state">${localize('editor.no_custom_badges')}</div>`
            : customBadges.map((badge, index) => this._renderCustomBadgeItem(badge, index))}
        </div>

        <button class="btn-primary" style="margin-top: 8px;" @click=${this._addCustomBadge}>
          ${localize('editor.add_custom_badge')}
        </button>
        <div class="description">${localize('editor.custom_badges_help')}</div>
      </div>
    `;
  }

  private _renderCustomViewsSection(nested = false): TemplateResult {
    const customViews = this._config.custom_views || [];

    return html`
      <div class=${nested ? 'editor-subsection' : 'section'}>
        <div
          class=${nested ? 'subsection-title' : 'section-title'}
          style="display: flex; align-items: center; gap: 8px;"
        >
          ${localize('editor.section_custom_views')}
          <a
            href="https://github.com/Cyberhunter88/dashboard-strategy/blob/main/assets/Custom-View-hinzufugen.gif"
            target="_blank"
            rel="noopener"
            style="color: var(--primary-color); text-decoration: none; font-size: 18px;"
            title=${localize('editor.video_tutorial')}
            >&#x1F3AC;</a
          >
        </div>

        <div id="custom-views-list">
          ${customViews.length === 0
            ? html`<div class="empty-state">${localize('editor.no_custom_views')}</div>`
            : customViews.map((view, index) => this._renderCustomViewItem(view, index))}
        </div>

        <div class="custom-item-row" style="margin-top: 8px;">
          <button class="btn-primary" @click=${this._addCustomView}>
            ${localize('editor.add_custom_view')} <ha-icon icon="mdi:code-braces"></ha-icon>
          </button>
          <button class="btn-primary" @click=${this._addCustomRefView}>
            ${localize('editor.add_custom_view_ref')} <ha-icon icon="mdi:link-variant"></ha-icon>
          </button>
        </div>
        <div class="description">${localize('editor.custom_views_help')}</div>
        <div class="description">${localize('editor.custom_views_ref_help')}</div>
      </div>
    `;
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

  private _renderCustomViewItem(view: CustomView, index: number): TemplateResult {
    const isReference = view.ref_dashboard !== undefined;
    const validationMsg = view._yaml_error
      ? html`<span style="color: var(--error-color);">&#x274C; ${view._yaml_error}</span>`
      : view.yaml
        ? html`<span style="color: var(--success-color, green);">&#x2705; ${localize('editor.yaml_valid')}</span>`
        : nothing;

    return html`
      <div class="custom-item" data-index=${index}>
        <div class="custom-item-header">
          <strong>${view.title || localize('editor.new_view')}</strong>
          <button class="btn-remove" @click=${() => this._removeCustomView(index)}>&#x2715;</button>
        </div>
        <div class="custom-item-fields">
          <div class="custom-item-row">
            <input
              type="text"
              .value=${view.title || ''}
              placeholder=${localize('editor.title_placeholder')}
              style="flex: 2;"
              @change=${(e: Event) => this._updateCustomViewField(index, 'title', (e.target as HTMLInputElement).value)}
            />
            <input
              type="text"
              .value=${view.path || ''}
              placeholder=${localize('editor.path_placeholder')}
              style="flex: 2;"
              @change=${(e: Event) => this._updateCustomViewField(index, 'path', (e.target as HTMLInputElement).value)}
            />
            <input
              type="text"
              .value=${view.icon || ''}
              placeholder="mdi:star"
              style="flex: 1;"
              @change=${(e: Event) => this._updateCustomViewField(index, 'icon', (e.target as HTMLInputElement).value)}
            />
          </div>
          ${this._renderCustomViewPosition(view, index)}
          ${isReference
            ? this._renderCustomViewRefFields(view, index)
            : html`<textarea
                rows="8"
                placeholder=${localize('editor.yaml_placeholder')}
                .value=${view.yaml || ''}
                style="width: 100%;"
                @change=${(e: Event) => this._updateCustomViewYaml(index, (e.target as HTMLTextAreaElement).value)}
              ></textarea>
              <div class="custom-item-validation">${validationMsg}</div>`}
        </div>
      </div>
    `;
  }

  private _renderCustomViewPosition(view: CustomView, index: number): TemplateResult {
    const options = this._getGeneratedViewOptions(index);
    const orphaned = !!view.after_view && !options.some(([path]) => path === view.after_view);
    return html`
      <div class="custom-item-row">
        <select
          style="flex: 1;"
          @change=${(event: Event) =>
            this._updateCustomViewAfterView(index, (event.target as HTMLSelectElement).value)}
        >
          <option value="" ?selected=${!view.after_view}>${localize('editor.custom_view_position_end')}</option>
          ${orphaned
            ? html`<option value=${view.after_view || ''} selected>
                &#x26A0; ${localize('editor.custom_view_position_after')} ${view.after_view}
              </option>`
            : nothing}
          ${options.map(([path, title]) => html`
            <option value=${path} ?selected=${view.after_view === path}>
              ${localize('editor.custom_view_position_after')} ${title}
            </option>
          `)}
        </select>
      </div>
    `;
  }

  private _getGeneratedViewOptions(excludeCustomViewIndex: number): Array<[string, string]> {
    if (!this._hass) return [];
    const options: Array<[string, string]> = [['home', localize('views.overview')]];
    const add = (enabled: boolean, path: string, titleKey: string): void => {
      if (enabled) options.push([path, localize(titleKey)]);
    };

    add(isUtilityViewEnabled(this._config, 'lights'), 'lights', 'views.lights');
    add(isUtilityViewEnabled(this._config, 'covers'), 'covers', 'views.covers');
    add(isUtilityViewEnabled(this._config, 'security'), 'security', 'views.security');
    add(isUtilityViewEnabled(this._config, 'batteries'), 'batteries', 'views.batteries');
    add(isUtilityViewEnabled(this._config, 'climate'), 'climate', 'views.climate');
    add(this._config.show_cctv_view === true, 'cctv', 'views.cctv');
    add(this._config.show_maintenance_view !== false, 'maintenance', 'views.maintenance');

    const hiddenAreas = new Set(this._config.areas_display?.hidden || []);
    for (const area of this._getSortedAreas()) {
      if (hiddenAreas.has(area.area_id)) continue;
      const rule = this._config.room_visibility?.[area.area_id];
      if (rule?.entity && this._hass.states[rule.entity]?.state !== rule.state) continue;
      options.push([area.area_id, area.name]);
    }

    for (const [customIndex, customView] of (this._config.custom_views || []).entries()) {
      if (customIndex === excludeCustomViewIndex) continue;
      const complete = customView.parsed_config || (customView.ref_dashboard && customView.ref_view);
      if (complete && customView.path && customView.title) options.push([customView.path, customView.title]);
    }
    return options;
  }

  private _renderCustomViewRefFields(view: CustomView, index: number): TemplateResult {
    if (this._refDashboards === null) {
      void this._loadRefDashboards();
      return html`<div class="description">${localize('editor.ref_loading')}</div>`;
    }
    if (this._refDashboards.length === 0) {
      return html`<div class="custom-item-validation" style="color: var(--error-color);">
        ${localize('editor.ref_no_dashboards')}
      </div>`;
    }
    const selected = this._refDashboards.find((dashboard) => dashboard.url_path === view.ref_dashboard);
    const orphaned = !!view.ref_dashboard && !selected;
    return html`
      <div class="custom-item-row">
        <select style="flex: 1;" @change=${(e: Event) =>
          this._refDashboardChanged(index, (e.target as HTMLSelectElement).value)}>
          <option value="" ?selected=${!view.ref_dashboard} disabled>${localize('editor.ref_select_dashboard')}</option>
          ${orphaned ? html`<option value=${view.ref_dashboard || ''} selected>${view.ref_dashboard}</option>` : nothing}
          ${this._refDashboards.map((dashboard) => html`
            <option value=${dashboard.url_path} ?selected=${dashboard.url_path === view.ref_dashboard}>
              ${dashboard.title}
            </option>`)}
        </select>
        <select style="flex: 1;" ?disabled=${!selected} @change=${(e: Event) =>
          this._refViewChanged(index, (e.target as HTMLSelectElement).value)}>
          <option value="" ?selected=${!view.ref_view} disabled>${localize('editor.ref_select_view')}</option>
          ${(selected?.views || []).map((sourceView) => {
            const value = sourceView.path ?? String(sourceView.index);
            const label = `${sourceView.title || `${localize('editor.ref_view_untitled')} ${sourceView.index + 1}`}${
              sourceView.path ? ` (${sourceView.path})` : ''}`;
            return html`<option value=${value} ?selected=${value === view.ref_view}>${label}</option>`;
          })}
        </select>
      </div>
      <div class="custom-item-validation">
        ${orphaned
          ? html`<span style="color: var(--error-color);">${localize('editor.ref_dashboard_missing')}</span>`
          : view.ref_dashboard && view.ref_view
            ? html`<span style="color: var(--success-color, green);">${localize('editor.ref_valid')}</span>`
            : localize('editor.ref_incomplete')}
      </div>`;
  }

  private _renderCustomCardItem(card: CustomCard, index: number): TemplateResult {
    const validationMsg = card._yaml_error
      ? html`<span style="color: var(--error-color);">&#x274C; ${card._yaml_error}</span>`
      : card.yaml
        ? html`<span style="color: var(--success-color, green);">&#x2705; ${localize('editor.yaml_valid')}</span>`
        : nothing;

    return html`
      <div class="custom-item" data-index=${index}>
        <div class="custom-item-header">
          <strong>${this._getCustomCardEditorLabel(card, localize('editor.new_card'))}</strong>
          <button class="btn-remove" @click=${() => this._removeCustomCard(index)}>&#x2715;</button>
        </div>
        <div class="custom-item-fields">
          <label>${localize('editor.card_editor_title_label')}</label>
          <input
            type="text"
            .value=${card.editor_title || ''}
            placeholder=${localize('editor.card_editor_title_placeholder')}
            @change=${(e: Event) =>
              this._updateCustomCardField(index, 'editor_title', (e.target as HTMLInputElement).value)}
          />
          <div class="description" style="margin: 0 0 4px 0;">${localize('editor.card_editor_title_help')}</div>
          <label>${localize('editor.card_dashboard_title_label')}</label>
          <input
            type="text"
            .value=${card.title || ''}
            placeholder=${localize('editor.card_title_placeholder')}
            @change=${(e: Event) => this._updateCustomCardField(index, 'title', (e.target as HTMLInputElement).value)}
          />
          <div class="custom-card-target">
            <label>${localize('editor.target_section')}:</label>
            <select
              @change=${(e: Event) =>
                this._updateCustomCardField(index, 'target_section', (e.target as HTMLSelectElement).value)}
            >
              ${(['custom_cards', 'overview', 'areas', 'weather', 'energy'] as const).map(
                (key) => html`
                  <option value=${key} ?selected=${(card.target_section || 'custom_cards') === key}>
                    ${localize(Simon42DashboardStrategyEditor._sectionMeta.get(key)!.labelKey)}
                  </option>
                `
              )}
            </select>
          </div>
          <textarea
            rows="6"
            placeholder=${localize('editor.yaml_placeholder')}
            .value=${card.yaml || ''}
            style="width: 100%;"
            @change=${(e: Event) => this._updateCustomCardYaml(index, (e.target as HTMLTextAreaElement).value)}
          ></textarea>
          <button class="btn-primary" style="margin-top: 6px;" @click=${() => this._openCardEditorForCustomCard(index)}>
            ${localize('editor.edit_card_with_ha_editor')}
          </button>
          <div class="custom-item-validation">${validationMsg}</div>
        </div>
      </div>
    `;
  }

  private _renderCustomSectionItem(section: CustomSection, sectionIndex: number): TemplateResult {
    const cards = section.cards || [];
    return html`
      <div class="custom-item" data-index=${sectionIndex} style="margin-bottom: 12px;">
        <div class="custom-item-header">
          <strong>${section.title || `${localize('editor.section_custom_sections')} ${sectionIndex + 1}`}</strong>
          <button class="btn-remove" @click=${() => this._removeCustomSection(sectionIndex)}>&#x2715;</button>
        </div>
        <div class="custom-item-fields">
          <textarea
            rows="8"
            placeholder="type: grid&#10;cards:&#10;  - type: tile&#10;    entity: light.example"
            .value=${section.yaml || ''}
            style="width: 100%;"
            @change=${(e: Event) =>
              this._updateCustomSectionYaml(sectionIndex, (e.target as HTMLTextAreaElement).value)}
          ></textarea>
          <div class="custom-item-validation">
            ${section._yaml_error
              ? html`<span style="color: var(--error-color);">&#x274C; ${section._yaml_error}</span>`
              : section.yaml
                ? html`<span style="color: var(--success-color, green);"
                    >&#x2705; ${localize('editor.yaml_valid')}</span
                  >`
                : nothing}
          </div>
          <div class="custom-item-row">
            <input
              type="text"
              .value=${section.title || ''}
              placeholder=${localize('editor.custom_section_title_placeholder')}
              style="flex: 2;"
              @change=${(e: Event) =>
                this._updateCustomSectionField(sectionIndex, 'title', (e.target as HTMLInputElement).value)}
            />
            <input
              type="text"
              .value=${section.icon || ''}
              placeholder=${localize('editor.custom_section_icon_placeholder')}
              style="flex: 1;"
              @change=${(e: Event) =>
                this._updateCustomSectionField(sectionIndex, 'icon', (e.target as HTMLInputElement).value)}
            />
          </div>
          <div style="margin-top: 8px; padding-left: 8px; border-left: 2px solid var(--divider-color, #e0e0e0);">
            ${cards.map((card, cardIndex) => {
              const validationMsg = card._yaml_error
                ? html`<span style="color: var(--error-color);">&#x274C; ${card._yaml_error}</span>`
                : card.yaml
                  ? html`<span style="color: var(--success-color, green);"
                      >&#x2705; ${localize('editor.yaml_valid')}</span
                    >`
                  : nothing;
              return html`
                <div class="custom-item" data-index=${cardIndex} style="margin-bottom: 8px;">
                  <div class="custom-item-header">
                    <strong
                      >${this._getCustomCardEditorLabel(
                        card,
                        `${localize('editor.new_card')} ${cardIndex + 1}`
                      )}</strong
                    >
                    <button class="btn-remove" @click=${() => this._removeCardFromSection(sectionIndex, cardIndex)}>
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
                        this._updateSectionCardField(
                          sectionIndex,
                          cardIndex,
                          'editor_title',
                          (e.target as HTMLInputElement).value
                        )}
                    />
                    <div class="description" style="margin: 0 0 4px 0;">
                      ${localize('editor.card_editor_title_help')}
                    </div>
                    <label>${localize('editor.card_dashboard_title_label')}</label>
                    <input
                      type="text"
                      .value=${card.title || ''}
                      placeholder=${localize('editor.card_title_placeholder')}
                      @change=${(e: Event) =>
                        this._updateSectionCardField(
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
                        this._updateSectionCardYaml(sectionIndex, cardIndex, (e.target as HTMLTextAreaElement).value)}
                    ></textarea>
                    <button
                      class="btn-primary"
                      style="margin-top: 6px;"
                      @click=${() => this._openCardEditorForSectionCard(sectionIndex, cardIndex)}
                    >
                      ${localize('editor.edit_card_with_ha_editor')}
                    </button>
                    <div class="custom-item-validation">${validationMsg}</div>
                  </div>
                </div>
              `;
            })}
            <button
              class="btn-primary"
              style="margin-top: 4px;"
              @click=${() => this._openCardPickerForSection(sectionIndex)}
            >
              ${localize('editor.add_card_to_section')}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private _renderCustomBadgeItem(badge: CustomBadge, index: number): TemplateResult {
    const validationMsg = badge._yaml_error
      ? html`<span style="color: var(--error-color);">&#x274C; ${badge._yaml_error}</span>`
      : badge.yaml
        ? html`<span style="color: var(--success-color, green);">&#x2705; ${localize('editor.yaml_valid')}</span>`
        : nothing;

    return html`
      <div class="custom-item" data-index=${index}>
        <div class="custom-item-header">
          <strong>Badge ${index + 1}</strong>
          <button class="btn-remove" @click=${() => this._removeCustomBadge(index)}>&#x2715;</button>
        </div>
        <textarea
          rows="4"
          placeholder="type: entity&#10;entity: sun.sun"
          .value=${badge.yaml || ''}
          style="width: 100%;"
          @change=${(e: Event) => this._updateCustomBadgeYaml(index, (e.target as HTMLTextAreaElement).value)}
        ></textarea>
        <div class="custom-item-validation">${validationMsg}</div>
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
    if (allAreas.length === 0) {
      return html`<div class="empty-state">${localize('editor.no_areas')}</div>`;
    }

    // Sort areas by configured order
    const areaOrderMap = new Map(areaOrder.map((areaId, index) => [areaId, index]));
    const originalIndexMap = new Map(allAreas.map((area, index) => [area.area_id, index]));
    const sortedAreas = [...allAreas].sort((a, b) => {
      const orderA = areaOrderMap.get(a.area_id);
      const orderB = areaOrderMap.get(b.area_id);
      const effectiveA = orderA !== undefined ? orderA : 9999 + (originalIndexMap.get(a.area_id) ?? 0);
      const effectiveB = orderB !== undefined ? orderB : 9999 + (originalIndexMap.get(b.area_id) ?? 0);
      return effectiveA - effectiveB;
    });

    return sortedAreas.map((area) => {
      const isHidden = hiddenAreas.includes(area.area_id);
      const isExpanded = this._expandedAreas.has(area.area_id);
      const cachedData = this._areaEntitiesCache.get(area.area_id);
      const isPinned = navItems.includes(area.area_id);

      return html`
        <div
          class="area-item"
          data-area-id=${area.area_id}
          draggable="true"
          @dragstart=${this._handleDragStart}
          @dragend=${this._handleDragEnd}
          @dragover=${this._handleDragOver}
          @dragleave=${this._handleDragLeave}
          @drop=${this._handleDrop}
        >
          <div class="area-header">
            <span class="drag-handle" draggable="true">&#x2630;</span>
            <input
              type="checkbox"
              class="area-checkbox"
              data-area-id=${area.area_id}
              ?checked=${!isHidden}
              @change=${(e: Event) => this._areaVisibilityChanged(area.area_id, (e.target as HTMLInputElement).checked)}
            />
            <span class="area-name">${area.name}</span>
            ${area.icon ? html`<ha-icon class="area-icon" icon=${area.icon}></ha-icon>` : nothing}
            <button
              class="nav-pin-button ${isPinned ? 'pinned' : ''}"
              title="${localize('editor.area_pin_nav')}"
              ?disabled=${isHidden}
              @click=${(e: Event) => {
                e.stopPropagation();
                this._areaNavPinChanged(area.area_id, !isPinned);
              }}
            >
              <ha-icon icon="${isPinned ? 'mdi:pin' : 'mdi:pin-outline'}"></ha-icon>
            </button>
            <button
              class="expand-button ${isExpanded ? 'expanded' : ''}"
              data-area-id=${area.area_id}
              @click=${(e: Event) => this._toggleAreaExpand(e, area.area_id)}
            >
              <span class="expand-icon">&#x25B6;</span>
            </button>
          </div>
          ${isExpanded
            ? html`
                <div class="area-content" data-area-id=${area.area_id}>
                  ${this._renderAreaDisplayTypeOverride(area)}
                  ${this._renderAreaViewOverride(area.area_id)}
                  ${cachedData
                    ? this._renderAreaEntities(area.area_id, cachedData)
                    : html`<div class="loading-placeholder">${localize('editor.loading_entities')}</div>`}
                </div>
              `
            : nothing}
        </div>
      `;
    });
  }

  private _globalAreaDisplayTypeChanged(displayType: AreaDisplayType): void {
    const newConfig = setGlobalAreaDisplayType(this._config, displayType);
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  private _renderAreaDisplayTypeOverride(area: AreaRegistryEntry): TemplateResult {
    const override = this._config.areas_options?.[area.area_id]?.display_type ?? '';
    return html`
      <div class="form-row">
        <label for="area-display-type-${area.area_id}">${localize('editor.area_display_type_override')}</label>
        <select
          id="area-display-type-${area.area_id}"
          .value=${override}
          @change=${(event: Event) =>
            this._areaDisplayTypeOverrideChanged(
              area.area_id,
              (event.target as HTMLSelectElement).value as AreaDisplayType | ''
            )}
        >
          <option value="">${localize('editor.area_display_type_inherit')}</option>
          <option value="compact">${localize('editor.area_display_type_compact')}</option>
          <option value="picture">${localize('editor.area_display_type_picture')}</option>
        </select>
      </div>
      ${!area.picture ? html`<div class="description">${localize('editor.area_display_type_no_picture')}</div>` : nothing}
    `;
  }

  private _areaDisplayTypeOverrideChanged(areaId: string, displayType: AreaDisplayType | ''): void {
    const newConfig = setAreaDisplayTypeOverride(this._config, areaId, displayType || undefined);
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  private _renderAreaViewOverride(areaId: string): TemplateResult {
    const override = this._config.areas_options?.[areaId]?.view_override;
    const validation = override?._yaml_error
      ? html`<span style="color: var(--error-color);">&#x274C; ${override._yaml_error}</span>`
      : override?.parsed_config
        ? html`<span style="color: var(--success-color, green);">&#x2705; ${localize('editor.yaml_valid')}</span>`
        : nothing;

    return html`
      <div class="custom-item" style="margin-bottom: 0;">
        <div class="custom-item-header">
          <strong>${localize('editor.area_view_override_title')}</strong>
          ${override?.yaml
            ? html`
                <button
                  class="btn-remove"
                  title=${localize('editor.area_view_override_remove')}
                  @click=${() => this._updateAreaViewOverride(areaId, '')}
                >
                  &#x2715;
                </button>
              `
            : nothing}
        </div>
        <div class="description" style="margin: 0 0 10px 0;">${localize('editor.area_view_override_help')}</div>
        <textarea
          rows="12"
          placeholder="type: sections&#10;sections:&#10;  - type: grid&#10;    cards: []"
          .value=${override?.yaml || ''}
          style="width: 100%;"
          @change=${(e: Event) => this._updateAreaViewOverride(areaId, (e.target as HTMLTextAreaElement).value)}
        >
        </textarea>
        <div class="custom-item-validation">${validation}</div>
      </div>
    `;
  }

  private _updateAreaViewOverride(areaId: string, yamlString: string): void {
    const currentAreaOptions = this._config.areas_options?.[areaId] || {};
    const newAreaOptions = { ...currentAreaOptions };

    if (!yamlString.trim()) {
      delete newAreaOptions.view_override;
    } else {
      const parsed = parseEditorYamlConfig(yamlString, localize('editor.area_view_override_object_error'));
      const parsedConfig = parsed.parsed_config;
      const isObject = parsedConfig && !Array.isArray(parsedConfig);
      newAreaOptions.view_override = {
        yaml: yamlString,
        parsed_config: isObject ? (parsedConfig as Record<string, any>) : undefined,
        _yaml_error: isObject
          ? parsed._yaml_error
          : parsed._yaml_error || localize('editor.area_view_override_object_error'),
      };
    }

    const newAreasOptions = { ...this._config.areas_options };
    if (Object.keys(newAreaOptions).length === 0) delete newAreasOptions[areaId];
    else newAreasOptions[areaId] = newAreaOptions;

    const newConfig: Simon42StrategyConfig = { ...this._config };
    if (Object.keys(newAreasOptions).length === 0) delete newConfig.areas_options;
    else newConfig.areas_options = newAreasOptions;
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  private _renderAreaEntities(
    areaId: string,
    data: NonNullable<ReturnType<typeof this._areaEntitiesCache.get>>
  ): TemplateResult {
    const {
      groupedEntities,
      hiddenEntities,
      badgeCandidates,
      additionalBadges,
      availableEntities,
      defaultShowNames,
      namesVisible,
      namesHidden,
    } = data;

    const hass = this._hass!;

    const domainGroups: DomainGroup[] = [
      { key: 'ups', label: localize('stacks.ups'), icon: 'mdi:power-plug-battery' },
      { key: 'lights', label: localize('editor.domain_lights'), icon: 'mdi:lightbulb' },
      { key: 'climate', label: localize('editor.domain_climate'), icon: 'mdi:thermostat' },
      { key: 'covers', label: localize('editor.domain_covers'), icon: 'mdi:window-shutter' },
      { key: 'covers_curtain', label: localize('editor.domain_covers_curtain'), icon: 'mdi:curtains' },
      { key: 'covers_window', label: localize('editor.domain_covers_window'), icon: 'mdi:window-open-variant' },
      { key: 'media_player', label: localize('editor.domain_media_player'), icon: 'mdi:speaker' },
      { key: 'scenes', label: localize('editor.domain_scenes'), icon: 'mdi:palette' },
      { key: 'vacuum', label: localize('editor.domain_vacuum'), icon: 'mdi:robot-vacuum' },
      { key: 'fan', label: localize('editor.domain_fan'), icon: 'mdi:fan' },
      { key: 'switches', label: localize('editor.domain_switches'), icon: 'mdi:light-switch' },
      { key: 'locks', label: localize('editor.domain_locks'), icon: 'mdi:lock' },
      { key: 'energy', label: localize('stacks.energy'), icon: 'mdi:lightning-bolt' },
    ];

    const hasEntities = domainGroups.some((g) => (groupedEntities[g.key]?.length ?? 0) > 0);
    const hasBadges = (badgeCandidates?.length ?? 0) > 0 || (additionalBadges?.length ?? 0) > 0;

    // Build a deduplicated entity list for the guided tile picker (all area entities)
    const areaPickerEntities: Array<{ entity_id: string; name: string }> = [];
    const seenPickerEntities = new Set<string>();
    const pushPickerEntity = (entityId: string): void => {
      if (!entityId || seenPickerEntities.has(entityId)) return;
      seenPickerEntities.add(entityId);
      const stateObj = hass.states[entityId];
      const name = stateObj?.attributes.friendly_name || entityId.split('.')[1]?.replace(/_/g, ' ') || entityId;
      areaPickerEntities.push({ entity_id: entityId, name });
    };
    for (const group of domainGroups) {
      for (const entityId of (groupedEntities[group.key] as string[] | undefined) || []) {
        pushPickerEntity(entityId);
      }
    }
    for (const entityId of badgeCandidates || []) pushPickerEntity(entityId);
    for (const entityId of additionalBadges || []) pushPickerEntity(entityId);
    for (const e of availableEntities || []) pushPickerEntity(e.entity_id);
    areaPickerEntities.sort((a, b) => a.name.localeCompare(b.name));

    const customCardsSection = this._renderAreaCustomCardsSection(areaId, areaPickerEntities);
    if (!hasEntities && !hasBadges) {
      return html`
        <div class="empty-state">${localize('editor.no_entities_in_area')}</div>
        ${this._renderStackOrderPanel(areaId, data)} ${customCardsSection}
      `;
    }

    const expandedGroups = this._expandedGroups.get(areaId) || new Set<string>();

    return html`
      <div class="entity-groups">
        ${domainGroups.map((group) => {
          const entities = groupedEntities[group.key] as string[] | undefined;
          if (!entities || entities.length === 0) return nothing;

          const hiddenInGroup = (hiddenEntities[group.key] || []) as string[];
          const allHidden = entities.every((e) => hiddenInGroup.includes(e));
          const someHidden = entities.some((e) => hiddenInGroup.includes(e)) && !allHidden;
          const isGroupExpanded = expandedGroups.has(group.key);

          return html`
            <div class="entity-group" data-group=${group.key}>
              <div class="entity-group-header" @click=${() => this._toggleGroupExpand(areaId, group.key)}>
                <input
                  type="checkbox"
                  class="group-checkbox"
                  data-area-id=${areaId}
                  data-group=${group.key}
                  ?checked=${!allHidden}
                  .indeterminate=${someHidden}
                  @click=${(e: Event) => e.stopPropagation()}
                  @change=${(e: Event) => {
                    e.stopPropagation();
                    const checked = (e.target as HTMLInputElement).checked;
                    this._groupVisibilityChanged(areaId, group.key, checked, entities);
                  }}
                />
                <ha-icon icon=${group.icon}></ha-icon>
                <span class="group-name">${group.label}</span>
                <span class="entity-count">(${entities.length})</span>
                <button
                  class="expand-button-small ${isGroupExpanded ? 'expanded' : ''}"
                  @click=${(e: Event) => {
                    e.stopPropagation();
                    this._toggleGroupExpand(areaId, group.key);
                  }}
                >
                  <span class="expand-icon-small">&#x25B6;</span>
                </button>
              </div>
              ${isGroupExpanded
                ? html`
                    <div class="entity-list" data-area-id=${areaId} data-group=${group.key}>
                      ${entities.map((entityId) => {
                        const stateObj = hass.states[entityId];
                        const name = stateObj?.attributes.friendly_name || entityId.split('.')[1].replace(/_/g, ' ');
                        const isEntityHidden = hiddenInGroup.includes(entityId);
                        return html`
                          <div class="entity-item">
                            <input
                              type="checkbox"
                              class="entity-checkbox"
                              ?checked=${!isEntityHidden}
                              @change=${(e: Event) =>
                                this._entityVisibilityChanged(
                                  areaId,
                                  group.key,
                                  entityId,
                                  (e.target as HTMLInputElement).checked
                                )}
                            />
                            <span class="entity-name">${name}</span>
                            <span class="entity-id">${entityId}</span>
                          </div>
                        `;
                      })}
                    </div>
                  `
                : nothing}
            </div>
          `;
        })}
        ${hasBadges
          ? this._renderBadgeGroup(
              areaId,
              badgeCandidates,
              additionalBadges,
              availableEntities,
              hiddenEntities,
              defaultShowNames,
              namesVisible,
              namesHidden,
              expandedGroups
            )
          : nothing}
        ${this._renderStackOrderPanel(areaId, data)}
      </div>
      ${customCardsSection}
    `;
  }

  // -- Area Custom Cards Renderers --------------------------------------

  private _renderAreaCustomCardItem(
    areaId: string,
    card: AreaCustomCard,
    index: number,
    availableEntities: Array<{ entity_id: string; name: string }>
  ): TemplateResult {
    const mode = card.mode || 'yaml';
    const position = card.position || 'bottom';

    const validationMsg = card._yaml_error
      ? html`<span style="color: var(--error-color);">&#x274C; ${card._yaml_error}</span>`
      : card.yaml
        ? html`<span style="color: var(--success-color, green);">&#x2705; ${localize('editor.yaml_valid')}</span>`
        : nothing;

    return html`
      <div class="custom-item" data-index=${index}>
        <div class="custom-item-header">
          <strong>${this._getCustomCardEditorLabel(card, localize('editor.area_custom_card_new'))}</strong>
          <button class="btn-remove" @click=${() => this._removeAreaCustomCard(areaId, index)}>&#x2715;</button>
        </div>
        <div class="custom-item-fields">
          <label>${localize('editor.card_editor_title_label')}</label>
          <input
            type="text"
            .value=${card.editor_title || ''}
            placeholder=${localize('editor.card_editor_title_placeholder')}
            @change=${(e: Event) =>
              this._updateAreaCustomCardField(areaId, index, 'editor_title', (e.target as HTMLInputElement).value)}
          />
          <div class="description" style="margin: 0 0 4px 0;">${localize('editor.card_editor_title_help')}</div>
          <label>${localize('editor.card_dashboard_title_label')}</label>
          <input
            type="text"
            .value=${card.title || ''}
            placeholder=${localize('editor.card_title_placeholder')}
            @change=${(e: Event) =>
              this._updateAreaCustomCardField(areaId, index, 'title', (e.target as HTMLInputElement).value)}
          />
          <div class="custom-card-target">
            <label>${localize('editor.area_custom_card_position')}:</label>
            <select
              @change=${(e: Event) =>
                this._updateAreaCustomCardField(areaId, index, 'position', (e.target as HTMLSelectElement).value)}
            >
              <option value="top" ?selected=${position === 'top'}>
                ${localize('editor.area_custom_card_position_top')}
              </option>
              <option value="bottom" ?selected=${position === 'bottom'}>
                ${localize('editor.area_custom_card_position_bottom')}
              </option>
            </select>
          </div>
          <div class="custom-card-target">
            <label>${localize('editor.area_custom_card_mode')}:</label>
            <select
              @change=${(e: Event) =>
                this._updateAreaCustomCardField(areaId, index, 'mode', (e.target as HTMLSelectElement).value)}
            >
              <option value="yaml" ?selected=${mode === 'yaml'}>
                ${localize('editor.area_custom_card_mode_yaml')}
              </option>
              <option value="tile" ?selected=${mode === 'tile'}>
                ${localize('editor.area_custom_card_mode_tile')}
              </option>
              <option value="section" ?selected=${mode === 'section'}>
                ${localize('editor.area_custom_card_mode_section')}
              </option>
            </select>
          </div>
          ${mode === 'tile'
            ? html`
                <div class="custom-card-target">
                  <label>${localize('editor.area_custom_card_entity')}:</label>
                  <select
                    @change=${(e: Event) =>
                      this._updateAreaCustomCardField(areaId, index, 'entity', (e.target as HTMLSelectElement).value)}
                  >
                    <option value="">${localize('editor.area_custom_card_entity_select')}</option>
                    ${availableEntities.map(
                      (e) => html`
                        <option value=${e.entity_id} ?selected=${card.entity === e.entity_id}>
                          ${e.name} (${e.entity_id})
                        </option>
                      `
                    )}
                  </select>
                </div>
              `
            : html`
                <textarea
                  rows="6"
                  placeholder=${localize('editor.yaml_placeholder')}
                  .value=${card.yaml || ''}
                  style="width: 100%;"
                  @change=${(e: Event) =>
                    this._updateAreaCustomCardYaml(areaId, index, (e.target as HTMLTextAreaElement).value)}
                ></textarea>
                <button
                  class="btn-primary"
                  style="margin-top: 6px;"
                  @click=${() => this._openCardEditorForAreaCustomCard(areaId, index)}
                >
                  ${localize('editor.edit_card_with_ha_editor')}
                </button>
                <div class="custom-item-validation">${validationMsg}</div>
              `}
        </div>
      </div>
    `;
  }

  private _renderAreaCustomCardsSection(
    areaId: string,
    availableEntities: Array<{ entity_id: string; name: string }>
  ): TemplateResult {
    const cards = this._getAreaCustomCards(areaId);

    return html`
      <div class="area-custom-cards">
        <div class="area-custom-cards-header">
          <ha-icon icon="mdi:card-plus-outline"></ha-icon>
          <span class="group-name">${localize('editor.area_custom_cards_title')}</span>
        </div>
        <div class="area-custom-cards-help">${localize('editor.area_custom_cards_help')}</div>
        ${cards.length === 0
          ? nothing
          : cards.map((card, index) => this._renderAreaCustomCardItem(areaId, card, index, availableEntities))}
        <div class="area-custom-card-actions">
          <button class="btn-primary" @click=${() => this._addAreaCustomCard(areaId)}>
            ${localize('editor.area_custom_card_add_yaml')}
          </button>
          <button class="btn-primary" @click=${() => this._openCardPickerForAreaCustomCard(areaId)}>
            ${localize('editor.area_custom_card_add_picker')}
          </button>
        </div>
      </div>
    `;
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
    const hass = this._hass!;
    const totalCount = badgeCandidates.length + additionalBadges.length;
    if (totalCount === 0) return html``;

    const hiddenInBadges = hiddenEntities['badges'] || [];
    const allHidden = badgeCandidates.length > 0 && badgeCandidates.every((e) => hiddenInBadges.includes(e));
    const someHidden = badgeCandidates.some((e) => hiddenInBadges.includes(e)) && !allHidden;

    const namesVisibleSet = new Set(namesVisible || []);
    const namesHiddenSet = new Set(namesHidden || []);

    const isNameShown = (entityId: string): boolean =>
      resolveShowName(entityId, defaultShowNames.has(entityId), namesVisibleSet, namesHiddenSet);

    const isGroupExpanded = expandedGroups.has('badges');

    return html`
      <div class="entity-group" data-group="badges">
        <div class="entity-group-header" @click=${() => this._toggleGroupExpand(areaId, 'badges')}>
          <input
            type="checkbox"
            class="group-checkbox"
            data-area-id=${areaId}
            data-group="badges"
            ?checked=${!allHidden}
            .indeterminate=${someHidden}
            @click=${(e: Event) => e.stopPropagation()}
            @change=${(e: Event) => {
              e.stopPropagation();
              const checked = (e.target as HTMLInputElement).checked;
              this._groupVisibilityChanged(areaId, 'badges', checked, badgeCandidates);
            }}
          />
          <ha-icon icon="mdi:checkbox-multiple-blank-circle"></ha-icon>
          <span class="group-name">${localize('editor.domain_badges')}</span>
          <span class="entity-count">(${totalCount})</span>
          <button
            class="expand-button-small ${isGroupExpanded ? 'expanded' : ''}"
            @click=${(e: Event) => {
              e.stopPropagation();
              this._toggleGroupExpand(areaId, 'badges');
            }}
          >
            <span class="expand-icon-small">&#x25B6;</span>
          </button>
        </div>
        ${isGroupExpanded
          ? html`
              <div class="entity-list" data-area-id=${areaId} data-group="badges">
                ${badgeCandidates.map((entityId) => {
                  const stateObj = hass.states[entityId];
                  const name = stateObj?.attributes.friendly_name || entityId.split('.')[1].replace(/_/g, ' ');
                  const isHidden = hiddenInBadges.includes(entityId);
                  const showName = isNameShown(entityId);

                  return html`
                    <div class="entity-item">
                      <input
                        type="checkbox"
                        class="entity-checkbox"
                        ?checked=${!isHidden}
                        @change=${(e: Event) =>
                          this._entityVisibilityChanged(
                            areaId,
                            'badges',
                            entityId,
                            (e.target as HTMLInputElement).checked
                          )}
                      />
                      <span class="entity-name">${name}</span>
                      <input
                        type="checkbox"
                        class="badge-name-checkbox"
                        ?checked=${showName}
                        title=${localize('editor.badges_show_name')}
                        @change=${(e: Event) =>
                          this._badgeShowNameChanged(areaId, entityId, (e.target as HTMLInputElement).checked)}
                      />
                      <span class="badge-name-label">${localize('editor.badges_name_short')}</span>
                      <span class="entity-id">${entityId}</span>
                    </div>
                  `;
                })}
                ${additionalBadges.length > 0
                  ? html`
                      <div class="badge-separator">${localize('editor.badges_additional')}</div>
                      ${additionalBadges.map((entityId) => {
                        const stateObj = hass.states[entityId];
                        const name = stateObj?.attributes.friendly_name || entityId.split('.')[1].replace(/_/g, ' ');
                        const showName = isNameShown(entityId);

                        return html`
                          <div class="entity-item badge-additional-item">
                            <span class="entity-name">${name}</span>
                            <input
                              type="checkbox"
                              class="badge-name-checkbox"
                              ?checked=${showName}
                              title=${localize('editor.badges_show_name')}
                              @change=${(e: Event) =>
                                this._badgeShowNameChanged(areaId, entityId, (e.target as HTMLInputElement).checked)}
                            />
                            <span class="badge-name-label">${localize('editor.badges_name_short')}</span>
                            <span class="entity-id">${entityId}</span>
                            <button
                              class="badge-remove-btn"
                              title=${localize('editor.badges_remove')}
                              @click=${() => this._badgeAdditionalChanged(areaId, entityId, false)}
                            >
                              &#x2715;
                            </button>
                          </div>
                        `;
                      })}
                    `
                  : nothing}
                ${availableEntities.length > 0
                  ? html`
                      <div class="badge-add-section">
                        <select class="badge-entity-picker" data-area-id=${areaId}>
                          <option value="">${localize('editor.badges_select_entity')}</option>
                          ${availableEntities.map(
                            (e) => html` <option value=${e.entity_id}>${e.name} (${e.entity_id})</option> `
                          )}
                        </select>
                        <button class="badge-add-button" @click=${(e: Event) => this._addBadgeFromPicker(e, areaId)}>
                          ${localize('editor.badges_add')}
                        </button>
                      </div>
                    `
                  : nothing}
              </div>
            `
          : nothing}
      </div>
    `;
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
    const badgeCandidates = getAreaBadgeCandidates(visibleEntities, this._hass);
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
    const badgeCandidates = getAreaBadgeCandidates(visibleEntities, this._hass);
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
    if (value === defaultValue) {
      delete (newConfig as any)[key];
    }

    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  private _searchCardVariantChanged(value: string): void {
    const updated = { ...this._config };
    if (value === 'tip') updated.search_card_variant = 'tip';
    else delete updated.search_card_variant;
    this._fireConfigChanged(updated);
  }

  private _lightFavoritesChanged(value: string): void {
    const entities = value.split(',').map((entry) => entry.trim()).filter((entry) => entry.startsWith('light.'));
    const updated = { ...this._config };
    if (entities.length > 0) updated.light_favorite_entities = [...new Set(entities)];
    else delete updated.light_favorite_entities;
    this._fireConfigChanged(updated);
  }

  private _securityActivityPositionChanged(value: string): void {
    const updated = { ...this._config };
    if (value === 'end') updated.security_activity_position = 'end';
    else delete updated.security_activity_position;
    this._fireConfigChanged(updated);
  }

  private _securityExtraEntitiesChanged(value: string): void {
    const entities = value.split(',').map((entry) => entry.trim()).filter((entry) => entry.includes('.'));
    const updated = { ...this._config };
    if (entities.length > 0) updated.security_extra_entities = [...new Set(entities)];
    else delete updated.security_extra_entities;
    this._fireConfigChanged(updated);
  }

  private _simpleOptionChanged(key: keyof Simon42StrategyConfig, value: unknown, defaultValue: unknown): void {
    const updated = { ...this._config } as Record<string, unknown>;
    if (value === defaultValue) delete updated[key];
    else updated[key] = value;
    this._config = updated as Simon42StrategyConfig;
    this._fireConfigChanged(this._config);
  }

  private _summariesColumnsChanged(columns: 2 | 4): void {
    if (!this._hass) return;

    const newConfig: Simon42StrategyConfig = {
      ...this._config,
      summaries_columns: columns,
    };

    if (columns === 2) {
      delete newConfig.summaries_columns;
    }

    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  private _lightsSortByNameChanged(enabled: boolean): void {
    if (!this._hass) return;

    const newConfig: Simon42StrategyConfig = {
      ...this._config,
      lights_sort_by: enabled ? 'name' : 'last_changed',
    };

    if (!enabled) {
      delete newConfig.lights_sort_by;
    }

    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  private _alarmEntityChanged(e: Event): void {
    if (!this._hass) return;

    const entityId = (e.target as HTMLSelectElement).value;
    const newConfig: Simon42StrategyConfig = {
      ...this._config,
      alarm_entity: entityId,
    };

    if (!entityId || entityId === '') {
      delete newConfig.alarm_entity;
    }

    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  private _houseModeEntityChanged(e: Event): void {
    const entityId = (e.target as HTMLSelectElement).value;
    const newConfig: Simon42StrategyConfig = { ...this._config };
    if (entityId) newConfig.house_mode_entity = entityId;
    else delete newConfig.house_mode_entity;
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  private _weatherEntityChanged(e: Event): void {
    if (!this._hass) return;

    const entityId = (e.target as HTMLSelectElement).value;
    const newConfig: Simon42StrategyConfig = {
      ...this._config,
      weather_entity: entityId,
    };

    if (!entityId || entityId === '') {
      delete newConfig.weather_entity;
    }

    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  private _personBadgeLayoutChanged = (e: Event): void => {
    const value = (e.target as HTMLSelectElement).value as PersonBadgeLayout;
    const newConfig: Simon42StrategyConfig = { ...this._config };
    if (value === 'with_state') delete newConfig.person_badge_layout;
    else newConfig.person_badge_layout = value;
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  };

  private _weatherPresentationChanged = (e: Event): void => {
    const value = (e.target as HTMLSelectElement).value as WeatherPresentation;
    const newConfig: Simon42StrategyConfig = { ...this._config };
    if (value === 'forecast_daily') delete newConfig.weather_presentation;
    else newConfig.weather_presentation = value;
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  };

  private _powerBadgeEntityChanged = (e: Event): void => {
    const value = (e.target as HTMLSelectElement).value.trim();
    const newConfig: Simon42StrategyConfig = { ...this._config };
    if (!value) delete newConfig.power_badge_entity;
    else newConfig.power_badge_entity = value;
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  };

  private _agendaCalendarEntitiesChanged = (e: Event): void => {
    const values = this._parseEntityList((e.target as HTMLTextAreaElement).value);
    const newConfig: Simon42StrategyConfig = { ...this._config };
    if (values.length === 0) delete newConfig.agenda_calendar_entities;
    else newConfig.agenda_calendar_entities = values;
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  };

  private _todosEntitiesChanged = (e: Event): void => {
    const values = this._parseEntityList((e.target as HTMLTextAreaElement).value);
    const newConfig: Simon42StrategyConfig = { ...this._config };
    if (values.length === 0) delete newConfig.todos_entities;
    else newConfig.todos_entities = values;
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  };

  private _weatherSensorsChanged = (e: Event): void => {
    const values = this._parseWeatherSensors((e.target as HTMLTextAreaElement).value);
    const newConfig: Simon42StrategyConfig = { ...this._config };
    if (values.length === 0) delete newConfig.weather_sensors;
    else newConfig.weather_sensors = values;
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  };

  private _batteryCriticalChanged(e: Event): void {
    const value = parseInt((e.target as HTMLInputElement).value, 10);
    if (isNaN(value) || value < 1 || value > 99) return;
    const newConfig: Simon42StrategyConfig = { ...this._config, battery_critical_threshold: value };
    if (value === 20) delete newConfig.battery_critical_threshold;
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  private _batteryLowChanged(e: Event): void {
    const value = parseInt((e.target as HTMLInputElement).value, 10);
    if (isNaN(value) || value < 1 || value > 99) return;
    const newConfig: Simon42StrategyConfig = { ...this._config, battery_low_threshold: value };
    if (value === 50) delete newConfig.battery_low_threshold;
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  private _unavailableBatteriesBucketChanged(bucket: 'critical' | 'good'): void {
    const newConfig: Simon42StrategyConfig = { ...this._config };
    if (bucket === 'good') delete newConfig.unavailable_batteries_bucket;
    else newConfig.unavailable_batteries_bucket = bucket;
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  // -- Favorites --------------------------------------------------------

  private _addFavoriteEntity(entityId: string): void {
    if (!this._hass) return;
    const currentFavorites = this._config.favorite_entities || [];
    if (currentFavorites.includes(entityId)) return;

    const newConfig: Simon42StrategyConfig = {
      ...this._config,
      favorite_entities: [...currentFavorites, entityId],
    };

    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  private _removeFavoriteEntity(entityId: string): void {
    if (!this._hass) return;
    const currentFavorites = this._config.favorite_entities || [];
    const newFavorites = currentFavorites.filter((id) => id !== entityId);

    const newConfig: Simon42StrategyConfig = {
      ...this._config,
      favorite_entities: newFavorites.length > 0 ? newFavorites : undefined,
    };

    if (newFavorites.length === 0) {
      delete newConfig.favorite_entities;
    }

    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  // -- Room Pins --------------------------------------------------------

  private _addRoomPinEntity(entityId: string): void {
    if (!this._hass) return;
    const currentPins = this._config.room_pin_entities || [];
    if (currentPins.includes(entityId)) return;

    const newConfig: Simon42StrategyConfig = {
      ...this._config,
      room_pin_entities: [...currentPins, entityId],
    };

    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  private _removeRoomPinEntity(entityId: string): void {
    if (!this._hass) return;
    const currentPins = this._config.room_pin_entities || [];
    const newPins = currentPins.filter((id) => id !== entityId);

    const newConfig: Simon42StrategyConfig = {
      ...this._config,
      room_pin_entities: newPins.length > 0 ? newPins : undefined,
    };

    if (newPins.length === 0) {
      delete newConfig.room_pin_entities;
    }

    this._config = newConfig;
    this._fireConfigChanged(newConfig);
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
      await Promise.all(candidates.map(async (candidate) => {
        try {
          const config = await this._hass!.callWS<{
            views?: Array<Record<string, unknown>>; strategy?: unknown;
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
      }));
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
      'home', 'lights', 'covers', 'security', 'batteries', 'climate', 'maintenance', 'cctv',
      ...Object.keys(this._hass?.areas || {}),
      ...(this._config.custom_views || []).filter((_, index) => index !== excludeIndex)
        .map((view) => view.path).filter((path): path is string => !!path),
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
    const customViews: CustomView[] = [...(this._config.custom_views || [])];
    if (!customViews[index]) return;

    const updated: CustomView = { ...customViews[index], yaml: yamlString };
    delete updated._yaml_error;

    const parsed = parseEditorYamlConfig(yamlString, 'YAML muss ein Objekt ergeben');
    updated.parsed_config = parsed.parsed_config as Record<string, any> | undefined;
    updated._yaml_error = parsed._yaml_error;

    customViews[index] = updated;

    const newConfig: Simon42StrategyConfig = { ...this._config, custom_views: customViews };
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
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
    const customCards: CustomCard[] = [...(this._config.custom_cards || [])];
    if (!customCards[index]) return;

    const updated: CustomCard = { ...customCards[index], yaml: yamlString };
    delete updated._yaml_error;

    const parsed = parseEditorYamlConfig(yamlString, 'YAML muss ein Objekt oder Array ergeben');
    updated.parsed_config = parsed.parsed_config as Record<string, any> | undefined;
    updated._yaml_error = parsed._yaml_error;

    customCards[index] = updated;

    const newConfig: Simon42StrategyConfig = { ...this._config, custom_cards: customCards };
    if (updated._yaml_error) {
      this._config = newConfig;
      this.requestUpdate();
      return;
    }
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
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
    const customSections = [...(this._config.custom_sections || [])];
    if (!customSections[sectionIndex]) return;
    const updated: CustomSection = { ...customSections[sectionIndex], yaml: yamlString };
    const parsed = parseEditorYamlConfig(yamlString, localize('editor.custom_section_yaml_invalid'));
    updated.parsed_config = parsed.parsed_config;
    updated._yaml_error = parsed._yaml_error;
    customSections[sectionIndex] = updated;
    const newConfig = { ...this._config, custom_sections: customSections };
    this._config = newConfig;
    if (updated._yaml_error) this.requestUpdate();
    else this._fireConfigChanged(newConfig);
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
    const customSections: CustomSection[] = [...(this._config.custom_sections || [])];
    if (!customSections[sectionIndex]) return;
    const section = { ...customSections[sectionIndex] };
    const cards = [...(section.cards || [])];
    if (!cards[cardIndex]) return;

    const updated: CustomCard = { ...cards[cardIndex], yaml: yamlString };
    delete updated._yaml_error;

    const parsed = parseEditorYamlConfig(yamlString, 'YAML muss ein Objekt oder Array ergeben');
    updated.parsed_config = parsed.parsed_config as Record<string, any> | undefined;
    updated._yaml_error = parsed._yaml_error;

    cards[cardIndex] = updated;
    section.cards = cards;
    customSections[sectionIndex] = section;
    const newConfig: Simon42StrategyConfig = { ...this._config, custom_sections: customSections };
    if (updated._yaml_error) {
      this._config = newConfig;
      this.requestUpdate();
      return;
    }
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  // -- Area Custom Cards (per-area room view) ---------------------------

  /** Liest die custom_cards-Liste einer Area (immer eine neue Kopie). */
  private _getAreaCustomCards(areaId: string): AreaCustomCard[] {
    return [...(this._config.areas_options?.[areaId]?.custom_cards || [])];
  }

  /**
   * Schreibt die custom_cards-Liste einer Area zurück in die Config.
   * Räumt leere Verschachtelungen auf (Delete-when-empty), damit die
   * gespeicherte Config minimal bleibt — analog zu _updateEntityConfig.
   */
  private _writeAreaCustomCards(areaId: string, cards: AreaCustomCard[]): void {
    const currentAreaOptions = this._config.areas_options?.[areaId] || {};

    const newAreaOptions: Record<string, any> = { ...currentAreaOptions };
    if (cards.length === 0) {
      delete newAreaOptions.custom_cards;
    } else {
      newAreaOptions.custom_cards = cards;
    }

    const newAreasOptions: Record<string, any> = {
      ...this._config.areas_options,
      [areaId]: newAreaOptions,
    };

    if (Object.keys(newAreasOptions[areaId]).length === 0) {
      delete newAreasOptions[areaId];
    }

    const newConfig: Simon42StrategyConfig = {
      ...this._config,
      areas_options: newAreasOptions,
    };

    if (newConfig.areas_options && Object.keys(newConfig.areas_options).length === 0) {
      delete newConfig.areas_options;
    }

    this._config = newConfig;
    this._fireConfigChanged(newConfig);
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
  }

  private _parseAreaCustomCardYamlConfig(updated: AreaCustomCard, yamlString: string): void {
    updated.yaml = yamlString;
    delete updated._yaml_error;

    if (yamlString.trim()) {
      try {
        const parsed = yaml.load(yamlString);
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
    const cards = this._getAreaCustomCards(areaId);
    if (!cards[index]) return;

    const updated: AreaCustomCard = { ...cards[index] };
    this._parseAreaCustomCardYamlConfig(updated, yamlString);

    cards[index] = updated;
    this._writeAreaCustomCards(areaId, cards);
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
    const customBadges: CustomBadge[] = [...(this._config.custom_badges || [])];
    if (!customBadges[index]) return;

    const updated: CustomBadge = { ...customBadges[index], yaml: yamlString };
    delete updated._yaml_error;

    const parsed = parseEditorYamlConfig(yamlString, 'YAML muss ein Objekt ergeben');
    updated.parsed_config = parsed.parsed_config as Record<string, any> | undefined;
    updated._yaml_error = parsed._yaml_error;

    customBadges[index] = updated;

    const newConfig: Simon42StrategyConfig = { ...this._config, custom_badges: customBadges };
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  // ====================================================================
  // AREA MANAGEMENT
  // ====================================================================

  private _areaVisibilityChanged(areaId: string, isVisible: boolean): void {
    if (!this._hass) return;

    let hiddenAreas = [...(this._config.areas_display?.hidden || [])];

    if (isVisible) {
      hiddenAreas = hiddenAreas.filter((id) => id !== areaId);
    } else {
      if (!hiddenAreas.includes(areaId)) {
        hiddenAreas.push(areaId);
      }
      // Collapse area when hidden
      this._expandedAreas.delete(areaId);
      this._expandedGroups.delete(areaId);
      this._areaEntitiesCache.delete(areaId);
    }

    const newConfig: Simon42StrategyConfig = {
      ...this._config,
      areas_display: {
        ...this._config.areas_display,
        hidden: hiddenAreas,
      },
    };

    if (newConfig.areas_display?.hidden?.length === 0) {
      delete newConfig.areas_display.hidden;
    }
    if (newConfig.areas_display && Object.keys(newConfig.areas_display).length === 0) {
      delete newConfig.areas_display;
    }

    this._invalidateWeatherStartOptionsCaches();
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  private _areaNavPinChanged(areaId: string, isPinned: boolean): void {
    let navItems = [...(this._config.areas_display?.nav_items || [])];

    if (isPinned) {
      if (!navItems.includes(areaId)) navItems.push(areaId);
    } else {
      navItems = navItems.filter((id) => id !== areaId);
    }

    const newConfig: Simon42StrategyConfig = {
      ...this._config,
      areas_display: { ...this._config.areas_display, nav_items: navItems },
    };

    if (newConfig.areas_display?.nav_items?.length === 0) delete newConfig.areas_display.nav_items;
    if (newConfig.areas_display && Object.keys(newConfig.areas_display).length === 0) delete newConfig.areas_display;

    this._config = newConfig;
    this._fireConfigChanged(newConfig);
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

    const currentAreaOptions = this._config.areas_options?.[areaId] || {};
    const currentGroupsOptions = currentAreaOptions.groups_options || {};
    const currentGroupOptions = currentGroupsOptions[group] as Record<string, any> | undefined;
    let hiddenEntities = [...(currentGroupOptions?.hidden || [])];

    if (isVisible) {
      hiddenEntities = hiddenEntities.filter((e) => !entities.includes(e));
    } else {
      hiddenEntities = [...new Set([...hiddenEntities, ...entities])];
    }

    this._updateEntityConfig(areaId, group, hiddenEntities);
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

    const currentAreaOptions = this._config.areas_options?.[areaId] || {};
    const currentGroupsOptions = currentAreaOptions.groups_options || {};
    const currentGroupOptions = currentGroupsOptions[group] as Record<string, any> | undefined;
    let hiddenEntities = [...(currentGroupOptions?.hidden || [])];

    if (isVisible) {
      hiddenEntities = hiddenEntities.filter((e) => e !== entityId);
    } else {
      if (!hiddenEntities.includes(entityId)) {
        hiddenEntities.push(entityId);
      }
    }

    this._updateEntityConfig(areaId, group, hiddenEntities);
  }

  private _updateEntityConfig(areaId: string, group: string, hiddenEntities: string[]): void {
    const currentAreaOptions = this._config.areas_options?.[areaId] || {};
    const currentGroupsOptions = currentAreaOptions.groups_options || {};
    const currentGroupOptions = currentGroupsOptions[group] as Record<string, any> | undefined;

    const newGroupOptions: Record<string, any> = {
      ...currentGroupOptions,
      hidden: hiddenEntities,
    };

    if (newGroupOptions.hidden.length === 0) {
      delete newGroupOptions.hidden;
    }

    const newGroupsOptions: Record<string, any> = {
      ...currentGroupsOptions,
      [group]: newGroupOptions,
    };

    if (Object.keys(newGroupsOptions[group]).length === 0) {
      delete newGroupsOptions[group];
    }

    const newAreaOptions: Record<string, any> = {
      ...currentAreaOptions,
      groups_options: newGroupsOptions,
    };

    if (Object.keys(newAreaOptions.groups_options).length === 0) {
      delete newAreaOptions.groups_options;
    }

    const newAreasOptions: Record<string, any> = {
      ...this._config.areas_options,
      [areaId]: newAreaOptions,
    };

    if (Object.keys(newAreasOptions[areaId]).length === 0) {
      delete newAreasOptions[areaId];
    }

    const newConfig: Simon42StrategyConfig = {
      ...this._config,
      areas_options: newAreasOptions,
    };

    if (newConfig.areas_options && Object.keys(newConfig.areas_options).length === 0) {
      delete newConfig.areas_options;
    }

    this._config = newConfig;
    this._fireConfigChanged(newConfig);

    // Refresh cached data so re-render picks up the changes
    this._refreshAreaCache(areaId);
  }

  // -- Badge additional and show_name -----------------------------------

  private _badgeAdditionalChanged(areaId: string, entityId: string, isAdd: boolean): void {
    if (!this._config) return;

    const currentAreaOptions = this._config.areas_options?.[areaId] || {};
    const currentGroupsOptions = currentAreaOptions.groups_options || {};
    const currentBadgeOptions = currentGroupsOptions['badges'] || {};

    let additional = [...(currentBadgeOptions.additional || [])];

    if (isAdd) {
      if (!additional.includes(entityId)) additional.push(entityId);
    } else {
      additional = additional.filter((e) => e !== entityId);
    }

    const newBadgeOptions: Record<string, any> = { ...currentBadgeOptions };
    if (additional.length > 0) {
      newBadgeOptions.additional = additional;
    } else {
      delete newBadgeOptions.additional;
    }

    const newGroupsOptions: Record<string, any> = {
      ...currentGroupsOptions,
      badges: newBadgeOptions,
    };

    if (Object.keys(newGroupsOptions.badges).length === 0) {
      delete newGroupsOptions.badges;
    }

    const newAreaOptions: Record<string, any> = {
      ...currentAreaOptions,
      groups_options: newGroupsOptions,
    };

    if (Object.keys(newAreaOptions.groups_options).length === 0) {
      delete newAreaOptions.groups_options;
    }

    const newAreasOptions: Record<string, any> = {
      ...this._config.areas_options,
      [areaId]: newAreaOptions,
    };

    if (Object.keys(newAreasOptions[areaId]).length === 0) {
      delete newAreasOptions[areaId];
    }

    const newConfig: Simon42StrategyConfig = {
      ...this._config,
      areas_options: newAreasOptions,
    };

    if (newConfig.areas_options && Object.keys(newConfig.areas_options).length === 0) {
      delete newConfig.areas_options;
    }

    this._config = newConfig;
    this._fireConfigChanged(newConfig);

    // Refresh cached data
    this._refreshAreaCache(areaId);
  }

  private _badgeShowNameChanged(areaId: string, entityId: string, showName: boolean): void {
    if (!this._config || !this._hass) return;

    const currentAreaOptions = this._config.areas_options?.[areaId] || {};
    const currentGroupsOptions = currentAreaOptions.groups_options || {};
    const currentBadgeOptions = currentGroupsOptions['badges'] || {};

    let namesVisible = [...(currentBadgeOptions.names_visible || [])];
    let namesHidden = [...(currentBadgeOptions.names_hidden || [])];

    const stateObj = this._hass.states[entityId];
    const dc = stateObj?.attributes?.device_class as string | undefined;
    const defaultShowName = isDefaultShowName(dc);

    if (showName === defaultShowName) {
      namesVisible = namesVisible.filter((e) => e !== entityId);
      namesHidden = namesHidden.filter((e) => e !== entityId);
    } else if (showName) {
      if (!namesVisible.includes(entityId)) namesVisible.push(entityId);
      namesHidden = namesHidden.filter((e) => e !== entityId);
    } else {
      namesVisible = namesVisible.filter((e) => e !== entityId);
      if (!namesHidden.includes(entityId)) namesHidden.push(entityId);
    }

    const newBadgeOptions: Record<string, any> = { ...currentBadgeOptions };
    if (namesVisible.length > 0) newBadgeOptions.names_visible = namesVisible;
    else delete newBadgeOptions.names_visible;
    if (namesHidden.length > 0) newBadgeOptions.names_hidden = namesHidden;
    else delete newBadgeOptions.names_hidden;

    const newGroupsOptions: Record<string, any> = { ...currentGroupsOptions, badges: newBadgeOptions };
    if (Object.keys(newGroupsOptions.badges).length === 0) delete newGroupsOptions.badges;

    const newAreaOptions: Record<string, any> = { ...currentAreaOptions, groups_options: newGroupsOptions };
    if (Object.keys(newAreaOptions.groups_options).length === 0) delete newAreaOptions.groups_options;

    const newAreasOptions: Record<string, any> = { ...this._config.areas_options, [areaId]: newAreaOptions };
    if (Object.keys(newAreasOptions[areaId]).length === 0) delete newAreasOptions[areaId];

    const newConfig: Simon42StrategyConfig = { ...this._config, areas_options: newAreasOptions };
    if (newConfig.areas_options && Object.keys(newConfig.areas_options).length === 0) delete newConfig.areas_options;

    this._config = newConfig;
    this._fireConfigChanged(newConfig);

    // Refresh cached data
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

  private _handleDragStart = (ev: DragEvent): void => {
    const dragHandle = (ev.target as HTMLElement).closest('.drag-handle');
    if (!dragHandle) {
      ev.preventDefault();
      return;
    }

    const areaItem = (ev.target as HTMLElement).closest('.area-item') as HTMLElement | null;
    if (!areaItem) {
      ev.preventDefault();
      return;
    }

    areaItem.classList.add('dragging');
    if (ev.dataTransfer) {
      ev.dataTransfer.effectAllowed = 'move';
      ev.dataTransfer.setData('text/plain', areaItem.dataset.areaId || '');
    }
    this._draggedElement = areaItem;
  };

  private _handleDragEnd = (ev: DragEvent): void => {
    const areaItem = (ev.target as HTMLElement).closest('.area-item') as HTMLElement | null;
    if (areaItem) {
      areaItem.classList.remove('dragging');
    }

    // Remove all drag-over classes
    const areaList = this.shadowRoot!.querySelector('#area-list');
    if (areaList) {
      areaList.querySelectorAll('.area-item').forEach((item) => {
        item.classList.remove('drag-over');
      });
    }
  };

  private _handleDragOver = (ev: DragEvent): void => {
    ev.preventDefault();
    if (ev.dataTransfer) ev.dataTransfer.dropEffect = 'move';

    const item = ev.currentTarget as HTMLElement;
    if (item !== this._draggedElement) {
      item.classList.add('drag-over');
    }
  };

  private _handleDragLeave = (ev: DragEvent): void => {
    (ev.currentTarget as HTMLElement).classList.remove('drag-over');
  };

  private _handleDrop = (ev: DragEvent): void => {
    ev.stopPropagation();
    ev.preventDefault();

    const dropTarget = ev.currentTarget as HTMLElement;
    dropTarget.classList.remove('drag-over');

    if (!this._draggedElement || this._draggedElement === dropTarget) return;

    const draggedAreaId = this._draggedElement.dataset.areaId;
    const dropAreaId = dropTarget.dataset.areaId;
    if (!draggedAreaId || !dropAreaId) return;

    // Compute new order from current config state (NOT from DOM)
    const currentOrder = this._getAreaOrder();
    const draggedIndex = currentOrder.indexOf(draggedAreaId);
    const dropIndex = currentOrder.indexOf(dropAreaId);
    if (draggedIndex === -1 || dropIndex === -1) return;

    const newOrder = [...currentOrder];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(dropIndex, 0, draggedAreaId);

    this._updateAreaOrder(newOrder);
  };

  private _getAreaOrder(): string[] {
    if (!this._hass) return [];
    const configOrder = this._getNormalizedAreasDisplay()?.order;
    if (configOrder && configOrder.length > 0) return [...configOrder];
    return Object.keys(this._hass.areas || {});
  }

  private _updateAreaOrder(newOrder: string[]): void {
    const newConfig: Simon42StrategyConfig = {
      ...this._config,
      areas_display: {
        ...this._config.areas_display,
        order: newOrder,
      },
    };

    this._invalidateWeatherStartOptionsCaches();
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  }

  // ====================================================================
  // ENTITY LIST DRAG & DROP (Favorites / Room Pins)
  // ====================================================================

  private _entityDraggedId: string | null = null;

  private _handleEntityDragStart = (ev: DragEvent, _listType: 'favorites' | 'room_pins'): void => {
    const item = (ev.target as HTMLElement).closest('.entity-list-item') as HTMLElement | null;
    if (!item) {
      ev.preventDefault();
      return;
    }

    item.classList.add('dragging');
    this._entityDraggedId = item.dataset.entityId || null;
    if (ev.dataTransfer) {
      ev.dataTransfer.effectAllowed = 'move';
      ev.dataTransfer.setData('text/plain', this._entityDraggedId || '');
    }
  };

  private _handleEntityDragEnd = (ev: DragEvent): void => {
    const item = (ev.target as HTMLElement).closest('.entity-list-item') as HTMLElement | null;
    if (item) item.classList.remove('dragging');
    this._entityDraggedId = null;
  };

  private _handleEntityDragOver = (ev: DragEvent): void => {
    ev.preventDefault();
    if (ev.dataTransfer) ev.dataTransfer.dropEffect = 'move';
    const item = ev.currentTarget as HTMLElement;
    if (item.dataset.entityId !== this._entityDraggedId) {
      item.classList.add('drag-over');
    }
  };

  private _handleEntityDragLeave = (ev: DragEvent): void => {
    (ev.currentTarget as HTMLElement).classList.remove('drag-over');
  };

  private _handleEntityDrop = (ev: DragEvent, listType: 'favorites' | 'room_pins'): void => {
    ev.stopPropagation();
    ev.preventDefault();

    const dropTarget = ev.currentTarget as HTMLElement;
    dropTarget.classList.remove('drag-over');

    const draggedId = this._entityDraggedId;
    const dropId = dropTarget.dataset.entityId;
    if (!draggedId || !dropId || draggedId === dropId) return;

    const currentList =
      listType === 'favorites'
        ? [...(this._config.favorite_entities || [])]
        : [...(this._config.room_pin_entities || [])];

    const draggedIndex = currentList.indexOf(draggedId);
    const dropIndex = currentList.indexOf(dropId);
    if (draggedIndex === -1 || dropIndex === -1) return;

    currentList.splice(draggedIndex, 1);
    currentList.splice(dropIndex, 0, draggedId);

    const key = listType === 'favorites' ? 'favorite_entities' : 'room_pin_entities';
    const newConfig: Simon42StrategyConfig = { ...this._config, [key]: currentList };
    this._config = newConfig;
    this._fireConfigChanged(newConfig);
  };

  // ====================================================================
  // CONFIG DISPATCH
  // ====================================================================

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
      const yamlStr = yaml.dump(config).trim();
      const customCards: CustomCard[] = [...(this._config.custom_cards || [])];
      customCards.push({ editor_title: '', yaml: yamlStr, parsed_config: config });
      const newConfig = { ...this._config, custom_cards: customCards };
      this._config = newConfig;
      this._fireConfigChanged(newConfig);
    });
  };

  private _openCardPickerForSection(sectionIndex: number): void {
    this._openCardPicker((config) => {
      const yamlStr = yaml.dump(config).trim();
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
      const yamlStr = yaml.dump(config).trim();
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
    const card = this._config.custom_cards?.[index];
    const initialConfig = this._getEditableYamlCardConfig(card);
    if (!initialConfig) return;

    this._openCardPicker((config) => {
      this._updateCustomCardYaml(index, yaml.dump(config).trim());
    }, initialConfig);
  }

  private _openCardEditorForSectionCard(sectionIndex: number, cardIndex: number): void {
    const card = this._config.custom_sections?.[sectionIndex]?.cards?.[cardIndex];
    const initialConfig = this._getEditableYamlCardConfig(card);
    if (!initialConfig) return;

    this._openCardPicker((config) => {
      this._updateSectionCardYaml(sectionIndex, cardIndex, yaml.dump(config).trim());
    }, initialConfig);
  }

  private _openCardEditorForAreaCustomCard(areaId: string, index: number): void {
    const card = this._getAreaCustomCards(areaId)[index];
    const initialConfig = this._getEditableAreaCardConfig(card);
    if (!initialConfig) return;

    this._openCardPicker((config) => {
      const cards = this._getAreaCustomCards(areaId);
      if (!cards[index]) return;
      const updated: AreaCustomCard = {
        ...cards[index],
        mode: 'yaml',
        yaml: yaml.dump(config).trim(),
        parsed_config: config,
      };
      delete updated._yaml_error;
      cards[index] = updated;
      this._writeAreaCustomCards(areaId, cards);
    }, initialConfig);
  }

  private _getEditableAreaCardConfig(card: AreaCustomCard | undefined): Record<string, any> | null {
    if (!card) return null;
    if ((card.mode || 'yaml') === 'tile' && card.entity) return { type: 'tile', entity: card.entity };
    return this._getEditableYamlCardConfig(card);
  }

  private _getEditableYamlCardConfig(
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

  private _openCardPicker(callback: (config: Record<string, any>) => void, initialConfig?: Record<string, any>): void {
    this._cardPickerCallback = callback;
    this._cardPickerConfig = initialConfig || null;
    this._cardPickerOpen = true;
    this._cardPickerStep = initialConfig ? 'editor' : 'type';
    this._cardPickerSearch = '';
    this._cardPickerSelectedType = typeof initialConfig?.type === 'string' ? initialConfig.type : '';
    this._cardPickerYaml = initialConfig ? yaml.dump(initialConfig).trim() : '';
    this._cardPickerHasVisualEditor = false;
  }

  private _closeCardPicker(): void {
    this._cardPickerOpen = false;
    this._cardPickerCallback = null;
    this._cardPickerConfig = null;
    const host = this.shadowRoot?.querySelector('.card-editor-visual-host') as HTMLElement | null;
    if (host) host.innerHTML = '';
  }

  private _selectCardType(type: string): void {
    this._cardPickerSelectedType = type;
    this._cardPickerStep = 'editor';
    const cardType = CARD_TYPES.find((t) => t.type === type);
    if (cardType) {
      this._cardPickerYaml = cardType.template;
      try {
        const parsed = yaml.load(cardType.template);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          this._cardPickerConfig = parsed as Record<string, any>;
        }
      } catch {
        /* ignore */
      }
    } else {
      this._cardPickerYaml = `type: ${type}\n`;
      this._cardPickerConfig = { type };
    }
    this._cardPickerHasVisualEditor = false;
  }

  private _cardPickerYamlChanged(e: Event): void {
    const yamlStr = (e.target as HTMLTextAreaElement).value;
    this._cardPickerYaml = yamlStr;
    try {
      const parsed = yaml.load(yamlStr);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        this._cardPickerConfig = parsed as Record<string, any>;
      }
    } catch {
      /* ignore — user still typing */
    }
  }

  private _confirmCardPicker(): void {
    if (!this._cardPickerConfig || !this._cardPickerCallback) return;
    this._cardPickerCallback(this._cardPickerConfig);
    this._closeCardPicker();
  }

  private _handlePickerOverlayClick = (e: Event) => {
    if (e.target === e.currentTarget) this._closeCardPicker();
  };

  override updated(changedProps: Map<string, unknown>): void {
    super.updated(changedProps);
    if (this._cardPickerOpen && this._cardPickerStep === 'editor' && !this._cardPickerHasVisualEditor) {
      this._tryMountVisualCardEditor();
    }
  }

  private _tryMountVisualCardEditor(): void {
    const host = this.shadowRoot?.querySelector('.card-editor-visual-host') as HTMLElement | null;
    if (!host || host.firstChild) return;
    if (!customElements.get('hui-card-element-editor')) return;
    try {
      const el = document.createElement('hui-card-element-editor');
      (el as any).hass = this._hass;
      (el as any).value = this._cardPickerConfig || { type: this._cardPickerSelectedType };
      el.addEventListener('config-changed', (ev: Event) => {
        const config = (ev as CustomEvent).detail?.config;
        if (config && typeof config === 'object') {
          this._cardPickerConfig = config;
          this._cardPickerYaml = yaml.dump(config).trim();
          this.requestUpdate('_cardPickerYaml');
        }
      });
      host.appendChild(el);
      this._cardPickerHasVisualEditor = true;
    } catch {
      /* visual editor unavailable — YAML fallback shown */
    }
  }

  private _renderCardPickerOverlay(): TemplateResult {
    if (this._cardPickerStep === 'type') return this._renderCardTypePicker();
    return this._renderCardEditor();
  }

  private _renderCardTypePicker(): TemplateResult {
    const search = this._cardPickerSearch.toLowerCase();
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
      <div class="card-picker-overlay" @click=${this._handlePickerOverlayClick}>
        <div class="card-picker-dialog" @click=${(e: Event) => e.stopPropagation()}>
          <div class="card-picker-header">
            <span class="card-picker-header-title">Karte hinzufügen</span>
            <button class="card-picker-icon-btn" @click=${this._closeCardPicker} title="Schließen">
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
          <div class="card-picker-search-row">
            <input
              type="text"
              placeholder="Kartentyp suchen…"
              .value=${this._cardPickerSearch}
              @input=${(e: Event) => {
                this._cardPickerSearch = (e.target as HTMLInputElement).value;
                this.requestUpdate();
              }}
            />
          </div>
          <div class="card-type-grid">
            ${filteredBuiltIn.map(
              (t) => html`
                <button class="card-type-btn" @click=${() => this._selectCardType(t.type)}>
                  <ha-icon icon=${t.icon}></ha-icon>
                  <span>${t.name}</span>
                </button>
              `
            )}
            ${customCardTypes.map(
              (c) => html`
                <button class="card-type-btn" @click=${() => this._selectCardType(c.type)}>
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

  private _renderCardEditor(): TemplateResult {
    const typeName =
      CARD_TYPES.find((t) => t.type === this._cardPickerSelectedType)?.name || this._cardPickerSelectedType;
    return html`
      <div class="card-picker-overlay" @click=${this._handlePickerOverlayClick}>
        <div class="card-picker-dialog" @click=${(e: Event) => e.stopPropagation()}>
          <div class="card-picker-header">
            <button
              class="card-picker-icon-btn"
              @click=${() => {
                this._cardPickerStep = 'type';
                const host = this.shadowRoot?.querySelector('.card-editor-visual-host') as HTMLElement | null;
                if (host) host.innerHTML = '';
                this._cardPickerHasVisualEditor = false;
              }}
              title="Zurück"
            >
              <ha-icon icon="mdi:arrow-left"></ha-icon>
            </button>
            <span class="card-picker-header-title">${typeName}</span>
            <button class="card-picker-icon-btn" @click=${this._closeCardPicker} title="Schließen">
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
          <div class="card-editor-content">
            <div class="card-editor-visual-host"></div>
            ${!this._cardPickerHasVisualEditor
              ? html`
                  <div class="card-editor-yaml-label">YAML-Konfiguration:</div>
                  <textarea
                    class="card-editor-yaml-area"
                    .value=${this._cardPickerYaml}
                    @input=${this._cardPickerYamlChanged}
                    spellcheck="false"
                  ></textarea>
                `
              : nothing}
          </div>
          <div class="card-picker-footer">
            <button class="btn-secondary" @click=${this._closeCardPicker}>Abbrechen</button>
            <button class="btn-primary" @click=${this._confirmCardPicker}>Speichern</button>
          </div>
        </div>
      </div>
    `;
  }
}

// ====================================================================
// HELPER FUNCTIONS (local to this module)
// ====================================================================

function getAdditionalBadgesForArea(areaId: string, config: Simon42StrategyConfig): string[] {
  return config.areas_options?.[areaId]?.groups_options?.badges?.additional || [];
}

function getDefaultShowNameEntities(badgeCandidates: string[], hass: HomeAssistant): Set<string> {
  const result = new Set<string>();
  for (const entityId of badgeCandidates) {
    const stateObj = hass.states[entityId];
    if (!stateObj) continue;
    const dc = stateObj.attributes?.device_class as string | undefined;
    if (isDefaultShowName(dc)) result.add(entityId);
  }
  return result;
}

function getBadgeNamesConfig(
  areaId: string,
  config: Simon42StrategyConfig
): { namesVisible: string[]; namesHidden: string[] } {
  const opts = config.areas_options?.[areaId]?.groups_options?.badges;
  return {
    namesVisible: opts?.names_visible || [],
    namesHidden: opts?.names_hidden || [],
  };
}

function getHiddenEntitiesForArea(areaId: string, config: Simon42StrategyConfig): Record<string, string[]> {
  const areaOptions = config.areas_options?.[areaId];
  if (!areaOptions || !areaOptions.groups_options) {
    return {};
  }

  const hidden: Record<string, string[]> = {};
  for (const [group, options] of Object.entries(areaOptions.groups_options)) {
    if (options.hidden) {
      hidden[group] = options.hidden;
    }
  }

  return hidden;
}

function getEntityOrdersForArea(areaId: string, config: Simon42StrategyConfig): Record<string, string[]> {
  const areaOptions = config.areas_options?.[areaId];
  if (!areaOptions || !areaOptions.groups_options) {
    return {};
  }

  const orders: Record<string, string[]> = {};
  for (const [group, options] of Object.entries(areaOptions.groups_options)) {
    if (options.order) {
      orders[group] = options.order;
    }
  }

  return orders;
}

// Register custom element
customElements.define('dashboard-strategy-editor', Simon42DashboardStrategyEditor);
