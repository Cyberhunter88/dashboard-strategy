# Design: USV-Anzeige in der Raumansicht

**Datum:** 2026-06-01
**Status:** Entwurf (freigegeben)
**Betroffene Komponente:** `src/views/RoomViewStrategy.ts`, `src/types/strategy.ts`, `src/editor/`

## Ziel

In einer Raum-Detailansicht (z. B. „Arbeitszimmer", in dem eine USV/UPS steht)
soll automatisch eine USV-Sektion erscheinen: ein **Gauge** („Tacho") für den
Akkustand plus eine Reihe **Sensor-Kacheln** für die weiteren USV-Werte
(Restlaufzeit, Last, Spannung, Status etc.).

**Kernanforderungen:**
- **Auto-Erkennung** — keine manuelle Konfiguration nötig. USV-Geräte werden
  selbstständig erkannt.
- **`no_dboard` bleibt voll wirksam** — der Nutzer hat weitere lose SNMP-Sensoren
  und muss diese weiterhin per Label `no_dboard` ("no-dashboard") ausschließen
  können. Die Erkennung darf solche losen Sensoren **nicht** fälschlich als USV
  interpretieren.
- **Integrationsunabhängig** — sowohl NUT als auch SNMP liefern USV-Daten; beide
  legen die USV-Sensoren auf einem eigenen HA-Gerät ab.
- **Nur HA-Standardkarten** — die Sektion wird ausschließlich aus nativen Karten
  gebaut (`gauge`, `tile`). Keine eigene LitElement-Karte.
- **Layout Variante A** — Gauge oben, darunter eine Reihe Sensor-Kacheln.
- **Ansatz 1 (ganzes Gerät rendern)** — der Akku wird zum Gauge, alle übrigen
  sichtbaren Entities des Geräts werden zu Tiles; bekannte Rollen werden
  vorsortiert.

## Architektur-Überblick

Die gesamte Logik lebt in `RoomViewStrategy.generate()`. Es wird **keine** neue
Karte und **kein** neues Modul eingeführt — die Strategy emittiert nur zusätzliche
native Lovelace-Kartenkonfigurationen.

Datenquelle ist ausschließlich `Registry.getVisibleEntitiesForArea(area_id)`. Diese
Methode liefert bereits vorgefilterte Entities (ohne `no_dboard`, ohne
hidden/disabled, ohne config/diagnostic, ohne `groups_options.hidden`). Da die
USV-Erkennung **nur auf diesem vorgefilterten Input** arbeitet, bleiben `no_dboard`
und per-Raum-Ausblendungen automatisch wirksam — ausgeschlossene Sensoren sind gar
nicht erst Teil der Erkennung.

## Erkennung (Auto-Detection)

Gerätebasiert und integrationsunabhängig, eingebettet in den bestehenden
Kategorisierungs-Loop von `RoomViewStrategy.generate()`.

**Ablauf:**

1. Während des Loops über `Registry.getVisibleEntitiesForArea(area_id)` werden die
   sichtbaren Entities pro `device_id` in einer `Map<deviceId,
   EntityRegistryDisplayEntry[]>` gesammelt.
2. Nach dem Loop wird für jedes Gerät die **USV-Heuristik** geprüft:
   - hat **mindestens einen** Sensor mit `device_class: battery` und Einheit `%`,
     **UND**
   - hat **mindestens einen weiteren** USV-typischen Sensor, erkannt über
     `device_class` (`duration`, `apparent_power`, `power`, `voltage`) **oder**
     Entity-ID-Muster (`load`, `runtime`, `time_left`, `input_voltage`, `status`).
   - Beide Bedingungen zusammen → Gerät gilt als USV.
3. **NUT-Schnellerkennung:** ist die Plattform der Entities `nut`
   (`entity.platform === 'nut'`), genügt das Batterie-Kriterium allein, da
   NUT-Geräte eindeutig USV sind.

**Begründung gerätebasiert:** Lose SNMP-Sensoren (ohne eigenes USV-Gerät bzw. ohne
die Kombination Batterie + Laufzeit/Last) lösen die Heuristik nicht aus.

**Hinweis zu `getEntityIdsForDevice`:** Falls Geschwister-Entities über die
Device-Map nachgeschlagen werden, liefert `getEntityIdsForDevice` **rohe**
(ungefilterte) IDs — diese müssten zusätzlich per `Registry.isEntityExcluded(id)`
geprüft werden (wie im Kamera-Code). Im hier gewählten Ansatz wird jedoch
ausschließlich die bereits gefilterte `device_id`-Map aus Schritt 1 verwendet, daher
ist dieser Zusatz-Check nicht nötig.

## Rendering (Ansatz 1, Variante A)

Pro erkanntem USV-Gerät wird **eine eigene Sektion** erzeugt, analog zum bestehenden
`domainSection`-Muster (`{ type: 'grid', cards: [...] }`).

**1. Heading**
```js
{ type: 'heading', heading_style: 'title', icon: 'mdi:power-plug-battery',
  heading: device.name_by_user ?? device.name }
```
Der Gerätename macht mehrere USV im selben Raum automatisch unterscheidbar.

**2. Gauge (Akku)**
```js
{
  type: 'gauge',
  entity: batteryId,
  name: localize('ups.battery'),   // "Akku" / "Battery"
  min: 0, max: 100,
  needle: false,
  severity: { red: 0, yellow: critThreshold, green: lowThreshold }
}
```
Schwellen aus der Config (`battery_critical_threshold` = 20,
`battery_low_threshold` = 50) — konsistent zur übrigen Batterie-Logik. Ergebnis:
rot < 20, gelb 20–50, grün ≥ 50.

**3. Sensor-Tiles** — alle übrigen sichtbaren Entities des Geräts (außer dem
Akku-Sensor) als `tile`-Karten:
```js
{ type: 'tile', entity: id, vertical: false }
```

**Sortierung** (bekannte Rollen zuerst, dann Rest in Registry-Reihenfolge):
1. **Restlaufzeit** — `device_class: duration` oder ID enthält
   `runtime`/`time_left`/`load_runtime`
2. **Last** — `device_class` `power`/`apparent_power` oder ID enthält `load`
3. **Spannung** — `device_class: voltage` oder ID enthält `voltage`/`input`
4. **Status** — ID enthält `status`/`state`
5. **Rest** — alle weiteren Sensoren in Registry-Reihenfolge

Die Rollen-Erkennung dient **nur der Sortierung**, nicht dem Filtern. Unbekannte
Sensoren werden am Ende **trotzdem angezeigt** — so bleiben fremde/zukünftige
SNMP-Felder sichtbar, ohne sie hart kennen zu müssen.

## Platzierung & Doppel-Listung

- USV-Erkennung läuft als **erster Schritt** der Kategorisierung. Alle Entity-IDs
  erkannter USV-Geräte kommen in ein `usedByUps`-Set.
- Die nachfolgende normale Kategorisierung **überspringt** Entities aus
  `usedByUps`. Insbesondere darf der USV-Akku **nicht** zusätzlich in
  `sensorEntities.battery` (`RoomViewStrategy.ts:152`) landen.
- Die USV-Sektion(en) werden direkt **vor der Kamera-Sektion** eingereiht (beides
  „Geräteblöcke"). Bei mehreren USV: eine Sektion pro Gerät.

## Konfiguration

Neuer Toggle in `src/types/strategy.ts`:

```ts
show_ups_in_rooms?: boolean; // default: true
```

**Default `true` (opt-out)**, abweichend von den übrigen `show_*_in_rooms`-Togglen
(die sind opt-in für Zusatzinhalte). Begründung: Die Auto-Erkennung greift nur bei
echten USV-Geräten (Batterie% + Laufzeit/Last), es gibt also keine Fehlauslösung;
eine USV im Raum ist relevante Information. Wer sie nicht möchte, schaltet den Toggle
ab oder labelt das Gerät mit `no_dboard`.

Editor-UI: Der Toggle wird in die Raum-Optionen des `StrategyEditor` aufgenommen,
in derselben Gruppe wie `show_locks_in_rooms` etc. (inkl. DE/EN-Lokalisierung).

## Edge Cases

| Fall | Verhalten |
|------|-----------|
| Mehrere USV im Raum | Je Gerät eine eigene Sektion, Gerätename als Überschrift |
| Lose SNMP-Sensoren (kein USV-Gerät / nur Batterie ohne Laufzeit) | Heuristik greift nicht → normale Kategorisierung; `no_dboard` voll wirksam |
| USV-Gerät ohne sichtbaren Batterie-Sensor (Akku per `no_dboard` aus) | Heuristik greift nicht (Batterie Pflicht) → übrige Sensoren laufen normal durch. Bewusst akzeptiert, kein Sonderpfad |
| Akku-Sensor ohne Einheit `%` | Nicht als Gauge-Quelle akzeptiert (Heuristik verlangt `%`) |
| `show_ups_in_rooms = false` | Keine USV-Erkennung, keine `usedByUps`-Aussonderung — Entities laufen normal durch |

## i18n

Neue Localize-Keys (DE/EN), analog bestehendem Muster:
- `ups.battery` → „Akku" / „Battery"
- ggf. Editor-Label für `show_ups_in_rooms`

## Nicht im Scope (YAGNI)

- Keine eigene LitElement-Karte, kein History-Graph (Variante B/C verworfen).
- Keine manuelle USV-Zuordnung in der Config.
- Keine Auto-Erkennung von USV außerhalb von Raumansichten (kein Summary).
- Keine Aktions-Buttons (z. B. Test/Shutdown) in dieser Iteration.
