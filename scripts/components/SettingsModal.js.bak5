const SettingsModal = ({ settings, masterData, onSave, onSaveMasterData, onClose }) => {
    const [formData, setFormData] = useState(settings);
    const [masterFormData, setMasterFormData] = useState(masterData);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };
    
    const handleMasterDataSubmit = (e) => {
        e.preventDefault();
        onSaveMasterData(masterFormData);
        onClose(); // Modal nach dem Speichern schließen
    };
    
    const addSchoolYear = () => {
        const newYear = prompt('Neues Schuljahr hinzufügen (Format: YYYY/YYYY):');
        if (newYear && !masterFormData.schoolYears.includes(newYear)) {
            setMasterFormData({
                ...masterFormData,
                schoolYears: [...masterFormData.schoolYears, newYear].sort()
            });
        }
    };
    
    const removeSchoolYear = (year) => {
        setMasterFormData({
            ...masterFormData,
            schoolYears: masterFormData.schoolYears.filter(y => y !== year)
        });
    };
    
    const addSchool = () => {
        const newSchool = prompt('Neue Schule hinzufügen:');
        if (newSchool && !masterFormData.schools[newSchool]) {
            setMasterFormData({
                ...masterFormData,
                schools: { ...masterFormData.schools, [newSchool]: [] }
            });
        }
    };
    
    const removeSchool = (school) => {
        const newSchools = { ...masterFormData.schools };
        delete newSchools[school];
        setMasterFormData({
            ...masterFormData,
            schools: newSchools
        });
    };
    
    const addClass = (school) => {
        const newClass = prompt('Neue Klasse hinzufügen:');
        if (newClass && !masterFormData.schools[school].includes(newClass)) {
            setMasterFormData({
                ...masterFormData,
                schools: {
                    ...masterFormData.schools,
                    [school]: [...masterFormData.schools[school], newClass].sort()
                }
            });
        }
    };
    
    const removeClass = (school, className) => {
        setMasterFormData({
            ...masterFormData,
            schools: {
                ...masterFormData.schools,
                [school]: masterFormData.schools[school].filter(c => c !== className)
            }
        });
    };
    
    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>Einstellungen</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <h3>Darstellung</h3>
                    
                    <div className="form-group">
                        <label className="form-label">Farbschema</label>
                        <div className="theme-selector">
                            <div
                                className={`theme-option theme-light ${formData.theme === 'light' ? 'selected' : ''}`}
                                onClick={() => setFormData({ ...formData, theme: 'light' })}
                                title="Hell"
                            ></div>
                            <div
                                className={`theme-option theme-dark ${formData.theme === 'dark' ? 'selected' : ''}`}
                                onClick={() => setFormData({ ...formData, theme: 'dark' })}
                                title="Dunkel"
                            ></div>
                            <div
                                className={`theme-option theme-high-contrast ${formData.theme === 'high-contrast' ? 'selected' : ''}`}
                                onClick={() => setFormData({ ...formData, theme: 'high-contrast' })}
                                title="Kontrastreich"
                            ></div>
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Schriftgröße (Labels)</label>
                        <input
                            type="range"
                            min="12"
                            max="24"
                            value={formData.fontSize}
                            onChange={(e) => setFormData({ ...formData, fontSize: parseInt(e.target.value) })}
                        />
                        <span>{formData.fontSize}px</span>
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Schriftgröße (Eingabefelder)</label>
                        <input
                            type="range"
                            min="12"
                            max="24"
                            value={formData.inputFontSize}
                            onChange={(e) => setFormData({ ...formData, inputFontSize: parseInt(e.target.value) })}
                        />
                        <span>{formData.inputFontSize}px</span>
                    </div>
                    
                    <div className="form-actions">
                        <button type="button" className="button button-danger" onClick={onClose}>Abbrechen</button>
                        <button type="submit" className="button button-success">Speichern</button>
                    </div>
                </form>
                
                <hr style={{ margin: '2rem 0' }} />
                
                <form onSubmit={handleMasterDataSubmit}>
                    <h3>Stammdaten verwalten</h3>
                    
                    <div className="form-group">
                        <label className="form-label">Schuljahre</label>
                        <div>
                            {masterFormData.schoolYears.map(year => (
                                <div key={year} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <span style={{ flex: 1 }}>{year}</span>
                                    <button 
                                        type="button" 
                                        className="button button-danger"
                                        style={{ padding: '0.25rem 0.5rem' }}
                                        onClick={() => removeSchoolYear(year)}
                                    >
                                        Löschen
                                    </button>
                                </div>
                            ))}
                            <button type="button" className="button" onClick={addSchoolYear}>
                                Schuljahr hinzufügen
                            </button>
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Schulen und Klassen</label>
                        <div>
                            {Object.entries(masterFormData.schools || {}).map(([school, classes]) => (
                                <div key={school} style={{ marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <strong style={{ flex: 1 }}>{school}</strong>
                                        <button 
                                            type="button" 
                                            className="button button-danger"
                                            style={{ padding: '0.25rem 0.5rem' }}
                                            onClick={() => removeSchool(school)}
                                        >
                                            Schule löschen
                                        </button>
                                    </div>
                                    <div style={{ paddingLeft: '1rem' }}>
                                        {classes.map(className => (
                                            <div key={className} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem' }}>
                                                <span style={{ flex: 1 }}>{className}</span>
                                                <button 
                                                    type="button" 
                                                    className="button button-danger"
                                                    style={{ padding: '0.25rem 0.5rem' }}
                                                    onClick={() => removeClass(school, className)}
                                                >
                                                    Löschen
                                                </button>
                                            </div>
                                        ))}
                                        <button 
                                            type="button" 
                                            className="button"
                                            style={{ padding: '0.25rem 0.5rem', marginTop: '0.5rem' }}
                                            onClick={() => addClass(school)}
                                        >
                                            Klasse hinzufügen
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button type="button" className="button" onClick={addSchool}>
                                Schule hinzufügen
                            </button>
                        </div>
                    </div>
                    
                    <div className="form-actions">
                        <button type="button" className="button button-danger" onClick={onClose}>Abbrechen</button>
                        <button type="submit" className="button button-success">Stammdaten speichern</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
