// src/App.js
import React, { useState } from 'react';
import DiagnosticMaintenance from './components/diagnostic/DiagnosticMaintenance';
import SizingTools from './components/sizing/SizingTools'; 
import SiteEstimation from "./components/estimation/SiteEstimation"
import './styles.css';

function App() {
  const [activeTab, setActiveTab] = useState('diagnostic');

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-top">
          <h1 className="NameApp">🟢🟡PV DiaMapp</h1>
        </div>

        <nav>
          <ul className="nav-tabs">
            <li 
              className={activeTab === 'diagnostic' ? 'active' : ''} 
              onClick={() => setActiveTab('diagnostic')}
            >
              🛠️⚙️Diagnostic & Maintenance
            </li>
            <li 
              className={activeTab === 'sizing' ? 'active' : ''} 
              onClick={() => setActiveTab('sizing')}
            >
              ➗✖️Outils de Dimensionnement
            </li>
            <li 
              className={activeTab === 'estimation' ? 'active' : ''} 
              onClick={() => setActiveTab('estimation')}
            >
              📈📐Mesures & Estimation
            </li>
          </ul>
        </nav>
      </header>

      <main className="app-content">
        {activeTab === 'diagnostic' && <DiagnosticMaintenance />}
        {activeTab === 'sizing' && <SizingTools />} {/* Modifiez cette ligne */}
        {activeTab === 'estimation' && <SiteEstimation/>}
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} 🟢🟡PV DiaMapp - Tous droits réservés</p>
      </footer>
    </div>
  );
}

export default App;