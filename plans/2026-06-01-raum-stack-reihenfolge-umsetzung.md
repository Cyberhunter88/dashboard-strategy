# Raum-Stack-Reihenfolge – Implementierungsplan

> **Für agentische Worker:** ERFORDERLICHE SUB-SKILL: Nutze superpowers:subagent-driven-development (empfohlen) oder superpowers:executing-plans, um diesen Plan Aufgabe für Aufgabe umzusetzen. Schritte verwenden Checkbox-Syntax (`- [ ]`) zur Nachverfolgung.

**Ziel:** Die Sektions-Blöcke ("Stacks") in jeder Raum-Detailansicht (RoomViewStrategy) werden pro Bereich individuell per Drag & Drop im Editor umsortierbar.

**Architektur:** Keyed-Map-Refactor in `RoomViewStrategy` (Ansatz A): Statt direkt in ein `sections[]`-Array zu pushen, werden alle Blöcke unter einem `StackKey` in einer Map gesammelt und am Ende in der konfigurierten Reihenfolge emittiert. Die gespeicherte Reihenfolge liegt pro Bereich unter `areas_options.{areaId}.stacks_order`. Der Editor spiegelt das bestehende `sections_order`-Drag&Drop-Muster pro Bereich (über `data-area-id`). Die Entity-Sammlung/Filterung bleibt unverändert — nur die **Ausgabe-Reihenfolge** ändert sich, sodass das `no_dboard`-Label voll wirksam bleibt.

**Tech-Stack:** TypeScript ES2020 strict, Webpack-Codesplitting (views-Chunk + editor-Chunk), LitElement-Editor, i18n via `localize()` mit de.json/en.json.

**Verifikation:** Es gibt **kein Test-Framework**. Jede Aufgabe wird mit `npm run build` (Production-Webpack) und `npm run lint` (`eslint "src/**/*.ts"`) verifiziert. `npm run build-dev` ist vorab kaputt (ESM `__dirname`) — NICHT verwenden, ist keine Regression.

---

## Dateiübersicht

| Datei | Änderung | Verantwortung |
|-------|----------|---------------|
| `src/types/strategy.ts` | Modify | `StackKey`-Typ, `DEFAULT_STACKS_ORDER`, `AreaOptions.stacks_order` |
| `src/utils/name-utils.ts` | Modify | `mergeStacksOrder()`-Helper (forward-kompatibles Mergen) |
| `src/views/RoomViewStrategy.ts` | Modify | Keyed-Map-Refactor der 14 Push-Stellen + finale Emit-Schleife |
| `src/editor/StrategyEditor.ts` | Modify | Pro-Bereich Drag&Drop-Panel, Getter/Setter, Meta-Map, 5 Drag-Handler |
| `src/translations/de.json` | Modify | `editor.stack_*` + `stacks.*`-Labels (Deutsch) |
| `src/translations/en.json` | Modify | `editor.stack_*` + `stacks.*`-Labels (Englisch) |
| `package.json` | Modify | Version → `1.3.4-beta.12` |
| `src/simon42-dashboard-strategy.ts` | Modify | `STRATEGY_VERSION` → `1.3.4-beta.12` |
| `CLAUDE.md` | Modify | Roadmap "Completed" + Config-Hierarchie `stacks_order` |

---

## Task 1: Typen & Default-Reihenfolge in strategy.ts

**Dateien:**
- Modify: `src/types/strategy.ts` (Sektion "Section Ordering" bei Zeile 9-19; `AreaOptions` bei Zeile 92-95)

- [ ] **Schritt 1: `StackKey`-Typ und Default-Reihenfolge ergänzen**

Direkt nach dem `DEFAULT_SECTIONS_ORDER`-Block (nach Zeile 19), neuen Block einfügen:

```typescript
// -- Stack Ordering (per-area room view) ------------------------------

export type StackKey =
  | 'ups'
  | 'cameras'
  | 'lights'
  | 'locks'
  | 'climate'
  | 'covers'
  | 'covers_curtain'
  | 'covers_window'
  | 'media'
  | 'scenes'
  | 'misc'
  | 'automations'
  | 'scripts'
  | 'room_pins';

export const DEFAULT_STACKS_ORDER: StackKey[] = [
  'ups',
  'cameras',
  'lights',
  'locks',
  'climate',
  'covers',
  'covers_curtain',
  'covers_window',
  'media',
  'scenes',
  'misc',
  'automations',
  'scripts',
  'room_pins',
];
```

