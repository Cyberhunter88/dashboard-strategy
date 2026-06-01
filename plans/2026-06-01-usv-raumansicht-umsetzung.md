# USV/UPS-Erkennung in Raum-Ansichten — Umsetzungsplan

> **Für agentische Bearbeiter:** ERFORDERLICHE SUB-SKILL: Nutze superpowers:subagent-driven-development (empfohlen) oder superpowers:executing-plans, um diesen Plan Aufgabe für Aufgabe umzusetzen. Schritte verwenden Checkbox-Syntax (`- [ ]`) zur Nachverfolgung.

**Ziel:** Raum-Ansichten erkennen USV-/UPS-Geräte automatisch und zeigen pro Gerät einen eigenen Block (Überschrift + Akku-Gauge + Sensor-Tiles), ohne den `no_dboard`-Filter zu unterlaufen.

**Architektur:** Die gesamte Logik lebt in `RoomViewStrategy.generate()` — kein neues Card/Modul. Datenquelle ist ausschließlich `Registry.getVisibleEntitiesForArea(area.area_id)` (vorgefiltert: kein `no_dboard`, kein hidden/disabled, kein config/diagnostic). USV-Erkennung läuft als erster Kategorisierungsschritt, sammelt verbrauchte Entity-IDs in einem `usedByUps`-Set, die normale Kategorisierung überspringt diese. Gerendert wird mit nativen HA-Cards (`gauge` + `tile`), direkt vor der Kamera-Sektion.

**Tech-Stack:** TypeScript (ES2020, strict), Webpack Code-Split-Chunks. Kein Test-Runner — Verifikation über `npm run build`, `npm run build-dev`, `npm run lint` und Live-Test in HA.

**Verbindliche Randbedingung (User, wörtlich):** „ich habe noch andere sensoren über die smnp und es wäre gut das ich weiterhin mit dem label no-dashboard arbeiten kann“ — der `no_dboard`-Filter muss voll wirksam bleiben. Deshalb arbeitet die Erkennung NUR auf `getVisibleEntitiesForArea` (bereits vorgefiltert); ausgeschlossene SNMP-Sensoren sind nie Teil der Erkennung.

**Referenz-Spec:** `docs/superpowers/specs/2026-06-01-usv-raumansicht-design.md`

---

## Aufgabe 1: Config-Toggle `show_ups_in_rooms` im Typ ergänzen

**Dateien:**
- Modify: `src/types/strategy.ts:43-47` (Block der Raum-Toggles)

- [ ] **Schritt 1: Typ-Feld einfügen**

In `src/types/strategy.ts` direkt nach Zeile 45 (`show_scripts_in_rooms?: boolean; // default: false`) einfügen:

```typescript
  show_ups_in_rooms?: boolean; // default: true (Opt-out, anders als die übrigen show_*_in_rooms)
```

Ergebnis (Kontext):

```typescript
  show_locks_in_rooms?: boolean; // default: false
  show_automations_in_rooms?: boolean; // default: false
  show_scripts_in_rooms?: boolean; // default: false
  show_ups_in_rooms?: boolean; // default: true (Opt-out, anders als die übrigen show_*_in_rooms)
  show_window_contacts_in_rooms?: boolean; // default: false
  show_door_contacts_in_rooms?: boolean; // default: false
```

- [ ] **Schritt 2: Typecheck via Build**

Run: `npm run build`
Erwartung: Build erfolgreich, keine TS-Fehler (das Feld ist optional, daher allein noch kein Verhaltensänderung).

---

## Aufgabe 2: i18n-Schlüssel (DE + EN)

**Dateien:**
- Modify: `src/translations/de.json`
- Modify: `src/translations/en.json`

Der Akku-Gauge-Name wird über `localize('ups.battery')` aufgelöst; `localize.ts` löst Punkt-Notation über verschachtelte Objekte auf, daher ein neuer Top-Level-Block `ups`. Editor-Label/Description liegen im bestehenden `editor`-Block.

