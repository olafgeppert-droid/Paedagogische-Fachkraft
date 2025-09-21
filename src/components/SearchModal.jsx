import React, { useState } from "react";

export default function SearchModal({ onClose, onSearch }) {
  const [field, setField] = useState("all");
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ field, query });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Protokollsuche</h2>
        <form onSubmit={handleSubmit}>
          {/* Auswahlfeld */}
          <label>
            Suchfeld:
            <select value={field} onChange={(e) => setField(e.target.value)}>
              <option value="all">Alle Felder</option>
              <option value="name">Name</option>
              <option value="thema">Thema</option>
              <option value="bewertung">Erfolgsbewertung</option>
            </select>
          </label>

          {/* Eingabefeld oder Dropdown je nach Auswahl */}
          {field === "bewertung" ? (
            <label>
              Erfolgsbewertung:
              <select value={query} onChange={(e) => setQuery(e.target.value)}>
                <option value="">-- auswählen --</option>
                <option value="positiv">Positiv</option>
                <option value="neutral">Neutral</option>
                <option value="negativ">Negativ</option>
              </select>
            </label>
          ) : (
            <label>
              Suchbegriff:
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Begriff eingeben..."
              />
            </label>
          )}

          <div className="modal-footer">
            <button type="button" onClick={onClose}>
              Abbrechen
            </button>
            <button type="submit" className="button button-primary">
              Suchen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
