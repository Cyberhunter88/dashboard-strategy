import type { LovelaceCardConfig, LovelaceSectionConfig } from '../types/lovelace';

function isCard(value: unknown): value is LovelaceCardConfig {
  return !!value && typeof value === 'object' && typeof (value as { type?: unknown }).type === 'string';
}

export interface NormalizedSectionYaml {
  cards: LovelaceCardConfig[];
  sectionProps: Record<string, unknown> | null;
}

export function normalizeSectionYaml(parsed: unknown): NormalizedSectionYaml | null {
  if (Array.isArray(parsed)) return { cards: parsed.filter(isCard), sectionProps: null };
  if (!parsed || typeof parsed !== 'object') return null;
  const object = parsed as Record<string, unknown>;
  if ((object.type === 'grid' || object.type === undefined) && Array.isArray(object.cards)) {
    return { cards: object.cards.filter(isCard), sectionProps: object };
  }
  return isCard(object) ? { cards: [object], sectionProps: null } : null;
}

export function buildCompleteCustomSection(parsed: unknown): LovelaceSectionConfig | null {
  const normalized = normalizeSectionYaml(parsed);
  if (!normalized || normalized.cards.length === 0) return null;
  if (normalized.sectionProps) {
    return { ...normalized.sectionProps, type: 'grid', cards: normalized.cards } as LovelaceSectionConfig;
  }
  return { type: 'grid', cards: normalized.cards };
}
