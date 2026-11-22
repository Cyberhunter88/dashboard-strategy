// ====================================================================
// Editor translations
// ====================================================================
// Editor-only strings (`editor.*`) live in src/translations/editor/ and are
// registered here, so they ship with the on-demand editor chunk instead of
// the dashboard's eager core and language chunks. English is bundled with
// the editor; other languages load as small `lang-editor-*` chunks.
// Import this module for its side effect before rendering editor UI.
// ====================================================================

import * as en from '../translations/editor/en.json';
import { registerTranslationBundle } from '../utils/localize';

/** Resolves once the editor strings for the current language are available. */
export const editorTranslationsReady: Promise<void> = registerTranslationBundle(en, {
  de: () => import(/* webpackChunkName: "lang-editor-de" */ '../translations/editor/de.json'),
  hu: () => import(/* webpackChunkName: "lang-editor-hu" */ '../translations/editor/hu.json'),
  pl: () => import(/* webpackChunkName: "lang-editor-pl" */ '../translations/editor/pl.json'),
  ru: () => import(/* webpackChunkName: "lang-editor-ru" */ '../translations/editor/ru.json'),
});
