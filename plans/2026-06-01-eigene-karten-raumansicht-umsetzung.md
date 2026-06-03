# Eigene Karten & Kacheln in Raum-Detailansichten — Umsetzungsplan

> **Für agentische Worker:** ERFORDERLICHE SUB-SKILL: Nutze superpowers:subagent-driven-development (empfohlen) oder superpowers:executing-plans, um diesen Plan Aufgabe für Aufgabe umzusetzen. Schritte verwenden Checkbox-Syntax (`- [ ]`) zur Nachverfolgung.

**Ziel:** Nutzer können pro HA-Bereich in der Raum-Detailansicht eigene Karten/Kacheln (freies YAML oder geführte Entity-Kachel) oberhalb oder unterhalb der Auto-Sektionen anlegen.

**Architektur:** `areas_options[area_id].custom_cards[]` speichert die Einträge. `RoomViewStrategy.generate()` injiziert je eine Sammel-Section für Position `top` und `bottom`. Der Entry-Point reicht die Karten durch. Der Editor erhält pro Bereich eine Subsektion „Eigene Karten" mit YAML-Textarea bzw. nativem Entity-`<select>`.

**Tech-Stack:** TypeScript (ES2020, strict), Webpack Code-Splitting, LitElement, js-yaml, HA Lovelace Sections-View.

**Verifikation (kein Test-Framework vorhanden):** Jede Aufgabe wird über `npm run build-dev` (ts-loader Typecheck via Webpack) **und** `npm run lint` (eslint) abgesichert. Manuelles Live-Testen erfolgt am Ende gemäß CLAUDE.md-Workflow (Deploy nach `/config/www/community/dashboard-strategy/`).

**Referenz-Designdokument:** `plans/2026-06-01-eigene-karten-raumansicht-design.md`

---

## Dateien-Übersicht

| Datei | Verantwortung / Änderung |
|-------|--------------------------|
| `src/types/strategy.ts` | Neuer Typ `AreaCustomCard`; `AreaOptions.custom_cards?` |
| `src/views/RoomViewStrategy.ts` | Hilfsfunktion + Top-/Bottom-Sammel-Section-Injektion |
| `src/dashboard-strategy.ts` | `custom_cards` durchreichen + Versions-Bump |
| `src/editor/StrategyEditor.ts` | Subsektion „Eigene Karten" pro Bereich + area-scoped Handler |
| `src/translations/de.json` / `en.json` | Editor-Labels |
| `package.json` | Versions-Bump (Minor) |

---

## Task 1: Config-Typ `AreaCustomCard` + `AreaOptions.custom_cards`

**Files:**
- Modify: `src/types/strategy.ts:92-94` (AreaOptions) und neuer Block nach `CustomCard` (~`:146`)

- [ ] **Step 1: `AreaCustomCard`-Interface hinzufügen**

Direkt nach dem bestehenden `CustomCard`-Block (nach Zeile 146) einfügen:

```ts
// -- Area Custom Cards (per-area room view) ---------------------------

export interface AreaCustomCard {
  /** Eingabemodus: freies YAML oder geführte Entity-Kachel */
  mode?: 'yaml' | 'tile'; // default: 'yaml'
  /** Platzierung relativ zu den Auto-Sektionen der Raumansicht */
  position?: 'top' | 'bottom'; // default: 'bottom'
  /** Optionale Überschrift (rendert als heading-Card davor) */
  title?: string;
  // --- YAML-Modus ---
  /** Roh-YAML-String aus dem Editor */
  yaml?: string;
  /** Geparste Lovelace-Card-Config (aus yaml erzeugt) */
  parsed_config?: Record<string, any> | null;
  /** YAML-Parse-Fehlermeldung, falls vorhanden */
  _yaml_error?: string;
  // --- Geführter Kachel-Modus ---
  /** Entity-ID für `{ type: 'tile', entity }` */
  entity?: string;
}
```

- [ ] **Step 2: `AreaOptions` erweitern**

Ersetze den Block bei Zeile 92-94:

```ts
export interface AreaOptions {
  groups_options?: Record<string, GroupOptions>;
}
```

