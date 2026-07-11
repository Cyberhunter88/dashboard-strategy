import { html, nothing, type TemplateResult } from 'lit';

export interface CollapsiblePanelHost {
  _expandedPanels: Set<string>;
  requestUpdate(): void;
}

export interface PanelMeta {
  key: string;
  icon: string;
  label: string;
}

const STORAGE_KEY = 'dashboard-strategy-editor-expanded-panels';

export function loadExpandedPanels(): Set<string> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return new Set(parsed.filter((key): key is string => typeof key === 'string'));
    }
  } catch {
    // Storage can be unavailable in private browser contexts.
  }
  return new Set();
}

function persistExpandedPanels(expanded: Set<string>): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...expanded]));
  } catch {
    // Keep the in-memory state when persistence is unavailable.
  }
}

function togglePanel(host: CollapsiblePanelHost, key: string): void {
  if (host._expandedPanels.has(key)) host._expandedPanels.delete(key);
  else host._expandedPanels.add(key);
  persistExpandedPanels(host._expandedPanels);
  host.requestUpdate();
}

export function renderCollapsiblePanel(
  host: CollapsiblePanelHost,
  meta: PanelMeta,
  body: () => TemplateResult
): TemplateResult {
  const expanded = host._expandedPanels.has(meta.key);
  return html`
    <div class="section panel${expanded ? '' : ' collapsed'}">
      <button
        type="button"
        class="panel-header"
        aria-expanded=${expanded ? 'true' : 'false'}
        @click=${() => togglePanel(host, meta.key)}
      >
        <ha-icon class="panel-icon" icon=${meta.icon}></ha-icon>
        <span class="panel-title">${meta.label}</span>
        <ha-icon class="panel-chevron" icon="mdi:chevron-down"></ha-icon>
      </button>
      ${expanded ? html`<div class="panel-body">${body()}</div>` : nothing}
    </div>
  `;
}
