// ====================================================================
// Sortable entity lists — favorites, room pins and quick actions
// ====================================================================
// One renderer for every "pick entities, drag to reorder" list. Search
// text and the dragged item are transient UI state owned by the host.
// ====================================================================

import { html, nothing, type TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { localize } from '../../utils/localize';
import {
  parseEntityList,
  toggleRow,
  type EntityListKey,
  type EntitySelectOption,
  type OptionPanelHost,
} from './option-panel-host';

interface EntityListOptions {
  key: EntityListKey;
  listId: string;
  emptyLabel: string;
  /** Show the room of each entry and offer only entities that have one. */
  withArea?: boolean;
}

function currentList(host: OptionPanelHost, key: EntityListKey): string[] {
  return host.config[key] || [];
}

function writeList(host: OptionPanelHost, key: EntityListKey, entities: string[]): void {
  host.update((config) => {
    if (entities.length > 0) config[key] = entities;
    else delete config[key];
  });
}

function addEntity(host: OptionPanelHost, key: EntityListKey, entityId: string): void {
  const entities = currentList(host, key);
  if (!entities.includes(entityId)) writeList(host, key, [...entities, entityId]);
}

function removeEntity(host: OptionPanelHost, key: EntityListKey, entityId: string): void {
  writeList(
    host,
    key,
    currentList(host, key).filter((id) => id !== entityId)
  );
}

function setSearch(host: OptionPanelHost, key: EntityListKey, value: string): void {
  host.entityListState.search[key] = value;
  host.requestUpdate();
}

function listItem(event: Event): HTMLElement | null {
  return (event.target as HTMLElement).closest<HTMLElement>('.entity-list-item');
}

function dragStart(host: OptionPanelHost, event: DragEvent): void {
  const item = listItem(event);
  if (!item) {
    event.preventDefault();
    return;
  }
  item.classList.add('dragging');
  host.entityListState.draggedId = item.dataset.entityId || null;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', host.entityListState.draggedId || '');
  }
}

function dragEnd(host: OptionPanelHost, event: DragEvent): void {
  listItem(event)?.classList.remove('dragging');
  host.entityListState.draggedId = null;
}

function dragOver(host: OptionPanelHost, event: DragEvent): void {
  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  const item = event.currentTarget as HTMLElement;
  if (item.dataset.entityId !== host.entityListState.draggedId) item.classList.add('drag-over');
}

function drop(host: OptionPanelHost, key: EntityListKey, event: DragEvent): void {
  event.stopPropagation();
  event.preventDefault();
  const target = event.currentTarget as HTMLElement;
  target.classList.remove('drag-over');

  const draggedId = host.entityListState.draggedId;
  const dropId = target.dataset.entityId;
  if (!draggedId || !dropId || draggedId === dropId) return;

  const entities = [...currentList(host, key)];
  const draggedIndex = entities.indexOf(draggedId);
  const dropIndex = entities.indexOf(dropId);
  if (draggedIndex === -1 || dropIndex === -1) return;

  entities.splice(draggedIndex, 1);
  entities.splice(dropIndex, 0, draggedId);
  writeList(host, key, entities);
}

