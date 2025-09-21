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
import SearchModal from './components/SearchModal.jsx';   // ✅ NEU

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

    const saveStudentHandler = async (studentData) => { /* unverändert */ };
    const deleteStudentHandler = async (studentId) => { /* unverändert */ };
    const saveEntryHandler = async (entryData) => { /* unverändert */ };
    const saveSettingsHandler = async (newSettings) => { /* unverändert */ };
    const saveMasterDataHandler = async (newMasterData) => { /* unverändert */ };
    const handleExport = async () => { if (db) await exportData(db); };
    const handleImport = async (event) => { if (db) await importData(db, event, setSettings, setMasterData, setStudents, setModal); };
    const handleUndo = async () => { if (db) await undo(db, history, historyIndex, setHistoryIndex, setStudents); };
    const handleRedo = async () => { if (db) await redo(db, history, historyIndex, setHistoryIndex, setStudents); };
    const handleLoadSampleData = async () => { if (db) await loadSampleData(db, setMasterData, setStudents, setEntries); };
    const handleClearData = async () => { if (db) await clearAllData(db, setStudents, setEntries, setSelectedStudent); };

    const handleShowNewStudent = () => { setSelectedStudent(null); setModal('student'); };
    const handleShowNewProtocol = () => { setEditingEntry(null); setModal('entry'); };
    const handleEditProtocol = (entry) => { setEditingEntry(entry); setModal('entry'); };

    const findEntryToEdit = () => { /* unverändert */ };

    if (!db) return <div>Datenbank wird initialisiert...</div>;

    return (
        <div className="app">
            <Header onMenuClick={() => setNavOpen(!navOpen)} />
            <Toolbar
                selectedStudent={selectedStudent}
                selectedDate={selectedDate}
                onAddStudent={handleShowNewStudent}
                onEditStudent={() => setModal('student')}
                onAddEntry={handleShowNewProtocol}
                onSearchProtocol={() => setModal('search')}   {/* ✅ NEU statt onEditEntry */}
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
                entries={entries} 
                onEditEntry={handleEditProtocol}
            />
            
            {modal === 'student' && (
                <StudentModal 
                    student={selectedStudent} 
                    masterData={masterData} 
                    onSave={saveStudentHandler} 
                    onDelete={deleteStudentHandler} 
                    onClose={() => setModal(null)} 
                />
            )}
            {modal === 'entry' && (
                <EntryModal 
                    entry={editingEntry}
                    student={selectedStudent} 
                    students={students} 
                    masterData={masterData} 
                    onSave={saveEntryHandler} 
                    onClose={() => { setModal(null); setEditingEntry(null); }} 
                />
            )}
            {modal === 'settings' && (
                <SettingsModal 
                    settings={settings} 
                    masterData={masterData} 
                    onSave={saveSettingsHandler} 
                    onSaveMasterData={saveMasterDataHandler} 
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
                <HelpModal onClose={() => setModal(null)} />
            )}
            {modal === 'search' && (
                <SearchModal 
                    entries={entries}
                    students={students}
                    onClose={() => setModal(null)} 
                />
            )}
        </div>
    );
};

export default App;
