// ====================================================================
// Custom content panel — custom cards, sections, badges and views
// ====================================================================
// Config, YAML parsing and config-changed events stay in the editor
// host; this panel only renders and forwards edits through the facade.
// ====================================================================

import { html, nothing, type TemplateResult } from 'lit';

import type { AreaCustomCard, CustomBadge, CustomCard, CustomSection, SectionKey } from '../../types/strategy';
import { localize } from '../../utils/localize';
import { renderCustomViewsPanel, type CustomViewsPanelHost } from './CustomViewsPanel';

/** Typed facade: configuration state and config events stay owned by the editor host. */
export interface CustomContentPanelHost {
  readonly _config: {
    readonly custom_cards?: CustomCard[];
    readonly custom_cards_heading?: string;
    readonly custom_cards_icon?: string;
    readonly custom_sections?: CustomSection[];
    readonly custom_badges?: CustomBadge[];
  };
  readonly customViewsHost: CustomViewsPanelHost;
  _sectionLabelKey(key: SectionKey): string;
  _getCustomCardEditorLabel(card: CustomCard | AreaCustomCard | undefined, fallback: string): string;
  _customCardsHeadingChanged(e: Event): void;
  _customCardsIconChanged(e: Event): void;
  _openCardPickerForCustomCard(): void;
  _removeCustomCard(index: number): void;
  _updateCustomCardField(index: number, field: string, value: string): void;
  _updateCustomCardYaml(index: number, yamlString: string): void;
  _openCardEditorForCustomCard(index: number): void;
  _addCustomSection(): void;
  _removeCustomSection(sectionIndex: number): void;
  _updateCustomSectionYaml(sectionIndex: number, yamlString: string): void;
  _updateCustomSectionField(sectionIndex: number, field: string, value: string): void;
  _removeCardFromSection(sectionIndex: number, cardIndex: number): void;
  _updateSectionCardField(sectionIndex: number, cardIndex: number, field: string, value: string): void;
  _updateSectionCardYaml(sectionIndex: number, cardIndex: number, yamlString: string): void;
  _openCardEditorForSectionCard(sectionIndex: number, cardIndex: number): void;
  _openCardPickerForSection(sectionIndex: number): void;
  _addCustomBadge(): void;
  _removeCustomBadge(index: number): void;
  _updateCustomBadgeYaml(index: number, yamlString: string): void;
}

function renderValidation(item: { _yaml_error?: string; yaml?: string }): TemplateResult | typeof nothing {
  return item._yaml_error
    ? html`<span style="color: var(--error-color);">&#x274C; ${item._yaml_error}</span>`
    : item.yaml
      ? html`<span style="color: var(--success-color, green);">&#x2705; ${localize('editor.yaml_valid')}</span>`
      : nothing;
}

export function renderCustomContentPanel(host: CustomContentPanelHost): TemplateResult {
  // Custom cards and sections are edited inside the weather-start layout; this
  // panel keeps their legacy list editors for that layout being disabled.
  const isWeatherStart = true;

  return html`
    <div class="section">
      <div class="section-title">${localize('editor.section_custom_content')}</div>
      <div class="description" style="margin-left: 0; margin-bottom: 12px;">
        ${localize('editor.section_custom_content_desc')}
      </div>
      ${
        isWeatherStart
          ? html`
              <div class="empty-state" style="margin-bottom: 12px;">
                ${localize('editor.custom_content_weather_start_hint')}
              </div>
            `
          : nothing
      }
      <div class="custom-content-grid">
        ${isWeatherStart ? nothing : renderCustomCardsSection(host, true)}
        ${isWeatherStart ? nothing : renderCustomSectionsSection(host, true)} ${renderCustomBadgesSection(host, true)}
        ${renderCustomViewsPanel(host.customViewsHost, true)}
      </div>
    </div>
  `;
}