- [ ] **Schritt 2: `stacks_order` zu `AreaOptions` hinzufügen**

`AreaOptions` (Zeile 92-95) erweitern:

```typescript
export interface AreaOptions {
  groups_options?: Record<string, GroupOptions>;
  custom_cards?: AreaCustomCard[];
  stacks_order?: StackKey[]; // NEU — default: DEFAULT_STACKS_ORDER
}
```

- [ ] **Schritt 3: Build & Lint**

Run: `npm run build`
Erwartet: erfolgreicher Build ohne TypeScript-Fehler.

Run: `npm run lint`
Erwartet: keine neuen Lint-Fehler.

- [ ] **Schritt 4: Commit**

```bash
git add src/types/strategy.ts
git commit -m "feat(types): StackKey und DEFAULT_STACKS_ORDER für Raum-Stack-Reihenfolge"
```

---

## Task 2: mergeStacksOrder-Helper in name-utils.ts

**Dateien:**
- Modify: `src/utils/name-utils.ts` (neue exportierte Funktion am Dateiende)

**Regel:** Konfigurierte Keys zuerst in gespeicherter Reihenfolge, danach fehlende Keys in DEFAULT-Reihenfolge angehängt. Unbekannte Keys (z. B. aus zukünftigen Versionen) werden ignoriert. So bleibt die Funktion forward-kompatibel, wenn neue Stack-Typen hinzukommen.

- [ ] **Schritt 1: Import ergänzen (falls nötig) und Funktion hinzufügen**

Sicherstellen, dass die Typen importiert werden (oben in `name-utils.ts` zur bestehenden Import-Zeile aus `../types/strategy` hinzufügen bzw. neuen Import anlegen):

```typescript
import { DEFAULT_STACKS_ORDER, type StackKey } from '../types/strategy';
```

Am Dateiende anhängen:

```typescript
/**
 * Mergt eine gespeicherte Stack-Reihenfolge mit der Default-Reihenfolge.
 * - Konfigurierte (bekannte) Keys zuerst, in gespeicherter Reihenfolge.
 * - Danach alle in der Config fehlenden Default-Keys, in Default-Reihenfolge.
 * - Unbekannte Keys werden ignoriert (forward-kompatibel).
 * Ohne gespeicherte Reihenfolge wird die Default-Reihenfolge zurückgegeben.
 */
export function mergeStacksOrder(stored?: StackKey[]): StackKey[] {
  if (!stored || stored.length === 0) {
    return [...DEFAULT_STACKS_ORDER];
  }
  const known = stored.filter((key) => DEFAULT_STACKS_ORDER.includes(key));
  const missing = DEFAULT_STACKS_ORDER.filter((key) => !known.includes(key));
  return [...known, ...missing];
}
```

- [ ] **Schritt 2: Build & Lint**

Run: `npm run build`
Erwartet: erfolgreicher Build.

Run: `npm run lint`
Erwartet: keine neuen Lint-Fehler.

- [ ] **Schritt 3: Commit**

```bash
git add src/utils/name-utils.ts
git commit -m "feat(utils): mergeStacksOrder-Helper für forward-kompatibles Stack-Ordering"
```

---

## Task 3: Keyed-Map-Refactor in RoomViewStrategy.ts

**Dateien:**
- Modify: `src/views/RoomViewStrategy.ts`
  - `sections`-Deklaration bei Zeile 437
  - 14 Push-Stellen: UPS [440-485], Cameras [488-575], Lights [596-612], Locks [614-622], Climate [624-632], Covers [634-642], Covers_curtain [644-652], Covers_window [654-662], Media [664-675], Scenes [677-683], Misc [686-733], Automations [735-741], Scripts [743-748], Room Pins [750-782]
  - `domainSection`-Helper [583-594]
  - Return [788]

**Grundsatz:** Nur die Ziel-Datenstruktur des Sammelns und die finale Emit-Reihenfolge ändern sich. Alle Entity-Sammlungen (über `Registry.getVisibleEntitiesForArea`) und Card-Bauten bleiben unverändert — `no_dboard` bleibt voll wirksam.

