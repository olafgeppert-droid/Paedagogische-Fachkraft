import React from 'react'
import { createRoot } from 'react-dom/client'
import app from './app.jsx'
import '../styles/main.css'
import '../styles/components.css'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(React.createElement(app))
