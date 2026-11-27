// ====================================================================
// Area options panel — area overview, room view and area management
// ====================================================================
// Config and expansion state stay in the editor host; this panel only
// renders the toggles and forwards changes through OptionPanelHost.
// ====================================================================

import { html, type TemplateResult } from 'lit';

import type { AreaDisplayType } from '../../types/strategy';
import { localize } from '../../utils/localize';
import { toggleRow, type OptionPanelHost } from './option-panel-host';

export function renderAreaOptionsPanel(
  host: OptionPanelHost,
  onAreaDisplayTypeChange: (displayType: AreaDisplayType) => void
): TemplateResult {
  const areaDisplayType = host.config.area_display_type ?? 'compact';

  return html`
    <div class="section">
      <div class="section-title">${localize('editor.section_areas')}</div>

      <div class="option-groups">
        <div class="option-group">
          <div class="option-group-title">
            <ha-icon icon="mdi:view-dashboard-outline"></ha-icon>
            <span>${localize('editor.area_overview_options')}</span>
          </div>
          ${toggleRow(host, 'group_by_floors')}

          <div class="form-row">
            <label for="area-display-type">${localize('editor.area_display_type')}</label>
            <select
              id="area-display-type"
              .value=${areaDisplayType}
              @change=${(event: Event) =>
                onAreaDisplayTypeChange((event.target as HTMLSelectElement).value as AreaDisplayType)}
            >
              <option value="compact">${localize('editor.area_display_type_compact')}</option>
              <option value="picture">${localize('editor.area_display_type_picture')}</option>
            </select>
          </div>
          <div class="description">${localize('editor.area_display_type_desc')}</div>

          ${toggleRow(host, 'show_switches_on_areas')} ${toggleRow(host, 'show_alerts_on_areas')}
        </div>

        <div class="option-group">
          <div class="option-group-title">
            <ha-icon icon="mdi:door-open"></ha-icon>
            <span>${localize('editor.room_view_options')}</span>
          </div>
          ${toggleRow(host, 'show_locks_in_rooms')} ${toggleRow(host, 'show_automations_in_rooms')}
          ${toggleRow(host, 'show_scripts_in_rooms')} ${toggleRow(host, 'show_vacuums_section_in_rooms')}
          ${toggleRow(host, 'show_switches_section_in_rooms')} ${toggleRow(host, 'show_helpers_section_in_rooms')}
          ${toggleRow(host, 'show_sensors_section_in_rooms')} ${toggleRow(host, 'show_cover_controls_in_rooms')}
          ${toggleRow(host, 'extended_tile_controls')} ${toggleRow(host, 'show_cameras_in_rooms', { defaultOn: true })}
          ${toggleRow(host, 'camera_live_toggle')} ${toggleRow(host, 'camera_pause_when_hidden')}
          ${toggleRow(host, 'show_energy_in_rooms', { defaultOn: true })}
          ${toggleRow(host, 'show_ups_in_rooms', { defaultOn: true })}
          ${toggleRow(host, 'hide_grouped_climate_members', { defaultOn: true })}
          ${toggleRow(host, 'show_window_contacts_in_rooms')} ${toggleRow(host, 'show_door_contacts_in_rooms')}
        </div>

        <div class="option-group">
          <div class="option-group-title">
            <ha-icon icon="mdi:sort-alphabetical-ascending"></ha-icon>
            <span>${localize('editor.area_management_options')}</span>
          </div>
          ${toggleRow(host, 'use_default_area_sort')}
        </div>
      </div>
    </div>
  `;
}
