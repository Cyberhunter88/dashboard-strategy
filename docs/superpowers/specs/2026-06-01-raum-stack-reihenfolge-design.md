# Design: Verschiebbare Stacks in Raum-Ansichten

**Datum:** 2026-06-01
**Status:** Freigegeben
**Feature-Branch:** `feature/room-stack-reorder`
**Zielversion:** `1.3.4-beta.12`

## Ziel

Nutzer können die Reihenfolge der Inhaltsblöcke ("Stacks") innerhalb jeder Raum-Detailansicht
(`RoomViewStrategy`) **pro Raum individuell** per Drag&Drop im Editor festlegen. Heute ist diese
Reihenfolge fest verdrahtet. Da Strategy-Views bei jedem Laden neu generiert werden, kann die
native HA-Drag-Reorder-Funktion die Reihenfolge nicht persistieren — die Reihenfolge muss in der
Strategy-**Config** gespeichert und vom Editor geschrieben werden.

## Geltungsbereich & Entscheidungen

- **Pro Raum individuell** (nicht global). Speicherung unter `areas_options.{areaId}.stacks_order`.
- **Alle Stack-Typen** verschiebbar (14 Typen, siehe unten).
- Blöcke, die ein Raum nicht besitzt, erscheinen im Editor ausgegraut mit Tag „(nicht vorhanden)",
  bleiben aber in der Liste, damit die Reihenfolge stabil definierbar ist.
- Umsetzung folgt **Ansatz A (Keyed-Map-Refactor)** und spiegelt das bestehende
  `sections_order`-Drag&Drop-Pattern der Übersichtsseite.

## Binding Constraint

Die Block-Erzeugung arbeitet weiterhin **ausschließlich** auf
`Registry.getVisibleEntitiesForArea()` (vorgefiltert). Am `no_dboard`-Label-Verhalten ändert sich
nichts — nur die Ausgabe-Reihenfolge der Sektionen wird beeinflusst.

---

## Abschnitt 1 — Config & Typen (`src/types/strategy.ts`)

Neuer Stack-Schlüssel analog zu `SectionKey`/`DEFAULT_SECTIONS_ORDER`:

```typescript
export type StackKey =
  | 'ups' | 'cameras' | 'lights' | 'locks' | 'climate'
  | 'covers' | 'covers_curtain' | 'covers_window'
  | 'media' | 'scenes' | 'misc' | 'automations' | 'scripts' | 'room_pins';

export const DEFAULT_STACKS_ORDER: StackKey[] = [
  'ups', 'cameras', 'lights', 'locks', 'climate',
  'covers', 'covers_curtain', 'covers_window',
  'media', 'scenes', 'misc', 'automations', 'scripts', 'room_pins',
];
```

Die Default-Reihenfolge entspricht **exakt** der heutigen Hardcode-Reihenfolge in
`RoomViewStrategy` (UPS → Cameras → Lights → Locks → Climate → Covers → Covers_curtain →
Covers_window → Media → Scenes → Misc → Automations → Scripts → Room-Pins). Bestehende Dashboards
verändern sich visuell nicht.

Erweiterung des bestehenden `AreaOptions`:

```typescript
export interface AreaOptions {
  groups_options?: Record<string, GroupOptions>;
  stacks_order?: StackKey[];   // NEU — default: DEFAULT_STACKS_ORDER
}
```

**Merge-Regel** (`mergeStacksOrder`): Konfigurierte Keys zuerst in gespeicherter Reihenfolge,
danach alle in der gespeicherten Liste fehlenden Keys in `DEFAULT_STACKS_ORDER`-Reihenfolge
angehängt. So bleiben künftige neue Stack-Typen automatisch sichtbar, auch wenn ein Raum eine
veraltete `stacks_order` gespeichert hat. Unbekannte Keys in der gespeicherten Liste werden
ignoriert.

---

## Abschnitt 2 — RoomViewStrategy-Refactor (`src/views/RoomViewStrategy.ts`)

Statt direkt in `sections[]` zu pushen, schreibt jeder Block in eine keyed Map:

```typescript
const stacks = new Map<StackKey, LovelaceSectionConfig[]>();
const pushStack = (key: StackKey, section: LovelaceSectionConfig) => {
  const arr = stacks.get(key) ?? [];
  arr.push(section);
  stacks.set(key, arr);
};
```

- Die heutigen 14 Push-Stellen rufen statt `sections.push(...)` jetzt `pushStack('<key>', ...)` auf.
- **USV & Kameras** (mehrere Geräte-Sektionen) pushen mehrfach unter denselben Key und bleiben damit
  als zusammenhängender Block an einer Position, in ihrer internen Geräte-Reihenfolge.
- Der `domainSection(...)`-Helper bleibt unverändert; nur das Ziel (`pushStack` statt
  `sections.push`) ändert sich.

Finale Reihenfolge:

```typescript
const order = mergeStacksOrder(areaOptions?.stacks_order);
const sections: LovelaceSectionConfig[] = [];
for (const key of order) {
  const blocks = stacks.get(key);
  if (blocks) sections.push(...blocks);
}
```

