import React, { useState } from 'react';
import { setupDB, loadSampleData, clearAllData } from '../database'; // Import der DB-Funktionen

const SettingsModal = ({
  settings,
  masterData,
  onSave,
  onSaveMasterData,
  onClose,
  setStudents,
  setEntries,
  setSelectedStudent,
  setSettings // ✅ Ergänzt: setSettings wird jetzt als Prop erwartet
}) => {
  // =======================
  // Form-State
  // =======================
  const [formData, setFormData] = useState(settings || {
    theme: 'hell',
    fontSize: 16,
    inputFontSize: 16
  });

  const [masterFormData, setMasterFormData] = useState({
    schoolYears: masterData?.schoolYears || [],
    schools: masterData?.schools || {},
    subjects: masterData?.subjects || [],
    activities: masterData?.activities || [],
    notesTemplates: masterData?.notesTemplates || []
  });

  const [showMasterDataModal, setShowMasterDataModal] = useState(false);

  const [customColors, setCustomColors] = useState({
    navigation: '#3498db',
    toolbar: '#2ecc71',
    header: '#e74c3c',
    windowBackground: '#f39c12'
  });

  // =======================
  // Handlers
  // =======================
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, customColors });
  };

  const handleMasterDataSubmit = (e) => {
    e.preventDefault();
    if (onSaveMasterData) {
      onSaveMasterData(prev => ({
        ...prev,
        schoolYears: masterFormData.schoolYears,
        schools: masterFormData.schools,
        subjects: masterFormData.subjects,
        activities: masterFormData.activities,
        notesTemplates: masterFormData.notesTemplates
      }));
    }
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
      windowBackground: '#f39c12'
    });
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // =======================
  // Beispieldaten & Alle Daten löschen
  // =======================
  const handleLoadSampleData = async () => {
    if (!window.confirm(
      'Wollen Sie wirklich die Beispieldaten laden? Das überschreibt alle Ihre vorhandenen Daten. Speichern Sie Ihre eigenen Daten vorher!'
    )) return;
    try {
      const db = await setupDB();
      await loadSampleData(db, (data) => {
        onSaveMasterData({
          ...data,
          schoolYears: masterFormData.schoolYears,
          schools: masterFormData.schools
        });
      }, setStudents, setEntries);
      const allStudents = await db.getAll('students');
      if (setStudents) setStudents(allStudents);
      const allEntries = await db.getAll('entries');
      if (setEntries) setEntries(allEntries);
      onClose();
      alert('Beispieldaten erfolgreich geladen! Bitte laden Sie die Seite im Browser neu.');
    } catch (error) {
      console.error('Fehler beim Laden der Beispieldaten:', error);
      alert('Fehler beim Laden der Beispieldaten: ' + (error.message || error));
    }
  };

  const handleClearAllData = async () => {
    if (!window.confirm('Wollen Sie wirklich alle Daten löschen? Diese Aktion kann nicht rückgängig gemacht werden! Laden Sie die Browser-Seite nach dem Löschen der Daten neu.')) return;
    try {
      const db = await setupDB();
      await clearAllData(db, setStudents, setEntries, setSettings, () => {
        onSaveMasterData({ schoolYears: [], schools: [], subjects: [], activities: [], notesTemplates: [] });
      });
      if (setStudents) setStudents([]);
      if (setEntries) setEntries([]);
      if (setSelectedStudent) setSelectedStudent(null);
      onClose();
    } catch (error) {
      console.error('Fehler beim Löschen aller Daten:', error);
      alert('Fehler beim Löschen aller Daten: ' + (error.message || error));
    }
  };

  // =======================
  // JSX Return
  // =======================
  return (
    <div className="modal-overlay">
      <div className="modal settings-modal">
        <div className="modal-header">
          <h2>⚙️ Einstellungen</h2>
          <button className="modal-close" onClick={onClose} aria-label="Schließen">✖️</button>
        </div>
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            {/* Farbschema */}
            {/* ... hier kannst du deine Farbauswahl-Komponenten belassen ... */}

            {/* Stammdaten */}
            <div className="settings-action-buttons" style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
              <button type="button" className="button button-warning" onClick={handleLoadSampleData}>
                📂 Beispieldaten laden
              </button>
              <button type="button" className="button button-danger" onClick={handleClearAllData}>
                🗑️ Alle Daten löschen
              </button>
            </div>

            {/* Modal Actions */}
            <div className="modal-actions">
              <button type="button" className="button button-secondary button-back-to-main" onClick={resetToDefault}>
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
  );
};

export default SettingsModal;
