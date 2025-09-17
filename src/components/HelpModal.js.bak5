const HelpModal = ({ onClose, version }) => {
    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>❓ Hilfe zur Anwendung</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                
                <div style={{ paddingRight: '1rem', maxHeight: '60vh', overflowY: 'auto' }}>
                    <p>Willkommen bei der Hilfe für Ihre Anwendung zur pädagogischen Dokumentation.</p>

                    <h3>👥 1. Kinder verwalten</h3>
                    <ul>
                        <li><strong>Kind anlegen:</strong> Klicken Sie auf "👥 Kind hinzufügen" in der Werkzeugleiste</li>
                        <li><strong>Kind bearbeiten:</strong> Wählen Sie ein Kind aus und klicken auf "✏️ Kind bearbeiten"</li>
                        <li><strong>Kind suchen:</strong> Nutzen Sie das Suchfeld in der Navigation</li>
                    </ul>

                    <h3>📝 2. Einträge verwalten</h3>
                    <ul>
                        <li><strong>Neuer Eintrag:</strong> Wählen Sie ein Kind aus und klicken auf "📝 Eintrag hinzufügen"</li>
                        <li><strong>Eintrag bearbeiten:</strong> Wählen Sie einen Eintrag aus und klicken auf "🔧 Eintrag bearbeiten"</li>
                    </ul>

                    <h3>💾 3. Datenmanagement</h3>
                    <ul>
                        <li><strong>Exportieren:</strong> "💾 Exportieren" erstellt eine Sicherungsdatei</li>
                        <li><strong>Importieren:</strong> "📥 Importieren" lädt eine Sicherung</li>
                        <li><strong>Drucken:</strong> "🖨️ Drucken" erstellt einen Ausdruck</li>
                    </ul>

                    <h3>⚙️ 4. Einstellungen</h3>
                    <ul>
                        <li><strong>Farbschema:</strong> Wählen Sie zwischen hell, dunkel oder kontrastreich</li>
                        <li><strong>Schriftgröße:</strong> Anpassbar in den Einstellungen</li>
                        <li><strong>Stammdaten:</strong> Verwalten Sie Schuljahre, Schulen und Klassen</li>
                    </ul>

                    <p>Ihre Einstellungen werden automatisch im Browser gespeichert.</p>
                </div>

                <div className="form-actions" style={{ marginTop: '1rem' }}>
                    <button type="button" className="button button-success" onClick={onClose}>
                        ✔️ Verstanden
                    </button>
                </div>

                {version && (
                    <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#666', textAlign: 'center' }}>
                        Version {version}
                    </div>
                )}
            </div>
        </div>
    );
};
