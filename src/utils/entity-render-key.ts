/**
 * Creates a stable comparison key for a rendered entity collection.
 *
 * Keeping the entity id and its structural fingerprint together lets pooled
 * cards skip DOM reconciliation for state-only updates while still reacting
 * when their layout-relevant metadata changes.
 */
export function createEntityRenderKey(
  entityIds: Iterable<string>,
  getStructuralFingerprint: (entityId: string) => unknown
): string {
  return JSON.stringify(
    Array.from(entityIds, (entityId) => [entityId, getStructuralFingerprint(entityId)])
  );
}