durch:

```ts
export interface AreaOptions {
  groups_options?: Record<string, GroupOptions>;
  custom_cards?: AreaCustomCard[];
}
```

- [ ] **Step 3: Build + Lint**

Run: `npm run build-dev`
Expected: erfolgreicher Build ohne Typfehler.

Run: `npm run lint`
Expected: keine neuen Fehler.

- [ ] **Step 4: Commit**

```bash
git add src/types/strategy.ts
git commit -m "feat(types): AreaCustomCard + AreaOptions.custom_cards"
```

---

## Task 2: Injektion der Custom-Cards in `RoomViewStrategy`

**Files:**
- Modify: `src/views/RoomViewStrategy.ts` (Lese der Config bei ~`:77`, Hilfsfunktion oberhalb der Klasse, Injektion bei `:437` und `:788`)

- [ ] **Step 1: Import des Typs sicherstellen**

Prüfe den bestehenden Import aus `../types/strategy` in `RoomViewStrategy.ts`. Füge `AreaCustomCard` zur Import-Liste hinzu (oder ergänze einen `import type { AreaCustomCard } from '../types/strategy';`, falls noch kein Strategy-Type-Import existiert).

- [ ] **Step 2: Modul-lokale Hilfsfunktion hinzufügen**

Oberhalb der Klassendeklaration `Simon42ViewRoomStrategy` (nach den Imports) einfügen:

```ts
/**
 * Baut aus den AreaCustomCard-Einträgen einer Position (top/bottom) genau
 * eine grid-Sammel-Section. Gibt [] zurück, wenn keine gültige Karte vorliegt.
 * Defensiv: ungültige/leere Einträge werden übersprungen (kein Crash).
 */
function buildAreaCustomCardSection(
  cards: AreaCustomCard[],
  position: 'top' | 'bottom'
): LovelaceSectionConfig[] {
  const built: LovelaceCardConfig[] = [];

  for (const card of cards) {
    if ((card.position || 'bottom') !== position) continue;

    let cardConfig: LovelaceCardConfig | null = null;
    if ((card.mode || 'yaml') === 'tile') {
      if (card.entity) {
        cardConfig = { type: 'tile', entity: card.entity };
      }
    } else {
      // YAML-Modus: nur fehlerfreie, geparste Configs verwenden
      if (card.parsed_config && !card._yaml_error && typeof card.parsed_config === 'object') {
        cardConfig = card.parsed_config as LovelaceCardConfig;
      }
    }

    if (!cardConfig) continue;

    if (card.title) {
      built.push({ type: 'heading', heading: card.title });
    }
    built.push(cardConfig);
  }

  if (built.length === 0) return [];
  return [{ type: 'grid', cards: built }];
}
```

- [ ] **Step 3: Custom-Cards aus der Config lesen**

In `generate()`, in der Nähe von Zeile 77 (wo `groups_options` gelesen wird), ergänzen:

```ts
const customCards: AreaCustomCard[] = config.custom_cards || [];
```

- [ ] **Step 4: Top-Section voranstellen**

Ersetze Zeile 437:

```ts
    const sections: LovelaceSectionConfig[] = [];
```

durch:

```ts
    const sections: LovelaceSectionConfig[] = [
      ...buildAreaCustomCardSection(customCards, 'top'),
    ];
```

- [ ] **Step 5: Bottom-Section anhängen**

Ersetze Zeile 788:

```ts
    return { type: 'sections', header: { badges_position: 'bottom' }, sections, badges };
```

durch:

```ts
    sections.push(...buildAreaCustomCardSection(customCards, 'bottom'));
    return { type: 'sections', header: { badges_position: 'bottom' }, sections, badges };
```

- [ ] **Step 6: Build + Lint**

Run: `npm run build-dev`
Expected: erfolgreicher Build (`LovelaceSectionConfig`/`LovelaceCardConfig` sind bereits importiert).

Run: `npm run lint`
Expected: keine neuen Fehler.

- [ ] **Step 7: Commit**

```bash
git add src/views/RoomViewStrategy.ts
git commit -m "feat(room-view): inject top/bottom custom card sections"
```

