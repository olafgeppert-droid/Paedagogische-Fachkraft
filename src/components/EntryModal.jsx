import React, { useState } from 'react';

const EntryModal = ({ entry, student, onSave, onDelete, onClose }) => {
    const [formData, setFormData] = useState(entry || {
        subject: '',
        date: new Date().toISOString().split('T')[0],
        observations: '',
        measures: '',
        erfolg: '',
        erfolgRating: ''
    });

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Formular absenden
    const handleSubmit = (e) => {
        e.preventDefault();
        const completeData = {
            ...formData,
            studentId: student?.id || entry?.studentId,
            studentName: student?.name || entry?.studentName
        };
        onSave(completeData);
    };

    // Lösch-Dialog öffnen
    const handleDeleteClick = () => setShowDeleteConfirm(true);

    // Löschvorgang bestätigen
    const confirmDelete = () => {
        if (entry?.id) {
            onDelete(entry.id);
        }
        setShowDeleteConfirm(false);
        onClose();
    };

    // Löschvorgang abbrechen
    const cancelDelete = () => setShowDeleteConfirm(false);

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>{entry ? 'Eintrag bearbeiten' : 'Neuen Eintrag anlegen'}</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                {showDeleteConfirm ? (
                    <div className="delete-confirmation">
                        <h3>Eintrag löschen</h3>
                        <p>
                            Sind Sie sicher, dass Sie den Eintrag für „{student?.name || entry?.studentName || 'Unbekannt'}“ löschen möchten?  
                            Diese Aktion kann nicht rückgängig gemacht werden.
                        </p>
                        <div className="form-actions">
                            <button type="button" className="button" onClick={cancelDelete}>
                                Abbrechen
                            </button>
                            <button type="button" className="button button-danger" onClick={confirmDelete}>
                                Endgültig löschen
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {/* Fach / Thema */}
                        <div className="form-group">
                            <label className="form-label">Fach / Thema</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                required
                            />
                        </div>

                        {/* Datum */}
                        <div className="form-group">
                            <label className="form-label">Datum</label>
                            <input
                                type="date"
                                className="form-input"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </div>

                        {/* Beobachtungen */}
                        <div className="form-group">
                            <label className="form-label">Beobachtungen</label>
                            <textarea
                                className="form-textarea"
                                value={formData.observations}
                                onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                            />
                        </div>

                        {/* Maßnahmen */}
                        <div className="form-group">
                            <label className="form-label">Maßnahmen</label>
                            <textarea
                                className="form-textarea"
                                value={formData.measures}
                                onChange={(e) => setFormData({ ...formData, measures: e.target.value })}
                            />
                        </div>

                        {/* Erfolg */}
                        <div className="form-group">
                            <label className="form-label">Erfolg</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.erfolg}
                                onChange={(e) => setFormData({ ...formData, erfolg: e.target.value })}
                            />
                        </div>

                        {/* Erfolgsbewertung */}
                        <div className="form-group">
                            <label className="form-label">Erfolgsbewertung</label>
                            <select
                                className="form-select"
                                value={formData.erfolgRating}
                                onChange={(e) => setFormData({ ...formData, erfolgRating: e.target.value })}
                            >
                                <option value="">Bitte wählen</option>
                                <option value="positiv">Positiv</option>
                                <option value="negativ">Negativ</option>
                                <option value="none">Leer (keine Bewertung)</option>
                            </select>
                        </div>

                        {/* Buttons */}
                        <div className="form-actions">
                            {entry && (
                                <button
                                    type="button"
                                    className="button button-danger"
                                    onClick={handleDeleteClick}
                                >
                                    Löschen
                                </button>
                            )}
                            <button type="button" className="button" onClick={onClose}>
                                Abbrechen
                            </button>
                            <button type="submit" className="button button-success">
                                Speichern
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default EntryModal;
