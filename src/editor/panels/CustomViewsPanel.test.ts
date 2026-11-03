// @vitest-environment happy-dom
import { render } from 'lit';
import { describe, expect, it, vi } from 'vitest';
import { makeHass } from '../../../tests/fixtures/hass';
import type { Simon42StrategyConfig } from '../../types/strategy';
import { renderCustomViewsPanel, type CustomViewsPanelHost } from './CustomViewsPanel';

function makeHost(config: Simon42StrategyConfig, overrides: Partial<CustomViewsPanelHost> = {}): CustomViewsPanelHost {
  return {
    _config: config,
    _hass: makeHass({ areas: [{ area_id: 'kitchen', name: 'Kitchen' }] }),
    _refDashboards: [],
    _getSortedAreas: () =>
      [{ area_id: 'kitchen', name: 'Kitchen' }] as ReturnType<CustomViewsPanelHost['_getSortedAreas']>,
    _addCustomView: vi.fn(),
    _addCustomRefView: vi.fn(),
    _loadRefDashboards: vi.fn(async () => undefined),
    _refDashboardChanged: vi.fn(),
    _refViewChanged: vi.fn(),
    _removeCustomView: vi.fn(),
    _updateCustomViewField: vi.fn(),
    _updateCustomViewAfterView: vi.fn(),
    _updateCustomViewYaml: vi.fn(),
    ...overrides,
  };
}

function mount(host: CustomViewsPanelHost): HTMLElement {
  const container = document.createElement('div');
  render(renderCustomViewsPanel(host, true), container);
  return container;
}

describe('custom views panel', () => {
  it('shows the empty state and wires the add buttons to the host', () => {
    const host = makeHost({} as Simon42StrategyConfig);
    const container = mount(host);
    expect(container.querySelector('.empty-state')).toBeTruthy();
    const [addView, addRef] = Array.from(container.querySelectorAll<HTMLButtonElement>('button.btn-primary'));
    addView.click();
    addRef.click();
    expect(host._addCustomView).toHaveBeenCalledTimes(1);
    expect(host._addCustomRefView).toHaveBeenCalledTimes(1);
  });

  it('renders items, offers generated views and areas as positions, and forwards edits', () => {
    const config = {
      custom_views: [{ title: 'Mine', path: 'mine', icon: 'mdi:star', yaml: '' }],
    } as unknown as Simon42StrategyConfig;
    const host = makeHost(config);
    const container = mount(host);
    expect(container.querySelectorAll('.custom-item')).toHaveLength(1);
    const options = Array.from(container.querySelectorAll('select option')).map((option) =>
      option.getAttribute('value')
    );
    expect(options).toEqual(expect.arrayContaining(['', 'home', 'lights', 'kitchen']));

    const title = container.querySelector<HTMLInputElement>('input[type="text"]')!;
    title.value = 'Renamed';
    title.dispatchEvent(new Event('change'));
    expect(host._updateCustomViewField).toHaveBeenCalledWith(0, 'title', 'Renamed');

    container.querySelector<HTMLButtonElement>('.btn-remove')!.click();
    expect(host._removeCustomView).toHaveBeenCalledWith(0);
  });

  it('loads reference dashboards lazily for reference views', () => {
    const config = {
      custom_views: [{ title: 'Ref', path: 'ref', ref_dashboard: 'other', ref_view: 'v' }],
    } as unknown as Simon42StrategyConfig;
    const host = makeHost(config, { _refDashboards: null });
    mount(host);
    expect(host._loadRefDashboards).toHaveBeenCalledTimes(1);
  });
});
