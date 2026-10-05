# Konfigurationsreferenz

[Installation und Schnellstart](../README.MD) · [Fehlerdiagnose](troubleshooting.md)

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

Alternativ kann der Editor eine View eines anderen, speicherbasierten Dashboards referenzieren. Die Quell-View wird bei jedem Generieren live über Home Assistants `lovelace/config`-API geladen; Änderungen an der Quelle werden dadurch ohne Kopieren übernommen. Strategy-Dashboards sind ausgeschlossen. Fehlt später das Dashboard oder die View, bleibt das Dashboard nutzbar und zeigt in der betroffenen View eine Fehlerkarte. Die Sichtbarkeit der Referenz richtet sich nach diesem Dashboard, nicht nach dem Quell-Dashboard.

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

Die Tabelle beschreibt die öffentliche YAML-Konfiguration. Veraltete, nicht mehr ausgewertete Layoutfelder sowie der intern vom Karteneditor verwaltete `inline_editor`-Block sind bewusst nicht als einstellbare Optionen aufgeführt.

<details>
<summary>Vollständige Konfigurationsreferenz aufklappen</summary>

| Option | Typ | Standard | Beschreibung |
|--------|-----|----------|-------------|
| `theme` | string | HA-Standard | Theme für alle automatisch generierten Views |
| `background` | object | — | Hintergrund für alle Views im nativen HA-View-Schema (`image`, `opacity`, `attachment`, `size`, `alignment`, `repeat`); Custom Views können ihn überschreiben |
| `show_clock_card` | boolean | `true` | Uhr auf der Übersicht |
| `show_person_badges` | boolean | `true` | Automatische Personen-Badges im Header der Übersicht anzeigen |
| `person_badge_layout` | `"minimal"` \| `"with_state"` \| `"with_state_and_time"` | `"with_state"` | Layout der automatischen Personen-Badges |
| `alarm_entity` | string | — | Alarm-Panel Entity neben der Uhr |
| `house_mode_entity` | string | — | Vorhandenen `input_select`-/`select`-Helfer als Hausmodus anzeigen |
| `weather_entity` | string | Auto | Wetter-Entity für Wetterkarten |
| `show_search_card` | boolean | `false` | Such-Karte oder nativen Suchhinweis anzeigen |
| `search_card_variant` | `"custom"` \| `"tip"` | `"custom"` | Interaktive Custom-Suchkarte oder nativer Hinweis ohne Zusatzabhängigkeit |
| `show_unavailable_alert_badge` | boolean | `false` | Badge mit Anzahl nicht verfügbarer sichtbarer Entitäten im Header |
| `show_now_playing_badge` | boolean | `false` | Badge für den ersten gerade spielenden Media-Player im Header |
| `show_sun_badge` | boolean | `false` | Sonnenauf-/untergangs-Badge im Header |
| `show_updates_badge` | boolean | `false` | Badge mit Anzahl sichtbarer Update-Entitäten mit ausstehenden Updates |
| `show_light_summary` | boolean | `true` | Lichter-Zusammenfassung |
| `show_light_view` | boolean | `false` | Lichter-Unterseite auch ohne Zusammenfassung erzeugen |
| `show_covers_summary` | boolean | `true` | Rollo-Zusammenfassung |
| `show_covers_view` | boolean | `false` | Rollo-Unterseite auch ohne Zusammenfassung erzeugen |
| `show_security_summary` | boolean | `true` | Sicherheits-Zusammenfassung |
| `show_security_view` | boolean | `false` | Sicherheits-Unterseite auch ohne Zusammenfassung erzeugen |
| `show_climate_summary` | boolean | `false` | Klima-Zusammenfassung |
| `show_climate_view` | boolean | `false` | Klima-Unterseite auch ohne Zusammenfassung erzeugen |
| `show_battery_summary` | boolean | `true` | Batterie-Zusammenfassung |
| `show_battery_view` | boolean | `false` | Batterie-Unterseite auch ohne Batterie-Zusammenfassung erzeugen |
| `summaries_columns` | 2 \| 4 | `2` | Spalten-Layout der Zusammenfassungen |
| `hide_mobile_app_batteries` | boolean | `false` | Mobile-App-Batterien ausblenden |
| `hide_battery_notes_entities` | boolean | `false` | Battery-Notes-Helfer in Batterie-Ansicht und -Zusammenfassung ausblenden |
| `battery_critical_threshold` | number | `20` | Schwellwert für kritische Batterien (%) |
| `battery_low_threshold` | number | `50` | Schwellwert für niedrige Batterien (%) |
| `show_area_in_battery_view` | boolean | `false` | Bereichsnamen in Batterie-Kacheln vor dem Entitätsnamen anzeigen |
| `group_batteries_by_areas` | boolean | `false` | Batterien innerhalb jeder Statusgruppe nach Bereichen gliedern |
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
| `light_favorite_entities` | string[] | `[]` | Eigener Schnellzugriffsabschnitt für ausgewählte Lichter |
| `favorites_show_state` | boolean | `false` | Status auf Favoriten-Kacheln anzeigen |
| `favorites_hide_last_changed` | boolean | `false` | `last_changed` auf Favoriten-Kacheln ausblenden |
| `overview_max_columns` | 1 \| 2 \| 3 \| 4 | `3` | Maximale Spaltenzahl der Startseite |
| `overview_area_card_columns` | 4 \| 6 \| `"full"` | `"full"` | Breite generierter Bereichskarten |
| `weather_start_weather_mode` | `"full"` \| `"compact_hourly"` | `"compact_hourly"` bei Standardlayout, sonst `"full"` | Vollständiges Wetter oder kompakte 6-Stunden-Tile |
| `weather_start_date_card` | `"button-card"` \| `"markdown"` | `"button-card"` | Datumskarte mit optionalem nativem Fallback |
| `show_plants_section` | boolean | `false` | Pflanzen-Section auf der Übersicht |
| `show_agenda_section` | boolean | `false` | Agenda-Section auf der Übersicht |
| `agenda_calendar_entities` | string[] | Auto | Kalender-Entitäten für die Agenda-Section |
| `show_todos_section` | boolean | `false` | Todo-Section auf der Übersicht |
| `todos_entities` | string[] | Auto | Todo-Entitäten für die Todo-Section |
| `show_persons_section` | boolean | `false` | Personen-Section auf der Übersicht |
| `show_vacuums_section` | boolean | `false` | Staubsauger-Section auf der Übersicht |
| `show_maintenance_section` | boolean | `false` | Wartungs-Section auf der Übersicht |
| `show_maintenance_view` | boolean | Auto | Eigene Wartungsansicht bei verwertbaren Wartungsdaten anzeigen; `false` deaktiviert sie |
| `show_maintenance_activity` | boolean | `true` | 24-Stunden-Aktivitätsverlauf in der Wartungsansicht |
| `show_video_tips` | boolean | `true` | Passende statische Video-Tipps in der Wartungsansicht |
| `section_visibility` | object | `{}` | Sichtbarkeit einzelner Übersichts-Sections an Entity-Zustände binden |
| `view_visible_users` | object | `{}` | Sichtbare Benutzer pro View-Pfad; leeres Array blendet die View für alle aus |
| `section_visible_users` | object | `{}` | Sichtbare Benutzer pro Übersichtsabschnitt; leeres Array blendet den Abschnitt für alle aus |
| `room_visibility` | object | `{}` | Raum-View und Navigation an einen Entity-Zustand binden |
| `weather_start_order` | string[] | Hausmodus, Alarm, Status, Favoriten, Räume, Uhr/Datum, Wetter und weitere Bereiche | Reihenfolge der Blöcke in der Wetter-Startseite; eigene Reihenfolgen bleiben maßgeblich |
| `weather_start_layout_items` | object[] | `[]` | Freie Layout-Elemente für die Wetter-Startseite |
| `weather_start_blocks_config` | object | `{}` | YAML-Overrides für Wetter-Startseiten-Blöcke |
| `group_by_floors` | boolean | `false` | Bereiche nach Etagen gliedern |
| `area_display_type` | `"compact"` \| `"picture"` | `"compact"` | Standarddarstellung der Bereichskarten; Bildmodus fällt ohne Bereichsfoto auf kompakt zurück |
| `show_partially_open_covers` | boolean | `false` | Teiloffene Rollos separat anzeigen |
| `show_alerts_on_areas` | boolean | `false` | Alert-Icons auf Bereichskarten |
| `group_security_by_areas` | boolean | `false` | Sicherheitsansicht nach Bereichen und Etagen gliedern |
| `hide_hidden_areas_in_security` | boolean | `false` | Auf der Übersicht ausgeblendete Bereiche auch aus Security/CCTV filtern |
| `show_security_activity` | boolean | `false` | Native 24-Stunden-Logbuchkarte in der Sicherheitsansicht |
| `security_activity_position` | `"start"` \| `"end"` | `"start"` | Position des Sicherheitsverlaufs im Kategorienmodus |
| `security_extra_entities` | string[] | `[]` | Zusätzliche sichtbare Entitäten in der Sicherheitsansicht |
| `show_switches_on_areas` | boolean | `false` | Switch-Steuerung auf Bereichskarten anzeigen |
| `show_locks_in_rooms` | boolean | `false` | Schlösser in Raum-Views |
| `show_cover_controls_in_rooms` | boolean | `false` | Sichere Sammelsteuerung für Rollos und Vorhänge in Raum-Views |
| `show_automations_in_rooms` | boolean | `false` | Automationen in Raum-Views |
| `show_scripts_in_rooms` | boolean | `false` | Skripte in Raum-Views |
| `show_vacuums_section_in_rooms` | boolean | `false` | Staubsauger und Rasenmäher in einem eigenen Raum-Abschnitt anzeigen |
| `show_switches_section_in_rooms` | boolean | `false` | Schalter und smarte Steckdosen in einem eigenen Raum-Abschnitt anzeigen |
| `camera_live_toggle` | boolean | `false` | Kamera-Wrapper mit Start/Stopp-Schalter statt nativer HA-Kamerakarten verwenden |
| `show_cameras_in_rooms` | boolean | `true` | Kameras in Raum-Views ausblenden, ohne Security/CCTV zu beeinflussen |
| `camera_renderer` | `"native"` \| `"webrtc"` | `"native"` | Renderer für Kameras in Raum-Views; `webrtc` benötigt `custom:webrtc-camera` |
| `camera_webrtc_streams` | object | `{}` | WebRTC-URL oder Kartenoptionen pro Kamera-Entity-ID; nur bei `camera_renderer: webrtc` |
| `show_cctv_view` | boolean | `false` | Experimentelle CCTV-Ansicht nach Bereichen |
| `cctv_show_activity` | boolean | `false` | LLM-Vision-Ereignisverläufe in der CCTV-Ansicht |
| `show_camera_events` | boolean | `false` | Kompatibilitätsoption für `cctv_show_activity` |
| `show_cameras_in_security` | boolean | `false` | Kameras zusätzlich in der Sicherheitsansicht anzeigen |
| `hidden_cameras` | string[] | `[]` | Kameras aus CCTV- und Sicherheitsansicht ausblenden; Raumansichten bleiben unberührt |
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
| `areas_options.*.display_type` | `"compact"` \| `"picture"` | globaler Wert | Darstellung einer einzelnen Bereichskarte überschreiben |
| `areas_options.*.stacks_order` | string[] | Standard-Reihenfolge | Reihenfolge der Abschnitte in einer Raum-View |
| `areas_options.*.custom_cards` | object[] | `[]` | Eigene Karten, Kacheln oder Sections pro Raum |
| `areas_options.*.view_override` | object | - | Vollständige YAML-View, die die automatisch erzeugte Bereichsansicht ersetzt |
| `room_pin_entities` | string[] | `[]` | Raum-Pin Entitäten |
| `room_pins_show_state` | boolean | `false` | Status auf Raum-Pin-Kacheln anzeigen |
| `room_pins_hide_last_changed` | boolean | `false` | `last_changed` auf Raum-Pin-Kacheln ausblenden |
| `show_summary_views` | boolean | `false` | Summary-Views in Navigation |
| `show_room_views` | boolean | `false` | Raum-Views in Navigation |
| `group_lights_by_floors` | boolean | `false` | Lichter nach Etagen gruppieren |
| `group_lights_by_areas` | boolean | `false` | Lichter nach Bereichen gruppieren |
| `group_covers_by_floors` | boolean | `false` | Hauptgruppe der Rollos in der Rollos-Ansicht nach Etagen gruppieren |
| `group_covers_by_areas` | boolean | `false` | Rollos, Markisen und Fenster nach Bereichen gruppieren |
| `nested_light_groups` | boolean | `false` | Lichtgruppen als aufklappbare Container mit Mitgliedern anzeigen |
| `lights_sort_by` | `"last_changed"` \| `"name"` | `"last_changed"` | Lichter nach letzter Änderung oder alphabetisch nach Anzeigename sortieren |
| `custom_cards` | object[] | `[]` | Eigene Karten via YAML |
| `custom_cards_heading` | string | `"Eigene Karten"` | Überschrift der Custom Cards Section |
| `custom_cards_icon` | string | `"mdi:cards"` | Icon der Custom Cards Section |
| `custom_cards[].target_section` | string | `"custom_cards"` | Ziel-Section für eine eigene Karte |
| `custom_sections` | object[] | `[]` | Eigene vollständige Sections mit Karten |
| `custom_badges` | object[] | `[]` | Eigene Badges im Header via YAML |
| `custom_views` | object[] | `[]` | Eigene Views via YAML oder als Live-Referenz auf eine View eines anderen Dashboards (`ref_dashboard` + `ref_view`); mit `after_view` hinter einem generierten View-Pfad einsortierbar |
| `show_camera_view` | boolean | — | Kompatibilitätsalias für `show_cctv_view`; der fork-native Wert hat Vorrang |
| `show_maintenance_summary` | boolean | — | Kompatibilitätsalias für `show_maintenance_view`; der fork-native Wert hat Vorrang |

</details>

