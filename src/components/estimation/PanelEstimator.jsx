import { useState } from "react"

/**
 * Composant pour estimer le nombre de panneaux solaires
 * @param {Object} props - Les propriétés du composant
 * @param {Object} props.surfaceData - Les données de surface calculées
 * @param {Function} props.onCalculate - Fonction appelée lors du calcul
 */
const PanelEstimator = ({ surfaceData, onCalculate }) => {
  // États pour les dimensions des panneaux et leur puissance
  const [panelLength, setPanelLength] = useState("1.7")
  const [panelWidth, setPanelWidth] = useState("1.0")
  const [panelPower, setPanelPower] = useState("330")
  const [spacing, setSpacing] = useState("0.1")
  const [result, setResult] = useState(null)

  // Options prédéfinies pour les panneaux
  const panelOptions = [
    { length: 1.7, width: 1.0, power: 330 },
    { length: 1.8, width: 1.1, power: 450 },
    { length: 2.0, width: 1.2, power: 550 },
  ]

  // Mettre à jour les dimensions et la puissance lorsqu'une option est sélectionnée
  const handlePanelOptionChange = (e) => {
    const selectedIndex = e.target.value
    if (selectedIndex !== "") {
      const option = panelOptions[selectedIndex]
      setPanelLength(option.length.toString())
      setPanelWidth(option.width.toString())
      setPanelPower(option.power.toString())
    }
  }

  /**
   * Calcule le nombre maximal de panneaux
   */
  const calculatePanels = () => {
    // Vérifier que les valeurs sont valides
    if (
      !panelLength ||
      !panelWidth ||
      !panelPower ||
      !spacing ||
      isNaN(Number(panelLength)) ||
      isNaN(Number(panelWidth)) ||
      isNaN(Number(panelPower)) ||
      isNaN(Number(spacing)) ||
      Number(panelLength) <= 0 ||
      Number(panelWidth) <= 0 ||
      Number(panelPower) <= 0
    ) {
      alert("Veuillez entrer des données de panneau valides.")
      return
    }

    // Récupérer la surface utilisable
    const { usableArea } = surfaceData

    // Calculer la surface d'un panneau avec espacement
    const effectivePanelLength = Number(panelLength) + Number(spacing)
    const effectivePanelWidth = Number(panelWidth) + Number(spacing)
    const panelArea = effectivePanelLength * effectivePanelWidth

    // Calculer le nombre maximal de panneaux
    const maxPanels = Math.floor(usableArea / panelArea)

    // Calculer la puissance totale
    const totalPower = maxPanels * Number(panelPower)

    // Créer l'objet résultat
    const calculationResult = {
      panelLength: Number(panelLength),
      panelWidth: Number(panelWidth),
      panelPower: Number(panelPower),
      spacing: Number(spacing),
      panelArea: Math.round(panelArea * 100) / 100,
      maxPanels,
      totalPower,
      usableArea,
    }

    // Mettre à jour l'état local
    setResult(calculationResult)

    // Appeler la fonction de callback
    onCalculate(calculationResult)
  }

  return (
    <div className="panel-estimator">
      <h3>🧮Estimation du nombre de panneaux</h3>
      <p className="tool-description">Calculez combien de panneaux peuvent être installés sur la surface disponible.</p>

      <div className="calculator-form">
        <div className="form-group">
          <label htmlFor="panelOption">Modèle de panneau:</label>
          <select id="panelOption" onChange={handlePanelOptionChange} className="select-primary">
            <option value="">Panneau personnalisé</option>
            {panelOptions.map((option, index) => (
              <option key={index} value={index}>
                {option.length}m × {option.width}m - {option.power}Wc
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="panelLength">Longueur du panneau (m):</label>
            <input
              type="number"
              id="panelLength"
              value={panelLength}
              onChange={(e) => setPanelLength(e.target.value)}
              min="0.1"
              step="0.1"
              className="input-primary"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="panelWidth">Largeur du panneau (m):</label>
            <input
              type="number"
              id="panelWidth"
              value={panelWidth}
              onChange={(e) => setPanelWidth(e.target.value)}
              min="0.1"
              step="0.1"
              className="input-primary"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="panelPower">Puissance du panneau (Wc):</label>
            <input
              type="number"
              id="panelPower"
              value={panelPower}
              onChange={(e) => setPanelPower(e.target.value)}
              min="1"
              step="5"
              className="input-primary"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="spacing">
              Espacement (m):
            </label>
            <input
              type="number"
              id="spacing"
              value={spacing}
              onChange={(e) => setSpacing(e.target.value)}
              min="0"
              step="0.05"
              className="input-primary"
              required
            />
            <p className="input-help">Espace entre les panneaux pour l'installation et la maintenance</p>
          </div>
        </div>

        <div className="surface-info">
          <p>
            Surface disponible: <strong>{surfaceData.usableArea} m²</strong>
          </p>
        </div>

        <button onClick={calculatePanels} className="btn-primary">
          Calculer le nombre de panneaux
        </button>
      </div>

      {result && (
        <div className="calculation-result">
          <h4>Résultat du calcul de panneaux</h4>
          <div className="result-grid">
            <div className="result-item">
              <span className="result-label">Nombre maximal de panneaux:</span>
              <span className="result-value">{result.maxPanels}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Puissance totale:</span>
              <span className="result-value">{result.totalPower} Wc</span>
            </div>
            <div className="result-item">
              <span className="result-label">Surface d'un panneau:</span>
              <span className="result-value">{result.panelArea} m²</span>
            </div>
          </div>

          <div className="panels-visualization">
            <div className="panels-container">
              {Array.from({ length: Math.min(result.maxPanels, 20) }).map((_, index) => (
                <div key={index} className="panel-item" title={`Panneau ${index + 1}`}>
                  {index === 0 && (
                    <span>{result.maxPanels > 20 ? `${result.maxPanels} panneaux` : ""}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PanelEstimator