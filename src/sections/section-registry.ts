import type { SectionKey, Simon42StrategyConfig } from '../types/strategy';

type BooleanConfigKey = {
  [K in keyof Simon42StrategyConfig]-?: NonNullable<Simon42StrategyConfig[K]> extends boolean ? K : never;
}[keyof Simon42StrategyConfig];

export interface SectionMeta {
  readonly key: SectionKey;
  readonly icon: string;
  readonly labelKey: string;
  readonly toggle?: {
    readonly flag: BooleanConfigKey;
    readonly defaultOn: boolean;
  };
}

export const SECTION_REGISTRY: readonly SectionMeta[] = [
  { key: 'overview', icon: 'mdi:home-outline', labelKey: 'sections.overview' },
  { key: 'custom_cards', icon: 'mdi:cards', labelKey: 'sections.custom_cards' },
  { key: 'custom_sections', icon: 'mdi:view-grid-plus-outline', labelKey: 'sections.custom_sections' },
  { key: 'areas', icon: 'mdi:floor-plan', labelKey: 'sections.areas' },
  {
    key: 'weather',
    icon: 'mdi:weather-partly-cloudy',
    labelKey: 'sections.weather',
    toggle: { flag: 'show_weather', defaultOn: true },
  },
  {
    key: 'energy',
    icon: 'mdi:lightning-bolt',
    labelKey: 'sections.energy',
    toggle: { flag: 'show_energy', defaultOn: true },
  },
  {
    key: 'plants',
    icon: 'mdi:flower-tulip',
    labelKey: 'sections.plants',
    toggle: { flag: 'show_plants_section', defaultOn: true },
  },
  {
    key: 'agenda',
    icon: 'mdi:calendar',
    labelKey: 'sections.agenda',
    toggle: { flag: 'show_agenda_section', defaultOn: true },
  },
  {
    key: 'todos',
    icon: 'mdi:format-list-checks',
    labelKey: 'sections.todos',
    toggle: { flag: 'show_todos_section', defaultOn: true },
  },
  {
    key: 'persons',
    icon: 'mdi:account-group',
    labelKey: 'sections.persons',
    toggle: { flag: 'show_persons_section', defaultOn: false },
  },
  {
    key: 'vacuums',
    icon: 'mdi:robot-vacuum',
    labelKey: 'sections.vacuums',
    toggle: { flag: 'show_vacuums_section', defaultOn: true },
  },
  {
    key: 'maintenance',
    icon: 'mdi:update',
    labelKey: 'sections.maintenance',
    toggle: { flag: 'show_maintenance_section', defaultOn: true },
  },
];

export const SECTION_META_BY_KEY: ReadonlyMap<SectionKey, SectionMeta> = new Map(
  SECTION_REGISTRY.map((meta) => [meta.key, meta])
);

export function isSectionHiddenByConfig(key: SectionKey, config: Simon42StrategyConfig): boolean {
  const toggle = SECTION_META_BY_KEY.get(key)?.toggle;
  if (!toggle) return false;
  const value = Reflect.get(config, toggle.flag) as boolean | undefined;
  return toggle.defaultOn ? value === false : value !== true;
}
