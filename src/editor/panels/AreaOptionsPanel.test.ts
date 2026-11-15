// @vitest-environment happy-dom
import { html, render, type TemplateResult } from 'lit';
import { describe, expect, it, vi } from 'vitest';
import type { Simon42StrategyConfig } from '../../types/strategy';
import { renderAreaOptionsPanel } from './AreaOptionsPanel';
import type { OptionPanelHost } from './option-panel-host';

function makeHost(config: Simon42StrategyConfig): OptionPanelHost {
  return {
    hass: null,
    config,
    editor: {} as OptionPanelHost['editor'],
    entityListState: { search: {}, draggedId: null },
    checkbox: (id: string, label: string, checked: boolean, change: (checked: boolean) => void): TemplateResult =>
      html`<input
          type="checkbox"
          id=${id}
          ?checked=${checked}
          @change=${(e: Event) => change((e.target as HTMLInputElement).checked)}
        /><label for=${id}>${label}</label>`,
    toggle: vi.fn(),
    setOption: vi.fn(),
    update: vi.fn(),
    requestUpdate: vi.fn(),
    entityOptions: () => [],
    filterEntities: () => [],
    sortedAreas: () => [],
  };
}

function mount(host: OptionPanelHost, onDisplayType = vi.fn()): HTMLElement {
  const container = document.createElement('div');
  render(renderAreaOptionsPanel(host, onDisplayType), container);
  return container;
}

function checkbox(container: HTMLElement, id: string): HTMLInputElement {
  const input = container.querySelector<HTMLInputElement>(`#${id}`);
  if (!input) throw new Error(`missing #${id}`);
  return input;
}

describe('area options panel', () => {
  it('places the helpers and sensors toggles right after the switches section toggle', () => {
    const container = mount(makeHost({} as Simon42StrategyConfig));
    const ids = Array.from(container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')).map((i) => i.id);
    const switches = ids.indexOf('show-switches-section-in-rooms');
    expect(switches).toBeGreaterThan(-1);
    expect(ids.slice(switches, switches + 3)).toEqual([
      'show-switches-section-in-rooms',
      'show-helpers-section-in-rooms',
      'show-sensors-section-in-rooms',
    ]);
  });

  it('keeps opt-in and default-on semantics of the room toggles', () => {
    const container = mount(makeHost({} as Simon42StrategyConfig));
    expect(checkbox(container, 'show-helpers-section-in-rooms').checked).toBe(false);
    expect(checkbox(container, 'show-sensors-section-in-rooms').checked).toBe(false);
    expect(checkbox(container, 'show-locks-in-rooms').checked).toBe(false);
    expect(checkbox(container, 'show-cameras-in-rooms').checked).toBe(true);
    expect(checkbox(container, 'show-energy-in-rooms').checked).toBe(true);
    expect(checkbox(container, 'show-ups-in-rooms').checked).toBe(true);
    expect(checkbox(container, 'hide-grouped-climate-members').checked).toBe(true);

    const configured = mount(
      makeHost({
        show_helpers_section_in_rooms: true,
        show_sensors_section_in_rooms: true,
        show_ups_in_rooms: false,
      } as Simon42StrategyConfig)
    );
    expect(checkbox(configured, 'show-helpers-section-in-rooms').checked).toBe(true);
    expect(checkbox(configured, 'show-sensors-section-in-rooms').checked).toBe(true);
    expect(checkbox(configured, 'show-ups-in-rooms').checked).toBe(false);
  });

  it('forwards toggle and display type changes to the host', () => {
    const host = makeHost({} as Simon42StrategyConfig);
    const onDisplayType = vi.fn();
    const container = mount(host, onDisplayType);

    const helpers = checkbox(container, 'show-helpers-section-in-rooms');
    helpers.checked = true;
    helpers.dispatchEvent(new Event('change'));
    expect(host.toggle).toHaveBeenCalledWith('show_helpers_section_in_rooms', true, false);

    const cameras = checkbox(container, 'show-cameras-in-rooms');
    cameras.checked = false;
    cameras.dispatchEvent(new Event('change'));
    expect(host.toggle).toHaveBeenCalledWith('show_cameras_in_rooms', false, true);

    const select = container.querySelector<HTMLSelectElement>('#area-display-type')!;
    select.value = 'picture';
    select.dispatchEvent(new Event('change'));
    expect(onDisplayType).toHaveBeenCalledWith('picture');
  });
});
