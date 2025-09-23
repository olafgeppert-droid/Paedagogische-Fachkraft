import React, { useState, useEffect } from 'react';
import SettingsModal from './components/SettingsModal';
import { setupDB, getAllStudents, getAllEntries } from './database';
import StudentList from './components/StudentList';
import EntryList from './components/EntryList';
import Header from './components/Header';

function App() {
    const [settings, setSettings] = useState({
        theme: 'hell',
        fontSize: 16,
        inputFontSize: 16
    });

    const [masterData, setMasterData] = useState({
        schoolYears: [],
        schools: {},
        subjects: [],
        activities: [],
        notesTemplates: []
    });

    const [students, setStudents] = useState([]);
    const [entries, setEntries] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showSettings, setShowSettings] = useState(false);

    // =======================
    // Initial DB Load
    // =======================
    useEffect(() => {
        async function fetchData() {
            try {
                const db = await setupDB();
                const allStudents = await getAllStudents(db);
                const allEntries = await getAllEntries(db);
                setStudents(allStudents);
                setEntries(allEntries);
            } catch (error) {
                console.error('Fehler beim Laden der Datenbank:', error);
            }
        }
        fetchData();
    }, []);

    // =======================
    // Event Handlers
    // =======================
    const handleSaveSettings = (newSettings) => {
        setSettings(newSettings);
    };

    const handleSaveMasterData = (newMasterData) => {
        setMasterData(newMasterData);
    };

    const handleSelectStudent = (student) => {
        setSelectedStudent(student);
    };

    // =======================
    // Theme Handling
    // =======================
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', settings.theme || 'hell');
        document.documentElement.style.setProperty('--font-size', `${settings.fontSize}px`);
        document.documentElement.style.setProperty('--input-font-size', `${settings.inputFontSize}px`);

        if (settings.theme === 'farbig' && settings.customColors) {
            const colors = settings.customColors;
            document.documentElement.style.setProperty('--color-navigation', colors.navigation);
            document.documentElement.style.setProperty('--color-toolbar', colors.toolbar);
            document.documentElement.style.setProperty('--color-header', colors.header);
            document.documentElement.style.setProperty('--color-window-bg', colors.windowBackground);
        } else {
            // Reset custom colors if theme is not 'farbig'
            document.documentElement.style.removeProperty('--color-navigation');
            document.documentElement.style.removeProperty('--color-toolbar');
            document.documentElement.style.removeProperty('--color-header');
            document.documentElement.style.removeProperty('--color-window-bg');
        }
    }, [settings]);
    // =======================
    // Render
    // =======================
    return (
        <div className="app-container">
            <Header
                onOpenSettings={() => setShowSettings(true)}
                selectedStudent={selectedStudent}
            />

            <main className="main-content">
                <StudentList
                    students={students}
                    selectedStudent={selectedStudent}
                    onSelectStudent={handleSelectStudent}
                    fontSize={settings.fontSize}
                />

                {selectedStudent && (
                    <EntryList
                        entries={entries.filter(e => e.studentId === selectedStudent.id)}
                        fontSize={settings.inputFontSize}
                    />
                )}
            </main>

            {showSettings && (
                <SettingsModal
                    settings={settings}
                    masterData={masterData}
                    onSave={handleSaveSettings}
                    onSaveMasterData={handleSaveMasterData}
                    onClose={() => setShowSettings(false)}
                    setStudents={setStudents}
                    setEntries={setEntries}
                    setSelectedStudent={setSelectedStudent}
                    setSettings={setSettings}
                />
            )}
        </div>
    );
}

export default App;
