import { html, nothing, type TemplateResult } from 'lit';
import type { HomeAssistant } from '../../types/homeassistant';
import type { AreaRegistryEntry } from '../../types/registries';
import type { CustomView, Simon42StrategyConfig } from '../../types/strategy';
import { localize } from '../../utils/localize';
import { isUtilityViewEnabled } from '../../utils/summary-view-utils';

export interface RefDashboardOption {
  url_path: string;
  title: string;
  views: Array<{ path?: string; title?: string; icon?: string; index: number }>;
}

/** Typed facade: configuration state and config events stay owned by the editor host. */
export interface CustomViewsPanelHost {
  readonly _config: Simon42StrategyConfig;
  readonly _hass: HomeAssistant | null;
  readonly _refDashboards: RefDashboardOption[] | null;
  _getSortedAreas(): AreaRegistryEntry[];
  _addCustomView(): void;
  _addCustomRefView(): void;
  _loadRefDashboards(): Promise<void>;
  _refDashboardChanged(index: number, urlPath: string): void;
  _refViewChanged(index: number, refView: string): void;
  _removeCustomView(index: number): void;
  _updateCustomViewField(index: number, field: string, value: string): void;
  _updateCustomViewAfterView(index: number, value: string): void;
  _updateCustomViewYaml(index: number, yamlString: string): void;
}

export function renderCustomViewsPanel(host: CustomViewsPanelHost, nested = false): TemplateResult {
  const customViews = host._config.custom_views || [];

  return html`
    <div class=${nested ? 'editor-subsection' : 'section'}>
      <div class=${nested ? 'subsection-title' : 'section-title'} style="display: flex; align-items: center; gap: 8px;">
        ${localize('editor.section_custom_views')}
        <a
          href="https://github.com/Cyberhunter88/dashboard-strategy/blob/main/assets/Custom-View-hinzufugen.gif"
          target="_blank"
          rel="noopener"
          style="color: var(--primary-color); text-decoration: none; font-size: 18px;"
          title=${localize('editor.video_tutorial')}
          >&#x1F3AC;</a
        >
      </div>

      <div id="custom-views-list">
        ${customViews.length === 0
          ? html`<div class="empty-state">${localize('editor.no_custom_views')}</div>`
          : customViews.map((view, index) => renderCustomViewItem(host, view, index))}
      </div>

      <div class="custom-item-row" style="margin-top: 8px;">
        <button class="btn-primary" @click=${host._addCustomView}>
          ${localize('editor.add_custom_view')} <ha-icon icon="mdi:code-braces"></ha-icon>
        </button>
        <button class="btn-primary" @click=${host._addCustomRefView}>
          ${localize('editor.add_custom_view_ref')} <ha-icon icon="mdi:link-variant"></ha-icon>
        </button>
      </div>
      <div class="description">${localize('editor.custom_views_help')}</div>
      <div class="description">${localize('editor.custom_views_ref_help')}</div>
    </div>
  `;
}

function renderCustomViewItem(host: CustomViewsPanelHost, view: CustomView, index: number): TemplateResult {
  const isReference = view.ref_dashboard !== undefined;
  const validationMsg = view._yaml_error
    ? html`<span style="color: var(--error-color);">&#x274C; ${view._yaml_error}</span>`
    : view.yaml
      ? html`<span style="color: var(--success-color, green);">&#x2705; ${localize('editor.yaml_valid')}</span>`
      : nothing;

  return html`
    <div class="custom-item" data-index=${index}>
      <div class="custom-item-header">
        <strong>${view.title || localize('editor.new_view')}</strong>
        <button class="btn-remove" @click=${() => host._removeCustomView(index)}>&#x2715;</button>
      </div>
      <div class="custom-item-fields">
        <div class="custom-item-row">
          <input
            type="text"
            .value=${view.title || ''}
            placeholder=${localize('editor.title_placeholder')}
            style="flex: 2;"
            @change=${(e: Event) => host._updateCustomViewField(index, 'title', (e.target as HTMLInputElement).value)}
          />
          <input
            type="text"
            .value=${view.path || ''}
            placeholder=${localize('editor.path_placeholder')}
            style="flex: 2;"
            @change=${(e: Event) => host._updateCustomViewField(index, 'path', (e.target as HTMLInputElement).value)}
          />
          <input
            type="text"
            .value=${view.icon || ''}
            placeholder="mdi:star"
            style="flex: 1;"
            @change=${(e: Event) => host._updateCustomViewField(index, 'icon', (e.target as HTMLInputElement).value)}
          />
        </div>
        ${renderCustomViewPosition(host, view, index)}
        ${isReference
          ? renderCustomViewRefFields(host, view, index)
          : html`<textarea
                rows="8"
                placeholder=${localize('editor.yaml_placeholder')}
                .value=${view.yaml || ''}
                style="width: 100%;"
                @change=${(e: Event) => host._updateCustomViewYaml(index, (e.target as HTMLTextAreaElement).value)}
              ></textarea>
              <div class="custom-item-validation">${validationMsg}</div>`}
      </div>
    </div>
  `;
}

