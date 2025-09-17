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
            <h1>Pädagogische Dokumentation</h1>
            <span>{currentDate}</span>
        </header>
    );
};
