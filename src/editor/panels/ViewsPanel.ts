import { html, type TemplateResult } from 'lit';
import { localize } from '../../utils/localize';

export interface ViewsPanelOptions {
  showSummaryViews: boolean;
  showRoomViews: boolean;
  showCctvView: boolean;
  cctvShowActivity: boolean;
  showMaintenanceView: boolean;
  checkbox: (id: string, label: string, checked: boolean, change: (checked: boolean) => void) => TemplateResult;
  change: (key: string, checked: boolean) => void;
}

export function renderViewsPanel(options: ViewsPanelOptions): TemplateResult {
  const row = (id: string, key: string, checked: boolean): TemplateResult => html`
    ${options.checkbox(id, localize(`editor.${key}`), checked, (value) => options.change(key, value))}
    <div class="description">${localize(`editor.${key}_desc`)}</div>
  `;
  return html`<div class="section">
    <div class="section-title">${localize('editor.section_views')}</div>
    ${row('show-summary-views', 'show_summary_views', options.showSummaryViews)}
    ${row('show-room-views', 'show_room_views', options.showRoomViews)}
    ${row('show-cctv-view', 'show_cctv_view', options.showCctvView)}
    ${row('cctv-show-activity', 'cctv_show_activity', options.cctvShowActivity)}
    ${row('show-maintenance-view', 'show_maintenance_view', options.showMaintenanceView)}
  </div>`;
}
