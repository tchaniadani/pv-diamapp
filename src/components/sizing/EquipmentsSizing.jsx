// src/components/sizing/EquipmentsSizing.jsx
import React, { useState } from 'react';

const EquipmentsSizing = ({ onEnergyNeedValidated }) => {
  // État pour stocker la liste des équipements
  const [equipements, setEquipements] = useState([
    { id: 1, nom: '', puissance: '', duree: '' }
  ]);
  
  // État pour stocker le besoin énergétique total calculé
  const [besoinTotal, setBesoinTotal] = useState(null);

  /**
   * Gère les changements dans les champs d'un équipement
   * @param {number} id - L'ID de l'équipement
   * @param {string} field - Le champ à modifier
   * @param {string} value - La nouvelle valeur
   */
  const handleChange = (id, field, value) => {
    setEquipements(prev => 
      prev.map(eq => eq.id === id ? { ...eq, [field]: value } : eq)
    );
  };

  /**
   * Ajoute un nouvel équipement à la liste
   */
  const ajouterEquipement = () => {
    const newId = Math.max(0, ...equipements.map(e => e.id)) + 1;
    setEquipements([...equipements, { id: newId, nom: '', puissance: '', duree: '' }]);
  };

  /**
   * Supprime un équipement de la liste
   * @param {number} id - L'ID de l'équipement à supprimer
   */
  const supprimerEquipement = (id) => {
    if (equipements.length > 1) {
      setEquipements(equipements.filter(eq => eq.id !== id));
    }
  };

  /**
   * Calcule le besoin énergétique total
   */
  const calculerBesoin = () => {
    // Vérifier si tous les champs nécessaires sont remplis
    const incompletEquipment = equipements.find(eq => 
      !eq.puissance || !eq.duree || 
      isNaN(Number.parseFloat(eq.puissance)) || 
      isNaN(Number.parseFloat(eq.duree))
    );

    if (incompletEquipment) {
      alert("Veuillez compléter les informations pour tous les équipements.");
      return;
    }

    const total = equipements.reduce((acc, eq) => {
      const p = Number.parseFloat(eq.puissance) || 0;
      const d = Number.parseFloat(eq.duree) || 0;
      return acc + (p * d);
    }, 0);

    setBesoinTotal(Math.round(total * 100) / 100); // Arrondi à 2 décimales
  };

  /**
   * Valide le besoin énergétique et passe à l'étape suivante
   */
  const validerEtContinuer = () => {
    if (besoinTotal && besoinTotal > 0) {
      onEnergyNeedValidated(besoinTotal);
    } else {
      alert("Veuillez d'abord calculer un besoin énergétique valide.");
    }
  };

  return (
    <div className="equipment-sizing">
      <h3>📺Dimensionnement par équipements</h3>
      <p className="sizing-help">
        Ajoutez vos équipements un par un avec leur puissance et durée d'utilisation quotidienne.
      </p>

      <div className="equipment-list">
        {equipements.map(eq => (
          <div key={eq.id} className="equipment-item">
            <div className="equipment-fields">
              <div className="form-group">
                <label>Nom de l'équipement:</label>
                <input
                  type="text"
                  value={eq.nom}
                  onChange={(e) => handleChange(eq.id, 'nom', e.target.value)}
                  placeholder="Ex: Frigo"
                  className="input-primary"
                />
              </div>

              <div className="form-group">
                <label>Puissance (W):</label>
                <input
                  type="number"
                  value={eq.puissance}
                  onChange={(e) => handleChange(eq.id, 'puissance', e.target.value)}
                  placeholder="Ex: 100"
                  min="0"
                  step="0.1"
                  className="input-primary"
                />
              </div>

              <div className="form-group">
                <label>Durée d'utilisation (h/jour):</label>
                <input
                  type="number"
                  value={eq.duree}
                  onChange={(e) => handleChange(eq.id, 'duree', e.target.value)}
                  placeholder="Ex: 5"
                  min="0"
                  max="24"
                  step="0.1"
                  className="input-primary"
                />
              </div>
            </div>

            {equipements.length > 1 && (
              <button
                type="button"
                onClick={() => supprimerEquipement(eq.id)}
                className="btn-danger"
                title="Supprimer cet équipement"
              >
                ❌
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="equipment-actions">
        <button onClick={ajouterEquipement} className="btn-secondary">
          ➕ Ajouter un équipement
        </button>

        <button onClick={calculerBesoin} className="btn-primary">
          ⚡ Calculer le besoin
        </button>
      </div>

      {besoinTotal !== null && (
        <div className="energy-need-result">
          <h4>Résultat du calcul</h4>
          <p className="energy-need-value">
            {besoinTotal} <span className="energy-unit">Wh/jour</span>
          </p>

          <button onClick={validerEtContinuer} className="btn-success">
            ✅ Valider et continuer
          </button>
        </div>
      )}
    </div>
  );
};

export default EquipmentsSizing;