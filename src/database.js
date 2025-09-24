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
export const addStudent = async (db, studentData) => {
    const id = await db.add('students', studentData);
    return { ...studentData, id };
};

export const updateStudent = async (db, studentData) => {
    await db.put('students', studentData);
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
    } catch (err) {
        console.error('Fehler beim Löschen des Schülers:', err);
        return false;
    }
};

// =======================
// Studenten abrufen
// =======================
export const getStudents = async (db) => {
    if (!db) return [];
    try {
        return await db.getAll('students');
    } catch (err) {
        console.error('Fehler beim Abrufen der Schüler:', err);
        return [];
    }
};

// =======================
// Einträge-Funktionen
// =======================
export const getEntriesByStudentId = async (db, studentId) => {
    if (!db) return [];
    try {
        return await db.getAllFromIndex('entries', 'studentId', studentId);
    } catch (err) {
        console.error('Fehler beim Abrufen der Einträge nach Schüler:', err);
        return [];
    }
};

export const getEntriesByDate = async (db, date) => {
    if (!db) return [];
    try {
        return await db.getAllFromIndex('entries', 'date', date);
    } catch (err) {
        console.error('Fehler beim Abrufen der Einträge nach Datum:', err);
        return [];
    }
};

export const addEntry = async (db, entryData) => {
    const id = await db.add('entries', entryData);
    return { ...entryData, id };
};

export const updateEntry = async (db, entryData) => {
    await db.put('entries', entryData);
};
// =======================
// database.js – Teil 2
// =======================

export const deleteEntry = async (db, entryId) => {
    await db.delete('entries', entryId);
};

// =======================
// Einstellungen-Funktionen
// =======================
export const getSettings = async (db) => db.get('settings', 1);
export const saveSettings = async (db, settings) => db.put('settings', { ...settings, id: 1 });

// =======================
// Master-Daten-Funktionen
// =======================
export const getMasterData = async (db) => db.get('masterData', 1);
export const saveMasterData = async (db, masterData) => db.put('masterData', { ...masterData, id: 1 });

// =======================
// Filter-Funktion (eigentlich nicht in database.js, sondern in utils/helpers.js oder App.jsx)
// Beibehalten, falls es noch irgendwo aufgerufen wird.
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
// Undo/Redo-Funktionen (Stubs, falls nicht vollständig implementiert)
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
        // Begrenze History auf z.B. 50 Einträge
        if (newHistory.length > 50) newHistory.shift(); 

        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    } catch (err) {
        console.error('Fehler beim Speichern des Zustands für Undo:', err);
    }
};

export const undo = async (db, history, historyIndex, setHistoryIndex, setStudents) => {
    if (historyIndex <= 0 || !db || !history || history.length === 0) return;
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

        if (setStudents) setStudents(await db.getAll('students')); // Aktualisiere den Zustand in React
        setHistoryIndex(historyIndex - 1);
        alert('Letzte Aktion rückgängig gemacht.');
    } catch (err) {
        console.error('Fehler beim Undo:', err);
        alert('Fehler beim Rückgängigmachen.');
    }
};

export const redo = async (db, history, historyIndex, setHistoryIndex, setStudents) => {
    if (historyIndex >= history.length - 1 || !db || !history || history.length === 0) return;
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

        if (setStudents) setStudents(await db.getAll('students')); // Aktualisiere den Zustand in React
        setHistoryIndex(historyIndex + 1);
        alert('Letzte Aktion wiederhergestellt.');
    } catch (err) {
        console.error('Fehler beim Redo:', err);
        alert('Fehler beim Wiederherstellen.');
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
            // Optional: Alte Feldnamen bei Import migrieren
            const processedEntries = data.entries.map(entry => ({
                ...entry,
                // Neue Felder bevorzugen, alte als Fallback
                subject: entry.subject || entry.topic || entry.activity || '',
                observations: entry.observations || entry.notes || '',
                measures: entry.measures || entry.activity || '',
                erfolg: entry.erfolg || '',
                erfolgRating: entry.erfolgRating || entry.bewertung || '',
            }));

            for (const s of data.students) await tx.objectStore('students').add(s);
            for (const e of processedEntries) await tx.objectStore('entries').add(e); // Verwende die verarbeiteten Einträge
            if (data.settings) await tx.objectStore('settings').put(data.settings);
            if (data.masterData) await tx.objectStore('masterData').put(data.masterData);
            await tx.done;

            if (setSettings && data.settings) setSettings(data.settings);
            if (setMasterData && data.masterData) setMasterData(data.masterData);
            if (setStudents) setStudents(await db.getAll('students')); // Trigger Neuladen der Schülerliste
            if (setModal) setModal(null); // Modal schließen
            alert('Daten erfolgreich importiert!');
        } catch (err) {
            console.error('Fehler beim Importieren:', err);
            alert('Fehler beim Importieren: ' + err.message);
        }
    };
    reader.readAsText(file);
};

