import { openDB } from 'https://unpkg.com/idb@7/build/umd.js';

// =======================
// Datenbank-Setup
// =======================
export const setupDB = async () => {
    return openDB('PedagogicalDocumentationDB', 1, {
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

            if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings', { keyPath: 'id' });
            if (!db.objectStoreNames.contains('masterData')) db.createObjectStore('masterData', { keyPath: 'id' });
            if (!db.objectStoreNames.contains('history')) db.createObjectStore('history', { keyPath: 'id', autoIncrement: true });
        },
    });
};

// =======================
// Schüler-Funktionen
// =======================
export const getEntriesByStudentId = async (db, studentId) =>
    db.getAllFromIndex('entries', 'studentId', studentId);

export const getEntriesByDate = async (db, date) =>
    db.getAllFromIndex('entries', 'date', date);

export const addStudent = async (db, studentData) => {
    const id = await db.add('students', studentData);
    return { ...studentData, id };
};

export const updateStudent = async (db, studentData) => db.put('students', studentData);

export const deleteStudent = async (db, studentId) => {
    try {
        const tx = db.transaction(['students', 'entries'], 'readwrite');
        const entryStore = tx.objectStore('entries');
        const index = entryStore.index('studentId');
        let cursor = await index.openCursor(IDBKeyRange.only(studentId));
        while (cursor) {
            await cursor.delete();
            cursor = await cursor.continue();
        }
        await tx.objectStore('students').delete(studentId);
        await tx.done;
        return true;
    } catch (error) {
        console.error('Fehler beim Löschen des Schülers:', error);
        return false;
    }
};

// =======================
// Eintrag-Funktionen
// =======================
export const addEntry = async (db, entryData) => {
    const id = await db.add('entries', entryData);
    return { ...entryData, id };
};

export const updateEntry = async (db, entryData) => db.put('entries', entryData);
export const deleteEntry = async (db, entryId) => db.delete('entries', entryId);

// =======================
// Einstellungen / MasterData
// =======================
export const getSettings = async (db) => db.get('settings', 1);
export const saveSettings = async (db, settings) => db.put('settings', { ...settings, id: 1 });
export const getMasterData = async (db) => db.get('masterData', 1);
export const saveMasterData = async (db, masterData) => db.put('masterData', { ...masterData, id: 1 });

// =======================
// Undo / Redo
// =======================
export const saveStateForUndo = async (db, history, historyIndex, setHistory, setHistoryIndex) => {
    try {
        const [allStudents, allEntries, settings, masterData] = await Promise.all([
            db.getAll('students'),
            db.getAll('entries'),
            db.get('settings', 1),
            db.get('masterData', 1)
        ]);
        const currentState = { students: allStudents, entries: allEntries, settings, masterData, timestamp: new Date().toISOString() };
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(currentState);
        if (newHistory.length > 50) newHistory.shift();
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    } catch (error) {
        console.error('Fehler beim Speichern des Zustands für Undo:', error);
    }
};

const restoreState = async (db, state, setStudents, setEntries, setSettings, setMasterData) => {
    const tx = db.transaction(['students','entries','settings','masterData'], 'readwrite');
    await tx.objectStore('students').clear();
    await tx.objectStore('entries').clear();
    for (const student of state.students) await tx.objectStore('students').add(student);
    for (const entry of state.entries) await tx.objectStore('entries').add(entry);
    if (state.settings) await tx.objectStore('settings').put(state.settings);
    if (state.masterData) await tx.objectStore('masterData').put(state.masterData);
    await tx.done;

    setStudents(state.students);
    setEntries(state.entries);
    if (state.settings) setSettings(state.settings);
    if (state.masterData) setMasterData(state.masterData);
};

export const undo = async (db, history, historyIndex, setHistoryIndex, setStudents, setEntries, setSettings, setMasterData) => {
    if (historyIndex <= 0 || !db) return;
    try {
        const prevState = history[historyIndex - 1];
        await restoreState(db, prevState, setStudents, setEntries, setSettings, setMasterData);
        setHistoryIndex(historyIndex - 1);
    } catch (error) {
        console.error('Fehler beim Undo:', error);
    }
};

export const redo = async (db, history, historyIndex, setHistoryIndex, setStudents, setEntries, setSettings, setMasterData) => {
    if (historyIndex >= history.length - 1 || !db) return;
    try {
        const nextState = history[historyIndex + 1];
        await restoreState(db, nextState, setStudents, setEntries, setSettings, setMasterData);
        setHistoryIndex(historyIndex + 1);
    } catch (error) {
        console.error('Fehler beim Redo:', error);
    }
};