export function renderCustomCardsSection(host: CustomContentPanelHost, nested = false): TemplateResult {
  const customCards = host._config.custom_cards || [];
  const customCardsHeading = host._config.custom_cards_heading || '';
  const customCardsIcon = host._config.custom_cards_icon || '';

  return html`
    <div class=${nested ? 'editor-subsection' : 'section'}>
      <div class=${nested ? 'subsection-title' : 'section-title'} style="display: flex; align-items: center; gap: 8px;">
        ${localize('editor.section_custom_cards')}
        <a
          href="https://github.com/Cyberhunter88/dashboard-strategy/blob/main/assets/Eigene-Karten-hinzufugen.gif"
          target="_blank"
          rel="noopener"
          style="color: var(--primary-color); text-decoration: none; font-size: 18px;"
          title=${localize('editor.video_tutorial')}
          >&#x1F3AC;</a
        >
      </div>
      <div class="custom-item-row" style="margin-bottom: 12px;">
        <input
          type="text"
          id="custom-cards-heading"
          .value=${customCardsHeading}
          placeholder=${localize('editor.custom_cards_heading_placeholder')}
          style="flex: 2;"
          @change=${(e: Event) => host._customCardsHeadingChanged(e)}
        />
        <input
          type="text"
          id="custom-cards-icon"
          .value=${customCardsIcon}
          placeholder="mdi:cards"
          style="flex: 1;"
          @change=${(e: Event) => host._customCardsIconChanged(e)}
        />
      </div>
      <div class="description" style="margin-bottom: 8px;">${localize('editor.custom_cards_desc')}</div>

      <div id="custom-cards-list">
        ${
          customCards.length === 0
            ? html`<div class="empty-state">${localize('editor.no_custom_cards')}</div>`
            : customCards.map((card, index) => renderCustomCardItem(host, card, index))
        }
      </div>

      <button class="btn-primary" style="margin-top: 8px;" @click=${() => host._openCardPickerForCustomCard()}>
        ${localize('editor.add_custom_card')}
      </button>
      <div class="description">${localize('editor.custom_cards_help')}</div>
    </div>
  `;
}

export function renderCustomSectionsSection(host: CustomContentPanelHost, nested = false): TemplateResult {
  const customSections = host._config.custom_sections || [];

  return html`
    <div class=${nested ? 'editor-subsection' : 'section'}>
      <div class=${nested ? 'subsection-title' : 'section-title'}>${localize('editor.section_custom_sections')}</div>
      <div class="description" style="margin-bottom: 8px;">${localize('editor.custom_sections_help')}</div>

      <div id="custom-sections-list">
        ${
          customSections.length === 0
            ? html`<div class="empty-state">${localize('editor.no_custom_sections')}</div>`
            : customSections.map((section, sectionIndex) => renderCustomSectionItem(host, section, sectionIndex))
        }
      </div>

      <button class="btn-primary" style="margin-top: 8px;" @click=${() => host._addCustomSection()}>
        ${localize('editor.add_custom_section')}
      </button>
    </div>
  `;
}

export function renderCustomBadgesSection(host: CustomContentPanelHost, nested = false): TemplateResult {
  const customBadges = host._config.custom_badges || [];

  return html`
    <div class=${nested ? 'editor-subsection' : 'section'}>
      <div class=${nested ? 'subsection-title' : 'section-title'} style="display: flex; align-items: center; gap: 8px;">
        ${localize('editor.section_custom_badges')}
        <a
          href="https://github.com/Cyberhunter88/dashboard-strategy/blob/main/assets/Custom-Badges-hinzufugen.gif"
          target="_blank"
          rel="noopener"
          style="color: var(--primary-color); text-decoration: none; font-size: 18px;"
          title=${localize('editor.video_tutorial')}
          >&#x1F3AC;</a
        >
      </div>

      <div id="custom-badges-list">
        ${
          customBadges.length === 0
            ? html`<div class="empty-state">${localize('editor.no_custom_badges')}</div>`
            : customBadges.map((badge, index) => renderCustomBadgeItem(host, badge, index))
        }
      </div>

      <button class="btn-primary" style="margin-top: 8px;" @click=${() => host._addCustomBadge()}>
        ${localize('editor.add_custom_badge')}
      </button>
      <div class="description">${localize('editor.custom_badges_help')}</div>
    </div>
  `;
}

