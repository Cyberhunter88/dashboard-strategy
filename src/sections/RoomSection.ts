// ====================================================================
// Room section strategy — one room as a single Lovelace section
// ====================================================================
// Home Assistant 2026.11 lists registered section strategies under
// "Community sections". `custom:dashboard-strategy-room` reuses the room
// view strategy and folds its sections into one grid section, so any manual
// dashboard can embed a generated room.
// ====================================================================

import type { HomeAssistant } from '../types/homeassistant';
import type {
  LovelaceBadgeConfig,
  LovelaceCardConfig,
  LovelaceSectionConfig,
  LovelaceViewConfig,
} from '../types/lovelace';
import type { AreaRegistryEntry } from '../types/registries';
import type { Simon42StrategyConfig } from '../types/strategy';
import { localize } from '../utils/localize';

export const ROOM_SECTION_STRATEGY_TYPE = 'custom:dashboard-strategy-room';

export interface RoomSectionStrategyConfig extends Simon42StrategyConfig {
  type?: string;
  /** Home Assistant area id of the room to render. */
  area?: string;
  /** Show the room name as a title heading with the room badges (default: true). */
  show_heading?: boolean;
}

/** Split the section-only keys from the dashboard options the room view understands. */
export function splitRoomSectionConfig(config: RoomSectionStrategyConfig): {
  areaId: string | undefined;
  showHeading: boolean;
  dashboardConfig: Simon42StrategyConfig;
} {
  const { area, show_heading: showHeading, ...rest } = config;
  const dashboardConfig: Simon42StrategyConfig = { ...rest };
  delete (dashboardConfig as RoomSectionStrategyConfig).type;
  return {
    areaId: typeof area === 'string' && area ? area : undefined,
    showHeading: showHeading !== false,
    dashboardConfig,
  };
}

/** First room by name: used for the section picker preview. */
export function pickStubArea(hass: Pick<HomeAssistant, 'areas'>): string | undefined {
  const areas = Object.values(hass.areas || {});
  areas.sort((a, b) => (a.name || a.area_id).localeCompare(b.name || b.area_id));
  return areas[0]?.area_id;
}

/** Heading badges only support the `entity` type; alert badges fall back to state colors. */
function toHeadingBadge(badge: string | Partial<LovelaceBadgeConfig>): LovelaceCardConfig | null {
  if (typeof badge === 'string') return { type: 'entity', entity: badge };
  if (!badge.entity) return null;
  return {
    type: 'entity',
    entity: badge.entity,
    ...(badge.type !== 'alert' && typeof badge.color === 'string' ? { color: badge.color } : {}),
    ...(badge.tap_action ? { tap_action: badge.tap_action } : {}),
  };
}

export function buildRoomSection(
  view: LovelaceViewConfig,
  area: AreaRegistryEntry,
  showHeading = true
): LovelaceSectionConfig {
  const cards: LovelaceCardConfig[] = [];
  if (showHeading) {
    const badges = (view.badges || []).map(toHeadingBadge).filter((b): b is LovelaceCardConfig => b !== null);
    cards.push({
      type: 'heading',
      heading: area.name,
      heading_style: 'title',
      icon: area.icon || 'mdi:floor-plan',
      ...(badges.length > 0 ? { badges } : {}),
    });
  }
  for (const section of view.sections || []) {
    for (const card of section.cards || []) {
      // Room block headings become subtitles below the room title.
      if (showHeading && card.type === 'heading' && card.heading_style === 'title') {
        cards.push({ ...card, heading_style: 'subtitle' });
      } else {
        cards.push(card);
      }
    }
  }
  return { type: 'grid', cards };
}

export function buildMissingAreaSection(areaId: string | undefined): LovelaceSectionConfig {
  return {
    type: 'grid',
    cards: [
      {
        type: 'markdown',
        content: areaId
          ? localize('room_section.unknown_area').replace('{area}', areaId)
          : localize('room_section.no_area'),
      },
    ],
  };
}
