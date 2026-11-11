// ====================================================================
// Summary panels — summary toggles and per-summary detail options
// ====================================================================

import { html, nothing, type TemplateResult } from 'lit';

import type { Simon42StrategyConfig } from '../../types/strategy';
import { localize } from '../../utils/localize';
import { getOptionDefault } from '../../utils/option-metadata';
import { DEFAULT_CO2_THRESHOLD, DEFAULT_HUMIDITY_THRESHOLD } from '../../views/ClimateAirQuality';
import { parseEntityList, toggleRow, type OptionPanelHost } from './option-panel-host';

type NumberOptionKey =
  | 'battery_critical_threshold'
  | 'battery_low_threshold'
  | 'climate_humidity_threshold'
  | 'climate_co2_threshold';

interface NumberRowOptions {
  id: string;
  label: string;
  defaultValue: number;
  min: number;
  max: number;
  unit: string;
}

/** Number input that ignores out-of-range values and drops the default from YAML. */
function numberRow(host: OptionPanelHost, key: NumberOptionKey, options: NumberRowOptions): TemplateResult {
  return html`
    <div class="form-row">
      <label for=${options.id} style="min-width: 140px;">${options.label}</label>
      <input
        type="number"
        id=${options.id}
        min=${options.min}
        max=${options.max}
        .value=${String(host.config[key] ?? options.defaultValue)}
        style="width: 80px;"
        @change=${(event: Event) => {
          const value = parseInt((event.target as HTMLInputElement).value, 10);
          if (isNaN(value) || value < options.min || value > options.max) return;
          host.setOption(key, value, options.defaultValue);
        }}
      />
      ${options.unit}
    </div>
  `;
}

function radioRow(id: string, name: string, label: string, checked: boolean, change: () => void): TemplateResult {
  return html`
    <div class="form-row">
      <input type="radio" id=${id} name=${name} ?checked=${checked} @change=${change} />
      <label for=${id}>${label}</label>
    </div>
  `;
}

function setOrDelete<K extends keyof Simon42StrategyConfig>(
  host: OptionPanelHost,
  key: K,
  value: Simon42StrategyConfig[K] | undefined
): void {
  host.update((config) => {
    if (value === undefined) delete config[key];
    else config[key] = value;
  });
}

export function renderBasicSummariesSection(host: OptionPanelHost): TemplateResult {
  const basic = { description: false } as const;
  return html`
    <div class="section">
      <div class="section-title">${localize('editor.section_summaries')}</div>
      ${toggleRow(host, 'show_light_summary', { ...basic, defaultOn: true, id: 'basic-show-light-summary' })}
      ${toggleRow(host, 'show_covers_summary', { ...basic, defaultOn: true, id: 'basic-show-covers-summary' })}
      ${toggleRow(host, 'show_security_summary', { ...basic, defaultOn: true, id: 'basic-show-security-summary' })}
      ${toggleRow(host, 'show_climate_summary', { ...basic, id: 'basic-show-climate-summary' })}
      ${toggleRow(host, 'show_battery_summary', { ...basic, defaultOn: true, id: 'basic-show-battery-summary' })}
      ${toggleRow(host, 'show_windows_summary')} ${toggleRow(host, 'compact_overview_summaries')}
    </div>
  `;
}

