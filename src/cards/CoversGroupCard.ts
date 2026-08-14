// ====================================================================
// COVERS GROUP CARD — Reactive card for open/closed cover groups (LitElement)
// ====================================================================

import { LitElement, html, css, nothing, type PropertyValues } from 'lit';
import type { HomeAssistant } from '../types/homeassistant';
import type { AreaRegistryEntry } from '../types/registries';
import { Registry } from '../Registry';
import { trackHassUpdate } from '../utils/debug';
import { localize } from '../utils/localize';
import { isEntityCurrentlyAvailable } from '../utils/availability-utils';
import { createEntityRenderKey } from '../utils/entity-render-key';
import { stripCoverType } from '../utils/name-utils';
import { groupEntityIdsByAreas } from '../utils/area-group-utils';
import { buildAdaptiveTileCardConfig } from '../utils/tile-card-utils';
import {
  createHeadingCardElement,
  createTileCardElement,
  haveEntityStatesChanged,
  propagateHassToCards,
  type LovelaceCardElement,
} from '../utils/card-element-utils';

interface CoversGroupConfig {
  config?: any;
  group_type: 'open' | 'closed' | 'partially_open';
  show_partially_open?: boolean;
  device_classes?: string[];
  group_by_floors?: boolean;
  group_by_areas?: boolean;
  heading_open?: string;
  heading_closed?: string;
  heading_partial?: string;
  batch_open_text?: string;
  batch_close_text?: string;
}

interface CoversFloorGroup {
  floorId: string | null;
  floorName: string;
  floorIcon: string;
  covers: string[];
}

interface CoversAreaGroup {
  areaId: string | null;
  areaName: string;
  covers: string[];
}

const DEFAULT_DEVICE_CLASSES = ['awning', 'blind', 'curtain', 'shade', 'shutter', 'window'];

class Simon42CoversGroupCard extends LitElement {
  static properties = {
    hass: { attribute: false },
  };

  public hass?: HomeAssistant;
  private _config!: CoversGroupConfig;
  private _deviceClasses!: string[];
  private _cachedFilteredIds: Set<string> | null = null;
  private _cachedAreaForEntity: Map<string, string | null> | null = null;
  private _lastCoversList = '';
  private _renderedCovers: string[] = [];
  private _renderedCoversKey = '';
  private _renderedFloorGroups: CoversFloorGroup[] = [];
  private _renderedAreaGroups: CoversAreaGroup[] = [];

  // Reusable card pool
  private _tileCards: Map<string, LovelaceCardElement> = new Map();
  private _headingCard: LovelaceCardElement | null = null;
  private _floorHeadingCards: Map<string, LovelaceCardElement> = new Map();
  private _areaHeadingCards: Map<string, LovelaceCardElement> = new Map();

  static styles = css`
    :host {
      display: block;
    }
    :host([hidden]) {
      display: none;
    }
    .covers-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
    }
    .cover-grid {
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
  `;

  setConfig(config: CoversGroupConfig): void {
    this._config = config;
    this._deviceClasses = config.device_classes || DEFAULT_DEVICE_CLASSES;
    this._cachedFilteredIds = null;
    this._cachedAreaForEntity = null;
    this._lastCoversList = '';
    this._renderedCovers = [];
    this._renderedCoversKey = '';
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
    if (!this._cachedFilteredIds) return true;

    return haveEntityStatesChanged(oldHass, this.hass, this._cachedFilteredIds);
  }

  protected willUpdate(changedProps: PropertyValues): void {
    if (!changedProps.has('hass') || !this.hass) return;

    trackHassUpdate('covers-group');
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
      this._cachedFilteredIds = null;
      this._cachedAreaForEntity = null;
      this._lastCoversList = '';
    }

