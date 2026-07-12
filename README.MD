# Dashboard Strategy

[![HACS Custom](https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=for-the-badge)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/v/release/Cyberhunter88/dashboard-strategy?style=for-the-badge&color=green)](https://github.com/Cyberhunter88/dashboard-strategy/releases)
[![GitHub Stars](https://img.shields.io/github/stars/Cyberhunter88/dashboard-strategy?style=for-the-badge&color=yellow)](https://github.com/Cyberhunter88/dashboard-strategy/stargazers)
![AI-Assisted](https://img.shields.io/badge/AI--Assisted-blue?style=for-the-badge)
[![License](https://img.shields.io/badge/License-CC_BY--NC--SA_4.0-lightgrey?style=for-the-badge)](LICENSE)

Eine modulare und hochkonfigurierbare Dashboard-Strategy für Home Assistant, die automatisch Views basierend auf Bereichen, Entitäten und deren Zuständen generiert.


---


## Features

- **Grafischer Konfigurator** — Flache, einklappbare Einstellungs-Panels mit gespeichertem Zustand; Drag & Drop für Bereiche und Startseiten-Blöcke
- **Automatische Raum-Erkennung** — Nutzt Home Assistant Areas, Devices & Floors
- **Spezialisierte Views** — Lichter, Rollos, Sicherheit, Batterien, Klima — jeweils mit Status-Gruppierung
- **Zusammenfassungskarten** — Einzeln ein-/ausschaltbar für Lichter, Rollos, Sicherheit, Batterien und Klima
- **Etagen-Gruppierung** — Bereiche und Lichter optional nach Etagen gliedern
- **Favoriten** — Beliebige Entitäten sowie eine eigene Schnellzugriffsreihe für Lieblingslichter
- **Alarm-Panel** — Optionale Alarmanlage neben der Uhr
- **Granulare Filterung** — Per Label (`no_dboard`), pro Bereich, pro Domain, pro Entity
- **Wetter-Startseite** — Alternative Startseite mit großem Uhr-/Datumsblock, Wetterblöcken, freien Karten, Abschnitten, Bereichen und Etagen in eigener Reihenfolge
- **Teiloffene Rollos** — Optionale dritte Gruppe (Offen / Teiloffen / Geschlossen) mit Live-Übergängen
- **Alert-Icons** — Optionale Alert-Badges auf Bereichskarten (Bewegung, Feuchtigkeit, Rauch, Wärme u.a.)
- **Rauch- & Gasmelder** — In der Sicherheits-Übersicht, im Security-Summary-Count und als Badges in Raum-Views
- **Erweiterte Sicherheitsansicht** — Optional nach Bereichen gruppiert, mit Zusatzentitäten und nativem 24-Stunden-Logbuch
- **UPS/USV-Erkennung** — Automatische USV-Gruppen in Raum-Views mit Gauge und zugehörigen Kacheln
- **Batch-Aktionen** — Heading-Badges für Gruppensteuerung (alle ein/aus, alle öffnen/schließen)
- **Automationen & Skripte in Räumen** — Bereichs-zugeordnete Automationen und Skripte in Raum-Views anzeigen
- **Eigene Karten** — Beliebige Karten via YAML auf der Übersicht einbinden
- **Eigene Abschnitte** — Mehrere eigene Sections mit Überschrift, Icon und beliebigen Karten
- **Eigene Karten pro Raum** — YAML, geführte Kacheln oder komplette Sections ober- oder unterhalb der automatischen Raum-Abschnitte
- **Eigene Badges** — Beliebige Badges via YAML im Header (neben Personen-Chips)
- **Custom Views** — Eigene Dashboard-Views mit beliebigen Cards via YAML
- **Reaktive Updates** — Echtzeit-Aktualisierung via LitElement Custom Cards
- **Mehrsprachig** — Deutsch und Englisch, automatische Erkennung aus HA-Einstellungen, Fallback auf Englisch
- **Sichtbarkeitsregeln** — Views und Sections pro Benutzer sowie Raum-Views abhängig von Entity-Zuständen anzeigen
- **Performance-optimiert** — Code-Split Bundles, Registry-Caching, Tile-Card-Pooling

## Installation

### HACS (empfohlen)

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Cyberhunter88&repository=dashboard-strategy&category=plugin)

<details>
<summary>Alternative zum Button</summary>

1. Gehe zu HACS → **Custom repositories**
2. Füge das Repository hinzu: `https://github.com/Cyberhunter88/dashboard-strategy`
3. Lade die "Dashboard Strategy" herunter
4. Klicke nach dem Download in HACS auf die Meldung "Neu laden", um die Installation abzuschließen

</details>

### Manuelle Installation

<details>
<summary>Manuelle Installationsschritte</summary>

1. Kopiere alle Dateien aus `dist/` nach `/config/www/dashboard-strategy/`
2. Füge in `configuration.yaml` hinzu:

```yaml
lovelace:
  mode: storage
  resources:
    - url: /local/dashboard-strategy/dashboard-strategy.js
      type: module
```

3. Starte Home Assistant neu

</details>

## Voraussetzungen

Die Strategy generiert das Dashboard automatisch aus deiner Home Assistant Konfiguration. Damit alles korrekt angezeigt wird:

**Bereiche & Etagen einrichten** — Lege in Home Assistant unter **Einstellungen → Bereiche & Zonen** deine Räume an und weise sie optional Etagen zu. Geräte müssen einem Bereich zugeordnet sein, damit sie im Dashboard erscheinen.

<p align="center">
  <img src="https://raw.githubusercontent.com/Cyberhunter88/dashboard-strategy/main/assets/Etagen-und-Bereiche.gif" alt="Etagen und Bereiche in Home Assistant einrichten" width="800" />
</p>

**Geräte zuweisen** — Weise deine Geräte (Lampen, Sensoren, Rollos etc.) in den HA-Einstellungen einem Bereich zu. Die Strategy erkennt automatisch, welche Entitäten in welchem Raum sind.

**Temperatur & Feuchtigkeit** — Die Bereichskarten auf der Übersicht zeigen Temperatur und Feuchtigkeit nur an, wenn du die Sensoren in den **Home Assistant Bereichseinstellungen** explizit zugewiesen hast (**Einstellungen → Bereiche → Bereich bearbeiten → Temperatur-Sensor / Feuchtigkeits-Sensor**). Diese Einstellung findest du in Home Assistant selbst, nicht im Strategy-Editor. Eine automatische Erkennung würde bei manchen Setups falsche Sensoren anzeigen (z.B. Drucker-Temperatur im Büro). HA's eigene Home Strategy macht es genauso. In den **Raum-Detail-Views** hingegen werden Sensoren automatisch als Badges erkannt — unerwünschte Badges können über das Label `no_dboard` oder den Strategy-Editor ausgeblendet werden.

**Unerwünschte Entitäten ausblenden** — Nicht jede Entität soll im Dashboard auftauchen. Es gibt drei Wege:

- **Entität nicht sichtbar schalten** (empfohlen) — Setze eine Entität in den HA-Einstellungen auf **"Nicht sichtbar"**. Diese Entitäten werden von allen auto-generierten Strategies ausgeblendet — nicht nur von dieser, sondern auch von HA's eigenen Strategies. Das ist der sauberste Weg, um Entitäten aus automatischen Dashboards zu entfernen.

<p align="center">
  <img src="https://raw.githubusercontent.com/Cyberhunter88/dashboard-strategy/main/assets/Entitaet-auf-nicht-sichtbar-stellen-via-entity-config.gif" alt="Entität auf nicht sichtbar stellen" width="800" />
</p>

- **Label `no_dboard`** — Erstelle in Home Assistant unter **Einstellungen → Labels** ein Label `no_dboard` und weise es Entitäten zu. Die Entität wird aus dieser Dashboard Strategy global ausgeblendet, bleibt aber in anderen (manuellen) Dashboards sichtbar. Wichtig: Der Unterstrich ist relevant; `no-dboard` wird vom aktuellen Code nicht als Ausschluss-Label erkannt.

<p align="center">
  <img src="https://raw.githubusercontent.com/Cyberhunter88/dashboard-strategy/main/assets/no-dboard-label.png" alt="Label no_dboard in Home Assistant erstellen" width="800" />
</p>

- **Im Strategy-Editor ausblenden** — Über das Konfigurationsmenü der Strategy können einzelne Entitäten pro Bereich und Domain individuell ein- und ausgeblendet werden. Das betrifft nur diese eine Strategy-Ansicht.

Mehr zur Filterung findest du im Abschnitt [Entity-Filterung](#entity-filterung).

## Dashboard erstellen

<p align="center">
  <img src="https://raw.githubusercontent.com/Cyberhunter88/dashboard-strategy/main/assets/simon42-Strategy-Download-DashboardAnlegen-StrategyCodeEinfugen.gif" alt="Dashboard erstellen — Schritt für Schritt" width="800" />
</p>

1. **Einstellungen** → **Dashboards** → **Dashboard hinzufügen**
2. **Neues Dashboard von Grund auf**, Name vergeben
3. Dashboard öffnen → **Edit-Modus** (oben rechts)
4. **Drei Punkte** (⋮) → **Raw-Konfigurationseditor**
5. Einfügen:

```yaml
strategy:
  type: custom:dashboard-strategy

```

6. Speichern (oben rechts)

Nun muss der Raw-Editor verlassen werden. Dafür gibt es zwei Wege:

- **Weg A:** Links in der Seitenleiste auf einen anderen Bereich klicken, danach wieder auf das neu angelegte Dashboard wechseln.
- **Weg B:** Im Editor, 1× auf das **X** oben links klicken → erneut auf das **X** oben links klicken → oben rechts auf **Fertig** klicken.
  > **Wichtig:** Dabei nichts an den Views verändern — einfach nur den Editor verlassen. Änderungen an Views würden die Strategy-Kontrolle aufheben.

Anschließend öffnet sich über das **Stift-Icon** oben rechts in dem Strategy-Dashboard der grafische Editor 🎉


## Konfiguration

Alle Einstellungen lassen sich bequem über den **grafischen Editor** vornehmen (Stift-Icon → Drei Punkte → Dashboard bearbeiten). Die Einstellungsbereiche werden als flache Liste einzeln einklappbarer Panels dargestellt; geöffnete Panels bleiben im Browser gespeichert. Die folgenden Abschnitte dokumentieren die verfügbaren Optionen.

<p align="center">
  <img src="https://raw.githubusercontent.com/Cyberhunter88/dashboard-strategy/main/assets/Editor-oeffnen.gif" alt="Editor öffnen" width="800" />
</p>

### Übersicht

Die Hauptseite des Dashboards zeigt eine Übersicht mit folgenden Bereichen:

**Uhr & Alarm** — Die Uhr wird standardmäßig angezeigt. Optional kann eine Alarmanlage daneben eingeblendet werden.

**Personen-Badges** — Die automatisch erzeugten Personen-Badges im Header der Übersicht lassen sich separat ein- oder ausblenden (`show_person_badges`). Das ist nützlich, wenn eigene Header-Badges die Personenanzeige ersetzen sollen.

**Header-Badges & Personen-Layout** — Zusätzlich zu den Personen-Badges können optionale Header-Badges für Stromverbrauch, nicht verfügbare Entitäten, Now Playing, Sonne und Updates eingeblendet werden. Für Personen-Badges lässt sich außerdem wählen, ob nur der Name oder auch Status und relative Zeit gezeigt werden.

**Zusammenfassungen** — Kacheln die den Status aller Lichter, Rollos, Sicherheits-Entitäten, Batterien und Klimageräte zusammenfassen. Jede Zusammenfassung kann einzeln ein- oder ausgeschaltet werden. Das Layout ist als 2-Spalten-Grid (Standard) oder 4-Spalten-Reihe konfigurierbar. Für Rollos kann optional eine **Teiloffen-Gruppe** aktiviert werden, die Rollos mit Position zwischen 1-99% separat anzeigt — inkl. Live-Übergängen während des Fahrens.

<p align="center">
  <img src="https://raw.githubusercontent.com/Cyberhunter88/dashboard-strategy/main/assets/Klima-Zusammenfassung.gif" alt="Klima-Zusammenfassung aktivieren" width="800" />
</p>

**Batterie-Optionen** — Mobile-App-Batterien und Battery-Notes-Helfer können ausgeblendet werden. Die Schwellwerte für die Statusgruppen (Kritisch / Niedrig / Gut) sind frei einstellbar. Optional kann der Bereichsname in Batterie-Kacheln angezeigt werden. Nicht erreichbare Sensoren lassen sich wahlweise der guten oder kritischen Gruppe zuordnen.

<p align="center">
  <img src="https://raw.githubusercontent.com/Cyberhunter88/dashboard-strategy/main/assets/Batterie-Schwellwerte-und-MobileAppBatt.gif" alt="Batterie-Schwellwerte und Mobile-App-Batterien" width="800" />
</p>

**Wetter-Startseite** — Die Übersicht verwendet immer das frei anordenbare Wetter-Startlayout. Uhr, Datum, Zusammenfassungen, Favoriten, Licht-Favoriten, Alarm, Suche, Wetter, Energie, Pflanzen, Agenda, Aufgaben, Personen, Staubsauger, Wartung, Bereiche, Etagen und eigene Inhalte lassen sich per Drag & Drop anordnen. Optionale Blöcke erscheinen nur, wenn sie aktiviert sind und passende Daten besitzen; einzelne Blöcke können weiterhin mit eigenem Lovelace-YAML überschrieben werden.

**Info-Karten** — Optionale Wetter- und Energie-Karten auf der Übersicht. Die Wetter-Entität kann automatisch erkannt oder im Editor festgelegt werden. Die Energie-Karte kann optional direkt auf das Home-Assistant-Energie-Dashboard verlinken.

**Erweiterte Wetter-/Energie-Blöcke** — Die Wetter-Startseite bietet aktuelle, stündliche und tägliche Vorhersagen sowie einen optionalen Detailblock für `weather_sensors` und Pollenwerte. In der Energie-Section lässt sich die Verteilungskarte separat steuern (`show_energy_distribution_card`), während ein zusätzliches Power-Badge über `power_badge_entity` konfiguriert werden kann.

**Zusätzliche Startseiten-Blöcke** — Pflanzen, Agenda, Todos, Personen, Staubsauger und Wartung können optional aktiviert und direkt in der Reihenfolge der Wetter-Startseite einsortiert werden.

**Favoriten** — Beliebige Entitäten, die als Kacheln unter den Zusammenfassungen erscheinen. Im Editor per Dropdown hinzufügen.

**Licht-Favoriten** — Eine separate, frei einsortierbare Schnellzugriffs-Section für ausgewählte `light.*`-Entitäten. Sie wird automatisch ausgelassen, wenn keine gültigen Lichter konfiguriert sind.

**Suche** — Standardmäßig bleibt die interaktive `custom:search-card` erhalten. Alternativ zeigt `search_card_variant: tip` einen nativen Hinweis auf die Home-Assistant-Suche und benötigt keine zusätzliche Custom Card.

<p align="center">
  <img src="https://raw.githubusercontent.com/Cyberhunter88/dashboard-strategy/main/assets/Favoriten-entity-hinzufügen.gif" alt="Favoriten hinzufügen" width="800" />
</p>

### Bereiche & Räume

**Etagen-Gruppierung** — Bereiche können nach Etagen gegliedert werden. Jede Etage bekommt eine eigene Section mit Überschrift.

<p align="center">
  <img src="https://raw.githubusercontent.com/Cyberhunter88/dashboard-strategy/main/assets/Bereiche-nach-Etagen-Gliedern.gif" alt="Bereiche nach Etagen gliedern" width="800" />
</p>

**Alert-Icons** — Optional können Alert-Icons auf den Bereichskarten angezeigt werden. Wenn aktiviert, zeigen die Karten ein oranges Icon, sobald ein relevanter Binärsensor im Bereich aktiv ist (z.B. Bewegung, Feuchtigkeit, Rauch, Wärme).

<p align="center">
  <img src="https://raw.githubusercontent.com/Cyberhunter88/dashboard-strategy/main/assets/Alert-Icons-Area-Card-Aktivieren.gif" alt="Alert-Icons auf Bereichskarten aktivieren" width="800" />
</p>

**Schlösser in Räumen** — Optional können Schlösser (z.B. Nuki) in den Raum-Views angezeigt werden. Unabhängig davon erscheinen sie immer in der Sicherheits-Übersicht.

**Bereichssortierung** — Wahlweise die Reihenfolge aus Home Assistant verwenden oder im Editor per Drag & Drop festlegen.

<p align="center">
  <img src="https://raw.githubusercontent.com/Cyberhunter88/dashboard-strategy/main/assets/Home-Assistant-Bereichs-Sortierung-verwenden.gif" alt="HA-Bereichssortierung verwenden" width="800" />
</p>

**Bereichs-Verwaltung** — Bereiche ein-/ausblenden, Reihenfolge anpassen, Entitäten pro Bereich und Domain filtern — alles im Editor.

**Raum-Pins** — Spezielle Entitäten die in ihren zugeordneten Räumen ganz oben erscheinen. Ideal für Entitäten die nicht automatisch erkannt werden (z.B. Wetterstationen).

**Raum-Abschnitte sortieren** — Die Reihenfolge der automatischen Raum-Abschnitte (USV, Energie, Kameras, Lichter, Schlösser, Klima, Rollos, Medien, Szenen, Sonstiges, Raum-Pins) kann pro Bereich angepasst werden.

**Energie-Block in Räumen** — Die Energie-Sensoren eines Bereichs lassen sich als eigener Raum-Block ein- oder ausblenden (`show_energy_in_rooms`). Standardmäßig bleibt das bisherige Verhalten erhalten.

**UPS/USV** — Unterstützte USV-Geräte werden automatisch in Raum-Views gruppiert. Die Gruppe zeigt eine Batterie-Gauge und zugehörige Kacheln, z.B. NUT-/UPS-Signale. Die Erkennung ist standardmäßig aktiv und kann über `show_ups_in_rooms: false` deaktiviert werden.

**Automationen & Skripte** — Optional können dem Bereich zugeordnete Automationen und Skripte in den Raum-Views angezeigt werden. Beide Optionen sind separat aktivierbar und standardmäßig aus.

**Fenster- & Türkontakte** — Optional können Fensterkontakte und Türkontakte als Badges in den Raum-Views angezeigt werden. Zwei getrennte Toggles im Editor, standardmäßig aus. Absolute Luftfeuchtigkeit (z.B. von der Thermal Comfort Integration, `g/m³`) wird automatisch als Badge erkannt.

**Ansichten** — Summary-Views (Lichter, Rollos, etc.) und Raum-Views können optional in der oberen Navigation angezeigt werden.

**Benutzersichtbarkeit** — Im Bereich „Ansichten“ des Strategy-Editors lassen sich Views, ihre Einstiegspunkte auf der Übersicht und einzelne Übersichtsabschnitte pro Home-Assistant-Benutzer einblenden. Das ist reine Anzeigelogik und keine Zugriffskontrolle: ausgeblendete Views bleiben über ihre URL erreichbar. Nach Änderungen das Dashboard neu laden.

**Zustandsabhängige Raum-Views** — Mit `room_visibility` kann eine Raum-View samt Navigations-Tab an einen Entity-Zustand gebunden werden, etwa ein Gästezimmer an einen aktivierten Gäste-Modus. Die Bereichskarte auf der Übersicht bleibt sichtbar.

**Sicherheitsansicht** — Optional kann die Security-View nach Bereichen und Etagen gegliedert werden. `show_security_activity` ergänzt bei geladener Logbook-Integration eine native 24-Stunden-Aktivitätskarte; Entitäten mit dem Label `no_seclog` bleiben in der Ansicht sichtbar, werden aber nicht protokolliert. Alle neuen Security-Optionen sind standardmäßig deaktiviert.

**Abschnitts-Metasteuerung** — Erzeugte Überschriften können gezielt ausgeblendet (`hidden_section_headings`) und Startseiten-Blöcke an Entity-Zustände gebunden werden (`section_visibility`).

**Lichter nach Etagen** — In der Lichter-View können Lichter nach Etagen gruppiert werden, mit Ein-/Ausschalt-Button pro Etage.

**Lichter alphabetisch sortieren** — Optional lassen sich Lichter nach Anzeigenamen statt nach letzter Änderung sortieren (`lights_sort_by: name`). Das gilt für Lichter-Ansicht, Raum-Ansichten und verschachtelte Lichtgruppen.

**Rollos nach Etagen** — Optional kann die Hauptgruppe der Rollos in der Rollos-Ansicht nach Etagen gegliedert werden (`group_covers_by_floors`). Markisen und Fenster bleiben dabei weiterhin eigene, ungeteilte Gruppen.

<p align="center">
  <img src="https://raw.githubusercontent.com/Cyberhunter88/dashboard-strategy/main/assets/Lichter-nach-Etagen-Gliedern.gif" alt="Lichter nach Etagen gliedern" width="800" />
</p>

### Erweiterte Funktionen

#### Eigene Karten
Beliebige Lovelace-Karten via YAML zur Übersicht hinzufügen. Die Karten erscheinen standardmäßig in einer eigenen Section. Überschrift und Icon der Section sind frei wählbar. Jede Karte kann außerdem gezielt in bestehende Übersichtbereiche platziert werden, z.B. Übersicht, Bereiche, Wetter oder Energie.

**Tipp:** Erstelle die Karte zuerst in einem normalen Dashboard, kopiere den YAML-Code und füge ihn im Editor ein.

```yaml
# Beispiel: Markdown-Karte
type: markdown
content: "Willkommen zuhause!"
```

<p align="center">
  <img src="https://raw.githubusercontent.com/Cyberhunter88/dashboard-strategy/main/assets/Eigene-Karten-hinzufugen.gif" alt="Eigene Karten hinzufügen" width="800" />
</p>

#### Eigene Abschnitte

Eigene Abschnitte sind vollständige Sections mit eigener Überschrift, eigenem Icon und beliebigen Karten. Sie eignen sich, wenn mehrere Custom Cards getrennt von der Standard-Section gruppiert werden sollen.

#### Eigene Karten in Raum-Views

Pro Bereich können zusätzliche Karten direkt in der Raum-View ergänzt werden. Unterstützt werden freies YAML, geführte Entity-Kacheln und komplette Sections. Die Platzierung ist pro Karte wählbar: oben vor den automatisch generierten Abschnitten oder unten danach.

#### Eigene Badges

Beliebige Badges via YAML zum Header der Übersicht hinzufügen — sie erscheinen neben den Personen-Chips.

```yaml
# Beispiel: Sonnen-Badge
type: entity
show_name: false
show_state: true
show_icon: true
entity: sun.sun
```

<p align="center">
  <img src="https://raw.githubusercontent.com/Cyberhunter88/dashboard-strategy/main/assets/Custom-Badges-hinzufugen.gif" alt="Eigene Badges hinzufügen" width="800" />
</p>

#### Custom Views

Eigene Dashboard-Views mit beliebigen Cards erstellen. Jede Custom View benötigt einen Titel, Pfad und Icon. Der YAML-Code definiert den Inhalt der View.

```yaml
# Beispiel: View mit Sections-Layout
type: sections
sections:
  - type: grid
    cards:
      - type: markdown
        content: "Meine eigene View"
```

#### Automatische Bereichs-View durch YAML ersetzen

Im einfachen Editor einen Bereich wie **Garten** aufklappen und unter **Eigene Bereichsansicht** die vollständige View aus einem anderen Dashboard einfügen. Die Strategy übernimmt weiterhin Name, Pfad und Icon des HA-Bereichs; `title`, `path` und `icon` aus dem kopierten YAML werden ignoriert.

```yaml
type: sections
max_columns: 3
sections:
  - type: grid
    cards:
      - type: heading
        heading: Garten
        icon: mdi:flower
      - type: tile
        entity: light.garten
      - type: tile
        entity: switch.garten_bewaesserung
```

Leeres oder ungültiges YAML verwendet weiterhin die automatisch erzeugte Bereichsansicht.

<p align="center">
  <img src="https://raw.githubusercontent.com/Cyberhunter88/dashboard-strategy/main/assets/Custom-View-hinzufugen.gif" alt="Custom View hinzufügen" width="800" />
</p>

### Entity-Filterung

Entitäten können auf mehreren Ebenen gefiltert werden:

| Methode | Ebene | Beschreibung |
|---------|-------|-------------|
| Nicht sichtbar schalten | Global | Entität wird aus allen auto-generierten Strategies ausgeblendet |
| Label `no_dboard` | Global | Entität wird aus dieser Dashboard Strategy ausgeblendet |
| `groups_options.hidden` | Pro Bereich | Entität nur in bestimmtem Bereich ausblenden |
| Entity Registry | Automatisch | Hidden/Disabled Entities werden ignoriert |
| Entity Category | Automatisch | Config/Diagnostic Entities werden ignoriert |

### Alle Optionen (Referenz)

<details>
<summary>Vollständige Konfigurationsreferenz aufklappen</summary>

| Option | Typ | Standard | Beschreibung |
|--------|-----|----------|-------------|
| `theme` | string | HA-Standard | Theme für alle automatisch generierten Views |
| `show_clock_card` | boolean | `true` | Uhr auf der Übersicht |
| `show_person_badges` | boolean | `true` | Automatische Personen-Badges im Header der Übersicht anzeigen |
| `person_badge_layout` | `"minimal"` \| `"with_state"` \| `"with_state_and_time"` | `"with_state"` | Layout der automatischen Personen-Badges |
| `alarm_entity` | string | — | Alarm-Panel Entity neben der Uhr |
| `weather_entity` | string | Auto | Wetter-Entity für Wetterkarten |
| `show_search_card` | boolean | `false` | Such-Karte (benötigt custom:search-card) |
| `show_unavailable_alert_badge` | boolean | `false` | Badge mit Anzahl nicht verfügbarer sichtbarer Entitäten im Header |
| `show_now_playing_badge` | boolean | `false` | Badge für den ersten gerade spielenden Media-Player im Header |
| `show_sun_badge` | boolean | `false` | Sonnenauf-/untergangs-Badge im Header |
| `show_updates_badge` | boolean | `false` | Badge mit Anzahl sichtbarer Update-Entitäten mit ausstehenden Updates |
| `show_light_summary` | boolean | `true` | Lichter-Zusammenfassung |
| `show_covers_summary` | boolean | `true` | Rollo-Zusammenfassung |
| `show_security_summary` | boolean | `true` | Sicherheits-Zusammenfassung |
| `show_climate_summary` | boolean | `false` | Klima-Zusammenfassung |
| `show_battery_summary` | boolean | `true` | Batterie-Zusammenfassung |
| `show_battery_view` | boolean | `false` | Batterie-Unterseite auch ohne Batterie-Zusammenfassung erzeugen |
| `summaries_columns` | 2 \| 4 | `2` | Spalten-Layout der Zusammenfassungen |
| `hide_mobile_app_batteries` | boolean | `false` | Mobile-App-Batterien ausblenden |
| `hide_battery_notes_entities` | boolean | `false` | Battery-Notes-Helfer in Batterie-Ansicht und -Zusammenfassung ausblenden |
| `battery_critical_threshold` | number | `20` | Schwellwert für kritische Batterien (%) |
| `battery_low_threshold` | number | `50` | Schwellwert für niedrige Batterien (%) |
| `show_area_in_battery_view` | boolean | `false` | Bereichsnamen in Batterie-Kacheln vor dem Entitätsnamen anzeigen |
| `unavailable_batteries_bucket` | `'critical' \| 'good'` | `'good'` | Nicht auswertbare Batterien als kritisch oder gut einsortieren |
| `show_weather` | boolean | `true` | Wetter-Karte |
| `show_weather_forecast_card` | boolean | `true` | Veralteter Kompatibilitätswert; wird auf der einheitlichen Wetter-Startseite nicht mehr ausgewertet |
| `weather_presentation` | `"forecast_daily"` \| `"forecast_hourly"` \| `"forecast_twice_daily"` \| `"tile"` \| `"none"` | `"forecast_daily"` | Veraltete Darstellung der früheren Wetter-Section |
| `weather_sensors` | object[] | `[]` | Zusätzliche Sensorzeile über der Wetter-Section (`entity`, optional `icon`, `unit`, `round`) |
| `show_energy` | boolean | `true` | Energie-Dashboard |
| `show_energy_distribution_card` | boolean | `true` | Energieverteilungs-Karte in der Energy-Section |
| `energy_link_dashboard` | boolean | `true` | Energie-Karte mit dem HA-Energie-Dashboard verlinken |
| `power_badge_entity` | string | — | Zusätzliche Entity als Power-Badge im Header |
| `hide_unavailable_entities` | boolean | `false` | Nicht verfügbare Entitäten aus generierten Views ausblenden |
| `dense_section_placement` | boolean | `false` | Generierte Sections-Views dicht platzieren, um Raster-Lücken aufzufüllen |
| `hidden_section_headings` | string[] | `[]` | Erzeugte Überschriften für Overview-, Summary-, Favoriten-, Bereichs-, Wetter- und Energie-Abschnitte ausblenden |
| `favorite_entities` | string[] | `[]` | Favoriten-Entitäten auf der Übersicht |
| `favorites_show_state` | boolean | `false` | Status auf Favoriten-Kacheln anzeigen |
| `favorites_hide_last_changed` | boolean | `false` | `last_changed` auf Favoriten-Kacheln ausblenden |
| `overview_max_columns` | 1 \| 2 \| 3 \| 4 | `3` | Maximale Spaltenzahl der Startseite |
| `overview_area_card_columns` | 4 \| 6 \| `"full"` | `"full"` | Breite generierter Bereichskarten |
| `weather_start_weather_mode` | `"full"` \| `"compact_hourly"` | `"full"` | Vollständiges Wetter oder kompakte 6-Stunden-Tile |
| `weather_start_date_card` | `"button-card"` \| `"markdown"` | `"button-card"` | Datumskarte mit optionalem nativem Fallback |
| `show_plants_section` | boolean | `false` | Pflanzen-Section auf der Übersicht |
| `show_agenda_section` | boolean | `false` | Agenda-Section auf der Übersicht |
| `agenda_calendar_entities` | string[] | Auto | Kalender-Entitäten für die Agenda-Section |
| `show_todos_section` | boolean | `false` | Todo-Section auf der Übersicht |
| `todos_entities` | string[] | Auto | Todo-Entitäten für die Todo-Section |
| `show_persons_section` | boolean | `false` | Personen-Section auf der Übersicht |
| `show_vacuums_section` | boolean | `false` | Staubsauger-Section auf der Übersicht |
| `show_maintenance_section` | boolean | `false` | Wartungs-Section auf der Übersicht |
| `show_maintenance_view` | boolean | `false` | Eigene Wartungsansicht mit Updates und nicht verfügbaren Entitäten |
| `section_visibility` | object | `{}` | Sichtbarkeit einzelner Übersichts-Sections an Entity-Zustände binden |
| `view_visible_users` | object | `{}` | Sichtbare Benutzer pro View-Pfad; leeres Array blendet die View für alle aus |
| `section_visible_users` | object | `{}` | Sichtbare Benutzer pro Übersichtsabschnitt; leeres Array blendet den Abschnitt für alle aus |
| `weather_start_order` | string[] | Standard-Reihenfolge | Reihenfolge der Blöcke in der Wetter-Startseite |
| `weather_start_layout_items` | object[] | `[]` | Freie Layout-Elemente für die Wetter-Startseite |
| `weather_start_blocks_config` | object | `{}` | YAML-Overrides für Wetter-Startseiten-Blöcke |
| `group_by_floors` | boolean | `false` | Bereiche nach Etagen gliedern |
| `show_partially_open_covers` | boolean | `false` | Teiloffene Rollos separat anzeigen |
| `show_alerts_on_areas` | boolean | `false` | Alert-Icons auf Bereichskarten |
| `show_switches_on_areas` | boolean | `false` | Switch-Steuerung auf Bereichskarten anzeigen |
| `show_locks_in_rooms` | boolean | `false` | Schlösser in Raum-Views |
| `show_automations_in_rooms` | boolean | `false` | Automationen in Raum-Views |
| `show_scripts_in_rooms` | boolean | `false` | Skripte in Raum-Views |
| `show_vacuums_section_in_rooms` | boolean | `false` | Staubsauger und Rasenmäher in einem eigenen Raum-Abschnitt anzeigen |
| `camera_live_toggle` | boolean | `false` | Kamera-Wrapper mit Start/Stopp-Schalter statt nativer HA-Kamerakarten verwenden |
| `show_cctv_view` | boolean | `false` | Experimentelle CCTV-Ansicht nach Bereichen |
| `cctv_show_activity` | boolean | `false` | Aktivitätsverlauf in der CCTV-Ansicht |
| `pollen_entities` | string[] | `[]` | Pollen-Sensoren im Wetterabschnitt |
| `show_energy_in_rooms` | boolean | `true` | Energie-Block mit Leistungs-, Energie-, Wasser- und Gas-Sensoren in Raum-Views |
| `show_ups_in_rooms` | boolean | `true` | UPS/USV-Gruppen in Raum-Views anzeigen |
| `show_window_contacts_in_rooms` | boolean | `false` | Fensterkontakte als Badges in Raum-Views |
| `show_door_contacts_in_rooms` | boolean | `false` | Türkontakte als Badges in Raum-Views |
| `use_default_area_sort` | boolean | `false` | HA-Sortierung für Bereiche verwenden |
| `areas_display.hidden` | string[] | `[]` | Ausgeblendete Bereiche |
| `areas_display.order` | string[] | `[]` | Reihenfolge der Bereiche |
| `areas_display.nav_items` | string[] | `[]` | Einzelne Bereiche unabhängig von `show_room_views` in der Navigation anzeigen |
| `areas_options` | object | `{}` | Entity-Filterung pro Bereich |
| `areas_options.*.stacks_order` | string[] | Standard-Reihenfolge | Reihenfolge der Abschnitte in einer Raum-View |
| `areas_options.*.custom_cards` | object[] | `[]` | Eigene Karten, Kacheln oder Sections pro Raum |
| `areas_options.*.view_override` | object | - | Vollständige YAML-View, die die automatisch erzeugte Bereichsansicht ersetzt |
| `room_pin_entities` | string[] | `[]` | Raum-Pin Entitäten |
| `room_pins_show_state` | boolean | `false` | Status auf Raum-Pin-Kacheln anzeigen |
| `room_pins_hide_last_changed` | boolean | `false` | `last_changed` auf Raum-Pin-Kacheln ausblenden |
| `show_summary_views` | boolean | `false` | Summary-Views in Navigation |
| `show_room_views` | boolean | `false` | Raum-Views in Navigation |
| `group_lights_by_floors` | boolean | `false` | Lichter nach Etagen gruppieren |
| `group_covers_by_floors` | boolean | `false` | Hauptgruppe der Rollos in der Rollos-Ansicht nach Etagen gruppieren |
| `nested_light_groups` | boolean | `false` | Lichtgruppen als aufklappbare Container mit Mitgliedern anzeigen |
| `lights_sort_by` | `"last_changed"` \| `"name"` | `"last_changed"` | Lichter nach letzter Änderung oder alphabetisch nach Anzeigename sortieren |
| `custom_cards` | object[] | `[]` | Eigene Karten via YAML |
| `custom_cards_heading` | string | `"Eigene Karten"` | Überschrift der Custom Cards Section |
| `custom_cards_icon` | string | `"mdi:cards"` | Icon der Custom Cards Section |
| `custom_cards[].target_section` | string | `"custom_cards"` | Ziel-Section für eine eigene Karte |
| `custom_sections` | object[] | `[]` | Eigene vollständige Sections mit Karten |
| `custom_badges` | object[] | `[]` | Eigene Badges im Header via YAML |
| `custom_views` | object[] | `[]` | Eigene Views via YAML |

</details>

## Fehlerbehebung

| Problem | Lösung |
|---------|---------|
| Dashboard zeigt alte Version | **Hard-Refresh:** `Cmd+Shift+R` (Mac) / `Ctrl+Shift+R` (Windows) |
| Änderungen werden nicht übernommen | In einem **Incognito-/Privat-Fenster** testen — wenn das Problem dort nicht auftritt, ist es ein Browser-Cache-Problem |
| Welche Version ist installiert? | Browser-Konsole öffnen (F12) → Meldung `Dashboard Strategy vX.Y.Z loaded` suchen |
| Strategy-Timeout auf langsamen Verbindungen | Normal bei Slow 4G — HA hat ein festes 5-Sekunden-Limit für Custom Elements. Bei normalen Verbindungen kein Problem |

<details>
<summary>Migration von manueller Installation zu HACS</summary>

Wenn du die Strategy vorher **manuell installiert** hattest (ohne HACS) und jetzt auf HACS umsteigen willst, kann es zu einem Fehler kommen:

> `Error: Failed to execute 'define' on 'CustomElementRegistry': the name "dashboard-strategy-summary-card" has already been used`

Das passiert, wenn die alte Resource-URL noch registriert ist und die JS-Datei dadurch doppelt geladen wird. So behebst du das:

1. Manuell kopierte Dateien im Ordner `www` löschen (alles inklusive des Ordners `dashboard-strategy` kann weg)
2. Alte Resource entfernen: **Einstellungen → Dashboards → Drei Punkte (⋮) → Ressourcen** — die alte URL (ohne `hacsfiles` im Pfad) löschen
3. Home Assistant neu starten
4. HACS-Repo über den Button oben hinzufügen und installieren
5. Home Assistant neu starten
6. Browser-Cache leeren (`Cmd+Shift+R` / `Ctrl+Shift+R`)

</details>

## Sprache / Language

Die Strategy erkennt automatisch die Sprache aus deinen Home Assistant Einstellungen (**Einstellungen → Allgemein → Sprache**). Aktuell unterstützt:

| Sprache | Status |
|---------|--------|
| 🇩🇪 Deutsch | Vollständig |
| 🇬🇧 English | Vollständig |

**Weitere Sprachen hinzufügen:** Erstelle eine neue Datei `src/translations/<code>.json` (z.B. `fr.json`) nach dem Muster der bestehenden Dateien und öffne einen Pull Request. Der Aufwand ist gering — es müssen nur die Strings übersetzt werden, kein Code.

## Contributing

Issues und Pull Requests sind willkommen! Bitte teste PRs gründlich in einem lokalen HA-Setup.

<details>
<summary>Architektur</summary>

### Code-Split Bundles

**TypeScript** (ES2020, strict) → **Webpack** → Code-Split Chunks:

| Chunk | Größe | Inhalt |
|-------|-------|--------|
| main | ~8 KB | Entry Point, Custom Element Registrierung |
| lit | ~15 KB | Lit Framework (shared) |
| core | ~139 KB | Registry, Utils, Translations, Overview, Custom Cards |
| views | ~24 KB | Lichter, Rollos, Sicherheit, Batterien, Klima, Raum-Detail |
| editor | ~236 KB | Konfigurations-UI und Panels (nur bei Bedarf geladen) |

### Performance-Design

Die Strategy folgt denselben Patterns wie HA's offizielle Home- und Areas-Strategien:

- **Pre-filtered Area-Controls:** Area-Cards bekommen nur Controls die im Raum tatsächlich existieren, nicht pauschal alle.
- **Pre-resolved Views:** Alle Views werden in `generate()` vollständig aufgelöst statt als Strategy-Stubs zurückgegeben.
- **Eager Chunk Loading:** JS-Chunks werden sofort beim Laden des Entry-Points gestartet, nicht erst wenn `generate()` aufgerufen wird.
- **Reaktive Custom Cards:** LitElement mit `willUpdate()` — nur relevante State-Änderungen lösen Re-Renders aus.
- **Tile-Card-Pooling:** DOM-Elemente werden wiederverwendet statt neu erstellt.

</details>

## Lizenz

**Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)**

- **Teilen & Bearbeiten** erlaubt
- **Namensnennung** erforderlich (Original: [TheRealSimon42/dashboard-strategy](https://github.com/TheRealSimon42/dashboard-strategy))
- **Nicht kommerziell**
- **Weitergabe unter gleichen Bedingungen**

Siehe LICENSE-Datei für vollständige Details.

## Credits

- Home Assistant Community
- [js-yaml](https://github.com/nodeca/js-yaml) (MIT) — YAML-Parser
- **Claude** (Anthropic) — Co-Entwickler und Nachtschicht-Begleiter

## Support

- **[GitHub Issues](https://github.com/Cyberhunter88/dashboard-strategy/issues)**

---

**Entwickelt mit Leidenschaft für die Home Assistant Community**
