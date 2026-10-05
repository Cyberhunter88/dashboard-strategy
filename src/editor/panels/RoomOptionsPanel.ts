import { html, nothing, type TemplateResult } from 'lit';
import type { AreaRegistryEntry } from '../../types/registries';
import type { AreaCustomCard, AreaDisplayType, Simon42StrategyConfig } from '../../types/strategy';
import { resolveShowName } from '../../utils/badge-utils';
import { localize } from '../../utils/localize';
import type { Simon42DashboardStrategyEditor } from '../StrategyEditor';
import { parseEditorYamlConfig } from '../editor-yaml';
type PanelHost = ReturnType<Simon42DashboardStrategyEditor['createRoomOptionsHost']>;

interface DomainGroup {
  key: string;
  label: string;
  icon: string;
}

export function renderAreaItems(
  host: PanelHost,
  allAreas: AreaRegistryEntry[],
  hiddenAreas: string[],
  areaOrder: string[],
  navItems: string[]
): TemplateResult | TemplateResult[] {
  if (allAreas.length === 0) {
    return html`<div class="empty-state">${localize('editor.no_areas')}</div>`;
  }

  // Sort areas by configured order
  const areaOrderMap = new Map(areaOrder.map((areaId, index) => [areaId, index]));
  const originalIndexMap = new Map(allAreas.map((area, index) => [area.area_id, index]));
  const sortedAreas = [...allAreas].sort((a, b) => {
    const orderA = areaOrderMap.get(a.area_id);
    const orderB = areaOrderMap.get(b.area_id);
    const effectiveA = orderA !== undefined ? orderA : 9999 + (originalIndexMap.get(a.area_id) ?? 0);
    const effectiveB = orderB !== undefined ? orderB : 9999 + (originalIndexMap.get(b.area_id) ?? 0);
    return effectiveA - effectiveB;
  });

  return sortedAreas.map((area) => {
    const isHidden = hiddenAreas.includes(area.area_id);
    const isExpanded = host._expandedAreas.has(area.area_id);
    const cachedData = host._areaEntitiesCache.get(area.area_id);
    const isPinned = navItems.includes(area.area_id);

    return html`
      <div
        class="area-item"
        data-area-id=${area.area_id}
        draggable="true"
        @dragstart=${host._handleDragStart}
        @dragend=${host._handleDragEnd}
        @dragover=${host._handleDragOver}
        @dragleave=${host._handleDragLeave}
        @drop=${host._handleDrop}
      >
        <div class="area-header">
          <span class="drag-handle" draggable="true">&#x2630;</span>
          <input
            type="checkbox"
            class="area-checkbox"
            data-area-id=${area.area_id}
            ?checked=${!isHidden}
            @change=${(e: Event) => host._areaVisibilityChanged(area.area_id, (e.target as HTMLInputElement).checked)}
          />
          <span class="area-name">${area.name}</span>
          ${host._config.areas_options?.[area.area_id]?.view_override?.yaml
            ? html`<button
                type="button"
                title=${localize('editor.override_active_help')}
                @click=${() => void host._openDiagnosticLocation(`areas_options.${area.area_id}.view_override`)}
              >
                ${localize('editor.override_active')}
              </button>`
            : nothing}
          ${area.icon ? html`<ha-icon class="area-icon" icon=${area.icon}></ha-icon>` : nothing}
          <button
            class="nav-pin-button ${isPinned ? 'pinned' : ''}"
            title="${localize('editor.area_pin_nav')}"
            ?disabled=${isHidden}
            @click=${(e: Event) => {
              e.stopPropagation();
              host._areaNavPinChanged(area.area_id, !isPinned);
            }}
          >
            <ha-icon icon="${isPinned ? 'mdi:pin' : 'mdi:pin-outline'}"></ha-icon>
          </button>
          <button
            class="expand-button ${isExpanded ? 'expanded' : ''}"
            data-area-id=${area.area_id}
            @click=${(e: Event) => host._toggleAreaExpand(e, area.area_id)}
          >
            <span class="expand-icon">&#x25B6;</span>
          </button>
        </div>
        ${isExpanded
          ? html`
              <div class="area-content" data-area-id=${area.area_id}>
                ${host._renderAreaDisplayTypeOverride(area)} ${host._renderAreaViewOverride(area.area_id)}
                ${cachedData
                  ? host._renderAreaEntities(area.area_id, cachedData)
                  : html`<div class="loading-placeholder">${localize('editor.loading_entities')}</div>`}
              </div>
            `
          : nothing}
      </div>
    `;
  });
}

