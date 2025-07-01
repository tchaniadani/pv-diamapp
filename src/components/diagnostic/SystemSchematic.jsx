"use client"

const SystemSchematic = ({ systemType, onComponentSelect, onBack }) => {
  const schematics = {
    autonome: {
      title: "→Système Autonome",
      description: "Cliquez sur les composants diagnosticables (onduleur, régulateur)",
      components: [
        { id: "panneaux", name: "Panneaux Solaires", x: 20, y: 10, width: 25, height: 15, clickable: false },
        { id: "regulateur", name: "Régulateur MPPT", x: 55, y: 25, width: 20, height: 10, clickable: true },
        { id: "batteries", name: "Batteries", x: 55, y: 50, width: 20, height: 20, clickable: false },
        { id: "onduleur", name: "Onduleur", x: 20, y: 70, width: 20, height: 15, clickable: true },
      ],
      connections: [
        { from: { x: 32.5, y: 25 }, to: { x: 55, y: 30 } },
        { from: { x: 65, y: 35 }, to: { x: 65, y: 50 } },
        { from: { x: 55, y: 60 }, to: { x: 40, y: 77.5 } },
      ],
    },
    hybride: {
      title: "→Système Hybride",
      description: "Cliquez sur les composants diagnosticables (onduleur hybride)",
      components: [
        { id: "panneaux", name: "Panneaux Solaires", x: 15, y: 10, width: 25, height: 15, clickable: false },
        { id: "onduleur", name: "Onduleur Hybride", x: 50, y: 30, width: 25, height: 20, clickable: true },
        { id: "batteries", name: "Batteries", x: 15, y: 60, width: 20, height: 20, clickable: false },
        { id: "reseau", name: "Réseau ENEO", x: 80, y: 60, width: 15, height: 15, clickable: false },
      ],
      connections: [
        { from: { x: 27.5, y: 25 }, to: { x: 62.5, y: 30 } },
        { from: { x: 50, y: 40 }, to: { x: 35, y: 60 } },
        { from: { x: 75, y: 40 }, to: { x: 87.5, y: 60 } },
      ],
    },
    connecte: {
      title: "→Système Connecté au Réseau",
      description: "Cliquez sur les composants diagnosticables (onduleur string)",
      components: [
        { id: "panneaux", name: "Panneaux Solaires", x: 20, y: 20, width: 25, height: 15, clickable: false },
        { id: "onduleur", name: "Onduleur String", x: 55, y: 35, width: 20, height: 15, clickable: true },
        { id: "reseau", name: "Réseau ENEO", x: 55, y: 65, width: 20, height: 15, clickable: false },
      ],
      connections: [
        { from: { x: 32.5, y: 35 }, to: { x: 65, y: 35 } },
        { from: { x: 65, y: 50 }, to: { x: 65, y: 65 } },
      ],
    },
    pompage: {
      title: "→Système de Pompage Solaire",
      description: "Cliquez sur les composants diagnosticables (contrôleur de pompe)",
      components: [
        { id: "panneaux", name: "Panneaux Solaires", x: 20, y: 15, width: 25, height: 15, clickable: false },
        { id: "controleur", name: "Contrôleur de Pompe", x: 55, y: 30, width: 20, height: 15, clickable: true },
        { id: "pompe", name: "Pompe Immergée", x: 55, y: 60, width: 20, height: 20, clickable: false },
      ],
      connections: [
        { from: { x: 32.5, y: 30 }, to: { x: 65, y: 30 } },
        { from: { x: 65, y: 45 }, to: { x: 65, y: 60 } },
      ],
    },
  }

  const currentSchematic = schematics[systemType]

  if (!currentSchematic) {
    return <div>Schéma non disponible pour ce type de système</div>
  }

  const handleComponentClick = (component) => {
    if (!component.clickable) {
      // Afficher un message pour les composants non cliquables
      alert(
        `${component.name} : Diagnostic non disponible pour ce composant. Seuls les onduleurs et contrôleurs sont diagnosticables par code d'erreur.`,
      )
      return
    }

    // Mapper les composants vers les types corrects pour la base de données
    let componentType = component.id
    if (component.id === "regulateur") {
      componentType = "controleur" // Utiliser la même base de données que les contrôleurs
    }

    onComponentSelect(componentType)
  }

  return (
    <div className="system-schematic">
      <h4>{currentSchematic.title}</h4>
      <p className="schematic-description">{currentSchematic.description}</p>

      <div className="schematic-container">
        <svg viewBox="0 0 100 100" className="schematic-svg">
          {/* Connexions */}
          {currentSchematic.connections.map((connection, index) => (
            <line
              key={index}
              x1={connection.from.x}
              y1={connection.from.y}
              x2={connection.to.x}
              y2={connection.to.y}
              stroke="#fcd34d"
              strokeWidth="0.5"
              markerEnd="url(#arrowhead)"
            />
          ))}

          {/* Flèche pour les connexions */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#fcd34d" />
            </marker>
          </defs>

          {/* Composants */}
          {currentSchematic.components.map((component) => (
            <g key={component.id}>
              <rect
                x={component.x}
                y={component.y}
                width={component.width}
                height={component.height}
                fill={component.clickable ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.1)"}
                stroke={component.clickable ? "#65bdb8" : "#888888"}
                strokeWidth="0.5"
                rx="2"
                className={component.clickable ? "component-rect clickable" : "component-rect non-clickable"}
                onClick={() => handleComponentClick(component)}
                style={{ cursor: component.clickable ? "pointer" : "default" }}
              />
              <text
                x={component.x + component.width / 2}
                y={component.y + component.height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="3"
                fill={component.clickable ? "white" : "#cccccc"}
                className={component.clickable ? "component-text clickable" : "component-text non-clickable"}
                onClick={() => handleComponentClick(component)}
                style={{ cursor: component.clickable ? "pointer" : "default" }}
              >
                {component.name}
              </text>
              {/* Indicateur visuel pour les composants cliquables */}
              {component.clickable && (
                <circle
                  cx={component.x + component.width - 3}
                  cy={component.y + 3}
                  r="1.5"
                  fill="#00ff00"
                  className="clickable-indicator"
                />
              )}
            </g>
          ))}
        </svg>
      </div>

      <div className="schematic-legend">
        <h5>Légende :</h5>
        <div className="legend-items">
          {currentSchematic.components.map((component) => (
            <div key={component.id} className="legend-item">
              <div
                className="legend-color"
                style={{
                  backgroundColor: component.clickable ? "#65bdb8" : "#888888",
                  opacity: component.clickable ? 1 : 0.5,
                }}
              ></div>
              <span style={{ color: component.clickable ? "white" : "#cccccc" }}>
                {component.name} {component.clickable && "🔍"}
              </span>
            </div>
          ))}
        </div>
        <div className="legend-note">
          <p>🔍 = Composant diagnosticable par code d'erreur</p>
        </div>
      </div>

      <div className="schematic-actions">
        <button onClick={onBack} className="btn-secondary">
          ← Retour au mode de diagnostic
        </button>
      </div>
    </div>
  )
}

export default SystemSchematic
