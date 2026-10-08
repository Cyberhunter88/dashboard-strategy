# Fehlerdiagnose

[Installation und Schnellstart](../README.MD) · [Konfiguration](configuration.md)

### Optimierung und Dashboard-Prüfung

Die Dashboard-Prüfung unterscheidet Fehler, Warnungen und Hinweise. Sie erkennt fehlende,
deaktivierte, zustandslose sowie nicht verfügbare Entitäten. `unknown` wird bei Sensoren
gemeldet, bei noch unbenutzten Buttons, Szenen und Ereignisentitäten jedoch nicht als Fehler
behandelt. Ausblendungslisten erzeugen keine Verfügbarkeitswarnungen. YAML wird pro
Konfigurationsstand ausgewertet; Zustandsänderungen verwenden die gespeicherten Referenzen.
Templates, freie Texte und go2rtc-Streamnamen werden nicht als Entitätsverweise interpretiert.

Zusätzliche Hinweise betreffen Hausmodus-Blöcke ohne Entität, fehlende Layoutreferenzen,
eindeutig fehlende relative View-Ziele und eigene vollständige Raumlayouts. Ein Raumlayout
ersetzt die automatisch erzeugten Raumsektionen; die Raumoptionen gelten dort nur, soweit
das eigene Layout sie verwendet. Hinweise entfernen oder verändern keine Konfiguration.

Für native Kameras mit `camera_live_toggle: true` lässt sich optional
`camera_pause_when_hidden: true` setzen. Manuell gestartetes Livebild pausiert außerhalb
des sichtbaren Bereichs und bei verborgenem Browserdokument und wird bei Rückkehr fortgesetzt.
Ein manuell gestopptes Bild bleibt gestoppt. Standard ist `false`; eigene WebRTC- und
Advanced-Camera-Karten werden nicht verändert. Der Schalter wirkt nur im nativen Renderer
mit Live-Schalter. Bei Advanced-Camera-YAML weist die Prüfung auf aktiviertes Vorladen mit
ausdrücklich deaktivierter automatischer Pause hin; das ist keine Messung der Streamlast.

Optionale Vereinfachungen: vorhandene Wetterblöcke und die integrierte Uhr anstelle
zusätzlicher verschachtelter Karten nutzen; die automatische USV-Sektion vor einem eigenen
USV-Layout prüfen und nur eine Darstellung wählen; Kameraaktivitäten auf einer Detailansicht
anzeigen und Vorladen in externen Kamerakarten nach deren Dokumentation bewusst konfigurieren.
Diese Entscheidungen bleiben beim Nutzer. Bestehendes YAML wird nicht automatisch umgebaut.

Entwickler können mit `?s42_debug=true` begrenzte Laufzeitmessungen und aggregierte
Erzeugungs-/Aktualisierungszähler aktivieren. `window.__s42_dump()` zeigt die letzten
100 Messungen. Der lokale synthetische Browsertest und seine Grenzen sind in
[Dashboard-Optimierung](dashboard-optimization.md) beschrieben.

Der Editor bietet eine eingeklappte **Dashboard-Prüfung** für strukturierte Entitätsverweise, einschließlich eigener YAML-Karten und Aktionstargets. Fehlende und momentan nicht verfügbare Entitäten werden mit Konfigurationsstelle und einem Link zum Editorabschnitt angezeigt. Die Prüfung verändert keine Einstellungen; Templates und go2rtc-Streamnamen werden nicht geprüft. Eigene vollständige Raumlayouts sind direkt in der Bereichsliste markiert und können dort zum Bearbeiten geöffnet werden. Diagnose- und Konfigurationsentitäten werden bei der allgemeinen Entitätsauswahl nur angeboten, wenn sie bereits konfiguriert sind.

Alle Einstellungen lassen sich bequem über den **grafischen Editor** vornehmen (Stift-Icon → Drei Punkte → Dashboard bearbeiten). Die folgenden Abschnitte dokumentieren die verfügbaren Optionen.

<p align="center">
  <img src="https://raw.githubusercontent.com/Cyberhunter88/dashboard-strategy/main/assets/Editor-oeffnen.gif" alt="Editor öffnen" width="800" />
</p>

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


## Speicherwachstum beim Wetterlayout (behoben in 1.33.2)

Gestapelte YAML-Abschnitte konnten bei wiederholter Dashboard-Erzeugung die Kartenarrays der Eingabekonfiguration vergrößern. Die Strategy setzt Abschnitte jetzt mit eigenen Arrays zusammen; Reihenfolge und eigene YAML-Inhalte bleiben erhalten. Regressionstests prüfen 100 Erzeugungen mit unveränderter und eingefrorener Konfiguration. Dieser Fix ist kein Nachweis einer Behebung unabhängiger WebRTC- oder Videodecoder-Fehler.

Validierung: 222 Unit-Tests, Typecheck, Lint, Format- und Übersetzungsprüfung sowie Produktions- und HACS-Distributionsprüfung bestanden. Im Chrome-Browser-Harness bleiben bei 360 und 1280 Pixeln über jeweils 100 vollständige Dashboard-Erzeugungen die Ausgabegröße (11.831 Bytes) und die Zahl nativer Bereichskarten (2) konstant; Eingabe und frühere Ausgaben bleiben unverändert. Der Harness verwendet native Karten-Testdoubles und misst keinen echten Videodecoder-Speicher. Live-Installation und Gerätetest stehen aus.
