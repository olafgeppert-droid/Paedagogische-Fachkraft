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
import SearchModal from './components/SearchModal.jsx';
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

const App = () => {
    const [db, setDb] = useState(null);
    const [students, setStudents] = useState([]);
    const [entries, setEntries] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [viewMode, setViewMode] = useState('student');
    const [filters, setFilters] = useState({ search: '', schoolYear: '', school: '', className: '' });
    const [settings, setSettings] = useState({ theme: 'hell', fontSize: 16, inputFontSize: 16, customColors: {} });
    const [masterData, setMasterData] = useState({ schoolYears: [], schools: {} });
    const [modal, setModal] = useState(null);
    const [navOpen, setNavOpen] = useState(false);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [editingEntry, setEditingEntry] = useState(null);

    // Funktion zum Anwenden benutzerdefinierter Farben
    const applyCustomColors = useCallback((colors) => {
        const root = document.documentElement;
        
        root.style.setProperty('--sidebar-bg', colors.navigation || '#fed7aa');
        root.style.setProperty('--primary-color', colors.header || '#dc2626');
        root.style.setProperty('--secondary-color', colors.header ? darkenColor(colors.header, 20) : '#b91c1c');
        root.style.setProperty('--toolbar-bg-custom', colors.toolbar || '#f8fafc');
        root.style.setProperty('--background-color', colors.protocol || '#fef7ed');
        root.style.setProperty('--card-bg', colors.protocol ? lightenColor(colors.protocol, 10) : '#ffffff');
        root.style.setProperty('--modal-bg-custom', colors.protocol || '#ffffff');
        
        document.documentElement.classList.add('custom-colors-applied');
    }, []);

    // Funktion zum Zurücksetzen der benutzerdefinierten Farben
    const resetCustomColors = useCallback(() => {
        const root = document.documentElement;
        root.style.removeProperty('--sidebar-bg');
        root.style.removeProperty('--primary-color');
        root.style.removeProperty('--secondary-color');
        root.style.removeProperty('--toolbar-bg-custom');
        root.style.removeProperty('--background-color');
        root.style.removeProperty('--card-bg');
        root.style.removeProperty('--modal-bg-custom');
        
        document.documentElement.classList.remove('custom-colors-applied');
    }, []);

    const applySettings = useCallback((settings) => {
        document.documentElement.setAttribute('data-theme', settings.theme);
        document.documentElement.style.setProperty('--font-size', `${settings.fontSize}px`);
        document.documentElement.style.setProperty('--input-font-size', `${settings.inputFontSize}px`);
        
        if (settings.theme === 'farbig' && settings.customColors) {
            applyCustomColors(settings.customColors);
        } else {
            resetCustomColors();
        }
    }, [applyCustomColors, resetCustomColors]);

    useEffect(() => {
        const initDB = async () => {
            try {
                const database = await setupDB();
                setDb(database);

                const settingsData = await database.get('settings', 1);
                if (settingsData) {
                    // Konvertiere alte Theme-Namen zu neuen
                    const themeMapping = {
                        'light': 'hell',
                        'dark': 'dunkel', 
                        'colored': 'farbig'
                    };
                    const convertedSettings = {
                        ...settingsData,
                        theme: themeMapping[settingsData.theme] || 'hell'
                    };
                    setSettings(convertedSettings);
                    applySettings(convertedSettings);
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
        const handleAddStudent = async (student) => {
        try {
            const id = await addStudent(db, student);
            const newStudent = { ...student, id };
            setStudents([...students, newStudent]);
        } catch (error) {
            console.error('Fehler beim Hinzufügen des Schülers:', error);
        }
    };

    const handleUpdateStudent = async (student) => {
        try {
            await updateStudent(db, student);
            setStudents(students.map(s => (s.id === student.id ? student : s)));
        } catch (error) {
            console.error('Fehler beim Aktualisieren des Schülers:', error);
        }
    };

    const handleDeleteStudent = async (id) => {
        try {
            await deleteStudent(db, id);
            setStudents(students.filter(s => s.id !== id));
            if (selectedStudent?.id === id) setSelectedStudent(null);
        } catch (error) {
            console.error('Fehler beim Löschen des Schülers:', error);
        }
    };

    const handleAddEntry = async (entry) => {
        try {
            const id = await addEntry(db, entry);
            const newEntry = { ...entry, id };
            setEntries([...entries, newEntry]);
        } catch (error) {
            console.error('Fehler beim Hinzufügen des Eintrags:', error);
        }
    };

    const handleUpdateEntry = async (entry) => {
        try {
            await updateEntry(db, entry);
            setEntries(entries.map(e => (e.id === entry.id ? entry : e)));
        } catch (error) {
            console.error('Fehler beim Aktualisieren des Eintrags:', error);
        }
    };

    const handleUndo = async () => {
        if (!db) return;
        const state = await undo(db);
        if (state) {
            setStudents(state.students || []);
            setEntries(state.entries || []);
        }
    };

    const handleRedo = async () => {
        if (!db) return;
        const state = await redo(db);
        if (state) {
            setStudents(state.students || []);
            setEntries(state.entries || []);
        }
    };

    const handleExport = async () => {
        if (!db) return;
        const data = await exportData(db);
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = JSON.parse(e.target.result);
                await importData(db, data);
                setStudents(await db.getAll('students'));
                setEntries([]);
            } catch (error) {
                console.error('Fehler beim Importieren:', error);
            }
        };
        reader.readAsText(file);
    };

    const handleSearch = (searchCriteria) => {
        // Hier greifst du später auf DB zu, um nach Kriterien zu suchen
        console.log("Suche gestartet mit:", searchCriteria);
        // Beispiel: entries filtern nach Bewertung, Name usw.
    };

    return (
        <div className="app">
            <Header />
            <Toolbar
                onAddStudent={() => setModal('student')}
                onAddEntry={() => setModal('entry')}
                onSettings={() => setModal('settings')}
                onStatistics={() => setModal('statistics')}
                onHelp={() => setModal('help')}
                onUndo={handleUndo}
                onRedo={handleRedo}
                onExport={handleExport}
                onImport={() => document.getElementById('importFile').click()}
                onSearch={() => setModal('search')}
            />
            <input
                type="file"
                id="importFile"
                accept="application/json"
                style={{ display: 'none' }}
                onChange={handleImport}
            />
            <div className="main-container">
                <Navigation
                    students={filteredStudents()}
                    onSelectStudent={setSelectedStudent}
                    onSelectDate={setSelectedDate}
                    selectedDate={selectedDate}
                    selectedStudent={selectedStudent}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    filters={filters}
                    setFilters={setFilters}
                />
                <MainContent
                    students={students}
                    entries={entries}
                    selectedStudent={selectedStudent}
                    selectedDate={selectedDate}
                    viewMode={viewMode}
                    onEditEntry={(entry) => { setEditingEntry(entry); setModal('entry'); }}
                    filters={filters}
                />
            </div>

            {modal === 'student' && (
                <StudentModal
                    onClose={() => setModal(null)}
                    onSave={handleAddStudent}
                    masterData={masterData}
                />
            )}
            {modal === 'entry' && (
                <EntryModal
                    onClose={() => { setModal(null); setEditingEntry(null); }}
                    onSave={handleAddEntry}
                    editingEntry={editingEntry}
                />
            )}
            {modal === 'settings' && (
                <SettingsModal
                    onClose={() => setModal(null)}
                    settings={settings}
                    setSettings={setSettings}
                    applySettings={applySettings}
                    masterData={masterData}
                    setMasterData={setMasterData}
                    db={db}
                />
            )}
            {modal === 'statistics' && (
                <StatisticsModal
                    onClose={() => setModal(null)}
                    students={students}
                    entries={entries}
                />
            )}
            {modal === 'help' && (
                <HelpModal onClose={() => setModal(null)} />
            )}
            {modal === 'search' && (
                <SearchModal
                    onClose={() => setModal(null)}
                    onSearch={handleSearch}
                />
            )}
        </div>
    );
};

export default App;