---

## Task 3: Custom-Cards im Entry-Point durchreichen

**Files:**
- Modify: `src/dashboard-strategy.ts:93-105` (room-config loop)

- [ ] **Step 1: `custom_cards` an die Room-Strategy übergeben**

Ersetze den Block bei Zeile 96-103:

```ts
        return roomStrategy.generate(
          {
            area,
            groups_options: areaOptions?.groups_options || {},
            dashboardConfig: config,
          },
          hass
        );
```

durch:

```ts
        return roomStrategy.generate(
          {
            area,
            groups_options: areaOptions?.groups_options || {},
            custom_cards: areaOptions?.custom_cards || [],
            dashboardConfig: config,
          },
          hass
        );
```

- [ ] **Step 2: Build + Lint**

Run: `npm run build-dev`
Expected: erfolgreicher Build.

Run: `npm run lint`
Expected: keine neuen Fehler.

- [ ] **Step 3: Commit**

```bash
git add src/dashboard-strategy.ts
git commit -m "feat(entry): pass area custom_cards to room view strategy"
```

---

## Task 4: Editor — area-scoped Handler

**Files:**
- Modify: `src/editor/StrategyEditor.ts` (neue Handler im Custom-Cards-Handler-Bereich, ~nach `:2464`)

> **Wichtig (Komplexitäts-Hotspot, CLAUDE.md):** Handler exakt am bestehenden Muster ausrichten, Expand-State (`_expandedAreas`, `_expandedGroups`, `_areaEntitiesCache`) **nicht** anfassen. Schreibe immer per `_fireConfigChanged` und folge dem delete-when-empty-Muster aus `_updateEntityConfig`.

- [ ] **Step 1: Import `AreaCustomCard` ergänzen**

Erweitere den bestehenden Typ-Import aus `../types/strategy` in `StrategyEditor.ts` um `AreaCustomCard`.

- [ ] **Step 2: Gemeinsamen Schreib-Helper hinzufügen**

Nach `_updateCustomCardYaml` (nach Zeile 2464) einfügen:

```ts
// -- Area Custom Cards (per-area room view) ---------------------------

/**
 * Schreibt das Array zurück nach areas_options[areaId].custom_cards und
 * feuert config-changed. Entfernt leere Container (delete-when-empty),
 * analog zu _updateEntityConfig.
 */
private _writeAreaCustomCards(areaId: string, cards: AreaCustomCard[]): void {
  const currentAreaOptions = this._config.areas_options?.[areaId] || {};

  const newAreaOptions: Record<string, any> = { ...currentAreaOptions };
  if (cards.length === 0) {
    delete newAreaOptions.custom_cards;
  } else {
    newAreaOptions.custom_cards = cards;
  }

  const newAreasOptions: Record<string, any> = {
    ...this._config.areas_options,
    [areaId]: newAreaOptions,
  };

  if (Object.keys(newAreasOptions[areaId]).length === 0) {
    delete newAreasOptions[areaId];
  }

  const newConfig: Simon42StrategyConfig = { ...this._config };
  if (Object.keys(newAreasOptions).length === 0) {
    delete newConfig.areas_options;
  } else {
    newConfig.areas_options = newAreasOptions;
  }

  this._config = newConfig;
  this._fireConfigChanged(newConfig);
}

private _getAreaCustomCards(areaId: string): AreaCustomCard[] {
  return [...(this._config.areas_options?.[areaId]?.custom_cards || [])];
}

private _addAreaCustomCard(areaId: string): void {
  const cards = this._getAreaCustomCards(areaId);
  cards.push({ mode: 'yaml', position: 'bottom', title: '', yaml: '', parsed_config: undefined });
  this._writeAreaCustomCards(areaId, cards);
}

private _removeAreaCustomCard(areaId: string, index: number): void {
  const cards = this._getAreaCustomCards(areaId);
  cards.splice(index, 1);
  this._writeAreaCustomCards(areaId, cards);
}

private _updateAreaCustomCardField(
  areaId: string,
  index: number,
  field: 'title' | 'position' | 'mode' | 'entity',
  value: string
): void {
  const cards = this._getAreaCustomCards(areaId);
  if (!cards[index]) return;
  cards[index] = { ...cards[index], [field]: value };
  this._writeAreaCustomCards(areaId, cards);
}

private _updateAreaCustomCardYaml(areaId: string, index: number, yamlString: string): void {
  const cards = this._getAreaCustomCards(areaId);
  if (!cards[index]) return;

  const updated: AreaCustomCard = { ...cards[index], yaml: yamlString };
  delete updated._yaml_error;

  if (yamlString.trim()) {
    try {
      const parsed = yaml.load(yamlString);
      if (parsed && typeof parsed === 'object') {
        updated.parsed_config = parsed as Record<string, any>;
      } else {
        updated._yaml_error = 'YAML muss ein Objekt oder Array ergeben';
        updated.parsed_config = undefined;
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message.split('\n')[0] : 'Ungültiges YAML';
      updated._yaml_error = message || 'Ungültiges YAML';
      updated.parsed_config = undefined;
    }
  } else {
    updated.parsed_config = undefined;
  }

  cards[index] = updated;
  this._writeAreaCustomCards(areaId, cards);
}
```

