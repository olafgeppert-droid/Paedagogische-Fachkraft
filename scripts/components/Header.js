const Header = ({ onMenuClick }) => {
    const currentDate = new Date().toLocaleDateString('de-DE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Softwareversion
    const version = "v1.2.5";

    return (
        <header className="header">
            <button className="hamburger-menu" onClick={onMenuClick}>☰</button>
            <h1>Dokumentation pädagogische Arbeit - Irina Geppert</h1>
            <div className="header-right">
                <span className="header-date">{currentDate}</span>
                <span className="header-version">{version}</span>
            </div>
        </header>
    );
};

export default Header;

