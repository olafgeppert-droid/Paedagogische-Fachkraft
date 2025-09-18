import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Toolbar from './components/Toolbar.jsx';
import Navigation from './components/Navigation.jsx';
import MainContent from './components/MainContent.jsx';
import StudentModal from './components/StudentModal.jsx';
import EntryModal from './components/EntryModal.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import StatisticsModal from './components/StatisticsModal.jsx';
import HelpModal from './components/HelpModal.jsx';
import { setupDB } from './database.js';

const App = () => {
  const [db, setDb] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState('welcome');
  const [modal, setModal] = useState(null);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const initDB = async () => {
      try {
        const database = await setupDB();
        setDb(database);
        const allStudents = await database.getAll('students');
        setStudents(allStudents);
      } catch (error) {
        console.error('Datenbank-Initialisierungsfehler:', error);
      }
    };
    initDB();
  }, []);

  if (!db) return <div>Datenbank wird initialisiert...</div>;

  return (
    <div className="app">
      <Header onMenuClick={() => setNavOpen(!navOpen)} />
      <Toolbar
        selectedStudent={selectedStudent}
        selectedDate={selectedDate}
        onAddStudent={() => setModal('student')}
        onEditStudent={() => setModal('student')}
        onAddEntry={() => setModal('entry')}
        onEditEntry={() => setModal('entry')}
        onPrint={() => window.print()}
        onExport={() => {}}
        onImport={() => {}}
        onUndo={() => {}}
        onRedo={() => {}}
        canUndo={false}
        canRedo={false}
      />
      <Navigation
        isOpen={navOpen}
        students={students}
        selectedStudent={selectedStudent}
        selectedDate={selectedDate}
        onStudentSelect={(student) => { setSelectedStudent(student); setViewMode('student'); }}
        onDateSelect={(date) => { setSelectedDate(date); setViewMode('day'); }}
        onFilterChange={() => {}}
        onShowStats={() => setModal('statistics')}
        onShowSettings={() => setModal('settings')}
        onShowHelp={() => setModal('help')}
      />
      <MainContent 
        viewMode={viewMode} 
        selectedStudent={selectedStudent} 
        selectedDate={selectedDate} 
        onEditEntry={() => setModal('entry')} 
      />
      
      {modal === 'student' && <StudentModal onClose={() => setModal(null)} />}
      {modal === 'entry' && <EntryModal onClose={() => setModal(null)} />}
      {modal === 'settings' && <SettingsModal onClose={() => setModal(null)} />}
      {modal === 'statistics' && <StatisticsModal onClose={() => setModal(null)} />}
      {modal === 'help' && <HelpModal onClose={() => setModal(null)} />}
    </div>
  );
};

export default App;
