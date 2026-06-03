# Design: Eigene Karten & Kacheln in den Raum-Detailansichten

**Datum:** 2026-06-01
**Status:** Entwurf (genehmigt – bereit für Umsetzungsplan)

## Ziel

Nutzer sollen in den automatisch generierten Raum-Detailansichten (eine pro HA-Bereich,
z. B. „Cams") **eigene Karten und Kacheln** anlegen können – zusätzlich zu den
auto-generierten Sektionen (Lichter, Kameras, Klima usw.).

## Festgelegte Entscheidungen

| Aspekt | Entscheidung |
|--------|--------------|
| Ort | Raum-Detailansichten (pro HA-Bereich) |
| Position | Pro Karte wählbar: `top` (vor) oder `bottom` (nach den Auto-Sektionen) |
| Eingabe | Beides: freies YAML **und** geführte Kachel (Entity) – sofort zusammen |
| Speicherort | `areas_options[area_id].custom_cards[]` |
| Konfiguration | Im Bereichs-Abschnitt des Editors (pro Bereich aufklappbar) |

## Architektur-Entwurf

### 1. Config-Schema (`src/types/strategy.ts`)

Ein gemeinsames Array mit `mode`-Diskriminator (Option 1A):

```ts
export interface AreaCustomCard {
  /** Eingabemodus */
  mode?: 'yaml' | 'tile';        // default: 'yaml'
  /** Platzierung relativ zu den Auto-Sektionen */
  position?: 'top' | 'bottom';   // default: 'bottom'
  /** Optionale Überschrift (rendert als heading-Card davor) */
  title?: string;
  // --- YAML-Modus ---
  yaml?: string;
  parsed_config?: Record<string, any> | null;
  _yaml_error?: string;
  // --- Geführter Kachel-Modus ---
  entity?: string;
}
```

Erweiterung von `AreaOptions`:

```ts
export interface AreaOptions {
  groups_options?: Record<string, GroupOptions>;
  custom_cards?: AreaCustomCard[];   // NEU
}
```

### 2. Injektion im RoomView (`src/views/RoomViewStrategy.ts`)

- `Simon42ViewRoomStrategy.generate()` erhält die Karten über die `config`
  (durchgereicht vom Entry-Point, siehe 3).
- **Eine Sammel-Section pro Position** (Option 2A):
  - Alle `position: 'top'`-Karten → eine `grid`-Section **vor** den Auto-Sektionen.
  - Alle `position: 'bottom'`-Karten → eine `grid`-Section **nach** den Auto-Sektionen.
- Karten-Config pro Eintrag:
  - **YAML-Modus:** `parsed_config` verwenden (nur wenn vorhanden und fehlerfrei).
  - **Kachel-Modus:** `{ type: 'tile', entity }` erzeugen (nur wenn `entity` gesetzt).
  - Bei gesetztem `title`: eine `{ type: 'heading', heading: title }`-Card davor.
- Reihenfolge innerhalb einer Position = Array-Reihenfolge.
- Leere/ungültige Einträge werden übersprungen (kein Crash bei YAML-Fehler).

### 3. Übergabe im Entry-Point (`src/dashboard-strategy.ts`)

In der bestehenden Schleife (Zeilen ~93–105) wird `areaOptions?.custom_cards`
zusätzlich zu `groups_options` an die RoomView-Strategy übergeben:

```ts
return roomStrategy.generate(
  {
    area,
    groups_options: areaOptions?.groups_options || {},
    custom_cards: areaOptions?.custom_cards || [],   // NEU
    dashboardConfig: config,
  },
  hass
);
```

### 4. Editor-UI (`src/editor/StrategyEditor.ts`)

- Neue Subsektion **„Eigene Karten"** innerhalb des aufgeklappten Bereichs
  (`_renderAreaEntities` bzw. am Ende des Area-Contents).
- Pro Karte ein Item analog zu `_renderCustomCardItem`:
  - Titel-Feld (optional)
  - Position-Auswahl (`top` / `bottom`)
  - Modus-Umschalter (`yaml` / `tile`)
  - **YAML-Modus:** Textarea + Live-Validierung (gleiches Muster wie
    `_updateCustomCardYaml`, inkl. `_yaml_error` / „YAML gültig").
  - **Kachel-Modus:** natives `<select>` (Editor-Konvention, kein `ha-entity-picker`),
    befüllt aus den bereits gecachten Bereichs-Entities (`_areaEntitiesCache`) –
    bereichs-gescoped; erzeugt intern `{ type: 'tile', entity }`.
  - „Entfernen"-Button.
- „+ Karte hinzufügen"-Button pro Bereich.
- Handler (neu, area-scoped): `_addAreaCustomCard(areaId)`,
  `_removeAreaCustomCard(areaId, index)`, `_updateAreaCustomCardField(...)`,
  `_updateAreaCustomCardYaml(...)` — schreiben nach
  `areas_options[areaId].custom_cards` und feuern `config-changed`.

### 5. Übersetzungen (`src/translations/de.json`, `en.json`)

Neue Editor-Labels: Abschnittstitel „Eigene Karten", Position-Labels
(oben/unten), Modus-Labels (YAML/Kachel), Platzhalter, Hilfetext,
„Karte hinzufügen", „Entity wählen".

## Betroffene Dateien (Touchpoints)

| Datei | Änderung |
|-------|----------|
| `src/types/strategy.ts` | `AreaCustomCard` + `AreaOptions.custom_cards` |
| `src/views/RoomViewStrategy.ts` | Top-/Bottom-Sammel-Sections injizieren |
| `src/dashboard-strategy.ts` | `custom_cards` durchreichen |
| `src/editor/StrategyEditor.ts` | Subsektion + Handler pro Bereich |
| `src/translations/de.json` / `en.json` | Labels |

## Nicht-Ziele / bewusste Grenzen

- Geführter Modus erzeugt nur `tile`-Karten (Entity). Alle anderen Kartentypen
  laufen über den YAML-Modus (kein Kacheltyp-Picker → DF3 Option A).
- Keine Drag&Drop-Sortierung der Custom-Cards in v1 (Array-Reihenfolge genügt).
- Keine Validierung der Entity-Existenz zur Laufzeit (HA rendert Fehlkarten selbst).

## Risiken

- `StrategyEditor.ts` ist ein 3274-Zeilen-Komplexitäts-Hotspot (CLAUDE.md) –
  neue Handler sorgfältig am bestehenden Muster ausrichten, Expand-State nicht stören.
- YAML-Fehler dürfen die RoomView-Generierung nie crashen → defensives Skippen.
- Performance: Injektion läuft einmal in `generate()`, kein Reactive-Pfad → unkritisch.

## Versionierung

Neues Feature → **Minor-Bump**. Beta-Tag fortführen
(`package.json`, `STRATEGY_VERSION`, Git-Tag).
