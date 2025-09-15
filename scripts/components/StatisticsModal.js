const StatisticsModal = ({ students, entries, onClose }) => {
    const stats = calculateStatistics(students, entries);
    
    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>📊 Statistiken & Analytics</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>👥 Gesamtübersicht</h3>
                        <p><strong>Gesamtzahl Kinder:</strong> {stats.totalStudents}</p>
                        <p><strong>Gesamtzahl Einträge:</strong> {stats.totalEntries}</p>
                        <p><strong>Durchschnitt pro Kind:</strong> {stats.totalStudents > 0 ? (stats.totalEntries / stats.totalStudents).toFixed(1) : 0}</p>
                    </div>
                    
                    <div className="stat-card">
                        <h3>📝 Eintragsverteilung</h3>
                        <p><strong>Kinder mit Einträgen:</strong> {stats.studentsWithEntries}</p>
                        <p><strong>Kinder ohne Einträge:</strong> {stats.studentsWithoutEntries}</p>
                        <p><strong>Abdeckung:</strong> {((stats.studentsWithEntries / stats.totalStudents) * 100 || 0).toFixed(1)}%</p>
                    </div>
                    
                    <div className="stat-card">
                        <h3>⭐ Bewertungen</h3>
                        <p><strong>Positive:</strong> {stats.ratings.positiv} ({(stats.ratings.positiv/stats.totalEntries * 100 || 0).toFixed(1)}%)</p>
                        <p><strong>Negative:</strong> {stats.ratings.negativ} ({(stats.ratings.negativ/stats.totalEntries * 100 || 0).toFixed(1)}%)</p>
                        <p><strong>Keine Bewertung:</strong> {stats.ratings.keine} ({(stats.ratings.keine/stats.totalEntries * 100 || 0).toFixed(1)}%)</p>
                    </div>
                </div>
                
                <div className="form-actions">
                    <button type="button" className="button button-success" onClick={onClose}>
                        ✔️ Schließen
                    </button>
                </div>
            </div>
        </div>
    );
};