- [ ] **Schritt 1: Imports ergänzen**

Im Import-Block oben in `RoomViewStrategy.ts` `mergeStacksOrder` aus name-utils und `StackKey` aus den Typen ergänzen (an bestehende Imports anhängen):

```typescript
import { mergeStacksOrder } from '../utils/name-utils';
import type { StackKey } from '../types/strategy';
```

Außerdem die pro-Bereich gespeicherte Reihenfolge aus der Config lesen. Nahe Beginn von `generate()` (wo bereits `dashboardConfig` und `area` verfügbar sind, vgl. Zeile 73 / 116), ableiten:

```typescript
const areaOptions = dashboardConfig.areas_options?.[area.area_id];
const stacksOrder = mergeStacksOrder(areaOptions?.stacks_order);
```

- [ ] **Schritt 2: `sections`-Array durch keyed Map + pushStack ersetzen**

Zeile 437 (`const sections: LovelaceSectionConfig[] = [];`) ersetzen durch:

```typescript
const stacks = new Map<StackKey, LovelaceSectionConfig[]>();
const pushStack = (key: StackKey, section: LovelaceSectionConfig): void => {
  const arr = stacks.get(key) ?? [];
  arr.push(section);
  stacks.set(key, arr);
};
```

- [ ] **Schritt 3: UPS-Push umstellen [440-485]**

Im UPS-Block die Zeile `sections.push({ type: 'grid', cards: upsCards });` (Zeile 483) ersetzen durch:

```typescript
pushStack('ups', { type: 'grid', cards: upsCards });
```

(Mehrere UPS-Geräte pushen mehrfach unter `'ups'` — gewollt.)

- [ ] **Schritt 4: Cameras-Push umstellen [488-575]**

Die Zeile `sections.push({ type: 'grid', cards: [heading, ...cameraCards] });` (Zeile 570) ersetzen durch:

```typescript
pushStack('cameras', { type: 'grid', cards: [heading, ...cameraCards] });
```

- [ ] **Schritt 5: `domainSection`-Helper auf pushStack umstellen [583-594]**

Den Helper so anpassen, dass er einen `StackKey` als erstes Argument erhält und über `pushStack` sammelt:

```typescript
const domainSection = (
  key: StackKey,
  entities: string[],
  heading: string,
  icon: string,
  tileConfig: (entityId: string) => Record<string, any>
): void => {
  if (entities.length === 0) return;
  pushStack(key, {
    type: 'grid',
    cards: [
      { type: 'heading', heading, heading_style: 'title', icon },
      ...entities.map(tileConfig),
    ],
  });
};
```

> Hinweis: Die exakte Signatur des bestehenden `domainSection` (Parameternamen/`tileConfig`-Typ) beim Umbau beibehalten — nur den `key`-Parameter voranstellen und das Ziel von `sections.push(...)` auf `pushStack(key, ...)` umstellen.

- [ ] **Schritt 6: Lights-Push umstellen [596-612]**

Die `sections.push(...)` der Lights-Group-Card (custom:dashboard-strategy-lights-group-card) ersetzen durch:

```typescript
pushStack('lights', { /* unverändertes Lights-Section-Objekt */ });
```

(Das bestehende Section-Objekt unverändert übernehmen — nur `sections.push(X)` → `pushStack('lights', X)`.)

- [ ] **Schritt 7: domainSection-Aufrufe mit StackKey erweitern [614-683]**

Jeden `domainSection(...)`-Aufruf um den führenden Key ergänzen:

```typescript
// Locks [614-622]
domainSection('locks', /* bisherige Argumente */);
// Climate [624-632]
domainSection('climate', /* ... */);
// Covers [634-642]
domainSection('covers', /* ... */);
// Covers_curtain [644-652]
domainSection('covers_curtain', /* ... */);
// Covers_window [654-662]
domainSection('covers_window', /* ... */);
// Media [664-675]
domainSection('media', /* ... */);
// Scenes [677-683]
domainSection('scenes', /* ... */);
```

(Jeweils die bestehenden Argumente — entities, heading, icon, tileConfig — unverändert nach dem Key übergeben.)

- [ ] **Schritt 8: Misc-Push umstellen [686-733]**

Die Zeile `sections.push(...)` im Misc-Block (vacuum/fan/switches, Zeile 726) ersetzen durch:

