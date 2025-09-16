// Hooks aus React holen
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

                const settingsData = await database.get('settings', 1);
                if (settingsData) {
                    setSettings(settingsData);
                    applySettings(settingsData);
                }

                const masterDataLoaded = await database.get('masterData', 1);
                if (masterDataLoaded) {
                    setMasterData(masterDataLoaded);
                }

                const allStudents = await database.getAll('students');
                setStudents(allStudents);
            } catch (error) {
                console.error('Datenbank-Initialisierungsfehler:', error);
            }
        };

        initDB();
    }, []);

    const applySettings = (settings) => {
        document.documentElement.setAttribute('data-theme', settings.theme);
        document.documentElement.style.setProperty('--font-size', `${settings.fontSize}px`);
        document.documentElement.style.setProperty('--input-font-size', `${settings.inputFontSize}px`);
    };

    // Einträge laden
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

    const filteredStudents = useCallback(() => {
        return filterStudents(students, filters);
    }, [students, filters]);

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

    const deleteStudentHandler = async (studentId) => {
        if (!db) return;
        try {
            await saveStateForUndo(db, history, setHistory, setHistoryIndex);
            const success = await deleteStudent(db, studentId);
            if (success) {
                setStudents(students.filter(s => s.id !== studentId));
                if (selectedStudent && selectedStudent.id === studentId) {
                    setSelectedStudent(null);
                }
                alert('Kind wurde erfolgreich gelöscht.');
            } else {
                alert('Fehler beim Löschen des Kindes.');
            }
        } catch (error) {
            console.error('Fehler beim Löschen des Schülers:', error);
            alert('Fehler beim Löschen des Kindes: ' + error.message);
        }
    };

    const saveEntry = async (entryData) => {
        if (!db) return;
        try {
            await saveStateForUndo(db, history, setHistory, setHistoryIndex);
            if (entryData.id) {
                await updateEntry(db, entryData);
                setEntries(entries.map(e => e.id === entryData.id ? entryData : e));
            } else {
                const newEntry = await addEntry(db, { ...entryData, date: selectedDate });
                setEntries([...entries, newEntry]);
            }
            setModal(null);
        } catch (error) {
            console.error('Fehler beim Speichern des Eintrags:', error);
        }
    };

    const saveSettings = async (newSettings) => {
        if (!db) return;
        try {
            await db.put('settings', { ...newSettings, id: 1 });
            setSettings(newSettings);
            applySettings(newSettings);
            setModal(null);
        } catch (error) {
            console.error('Fehler beim Speichern der Einstellungen:', error);
        }
    };

    const saveMasterData = async (newMasterData) => {
        if (!db) return;
        try {
            await db.put('masterData', { ...newMasterData, id: 1 });
            setMasterData(newMasterData);
        } catch (error) {
            console.error('Fehler beim Speichern der Master-Daten:', error);
        }
    };

    const handleExport = async () => { await exportData(db); };
    const handleImport = async (event) => {
        await importData(db, event, setSettings, setMasterData, setStudents, setModal);
    };

    const handleUndo = async () => { await undo(db, history, historyIndex, setHistoryIndex, setStudents); };
    const handleRedo = async () => { await redo(db, history, historyIndex, setHistoryIndex, setStudents); };

    const handleLoadSampleData = async () => { await loadSampleData(db, setMasterData, setStudents); };
    const handleClearData = async () => { await clearAllData(db, setStudents, setEntries, setSelectedStudent); };

    if (!db) return <div>Datenbank wird initialisiert...</div>;

    return (
        <div className="app">
            <Header onMenuClick={() => setNavOpen(!navOpen)} />
            <Toolbar
                selectedStudent={selectedStudent}
                selectedDate={selectedDate}
                onAddStudent={() => setModal('student')}
                onEditStudent={() => setModal('student')}
                onAddEntry={() => setModal('entry')}
                onEditEntry={() => setModal('entry')}
                onPrint={() => window.print()}
                onExport={handleExport}
                onImport={handleImport}
                onUndo={handleUndo}
                onRedo={handleRedo}
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
                onStudentSelect={(student) => {
                    setSelectedStudent(student);
                    setViewMode('student');
                }}
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
            {modal === 'student' && (
                <StudentModal
                    student={selectedStudent}
                    masterData={masterData}
                    onSave={saveStudent}
                    onDelete={deleteStudentHandler}
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
                    onLoadSampleData={handleLoadSampleData}
                    onClearData={handleClearData}
                    onClose={() => setModal(null)}
                />
            )}
        </div>
    );
};

// React App rendern, erst nach DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(<App />);
});
