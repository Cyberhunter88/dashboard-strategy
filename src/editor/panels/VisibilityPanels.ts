import { html, type TemplateResult } from 'lit';

import { SECTION_REGISTRY, isSectionHiddenByConfig } from '../../sections/section-registry';
import { localize } from '../../utils/localize';
import type { StrategyEditorHost } from '../editor-host';

export function renderRoomVisibilityPanel(host: StrategyEditorHost): TemplateResult {
  if (!host._hass) return html``;
  return html`<div class="section">
    <div class="section-title">${localize('editor.room_visibility')}</div>
    <div class="description" style="margin-left: 0;">${localize('editor.room_visibility_desc')}</div>
    ${host._getSortedAreas().map((area) => {
      const rule = host._config.room_visibility?.[area.area_id];
      return html`<div class="option-group">
        <div class="option-group-title">${area.name}</div>
        <div class="form-row">
          <ha-textfield label=${localize('editor.room_visibility_entity')} .value=${rule?.entity || ''}
            @change=${(event: Event) => roomVisibilityChanged(host, area.area_id, 'entity', (event.target as HTMLInputElement).value)}></ha-textfield>
          <ha-textfield label=${localize('editor.room_visibility_state')} .value=${rule?.state || ''}
            @change=${(event: Event) => roomVisibilityChanged(host, area.area_id, 'state', (event.target as HTMLInputElement).value)}></ha-textfield>
        </div>
      </div>`;
    })}
  </div>`;
}

function roomVisibilityChanged(host: StrategyEditorHost, areaId: string, field: 'entity' | 'state', value: string): void {
  const rules = { ...(host._config.room_visibility || {}) };
  const next = { entity: rules[areaId]?.entity || '', state: rules[areaId]?.state || '', [field]: value.trim() };
  if (next.entity || next.state) rules[areaId] = next;
  else delete rules[areaId];
  const updated = { ...host._config };
  if (Object.keys(rules).length > 0) updated.room_visibility = rules;
  else delete updated.room_visibility;
  host._fireConfigChanged(updated);
}

export function renderUserVisibilityPanel(host: StrategyEditorHost): TemplateResult {
  if (!host._hass) return html``;
  const users = Object.entries(host._hass.states)
    .filter(([id, state]) => id.startsWith('person.') && typeof state.attributes.user_id === 'string')
    .map(([id, state]) => ({ id: state.attributes.user_id as string, name: String(state.attributes.friendly_name || id) }))
    .sort((a, b) => a.name.localeCompare(b.name));
  if (users.length === 0) return html``;
  const views: [string, string][] = [
    ['home', localize('views.overview')], ['lights', localize('views.lights')], ['covers', localize('views.covers')],
    ['security', localize('views.security')], ['batteries', localize('views.batteries')], ['climate', localize('views.climate')],
    ['cctv', localize('views.cctv')], ['maintenance', localize('views.maintenance')],
    ...Object.values(host._hass.areas).map((area) => [area.area_id, area.name] as [string, string]),
    ...(host._config.custom_views || [])
      .filter((view) => (view.parsed_config || (view.ref_dashboard && view.ref_view)) && view.path && view.title)
      .map((view) => [view.path as string, view.title as string] as [string, string]),
  ];
  const sections: [string, string][] = SECTION_REGISTRY
    .filter((meta) => !isSectionHiddenByConfig(meta.key, host._config))
    .map((meta) => [meta.key, localize(meta.labelKey)]);
  for (const section of host._config.custom_sections || []) {
    if (section.id) sections.push([section.id, section.title || section.id]);
  }
  const rules = (kind: 'view' | 'section', options: [string, string][]) => options.map(([key, title]) => {
    const map = kind === 'view' ? host._config.view_visible_users : host._config.section_visible_users;
    const selected = Object.prototype.hasOwnProperty.call(map || {}, key) ? map?.[key] || [] : users.map((user) => user.id);
    return html`<div class="option-group"><div class="option-group-title">${title}</div>${users.map((user) =>
      host._renderCheckbox(`${kind}-${key}-${user.id}`, user.name, selected.includes(user.id), (checked) =>
        userVisibilityChanged(host, kind, key, user.id, users.map((entry) => entry.id), checked))
    )}</div>`;
  });
  return html`<div class="section"><div class="section-title">${localize('editor.user_visibility')}</div>
    <div class="description" style="margin-left: 0;">${localize('editor.user_visibility_warning')}</div>
    <div class="description" style="margin-left: 0; color: var(--warning-color, #ffa600);">
      ${localize('editor.user_visibility_no_person_warning')}
    </div>
    <div class="option-group-title">${localize('editor.user_visibility_views')}</div>${rules('view', views)}
    <div class="option-group-title">${localize('editor.user_visibility_sections')}</div>${rules('section', sections)}
  </div>`;
}

function userVisibilityChanged(host: StrategyEditorHost, kind: 'view' | 'section', key: string, userId: string, knownUsers: string[], checked: boolean): void {
  const current = { ...((kind === 'view' ? host._config.view_visible_users : host._config.section_visible_users) || {}) };
  const selected = new Set(Object.prototype.hasOwnProperty.call(current, key) ? current[key] : knownUsers);
  if (checked) selected.add(userId); else selected.delete(userId);
  if (knownUsers.every((id) => selected.has(id)) && [...selected].every((id) => knownUsers.includes(id))) delete current[key];
  else current[key] = [...selected];
  const updated = { ...host._config };
  if (kind === 'view') {
    if (Object.keys(current).length) updated.view_visible_users = current; else delete updated.view_visible_users;
  } else if (Object.keys(current).length) updated.section_visible_users = current; else delete updated.section_visible_users;
  host._fireConfigChanged(updated);
}
