const StudentModal = ({ student, masterData, onSave, onDelete, onClose }) => {
    const [formData, setFormData] = useState(student || {
        name: '',
        schoolYear: '',
        school: '',
        className: '',
        gender: '',
        nationality: '',
        germanLevel: '',
        notes: ''
    });
    
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };
    
    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };
    
    const confirmDelete = () => {
        onDelete(student.id);
        setShowDeleteConfirm(false);
        onClose();
    };
    
    const cancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>{student ? 'Kind bearbeiten' : 'Neues Kind hinzufügen'}</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                
                {showDeleteConfirm ? (
                    <div className="delete-confirmation">
                        <h3>Kind löschen</h3>
                        <p>Sind Sie sicher, dass Sie "{student.name}" löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.</p>
                        <div className="form-actions">
                            <button type="button" className="button" onClick={cancelDelete}>Abbrechen</button>
                            <button type="button" className="button button-danger" onClick={confirmDelete}>Endgültig löschen</button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">Schuljahr</label>
                            <select
                                className="form-select"
                                value={formData.schoolYear}
                                onChange={(e) => setFormData({ ...formData, schoolYear: e.target.value })}
                                required
                            >
                                <option value="">Bitte wählen</option>
                                {masterData.schoolYears.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">Schule</label>
                            <select
                                className="form-select"
                                value={formData.school}
                                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                                required
                            >
                                <option value="">Bitte wählen</option>
                                {Object.keys(masterData.schools || {}).map(school => (
                                    <option key={school} value={school}>{school}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">Klasse</label>
                            <select
                                className="form-select"
                                value={formData.className}
                                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                                required
                            >
                                <option value="">Bitte wählen</option>
                                {formData.school && masterData.schools[formData.school]?.map(className => (
                                    <option key={className} value={className}>{className}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">Geschlecht</label>
                            <select
                                className="form-select"
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            >
                                <option value="">Bitte wählen</option>
                                <option value="männlich">Männlich</option>
                                <option value="weiblich">Weiblich</option>
                                <option value="divers">Divers</option>
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">Nationalität</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.nationality}
                                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">Deutschkenntnisse</label>
                            <select
                                className="form-select"
                                value={formData.germanLevel}
                                onChange={(e) => setFormData({ ...formData, germanLevel: e.target.value })}
                            >
                                <option value="">Bitte wählen</option>
                                <option value="1">1 - Sehr gut</option>
                                <option value="2">2 - Gut</option>
                                <option value="3">3 - Befriedigend</option>
                                <option value="4">4 - Ausreichend</option>
                                <option value="5">5 - Mangelhaft</option>
                                <option value="6">6 - Ungenügend</option>
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">Notizen</label>
                            <textarea
                                className="form-textarea"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>
                        
                        <div className="form-actions">
                            {student && (
                                <button 
                                    type="button" 
                                    className="button button-danger" 
                                    onClick={handleDelete}
                                >
                                    Löschen
                                </button>
                            )}
                            <button type="button" className="button" onClick={onClose}>Abbrechen</button>
                            <button type="submit" className="button button-success">Speichern</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
