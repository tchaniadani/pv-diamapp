"use client"

const DiagnosticModeSelector = ({ systemType, onModeSelect, onBack }) => {
  const diagnosticModes = [
    {
      id: "guided",
      name: "Diagnostic Guidé",
      description: "Diagnostic pas à pas avec questions-réponses pour identifier le problème",
      icon: "🧭",
      features: [
        "Questions guidées",
        "Arbre de décision intelligent",
        "Adapté au type de système",
        "Recommandations personnalisées",
      ],
    },
    {
      id: "schematic",
      name: "Diagnostic par Schéma",
      description: "Identification visuelle des composants via schéma interactif",
      icon: "📋",
      features: [
        "Schéma interactif",
        "Identification visuelle",
        "Diagnostic par code d'erreur",
        "Base de données constructeurs",
      ],
    },
  ]

  const getSystemTypeName = (type) => {
    const names = {
      autonome: "Système Autonome",
      hybride: "Système Hybride",
      connecte: "Système Connecté",
      pompage: "Pompage Solaire",
    }
    return names[type] || type
  }

  return (
    <div className="diagnostic-mode-selector">
      <h4>
        →Choisissez un mode de diagnostic pour votre {" "}
        <span className="system-type-highlight">{getSystemTypeName(systemType)}</span>
      </h4>

      <div className="diagnostic-modes-grid">
        {diagnosticModes.map((mode) => (
          <div key={mode.id} className="diagnostic-mode-card" onClick={() => onModeSelect(mode.id)}>
            <div className="mode-icon">{mode.icon}</div>
            <h5>{mode.name}</h5>
            <p>{mode.description}</p>
            <div className="features-list">
              <strong>Fonctionnalités :</strong>
              <ul>
                {mode.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <div className="mode-recommendation">
              {mode.id === "guided" && (
                <span className="recommendation-badge recommended">🌟 Recommandé si panne non spécifique</span>
              )}
              {mode.id === "schematic" && (
                <span className="recommendation-badge expert">⚡ Recommandé si panne spécifique</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mode-selector-actions">
        <button onClick={onBack} className="btn-secondary">
          ← Retour au type de système
        </button>
      </div>
    </div>
  )
}

export default DiagnosticModeSelector
