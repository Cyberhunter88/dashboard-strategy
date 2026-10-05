# Dashboard-Optimierung 1.33.0

Stand: 2026-10-05, Branch `codex/dashboard-optimization`. Alle Änderungen erfolgen im Repository. Zuhause diente als lesende Referenz; keine Live-Konfigurationsänderung, Installation oder Serviceausführung erfolgte.

## Umsetzung

Die vorhandene Editor-Diagnose analysiert Entitätsverweise und YAML einmal pro unveränderter Konfiguration. Zustandsupdates prüfen nur die erfassten Referenzen. Fehler, Warnungen und Hinweise enthalten stabile Regelcodes, Konfigurationspfade und optional Entitätsstatus. Der Editor bietet einen Sprung zum Abschnitt. Ausblendungslisten werden anders behandelt als Anzeigeverweise. Buttons und Ereignisentitäten mit `unknown` erzeugen keine pauschale Warnung. Templates, freie Texte und Streamnamen bleiben unbewertet. Navigation prüft einfache relative View-Pfade; externe und absolute URLs werden nicht bewertet. Ein automatisch aktivierbares Wartungsziel wird vorsichtig akzeptiert, um Fehlwarnungen zu vermeiden. Vollständige Raum-Overrides werden erklärt.

Registry-Indizes werden bei unveränderten Registerdaten und Bereichsfiltern wiederverwendet. Zustandslose Kandidaten bleiben im Domain-Index; zurückkehrende Zustände brauchen keinen Registry-Neuaufbau. Gewöhnliche Kartenupdates verwenden Domain-Indizes statt vollständiger Registry-Suchen. Licht-, Rollladen- und Batteriekarten behalten gepoolte Tiles. Native Konfigurationen werden nur bei geändertem Inhalt gesetzt. Attribute, Sprache, Bereiche und Verfügbarkeit lösen die passenden Aktualisierungen aus; Unterkarten erhalten weiterhin `hass`. Kamera, Bereichs- und Inline-Karten verwerfen veraltete asynchrone Ergebnisse.

Summary- und Raumlinks berücksichtigen erzeugte Ziele. `show_summary_views: false` blendet weiterhin nur Tabs aus. Summary- und Bereichskarten unterstützen Enter/Leertaste und lassen eingebettete Steuerelemente bedienbar. Unter 480 Pixeln stehen Editorfelder untereinander; Beschriftungen und Diagnosepfade umbrechen. Eigene YAML-Sections und Raum-Overrides werden bewahrt. Es gibt keine allgemeine Entfernung vermeintlich leerer YAML-Abschnitte, die absichtliche Layouts beschädigt.

## Review und übernommene Arbeit

1. Ausgangslage: synthetische Fixture, Performance-Test und Browser-Harness.
2. Diagnose/Editor: `src/editor/`, Übersetzungen und Dokumentation.
3. Verarbeitung/Karten: Registry, Pooling, Updatekriterien, Debugmessungen und Links.
4. Darstellung/Kamera: mobile Felder, Tastaturbedienung und native Pause.
5. Lieferung: Version 1.33.0, kompatible Dependency-Patches und neu gebautes `dist/`.

Vorherige uncommittete Änderungen von `codex/editor-diagnostics-v132` wurden vorab als binärer Git-Patch und separate neue Diagnosedateien lokal gesichert. Diese Vorarbeit ist inzwischen durch PR #77 in `main` enthalten; ihr Quellcode stimmt mit dem gesicherten Ausgangsstand überein. Für die Lieferung basiert der Optimierungsbranch auf diesem aktuellen `main`, ohne Arbeitsdateien zu überschreiben. Der lokal gespeicherte `optimization-only.patch` dokumentiert den Implementierungsstand gegenüber dem rekonstruierten Ausgangscode. Lieferung erfolgt per Commit, Branch-Push und Pull Request; Merge, Release und Deployment sind nicht Bestandteil dieser Arbeit. Beim Rücknehmen die Vorarbeit erhalten; kein pauschales `git reset` oder `git restore` des Arbeitsverzeichnisses verwenden.

