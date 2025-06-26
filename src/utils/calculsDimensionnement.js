import { calculerFixations } from "./calculsFixations"
import { panneauxManager } from "./panneauxManager"
import { calculerCablesPersonnalises } from "./calculsCablesPersonnalises"
import {
  calculerConfigurationPanneaux,
  proposerConfigurationsAlternatives,
  validerConfiguration,
} from "./calculConfigurationPanneaux"

/**
 * Effectue les calculs de dimensionnement avec gestion des données manquantes
 */
export function calculsDimensionnement(params) {
  const {
    irradiance,
    puissancePanneau,
    besoinEnergetique,
    typeSysteme,
    tensionSysteme,
    tensionBatterie,
    capaciteBatterie,
    energieStockee,
    typeInstallation = "toiture",
    orientationPanneaux = "paysage",
    distancePanneauxRegulateur = 10,
    distanceRegulateurBatteries = 5,
    distanceBatteriesOnduleur = 3,
  } = params

  // Initialiser le tableau des données manquantes
  const donneesManquantes = []

  // Vérifications des paramètres essentiels (mais pas d'arrêt)
  if (!irradiance || irradiance <= 0) {
    donneesManquantes.push("Irradiance solaire")
  }
  if (!puissancePanneau || puissancePanneau <= 0) {
    donneesManquantes.push("Puissance du panneau")
  }
  if (!besoinEnergetique || besoinEnergetique <= 0) {
    donneesManquantes.push("Besoin énergétique")
  }
  if (!typeSysteme) {
    donneesManquantes.push("Type de système")
  }
  if (!tensionSysteme) {
    donneesManquantes.push("Tension du système")
  }

  // Récupérer les caractéristiques réelles du panneau
  const panneauSelectionne = panneauxManager.getPanneauParPuissance(puissancePanneau)

  if (!panneauSelectionne && puissancePanneau) {
    donneesManquantes.push(`Caractéristiques du panneau ${puissancePanneau}W (utilisation de valeurs par défaut)`)
  }

  // Constantes et facteurs
  const performance = 0.75
  const pertesCablage = 0.97
  const pertesConversion = 0.95
  const facteurSecurite = 1.2

  // 1. Calculs pour les panneaux solaires avec gestion des valeurs par défaut
  const irradianceUtilisee = irradiance 
  const puissanceUtilisee = puissancePanneau 
  const besoinUtilise = besoinEnergetique 
  const tensionUtilisee = tensionSysteme 

  const productionParPanneauParJour =
    puissanceUtilisee * irradianceUtilisee * performance * pertesCablage * pertesConversion
  const besoinAvecSecurite = besoinUtilise * facteurSecurite
  const nombrePanneaux = Math.ceil(besoinAvecSecurite / productionParPanneauParJour)

  // NOUVEAU : Calcul de la configuration série/parallèle
  let configurationPanneaux = null
  let configurationsAlternatives = []
  let validationConfiguration = null

  if (panneauSelectionne && tensionUtilisee) {
    configurationPanneaux = calculerConfigurationPanneaux({
      panneau: panneauSelectionne,
      nombrePanneauxTotal: nombrePanneaux,
      tensionSysteme: tensionUtilisee,
    })

    if (configurationPanneaux && !configurationPanneaux.erreur) {
      validationConfiguration = validerConfiguration(configurationPanneaux)

      // Proposer des alternatives si la configuration n'est pas optimale
      if (!validationConfiguration.estValide || configurationPanneaux.efficaciteConfiguration < 90) {
        configurationsAlternatives = proposerConfigurationsAlternatives({
          panneau: panneauSelectionne,
          nombrePanneauxTotal: nombrePanneaux,
        }).slice(0, 3) // Garder les 3 meilleures alternatives
      }
    }
  }

  // Utiliser les vraies caractéristiques du panneau si disponibles
  const caracteristiquesPanneaux = panneauSelectionne
    ? panneauxManager.getCaracteristiquesElectriques(
        panneauSelectionne,
        configurationPanneaux?.nombrePanneauxUtilises || nombrePanneaux,
      )
    : {
        puissanceTotale: puissanceUtilisee * nombrePanneaux,
        courantMaxTotal: (puissanceUtilisee * nombrePanneaux) / tensionUtilisee,
        surfaceTotale: nombrePanneaux * (puissanceUtilisee <= 300 ? 1.6 : 2.0),
        poidsTotalPanneaux: nombrePanneaux * (puissanceUtilisee <= 300 ? 18 : 22),
      }

  const surfaceTotale = caracteristiquesPanneaux.surfaceTotale
  const puissanceCreteTotale = (configurationPanneaux?.nombrePanneauxUtilises || nombrePanneaux) * puissanceUtilisee

  // 2. Calculs pour les batteries avec gestion des données manquantes
  let resultatsBatteries = null
  if (typeSysteme && typeSysteme.match(/Hybride|Autonome|Backup/)) {
    if (!tensionBatterie) donneesManquantes.push("Tension des batteries")
    if (!capaciteBatterie) donneesManquantes.push("Capacité des batteries")
    if (!energieStockee) donneesManquantes.push("Énergie à stocker")

    if (tensionBatterie && capaciteBatterie && energieStockee && tensionSysteme) {
      const capaciteStockageNecessaire = energieStockee / tensionSysteme
      const nombreBatteriesSerie = Math.ceil(tensionSysteme / tensionBatterie)
      const nombreBranchesParalleles = Math.ceil(capaciteStockageNecessaire / capaciteBatterie)
      const nombreTotalBatteries = nombreBatteriesSerie * nombreBranchesParalleles
      const capaciteStockageReelle = nombreBranchesParalleles * capaciteBatterie
      const energieStockeeReelle = capaciteStockageReelle * tensionSysteme

      resultatsBatteries = {
        capaciteStockageNecessaire,
        nombreBatteriesSerie,
        nombreBranchesParalleles,
        nombreTotalBatteries,
        capaciteStockageReelle,
        energieStockeeReelle,
      }
    }
  }

  // 3. Calculs pour le régulateur
  const courantMaxPanneaux =
    configurationPanneaux?.courantTotalString ||
    caracteristiquesPanneaux.courantMaxTotal ||
    puissanceCreteTotale / tensionUtilisee

  const puissanceRegulateur = courantMaxPanneaux * tensionUtilisee * 1.25

  // 4. Calculs pour l'onduleur
  const puissanceOnduleur = Math.max((besoinUtilise * 1.3) / 24)

  // 5. Calculs des câbles avec distances personnalisées
  let resultatscables = null
  try {
    resultatscables = calculerCablesPersonnalises({
      courantPanneaux: courantMaxPanneaux,
      tensionSysteme: tensionUtilisee,
      distancePanneauxRegulateur,
      distanceRegulateurBatteries,
      distanceBatteriesOnduleur:
        typeSysteme && typeSysteme.match(/Hybride|Autonome|Backup/) ? distanceBatteriesOnduleur : null,
      puissanceOnduleur: typeSysteme && typeSysteme.match(/Hybride|Autonome|Backup/) ? puissanceOnduleur : null,
    })
  } catch (error) {
    donneesManquantes.push("Calculs de câblage (erreur dans les paramètres)")
  }

  // 6. Calculs pour les fixations
  let resultatsFixations = null
  try {
    resultatsFixations = calculerFixations({
      nombrePanneaux: configurationPanneaux?.nombrePanneauxUtilises || nombrePanneaux,
      puissancePanneau: puissanceUtilisee,
      typeInstallation,
      orientationPanneaux,
      largeurPanneau: panneauSelectionne?.dimensions.largeur,
      longueurPanneau: panneauSelectionne?.dimensions.longueur,
    })
  } catch (error) {
    donneesManquantes.push("Calculs de fixation")
  }

  // Retourner tous les résultats avec les données manquantes
  return {
    // Informations sur les données manquantes
    donneesManquantes,
    valeursParDefautUtilisees: donneesManquantes.length > 0,

    // Informations du panneau sélectionné
    panneauSelectionne,
    caracteristiquesPanneaux,

    // NOUVEAU : Configuration série/parallèle
    configurationPanneaux,
    validationConfiguration,
    configurationsAlternatives,

    // Résultats panneaux
    productionParPanneauParJour,
    nombrePanneaux,
    nombrePanneauxUtilises: configurationPanneaux?.nombrePanneauxUtilises || nombrePanneaux,
    surfaceTotale,
    puissanceCreteTotale,

    // Résultats batteries
    batteries: resultatsBatteries,

    // Résultats régulateur
    courantMaxPanneaux,
    puissanceRegulateur,

    // Résultats onduleur
    puissanceOnduleur,

    // Résultats câbles personnalisés
    cables: resultatscables,

    // Résultats fixations
    fixations: resultatsFixations,
  }
}
