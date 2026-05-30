// main.jsx — Application entry point. Mounts <App/> and imports global styles.

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Import the master stylesheet (which @imports all style modules).
import './styles/main.css'

// Leaflet marker icons need a small fix when bundled — set default icon URLs
// to the CDN assets so markers render correctly.
import L from 'leaflet'
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Mount the React app into #root.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
