// src/database.js
import { openDB } from 'idb';

// =======================
// Datenbank-Setup
// =======================
export const setupDB = async () => {
    return openDB('PedagogicalDocumentationDB', 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('students')) {
                const store = db.createObjectStore('students', { keyPath: 'id', autoIncrement: true });
                store.createIndex('name', 'name');
                store.createIndex('schoolYear', 'schoolYear');
                store.createIndex('school', 'school');
                store.createIndex('className', 'className');
            }

            if (!db.objectStoreNames.contains('entries')) {
                const store = db.createObjectStore('entries', { keyPath: 'id', autoIncrement: true });
                store.createIndex('studentId', 'studentId');
                store.createIndex('date', 'date');
            }

            if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings', { keyPath: 'id' });
            if (!db.objectStoreNames.contains('masterData')) db.createObjectStore('masterData', { keyPath: 'id' });
            if (!db.objectStoreNames.contains('history')) db.createObjectStore('history', { keyPath: 'id', autoIncrement: true });
        }
    });
};

// =======================
// Schüler-Funktionen
// =======================
export const getEntriesByStudentId = (db, studentId) => db.getAllFromIndex('entries', 'studentId', studentId);
export const getEntriesByDate = (db, date) => db.getAllFromIndex('entries', 'date', date);

export const addStudent = async (db, studentData) => {
    const id = await db.add('students', studentData);
    return { ...studentData, id };
};

export const updateStudent = (db, studentData) => db.put('students', studentData);

export const deleteStudent = async (db, studentId) => {
    try {
        const tx = db.transaction(['students','entries'], 'readwrite');
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
    } catch (err) {
        console.error('Fehler beim Löschen des Schülers:', err);
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
export const updateEntry = (db, entryData) => db.put('entries', entryData);
export const deleteEntry = (db, entryId) => db.delete('entries', entryId);

// =======================
// Einstellungen-Funktionen
// =======================
export const getSettings = (db) => db.get('settings', 1);
export const saveSettings = (db, settings) => db.put('settings', { ...settings, id: 1 });

// =======================
// Master-Daten-Funktionen
// =======================
export const getMasterData = (db) => db.get('masterData', 1);
export const saveMasterData = (db, masterData) => db.put('masterData', { ...masterData, id: 1 });

// =======================
// Filter-Funktion
// =======================
export const filterStudents = (students, criteria = {}) => {
    return students.filter(s => {
        for (const key in criteria) {
            if (criteria[key] && criteria[key] !== '' && String(s[key]) !== String(criteria[key])) return false;
        }
        return true;
    });
};

// =======================
// Undo/Redo-Funktionen
// =======================
export const saveStateForUndo = async (db, history, historyIndex, setHistory, setHistoryIndex) => {
    try {
        const [students, entries, settings, masterData] = await Promise.all([
            db.getAll('students'),
            db.getAll('entries'),
            db.get('settings', 1),
            db.get('masterData', 1)
        ]);
        const currentState = { students, entries, settings, masterData, timestamp: new Date().toISOString() };
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(currentState);
        if (newHistory.length > 50) newHistory.shift();

        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    } catch (err) {
        console.error('Fehler beim Speichern des Zustands für Undo:', err);
    }
};

export const undo = async (db, history, historyIndex, setHistoryIndex, setStudents) => {
    if (historyIndex <= 0 || !db) return;
    try {
        const prevState = history[historyIndex - 1];
        const tx = db.transaction(['students','entries','settings','masterData'], 'readwrite');
        await tx.objectStore('students').clear();
        await tx.objectStore('entries').clear();
        for (const s of prevState.students) await tx.objectStore('students').add(s);
        for (const e of prevState.entries) await tx.objectStore('entries').add(e);
        if (prevState.settings) await tx.objectStore('settings').put(prevState.settings);
        if (prevState.masterData) await tx.objectStore('masterData').put(prevState.masterData);
        await tx.done;

        if (setStudents) setStudents(await db.getAll('students'));
        setHistoryIndex(historyIndex - 1);
    } catch (err) {
        console.error('Fehler beim Undo:', err);
    }
};

export const redo = async (db, history, historyIndex, setHistoryIndex, setStudents) => {
    if (historyIndex >= history.length - 1 || !db) return;
    try {
        const nextState = history[historyIndex + 1];
        const tx = db.transaction(['students','entries','settings','masterData'], 'readwrite');
        await tx.objectStore('students').clear();
        await tx.objectStore('entries').clear();
        for (const s of nextState.students) await tx.objectStore('students').add(s);
        for (const e of nextState.entries) await tx.objectStore('entries').add(e);
        if (nextState.settings) await tx.objectStore('settings').put(nextState.settings);
        if (nextState.masterData) await tx.objectStore('masterData').put(nextState.masterData);
        await tx.done;

        if (setStudents) setStudents(await db.getAll('students'));
        setHistoryIndex(historyIndex + 1);
    } catch (err) {
        console.error('Fehler beim Redo:', err);
    }
};

// =======================
// Export / Import
// =======================
export const exportData = async (db) => {
    try {
        const [students, entries, settings, masterData] = await Promise.all([
            db.getAll('students'),
            db.getAll('entries'),
            db.get('settings', 1),
            db.get('masterData', 1)
        ]);
        const dataStr = JSON.stringify({ students, entries, settings, masterData, exportDate: new Date().toISOString() }, null, 2);
        const link = document.createElement('a');
        link.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        link.download = 'paedagogische-dokumentation-export.json';
        link.click();
    } catch (err) {
        console.error('Fehler beim Exportieren:', err);
        alert('Fehler beim Exportieren: ' + err.message);
    }
};

export const importData = async (db, event, setSettings, setMasterData, setStudents, setModal) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const data = JSON.parse(e.target.result);
            const tx = db.transaction(['students','entries','settings','masterData'], 'readwrite');
            await tx.objectStore('students').clear();
            await tx.objectStore('entries').clear();
            for (const s of data.students) await tx.objectStore('students').add(s);
            for (const e of data.entries) await tx.objectStore('entries').add(e);
            if (data.settings) await tx.objectStore('settings').put(data.settings);
            if (data.masterData) await tx.objectStore('masterData').put(data.masterData);
            await tx.done;

            if (setSettings && data.settings) setSettings(data.settings);
            if (setMasterData && data.masterData) setMasterData(data.masterData);
            if (setStudents) setStudents(await db.getAll('students'));
            if (setModal) setModal(null);
            alert('Daten erfolgreich importiert!');
        } catch (err) {
            console.error('Fehler beim Importieren:', err);
            alert('Fehler beim Importieren: ' + err.message);
        }
    };
    reader.readAsText(file);
};

