import { useState, useEffect } from "react"

/**
 * Composant pour estimer les matériaux nécessaires
 * @param {Object} props - Les propriétés du composant
 * @param {Object} props.panelData - Les données des panneaux calculées
 * @param {Function} props.onCalculate - Fonction appelée lors du calcul
 */
const MaterialsEstimator = ({ panelData, onCalculate }) => {
  // États pour les paramètres de calcul des matériaux
  const [mountingType, setMountingType] = useState("roof")
  const [railsPerPanel, setRailsPerPanel] = useState("2")
  const [clampsPerPanel, setClampsPerPanel] = useState("4")
  const [result, setResult] = useState(null)

  // Mettre à jour les valeurs par défaut en fonction du type de montage
  useEffect(() => {
    if (mountingType === "roof") {
      setRailsPerPanel("2")
      setClampsPerPanel("4")
    } else if (mountingType === "ground") {
      setRailsPerPanel("3")
      setClampsPerPanel("6")
    }
  }, [mountingType])

  /**
   * Calcule les matériaux nécessaires
   */
  const calculateMaterials = () => {
    // Vérifier que les valeurs sont valides
    if (
      !railsPerPanel ||
      !clampsPerPanel ||
      isNaN(Number(railsPerPanel)) ||
      isNaN(Number(clampsPerPanel)) ||
      Number(railsPerPanel) <= 0 ||
      Number(clampsPerPanel) <= 0
    ) {
      alert("Veuillez entrer des données de matériaux valides.")
      return
    }

    // Récupérer le nombre de panneaux
    const { maxPanels, panelWidth } = panelData

    // Calculer le nombre de rails
    // Pour les rails, on considère la longueur standard de 4m
    const railLength = 4 // mètres
    const totalRailLength = maxPanels * Number(railsPerPanel) * panelWidth
    const rails = Math.ceil(totalRailLength / railLength)

    // Calculer le nombre de clams
    const clamps = maxPanels * Number(clampsPerPanel)
    
    // Calculer le poids total approximatif
    // Poids approximatif d'un panneau standard: 20kg
    const panelWeight = 20 // kg
    const railWeight = 2.5 // kg par mètre
    const clampWeight = 0.1 // kg par clam

    const totalPanelWeight = maxPanels * panelWeight
    const totalRailWeight = rails * railLength * railWeight
    const totalClampWeight = clamps * clampWeight

    const totalWeight = totalPanelWeight + totalRailWeight + totalClampWeight

    // Créer l'objet résultat
    const calculationResult = {
      mountingType,
      railsPerPanel: Number(railsPerPanel),
      clampsPerPanel: Number(clampsPerPanel),
      rails,
      clamps,
      totalRailLength: Math.round(totalRailLength * 100) / 100,
      totalWeight: Math.round(totalWeight * 100) / 100,
      panelCount: maxPanels,
    }

    // Mettre à jour l'état local
    setResult(calculationResult)

    // Appeler la fonction de callback
    onCalculate(calculationResult)
  }

  return (
    <div className="materials-estimator">
      <h3>⛓️‍💥Estimation des matériaux</h3>
      <p className="tool-description">Calculez les matériaux nécessaires pour l'installation des panneaux.</p>

      <div className="calculator-form">
        <div className="form-group">
          <label htmlFor="mountingType">Type de montage:</label>
          <select
            id="mountingType"
            value={mountingType}
            onChange={(e) => setMountingType(e.target.value)}
            className="select-primary"
          >
            <option value="roof">Montage sur toit</option>
            <option value="ground">Montage au sol</option>
          </select>
          <p className="input-help">Le type de montage influence le nombre de rails et de clams nécessaires.</p>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="railsPerPanel">
              Rails par panneau:
            </label>
            <input
              type="number"
              id="railsPerPanel"
              value={railsPerPanel}
              onChange={(e) => setRailsPerPanel(e.target.value)}
              min="1"
              step="1"
              className="input-primary"
              required
            />
            <p className="input-help">Nombre de rails nécessaires pour fixer un panneau</p>
          </div>

          <div className="form-group">
            <label htmlFor="clampsPerPanel">
              Clams par panneau:
            </label>
            <input
              type="number"
              id="clampsPerPanel"
              value={clampsPerPanel}
              onChange={(e) => setClampsPerPanel(e.target.value)}
              min="2"
              step="1"
              className="input-primary"
              required
            />
            <p className="input-help">Nombre de clams nécessaires pour fixer un panneau</p>
          </div>
        </div>

        <div className="panel-info">
          <p>
            Nombre de panneaux: <strong>{panelData.maxPanels}</strong>
          </p>
          <p>
            Dimensions du panneau:{" "}
            <strong>
              {panelData.panelWidth} × {panelData.panelLength} m
            </strong>
          </p>
        </div>

        <button onClick={calculateMaterials} className="btn-primary">
          Calculer les matériaux
        </button>
      </div>

      {result && (
        <div className="calculation-result">
          <h4>Résultat du calcul de matériaux</h4>
          <div className="result-grid">
            <div className="result-item">
              <span className="result-label">Nombre de rails:</span>
              <span className="result-value">
                {result.rails} (longueur standard: 4m)
              </span>
            </div>
            <div className="result-item">
              <span className="result-label">Nombre de clams:</span>
              <span className="result-value">{result.clamps}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Longueur totale de rails:</span>
              <span className="result-value">{result.totalRailLength} m</span>
            </div>
            <div className="result-item">
              <span className="result-label">Poids total:</span>
              <span className="result-value">{result.totalWeight} kg</span>
            </div>
          </div>

          <div className="materials-visualization">
            <div className="material-icon rails">
              <div className="icon-count">{result.rails}</div>
              <div className="icon-label">Rails</div>
            </div>
            <div className="material-icon clamps">
              <div className="icon-count">{result.clamps}</div>
              <div className="icon-label">Clams</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MaterialsEstimator