// src/components/sizing/DirectNeedSizing.jsx
import React, { useState } from 'react';

const DirectNeedSizing = ({ onEnergyNeedValidated }) => {
  // État pour stocker le besoin énergétique saisi
  const [energyNeed, setEnergyNeed] = useState('');

  /**
   * Gère la soumission du formulaire
   * @param {Event} e - L'événement de soumission
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    const numericNeed = Number.parseFloat(energyNeed);

    // Vérification de validité
    if (!energyNeed || isNaN(numericNeed) || numericNeed <= 0) {
      alert("Veuillez entrer un besoin énergétique valide en Wh.");
      return;
    }

    // Appeler la fonction de validation du parent
    onEnergyNeedValidated(numericNeed);
  };

  return (
    <div className="direct-need-sizing">
      <h3>🎯Insertion directe du besoin énergétique</h3>
      <p className="sizing-help">
        Entrez votre besoin énergétique total directement en Wh par jour.
      </p>

      <form onSubmit={handleSubmit} className="direct-need-form">
        <div className="form-group">
          <label htmlFor="energyNeed">Besoin énergétique (Wh/jour):</label>
          <input
            type="number"
            id="energyNeed"
            value={energyNeed}
            onChange={(e) => setEnergyNeed(e.target.value)}
            placeholder="Ex: 3500"
            min="0"
            step="0.1"
            className="input-primary"
            required
          />
        </div>

        <button type="submit" className="btn-success">
          ✅ Valider et continuer
        </button>
      </form>
    </div>
  );
};

export default DirectNeedSizing;