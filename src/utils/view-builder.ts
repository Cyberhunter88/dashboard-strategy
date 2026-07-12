// ====================================================================
// View Builder - Creates View Definitions
// ====================================================================

import type { LovelaceViewConfig, LovelaceBadgeConfig, LovelaceSectionConfig } from '../types/lovelace';
import type { Simon42StrategyConfig } from '../types/strategy';
import { localize } from './localize';

type OverviewViewConfig = Pick<Simon42StrategyConfig, 'dense_section_placement' | 'overview_max_columns'> | undefined;

type SectionViewExtras = Omit<LovelaceViewConfig, 'type' | 'sections' | 'dense_section_placement'>;

function withDenseSectionPlacement(view: LovelaceViewConfig, config?: OverviewViewConfig): LovelaceViewConfig {
  if (config?.dense_section_placement !== true) return view;
  return {
    ...view,
    dense_section_placement: true,
  };
}

export function createSectionsView(
  sections: LovelaceSectionConfig[],
  config?: OverviewViewConfig,
  extras: SectionViewExtras = {}
): LovelaceViewConfig {
  return withDenseSectionPlacement(
    {
      ...extras,
      type: 'sections',
      sections,
    },
    config
  );
}

/**
 * Creates the main overview view.
 *
 * - Badges and header are only included when personBadges has entries.
 * - Type "sections" with max 3 columns.
 */
export function createOverviewView(
  sections: LovelaceSectionConfig[],
  personBadges: LovelaceBadgeConfig[],
  config?: OverviewViewConfig
): LovelaceViewConfig {
  return createSectionsView(sections, config, {
    title: localize('views.overview'),
    path: 'home',
    icon: 'mdi:home',
    max_columns: config?.overview_max_columns ?? 3,
    badges: personBadges.length > 0 ? personBadges : undefined,
    header:
      personBadges.length > 0
        ? {
            layout: 'center',
            badges_position: 'bottom',
            badges_wrap: 'wrap',
          }
        : undefined,
  });
}
