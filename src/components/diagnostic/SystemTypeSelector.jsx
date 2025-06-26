"use client"

const SystemTypeSelector = ({ onSystemSelect, onBack }) => {
  const systemTypes = [
    {
      id: "autonome",
      name: "Système Autonome",
      description: "Installation isolée avec batteries",
      icon: "🏠",
      components: ["Panneaux", "Régulateur", "Batteries", "Onduleur"],
    },
    {
      id: "hybride",
      name: "Système Hybride",
      description: "Installation connectée au réseau avec batteries",
      icon: "🔄",
      components: ["Panneaux", "Onduleur Hybride", "Batteries", "Réseau ENEO"],
    },
    {
      id: "connecte",
      name: "Système Connecté",
      description: "Installation connectée au réseau sans batteries",
      icon: "🔌",
      components: ["Panneaux", "Onduleur", "Réseau ENEO"],
    },
    {
      id: "pompage",
      name: "Pompage Solaire",
      description: "Système dédié au pompage d'eau",
      icon: "💧",
      components: ["Panneaux", "Contrôleur de Pompe", "Pompe"],
    },
  ]

  return (
    <div className="system-type-selector">
      <h4>→Sélectionnez le type de votre système photovoltaïque :</h4>

      <div className="system-types-grid">
        {systemTypes.map((system) => (
          <div key={system.id} className="system-type-card" onClick={() => onSystemSelect(system.id)}>
            <div className="system-icon">{system.icon}</div>
            <h5>{system.name}</h5>
            <p>{system.description}</p>
            <div className="components-list">
              <strong>Composants :</strong>
              <ul>
                {system.components.map((component, index) => (
                  <li key={index}>{component}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="selector-actions">
        <button onClick={onBack} className="btn-secondary">
          ← Retour
        </button>
      </div>
    </div>
  )
}

export default SystemTypeSelector
