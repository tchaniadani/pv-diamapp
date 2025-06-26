"use client"

import { useState, useEffect } from "react"
import { calculsDimensionnement } from "../../utils/calculsDimensionnement"
import { panneauxManager } from "../../utils/panneauxManager"

const ParametresDimensionnement = ({ besoinEnergetique, onRetour, onResultatsCalcules }) => {
  // États existants
  const [ville, setVille] = useState("")
  const [irradiance, setIrradiance] = useState("")
  const [azimut, setAzimut] = useState("")
  const [inclinaison, setInclinaison] = useState("")
  const [puissancePanneau, setPuissancePanneau] = useState("")
  const [typeSysteme, setTypeSysteme] = useState("")
  const [tensionSysteme, setTensionSysteme] = useState("")
  const [tensionBatterie, setTensionBatterie] = useState("")
  const [capaciteBatterie, setCapaciteBatterie] = useState("")
  const [energieStockee, setEnergieStockee] = useState("")
  const [autonomieJours, setAutonomieJours] = useState("")
  const [typeInstallation, setTypeInstallation] = useState("toiture")
  const [orientationPanneaux, setOrientationPanneaux] = useState("paysage")

  // États pour les distances personnalisées
  const [distancePanneauxRegulateur, setDistancePanneauxRegulateur] = useState(10)
  const [distanceRegulateurBatteries, setDistanceRegulateurBatteries] = useState(5)
  const [distanceBatteriesOnduleur, setDistanceBatteriesOnduleur] = useState(3)

  // États pour les panneaux
  const [panneauxDisponibles, setPanneauxDisponibles] = useState([])
  const [panneauSelectionne, setPanneauSelectionne] = useState(null)
  const [marquesDisponibles, setMarquesDisponibles] = useState([])
  const [marqueSelectionnee, setMarqueSelectionnee] = useState("")

  const [villesData, setVillesData] = useState([])
  const [descriptionSysteme, setDescriptionSysteme] = useState("")

  // État pour gérer la validation
  const [champsObligatoires, setChampsObligatoires] = useState({
    ville: false,
    puissancePanneau: false,
    typeSysteme: false,
  })

  // Charger les données des villes et panneaux
  useEffect(() => {
    // Charger les villes
    import("../../data/villesData.json")
      .then((data) => {
        setVillesData(data.default)
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des données des villes:", error)
      })

    // Charger les panneaux
    const loadPanneaux = async () => {
      await panneauxManager.loadPanneauxData()
      const panneaux = panneauxManager.getTousLesPanneaux()
      const marques = panneauxManager.getMarquesDisponibles()

      setPanneauxDisponibles(panneaux)
      setMarquesDisponibles(marques)
    }
    loadPanneaux()
  }, [])

  // Vérifier les champs obligatoires
  useEffect(() => {
    setChampsObligatoires({
      ville: !ville,
      puissancePanneau: !puissancePanneau,
      typeSysteme: !typeSysteme,
    })
  }, [ville, puissancePanneau, typeSysteme])

  // Met à jour les informations du panneau sélectionné
  useEffect(() => {
    if (puissancePanneau) {
      const panneau = panneauxManager.getPanneauParPuissance(Number.parseInt(puissancePanneau))
      setPanneauSelectionne(panneau)
      if (panneau) {
        setMarqueSelectionnee(panneau.marque)
      }
    }
  }, [puissancePanneau])

  // Met à jour automatiquement les données associées à la ville
  useEffect(() => {
    const villeData = villesData.find((v) => v.nom === ville)
    if (villeData) {
      setIrradiance(villeData.irradiance)
      setAzimut(`${villeData.azimut}° (${villeData.orientation})`)
      setInclinaison(villeData.inclinaison)
    } else {
      setIrradiance("")
      setAzimut("")
      setInclinaison("")
    }
  }, [ville, villesData])

  // Met à jour la description du type de système
  useEffect(() => {
    switch (typeSysteme) {
      case "Hybride":
        setDescriptionSysteme(
          "💡Un système hybride combine l'énergie solaire et une autre source d'énergie (ENEO, groupe électrogène).",
        )
        break
      case "Autonome":
        setDescriptionSysteme(
          "💡Un système autonome fonctionne uniquement à l'énergie solaire, avec stockage par batteries.",
        )
        break
      case "Backup":
        setDescriptionSysteme("Un système de secours qui prend le relais en cas de coupure du réseau électrique ENEO.")
        break
      case "Pompage solaire":
        setDescriptionSysteme(
          "💡Un système dédié au pompage d'eau; Il fonctionne généralement sans batteries(conseillé).",
        )
        break
      case "Au fil du soleil":
        setDescriptionSysteme("💡Un système connecté au réseau ou pas, sans stockage.")
        break
      default:
        setDescriptionSysteme("")
    }
  }, [typeSysteme])

  // Calcul de l'énergie à stocker en fonction de l'autonomie
  useEffect(() => {
    if (autonomieJours && besoinEnergetique && typeSysteme && typeSysteme.match(/Hybride|Autonome|Backup/)) {
      const profondeurDecharge = 0.7
      const energieCalculee = (besoinEnergetique * Number.parseFloat(autonomieJours)) / profondeurDecharge
      setEnergieStockee(Math.ceil(energieCalculee))
    }
  }, [autonomieJours, besoinEnergetique, typeSysteme])

  // Vérifier si le bouton peut être activé
  const peutCalculer =
    !champsObligatoires.ville && !champsObligatoires.puissancePanneau && !champsObligatoires.typeSysteme

  // Filtrer les panneaux par marque
  const panneauxFiltres = marqueSelectionnee
    ? panneauxDisponibles.filter((p) => p.marque === marqueSelectionnee)
    : panneauxDisponibles

  const handleSubmit = () => {
    const params = {
      irradiance: irradiance ? Number.parseFloat(irradiance) : null,
      puissancePanneau: puissancePanneau ? Number.parseFloat(puissancePanneau) : null,
      besoinEnergetique: besoinEnergetique ? Number.parseFloat(besoinEnergetique) : null,
      typeSysteme: typeSysteme || null,
      tensionSysteme: tensionSysteme ? Number.parseFloat(tensionSysteme) : null,
      tensionBatterie:
        typeSysteme && typeSysteme.match(/Hybride|Autonome|Backup/) && tensionBatterie
          ? Number.parseFloat(tensionBatterie)
          : null,
      capaciteBatterie:
        typeSysteme && typeSysteme.match(/Hybride|Autonome|Backup/) && capaciteBatterie
          ? Number.parseFloat(capaciteBatterie)
          : null,
      energieStockee:
        typeSysteme && typeSysteme.match(/Hybride|Autonome|Backup/) && energieStockee
          ? Number.parseFloat(energieStockee)
          : null,
      typeInstallation,
      orientationPanneaux,
      distancePanneauxRegulateur: Number.parseFloat(distancePanneauxRegulateur),
      distanceRegulateurBatteries: Number.parseFloat(distanceRegulateurBatteries),
      distanceBatteriesOnduleur: Number.parseFloat(distanceBatteriesOnduleur),
    }

    const resultats = calculsDimensionnement(params)

    onResultatsCalcules({
      parametres: {
        ville: ville || "Non spécifiée",
        irradiance: irradiance || "Valeur par défaut utilisée",
        azimut: azimut || "Non spécifié",
        inclinaison: inclinaison || "Non spécifiée",
        puissancePanneau: puissancePanneau || "Valeur par défaut utilisée",
        typeSysteme: typeSysteme || "Non spécifié",
        descriptionSysteme,
        tensionSysteme: tensionSysteme || "Valeur par défaut utilisée",
        autonomieJours: typeSysteme && typeSysteme.match(/Hybride|Autonome|Backup/) ? autonomieJours : null,
        tensionBatterie: typeSysteme && typeSysteme.match(/Hybride|Autonome|Backup/) ? tensionBatterie : null,
        capaciteBatterie: typeSysteme && typeSysteme.match(/Hybride|Autonome|Backup/) ? capaciteBatterie : null,
        energieStockee: typeSysteme && typeSysteme.match(/Hybride|Autonome|Backup/) ? energieStockee : null,
        besoinEnergetique: besoinEnergetique || "Valeur par défaut utilisée",
        typeInstallation,
        orientationPanneaux,
        distancePanneauxRegulateur,
        distanceRegulateurBatteries,
        distanceBatteriesOnduleur,
      },
      resultats,
    })
  }

  return (
    <div className="parametres-dimensionnement">
      <h3>📑Paramètres de dimensionnement</h3>
      <p className="sizing-help">
        →Complétez les paramètres suivants pour dimensionner votre installation.
        <br />
        <span className="required-note">
          (Les champs marqués d'un "*" sont fortement recommandés pour des calculs précis.)
        </span>
      </p>

      <div className="parameters-form">
        {/* Sélection ville */}
        <div className="form-group">
          <label htmlFor="ville">
            Ville: <span className="required-star">*</span>
          </label>
          <select
            id="ville"
            value={ville}
            onChange={(e) => setVille(e.target.value)}
            className={`select-primary ${champsObligatoires.ville ? "field-missing" : ""}`}
          >
            <option value="">-- Sélectionner une ville --</option>
            {villesData.map((v) => (
              <option key={v.nom} value={v.nom}>
                {v.nom}
              </option>
            ))}
          </select>
          {champsObligatoires.ville && <p className="field-warning">⚠️</p>}
        </div>

        {/* Données automatiques */}
        {ville && (
          <div className="auto-data-section">
            <h4>Données de localisation</h4>
            <div className="auto-data-grid">
              <div className="auto-data-item">
                <span className="auto-data-label">Irradiance moyenne:</span>
                <span className="auto-data-value">{irradiance} kWh/m²/j</span>
              </div>
              <div className="auto-data-item">
                <span className="auto-data-label">Azimut :</span>
                <span className="auto-data-value">{azimut}</span>
              </div>
              <div className="auto-data-item">
                <span className="auto-data-label">Incli. recommandée:</span>
                <span className="auto-data-value">{inclinaison}°</span>
              </div>
            </div>
          </div>
        )}

        {/* Sélection du panneau */}
        <div className="panneau-section">
          <h4>Caractéristiques du panneau</h4>

          {/* NOUVEAU : Sélection par marque */}
          <div className="form-group">
            <label htmlFor="marque">Marque de panneau:</label>
            <select
              id="marque"
              value={marqueSelectionnee}
              onChange={(e) => {
                setMarqueSelectionnee(e.target.value)
                setPuissancePanneau("") // Reset la sélection du panneau
              }}
              className="select-primary"
            >
              <option value="">-- Toutes les marques --</option>
              {marquesDisponibles.map((marque) => (
                <option key={marque} value={marque}>
                  {marque}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="puissancePanneau">
              Panneau solaire: <span className="required-star">*</span>
            </label>
            <select
              id="puissancePanneau"
              value={puissancePanneau}
              onChange={(e) => setPuissancePanneau(e.target.value)}
              className={`select-primary ${champsObligatoires.puissancePanneau ? "field-missing" : ""}`}
            >
              <option value="">-- Choisir un panneau --</option>
              {panneauxFiltres.map((panneau) => (
                <option key={`${panneau.marque}-${panneau.modele}`} value={panneau.puissance}>
                  {panneau.marque} {panneau.modele} - {panneau.puissance}Wc
                </option>
              ))}
            </select>
            {champsObligatoires.puissancePanneau && <p className="field-warning">⚠️</p>}
          </div>

          {/* Affichage des caractéristiques du panneau sélectionné */}
          {panneauSelectionne && (
            <div className="panneau-details">
              <h5>Caractéristiques techniques</h5>
              <div className="panneau-specs">
                <div className="spec-item">
                  <span className="spec-label">Tension max puissance (Vmpp):</span>
                  <span className="spec-value">{panneauSelectionne.tensionMaxPuissance} V</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Tension nominale:</span>
                  <span className="spec-value">{panneauSelectionne.tensionNominale} V</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Courant max puissance:</span>
                  <span className="spec-value">{panneauSelectionne.courantMaxPuissance} A</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Tension circuit ouvert (Voc):</span>
                  <span className="spec-value">{panneauSelectionne.tensionCircuitOuvert} V</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Dimensions:</span>
                  <span className="spec-value">
                    {panneauSelectionne.dimensions.longueur} × {panneauSelectionne.dimensions.largeur} mm
                  </span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Poids:</span>
                  <span className="spec-value">{panneauSelectionne.poids} kg</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Rendement:</span>
                  <span className="spec-value">{panneauSelectionne.rendement}%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Paramètres d'installation */}
        <div className="installation-section">
          <h4>Paramètres d'installation</h4>

          <div className="form-group">
            <label htmlFor="typeInstallation">Type d'installation:</label>
            <select
              id="typeInstallation"
              value={typeInstallation}
              onChange={(e) => setTypeInstallation(e.target.value)}
              className="select-primary"
            >
              <option value="toiture">Toiture</option>
              <option value="sol">Au sol</option>
              <option value="facade">Façade</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="orientationPanneaux">Orientation des panneaux:</label>
            <select
              id="orientationPanneaux"
              value={orientationPanneaux}
              onChange={(e) => setOrientationPanneaux(e.target.value)}
              className="select-primary"
            >
              <option value="paysage">Paysage </option>
              <option value="portrait">Portrait </option>
            </select>
            <p className="input-help">{orientationPanneaux === "paysage" ? "→Horizontalement" : "→Verticalement"}</p>
          </div>
        </div>

        {/* Distances personnalisées */}
        <div className="distances-section">
          <h4>Distances de câblage</h4>
          <p className="section-help">
            →Saisissez les distances réelles de votre installation pour un calcul précis des sections de câbles.
          </p>

          <div className="form-group">
            <label htmlFor="distancePanneauxRegulateur">Distance Panneaux → Régulateur:</label>
            <div className="input-with-unit">
              <input
                id="distancePanneauxRegulateur"
                type="number"
                value={distancePanneauxRegulateur}
                onChange={(e) => setDistancePanneauxRegulateur(e.target.value)}
                className="input-primary"
                min="1"
                step="0.5"
              />
              <span className="input-unit">m</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="distanceRegulateurBatteries">Distance Régulateur → Batteries:</label>
            <div className="input-with-unit">
              <input
                id="distanceRegulateurBatteries"
                type="number"
                value={distanceRegulateurBatteries}
                onChange={(e) => setDistanceRegulateurBatteries(e.target.value)}
                className="input-primary"
                min="1"
                step="0.5"
              />
              <span className="input-unit">m</span>
            </div>
          </div>

          {typeSysteme && typeSysteme.match(/Hybride|Autonome|Backup/) && (
            <div className="form-group">
              <label htmlFor="distanceBatteriesOnduleur">Distance Batteries → Onduleur:</label>
              <div className="input-with-unit">
                <input
                  id="distanceBatteriesOnduleur"
                  type="number"
                  value={distanceBatteriesOnduleur}
                  onChange={(e) => setDistanceBatteriesOnduleur(e.target.value)}
                  className="input-primary"
                  min="1"
                  step="0.5"
                />
                <span className="input-unit">m</span>
              </div>
            </div>
          )}
        </div>

        {/* Type de système */}
        <div className="form-group">
          <label htmlFor="typeSysteme">
            Type de système: <span className="required-star">*</span>
          </label>
          <select
            id="typeSysteme"
            value={typeSysteme}
            onChange={(e) => setTypeSysteme(e.target.value)}
            className={`select-primary ${champsObligatoires.typeSysteme ? "field-missing" : ""}`}
          >
            <option value="">-- Choisir --</option>
            <option value="Hybride">Hybride</option>
            <option value="Autonome">Autonome</option>
            <option value="Backup">Backup</option>
            <option value="Pompage solaire">Pompage solaire</option>
            <option value="Au fil du soleil">Au fil du soleil</option>
          </select>
          {champsObligatoires.typeSysteme && <p className="field-warning">⚠️</p>}
        </div>

        {/* Description du type de système */}
        {descriptionSysteme && (
          <div className="system-description">
            <p>{descriptionSysteme}</p>
          </div>
        )}

        {/* Tension système */}
        <div className="form-group">
          <label htmlFor="tensionSysteme">Tension système:</label>
          <select
            id="tensionSysteme"
            value={tensionSysteme}
            onChange={(e) => setTensionSysteme(e.target.value)}
            className="select-primary"
          >
            <option value="">-- Choisir (24V par défaut) --</option>
            {[12, 24, 36, 48].map((v) => (
              <option key={v} value={v}>
                {v} V
              </option>
            ))}
          </select>
          {panneauSelectionne && tensionSysteme && (
            <p className="input-help">
              →Avec ce panneau ({panneauSelectionne.tensionNominale}V nominal), vous aurez{" "}
              {Math.round(tensionSysteme / panneauSelectionne.tensionNominale)} panneau(x) en série par chaîne.
            </p>
          )}
        </div>

        {/* Affichage conditionnel batteries */}
        {typeSysteme && typeSysteme.match(/Hybride|Autonome|Backup/) && (
          <div className="battery-section">
            <h4>Paramètres des batteries</h4>

            <div className="form-group">
              <label htmlFor="autonomieJours">Autonomie souhaitée:</label>
              <div className="input-with-unit">
                <input
                  id="autonomieJours"
                  type="number"
                  value={autonomieJours}
                  onChange={(e) => setAutonomieJours(e.target.value)}
                  placeholder="Ex: 2"
                  className="input-primary"
                  min="0.5"
                  step="0.5"
                />
                <span className="input-unit">jours</span>
              </div>
              <p className="input-help">→Nombre de jours d'autonomie souhaités en cas d'absence de soleil.</p>
            </div>

            <div className="form-group">
              <label htmlFor="tensionBatterie">Tension batterie:</label>
              <select
                id="tensionBatterie"
                value={tensionBatterie}
                onChange={(e) => setTensionBatterie(e.target.value)}
                className="select-primary"
              >
                <option value="">-- Choisir --</option>
                {[2, 6, 12, 24].map((v) => (
                  <option key={v} value={v}>
                    {v} V
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="capaciteBatterie">Capacité batterie:</label>
              <select
                id="capaciteBatterie"
                value={capaciteBatterie}
                onChange={(e) => setCapaciteBatterie(e.target.value)}
                className="select-primary"
              >
                <option value="">-- Choisir --</option>
                {[50, 100, 150, 200].map((v) => (
                  <option key={v} value={v}>
                    {v} Ah
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="energieStockee">Énergie à stocker (calculée):</label>
              <div className="input-with-unit">
                <input
                  id="energieStockee"
                  type="number"
                  value={energieStockee}
                  readOnly
                  className="input-primary input-readonly"
                />
                <span className="input-unit">Wh</span>
              </div>
              <p className="input-help">
                →Calculée en fonction de votre besoin journalier et de l'autonomie souhaitée.
              </p>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button
            onClick={handleSubmit}
            className={`btn-primary ${!peutCalculer ? "btn-disabled" : ""}`}
            title={!peutCalculer ? "Veuillez remplir les champs obligatoires (*)" : "Calculer le dimensionnement"}
            disabled={!peutCalculer}
          >
            {!peutCalculer && <span className="btn-icon">🚫</span>}
            Calculer le dimensionnement
          </button>
          <button onClick={onRetour} className="btn-secondary">
            Retour
          </button>
        </div>
      </div>
    </div>
  )
}

export default ParametresDimensionnement
