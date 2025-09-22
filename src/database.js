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

            if (!db.objectStoreNames.contains('protocols')) {
                const store = db.createObjectStore('protocols', { keyPath: 'id', autoIncrement: true });
                store.createIndex('entryId', 'entryId');
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
        const tx = db.transaction(['students','entries','protocols'], 'readwrite');
        const entryStore = tx.objectStore('entries');
        const index = entryStore.index('studentId');
        let cursor = await index.openCursor(IDBKeyRange.only(studentId));
        while (cursor) {
            const entryId = cursor.value.id;
            // Protokolle löschen
            const protocolStore = tx.objectStore('protocols');
            const protocolIndex = protocolStore.index('entryId');
            let pCursor = await protocolIndex.openCursor(IDBKeyRange.only(entryId));
            while (pCursor) {
                await pCursor.delete();
                pCursor = await pCursor.continue();
            }
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
// Protokoll-Funktionen
// =======================
export const addProtocol = async (db, protocolData) => {
    const id = await db.add('protocols', protocolData);
    return { ...protocolData, id };
};
export const updateProtocol = (db, protocolData) => db.put('protocols', protocolData);
export const deleteProtocol = (db, protocolId) => db.delete('protocols', protocolId);
export const getProtocolsByEntryId = (db, entryId) => db.getAllFromIndex('protocols', 'entryId', entryId);

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
// Undo/Redo-Funktionen inkl. Protokolle
// =======================
export const undo = async (db, history, historyIndex, setHistoryIndex, setStudents, setEntries, setProtocols, setSettings, setMasterData) => {
    if (historyIndex <= 0 || !db) return;
    try {
        const prevState = history[historyIndex - 1];
        const tx = db.transaction(['students','entries','protocols','settings','masterData'], 'readwrite');
        
        // Alte Daten löschen
        await tx.objectStore('students').clear();
        await tx.objectStore('entries').clear();
        await tx.objectStore('protocols').clear();
        
        // Alte Daten wiederherstellen
        for (const s of prevState.students) await tx.objectStore('students').put(s);
        for (const e of prevState.entries) await tx.objectStore('entries').put(e);
        for (const p of prevState.protocols) await tx.objectStore('protocols').put(p);
        
        if (prevState.settings) await tx.objectStore('settings').put(prevState.settings);
        if (prevState.masterData) await tx.objectStore('masterData').put(prevState.masterData);
        await tx.done;

        if (setStudents) setStudents(await db.getAll('students'));
        if (setEntries) setEntries(await db.getAll('entries'));
        if (setProtocols) setProtocols(await db.getAll('protocols'));
        if (setSettings) setSettings(prevState.settings || {});
        if (setMasterData) setMasterData(prevState.masterData || {});
        setHistoryIndex(historyIndex - 1);
    } catch (err) {
        console.error('Fehler beim Undo:', err);
    }
};

export const redo = async (db, history, historyIndex, setHistoryIndex, setStudents, setEntries, setProtocols, setSettings, setMasterData) => {
    if (historyIndex >= history.length - 1 || !db) return;
    try {
        const nextState = history[historyIndex + 1];
        const tx = db.transaction(['students','entries','protocols','settings','masterData'], 'readwrite');
        
        // Alte Daten löschen
        await tx.objectStore('students').clear();
        await tx.objectStore('entries').clear();
        await tx.objectStore('protocols').clear();
        
        // Daten wiederherstellen
        for (const s of nextState.students) await tx.objectStore('students').put(s);
        for (const e of nextState.entries) await tx.objectStore('entries').put(e);
        for (const p of nextState.protocols) await tx.objectStore('protocols').put(p);

        if (nextState.settings) await tx.objectStore('settings').put(nextState.settings);
        if (nextState.masterData) await tx.objectStore('masterData').put(nextState.masterData);
        await tx.done;

        if (setStudents) setStudents(await db.getAll('students'));
        if (setEntries) setEntries(await db.getAll('entries'));
        if (setProtocols) setProtocols(await db.getAll('protocols'));
        if (setSettings) setSettings(nextState.settings || {});
        if (setMasterData) setMasterData(nextState.masterData || {});
        setHistoryIndex(historyIndex + 1);
    } catch (err) {
        console.error('Fehler beim Redo:', err);
    }
};

export const saveStateForUndo = async (db, history, historyIndex, setHistory, setHistoryIndex) => {
    try {
        const [students, entries, protocols, settings, masterData] = await Promise.all([
            db.getAll('students'),
            db.getAll('entries'),
            db.getAll('protocols'),
            db.get('settings', 1),
            db.get('masterData', 1)
        ]);
        const currentState = { students, entries, protocols, settings, masterData, timestamp: new Date().toISOString() };
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(currentState);
        if (newHistory.length > 50) newHistory.shift();

        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    } catch (err) {
        console.error('Fehler beim Speichern des Zustands für Undo:', err);
    }
};

// =======================
// Beispieldaten
// =======================
export const loadSampleData = async (db, masterDataHandler, setStudents, setEntries) => {
    if (!db) return;
    try {
        const tx = db.transaction(['students','entries','protocols','masterData'], 'readwrite');
        await tx.objectStore('students').clear();
        await tx.objectStore('entries').clear();
        await tx.objectStore('protocols').clear();

        // --- Schüler ---
        const sampleStudents = [
            { id: 1, name: 'Kevin Mustermann', schoolYear: '2025/2026', school: 'Ostschule, Grundschule Neustadt', className: '1a', gender: 'männlich', nationality: 'Deutschland', germanLevel: 2, notes: 'Sehr aufmerksamer Schüler' },
            { id: 2, name: 'Anna Beispiel', schoolYear: '2025/2026', school: 'Heinz-Sielmann-Grundschule, Neustadt', className: '2b', gender: 'weiblich', nationality: 'Türkei', germanLevel: 1, notes: 'Braucht Unterstützung in Mathematik' }
        ];
        for (const student of sampleStudents) await tx.objectStore('students').put(student);

        // --- Einträge ---
        const sampleEntries = [
            { id: 1, studentId: 1, date: '2025-09-01', activity: 'Mathematik: Addieren und Subtrahieren geübt', notes: 'Hat gut mitgemacht' },
            { id: 2, studentId: 2, date: '2025-09-01', activity: 'Lesen: Kurze Texte verstehen', notes: 'Brauchte Hilfestellung' }
        ];
        for (const entry of sampleEntries) await tx.objectStore('entries').put(entry);

        // --- Protokolle ---
        const sampleProtocols = [
            { id: 1, entryId: 1, thema: 'Addition', beobachtung: 'Schüler kann Additionen bis 10 lösen', maßnahme: 'Einzeln üben', erfolg: 'Verbessert', bewertung: 'Gut' },
            { id: 2, entryId: 1, thema: 'Subtraktion', beobachtung: 'Schüler hat Schwierigkeiten bei Subtraktion', maßnahme: 'Weitere Übungen', erfolg: 'Teilweise', bewertung: 'Befriedigend' },
            { id: 3, entryId: 2, thema: 'Lesefähigkeit', beobachtung: 'Braucht Unterstützung beim Textverständnis', maßnahme: 'Partnerarbeit', erfolg: 'Verbessert', bewertung: 'Gut' }
        ];
        for (const protocol of sampleProtocols) await tx.objectStore('protocols').put(protocol);

        // --- Master-Daten ---
        const defaultMasterData = {
            subjects: ['Mathematik', 'Deutsch', 'Sachkunde', 'Sport'],
            activities: ['Hausaufgaben', 'Klassenarbeit', 'Projektarbeit', 'Freiarbeit'],
            notesTemplates: ['Gut gemacht', 'Weitere Unterstützung nötig', 'Sehr aufmerksam', 'Sehr sozial']
        };
        await tx.objectStore('masterData').put({ ...defaultMasterData, id: 1 });

        await tx.done;

        // State-Updates
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
        const tx = db.transaction(['students','entries','protocols','settings','masterData'], 'readwrite');
        await tx.objectStore('students').clear();
        await tx.objectStore('entries').clear();
        await tx.objectStore('protocols').clear();
        await tx.objectStore('settings').clear();
        await tx.objectStore('masterData').clear();
        await tx.done;

        if (setStudents) setStudents([]);
        if (setEntries) setEntries([]);
        if (setSettings) setSettings({ theme: 'hell', fontSize: 16, inputFontSize: 16, customColors: {} });
        if (setMasterData) setMasterData({ subjects: [], activities: [], notesTemplates: [] });
    } catch (err) {
        console.error('Fehler beim Löschen aller Daten:', err);
        alert('Fehler beim Löschen aller Daten: ' + err.message);
    }
};