- [ ] **Step 3: Build + Lint**

Run: `npm run build-dev`
Expected: erfolgreicher Build. (Die Handler werden in Task 5 referenziert; isoliert genügt Typprüfung — ungenutzte private Methoden lösen bei TS keinen Fehler aus, eslint ggf. `no-unused-vars`. Falls eslint warnt, ist das akzeptabel bis Task 5 sie verdrahtet — andernfalls Task 4 und 5 in einem Commit zusammenfassen.)

Run: `npm run lint`
Expected: höchstens „unused"-Hinweise für die neuen Methoden bis Task 5.

- [ ] **Step 4: Commit**

```bash
git add src/editor/StrategyEditor.ts
git commit -m "feat(editor): area custom-card config handlers"
```

---

## Task 5: Editor — UI-Subsektion „Eigene Karten" pro Bereich

**Files:**
- Modify: `src/editor/StrategyEditor.ts` (neue Render-Methode + Aufruf am Ende von `_renderAreaEntities`, ~`:2085`)

- [ ] **Step 1: Render-Methode für ein Custom-Card-Item hinzufügen**

Nach `_renderCustomCardItem` (nach Zeile 1769) einfügen:

```ts
private _renderAreaCustomCardItem(
  areaId: string,
  card: AreaCustomCard,
  index: number,
  availableEntities: Array<{ entity_id: string; name: string }>
): TemplateResult {
  const mode = card.mode || 'yaml';
  const position = card.position || 'bottom';

  const validationMsg = card._yaml_error
    ? html`<span style="color: var(--error-color);">&#x274C; ${card._yaml_error}</span>`
    : card.yaml
      ? html`<span style="color: var(--success-color, green);">&#x2705; ${localize('editor.yaml_valid')}</span>`
      : nothing;

  return html`
    <div class="custom-item" data-index=${index}>
      <div class="custom-item-header">
        <strong>${card.title || localize('editor.area_custom_card_new')}</strong>
        <button class="btn-remove" @click=${() => this._removeAreaCustomCard(areaId, index)}>&#x2715;</button>
      </div>
      <div class="custom-item-fields">
        <input type="text" .value=${card.title || ''} placeholder=${localize('editor.card_title_placeholder')}
          @change=${(e: Event) => this._updateAreaCustomCardField(areaId, index, 'title', (e.target as HTMLInputElement).value)} />

        <div class="custom-card-target">
          <label>${localize('editor.area_custom_card_position')}:</label>
          <select @change=${(e: Event) => this._updateAreaCustomCardField(areaId, index, 'position', (e.target as HTMLSelectElement).value)}>
            <option value="bottom" ?selected=${position === 'bottom'}>${localize('editor.area_custom_card_position_bottom')}</option>
            <option value="top" ?selected=${position === 'top'}>${localize('editor.area_custom_card_position_top')}</option>
          </select>
        </div>

        <div class="custom-card-target">
          <label>${localize('editor.area_custom_card_mode')}:</label>
          <select @change=${(e: Event) => this._updateAreaCustomCardField(areaId, index, 'mode', (e.target as HTMLSelectElement).value)}>
            <option value="yaml" ?selected=${mode === 'yaml'}>${localize('editor.area_custom_card_mode_yaml')}</option>
            <option value="tile" ?selected=${mode === 'tile'}>${localize('editor.area_custom_card_mode_tile')}</option>
          </select>
        </div>

        ${mode === 'tile'
          ? html`
            <div class="custom-card-target">
              <label>${localize('editor.area_custom_card_entity')}:</label>
              <select @change=${(e: Event) => this._updateAreaCustomCardField(areaId, index, 'entity', (e.target as HTMLSelectElement).value)}>
                <option value="" ?selected=${!card.entity}>${localize('editor.area_custom_card_entity_select')}</option>
                ${availableEntities.map((e) => html`
                  <option value=${e.entity_id} ?selected=${card.entity === e.entity_id}>${e.name} (${e.entity_id})</option>
                `)}
              </select>
            </div>
          `
          : html`
            <textarea rows="6" placeholder=${localize('editor.yaml_placeholder')}
              .value=${card.yaml || ''}
              style="width: 100%;"
              @change=${(e: Event) => this._updateAreaCustomCardYaml(areaId, index, (e.target as HTMLTextAreaElement).value)}></textarea>
            <div class="custom-item-validation">${validationMsg}</div>
          `}
      </div>
    </div>
  `;
}
```

- [ ] **Step 2: Render-Methode für die gesamte Subsektion hinzufügen**

Direkt nach `_renderAreaCustomCardItem` einfügen:

```ts
private _renderAreaCustomCardsSection(
  areaId: string,
  availableEntities: Array<{ entity_id: string; name: string }>
): TemplateResult {
  const cards = this._config.areas_options?.[areaId]?.custom_cards || [];

  return html`
    <div class="entity-group" data-group="custom_cards">
      <div class="entity-group-header">
        <ha-icon icon="mdi:card-plus-outline"></ha-icon>
        <span class="group-name">${localize('editor.area_custom_cards_title')}</span>
        <span class="entity-count">(${cards.length})</span>
      </div>
      <div class="entity-list">
        <div class="section-help">${localize('editor.area_custom_cards_help')}</div>
        ${cards.map((card, index) => this._renderAreaCustomCardItem(areaId, card, index, availableEntities))}
        <button class="badge-add-button" @click=${() => this._addAreaCustomCard(areaId)}>
          ${localize('editor.area_custom_card_add')}
        </button>
      </div>
    </div>
  `;
}
```

> Quelle der `availableEntities`: die in `_renderAreaEntities` bereits verfügbaren Bereichs-Entities. Verwende dieselbe Liste, die die Badge-Auswahl speist (`availableEntities` ist dort vorhanden; falls leer, eignet sich auch `badgeCandidates`). Mappe je Eintrag auf `{ entity_id, name }`. Existiert keine fertige Liste, baue sie aus `data.groupedEntities`/`hass.states` der gecachten Bereichsdaten. Beim Verdrahten in Step 3 die konkret vorhandene Variable verwenden.

- [ ] **Step 3: Subsektion am Ende von `_renderAreaEntities` einhängen**

In `_renderAreaEntities` (der Block, der ab ~Zeile 1991 das `badges`-`entity-group`-Template zurückgibt) den finalen `return html\`...\`` so erweitern, dass nach dem Badges-Block die Custom-Cards-Subsektion folgt. Konkret: Wrappe den bestehenden Rückgabewert und hänge `${this._renderAreaCustomCardsSection(areaId, areaPickerEntities)}` an.

