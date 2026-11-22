// ====================================================================
// Localization Utility (i18n)
// ====================================================================
// Singleton localization function. Reads hass.locale.language once at
// setup time. English is bundled; other languages load on demand as
// separate chunks. Falls back to English for missing keys/languages.
// The editor registers its own translation bundle (registerTranslationBundle)
// so editor-only strings never load with the dashboard.
// Pattern adapted from mushroom-strategy.
// ====================================================================

import * as en from '../translations/en.json';
import type { HomeAssistant } from '../types/homeassistant';

type TranslationModule = { default?: unknown } & Record<string, unknown>;
type TranslationLoader = () => Promise<TranslationModule>;

/** A translation bundle: loaded languages plus loaders for the others. */
interface TranslationBundle {
  languages: Record<string, unknown>;
  loaders: Record<string, TranslationLoader>;
}

const DEFAULT_LANG = 'en';
// Dashboard (runtime) strings. Non-English languages are separate async
// chunks (see webpack.config.ts).
const runtimeBundle: TranslationBundle = {
  languages: { en },
  loaders: {
    de: () => import(/* webpackChunkName: "lang-de" */ '../translations/de.json'),
    hu: () => import(/* webpackChunkName: "lang-hu" */ '../translations/hu.json'),
    pl: () => import(/* webpackChunkName: "lang-pl" */ '../translations/pl.json'),
    ru: () => import(/* webpackChunkName: "lang-ru" */ '../translations/ru.json'),
  },
};
const bundles: TranslationBundle[] = [runtimeBundle];

const pendingLoads = new Map<string, Promise<void>>();
const listeners = new Set<() => void>();
let currentLang = DEFAULT_LANG;

function resolveLanguage(hass?: HomeAssistant): string {
  return (hass?.locale?.language || hass?.language || DEFAULT_LANG).toLowerCase().split(/[-_]/)[0];
}

function lookup(tree: unknown, key: string): string | undefined {
  let node = tree;
  for (const part of key.split('.')) {
    if (node === null || typeof node !== 'object') return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  // A key that only names a group (e.g. 'views') is not a translation.
  return typeof node === 'string' ? node : undefined;
}

function getTranslatedString(key: string, lang: string): string | undefined {
  for (const bundle of bundles) {
    const value = lookup(bundle.languages[lang], key);
    if (value !== undefined) return value;
  }
  return undefined;
}

/** Whether a language still has a bundle that can load but has not. */
function hasMissingBundle(lang: string): boolean {
  return bundles.some((bundle) => !!bundle.loaders[lang] && !bundle.languages[lang]);
}

function ensureBundleLoaded(bundle: TranslationBundle, index: number, lang: string): Promise<void> {
  const loader = bundle.loaders[lang];
  if (!loader || bundle.languages[lang]) return Promise.resolve();
  const pendingKey = `${index}:${lang}`;
  let pending = pendingLoads.get(pendingKey);
  if (!pending) {
    pending = loader()
      .then((module) => {
        bundle.languages[lang] = module.default ?? module;
        if (lang === currentLang) for (const listener of listeners) listener();
      })
      .catch(() => undefined) // keep the English fallback; retry on the next request
      .finally(() => pendingLoads.delete(pendingKey));
    pendingLoads.set(pendingKey, pending);
  }
  return pending;
}

function ensureLanguageLoaded(lang: string): Promise<void> {
  return Promise.all(bundles.map((bundle, index) => ensureBundleLoaded(bundle, index, lang))).then(() => undefined);
}

/**
 * Add a translation bundle, e.g. the editor-only strings that ship with the
 * editor chunk. `en` is the bundled English fallback; other languages load
 * through `loaders`. The current language is requested right away.
 */
export function registerTranslationBundle(en: unknown, loaders: Record<string, TranslationLoader>): Promise<void> {
  const bundle: TranslationBundle = { languages: { en }, loaders };
  bundles.push(bundle);
  return ensureBundleLoaded(bundle, bundles.length - 1, currentLang);
}

let _localize: ((key: string) => string) | undefined;

/**
 * Initialize localization from the hass object (synchronous).
 * Uses already loaded languages and falls back to English; a missing language
 * is requested in the background and subscribers are notified once it arrives.
 */
export function setupLocalize(hass?: HomeAssistant): void {
  const lang = resolveLanguage(hass);
  // Cards call this on every hass update; nothing to do while the language is unchanged and loaded.
  if (_localize && lang === currentLang && !hasMissingBundle(lang)) return;
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
