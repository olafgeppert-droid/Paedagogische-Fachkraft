// src/components/HelpModal.jsx
import React from 'react';
import { appVersion } from '../version.js';

const HelpModal = ({ onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal" style={{ maxWidth: '900px', width: '90%' }}>
                <div className="modal-header">
                    <h2>❓ Hilfe zur Anwendung</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div style={{ paddingRight: '1rem', maxHeight: '70vh', overflowY: 'auto' }}>
                    <p>Willkommen zur umfassenden Hilfe für die <strong>pädagogische Dokumentations-App</strong>! 🎓 Diese Anleitung erklärt Schritt für Schritt alle Funktionen, Buttons und Dialoge, sowie die Such- und Filtermöglichkeiten.</p>

                    <h3>👥 1. Schülerverwaltung</h3>
                    <p>Alle Informationen zu Schülern werden zentral verwaltet. Sie können neue Schüler hinzufügen, bestehende bearbeiten, löschen oder filtern.</p>
                    <ul>
                        <li><strong>Schüler hinzufügen:</strong> Klicken Sie auf <span role="img">👥</span> „Kind hinzufügen“ in der Toolbar. Es öffnet sich ein Dialog, in dem Sie folgende Angaben machen:
                            <ul>
                                <li>Name des Kindes</li>
                                <li>Geschlecht (m/w)</li>
                                <li>Klasse</li>
                                <li>Schule</li>
                                <li>Besondere Notizen oder Hinweise</li>
                            </ul>
                            Nach dem Speichern wird der neue Schüler sofort in der Navigation angezeigt.
                        </li>
                        <li><strong>Schüler bearbeiten:</strong> Wählen Sie ein Kind in der Navigationsliste aus und klicken Sie auf „✏️ Kind bearbeiten“. Sie können alle zuvor gespeicherten Angaben ändern.</li>
                        <li><strong>Schüler löschen:</strong> Im Bearbeitungsdialog gibt es einen „❌ Löschen“-Button. Achtung: Alle Einträge dieses Schülers werden ebenfalls gelöscht.</li>
                        <li><strong>Filter & Suche:</strong> In der Navigation finden Sie oben ein Suchfeld 🔍. 
                            <ul>
                                <li>Beispiel: Eingabe <code>Anna</code> zeigt alle Schüler mit „Anna“ im Namen.</li>
                                <li>Beispiel: <code>an</code> zeigt Anna, Jana und andere Treffer.</li>
                                <li>Filter nach Schuljahr, Schule oder Klasse: Wählen Sie aus den Dropdowns. Mehrere Filter kombinierbar.</li>
                                <li>Mit „❌ Filter löschen“ entfernen Sie alle Filter gleichzeitig.</li>
                            </ul>
                        </li>
                        <li><strong>Schülerauswahl:</strong> Klicken Sie auf einen Schüler, um seine Einträge im Hauptbereich anzuzeigen.</li>
                    </ul>

                    <h3>📝 2. Einträge verwalten</h3>
                    <p>Jeder Schüler kann beliebig viele Einträge haben, z. B. Beobachtungen, Aktivitäten oder Bewertungen.</p>
                    <ul>
                        <li><strong>Neuer Eintrag:</strong> Klicken Sie auf „📝 Eintrag hinzufügen“ in der Toolbar. Dialogfelder:
                            <ul>
                                <li>Datum auswählen</li>
                                <li>Thema/Projekt</li>
                                <li>Aktivität</li>
                                <li>Bewertung/Noten</li>
                                <li>Notizen</li>
                            </ul>
                        </li>
                        <li><strong>Eintrag bearbeiten:</strong> Klicken Sie auf einen bestehenden Eintrag. Wählen Sie „🔧 Eintrag bearbeiten“, ändern Sie die Daten und speichern Sie.</li>
                        <li><strong>Eintrag löschen:</strong> Direkt im Bearbeitungsdialog über „❌ Löschen“. Nur der gewählte Eintrag wird entfernt.</li>
                        <li><strong>Datum filtern:</strong> In der Navigation können Sie ein Datum auswählen 📅, um Einträge eines bestimmten Tages zu sehen.</li>
                        <li><strong>Beispiel:</strong> Datum „2025-09-23“ → zeigt alle Einträge vom heutigen Tag.</li>
                    </ul>

                    <h3>🔎 3. Suchen & Filtern von Protokollen</h3>
                    <p>Die Suchfunktion erlaubt eine gezielte Abfrage über alle Einträge und Schüler.</p>
                    <ul>
                        <li><strong>Suchdialog öffnen:</strong> Toolbar-Button 🔍 „Protokoll suchen“.</li>
                        <li><strong>Suchbegriffe:</strong> Sie können nach:
                            <ul>
                                <li>Thema/Projekt (<code>Mathematik</code>)</li>
                                <li>Aktivität (<code>Experiment</code>)</li>
                                <li>Bewertung (<code>gut</code>)</li>
                                <li>Notizen (<code>Hausaufgabe erledigt</code>)</li>
                                <li>Schülername (<code>Anna</code>)</li>
                            </ul>
                        </li>
                        <li><strong>Exakte Suche:</strong> Mit Anführungszeichen: <code>"Mathematik"</code> → nur exakte Treffer.</li>
                        <li><strong>Alle Felder durchsuchen:</strong> Auswahl „Alle Felder“ durchsucht automatisch Thema, Aktivität, Notizen, Bewertung und Schülername.</li>
                        <li><strong>Beispiel 1:</strong> Suchbegriff <code>Projekt</code>, Filter: Thema → zeigt alle Einträge mit „Projekt“ im Thema.</li>
                        <li><strong>Beispiel 2:</strong> Suchbegriff <code>Anna</code>, Filter: Name → zeigt nur Einträge von Anna.</li>
                        <li><strong>Suchergebnisse bearbeiten:</strong> Klicken Sie auf einen Eintrag → Bearbeiten oder Löschen.</li>
                        <li><strong>Filter kombinieren:</strong> Zusätzlich zu Textsuche können Sie Datum, Klasse oder Schule filtern.</li>
                        <li><strong>Mini-Screenshot:</strong> <img src="/screenshots/search_example.png" alt="Suchbeispiel" style={{ width: '100px', cursor: 'pointer' }} onClick={() => window.open('/screenshots/search_example.png')} /></li>
                    </ul>

                    <h3>💾 4. Datenmanagement</h3>
                    <ul>
                        <li><strong>Exportieren:</strong> Button 💾 „Exportieren“ erstellt eine JSON-Datei aller Daten. Auf iOS/Android öffnet sich der Teilen-Dialog 📱.</li>
                        <li><strong>Importieren:</strong> Button 📥 „Importieren“ → wählt eine Sicherungsdatei aus und lädt Daten.</li>
                        <li><strong>Drucken:</strong> Button 🖨️ „Drucken“ → PDF oder Ausdruck der aktuellen Ansicht.</li>
                        <li><strong>Beispieldaten:</strong> Button 📂 „Beispieldaten“ lädt Demo-Schüler und Einträge.</li>
                        <li><strong>Alle Daten löschen:</strong> Button ❌ „Alle Daten löschen“ → Sicherheitsabfrage schützt vor versehentlichem Löschen.</li>
                    </ul>

                    <h3>⚙️ 5. Einstellungen</h3>
                    <ul>
                        <li><strong>Farbschema:</strong> hell 🌞, dunkel 🌙 oder kontrastreich 🎨.</li>
                        <li><strong>Schriftgröße:</strong> Anpassung für Texte und Eingabefelder.</li>
                        <li><strong>Stammdaten verwalten:</strong> Schuljahre, Schulen, Klassen, Aktivitäten, Notizvorlagen.</li>
                        <li><strong>Speicherung:</strong> Alle Einstellungen werden automatisch im Browser gespeichert.</li>
                    </ul>

                    <h3>📊 6. Statistiken</h3>
                    <ul>
                        <li>Button 📊 „Statistiken“ in Toolbar oder Navigation.</li>
                        <li>Übersicht nach Schüler, Klasse oder Zeitraum.</li>
                        <li>Diagramme zu Aktivitäten, Bewertungen, Notizen.</li>
                        <li>Filter aus Navigation wirken direkt auf Statistiken.</li>
                        <li>Mini-Screenshot: <img src="/screenshots/stats_example.png" alt="Statistiken" style={{ width: '100px', cursor: 'pointer' }} onClick={() => window.open('/screenshots/stats_example.png')} /></li>
                    </ul>

                    <h3>🖐️ 7. Hilfe & Support</h3>
                    <ul>
                        <li>Button ❓ „Hilfe“ öffnet diese Anleitung jederzeit.</li>
                        <li>Dialoge schließen über × oben rechts.</li>
                        <li>Versionsanzeige am unteren Rand: {appVersion}</li>
                    </ul>

                    <p>Mit dieser ausführlichen Hilfe sollten alle Funktionen, Filter, Suchmöglichkeiten und Datenoperationen verständlich sein. Nutzen Sie die Such- und Filterfunktionen, um gezielt Schüler und Einträge zu finden, und bearbeiten Sie Daten komfortabel über Toolbar und Navigation.</p>
                </div>

                <div className="form-actions" style={{ marginTop: '1rem' }}>
                    <button type="button" className="button button-success" onClick={onClose}>
                        ✔️ Verstanden
                    </button>
                </div>

                <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#666', textAlign: 'center' }}>
                    Version {appVersion}
                </div>
            </div>
        </div>
    );
};

export default HelpModal;
