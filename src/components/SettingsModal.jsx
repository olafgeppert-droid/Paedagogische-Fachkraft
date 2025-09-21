import React, { useState } from 'react';
import { setupDB, loadSampleData, clearAllData } from '../database'; // Import der DB-Funktionen

const SettingsModal = ({ settings, masterData, onSave, onSaveMasterData, onClose, setStudents, setEntries, setSelectedStudent }) => {
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
    };

    const handleMasterDataSubmit = (e) => {
        e.preventDefault();
        onSaveMasterData(masterFormData);
        setShowMasterDataModal(false);
    };

    const resetToDefault = () => {
        setFormData({
            theme: 'hell',
            fontSize: 16,
            inputFontSize: 16
        });
        setCustomColors({
            navigation: '#3498db',
            toolbar: '#2ecc71',
            header: '#e74c3c',
            protocol: '#f39c12'
        });
        setTimeout(() => {
            onClose();
        }, 300);
    };

    /* --- Stammdaten-Handling --- */
    const addSchoolYear = () => {
        const newYear = prompt('Neues Schuljahr hinzufügen (Format: YYYY/YYYY):', '2025/2026');
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

    /* --- Neue Funktionen: Beispieldaten laden und alle Daten löschen --- */
    const handleLoadSampleData = async () => {
        if (window.confirm(
            'Wollen Sie wirklich die Beispieldaten laden? Das überschreibt alle Ihre vorhandenen Daten. Speichern Sie Ihre eigenen Daten vorher!'
        )) {
            const db = await setupDB();
            await loadSampleData(db, setMasterFormData, setStudents, setEntries);
            onClose();
        }
    };

    const handleClearAllData = async () => {
        if (window.confirm(
            'Wollen Sie wirklich alle Daten löschen? Diese Aktion kann nicht rückgängig gemacht werden!'
        )) {
            const db = await setupDB();
            await clearAllData(db, setStudents, setEntries, setSelectedStudent);
            onClose();
        }
    };

    return (
        <>
            {/* Haupt-Einstellungen Modal */}
            <div className="modal-overlay">
                <div className="modal settings-modal">
                    <div className="modal-header">
                        <h2>⚙️ Einstellungen</h2>
                        <button className="modal-close" onClick={onClose}>✖️</button>
                    </div>

                    <div className="modal-content">
                        <form onSubmit={handleSubmit}>
                            {/* Theme Section */}
                            <div className="settings-section">
                                <h3>🎨 Farbschema</h3>
                                <div className="form-group">
                                    <div className="theme-grid">
                                        <div 
                                            className={`theme-card ${formData.theme === 'hell' ? 'active' : ''}`}
                                            onClick={() => setFormData({ ...formData, theme: 'hell' })}
                                        >
                                            <div className="theme-preview light-theme-preview">
                                                <div className="preview-header"></div>
                                                <div className="preview-toolbar"></div>
                                                <div className="preview-content"></div>
                                            </div>
                                            <div className="theme-info">
                                                <span className="radio-checkmark">☀️</span>
                                                <span>Standard (Hell)</span>
                                            </div>
                                        </div>
                                        
                                        <div 
                                            className={`theme-card ${formData.theme === 'dunkel' ? 'active' : ''}`}
                                            onClick={() => setFormData({ ...formData, theme: 'dunkel' })}
                                        >
                                            <div className="theme-preview dark-theme-preview">
                                                <div className="preview-header"></div>
                                                <div className="preview-toolbar"></div>
                                                <div className="preview-content"></div>
                                            </div>
                                            <div className="theme-info">
                                                <span className="radio-checkmark">🌙</span>
                                                <span>Dunkel</span>
                                            </div>
                                        </div>
                                        
                                        <div 
                                            className={`theme-card ${formData.theme === 'farbig' ? 'active' : ''}`}
                                            onClick={() => setFormData({ ...formData, theme: 'farbig' })}
                                        >
                                            <div className="theme-preview colored-theme-preview">
                                                <div className="preview-header"></div>
                                                <div className="preview-toolbar"></div>
                                                <div className="preview-content"></div>
                                            </div>
                                            <div className="theme-info">
                                                <span className="radio-checkmark">🌈</span>
                                                <span>Farbig</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {formData.theme === 'farbig' && (
                                    <div className="color-customization">
                                        <h4>🎨 Benutzerdefinierte Farben</h4>
                                        <div className="color-grid">
                                            <div className="color-item">
                                                <label>Navigation</label>
                                                <div className="color-input-group">
                                                    <input
                                                        type="color"
                                                        value={customColors.navigation}
                                                        onChange={(e) => setCustomColors({ ...customColors, navigation: e.target.value })}
                                                        className="color-picker"
                                                    />
                                                    <span className="color-value">{customColors.navigation}</span>
                                                </div>
                                            </div>
                                            <div className="color-item">
                                                <label>Werkzeugleiste</label>
                                                <div className="color-input-group">
                                                    <input
                                                        type="color"
                                                        value={customColors.toolbar}
                                                        onChange={(e) => setCustomColors({ ...customColors, toolbar: e.target.value })}
                                                        className="color-picker"
                                                    />
                                                    <span className="color-value">{customColors.toolbar}</span>
                                                </div>
                                            </div>
                                            <div className="color-item">
                                                <label>Header</label>
                                                <div className="color-input-group">
                                                    <input
                                                        type="color"
                                                        value={customColors.header}
                                                        onChange={(e) => setCustomColors({ ...customColors, header: e.target.value })}
                                                        className="color-picker"
                                                    />
                                                    <span className="color-value">{customColors.header}</span>
                                                </div>
                                            </div>
                                            <div className="color-item">
                                                <label>Fenster-Hintergrund</label>
                                                <div className="color-input-group">
                                                    <input
                                                        type="color"
                                                        value={customColors.protocol}
                                                        onChange={(e) => setCustomColors({ ...customColors, protocol: e.target.value })}
                                                        className="color-picker"
                                                    />
                                                    <span className="color-value">{customColors.protocol}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Schriftgrößen Section */}
                            <div className="settings-section">
                                <h3>📝 Schriftgrößen</h3>
                                                                <div className="slider-group">
                                    <div className="slider-item">
                                        <label className="slider-label">
                                            <span className="label-text">Schriftgröße Labels</span>
                                            <span className="label-size">{formData.fontSize}px</span>
                                        </label>
                                        <input
                                            type="range"
                                            min="12"
                                            max="24"
                                            value={formData.fontSize}
                                            onChange={(e) => setFormData({ ...formData, fontSize: parseInt(e.target.value) })}
                                            className="slider"
                                        />
                                        <div className="slider-scale">
                                            <span style={{fontSize: '12px'}}>A</span>
                                            <span style={{fontSize: '16px'}}>A</span>
                                            <span style={{fontSize: '20px'}}>A</span>
                                            <span style={{fontSize: '24px'}}>A</span>
                                        </div>
                                    </div>

                                    <div className="slider-item">
                                        <label className="slider-label">
                                            <span className="label-text">Schriftgröße Eingabefelder</span>
                                            <span className="label-size">{formData.inputFontSize}px</span>
                                        </label>
                                        <input
                                            type="range"
                                            min="12"
                                            max="24"
                                            value={formData.inputFontSize}
                                            onChange={(e) => setFormData({ ...formData, inputFontSize: parseInt(e.target.value) })}
                                            className="slider"
                                        />
                                        <div className="slider-scale">
                                            <span style={{fontSize: '12px'}}>A</span>
                                            <span style={{fontSize: '16px'}}>A</span>
                                            <span style={{fontSize: '20px'}}>A</span>
                                            <span style={{fontSize: '24px'}}>A</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stammdaten Section */}
                            <div className="settings-section">
                                <h3>📊 Stammdaten</h3>
                                <div className="master-data-card">
                                    <p>Verwalten Sie Schuljahre, Schulen und Klassen</p>
                                    <button 
                                        type="button" 
                                        className="button button-primary"
                                        onClick={() => setShowMasterDataModal(true)}
                                    >
                                        📋 Stammdaten verwalten
                                    </button>
                                </div>

                                <div className="settings-action-buttons" style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                                    <button type="button" className="button button-warning" onClick={handleLoadSampleData}>
                                        📂 Beispieldaten laden
                                    </button>
                                    <button type="button" className="button button-danger" onClick={handleClearAllData}>
                                        🗑️ Alle Daten löschen
                                    </button>
                                </div>
                            </div>

                            {/* Modal Actions */}
                            <div className="modal-actions">
                                <button 
                                    type="button" 
                                    className="button button-secondary button-back-to-main" 
                                    onClick={resetToDefault}
                                >
                                    🔄 Standard
                                </button>
                                <div className="action-group">
                                    <button type="button" className="button button-outline" onClick={onClose}>
                                        ❌ Abbrechen
                                    </button>
                                    <button type="submit" className="button button-primary">
                                        ✅ Übernehmen
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Stammdaten Modal */}
            {showMasterDataModal && (
                <div className="modal-overlay">
                    <div className="modal masterdata-modal">
                        <div className="modal-header">
                            <h2>📊 Stammdaten verwalten</h2>
                            <button className="modal-close" onClick={() => setShowMasterDataModal(false)}>✖️</button>
                        </div>

                        <div className="modal-content">
                            <form onSubmit={handleMasterDataSubmit}>
                                <div className="data-section">
                                    <h3>📅 Schuljahre</h3>
                                    <p className="section-description">Z.B. 2025/2026</p>
                                    
                                    <div className="data-list">
                                        {masterFormData.schoolYears && masterFormData.schoolYears.map(year => (
                                            <div key={year} className="data-item">
                                                <span className="item-text">{year}</span>
                                                <button
                                                    type="button"
                                                    className="button button-danger button-icon"
                                                    onClick={() => removeSchoolYear(year)}
                                                    title="Schuljahr löschen"
                                                >
                                                    ❌
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button type="button" className="button button-outline" onClick={addSchoolYear}>
                                        ➕ Schuljahr hinzufügen
                                    </button>
                                </div>

                                <div className="divider"></div>

                                <div className="data-section">
                                    <h3>🏫 Schulen und Klassen</h3>
                                    
                                    <button type="button" className="button button-outline" onClick={addSchool}>
                                        ➕ Neue Schule hinzufügen
                                    </button>
                                    
                                    <div className="schools-list">
                                        {masterFormData.schools && Object.entries(masterFormData.schools).map(([school, classes]) => (
                                            <div key={school} className="school-card">
                                                <div className="school-header">
                                                    <h4>{school}</h4>
                                                    <button
                                                        type="button"
                                                        className="button button-danger button-icon"
                                                        onClick={() => removeSchool(school)}
                                                        title="Schule löschen"
                                                    >
                                                        ❌
                                                    </button>
                                                </div>
                                                
                                                <p className="classes-title">Klassen für "{school}"</p>
                                                <div className="classes-list">
                                                    {classes && classes.map(className => (
                                                        <div key={className} className="class-item">
                                                            <span className="item-text">{className}</span>
                                                            <button
                                                                type="button"
                                                                className="button button-danger button-icon"
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
                                                    className="button button-outline button-small"
                                                    onClick={() => addClass(school)}
                                                >
                                                    ➕ Klasse hinzufügen
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="modal-actions">
                                    <button type="button" className="button button-outline" onClick={() => setShowMasterDataModal(false)}>
                                        ❌ Schließen
                                    </button>
                                    <button type="submit" className="button button-primary">
                                        ✅ Änderungen übernehmen
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SettingsModal;