function renderCustomCardItem(host: CustomContentPanelHost, card: CustomCard, index: number): TemplateResult {
  return html`
    <div class="custom-item" data-index=${index}>
      <div class="custom-item-header">
        <strong>${host._getCustomCardEditorLabel(card, localize('editor.new_card'))}</strong>
        <button class="btn-remove" @click=${() => host._removeCustomCard(index)}>&#x2715;</button>
      </div>
      <div class="custom-item-fields">
        <label>${localize('editor.card_editor_title_label')}</label>
        <input
          type="text"
          .value=${card.editor_title || ''}
          placeholder=${localize('editor.card_editor_title_placeholder')}
          @change=${(e: Event) =>
            host._updateCustomCardField(index, 'editor_title', (e.target as HTMLInputElement).value)}
        />
        <div class="description" style="margin: 0 0 4px 0;">${localize('editor.card_editor_title_help')}</div>
        <label>${localize('editor.card_dashboard_title_label')}</label>
        <input
          type="text"
          .value=${card.title || ''}
          placeholder=${localize('editor.card_title_placeholder')}
          @change=${(e: Event) => host._updateCustomCardField(index, 'title', (e.target as HTMLInputElement).value)}
        />
        <div class="custom-card-target">
          <label>${localize('editor.target_section')}:</label>
          <select
            @change=${(e: Event) =>
              host._updateCustomCardField(index, 'target_section', (e.target as HTMLSelectElement).value)}
          >
            ${(['custom_cards', 'overview', 'areas', 'weather', 'energy'] as const).map(
              (key) => html`
                <option value=${key} ?selected=${(card.target_section || 'custom_cards') === key}>
                  ${localize(host._sectionLabelKey(key))}
                </option>
              `
            )}
          </select>
        </div>
        <textarea
          rows="6"
          placeholder=${localize('editor.yaml_placeholder')}
          .value=${card.yaml || ''}
          style="width: 100%;"
          @change=${(e: Event) => host._updateCustomCardYaml(index, (e.target as HTMLTextAreaElement).value)}
        ></textarea>
        <button class="btn-primary" style="margin-top: 6px;" @click=${() => host._openCardEditorForCustomCard(index)}>
          ${localize('editor.edit_card_with_ha_editor')}
        </button>
        <div class="custom-item-validation">${renderValidation(card)}</div>
      </div>
    </div>
  `;
}

function renderSectionCardItem(
  host: CustomContentPanelHost,
  sectionIndex: number,
  card: CustomCard,
  cardIndex: number
): TemplateResult {
  return html`
    <div class="custom-item" data-index=${cardIndex} style="margin-bottom: 8px;">
      <div class="custom-item-header">
        <strong>${host._getCustomCardEditorLabel(card, `${localize('editor.new_card')} ${cardIndex + 1}`)}</strong>
        <button class="btn-remove" @click=${() => host._removeCardFromSection(sectionIndex, cardIndex)}>
          &#x2715;
        </button>
      </div>
      <div class="custom-item-fields">
        <label>${localize('editor.card_editor_title_label')}</label>
        <input
          type="text"
          .value=${card.editor_title || ''}
          placeholder=${localize('editor.card_editor_title_placeholder')}
          @change=${(e: Event) =>
            host._updateSectionCardField(sectionIndex, cardIndex, 'editor_title', (e.target as HTMLInputElement).value)}
        />
        <div class="description" style="margin: 0 0 4px 0;">${localize('editor.card_editor_title_help')}</div>
        <label>${localize('editor.card_dashboard_title_label')}</label>
        <input
          type="text"
          .value=${card.title || ''}
          placeholder=${localize('editor.card_title_placeholder')}
          @change=${(e: Event) =>
            host._updateSectionCardField(sectionIndex, cardIndex, 'title', (e.target as HTMLInputElement).value)}
        />
        <textarea
          rows="5"
          placeholder=${localize('editor.yaml_placeholder')}
          .value=${card.yaml || ''}
          style="width: 100%;"
          @change=${(e: Event) =>
            host._updateSectionCardYaml(sectionIndex, cardIndex, (e.target as HTMLTextAreaElement).value)}
        ></textarea>
        <button
          class="btn-primary"
          style="margin-top: 6px;"
          @click=${() => host._openCardEditorForSectionCard(sectionIndex, cardIndex)}
        >
          ${localize('editor.edit_card_with_ha_editor')}
        </button>
        <div class="custom-item-validation">${renderValidation(card)}</div>
      </div>
    </div>
  `;
}