- [ ] **Schritt 1: DE — Top-Level-Block `ups` ergänzen**

In `src/translations/de.json` einen neuen Top-Level-Schlüssel `"ups"` hinzufügen (z.B. direkt vor `"room"`). Beispiel-Position und Inhalt:

```json
  "ups": {
    "battery": "Akku"
  },
```

- [ ] **Schritt 2: DE — Editor-Label + Description ergänzen**

In `src/translations/de.json` im `editor`-Block nach Zeile 166 (`"show_scripts_in_rooms_desc": ...`) einfügen:

```json
    "show_ups_in_rooms": "USV/UPS in Raum-Ansichten anzeigen",
    "show_ups_in_rooms_desc": "Erkennt USV-/UPS-Geräte (z.B. über NUT oder SNMP) automatisch und zeigt pro Gerät einen Block mit Akku-Ladestand und zugehörigen Sensoren in der jeweiligen Raum-Ansicht. Sensoren, die per Label 'no_dboard' oder über die Entitäts-Optionen ausgeblendet sind, werden nicht berücksichtigt.",
```

- [ ] **Schritt 3: EN — Top-Level-Block `ups` ergänzen**

In `src/translations/en.json` analog zu DE einen Top-Level-Schlüssel `"ups"` hinzufügen:

```json
  "ups": {
    "battery": "Battery"
  },
```

- [ ] **Schritt 4: EN — Editor-Label + Description ergänzen**

In `src/translations/en.json` im `editor`-Block direkt nach den `show_scripts_in_rooms`/`show_scripts_in_rooms_desc`-Einträgen einfügen:

```json
    "show_ups_in_rooms": "Show UPS in room views",
    "show_ups_in_rooms_desc": "Automatically detects UPS devices (e.g. via NUT or SNMP) and shows a block per device with battery level and related sensors in the respective room view. Sensors hidden via the 'no_dboard' label or entity options are not included.",
```

- [ ] **Schritt 5: JSON-Validität + Build prüfen**

Run: `npm run build`
Erwartung: Build erfolgreich. Falls JSON-Syntaxfehler (z.B. fehlendes/überzähliges Komma) → ts-loader/JSON-Import bricht ab; Komma vor dem neuen Block bzw. nach dem letzten neuen Eintrag prüfen.

---

## Aufgabe 3: USV-Erkennung + Rendering in RoomViewStrategy

**Dateien:**
- Modify: `src/views/RoomViewStrategy.ts` (Modul-Hilfsfunktion oben; Erkennung nach Zeile 85; Loop-Skip bei Zeile 88; Rendering vor der Kamera-Sektion bei Zeile 339)

Datentyp der `visibleEntities`-Einträge ist `EntityRegistryEntry` (siehe `src/types/registries.ts:12`) — Felder `entity_id`, `device_id?`, `platform?` sind direkt verfügbar. `Registry.getDevice(deviceId)` liefert `DeviceRegistryEntry` mit `name`, `name_by_user`.

- [ ] **Schritt 1: Modul-Hilfsfunktion für Sensor-Rollen-Sortierung ergänzen**

In `src/views/RoomViewStrategy.ts` direkt nach `mediaPlayerSupportsPlayback` (nach Zeile 35) einfügen:

```typescript
/**
 * Rollenpriorität eines USV-Sensors — NUR zur Sortierung, nicht zum Filtern.
 * 1 = Restlaufzeit/Runtime, 2 = Last/Leistung, 3 = Spannung, 4 = Status, 5 = Rest.
 * Unbekannte Sensoren (5) bleiben in Registry-Reihenfolge.
 */
function upsSensorRole(entityId: string, hass: HomeAssistant): number {
  const dc = hass.states[entityId]?.attributes?.device_class as string | undefined;
  if (dc === 'duration' || /runtime|time_left|load_runtime/.test(entityId)) return 1;
  if (dc === 'power' || dc === 'apparent_power' || /(^|[._])load([._]|$)/.test(entityId)) return 2;
  if (dc === 'voltage' || /voltage|input/.test(entityId)) return 3;
  if (/status|state/.test(entityId)) return 4;
  return 5;
}

/** USV-Gerätedaten für das Rendering. */
interface UpsDeviceRender {
  name: string;
  batteryId: string;
  sensorIds: string[];
}
```

