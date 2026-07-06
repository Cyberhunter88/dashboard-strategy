// ====================================================================
// BATTERIES CARD — Reactive battery status overview with pooled tiles
// ====================================================================

import { LitElement, css, html, nothing, type PropertyValues } from 'lit';
import type { HomeAssistant } from '../types/homeassistant';
import type { Simon42StrategyConfig } from '../types/strategy';
import { Registry } from '../Registry';
import { trackHassUpdate } from '../utils/debug';
import { localize } from '../utils/localize';
import { getBatteryEntities } from '../utils/entity-filter';
import { getBatteryStatus, type BatteryStatus } from '../utils/battery-utils';
import { getEntityDisplayName } from '../utils/name-utils';
import { buildAdaptiveTileCardConfig } from '../utils/tile-card-utils';
import {
  createHeadingCardElement,
  createTileCardElement,
  haveEntityStatesChanged,
  propagateHassToCards,
  type LovelaceCardElement,
} from '../utils/card-element-utils';

interface BatteriesCardConfig {
  config?: Simon42StrategyConfig;
}

type BatteryGroups = Record<BatteryStatus, string[]>;

const BATTERY_STATUSES: BatteryStatus[] = ['critical', 'low', 'good'];
const STATUS_EMOJI: Record<BatteryStatus, string> = {
  critical: '🔴',
  low: '🟡',
  good: '🟢',
};
const STATUS_COLOR: Record<BatteryStatus, string> = {
  critical: 'red',
  low: 'yellow',
  good: 'green',
};

class DashboardStrategyBatteriesCard extends LitElement {
  static properties = {
    hass: { attribute: false },
  };

