import { useState } from "react"

/**
 * Composant pour calculer la surface disponible pour l'installation
 * @param {Object} props - Les propriétés du composant
 * @param {Function} props.onCalculate - Fonction appelée lors du calcul
 */
const SurfaceCalculator = ({ onCalculate }) => {
  // États pour les dimensions et le pourcentage utilisable
  const [length, setLength] = useState("")
  const [width, setWidth] = useState("")
  const [usablePercentage, setUsablePercentage] = useState("70")
  const [result, setResult] = useState(null)

  /**
   * Calcule la surface totale et utilisable
   */
  const calculateSurface = () => {
    // Vérifier que les valeurs sont valides
    if (
      !length ||
      !width ||
      isNaN(Number(length)) ||
      isNaN(Number(width)) ||
      Number(length) <= 0 ||
      Number(width) <= 0
    ) {
      alert("Veuillez entrer des dimensions valides.")
      return
    }

    // Calculer la surface totale
    const totalArea = Number(length) * Number(width)

    // Calculer la surface utilisable
    const percentage = Number(usablePercentage) || 70
    const usableArea = totalArea * (percentage / 100)

    // Créer l'objet résultat
    const calculationResult = {
      length: Number(length),
      width: Number(width),
      totalArea: Math.round(totalArea * 100) / 100,
      usableArea: Math.round(usableArea * 100) / 100,
      usagePercentage: percentage,
    }

    // Mettre à jour l'état local
    setResult(calculationResult)

    // Appeler la fonction de callback
    onCalculate(calculationResult)
  }

  return (
    <div className="surface-calculator">
      <h3>Calculateur de surface</h3>
      <p className="tool-description">Mesurez la surface disponible pour votre installation photovoltaïque.</p>

      <div className="calculator-form">
        <div className="form-group">
          <label htmlFor="length">Longueur (m):</label>
          <input
            type="number"
            id="length"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            placeholder="Ex: 10"
            min="0.1"
            step="0.1"
            className="input-primary"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="width">Largeur (m):</label>
          <input
            type="number"
            id="width"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            placeholder="Ex: 8"
            min="0.1"
            step="0.1"
            className="input-primary"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="usablePercentage">
            Pourcentage utilisable (%):
          </label>
          <input
            type="range"
            id="usablePercentage"
            value={usablePercentage}
            onChange={(e) => setUsablePercentage(e.target.value)}
            min="10"
            max="100"
            step="5"
            className="range-slider"
          />
          <div className="range-value">{usablePercentage}%</div>
          <p className="input-help">Pourcentage de la surface totale qui peut être utilisée pour l'installation (tenant compte des obstacles, de l'ombrage, etc.)</p>
        </div>

        <button onClick={calculateSurface} className="btn-primary">
          Calculer la surface
        </button>
      </div>

      {result && (
        <div className="calculation-result">
          <h4>Résultat du calcul de surface</h4>
          <div className="result-grid">
            <div className="result-item">
              <span className="result-label">Surface totale:</span>
              <span className="result-value">{result.totalArea} m²</span>
            </div>
            <div className="result-item">
              <span className="result-label">Surface utilisable:</span>
              <span className="result-value">{result.usableArea} m²</span>
            </div>
          </div>

          <div className="surface-visualization">
            <div
              className="total-area"
              style={{
                width: `${Math.min(300, result.width * 20)}px`,
                height: `${Math.min(200, result.length * 20)}px`,
              }}
            >
              <div
                className="usable-area"
                style={{
                  width: `${result.usagePercentage}%`,
                  height: `${result.usagePercentage}%`,
                }}
              >
                <span>Utilisable</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SurfaceCalculator