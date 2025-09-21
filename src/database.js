// src/database.js
// IDB über das npm-paket importieren (stabiler als window.idb/CDN)
import { openDB } from 'idb';

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

// =======================
// Schüler-Funktionen
// =======================
export const getEntriesByStudentId = async (db, studentId) => {
    return db.getAllFromIndex('entries', 'studentId', studentId);
};

export const getEntriesByDate = async (db, date) => {
    return db.getAllFromIndex('entries', 'date', date);
};

export const addStudent = async (db, studentData) => {
    const id = await db.add('students', studentData);
    return { ...studentData, id };
};

export const updateStudent = async (db, studentData) => {
    return db.put('students', studentData);
};

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

export const updateEntry = async (db, entryData) => {
    return db.put('entries', entryData);
};

export const deleteEntry = async (db, entryId) => {
    return db.delete('entries', entryId);
};

// =======================
// Einstellungen-Funktionen
// =======================
export const getSettings = async (db) => {
    return db.get('settings', 1);
};

export const saveSettings = async (db, settings) => {
    return db.put('settings', { ...settings, id: 1 });
};

// =======================
// Master-Daten-Funktionen
// =======================
export const getMasterData = async (db) => {
    return db.get('masterData', 1);
};

export const saveMasterData = async (db, masterData) => {
    return db.put('masterData', { ...masterData, id: 1 });
};

// =======================
// Undo/Redo-Funktionen
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

export const undo = async (db, history, historyIndex, setHistoryIndex, setStudents) => {
    if (historyIndex <= 0 || !db) return;
    try {
        const prevState = history[historyIndex - 1];
        const tx = db.transaction(['students','entries','settings','masterData'], 'readwrite');
        await tx.objectStore('students').clear();
        await tx.objectStore('entries').clear();
        for (const student of prevState.students) await tx.objectStore('students').add(student);
        for (const entry of prevState.entries) await tx.objectStore('entries').add(entry);
        if (prevState.settings) await tx.objectStore('settings').put(prevState.settings);
        if (prevState.masterData) await tx.objectStore('masterData').put(prevState.masterData);
        await tx.done;

        const allStudents = await db.getAll('students');
        setStudents(allStudents);
        setHistoryIndex(historyIndex - 1);
    } catch (error) {
        console.error('Fehler beim Undo:', error);
    }
};

export const redo = async (db, history, historyIndex, setHistoryIndex, setStudents) => {
    if (historyIndex >= history.length - 1 || !db) return;
    try {
        const nextState = history[historyIndex + 1];
        const tx = db.transaction(['students','entries','settings','masterData'], 'readwrite');
        await tx.objectStore('students').clear();
        await tx.objectStore('entries').clear();
        for (const student of nextState.students) await tx.objectStore('students').add(student);
        for (const entry of nextState.entries) await tx.objectStore('entries').add(entry);
        if (nextState.settings) await tx.objectStore('settings').put(nextState.settings);
        if (nextState.masterData) await tx.objectStore('masterData').put(nextState.masterData);
        await tx.done;

        const allStudents = await db.getAll('students');
        setStudents(allStudents);
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

            for (const student of data.students) await tx.objectStore('students').add(student);
            for (const entry of data.entries) await tx.objectStore('entries').add(entry);
            if (data.settings) await tx.objectStore('settings').put(data.settings);
            if (data.masterData) await tx.objectStore('masterData').put(data.masterData);
            await tx.done;

            if (data.settings) setSettings(data.settings);
            if (data.masterData) setMasterData(data.masterData);
            const allStudents = await db.getAll('students');
            setStudents(allStudents);
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

        const sampleStudents = [
            { name: 'Max Mustermann', schoolYear: '2025/2026', school: 'Ostschule, Grundschule Neustadt an der Weinstraße', className: '1a', gender: 'männlich', nationality: 'Deutschland', germanLevel: 2, notes: 'Sehr aufmerksamer Schüler' },
            { name: 'Anna Beispiel', schoolYear: '2025/2026', school: 'Heinz-Sielmann-Grundschule, Neustadt an der Weinstraße', className: '2b', gender: 'weiblich', nationality: 'Türkei', germanLevel: 1, notes: 'Braucht Unterstützung in Mathematik' }
        ];

        const addedStudents = [];
        for (const student of sampleStudents) {
            const id = await db.add('students', student);
            addedStudents.push({ ...student, id });
        }

        const sampleEntries = [
            { studentId: addedStudents[0].id, date: new Date().toISOString().split('T')[0], subject: 'Mathematik', observations: 'Max hat heute sehr gut mitgearbeitet und alle Aufgaben gelöst.', measures: 'Positive Verstärkung durch Lob', erfolg: 'Max war stolz auf seine Leistung und motiviert für weitere Aufgaben.', erfolgRating: 'positiv' },
            { studentId: addedStudents[1].id, date: new Date().toISOString().split('T')[0], subject: 'Deutsch', observations: 'Anna hatte Schwierigkeiten mit der Rechtschreibung.', measures: 'Individuelle Förderung angeboten', erfolg: 'Anna hat die Hilfe angenommen und Fortschritte gezeigt.', erfolgRating: 'positiv' }
        ];

        for (const entry of sampleEntries) await db.add('entries', entry);

        const sampleMasterData = {
            schoolYears: ['2025/2026','2026/2027','2027/2028'],
            schools: {
                'Ostschule, Grundschule Neustadt an der Weinstraße': ['1a','1b','1c','1d','1e','2a','2b','2c','2d','2e','3a','3b','3c','3d','3e','4a','4b','4c','4d','4e'],
                'Heinz-Sielmann-Grundschule, Neustadt an der Weinstraße': ['1a','1b','2a','2b','3a','3b','4a','4b']
            }
        };
        await db.put('masterData', { ...sampleMasterData, id: 1 });

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

// =======================
// Alle Daten löschen
// =======================
export const clearAllData = async (db, setStudents, setEntries, setSelectedStudent) => {
    if (!db) return;
    if (!confirm('Sind Sie sicher, dass Sie alle Daten löschen möchten? Dieser Vorgang kann nicht rückgängig gemacht werden.')) return;

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

// =======================
// Filter-Funktion für Navigation
// =======================
export const filterStudents = (students, filters) => {
    return students.filter(s => {
        return (!filters.search || s.name.toLowerCase().includes(filters.search.toLowerCase())) &&
               (!filters.schoolYear || s.schoolYear === filters.schoolYear) &&
               (!filters.school || s.school === filters.school) &&
               (!filters.className || s.className === filters.className);
    });
};