export function renderAreaDisplayTypeOverride(host: PanelHost, area: AreaRegistryEntry): TemplateResult {
  const override = host._config.areas_options?.[area.area_id]?.display_type ?? '';
  return html`
    <div class="form-row">
      <label for="area-display-type-${area.area_id}">${localize('editor.area_display_type_override')}</label>
      <select
        id="area-display-type-${area.area_id}"
        .value=${override}
        @change=${(event: Event) =>
          host._areaDisplayTypeOverrideChanged(
            area.area_id,
            (event.target as HTMLSelectElement).value as AreaDisplayType | ''
          )}
      >
        <option value="">${localize('editor.area_display_type_inherit')}</option>
        <option value="compact">${localize('editor.area_display_type_compact')}</option>
        <option value="picture">${localize('editor.area_display_type_picture')}</option>
      </select>
    </div>
    ${!area.picture ? html`<div class="description">${localize('editor.area_display_type_no_picture')}</div>` : nothing}
  `;
}

export function renderAreaViewOverride(host: PanelHost, areaId: string): TemplateResult {
  const override = host._config.areas_options?.[areaId]?.view_override;
  const validation = override?._yaml_error
    ? html`<span style="color: var(--error-color);">&#x274C; ${override._yaml_error}</span>`
    : override?.parsed_config
      ? html`<span style="color: var(--success-color, green);">&#x2705; ${localize('editor.yaml_valid')}</span>`
      : nothing;

  return html`
    <div class="custom-item" style="margin-bottom: 0;">
      <div class="custom-item-header">
        <strong>${localize('editor.area_view_override_title')}</strong>
        ${override?.yaml
          ? html`
              <button
                class="btn-remove"
                title=${localize('editor.area_view_override_remove')}
                @click=${() => host._updateAreaViewOverride(areaId, '')}
              >
                &#x2715;
              </button>
            `
          : nothing}
      </div>
      <div class="description" style="margin: 0 0 10px 0;">${localize('editor.area_view_override_help')}</div>
      <textarea
        rows="12"
        placeholder="type: sections&#10;sections:&#10;  - type: grid&#10;    cards: []"
        .value=${override?.yaml || ''}
        style="width: 100%;"
        @change=${(e: Event) => host._updateAreaViewOverride(areaId, (e.target as HTMLTextAreaElement).value)}
      >
      </textarea>
      <div class="custom-item-validation">${validation}</div>
    </div>
  `;
}

