// ====================================================================
// Inline editor helpers
// ====================================================================

import type { LovelaceCardConfig, LovelaceSectionConfig, LovelaceViewConfig } from '../types/lovelace';
import type { InlineViewEdits, Simon42StrategyConfig } from '../types/strategy';

const EDITABLE_CARD_TYPE = 'custom:dashboard-strategy-editable-card';
const CONTAINER_CARD_TYPES = new Set(['horizontal-stack', 'vertical-stack', 'grid']);

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_.-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    || 'item';
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((entry) => stableStringify(entry)).join(',')}]`;

  const obj = value as Record<string, unknown>;
  return `{${Object.keys(obj)
    .filter((key) => obj[key] !== undefined)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(obj[key])}`)
    .join(',')}}`;
}

export function hashCardConfig(card: LovelaceCardConfig): string {
  let hash = 2166136261;
  const input = stableStringify(card);

  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(16);
}

function inferCardId(viewPath: string, sectionId: string, card: LovelaceCardConfig, index: number): string {
  if (card.type === 'area' && typeof card.area === 'string') {
    return `${viewPath}.area.${slug(card.area)}`;
  }

  if (card.type === 'custom:dashboard-strategy-area-card' && typeof card.area === 'string') {
    return `${viewPath}.area.${slug(card.area)}`;
  }

  if (card.type === 'custom:dashboard-strategy-summary-card' && typeof card.summary_type === 'string') {
    return `${viewPath}.summary.${slug(card.summary_type)}`;
  }

  if (card.type === 'custom:dashboard-strategy-lights-group-card' && typeof card.filter === 'string') {
    return `${viewPath}.lights.${slug(card.filter)}`;
  }

  if (card.type === 'custom:dashboard-strategy-covers-group-card' && typeof card.filter === 'string') {
    return `${viewPath}.covers.${slug(card.filter)}`;
  }

  if (typeof card.entity === 'string') {
    return `${viewPath}.${sectionId}.${slug(card.type)}.${slug(card.entity)}`;
  }

  if (card.type === 'heading' && typeof card.heading === 'string') {
    return `${viewPath}.${sectionId}.heading.${slug(card.heading)}`;
  }

  return `${viewPath}.${sectionId}.${slug(card.type || 'card')}.${index + 1}`;
}

function uniqueId(baseId: string, usedIds: Map<string, number>): string {
  const count = usedIds.get(baseId) || 0;
  usedIds.set(baseId, count + 1);
  return count === 0 ? baseId : `${baseId}.${count + 1}`;
}

function wrapEditableCard(
  viewPath: string,
  editId: string,
  card: LovelaceCardConfig,
  edits: InlineViewEdits | undefined
): LovelaceCardConfig | null {
  if (card.type === EDITABLE_CARD_TYPE) return card;
  if (edits?.hidden_generated_cards?.includes(editId)) return null;

  const sourceHash = hashCardConfig(card);
  const override = edits?.generated_card_overrides?.[editId];
  const renderedCard = override?.parsed_config && typeof override.parsed_config === 'object'
    ? override.parsed_config as LovelaceCardConfig
    : card;

  return {
    type: EDITABLE_CARD_TYPE,
    edit_id: editId,
    view_path: viewPath,
    source_hash: sourceHash,
    ...(renderedCard.grid_options || card.grid_options
      ? { grid_options: renderedCard.grid_options || card.grid_options }
      : {}),
    ...(renderedCard.visibility || card.visibility
      ? { visibility: renderedCard.visibility || card.visibility }
      : {}),
    ...(renderedCard.view_layout || card.view_layout
      ? { view_layout: renderedCard.view_layout || card.view_layout }
      : {}),
    card: renderedCard,
    original_card: card,
    has_override: !!override,
  };
}

function applyToCard(
  viewPath: string,
  sectionId: string,
  card: LovelaceCardConfig,
  index: number,
  edits: InlineViewEdits | undefined,
  usedIds: Map<string, number>
): LovelaceCardConfig | null {
  if (CONTAINER_CARD_TYPES.has(card.type) && Array.isArray(card.cards)) {
    return {
      ...card,
      cards: card.cards
        .map((child, childIndex) => applyToCard(viewPath, sectionId, child, childIndex, edits, usedIds))
        .filter((child): child is LovelaceCardConfig => !!child),
    };
  }

  if (card.type === 'conditional' && card.card && typeof card.card === 'object' && !Array.isArray(card.card)) {
    const wrappedChild = applyToCard(viewPath, sectionId, card.card as LovelaceCardConfig, index, edits, usedIds);
    return wrappedChild ? { ...card, card: wrappedChild } : null;
  }

  const editId = uniqueId(inferCardId(viewPath, sectionId, card, index), usedIds);
  return wrapEditableCard(viewPath, editId, card, edits);
}

function sectionId(section: LovelaceSectionConfig, index: number): string {
  if (typeof section.id === 'string') return slug(section.id);
  if (typeof section.title === 'string') return slug(section.title);
  const firstHeading = section.cards?.find((card) => card.type === 'heading' && typeof card.heading === 'string');
  if (firstHeading?.heading) return slug(firstHeading.heading);
  return `section${index + 1}`;
}

function applyToSection(
  viewPath: string,
  section: LovelaceSectionConfig,
  index: number,
  edits: InlineViewEdits | undefined,
  usedIds: Map<string, number>
): LovelaceSectionConfig {
  if (!Array.isArray(section.cards)) return section;
  const id = sectionId(section, index);

  return {
    ...section,
    cards: section.cards
      .map((card, cardIndex) => applyToCard(viewPath, id, card, cardIndex, edits, usedIds))
      .filter((card): card is LovelaceCardConfig => !!card),
  };
}

function applySectionOrder(sections: LovelaceSectionConfig[], edits: InlineViewEdits | undefined): LovelaceSectionConfig[] {
  if (!edits?.section_order?.length) return sections;

  const order = new Map(edits.section_order.map((id, index) => [id, index]));
  return [...sections].sort((a, b) => {
    const aId = typeof a.id === 'string' ? a.id : '';
    const bId = typeof b.id === 'string' ? b.id : '';
    const aIndex = order.has(aId) ? order.get(aId)! : Number.MAX_SAFE_INTEGER;
    const bIndex = order.has(bId) ? order.get(bId)! : Number.MAX_SAFE_INTEGER;
    return aIndex - bIndex;
  });
}

export function applyInlineEditorToViews(
  views: LovelaceViewConfig[],
  config: Simon42StrategyConfig
): LovelaceViewConfig[] {
  const inlineConfig = config.inline_editor;

  return views.map((view) => {
    const viewPath = view.path || view.title || 'view';
    const edits = inlineConfig?.views?.[viewPath];
    const usedIds = new Map<string, number>();

    return {
      ...view,
      ...(Array.isArray(view.sections)
        ? {
            sections: applySectionOrder(view.sections, edits).map((section, index) =>
              applyToSection(viewPath, section, index, edits, usedIds)
            ),
          }
        : {}),
      ...(Array.isArray(view.cards)
        ? {
            cards: view.cards
              .map((card, index) => applyToCard(viewPath, 'cards', card, index, edits, usedIds))
              .filter((card): card is LovelaceCardConfig => !!card),
          }
        : {}),
    };
  });
}
