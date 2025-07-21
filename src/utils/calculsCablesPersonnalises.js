// Calculs des sections de câbles avec distances personnalisées

/**
 * Calcule les sections de câbles avec distances personnalisées
 * CORRIGÉ - Suppression de la variable inutilisée
 */
export function calculerCablesPersonnalises(params) {
  const {
    courantUneChaine, // Courant d'une seule chaîne de panneaux
    nombreChaines, // Nombre total de chaînes en parallèle
    tensionSysteme,
    distancePanneauxRegulateur = 12,
    distanceRegulateurBatteries = 3.5, // Fixé par défaut
    distanceBatteriesOnduleur = 3.5, // Fixé par défaut
    puissanceOnduleur, // Puissance de l'onduleur en VA
    chuteTensionMax = 3, // Chute de tension fixe à 3%
  } = params

  /**
   * Calcule la section de câble avec résistivité du cuivre
   */
  function calculerSection(courant, distance, tension, chuteTension = chuteTensionMax) {
    const resistiviteCuivre = 0.0175 // Ohm.mm²/m à 20°C

    // Formule: S = (2 * ρ * L * I) / (U * ΔU%)
    const section = (2 * resistiviteCuivre * distance * courant) / (tension * (chuteTension / 100))

    // Calcul de la chute de tension réelle avec cette section
    const chuteTensionReelle = ((2 * resistiviteCuivre * distance * courant) / (tension * section)) * 100

    return {
      sectionCalculee: Math.round(section * 100) / 100, // Section exacte calculée
      chuteTensionReelle: Math.round(chuteTensionReelle * 100) / 100,
    }
  }

  // 1. Câble Panneaux → Régulateur
  // Courant total = courant d'une chaîne × nombre de chaînes
  const courantTotalPanneaux = courantUneChaine * nombreChaines

  const cablePanneauxRegulateur = calculerSection(courantTotalPanneaux, distancePanneauxRegulateur, tensionSysteme)

  // 2. Câble Régulateur → Batteries
  // Le courant qui sort du régulateur est légèrement supérieur à celui qui entre dans les batteries
  const efficaciteRegulateur = 0.95 // 95% d'efficacité
  const courantSortieRegulateur = courantTotalPanneaux / efficaciteRegulateur // Légèrement supérieur

  const cableRegulateurBatteries = calculerSection(courantSortieRegulateur, distanceRegulateurBatteries, tensionSysteme)

  // 3. Câble Batteries → Onduleur
  let cableBatteriesOnduleur = null
  let courantOnduleurReel = null

  if (puissanceOnduleur && distanceBatteriesOnduleur) {
    // Calcul du courant onduleur basé sur sa puissance nominale
    const efficaciteOnduleur = 0.9 // 90% d'efficacité
    courantOnduleurReel = puissanceOnduleur / (tensionSysteme * efficaciteOnduleur)

    // Facteur de sécurité de 25% pour l'onduleur
    const courantOnduleurSecurise = courantOnduleurReel * 1.25

    cableBatteriesOnduleur = calculerSection(courantOnduleurSecurise, distanceBatteriesOnduleur, tensionSysteme)
  }

  // Calcul du coût approximatif des câbles
  const coutCuivreParKgMm2 = 200 // FCFA/kg.mm² (prix approximatif au Cameroun)
  const densiteCuivre = 8.96 // kg/dm³

  function calculerCoutCable(section, longueur) {
    const volumeCuivre = (section / 100) * (longueur / 100) // dm³
    const poidsCuivre = volumeCuivre * densiteCuivre // kg
    return Math.round(poidsCuivre * coutCuivreParKgMm2 * 100) / 100 // FCFA
  }

  return {
    distances: {
      panneauxRegulateur: distancePanneauxRegulateur,
      regulateurBatteries: distanceRegulateurBatteries,
      batteriesOnduleur: distanceBatteriesOnduleur,
    },

    cables: {
      panneauxRegulateur: {
        sectionCalculee: cablePanneauxRegulateur.sectionCalculee,
        chuteTensionReelle: cablePanneauxRegulateur.chuteTensionReelle,
        distance: distancePanneauxRegulateur,
        courantUtilise: courantTotalPanneaux, // Courant réel utilisé
        coutEstime: calculerCoutCable(cablePanneauxRegulateur.sectionCalculee, distancePanneauxRegulateur * 2),
        
      },

      regulateurBatteries: {
        sectionCalculee: cableRegulateurBatteries.sectionCalculee,
        chuteTensionReelle: cableRegulateurBatteries.chuteTensionReelle,
        distance: distanceRegulateurBatteries,
        courantUtilise: courantSortieRegulateur, // Courant réel utilisé
        coutEstime: calculerCoutCable(cableRegulateurBatteries.sectionCalculee, distanceRegulateurBatteries * 2),
        description: `Courant de sortie du régulateur: ${courantSortieRegulateur.toFixed(2)}A (légèrement > courant d'entrée)`,
      },

      batteriesOnduleur: cableBatteriesOnduleur
        ? {
            sectionCalculee: cableBatteriesOnduleur.sectionCalculee,
            chuteTensionReelle: cableBatteriesOnduleur.chuteTensionReelle,
            distance: distanceBatteriesOnduleur,
            courantUtilise: courantOnduleurReel * 1.25, // Courant réel avec sécurité
            coutEstime: calculerCoutCable(cableBatteriesOnduleur.sectionCalculee, distanceBatteriesOnduleur * 2),
            description: `Courant onduleur: ${puissanceOnduleur}VA ÷ ${tensionSysteme}V ÷ 0.9 = ${courantOnduleurReel.toFixed(2)}A (+ 25% sécurité)`,
          }
        : null,
    },

    // Informations sur les calculs
    parametresCalcul: {
      courantUneChaine,
      nombreChaines,
      courantTotalPanneaux,
      chuteTensionMax: chuteTensionMax,
      facteurSecuriteOnduleur: 1.25, // 25%
      efficaciteRegulateur: 0.95,
      efficaciteOnduleur: 0.9,
      distancesParDefaut: "Régulateur-Batteries et Batteries-Onduleur fixées à 3.5m",
    },

    // Vérification logique des résultats
    verificationLogique: {
      sectionPanneauxRegulateur: cablePanneauxRegulateur.sectionCalculee,
      sectionRegulateurBatteries: cableRegulateurBatteries.sectionCalculee,
      sectionBatteriesOnduleur: cableBatteriesOnduleur?.sectionCalculee || 0,
      courantPanneaux: courantTotalPanneaux,
      courantRegulateur: courantSortieRegulateur,
      courantOnduleur: courantOnduleurReel ? courantOnduleurReel * 1.25 : 0,
      logiqueCroissante: cableBatteriesOnduleur
        ? courantOnduleurReel * 1.25 >= courantSortieRegulateur && courantSortieRegulateur >= courantTotalPanneaux
        : courantSortieRegulateur >= courantTotalPanneaux,
      message: cableBatteriesOnduleur
        ? courantOnduleurReel * 1.25 >= courantSortieRegulateur && courantSortieRegulateur >= courantTotalPanneaux
          ? "✅ Logique respectée: Courant Onduleur > Courant Régulateur > Courant Panneaux"
          : "⚠️ Attention: La logique des courants n'est pas respectée"
        : courantSortieRegulateur >= courantTotalPanneaux
          ? "✅ Logique respectée: Courant Régulateur > Courant Panneaux"
          : "⚠️ Attention: La logique des courants n'est pas respectée",
    },
  }
}
