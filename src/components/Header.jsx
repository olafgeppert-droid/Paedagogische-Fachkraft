import React from 'react';
import './Header.css';

const Header = () => {
  const currentDate = new Date().toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <header className="header">
      <div className="header-left">
        {/* Hier steht Ihr bestehender Header-Inhalt, z.B.: */}
        <h1>Ihre Anwendung</h1>
        {/* Navigation oder andere Elemente */}
      </div>
      
      <div className="header-right">
        <div className="date">{currentDate}</div>
        <div className="version">Version 1.4.0</div>
      </div>
    </header>
  );
};

export default Header;
