// Schüler filtern
const filterStudents = (students, filters) => {
    return students.filter(student => {
        const matchesSearch = filters.search === '' || 
            student.name.toLowerCase().includes(filters.search.toLowerCase());
        const matchesSchoolYear = filters.schoolYear === '' || 
            student.schoolYear === filters.schoolYear;
        const matchesSchool = filters.school === '' || 
            student.school === filters.school;
        const matchesClass = filters.className === '' || 
            student.className === filters.className;
        
        return matchesSearch && matchesSchoolYear && matchesSchool && matchesClass;
    });
};

// Daten exportieren
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
    }
};

// Weitere Hilfsfunktionen...