// =======================
// Export / Import
// =======================
export const exportData = async (db) => {
    try {
        const [allStudents, allEntries, settings, masterData] = await Promise.all([
            db.getAll('students'),
            db.getAll('entries'),
            db.get('settings', 1),
            db.get('masterData', 1)
        ]);
        const dataStr = JSON.stringify({ students: allStudents, entries: allEntries, settings, masterData, exportDate: new Date().toISOString() }, null, 2);
        const link = document.createElement('a');
        link.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        link.download = 'paedagogische-dokumentation-export.json';
        link.click();
    } catch (error) {
        console.error('Fehler beim Exportieren:', error);
        alert('Fehler beim Exportieren: ' + error.message);
    }
};

export const importData = async (db, event, setSettings, setMasterData, setStudents, setEntries, setModal) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const data = JSON.parse(e.target.result);
            const tx = db.transaction(['students','entries','settings','masterData'], 'readwrite');
            await tx.objectStore('students').clear();
            await tx.objectStore('entries').clear();
            for (const student of data.students || []) await tx.objectStore('students').add(student);
            for (const entry of data.entries || []) await tx.objectStore('entries').add(entry);
            if (data.settings) await tx.objectStore('settings').put(data.settings);
            if (data.masterData) await tx.objectStore('masterData').put(data.masterData);
            await tx.done;

            setStudents(data.students || []);
            setEntries(data.entries || []);
            if (data.settings) setSettings(data.settings);
            if (data.masterData) setMasterData(data.masterData);
            setModal(null);
            alert('Daten erfolgreich importiert!');
        } catch (error) {
            console.error('Fehler beim Importieren:', error);
            alert('Fehler beim Importieren: ' + error.message);
        }
    };
    reader.readAsText(file);
};

// =======================
// Beispieldaten
// =======================
export const loadSampleData = async (db, setMasterData, setStudents, setEntries) => {
    if (!db) return;
    try {
        await db.clear('students');
        await db.clear('entries');

        // Beispiel-Schüler
        const sampleStudents = [
            { name: 'Max Mustermann', schoolYear: '2023/2024', school: 'Grundschule Musterstadt', className: '3a', gender: 'männlich', nationality: 'deutsch', germanLevel: 2, notes: 'Sehr aufmerksamer Schüler' },
            { name: 'Anna Beispiel', schoolYear: '2023/2024', school: 'Grundschule Musterstadt', className: '3b', gender: 'weiblich', nationality: 'deutsch', germanLevel: 1, notes: 'Braucht Unterstützung in Mathematik' }
        ];

        const addedStudents = [];
        for (const student of sampleStudents) {
            const id = await db.add('students', student);
            addedStudents.push({ ...student, id });
        }

        // Beispiel-Einträge
        const sampleEntries = [
            { studentId: addedStudents[0].id, date: new Date().toISOString().split('T')[0], subject: 'Mathematik', observations: 'Max hat heute sehr gut mitgearbeitet und alle Aufgaben gelöst.', measures: 'Positive Verstärkung durch Lob', erfolg: 'Max war stolz auf seine Leistung und motiviert für weitere Aufgaben.', erfolgRating: 'positiv' },
            { studentId: addedStudents[1].id, date: new Date().toISOString().split('T')[0], subject: 'Deutsch', observations: 'Anna hatte Schwierigkeiten mit der Rechtschreibung.', measures: 'Individuelle Förderung angeboten', erfolg: 'Anna hat die Hilfe angenommen und Fortschritte gezeigt.', erfolgRating: 'positiv' }
        ];

        for (const entry of sampleEntries) await db.add('entries', entry);

        // Beispiel-MasterData
        const sampleMasterData = {
            schoolYears: ['2022/2023','2023/2024','2024/2025'],
            schools: {
                'Grundschule Musterstadt': ['1a','1b','2a','2b','3a','3b','4a','4b'],
                'Mittelschule Beispieldorf': ['5a','5b','6a','6b','7a','7b','8a','8b','9a','9b']
            }
        };
        await db.put('masterData', { ...sampleMasterData, id: 1 });

        // States aktualisieren
        setMasterData(sampleMasterData);
        const allStudents = await db.getAll('students');
        setStudents(allStudents);
        const allEntries = await db.getAll('entries');
        setEntries(allEntries);

        alert('Beispieldaten erfolgreich geladen!');
    } catch (error) {
        console.error('Fehler beim Laden der Beispieldaten:', error);
    }
};