export function renderAreaEntities(
  host: PanelHost,
  areaId: string,
  data: NonNullable<ReturnType<typeof host._areaEntitiesCache.get>>
): TemplateResult {
  const {
    groupedEntities,
    hiddenEntities,
    badgeCandidates,
    additionalBadges,
    availableEntities,
    defaultShowNames,
    namesVisible,
    namesHidden,
  } = data;

  const hass = host._hass!;

  const domainGroups: DomainGroup[] = [
    { key: 'ups', label: localize('stacks.ups'), icon: 'mdi:power-plug-battery' },
    { key: 'lights', label: localize('editor.domain_lights'), icon: 'mdi:lightbulb' },
    { key: 'climate', label: localize('editor.domain_climate'), icon: 'mdi:thermostat' },
    { key: 'covers', label: localize('editor.domain_covers'), icon: 'mdi:window-shutter' },
    { key: 'covers_curtain', label: localize('editor.domain_covers_curtain'), icon: 'mdi:curtains' },
    { key: 'covers_window', label: localize('editor.domain_covers_window'), icon: 'mdi:window-open-variant' },
    { key: 'media_player', label: localize('editor.domain_media_player'), icon: 'mdi:speaker' },
    { key: 'scenes', label: localize('editor.domain_scenes'), icon: 'mdi:palette' },
    { key: 'vacuum', label: localize('editor.domain_vacuum'), icon: 'mdi:robot-vacuum' },
    { key: 'fan', label: localize('editor.domain_fan'), icon: 'mdi:fan' },
    { key: 'switches', label: localize('editor.domain_switches'), icon: 'mdi:light-switch' },
    { key: 'locks', label: localize('editor.domain_locks'), icon: 'mdi:lock' },
    { key: 'energy', label: localize('stacks.energy'), icon: 'mdi:lightning-bolt' },
  ];

  const hasEntities = domainGroups.some((g) => (groupedEntities[g.key]?.length ?? 0) > 0);
  const hasBadges = (badgeCandidates?.length ?? 0) > 0 || (additionalBadges?.length ?? 0) > 0;

  // Build a deduplicated entity list for the guided tile picker (all area entities)
  const areaPickerEntities: Array<{ entity_id: string; name: string }> = [];
  const seenPickerEntities = new Set<string>();
  const pushPickerEntity = (entityId: string): void => {
    if (!entityId || seenPickerEntities.has(entityId)) return;
    seenPickerEntities.add(entityId);
    const stateObj = hass.states[entityId];
    const name = stateObj?.attributes.friendly_name || entityId.split('.')[1]?.replace(/_/g, ' ') || entityId;
    areaPickerEntities.push({ entity_id: entityId, name });
  };
  for (const group of domainGroups) {
    for (const entityId of (groupedEntities[group.key] as string[] | undefined) || []) {
      pushPickerEntity(entityId);
    }
  }
  for (const entityId of badgeCandidates || []) pushPickerEntity(entityId);
  for (const entityId of additionalBadges || []) pushPickerEntity(entityId);
  for (const e of availableEntities || []) pushPickerEntity(e.entity_id);
  areaPickerEntities.sort((a, b) => a.name.localeCompare(b.name));

  const customCardsSection = host._renderAreaCustomCardsSection(areaId, areaPickerEntities);
  if (!hasEntities && !hasBadges) {
    return html`
      <div class="empty-state">${localize('editor.no_entities_in_area')}</div>
      ${host._renderStackOrderPanel(areaId, data)} ${customCardsSection}
    `;
  }

  const expandedGroups = host._expandedGroups.get(areaId) || new Set<string>();

  return html`
    <div class="entity-groups">
      ${domainGroups.map((group) => {
        const entities = groupedEntities[group.key] as string[] | undefined;
        if (!entities || entities.length === 0) return nothing;

        const hiddenInGroup = (hiddenEntities[group.key] || []) as string[];
        const allHidden = entities.every((e) => hiddenInGroup.includes(e));
        const someHidden = entities.some((e) => hiddenInGroup.includes(e)) && !allHidden;
        const isGroupExpanded = expandedGroups.has(group.key);

        return html`
          <div class="entity-group" data-group=${group.key}>
            <div class="entity-group-header" @click=${() => host._toggleGroupExpand(areaId, group.key)}>
              <input
                type="checkbox"
                class="group-checkbox"
                data-area-id=${areaId}
                data-group=${group.key}
                ?checked=${!allHidden}
                .indeterminate=${someHidden}
                @click=${(e: Event) => e.stopPropagation()}
                @change=${(e: Event) => {
                  e.stopPropagation();
                  const checked = (e.target as HTMLInputElement).checked;
                  host._groupVisibilityChanged(areaId, group.key, checked, entities);
                }}
              />
              <ha-icon icon=${group.icon}></ha-icon>
              <span class="group-name">${group.label}</span>
              <span class="entity-count">(${entities.length})</span>
              <button
                class="expand-button-small ${isGroupExpanded ? 'expanded' : ''}"
                @click=${(e: Event) => {
                  e.stopPropagation();
                  host._toggleGroupExpand(areaId, group.key);
                }}
              >
                <span class="expand-icon-small">&#x25B6;</span>
              </button>
            </div>
            ${isGroupExpanded
              ? html`
                  <div class="entity-list" data-area-id=${areaId} data-group=${group.key}>
                    ${entities.map((entityId) => {
                      const stateObj = hass.states[entityId];
                      const name = stateObj?.attributes.friendly_name || entityId.split('.')[1].replace(/_/g, ' ');
                      const isEntityHidden = hiddenInGroup.includes(entityId);
                      return html`
                        <div class="entity-item">
                          <input
                            type="checkbox"
                            class="entity-checkbox"
                            ?checked=${!isEntityHidden}
                            @change=${(e: Event) =>
                              host._entityVisibilityChanged(
                                areaId,
                                group.key,
                                entityId,
                                (e.target as HTMLInputElement).checked
                              )}
                          />
                          <span class="entity-name">${name}</span>
                          <span class="entity-id">${entityId}</span>
                        </div>
                      `;
                    })}
                  </div>
                `
              : nothing}
          </div>
        `;
      })}
      ${hasBadges
        ? host._renderBadgeGroup(
            areaId,
            badgeCandidates,
            additionalBadges,
            availableEntities,
            hiddenEntities,
            defaultShowNames,
            namesVisible,
            namesHidden,
            expandedGroups
          )
        : nothing}
      ${host._renderStackOrderPanel(areaId, data)}
    </div>
    ${customCardsSection}
  `;
}

