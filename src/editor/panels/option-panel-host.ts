// ====================================================================
// Shared host facade and row helpers for the option panels
// ====================================================================
// The editor element owns config, expansion state and config-changed
// events. Panels only render and describe changes through this facade.
// ====================================================================

import { html, type TemplateResult } from 'lit';

import type { HomeAssistant } from '../../types/homeassistant';
import type { AreaRegistryEntry } from '../../types/registries';
import type { Simon42StrategyConfig } from '../../types/strategy';
import { localize } from '../../utils/localize';
import type { StrategyEditorHost } from '../editor-host';

export interface EntitySelectOption {
  entity_id: string;
  name: string;
  area_id?: string | null;
  device_area_id?: string | null;
}

export type EntityListKey = 'favorite_entities' | 'room_pin_entities' | 'quick_action_entities';

/** Transient UI state of the entity lists; never part of the saved config. */
export interface EntityListState {
  search: Partial<Record<EntityListKey, string>>;
  draggedId: string | null;
}

export type BooleanOptionKey = {
  [K in keyof Simon42StrategyConfig]-?: NonNullable<Simon42StrategyConfig[K]> extends boolean ? K : never;
}[keyof Simon42StrategyConfig];

export interface OptionPanelHost {
  readonly hass: HomeAssistant | null;
  readonly config: Simon42StrategyConfig;
  /** The editor itself, for panels that predate this facade. */
  readonly editor: StrategyEditorHost;
  readonly entityListState: EntityListState;
  checkbox(
    id: string,
    label: string,
    checked: boolean,
    change: (checked: boolean) => void,
    disabled?: boolean
  ): TemplateResult;
  /** Stores a boolean and drops it again when it equals the default. */
  toggle(key: string, value: boolean, defaultValue: boolean): void;
  /** Stores a scalar and drops it again when it equals the default. */
  setOption(key: keyof Simon42StrategyConfig, value: unknown, defaultValue: unknown): void;
  /** Applies a change to a copy of the config and fires config-changed once. */
  update(change: (config: Simon42StrategyConfig) => void): void;
  requestUpdate(): void;
  entityOptions(): EntitySelectOption[];
  filterEntities(query: string, withAreaOnly?: boolean): EntitySelectOption[];
  sortedAreas(): AreaRegistryEntry[];
}

export interface ToggleRowOptions {
  /** Options that are on unless explicitly disabled. */
  defaultOn?: boolean;
  /** DOM id; defaults to the option key with dashes. */
  id?: string;
  /** Set to false for rows without an `editor.<key>_desc` text. */
  description?: boolean;
  /** Label translation key; defaults to `editor.<key>`. */
  labelKey?: string;
  disabled?: boolean;
}

export function isOptionEnabled(config: Simon42StrategyConfig, key: BooleanOptionKey, defaultOn = false): boolean {
  const value = Reflect.get(config, key) as boolean | undefined;
  return defaultOn ? value !== false : value === true;
}

/** Checkbox plus description for a plain boolean option. */
export function toggleRow(
  host: OptionPanelHost,
  key: BooleanOptionKey,
  options: ToggleRowOptions = {}
): TemplateResult {
  const defaultOn = options.defaultOn === true;
  return html`
    ${host.checkbox(
      options.id ?? key.replace(/_/g, '-'),
      localize(options.labelKey ?? `editor.${key}`),
      isOptionEnabled(host.config, key, defaultOn),
      (checked) => host.toggle(key, checked, defaultOn),
      options.disabled === true
    )}
    ${options.description === false ? '' : html`<div class="description">${localize(`editor.${key}_desc`)}</div>`}
  `;
}

/** Comma separated entity ids, trimmed and de-duplicated. */
export function parseEntityList(value: string, accept: (entityId: string) => boolean): string[] {
  return [
    ...new Set(
      value
        .split(',')
        .map((entry) => entry.trim())
        .filter(accept)
    ),
  ];
}
