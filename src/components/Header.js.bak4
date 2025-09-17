const Header = ({ onMenuClick }) => {
    const currentDate = new Date().toLocaleDateString('de-DE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    return (
        <header className="header">
            <button className="hamburger-menu" onClick={onMenuClick}>☰</button>
            <h1>Dokumentation pädagogische Arbeit - Irina Geppert</h1>
            <span className="header-date">{currentDate}</span>
        </header>
    );
};
