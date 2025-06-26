// src/utils/panneauxManager.js

/**
 * Gestionnaire des données des panneaux photovoltaïques
 */
export class PanneauxManager {
  constructor() {
    this.panneauxData = [];
    this.loadPanneauxData();
  }

  /**
   * Charge les données des panneaux depuis le fichier JSON
   */
  async loadPanneauxData() {
    try {
      const data = await import('../data/panneauxData.json');
      this.panneauxData = data.default;
    } catch (error) {
      console.error("Erreur lors du chargement des données des panneaux:", error);
    }
  }

  /**
   * Récupère tous les panneaux disponibles
   */
  getTousLesPanneaux() {
    return this.panneauxData;
  }

  /**
   * Récupère les panneaux par marque
   */
  getPanneauxParMarque(marque) {
    return this.panneauxData.filter(panneau => panneau.marque === marque);
  }

  /**
   * Récupère un panneau par sa puissance
   */
  getPanneauParPuissance(puissance) {
    return this.panneauxData.find(panneau => panneau.puissance === puissance);
  }

  /**
   * Récupère un panneau par son modèle complet
   */
  getPanneauParModele(marque, modele) {
    return this.panneauxData.find(
      panneau => panneau.marque === marque && panneau.modele === modele
    );
  }

  /**
   * Récupère les puissances disponibles
   */
  getPuissancesDisponibles() {
    return [...new Set(this.panneauxData.map(panneau => panneau.puissance))].sort((a, b) => a - b);
  }

  /**
   * Récupère les marques disponibles
   */
  getMarquesDisponibles() {
    return [...new Set(this.panneauxData.map(panneau => panneau.marque))];
  }

  /**
   * Calcule les caractéristiques électriques réelles d'un panneau
   */
  getCaracteristiquesElectriques(panneau, nombrePanneaux = 1) {
    if (!panneau) return null;

    return {
      puissanceTotale: panneau.puissance * nombrePanneaux,
      courantMaxTotal: panneau.courantMaxPuissance * nombrePanneaux,
      tensionNominale: panneau.tensionMaxPuissance,
      courantCourtCircuitTotal: panneau.courantCourtCircuit * nombrePanneaux,
      tensionCircuitOuvert: panneau.tensionCircuitOuvert,
      surfaceTotale: panneau.surface * nombrePanneaux,
      poidsTotalPanneaux: panneau.poids * nombrePanneaux,
    };
  }

  /**
   * Ajoute un nouveau panneau (pour extension future)
   */
  ajouterPanneau(nouveauPanneau) {
    // Validation des données
    const champsRequis = ['marque', 'modele', 'puissance', 'tensionMaxPuissance', 'courantMaxPuissance'];
    for (const champ of champsRequis) {
      if (!nouveauPanneau[champ]) {
        throw new Error(`Le champ ${champ} est requis`);
      }
    }

    this.panneauxData.push(nouveauPanneau);
    return true;
  }
}

// Instance singleton
export const panneauxManager = new PanneauxManager();