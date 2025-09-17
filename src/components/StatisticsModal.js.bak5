const StatisticsModal = ({ students, entries, onClose }) => {
    const stats = calculateStatistics(students, entries);
    
    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>Statistiken</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                
                <div>
                    <h3>Übersicht</h3>
                    <p><strong>Gesamtzahl Kinder:</strong> {stats.totalStudents}</p>
                    <p><strong>Gesamtzahl Einträge:</strong> {stats.totalEntries}</p>
                    <p><strong>Durchschnittliche Einträge pro Kind:</strong> {stats.totalStudents > 0 ? (stats.totalEntries / stats.totalStudents).toFixed(1) : 0}</p>
                    
                    <h3>Einträge nach Kindern</h3>
                    <p><strong>Kinder mit Einträgen:</strong> {stats.studentsWithEntries}</p>
                    <p><strong>Kinder ohne Einträge:</strong> {stats.studentsWithoutEntries}</p>
                    
                    <h3>Bewertungen</h3>
                    <p><strong>Positive Bewertungen:</strong> {stats.ratings.positiv}</p>
                    <p><strong>Negative Bewertungen:</strong> {stats.ratings.negativ}</p>
                    <p><strong>Keine Bewertung:</strong> {stats.ratings.keine}</p>
                </div>
                
                <div className="form-actions">
                    <button type="button" className="button" onClick={onClose}>Schließen</button>
                </div>
            </div>
        </div>
    );
};
