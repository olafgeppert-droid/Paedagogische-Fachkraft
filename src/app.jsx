// src/app.jsx
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
    const [masterData, setMasterData] = useState({ schoolYears: [], schools: {}, subjects: [], activities: [], notesTemplates: [] });
    const [modal, setModal] = useState(null);
    const [navOpen, setNavOpen] = useState(false);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [editingEntry, setEditingEntry] = useState(null);
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [appState, setAppState] = useState('database');

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
        root.style.setProperty('--background-color', colors.windowBackground || '#fef7ed');
        root.style.setProperty('--card-bg', colors.windowBackground ? lightenColor(colors.windowBackground, 10) : '#ffffff');
        root.style.setProperty('--modal-bg-custom', colors.windowBackground || '#ffffff');
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

                const allStudents = await getStudents(database);
                setStudents(allStudents || []);

                if (allStudents && allStudents.length > 0) {
                    const firstStudent = allStudents[0];
                    setSelectedStudent(firstStudent);
                    const entriesData = await getEntriesByStudentId(database, firstStudent.id);
                    const entriesWithNames = entriesData.map(e => ({
                        ...e,
                        studentName: allStudents.find(s => s.id === e.studentId)?.name || `Schüler ${e.studentId}`
                    }));
                    setEntries(entriesWithNames || []);
                }

            } catch (error) {
                console.error('Datenbank-Initialisierungsfehler:', error);
            }
        };
        initDB();
    }, [applySettings]);

    // =======================
    // Suche Modal Funktionen
    // =======================
    const handleOpenSearch = () => setSearchModalOpen(true);
    const handleCloseSearch = () => setSearchModalOpen(false);

    const handleSearch = async (criteria) => {
        if (!db) return;
        if (!criteria) return;

        let searchTerm = '';
        let searchType = 'all';
        if (typeof criteria === 'string') {
            searchTerm = criteria.trim();
        } else {
            searchTerm = (criteria.value ?? '').toString().trim();
            searchType = (criteria.type ?? 'all').toLowerCase();
        }

        const isExact = /^".*"$/.test(searchTerm);
        if (isExact) searchTerm = searchTerm.slice(1, -1).toLowerCase();
        else searchTerm = searchTerm.toLowerCase();

        try {
            const allEntries = await db.getAll('entries');
            let results = allEntries.filter(e => {
                // KONSISTENTE FELDNAMEN - nur 'topic' und 'bewertung' verwenden
                const topicField = (e.topic || e.activity || '').toString().toLowerCase();
                const ratingField = (e.bewertung || '').toString().toLowerCase().trim();

                switch (searchType) {
                    case 'topic':
                    case 'thema':
                        return isExact ? topicField === searchTerm : topicField.includes(searchTerm);
                    
                    case 'rating':
                    case 'bewertung':
                        // Vereinfachte Suche: nur drei Zustände + leer
                        if (searchTerm === '' || searchTerm === 'leer') {
                            return ratingField === '';
                        }
                        return ratingField === searchTerm;
                    
                    case 'name':
                        const studentForNameSearch = students.find(s => s.id === e.studentId);
                        return studentForNameSearch && studentForNameSearch.name.toLowerCase().includes(searchTerm);
                    
                    case 'all':
                    default:
                        const searchableFields = [
                            e.topic, e.activity, e.bewertung, e.notes, 
                            e.thema // Rückwärtskompatibilität
                        ].filter(field => field != null).map(field => field.toString().toLowerCase());
                        
                        const studentForAllSearch = students.find(s => s.id === e.studentId);
                        if (studentForAllSearch && studentForAllSearch.name.toLowerCase().includes(searchTerm)) {
                            return true;
                        }
                        
                        return searchableFields.some(fieldValue => 
                            isExact ? fieldValue === searchTerm : fieldValue.includes(searchTerm)
                        );
                }
            });

            results = results.map(e => ({
                ...e,
                studentName: students.find(s => s.id === e.studentId)?.name || `Schüler ${e.studentId}`
            }));

            setSearchResults(results);
            setViewMode('search');
            setSearchModalOpen(false);
        } catch (err) {
            console.error('Fehler bei der Suche:', err);
            setSearchResults([]);
            setViewMode('search');
            setSearchModalOpen(false);
        }
    };
        // =======================
    // Einträge laden
    // =======================
    const loadEntries = useCallback(async () => {
        if (!db || !selectedStudent) return;
        try {
            const entriesData = await getEntriesByStudentId(db, selectedStudent.id);
            const entriesWithNames = entriesData.map(e => ({
                ...e,
                studentName: students.find(s => s.id === e.studentId)?.name || `Schüler ${e.studentId}`
            }));
            setEntries(entriesWithNames || []);
        } catch (error) {
            console.error('Fehler beim Laden der Einträge:', error);
        }
    }, [db, selectedStudent, students]);

    useEffect(() => { loadEntries(); }, [loadEntries]);

    // =======================
    // Studentenfunktionen
    // =======================
    const handleAddStudent = async (student) => {
        if (!db) return;
        try {
            const id = await addStudent(db, student);
            const updatedStudents = await getStudents(db);
            setStudents(updatedStudents);
            const newStudent = updatedStudents.find(s => s.id === id);
            setSelectedStudent(newStudent);
        } catch (err) {
            console.error('Fehler beim Hinzufügen eines Studenten:', err);
        }
    };

    const handleUpdateStudent = async (student) => {
        if (!db) return;
        try {
            await updateStudent(db, student);
            const updatedStudents = await getStudents(db);
            setStudents(updatedStudents);
            const updatedStudent = updatedStudents.find(s => s.id === student.id);
            setSelectedStudent(updatedStudent);
        } catch (err) {
            console.error('Fehler beim Aktualisieren eines Studenten:', err);
        }
    };

    const handleDeleteStudent = async (id) => {
        if (!db) return;
        try {
            await deleteStudent(db, id);
            const updatedStudents = await getStudents(db);
            setStudents(updatedStudents);
            if (updatedStudents.length > 0) {
                setSelectedStudent(updatedStudents[0]);
            } else {
                setSelectedStudent(null);
                setEntries([]);
            }
        } catch (err) {
            console.error('Fehler beim Löschen eines Studenten:', err);
        }
    };

    // =======================
    // Eintragsfunktionen
    // =======================
    const handleAddEntry = async (entry) => {
        if (!db || !selectedStudent) return;
        try {
            await addEntry(db, { ...entry, studentId: selectedStudent.id, date: selectedDate });
            await loadEntries();
        } catch (err) {
            console.error('Fehler beim Hinzufügen eines Eintrags:', err);
        }
    };

    const handleUpdateEntry = async (entry) => {
        if (!db) return;
        try {
            await updateEntry(db, entry);
            await loadEntries();
        } catch (err) {
            console.error('Fehler beim Aktualisieren eines Eintrags:', err);
        }
    };

    // =======================
    // Toolbar Aktionen
    // =======================
    const handleExport = async () => {
        if (!db) return;
        try {
            await exportData(db);
        } catch (err) {
            console.error('Fehler beim Export:', err);
        }
    };

    const handleImport = async (file) => {
        if (!db) return;
        try {
            await importData(db, file);
            const updatedStudents = await getStudents(db);
            setStudents(updatedStudents);
            if (updatedStudents.length > 0) {
                setSelectedStudent(updatedStudents[0]);
            }
            await loadEntries();
        } catch (err) {
            console.error('Fehler beim Import:', err);
        }
    };

    const handleUndo = async () => {
        if (!db) return;
        try {
            await undo(db);
            await loadEntries();
        } catch (err) {
            console.error('Fehler bei Rückgängig:', err);
        }
    };

    const handleRedo = async () => {
        if (!db) return;
        try {
            await redo(db);
            await loadEntries();
        } catch (err) {
            console.error('Fehler bei Wiederholen:', err);
        }
    };

    const handleLoadSampleData = async () => {
        if (!db) return;
        try {
            await loadSampleData(db);
            const updatedStudents = await getStudents(db);
            setStudents(updatedStudents);
            if (updatedStudents.length > 0) {
                setSelectedStudent(updatedStudents[0]);
            }
            await loadEntries();
        } catch (err) {
            console.error('Fehler beim Laden der Beispieldaten:', err);
        }
    };

    const handleClearAllData = async () => {
        if (!db) return;
        if (!window.confirm("⚠️ Alle Daten wirklich löschen?")) return;
        try {
            await clearAllData(db);
            setStudents([]);
            setEntries([]);
            setSelectedStudent(null);
        } catch (err) {
            console.error('Fehler beim Löschen aller Daten:', err);
        }
    };

    // =======================
    // Rendering
    // =======================
    return (
        <div className="app-container">
            <Header onMenuClick={() => setNavOpen(!navOpen)} />

            <Toolbar
                onAddStudent={() => setModal('add-student')}
                onAddEntry={() => setModal('add-entry')}
                onSearch={handleOpenSearch}
                onExport={handleExport}
                onImport={handleImport}
                onUndo={handleUndo}
                onRedo={handleRedo}
                onLoadSampleData={handleLoadSampleData}
                onClearAllData={handleClearAllData}
                onSettings={() => setModal('settings')}
                onStatistics={() => setModal('statistics')}
                onHelp={() => setModal('help')}
            />

            <div className="main-layout">
                <Navigation
                    students={students}
                    selectedStudent={selectedStudent}
                    onSelectStudent={setSelectedStudent}
                    open={navOpen}
                    onClose={() => setNavOpen(false)}
                />

                <MainContent
                    viewMode={viewMode}
                    selectedStudent={selectedStudent}
                    selectedDate={selectedDate}
                    entries={entries}
                    searchResults={searchResults}
                    onEditEntry={(entry) => { setEditingEntry(entry); setModal('edit-entry'); }}
                />
            </div>

            {/* Modals */}
            {modal === 'add-student' && (
                <StudentModal
                    onClose={() => setModal(null)}
                    onSave={handleAddStudent}
                    masterData={masterData}
                />
            )}
            {modal === 'add-entry' && selectedStudent && (
                <EntryModal
                    onClose={() => setModal(null)}
                    onSave={handleAddEntry}
                    masterData={masterData}
                    student={selectedStudent}
                    date={selectedDate}
                />
            )}
            {modal === 'edit-entry' && editingEntry && (
                <EntryModal
                    onClose={() => { setEditingEntry(null); setModal(null); }}
                    onSave={handleUpdateEntry}
                    masterData={masterData}
                    student={selectedStudent}
                    date={selectedDate}
                    existingEntry={editingEntry}
                />
            )}
            {modal === 'settings' && (
                <SettingsModal
                    onClose={() => setModal(null)}
                    onSave={(newSettings) => {
                        setSettings(newSettings);
                        applySettings(newSettings);
                        db.put('settings', newSettings, 1);
                        setModal(null);
                    }}
                    settings={settings}
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

            {searchModalOpen && (
                <SearchModal
                    onClose={handleCloseSearch}
                    onSearch={handleSearch}
                />
            )}
        </div>
    );
};

export default App;
