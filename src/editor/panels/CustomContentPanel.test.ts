// @vitest-environment happy-dom
import { render } from 'lit';
import { describe, expect, it, vi } from 'vitest';
import type { CustomCard } from '../../types/strategy';
import {
  renderCustomCardsSection,
  renderCustomContentPanel,
  renderCustomSectionsSection,
  type CustomContentPanelHost,
} from './CustomContentPanel';
import type { CustomViewsPanelHost } from './CustomViewsPanel';

function makeHost(config: CustomContentPanelHost['_config'] = {}): CustomContentPanelHost {
  const customViewsHost: CustomViewsPanelHost = {
    _config: {} as CustomViewsPanelHost['_config'],
    _hass: null,
    _refDashboards: [],
    _getSortedAreas: () => [],
    _addCustomView: vi.fn(),
    _addCustomRefView: vi.fn(),
    _loadRefDashboards: vi.fn(async () => undefined),
    _refDashboardChanged: vi.fn(),
    _refViewChanged: vi.fn(),
    _removeCustomView: vi.fn(),
    _updateCustomViewField: vi.fn(),
    _updateCustomViewAfterView: vi.fn(),
    _updateCustomViewYaml: vi.fn(),
  };
  return {
    _config: config,
    customViewsHost,
    _sectionLabelKey: (key) => `sections.${key}`,
    _getCustomCardEditorLabel: (card: CustomCard | undefined, fallback: string) =>
      card?.editor_title || card?.title || fallback,
    _customCardsHeadingChanged: vi.fn(),
    _customCardsIconChanged: vi.fn(),
    _openCardPickerForCustomCard: vi.fn(),
    _removeCustomCard: vi.fn(),
    _updateCustomCardField: vi.fn(),
    _updateCustomCardYaml: vi.fn(),
    _openCardEditorForCustomCard: vi.fn(),
    _addCustomSection: vi.fn(),
    _removeCustomSection: vi.fn(),
    _updateCustomSectionYaml: vi.fn(),
    _updateCustomSectionField: vi.fn(),
    _removeCardFromSection: vi.fn(),
    _updateSectionCardField: vi.fn(),
    _updateSectionCardYaml: vi.fn(),
    _openCardEditorForSectionCard: vi.fn(),
    _openCardPickerForSection: vi.fn(),
    _addCustomBadge: vi.fn(),
    _removeCustomBadge: vi.fn(),
    _updateCustomBadgeYaml: vi.fn(),
  };
}

function mount(template: ReturnType<typeof renderCustomContentPanel>): HTMLElement {
  const container = document.createElement('div');
  render(template, container);
  return container;
}

describe('custom content panel', () => {
  it('renders badges and custom views, with cards and sections left to the weather-start layout', () => {
    const host = makeHost({ custom_badges: [{ yaml: 'type: entity' }, { _yaml_error: 'bad' }] });
    const container = mount(renderCustomContentPanel(host));
    expect(container.querySelector('#custom-cards-list')).toBeNull();
    expect(container.querySelector('#custom-sections-list')).toBeNull();
    expect(container.querySelector('#custom-views-list')).toBeTruthy();
    const badges = container.querySelectorAll('#custom-badges-list .custom-item');
    expect(badges).toHaveLength(2);
    expect(badges[1].querySelector('.custom-item-validation')?.textContent).toContain('bad');

    const textarea = badges[0].querySelector<HTMLTextAreaElement>('textarea')!;
    textarea.value = 'type: entity\nentity: sun.sun';
    textarea.dispatchEvent(new Event('change'));
    expect(host._updateCustomBadgeYaml).toHaveBeenCalledWith(0, 'type: entity\nentity: sun.sun');

    badges[1].querySelector<HTMLButtonElement>('.btn-remove')!.click();
    expect(host._removeCustomBadge).toHaveBeenCalledWith(1);
  });

  it('forwards custom card and section edits to the host', () => {
    const host = makeHost({
      custom_cards: [{ editor_title: 'Mine', yaml: 'type: tile' }],
      custom_sections: [{ title: 'S', cards: [{ title: 'Inner' }] }],
    });
    const cards = mount(renderCustomCardsSection(host));
    expect(cards.querySelector('strong')?.textContent).toBe('Mine');
    cards.querySelector<HTMLButtonElement>('.btn-remove')!.click();
    expect(host._removeCustomCard).toHaveBeenCalledWith(0);

    const sections = mount(renderCustomSectionsSection(host));
    const inner = sections.querySelector<HTMLElement>('.custom-item .custom-item')!;
    expect(inner.querySelector('strong')?.textContent).toBe('Inner');
    inner.querySelector<HTMLButtonElement>('.btn-remove')!.click();
    expect(host._removeCardFromSection).toHaveBeenCalledWith(0, 0);
  });
});