export function renderAreaCustomCardItem(
  host: PanelHost,
  areaId: string,
  card: AreaCustomCard,
  index: number,
  availableEntities: Array<{ entity_id: string; name: string }>
): TemplateResult {
  const mode = card.mode || 'yaml';
  const position = card.position || 'bottom';

  const validationMsg = card._yaml_error
    ? html`<span style="color: var(--error-color);">&#x274C; ${card._yaml_error}</span>`
    : card.yaml
      ? html`<span style="color: var(--success-color, green);">&#x2705; ${localize('editor.yaml_valid')}</span>`
      : nothing;

  return html`
    <div class="custom-item" data-index=${index}>
      <div class="custom-item-header">
        <strong>${host._getCustomCardEditorLabel(card, localize('editor.area_custom_card_new'))}</strong>
        <button class="btn-remove" @click=${() => host._removeAreaCustomCard(areaId, index)}>&#x2715;</button>
      </div>
      <div class="custom-item-fields">
        <label>${localize('editor.card_editor_title_label')}</label>
        <input
          type="text"
          .value=${card.editor_title || ''}
          placeholder=${localize('editor.card_editor_title_placeholder')}
          @change=${(e: Event) =>
            host._updateAreaCustomCardField(areaId, index, 'editor_title', (e.target as HTMLInputElement).value)}
        />
        <div class="description" style="margin: 0 0 4px 0;">${localize('editor.card_editor_title_help')}</div>
        <label>${localize('editor.card_dashboard_title_label')}</label>
        <input
          type="text"
          .value=${card.title || ''}
          placeholder=${localize('editor.card_title_placeholder')}
          @change=${(e: Event) =>
            host._updateAreaCustomCardField(areaId, index, 'title', (e.target as HTMLInputElement).value)}
        />
        <div class="custom-card-target">
          <label>${localize('editor.area_custom_card_position')}:</label>
          <select
            @change=${(e: Event) =>
              host._updateAreaCustomCardField(areaId, index, 'position', (e.target as HTMLSelectElement).value)}
          >
            <option value="top" ?selected=${position === 'top'}>
              ${localize('editor.area_custom_card_position_top')}
            </option>
            <option value="bottom" ?selected=${position === 'bottom'}>
              ${localize('editor.area_custom_card_position_bottom')}
            </option>
          </select>
        </div>
        <div class="custom-card-target">
          <label>${localize('editor.area_custom_card_mode')}:</label>
          <select
            @change=${(e: Event) =>
              host._updateAreaCustomCardField(areaId, index, 'mode', (e.target as HTMLSelectElement).value)}
          >
            <option value="yaml" ?selected=${mode === 'yaml'}>${localize('editor.area_custom_card_mode_yaml')}</option>
            <option value="tile" ?selected=${mode === 'tile'}>${localize('editor.area_custom_card_mode_tile')}</option>
            <option value="section" ?selected=${mode === 'section'}>
              ${localize('editor.area_custom_card_mode_section')}
            </option>
          </select>
        </div>
        ${mode === 'tile'
          ? html`
              <div class="custom-card-target">
                <label>${localize('editor.area_custom_card_entity')}:</label>
                <select
                  @change=${(e: Event) =>
                    host._updateAreaCustomCardField(areaId, index, 'entity', (e.target as HTMLSelectElement).value)}
                >
                  <option value="">${localize('editor.area_custom_card_entity_select')}</option>
                  ${availableEntities.map(
                    (e) => html`
                      <option value=${e.entity_id} ?selected=${card.entity === e.entity_id}>
                        ${e.name} (${e.entity_id})
                      </option>
                    `
                  )}
                </select>
              </div>
            `
          : html`
              <textarea
                rows="6"
                placeholder=${localize('editor.yaml_placeholder')}
                .value=${card.yaml || ''}
                style="width: 100%;"
                @change=${(e: Event) =>
                  host._updateAreaCustomCardYaml(areaId, index, (e.target as HTMLTextAreaElement).value)}
              ></textarea>
              <button
                class="btn-primary"
                style="margin-top: 6px;"
                @click=${() => host._openCardEditorForAreaCustomCard(areaId, index)}
              >
                ${localize('editor.edit_card_with_ha_editor')}
              </button>
              <div class="custom-item-validation">${validationMsg}</div>
            `}
      </div>
    </div>
  `;
}

