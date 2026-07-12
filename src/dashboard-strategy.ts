// ====================================================================
// SIMON42 DASHBOARD STRATEGY — Main Entry Point
// ====================================================================
// Minimal entry point for fast custom element registration.
// Cards, views, and heavy dependencies are lazy-loaded in generate().
// This ensures customElements.define() runs before HA's 5s timeout.
// ====================================================================

import type { HomeAssistant } from './types/homeassistant';
import type { Simon42StrategyConfig } from './types/strategy';
import type { LovelaceConfig, LovelaceViewConfig } from './types/lovelace';

const STRATEGY_VERSION = '1.22.2'; // x-release-please-version

declare let __webpack_get_script_filename__: (chunkId: number | string) => string;

// Home Assistant serves HACS files with a long-lived cache policy. The entry
// resource has HACS' `hacstag` cache buster, but Webpack's lazy chunks did not.
// Keep emitted filenames unchanged while versioning every chunk request as well.
const getChunkScriptFilename = __webpack_get_script_filename__;
__webpack_get_script_filename__ = (chunkId) =>
  `${getChunkScriptFilename(chunkId)}?v=${STRATEGY_VERSION}`;

const DEBUG = new URLSearchParams(window.location.search).has('s42_debug');
const T0 = performance.now();
const t = (label: string) => {
  if (DEBUG) console.log(`[s42-timing] ${label}: ${(performance.now() - T0).toFixed(0)}ms`);
};
let generateCallCount = 0;

type StrategyGenerator = {
  generate(config: Record<string, unknown>, hass: HomeAssistant): Promise<LovelaceViewConfig>;
};

// Start loading all runtime chunks IMMEDIATELY. The two loader modules avoid
// creating one mostly-empty async chunk for every card and view module.
const modulesPromise = Promise.all([
  import('./loaders/core-modules'),
  import('./loaders/view-modules'),
]).catch((error: unknown) => {
  const detail = error instanceof Error ? `: ${error.message}` : '';
  throw new Error(`Dashboard Strategy runtime modules could not be loaded${detail}`);
});

// Attach a rejection handler immediately so an early network failure does not
// surface as an unhandled promise rejection before Home Assistant calls generate().
void modulesPromise.then(() => { t('all chunks loaded'); }).catch(() => undefined);

class Simon42DashboardStrategy extends HTMLElement {
  // HA 2026.7+: tell the dashboard picker/runtime which registry updates
  // require regeneration. This matches the data the singleton Registry tracks.
  static registryDependencies = ['entities', 'devices', 'areas', 'floors'] as const;

  // HA 2026.5+: suggested title/icon when creating a new dashboard from the UI.
  static getCreateSuggestions(): { title: string; icon: string } {
    return { title: 'Dashboard Strategy', icon: 'mdi:view-dashboard' };
  }

