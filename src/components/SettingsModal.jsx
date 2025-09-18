import React, { useState } from 'react';

const SettingsModal = ({ settings, masterData, onSave, onSaveMasterData, onClose }) => {
    const [formData, setFormData] = useState(settings);
    const [masterFormData, setMasterFormData] = useState(masterData);
    const [showMasterDataModal, setShowMasterDataModal] = useState(false);
    const [customColors, setCustomColors] = useState({
        navigation: '#3498db',
        toolbar: '#2ecc71',
        header: '#e74c3c',
        protocol: '#f39c12'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...formData, customColors });
        
        document.body.classList.remove('light-theme', 'dark-theme', 'colored-theme');
        if(formData.theme === 'light') document.body.classList.add('light-theme');
        if(formData.theme === 'dark') document.body.classList.add('dark-theme');
        if(formData.theme === 'colored') document.body.classList.add('colored-theme');
    };

    const handleMasterDataSubmit = (e) => {
        e.preventDefault();
        onSaveMasterData(masterFormData);
        setShowMasterDataModal(false);
    };

    const resetToDefault = () => {
        setFormData({
            theme: 'light',
            fontSize: 16,
            inputFontSize: 16
        });
        setCustomColors({
            navigation: '#3498db',
            toolbar: '#2ecc71',
            header: '#e74c3c',
            protocol: '#f39c12'
        });
    };

    /* --- Stammdaten-Handling --- */
    const addSchoolYear = () => {
        const newYear = prompt('Neues Schuljahr hinzufügen (Format: YYYY/YYYY):', '2024/2025');
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
        const newSchool = prompt('Neue Schule hinzufügen:', 'Heinz-Sielmann-Schule, Grundschule Neustadt an der Weinstraße');
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
        const newClass = prompt('Neue Klasse hinzufügen:', 'Klasse 1a');
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
        <>
            {/* Haupt-Einstellungen Modal */}
            <div className="modal-overlay">
                <div className="modal large-modal">
                    <div className="modal-header">
                        <h2>⚙️ Einstellungen</h2>
                        <button className="modal-close" onClick={onClose}>✖️</button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <h3>🎨 Farbschema</h3>
                        
                        <div className="form-group">
                            <div className="theme-radio-group">
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="theme"
                                        value="light"
                                        checked={formData.theme === 'light'}
                                        onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                                    />
                                    <span className="radio-checkmark">☀️</span>
                                    Standard (Hell)
                                </label>
                                
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="theme"
                                        value="dark"
                                        checked={formData.theme === 'dark'}
                                        onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                                    />
                                    <span className="radio-checkmark">🌙</span>
                                    Dunkel
                                </label>
                                
                                <label className="radio-label">
                                    <input
                                        type="radio"
                                        name="theme"
                                        value="colored"
                                        checked={formData.theme === 'colored'}
                                        onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                                    />
                                    <span className="radio-checkmark">🌈</span>
                                    Farbig (Benutzerdefiniert)
                                </label>
                            </div>
                        </div>

                        {formData.theme === 'colored' && (
                            <div className="color-picker-group">
                                <h4>🎨 Farben anpassen</h4>
                                <div className="color-picker-row">
                                    <label>Navigation</label>
                                    <input
                                        type="color"
                                        value={customColors.navigation}
                                        onChange={(e) => setCustomColors({ ...customColors, navigation: e.target.value })}
                                        className="color-picker"
                                    />
                                </div>
                                <div className="color-picker-row">
                                    <label>Werkzeugleiste</label>
                                    <input
                                        type="color"
                                        value={customColors.toolbar}
                                        onChange={(e) => setCustomColors({ ...customColors, toolbar: e.target.value })}
                                        className="color-picker"
                                    />
                                </div>
                                <div className="color-picker-row">
                                    <label>Header</label>
                                    <input
                                        type="color"
                                        value={customColors.header}
                                        onChange={(e) => setCustomColors({ ...customColors, header: e.target.value })}
                                        className="color-picker"
                                    />
                                </div>
                                <div className="color-picker-row">
                                    <label>Protokoll-Hintergrund</label>
                                    <input
                                        type="color"
                                        value={customColors.protocol}
                                        onChange={(e) => setCustomColors({ ...customColors, protocol: e.target.value })}
                                        className="color-picker"
                                    />
                                </div>
                            </div>
                        )}

                        <h3>📝 Schriftgrößen</h3>

                        <div className="form-group">
                            <label className="form-label">A → A Schriftgröße Labels: {formData.fontSize}px</label>
                            <input
                                type="range"
                                min="12"
                                max="24"
                                value={formData.fontSize}
                                onChange={(e) => setFormData({ ...formData, fontSize: parseInt(e.target.value) })}
                                className="slider"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">A → A Schriftgröße Eingabefelder: {formData.inputFontSize}px</label>
                            <input
                                type="range"
                                min="12"
                                max="24"
                                value={formData.inputFontSize}
                                onChange={(e) => setFormData({ ...formData, inputFontSize: parseInt(e.target.value) })}
                                className="slider"
                            />
                        </div>

                        <h3>📊 Stammdaten</h3>
                        <div className="form-group">
                            <button 
                                type="button" 
                                className="button button-info"
                                onClick={() => setShowMasterDataModal(true)}
                            >
                                📋 Stammdaten verwalten...
                            </button>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="button button-warning" onClick={resetToDefault}>
                                🔄 Standard
                            </button>
                            <button type="button" className="button button-danger" onClick={onClose}>
                                ❌ Abbrechen
                            </button>
                            <button type="submit" className="button button-success">
                                ✅ Übernehmen
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Stammdaten Modal */}
            {showMasterDataModal && (
                <div className="modal-overlay">
                    <div className="modal large-modal">
                        <div className="modal-header">
                            <h2>📊 Stammdaten verwalten</h2>
                            <button className="modal-close" onClick={() => setShowMasterDataModal(false)}>✖️</button>
                        </div>

                        <form onSubmit={handleMasterDataSubmit}>
                            <h3>📅 Schuljahre</h3>
                            <div className="form-group">
                                <p>Z.B. 2025/2026</p>
                                <div className="list-container">
                                    {masterFormData.schoolYears.map(year => (
                                        <div key={year} className="list-item">
                                            <span>{year}</span>
                                            <button
                                                type="button"
                                                className="button button-danger small"
                                                onClick={() => removeSchoolYear(year)}
                                                title="Schuljahr löschen"
                                            >
                                                ❌
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button type="button" className="button" onClick={addSchoolYear}>
                                    ➕ Hinzufügen
                                </button>
                            </div>

                            <hr />

                            <h3>🏫 Schulen und Klassen</h3>
                            <div className="form-group">
                                <button type="button" className="button" onClick={addSchool}>
                                    ➕ Neue Schule hinzufügen
                                </button>
                                
                                <div className="schools-container">
                                    {Object.entries(masterFormData.schools || {}).map(([school, classes]) => (
                                        <div key={school} className="school-section">
                                            <div className="school-header">
                                                <h4>{school}</h4>
                                                <button
                                                    type="button"
                                                    className="button button-danger small"
                                                    onClick={() => removeSchool(school)}
                                                    title="Schule löschen"
                                                >
                                                    ❌
                                                </button>
                                            </div>
                                            
                                            <p>Klassen für "{school}"</p>
                                            <div className="list-container">
                                                {classes.map(className => (
                                                    <div key={className} className="list-item">
                                                        <span>{className}</span>
                                                        <button
                                                            type="button"
                                                            className="button button-danger small"
                                                            onClick={() => removeClass(school, className)}
                                                            title="Klasse löschen"
                                                        >
                                                            ❌
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                type="button"
                                                className="button small"
                                                onClick={() => addClass(school)}
                                            >
                                                ➕ Neue Klasse hinzufügen
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="button button-danger" onClick={() => setShowMasterDataModal(false)}>
                                    ❌ Schließen
                                </button>
                                <button type="submit" className="button button-success">
                                    ✅ Änderungen übernehmen
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default SettingsModal;
