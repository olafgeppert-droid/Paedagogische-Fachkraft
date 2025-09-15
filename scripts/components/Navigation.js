const Navigation = ({
    isOpen,
    students,
    selectedStudent,
    selectedDate,
    filters,
    masterData,
    onStudentSelect,
    onDateSelect,
    onFilterChange,
    onShowStats,
    onShowSettings,
    onShowHelp
}) => {
    const [searchTerm, setSearchTerm] = useState(filters.search);
    const [localFilters, setLocalFilters] = useState(filters);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        
        // Debounced search
        clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(() => {
            onFilterChange({ ...localFilters, search: value });
        }, 300);
    };

    const handleFilterChange = (filterType, value) => {
        const newFilters = { ...localFilters, [filterType]: value };
        setLocalFilters(newFilters);
        onFilterChange(newFilters);
    };

    const clearFilters = () => {
        const clearedFilters = {
            search: '',
            schoolYear: '',
            school: '',
            className: ''
        };
        setSearchTerm('');
        setLocalFilters(clearedFilters);
        onFilterChange(clearedFilters);
    };

    const hasActiveFilters = localFilters.search || localFilters.schoolYear || localFilters.school || localFilters.className;

    return (
        <nav className={`nav ${isOpen ? 'open' : ''}`}>
            <div className="nav-header">
                <h3>🔍 Filter & Navigation</h3>
                {hasActiveFilters && (
                    <button 
                        className="button button-warning"
                        onClick={clearFilters}
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                    >
                        ❌ Filter löschen
                    </button>
                )}
            </div>

            <div className="search-filter">
                <div className="filter-group">
                    <label className="filter-label">Suche</label>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Kindername suchen..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
                
                <div className="filter-group">
                    <label className="filter-label">Schuljahr</label>
                    <select
                        className="filter-select"
                        value={localFilters.schoolYear}
                        onChange={(e) => handleFilterChange('schoolYear', e.target.value)}
                    >
                        <option value="">Alle Schuljahre</option>
                        {masterData.schoolYears && masterData.schoolYears.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
                
                <div className="filter-group">
                    <label className="filter-label">Schule</label>
                    <select
                        className="filter-select"
                        value={localFilters.school}
                        onChange={(e) => handleFilterChange('school', e.target.value)}
                    >
                        <option value="">Alle Schulen</option>
                        {masterData.schools && Object.keys(masterData.schools).map(school => (
                            <option key={school} value={school}>{school}</option>
                        ))}
                    </select>
                </div>
                
                <div className="filter-group">
                    <label className="filter-label">Klasse</label>
                    <select
                        className="filter-select"
                        value={localFilters.className}
                        onChange={(e) => handleFilterChange('className', e.target.value)}
                        disabled={!localFilters.school}
                    >
                        <option value="">Alle Klassen</option>
                        {localFilters.school && masterData.schools[localFilters.school]?.map(className => (
                            <option key={className} value={className}>{className}</option>
                        ))}
                    </select>
                </div>
                
                <div className="filter-group">
                    <label className="filter-label">Tagesansicht</label>
                    <input
                        type="date"
                        className="filter-select"
                        value={selectedDate}
                        onChange={(e) => onDateSelect(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </div>
            </div>
            
            <div className="students-section">
                <div className="section-header">
                    <h4>👥 Schülerliste</h4>
                    <span className="student-count">({students.length} Schüler)</span>
                </div>
                
                {students.length === 0 ? (
                    <div className="empty-state">
                        <p>❌ Keine Schüler gefunden</p>
                        {hasActiveFilters && (
                            <button 
                                className="button"
                                onClick={clearFilters}
                                style={{ marginTop: '10px' }}
                            >
                                Filter zurücksetzen
                            </button>
                        )}
                    </div>
                ) : (
                    <ul className="students-list">
                        {students.map(student => (
                            <li
                                key={student.id}
                                className={`student-item ${selectedStudent?.id === student.id ? 'selected' : ''}`}
                                onClick={() => onStudentSelect(student)}
                            >
                                <span className="student-avatar">
                                    {student.gender === 'weiblich' ? '👩' : 
                                     student.gender === 'männlich' ? '👨' : '👤'}
                                </span>
                                <div className="student-info">
                                    <div className="student-name">{student.name}</div>
                                    <div className="student-details">
                                        {student.className} • {student.school}
                                    </div>
                                </div>
                                <div className="student-year">{student.schoolYear}</div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            
            <div className="nav-footer">
                <div className="footer-section">
                    <h4>⚙️ Einstellungen</h4>
                    <button className="button button-info" onClick={onShowStats}>
                        📊 Statistiken
                    </button>
                    <button className="button button-info" onClick={onShowSettings}>
                        ⚙️ Einstellungen
                    </button>
                    <button className="button button-info" onClick={onShowHelp}>
                        ❓ Hilfe
                    </button>
                </div>
                
                <div className="app-info">
                    <p style={{ fontSize: '12px', color: '#666', marginTop: '20px' }}>
                        📱 Pädagogische Dokumentation v1.0
                    </p>
                </div>
            </div>
        </nav>
    );
};
