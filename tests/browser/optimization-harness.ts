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
  (editor as any)._expandedPanels = new Set(['overview', 'summaries', 'section-order', 'diagnostics']);
  (editor as any)._diagnosticsChecked = true;
  await settle(summary); await settle(batteries); await settle(editor);
  assert(document.documentElement.scrollWidth <= innerWidth + 1, 'Horizontal page overflow');
  return { width: innerWidth, sidebar, contentWidth: content.clientWidth };
}

(window as any).optimization = { benchmark, checkCards, checkCamera, checkAsyncCards, layout };