- [ ] **Schritt 2: USV-Erkennung als erster Kategorisierungsschritt einfügen**

In `src/views/RoomViewStrategy.ts` direkt nach Zeile 85 (`const visibleEntities = Registry.getVisibleEntitiesForArea(area.area_id);`) und VOR der `for`-Schleife (Zeile 87) einfügen:

```typescript
    // === USV/UPS-Erkennung (gerätebasiert, integrationsunabhängig) ===
    // Läuft als erster Schritt: belegte Entitäten landen in usedByUps und werden
    // von der normalen Kategorisierung übersprungen. Arbeitet ausschließlich auf
    // den vorgefilterten visibleEntities — no_dboard/hidden bleiben voll wirksam.
    const showUps = dashboardConfig.show_ups_in_rooms !== false; // default: true (Opt-out)
    const usedByUps = new Set<string>();
    const upsDevices: UpsDeviceRender[] = [];

    if (showUps) {
      // 1. Sichtbare Entitäten nach device_id gruppieren
      const byDevice = new Map<string, typeof visibleEntities>();
      for (const entity of visibleEntities) {
        const deviceId = entity.device_id;
        if (!deviceId) continue;
        let arr = byDevice.get(deviceId);
        if (!arr) {
          arr = [];
          byDevice.set(deviceId, arr);
        }
        arr.push(entity);
      }

      // 2. Pro Gerät USV-Heuristik anwenden
      const upsDeviceClasses = new Set(['duration', 'apparent_power', 'power', 'voltage']);
      const upsIdPattern = /load|runtime|time_left|input_voltage|status/;
      for (const [deviceId, entities] of byDevice) {
        let batteryId: string | undefined;
        let hasUpsSignal = false;
        let isNut = false;

        for (const e of entities) {
          if (e.platform === 'nut') isNut = true;
          const st = hass.states[e.entity_id];
          if (!st) continue;
          const dc = st.attributes?.device_class as string | undefined;
          const unit = st.attributes?.unit_of_measurement as string | undefined;

          if (!batteryId && e.entity_id.startsWith('sensor.') && dc === 'battery' && unit === '%') {
            batteryId = e.entity_id;
            continue; // Akku selbst zählt nicht als zusätzliches USV-Signal
          }
          if (dc && upsDeviceClasses.has(dc)) hasUpsSignal = true;
          else if (upsIdPattern.test(e.entity_id)) hasUpsSignal = true;
        }

        // Akku ist Pflicht. NUT: Akku allein genügt; sonst zusätzliches USV-Signal nötig.
        if (!batteryId) continue;
        if (!isNut && !hasUpsSignal) continue;

        const sensorIds: string[] = [];
        for (const e of entities) {
          if (e.entity_id === batteryId) continue;
          if (!hass.states[e.entity_id]) continue;
          sensorIds.push(e.entity_id);
        }

        const device = Registry.getDevice(deviceId);
        const name = device?.name_by_user ?? device?.name ?? 'UPS';
        upsDevices.push({ name, batteryId, sensorIds });

        usedByUps.add(batteryId);
        for (const id of sensorIds) usedByUps.add(id);
      }
    }

```

- [ ] **Schritt 3: USV-Entitäten in der normalen Kategorisierung überspringen**

In `src/views/RoomViewStrategy.ts` in der `for`-Schleife direkt nach Zeile 88 (`const entityId = entity.entity_id;`) einfügen:

