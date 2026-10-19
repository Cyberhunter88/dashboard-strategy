import { describe, expect, it } from 'vitest';
import type { HomeAssistant } from '../types/homeassistant';
import { localize, setupLocalize } from './localize';

describe('locale selection', () => {
  const setLanguage = (language: string): void => {
    setupLocalize({ locale: { language }, language } as HomeAssistant);
  };

  it('uses the base language for regional Home Assistant codes', () => {
    setLanguage('de-DE');
    expect(localize('views.lights')).toBe('Lichter');
    setLanguage('pl_PL');
    expect(localize('views.lights')).toBe('Światła');
    setLanguage('hu-HU');
    expect(localize('views.lights')).toBe('Világítás');
  });

  it('falls back to English for unknown locales and missing keys', () => {
    setLanguage('fr-FR');
    expect(localize('views.lights')).toBe('Lights');
    setLanguage('ru-RU');
    expect(localize('views.cctv')).toBe('CCTV');
  });
});
