import { deepFreeze, makeWeatherStackingFixture } from '../fixtures/weather-stacking';
import '../../src/dashboard-strategy';
import { Registry } from '../../src/Registry';
import { makeOptimizationFixture } from '../fixtures/optimization';
import * as diagnostics from '../../src/editor/config-diagnostics';
import type { HomeAssistant } from '../../src/types/homeassistant';

type TestCard = HTMLElement & { hass?: HomeAssistant; setConfig: (config: any) => void; updateComplete?: Promise<boolean> };
const assert = (condition: unknown, message: string) => { if (!condition) throw new Error(message); };
const settle = async (card?: TestCard) => { await card?.updateComplete; await new Promise((resolve) => setTimeout(resolve, 0)); };

/** Minimal native-card doubles; real strategy, editor and wrapper code runs in Chromium. */
class NativeTestCard extends HTMLElement {
  config: any;
  hass?: HomeAssistant;
  configCalls = 0;
  setConfig(config: any) {
    this.config = config;
    this.configCalls++;
    this.style.cssText = 'display:block;box-sizing:border-box;min-width:0;overflow-wrap:anywhere;padding:8px;';
    this.textContent = config.heading ?? config.name ?? config.entity ?? config.type;
  }
}
for (const tag of ['hui-tile-card', 'hui-heading-card', 'hui-picture-entity-card', 'hui-picture-glance-card', 'hui-area-card']) {
  customElements.define(tag, class extends NativeTestCard {});
}
window.loadCardHelpers = async () => ({ createCardElement(config: any) {
  const card = document.createElement(`hui-${config.type}-card`) as NativeTestCard;
  card.setConfig(config);
  return card;
} });

const strategy = () => customElements.get('ll-strategy-dashboard-strategy') as any;
const card = (tag: string, config: any, hass: HomeAssistant): TestCard => {
  const element = document.createElement(tag) as TestCard;
  element.setConfig(config);
  element.hass = hass;
  document.getElementById('content')!.appendChild(element);
  return element;
};

async function checkMemoryGrowth(width: number) {
  const results = [];
  const host = document.getElementById('content')!;
  {
    const { hass, config } = makeWeatherStackingFixture();
    const original = JSON.stringify(config);
    deepFreeze(config);
    const first = await strategy().generate(config, hass);
    const expected = JSON.stringify(first);
    let maximumCards = 0;
    host.style.width = width + 'px';
    for (let i = 0; i < 100; i++) {
      const dashboard = await strategy().generate(config, hass);
      assert(JSON.stringify(dashboard) === expected, 'Dashboard grew during regeneration');
      assert(JSON.stringify(first) === expected, 'Previous output was mutated');
      assert(JSON.stringify(config) === original, 'Input was mutated');
      const areas = dashboard.views[0].sections.flatMap((section: any) => section.cards || []).filter((entry: any) => entry.type === 'custom:dashboard-strategy-area-card');
      for (const entry of areas) card('dashboard-strategy-area-card', entry, hass);
      await settle();
      assert(host.querySelectorAll('hui-area-card').length === areas.length, 'Native card count grew');
      maximumCards = Math.max(maximumCards, host.querySelectorAll('hui-area-card').length);
      host.replaceChildren();
      await settle();
      assert(host.childElementCount === 0, 'Cards remained mounted');
    }
    results.push({ width, generations: 100, maximumCards, outputBytes: new TextEncoder().encode(expected).length });
  }
  host.style.width = '';
  return results;
}

