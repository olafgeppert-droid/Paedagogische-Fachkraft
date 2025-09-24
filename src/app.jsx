// src/App.jsx
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
    addStudent,
    updateStudent,
    deleteStudent,
    addEntry,
    updateEntry,
    importData,
    undo,
    redo,
    loadSampleData,
    clearAllData,
    getStudents
} from './database.js';

// =======================
// Farb-Hilfsfunktionen
// =======================
const lightenColor = (color, percent) => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
};

const darkenColor = (color, percent) => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = ((num >> 8) & 0x00FF) - amt;
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
    const [settings, setSettings] = useState({ theme: 'hell', fontSize: 16, inputFontSize: 16, customColors: {} });
    const [masterData, setMasterData] = useState({ schoolYears: [], schools: {}, subjects: [], activities: [], notesTemplates: [] });
    const [modal, setModal] = useState(null);
    const [editingEntry, setEditingEntry] = useState(null);
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [studentFilterTerm, setStudentFilterTerm] = useState('');

    const [, forceUpdate] = useState(0);
    const triggerRender = () => forceUpdate(prev => prev + 1);

    // =======================
    // Farb- und Theme-Einstellungen
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
                console.error('DB-Initialisierung fehlgeschlagen:', error);
            }
        };
        initDB();
    }, [applySettings]);

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
    // Studenten-Funktionen
    // =======================
    const handleAddStudent = async (student) => {
        if (!db) return;
        try {
            const id = await addStudent(db, student);
            const updatedStudents = await getStudents(db);
            setStudents(updatedStudents);
            const newStudent = updatedStudents.find(s => s.id === id);
            setSelectedStudent(newStudent);
            setModal(null);
        } catch (err) { console.error(err); }
    };

    const handleUpdateStudent = async (student) => {
        if (!db) return;
        try {
            await updateStudent(db, student);
            const updatedStudents = await getStudents(db);
            setStudents(updatedStudents);
            const updatedStudent = updatedStudents.find(s => s.id === student.id);
            setSelectedStudent(updatedStudent);
            setModal(null);
        } catch (err) { console.error(err); }
    };

    const handleDeleteStudent = async (id) => {
        if (!db) return;
        try {
            await deleteStudent(db, id);
            const updatedStudents = await getStudents(db);
            setStudents(updatedStudents);
            setSelectedStudent(updatedStudents.length > 0 ? updatedStudents[0] : null);
            if (updatedStudents.length === 0) setEntries([]);
            setModal(null);
        } catch (err) { console.error(err); }
    };

    // =======================
    // Eintrags-Funktionen
    // =======================
    const handleAddEntry = async (entry) => {
        if (!db || !selectedStudent) return;
        try {
            await addEntry(db, { ...entry, studentId: selectedStudent.id, date: selectedDate });
            await loadEntries();
            setModal(null);
        } catch (err) { console.error(err); }
    };

    const handleUpdateEntry = async (entry) => {
        if (!db) return;
        try {
            await updateEntry(db, entry);
            await loadEntries();
            setModal(null);
        } catch (err) { console.error(err); }
    };

    // =======================
    // Toolbar Aktionen
    // =======================
    const handlePrint = () => { window.print(); };
    const handleExport = async () => {
        if (!db) return;
        // Implementiere Export wie in alter Version
    };
    const handleImport = async (data) => {
        if (!db) return;
        await importData(db, data);
        const updatedStudents = await getStudents(db);
        setStudents(updatedStudents);
        setSelectedStudent(updatedStudents.length > 0 ? updatedStudents[0] : null);
        await loadEntries();
    };
    const handleUndoRedo = async (action) => {
        if (!db) return;
        if (action === 'undo') await undo(db);
        if (action === 'redo') await redo(db);
        await loadEntries();
        triggerRender();
    };
    const handleClearAllData = async () => {
        if (!db) return;
        if (window.confirm('Möchten Sie wirklich alle Daten löschen?')) {
            await clearAllData(db);
            setStudents([]);
            setEntries([]);
            setSelectedStudent(null);
        }
    };
    const handleLoadSampleData = async () => {
        if (!db) return;
        await loadSampleData(db);
        const updatedStudents = await getStudents(db);
        setStudents(updatedStudents);
        setSelectedStudent(updatedStudents[0]);
        await loadEntries();
    };

    // =======================
    // Suche
    // =======================
    const handleOpenSearch = () => setSearchModalOpen(true);
    const handleCloseSearch = () => { setSearchModalOpen(false); setSearchResults([]); };

    // =======================
    // Navigation
    // =======================
    const handleStudentClick = (student) => {
        setSelectedStudent(student);
        setViewMode('student');
        setSearchResults([]);
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(studentFilterTerm.toLowerCase())
    );

    // =======================
    // Render
    // =======================
    return (
        <div className="app-container">
            <Header />

            <Toolbar
                selectedStudent={selectedStudent}
                students={students}
                onAddStudent={() => setModal('add-student')}
                onEditStudent={() => selectedStudent && setModal('edit-student')}
                onAddEntry={() => selectedStudent && setModal('add-entry')}
                onPrint={handlePrint}
                onExport={handleExport}
                onImport={handleImport}
                onUndo={() => handleUndoRedo('undo')}
                onRedo={() => handleUndoRedo('redo')}
                canUndo={true}
                canRedo={true}
                onSearchProtocol={handleOpenSearch}
            />

            <div className="content-area">
                <Navigation
                    students={filteredStudents}
                    selectedStudent={selectedStudent}
                    setSelectedStudent={handleStudentClick}
                    filterTerm={studentFilterTerm}
                    setFilterTerm={setStudentFilterTerm}
                />
                <MainContent
                    entries={entries}
                    selectedStudent={selectedStudent}
                    selectedDate={selectedDate}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    onEditEntry={(entry) => { setEditingEntry(entry); setModal('edit-entry'); }}
                />
            </div>

            {modal === 'add-student' && (
                <StudentModal onClose={() => setModal(null)} onSave={handleAddStudent} />
            )}
            {modal === 'edit-student' && selectedStudent && (
                <StudentModal
                    student={selectedStudent}
                    onClose={() => setModal(null)}
                    onSave={handleUpdateStudent}
                    onDelete={handleDeleteStudent}
                />
            )}
            {modal === 'add-entry' && selectedStudent && (
                <EntryModal
                    student={selectedStudent}
                    onClose={() => setModal(null)}
                    onSave={handleAddEntry}
                    masterData={masterData}
                />
            )}
            {modal === 'edit-entry' && editingEntry && (
                <EntryModal
                    student={selectedStudent}
                    entry={editingEntry}
                    onClose={() => setModal(null)}
                    onSave={handleUpdateEntry}
                    masterData={masterData}
                />
            )}
            {modal === 'settings' && (
                <SettingsModal
                    settings={settings}
                    setSettings={setSettings}
                    onClose={() => setModal(null)}
                    applySettings={applySettings}
                    masterData={masterData}
                    setMasterData={setMasterData}
                />
            )}
            {modal === 'statistics' && (
                <StatisticsModal
                    entries={entries}
                    students={students}
                    onClose={() => setModal(null)}
                />
            )}
            {modal === 'help' && <HelpModal onClose={() => setModal(null)} />}
            {searchModalOpen && (
                <SearchModal
                    onClose={handleCloseSearch}
                    onSearch={(term) => { console.log('Search term:', term); }}
                />
            )}
        </div>
    );
};

export default App;
