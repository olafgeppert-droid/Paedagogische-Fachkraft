// src/components/HelpModal.jsx
import React from 'react';
import { appVersion } from '../version.js';

const HelpModal = ({ onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>❓ Hilfe zur Anwendung</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div style={{ paddingRight: '1rem', maxHeight: '65vh', overflowY: 'auto' }}>
                    <p>Willkommen zur Hilfe für die pädagogische Dokumentations-App! Diese Anleitung erklärt die Bedienung der App, alle Buttons und Dialoge sowie die Such- und Filterfunktionen.</p>

                    <h3>👥 1. Schüler verwalten</h3>
                    <ul>
                        <li><strong>Schüler hinzufügen:</strong> Klicken Sie auf <span role="img">👥</span> „Kind hinzufügen“ in der Werkzeugleiste. Es öffnet sich ein Dialog, in dem Name, Geschlecht, Klasse und weitere Stammdaten erfasst werden.</li>
                        <li><strong>Schüler bearbeiten:</strong> Wählen Sie ein Kind aus der Liste und klicken Sie auf <span role="img">✏️</span> „Kind bearbeiten“. Alle Informationen können angepasst werden.</li>
                        <li><strong>Schüler löschen:</strong> Im Bearbeitungsdialog können Schüler mit einem Klick auf „❌ Löschen“ entfernt werden. Achtung: Alle zugehörigen Einträge werden ebenfalls gelöscht.</li>
                        <li><strong>Schüler suchen:</strong> Im Navigationsbereich gibt es ein Suchfeld 🔍. Tippen Sie einen Namen oder Teil eines Namens ein, um die Liste zu filtern. Die Suche ist nicht case-sensitiv.</li>
                        <li><strong>Filter kombinieren:</strong> Sie können zusätzlich nach Schuljahr, Schule oder Klasse filtern. Der Button „❌ Filter löschen“ entfernt alle aktiven Filter.</li>
                    </ul>

                    <h3>📝 2. Einträge verwalten</h3>
                    <ul>
                        <li><strong>Neuer Eintrag:</strong> Wählen Sie einen Schüler aus und klicken auf <span role="img">📝</span> „Eintrag hinzufügen“. Es öffnet sich ein Dialog zum Erfassen von Datum, Thema, Aktivität, Bewertung und Notizen.</li>
                        <li><strong>Eintrag bearbeiten:</strong> Klicken Sie auf einen bestehenden Eintrag und dann auf „🔧 Eintrag bearbeiten“. Änderungen werden sofort gespeichert.</li>
                        <li><strong>Einträge löschen:</strong> Im Bearbeitungsdialog eines Eintrags gibt es die Möglichkeit „❌ Löschen“ zu wählen. Das Entfernt nur den einzelnen Eintrag.</li>
                        <li><strong>Datum auswählen:</strong> In der Navigation können Sie mit dem Datumsfeld 📅 gezielt Einträge eines bestimmten Tages anzeigen lassen.</li>
                    </ul>

                    <h3>🔎 3. Suchen & Filtern von Protokollen</h3>
                    <ul>
                        <li><strong>Suchdialog öffnen:</strong> Klicken Sie in der Toolbar auf 🔍 „Protokoll suchen“.</li>
                        <li><strong>Suchbegriffe:</strong> Geben Sie Text ein, um Einträge nach Thema, Aktivität, Bewertung, Notizen oder Schülername zu durchsuchen.</li>
                        <li><strong>Exakte Suche:</strong> Verwenden Sie Anführungszeichen, z. B. <code>"Mathematik"</code>, um nur exakte Treffer zu finden.</li>
                        <li><strong>Suchfilter:</strong> Wählen Sie aus, ob nach Thema, Bewertung, Schülername oder allen Feldern gesucht werden soll.</li>
                        <li><strong>Suchergebnisse:</strong> Nach der Suche werden die Ergebnisse direkt im Hauptbereich angezeigt. Mit einem Klick auf einen Eintrag können Sie diesen bearbeiten.</li>
                    </ul>

                    <h3>💾 4. Datenmanagement</h3>
                    <ul>
                        <li><strong>Exportieren:</strong> Klicken Sie auf <span role="img">💾</span> „Exportieren“ in der Toolbar. Es wird eine JSON-Datei erstellt, die alle Daten enthält. Auf iOS erscheint der Teilen-Dialog 📱.</li>
                        <li><strong>Importieren:</strong> Klicken Sie auf <span role="img">📥</span> „Importieren“ und wählen Sie eine Sicherungsdatei aus. Die Daten werden geladen und ersetzen die aktuellen Inhalte.</li>
                        <li><strong>Drucken:</strong> Mit „🖨️ Drucken“ können Sie eine PDF oder Ausdruck aller aktuell angezeigten Einträge erstellen.</li>
                        <li><strong>Beispieldaten laden:</strong> „📂 Beispieldaten“ lädt einige Demo-Schüler und Einträge, um die App zu testen.</li>
                        <li><strong>Alle Daten löschen:</strong> „❌ Alle Daten löschen“ entfernt sämtliche Schüler, Einträge und Einstellungen. Eine Sicherheitsabfrage schützt vor versehentlichem Löschen.</li>
                    </ul>

                    <h3>⚙️ 5. Einstellungen</h3>
                    <ul>
                        <li><strong>Farbschema:</strong> Wählen Sie zwischen hell 🌞, dunkel 🌙 oder kontrastreich 🎨.</li>
                        <li><strong>Schriftgröße:</strong> Passen Sie die allgemeine Schriftgröße und Eingabefeld-Schriftgröße an.</li>
                        <li><strong>Stammdaten verwalten:</strong> Hier können Schuljahre, Schulen, Klassen, Aktivitäten und Notizvorlagen bearbeitet werden.</li>
                        <li><strong>Speicherung:</strong> Alle Einstellungen werden automatisch im Browser gespeichert und beim Neustart wiederhergestellt.</li>
                    </ul>

                    <h3>📊 6. Statistiken</h3>
                    <ul>
                        <li>Klicken Sie auf „📊 Statistiken“ in der Toolbar oder Navigation, um Auswertungen für einzelne Schüler oder Klassen anzuzeigen.</li>
                        <li>Es werden Übersichtsgrafiken zu Aktivitäten, Bewertungen und Teilnahme erstellt.</li>
                        <li>Filter aus der Navigation wirken sich direkt auf die Statistiken aus.</li>
                    </ul>

                    <h3>🖐️ 7. Hilfe & Support</h3>
                    <ul>
                        <li>Klicken Sie auf „❓ Hilfe“ in der Toolbar oder Navigation, um diese Anleitung jederzeit aufzurufen.</li>
                        <li>Alle Dialoge lassen sich mit dem ×-Button oben rechts schließen.</li>
                        <li>Am unteren Rand der Hilfe sehen Sie die aktuelle Version der Software.</li>
                    </ul>

                    <p>Die App ist intuitiv zu bedienen, und alle Funktionen sind über Toolbar, Navigation und Kontextdialoge erreichbar. Nutzen Sie die Such- und Filterfunktionen, um schnell zu den gewünschten Schülern und Einträgen zu navigieren.</p>
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
