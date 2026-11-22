// ====================================================================
// Drag-and-drop sorting for editor lists
// ====================================================================
// One implementation for the sortable editor lists (areas, room stacks,
// weather-start layout). Dragging starts only from a `.drag-handle`; the
// dragged item gets `dragging`, the hovered target `drag-over`. The new
// order is computed from the config (never from the DOM) by the caller's
// onReorder callback, usually with moveKey().
// ====================================================================

export interface DragSortHandlers {
  onDragStart: (ev: DragEvent) => void;
  onDragEnd: (ev: DragEvent) => void;
  onDragOver: (ev: DragEvent) => void;
  onDragLeave: (ev: DragEvent) => void;
  onDrop: (ev: DragEvent) => void;
}

export interface DragSortOptions {
  /** Selector of a sortable list item, e.g. `.area-item`. */
  itemSelector: string;
  /** Stable key of an item element, usually a data attribute. */
  keyOf: (item: HTMLElement) => string | undefined;
  /** Container whose items lose `drag-over` when dragging ends. */
  clearScope: () => ParentNode | null | undefined;
  /** Called when an item is dropped on another one. */
  onReorder: (draggedKey: string, dropKey: string, dropTarget: HTMLElement) => void;
}

/** Move `draggedKey` to the position of `dropKey`; null when either is missing or both are equal. */
export function moveKey<T>(
  items: readonly T[],
  keyOf: (item: T) => string,
  draggedKey: string,
  dropKey: string
): T[] | null {
  const draggedIndex = items.findIndex((item) => keyOf(item) === draggedKey);
  const dropIndex = items.findIndex((item) => keyOf(item) === dropKey);
  if (draggedIndex === -1 || dropIndex === -1 || draggedIndex === dropIndex) return null;
  const next = [...items];
  const [dragged] = next.splice(draggedIndex, 1);
  next.splice(dropIndex, 0, dragged);
  return next;
}

/** Create the five drag event handlers for one sortable list. */
export function createDragSortHandlers(options: DragSortOptions): DragSortHandlers {
  let dragged: HTMLElement | null = null;

  return {
    onDragStart: (ev) => {
      const target = ev.target as HTMLElement;
      const item = target.closest('.drag-handle') ? (target.closest(options.itemSelector) as HTMLElement | null) : null;
      if (!item) {
        ev.preventDefault();
        return;
      }
      item.classList.add('dragging');
      if (ev.dataTransfer) {
        ev.dataTransfer.effectAllowed = 'move';
        ev.dataTransfer.setData('text/plain', options.keyOf(item) || '');
      }
      dragged = item;
    },

    onDragEnd: (ev) => {
      (ev.target as HTMLElement).closest(options.itemSelector)?.classList.remove('dragging');
      options
        .clearScope()
        ?.querySelectorAll(options.itemSelector)
        .forEach((el) => el.classList.remove('drag-over'));
      dragged = null;
    },

    onDragOver: (ev) => {
      ev.preventDefault();
      if (ev.dataTransfer) ev.dataTransfer.dropEffect = 'move';
      const item = ev.currentTarget as HTMLElement;
      if (item !== dragged) item.classList.add('drag-over');
    },

    onDragLeave: (ev) => {
      (ev.currentTarget as HTMLElement).classList.remove('drag-over');
    },

    onDrop: (ev) => {
      ev.stopPropagation();
      ev.preventDefault();
      const dropTarget = ev.currentTarget as HTMLElement;
      dropTarget.classList.remove('drag-over');
      if (!dragged || dragged === dropTarget) return;
      const draggedKey = options.keyOf(dragged);
      const dropKey = options.keyOf(dropTarget);
      if (!draggedKey || !dropKey) return;
      options.onReorder(draggedKey, dropKey, dropTarget);
    },
  };
}