function renderCustomViewPosition(host: CustomViewsPanelHost, view: CustomView, index: number): TemplateResult {
  const options = getGeneratedViewOptions(host, index);
  const orphaned = !!view.after_view && !options.some(([path]) => path === view.after_view);
  return html`
    <div class="custom-item-row">
      <select
        style="flex: 1;"
        @change=${(event: Event) => host._updateCustomViewAfterView(index, (event.target as HTMLSelectElement).value)}
      >
        <option value="" ?selected=${!view.after_view}>${localize('editor.custom_view_position_end')}</option>
        ${orphaned
          ? html`<option value=${view.after_view || ''} selected>
              &#x26A0; ${localize('editor.custom_view_position_after')} ${view.after_view}
            </option>`
          : nothing}
        ${options.map(
          ([path, title]) => html`
            <option value=${path} ?selected=${view.after_view === path}>
              ${localize('editor.custom_view_position_after')} ${title}
            </option>
          `
        )}
      </select>
    </div>
  `;
}

function getGeneratedViewOptions(host: CustomViewsPanelHost, excludeCustomViewIndex: number): Array<[string, string]> {
  if (!host._hass) return [];
  const options: Array<[string, string]> = [['home', localize('views.overview')]];
  const add = (enabled: boolean, path: string, titleKey: string): void => {
    if (enabled) options.push([path, localize(titleKey)]);
  };

  add(isUtilityViewEnabled(host._config, 'lights'), 'lights', 'views.lights');
  add(isUtilityViewEnabled(host._config, 'covers'), 'covers', 'views.covers');
  add(isUtilityViewEnabled(host._config, 'security'), 'security', 'views.security');
  add(isUtilityViewEnabled(host._config, 'batteries'), 'batteries', 'views.batteries');
  add(isUtilityViewEnabled(host._config, 'climate'), 'climate', 'views.climate');
  add(host._config.show_cctv_view === true, 'cctv', 'views.cctv');
  add(host._config.show_maintenance_view !== false, 'maintenance', 'views.maintenance');

  const hiddenAreas = new Set(host._config.areas_display?.hidden || []);
  for (const area of host._getSortedAreas()) {
    if (hiddenAreas.has(area.area_id)) continue;
    const rule = host._config.room_visibility?.[area.area_id];
    if (rule?.entity && host._hass.states[rule.entity]?.state !== rule.state) continue;
    options.push([area.area_id, area.name]);
  }

  for (const [customIndex, customView] of (host._config.custom_views || []).entries()) {
    if (customIndex === excludeCustomViewIndex) continue;
    const complete = customView.parsed_config || (customView.ref_dashboard && customView.ref_view);
    if (complete && customView.path && customView.title) options.push([customView.path, customView.title]);
  }
  return options;
}

function renderCustomViewRefFields(host: CustomViewsPanelHost, view: CustomView, index: number): TemplateResult {
  if (host._refDashboards === null) {
    void host._loadRefDashboards();
    return html`<div class="description">${localize('editor.ref_loading')}</div>`;
  }
  if (host._refDashboards.length === 0) {
    return html`<div class="custom-item-validation" style="color: var(--error-color);">
      ${localize('editor.ref_no_dashboards')}
    </div>`;
  }
  const selected = host._refDashboards.find((dashboard) => dashboard.url_path === view.ref_dashboard);
  const orphaned = !!view.ref_dashboard && !selected;
  return html` <div class="custom-item-row">
      <select
        style="flex: 1;"
        @change=${(e: Event) => host._refDashboardChanged(index, (e.target as HTMLSelectElement).value)}
      >
        <option value="" ?selected=${!view.ref_dashboard} disabled>${localize('editor.ref_select_dashboard')}</option>
        ${orphaned ? html`<option value=${view.ref_dashboard || ''} selected>${view.ref_dashboard}</option>` : nothing}
        ${host._refDashboards.map(
          (dashboard) =>
            html` <option value=${dashboard.url_path} ?selected=${dashboard.url_path === view.ref_dashboard}>
              ${dashboard.title}
            </option>`
        )}
      </select>
      <select
        style="flex: 1;"
        ?disabled=${!selected}
        @change=${(e: Event) => host._refViewChanged(index, (e.target as HTMLSelectElement).value)}
      >
        <option value="" ?selected=${!view.ref_view} disabled>${localize('editor.ref_select_view')}</option>
        ${(selected?.views || []).map((sourceView) => {
          const value = sourceView.path ?? String(sourceView.index);
          const label = `${sourceView.title || `${localize('editor.ref_view_untitled')} ${sourceView.index + 1}`}${
            sourceView.path ? ` (${sourceView.path})` : ''
          }`;
          return html`<option value=${value} ?selected=${value === view.ref_view}>${label}</option>`;
        })}
      </select>
    </div>
    <div class="custom-item-validation">
      ${orphaned
        ? html`<span style="color: var(--error-color);">${localize('editor.ref_dashboard_missing')}</span>`
        : view.ref_dashboard && view.ref_view
          ? html`<span style="color: var(--success-color, green);">${localize('editor.ref_valid')}</span>`
          : localize('editor.ref_incomplete')}
    </div>`;
}