    // Build cache if needed
    if (!this._cachedFilteredIds) {
      if (!Registry.initialized) return;
      this._cachedFilteredIds = new Set(this._getFilteredCoverEntities(this.hass));
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

  private _getFilteredCoverEntities(hass: HomeAssistant): string[] {
    return Registry.getVisibleEntityIdsForDomain('cover').filter((id) => {
      const state = hass.states[id];
      if (!state) return false;
      const deviceClass = (state.attributes as any)?.device_class as string | undefined;
      // Covers without device_class only match the main group (multiple classes), not specialized groups like awnings/windows
      if (!deviceClass) return this._deviceClasses.length > 1;
      return this._deviceClasses.includes(deviceClass);
    });
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

  private _groupByFloors(covers: string[]): CoversFloorGroup[] {
    if (!this.hass) return [];

    const areas: AreaRegistryEntry[] = Registry.areas;
    const areaFloorMap = new Map<string, string | null>();
    for (const area of areas) {
      areaFloorMap.set(area.area_id, area.floor_id ?? null);
    }

    const floorMap = new Map<string | null, string[]>();
    for (const id of covers) {
      const areaId = this._getAreaForEntity(id);
      const floorId = areaId ? (areaFloorMap.get(areaId) ?? null) : null;
      if (!floorMap.has(floorId)) floorMap.set(floorId, []);
      floorMap.get(floorId)?.push(id);
    }

    const floors = this.hass.floors;
    const floorOrder = Object.keys(floors);
    const sortedKeys: Array<string | null> = [
      ...floorOrder.filter((id) => floorMap.has(id)),
      ...(floorMap.has(null) ? [null] : []),
    ];

    return sortedKeys.map((floorId) => {
      const floor = floorId ? floors[floorId] : null;
      return {
        floorId,
        floorName: floor?.name || localize('lights.floor_other'),
        floorIcon: floor?.icon || 'mdi:home-outline',
        covers: floorMap.get(floorId) ?? [],
      };
    });
  }

  private _groupByAreas(covers: string[]): CoversAreaGroup[] {
    if (!this.hass) return [];
    return groupEntityIdsByAreas(
      this.hass,
      this._config.config || {},
      covers,
      (entityId) => this._getAreaForEntity(entityId),
      localize('covers.no_area')
    ).map((group) => ({ areaId: group.areaId, areaName: group.areaName, covers: group.entityIds }));
  }

  private _areaSlotKey(areaId: string | null, floorId?: string | null): string {
    return `${floorId ?? '_all'}__${areaId ?? '_none'}`;
  }

  private _buildAreaHeadingConfig(group: CoversAreaGroup): Record<string, unknown> {
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

  private _getRelevantCovers(): string[] {
    if (!this.hass || !this._cachedFilteredIds) return [];
    const groupType = this._config.group_type;
    const showPartiallyOpen = this._config.show_partially_open === true;

    const relevant: string[] = [];
    for (const id of this._cachedFilteredIds) {
      if (!isEntityCurrentlyAvailable(this.hass, id, this._config.config)) continue;
      const state = this.hass.states[id];
      if (!state) continue;

      const position = (state.attributes as any)?.current_position;
      const hasPosition = typeof position === 'number';
      const isMoving = state.state === 'opening' || state.state === 'closing';

      if (groupType === 'partially_open') {
        // Partially open: position between 0 and 100 (open or currently moving)
        if (state.state === 'open' || isMoving) {
          if (hasPosition && position > 0 && position < 100) {
            relevant.push(id);
          }
        }
      } else if (groupType === 'open') {
        if (state.state === 'open' || state.state === 'opening') {
          if (showPartiallyOpen) {
            // Only fully open (100%) or covers without position attribute
            if (!hasPosition || position >= 100) {
              relevant.push(id);
            }
          } else {
            relevant.push(id);
          }
        }
      } else {
        if (state.state === 'closed') {
          relevant.push(id);
        } else if (state.state === 'closing') {
          // When partially_open is active, closing covers with position > 0 belong to partially_open
          if (showPartiallyOpen && hasPosition && position > 0) continue;
          relevant.push(id);
        }
      }
    }

    relevant.sort((a, b) => {
      const lastA = this.hass?.states[a]?.last_changed ?? '';
      const lastB = this.hass?.states[b]?.last_changed ?? '';
      return lastB > lastA ? 1 : lastB < lastA ? -1 : 0;
    });

    return relevant;
  }

  private _buildHeadingConfig(covers: string[], floorLabel?: string, floorIcon?: string): any {
    const groupType = this._config.group_type;
    const openText = this._config.batch_open_text || localize('covers.open_all');
    const closeText = this._config.batch_close_text || localize('covers.close_all');

    if (groupType === 'partially_open') {
      const headingLabel = floorLabel || this._config.heading_partial || localize('covers.partially_open');
      return {
        type: 'heading',
        heading: `${headingLabel} (${covers.length})`,
        icon: floorIcon || 'mdi:blinds-horizontal',
        badges: [
          {
            type: 'button',
            icon: 'mdi:arrow-up',
            text: openText,
            tap_action: {
              action: 'perform-action',
              perform_action: 'cover.open_cover',
              target: { entity_id: covers },
            },
          },
          {
            type: 'button',
            icon: 'mdi:arrow-down',
            text: closeText,
            tap_action: {
              action: 'perform-action',
              perform_action: 'cover.close_cover',
              target: { entity_id: covers },
            },
          },
        ],
      };
    }

    const isOpen = groupType === 'open';
    const headingLabel = floorLabel || (isOpen
      ? (this._config.heading_open || localize('covers.open'))
      : (this._config.heading_closed || localize('covers.closed')));
    return {
      type: 'heading',
      heading: `${headingLabel} (${covers.length})`,
      icon: floorIcon || (isOpen ? 'mdi:blinds-horizontal' : 'mdi:blinds'),
      badges: [
        {
          type: 'button',
          icon: isOpen ? 'mdi:arrow-down' : 'mdi:arrow-up',
          text: isOpen ? closeText : openText,
          tap_action: {
            action: 'perform-action',
            perform_action: isOpen ? 'cover.close_cover' : 'cover.open_cover',
            target: { entity_id: covers },
          },
        },
      ],
    };
  }

  private _getOrCreateTileCard(entityId: string): LovelaceCardElement {
    let card = this._tileCards.get(entityId);
    if (card) return card;

    card = createTileCardElement();
    card.hass = this.hass;
    card.setConfig(buildAdaptiveTileCardConfig(this.hass!, entityId, {
      name: this.hass ? stripCoverType(entityId, this.hass) : entityId,
      vertical: false,
      state_content: ['current_position', 'last_changed'],
    }));
    this._tileCards.set(entityId, card);
    return card;
  }

  private _calculateRenderKey(covers: string[]): string {
    return createEntityRenderKey(covers, (id) => {
        const state = this.hass?.states[id];
        if (!state) return null;
        const position = (state.attributes as any)?.current_position;
        if (typeof position === 'number') {
          return [state.state, position];
        }
        return state.state;
      });
  }

  protected render() {
    if (!this.hass || !this._cachedFilteredIds) return nothing;

    const covers = this._getRelevantCovers();
    this._renderedCovers = covers;
    this._renderedCoversKey = this._calculateRenderKey(covers);
    this.hidden = covers.length === 0;

    if (this._config.group_by_floors && covers.length > 0) {
      const floorGroups = this._groupByFloors(covers);
      this._renderedFloorGroups = floorGroups;
      this._renderedAreaGroups = [];
      return html`
        <div class="covers-section">
          <div id="heading"></div>
          ${floorGroups.map((group) => {
            const floorKey = this._getFloorDomKey(group.floorId);
            const areaGroups = this._config.group_by_areas ? this._groupByAreas(group.covers) : [];
            return html`
              <div class="floor-section">
                <div id=${`floor-heading-${floorKey}`}></div>
                ${this._config.group_by_areas
                  ? areaGroups.map((areaGroup) => {
                      const areaKey = this._areaSlotKey(areaGroup.areaId, group.floorId);
                      return html`<div class="area-section">
                        <div id=${`area-heading-${areaKey}`}></div>
                        <div class="cover-grid" id=${`area-grid-${areaKey}`}></div>
                      </div>`;
                    })
                  : html`<div class="cover-grid" id=${`floor-grid-${floorKey}`}></div>`}
              </div>
            `;
          })}
        </div>
      `;
    }

    this._renderedFloorGroups = [];

    if (this._config.group_by_areas) {
      this._renderedAreaGroups = this._groupByAreas(covers);
      return html`<div class="covers-section">
        <div id="heading"></div>
        ${this._renderedAreaGroups.map((group) => {
          const key = this._areaSlotKey(group.areaId);
          return html`<div class="area-section">
            <div id=${`area-heading-${key}`}></div>
            <div class="cover-grid" id=${`area-grid-${key}`}></div>
          </div>`;
        })}
      </div>`;
    }
    this._renderedAreaGroups = [];

    return html`
      <div class="covers-section">
        <div id="heading"></div>
        <div class="cover-grid" id="grid"></div>
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

  private _reconcileTiles(grid: HTMLElement, entityIds: string[]): void {
    let previousNode: Node | null = null;
    for (const entityId of entityIds) {
      const card = this._getOrCreateTileCard(entityId);
      const nextSibling: ChildNode | null = previousNode ? previousNode.nextSibling : grid.firstChild;
      if (card !== nextSibling) grid.insertBefore(card, nextSibling);
      previousNode = card;
    }
    while (previousNode && previousNode.nextSibling) grid.removeChild(previousNode.nextSibling);
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);
    if (!this.hass || !this._cachedFilteredIds) return;

    const covers = this._renderedCovers;
    const coversKey = this._renderedCoversKey;
    if (this._lastCoversList === coversKey) return;
    this._lastCoversList = coversKey;

    if (covers.length === 0) {
      const headingSlot = this.shadowRoot?.getElementById('heading');
      if (headingSlot) headingSlot.innerHTML = '';
      for (const card of this._floorHeadingCards.values()) {
        if (card.parentNode) card.parentNode.removeChild(card);
      }
      this._floorHeadingCards.clear();
      for (const card of this._areaHeadingCards.values()) card.remove();
      this._areaHeadingCards.clear();
      const grid = this.shadowRoot?.getElementById('grid');
      if (grid) grid.innerHTML = '';
      this._headingCard = null;
      this._tileCards.clear();
      this._lastCoversList = '';
      return;
    }

    if (this._config.group_by_floors) {
      const headingSlot = this.shadowRoot?.getElementById('heading');
      if (headingSlot) {
        if (!this._headingCard) {
          this._headingCard = createHeadingCardElement();
          headingSlot.appendChild(this._headingCard);
        }
        this._headingCard.hass = this.hass;
        this._headingCard.setConfig(this._buildHeadingConfig(covers));
      }

      const activeIds = new Set(covers);
      const activeFloorKeys = new Set<string>();
      const activeAreaKeys = new Set<string>();

      for (const group of this._renderedFloorGroups) {
        const key = this._getFloorDomKey(group.floorId);
        activeFloorKeys.add(key);

        const floorHeadingSlot = this.shadowRoot?.getElementById(`floor-heading-${key}`);
        if (floorHeadingSlot) {
          const headingCard = this._getOrCreateFloorHeadingCard(key);
          if (!headingCard.parentNode) floorHeadingSlot.appendChild(headingCard);
          headingCard.hass = this.hass;
          headingCard.setConfig(
            this._config.group_by_areas
              ? { type: 'heading', heading: group.floorName, heading_style: 'title', icon: group.floorIcon }
              : this._buildHeadingConfig(group.covers, group.floorName, group.floorIcon)
          );
        }

        if (this._config.group_by_areas) {
          for (const areaGroup of this._groupByAreas(group.covers)) {
            const areaKey = this._areaSlotKey(areaGroup.areaId, group.floorId);
            activeAreaKeys.add(areaKey);
            const areaHeadingSlot = this.shadowRoot?.getElementById(`area-heading-${areaKey}`);
            if (areaHeadingSlot) {
              const areaHeadingCard = this._getOrCreateAreaHeadingCard(areaKey);
              areaHeadingSlot.replaceChildren(areaHeadingCard);
              areaHeadingCard.hass = this.hass;
              areaHeadingCard.setConfig(this._buildAreaHeadingConfig(areaGroup));
            }
            const areaGrid = this.shadowRoot?.getElementById(`area-grid-${areaKey}`);
            if (areaGrid) this._reconcileTiles(areaGrid, areaGroup.covers);
          }
        } else {
          const floorGrid = this.shadowRoot?.getElementById(`floor-grid-${key}`);
          if (floorGrid) this._reconcileTiles(floorGrid, group.covers);
        }
      }

      for (const [id, card] of this._tileCards) {
        if (!activeIds.has(id)) {
          if (card.parentNode) card.parentNode.removeChild(card);
          this._tileCards.delete(id);
        }
      }

      for (const [key, card] of this._floorHeadingCards) {
        if (!activeFloorKeys.has(key)) {
          if (card.parentNode) card.parentNode.removeChild(card);
          this._floorHeadingCards.delete(key);
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

    // Reconcile heading card
    const headingSlot = this.shadowRoot?.getElementById('heading');
    if (headingSlot) {
      if (!this._headingCard) {
        this._headingCard = createHeadingCardElement();
        headingSlot.appendChild(this._headingCard);
      }
      this._headingCard.hass = this.hass;
      this._headingCard.setConfig(this._buildHeadingConfig(covers));
    }

    const activeIds = new Set(covers);

    // Remove cards for entities no longer in the list
    for (const [id, card] of this._tileCards) {
      if (!activeIds.has(id)) {
        if (card.parentNode) card.parentNode.removeChild(card);
        this._tileCards.delete(id);
      }
    }

    if (this._config.group_by_areas) {
      const activeAreaKeys = new Set<string>();
      for (const group of this._renderedAreaGroups) {
        const key = this._areaSlotKey(group.areaId);
        activeAreaKeys.add(key);
        const areaHeadingSlot = this.shadowRoot?.getElementById(`area-heading-${key}`);
        if (areaHeadingSlot) {
          const areaHeadingCard = this._getOrCreateAreaHeadingCard(key);
          areaHeadingSlot.replaceChildren(areaHeadingCard);
          areaHeadingCard.hass = this.hass;
          areaHeadingCard.setConfig(this._buildAreaHeadingConfig(group));
        }
        const areaGrid = this.shadowRoot?.getElementById(`area-grid-${key}`);
        if (areaGrid) this._reconcileTiles(areaGrid, group.covers);
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
    if (grid) this._reconcileTiles(grid, covers);
  }

  getCardSize(): number {
    return Math.ceil((this._cachedFilteredIds?.size ?? 0) / 3) + 1;
  }
}

customElements.define('dashboard-strategy-covers-group-card', Simon42CoversGroupCard);
