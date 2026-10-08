# Dashboard Strategy

[![HACS Custom](https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=for-the-badge)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/v/release/Cyberhunter88/dashboard-strategy?style=for-the-badge&color=green)](https://github.com/Cyberhunter88/dashboard-strategy/releases)
[![GitHub Stars](https://img.shields.io/github/stars/Cyberhunter88/dashboard-strategy?style=for-the-badge&color=yellow)](https://github.com/Cyberhunter88/dashboard-strategy/stargazers)
![AI-Assisted](https://img.shields.io/badge/AI--Assisted-blue?style=for-the-badge)
[![License](https://img.shields.io/badge/License-CC_BY--NC--SA_4.0-lightgrey?style=for-the-badge)](LICENSE)

Eine modulare und hochkonfigurierbare Dashboard-Strategy für Home Assistant, die automatisch Views basierend auf Bereichen, Entitäten und deren Zuständen generiert.

Aktueller Entwicklungsstand: **1.33.3**

Die Versionsquelle und der automatisierte Release-Ablauf sind in [RELEASE.md](RELEASE.md) dokumentiert.


---


## Features

- **Grafischer Konfigurator** — Keine YAML-Kenntnisse erforderlich, Drag & Drop für Bereiche
- **Automatische Raum-Erkennung** — Nutzt Home Assistant Areas, Devices & Floors
- **Spezialisierte Views** — Lichter, Rollos, Sicherheit, Batterien, Klima — jeweils mit Status-Gruppierung
- **Zusammenfassungskarten** — Einzeln ein-/ausschaltbar für Lichter, Rollos, Sicherheit, Batterien und Klima
- **Etagen-Gruppierung** — Bereiche, Lichter und Rollos optional nach Etagen gliedern
- **Bereichs-Gruppierung** — Lichter, Rollos und Batterien nach Bereichen; Lichter/Rollos optional als Etage → Bereich → Entitäten
- **Favoriten** — Beliebige Entitäten als Kacheln auf der Übersicht anpinnen
- **Alarm-Panel** — Optionale Alarmanlage neben der Uhr
- **Hausmodus** — Vorhandenen `input_select`-/`select`-Helfer als native Auswahlkachel steuern
- **Granulare Filterung** — Per Label (`no_dboard`), pro Bereich, pro Domain, pro Entity
- **Wetter-Startseite** — Alternative Startseite mit großem Uhr-/Datumsblock, Wetterblöcken, freien Karten, Abschnitten, Bereichen und Etagen in eigener Reihenfolge
- **Teiloffene Rollos** — Optionale dritte Gruppe (Offen / Teiloffen / Geschlossen) mit Live-Übergängen
- **Alert-Icons** — Optionale Alert-Badges auf Bereichskarten (Bewegung, Feuchtigkeit, Rauch, Wärme u.a.)
- **Rauch- & Gasmelder** — In der Sicherheits-Übersicht, im Security-Summary-Count und als Badges in Raum-Views
- **UPS/USV-Erkennung** — Automatische USV-Gruppen in Raum-Views mit Gauge und zugehörigen Kacheln
- **Batch-Aktionen** — Heading-Badges für Gruppensteuerung (alle ein/aus, alle öffnen/schließen)
- **Eigenständige Utility-Views** — Licht, Rollos, Security, Batterien und Klima auch ohne Übersichtskachel bereitstellen
- **Dual-Lens-Kameras** — Ein Kamerablock pro Linse, gemeinsame Geräte-/PTZ-Steuerungen nur einmal
- **Automationen & Skripte in Räumen** — Bereichs-zugeordnete Automationen und Skripte in Raum-Views anzeigen
- **Eigene Karten** — Beliebige Karten via YAML auf der Übersicht einbinden
- **Eigene Abschnitte** — Mehrere eigene Sections mit Überschrift, Icon und beliebigen Karten
- **Eigene Karten pro Raum** — YAML, geführte Kacheln oder komplette Sections ober- oder unterhalb der automatischen Raum-Abschnitte
- **Eigene Badges** — Beliebige Badges via YAML im Header (neben Personen-Chips)
- **Custom Views** — Eigene Dashboard-Views via YAML oder Live-Referenz auf Views anderer Dashboards
- **Globales Design** — Theme und natives Hintergrundbild für alle Views
- **Reaktive Updates** — Echtzeit-Aktualisierung via LitElement Custom Cards
- **Mehrsprachig** — Deutsch, Englisch und Russisch, automatische Erkennung aus HA-Einstellungen, Fallback auf Englisch
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

> Die Produktionsdateien verwenden den von HACS bereitgestellten `/hacsfiles/`-Pfad auch für nachgeladene Chunks. Diese manuelle Variante setzt deshalb voraus, dass die HACS-Integration in Home Assistant installiert ist.

1. Kopiere **alle** Dateien aus `dist/` nach `/config/www/community/dashboard-strategy/`. Die Unterordner und Dateinamen müssen unverändert bleiben, weil die Strategy ihre Code-Split-Chunks unter `/hacsfiles/dashboard-strategy/` nachlädt.
2. Füge in `configuration.yaml` hinzu:

```yaml
lovelace:
  mode: storage
  resources:
    - url: /hacsfiles/dashboard-strategy/dashboard-strategy.js
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

- **Label `no_dboard`** — Erstelle in Home Assistant unter **Einstellungen → Labels** ein Label `no_dboard` und weise es Entitäten zu. Die Entität wird aus dieser Dashboard Strategy global ausgeblendet, bleibt aber in anderen (manuellen) Dashboards sichtbar. Die Upstream-Schreibweise `no-dboard` wird ebenfalls akzeptiert.

<p align="center">
  <img src="https://raw.githubusercontent.com/Cyberhunter88/dashboard-strategy/main/assets/no-dboard-label.png" alt="Label no_dboard in Home Assistant erstellen" width="800" />
</p>

- **Im Strategy-Editor ausblenden** — Über das Konfigurationsmenü der Strategy können einzelne Entitäten pro Bereich und Domain individuell ein- und ausgeblendet werden. Das betrifft nur diese eine Strategy-Ansicht.

Mehr zur Filterung findest du im Abschnitt [Entity-Filterung](docs/configuration.md#entity-filterung).

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

Hinweise zur Dashboard-Prüfung und Optimierung stehen in der [Fehlerdiagnose](docs/troubleshooting.md).

### Übersicht

Die Hauptseite des Dashboards zeigt eine Übersicht mit folgenden Bereichen:

**Uhr & Alarm** — Die Uhr wird standardmäßig angezeigt. Optional kann eine Alarmanlage daneben eingeblendet werden.

**Personen-Badges** — Die automatisch erzeugten Personen-Badges im Header der Übersicht lassen sich separat ein- oder ausblenden (`show_person_badges`). Das ist nützlich, wenn eigene Header-Badges die Personenanzeige ersetzen sollen.

**Header-Badges & Personen-Layout** — Zusätzlich zu den Personen-Badges können optionale Header-Badges für Stromverbrauch, nicht verfügbare Entitäten, Now Playing, Sonne und Updates eingeblendet werden. Für Personen-Badges lässt sich außerdem wählen, ob nur der Name oder auch Status und relative Zeit gezeigt werden.

**Zusammenfassungen** — Kacheln die den Status aller Lichter, Rollos, Sicherheits-Entitäten, Batterien und Klimageräte zusammenfassen. Jede Zusammenfassung kann einzeln ein- oder ausgeschaltet werden. Das Layout ist als 2-Spalten-Grid (Standard) oder 4-Spalten-Reihe konfigurierbar. Für Rollos kann optional eine **Teiloffen-Gruppe** aktiviert werden, die Rollos mit Position zwischen 1-99% separat anzeigt — inkl. Live-Übergängen während des Fahrens.

<p align="center">
  <img src="https://raw.githubusercontent.com/Cyberhunter88/dashboard-strategy/main/assets/Klima-Zusammenfassung.gif" alt="Klima-Zusammenfassung aktivieren" width="800" />
</p>

**Batterie-Optionen** — Mobile-App-Batterien und Battery-Notes-Helfer können ausgeblendet werden. Die Schwellwerte für die Statusgruppen (Kritisch / Niedrig / Gut) sind frei einstellbar. Optional kann der Bereichsname in Batterie-Kacheln angezeigt oder jede Statusgruppe nach Bereichen mit abschließendem „Ohne Bereich“-Block gegliedert werden. Bei aktiver Gruppierung entfällt das redundante Bereichspräfix auf den Kacheln. Nicht erreichbare Sensoren lassen sich wahlweise der guten oder kritischen Gruppe zuordnen.

<p align="center">
  <img src="https://raw.githubusercontent.com/Cyberhunter88/dashboard-strategy/main/assets/Batterie-Schwellwerte-und-MobileAppBatt.gif" alt="Batterie-Schwellwerte und Mobile-App-Batterien" width="800" />
</p>

**Wetter-Startseite** — Die Übersicht verwendet immer das frei anordenbare Wetter-Startlayout. Uhr, Datum, Zusammenfassungen, Favoriten, Alarm, Hausmodus, Suche, Wetter, Energie, Pflanzen, Agenda, Aufgaben, Personen, Staubsauger, Wartung, Bereiche, Etagen und eigene Inhalte lassen sich per Drag & Drop anordnen. Optionale Blöcke erscheinen nur, wenn sie aktiviert sind und passende Daten besitzen; einzelne Blöcke können weiterhin mit eigenem Lovelace-YAML überschrieben werden.

**Info-Karten** — Optionale Wetter- und Energie-Karten auf der Übersicht. Die Wetter-Entität kann automatisch erkannt oder im Editor festgelegt werden. Die Energie-Karte kann optional direkt auf das Home-Assistant-Energie-Dashboard verlinken.

**Erweiterte Wetter-/Energie-Blöcke** — Die Wetter-Startseite bietet aktuelle, stündliche und tägliche Vorhersagen sowie einen optionalen Detailblock für `weather_sensors` und Pollenwerte. In der Energie-Section lässt sich die Verteilungskarte separat steuern (`show_energy_distribution_card`), während ein zusätzliches Power-Badge über `power_badge_entity` konfiguriert werden kann.

**Zusätzliche Startseiten-Blöcke** — Pflanzen, Agenda, Todos, Personen, Staubsauger und Wartung können optional aktiviert und direkt in der Reihenfolge der Wetter-Startseite einsortiert werden.

**Hausmodus** — Über `house_mode_entity` kann ein vorhandener `input_select.*`- oder `select.*`-Helfer als vollbreite native Auswahlkachel unter Uhr und Alarm eingeblendet werden. Die Strategy legt den Helfer und seine Modi nicht selbst an.

**Favoriten** — Beliebige Entitäten, die als Kacheln unter den Zusammenfassungen erscheinen. Im Editor per Dropdown hinzufügen.

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

**Kameras in Räumen** — Raum-Kameras lassen sich mit `show_cameras_in_rooms` zentral ausblenden (Standard: sichtbar); Security- und CCTV-Ansichten bleiben davon unberührt. Standardmäßig verwendet die Strategy native Home-Assistant-Kamerakarten. Optional aktiviert `camera_live_toggle` einen ressourcenschonenden Start/Stopp-Schalter. Fortgeschrittene YAML-Konfigurationen können mit `camera_renderer: webrtc` stattdessen `custom:webrtc-camera` verwenden; dafür muss die externe WebRTC-Karte separat installiert sein. Streams oder zusätzliche Kartenoptionen lassen sich pro Kamera über `camera_webrtc_streams` hinterlegen. Dual-Lens-Geräte erzeugen einen Block pro Linse; gemeinsame Begleitsteuerungen erscheinen nur beim ersten Block des Geräts.

**Rollo-Sammelsteuerung** — Optional zeigt `show_cover_controls_in_rooms` Öffnen-, Stopp- und Schließen-Buttons an Rollo-/Vorhang-Überschriften. Pro Aktion werden nur unterstützte Entitäten angesprochen; Fenster, Türen, Tore und Garagen bleiben ausgeschlossen.

**Rollo-Sammelsteuerung** — Optional zeigt `show_cover_controls_in_rooms` Öffnen-, Stopp- und Schließen-Buttons an Rollo-/Vorhang-Überschriften. Pro Aktion werden nur unterstützte Entitäten angesprochen; Fenster, Türen, Tore und Garagen bleiben ausgeschlossen.

**Automationen & Skripte** — Optional können dem Bereich zugeordnete Automationen und Skripte in den Raum-Views angezeigt werden. Beide Optionen sind separat aktivierbar und standardmäßig aus.

**Fenster- & Türkontakte** — Optional können Fensterkontakte und Türkontakte als Badges in den Raum-Views angezeigt werden. Zwei getrennte Toggles im Editor, standardmäßig aus. Absolute Luftfeuchtigkeit (z.B. von der Thermal Comfort Integration, `g/m³`) wird automatisch als Badge erkannt.

**Badge-Auswahl** — Ohne manuelle Auswahl erscheint höchstens ein automatisch erkanntes Badge pro Sensortyp. Sobald ein Typ im Editor kuratiert wurde, werden alle weiterhin ausgewählten Sensoren dieses Typs angezeigt. Das Ausblenden in der Badge-Gruppe wirkt nur auf Raumbadges und versteckt die Entität nicht in anderen Dashboard-Bereichen. Leistungs-, Energie-, Wasser- und Gassensoren gehören konsistent in den Energieblock.

**Ansichten** — Summary-Views (Lichter, Rollos, etc.) und Raum-Views können optional in der oberen Navigation angezeigt werden. Die Unterseiten für Licht, Rollos, Security, Batterien und Klima lassen sich außerdem separat aktivieren, wenn ihre Übersichtskachel ausgeblendet ist; Deep-Links und Custom-View-Positionierung bleiben dabei gültig.

**Benutzersichtbarkeit** — Im Bereich „Ansichten“ des Strategy-Editors lassen sich Views, ihre Einstiegspunkte auf der Übersicht und einzelne Übersichtsabschnitte pro Home-Assistant-Benutzer einblenden. Das ist reine Anzeigelogik und keine Zugriffskontrolle: ausgeblendete Views bleiben über ihre URL erreichbar. Nach Änderungen das Dashboard neu laden.

**Abschnitts-Metasteuerung** — Erzeugte Überschriften können gezielt ausgeblendet (`hidden_section_headings`) und Startseiten-Blöcke an Entity-Zustände gebunden werden (`section_visibility`).

**Lichter nach Etagen** — In der Lichter-View können Lichter nach Etagen gruppiert werden, mit Ein-/Ausschalt-Button pro Etage.

**Lichter alphabetisch sortieren** — Optional lassen sich Lichter nach Anzeigenamen statt nach letzter Änderung sortieren (`lights_sort_by: name`). Das gilt für Lichter-Ansicht, Raum-Ansichten und verschachtelte Lichtgruppen.

**Rollos nach Etagen** — Optional kann die Hauptgruppe der Rollos in der Rollos-Ansicht nach Etagen gegliedert werden (`group_covers_by_floors`). Markisen und Fenster bleiben dabei weiterhin eigene, ungeteilte Gruppen.

**Gruppierung nach Bereichen** — Lichter, Rollos und Batterien lassen sich zusätzlich nach Bereichen gliedern. Bei Lichtern und Rollos ist die Verschachtelung `Etage → Bereich → Entitäten` möglich; Batterien behalten ihre Statusgruppen und erhalten darin Bereichsblöcke samt „Ohne Bereich“.

**Versteckte Bereiche in Security/CCTV** — Auf der Übersicht ausgeblendete Bereiche bleiben aus Sicherheitsgründen standardmäßig in Security und CCTV sichtbar. Ihre Überschriften verlinken nicht auf eine nicht vorhandene Raumansicht. `hide_hidden_areas_in_security: true` aktiviert die Filterung ausdrücklich.

<p align="center">
  <img src="https://raw.githubusercontent.com/Cyberhunter88/dashboard-strategy/main/assets/Lichter-nach-Etagen-Gliedern.gif" alt="Lichter nach Etagen gliedern" width="800" />
</p>

Die [Konfigurationsreferenz](docs/configuration.md) beschreibt eigene Karten, Abschnitte, Views, Entity-Filterung und alle YAML-Optionen.

## Fehlerbehebung

Cache-Probleme, Dashboard-Prüfung und die Migration zu HACS werden in der [Fehlerdiagnose](docs/troubleshooting.md) erklärt.

## Sprache / Language

Die Strategy erkennt automatisch die Sprache aus deinen Home Assistant Einstellungen (**Einstellungen → Allgemein → Sprache**). Aktuell unterstützt:

| Sprache | Status |
|---------|--------|
| 🇩🇪 Deutsch | Vollständig |
| 🇬🇧 English | Vollständig |
| 🇷🇺 Русский | Upstream-Basis mit englischem Fallback für Fork-spezifische Optionen |

**Weitere Sprachen hinzufügen:** Erstelle eine neue Datei `src/translations/<code>.json` (z.B. `fr.json`) nach dem Muster der bestehenden Dateien und öffne einen Pull Request. Der Aufwand ist gering — es müssen nur die Strings übersetzt werden, kein Code.

## Contributing

Issues und Pull Requests sind willkommen! Bitte teste PRs gründlich in einem lokalen HA-Setup.

Entwicklerhinweise zu Datenfluss, Modulen, Caches und Tests stehen in der [Architektur](docs/architecture.md). Der [Release-Ablauf](RELEASE.md) beschreibt die Versionierung aus `package.json`.

## Lizenz

**Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)**

- **Teilen & Bearbeiten** erlaubt
- **Namensnennung** erforderlich (Original: [TheRealSimon42/dashboard-strategy](https://github.com/TheRealSimon42/dashboard-strategy))
- **Nicht kommerziell**
- **Weitergabe unter gleichen Bedingungen**

Siehe LICENSE-Datei für vollständige Details.

## Credits

- Home Assistant Community
- [js-yaml](https://github.com/nodeca/js-yaml) 4.3.2 (MIT) — YAML-Parser
- **Claude** (Anthropic) — Co-Entwickler und Nachtschicht-Begleiter

## Support

- **[GitHub Issues](https://github.com/Cyberhunter88/dashboard-strategy/issues)**

---

**Entwickelt mit Leidenschaft für die Home Assistant Community**
