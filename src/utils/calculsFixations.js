// src/utils/calculsFixations.js

/**
 * Calcule le nombre de clamps et rails nécessaires pour la fixation des panneaux
 * @param {Object} params - Les paramètres de calcul
 * @param {number} params.nombrePanneaux - Nombre total de panneaux
 * @param {number} params.puissancePanneau - Puissance d'un panneau (Wc)
 * @param {string} params.typeInstallation - Type d'installation (toiture, sol, etc.)
 * @param {string} params.orientationPanneaux - Orientation (portrait/paysage)
 * @param {number} params.largeurPanneau - Largeur d'un panneau en mm
 * @param {number} params.longueurPanneau - Longueur d'un panneau en mm
 * @returns {Object} Les résultats des calculs de fixation
 */
export function calculerFixations(params) {
  const {
    nombrePanneaux,
    puissancePanneau,
    typeInstallation = "toiture",
    orientationPanneaux = "paysage",
    largeurPanneau,
    longueurPanneau,
  } = params

  // Dimensions standard des panneaux selon leur puissance
  const dimensionsStandard = {
    250: { largeur: 1640, longueur: 992 },
    330: { largeur: 1684, longueur: 1002 },
    450: { largeur: 2108, longueur: 1048 },
    550: { largeur: 2278, longueur: 1134 },
  }

  // Utiliser les dimensions fournies ou les dimensions standard
  const dimensions = {
    largeur: largeurPanneau || dimensionsStandard[puissancePanneau]?.largeur || 1684,
    longueur: longueurPanneau || dimensionsStandard[puissancePanneau]?.longueur || 1002,
  }

  // Calcul des clamps (pinces de fixation)
  // Règle générale : 4 clamps par panneau (2 de chaque côté)
  const clampsParPanneau = 4
  const nombreClampsTotal = 2 * (nombrePanneaux - 1) + clampsParPanneau

  // Calcul des rails
  let resultatsRails

  if (orientationPanneaux === "paysage") {
    // En paysage : 2 rails parallèles au côté long
    const railsParPanneau = 2
    const longueurRailParPanneau = dimensions.largeur // mm

    // Calcul du nombre de rails nécessaires
    // Longueur standard d'un rail : 4200mm
    const longueurRailStandard = 4200
    const longueurTotaleRails = (nombrePanneaux * longueurRailParPanneau) / 1000 // en mètres
    const nombreRails = Math.ceil(longueurTotaleRails / (longueurRailStandard / 1000))

    resultatsRails = {
      railsParPanneau,
      longueurRailParPanneau,
      longueurTotaleRails: Math.round(longueurTotaleRails * 100) / 100,
      nombreRails,
      longueurRailStandard: longueurRailStandard / 1000, // en mètres
    }
  } else {
    // En portrait : 3 rails parallèles au côté long
    const railsParPanneau = 3
    const longueurRailParPanneau = dimensions.longueur // mm

    const longueurRailStandard = 4200
    const longueurTotaleRails = (nombrePanneaux * longueurRailParPanneau) / 1000
    const nombreRails = Math.ceil(longueurTotaleRails / (longueurRailStandard / 1000))

    resultatsRails = {
      railsParPanneau,
      longueurRailParPanneau,
      longueurTotaleRails: Math.round(longueurTotaleRails * 100) / 100,
      nombreRails,
      longueurRailStandard: longueurRailStandard / 1000,
    }
  }

  // Calcul des fixations toiture (si applicable)
  let fixationsToiture = null
  if (typeInstallation === "toiture") {
    // Règle : 1 fixation toiture tous les 80-100cm sur chaque rail
    const espacement = 0.9 // 90cm
    const fixationsParRail = Math.ceil(resultatsRails.longueurRailParPanneau / 1000 / espacement)
    const nombreFixationsToiture = resultatsRails.nombreRails * fixationsParRail

    fixationsToiture = {
      fixationsParRail,
      nombreFixationsToiture,
      espacement,
    }
  }

  // Calcul des éléments de connexion
  const connecteursRails = Math.max(0, resultatsRails.nombreRails - nombrePanneaux) // Connecteurs entre rails
  const emboutsRails = resultatsRails.nombreRails * 2 // 2 embouts par rail

  // Calcul du poids approximatif
  const poidsClamp = 0.15 // kg par clamp
  const poidsRailParMetre = 2.5 // kg/m
  const poidsFixationToiture = 0.3 // kg par fixation

  const poidsTotalClamps = nombreClampsTotal * poidsClamp
  const poidsTotalRails = resultatsRails.longueurTotaleRails * poidsRailParMetre
  const poidsTotalFixations = fixationsToiture ? fixationsToiture.nombreFixationsToiture * poidsFixationToiture : 0
  const poidsTotal = poidsTotalClamps + poidsTotalRails + poidsTotalFixations

  return {
    // Informations générales
    nombrePanneaux,
    orientationPanneaux,
    typeInstallation,
    dimensions,

    // Clamps
    clamps: {
      clampsParPanneau,
      nombreClampsTotal,
      poidsTotalClamps: Math.round(poidsTotalClamps * 100) / 100,
    },

    // Rails
    rails: {
      ...resultatsRails,
      poidsTotalRails: Math.round(poidsTotalRails * 100) / 100,
    },

    // Fixations toiture
    fixationsToiture,

    // Éléments de connexion
    connexion: {
      connecteursRails,
      emboutsRails,
    },

    // Poids total
    poidsTotal: Math.round(poidsTotal * 100) / 100,
  }
}
