import React, { useState } from 'react';

const SearchModal = ({ onClose, onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('all');
    const [rating, setRating] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        let criteria = { type: searchType };

        if (searchType === 'rating') {
            criteria.value = rating;
        } else {
            criteria.value = searchTerm.trim();
        }

        onSearch(criteria);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>🔍 Protokoll suchen</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="searchType">Suchkriterium:</label>
                        <select
                            id="searchType"
                            value={searchType}
                            onChange={(e) => {
                                setSearchType(e.target.value);
                                setSearchTerm('');
                                setRating('');
                            }}
                        >
                            <option value="all">Allgemein</option>
                            <option value="name">Name</option>
                            <option value="topic">Thema</option>
                            <option value="rating">Erfolgsbewertung</option>
                        </select>
                    </div>

                    {searchType !== 'rating' && (
                        <div className="form-group">
                            <label htmlFor="searchTerm">Suchbegriff:</label>
                            <input
                                id="searchTerm"
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Begriff eingeben..."
                                required
                            />
                        </div>
                    )}

                    {searchType === 'rating' && (
                        <div className="form-group">
                            <label htmlFor="rating">Erfolgsbewertung:</label>
                            <select
                                id="rating"
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                                required
                            >
                                <option value="">-- auswählen --</option>
                                <option value="positiv">positiv</option>
                                <option value="negativ">negativ</option>
                                <option value="leer">leer</option>
                            </select>
                        </div>
                    )}

                    <div className="form-actions" style={{ marginTop: '1rem' }}>
                        <button
                            type="button"
                            className="button button-secondary"
                            onClick={onClose}
                        >
                            ❌ Abbrechen
                        </button>
                        <button
                            type="submit"
                            className="button button-success"
                        >
                            ✔️ OK
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SearchModal;
