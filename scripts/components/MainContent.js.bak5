const MainContent = ({ viewMode, selectedStudent, selectedDate, entries, onEditEntry }) => {
    if (viewMode === 'student' && selectedStudent) {
        return (
            <div className="main">
                <h2>Protokolle für {selectedStudent.name}</h2>
                {entries.length === 0 ? (
                    <div className="welcome-screen">
                        <p>Keine Einträge für dieses Kind.</p>
                    </div>
                ) : (
                    entries.map(entry => (
                        <EntryCard 
                            key={entry.id} 
                            entry={entry} 
                            student={selectedStudent}
                            onEdit={onEditEntry}
                        />
                    ))
                )}
            </div>
        );
    } else if (viewMode === 'day' && selectedDate) {
        const entriesByStudent = {};
        entries.forEach(entry => {
            if (!entriesByStudent[entry.studentId]) {
                entriesByStudent[entry.studentId] = [];
            }
            entriesByStudent[entry.studentId].push(entry);
        });
        
        return (
            <div className="main">
                <h2>Einträge für {new Date(selectedDate).toLocaleDateString('de-DE')}</h2>
                {Object.keys(entriesByStudent).length === 0 ? (
                    <div className="welcome-screen">
                        <p>Keine Einträge für dieses Datum.</p>
                    </div>
                ) : (
                    Object.entries(entriesByStudent).map(([studentId, studentEntries]) => (
                        <div key={studentId} style={{ marginBottom: '2rem' }}>
                            <h3>{studentEntries[0].studentName || `Schüler ${studentId}`}</h3>
                            {studentEntries.map(entry => (
                                <EntryCard 
                                    key={entry.id} 
                                    entry={entry} 
                                    onEdit={onEditEntry}
                                />
                            ))}
                        </div>
                    ))
                )}
            </div>
        );
    } else {
        return (
            <div className="main">
                <div className="welcome-screen">
                    <h2>Willkommen!</h2>
                    <p>Wählen Sie links ein Kind aus der Liste, um die Protokolle anzuzeigen, 
                       oder wählen Sie einen Tag, um alle Einträge für diesen Tag zu sehen.</p>
                </div>
            </div>
        );
    }
};

const EntryCard = ({ entry, student, onEdit }) => {
    return (
        <div className="entry-card">
            <div className="entry-header">
                <span>{entry.subject}</span>
                <span>{new Date(entry.date).toLocaleDateString('de-DE')}</span>
            </div>
            {student && <p><strong>Schüler:</strong> {student.name}</p>}
            <p><strong>Beobachtungen:</strong> {entry.observations}</p>
            <p><strong>Maßnahmen:</strong> {entry.measures}</p>
            <p><strong>Erfolg:</strong> {entry.erfolg}</p>
            <p><strong>Bewertung:</strong> {entry.erfolgRating}</p>
            <button className="button" onClick={onEdit}>Bearbeiten</button>
        </div>
    );
};
