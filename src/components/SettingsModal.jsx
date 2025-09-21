import React, { useState } from 'react';
import { loadSampleData, clearAllData } from '../database.js'; // Import für Beispieldaten und Löschen

const SettingsModal = ({ settings, masterData, onSave, onSaveMasterData, onClose, db, setStudents, setEntries, setSelectedStudent }) => {
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

    const handleLoadSampleDataClick = async () => {
        const confirmed = window.confirm(
            "Wollen Sie wirklich die Beispieldaten laden? Das überschreibt alle Ihre vorhandenen Daten. Speichern Sie Ihre eigenen Daten vorher!"
        );
        if (confirmed && db) {
            await loadSampleData(db, setMasterFormData, setStudents, setEntries);
            setSelectedStudent(null);
            onClose();
        }
    };

    const handleClearAllDataClick = async () => {
        const confirmed = window.confirm(
            "Wollen Sie wirklich alle Daten löschen? Diese Aktion kann nicht rückgängig gemacht werden!"
        );
        if (confirmed && db) {
            await clearAllData(db, setStudents, setEntries, setSelectedStudent);
            setSelectedStudent(null);
            onClose();
        }
    };

    return (
        <>
            <div className="modal-overlay">
                <div className="modal settings-modal">
                    <div className="modal-header">
                        <h2>⚙️ Einstellungen</h2>
                        <button className="modal-close" onClick={onClose}>✖️</button>
                    </div>

                    <div className="modal-content">
                        <form onSubmit={handleSubmit}>
                            {/* Farbschema, Schriftgrößen, Stammdaten wie gehabt */}

                            {/* --- Neuer Bereich: Beispieldaten / Daten löschen --- */}
                            <div className="settings-section">
                                <h3>⚠️ Datenverwaltung</h3>
                                <button
                                    type="button"
                                    className="button button-outline"
                                    onClick={handleLoadSampleDataClick}
                                >
                                    📥 Beispieldaten laden
                                </button>
                                <button
                                    type="button"
                                    className="button button-danger"
                                    onClick={handleClearAllDataClick}
                                >
                                    🗑️ Alle Daten löschen
                                </button>
                            </div>

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

            {/* Stammdaten Modal wie gehabt */}
            {showMasterDataModal && (
                <div className="modal-overlay">
                    <div className="modal masterdata-modal">
                        <div className="modal-header">
                            <h2>📊 Stammdaten verwalten</h2>
                            <button className="modal-close" onClick={() => setShowMasterDataModal(false)}>✖️</button>
                        </div>

                        <div className="modal-content">
                            <form onSubmit={handleMasterDataSubmit}>
                                {/* Schuljahre, Schulen, Klassen bleiben unverändert */}
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
