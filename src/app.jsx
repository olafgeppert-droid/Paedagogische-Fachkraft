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
    exportData,
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
    const [navOpen, setNavOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    // Filter-States (für Navigation -> live Filterung der Schülerliste)
    const [filters, setFilters] = useState({ search: '', schoolYear: '', school: '', className: '' });

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
                console.log('DB initialized:', database);

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
    const loadEntries = useCallback(async (studentId) => {
        if (!db || !studentId) return;
        try {
            const entriesData = await getEntriesByStudentId(db, studentId);
            const entriesWithNames = entriesData.map(e => ({
                ...e,
                studentName: students.find(s => s.id === e.studentId)?.name || `Schüler ${e.studentId}`
            }));
            setEntries(entriesWithNames || []);
        } catch (error) {
            console.error('Fehler beim Laden der Einträge:', error);
        }
    }, [db, students]);

    useEffect(() => {
        if (selectedStudent) loadEntries(selectedStudent.id);
        else setEntries([]);
    }, [selectedStudent, loadEntries]);

    // =======================
    // Studenten-Funktionen
    // =======================
    const handleAddStudent = async (student) => {
        if (!db) return;
        try {
            // addStudent(db, student) gibt das erstellte Objekt zurück (mit id)
            const created = await addStudent(db, student);
            const updatedStudents = await getStudents(db);
            setStudents(updatedStudents || []);
            // selectedStudent auf das neu erstellte setzen
            const newStudent = updatedStudents.find(s => s.id === created.id) || created;
            setSelectedStudent(newStudent);
            setModal(null);
        } catch (err) { console.error('Fehler beim Hinzufügen des Schülers:', err); }
    };

    const handleUpdateStudent = async (student) => {
        if (!db) return;
        try {
            await updateStudent(db, student);
            const updatedStudents = await getStudents(db);
            setStudents(updatedStudents || []);
            const updatedStudent = updatedStudents.find(s => s.id === student.id) || student;
            setSelectedStudent(updatedStudent);
            setModal(null);
        } catch (err) { console.error('Fehler beim Aktualisieren des Schülers:', err); }
    };

    const handleDeleteStudent = async (id) => {
        if (!db) return;
        try {
            await deleteStudent(db, id);
            const updatedStudents = await getStudents(db);
            setStudents(updatedStudents || []);
            setSelectedStudent(updatedStudents.length > 0 ? updatedStudents[0] : null);
            if (updatedStudents.length === 0) setEntries([]);
            setModal(null);
        } catch (err) { console.error('Fehler beim Löschen des Schülers:', err); }
    };

    // =======================
    // Eintrags-Funktionen
    // =======================
    const handleAddEntry = async (entry) => {
        if (!db || !selectedStudent) return;
        try {
            const created = await addEntry(db, { ...entry, studentId: selectedStudent.id, date: selectedDate });
            await loadEntries(selectedStudent.id);
            setModal(null);
            return created;
        } catch (err) { console.error('Fehler beim Hinzufügen des Eintrags:', err); }
    };

    const handleUpdateEntry = async (entry) => {
        if (!db) return;
        try {
            await updateEntry(db, entry);
            if (entry.studentId) await loadEntries(entry.studentId);
            setModal(null);
        } catch (err) { console.error('Fehler beim Aktualisieren des Eintrags:', err); }
    };

    // =======================
    // Toolbar-Aktionen
    // =======================
    const handleExport = async () => {
        if (!db) return;
        try {
            // Daten zusammenstellen
            const [studentsData, entriesData, settingsData, masterDataData] = await Promise.all([
                db.getAll('students'),
                db.getAll('entries'),
                db.get('settings', 1),
                db.get('masterData', 1)
            ]);
            const exportObj = { students: studentsData || [], entries: entriesData || [], settings: settingsData || {}, masterData: masterDataData || {}, exportDate: new Date().toISOString() };
            const dataStr = JSON.stringify(exportObj, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const file = new File([blob], 'paedagogische-dokumentation-export.json', { type: 'application/json' });

            // iOS / Web Share API: falls möglich Files teilen
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        title: 'Exportierte Daten',
                        text: 'Exportierte pädagogische Dokumentation',
                        files: [file]
                    });
                    return;
                } catch (err) {
                    // falls share fehlschlägt, fallback zum Herunterladen
                    console.warn('Share API Fehler, fallback auf Download:', err);
                }
            }

            // Fallback: Download-Link erzeugen
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Fehler beim Exportieren:', err);
            alert('Fehler beim Exportieren: ' + (err.message || err));
        }
    };

    const handleImport = async () => {
        if (!db) return;
        try {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.json,application/json';
            fileInput.onchange = async (event) => {
                try {
                    // importData erwartet das Event (reader nutzt event.target.files[0])
                    await importData(db, event, setSettings, setMasterData, setStudents, setModal);
                    const updatedStudents = await getStudents(db);
                    setStudents(updatedStudents || []);
                    setSelectedStudent(updatedStudents.length > 0 ? updatedStudents[0] : null);
                    if (updatedStudents.length > 0) await loadEntries(updatedStudents[0].id);
                } catch (err) {
                    console.error('Import fehlgeschlagen:', err);
                    alert('Import fehlgeschlagen: ' + (err.message || err));
                }
            };
            fileInput.click();
        } catch (err) {
            console.error('Fehler beim Importieren:', err);
            alert('Fehler beim Importieren: ' + (err.message || err));
        }
    };

    const handleUndo = async () => { /* falls implementiert */ };
    const handleRedo = async () => { /* falls implementiert */ };

    const handleLoadSampleData = async () => {
        if (!db) return;
        try {
            await loadSampleData(db, setMasterData, setStudents, setEntries);
        } catch (err) {
            console.error('Fehler beim Laden der Beispieldaten:', err);
        }
    };

    const handleClearAllData = async () => {
        if (!db) return;
        if (window.confirm('Sind Sie sicher, dass Sie alle Daten löschen möchten?')) {
            try {
                await clearAllData(db, setStudents, setEntries, setSettings, setMasterData);
                setSelectedStudent(null);
                setSelectedDate(new Date().toISOString().split('T')[0]);
            } catch (err) {
                console.error('Fehler beim Löschen aller Daten:', err);
            }
        }
    };

    const handlePrint = () => {
        window.print();
    };

    // =======================
    // Such-Handler (für SearchModal)
    // =======================
    const handleSearch = async (criteria) => {
        if (!db) return;
        let searchTerm = '';
        let searchType = 'all';
        if (typeof criteria === 'string') searchTerm = criteria.trim();
        else { searchTerm = (criteria.value ?? '').toString().trim(); searchType = (criteria.type ?? 'all').toLowerCase(); }

        // ================= (Fortsetzung Suche) =================
        const isExact = /^".*"$/.test(searchTerm);
        if (isExact) searchTerm = searchTerm.slice(1, -1).toLowerCase();
        else searchTerm = searchTerm.toLowerCase();

        try {
            const allEntries = await db.getAll('entries');
            let results = allEntries.filter(e => {
                const topicField = (e.topic || e.activity || '').toString().toLowerCase();
                const ratingField = (e.bewertung || e.erfolgRating || '').toString().toLowerCase().trim();
                const notesField = (e.notes || e.observations || '').toString().toLowerCase();
                const studentObj = students.find(s => s.id === e.studentId);

                switch (searchType) {
                    case 'topic':
                    case 'thema':
                        return isExact ? topicField === searchTerm : topicField.includes(searchTerm);
                    case 'rating':
                    case 'bewertung':
                        // akzeptiere 'leer' als leer
                        if (searchTerm === '' || searchTerm === 'leer') return ratingField === '';
                        return ratingField === searchTerm;
                    case 'name':
                        return studentObj && studentObj.name.toLowerCase().includes(searchTerm);
                    case 'all':
                    default:
                        // suche in mehreren Feldern
                        const searchableFields = [topicField, ratingField, notesField].filter(Boolean);
                        if (studentObj && studentObj.name.toLowerCase().includes(searchTerm)) return true;
                        return searchableFields.some(f => isExact ? f === searchTerm : f.includes(searchTerm));
                }
            });

            results = results.map(e => ({ ...e, studentName: students.find(s => s.id === e.studentId)?.name || `Schüler ${e.studentId}` }));
            setSearchResults(results);
            setViewMode('search');
            setSearchModalOpen(false);
        } catch (err) {
            console.error('Fehler bei Suche:', err);
            setSearchResults([]);
            setViewMode('search');
            setSearchModalOpen(false);
        }
    };

    // =======================
    // Filter / Navigation Integration
    // =======================
    // gefilterte Schülerliste (live, basierend auf filters)
    const filteredStudents = React.useMemo(() => {
        if (!students || students.length === 0) return [];
        const q = (filters.search || '').toString().toLowerCase().trim();
        return students.filter(s => {
            if (filters.schoolYear && String(s.schoolYear) !== String(filters.schoolYear)) return false;
            if (filters.school && String(s.school) !== String(filters.school)) return false;
            if (filters.className && String(s.className) !== String(filters.className)) return false;
            if (!q) return true;
            const name = (s.name || '').toString().toLowerCase();
            return name.includes(q);
        });
    }, [students, filters]);

    // =======================
    // Navigation-Handler
    // =======================
    const handleStudentClick = (student) => {
        setSelectedStudent(student);
        // Auswahl genügt — kein automatisches Öffnen des Bearbeiten-Dialogs
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const handleEditStudent = () => {
        if (selectedStudent) setModal('student');
    };

    const handleOpenSearch = () => {
        setSearchModalOpen(true);
    };

    // =======================
    // Render
    // =======================
    return (
        <div className="app">
            <Header settings={settings} />

            <Toolbar
                selectedStudent={selectedStudent}
                selectedDate={selectedDate}
                onExport={handleExport}
                onImport={handleImport}
                onUndo={handleUndo}
                onRedo={handleRedo}
                onLoadSampleData={handleLoadSampleData}
                onClearAllData={handleClearAllData}
                onSearchProtocol={handleOpenSearch}
                onAddStudent={() => {
                    setSelectedStudent(null);
                    setModal('student');
                }}
                onAddEntry={() => {
                    setEditingEntry(null);
                    setModal('entry');
                }}
                onPrint={handlePrint}
                onEditStudent={handleEditStudent}
            />

            <Navigation
                isOpen={navOpen}
                setNavOpen={setNavOpen}
                students={filteredStudents}
                selectedStudent={selectedStudent}
                selectedDate={selectedDate}
                filters={filters}
                masterData={masterData}
                onStudentSelect={handleStudentClick}
                onDateSelect={handleDateSelect}
                onFilterChange={handleFilterChange}
                onShowStats={() => setModal('statistics')}
                onShowSettings={() => setModal('settings')}
                onShowHelp={() => setModal('help')}
            />

            <MainContent
                viewMode={viewMode}
                selectedStudent={selectedStudent}
                selectedDate={selectedDate}
                entries={viewMode === 'search' ? searchResults : entries}
                onEditEntry={(entry) => {
                    setEditingEntry(entry);
                    setModal('entry');
                }}
            />

            {modal === 'student' && (
                <StudentModal
                    student={selectedStudent}
                    masterData={masterData}
                    onClose={() => setModal(null)}
                    // wenn selectedStudent null => Neuen Schüler anlegen, ansonsten Update
                    onSave={selectedStudent ? handleUpdateStudent : handleAddStudent}
                    onDelete={handleDeleteStudent}
                />
            )}

            {modal === 'entry' && (
                <EntryModal
                    existingEntry={editingEntry}
                    student={selectedStudent}
                    date={selectedDate}
                    masterData={masterData}
                    onClose={() => {
                        setModal(null);
                        setEditingEntry(null);
                    }}
                    onSave={async (entry) => {
                        if (editingEntry) await handleUpdateEntry(entry);
                        else await handleAddEntry(entry);
                        setEditingEntry(null);
                        setModal(null);
                    }}
                />
            )}

            {modal === 'settings' && (
                <SettingsModal
                    settings={settings}
                    masterData={masterData}
                    onClose={() => setModal(null)}
                    onSave={(newSettings) => {
                        setSettings(newSettings);
                        applySettings(newSettings);
                    }}
                    onSaveMasterData={(md) => {
                        setMasterData(md);
                    }}
                    setStudents={setStudents}
                    setEntries={setEntries}
                    setSelectedStudent={setSelectedStudent}
                    setSettings={setSettings}
                />
            )}

            {modal === 'statistics' && (
                <StatisticsModal
                    onClose={() => setModal(null)}
                    students={students}
                    entries={entries}
                />
            )}

            {modal === 'help' && <HelpModal onClose={() => setModal(null)} />}

            {searchModalOpen && (
                <SearchModal
                    onClose={() => setSearchModalOpen(false)}
                    onSearch={handleSearch}
                />
            )}
        </div>
    );
};

export default App;
      
