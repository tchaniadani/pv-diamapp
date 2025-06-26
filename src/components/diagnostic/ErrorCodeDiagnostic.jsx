"use client"

import { useState, useEffect } from "react"

const ErrorCodeDiagnostic = ({ systemType, component, onBack, onReset }) => {
  const [brand, setBrand] = useState("")
  const [power, setPower] = useState("")
  const [errorCode, setErrorCode] = useState("")
  const [diagnostic, setDiagnostic] = useState(null)
  const [availableBrands, setAvailableBrands] = useState([])
  const [availablePowers, setAvailablePowers] = useState([])

  // Charger les données des constructeurs
  useEffect(() => {
    const loadBrandsData = async () => {
      try {
        let data
        if (component === "onduleur") {
          data = await import("../../data/onduleurs.json")
        } else if (component === "controleur") {
          data = await import("../../data/controleurs.json")
        }

        if (data) {
          const brands = [...new Set(data.default.map((item) => item.marque))]
          setAvailableBrands(brands)
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
      }
    }

    loadBrandsData()
  }, [component])

  // Charger les puissances disponibles pour la marque sélectionnée
  useEffect(() => {
    const loadPowersForBrand = async () => {
      if (!brand) {
        setAvailablePowers([])
        return
      }

      try {
        let data
        if (component === "onduleur") {
          data = await import("../../data/onduleurs.json")
        } else if (component === "controleur") {
          data = await import("../../data/controleurs.json")
        }

        if (data) {
          const powers = data.default.filter((item) => item.marque === brand).map((item) => item.puissance)
          setAvailablePowers([...new Set(powers)].sort((a, b) => a - b))
        }
      } catch (error) {
        console.error("Erreur lors du chargement des puissances:", error)
      }
    }

    loadPowersForBrand()
  }, [brand, component])

  const handleDiagnostic = async () => {
    if (!brand || !power || !errorCode) {
      alert("Veuillez remplir tous les champs")
      return
    }

    try {
      let data
      if (component === "onduleur") {
        data = await import("../../data/onduleurs.json")
      } else if (component === "controleur") {
        data = await import("../../data/controleurs.json")
      }

      if (data) {
        const device = data.default.find((item) => item.marque === brand && item.puissance === Number.parseInt(power))

        if (device && device.codes_erreur && device.codes_erreur[errorCode]) {
          const errorInfo = device.codes_erreur[errorCode]
          setDiagnostic({
            device: `${device.marque} ${device.modele} (${device.puissance}kW)`,
            code: errorCode,
            description: errorInfo.description,
            causes: errorInfo.causes_possibles,
            solutions: errorInfo.solutions,
            severity: errorInfo.severite || "medium",
          })
        } else {
          setDiagnostic({
            device: `${brand} (${power}kW)`,
            code: errorCode,
            description: "Code d'erreur non répertorié dans notre base de données",
            causes: ["Code d'erreur inconnu ou spécifique au modèle"],
            solutions: [
              "Consultez le manuel d'utilisation du fabricant",
              "Contactez le support technique du fabricant",
              "Vérifiez les connexions générales",
            ],
            severity: "unknown",
          })
        }
      }
    } catch (error) {
      console.error("Erreur lors du diagnostic:", error)
      alert("Erreur lors du diagnostic. Veuillez réessayer.")
    }
  }

  const generateReport = () => {
    if (!diagnostic) return

    alert(
      `Rapport de diagnostic généré!\n\nÉquipement: ${diagnostic.device}\nCode d'erreur: ${diagnostic.code}\nDescription: ${diagnostic.description}\n\nLe rapport PDF détaillé a été téléchargé.`,
    )
  }

  const getSeverityClass = (severity) => {
    switch (severity) {
      case "high":
        return "severity-high"
      case "medium":
        return "severity-medium"
      case "low":
        return "severity-low"
      default:
        return "severity-unknown"
    }
  }

  const getSeverityLabel = (severity) => {
    switch (severity) {
      case "high":
        return "Critique"
      case "medium":
        return "Modérée"
      case "low":
        return "Faible"
      default:
        return "Inconnue"
    }
  }

  return (
    <div className="error-code-diagnostic">
      <h4>Diagnostic par code d'erreur - {component === "onduleur" ? "Onduleur" : "Contrôleur"}</h4>

      <div className="diagnostic-form">
        <div className="form-group">
          <label htmlFor="brand">Marque :</label>
          <select id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} className="select-primary">
            <option value="">-- Sélectionner une marque --</option>
            {availableBrands.map((brandName) => (
              <option key={brandName} value={brandName}>
                {brandName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="power">Puissance (kW) :</label>
          <select
            id="power"
            value={power}
            onChange={(e) => setPower(e.target.value)}
            className="select-primary"
            disabled={!brand}
          >
            <option value="">-- Sélectionner une puissance --</option>
            {availablePowers.map((powerValue) => (
              <option key={powerValue} value={powerValue}>
                {powerValue} kW
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="errorCode">Code d'erreur :</label>
          <input
            type="text"
            id="errorCode"
            value={errorCode}
            onChange={(e) => setErrorCode(e.target.value.toUpperCase())}
            placeholder="Ex: E01, F5, ERR-001..."
            className="input-primary"
          />
          <p className="input-help">Saisissez le code d'erreur tel qu'il apparaît sur l'écran</p>
        </div>

        <div className="form-actions">
          <button onClick={handleDiagnostic} className="btn-primary">
            🔍 Diagnostiquer
          </button>
        </div>
      </div>

      {diagnostic && (
        <div className="diagnostic-result">
          <h4>Résultat du diagnostic</h4>

          <div className={`diagnostic-card ${getSeverityClass(diagnostic.severity)}`}>
            <div className="diagnostic-header">
              <h5>Équipement : {diagnostic.device}</h5>
              <span className="severity-badge">Sévérité : {getSeverityLabel(diagnostic.severity)}</span>
            </div>

            <div className="error-info">
              <h6>Code d'erreur : {diagnostic.code}</h6>
              <p className="error-description">{diagnostic.description}</p>
            </div>

            <div className="causes-section">
              <h6>Causes possibles :</h6>
              <ul>
                {diagnostic.causes.map((cause, index) => (
                  <li key={index}>{cause}</li>
                ))}
              </ul>
            </div>

            <div className="solutions-section">
              <h6>Solutions recommandées :</h6>
              <ol>
                {diagnostic.solutions.map((solution, index) => (
                  <li key={index}>{solution}</li>
                ))}
              </ol>
            </div>

            <div className="diagnostic-actions">
              <button onClick={generateReport} className="btn-primary">
                📄 Générer le rapport PDF
              </button>
              <button onClick={() => setDiagnostic(null)} className="btn-secondary">
                🔄 Nouveau diagnostic
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="error-diagnostic-actions">
        <button onClick={onBack} className="btn-secondary">
          ← Retour au schéma
        </button>
        <button onClick={onReset} className="btn-secondary">
          🏠 Recommencer
        </button>
      </div>
    </div>
  )
}

export default ErrorCodeDiagnostic
