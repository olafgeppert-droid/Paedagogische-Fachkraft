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
    return await db.delete('students', studentId);
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
                await db.put('