async function benchmark() {
  const results = [];
  for (const count of [500, 2000, 5000]) {
    const { hass, config } = makeOptimizationFixture(count);
    const original = JSON.stringify(config);
    const cacheClass = (diagnostics as any).ConfigDiagnostics;
    const cache = cacheClass ? new cacheClass() : undefined;
    const timings: Record<string, number[]> = { dashboard: [], registry: [], diagnostics100: [], yamlAnalysis100: [], cards100: [], editor: [] };
    const unrelatedHass = { ...hass, states: { ...hass.states, 'sensor.ups_fixture': { ...hass.states['sensor.ups_fixture'], state: '50' } } };
    for (let i = 0; i < 31; i++) {
      Registry.resetForTesting();
      let start = performance.now();
      Registry.initialize(hass, config);
      const registry = performance.now() - start;
      Registry.resetForTesting();
      start = performance.now();
      const dashboard = await strategy().generate(config, hass);
      const dashboardTime = performance.now() - start;
      assert(dashboard.views.length > 10, 'Full dashboard views missing');
      start = performance.now();
      for (let j = 0; j < 100; j++) cache ? cache.inspect(config, hass) : diagnostics.inspectConfig(config, hass);
      const diagnosticTime = performance.now() - start;
      start = performance.now();
      for (let j = 0; j < 100; j++) diagnostics.collectEntityReferences(config);
      const yamlTime = performance.now() - start;
      const lights = card('dashboard-strategy-lights-group-card', { group_type: 'all', config, area: hass.areas.room_0, entities: ['light.fixture_0'], group_by_areas: true }, hass);
      await lights.updateComplete;
      start = performance.now();
      for (let j = 0; j < 100; j++) {
        lights.hass = j % 2 ? hass : unrelatedHass;
        await lights.updateComplete;
      }
      const cardsTime = performance.now() - start;
      lights.remove();
      start = performance.now();
      const editor = await strategy().getConfigElement() as TestCard;
      editor.setConfig(config);
      editor.hass = hass;
      document.getElementById('content')!.appendChild(editor);
      await editor.updateComplete;
      const editorTime = performance.now() - start;
      editor.remove();
      if (i > 9) {
        timings.registry.push(registry); timings.dashboard.push(dashboardTime);
        timings.diagnostics100.push(diagnosticTime); timings.yamlAnalysis100.push(yamlTime);
        timings.cards100.push(cardsTime); timings.editor.push(editorTime);
      }
    }
    assert(JSON.stringify(config) === original, 'Input config mutated');
    results.push({ count, medianMs: Object.fromEntries(Object.entries(timings).map(([key, values]) => [key, values.sort((a, b) => a - b)[Math.floor(values.length / 2)]])) });
  }
  return results;
}

