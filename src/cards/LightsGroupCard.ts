// ====================================================================
// LIGHTS GROUP CARD — Reactive card for on/off light groups (LitElement)
// ====================================================================

import { LitElement, html, css, nothing, type PropertyValues } from 'lit';
import type { HomeAssistant, HassEntity } from '../types/homeassistant';
import type { AreaRegistryEntry } from '../types/registries';
import { Registry } from '../Registry';
import { trackHassUpdate } from '../utils/debug';
import { localize } from '../utils/localize';
import { stripAreaName, sortLights } from '../utils/name-utils';
import { groupEntityIdsByAreas } from '../utils/area-group-utils';
import { isEntityCurrentlyAvailable } from '../utils/availability-utils';
import { createEntityRenderKey } from '../utils/entity-render-key';
import { buildAdaptiveTileCardConfig } from '../utils/tile-card-utils';
import {
  createHeadingCardElement,
  createTileCardElement,
  haveEntityStatesChanged,
  propagateHassToCards,
  type LovelaceCardElement,
} from '../utils/card-element-utils';

interface LightsGroupConfig {
  config?: any;
  entities?: string[];
  group_type: 'on' | 'off' | 'all';
  group_by_floors?: boolean;
  group_by_areas?: boolean;
  nested_groups?: boolean;
  heading_label?: string;
  heading_icon?: string;
  area?: AreaRegistryEntry;
  default_expanded?: boolean;
}

interface FloorGroup {
  floorId: string | null;
  floorName: string;
  floorIcon: string;
  lights: string[];
}

interface AreaGroup {
  areaId: string | null;
  areaName: string;
  lights: string[];
}

interface LightHierarchyNode {
  entityId: string;
  childIds: string[];
}

class Simon42LightsGroupCard extends LitElement {
  static properties = {
    hass: { attribute: false },
  };

  public hass?: HomeAssistant;
  private _config!: LightsGroupConfig;
  private _cachedSourceIds: Set<string> | null = null;
  private _cachedAreaForEntity: Map<string, string | null> | null = null;
  private _lastLightsList = '';
  private _renderedLights: string[] = [];
  private _renderedLightsKey = '';
  private _renderedFloorGroups: FloorGroup[] = [];
  private _renderedAreaGroups: AreaGroup[] = [];

  // Reusable tile card pool (keyed by entity_id)
  private _tileCards: Map<string, LovelaceCardElement> = new Map();
  private _headingCard: LovelaceCardElement | null = null;
  private _floorHeadingCards: Map<string, LovelaceCardElement> = new Map();
  private _areaHeadingCards: Map<string, LovelaceCardElement> = new Map();
  private _groupContainers: Map<string, HTMLElement> = new Map();
  private _groupExpansion: Map<string, boolean> = new Map();

  static styles = css`
    :host {
      display: block;
    }
    :host([hidden]) {
      display: none;
    }
    .lights-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
    }
    .light-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 8px;
    }
    .floor-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .area-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .group-block {
      grid-column: 1 / -1;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
      border: 1px solid var(--divider-color);
      border-radius: 16px;
      background: color-mix(in srgb, var(--card-background-color) 92%, var(--primary-color) 8%);
    }
    .group-header {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 8px;
      align-items: start;
    }
    .group-toggle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      margin-top: 6px;
      border: none;
      border-radius: 999px;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      cursor: pointer;
      transition: transform 0.2s ease;
    }
    .group-toggle:hover {
      background: color-mix(in srgb, var(--secondary-background-color) 75%, var(--primary-color) 25%);
    }
    .group-toggle ha-icon {
      --mdc-icon-size: 18px;
      transition: transform 0.2s ease;
    }
    .group-toggle[aria-expanded='true'] ha-icon {
      transform: rotate(90deg);
    }
    .group-children {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 8px;
      padding-left: 44px;
    }
    .group-children[hidden] {
      display: none;
    }
  `;