Beispiel (an die reale Struktur anpassen — der bestehende Badges-`<div class="entity-group">` bleibt unverändert, davor/danach kommt die neue Sektion):

```ts
    // Quelle für den Entity-<select> im Kachel-Modus (bereits im Scope vorhanden):
    const areaPickerEntities = availableEntities.length > 0
      ? availableEntities
      : badgeCandidates.map((id) => ({
          entity_id: id,
          name: hass.states[id]?.attributes.friendly_name || id,
        }));

    return html`
      ${/* ... bestehende Domain-Gruppen + Badges-entity-group unverändert ... */ ''}
      <div class="entity-group" data-group="badges">
        ${/* ... unverändert ... */ ''}
      </div>
      ${this._renderAreaCustomCardsSection(areaId, areaPickerEntities)}
    `;
```

**Hinweis:** Falls `_renderAreaEntities` aktuell **nur** den Badges-Block zurückgibt (siehe Zeilen 1991-2085), umschließe ihn mit einem Fragment und ergänze die neue Sektion. Den Aufbau von `areaPickerEntities` aus den bereits berechneten lokalen Variablen (`availableEntities`, `badgeCandidates`, `hass`) übernehmen — keine neuen Datenquellen einführen.

- [ ] **Step 4: Build + Lint**

Run: `npm run build-dev`
Expected: erfolgreicher Build, keine ungenutzten Handler mehr (alle aus Task 4 sind jetzt verdrahtet).

