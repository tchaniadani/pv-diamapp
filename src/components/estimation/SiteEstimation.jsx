import { useState } from "react"
import SurfaceCalculator from "./SurfaceCalculator"
import PanelEstimator from "./PanelEstimator"
import MaterialsEstimator from "./MaterialsEstimator"

/**
 * Composant principal pour les estimations sur site
 * Permet d'estimer la surface, le nombre de panneaux et les matériaux nécessaires
 */
const SiteEstimation = () => {
  // État pour suivre l'outil actif
  const [activeTool, setActiveTool] = useState("surface")

  // État pour stocker les résultats des calculs
  const [surfaceResult, setSurfaceResult] = useState(null)
  const [panelResult, setPanelResult] = useState(null)
  const [materialsResult, setMaterialsResult] = useState(null)

  /**
   * Gère le changement d'outil
   * @param {string} tool - L'outil à activer
   */
  const handleToolChange = (tool) => {
    setActiveTool(tool)
  }

  /**
   * Gère la validation du résultat de surface
   * @param {Object} result - Le résultat du calcul de surface
   */
  const handleSurfaceResult = (result) => {
    setSurfaceResult(result)
    // Passer automatiquement à l'outil suivant
    setActiveTool("panels")
  }

  /**
   * Gère la validation du résultat de panneaux
   * @param {Object} result - Le résultat du calcul de panneaux
   */
  const handlePanelResult = (result) => {
    setPanelResult(result)
    // Passer automatiquement à l'outil suivant
    setActiveTool("materials")
  }

  /**
   * Gère la validation du résultat de matériaux
   * @param {Object} result - Le résultat du calcul de matériaux
   */
  const handleMaterialsResult = (result) => {
    setMaterialsResult(result)
  }

  return (
    <div className="estimation-container">
      <h1>📈📐Mesures et Estimation sur site</h1>
      <h3>Utilisez ces outils pour estimer la surface disponible, le nombre de panneaux possibles et les matériaux nécessaires pour votre installation.</h3>

      <div className="estimation-tools">
        <div className="tool-tabs">
          <button
            className={`tool-tab ${activeTool === "surface" ? "active" : ""}`}
            onClick={() => handleToolChange("surface")}
          >
            Surface disponible
          </button>
          <button
            className={`tool-tab ${activeTool === "panels" ? "active" : ""}`}
            onClick={() => handleToolChange("panels")}
            disabled={!surfaceResult}
          >
            Nombre de panneaux
          </button>
          <button
            className={`tool-tab ${activeTool === "materials" ? "active" : ""}`}
            onClick={() => handleToolChange("materials")}
            disabled={!panelResult}
          >
            Matériaux nécessaires
          </button>
        </div>

        <div className="tool-content">
          {activeTool === "surface" && <SurfaceCalculator onCalculate={handleSurfaceResult} />}

          {activeTool === "panels" && surfaceResult && (
            <PanelEstimator surfaceData={surfaceResult} onCalculate={handlePanelResult} />
          )}

          {activeTool === "materials" && panelResult && (
            <MaterialsEstimator panelData={panelResult} onCalculate={handleMaterialsResult} />
          )}
        </div>

        {/* Résumé des résultats */}
        {(surfaceResult || panelResult || materialsResult) && (
          <div className="estimation-summary">
            <h3>Résumé de l'estimation</h3>

            {surfaceResult && (
              <div className="summary-item">
                <h4>Résultat du calcul de surface</h4>
                <p>
                  Surface totale: <strong>{surfaceResult.totalArea} m²</strong>
                </p>
                <p>
                  Surface utilisable: <strong>{surfaceResult.usableArea} m²</strong> ({surfaceResult.usagePercentage}%)
                </p>
              </div>
            )}

            {panelResult && (
              <div className="summary-item">
                <h4>Résultat du calcul de panneaux</h4>
                <p>
                  Dimensions du panneau:{" "}
                  <strong>
                    {panelResult.panelWidth} × {panelResult.panelLength} m
                  </strong>
                </p>
                <p>
                  Nombre maximal de panneaux: <strong>{panelResult.maxPanels}</strong>
                </p>
                <p>
                  Puissance totale: <strong>{panelResult.totalPower} Wc</strong>
                </p>
              </div>
            )}

            {materialsResult && (
              <div className="summary-item">
                <h4>Résultat du calcul de matériaux</h4>
                <p>
                  Nombre de clams: <strong>{materialsResult.clamps}</strong>
                </p>
                <p>
                  Nombre de rails: <strong>{materialsResult.rails}</strong>
                </p>
                <p>
                  Poids total: <strong>{materialsResult.totalWeight} kg</strong>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SiteEstimation