  public hass?: HomeAssistant;
  private _config: Simon42StrategyConfig = {};
  private _sourceIds: Set<string> | null = null;
  private _renderedGroups: BatteryGroups = this._emptyGroups();
  private _lastLayoutKey = '';
  private _tileCards = new Map<string, LovelaceCardElement>();
  private _tileStatuses = new Map<string, BatteryStatus>();
  private _headingCards = new Map<BatteryStatus, LovelaceCardElement>();

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    .groups {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
      gap: 16px;
      align-items: start;
    }
    .group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 0;
    }
    .tiles {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
      gap: 8px;
    }
  `;

  setConfig(config: BatteriesCardConfig): void {
    this._config = config.config || {};
    this._sourceIds = null;
    this._lastLayoutKey = '';
    this._clearCardPool();
    this.requestUpdate();
  }

  getGridOptions() {
    return { columns: 'full', rows: 'auto' } as const;
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!changedProps.has('hass') || !this.hass) return true;

    const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
    if (!oldHass || oldHass.entities !== this.hass.entities) return true;
    if (!this._sourceIds) return true;
    return haveEntityStatesChanged(oldHass, this.hass, this._sourceIds);
  }

  protected willUpdate(changedProps: PropertyValues): void {
    if (!changedProps.has('hass') || !this.hass) return;

    trackHassUpdate('batteries-card');
    const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
    if (!oldHass || oldHass.entities !== this.hass.entities) {
      if (!Registry.isCurrent(this.hass, this._config)) {
        Registry.initialize(this.hass, this._config);
      }
      this._sourceIds = null;
      this._lastLayoutKey = '';
      this._clearCardPool();
    }

    if (!this._sourceIds) {
      this._sourceIds = new Set(getBatteryEntities(this.hass, this._config));
    }

    propagateHassToCards(this.hass, this._headingCards.values(), this._tileCards.values());
  }

  protected render() {
    if (!this.hass || !this._sourceIds) return nothing;

    this._renderedGroups = this._groupBatteries();
    const visibleStatuses = BATTERY_STATUSES.filter((status) => this._renderedGroups[status].length > 0);
    if (visibleStatuses.length === 0) return nothing;

    return html`
      <div class="groups">
        ${visibleStatuses.map(
          (status) => html`
            <section class="group">
              <div id=${`heading-${status}`}></div>
              <div class="tiles" id=${`tiles-${status}`}></div>
            </section>
          `
        )}
      </div>
    `;
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);
    if (!this.hass || !this._sourceIds) return;

    const layoutKey = BATTERY_STATUSES.map((status) => `${status}:${this._renderedGroups[status].join(',')}`).join('|');
    if (layoutKey === this._lastLayoutKey) return;
    this._lastLayoutKey = layoutKey;

    const activeIds = new Set<string>();
    for (const status of BATTERY_STATUSES) {
      const entities = this._renderedGroups[status];
      if (entities.length === 0) continue;

      const headingSlot = this.shadowRoot?.getElementById(`heading-${status}`);
      if (headingSlot) {
        const heading = this._getOrCreateHeading(status);
        heading.hass = this.hass;
        heading.setConfig(this._buildHeadingConfig(status, entities.length));
        headingSlot.replaceChildren(heading);
      }

      const tilesSlot = this.shadowRoot?.getElementById(`tiles-${status}`);
      if (!tilesSlot) continue;
      for (const entityId of entities) {
        activeIds.add(entityId);
        tilesSlot.appendChild(this._getOrCreateTile(entityId, status));
      }
    }

    for (const [entityId, card] of this._tileCards) {
      if (activeIds.has(entityId)) continue;
      card.remove();
      this._tileCards.delete(entityId);
      this._tileStatuses.delete(entityId);
    }
  }

  private _emptyGroups(): BatteryGroups {
    return { critical: [], low: [], good: [] };
  }

  private _groupBatteries(): BatteryGroups {
    const groups = this._emptyGroups();
    if (!this.hass || !this._sourceIds) return groups;

    for (const entityId of this._sourceIds) {
      const status = getBatteryStatus(this.hass, entityId, this._config);
      if (status) groups[status].push(entityId);
    }

    const sortByLevel = (a: string, b: string): number => {
      const valueA = parseFloat(this.hass!.states[a]?.state);
      const valueB = parseFloat(this.hass!.states[b]?.state);
      if (Number.isNaN(valueA)) return -1;
      if (Number.isNaN(valueB)) return 1;
      return valueA - valueB;
    };
    for (const status of BATTERY_STATUSES) groups[status].sort(sortByLevel);
    return groups;
  }

  private _buildHeadingConfig(status: BatteryStatus, count: number): Record<string, unknown> {
    const criticalThreshold = this._config.battery_critical_threshold ?? 20;
    const lowThreshold = this._config.battery_low_threshold ?? 50;
    const rangeText =
      status === 'critical'
        ? `< ${criticalThreshold}%`
        : status === 'low'
          ? `${criticalThreshold}% - ${lowThreshold}%`
          : `> ${lowThreshold}%`;
    const batteryLabel = localize(count === 1 ? 'batteries.battery_one' : 'batteries.battery_many');

    return {
      type: 'heading',
      heading: `${STATUS_EMOJI[status]} ${localize(`batteries.${status}`)} (${rangeText}) - ${count} ${batteryLabel}`,
      heading_style: 'title',
    };
  }

  private _getAreaNameForEntity(entityId: string): string | null {
    const entity = Registry.getEntity(entityId);
    let areaId = entity?.area_id ?? null;
    if (!areaId && entity?.device_id) {
      areaId = Registry.getDevice(entity.device_id)?.area_id ?? null;
    }
    if (!areaId) return null;
    return this.hass?.areas[areaId]?.name ?? null;
  }

  private _getTileName(entityId: string): string | undefined {
    if (this._config.show_area_in_battery_view !== true || !this.hass) return undefined;

    const areaName = this._getAreaNameForEntity(entityId);
    if (!areaName) return undefined;

    return `${areaName} • ${getEntityDisplayName(entityId, this.hass)}`;
  }

  private _getOrCreateHeading(status: BatteryStatus): LovelaceCardElement {
    let heading = this._headingCards.get(status);
    if (!heading) {
      heading = createHeadingCardElement();
      this._headingCards.set(status, heading);
    }
    return heading;
  }

  private _getOrCreateTile(entityId: string, status: BatteryStatus): LovelaceCardElement {
    let card = this._tileCards.get(entityId);
    if (!card) {
      card = createTileCardElement();
      this._tileCards.set(entityId, card);
    }

    if (this._tileStatuses.get(entityId) !== status) {
      card.setConfig(
        buildAdaptiveTileCardConfig(this.hass!, entityId, {
          vertical: false,
          state_content: ['state', 'last_changed'],
          color: STATUS_COLOR[status],
          name: this._getTileName(entityId),
        })
      );
      this._tileStatuses.set(entityId, status);
    }
    card.hass = this.hass;
    return card;
  }

  private _clearCardPool(): void {
    for (const card of this._tileCards.values()) card.remove();
    for (const heading of this._headingCards.values()) heading.remove();
    this._tileCards.clear();
    this._tileStatuses.clear();
    this._headingCards.clear();
  }
}

customElements.define('dashboard-strategy-batteries-card', DashboardStrategyBatteriesCard);