## Optionale Kamera-Pause

```yaml
strategy:
  type: custom:dashboard-strategy
  camera_renderer: native
  camera_live_toggle: true
  camera_pause_when_hidden: true
```

Der Standard bleibt `false`. Die Option gilt für die eigene native Kamerakarte mit manuellem Live-Schalter. Bei verborgenem Browserdokument oder außerhalb des sichtbaren Bereichs wechselt sie von `live` zu `auto`; bei Rückkehr wird das zuvor manuell gestartete Livebild fortgesetzt. Ein manueller Stopp bleibt erhalten. Observer und Dokumentlistener werden beim Entfernen abgebaut. Ob der native Renderer dabei tatsächlich Netzwerkstreams beendet, hängt vom HA-Frontend ab und wurde mit Test-Doubles nicht gemessen. Externe WebRTC-, Advanced-Camera- und eigene YAML-Karten bleiben unverändert. Der Advanced-Camera-Hinweis erscheint nur bei `live.preload: true` und explizit leerem `live.auto_pause: []`; er behauptet keine gemessene Streamlast.

Optional lassen sich Wetterlayouts auf benötigte Standardblöcke reduzieren, USV-Daten auf relevante Sensoren begrenzen und Kameraaktionen in einer eigenen Ansicht bündeln. Bestehende Layouts und Auswahlen werden nicht automatisch geändert.

## Messverfahren und Ergebnis

Die Fixture verwendet 500, 2.000 und 5.000 erzeugte Entitäten plus vier feste Testentitäten, 24 Bereiche, drei Etagen, Wetter-YAML, USV, Kameraaktionen, Raum-Override und ausgeblendeten Bereich. Keine persönlichen IDs, Adressen oder Live-Konfigurationskopien sind enthalten.

Ausgangscode und Optimierung wurden mit derselben Fixture, demselben Harness, Chrome unter Windows und denselben installierten Dependencies verglichen. Pro Größe: zehn Aufwärmrunden und 21 Messrunden; drei Vorher-/Nachher-Paare nacheinander. Tabellenwerte sind der Median der drei Laufmediane in Millisekunden. `dashboard` misst `generate()` mit zurückgesetzter Registry einschließlich aller Views. `registry` misst separat den kalten Aufbau. Editoröffnung misst den zunächst eingeklappten Editor. Alle Laufmediane stehen in [dashboard-optimization-benchmark.json](dashboard-optimization-benchmark.json).

| Entitäten | Dashboard vorher | Dashboard danach | Veränderung | Registry vorher/nachher | Editor vorher/nachher |
| --- | ---: | ---: | ---: | ---: | ---: |
| 500 | 1,255 | 0,945 | −24,7 % | 0,185 / 0,205 | 0,165 / 0,170 |
| 2.000 | 4,300 | 2,780 | −35,3 % | 0,695 / 0,700 | 0,155 / 0,155 |
| 5.000 | 10,855 | 6,935 | −36,1 % | 1,855 / 1,840 | 0,165 / 0,160 |

| Entitäten | 100 Diagnoseupdates vorher/nachher | 100 neue YAML-Analysen vorher/nachher | 100 unabhängige Kartenupdates vorher/nachher |
| --- | ---: | ---: | ---: |
| 500 | 0,650 / 0,015 | 0,630 / 0,780 | 0,030 / 0,040 |
| 2.000 | 0,650 / 0,015 | 0,615 / 0,755 | 0,035 / 0,040 |
| 5.000 | 0,660 / 0,015 | 0,615 / 0,745 | 0,035 / 0,040 |

