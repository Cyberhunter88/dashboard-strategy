// ====================================================================
// Overview panels — layout basics, header details, sections, advanced
// ====================================================================

import { html, nothing, type TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { SECTION_REGISTRY } from '../../sections/section-registry';
import type { HomeAssistant } from '../../types/homeassistant';
import type { HeadingKey, PersonBadgeLayout } from '../../types/strategy';
import { localize } from '../../utils/localize';
import { getOptionMetadata } from '../../utils/option-metadata';
import { getWeatherStartWeatherMode, usesDefaultWeatherStartLayout } from '../../utils/weather-start-defaults';
import { renderDesignSection } from './DesignPanel';
import { isOptionEnabled, parseEntityList, toggleRow, type OptionPanelHost } from './option-panel-host';

/** Headings that can be hidden while their section content stays visible. */
const HIDEABLE_HEADINGS: readonly HeadingKey[] = [
  'summaries',
  'favorites',
  'light_favorites',
  'quick_actions',
  'areas',
  'areas_other',
  'weather',
  'energy',
  'plants',
  'agenda',
  'todos',
  'persons',
  'vacuums',
  'maintenance',
  'media',
  'activity',
  'custom_cards',
  'custom_sections',
];

interface EntityOption {
  entity_id: string;
  name: string;
}

interface SelectOption {
  value: string;
  label: string;
}

function entityOptions(hass: HomeAssistant | null, accept: (entityId: string) => boolean): EntityOption[] {
  if (!hass) return [];
  return Object.keys(hass.states)
    .filter(accept)
    .map((entityId) => ({
      entity_id: entityId,
      name: hass.states[entityId].attributes?.friendly_name || entityId.split('.')[1].replace(/_/g, ' '),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** User-facing selects only; config and diagnostic selects are device settings. */
function houseModeOptions(hass: HomeAssistant | null): EntityOption[] {
  return entityOptions(hass, (entityId) => {
    if (!entityId.startsWith('input_select.') && !entityId.startsWith('select.')) return false;
    const category = hass?.entities[entityId]?.entity_category;
    return category !== 'config' && category !== 'diagnostic';
  });
}

function selectRow(
  id: string,
  label: string,
  selected: string,
  options: SelectOption[],
  change: (value: string) => void
): TemplateResult {
  return html`
    <div class="form-row">
      <label for=${id} class="form-label">${label}</label>
      <select
        id=${id}
        class="form-control"
        @change=${(event: Event) => change((event.target as HTMLSelectElement).value)}
      >
        ${options.map(
          (option) =>
            html`<option value=${option.value} ?selected=${option.value === selected}>${option.label}</option>`
        )}
      </select>
    </div>
  `;
}

/** Select for an optional entity; the empty entry removes the option from YAML. */
function entitySelectRow(
  host: OptionPanelHost,
  key: 'weather_entity' | 'alarm_entity' | 'house_mode_entity' | 'power_badge_entity',
  id: string,
  emptyLabel: string,
  entities: EntityOption[]
): TemplateResult {
  return selectRow(
    id,
    localize(`editor.${key}`),
    host.config[key] || '',
    [{ value: '', label: emptyLabel }, ...entities.map((entity) => ({ value: entity.entity_id, label: entity.name }))],
    (value) =>
      host.update((config) => {
        if (value) config[key] = value;
        else delete config[key];
      })
  );
}

export function renderBasicOverviewSection(host: OptionPanelHost): TemplateResult {
  const config = host.config;
  const areaCardColumns = config.overview_area_card_columns ?? 'full';
  const weatherModeDefault = usesDefaultWeatherStartLayout(config) ? 'compact_hourly' : 'full';
  const maxColumns = getOptionMetadata('overview_max_columns');

  return html`
    <div class="section">
      <div class="section-title">${localize('editor.section_overview')}</div>
      ${renderDesignSection(host.editor)}
      ${entitySelectRow(
        host,
        'weather_entity',
        'basic-weather-entity',
        localize('editor.weather_entity_auto'),
        entityOptions(host.hass, (entityId) => entityId.startsWith('weather.'))
      )}
      ${selectRow(
        'overview-max-columns',
        localize('editor.overview_max_columns'),
        String(config.overview_max_columns ?? 3),
        (maxColumns?.values ?? [1, 2, 3, 4]).map((value) => ({ value: String(value), label: String(value) })),
        (value) => host.setOption('overview_max_columns', Number(value), 3)
      )}
      ${selectRow(
        'overview-area-card-columns',
        localize('editor.overview_area_card_columns'),
        String(areaCardColumns),
        [
          { value: 'full', label: localize('editor.columns_full') },
          { value: '6', label: '2' },
          { value: '4', label: '3' },
        ],
        (value) => host.setOption('overview_area_card_columns', value === 'full' ? 'full' : Number(value), 'full')
      )}
      ${selectRow(
        'weather-start-weather-mode',
        localize('editor.weather_start_weather_mode'),
        getWeatherStartWeatherMode(config),
        [
          { value: 'full', label: localize('editor.weather_mode_full') },
          { value: 'compact_hourly', label: localize('editor.weather_mode_compact_hourly') },
        ],
        (value) => host.setOption('weather_start_weather_mode', value, weatherModeDefault)
      )}
      ${selectRow(
        'weather-start-date-card',
        localize('editor.weather_start_date_card'),
        config.weather_start_date_card ?? 'button-card',
        [
          { value: 'button-card', label: 'button-card' },
          { value: 'markdown', label: localize('editor.date_card_markdown') },
        ],
        (value) => host.setOption('weather_start_date_card', value, 'button-card')
      )}
    </div>
  `;
}

export function renderOverviewDetailsSection(host: OptionPanelHost): TemplateResult {
  const config = host.config;
  const showSearchCard = config.show_search_card === true;
  const tipVariant = config.search_card_variant === 'tip';
  // The custom search card needs two HACS frontend modules; the tip variant needs none.
  const searchCardAvailable =
    tipVariant || (customElements.get('search-card') !== undefined && customElements.get('card-tools') !== undefined);

  return html`
    <div class="section">
      <div class="section-title">${localize('editor.section_overview_details')}</div>

      <div class="subsection-title">${localize('editor.header_badges')}</div>
      ${toggleRow(host, 'show_person_badges', { defaultOn: true })}
      ${selectRow(
        'person-badge-layout',
        localize('editor.person_badge_layout'),
        config.person_badge_layout || 'with_state',
        (['minimal', 'with_state', 'with_state_and_time'] as const).map((value) => ({
          value,
          label: localize(`editor.person_badge_layout_${value}`),
        })),
        (value) =>
          host.update((next) => {
            if (value === 'with_state') delete next.person_badge_layout;
            else next.person_badge_layout = value as PersonBadgeLayout;
          })
      )}
      <div class="description">${localize('editor.person_badge_layout_desc')}</div>
      ${toggleRow(host, 'show_unavailable_alert_badge')} ${toggleRow(host, 'show_now_playing_badge')}
      ${toggleRow(host, 'show_sun_badge')} ${toggleRow(host, 'show_updates_badge')}
      ${entitySelectRow(
        host,
        'power_badge_entity',
        'power-badge-entity',
        localize('editor.power_badge_none'),
        entityOptions(
          host.hass,
          (entityId) =>
            entityId.startsWith('sensor.') &&
            host.hass?.states[entityId]?.attributes?.device_class === 'power' &&
            !host.hass?.entities[entityId]?.entity_category
        )
      )}
      <div class="description">${localize('editor.power_badge_entity_desc')}</div>

      <div class="subsection-title">${localize('editor.overview_blocks')}</div>
      ${toggleRow(host, 'show_clock_card', { defaultOn: true })}
      ${entitySelectRow(
        host,
        'alarm_entity',
        'alarm-entity',
        localize('editor.alarm_none'),
        entityOptions(host.hass, (entityId) => entityId.startsWith('alarm_control_panel.'))
      )}
      <div class="description">${localize('editor.alarm_desc')}</div>
      ${entitySelectRow(
        host,
        'house_mode_entity',
        'house-mode-entity',
        localize('editor.house_mode_none'),
        houseModeOptions(host.hass)
      )}
      <div class="description">${localize('editor.house_mode_desc')}</div>

      ${toggleRow(host, 'show_search_card', { description: false, disabled: !searchCardAvailable })}
      <div class="description">
        ${searchCardAvailable
          ? localize('editor.show_search_card_desc')
          : html`<span>&#x26A0;&#xFE0F; ${unsafeHTML(localize('editor.show_search_card_missing'))}</span>`}
      </div>
      ${showSearchCard
        ? selectRow(
            'search-card-variant',
            localize('editor.search_card_variant'),
            tipVariant ? 'tip' : 'custom',
            [
              { value: 'custom', label: localize('editor.search_card_variant_custom') },
              { value: 'tip', label: localize('editor.search_card_variant_tip') },
            ],
            (value) =>
              host.update((next) => {
                if (value === 'tip') next.search_card_variant = 'tip';
                else delete next.search_card_variant;
              })
          )
        : nothing}
    </div>
  `;
}

/** Optional comma separated entity list; an empty field restores auto-detection. */
function entityListField(
  host: OptionPanelHost,
  key: 'agenda_calendar_entities' | 'todos_entities',
  prefix: string
): TemplateResult {
  return html`
    <ha-textfield
      .value=${(host.config[key] || []).join(', ')}
      label=${localize(`editor.${key}`)}
      helper=${localize(`editor.${key}_desc`)}
      @change=${(event: Event) => {
        const entities = parseEntityList((event.target as HTMLInputElement).value, (entry) => entry.startsWith(prefix));
        host.update((config) => {
          if (entities.length > 0) config[key] = entities;
          else delete config[key];
        });
      }}
    ></ha-textfield>
  `;
}

/**
 * Switches for every toggle-backed overview section. The list comes from
 * the section registry, so a new section appears here without editor work.
 */
export function renderOverviewSectionsPanel(host: OptionPanelHost): TemplateResult {
  const hiddenHeadings = new Set(host.config.hidden_section_headings || []);
  return html`
    <div class="section">
      <div class="section-title">${localize('editor.section_overview_sections')}</div>
      <div class="description description-intro">${localize('editor.overview_sections_desc')}</div>
      ${SECTION_REGISTRY.filter((meta) => meta.toggle).map((meta) => {
        const { flag, defaultOn } = meta.toggle!;
        return html`
          <div class="form-row">
            <input
              type="checkbox"
              id=${flag.replace(/_/g, '-')}
              ?checked=${isOptionEnabled(host.config, flag, defaultOn)}
              @change=${(event: Event) => host.toggle(flag, (event.target as HTMLInputElement).checked, defaultOn)}
            />
            <label for=${flag.replace(/_/g, '-')}>
              <ha-icon class="row-icon" icon=${meta.icon}></ha-icon>${localize(meta.labelKey)}
            </label>
          </div>
        `;
      })}
      <div class="description description-intro">${localize('editor.overview_sections_hint')}</div>

      ${host.config.show_agenda_section === true
        ? entityListField(host, 'agenda_calendar_entities', 'calendar.')
        : nothing}
      ${host.config.show_todos_section === true ? entityListField(host, 'todos_entities', 'todo.') : nothing}

      <div class="subsection-title">${localize('editor.hidden_section_headings')}</div>
      <div class="description description-intro">${localize('editor.hidden_section_headings_desc')}</div>
      ${HIDEABLE_HEADINGS.map((key) =>
        host.checkbox(
          `hide-heading-${key.replace(/_/g, '-')}`,
          localize(`sections.${key}`),
          hiddenHeadings.has(key),
          (checked) =>
            host.update((config) => {
              const next = new Set(config.hidden_section_headings || []);
              if (checked) next.add(key);
              else next.delete(key);
              if (next.size > 0) config.hidden_section_headings = [...next];
              else delete config.hidden_section_headings;
            })
        )
      )}
    </div>
  `;
}

export function renderAdvancedOptionsSection(host: OptionPanelHost): TemplateResult {
  return html`
    <div class="section">
      <div class="section-title">${localize('editor.section_advanced_options')}</div>
      ${toggleRow(host, 'hide_unavailable_entities')} ${toggleRow(host, 'dense_section_placement')}
      ${toggleRow(host, 'hide_completed_todos')}
    </div>
  `;
}
