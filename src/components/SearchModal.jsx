import React, { useState } from 'react';

const SearchModal = ({ onClose, onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('all');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch({ term: searchTerm, type: searchType });
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>🔍 Protokoll suchen</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="searchType">Suchkriterium:</label>
                        <select
                            id="searchType"
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                        >
                            <option value="all">Allgemein</option>
                            <option value="name">Name</option>
                            <option value="topic">Thema</option>
                            <option value="rating">Erfolgsbewertung</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="searchTerm">Suchbegriff:</label>
                        <input
                            id="searchTerm"
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Begriff eingeben..."
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="submit" className="button">
                            Suchen
                        </button>
                        <button type="button" className="button" onClick={onClose}>
                            Abbrechen
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SearchModal;