async function checkCards() {
  const { hass, config } = makeOptimizationFixture(500);
  Registry.initialize(hass, config);
  const group = card('dashboard-strategy-lights-group-card', { group_type: 'all', config, area: hass.areas.room_0, entities: ['light.fixture_0'], group_by_areas: true }, hass);
  await settle(group);
  const tile = group.shadowRoot!.querySelector('hui-tile-card');
  assert(tile, 'Light tile missing');
  group.hass = { ...hass, states: { ...hass.states, 'sensor.ups_fixture': { ...hass.states['sensor.ups_fixture'], state: '50' } } };
  await settle(group);
  assert(group.shadowRoot!.querySelector('hui-tile-card') === tile, 'Unrelated update rebuilt light tile');
  group.hass = { ...hass, states: { ...hass.states, 'light.fixture_0': { ...hass.states['light.fixture_0'], attributes: { brightness: 42 } } } };
  await settle(group);
  assert(group.shadowRoot!.querySelector('hui-tile-card') === tile, 'Attribute update rebuilt light tile');
  group.hass = { ...hass, states: { ...hass.states, 'light.fixture_0': { ...hass.states['light.fixture_0'], attributes: { friendly_name: 'Renamed lamp', supported_color_modes: ['brightness'] } } } };
  await settle(group);
  assert(group.shadowRoot!.querySelector('hui-tile-card') === tile && (tile as NativeTestCard).config.name === 'Renamed lamp', 'Pooled light name did not update');

  const covers = card('dashboard-strategy-covers-group-card', { group_type: 'closed', config }, hass);
  const batteries = card('dashboard-strategy-batteries-card', { config: { ...config, group_batteries_by_areas: true } }, hass);
  await settle(covers); await settle(batteries);
  const coverTile = covers.shadowRoot!.querySelector('hui-tile-card');
  const batteryTile = batteries.shadowRoot!.querySelector('hui-tile-card');
  assert(coverTile && batteryTile, 'Cover or battery tile missing');
  const updatedHass = { ...hass, areas: { ...hass.areas, room_0: { ...hass.areas.room_0, name: 'Renamed room' } } };
  group.hass = updatedHass; covers.hass = updatedHass; batteries.hass = updatedHass;
  await settle(group); await settle(covers); await settle(batteries);
  assert(group.shadowRoot!.querySelector('hui-tile-card') === tile, 'Area update rebuilt pooled light tile');
  assert(covers.shadowRoot!.querySelector('hui-tile-card') === coverTile, 'Area update rebuilt pooled cover tile');
  assert(batteries.shadowRoot!.querySelector('hui-tile-card') === batteryTile, 'Area update rebuilt pooled battery tile');

  const missingStates = { ...hass.states };
  delete missingStates['light.fixture_0'];
  group.hass = { ...hass, states: missingStates };
  await settle(group);
  assert(!group.shadowRoot!.querySelector('hui-tile-card'), 'Missing state left a stale light tile');
  group.hass = hass;
  await settle(group);
  assert(group.shadowRoot!.querySelector('hui-tile-card'), 'Returning state did not restore the light');
  const available = card('dashboard-strategy-lights-group-card', { group_type: 'all', config: { ...config, hide_unavailable_entities: true }, entities: ['light.fixture_0'] }, hass);
  await settle(available);
  available.hass = { ...hass, states: { ...hass.states, 'light.fixture_0': { ...hass.states['light.fixture_0'], state: 'unavailable' } } };
  await settle(available);
  assert(!available.shadowRoot!.querySelector('hui-tile-card'), 'Unavailable light stayed visible');
  available.hass = hass; await settle(available);
  assert(available.shadowRoot!.querySelector('hui-tile-card'), 'Available light did not return');

  const summary = card('dashboard-strategy-summary-card', { summary_type: 'lights' }, hass);
  await settle(summary);
  let actions = 0;
  summary.addEventListener('hass-action', () => actions++);
  const link = summary.shadowRoot!.querySelector('ha-card')!;
  link.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  link.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
  assert(actions === 2, 'Summary keyboard navigation missing');
  summary.hass = { ...hass, language: 'de', locale: { ...hass.locale, language: 'de' } };
  await settle(summary);
  assert(summary.shadowRoot!.textContent?.includes('Lichter'), 'Summary language did not update');
  const area = card('dashboard-strategy-area-card', { area: 'room_0', navigation_path: '/synthetic-dashboard/room_0' }, hass);
  await settle();
  area.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  assert(location.pathname.endsWith('/room_0'), 'Area keyboard navigation failed');
  history.replaceState(null, '', '/synthetic-dashboard/home');
  const control = document.createElement('button'); area.appendChild(control);
  control.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  assert(location.pathname.endsWith('/home'), 'Area swallowed nested keyboard control');
  return ['light/cover/battery pooling', 'attribute and area updates', 'missing/returning states and availability', 'summary keyboard and language', 'area keyboard and nested controls'];
}