Run: `npm run lint`
Expected: keine neuen Fehler.

- [ ] **Step 5: Commit**

```bash
git add src/editor/StrategyEditor.ts
git commit -m "feat(editor): per-area 'Eigene Karten' subsection UI"
```

---

## Task 6: Übersetzungen

**Files:**
- Modify: `src/translations/de.json`, `src/translations/en.json`

- [ ] **Step 1: Vorhandene Editor-Keys prüfen**

Lies beide Dateien und finde den `editor`-Block. Bestätige, dass `yaml_valid`, `yaml_placeholder`, `card_title_placeholder` bereits existieren (werden wiederverwendet).

- [ ] **Step 2: Neue Keys in `de.json` ergänzen**

Im `editor`-Objekt hinzufügen (Komma-Konsistenz beachten):

```json
"area_custom_cards_title": "Eigene Karten",
"area_custom_cards_help": "Eigene Karten/Kacheln für diese Raumansicht. Pro Karte wählbar: Position (oben/unten) und Eingabemodus (YAML oder Kachel).",
"area_custom_card_new": "Neue Karte",
"area_custom_card_add": "+ Karte hinzufügen",
"area_custom_card_position": "Position",
"area_custom_card_position_top": "Oben (vor Auto-Sektionen)",
"area_custom_card_position_bottom": "Unten (nach Auto-Sektionen)",
"area_custom_card_mode": "Modus",
"area_custom_card_mode_yaml": "YAML",
"area_custom_card_mode_tile": "Kachel (Entity)",
"area_custom_card_entity": "Entity",
"area_custom_card_entity_select": "Entity wählen…"
```

- [ ] **Step 3: Dieselben Keys in `en.json` ergänzen**

```json
"area_custom_cards_title": "Custom cards",
"area_custom_cards_help": "Custom cards/tiles for this room view. Per card: position (top/bottom) and input mode (YAML or tile).",
"area_custom_card_new": "New card",
"area_custom_card_add": "+ Add card",
"area_custom_card_position": "Position",
"area_custom_card_position_top": "Top (before auto sections)",
"area_custom_card_position_bottom": "Bottom (after auto sections)",
"area_custom_card_mode": "Mode",
"area_custom_card_mode_yaml": "YAML",
"area_custom_card_mode_tile": "Tile (entity)",
"area_custom_card_entity": "Entity",
"area_custom_card_entity_select": "Select entity…"
```

- [ ] **Step 4: Build + Lint**

Run: `npm run build-dev`
Expected: erfolgreicher Build (JSON valide).

Run: `npm run lint`
Expected: keine neuen Fehler.

- [ ] **Step 5: Commit**

```bash
git add src/translations/de.json src/translations/en.json
git commit -m "feat(i18n): labels for per-area custom cards"
```

---

## Task 7: Versions-Bump + Doku

