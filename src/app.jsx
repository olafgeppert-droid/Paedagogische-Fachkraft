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
    filterStudents,
    getStudents
} from './database.js';

// =======================
// Hilfsfunktionen für Farben
// =======================
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

// =======================
// Hauptkomponente App
// =======================
const App = () => {
    const [db, setDb] = useState(null);
    const [students, setStudents] = useState([]);
    const [entries, setEntries] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [viewMode, setViewMode] = useState('student');
    const [filters, setFilters] = useState({ search: '', schoolYear: '', school: '', className: '' });
    const [settings, setSettings] = useState({ theme: 'hell', fontSize: 16, inputFontSize: 16, customColors: {} });
    const [masterData, setMasterData] = useState({ subjects: [], activities: [], notesTemplates: [] });
    const [modal, setModal] = useState(null);
    const [navOpen, setNavOpen] = useState(false);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [editingEntry, setEditingEntry] = useState(null);
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [appState, setAppState] = useState('database');

    // Force Update für iPad/iOS
    const [, forceUpdate] = useState(0);
    const triggerRender = () => forceUpdate(prev => prev + 1);

    // =======================
    // Einstellungen / Farben anwenden
    // =======================
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
        if (settings.theme === 'farbig' && settings.customColors) applyCustomColors(settings.customColors);
        else resetCustomColors();
    }, [applyCustomColors, resetCustomColors]);

    // =======================
    // DB Initialisierung
    // =======================
    useEffect(() => {
        const initDB = async () => {
            try {
                const database = await setupDB();
                setDb(database);

                const settingsData = await database.get('settings', 1);
                if (settingsData) {
                    const themeMapping = { light: 'hell', dark: 'dunkel', colored: 'farbig' };
                    const convertedSettings = { ...settingsData, theme: themeMapping[settingsData.theme] || 'hell' };
                    setSettings(convertedSettings);
                    applySettings(convertedSettings);
                }

                const masterDataLoaded = await database.get('masterData', 1);
                if (masterDataLoaded) setMasterData(masterDataLoaded);

                const allStudents = await database.getAll('students');
                setStudents(allStudents || []);
            } catch (error) {
                console.error('Datenbank-Initialisierungsfehler:', error);
            }
        };
        initDB();
    }, [applySettings]);

    // =======================
    // Einträge laden
    // =======================
    useEffect(() => {
        const loadEntries = async () => {
            if (!db) return;
            try {
                let entriesData = [];
                if (viewMode === 'student' && selectedStudent) entriesData = await getEntriesByStudentId(db, selectedStudent.id);
                else if (viewMode === 'day' && selectedDate) entriesData = await getEntriesByDate(db, selectedDate);
                setEntries(entriesData || []);
            } catch (error) {
                console.error('Fehler beim Laden der Einträge:', error);
            }
        };
        loadEntries();
    }, [db, selectedStudent, selectedDate, viewMode]);
    // =======================
// Filter & Suche
// =======================
const filteredStudents = useCallback(() => filterStudents(students, filters), [students, filters]);

// =======================
// Schüler-Handler
// =======================
const saveStudentHandler = async (studentData) => {
    if (!db) return;
    try {
        await saveStateForUndo(db, history, historyIndex, setHistory, setHistoryIndex);
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
        await saveStateForUndo(db, history, historyIndex, setHistory, setHistoryIndex);
        const success = await deleteStudent(db, studentId);
        if (success) {
            setStudents(students.filter(s => s.id !== studentId));
            if (selectedStudent && selectedStudent.id === studentId) setSelectedStudent(null);
        }
    } catch (error) {
        console.error('Fehler beim Löschen des Schülers:', error);
    }
};

// =======================
// Eintrag-Handler
// =======================
const saveEntryHandler = async (entryData) => {
    if (!db) return;
    try {
        await saveStateForUndo(db, history, historyIndex, setHistory, setHistoryIndex);
        if (entryData.id) {
            await updateEntry(db, entryData);
            setEntries(entries.map(e => e.id === entryData.id ? entryData : e));
        } else {
            const newEntry = await addEntry(db, entryData);
            setEntries([...entries, newEntry]);
        }
        setModal(null);
        setEditingEntry(null);
    } catch (error) {
        console.error('Fehler beim Speichern des Eintrags:', error);
    }
};

