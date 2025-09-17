/** @jsxImportSource react */
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

// Komponenten importieren
import Header from './components/Header.js';
import Navigation from './components/Navigation.js';
import Toolbar from './components/Toolbar.js';
import StudentDetails from './components/MainContent.js';
import DayDetails from './components/MainContent.js';
import StudentModal from './components/StudentModal.js';
import EntryModal from './components/EntryModal.js';
import SettingsModal from './components/SettingsModal.js';
import StatisticsModal from './components/StatisticsModal.js';
import HelpModal from './components/HelpModal.js';

const App = () => {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());

    return (
        <div className="app">
            <Header />
            <Navigation />
            <Toolbar
                selectedStudent={selectedStudent}
                selectedDate={selectedDate}
                onAddStudent={() => {}}
                onEditStudent={() => {}}
                onAddEntry={() => {}}
                onEditEntry={() => {}}
                onPrint={() => {}}
                onExport={() => {}}
                onImport={() => {}}
                onUndo={() => {}}
                onRedo={() => {}}
                canUndo={false}
                canRedo={false}
            />
            <main className="main">
                <StudentDetails student={selectedStudent} />
                <DayDetails date={selectedDate} />
            </main>
            <StudentModal />
            <EntryModal />
            <SettingsModal />
            <StatisticsModal />
            <HelpModal />
        </div>
    );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
