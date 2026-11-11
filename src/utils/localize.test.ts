import { describe, expect, it, vi } from 'vitest';
import type { HomeAssistant } from '../types/homeassistant';
import { loadLanguage, localize, onLanguageLoaded, setupLocalize } from './localize';

const hassFor = (language: string): HomeAssistant => ({ locale: { language }, language }) as HomeAssistant;

describe('locale selection', () => {
  it('uses the base language for regional Home Assistant codes', async () => {
    await loadLanguage(hassFor('de-DE'));
    expect(localize('views.lights')).toBe('Lichter');
    await loadLanguage(hassFor('pl_PL'));
    expect(localize('views.lights')).toBe('Światła');
    await loadLanguage(hassFor('hu-HU'));
    expect(localize('views.lights')).toBe('Világítás');
  });

  it('falls back to English for unknown locales and missing keys', async () => {
    await loadLanguage(hassFor('fr-FR'));
    expect(localize('views.lights')).toBe('Lights');
    expect(localize('views.cctv')).toBe('CCTV');
  });

  it('uses the Russian translation, including the CCTV view label', async () => {
    await loadLanguage(hassFor('ru-RU'));
    expect(localize('views.cctv')).toBe('Видеонаблюдение');
  });

  it('shows English until a requested language has loaded, then notifies subscribers', async () => {
    // Fresh module instance so no language is cached yet.
    vi.resetModules();
    const fresh = await import('./localize');
    const listener = vi.fn();
    const unsubscribe = fresh.onLanguageLoaded(listener);
    fresh.setupLocalize(hassFor('de'));
    expect(fresh.localize('views.lights')).toBe('Lights');
    await vi.waitFor(() => expect(listener).toHaveBeenCalledTimes(1));
    expect(fresh.localize('views.lights')).toBe('Lichter');
    unsubscribe();
  });

  it('returns the key instead of a translation group object', async () => {
    await loadLanguage(hassFor('en'));
    // Keys are built dynamically so the translation lint does not treat them as real keys.
    const groupKey = ['views'].join('.');
    const tooDeepKey = ['views', 'lights', 'missing'].join('.');
    expect(localize(groupKey)).toBe(groupKey);
    expect(localize(tooDeepKey)).toBe(tooDeepKey);
  });

  it('keeps the active language when setupLocalize is repeated for every hass update', async () => {
    await loadLanguage(hassFor('de'));
    setupLocalize(hassFor('de'));
    setupLocalize(hassFor('de-DE'));
    expect(localize('views.lights')).toBe('Lichter');
    setupLocalize(hassFor('en'));
    expect(localize('views.lights')).toBe('Lights');
  });

  it('does not notify unsubscribed listeners and keeps setupLocalize synchronous', () => {
    const listener = vi.fn();
    onLanguageLoaded(listener)();
    expect(() => setupLocalize(hassFor('en'))).not.toThrow();
    expect(listener).not.toHaveBeenCalled();
  });
});
