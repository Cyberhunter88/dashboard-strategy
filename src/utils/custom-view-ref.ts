import type { HomeAssistant } from '../types/homeassistant';
import type { LovelaceViewConfig } from '../types/lovelace';
import type { CustomView } from '../types/strategy';
import { localize } from './localize';

export const DEFAULT_DASHBOARD_SENTINEL = 'lovelace';

interface FetchedDashboard {
  views?: LovelaceViewConfig[];
  isStrategy?: boolean;
  error?: boolean;
}

export function isRefView(view: CustomView): boolean {
  return typeof view.ref_dashboard === 'string' && view.ref_dashboard !== '';
}

async function fetchDashboardConfig(hass: HomeAssistant, urlPath: string): Promise<FetchedDashboard> {
  try {
    const config = await hass.callWS<{ views?: LovelaceViewConfig[]; strategy?: unknown }>({
      type: 'lovelace/config',
      url_path: urlPath === DEFAULT_DASHBOARD_SENTINEL ? null : urlPath,
    });
    if (config.strategy) return { isStrategy: true };
    return { views: config.views || [] };
  } catch {
    return { error: true };
  }
}

function findReferencedView(views: LovelaceViewConfig[], refView: string): LovelaceViewConfig | undefined {
  const byPath = views.find((view) => view.path === refView);
  if (byPath) return byPath;
  if (/^\d+$/.test(refView)) return views[Number(refView)];
  return undefined;
}

function buildErrorView(cv: CustomView, messageKey: string): LovelaceViewConfig {
  const source = `\`${cv.ref_dashboard ?? '?'}\` -> \`${cv.ref_view ?? '?'}\``;
  return {
    type: 'sections',
    max_columns: 1,
    sections: [{
      type: 'grid',
      cards: [{
        type: 'markdown',
        content: `**${localize('custom_views.ref_error_title')}**\n\n${localize(messageKey)}\n\n${source}`,
      }],
    }],
  };
}

function resolveRefView(cv: CustomView, dashboard: FetchedDashboard): LovelaceViewConfig {
  if (dashboard.error) return buildErrorView(cv, 'custom_views.ref_error_dashboard');
  if (dashboard.isStrategy) return buildErrorView(cv, 'custom_views.ref_error_strategy');
  const view = findReferencedView(dashboard.views || [], cv.ref_view || '');
  return view || buildErrorView(cv, 'custom_views.ref_error_view');
}

/** Resolve YAML and dashboard-reference custom views while preserving their configured order. */
export async function resolveCustomViews(
  customViews: CustomView[],
  hass: HomeAssistant
): Promise<LovelaceViewConfig[]> {
  const refDashboards = new Set<string>();
  for (const view of customViews) {
    if (isRefView(view) && view.ref_view && view.title && view.path) refDashboards.add(view.ref_dashboard as string);
  }

  const fetched = new Map<string, FetchedDashboard>();
  await Promise.all([...refDashboards].map(async (urlPath) => {
    fetched.set(urlPath, await fetchDashboardConfig(hass, urlPath));
  }));

  const resolved: LovelaceViewConfig[] = [];
  for (const view of customViews) {
    if (!view.title || !view.path) continue;
    if (isRefView(view)) {
      if (!view.ref_view) continue;
      const dashboard = fetched.get(view.ref_dashboard as string);
      if (!dashboard) continue;
      resolved.push({
        ...resolveRefView(view, dashboard),
        title: view.title,
        path: view.path,
        icon: view.icon || 'mdi:link-variant',
      });
    } else if (view.parsed_config) {
      resolved.push({
        ...view.parsed_config,
        title: view.title,
        path: view.path,
        icon: view.icon || 'mdi:card-text-outline',
      });
    }
  }
  return resolved;
}

/**
 * Insert resolved custom views after their configured anchors. Unknown or
 * missing anchors preserve the previous append-at-end behavior.
 */
export function insertCustomViews(
  views: LovelaceViewConfig[],
  customViews: CustomView[],
  resolvedViews: LovelaceViewConfig[]
): LovelaceViewConfig[] {
  const anchorByPath = new Map<string, string>();
  for (const customView of customViews) {
    if (customView.path && customView.after_view) {
      anchorByPath.set(customView.path, customView.after_view);
    }
  }

  const insertedPerAnchor = new Map<string, number>();
  for (const view of resolvedViews) {
    const anchor = view.path ? anchorByPath.get(view.path) : undefined;
    const anchorIndex = anchor ? views.findIndex((candidate) => candidate.path === anchor) : -1;
    if (anchor !== undefined && anchorIndex >= 0) {
      const offset = insertedPerAnchor.get(anchor) ?? 0;
      views.splice(anchorIndex + 1 + offset, 0, view);
      insertedPerAnchor.set(anchor, offset + 1);
    } else {
      views.push(view);
    }
  }
  return views;
}
