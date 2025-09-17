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
    return (
        <nav className={`nav ${isOpen ? 'open' : ''}`}>
            <div className="search-filter">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Kind suchen..."
                    value={filters.search}
                    onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
                />
                
                <select
                    className="filter-select"
                    value={filters.schoolYear}
                    onChange={(e) => onFilterChange({ ...filters, schoolYear: e.target.value })}
                >
                    <option value="">Alle Schuljahre</option>
                    {masterData.schoolYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
                
                <select
                    className="filter-select"
                    value={filters.school}
                    onChange={(e) => onFilterChange({ ...filters, school: e.target.value })}
                >
                    <option value="">Alle Schulen</option>
                    {Object.keys(masterData.schools || {}).map(school => (
                        <option key={school} value={school}>{school}</option>
                    ))}
                </select>
                
                <select
                    className="filter-select"
                    value={filters.className}
                    onChange={(e) => onFilterChange({ ...filters, className: e.target.value })}
                >
                    <option value="">Alle Klassen</option>
                    {filters.school && masterData.schools[filters.school]?.map(className => (
                        <option key={className} value={className}>{className}</option>
                    ))}
                </select>
                
                <input
                    type="date"
                    className="filter-select"
                    value={selectedDate}
                    onChange={(e) => onDateSelect(e.target.value)}
                />
            </div>
            
            <ul className="students-list">
                {students.map(student => (
                    <li
                        key={student.id}
                        className={`student-item ${selectedStudent?.id === student.id ? 'selected' : ''}`}
                        onClick={() => onStudentSelect(student)}
                    >
                        {student.name} ({student.className})
                    </li>
                ))}
            </ul>
            
            <div className="nav-footer">
                <button className="button" onClick={onShowStats}>Statistiken</button>
                <button className="button" onClick={onShowSettings}>Einstellungen</button>
                <button className="button" onClick={onShowHelp}>Hilfe</button>
            </div>
        </nav>
    );
};