async function checkCamera() {
  const { hass, config } = makeOptimizationFixture();
  const nativeDashboard = await strategy().generate({ ...config, areas_options: {} }, hass);
  const findCards = (value: any): any[] => !value || typeof value !== 'object' ? [] : [value, ...Object.values(value).flatMap(findCards)];
  const generatedCamera = findCards(nativeDashboard).find((value) => value.type === 'custom:dashboard-strategy-camera-card');
  assert(generatedCamera?.camera_pause_when_hidden === true, 'Camera option not forwarded by room generator');
  const externalDashboard = await strategy().generate({ ...config, areas_options: {}, camera_renderer: 'webrtc', camera_webrtc_streams: { 'camera.fixture': 'fixture_stream' } }, hass);
  assert(!findCards(externalDashboard).some((value) => value.type === 'custom:dashboard-strategy-camera-card'), 'Native option changed external renderer');
  const camera = card('dashboard-strategy-camera-card', { entity: 'camera.fixture', camera_pause_when_hidden: true }, hass);
  await settle(); await new Promise((resolve) => setTimeout(resolve, 100));
  const native = camera.querySelector('hui-picture-entity-card') as NativeTestCard;
  assert(native, 'Native camera missing');
  assert(native.config.camera_view === 'auto', 'Camera auto-started');
  camera.querySelector('button')!.click();
  assert(native.config.camera_view === 'live', 'Manual live start failed');
  const hiddenDescriptor = Object.getOwnPropertyDescriptor(document, 'hidden');
  Object.defineProperty(document, 'hidden', { configurable: true, value: true });
  document.dispatchEvent(new Event('visibilitychange'));
  assert(native.config.camera_view === 'auto', 'Hidden document did not pause');
  Object.defineProperty(document, 'hidden', { configurable: true, value: false });
  document.dispatchEvent(new Event('visibilitychange'));
  assert(native.config.camera_view === 'live', 'Visible document did not resume');
  if (hiddenDescriptor) Object.defineProperty(document, 'hidden', hiddenDescriptor);
  else delete (document as any).hidden;
  camera.style.display = 'none';
  await new Promise((resolve) => setTimeout(resolve, 100));
  assert(native.config.camera_view === 'auto', 'Hidden live camera did not pause');
  camera.style.display = 'block';
  await new Promise((resolve) => setTimeout(resolve, 100));
  assert(native.config.camera_view === 'live', 'Visible live camera did not resume');
  const calls = native.configCalls;
  camera.hass = { ...hass, states: { ...hass.states } };
  camera.setConfig({ entity: 'camera.fixture', camera_pause_when_hidden: true });
  assert(native.configCalls === calls, 'Unchanged camera was reconfigured');
  camera.querySelector('button')!.click();
  camera.style.display = 'none'; await new Promise((resolve) => setTimeout(resolve, 100));
  camera.style.display = 'block'; await new Promise((resolve) => setTimeout(resolve, 100));
  assert(native.config.camera_view === 'auto', 'Manual stop resumed unexpectedly');
  camera.remove(); document.getElementById('content')!.appendChild(camera); await settle();
  assert(camera.querySelectorAll('button').length === 1, 'Reconnect duplicated camera controls');
  camera.remove();
  const defaultCamera = card('dashboard-strategy-camera-card', { entity: 'camera.fixture' }, hass);
  await settle();
  defaultCamera.querySelector('button')!.click();
  defaultCamera.style.display = 'none'; await new Promise((resolve) => setTimeout(resolve, 100));
  assert((defaultCamera.querySelector('hui-picture-entity-card') as NativeTestCard).config.camera_view === 'live', 'Default camera pause is not opt-in');
  defaultCamera.remove();
  return ['manual start/stop', 'viewport and document pause/resume', 'unchanged config reuse', 'reconnect cleanup'];
}