// =======================
// Beispieldaten & Clear-Funktion
// =======================
export const loadSampleData = async (db, masterDataHandler, setStudents, setEntries) => {
    if (!db) return;
    try {
        const tx = db.transaction(['students','entries','masterData'], 'readwrite');
        await tx.objectStore('students').clear();
        await tx.objectStore('entries').clear();

        const sampleStudents = [
            { id: 1, name: 'Kevin Mustermann', schoolYear: '2025/2026', school: 'Ostschule', className: '1a', gender: 'männlich', nationality: 'Deutschland', germanLevel: '2', notes: 'Sehr aufmerksamer Schüler' },
            { id: 2, name: 'Anna Beispiel', schoolYear: '2025/2026', school: 'Heinz-Sielmann-Grundschule', className: '2b', gender: 'weiblich', nationality: 'Türkei', germanLevel: '1', notes: 'Braucht Unterstützung in Mathematik' },
            { id: 3, name: 'Lukas Schmidt', schoolYear: '2025/2026', school: 'Ostschule', className: '1b', gender: 'männlich', nationality: 'Ukraine', germanLevel: '3', notes: 'Sehr sozial und hilfsbereit' }
        ];
        for (const student of sampleStudents) await tx.objectStore('students').put(student);

        const sampleEntries = [
            { id: 1, studentId: 1, date: '2025-09-01', subject: 'Mathematik', observations: 'Hat gut mitgemacht beim Addieren, konnte auch komplexere Aufgaben lösen.', measures: 'Weiterführende Aufgaben zur Multiplikation gegeben.', erfolg: 'Schnelles Verständnis und korrekte Lösungen, sehr motiviert.', erfolgRating: 'positiv' },
            { id: 2, studentId: 2, date: '2025-09-01', subject: 'Deutsch', observations: 'Schwierigkeiten beim sinnerfassenden Lesen von längeren Texten. Konzentration lässt schnell nach.', measures: 'Extra-Lesetraining mit kurzen, einfachen Texten und Visualisierungen angeboten.', erfolg: 'Leichte Verbesserung beim Verständnis, braucht noch individuelle Unterstützung.', erfolgRating: 'negativ' },
            { id: 3, studentId: 3, date: '2025-09-02', subject: 'Sachkunde', observations: 'Sehr interessiert am Thema Pflanzenwachstum, hat viele Fragen gestellt.', measures: 'Zusätzliche Materialien (Bücher, Videos) und die Möglichkeit für ein eigenes kleines Experiment angeboten.', erfolg: 'Aktive Teilnahme, eigenständige Recherche und Präsentation vor der Klasse.', erfolgRating: 'positiv' },
            { id: 4, studentId: 1, date: '2025-09-03', subject: 'Sport', observations: 'Zeigt beim Ballspiel wenig Motivation und vermeidet den Kontakt zum Ball.', measures: 'Einbindung in Teamübungen mit weniger Leistungsdruck, Fokus auf Spaß an der Bewegung.', erfolg: 'Teilnahme war gegeben, aber noch verhalten. Braucht weitere Ermutigung.', erfolgRating: '' } // absichtlich leere Bewertung
        ];
        for (const entry of sampleEntries) await tx.objectStore('entries').put(entry);

        const defaultMasterData = {
            schoolYears: ['2025/2026', '2024/2025', '2023/2024'],
            schools: { 
                'Ostschule': ['1a', '1b', '2a', '2b'], 
                'Heinz-Sielmann-Grundschule': ['1c', '2c'],
                'Max-Planck-Gymnasium': ['5a', '5b']
            },
            subjects: ['Mathematik','Deutsch','Sachkunde','Sport','Englisch'],
            activities: ['Einzelarbeit', 'Gruppenarbeit', 'Präsentation', 'Spiel', 'Experiment'],
            notesTemplates: [
                'Hat die Aufgabe schnell verstanden und umgesetzt.',
                'Benötigt noch weitere Anleitung und Unterstützung.',
                'Zeigt große Motivation und Eigeninitiative.',
                'Ist schnell abgelenkt und braucht klare Strukturen.',
                'Gute Zusammenarbeit im Team.'
            ]
        };
        await tx.objectStore('masterData').put({ ...defaultMasterData, id: 1 });
        await tx.done;

        if (setStudents) setStudents(await db.getAll('students'));
        if (setEntries) setEntries(await db.getAll('entries'));
        if (masterDataHandler) masterDataHandler(defaultMasterData); // Aktualisiere den MasterData-State in App.jsx

    } catch (err) {
        console.error('Fehler beim Laden der Beispieldaten:', err);
        alert('Fehler beim Laden der Beispieldaten: ' + err.message);
    }
};


export const clearAllData = async (db, setStudents, setEntries, setSettings, setMasterData) => {
    if (!db) return;
    try {
        const tx = db.transaction(['students','entries','settings','masterData'], 'readwrite');
        await tx.objectStore('students').clear();
        await tx.objectStore('entries').clear();
        await tx.objectStore('settings').clear();
        await tx.objectStore('masterData').clear();
        await tx.done;

        if (setStudents) setStudents([]);
        if (setEntries) setEntries([]);
        if (setSettings) setSettings({ theme: 'hell', fontSize: 16, inputFontSize: 16, customColors: {} });
        if (setMasterData) setMasterData({ schoolYears: [], schools: {}, subjects: [], activities: [], notesTemplates: [] });
    } catch (err) {
        console.error('Fehler beim Löschen aller Daten:', err);
    }
};