  static async generate(config: Simon42StrategyConfig, hass: HomeAssistant): Promise<LovelaceConfig> {
    generateCallCount++;
    t(`generate() called (#${generateCallCount})`);

    const [runtime] = await modulesPromise;
    t('modules ready');

    const { Registry, getVisibleAreasFromHass, localize, normalizeAreasDisplay, withUnavailableEntitiesHidden } = runtime;
    t('imports done');

    const getStrategy = (tag: string): StrategyGenerator => {
      const strategy = customElements.get(tag) as (CustomElementConstructor & Partial<StrategyGenerator>) | undefined;
      if (!strategy || typeof strategy.generate !== 'function') {
        throw new Error(`Dashboard Strategy module registration missing: ${tag}`);
      }
      return strategy as CustomElementConstructor & StrategyGenerator;
    };

    Registry.initialize(hass, config);
    t('registry initialized');

    const normalizedAreasDisplay = normalizeAreasDisplay(Object.values(hass.areas), config.areas_display);
    const visibleAreas = getVisibleAreasFromHass(hass, normalizedAreasDisplay, config.use_default_area_sort);

    const showSummaryViews = config.show_summary_views === true;
    const showRoomViews = config.show_room_views === true;
    const showCctvView = config.show_cctv_view === true;
    const showMaintenanceView = config.show_maintenance_view === true;
    const navItems = new Set(normalizedAreasDisplay?.nav_items || []);
    const showLights = config.show_light_summary !== false;
    const showCovers = config.show_covers_summary !== false;
    const showSecurity = config.show_security_summary !== false;
    const showBatteries = config.show_battery_summary !== false;
    const showBatteryView = config.show_battery_view === true || showBatteries;
    const showClimate = config.show_climate_summary === true;
    const selectedTheme = config.theme?.trim();
    const withConfiguredTheme = (view: LovelaceViewConfig): LovelaceViewConfig => {
      if (!selectedTheme || view.theme) return view;
      return { ...view, theme: selectedTheme };
    };

    // Pre-resolve ALL views upfront (like HA's Home Panel does)
    const overviewConfig = await getStrategy('ll-strategy-dashboard-strategy-view-overview').generate(
      { dashboardConfig: config },
      hass
    );
    t('overview resolved');

    // Only resolve utility views for enabled summaries
    const utilityViewDefs = [
      { enabled: showLights, title: localize('views.lights'), path: 'lights', icon: 'mdi:lamps',
        resolve: () => getStrategy('ll-strategy-dashboard-strategy-view-lights').generate({ config }, hass) },
      { enabled: showCovers, title: localize('views.covers'), path: 'covers', icon: 'mdi:blinds-horizontal',
        resolve: () => getStrategy('ll-strategy-dashboard-strategy-view-covers').generate(
          { device_classes: ['awning', 'blind', 'curtain', 'shade', 'shutter', 'window'], config }, hass) },
      { enabled: showSecurity, title: localize('views.security'), path: 'security', icon: 'mdi:security',
        resolve: () => getStrategy('ll-strategy-dashboard-strategy-view-security').generate({ config }, hass) },
      { enabled: showBatteryView, title: localize('views.batteries'), path: 'batteries', icon: 'mdi:battery-alert',
        resolve: () => getStrategy('ll-strategy-dashboard-strategy-view-batteries').generate({ config }, hass) },
      { enabled: showClimate, title: localize('views.climate'), path: 'climate', icon: 'mdi:thermostat',
        resolve: () => getStrategy('ll-strategy-dashboard-strategy-view-climate').generate({ config }, hass) },
      { enabled: showCctvView, title: localize('views.cctv'), path: 'cctv', icon: 'mdi:cctv',
        resolve: () => getStrategy('ll-strategy-dashboard-strategy-view-cctv').generate({ config }, hass) },
      { enabled: showMaintenanceView, title: localize('views.maintenance'), path: 'maintenance', icon: 'mdi:wrench-outline',
        resolve: () => getStrategy('ll-strategy-dashboard-strategy-view-maintenance').generate({ config }, hass) },
    ];

    const enabledDefs = utilityViewDefs.filter((d) => d.enabled);
    const utilityConfigs = await Promise.all(enabledDefs.map((d) => d.resolve()));
    t('utility views resolved');

    const roomStrategy = getStrategy('ll-strategy-dashboard-strategy-view-room');
    const roomConfigs = await Promise.all(
      visibleAreas.map((area) => {
        const areaOptions = config.areas_options?.[area.area_id];
        const override = areaOptions?.view_override?.parsed_config;
        if (override && typeof override === 'object' && !Array.isArray(override)) {
          return Promise.resolve(override as LovelaceViewConfig);
        }
        return roomStrategy.generate(
          {
            area,
            groups_options: areaOptions?.groups_options || {},
            custom_cards: areaOptions?.custom_cards || [],
            dashboardConfig: config,
          },
          hass
        );
      })
    );
    t(`${visibleAreas.length} room views resolved`);

    const views: LovelaceViewConfig[] = [
      {
        title: localize('views.overview'),
        path: 'home',
        icon: 'mdi:home',
        ...overviewConfig,
      },
      ...enabledDefs.map((def, i) => ({
        title: def.title,
        path: def.path,
        icon: def.icon,
        subview: !showSummaryViews,
        ...utilityConfigs[i],
      })),
      ...visibleAreas.map((area, i) => ({
        ...roomConfigs[i],
        title: area.name,
        path: area.area_id,
        icon: area.icon || 'mdi:floor-plan',
        subview: !showRoomViews && !navItems.has(area.area_id),
      })),
    ];

    const customViews = config.custom_views || [];
    for (const cv of customViews) {
      if (cv.parsed_config && cv.title && cv.path) {
        views.push({
          ...cv.parsed_config,
          title: cv.title,
          path: cv.path,
          icon: cv.icon || 'mdi:card-text-outline',
        });
      }
    }

    t(`generate() done — ${views.length} views`);

    return {
      title: localize('dashboard.title'),
      views: views.map((view) => withConfiguredTheme(withUnavailableEntitiesHidden(view, config))),
    };
  }

  static async getConfigElement(): Promise<HTMLElement> {
    await import('./editor/StrategyEditor');
    await customElements.whenDefined('dashboard-strategy-editor');
    return document.createElement('dashboard-strategy-editor');
  }
}

// Register strategy custom element IMMEDIATELY — no heavy imports needed.
// This ensures HA's 5-second timeout is satisfied even on slow networks.
customElements.define('ll-strategy-dashboard-strategy', Simon42DashboardStrategy);

declare global {
  interface Window {
    customStrategies?: Array<{
      type: string;
      strategyType: 'dashboard' | 'view' | 'section';
      name?: string;
      description?: string;
      documentationURL?: string;
    }>;
  }
}

window.customStrategies = window.customStrategies || [];
if (!window.customStrategies.some((strategy) => strategy.type === 'custom:dashboard-strategy')) {
  window.customStrategies.push({
    type: 'custom:dashboard-strategy',
    strategyType: 'dashboard',
    name: 'Dashboard Strategy',
    description:
      'Automatisch generiertes Dashboard aus Bereichen, Geraeten und Entitaeten mit Zusammenfassungen und Raum-Ansichten.',
    documentationURL: 'https://github.com/Cyberhunter88/dashboard-strategy',
  });
}

console.log(`Dashboard Strategy v${STRATEGY_VERSION} loaded`);