// =======================
// Beispieldaten
// =======================
export const loadSampleData = async (db, masterDataHandler, setStudents, setEntries) => {
    if (!db) return;
    try {
        const tx = db.transaction(['students','entries','masterData'], 'readwrite');
        await tx.objectStore('students').clear();
        await tx.objectStore('entries').clear();

        const sampleStudents = [
            { name: 'Kevin Mustermann', schoolYear: '2025/2026', school: 'Ostschule, Grundschule Neustadt', className: '1a', gender: 'männlich', nationality: 'Deutschland', germanLevel: 2, notes: 'Sehr aufmerksamer Schüler' },
            { name: 'Anna Beispiel', schoolYear: '2025/2026', school: 'Heinz-Sielmann-Grundschule, Neustadt', className: '2b', gender: 'weiblich', nationality: 'Türkei', germanLevel: 1, notes: 'Braucht Unterstützung in Mathematik' }
        ];

        const addedStudents = [];
        for (const student of sampleStudents) {
            const id = await tx.objectStore('students').add(student);
            addedStudents.push({ ...student, id });
        }

        const sampleEntries = [
            { studentId: addedStudents[0].id, date: '2025-09-01', activity: 'Mathematik: Addieren und Subtrahieren geübt', notes: 'Hat gut mitgemacht' },
            { studentId: addedStudents[1].id, date: '2025-09-01', activity: 'Lesen: Kurze Texte verstehen', notes: 'Brauchte Hilfestellung' }
        ];

        for (const entry of sampleEntries) await tx.objectStore('entries').add(entry);

        const defaultMasterData = {
            subjects: ['Mathematik', 'Deutsch', 'Sachkunde', 'Sport'],
            activities: ['Hausaufgaben', 'Klassenarbeit', 'Projektarbeit'],
            notesTemplates: ['Gut gemacht', 'Weitere Unterstützung nötig', 'Sehr aufmerksam']
        };
        await tx.objectStore('masterData').put({ ...defaultMasterData, id: 1 });
        await tx.done;

        // State-Updates nach Abschluss der Transaktion
        if (setStudents) setStudents(await db.getAll('students'));
        if (setEntries) setEntries(await db.getAll('entries'));
        if (masterDataHandler) masterDataHandler(defaultMasterData);
    } catch (err) {
        console.error('Fehler beim Laden der Beispieldaten:', err);
        alert('Fehler beim Laden der Beispieldaten: ' + err.message);
    }
};

// =======================
// Alle Daten löschen
// =======================
export const clearAllData = async (db, setStudents, setEntries, setSettings, setMasterData) => {
    if (!db) return;
    try {
        const tx = db.transaction(['students','entries','settings','masterData'], 'readwrite');
        await tx.objectStore('students').clear();
        await tx.objectStore('entries').clear();
        await tx.objectStore('settings').clear();
        await tx.objectStore('masterData').clear();
        await tx.done;

        // State-Updates nach Abschluss der Transaktion
        if (setStudents) setStudents([]);
        if (setEntries) setEntries([]);
        if (setSettings) setSettings({ theme: 'hell', fontSize: 16, inputFontSize: 16, customColors: {} });
        if (setMasterData) setMasterData({ subjects: [], activities: [], notesTemplates: [] });
    } catch (err) {
        console.error('Fehler beim Löschen aller Daten:', err);
        alert('Fehler beim Löschen aller Daten: ' + err.message);
    }
};
