const { useState, useEffect, useCallback } = React;

// Hauptkomponente
const App = () => {
    const [db, setDb] = useState(null);
    const [students, setStudents] = useState([]);
    const [entries, setEntries] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [viewMode, setViewMode] = useState('student');
    const [filters, setFilters] = useState({
        search: '',
        schoolYear: '',
        school: '',
        className: ''
    });
    const [settings, setSettings] = useState({
        theme: 'light',
        fontSize: 16,
        inputFontSize: 16,
        customColors: {}
    });
    const [masterData, setMasterData] = useState({
        schoolYears: [],
        schools: {}
    });
    const [modal, setModal] = useState(null);
    const [navOpen, setNavOpen] = useState(false);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    // Datenbank initialisieren
    useEffect(() => {
        const initDB = async () => {
            try {
                const database = await setupDB();
                setDb(database);
                
                // Einstellungen laden
                const settingsData = await database.get('settings', 1);
                if (settingsData) {
                    setSettings(settingsData);
                    applySettings(settingsData);
                }
                
                // Master-Daten laden
                const masterData = await database.get('masterData', 1);
                if (masterData) {
                    setMasterData(masterData);
                }
                
                // Studenten laden
                const allStudents = await database.getAll('students');
                setStudents(allStudents);
            } catch (error) {
                console.error('Datenbank-Initialisierungsfehler:', error);
            }
        };
        
        initDB();
    }, []);

    // Einstellungen anwenden
    const applySettings = (settings) => {
        document.documentElement.setAttribute('data-theme', settings.theme);
        document.documentElement.style.setProperty('--font-size', `${settings.fontSize}px`);
        document.documentElement.style.setProperty('--input-font-size', `${settings.inputFontSize}px`);
    };

    // Einträge laden basierend auf Auswahl
    useEffect(() => {
        const loadEntries = async () => {
            if (!db) return;
            
            try {
                let entriesData = [];
                if (viewMode === 'student' && selectedStudent) {
                    entriesData = await getEntriesByStudentId(db, selectedStudent.id);
                } else if (viewMode === 'day' && selectedDate) {
                    entriesData = await getEntriesByDate(db, selectedDate);
                }
                
                setEntries(entriesData);
            } catch (error) {
                console.error('Fehler beim Laden der Einträge:', error);
            }
        };
        
        loadEntries();
    }, [db, selectedStudent, selectedDate, viewMode]);

    // Gefilterte Schülerliste
    const filteredStudents = useCallback(() => {
        return filterStudents(students, filters);
    }, [students, filters]);

    // Schüler hinzufügen/bearbeiten
    const saveStudent = async (studentData) => {
        if (!db) return;
        
        try {
            await saveStateForUndo(db, history, setHistory, setHistoryIndex);
            
            if (studentData.id) {
                await updateStudent(db, studentData);
                setStudents(students.map(s => s.id === studentData.id ? studentData : s));
            } else {
                const newStudent = await addStudent(db, studentData);
                setStudents([...students, newStudent]);
            }
            
            setModal(null);
        } catch (error) {
            console.error('Fehler beim Speichern des Schülers:', error);
        }
    };

    // Weitere Funktionen hier...

    if (!db) {
        return <div>Datenbank wird initialisiert...</div>;
    }

    return (
        <div className="app">
            <Header 
                onMenuClick={() => setNavOpen(!navOpen)}
            />
            <Toolbar
                selectedStudent={selectedStudent}
                selectedDate={selectedDate}
                onAddStudent={() => setModal('student')}
                onEditStudent={() => setModal('student')}
                onAddEntry={() => setModal('entry')}
                onEditEntry={() => setModal('entry')}
                onPrint={() => window.print()}
                onExport={() => exportData(db)}
                onImport={(e) => importData(db, e, setSettings, setMasterData, setStudents, setModal)}
                onUndo={() => undo(db, history, historyIndex, setHistoryIndex, setStudents)}
                onRedo={() => redo(db, history, historyIndex, setHistoryIndex, setStudents)}
                canUndo={historyIndex > 0}
                canRedo={historyIndex < history.length - 1}
            />
            <Navigation
                isOpen={navOpen}
                students={filteredStudents()}
                selectedStudent={selectedStudent}
                selectedDate={selectedDate}
                filters={filters}
                masterData={masterData}
                onStudentSelect={setSelectedStudent}
                onDateSelect={(date) => {
                    setSelectedDate(date);
                    setViewMode('day');
                }}
                onFilterChange={setFilters}
                onShowStats={() => setModal('statistics')}
                onShowSettings={() => setModal('settings')}
                onShowHelp={() => setModal('help')}
            />
            <MainContent
                viewMode={viewMode}
                selectedStudent={selectedStudent}
                selectedDate={selectedDate}
                entries={entries}
                onEditEntry={() => setModal('entry')}
            />
            
            {/* Modale Dialoge */}
            {modal === 'student' && (
                <StudentModal
                    student={selectedStudent}
                    masterData={masterData}
                    onSave={saveStudent}
                    onClose={() => setModal(null)}
                />
            )}
            
            {modal === 'entry' && (
                <EntryModal
                    entry={viewMode === 'student' && entries.length > 0 ? entries[0] : null}
                    student={selectedStudent}
                    students={students}
                    masterData={masterData}
                    onSave={saveEntry}
                    onClose={() => setModal(null)}
                />
            )}
            
            {modal === 'settings' && (
                <SettingsModal
                    settings={settings}
                    masterData={masterData}
                    onSave={saveSettings}
                    onSaveMasterData={saveMasterData}
                    onClose={() => setModal(null)}
                />
            )}
            
            {modal === 'statistics' && (
                <StatisticsModal
                    students={students}
                    entries={entries}
                    onClose={() => setModal(null)}
                />
            )}
            
            {modal === 'help' && (
                <HelpModal
                    onLoadSampleData={loadSampleData}
                    onClearData={clearAllData}
                    onClose={() => setModal(null)}
                />
            )}
        </div>
    );
};

// React App rendern
ReactDOM.render(<App />, document.getElementById('root'));
