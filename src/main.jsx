import React from 'react'
import { createRoot } from 'react-dom/client'

// Komponenten importieren
import Header from './components/Header.jsx'
import Navigation from './components/Navigation.jsx'
import Toolbar from './components/Toolbar.jsx'
import StudentDetails from './components/StudentDetails.jsx'
import DayDetails from './components/DayDetails.jsx'
import StudentModal from './components/StudentModal.jsx'
import EntryModal from './components/EntryModal.jsx'
import SettingsModal from './components/SettingsModal.jsx'
import HelpModal from './components/HelpModal.jsx'

import './styles/main.css'
import './styles/components.css'

const App = () => {
  const [selectedStudent, setSelectedStudent] = React.useState(null)
  const [selectedDate, setSelectedDate] = React.useState(new Date())

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
  )
}

const container = document.getElementById('root')
const root = createRoot(container)
root.render(<App />)