```typescript
      // USV-Entitäten werden separat gerendert — hier überspringen
      if (usedByUps.has(entityId)) continue;
```

Ergebnis (Kontext):

```typescript
    for (const entity of visibleEntities) {
      const entityId = entity.entity_id;

      // USV-Entitäten werden separat gerendert — hier überspringen
      if (usedByUps.has(entityId)) continue;

      // State check
      const state = hass.states[entityId];
      if (!state) continue;
```

- [ ] **Schritt 4: USV-Sektionen vor der Kamera-Sektion rendern**

In `src/views/RoomViewStrategy.ts` direkt nach Zeile 337 (`const sections: LovelaceSectionConfig[] = [];`) und VOR dem `// Cameras`-Block (Zeile 339) einfügen:

```typescript
    // === USV/UPS-Sektionen (ein Block je Gerät, vor den Kameras) ===
    if (upsDevices.length > 0) {
      const critThreshold = dashboardConfig.battery_critical_threshold ?? 20;
      const lowThreshold = dashboardConfig.battery_low_threshold ?? 50;
      const upsBatteryName = localize('ups.battery');

      for (const ups of upsDevices) {
        const sortedSensors = [...ups.sensorIds].sort(
          (a, b) => upsSensorRole(a, hass) - upsSensorRole(b, hass)
        );

        const cards: LovelaceCardConfig[] = [
          {
            type: 'heading',
            heading_style: 'title',
            icon: 'mdi:power-plug-battery',
            heading: ups.name,
          },
          {
            type: 'gauge',
            entity: ups.batteryId,
            name: upsBatteryName,
            min: 0,
            max: 100,
            needle: false,
            // rot < critThreshold, gelb critThreshold–lowThreshold, grün ≥ lowThreshold
            severity: { red: 0, yellow: critThreshold, green: lowThreshold },
          },
          ...sortedSensors.map(
            (id): LovelaceCardConfig => ({ type: 'tile', entity: id, vertical: false })
          ),
        ];

        sections.push({ type: 'grid', cards });
      }
    }

```

- [ ] **Schritt 5: Production-Build**

Run: `npm run build`
Erwartung: Build erfolgreich, keine TS-Fehler. `RoomViewStrategy` landet im `views`-Chunk (siehe `webpack.config.ts:52-58`).

- [ ] **Schritt 6: Dev-Build (Source Maps)**

Run: `npm run build-dev`
Erwartung: Build erfolgreich.

- [ ] **Schritt 7: Lint**

Run: `npm run lint`
Erwartung: Keine Fehler. Bei Warnungen zu `any`/Formatierung ggf. `npm run lint:fix` und `npm run format`.

---

## Aufgabe 4: Editor-Toggle ergänzen

**Dateien:**
- Modify: `src/editor/StrategyEditor.ts` (`_renderAreasSection`, lokale Konstanten ~1421-1423; Checkbox-Block ~1456)

- [ ] **Schritt 1: Lokale Konstante lesen**

In `src/editor/StrategyEditor.ts` in `_renderAreasSection` nach Zeile 1423 (`const showScriptsInRooms = this._config.show_scripts_in_rooms === true;`) einfügen:

```typescript
    const showUpsInRooms = this._config.show_ups_in_rooms !== false; // default: true (Opt-out)
```

- [ ] **Schritt 2: Checkbox + Description rendern**

In `src/editor/StrategyEditor.ts` nach dem `show-scripts-in-rooms`-Block (nach Zeile 1456, vor dem `use-default-area-sort`-Block) einfügen:

```typescript
        ${this._renderCheckbox('show-ups-in-rooms', localize('editor.show_ups_in_rooms'), showUpsInRooms,
          (checked) => this._toggleChanged('show_ups_in_rooms', checked, true))}
        <div class="description">${localize('editor.show_ups_in_rooms_desc')}</div>

```