function renderEntityList(host: OptionPanelHost, options: EntityListOptions): TemplateResult {
  const { key } = options;
  const entities = currentList(host, key);
  const optionsById = new Map<string, EntitySelectOption>(
    host.entityOptions().map((entry) => [entry.entity_id, entry])
  );
  const areaNames = options.withArea
    ? new Map(host.sortedAreas().map((area) => [area.area_id, area.name]))
    : new Map<string, string>();
  const search = host.entityListState.search[key] ?? '';
  const matches = host.filterEntities(search, options.withArea === true);

  return html`
    <div id=${options.listId} style="margin-bottom: 12px;">
      ${entities.length === 0
        ? html`<div class="empty-state">${options.emptyLabel}</div>`
        : html`
            <div class="entity-list-container">
              ${entities.map((entityId) => {
                const entity = optionsById.get(entityId);
                const areaId = entity?.area_id || entity?.device_area_id;
                return html`
                  <div
                    class="entity-list-item"
                    data-entity-id=${entityId}
                    draggable="true"
                    @dragstart=${(event: DragEvent) => dragStart(host, event)}
                    @dragend=${(event: DragEvent) => dragEnd(host, event)}
                    @dragover=${(event: DragEvent) => dragOver(host, event)}
                    @dragleave=${(event: DragEvent) =>
                      (event.currentTarget as HTMLElement).classList.remove('drag-over')}
                    @drop=${(event: DragEvent) => drop(host, key, event)}
                  >
                    <span class="drag-icon">&#x2630;</span>
                    <span class="item-info">
                      <span class="item-name">${entity?.name || entityId}</span>
                      <span class="item-entity-id">${entityId}</span>
                      ${options.withArea
                        ? html`<span class="item-area"
                            >&#x1F4CD; ${areaId ? areaNames.get(areaId) || areaId : localize('editor.no_room')}</span
                          >`
                        : nothing}
                    </span>
                    <button
                      class="btn-remove"
                      aria-label=${localize('editor.remove_entity')}
                      @click=${() => removeEntity(host, key, entityId)}
                    >
                      &#x2715;
                    </button>
                  </div>
                `;
              })}
            </div>
          `}
    </div>

    <div class="entity-search-picker">
      <input
        type="text"
        class="entity-search-input"
        placeholder=${localize('editor.select_entity') + '...'}
        aria-label=${localize('editor.select_entity')}
        .value=${search}
        @input=${(event: Event) => setSearch(host, key, (event.target as HTMLInputElement).value)}
        @blur=${() => {
          // Delay so a click on a result still lands before the list closes.
          setTimeout(() => setSearch(host, key, ''), 200);
        }}
      />
      ${search.length >= 2
        ? html`
            <div class="entity-search-results">
              ${matches.length > 0
                ? matches.map(
                    (entity) => html`
                      <div
                        class="entity-search-result"
                        @mousedown=${(event: Event) => {
                          event.preventDefault();
                          addEntity(host, key, entity.entity_id);
                          setSearch(host, key, '');
                        }}
                      >
                        <span class="entity-search-name">${entity.name}</span>
                        <span class="entity-search-id">${entity.entity_id}</span>
                      </div>
                    `
                  )
                : html`<div class="entity-search-no-results">${localize('editor.no_results')}</div>`}
            </div>
          `
        : nothing}
    </div>
  `;
}

export function renderFavoritesSection(host: OptionPanelHost): TemplateResult {
  const lightFavorites = host.config.light_favorite_entities || [];
  return html`
    <div class="section">
      <div class="section-title">${localize('editor.section_favorites')}</div>
      ${renderEntityList(host, {
        key: 'favorite_entities',
        listId: 'favorites-list',
        emptyLabel: localize('editor.no_favorites'),
      })}
      <div class="description">${localize('editor.favorites_desc')}</div>
      ${toggleRow(host, 'favorites_show_state', { labelKey: 'editor.show_state', description: false })}
      ${toggleRow(host, 'favorites_hide_last_changed', { labelKey: 'editor.hide_last_changed', description: false })}

      <div class="subsection-title">${localize('editor.light_favorites')}</div>
      <ha-textfield
        .value=${lightFavorites.join(', ')}
        label=${localize('editor.light_favorites_entities')}
        helper=${localize('editor.light_favorites_desc')}
        @change=${(event: Event) => {
          const entities = parseEntityList((event.target as HTMLInputElement).value, (entry) =>
            entry.startsWith('light.')
          );
          host.update((config) => {
            if (entities.length > 0) config.light_favorite_entities = entities;
            else delete config.light_favorite_entities;
          });
        }}
      ></ha-textfield>

      <div class="subsection-title">${localize('editor.quick_actions')}</div>
      ${renderEntityList(host, {
        key: 'quick_action_entities',
        listId: 'quick-actions-list',
        emptyLabel: localize('editor.no_quick_actions'),
      })}
      <div class="description">${localize('editor.quick_actions_desc')}</div>
    </div>
  `;
}

export function renderRoomPinsSection(host: OptionPanelHost): TemplateResult {
  return html`
    <div class="section">
      <div class="section-title">${localize('editor.section_room_pins')}</div>
      ${renderEntityList(host, {
        key: 'room_pin_entities',
        listId: 'room-pins-list',
        emptyLabel: localize('editor.no_room_pins'),
        withArea: true,
      })}
      <div class="description">${unsafeHTML(localize('editor.room_pins_desc'))}</div>
      ${toggleRow(host, 'room_pins_show_state', { labelKey: 'editor.show_state', description: false })}
      ${toggleRow(host, 'room_pins_hide_last_changed', { labelKey: 'editor.hide_last_changed', description: false })}
    </div>
  `;
}
