import React from 'react';

const Toolbar = ({
    students,              // <- für Protokoll-Suchen Aktivierung
    selectedStudent,
    selectedDate,
    onAddStudent,
    onEditStudent,
    onSearchProtocol,
    onAddEntry,
    onPrint,
    onExport,
    onImport,
    onUndo,
    onRedo,
    canUndo,
    canRedo
}) => {

    const hasStudents = students && students.length > 0;

    return (
        <div className="toolbar">
            {/* Erste Zeile: Schüler- und Protokollfunktionen */}
            <div className="toolbar-row">
                <button
                    className="button"
                    onClick={() => onAddStudent && onAddStudent()}
                    title="Neuen Schüler hinzufügen"
                >
                    👥 Neuer Schüler
                </button>
                
                <button
                    className="button"
                    onClick={() => onEditStudent && onEditStudent()}
                    title="Ausgewählten Schüler bearbeiten"
                    disabled={!selectedStudent}
                >
                    ✏️ Schüler bearbeiten
                </button>
                
                <button
                    className="button"
                    onClick={() => onAddEntry && onAddEntry()}
                    title="Neues Protokoll anlegen"
                    disabled={!selectedStudent}
                >
                    📝 Protokoll anlegen
                </button>

                {/* Protokoll suchen aktiv, sobald mindestens ein Schüler existiert */}
                <button
                    className="button"
                    onClick={() => {
                        if (typeof onSearchProtocol === 'function') onSearchProtocol();
                        else console.error('onSearchProtocol ist keine Funktion');
                    }}
                    title="Protokoll suchen"
                    disabled={!hasStudents}
                >
                    🔍 Protokoll suchen
                </button>
            </div>

            {/* Zweite Zeile: Datenmanagement-Funktionen */}
            <div className="toolbar-row">
                <button
                    className="button"
                    onClick={() => onPrint && onPrint()}
                    title="Drucken"
                    disabled={!selectedStudent}
                >
                    🖨️ Drucken
                </button>
                
                <button
                    className="button"
                    onClick={() => onExport && onExport()}
                    title="Daten exportieren / Teilen"
                >
                    💾 Export / Teilen
                </button>
                
                <button
                    className="button"
                    onClick={() => onImport && onImport()}
                    title="Daten importieren"
                >
                    📥 Import
                </button>
                
                <button
                    className="button"
                    onClick={() => onUndo && onUndo()}
                    disabled={!canUndo}
                    title="Rückgängig"
                >
                    ↩️ Rückgängig
                </button>
                
                <button
                    className="button"
                    onClick={() => onRedo && onRedo()}
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