Hinweis: Dritter Parameter von `_toggleChanged` ist der Default-Wert. Für USV ist er `true` (Opt-out), damit der Schlüssel beim Standardzustand aus der Config gelöscht wird (kein unnötiger `show_ups_in_rooms: true`-Eintrag).

- [ ] **Schritt 3: Build (Editor-Chunk)**

Run: `npm run build`
Erwartung: Build erfolgreich. Editor landet im `editor`-Chunk (`webpack.config.ts:59-64`).

- [ ] **Schritt 4: Lint**

Run: `npm run lint`
Erwartung: Keine Fehler.

---

## Aufgabe 5: Versionsbump + Build-Artefakte

**Dateien:**
- Modify: `package.json:3` (`version`)
- Modify: `src/dashboard-strategy.ts` (`STRATEGY_VERSION`)
- Modify: `dist/` (durch Build erzeugt)

- [ ] **Schritt 1: Version in package.json erhöhen**

`"version": "1.3.4-beta.10"` → `"version": "1.3.4-beta.11"`.

- [ ] **Schritt 2: STRATEGY_VERSION angleichen**

In `src/dashboard-strategy.ts` `STRATEGY_VERSION` auf `'1.3.4-beta.11'` setzen (muss exakt zur package.json passen — wird in die Browser-Konsole geloggt).

- [ ] **Schritt 3: package-lock.json aktualisieren**

Run: `npm install`
Erwartung: `package-lock.json` aktualisiert (nur Versionsfeld).

- [ ] **Schritt 4: Finaler Production-Build**

Run: `npm run build`
Erwartung: `dist/` neu erzeugt, inkl. Content-Hash-Chunks und `.gz`/`.br`.

---

## Aufgabe 6: Live-Test in Home Assistant

**Manueller Test — kein automatisierter Runner vorhanden.**

- [ ] **Schritt 1: Deploy**

`dist/`-Inhalt nach `/config/www/community/dashboard-strategy/` kopieren. Anschließend veraltete `.gz`/`.br` löschen (HA bevorzugt komprimierte Varianten). Hard-Refresh (Strg+Shift+R).

- [ ] **Schritt 2: USV-Gerät prüfen**

In einem Raum mit USV (NUT und/oder SNMP):
- Erwartung: Eigener Block mit Geräte-Überschrift + `mdi:power-plug-battery`, Akku-Gauge (0–100, rot/gelb/grün gemäß Schwellen), darunter Sensor-Tiles in Rollen-Reihenfolge (Restlaufzeit, Last, Spannung, Status, Rest).
- Erwartung: Der Akku erscheint NICHT zusätzlich in der normalen Batterie-Liste.

- [ ] **Schritt 3: `no_dboard`-Filter verifizieren (verbindliche Randbedingung)**

Einen USV-Sensor mit Label `no_dboard` versehen → HA neu laden.
- Erwartung: Dieser Sensor taucht im USV-Block NICHT auf. Bleibt nur der Akku + reduzierte Erkennungssignale: USV-Block ggf. nicht mehr erkannt (wenn Akku allein nicht genügt und kein NUT) — das ist korrektes Verhalten.

- [ ] **Schritt 4: Opt-out verifizieren**

Im Editor „USV/UPS in Raum-Ansichten anzeigen“ deaktivieren.
- Erwartung: Kein USV-Block mehr; die ehemaligen USV-Sensoren erscheinen wieder in der normalen Kategorisierung (Akku in Batterie-Liste bei < 20 %, übrige als Tiles/Badges gemäß bestehender Logik).

- [ ] **Schritt 5: Raum ohne USV**

- Erwartung: Keine Regression — keine leeren USV-Blöcke, Layout unverändert.

---

## Aufgabe 7: Commit + PR

**Git: niemals direkt auf `main`. Feature-Branch + PR. Quelle UND `dist/` committen.**

- [ ] **Schritt 1: Feature-Branch von main**

