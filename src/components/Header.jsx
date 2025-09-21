import React from 'react';

const Header = ({ onMenuClick }) => {
  const currentDate = new Date().toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <header className="header">
      <button className="hamburger-menu" onClick={onMenuClick}>
        ☰
      </button>
      
      <div className="header-center">
        <h1 className="header-title">Dokumentation pädagogische Arbeit - Irina Geppert</h1>
      </div>
      
      <div className="header-right">
        <div className="header-date">{currentDate}</div>
        <div className="header-version">Version 1.7.0</div>
      </div>
    </header>
  );
};

export default Header;
