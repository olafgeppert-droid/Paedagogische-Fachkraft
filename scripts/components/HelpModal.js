const HelpModal = ({ onLoadSampleData, onClearData, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>Hilfe</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                
                <div>
                    <h3>Anleitung</h3>
                    <p>Willkommen zur Pädagogischen Dokumentation. Diese Anwendung hilft Ihnen bei der Dokumentation von Beobachtungen und Maßnahmen für Kinder und Jugendliche.</p>
                    
                    <h4>Erste Schritte</h4>
                    <ol>
                        <li>Fügen Sie Kinder über den Button "Kind hinzufügen" hinzu</li>
                        <li>Wählen Sie ein Kind aus der Liste, um Einträge zu erstellen</li>
                        <li>Erstellen Sie Einträge mit Beobachtungen, Maßnahmen und Bewertungen</li>
                        <li>Wechseln Sie zwischen Kinder- und Tagesansicht</li>
                    </ol>
                    
                    <h4>Datenverwaltung</h4>
                    <p>Exportieren Sie regelmäßig Ihre Daten, um sie zu sichern. Sie können die Daten auch auf ein andere
