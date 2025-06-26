// src/utils/calculsCablesPersonnalises.js

/**
 * Calcule les sections de câbles avec distances personnalisées
 */
export function calculerCablesPersonnalises(params) {
  const {
    courantPanneaux,
    tensionSysteme,
    distancePanneauxRegulateur = 10,
    distanceRegulateurBatteries = 5,
    distanceBatteriesOnduleur = 3,
    puissanceOnduleur,
    chuteTensionMax = 3,
  } = params;

  /**
   * Calcule la section de câble avec résistivité du cuivre
   */
  function calculerSection(courant, distance, tension, chuteTension = chuteTensionMax) {
    const resistiviteCuivre = 0.0175; // Ohm.mm²/m à 20°C
    
    // Formule: S = (2 * ρ * L * I) / (U * ΔU%)
    const section = (2 * resistiviteCuivre * distance * courant) / (tension * (chuteTension / 100));
    
    // Sections normalisées en mm²
    const sectionsNormalisees = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240];
    
    // Trouver la section normalisée immédiatement supérieure
    for (const sectionNormalisee of sectionsNormalisees) {
      if (sectionNormalisee >= section) {
        return {
          sectionCalculee: Math.round(section * 100) / 100,
          sectionRecommandee: sectionNormalisee,
          chuteTensionReelle: (2 * resistiviteCuivre * distance * courant) / (tension * sectionNormalisee) * 100,
        };
      }
    }
    
    // Si aucune section standard ne convient
    const derniereSectionStandard = sectionsNormalisees[sectionsNormalisees.length - 1];
    return {
      sectionCalculee: Math.round(section * 100) / 100,
      sectionRecommandee: derniereSectionStandard,
      chuteTensionReelle: (2 * resistiviteCuivre * distance * courant) / (tension * derniereSectionStandard) * 100,
      avertissement: "Section calculée supérieure aux standards. Vérifiez vos paramètres.",
    };
  }

  // 1. Câble Panneaux → Régulateur
  const cablePanneauxRegulateur = calculerSection(
    courantPanneaux * 1.25, // Facteur de sécurité 25%
    distancePanneauxRegulateur,
    tensionSysteme
  );

  // 2. Câble Régulateur → Batteries
  const cableRegulateurBatteries = calculerSection(
    courantPanneaux * 1.1, // Facteur de sécurité 10%
    distanceRegulateurBatteries,
    tensionSysteme
  );

  // 3. Câble Batteries → Onduleur (si applicable)
  let cableBatteriesOnduleur = null;
  if (puissanceOnduleur && distanceBatteriesOnduleur) {
    const courantOnduleur = puissanceOnduleur / tensionSysteme;
    cableBatteriesOnduleur = calculerSection(
      courantOnduleur * 1.2, // Facteur de sécurité 20%
      distanceBatteriesOnduleur,
      tensionSysteme
    );
  }

  // Calcul du coût approximatif des câbles (optionnel)
  const coutCuivreParKgMm2 = 8.5; // €/kg.mm² (prix approximatif)
  const densiteCuivre = 8.96; // kg/dm³

  function calculerCoutCable(section, longueur) {
    const volumeCuivre = (section / 100) * (longueur / 100); // dm³
    const poidsCuivre = volumeCuivre * densiteCuivre; // kg
    return Math.round(poidsCuivre * coutCuivreParKgMm2 * 100) / 100; // €
  }

  return {
    distances: {
      panneauxRegulateur: distancePanneauxRegulateur,
      regulateurBatteries: distanceRegulateurBatteries,
      batteriesOnduleur: distanceBatteriesOnduleur,
    },
    
    cables: {
      panneauxRegulateur: {
        ...cablePanneauxRegulateur,
        distance: distancePanneauxRegulateur,
        courantUtilise: courantPanneaux * 1.25,
        coutEstime: calculerCoutCable(cablePanneauxRegulateur.sectionRecommandee, distancePanneauxRegulateur * 2), // Aller-retour
      },
      
      regulateurBatteries: {
        ...cableRegulateurBatteries,
        distance: distanceRegulateurBatteries,
        courantUtilise: courantPanneaux * 1.1,
        coutEstime: calculerCoutCable(cableRegulateurBatteries.sectionRecommandee, distanceRegulateurBatteries * 2),
      },
      
      batteriesOnduleur: cableBatteriesOnduleur ? {
        ...cableBatteriesOnduleur,
        distance: distanceBatteriesOnduleur,
        courantUtilise: (puissanceOnduleur / tensionSysteme) * 1.2,
        coutEstime: calculerCoutCable(cableBatteriesOnduleur.sectionRecommandee, distanceBatteriesOnduleur * 2),
      } : null,
    },

  };
}