async function checkLazyAreaCard() {
  const originalHelpers = window.loadCardHelpers;
  const { hass } = makeOptimizationFixture();
  let creations = 0;
  const tag = 'hui-delayed-area-regression-card';
  window.loadCardHelpers = async () => ({ createCardElement(config: any) {
    if (++creations > 50) throw new Error('Bounded guard: repeated creation of unregistered area card');
    const element = document.createElement(tag) as NativeTestCard;
    // Match HA's lazy native-card factory: upgrade/configure this same element later.
    customElements.whenDefined(tag).then(() => {
      customElements.upgrade(element);
      element.dispatchEvent(new Event('ll-upgrade', { bubbles: true, composed: true }));
      element.setConfig(config);
    });
    return element;
  } });
  const area = card('dashboard-strategy-area-card', { area: 'room_0', name: 'Old', navigation_path: '/synthetic-dashboard/room_0' }, hass);
  try {
    await settle();
    const beforeRegistration = creations;
    area.setConfig({ area: 'room_1', name: 'Latest', navigation_path: '/synthetic-dashboard/room_1' });
    area.hass = { ...hass };
    await settle();
    customElements.define(tag, class extends NativeTestCard {});
    await settle();
    assert(beforeRegistration === 1, 'Unregistered native area created repeatedly: ' + beforeRegistration);
    assert(creations === 1, 'Pending native area was recreated after config update');
    const native = area.firstElementChild as NativeTestCard;
    assert(native?.config.area === 'room_1' && native.config.name === 'Latest', 'Lazy area lost latest config');
    assert(native.hass === area.hass, 'Lazy area lost latest hass');
    area.remove();
    const detachedTag = 'hui-detached-area-regression-card';
    let detachedCreations = 0;
    window.loadCardHelpers = async () => ({ createCardElement() {
      detachedCreations++;
      return document.createElement(detachedTag) as NativeTestCard;
    } });
    const detached = card('dashboard-strategy-area-card', { area: 'room_0', navigation_path: '/synthetic-dashboard/room_0' }, hass);
    await settle();
    detached.remove();
    customElements.define(detachedTag, class extends NativeTestCard {});
    await settle();
    assert(!detached.firstElementChild && detachedCreations === 1, 'Late registration mounted a detached area');
    document.getElementById('content')!.appendChild(detached);
    await settle();
    assert(detached.firstElementChild?.localName === detachedTag && Number(detachedCreations) === 2, 'Lazy area failed to reconnect');
    detached.remove();
    return ['cold-start area registration waits without recreating cards', 'pending area keeps latest config and hass', 'late area registration respects disconnect and reconnect'];
  } finally {
    area.remove();
    window.loadCardHelpers = originalHelpers;
  }
}

async function checkAsyncCards() {
  const helpers = window.loadCardHelpers!;
  const { hass } = makeOptimizationFixture();
  const resolvers: Array<(value: Awaited<ReturnType<typeof helpers>>) => void> = [];
  window.loadCardHelpers = () => new Promise((resolve) => resolvers.push(resolve));
  const camera = card('dashboard-strategy-camera-card', { entity: 'camera.fixture', name: 'Old' }, hass);
  camera.setConfig({ entity: 'camera.fixture', name: 'New' });
  const factory = await helpers();
  resolvers[1](factory); await settle();
  resolvers[0](factory); await settle();
  assert((camera.querySelector('hui-picture-entity-card') as NativeTestCard).config.name === 'New', 'Stale camera replaced new config');
  const area = card('dashboard-strategy-area-card', { area: 'room_0', navigation_path: '/synthetic-dashboard/room_0' }, hass);
  area.remove();
  resolvers[2](factory); await settle();
  assert(!area.firstElementChild, 'Detached area received stale child');
  window.loadCardHelpers = helpers;
  camera.remove();
  return ['stale asynchronous camera result rejected', 'detached area result rejected'];
}

async function layout(sidebar: boolean) {
  const content = document.getElementById('content')!;
  content.replaceChildren();
  document.body.style.marginLeft = sidebar && innerWidth >= 768 ? '256px' : '0';
  const { hass, config } = makeOptimizationFixture(48);
  Registry.initialize(hass, config);
  const summary = card('dashboard-strategy-summary-card', { summary_type: 'lights' }, hass);
  const batteries = card('dashboard-strategy-batteries-card', { config }, hass);
  const editor = await strategy().getConfigElement() as TestCard;
  editor.setConfig(config); editor.hass = hass; content.appendChild(editor);
  content.prepend(editor);
  (editor as any)._expandedPanels = new Set(['overview', 'summaries', 'section-order', 'diagnostics', 'area-options', 'custom-content']);
  (editor as any)._expandedAreas = new Set(['room_0']);
  (editor as any)._diagnosticsChecked = true;
  await settle(summary); await settle(batteries); await settle(editor);
  assert(document.documentElement.scrollWidth <= innerWidth + 1, 'Horizontal page overflow');
  return { width: innerWidth, sidebar, contentWidth: content.clientWidth };
}

