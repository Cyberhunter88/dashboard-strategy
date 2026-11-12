// @vitest-environment happy-dom
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { makeHass } from '../../tests/fixtures/hass';
import type { HomeAssistant } from '../types/homeassistant';
import type { Simon42StrategyConfig } from '../types/strategy';
import { setupLocalize } from '../utils/localize';
import './StrategyEditor';

interface EditorElement extends HTMLElement {
  hass: HomeAssistant;
  setConfig(config: Simon42StrategyConfig): void;
  updateComplete: Promise<boolean>;
  _expandedPanels: Set<string>;
}

async function mountEditor(config: Simon42StrategyConfig): Promise<EditorElement> {
  const editor = document.createElement('dashboard-strategy-editor') as EditorElement;
  editor.setConfig(config);
  editor.hass = makeHass();
  document.body.appendChild(editor);
  await editor.updateComplete;
  return editor;
}

async function typeQuery(editor: EditorElement, value: string): Promise<void> {
  const input = editor.shadowRoot?.querySelector<HTMLInputElement>('.option-search-input');
  if (!input) throw new Error('search input missing');
  input.value = value;
  input.dispatchEvent(new Event('input'));
  await editor.updateComplete;
}

const resultKeys = (editor: EditorElement): string[] =>
  [...(editor.shadowRoot?.querySelectorAll<HTMLElement>('.option-search-result code') ?? [])].map(
    (code) => code.textContent ?? ''
  );

beforeAll(() => setupLocalize({ language: 'en', locale: { language: 'en' } } as HomeAssistant));
afterEach(() => {
  document.body.innerHTML = '';
});

describe('editor option search', () => {
  it('shows no results until something is typed', async () => {
    const editor = await mountEditor({});
    expect(editor.shadowRoot?.querySelector('.option-search-input')).toBeTruthy();
    expect(resultKeys(editor)).toEqual([]);
  });

  it('lists matching options and opens the panel that holds the option', async () => {
    const editor = await mountEditor({});
    await typeQuery(editor, 'show_windows_summary');
    expect(resultKeys(editor)).toContain('show_windows_summary');

    editor.shadowRoot?.querySelector<HTMLButtonElement>('.option-search-result')?.click();
    await editor.updateComplete;
    expect(editor._expandedPanels.has('summaries')).toBe(true);
  });

  it('reports an empty search and lists changed options only on request', async () => {
    const editor = await mountEditor({ show_windows_summary: true });
    await typeQuery(editor, 'zzzunknown');
    expect(editor.shadowRoot?.querySelector('.option-search-results')).toBeNull();
    expect(editor.shadowRoot?.textContent).toContain('No results found');

    await typeQuery(editor, '');
    const toggle = editor.shadowRoot?.querySelector<HTMLInputElement>('#option-search-changed');
    toggle?.click();
    await editor.updateComplete;
    expect(resultKeys(editor)).toEqual(['show_windows_summary']);
  });
});
