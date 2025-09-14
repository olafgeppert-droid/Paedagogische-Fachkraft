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

// Weitere Datenbank-Funktionen...
