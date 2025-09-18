import React from 'react';

const Header = ({ onMenuClick }) => {
    const currentDate = new Date().toLocaleDateString('de-DE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const appVersion = "1.3.0"; // Versionsnummer

    return (
        <header className="header">
            <button className="hamburger-menu" onClick={onMenuClick}>☰</button>
            <h1>Dokumentation pädagogische Arbeit - Irina Geppert</h1>
            <div className="header-info">
                <span className="header-date">{currentDate}</span>
                <span className="header-version">{appVersion}</span>
            </div>
        </header>
    );
};

// Wichtiger Unterschied: ES-Modul Export
export default Header;
