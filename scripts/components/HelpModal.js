const HelpModal = ({ onClose, version }) => {
    return (
        <div className="modal-backdrop">
            <div className="modal-content" style={{ maxWidth: '800px', maxHeight: '80vh', overflowY: 'auto' }}>
                <h2>Hilfe zur Anwendung</h2>

                <div className="help-content" style={{ paddingRight: '1rem' }}>
                    <p>Willkommen bei der Hilfe für Ihre Anwendung zur pädagogischen Dokumentation. Hier finden Sie eine Erklärung aller wichtigen Funktionen.</p>

                    <h3>1. Aufbau der Anwendung</h3>
                    <ul>
                        <li><strong>Kopfzeile:</strong> Ganz oben finden Sie den Titel der Anwendung.</li>
                        <li><strong>Werkzeugleiste:</strong> Unter der Kopfzeile befindet sich die Leiste mit den Hauptaktionen (z.B. Kind anlegen, Suchen, Exportieren).</li>
                        <li><strong>Navigation (links):</strong> Hier können Sie die Anzeige filtern und zwischen Kindern und Tagen wechseln.</li>
                        <li><strong>Hauptbereich (rechts):</strong> Hier werden die Protokolleinträge für das ausgewählte Kind oder den ausgewählten Tag angezeigt.</li>
                    </ul>

                    <h3>2. Kinder verwalten</h3>
                    <p><strong>Kind anlegen:</strong> Klicken Sie auf <code>➕ Kind anlegen</code> in der Werkzeugleiste. Es öffnet sich ein Formular zur Eingabe der notwendigen Informationen.</p>
                    <p><strong>Kind suchen:</strong> Nutzen Sie das Suchfeld in der Navigation. Beginnen Sie, den Namen einzutippen, und die Liste wird in Echtzeit gefiltert.</p>

                    <h3>3. Einträge verwalten</h3>
                    <p><strong>Neuen Eintrag erstellen:</strong> Wählen Sie ein Kind aus der Navigationsliste. Klicken Sie auf <code>✨ Neuer Eintrag</code>, um das Formular zu öffnen.</p>
                    <p><strong>Eintrag ändern oder löschen:</strong> Klicken Sie auf einen Eintrag in der Liste, um ihn auszuwählen. Anschließend werden <code>✏️ Eintrag ändern</code> und <code>🗑️ Eintrag löschen</code> aktiv.</p>

                    <h3>4. Filtern und Ansichten</h3>
                    <ul>
                        <li><strong>Schuljahr, Schule, Klasse, Kind:</strong> Dropdown-Menüs filtern die Kinderliste. Kombinationen sind möglich.</li>
                        <li><strong>Tag:</strong> Datum auswählen, um die Tagesansicht zu aktivieren. Um zurück zur Kind-Ansicht zu wechseln, wählen Sie wieder ein Kind.</li>
                    </ul>

                    <h3>5. Datenmanagement (Import & Export)</h3>
                    <ul>
                        <li><strong>📤 Export:</strong> Erstellt eine Sicherung als <code>.json</code>-Datei.</li>
                        <li><strong>📥 Import:</strong> Lädt eine zuvor exportierte <code>.json</code>-Datei und überschreibt die aktuellen Daten.</li>
                    </ul>

                    <h3>6. Einstellungen</h3>
                    <ul>
                        <li><strong>Farbschema:</strong> Wählen Sie zwischen hell, dunkel oder kontrastreich.</li>
                        <li><strong>Schriftgröße:</strong> Passen Sie die Schriftgröße mit dem Schieberegler an.</li>
                    </ul>

                    <p>Ihre Einstellungen werden automatisch im Browser gespeichert.</p>
                </div>

                <div className="modal-actions" style={{ marginTop: '1rem' }}>
                    <button type="button" className="btn btn-primary" onClick={onClose}>✔️ Schließen</button>
                </div>

                {version && <div className="modal-footer" style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#555' }}>Version {version}</div>}
            </div>
        </div>
    );
};
