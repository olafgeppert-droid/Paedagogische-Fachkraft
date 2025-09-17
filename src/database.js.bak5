// Datenbank-Setup
const setupDB = async () => {
    return idb.openDB('PedagogicalDocumentationDB', 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('students')) {
                const studentStore = db.createObjectStore('students', { keyPath: 'id', autoIncrement: true });
                studentStore.createIndex('name', 'name', { unique: false });
                studentStore.createIndex('schoolYear', 'schoolYear', { unique: false });
                studentStore.createIndex('school', 'school', { unique: false });
                studentStore.createIndex('className', 'className', { unique: false });
            }

            if (!db.objectStoreNames.contains('entries')) {
                const entryStore = db.createObjectStore('entries', { keyPath: 'id', autoIncrement: true });
                entryStore.createIndex('studentId', 'studentId', { unique: false });
                entryStore.createIndex('date', 'date', { unique: false });
            }

            if (!db.objectStoreNames.contains('settings')) {
                db.createObjectStore('settings', { keyPath: 'id' });
            }

            if (!db.objectStoreNames.contains('masterData')) {
                db.createObjectStore('masterData', { keyPath: 'id' });
            }

            if (!db.objectStoreNames.contains('history')) {
                db.createObjectStore('history', { keyPath: 'id', autoIncrement: true });
            }
        },
    });
};

// Schüler-Funktionen
const getEntriesByStudentId = async (db, studentId) => {
    const index = db.transaction('entries').store.index('studentId');
    return await index.getAll(studentId);
};

const getEntriesByDate = async (db, date) => {
    const index = db.transaction('entries').store.index('date');
    return await index.getAll(date);
};

const addStudent = async (db, studentData) => {
    const id = await db.add('students', studentData);
    return { ...studentData, id };
};

const updateStudent = async (db, studentData) => {
    return await db.put('students', studentData);
};

const deleteStudent = async (db, studentId) => {
    try {
        // Zuerst alle Einträge des Schülers löschen
        const tx = db.transaction('entries', 'readwrite');
        const entryStore = tx.objectStore('entries');
        const index = entryStore.index('studentId');
        
        let cursor = await index.openCursor(IDBKeyRange.only(studentId));
        while (cursor) {
            await entryStore.delete(cursor.primaryKey);
            cursor = await cursor.continue();
        }
        
        // Dann den Schüler löschen
        await db.delete('students', studentId);
        return true;
    } catch (error) {
        console.error('Fehler beim Löschen des Schülers:', error);
        return false;
    }
};

// Eintrag-Funktionen
const addEntry = async (db, entryData) => {
    const id = await db.add('entries', entryData);
    return { ...entryData, id };
};

const updateEntry = async (db, entryData) => {
    return await db.put('entries', entryData);
};

const deleteEntry = async (db, entryId) => {
    return await db.delete('entries', entryId);
};

// Einstellungen-Funktionen
const getSettings = async (db) => {
    return await db.get('settings', 1);
};

const saveSettings = async (db, settings) => {
    return await db.put('settings', { ...settings, id: 1 });
};

// Master-Daten-Funktionen
const getMasterData = async (db) => {
    return await db.get('masterData', 1);
};

const saveMasterData = async (db, masterData) => {
    return await db.put('masterData', { ...masterData, id: 1 });
};

// History-Funktionen
const saveStateForUndo = async (db, history, setHistory, setHistoryIndex) => {
    try {
        const allStudents = await db.getAll('students');
        const allEntries = await db.getAll('entries');
        
        const currentState = {
            students: allStudents,
            entries: allEntries,
            timestamp: new Date().toISOString()
        };
        
        // Nur die letzten 50 Zustände behalten
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(currentState);
        if (newHistory.length > 50) {
            newHistory.shift();
        }
        
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    } catch (error) {
        console.error('Fehler beim Speichern des Zustands für Undo:', error);
    }
};

// Daten-Export-Funktion
const exportData = async (db) => {
    try {
        const allStudents = await db.getAll('students');
        const allEntries = await db.getAll('entries');
        const settingsData = await db.get('settings', 1);
        const masterData = await db.get('masterData', 1);
        
        const exportData = {
            students: allStudents,
            entries: allEntries,
            settings: settingsData,
            masterData: masterData,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'paedagogische-dokumentation-export.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    } catch (error) {
        console.error('Fehler beim Exportieren der Daten:', error);
        alert('Fehler beim Exportieren der Daten: ' + error.message);
    }
};

// Daten-Import-Funktion
const importData = async (db, event, setSettings, setMasterData, setStudents, setModal) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const importData = JSON.parse(e.target.result);
            
            // Alte Daten löschen
            await db.clear('students');
            await db.clear('entries');
            
            // Neue Daten importieren
            for (const student of importData.students) {
                await db.add('students', student);
            }
            
            for (const entry of importData.entries) {
                await db.add('entries', entry);
            }
            
            if (importData.settings) {
                await db.put('settings', importData.settings);
                setSettings(importData.settings);
            }
            
            if (importData.masterData) {
                await db.put('masterData', importData.masterData);
                setMasterData(importData.masterData);
            }
            
            // Daten neu laden
            const allStudents = await db.getAll('students');
            setStudents(allStudents);
            
            setModal(null);
            alert('Daten erfolgreich importiert!');
        } catch (error) {
            console.error('Fehler beim Importieren der Daten:', error);
            alert('Fehler beim Importieren der Daten: ' + error.message);
        }
    };
    
    reader.readAsText(file);
};