```typescript
pushStack('misc', { /* unverändertes Misc-Section-Objekt */ });
```

- [ ] **Schritt 9: Automations & Scripts umstellen [735-748]**

```typescript
// Automations [735-741]
domainSection('automations', /* bisherige Argumente */);
// Scripts [743-748]
domainSection('scripts', /* bisherige Argumente */);
```

- [ ] **Schritt 10: Room-Pins-Push umstellen [750-782]**

Die Zeile `sections.push(...)` im Room-Pins-Block (Zeile 764) ersetzen durch:

```typescript
pushStack('room_pins', { /* unverändertes Room-Pins-Section-Objekt */ });
```

- [ ] **Schritt 11: Finale Emit-Schleife vor dem Return einfügen [vor 788]**

Direkt vor der Return-Anweisung (Zeile 788) das `sections`-Array in konfigurierter Reihenfolge zusammenbauen:

```typescript
const sections: LovelaceSectionConfig[] = [];
for (const key of stacksOrder) {
  const blocks = stacks.get(key);
  if (blocks) sections.push(...blocks);
}
```

Der Return bleibt unverändert:

```typescript
return { type: 'sections', header: { badges_position: 'bottom' }, sections, badges };
```

- [ ] **Schritt 12: Build & Lint**

Run: `npm run build`
Erwartet: erfolgreicher Build; keine "unused variable"-Fehler (alte `sections`-Deklaration vollständig entfernt).

Run: `npm run lint`
Erwartet: keine neuen Lint-Fehler.

- [ ] **Schritt 13: Commit**

```bash
git add src/views/RoomViewStrategy.ts
git commit -m "feat(room-view): Keyed-Map-Refactor – Stacks pro Bereich in konfigurierter Reihenfolge"
```

---

## Task 4: i18n-Labels in de.json / en.json

**Dateien:**
- Modify: `src/translations/de.json`
- Modify: `src/translations/en.json`

- [ ] **Schritt 1: de.json — `editor.*`-Keys ergänzen**

Im `editor`-Block folgende Keys ergänzen (Komma-Syntax beachten):

```json
"stack_order": "Reihenfolge der Raum-Blöcke",
"stack_order_desc": "Ziehe die Blöcke per Drag & Drop, um ihre Reihenfolge in dieser Raumansicht festzulegen.",
"stack_not_present": "(nicht vorhanden)"
```

- [ ] **Schritt 2: de.json — neuen `stacks`-Block ergänzen**

Auf oberster Ebene (analog zu vorhandenem `sections`-Block) ergänzen:

```json
"stacks": {
  "ups": "USV",
  "cameras": "Kameras",
  "lights": "Lichter",
  "locks": "Schlösser",
  "climate": "Klima",
  "covers": "Rollos",
  "covers_curtain": "Vorhänge",
  "covers_window": "Fenster",
  "media": "Medien",
  "scenes": "Szenen",
  "misc": "Sonstiges",
  "automations": "Automationen",
  "scripts": "Skripte",
  "room_pins": "Angepinnt"
}
```

- [ ] **Schritt 3: en.json — `editor.*`-Keys ergänzen**

```json
"stack_order": "Room block order",
"stack_order_desc": "Drag the blocks to set their order in this room view.",
"stack_not_present": "(not present)"
```

- [ ] **Schritt 4: en.json — neuen `stacks`-Block ergänzen**

```json
"stacks": {
  "ups": "UPS",
  "cameras": "Cameras",
  "lights": "Lights",
  "locks": "Locks",
  "climate": "Climate",
  "covers": "Covers",
  "covers_curtain": "Curtains",
  "covers_window": "Windows",
  "media": "Media",
  "scenes": "Scenes",
  "misc": "Misc",
  "automations": "Automations",
  "scripts": "Scripts",
  "room_pins": "Pinned"
}
```

- [ ] **Schritt 5: JSON-Validität & Build**

Run: `npm run build`
Erwartet: erfolgreicher Build (Webpack importiert die JSON-Dateien — ungültiges JSON bricht den Build ab).

- [ ] **Schritt 6: Commit**

```bash
git add src/translations/de.json src/translations/en.json
git commit -m "feat(i18n): Labels für Raum-Stack-Reihenfolge (DE/EN)"
```

---