function renderCustomSectionItem(
  host: CustomContentPanelHost,
  section: CustomSection,
  sectionIndex: number
): TemplateResult {
  const cards = section.cards || [];
  return html`
    <div class="custom-item" data-index=${sectionIndex} style="margin-bottom: 12px;">
      <div class="custom-item-header">
        <strong>${section.title || `${localize('editor.section_custom_sections')} ${sectionIndex + 1}`}</strong>
        <button class="btn-remove" @click=${() => host._removeCustomSection(sectionIndex)}>&#x2715;</button>
      </div>
      <div class="custom-item-fields">
        <textarea
          rows="8"
          placeholder="type: grid&#10;cards:&#10;  - type: tile&#10;    entity: light.example"
          .value=${section.yaml || ''}
          style="width: 100%;"
          @change=${(e: Event) => host._updateCustomSectionYaml(sectionIndex, (e.target as HTMLTextAreaElement).value)}
        ></textarea>
        <div class="custom-item-validation">${renderValidation(section)}</div>
        <div class="custom-item-row">
          <input
            type="text"
            .value=${section.title || ''}
            placeholder=${localize('editor.custom_section_title_placeholder')}
            style="flex: 2;"
            @change=${(e: Event) =>
              host._updateCustomSectionField(sectionIndex, 'title', (e.target as HTMLInputElement).value)}
          />
          <input
            type="text"
            .value=${section.icon || ''}
            placeholder=${localize('editor.custom_section_icon_placeholder')}
            style="flex: 1;"
            @change=${(e: Event) =>
              host._updateCustomSectionField(sectionIndex, 'icon', (e.target as HTMLInputElement).value)}
          />
        </div>
        <div style="margin-top: 8px; padding-left: 8px; border-left: 2px solid var(--divider-color, #e0e0e0);">
          ${cards.map((card, cardIndex) => renderSectionCardItem(host, sectionIndex, card, cardIndex))}
          <button
            class="btn-primary"
            style="margin-top: 4px;"
            @click=${() => host._openCardPickerForSection(sectionIndex)}
          >
            ${localize('editor.add_card_to_section')}
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderCustomBadgeItem(host: CustomContentPanelHost, badge: CustomBadge, index: number): TemplateResult {
  return html`
    <div class="custom-item" data-index=${index}>
      <div class="custom-item-header">
        <strong>Badge ${index + 1}</strong>
        <button class="btn-remove" @click=${() => host._removeCustomBadge(index)}>&#x2715;</button>
      </div>
      <textarea
        rows="4"
        placeholder="type: entity&#10;entity: sun.sun"
        .value=${badge.yaml || ''}
        style="width: 100%;"
        @change=${(e: Event) => host._updateCustomBadgeYaml(index, (e.target as HTMLTextAreaElement).value)}
      ></textarea>
      <div class="custom-item-validation">${renderValidation(badge)}</div>
    </div>
  `;
}