export function renderAreaCustomCardsSection(
  host: PanelHost,
  areaId: string,
  availableEntities: Array<{ entity_id: string; name: string }>
): TemplateResult {
  const cards = host._getAreaCustomCards(areaId);

  return html`
    <div class="area-custom-cards">
      <div class="area-custom-cards-header">
        <ha-icon icon="mdi:card-plus-outline"></ha-icon>
        <span class="group-name">${localize('editor.area_custom_cards_title')}</span>
      </div>
      <div class="area-custom-cards-help">${localize('editor.area_custom_cards_help')}</div>
      ${cards.length === 0
        ? nothing
        : cards.map((card, index) => host._renderAreaCustomCardItem(areaId, card, index, availableEntities))}
      <div class="area-custom-card-actions">
        <button class="btn-primary" @click=${() => host._addAreaCustomCard(areaId)}>
          ${localize('editor.area_custom_card_add_yaml')}
        </button>
        <button class="btn-primary" @click=${() => host._openCardPickerForAreaCustomCard(areaId)}>
          ${localize('editor.area_custom_card_add_picker')}
        </button>
      </div>
    </div>
  `;
}

export function renderBadgeGroup(
  host: PanelHost,
  areaId: string,
  badgeCandidates: string[],
  additionalBadges: string[],
  availableEntities: Array<{ entity_id: string; name: string }>,
  hiddenEntities: Record<string, string[]>,
  defaultShowNames: Set<string>,
  namesVisible: string[],
  namesHidden: string[],
  expandedGroups: Set<string>
): TemplateResult {
  const hass = host._hass!;
  const totalCount = badgeCandidates.length + additionalBadges.length;
  if (totalCount === 0) return html``;

  const hiddenInBadges = hiddenEntities['badges'] || [];
  const allHidden = badgeCandidates.length > 0 && badgeCandidates.every((e) => hiddenInBadges.includes(e));
  const someHidden = badgeCandidates.some((e) => hiddenInBadges.includes(e)) && !allHidden;

  const namesVisibleSet = new Set(namesVisible || []);
  const namesHiddenSet = new Set(namesHidden || []);

  const isNameShown = (entityId: string): boolean =>
    resolveShowName(entityId, defaultShowNames.has(entityId), namesVisibleSet, namesHiddenSet);

  const isGroupExpanded = expandedGroups.has('badges');

  return html`
    <div class="entity-group" data-group="badges">
      <div class="entity-group-header" @click=${() => host._toggleGroupExpand(areaId, 'badges')}>
        <input
          type="checkbox"
          class="group-checkbox"
          data-area-id=${areaId}
          data-group="badges"
          ?checked=${!allHidden}
          .indeterminate=${someHidden}
          @click=${(e: Event) => e.stopPropagation()}
          @change=${(e: Event) => {
            e.stopPropagation();
            const checked = (e.target as HTMLInputElement).checked;
            host._groupVisibilityChanged(areaId, 'badges', checked, badgeCandidates);
          }}
        />
        <ha-icon icon="mdi:checkbox-multiple-blank-circle"></ha-icon>
        <span class="group-name">${localize('editor.domain_badges')}</span>
        <span class="entity-count">(${totalCount})</span>
        <button
          class="expand-button-small ${isGroupExpanded ? 'expanded' : ''}"
          @click=${(e: Event) => {
            e.stopPropagation();
            host._toggleGroupExpand(areaId, 'badges');
          }}
        >
          <span class="expand-icon-small">&#x25B6;</span>
        </button>
      </div>
      ${isGroupExpanded
        ? html`
            <div class="entity-list" data-area-id=${areaId} data-group="badges">
              ${badgeCandidates.map((entityId) => {
                const stateObj = hass.states[entityId];
                const name = stateObj?.attributes.friendly_name || entityId.split('.')[1].replace(/_/g, ' ');
                const isHidden = hiddenInBadges.includes(entityId);
                const showName = isNameShown(entityId);

                return html`
                  <div class="entity-item">
                    <input
                      type="checkbox"
                      class="entity-checkbox"
                      ?checked=${!isHidden}
                      @change=${(e: Event) =>
                        host._entityVisibilityChanged(
                          areaId,
                          'badges',
                          entityId,
                          (e.target as HTMLInputElement).checked
                        )}
                    />
                    <span class="entity-name">${name}</span>
                    <input
                      type="checkbox"
                      class="badge-name-checkbox"
                      ?checked=${showName}
                      title=${localize('editor.badges_show_name')}
                      @change=${(e: Event) =>
                        host._badgeShowNameChanged(areaId, entityId, (e.target as HTMLInputElement).checked)}
                    />
                    <span class="badge-name-label">${localize('editor.badges_name_short')}</span>
                    <span class="entity-id">${entityId}</span>
                  </div>
                `;
              })}
              ${additionalBadges.length > 0
                ? html`
                    <div class="badge-separator">${localize('editor.badges_additional')}</div>
                    ${additionalBadges.map((entityId) => {
                      const stateObj = hass.states[entityId];
                      const name = stateObj?.attributes.friendly_name || entityId.split('.')[1].replace(/_/g, ' ');
                      const showName = isNameShown(entityId);

                      return html`
                        <div class="entity-item badge-additional-item">
                          <span class="entity-name">${name}</span>
                          <input
                            type="checkbox"
                            class="badge-name-checkbox"
                            ?checked=${showName}
                            title=${localize('editor.badges_show_name')}
                            @change=${(e: Event) =>
                              host._badgeShowNameChanged(areaId, entityId, (e.target as HTMLInputElement).checked)}
                          />
                          <span class="badge-name-label">${localize('editor.badges_name_short')}</span>
                          <span class="entity-id">${entityId}</span>
                          <button
                            class="badge-remove-btn"
                            title=${localize('editor.badges_remove')}
                            @click=${() => host._badgeAdditionalChanged(areaId, entityId, false)}
                          >
                            &#x2715;
                          </button>
                        </div>
                      `;
                    })}
                  `
                : nothing}
              ${availableEntities.length > 0
                ? html`
                    <div class="badge-add-section">
                      <select class="badge-entity-picker" data-area-id=${areaId}>
                        <option value="">${localize('editor.badges_select_entity')}</option>
                        ${availableEntities.map(
                          (e) => html` <option value=${e.entity_id}>${e.name} (${e.entity_id})</option> `
                        )}
                      </select>
                      <button class="badge-add-button" @click=${(e: Event) => host._addBadgeFromPicker(e, areaId)}>
                        ${localize('editor.badges_add')}
                      </button>
                    </div>
                  `
                : nothing}
            </div>
          `
        : nothing}
    </div>
  `;
}

