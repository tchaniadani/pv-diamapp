/**
 * Module de calcul des configurations série/parallèle des panneaux
 */

/**
 * Calcule la configuration optimale série/parallèle des panneaux
 * @param {Object} params - Paramètres de calcul
 * @param {Object} params.panneau - Caractéristiques du panneau sélectionné
 * @param {number} params.nombrePanneauxTotal - Nombre total de panneaux nécessaires
 * @param {number} params.tensionSysteme - Tension du système (V)
 * @returns {Object} Configuration série/parallèle optimale
 */
export function calculerConfigurationPanneaux(params) {
  const { panneau, nombrePanneauxTotal, tensionSysteme } = params

  if (!panneau || !nombrePanneauxTotal || !tensionSysteme) {
    return null
  }

  // Calcul du nombre de panneaux en série nécessaires
  // On utilise la tension nominale du panneau pour respecter la tension système
  const panneauxEnSerie = Math.round(tensionSysteme / panneau.tensionNominale)

  // Vérification que la configuration est viable
  if (panneauxEnSerie <= 0) {
    return {
      erreur: "Tension système incompatible avec le panneau sélectionné",
      panneauxEnSerie: 0,
      chainesParalleles: 0,
      nombrePanneauxUtilises: 0,
      tensionReelleString: 0,
      courantTotalString: 0,
    }
  }

  // Calcul du nombre de chaînes en parallèle
  const chainesParalleles = Math.ceil(nombrePanneauxTotal / panneauxEnSerie)

  // Nombre réel de panneaux utilisés (peut être légèrement supérieur au besoin)
  const nombrePanneauxUtilises = panneauxEnSerie * chainesParalleles

  // Calculs électriques de la configuration
  const tensionReelleString = panneauxEnSerie * panneau.tensionMaxPuissance
  const tensionCircuitOuvertString = panneauxEnSerie * panneau.tensionCircuitOuvert
  const courantMaxString = panneau.courantMaxPuissance // Courant d'une chaîne
  const courantTotalString = courantMaxString * chainesParalleles // Courant total
  const courantCourtCircuitTotal = panneau.courantCourtCircuit * chainesParalleles

  // Puissance totale réelle
  const puissanceTotaleReelle = nombrePanneauxUtilises * panneau.puissance

  // Vérifications de sécurité
  const margeSecuriteTension = ((tensionSysteme - panneauxEnSerie * panneau.tensionNominale) / tensionSysteme) * 100
  const compatibiliteTension = Math.abs(margeSecuriteTension) <= 20 // Tolérance de 20%

  // Calcul de l'efficacité de la configuration
  const efficaciteConfiguration = (nombrePanneauxTotal / nombrePanneauxUtilises)

  // Recommandations d'amélioration
  const recommandations = []

  if (!compatibiliteTension) {
    recommandations.push("⚠️ Tension système non optimale pour ce panneau")
  }

  if (efficaciteConfiguration < 90) {
    recommandations.push("💡 Configuration peu efficace - Il est préférable de choisir un autre panneau")
  }

  if (panneauxEnSerie === 1) {
    recommandations.push("💡 Un seul panneau par chaîne - revérifiez la tension système ou le choix de votre panneau")
  }

  if (chainesParalleles > 6) {
    recommandations.push("⚠️ Beaucoup de chaînes parallèles - Revérifiez vos paramètres")
  }

  return {
    // Configuration de base
    panneauxEnSerie,
    chainesParalleles,
    nombrePanneauxUtilises,
    panneauxSupplementaires: nombrePanneauxUtilises - nombrePanneauxTotal,

    // Caractéristiques électriques
    tensionReelleString,
    tensionCircuitOuvertString,
    courantMaxString,
    courantTotalString,
    courantCourtCircuitTotal,
    puissanceTotaleReelle,

    // Analyse de la configuration
    margeSecuriteTension: Math.round(margeSecuriteTension * 100) / 100,
    compatibiliteTension,
    efficaciteConfiguration: Math.round(efficaciteConfiguration * 100) / 100,

    // Recommandations
    recommandations,

    // Informations complémentaires
    tensionNominalePanneau: panneau.tensionNominale,
    tensionSystemeUtilisee: tensionSysteme,

    
  }
}

/**
 * Propose des configurations alternatives
 * @param {Object} params - Paramètres de calcul
 * @returns {Array} Liste des configurations alternatives
 */
export function proposerConfigurationsAlternatives(params) {
  const { panneau, nombrePanneauxTotal } = params
  const tensionsSystemePossibles = [12, 24, 36, 48]

  const configurationsAlternatives = []

  for (const tension of tensionsSystemePossibles) {
    const config = calculerConfigurationPanneaux({
      panneau,
      nombrePanneauxTotal,
      tensionSysteme: tension,
    })

    if (config && !config.erreur) {
      configurationsAlternatives.push({
        tensionSysteme: tension,
        ...config,
        score: config.efficaciteConfiguration + (config.compatibiliteTension ? 20 : 0),
      })
    }
  }

  // Trier par score décroissant
  return configurationsAlternatives.sort((a, b) => b.score - a.score)
}

/**
 * Valide une configuration de panneaux
 * @param {Object} configuration - Configuration à valider
 * @returns {Object} Résultat de la validation
 */
export function validerConfiguration(configuration) {
  const validations = {
    tensionCompatible: configuration.compatibiliteTension,
    efficaciteAcceptable: configuration.efficaciteConfiguration >= 85,
    nombreChainesRaisonnable: configuration.chainesParalleles <= 8,
    tensionSecurisee: configuration.tensionCircuitOuvertString <= 600, // Limite de sécurité
    courantAcceptable: configuration.courantTotalString <= 100, // Limite pratique
  }

  const estValide = Object.values(validations).every((v) => v)

  const alertes = []
  if (!validations.tensionCompatible) alertes.push("Tension non compatible")
  if (!validations.efficaciteAcceptable) alertes.push("Efficacité faible")
  if (!validations.nombreChainesRaisonnable) alertes.push("Trop de chaînes parallèles")
  if (!validations.tensionSecurisee) alertes.push("Tension dangereuse")
  if (!validations.courantAcceptable) alertes.push("Courant trop élevé")

  return {
    estValide,
    validations,
    alertes,
    recommandation: estValide ? "Configuration recommandée" : "Configuration à revoir",
  }
}