## Task 5: Editor — Pro-Bereich Drag&Drop-Panel

**Dateien:**
- Modify: `src/editor/StrategyEditor.ts`
  - Imports (oben): `mergeStacksOrder`, `DEFAULT_STACKS_ORDER`, `StackKey`
  - Member-Deklaration: `_stackDraggedElement` (analog `_sectionDraggedElement`)
  - Getter/Setter: `_getStacksOrder`, `_updateStacksOrder`
  - Meta-Map: `_stackMeta`
  - Render: `_renderStackOrderPanel(areaId)` — injiziert in `_renderAreaEntities` (1860-1949), gerendert vor `</div>` des `entity-groups`-Containers (nach Zeile 1956, vor dem schließenden Block)
  - 5 Drag-Handler: `_handleStackDragStart/End/Over/Leave/Drop`
  - CSS: bestehende `.section-order-*`-Klassen inkl. `.disabled` (Zeile 490) werden wiederverwendet — KEIN neues CSS nötig

**Muster:** Exakt das bestehende `sections_order`-Drag&Drop (Getter 1041-1043, Setter 1045-1052, Meta-Map 1067-1073, Render 1087-1139, Handler 1143-1208), aber pro Bereich über `data-area-id`. Die immutable Area-Options-Update-Logik spiegelt `_updateEntityConfig` (2604-2694): `areas_options[areaId]` klonen, Feld setzen, leere Objekte prunen, `newConfig` bauen, `_fireConfigChanged(newConfig)`.

- [ ] **Schritt 1: Imports ergänzen**

Zu den bestehenden Imports aus `../utils/name-utils` und `../types/strategy` hinzufügen:

```typescript
import { mergeStacksOrder } from '../utils/name-utils';
import { DEFAULT_STACKS_ORDER, type StackKey } from '../types/strategy';
```

(Falls bereits ein Import aus diesen Modulen existiert, die Namen dort ergänzen statt doppelt importieren.)

- [ ] **Schritt 2: Dragged-Element-Member deklarieren**

Bei den übrigen privaten Feldern (nahe `_sectionDraggedElement`) ergänzen:

```typescript
private _stackDraggedElement: HTMLElement | null = null;
```

- [ ] **Schritt 3: Getter & Setter hinzufügen**

```typescript
private _getStacksOrder(areaId: string): StackKey[] {
  const stored = this._config?.areas_options?.[areaId]?.stacks_order;
  return mergeStacksOrder(stored);
}

private _updateStacksOrder(areaId: string, newOrder: StackKey[]): void {
  const currentAreaOptions = this._config.areas_options?.[areaId] || {};
  const newAreaOptions = { ...currentAreaOptions, stacks_order: newOrder };

  const newAreasOptions = {
    ...this._config.areas_options,
    [areaId]: newAreaOptions,
  };

  const newConfig = { ...this._config, areas_options: newAreasOptions };
  this._config = newConfig;
  this._fireConfigChanged(newConfig);
}
```

- [ ] **Schritt 4: Meta-Map hinzufügen**

Analog `_sectionMeta` (1067-1073), als statisches Feld:

```typescript
private static _stackMeta = new Map<StackKey, { icon: string; labelKey: string }>([
  ['ups', { icon: 'mdi:power-plug-battery', labelKey: 'stacks.ups' }],
  ['cameras', { icon: 'mdi:cctv', labelKey: 'stacks.cameras' }],
  ['lights', { icon: 'mdi:lightbulb', labelKey: 'stacks.lights' }],
  ['locks', { icon: 'mdi:lock', labelKey: 'stacks.locks' }],
  ['climate', { icon: 'mdi:thermostat', labelKey: 'stacks.climate' }],
  ['covers', { icon: 'mdi:window-shutter', labelKey: 'stacks.covers' }],
  ['covers_curtain', { icon: 'mdi:curtains', labelKey: 'stacks.covers_curtain' }],
  ['covers_window', { icon: 'mdi:window-open-variant', labelKey: 'stacks.covers_window' }],
  ['media', { icon: 'mdi:speaker', labelKey: 'stacks.media' }],
  ['scenes', { icon: 'mdi:palette', labelKey: 'stacks.scenes' }],
  ['misc', { icon: 'mdi:dots-horizontal', labelKey: 'stacks.misc' }],
  ['automations', { icon: 'mdi:robot', labelKey: 'stacks.automations' }],
  ['scripts', { icon: 'mdi:script-text', labelKey: 'stacks.scripts' }],
  ['room_pins', { icon: 'mdi:pin', labelKey: 'stacks.room_pins' }],
]);
```

