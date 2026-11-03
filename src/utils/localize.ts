// ====================================================================
// Localization Utility (i18n)
// ====================================================================
// Singleton localization function. Reads hass.locale.language once at
// setup time. English is bundled; other languages load on demand as
// separate chunks. Falls back to English for missing keys/languages.
// Pattern adapted from mushroom-strategy.
// ====================================================================

import * as en from '../translations/en.json';
import type { HomeAssistant } from '../types/homeassistant';

type TranslationModule = { default?: unknown } & Record<string, unknown>;

const DEFAULT_LANG = 'en';
const languages: Record<string, unknown> = { en };

// Non-English translations are separate async chunks (see webpack.config.ts).
const languageLoaders: Record<string, () => Promise<TranslationModule>> = {
  de: () => import(/* webpackChunkName: "lang-de" */ '../translations/de.json'),
  hu: () => import(/* webpackChunkName: "lang-hu" */ '../translations/hu.json'),
  pl: () => import(/* webpackChunkName: "lang-pl" */ '../translations/pl.json'),
  ru: () => import(/* webpackChunkName: "lang-ru" */ '../translations/ru.json'),
};

const pendingLoads = new Map<string, Promise<void>>();
const listeners = new Set<() => void>();
let currentLang = DEFAULT_LANG;

function resolveLanguage(hass?: HomeAssistant): string {
  return (hass?.locale?.language || hass?.language || DEFAULT_LANG).toLowerCase().split(/[-_]/)[0];
}

function getTranslatedString(key: string, lang: string): string | undefined {
  try {
    return key.split('.').reduce((o, i) => (o as Record<string, unknown>)[i], languages[lang]) as string;
  } catch {
    return undefined;
  }
}

function ensureLanguageLoaded(lang: string): Promise<void> {
  const loader = languageLoaders[lang];
  if (!loader || languages[lang]) return Promise.resolve();
  let pending = pendingLoads.get(lang);
  if (!pending) {
    pending = loader()
      .then((module) => {
        languages[lang] = module.default ?? module;
        if (lang === currentLang) for (const listener of listeners) listener();
      })
      .catch(() => undefined) // keep the English fallback; retry on the next request
      .finally(() => pendingLoads.delete(lang));
    pendingLoads.set(lang, pending);
  }
  return pending;
}

let _localize: ((key: string) => string) | undefined;

/**
 * Initialize localization from the hass object (synchronous).
 * Uses already loaded languages and falls back to English; a missing language
 * is requested in the background and subscribers are notified once it arrives.
 */
export function setupLocalize(hass?: HomeAssistant): void {
  const lang = resolveLanguage(hass);
  currentLang = lang;
  void ensureLanguageLoaded(lang);
  _localize = (key: string) => getTranslatedString(key, lang) ?? getTranslatedString(key, DEFAULT_LANG) ?? key;
}

/** Load the hass language (if supported) and initialize localization. */
export async function loadLanguage(hass?: HomeAssistant): Promise<void> {
  await ensureLanguageLoaded(resolveLanguage(hass));
  setupLocalize(hass);
}

/** Subscribe to late language loads, e.g. to request a re-render. Returns an unsubscribe function. */
export function onLanguageLoaded(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Translate a key using dot notation (e.g. 'views.lights').
 * Returns the key itself if no translation is found.
 */
export function localize(key: string): string {
  if (!_localize) return key;
  return _localize(key);
}