// Undo-Funktion
const undo = async (db, history, historyIndex, setHistoryIndex, setStudents) => {
    if (historyIndex <= 0 || !db) return;
    
    try {
        const previousState = history[historyIndex - 1];
        
        // Alte Daten löschen
        await db.clear('students');
        await db.clear('entries');
        
        // Vorherigen Zustand wiederherstellen
        for (const student of previousState.students) {
            await db.add('students', student);
        }
        
        for (const entry of previousState.entries) {
            await db.add('entries', entry);
        }
        
        // Daten neu laden
        const allStudents = await db.getAll('students');
        setStudents(allStudents);
        
        setHistoryIndex(historyIndex - 1);
    } catch (error) {
        console.error('Fehler beim Undo:', error);
    }
};

// Redo-Funktion
const redo = async (db, history, historyIndex, setHistoryIndex, setStudents) => {
    if (historyIndex >= history.length - 1 || !db) return;
    
    try {
        const nextState = history[historyIndex + 1];
        
        // Alte Daten löschen
        await db.clear('students');
        await db.clear('entries');
        
        // Nächsten Zustand wiederherstellen
        for (const student of nextState.students) {
            await db.add('students', student);
        }
        
        for (const entry of nextState.entries) {
            await db.add('entries', entry);
        }
        
        // Daten neu laden
        const allStudents = await db.getAll('students');
        setStudents(allStudents);
        
        setHistoryIndex(historyIndex + 1);
    } catch (error) {
        console.error('Fehler beim Redo:', error);
    }
};

// Beispieldaten laden
const loadSampleData = async (db, setMasterData, setStudents) => {
    if (!db) return;
    
    try {
        // Alte Daten löschen
        await db.clear('students');
        await db.clear('entries');
        
        // Beispieldaten
        const sampleStudents = [
            {
                name: 'Max Mustermann',
                schoolYear: '2023/2024',
                school: 'Grundschule Musterstadt',
                className: '3a',
                gender: 'männlich',
                nationality: 'deutsch',
                germanLevel: 2,
                notes: 'Sehr aufmerksamer Schüler'
            },
            {
                name: 'Anna Beispiel',
                schoolYear: '2023/2024',
                school: 'Grundschule Musterstadt',
                className: '3b',
                gender: 'weiblich',
                nationality: 'deutsch',
                germanLevel: 1,
                notes: 'Braucht Unterstützung in Mathematik'
            }
        ];
        
        const sampleEntries = [
            {
                studentId: 1,
                date: new Date().toISOString().split('T')[0],
                subject: 'Mathematik',
                observations: 'Max hat heute sehr gut mitgearbeitet und alle Aufgaben gelöst.',
                measures: 'Positive Verstärkung durch Lob',
                erfolg: 'Max war stolz auf seine Leistung und motiviert für weitere Aufgaben.',
                erfolgRating: 'positiv'
            },
            {
                studentId: 2,
                date: new Date().toISOString().split('T')[0],
                subject: 'Deutsch',
                observations: 'Anna hatte Schwierigkeiten mit der Rechtschreibung.',
                measures: 'Individuelle Förderung angeboten',
                erfolg: 'Anna hat die Hilfe angenommen und Fortschritte gezeigt.',
                erfolgRating: 'positiv'
            }
        ];
        
        // Beispieldaten hinzufügen
        for (const student of sampleStudents) {
            await db.add('students', student);
        }
        
        for (const entry of sampleEntries) {
            await db.add('entries', entry);
        }
        
        // Beispieldaten für Master-Daten
        const sampleMasterData = {
            schoolYears: ['2022/2023', '2023/2024', '2024/2025'],
            schools: {
                'Grundschule Musterstadt': ['1a', '1b', '2a', '2b', '3a', '3b', '4a', '4b'],
                'Mittelschule Beispieldorf': ['5a', '5b', '6a', '6b', '7a', '7b', '8a', '8b', '9a', '9b']
            }
        };
        
        await db.put('masterData', { ...sampleMasterData, id: 1 });
        setMasterData(sampleMasterData);
        
        // Daten neu laden
        const allStudents = await db.getAll('students');
        setStudents(allStudents);
        
        alert('Beispieldaten erfolgreich geladen!');
    } catch (error) {
        console.error('Fehler beim Laden der Beispieldaten:', error);
    }
};

// Alle Daten löschen
const clearAllData = async (db, setStudents, setEntries, setSelectedStudent) => {
    if (!db) return;
    
    if (!confirm('Sind Sie sicher, dass Sie alle Daten löschen möchten? Dieser Vorgang kann nicht rückgängig gemacht werden.')) {
        return;
    }
    
    try {
        await db.clear('students');
        await db.clear('entries');
        
        setStudents([]);
        setEntries([]);
        setSelectedStudent(null);
        
        alert('Alle Daten wurden gelöscht!');
    } catch (error) {
        console.error('Fehler beim Löschen der Daten:', error);
    }
};