- [ ] **Schritt 5: "Vorhanden?"-Ermittlung pro Bereich**

Damit nicht vorhandene Stacks ausgegraut werden, brauchen wir die vorhandenen Stack-Keys eines Bereichs. Die `_renderAreaEntities`-Methode (1860) erhält bereits `data` mit `groupedEntities`. Hilfsfunktion innerhalb `_renderStackOrderPanel` (siehe Schritt 6) leitet Präsenz aus den gecachten Daten ab. Mapping von `StackKey` auf vorhandene Daten:

```typescript
private _presentStackKeys(
  data: NonNullable<ReturnType<typeof this._areaEntitiesCache.get>>
): Set<StackKey> {
  const g = data.groupedEntities;
  const present = new Set<StackKey>();
  const has = (key: string): boolean => (g[key]?.length ?? 0) > 0;
  if (has('lights')) present.add('lights');
  if (has('locks')) present.add('locks');
  if (has('climate')) present.add('climate');
  if (has('covers')) present.add('covers');
  if (has('covers_curtain')) present.add('covers_curtain');
  if (has('covers_window')) present.add('covers_window');
  if (has('media_player')) present.add('media');
  if (has('scenes')) present.add('scenes');
  if (has('vacuum') || has('fan') || has('switches')) present.add('misc');
  if (has('automations')) present.add('automations');
  if (has('scripts')) present.add('scripts');
  // cameras, ups, room_pins werden im Editor-Cache nicht zuverlässig erfasst
  // → immer als "vorhanden" behandeln (kein Ausgrauen), um falsche Hinweise zu vermeiden
  present.add('cameras');
  present.add('ups');
  present.add('room_pins');
  return present;
}
```

> Begründung: Der Editor-Cache (`groupedEntities`) deckt Domain-Gruppen ab, aber nicht Kameras (eigene Sammel-Logik), UPS (geräte-basiert) oder Room-Pins (globale `room_pin_entities`). Für diese drei wird kein "(nicht vorhanden)"-Tag angezeigt, um irreführende Hinweise zu vermeiden. Die übrigen 11 Stacks werden korrekt ausgegraut, wenn leer.

- [ ] **Schritt 6: Render-Panel hinzufügen**

Spiegelt `_renderSectionOrderPanel` (1087-1139), keyed über `data-area-id`, ausgegraute Einträge mit `(nicht vorhanden)`-Tag:

```typescript
private _renderStackOrderPanel(
  areaId: string,
  data: NonNullable<ReturnType<typeof this._areaEntitiesCache.get>>
): TemplateResult {
  const order = this._getStacksOrder(areaId);
  const present = this._presentStackKeys(data);

  return html`
    <div class="stack-order-panel">
      <div class="section-order-title">${localize('editor.stack_order')}</div>
      <div class="section-order-desc">${localize('editor.stack_order_desc')}</div>
      <div class="section-order-list" data-area-id=${areaId}>
        ${order.map((key) => {
          const meta = StrategyEditor._stackMeta.get(key)!;
          const isPresent = present.has(key);
          return html`
            <div
              class="section-order-item ${isPresent ? '' : 'disabled'}"
              data-area-id=${areaId}
              data-stack-key=${key}
              draggable="true"
              @dragstart=${this._handleStackDragStart}
              @dragend=${this._handleStackDragEnd}
              @dragover=${this._handleStackDragOver}
              @dragleave=${this._handleStackDragLeave}
              @drop=${this._handleStackDrop}>
              <span class="drag-handle" draggable="true">&#x2630;</span>
              <ha-icon class="section-icon" icon=${meta.icon}></ha-icon>
              <span class="section-label">${localize(meta.labelKey)}</span>
              ${!isPresent
                ? html`<span class="section-hidden-tag">${localize('editor.stack_not_present')}</span>`
                : nothing}
            </div>
          `;
        })}
      </div>
    </div>
  `;
}
```

