const Toolbar = ({
    selectedStudent, 
    selectedDate, 
    onAddStudent, 
    onEditStudent, 
    onAddEntry, 
    onEditEntry,
    onPrint,
    onExport,
    onImport,
    onUndo,
    onRedo,
    canUndo,
    canRedo
}) => {
    return (
        <div className="toolbar">
            <div className="toolbar-row">
                <button className="button" onClick={onAddStudent}>Kind hinzufügen</button>
                <button 
                    className="button" 
                    onClick={onEditStudent}
                    disabled={!selectedStudent}
                >
                    Kind bearbeiten/löschen
                </button>
                <button 
                    className="button" 
                    onClick={onAddEntry}
                    disabled={!selectedStudent && !selectedDate}
                >
                    Eintrag hinzufügen
                </button>
                <button 
                    className="button" 
                    onClick={onEditEntry}
                    disabled={!selectedStudent && !selectedDate}
                >
                    Eintrag bearbeiten
                </button>
            </div>
            <div className="toolbar-row">
                <button className="button" onClick={onPrint}>Drucken</button>
                <button className="button" onClick={onExport}>Daten exportieren</button>
                <label htmlFor="import-file" className="button">
                    Daten importieren
                    <input
                        id="import-file"
                        type="file"
                        accept=".json"
                        style={{ display: 'none' }}
                        onChange={onImport}
                    />
                </label>
                <button 
                    className="button" 
                    onClick={onUndo}
                    disabled={!canUndo}
                >
                    Rückgängig
                </button>
                <button 
                    className="button" 
                    onClick={onRedo}
                    disabled={!canRedo}
                >
                    Wiederholen
                </button>
            </div>
        </div>
    );
};
