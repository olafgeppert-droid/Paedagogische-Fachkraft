const Header = ({ onMenuClick }) => {
    const currentDate = new Date().toLocaleDateString('de-DE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const appVersion = "v1.2.5"; // Aktuelle Softwareversion

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

export default Header;