> Hinweis: `.section-order-title`, `.section-order-desc`, `.section-order-list`, `.section-order-item`, `.disabled`, `.drag-handle`, `.section-icon`, `.section-label`, `.section-hidden-tag` existieren bereits im `static styles`-Block (CSS-Zeilen 467-527). Falls `.section-order-title`/`.section-order-desc` dort nicht existieren, stattdessen vorhandene Label-/Beschreibungsklassen des Editors verwenden — KEIN neues CSS hinzufügen.

- [ ] **Schritt 7: Panel in `_renderAreaEntities` einhängen**

In `_renderAreaEntities` (1860-1949): direkt vor dem schließenden `</div>` des `entity-groups`-Containers (nach dem `${hasBadges ? ... : nothing}`-Block, vor Zeile ~1960) einfügen:

```typescript
        ${this._renderStackOrderPanel(areaId, data)}
```

- [ ] **Schritt 8: Fünf Drag-Handler hinzufügen**

Exakte Spiegelung der `_handleSectionDrag*`-Handler (1143-1208), aber mit `data-stack-key`, `_stackDraggedElement`, `_getStacksOrder(areaId)` und `_updateStacksOrder(areaId, ...)`:

```typescript
private _handleStackDragStart(e: DragEvent): void {
  const item = e.currentTarget as HTMLElement;
  const target = e.target as HTMLElement;
  if (!target.closest('.drag-handle')) {
    e.preventDefault();
    return;
  }
  item.classList.add('dragging');
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.dataset.stackKey || '');
  }
  this._stackDraggedElement = item;
}

private _handleStackDragEnd(e: DragEvent): void {
  const item = e.currentTarget as HTMLElement;
  item.classList.remove('dragging');
  this.shadowRoot
    ?.querySelectorAll('.section-order-item.drag-over')
    .forEach((el) => el.classList.remove('drag-over'));
  this._stackDraggedElement = null;
}

private _handleStackDragOver(e: DragEvent): void {
  e.preventDefault();
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
  const item = e.currentTarget as HTMLElement;
  if (item !== this._stackDraggedElement) {
    item.classList.add('drag-over');
  }
}

private _handleStackDragLeave(e: DragEvent): void {
  const item = e.currentTarget as HTMLElement;
  item.classList.remove('drag-over');
}

private _handleStackDrop(e: DragEvent): void {
  e.stopPropagation();
  e.preventDefault();
  const dropItem = e.currentTarget as HTMLElement;
  dropItem.classList.remove('drag-over');

  const draggedKey = this._stackDraggedElement?.dataset.stackKey as StackKey | undefined;
  const dropKey = dropItem.dataset.stackKey as StackKey | undefined;
  const areaId = dropItem.dataset.areaId;
  if (!draggedKey || !dropKey || !areaId || draggedKey === dropKey) return;

  const currentOrder = this._getStacksOrder(areaId);
  const draggedIndex = currentOrder.indexOf(draggedKey);
  const dropIndex = currentOrder.indexOf(dropKey);
  if (draggedIndex === -1 || dropIndex === -1) return;

  const newOrder = [...currentOrder];
  newOrder.splice(draggedIndex, 1);
  newOrder.splice(dropIndex, 0, draggedKey);
  this._updateStacksOrder(areaId, newOrder);
}
```

> Wichtig: `_handleStackDragStart` muss eine **eigenständige** Methode sein (kein Arrow-Property), aber im Template ohne `.bind` referenziert. Prüfe, wie die `_handleSectionDrag*`-Handler im Template gebunden werden (1087-1139: direkt `@dragstart=${this._handleSectionDragStart}`). LitElement bindet `this` automatisch, weil die Handler über `this._...` referenziert werden — exakt gleiches Muster übernehmen. Falls die bestehenden Section-Handler stattdessen Arrow-Properties sind, dieselbe Form (`= (e: DragEvent) => {...}`) für die Stack-Handler verwenden.

- [ ] **Schritt 9: Build & Lint**

Run: `npm run build`
Erwartet: erfolgreicher Build (editor-Chunk).

Run: `npm run lint`
Erwartet: keine neuen Lint-Fehler.

- [ ] **Schritt 10: Commit**

```bash
git add src/editor/StrategyEditor.ts
git commit -m "feat(editor): Pro-Bereich Drag&Drop für Raum-Stack-Reihenfolge"
```

---

## Task 6: Versionsbump, Verifikation, Doku

