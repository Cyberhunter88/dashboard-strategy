import { html, nothing, type TemplateResult } from 'lit';
import type { Simon42StrategyConfig, StackKey } from '../../types/strategy';
import { localize } from '../../utils/localize';

const stackMeta = new Map<StackKey, { icon: string; labelKey: string }>([
  ['energy', { icon: 'mdi:lightning-bolt', labelKey: 'stacks.energy' }],
  ['cameras', { icon: 'mdi:cctv', labelKey: 'stacks.cameras' }],
  ['lights', { icon: 'mdi:lightbulb', labelKey: 'stacks.lights' }],
  ['locks', { icon: 'mdi:lock', labelKey: 'stacks.locks' }],
  ['climate', { icon: 'mdi:thermostat', labelKey: 'stacks.climate' }],
  ['covers', { icon: 'mdi:window-shutter', labelKey: 'stacks.covers' }],
  ['covers_window', { icon: 'mdi:window-open-variant', labelKey: 'stacks.covers_window' }],
  ['media', { icon: 'mdi:speaker', labelKey: 'stacks.media' }],
  ['scenes', { icon: 'mdi:palette', labelKey: 'stacks.scenes' }],
  ['switches', { icon: 'mdi:toggle-switch', labelKey: 'stacks.switches' }],
  ['misc', { icon: 'mdi:light-switch', labelKey: 'stacks.misc' }],
  ['room_pins', { icon: 'mdi:pin', labelKey: 'stacks.room_pins' }],
]);

export function presentStackKeys(
  groupedEntities: Record<string, string[]>,
  config: Simon42StrategyConfig
): Set<StackKey> {
  const present = new Set<StackKey>();
  const has = (key: string): boolean => (groupedEntities[key]?.length ?? 0) > 0;
  if (has('lights')) present.add('lights');
  if (has('locks')) present.add('locks');
  if (has('climate') || has('fan')) present.add('climate');
  if (has('covers') || has('covers_curtain')) present.add('covers');
  if (has('covers_window')) present.add('covers_window');
  if (has('media_player')) present.add('media');
  if (has('scenes') || has('automations') || has('scripts')) present.add('scenes');
  if (has('switches') && config.show_switches_section_in_rooms === true) present.add('switches');
  if (has('vacuum') || (has('switches') && config.show_switches_section_in_rooms !== true)) present.add('misc');
  if (has('energy')) present.add('energy');
  // Camera and pin availability cannot be inferred from this editor cache.
  if (config.show_cameras_in_rooms !== false) present.add('cameras');
  present.add('room_pins');
  return present;
}

export function moveVisibleStack(
  order: StackKey[],
  visible: Set<StackKey>,
  key: StackKey,
  direction: -1 | 1
): StackKey[] {
  const visibleOrder = order.filter((item) => visible.has(item));
  const index = visibleOrder.indexOf(key);
  const adjacent = visibleOrder[index + direction];
  if (index < 0 || !adjacent) return order;
  const result = [...order];
  const from = result.indexOf(key);
  const to = result.indexOf(adjacent);
  [result[from], result[to]] = [result[to], result[from]];
  return result;
}

export interface RoomStackOrderPanelOptions {
  areaId: string;
  order: StackKey[];
  visible: Set<StackKey>;
  onMove: (key: StackKey, direction: -1 | 1) => void;
  onDragStart: (event: DragEvent) => void;
  onDragEnd: (event: DragEvent) => void;
  onDragOver: (event: DragEvent) => void;
  onDragLeave: (event: DragEvent) => void;
  onDrop: (event: DragEvent) => void;
}

export function renderRoomStackOrderPanel(options: RoomStackOrderPanelOptions): TemplateResult {
  const { areaId, order, visible } = options;
  const visibleOrder = order.filter((key) => visible.has(key));
  const inactiveOrder = order.filter((key) => !visible.has(key));
  return html`
    <div class="entity-group" data-group="stack_order">
      <div class="entity-group-header">
        <ha-icon icon="mdi:sort"></ha-icon>
        <span class="group-name">${localize('editor.stack_order')}</span>
      </div>
      <div class="entity-list">
        <div class="description" style="margin-left: 0; margin-bottom: 8px;">
          ${localize('editor.stack_order_desc')}
        </div>
        <div class="section-order-list" data-area-id=${areaId}>
          ${visibleOrder.map((key, index) => {
            const meta = stackMeta.get(key);
            if (!meta) return nothing;
            return html`
              <div
                class="section-order-item"
                data-area-id=${areaId}
                data-stack-key=${key}
                draggable="true"
                @dragstart=${options.onDragStart}
                @dragend=${options.onDragEnd}
                @dragover=${options.onDragOver}
                @dragleave=${options.onDragLeave}
                @drop=${options.onDrop}
              >
                <span class="drag-handle" draggable="true">&#x2630;</span>
                <ha-icon class="section-icon" icon=${meta.icon}></ha-icon>
                <span class="section-label">${localize(meta.labelKey)}</span>
                <button
                  type="button"
                  class="stack-move-button"
                  aria-label=${`${localize(meta.labelKey)}: ${localize('editor.move_up')}`}
                  title=${localize('editor.move_up')}
                  ?disabled=${index === 0}
                  @click=${() => options.onMove(key, -1)}
                >
                  <ha-icon icon="mdi:chevron-up"></ha-icon>
                </button>
                <button
                  type="button"
                  class="stack-move-button"
                  aria-label=${`${localize(meta.labelKey)}: ${localize('editor.move_down')}`}
                  title=${localize('editor.move_down')}
                  ?disabled=${index === visibleOrder.length - 1}
                  @click=${() => options.onMove(key, 1)}
                >
                  <ha-icon icon="mdi:chevron-down"></ha-icon>
                </button>
              </div>
            `;
          })}
        </div>
        ${inactiveOrder.length > 0
          ? html`<div class="section-order-compact">
              <div class="compact-title">${localize('editor.stack_order_inactive')}</div>
              <div class="compact-chip-list">
                ${inactiveOrder.map((key) => {
                  const meta = stackMeta.get(key);
                  return meta
                    ? html`<span class="compact-chip"
                        ><ha-icon icon=${meta.icon}></ha-icon>${localize(meta.labelKey)}</span
                      >`
                    : nothing;
                })}
              </div>
            </div>`
          : nothing}
      </div>
    </div>
  `;
}