Dashboard-Erzeugung erfüllt in allen drei Paaren die Grenze von höchstens 10 % Verschlechterung. Wiederholte Diagnose vermeidet rund 98 % ihrer Zeit durch den Cache. Neue Analysen sind wegen zusätzlicher Regeln etwas teurer; der YAML-Parser selbst wurde nicht beschleunigt. Submillisekundenwerte für Editor und Karten sind störanfällig und belegen keinen allgemeinen Geschwindigkeitsgewinn. Pooling und Updateverhalten werden deshalb funktional geprüft.

## Prüfung und Grenzen

Ausgangsstand: Typecheck, Lint und 185 Tests in 41 Dateien bestanden. Abschluss: Typecheck, Lint, 198 Tests in 45 Dateien, Übersetzungsprüfung, Produktionsbuild, Versionsabgleich, Produktionsartefaktprüfung, HACS-Prüfung und `git diff --check` bestanden. `npm audit` meldet nach kompatiblen Lockfile-Updates null Schwachstellen. Distribution: acht JavaScript-Dateien, 16 komprimierte Dateien. Entry rund 7,84 KiB; Core rund 254 KiB mit Webpack-Größenwarnung. Editor und YAML-Diagnose liegen außerhalb des Entry.

Browserprüfungen laufen lokal mit tatsächlichen Strategy-, Editor- und Wrappermodulen, synthetischen Daten und Test-Doubles für native HA-Karten. Geprüft: Tile-Identität, Attribute, Sprache, Bereiche, fehlende/zurückkehrende Zustände, Verfügbarkeit, Tastaturaktionen, manuelles Kamerastarten/-stoppen, Sichtbarkeit, unveränderte Konfiguration, Wiederanschließen und veraltete asynchrone Ergebnisse. Bei 360, 768 und 1.280 Pixeln mit simulierter ein-/ausgeklappter Seitenleiste entsteht kein horizontaler Überlauf. Unter 768 Pixeln verbraucht die simulierte Seitenleiste keinen Inhaltsplatz. 360- und 1.280-Pixel-Screenshots wurden visuell geprüft.

Reales HA-Kartenrendering, echte Streams und Geräteleistung bleiben vor einer Veröffentlichung auf einer separaten Testinstanz zu prüfen. Kein Live-Screenshot wurde aktiviert. Der Second-Brain-Pfad war nicht vorhanden; eine Obsidian-Dokumentation wurde deshalb nicht vorgetäuscht.

## Reproduktion

```powershell
npm run verify:release
npm audit
git diff --check

# Bereits vorhandenes Playwright-Modul und Browser verwenden:
$env:PLAYWRIGHT_MODULE_PATH = 'C:\path\to\playwright'
$env:OPTIMIZATION_BROWSER_PATH = 'C:\path\to\chrome.exe'
$env:OPTIMIZATION_REPORT = "$env:TEMP\optimization-report.json"
npm run test:browser
```

Playwright ist eine optionale lokale Testvoraussetzung, keine Runtime-Abhängigkeit. Ohne Modulpfad wird ein lokal verfügbares `playwright` verwendet, ohne Browserpfad dessen Chromium. Der Runner baut temporär und öffnet ausschließlich localhost; Screenshots bleiben im temporären Verzeichnis. Zum Vergleich denselben Harness und Dependencies in einem separaten Checkout des gesicherten Ausgangsstands verwenden und dessen Pfad an `node scripts/verify-browser-optimization.mjs <baseline-path>` übergeben. `OPTIMIZATION_BASELINE=1` überspringt die neuen Funktionstests. Beide Stände mit derselben Umgebung vergleichen.

Debugmessungen sind mit `?s42_debug=true` aktivierbar. Die Konsole fasst Updates, Kartenerzeugung und Diagnoseanalysen zusammen; `__s42_dump()` zeigt höchstens 100 vergangene Messungen. Performance-Marks werden nach Timerende entfernt; Aggregationstimer enden nach fünf Sekunden ohne neue Arbeit.
