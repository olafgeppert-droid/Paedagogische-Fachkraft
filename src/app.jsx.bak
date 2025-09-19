import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header.jsx';
import Toolbar from './components/Toolbar.jsx';
import Navigation from './components/Navigation.jsx';
import MainContent from './components/MainContent.jsx';
import StudentModal from './components/StudentModal.jsx';
import EntryModal from './components/EntryModal.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import StatisticsModal from './components/StatisticsModal.jsx';
import HelpModal from './components/HelpModal.jsx';
import {
    setupDB,
    getEntriesByStudentId,
    getEntriesByDate,
    addStudent,
    updateStudent,
    deleteStudent,
    addEntry,
    updateEntry,
    saveStateForUndo,
    exportData,
    importData,
    undo,
    redo,
    loadSampleData,
    clearAllData,
    filterStudents
} from './database.js';

const App = () => {
    const [db, setDb] = useState(null);
    const [students, setStudents] = useState([]);
    const [entries, setEntries] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [viewMode, setViewMode] = useState('student');
    const [filters, setFilters] = useState({ search: '', schoolYear: '', school: '', className: '' });
    const [settings, setSettings] = useState({ theme: 'light', fontSize: 16, inputFontSize: 16, customColors: {} });
    const [masterData, setMasterData] = useState({ schoolYears: [], schools: {} });
    const [modal, setModal] = useState(null);
    const [navOpen, setNavOpen] = useState(false);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    const applySettings = useCallback((settings) => {
        document.documentElement.setAttribute('data-theme', settings.theme);
        document.documentElement.style.setProperty('--font-size', `${settings.fontSize}px`);
        document.documentElement.style.setProperty('--input-font-size', `${settings.inputFontSize}px`);
        
        // Benutzerdefinierte Farben anwenden
        if (settings.theme === 'colored' && settings.customColors) {
            applyCustomColors(settings.customColors);
        } else {
            // Zurücksetzen der benutzerdefinierten Farben bei anderen Themes
            resetCustomColors();
        }
    }, []);

    // Funktion zum Anwenden benutzerdefinierter Farben
    const applyCustomColors = (colors) => {
        const root = document.documentElement;
        
        // SPEZIFISCHE FARBZUWESUNGEN:
        // Navigation -> linkes Navigationsmenü
        root.style.setProperty('--sidebar-bg', colors.navigation || '#fed7aa');
        
        // Header -> Kopfbereich
        root.style.setProperty('--primary-color', colors.header || '#dc2626');
        root.style.setProperty('--secondary-color', colors.header ? darkenColor(colors.header, 20) : '#b91c1c');
        
        // Werkzeugleiste -> Toolbar
        root.style.setProperty('--toolbar-bg-custom', colors.toolbar || '#f8fafc');
        
        // Fenster-Hintergrund -> Hauptinhalt und Dialoge
        root.style.setProperty('--background-color', colors.protocol || '#fef7ed');
        root.style.setProperty('--card-bg', colors.protocol ? lightenColor(colors.protocol, 10) : '#ffffff');
        root.style.setProperty('--modal-bg-custom', colors.protocol || '#ffffff');
        
        // Für das farbige Theme spezifische Anpassungen
        document.documentElement.classList.add('custom-colors-applied');
    };

    // Funktion zum Zurücksetzen der benutzerdefinierten Farben
    const resetCustomColors = () => {
        const root = document.documentElement;
        // Entferne alle benutzerdefinierten Farbüberschreibungen
        root.style.removeProperty('--sidebar-bg');
        root.style.removeProperty('--primary-color');
        root.style.removeProperty('--secondary-color');
        root.style.removeProperty('--toolbar-bg-custom');
        root.style.removeProperty('--background-color');
        root.style.removeProperty('--card-bg');
        root.style.removeProperty('--modal-bg-custom');
        
        document.documentElement.classList.remove('custom-colors-applied');
    };

    // Hilfsfunktion zum Aufhellen von Farben
    const lightenColor = (color, percent) => {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (
            0x1000000 +
            (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)
        ).toString(16).slice(1);
    };

    // Hilfsfunktion zum Abdunkeln von Farben
    const darkenColor = (color, percent) => {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return '#' + (
            0x1000000 +
            (R > 0 ? R : 0) * 0x10000 +
            (G > 0 ? G : 0) * 0x100 +
            (B > 0 ? B : 0)
        ).toString(16).slice(1);
    };

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
                if (masterDataLoaded) setMasterData(masterDataLoaded);

                const allStudents = await database.getAll('students');
                setStudents(allStudents);
            } catch (error) {
                console.error('Datenbank-Initialisierungsfehler:', error);
            }
        };
        initDB();
    }, [applySettings]);

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

    const filteredStudents = useCallback(() => filterStudents(students, filters), [students, filters]);

    const saveStudentHandler = async (studentData) => {
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
                if (selectedStudent && selectedStudent.id === studentId) setSelectedStudent(null);
                alert('Kind wurde erfolgreich gelöscht.');
            } else {
                alert('Fehler beim Löschen des Kindes.');
            }
        } catch (error) {
            console.error('Fehler beim Löschen des Schülers:', error);
            alert('Fehler beim Löschen des Kindes: ' + error.message);
        }
    };

    const saveEntryHandler = async (entryData) => {
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

    const saveSettingsHandler = async (newSettings) => {
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

    const saveMasterDataHandler = async (newMasterData) => {
        if (!db) return;
        try {
            await db.put('masterData', { ...newMasterData, id: 1 });
            setMasterData(newMasterData);
        } catch (error) {
            console.error('Fehler beim Speichern der Master-Daten:', error);
        }
    };

    const handleExport = async () => { await exportData(db); };
    const handleImport = async (event) => { await importData(db, event, setSettings, setMasterData, setStudents, setModal, applySettings); };
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
                onStudentSelect={(student) => { setSelectedStudent(student); setViewMode('student'); }}
                onDateSelect={(date) => { setSelectedDate(date); setViewMode('day'); }}
                onFilterChange={setFilters}
                onShowStats={() => setModal('statistics')}
                onShowSettings={() => setModal('settings')}
                onShowHelp={() => setModal('help')}
            />
            <MainContent viewMode={viewMode} selectedStudent={selectedStudent} selectedDate={selectedDate} entries={entries} onEditEntry={() => setModal('entry')} />
            
            {modal === 'student' && <StudentModal student={selectedStudent} masterData={masterData} onSave={saveStudentHandler} onDelete={deleteStudentHandler} onClose={() => setModal(null)} />}
            {modal === 'entry' && <EntryModal entry={viewMode === 'student' && entries.length > 0 ? entries[0] : null} student={selectedStudent} students={students} masterData={masterData} onSave={saveEntryHandler} onClose={() => setModal(null)} />}
            {modal === 'settings' && <SettingsModal settings={settings} masterData={masterData} onSave={saveSettingsHandler} onSaveMasterData={saveMasterDataHandler} onClose={() => setModal(null)} />}
            {modal === 'statistics' && <StatisticsModal students={students} entries={entries} onClose={() => setModal(null)} />}
            {modal === 'help' && <HelpModal onLoadSampleData={handleLoadSampleData} onClearData={handleClearData} onClose={() => setModal(null)} />}
        </div>
    );
};

export default App;
