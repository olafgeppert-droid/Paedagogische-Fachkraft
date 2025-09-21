import React from 'react';

const Toolbar = ({
    selectedStudent, 
    selectedDate, 
    onAddStudent, 
    onEditStudent, 
    onAddEntry, 
    onSearch,     // neu statt onEditEntry
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
            {/* Erste Zeile: Schüler und Protokoll Funktionen */}
            <div className="toolbar-row">
                <button
                    className="button"
                    onClick={onAddStudent}
                    title="Neuen Schüler hinzufügen"
                >
                    👥 Neuer Schüler
                </button>
                
                <button
                    className="button"
                    onClick={onEditStudent}
                    title="Ausgewählten Schüler bearbeiten"
                    disabled={!selectedStudent}
                >
                    ✏️ Schüler bearbeiten
                </button>
                
                <button
                    className="button"
                    onClick={onAddEntry}
                    title="Neues Protokoll anlegen"
                >
                    📝 Protokoll anlegen
                </button>
                
                <button
                    className="button"
                    onClick={onSearch}
                    title="Protokolle suchen"
                >
                    🔍 Protokoll suchen
                </button>
            </div>

            {/* Zweite Zeile: Datenmanagement Funktionen */}
            <div className="toolbar-row">
                <button
                    className="button"
                    onClick={onPrint}
                    title="Drucken"
                >
                    🖨️ Drucken
                </button>
                
                <button
                    className="button"
                    onClick={onExport}
                    title="Daten exportieren"
                >
                    💾 Export
                </button>
                
                <button
                    className="button"
                    onClick={onImport}
                    title="Daten importieren"
                >
                    📥 Import
                </button>
                
                <button
                    className="button"
                    onClick={onUndo}
                    disabled={!canUndo}
                    title="Rückgängig"
                >
                    ↩️ Rückgängig
                </button>
                
                <button
                    className="button"
                    onClick={onRedo}
                    disabled={!canRedo}
                    title="Wiederherstellen"
                >
                    ↪️ Wiederherstellen
                </button>
            </div>
        </div>
    );
};

export default Toolbar;