export function updateAreaViewOverride(host: PanelHost, areaId: string, yamlString: string): void {
  const currentAreaOptions = host._config.areas_options?.[areaId] || {};
  const newAreaOptions = { ...currentAreaOptions };

  if (!yamlString.trim()) {
    delete newAreaOptions.view_override;
  } else {
    const parsed = parseEditorYamlConfig(yamlString, localize('editor.area_view_override_object_error'));
    const parsedConfig = parsed.parsed_config;
    const isObject = parsedConfig && !Array.isArray(parsedConfig);
    newAreaOptions.view_override = {
      yaml: yamlString,
      parsed_config: isObject ? (parsedConfig as Record<string, any>) : undefined,
      _yaml_error: isObject
        ? parsed._yaml_error
        : parsed._yaml_error || localize('editor.area_view_override_object_error'),
    };
  }

  const newAreasOptions = { ...host._config.areas_options };
  if (Object.keys(newAreaOptions).length === 0) delete newAreasOptions[areaId];
  else newAreasOptions[areaId] = newAreaOptions;

  const newConfig: Simon42StrategyConfig = { ...host._config };
  if (Object.keys(newAreasOptions).length === 0) delete newConfig.areas_options;
  else newConfig.areas_options = newAreasOptions;
  host._config = newConfig;
  host._fireConfigChanged(newConfig);
}
