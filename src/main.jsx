import React from 'react'
import { createRoot } from 'react-dom/client'
import app from './app.jsx'
// ALTE CSS-IMPORTS ENTFERNT
// import '../styles/main.css'
// import '../styles/components.css'

// NEUE CSS-IMPORTS
import '../styles/theme-variables.css'
import '../styles/layout-base.css'
import '../styles/components-3d.css'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(React.createElement(app))