// =======================
// Einstellungen & MasterData
// =======================
const saveSettingsHandler = async (newSettings) => {
    if (!db) return;
    try {
        const themeMapping = { hell: 'light', dunkel: 'dark', farbig: 'colored' };
        const settingsToSave = { ...newSettings, theme: themeMapping[newSettings.theme] || 'light' };
        await db.put('settings', { ...settingsToSave, id: 1 });
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

// =======================
// Undo/Redo, Import/Export, Beispieldaten, Löschen
// =======================
const handleExport = async () => { if (db) await exportData(db); };
const handleImport = async (event) => { if (db) await importData(db, event, setSettings, setMasterData, setStudents, setModal); };
const handleUndo = async () => { if (db) await undo(db, history, historyIndex, setHistoryIndex, setStudents); };
const handleRedo = async () => { if (db) await redo(db, history, historyIndex, setHistoryIndex, setStudents); };

const handleLoadSampleData = async () => { 
    if (!db) return;
    await loadSampleData(db, setMasterData, setStudents, setEntries);
    setSelectedStudent(null);
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setViewMode('student');
    setAppState('database');
};

const handleClearData = async () => {
    if (!db) return;
    await clearAllData(db, setStudents, setEntries, setSettings, setMasterData);
    setSelectedStudent(null);
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setViewMode('student');
    setSettings({ theme: 'hell', fontSize: 16, inputFontSize: 16, customColors: {} });
    resetCustomColors();
    setAppState('database');
};

// =======================
// Modale & Protokolle
// =======================
const handleShowNewStudent = () => { setSelectedStudent(null); setModal('student'); };
const handleShowNewProtocol = () => { setEditingEntry(null); setModal('entry'); };
const handleEditProtocol = (entry) => { setEditingEntry(entry); setModal('entry'); };
const findEntryToEdit = () => {
    if (!selectedStudent || !selectedDate || entries.length === 0) return null;
    return entries.find(entry => entry.studentId === selectedStudent.id && entry.date === selectedDate) || null;
};

// =======================
// Suche
// =======================
const handleOpenSearch = () => setSearchModalOpen(true);
const handleCloseSearch = () => setSearchModalOpen(false);

const handleSearch = (criteria) => {
    if (!db) return;
    const filtered = entries.filter(entry => {
        let match = true;
        if (criteria.name) match = match && entry.studentName.toLowerCase().includes(criteria.name.toLowerCase());
        if (criteria.subject) match = match && entry.subject.toLowerCase().includes(criteria.subject.toLowerCase());
        if (criteria.rating) match = match && entry.rating.toLowerCase() === criteria.rating.toLowerCase();
        if (criteria.general) {
            const generalMatch = Object.values(entry).some(val => String(val).toLowerCase().includes(criteria.general.toLowerCase()));
            match = match && generalMatch;
        }
        return match;
    });
    setSearchResults(filtered || []);
    setViewMode('search');
    handleCloseSearch();
};

if (!db) return <div>Datenbank wird initialisiert...</div>;

// =======================
// JSX Return
// =======================
return (
    <div className="app">
        <Header onMenuClick={() => setNavOpen(!navOpen)} />
        <Toolbar
            selectedStudent={selectedStudent}
            selectedDate={selectedDate}
            onAddStudent={handleShowNewStudent}
            onEditStudent={() => setModal('student')}
            onAddEntry={handleShowNewProtocol}
            onSearchProtocol={handleOpenSearch}
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
        <MainContent
            viewMode={viewMode}
            selectedStudent={selectedStudent}
            selectedDate={selectedDate}
            entries={viewMode === 'search' ? searchResults : entries}
            onEditEntry={handleEditProtocol}
        />

        {modal === 'student' && <StudentModal student={selectedStudent} masterData={masterData} onSave={saveStudentHandler} onDelete={deleteStudentHandler} onClose={() => setModal(null)} />}
        {modal === 'entry' && <EntryModal entry={editingEntry} student={selectedStudent} students={students} masterData={masterData} onSave={saveEntryHandler} onClose={() => { setModal(null); setEditingEntry(null); }} />}
        {modal === 'settings' && <SettingsModal settings={settings} masterData={masterData} onSave={saveSettingsHandler} onSaveMasterData={saveMasterDataHandler} onClose={() => setModal(null)} />}
        {modal === 'statistics' && <StatisticsModal students={students} entries={entries} onClose={() => setModal(null)} />}
        {modal === 'help' && <HelpModal onClose={() => setModal(null)} />}

        {searchModalOpen && <SearchModal onClose={handleCloseSearch} onSearch={handleSearch} masterData={masterData} students={students} />}
    </div>
);

};

export default App;
