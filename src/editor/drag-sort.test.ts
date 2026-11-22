import { describe, expect, it, vi } from 'vitest';
import { createDragSortHandlers, moveKey } from './drag-sort';

describe('moveKey', () => {
  it('moves the dragged key to the drop position in both directions', () => {
    expect(moveKey(['a', 'b', 'c', 'd'], (key) => key, 'a', 'c')).toEqual(['b', 'c', 'a', 'd']);
    expect(moveKey(['a', 'b', 'c', 'd'], (key) => key, 'd', 'b')).toEqual(['a', 'd', 'b', 'c']);
  });

  it('works with keyed objects and returns null for unknown or equal keys', () => {
    const items = [{ id: 'x' }, { id: 'y' }];
    expect(moveKey(items, (item) => item.id, 'y', 'x')).toEqual([{ id: 'y' }, { id: 'x' }]);
    expect(moveKey(items, (item) => item.id, 'y', 'missing')).toBeNull();
    expect(moveKey(items, (item) => item.id, 'x', 'x')).toBeNull();
  });
});

/** Minimal DOM stand-ins: closest(), classList and dataset are all the handlers use. */
function fakeItem(key: string, isHandle = false) {
  const classes = new Set<string>();
  const item: Record<string, unknown> = {
    dataset: { key },
    classList: {
      add: (name: string) => classes.add(name),
      remove: (name: string) => classes.delete(name),
      contains: (name: string) => classes.has(name),
    },
  };
  item.closest = (selector: string) => (selector === '.drag-handle' ? (isHandle ? item : null) : item);
  return item as unknown as HTMLElement;
}
const dragEvent = (target: HTMLElement, currentTarget = target) =>
  ({
    target,
    currentTarget,
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
    dataTransfer: { setData: vi.fn(), effectAllowed: '', dropEffect: '' },
  }) as unknown as DragEvent;

describe('createDragSortHandlers', () => {
  it('reorders on drop between two items and cleans up classes', () => {
    const onReorder = vi.fn();
    const first = fakeItem('a', true);
    const second = fakeItem('b');
    const handlers = createDragSortHandlers({
      itemSelector: '.item',
      keyOf: (item) => item.dataset.key,
      clearScope: () => ({ querySelectorAll: () => [first, second] }) as unknown as ParentNode,
      onReorder,
    });

    handlers.onDragStart(dragEvent(first));
    expect(first.classList.contains('dragging')).toBe(true);
    handlers.onDragOver(dragEvent(second));
    expect(second.classList.contains('drag-over')).toBe(true);
    handlers.onDrop(dragEvent(second));
    expect(onReorder).toHaveBeenCalledWith('a', 'b', second);
    expect(second.classList.contains('drag-over')).toBe(false);
    handlers.onDragEnd(dragEvent(first));
    expect(first.classList.contains('dragging')).toBe(false);
  });

  it('only starts from the drag handle and ignores drops on itself', () => {
    const onReorder = vi.fn();
    const item = fakeItem('a', false);
    const handlers = createDragSortHandlers({
      itemSelector: '.item',
      keyOf: (el) => el.dataset.key,
      clearScope: () => null,
      onReorder,
    });
    const start = dragEvent(item);
    handlers.onDragStart(start);
    expect(start.preventDefault).toHaveBeenCalled();

    const handleItem = fakeItem('h', true);
    handlers.onDragStart(dragEvent(handleItem));
    handlers.onDrop(dragEvent(handleItem));
    expect(onReorder).not.toHaveBeenCalled();
  });
});