`mergeStacksOrder` wird als kleine Util-Funktion angelegt (lokal in der View oder in
`utils/name-utils.ts`). `stacks_order` kommt über die bereits an `generate()` übergebenen
`areaOptions` bzw. `dashboardConfig.areas_options[areaId]` herein. Der Entry-Point
(`simon42-dashboard-strategy.ts`) übergibt `areaOptions` bereits — `stacks_order` wird zusätzlich
durchgereicht.

Der Rückgabewert bleibt unverändert:
`{ type: 'sections', header: { badges_position: 'bottom' }, sections, badges }`.

---

## Abschnitt 3 — Editor-UI (`src/editor/StrategyEditor.ts`)

Spiegelt 1:1 das bestehende `sections_order`-Drag&Drop, jedoch **pro Bereich** in den bereits
vorhandenen aufklappbaren Area-Panels.

- Pro Bereich eine `.section-order-list` mit Stack-Items (Drag-Handle `&#x2630;`, MDI-Icon, Label).
- **Nur vorhandene Blöcke** sind aktiv ziehbar; nicht vorhandene Stacks werden ausgegraut mit Tag
  „(nicht vorhanden)" angezeigt, bleiben aber in der Liste. Welche Stacks ein Raum besitzt, wird aus
  der Registry analog zur View-Logik ermittelt.
- Wiederverwendung der bestehenden CSS-Klassen (`.section-order-item`, `.drag-handle`, `.dragging`,
  `.drag-over`) — kein neues Styling nötig.
- Neue Handler `_handleStackDragStart/End/Over/Leave/Drop`, die den **Area-Kontext** kennen (über
  `data-area-id` am Listen-Container) und beim Drop in `areas_options[areaId].stacks_order` schreiben.
- Neue `_stackMeta`-Map (analog `_sectionMeta`): Icon + Label-Key je Stack-Typ.

Getter/Setter analog zum Section-Order-Pattern:

```typescript
private _getStacksOrder(areaId: string): StackKey[] {
  return this._config.areas_options?.[areaId]?.stacks_order || [...DEFAULT_STACKS_ORDER];
}
private _updateStacksOrder(areaId: string, newOrder: StackKey[]): void {
  // immutabler Merge in areas_options[areaId].stacks_order + _fireConfigChanged
}
```

---

## Abschnitt 4 — i18n (`src/translations/de.json` + `en.json`)

- Editor-Labels: `editor.stack_order` (Überschrift), `editor.stack_order_desc` (Beschreibung),
  `editor.stack_not_present` „(nicht vorhanden)".
- Pro Stack-Typ ein Label unter `stacks.*` (analog `sections.*`), DE + EN:
  | Key | DE | EN |
  |-----|----|----|
  | `stacks.ups` | USV | UPS |
  | `stacks.cameras` | Kameras | Cameras |
  | `stacks.lights` | Lichter | Lights |
  | `stacks.locks` | Schlösser | Locks |
  | `stacks.climate` | Klima | Climate |
  | `stacks.covers` | Rollos | Covers |
  | `stacks.covers_curtain` | Vorhänge | Curtains |
  | `stacks.covers_window` | Fenster | Windows |
  | `stacks.media` | Medien | Media |
  | `stacks.scenes` | Szenen | Scenes |
  | `stacks.misc` | Sonstiges | Misc |
  | `stacks.automations` | Automationen | Automations |
  | `stacks.scripts` | Skripte | Scripts |
  | `stacks.room_pins` | Angepinnt | Pinned |

---

## Abschnitt 5 — Verifikation, Versionierung & Workflow

- **Verifikation:** `npm run build` (Production) + `npm run lint`. Kein Test-Framework vorhanden;
  Live-Test im HA-System (`/config/www/community/simon42-dashboard-strategy/`) + Hard-Refresh.
  `build-dev` ist vorbekannt kaputt (ESM `__dirname`) → nicht nutzen.
- **Version:** Bump auf `1.3.4-beta.12` in `package.json` **und** `STRATEGY_VERSION` in
  `src/simon42-dashboard-strategy.ts`; `package-lock.json` via `npm install`.
- **Git:** Feature-Branch `feature/room-stack-reorder` von `main`, src **und** `dist/` committen,
  PR → CI → Merge → Tag `v1.3.4-beta.12` als Pre-Release. Spiegelt den USV-Workflow.
- **CLAUDE.md** nach Abschluss aktualisieren (Roadmap „Completed" + Config-Hierarchie um
  `stacks_order` ergänzen).

## Nicht im Scope (YAGNI)

- Keine globale Stack-Reihenfolge mit Raum-Override (bewusst verworfen zugunsten reiner
  Per-Raum-Konfiguration).
- Keine Reorder-Funktion für einzelne Geräte innerhalb eines Stacks (USV-/Kamera-Geräte behalten
  ihre interne Reihenfolge).
- Keine Sichtbarkeits-Toggles in der Stack-Liste (Ein-/Ausblenden läuft weiter über bestehende
  `groups_options.hidden` bzw. `show_*_in_rooms`).