**Files:**
- Modify: `package.json` (`version`), `src/dashboard-strategy.ts:13` (`STRATEGY_VERSION`), `CLAUDE.md` (Roadmap „Completed")

- [ ] **Step 1: Minor-Bump festlegen**

Neues Feature → Minor-Bump. Aktuelle Version ist `1.3.4-beta.11`. Bestimme die nächste Version gemäß Release-Workflow (z. B. nächster Minor-Beta-Tag `1.4.0-beta.1`, falls 1.3.4 noch nicht final ist — andernfalls fortlaufender Beta-Tag). Setze identischen Wert in `package.json` und `STRATEGY_VERSION`.

- [ ] **Step 2: `package.json` aktualisieren**

`"version"` auf den in Step 1 gewählten Wert setzen.

- [ ] **Step 3: `STRATEGY_VERSION` aktualisieren**

`src/dashboard-strategy.ts` Zeile 13 auf denselben Wert setzen.

- [ ] **Step 4: `package-lock.json` synchronisieren**

Run: `npm install`
Expected: `package-lock.json` aktualisiert.

- [ ] **Step 5: CLAUDE.md-Roadmap ergänzen**

Unter „### Completed (main)" einen Eintrag hinzufügen:

```
- [x] Eigene Karten/Kacheln pro Raumansicht: `areas_options[area_id].custom_cards[]` mit Position (top/bottom) und Modus (YAML/Kachel), Editor-Subsektion pro Bereich
```

Außerdem unter „### Config Hierarchy" → „Entity-level" / „Special" den neuen Pfad `areas_options.{areaId}.custom_cards` notieren.

- [ ] **Step 6: Production-Build**

Run: `npm run build`
Expected: erfolgreicher Production-Build (Chunks mit Content-Hash in `dist/`).

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json src/dashboard-strategy.ts CLAUDE.md dist/
git commit -m "chore(release): bump version for per-area custom cards"
```

---

## Task 8: Live-Test (manuell, gemäß CLAUDE.md)

> Keine automatisierten Tests vorhanden — diese Aufgabe ist manuell.

- [ ] **Step 1: Deploy**

`dist/`-Inhalt nach `/config/www/community/dashboard-strategy/` kopieren. Stale `.gz`/`.br` löschen. Browser hart neu laden (Cmd/Strg+Shift+R).

- [ ] **Step 2: Editor — YAML-Modus**

Im Bereich (z. B. „Cams") aufklappen → „Eigene Karten" → „+ Karte hinzufügen". Modus YAML, Position „oben", gültiges YAML (z. B. `type: markdown\ncontent: Test`) → ✅ erscheint, Karte erscheint **oben** in der Raumansicht.

- [ ] **Step 3: Editor — Kachel-Modus**

Zweite Karte, Modus „Kachel", Entity aus dem `<select>` wählen, Position „unten", Titel setzen → `tile`-Karte mit Heading erscheint **unten**.

- [ ] **Step 4: Fehlerfall**

Ungültiges YAML eingeben → ❌-Meldung im Editor, Raumansicht crasht nicht (Karte wird übersprungen).

- [ ] **Step 5: Persistenz / Expand-State**

Editor schließen/öffnen → Karten bleiben erhalten, Expand-State anderer Bereiche unverändert.

- [ ] **Step 6: Konsole prüfen**

Browser-Konsole: `Dashboard Strategy v<neue Version> loaded`, keine Fehler.

---

## Selbst-Review-Notiz

- **Spec-Abdeckung:** Typ (T1), RoomView-Injektion top+bottom (T2), Durchreichung (T3), Editor-Handler (T4) + UI inkl. YAML & Kachel (T5), i18n (T6), Versionierung+Doku (T7), Live-Test (T8) — alle Design-Touchpoints abgedeckt.
- **Offene Anpassung bei Umsetzung:** In T5/Step 3 muss die reale Rückgabestruktur von `_renderAreaEntities` geprüft werden (gibt aktuell nur den Badges-Block zurück). Die `availableEntities`-Variable ist im Scope vorhanden (Zeile ~2065) — als Quelle für den Kachel-`<select>` verwenden.
- **Typ-Konsistenz:** `AreaCustomCard`-Felder (`mode`, `position`, `title`, `yaml`, `parsed_config`, `_yaml_error`, `entity`) werden in T2/T4/T5 identisch verwendet.