  setConfig(config: LightsGroupConfig): void {
    if (!['on', 'off', 'all'].includes(config.group_type)) {
      throw new Error('You need to define group_type (on/off/all)');
    }
    this._config = config;
    // Invalidate cache so new config (e.g. toggled group_by_floors) takes effect immediately
    this._cachedSourceIds = null;
    this._cachedAreaForEntity = null;
    this._lastLightsList = '';
    this._renderedLights = [];
    this._renderedLightsKey = '';
    this._renderedFloorGroups = [];
    this._renderedAreaGroups = [];
    this.requestUpdate();
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!changedProps.has('hass') || !this.hass) return true;

    const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
    if (!oldHass) return true;
    if (oldHass.entities !== this.hass.entities) return true;
    if (oldHass.devices !== this.hass.devices) return true;
    if (this._config.group_by_floors && oldHass.floors !== this.hass.floors) return true;
    if (this._config.group_by_areas && oldHass.areas !== this.hass.areas) return true;
    if (!this._cachedSourceIds) return true;

    return haveEntityStatesChanged(oldHass, this.hass, this._cachedSourceIds);
  }

  protected willUpdate(changedProps: PropertyValues): void {
    if (!changedProps.has('hass') || !this.hass) return;

    trackHassUpdate('lights-group');
    const oldHass = changedProps.get('hass') as HomeAssistant | undefined;

    if (
      !oldHass
      || oldHass.entities !== this.hass.entities
      || oldHass.devices !== this.hass.devices
      || (this._config.group_by_floors && oldHass.floors !== this.hass.floors)
      || (this._config.group_by_areas && oldHass.areas !== this.hass.areas)
    ) {
      if (!Registry.isCurrent(this.hass, this._config.config || {})) {
        Registry.initialize(this.hass, this._config.config || {});
      }
      this._cachedSourceIds = null;
      this._cachedAreaForEntity = null;
      this._lastLightsList = '';
    }

    // Build cache if needed
    if (!this._cachedSourceIds) {
      if (!Registry.initialized) return;
      this._cachedSourceIds = new Set(this._getSourceLightEntities());
    }

    // Always propagate hass to child cards
    this._propagateHass(this.hass);
  }

  private _propagateHass(hass: HomeAssistant): void {
    propagateHassToCards(
      hass,
      this._headingCard,
      this._floorHeadingCards.values(),
      this._areaHeadingCards.values(),
      this._tileCards.values()
    );
  }

  private _getState(entityId: string): HassEntity | undefined {
    if (!this.hass) return undefined;
    const state = Reflect.get(this.hass.states as Record<string, unknown>, entityId);
    return state as HassEntity | undefined;
  }

  private _getSourceLightEntities(): string[] {
    if (Array.isArray(this._config.entities) && this._config.entities.length > 0) {
      return this._config.entities.filter((id) => id.startsWith('light.') && this._getState(id) !== undefined);
    }
    return Registry.getVisibleEntityIdsForDomain('light').filter((id) => this._getState(id) !== undefined);
  }

  private _getRelevantLights(lightIds?: Iterable<string>): string[] {
    if (!this.hass) return [];
    const sourceIds = lightIds ? Array.from(lightIds) : Array.from(this._cachedSourceIds || []);
    const availableSourceIds = sourceIds.filter((id) => isEntityCurrentlyAvailable(this.hass, id, this._config.config));
    if (availableSourceIds.length === 0) return [];

    if (this._config.group_type === 'all') {
      return availableSourceIds.sort((a, b) => this._compareLightIds(a, b));
    }

    const targetState = this._config.group_type === 'on' ? 'on' : 'off';

    const relevant: string[] = [];
    for (const id of availableSourceIds) {
      const state = this._getState(id);
      if (state && state.state === targetState) relevant.push(id);
    }

    return relevant.sort((a, b) => this._compareLightIds(a, b));
  }

  private _calculateRenderKey(lights: Iterable<string>): string {
    return createEntityRenderKey(lights, (entityId) => {
      if (this._config.nested_groups !== true) return null;
      const members = this._getState(entityId)?.attributes?.entity_id;
      return Array.isArray(members) ? members : null;
    });
  }

  private _compareLightIds(a: string, b: string): number {
    if (!this.hass) return 0;
    return sortLights(a, b, this.hass, this._config.config?.lights_sort_by, (entityId) => this._getDisplayName(entityId));
  }

  private _getAreaForEntity(entityId: string): string | null {
    if (!this._cachedAreaForEntity) {
      this._cachedAreaForEntity = new Map();
    }
    if (this._cachedAreaForEntity.has(entityId)) {
      return this._cachedAreaForEntity.get(entityId) ?? null;
    }
    const entity = Registry.getEntity(entityId);
    let areaId: string | null = entity?.area_id ?? null;
    if (!areaId && entity?.device_id) {
      const device = Registry.getDevice(entity.device_id);
      areaId = device?.area_id ?? null;
    }
    this._cachedAreaForEntity.set(entityId, areaId);
    return areaId;
  }

  private _getDisplayName(entityId: string): string | undefined {
    if (!this.hass) return undefined;
    if (this._config.area) {
      return stripAreaName(entityId, this._config.area, this.hass);
    }
    return undefined;
  }

  private _getGroupChildIds(entityId: string, candidateSet: Set<string>): string[] {
    const entityState = this._getState(entityId);
    const members = entityState?.attributes?.entity_id;
    if (!Array.isArray(members)) return [];

    const childIds = members.filter(
      (id): id is string => typeof id === 'string' && id.startsWith('light.') && id !== entityId && candidateSet.has(id)
    );

    return [...new Set(childIds)].sort((a, b) => this._compareLightIds(a, b));
  }

  private _collectDescendants(
    entityId: string,
    rawChildren: Map<string, string[]>,
    descendantCache: Map<string, Set<string>>,
    visiting: Set<string>
  ): Set<string> {
    const cached = descendantCache.get(entityId);
    if (cached) return cached;
    if (visiting.has(entityId)) return new Set();

    visiting.add(entityId);
    const descendants = new Set<string>();
    for (const childId of rawChildren.get(entityId) || []) {
      descendants.add(childId);
      for (const nestedId of this._collectDescendants(childId, rawChildren, descendantCache, visiting)) {
        descendants.add(nestedId);
      }
    }
    visiting.delete(entityId);
    descendantCache.set(entityId, descendants);
    return descendants;
  }

  private _buildHierarchy(lightIds: string[]): { topLevelIds: string[]; nodes: Map<string, LightHierarchyNode> } {
    if (this._config.nested_groups !== true) {
      const nodes = new Map<string, LightHierarchyNode>();
      for (const entityId of lightIds) {
        nodes.set(entityId, { entityId, childIds: [] });
      }
      return { topLevelIds: [...lightIds], nodes };
    }

    const candidateSet = new Set(lightIds);
    const rawChildren = new Map<string, string[]>();
    for (const entityId of lightIds) {
      rawChildren.set(entityId, this._getGroupChildIds(entityId, candidateSet));
    }

    const descendantCache = new Map<string, Set<string>>();
    const nodes = new Map<string, LightHierarchyNode>();
    const allNestedChildIds = new Set<string>();
    for (const entityId of lightIds) {
      const directChildIds = rawChildren.get(entityId) || [];
      const prunedChildIds = directChildIds.filter((childId) => {
        return !directChildIds.some((siblingId) => {
          if (siblingId === childId) return false;
          return this._collectDescendants(siblingId, rawChildren, descendantCache, new Set<string>()).has(childId);
        });
      });
      nodes.set(entityId, { entityId, childIds: prunedChildIds });
      for (const childId of prunedChildIds) {
        allNestedChildIds.add(childId);
      }
    }

    const topLevelIds = lightIds
      .filter((entityId) => !allNestedChildIds.has(entityId))
      .sort((a, b) => this._compareLightIds(a, b));

    return { topLevelIds, nodes };
  }

  private _groupByFloors(lights: string[]): FloorGroup[] {
    if (!this.hass) return [];

    const areas: AreaRegistryEntry[] = Registry.areas;
    const areaFloorMap = new Map<string, string | null>();
    for (const area of areas) {
      areaFloorMap.set(area.area_id, area.floor_id ?? null);
    }

    // Partition lights by floor
    const floorMap = new Map<string | null, string[]>();
    for (const id of lights) {
      const areaId = this._getAreaForEntity(id);
      const floorId = areaId ? (areaFloorMap.get(areaId) ?? null) : null;
      if (!floorMap.has(floorId)) floorMap.set(floorId, []);
      floorMap.get(floorId)?.push(id);
    }

    // Use HA's floor order from the registry. The hass.floors object preserves
    // the user-defined order from HA's "Reorder areas and floors" dialog via
    // Object.keys() insertion order — no separate sort_order field needed.
    const floors = this.hass.floors;
    const floorOrder = Object.keys(floors);
    const sortedKeys = [
      ...floorOrder.filter((id) => floorMap.has(id)),
      ...(floorMap.has(null) ? [null] : []),
    ];

    return sortedKeys.map((floorId) => {
      const floor = floorId ? floors[floorId] : null;
      return {
        floorId,
        floorName: floor?.name || localize('lights.floor_other'),
        floorIcon: floor?.icon || 'mdi:home-outline',
        lights: floorMap.get(floorId) ?? [],
      };
    });
  }

  private _groupByAreas(lights: string[]): AreaGroup[] {
    if (!this.hass) return [];
    return groupEntityIdsByAreas(
      this.hass,
      this._config.config || {},
      lights,
      (entityId) => this._getAreaForEntity(entityId),
      localize('lights.no_area')
    ).map((group) => ({ areaId: group.areaId, areaName: group.areaName, lights: group.entityIds }));
  }

  private _areaSlotKey(areaId: string | null, floorId?: string | null): string {
    return `${floorId ?? '_all'}__${areaId ?? '_none'}`;
  }

  private _buildAreaHeadingConfig(group: AreaGroup): Record<string, unknown> {
    return {
      type: 'heading',
      heading: group.areaName,
      heading_style: 'subtitle',
      ...(group.areaId ? { tap_action: { action: 'navigate', navigation_path: group.areaId } } : {}),
    };
  }

  private _getFloorDomKey(floorId: string | null): string {
    return floorId ?? '_none';
  }

  private _buildHeadingConfig(lights: string[], label?: string, icon?: string): any {
    const isOn = this._config.group_type === 'on';
    const isAll = this._config.group_type === 'all';
    const heading = label
      ? `${label} (${lights.length})`
      : `${isAll ? (this._config.heading_label || localize('room.lighting')) : (isOn ? localize('lights.on') : localize('lights.off'))} (${lights.length})`;

    const badges =
      lights.length === 0
        ? []
        : [
            {
              type: 'button',
              icon: 'mdi:lightbulb-on',
              text: localize('lights.all_on'),
              tap_action: {
                action: 'perform-action',
                perform_action: 'light.turn_on',
                target: { entity_id: lights },
              },
              visibility: [{ condition: 'or', conditions: lights.map((entity) => ({ condition: 'state', entity, state: 'off' })) }],
            },
            {
              type: 'button',
              icon: 'mdi:lightbulb-off',
              text: localize('lights.all_off'),
              tap_action: {
                action: 'perform-action',
                perform_action: 'light.turn_off',
                target: { entity_id: lights },
              },
              visibility: [{ condition: 'or', conditions: lights.map((entity) => ({ condition: 'state', entity, state: 'on' })) }],
            },
          ];

    return {
      type: 'heading',
      heading,
      icon:
        icon ||
        this._config.heading_icon ||
        (isAll ? 'mdi:lightbulb-group' : isOn ? 'mdi:lightbulb-group' : 'mdi:lightbulb-group-off'),
      badges,
    };
  }

  private _getOrCreateTileCard(entityId: string): LovelaceCardElement {
    const existingCard = this._tileCards.get(entityId);
    if (existingCard) return existingCard;

    const card = createTileCardElement();
    card.hass = this.hass;
    const cardConfig = buildAdaptiveTileCardConfig(this.hass!, entityId, {
      vertical: false,
      state_content: 'last_changed',
    });
    const displayName = this._getDisplayName(entityId);
    if (displayName) {
      cardConfig.name = displayName;
    }
    if (this._config.group_type === 'off') {
      delete cardConfig.features;
      delete cardConfig.features_position;
    }
    card.setConfig(cardConfig);
    card.dataset.entityId = entityId;
    this._tileCards.set(entityId, card);
    return card;
  }

  private _isExpanded(entityId: string): boolean {
    return this._groupExpansion.get(entityId) ?? (this._config.default_expanded === true);
  }

  private _getOrCreateGroupContainer(entityId: string): HTMLElement {
    let container = this._groupContainers.get(entityId);
    if (container) return container;

    container = document.createElement('div');
    container.className = 'group-block';
    container.dataset.entityId = entityId;
    const groupHeader = document.createElement('div');
    groupHeader.className = 'group-header';

    const toggleButton = document.createElement('button');
    toggleButton.className = 'group-toggle';
    toggleButton.type = 'button';
    toggleButton.setAttribute('aria-expanded', 'false');

    const toggleIcon = document.createElement('ha-icon');
    toggleIcon.setAttribute('icon', 'mdi:chevron-right');
    toggleButton.appendChild(toggleIcon);

    const groupCardHost = document.createElement('div');
    groupCardHost.className = 'group-card-slot';

    groupHeader.append(toggleButton, groupCardHost);

    const childContainer = document.createElement('div');
    childContainer.className = 'group-children';
    childContainer.hidden = true;

    container.append(groupHeader, childContainer);

    toggleButton.addEventListener('click', () => {
      const expanded = !this._isExpanded(entityId);
      this._groupExpansion.set(entityId, expanded);
      toggleButton.setAttribute('aria-expanded', String(expanded));
      childContainer.hidden = !expanded;
    });

    this._groupContainers.set(entityId, container);
    return container;
  }

  private _resolveHierarchyContainer(entityId: string, hasChildren: boolean): HTMLElement {
    if (hasChildren) {
      return this._getOrCreateGroupContainer(entityId);
    }
    return this._getOrCreateTileCard(entityId) as unknown as HTMLElement;
  }

  private _placeHierarchyNode(parentElement: HTMLElement, childElement: HTMLElement, referenceNode: ChildNode | null): void {
    if (childElement !== referenceNode) {
      parentElement.insertBefore(childElement, referenceNode);
    }
  }

  private _syncGroupContainer(
    groupContainerElement: HTMLElement,
    entityId: string,
    childIds: string[],
    nodes: Map<string, LightHierarchyNode>
  ): void {
    const groupCardHostElement = groupContainerElement.querySelector('.group-card-slot') as HTMLElement;
    const groupCard = this._getOrCreateTileCard(entityId);
    if (groupCard.parentNode !== groupCardHostElement) {
      groupCardHostElement.replaceChildren(groupCard);
    }

    const childContainerElement = groupContainerElement.querySelector('.group-children') as HTMLElement;
    const expanded = this._isExpanded(entityId);
    const toggleButtonElement = groupContainerElement.querySelector('.group-toggle') as HTMLButtonElement;
    toggleButtonElement.setAttribute('aria-expanded', String(expanded));
    childContainerElement.hidden = !expanded;
    this._reconcileHierarchy(childContainerElement, childIds, nodes);
  }

  private _reconcileHierarchy(container: HTMLElement, nodeIds: string[], nodes: Map<string, LightHierarchyNode>): void {
    let previousNode: ChildNode | null = null;

    for (const entityId of nodeIds) {
      const node = nodes.get(entityId);
      const childIds = node?.childIds || [];
      const hierarchyContainerElement = this._resolveHierarchyContainer(entityId, childIds.length > 0);
      const nextSibling: ChildNode | null = previousNode ? previousNode.nextSibling : container.firstChild;
      this._placeHierarchyNode(container, hierarchyContainerElement, nextSibling);
      previousNode = hierarchyContainerElement;

      if (childIds.length > 0) {
        this._syncGroupContainer(hierarchyContainerElement, entityId, childIds, nodes);
      }
    }

    while (previousNode && previousNode.nextSibling) {
      container.removeChild(previousNode.nextSibling);
    }
  }

  protected render() {
    if (!this.hass || !this._cachedSourceIds) return nothing;

    const lights = this._getRelevantLights();
    this._renderedLights = lights;
    this._renderedLightsKey = this._calculateRenderKey(lights);
    if (lights.length === 0) {
      this.hidden = true;
      this._renderedFloorGroups = [];
      return nothing;
    }
    this.hidden = false;

    if (this._config.group_by_floors) {
      const floorGroups = this._groupByFloors(lights);
      this._renderedFloorGroups = floorGroups;
      this._renderedAreaGroups = [];
      return html`
        <div class="lights-section">
          <div id="heading"></div>
          ${floorGroups.map(
            (group) => {
              const floorKey = this._getFloorDomKey(group.floorId);
              const areaGroups = this._config.group_by_areas ? this._groupByAreas(group.lights) : [];
              return html`
              <div class="floor-section">
                <div id=${`floor-heading-${floorKey}`}></div>
                ${this._config.group_by_areas
                  ? areaGroups.map((areaGroup) => {
                      const areaKey = this._areaSlotKey(areaGroup.areaId, group.floorId);
                      return html`<div class="area-section">
                        <div id=${`area-heading-${areaKey}`}></div>
                        <div class="light-grid" id=${`area-grid-${areaKey}`}></div>
                      </div>`;
                    })
                  : html`<div class="light-grid" id=${`floor-grid-${floorKey}`}></div>`}
              </div>
            `;
            }
          )}
        </div>
      `;
    }
    this._renderedFloorGroups = [];

    if (this._config.group_by_areas) {
      this._renderedAreaGroups = this._groupByAreas(lights);
      return html`<div class="lights-section">
        <div id="heading"></div>
        ${this._renderedAreaGroups.map((group) => {
          const key = this._areaSlotKey(group.areaId);
          return html`<div class="area-section">
            <div id=${`area-heading-${key}`}></div>
            <div class="light-grid" id=${`area-grid-${key}`}></div>
          </div>`;
        })}
      </div>`;
    }
    this._renderedAreaGroups = [];

    return html`
      <div class="lights-section">
        <div id="heading"></div>
        <div class="light-grid" id="grid"></div>
      </div>
    `;
  }

  private _getOrCreateFloorHeadingCard(key: string): LovelaceCardElement {
    let card = this._floorHeadingCards.get(key);
    if (card) return card;
    card = createHeadingCardElement();
    this._floorHeadingCards.set(key, card);
    return card;
  }

  private _getOrCreateAreaHeadingCard(key: string): LovelaceCardElement {
    let card = this._areaHeadingCards.get(key);
    if (card) return card;
    card = createHeadingCardElement();
    this._areaHeadingCards.set(key, card);
    return card;
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);
    if (!this.hass || !this._cachedSourceIds) return;

    const lights = this._renderedLights;
    const lightsKey = this._renderedLightsKey;
    if (this._lastLightsList === lightsKey) return;
    this._lastLightsList = lightsKey;

    if (lights.length === 0) return;

    if (this._config.group_by_floors) {
      const floorGroups = this._renderedFloorGroups;

      // Reconcile main heading (total count)
      const headingSlot = this.shadowRoot?.getElementById('heading');
      if (headingSlot) {
        if (!this._headingCard) {
          this._headingCard = createHeadingCardElement();
        }
        const mainHeadingCard = this._headingCard;
        headingSlot.appendChild(mainHeadingCard);
        mainHeadingCard.hass = this.hass;
        mainHeadingCard.setConfig(this._buildHeadingConfig(lights));
      }

      // Reconcile per-floor sections
      const allActiveIds = new Set(lights);
      const activeAreaKeys = new Set<string>();
      for (const group of floorGroups) {
        const key = group.floorId || '_none';
        const floorHeadingSlot = this.shadowRoot?.getElementById(`floor-heading-${key}`);
        if (floorHeadingSlot) {
          const headingCard = this._getOrCreateFloorHeadingCard(key);
          if (!headingCard.parentNode) floorHeadingSlot.appendChild(headingCard);
          headingCard.hass = this.hass;
          headingCard.setConfig(
            this._config.group_by_areas
              ? { type: 'heading', heading: group.floorName, heading_style: 'title', icon: group.floorIcon }
              : this._buildHeadingConfig(group.lights, group.floorName, group.floorIcon)
          );
        }

        if (this._config.group_by_areas) {
          for (const areaGroup of this._groupByAreas(group.lights)) {
            const areaKey = this._areaSlotKey(areaGroup.areaId, group.floorId);
            activeAreaKeys.add(areaKey);
            const slot = this.shadowRoot?.getElementById(`area-heading-${areaKey}`);
            if (slot) {
              const card = this._getOrCreateAreaHeadingCard(areaKey);
              slot.replaceChildren(card);
              card.hass = this.hass;
              card.setConfig(this._buildAreaHeadingConfig(areaGroup));
            }
            const grid = this.shadowRoot?.getElementById(`area-grid-${areaKey}`);
            if (grid) {
              const hierarchy = this._buildHierarchy(areaGroup.lights);
              this._reconcileHierarchy(grid, hierarchy.topLevelIds, hierarchy.nodes);
            }
          }
        } else {
          const grid = this.shadowRoot?.getElementById(`floor-grid-${key}`);
          if (grid) {
            const hierarchy = this._buildHierarchy(group.lights);
            this._reconcileHierarchy(grid, hierarchy.topLevelIds, hierarchy.nodes);
          }
        }
      }

      // Clean up stale pool entries
      for (const [id, card] of this._tileCards) {
        if (!allActiveIds.has(id)) {
          if (card.parentNode) card.parentNode.removeChild(card);
          this._tileCards.delete(id);
        }
      }
      for (const [id, container] of this._groupContainers) {
        if (!allActiveIds.has(id)) {
          if (container.parentNode) container.parentNode.removeChild(container);
          this._groupContainers.delete(id);
        }
      }
      for (const [key, card] of this._areaHeadingCards) {
        if (!activeAreaKeys.has(key)) {
          card.remove();
          this._areaHeadingCards.delete(key);
        }
      }
      return;
    }

    // Flat mode (no floor grouping)
    const headingSlot = this.shadowRoot?.getElementById('heading');
    if (headingSlot) {
      if (!this._headingCard) {
        this._headingCard = createHeadingCardElement();
      }
      const mainHeadingCard = this._headingCard;
      headingSlot.appendChild(mainHeadingCard);
      mainHeadingCard.hass = this.hass;
      mainHeadingCard.setConfig(this._buildHeadingConfig(lights));
    }

    // Clean up stale pool entries
    const activeIds = new Set(lights);
    for (const [id, card] of this._tileCards) {
      if (!activeIds.has(id)) {
        if (card.parentNode) card.parentNode.removeChild(card);
        this._tileCards.delete(id);
      }
    }

    for (const [id, container] of this._groupContainers) {
      if (!activeIds.has(id)) {
        if (container.parentNode) container.parentNode.removeChild(container);
        this._groupContainers.delete(id);
      }
    }

    if (this._config.group_by_areas) {
      const activeAreaKeys = new Set<string>();
      for (const group of this._renderedAreaGroups) {
        const key = this._areaSlotKey(group.areaId);
        activeAreaKeys.add(key);
        const slot = this.shadowRoot?.getElementById(`area-heading-${key}`);
        if (slot) {
          const card = this._getOrCreateAreaHeadingCard(key);
          slot.replaceChildren(card);
          card.hass = this.hass;
          card.setConfig(this._buildAreaHeadingConfig(group));
        }
        const grid = this.shadowRoot?.getElementById(`area-grid-${key}`);
        if (grid) {
          const hierarchy = this._buildHierarchy(group.lights);
          this._reconcileHierarchy(grid, hierarchy.topLevelIds, hierarchy.nodes);
        }
      }
      for (const [key, card] of this._areaHeadingCards) {
        if (!activeAreaKeys.has(key)) {
          card.remove();
          this._areaHeadingCards.delete(key);
        }
      }
      return;
    }

    const grid = this.shadowRoot?.getElementById('grid');
    if (!grid) return;
    const hierarchy = this._buildHierarchy(lights);
    this._reconcileHierarchy(grid, hierarchy.topLevelIds, hierarchy.nodes);
  }

  getCardSize(): number {
    return Math.ceil((this._cachedSourceIds?.size ?? 0) / 3) + 1;
  }
}

customElements.define('dashboard-strategy-lights-group-card', Simon42LightsGroupCard);