async function checkEditor() {
  const content = document.getElementById('content')!;
  content.replaceChildren();
  const { hass, config } = makeOptimizationFixture(48);
  const editor = await strategy().getConfigElement() as any;
  const custom = { ...config, extension_option: { retained: true }, weather_start_layout_items: [{ id: 'browser-yaml', type: 'clock', yaml: 'type: markdown\ncontent: Original', parsed_config: { type: 'markdown', content: 'Original' } }] };
  editor.setConfig(custom); editor.hass = hass; content.appendChild(editor);
  await settle(editor);
  const events: any[] = [];
  editor.addEventListener('config-changed', (event: CustomEvent) => events.push(event.detail.config));
  const panel = editor.shadowRoot.querySelector('.panel-header') as HTMLButtonElement;
  panel.click(); await settle(editor);
  const expanded = [...editor._expandedPanels];
  assert(expanded.length > 0, 'Panel did not expand');
  editor.hass = { ...hass }; await settle(editor);
  assert(JSON.stringify([...editor._expandedPanels]) === JSON.stringify(expanded), 'Hass update lost expansion');
  editor._updateWeatherStartItemYaml('browser-yaml', 'type: markdown\ncontent: Updated\ncustom_field: preserved');
  await settle(editor);
  assert(events.at(-1)?.weather_start_layout_items[0].parsed_config.custom_field === 'preserved', 'YAML roundtrip lost custom field');
  assert(events.at(-1)?.extension_option.retained, 'Config event lost unknown option');
  const count = events.length;
  editor._updateWeatherStartItemYaml('browser-yaml', 'type: [broken');
  await settle(editor);
  assert(editor._config.weather_start_layout_items[0]._yaml_error, 'Invalid YAML error missing');
  assert(events.length === count, 'Invalid YAML emitted persistent config');
  editor._updateWeatherStartItemYaml('browser-yaml', 'type: markdown\ncontent: Recovered');
  await settle(editor);
  assert(events.length === count + 1, 'YAML recovery failed');
  editor._openCardPickerForCustomCard(); await settle(editor);
  assert(editor.shadowRoot.querySelector('.card-type-grid'), 'Card picker did not open');
  (editor.shadowRoot.querySelector('.card-type-btn') as HTMLButtonElement).click(); await settle(editor);
  const textarea = editor.shadowRoot.querySelector('.card-editor-yaml-area') as HTMLTextAreaElement;
  assert(textarea, 'YAML picker fallback missing');
  textarea.value = 'type: markdown\ncontent: Browser card';
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
  (editor.shadowRoot.querySelector('.card-picker-footer .btn-primary') as HTMLButtonElement).click();
  await settle(editor);
  assert(events.at(-1)?.custom_cards.at(-1).parsed_config.content === 'Browser card', 'Picker save failed');
  assert(!editor._cardPickerOpen, 'Picker did not close');
  editor.remove();
  const reopened = await strategy().getConfigElement() as any;
  reopened.setConfig(custom); reopened.hass = hass; content.appendChild(reopened); await settle(reopened);
  assert(JSON.stringify([...reopened._expandedPanels]) === JSON.stringify(expanded), 'Expansion persistence failed');
  reopened.remove();
  return ['editor startup', 'config-changed preserves unknown fields', 'YAML roundtrip/error/recovery', 'panel persistence', 'card picker save'];
}

(window as any).optimization = { checkLazyAreaCard, checkMemoryGrowth, benchmark, checkCards, checkCamera, checkAsyncCards, checkEditor, layout };