export function renderSummaryDetailsSection(host: OptionPanelHost): TemplateResult {
  const config = host.config;
  const summariesColumns = config.summaries_columns || 2;
  const unavailableBucket = config.unavailable_batteries_bucket === 'critical' ? 'critical' : 'good';
  const securityExtraEntities = config.security_extra_entities || [];
  // A view stays reachable without its summary only through the explicit view switch.
  const viewSwitch = (summaryShown: boolean, key: 'show_security_view' | 'show_light_view' | 'show_covers_view') =>
    summaryShown ? nothing : toggleRow(host, key);

  return html`
    <div class="section">
      <div class="section-title">${localize('editor.section_summary_details')}</div>

      ${radioRow('summaries-2-columns', 'summaries-columns', localize('editor.columns_2'), summariesColumns === 2, () =>
        setOrDelete(host, 'summaries_columns', undefined)
      )}
      ${radioRow('summaries-4-columns', 'summaries-columns', localize('editor.columns_4'), summariesColumns === 4, () =>
        setOrDelete(host, 'summaries_columns', 4)
      )}
      <div class="description">${localize('editor.columns_desc')}</div>

      <div class="subsection-title">${localize('editor.security_options')}</div>
      ${viewSwitch(config.show_security_summary !== false, 'show_security_view')}
      ${toggleRow(host, 'group_security_by_areas')} ${toggleRow(host, 'hide_hidden_areas_in_security')}
      ${toggleRow(host, 'show_security_activity')}
      <div class="form-row">
        <label for="security-activity-position">${localize('editor.security_activity_position')}</label>
        <select
          id="security-activity-position"
          @change=${(event: Event) =>
            setOrDelete(
              host,
              'security_activity_position',
              (event.target as HTMLSelectElement).value === 'end' ? 'end' : undefined
            )}
        >
          <option value="start" ?selected=${config.security_activity_position !== 'end'}>
            ${localize('editor.position_start')}
          </option>
          <option value="end" ?selected=${config.security_activity_position === 'end'}>
            ${localize('editor.position_end')}
          </option>
        </select>
      </div>
      <ha-textfield
        .value=${securityExtraEntities.join(', ')}
        label=${localize('editor.security_extra_entities')}
        @change=${(event: Event) => {
          const entities = parseEntityList((event.target as HTMLInputElement).value, (entry) => entry.includes('.'));
          setOrDelete(host, 'security_extra_entities', entities.length > 0 ? entities : undefined);
        }}
      ></ha-textfield>

      <div class="subsection-title">${localize('editor.lights_options')}</div>
      ${viewSwitch(config.show_light_summary !== false, 'show_light_view')} ${toggleRow(host, 'group_lights_by_floors')}
      ${toggleRow(host, 'group_lights_by_areas')} ${toggleRow(host, 'nested_light_groups')}
      ${host.checkbox(
        'lights-sort-by-name',
        localize('editor.lights_sort_by_name'),
        config.lights_sort_by === 'name',
        (checked) => setOrDelete(host, 'lights_sort_by', checked ? 'name' : undefined)
      )}
      <div class="description">${localize('editor.lights_sort_by_name_desc')}</div>

      <div class="subsection-title">${localize('editor.covers_options')}</div>
      ${viewSwitch(config.show_covers_summary !== false, 'show_covers_view')}
      ${toggleRow(host, 'group_covers_by_floors')} ${toggleRow(host, 'group_covers_by_areas')}
      ${toggleRow(host, 'show_partially_open_covers')}

      <div class="subsection-title">${localize('editor.climate_options')}</div>
      ${config.show_climate_summary === true ? nothing : toggleRow(host, 'show_climate_view')}
      ${toggleRow(host, 'show_climate_air_quality')}
      ${config.show_climate_air_quality === true
        ? html`
            ${numberRow(host, 'climate_humidity_threshold', {
              id: 'climate-humidity-threshold',
              label: localize('editor.climate_humidity_threshold'),
              defaultValue: DEFAULT_HUMIDITY_THRESHOLD,
              min: 1,
              max: 100,
              unit: '%',
            })}
            ${numberRow(host, 'climate_co2_threshold', {
              id: 'climate-co2-threshold',
              label: localize('editor.climate_co2_threshold'),
              defaultValue: DEFAULT_CO2_THRESHOLD,
              min: 400,
              max: 5000,
              unit: 'ppm',
            })}
          `
        : nothing}

      <div class="subsection-title">${localize('editor.battery_options')}</div>
      ${toggleRow(host, 'hide_mobile_app_batteries')} ${toggleRow(host, 'hide_battery_notes_entities')}
      ${config.show_battery_summary !== false ? nothing : toggleRow(host, 'show_battery_view')}
      ${toggleRow(host, 'show_area_in_battery_view')} ${toggleRow(host, 'group_batteries_by_areas')}

      <div class="option-group-title">${localize('editor.battery_thresholds')}</div>
      ${numberRow(host, 'battery_critical_threshold', {
        id: 'battery-critical-threshold',
        label: localize('editor.battery_critical_below'),
        defaultValue: getOptionDefault('battery_critical_threshold', config) as number,
        min: 1,
        max: 99,
        unit: '%',
      })}
      ${numberRow(host, 'battery_low_threshold', {
        id: 'battery-low-threshold',
        label: localize('editor.battery_low_below'),
        defaultValue: getOptionDefault('battery_low_threshold', config) as number,
        min: 1,
        max: 99,
        unit: '%',
      })}
      <div class="description">${localize('editor.battery_thresholds_desc')}</div>

      <div class="option-group-title">${localize('editor.unavailable_batteries_bucket')}</div>
      ${radioRow(
        'battery-unavailable-good',
        'battery-unavailable-bucket',
        localize('batteries.good'),
        unavailableBucket === 'good',
        () => setOrDelete(host, 'unavailable_batteries_bucket', undefined)
      )}
      ${radioRow(
        'battery-unavailable-critical',
        'battery-unavailable-bucket',
        localize('batteries.critical'),
        unavailableBucket === 'critical',
        () => setOrDelete(host, 'unavailable_batteries_bucket', 'critical')
      )}
      <div class="description">${localize('editor.unavailable_batteries_bucket_desc')}</div>
    </div>
  `;
}