```bash
git checkout main
git checkout -b feature/usv-raumansicht
```

- [ ] **Schritt 2: Staging (src + dist + Übersetzungen + Version)**

```bash
git add src/ dist/ package.json package-lock.json plans/2026-06-01-usv-raumansicht-umsetzung.md docs/superpowers/specs/2026-06-01-usv-raumansicht-design.md
```

- [ ] **Schritt 3: Commit**

```bash
git commit -m @'
feat: USV/UPS-Erkennung in Raum-Ansichten

Erkennt USV-/UPS-Geräte gerätebasiert (NUT/SNMP-unabhängig) und rendert
je Gerät einen Block mit Akku-Gauge und rollen-sortierten Sensor-Tiles.
Neuer Opt-out-Toggle show_ups_in_rooms (default: true). Erkennung arbeitet
ausschließlich auf vorgefilterten Entitäten — no_dboard bleibt voll wirksam.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
'@
```

- [ ] **Schritt 4: Push + PR**

```bash
git push -u origin feature/usv-raumansicht
gh pr create --base main --head feature/usv-raumansicht --title "feat: USV/UPS-Erkennung in Raum-Ansichten" --body "..."
```

Erwartung: HACS-Validierungs-Workflow startet. Erst nach grünem CI mergen.

---

## Aufgabe 8: Projekt-CLAUDE.md aktualisieren

**Globale Regel: CLAUDE.md nach jeder abgeschlossenen Aufgabe aktualisieren.**

- [ ] **Schritt 1: Config-Hierarchie ergänzen**

In `CLAUDE.md` unter „Config Hierarchy → Global toggles“ `show_ups_in_rooms` ergänzen.

- [ ] **Schritt 2: Roadmap-Eintrag**

Unter „Completed“ einen Eintrag ergänzen, z.B.:
`- [x] USV/UPS-Erkennung in Raum-Ansichten (gerätebasiert, Akku-Gauge + Sensor-Tiles, Opt-out show_ups_in_rooms)`

---

## Selbst-Review (Plan gegen Spec)

**1. Spec-Abdeckung:**
- Datenquelle nur `getVisibleEntitiesForArea` → Aufgabe 3, Schritt 2 ✓
- Gerätebasierte Heuristik (Akku-Pflicht + Zusatzsignal, NUT-Shortcut) → Aufgabe 3, Schritt 2 ✓
- `usedByUps`-Set + Loop-Skip, Akku nicht doppelt → Aufgabe 3, Schritt 3 ✓
- Rendering: heading + gauge (severity-Schwellen) + tiles, Rollen-Sortierung → Aufgabe 3, Schritte 1+4 ✓
- Platzierung vor Kamera-Sektion → Aufgabe 3, Schritt 4 (nach Zeile 337, vor 339) ✓
- Toggle `show_ups_in_rooms` default true (Opt-out) → Aufgaben 1, 4 ✓
- i18n `ups.battery` DE/EN + Editor-Label/Desc → Aufgabe 2 ✓
- Rolle nur für Sortierung, unbekannte Sensoren bleiben sichtbar → `upsSensorRole` (Aufgabe 3, Schritt 1) gibt 5 zurück, filtert nicht ✓

**2. Placeholder-Scan:** Keine TBD/TODO; jeder Code-Schritt enthält vollständigen Code und exakte Zeilen. ✓

**3. Typ-Konsistenz:** `UpsDeviceRender` { name, batteryId, sensorIds } in Schritt 1 definiert, in Schritten 2+4 identisch verwendet. `upsSensorRole(id, hass)`-Signatur in Schritt 1 definiert, in Schritt 4 identisch aufgerufen. `usedByUps` in Schritt 2 deklariert, in Schritt 3 verwendet. `dashboardConfig`/`localize`/`Registry.getDevice` sind im File bereits vorhanden (Zeilen 42, 17, Kamera-Block). ✓
