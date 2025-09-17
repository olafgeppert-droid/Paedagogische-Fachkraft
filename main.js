// main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';

import Header from './components/Header.js';
import Navigation from './components/Navigation.js';
import Toolbar from './components/Toolbar.js';
import StudentDetails from './components/StudentDetails.js';
import DayDetails from './components/DayDetails.js';
import StudentModal from './components/StudentModal.js';
import EntryModal from './components/EntryModal.js';
import SettingsModal from './components/SettingsModal.js';
import HelpModal from './components/HelpModal.js';

const App = () => {
    const [selectedStudent, setSelectedStudent] = React.useState(null);
    const [selectedDate, setSelectedDate] = React.useState(new Date());

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
            <HelpModal />
        </div>
    );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
