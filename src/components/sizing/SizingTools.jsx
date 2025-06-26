// src/components/sizing/SizingTools.jsx
import React, { useState } from 'react';
import EquipmentsSizing from './EquipmentsSizing';
import DirectNeedSizing from './DirectNeedSizing';
import ParametresDimensionnement from './ParametresDimensionnement';
import ResultatsDimensionnement from './ResultatsDimensionnement';

const SizingTools = () => {
  // État pour suivre l'onglet actif
  const [activeSubTab, setActiveSubTab] = useState('equipments');
  
  // État pour stocker le besoin énergétique calculé
  const [energyNeed, setEnergyNeed] = useState(null);
  
  // État pour suivre l'étape du processus
  const [currentStep, setCurrentStep] = useState('method'); // 'method', 'parameters', 'results'
  
  // État pour stocker les résultats du dimensionnement
  const [resultatsData, setResultatsData] = useState(null);

  /**
   * Gère le changement d'onglet
   * @param {string} tab - L'onglet à activer
   */
  const handleTabChange = (tab) => {
    setActiveSubTab(tab);
    // Réinitialiser le besoin énergétique lors du changement d'onglet
    setEnergyNeed(null);
    setCurrentStep('method');
    setResultatsData(null);
  };

  /**
   * Gère la validation du besoin énergétique
   * @param {number} need - Le besoin énergétique calculé
   */
  const handleEnergyNeedValidation = (need) => {
    setEnergyNeed(need);
    setCurrentStep('parameters');
  };

  /**
   * Revient à l'étape précédente
   */
  const handleBack = () => {
    if (currentStep === 'parameters') {
      setCurrentStep('method');
    } else if (currentStep === 'results') {
      setCurrentStep('parameters');
    }
  };

  /**
   * Gère les résultats des calculs de dimensionnement
   * @param {Object} data - Les données de résultats
   */
  const handleResultatsCalcules = (data) => {
    setResultatsData(data);
    setCurrentStep('results');
  };

  /**
   * Simule l'exportation en PDF
   */
  const handleExportPDF = () => {
    alert("Le PDF a été généré et téléchargé.");
    // Ici, vous pourriez implémenter la génération réelle du PDF
  };

  return (
    <div className="form-container">
      <h1>➗📐Outils de Dimensionnement</h1>
      <h3 className="petit-label">Effectuez un dimensionnement pour votre future installation.</h3>

      {currentStep === 'method' && (
        <>
          

          <ul className="nav-tabs">
            <li
              className={activeSubTab === 'equipments' ? 'active' : ''}
              onClick={() => handleTabChange('equipments')}
            >
              📺Par équipements
            </li>
            <li
              className={activeSubTab === 'direct' ? 'active' : ''}
              onClick={() => handleTabChange('direct')}
            >
              🎯Besoin direct
            </li>
          </ul>

          <div className="app-content">
            {activeSubTab === 'equipments' && (
              <EquipmentsSizing onEnergyNeedValidated={handleEnergyNeedValidation} />
            )}
            {activeSubTab === 'direct' && (
              <DirectNeedSizing onEnergyNeedValidated={handleEnergyNeedValidation} />
            )}
          </div>
        </>
      )}

      {currentStep === 'parameters' && energyNeed && (
        <ParametresDimensionnement 
          besoinEnergetique={energyNeed} 
          onRetour={handleBack}
          onResultatsCalcules={handleResultatsCalcules}
        />
      )}

      {currentStep === 'results' && resultatsData && (
        <ResultatsDimensionnement 
          donnees={resultatsData} 
          onRetour={handleBack}
          onExportPDF={handleExportPDF}
        />
      )}
    </div>
  );
};

export default SizingTools;