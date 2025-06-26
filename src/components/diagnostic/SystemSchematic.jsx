"use client"

const SystemSchematic = ({ systemType, onComponentSelect, onBack }) => {
  const schematics = {
    autonome: {
      title: "Système Autonome",
      description: "Cliquez sur un composant pour le diagnostiquer",
      components: [
        { id: "panneaux", name: "Panneaux Solaires", x: 20, y: 10, width: 25, height: 15 },
        { id: "regulateur", name: "Régulateur MPPT", x: 55, y: 25, width: 20, height: 10 },
        { id: "batteries", name: "Batteries", x: 55, y: 50, width: 20, height: 20 },
        { id: "onduleur", name: "Onduleur", x: 20, y: 70, width: 20, height: 15 },
      ],
      connections: [
        { from: { x: 32.5, y: 25 }, to: { x: 55, y: 30 } },
        { from: { x: 65, y: 35 }, to: { x: 65, y: 50 } },
        { from: { x: 55, y: 60 }, to: { x: 40, y: 77.5 } },
      ],
    },
    hybride: {
      title: "Système Hybride",
      description: "Cliquez sur un composant pour le diagnostiquer",
      components: [
        { id: "panneaux", name: "Panneaux Solaires", x: 15, y: 10, width: 25, height: 15 },
        { id: "onduleur", name: "Onduleur Hybride", x: 50, y: 30, width: 25, height: 20 },
        { id: "batteries", name: "Batteries", x: 15, y: 60, width: 20, height: 20 },
        { id: "reseau", name: "Réseau ENEO", x: 80, y: 60, width: 15, height: 15 },
      ],
      connections: [
        { from: { x: 27.5, y: 25 }, to: { x: 62.5, y: 30 } },
        { from: { x: 50, y: 40 }, to: { x: 35, y: 60 } },
        { from: { x: 75, y: 40 }, to: { x: 87.5, y: 60 } },
      ],
    },
    connecte: {
      title: "Système Connecté au Réseau",
      description: "Cliquez sur un composant pour le diagnostiquer",
      components: [
        { id: "panneaux", name: "Panneaux Solaires", x: 20, y: 20, width: 25, height: 15 },
        { id: "onduleur", name: "Onduleur String", x: 55, y: 35, width: 20, height: 15 },
        { id: "reseau", name: "Réseau ENEO", x: 55, y: 65, width: 20, height: 15 },
      ],
      connections: [
        { from: { x: 32.5, y: 35 }, to: { x: 65, y: 35 } },
        { from: { x: 65, y: 50 }, to: { x: 65, y: 65 } },
      ],
    },
    pompage: {
      title: "Système de Pompage Solaire",
      description: "Cliquez sur un composant pour le diagnostiquer",
      components: [
        { id: "panneaux", name: "Panneaux Solaires", x: 20, y: 15, width: 25, height: 15 },
        { id: "controleur", name: "Contrôleur de Pompe", x: 55, y: 30, width: 20, height: 15 },
        { id: "pompe", name: "Pompe Immergée", x: 55, y: 60, width: 20, height: 20 },
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
                fill="rgba(255, 255, 255, 0.2)"
                stroke="#65bdb8"
                strokeWidth="0.5"
                rx="2"
                className="component-rect"
                onClick={() => onComponentSelect(component.id)}
              />
              <text
                x={component.x + component.width / 2}
                y={component.y + component.height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="3"
                fill="white"
                className="component-text"
                onClick={() => onComponentSelect(component.id)}
              >
                {component.name}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="schematic-legend">
        <h5>Légende :</h5>
        <div className="legend-items">
          {currentSchematic.components.map((component) => (
            <div key={component.id} className="legend-item">
              <div className="legend-color"></div>
              <span>{component.name}</span>
            </div>
          ))}
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