**Dateien:**
- Modify: `package.json` (Zeile 3)
- Modify: `src/simon42-dashboard-strategy.ts` (Zeile 13)
- Modify: `package-lock.json` (automatisch via `npm install`)
- Modify: `CLAUDE.md` (Roadmap + Config-Hierarchie)

- [ ] **Schritt 1: package.json Version bumpen**

`"version": "1.3.4-beta.11"` → `"version": "1.3.4-beta.12"`

- [ ] **Schritt 2: STRATEGY_VERSION bumpen**

In `src/simon42-dashboard-strategy.ts` Zeile 13:
`const STRATEGY_VERSION = '1.3.4-beta.11';` → `const STRATEGY_VERSION = '1.3.4-beta.12';`

- [ ] **Schritt 3: package-lock.json aktualisieren**

Run: `npm install`
Erwartet: `package-lock.json` spiegelt `1.3.4-beta.12`.

- [ ] **Schritt 4: Finaler Production-Build & Lint**

Run: `npm run build`
Erwartet: erfolgreicher Build, `dist/`-Dateien (inkl. content-hash Chunks + `.gz`/`.br`) neu erzeugt.

Run: `npm run lint`
Erwartet: keine Lint-Fehler.

- [ ] **Schritt 5: CLAUDE.md aktualisieren**

In der Roadmap-Sektion "Completed (main)" am Ende ergänzen:

```markdown
- [x] RoomViewStrategy: Stacks pro Bereich umsortierbar (`areas_options.{areaId}.stacks_order`, Keyed-Map-Refactor + Editor-Drag&Drop, no_dboard bleibt wirksam)
```

In der "Config Hierarchy"-Sektion bei den Area-/Entity-Level-Einträgen ergänzen:

```markdown
- **Area-level (Stack-Reihenfolge)**: areas_options.{areaId}.stacks_order (14 StackKeys, Default DEFAULT_STACKS_ORDER)
```

- [ ] **Schritt 6: Commit (src + dist + Doku)**

```bash
git add package.json package-lock.json src/simon42-dashboard-strategy.ts dist CLAUDE.md
git commit -m "chore(release): v1.3.4-beta.12 – Raum-Stack-Reihenfolge"
```

- [ ] **Schritt 7: Live-Test (manuell, vor Push)**

`dist/`-Inhalte nach `/config/www/community/simon42-dashboard-strategy/` kopieren, stale `.gz`/`.br` löschen, Browser hart neu laden. Editor öffnen → Bereich aufklappen → "Reihenfolge der Raum-Blöcke" sichtbar; Drag&Drop ändert Reihenfolge; nicht vorhandene Blöcke ausgegraut mit "(nicht vorhanden)". Raumansicht zeigt Blöcke in neuer Reihenfolge. `no_dboard`-Sensoren bleiben ausgeblendet.

- [ ] **Schritt 8: Push & PR**

```bash
git push -u origin feature/room-stack-reorder
gh pr create --base main --head feature/room-stack-reorder --title "Raum-Stack-Reihenfolge pro Bereich" --body "..."
```

CI abwarten → mergen → Tag `v1.3.4-beta.12` als Pre-Release.

---

## Selbst-Review-Notiz (Plan-Autor)

- **Spec-Abdeckung:** Spec-Sektion 1 (Typen) → Task 1; Sektion 1 (mergeStacksOrder) → Task 2; Sektion 2 (RoomView-Refactor) → Task 3; Sektion 3 (Editor) → Task 5; Sektion 4 (i18n) → Task 4; Sektion 5 (Release/Doku) → Task 6. ✅
- **Typ-Konsistenz:** `StackKey`, `DEFAULT_STACKS_ORDER`, `mergeStacksOrder`, `stacks_order`, `pushStack`, `_getStacksOrder`/`_updateStacksOrder`, `_stackMeta`, `_handleStackDrag*` durchgängig identisch benannt. ✅
- **no_dboard-Constraint:** Task 3 ändert ausschließlich die Sammel-Struktur und Emit-Reihenfolge; Entity-Quelle (`Registry.getVisibleEntitiesForArea`) und Filterung unangetastet. ✅
- **YAGNI:** keine globale Reihenfolge, keine Pro-Gerät-Sortierung, keine Sichtbarkeits-Toggles. ✅
