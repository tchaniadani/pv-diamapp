"use client"

const ResultatsDimensionnement = ({ donnees, onRetour, onExportPDF }) => {
  const { parametres, resultats } = donnees

  return (
    <div className="resultats-dimensionnement">
      <h3>📊Résultats du dimensionnement</h3>

      {/* Alertes sur les données manquantes */}
      {resultats.donneesManquantes && resultats.donneesManquantes.length > 0 && (
        <div className="alertes-section">
          <h4>⚠️ Informations manquantes ou par défaut</h4>
          <div className="alertes-list">
            {resultats.donneesManquantes.map((donnee, index) => (
              <div key={index} className="alerte-item">
                <span className="alerte-icon">⚠️</span>
                <span className="alerte-text">{donnee}</span>
              </div>
            ))}
          </div>
          <p className="alertes-note">
            <strong>Note:</strong> Les calculs ont été effectués avec des valeurs par défaut pour les données
            manquantes. Pour des résultats plus précis, retournez aux paramètres et complétez les informations
            manquantes.
          </p>
        </div>
      )}

      {/* Paramètres utilisés */}
      <div className="resultats-section">
        <h4>📊Paramètres utilisés</h4>
        <div className="parametres-recap">
          <div className="param-item">
            <span className="param-label">Ville:</span>
            <span className={`param-value ${parametres.ville === "Non spécifiée" ? "param-default" : ""}`}>
              {parametres.ville}
            </span>
          </div>
          <div className="param-item">
            <span className="param-label">Irradiance:</span>
            <span
              className={`param-value ${parametres.irradiance === "Valeur par défaut utilisée" ? "param-default" : ""}`}
            >
              {parametres.irradiance === "Valeur par défaut utilisée"
                ? "5.0 kWh/m²/j (défaut)"
                : `${parametres.irradiance} kWh/m²/j`}
            </span>
          </div>
          <div className="param-item">
            <span className="param-label">Type de système:</span>
            <span className={`param-value ${parametres.typeSysteme === "Non spécifié" ? "param-default" : ""}`}>
              {parametres.typeSysteme}
            </span>
          </div>
          <div className="param-item">
            <span className="param-label">Tension système:</span>
            <span className="param-value">{parametres.tensionSysteme || "24V (défaut)"}</span>
          </div>
          <div className="param-item">
            <span className="param-label">Besoin énergétique:</span>
            <span
              className={`param-value ${parametres.besoinEnergetique === "Valeur par défaut utilisée" ? "param-default" : ""}`}
            >
              {parametres.besoinEnergetique === "Valeur par défaut utilisée"
                ? "1000 Wh/jour (défaut)"
                : `${parametres.besoinEnergetique} Wh/jour`}
            </span>
          </div>
        </div>
      </div>

      {/* Panneau sélectionné */}
      {resultats.panneauSelectionne && (
        <div className="resultats-section">
          <h4>🔆 Panneau sélectionné</h4>
          <div className="panneau-info">
            <div className="panneau-header">
              <h5>
                {resultats.panneauSelectionne.marque} {resultats.panneauSelectionne.modele}
              </h5>
              <span className="panneau-puissance">{resultats.panneauSelectionne.puissance}Wc</span>
            </div>
            <div className="panneau-specs-grid">
              <div className="spec-item">
                <span className="spec-label">Tension MPP:</span>
                <span className="spec-value">{resultats.panneauSelectionne.tensionMaxPuissance} V</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Tension nominale:</span>
                <span className="spec-value">{resultats.panneauSelectionne.tensionNominale} V</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Courant MPP:</span>
                <span className="spec-value">{resultats.panneauSelectionne.courantMaxPuissance} A</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Voc:</span>
                <span className="spec-value">{resultats.panneauSelectionne.tensionCircuitOuvert} V</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Rendement:</span>
                <span className="spec-value">{resultats.panneauSelectionne.rendement}%</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Poids:</span>
                <span className="spec-value">{resultats.panneauSelectionne.poids} kg</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NOUVELLE SECTION : Configuration série/parallèle */}
      {resultats.configurationPanneaux && !resultats.configurationPanneaux.erreur && (
        <div className="resultats-section">
          <h4>🔗 Configuration série/parallèle des panneaux</h4>

          {/* Validation de la configuration */}
          {resultats.validationConfiguration && (
            <div
              className={`validation-badge ${resultats.validationConfiguration.estValide ? "validation-ok" : "validation-warning"}`}
            >
              <span className="validation-icon">{resultats.validationConfiguration.estValide ? "✅" : "⚠️"}</span>
              <span className="validation-text">{resultats.validationConfiguration.recommandation}</span>
            </div>
          )}

          <div className="configuration-principale">
            <div className="config-schema">
              

              <div className="config-details">
                <div className="config-item highlight">
                  <span className="config-label">Panneaux en série par chaîne:</span>
                  <span className="config-value">{resultats.configurationPanneaux.panneauxEnSerie}</span>
                </div>
                <div className="config-item highlight">
                  <span className="config-label">Nombre de chaînes parallèles:</span>
                  <span className="config-value">{resultats.configurationPanneaux.chainesParalleles}</span>
                </div>
                <div className="config-item">
                  <span className="config-label">Total panneaux utilisés:</span>
                  <span className="config-value">{resultats.configurationPanneaux.nombrePanneauxUtilises}</span>
                </div>
                {resultats.configurationPanneaux.panneauxSupplementaires > 0 && (
                  <div className="config-item">
                    <span className="config-label">Panneaux supplémentaires:</span>
                    <span className="config-value">+{resultats.configurationPanneaux.panneauxSupplementaires}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="caracteristiques-electriques">
              <h5>Caractéristiques électriques de la configuration</h5>
              <div className="resultats-grid">
                <div className="resultat-item">
                  <span className="resultat-label">Tension par chaîne (MPP):</span>
                  <span className="resultat-value">
                    {resultats.configurationPanneaux.tensionReelleString.toFixed(1)} V
                  </span>
                </div>
                <div className="resultat-item">
                  <span className="resultat-label">Tension circuit ouvert:</span>
                  <span className="resultat-value">
                    {resultats.configurationPanneaux.tensionCircuitOuvertString.toFixed(1)} V
                  </span>
                </div>
                <div className="resultat-item">
                  <span className="resultat-label">Courant par chaîne:</span>
                  <span className="resultat-value">
                    {resultats.configurationPanneaux.courantMaxString.toFixed(2)} A
                  </span>
                </div>
                <div className="resultat-item highlight">
                  <span className="resultat-label">Courant total:</span>
                  <span className="resultat-value">
                    {resultats.configurationPanneaux.courantTotalString.toFixed(2)} A
                  </span>
                </div>
                <div className="resultat-item">
                  <span className="resultat-label">Puissance totale réelle:</span>
                  <span className="resultat-value">{resultats.configurationPanneaux.puissanceTotaleReelle} Wc</span>
                </div>
                <div className="resultat-item">
                  <span className="resultat-label">Efficacité configuration:</span>
                  
                </div>
              </div>
            </div>

            {/* Recommandations */}
            {resultats.configurationPanneaux.recommandations &&
              resultats.configurationPanneaux.recommandations.length > 0 && (
                <div className="recommandations-section">
                  <h5>Recommandations</h5>
                  <ul className="recommandations-list">
                    {resultats.configurationPanneaux.recommandations.map((rec, index) => (
                      <li key={index} className="recommandation-item">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>

          {/* Configurations alternatives */}
          {resultats.configurationsAlternatives && resultats.configurationsAlternatives.length > 0 && (
            <div className="configurations-alternatives">
              <h5>💡 Configurations alternatives suggérées</h5>
              <div className="alternatives-grid">
                {resultats.configurationsAlternatives.map((config, index) => (
                  <div key={index} className="alternative-item">
                    <div className="alternative-header">
                      <span className="alternative-tension">{config.tensionSysteme}V</span>
                     
                    </div> 
                    <div className="alternative-details">
                      <p>
                        {config.panneauxEnSerie} en série × {config.chainesParalleles} chaînes
                      </p>
                    
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dimensionnement des panneaux */}
      <div className="resultats-section">
        <h4>🎴 Dimensionnement des panneaux solaires</h4>
        <div className="resultats-grid">
          <div className="resultat-item">
            <span className="resultat-label">Production par panneau:</span>
            <span className="resultat-value">{Math.round(resultats.productionParPanneauParJour)} Wh/jour</span>
          </div>
          <div className="resultat-item highlight">
            <span className="resultat-label">Nombre de panneaux calculé:</span>
            <span className="resultat-value">{resultats.nombrePanneaux}</span>
          </div>
          {resultats.nombrePanneauxUtilises !== resultats.nombrePanneaux && (
            <div className="resultat-item highlight">
              <span className="resultat-label">Nombre de panneaux utilisés:</span>
              <span className="resultat-value">{resultats.nombrePanneauxUtilises}</span>
            </div>
          )}
          <div className="resultat-item">
            <span className="resultat-label">Surface totale:</span>
            <span className="resultat-value">{resultats.surfaceTotale.toFixed(2)} m²</span>
          </div>
          <div className="resultat-item">
            <span className="resultat-label">Puissance crête totale:</span>
            <span className="resultat-value">{resultats.puissanceCreteTotale} Wc</span>
          </div>
        </div>
      </div>

      {/* Fixations */}
      {resultats.fixations && (
        <div className="resultats-section">
          <h4>🔧 Système de fixation</h4>
          <div className="resultats-grid">
            <div className="resultat-item highlight">
              <span className="resultat-label">Clamps (pinces) nécessaires:</span>
              <span className="resultat-value">{resultats.fixations.clamps.nombreClampsTotal}<h5>(04 aux extrémités et 02 entre panneaux)</h5></span>
            </div>
            <div className="resultat-item highlight">
              <span className="resultat-label">Rails nécessaires:</span>
              <span className="resultat-value">{resultats.fixations.rails.nombreRails}</span>
            </div>
            <div className="resultat-item">
              <span className="resultat-label">Longueur totale de rails:</span>
              <span className="resultat-value">{resultats.fixations.rails.longueurTotaleRails} m</span>
            </div>
            <div className="resultat-item">
              <span className="resultat-label">Poids total fixations:</span>
              <span className="resultat-value">{resultats.fixations.poidsTotal} kg</span>
            </div>
          </div>
        </div>
      )}

      {/* Batteries */}
      {resultats.batteries && (
        <div className="resultats-section">
          <h4>🪫 Dimensionnement des batteries</h4>
          <div className="resultats-grid">
            <div className="resultat-item highlight">
              <span className="resultat-label">Nombre total de batteries:</span>
              <span className="resultat-value">{resultats.batteries.nombreTotalBatteries}</span>
            </div>
            <div className="resultat-item">
              <span className="resultat-label">Batteries en série:</span>
              <span className="resultat-value">{resultats.batteries.nombreBatteriesSerie}</span>
            </div>
            <div className="resultat-item">
              <span className="resultat-label">Branches en parallèle:</span>
              <span className="resultat-value">{resultats.batteries.nombreBranchesParalleles}</span>
            </div>
            <div className="resultat-item">
              <span className="resultat-label">Énergie stockée réelle:</span>
              <span className="resultat-value">{Math.round(resultats.batteries.energieStockeeReelle)} Wh</span>
            </div>
          </div>
        </div>
      )}

      {/* Équipements complémentaires */}
      <div className="resultats-section">
        <h4>🔖 Équipements complémentaires</h4>
        <div className="resultats-grid">
          <div className="resultat-item highlight">
            <span className="resultat-label">Puissance du régulateur:</span>
            <span className="resultat-value">{Math.round(resultats.puissanceRegulateur)} W</span>
          </div>
          <div className="resultat-item highlight">
            <span className="resultat-label">Puissance de l'onduleur:</span>
            <span className="resultat-value">{Math.round(resultats.puissanceOnduleur)} VA</span>
          </div>
          <div className="resultat-item">
            <span className="resultat-label">Courant max total:</span>
            <span className="resultat-value">{Math.round(resultats.courantMaxPanneaux * 10) / 10} A</span>
          </div>
        </div>
      </div>

      {/* Câblage */}
      {resultats.cables && (
        <div className="resultats-section">
          <h4>📏 Dimensionnement des câbles</h4>
          <div className="cables-details">
            <div className="cable-section">
              <h5>Panneaux → Régulateur</h5>
              <div className="cable-info">
                <div className="cable-params">
                  <span>▫️Distance: {resultats.cables.distances.panneauxRegulateur}m</span>
                  <span>▫️Courant: {resultats.cables.cables.panneauxRegulateur.courantUtilise.toFixed(2)}A</span>
                </div>
                <div className="cable-results">
                  <div className="resultat-item highlight">
                    <span className="resultat-label">Section recommandée:</span>
                    <span className="resultat-value">
                      {resultats.cables.cables.panneauxRegulateur.sectionRecommandee} mm²
                    </span>
                  </div>
                  <div className="resultat-item">
                    <span className="resultat-label">Chute de tension:</span>
                    <span className="resultat-value">
                      {resultats.cables.cables.panneauxRegulateur.chuteTensionReelle.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="cable-section">
              <h5>Régulateur → Batteries</h5>
              <div className="cable-info">
                <div className="cable-params">
                  <span>▫️Distance: {resultats.cables.distances.regulateurBatteries}m</span>
                  <span>▫️Courant: {resultats.cables.cables.regulateurBatteries.courantUtilise.toFixed(2)}A</span>
                </div>
                <div className="cable-results">
                  <div className="resultat-item highlight">
                    <span className="resultat-label">Section recommandée:</span>
                    <span className="resultat-value">
                      {resultats.cables.cables.regulateurBatteries.sectionRecommandee} mm²
                    </span>
                  </div>
                  <div className="resultat-item">
                    <span className="resultat-label">Chute de tension:</span>
                    <span className="resultat-value">
                      {resultats.cables.cables.regulateurBatteries.chuteTensionReelle.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {resultats.cables.cables.batteriesOnduleur && (
              <div className="cable-section">
                <h5>Batteries → Onduleur</h5>
                <div className="cable-info">
                  <div className="cable-params">
                    <span>▫️Distance: {resultats.cables.distances.batteriesOnduleur}m</span>
                    <span>▫️Courant: {resultats.cables.cables.batteriesOnduleur.courantUtilise.toFixed(2)}A</span>
                  </div>
                  <div className="cable-results">
                    <div className="resultat-item highlight">
                      <span className="resultat-label">Section recommandée:</span>
                      <span className="resultat-value">
                        {resultats.cables.cables.batteriesOnduleur.sectionRecommandee} mm²
                      </span>
                    </div>
                    <div className="resultat-item">
                      <span className="resultat-label">Chute de tension:</span>
                      <span className="resultat-value">
                        {resultats.cables.cables.batteriesOnduleur.chuteTensionReelle.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="resultats-actions">
        <button onClick={onExportPDF} className="btn-primary">
          📄 Exporter en PDF
        </button>
        <button onClick={onRetour} className="btn-secondary">
          Retour aux paramètres
        </button>
      </div>

      {/* Styles CSS pour les nouvelles sections */}
      <style jsx>{`
        .validation-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-weight: bold;
        }
        
        .validation-ok {
          background-color: rgba(34, 197, 94, 0.2);
          border: 1px solid #22c55e;
          color: #22c55e;
        }
        
        .validation-warning {
          background-color: rgba(251, 146, 60, 0.2);
          border: 1px solid #fb923c;
          color: #fb923c;
        }
        
        .configuration-principale {
          background-color: rgba(255, 255, 255, 0.1);
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        
        .config-schema {
          margin-bottom: 20px;
        }
        
        .schema-description {
          text-align: center;
          margin-bottom: 15px;
        }
        
        .config-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .config-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 15px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 6px;
        }
        
        .config-item.highlight {
          background-color: rgba(252, 211, 77, 0.2);
          border-left: 3px solid #fcd34d;
        }
        
        .config-label {
          font-size: 0.9rem;
          opacity: 0.9;
        }
        
        .config-value {
          font-weight: bold;
          color: #fcd34d;
          font-size: 1.1rem;
        }
        
        .caracteristiques-electriques {
          margin-top: 20px;
        }
        
        .recommandations-section {
          margin-top: 20px;
          padding: 15px;
          background-color: rgba(59, 130, 246, 0.1);
          border-radius: 8px;
          border-left: 4px solid #3b82f6;
        }
        
        .recommandations-list {
          list-style: none;
          padding: 0;
          margin: 10px 0 0 0;
        }
        
        .recommandation-item {
          padding: 5px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .recommandation-item:last-child {
          border-bottom: none;
        }
        
        .configurations-alternatives {
          margin-top: 20px;
          padding: 15px;
          background-color: rgba(168, 85, 247, 0.1);
          border-radius: 8px;
          border-left: 4px solid #a855f7;
        }
        
        .alternatives-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }
        
        .alternative-item {
          background-color: rgba(255, 255, 255, 0.1);
          padding: 15px;
          border-radius: 8px;
          text-align: center;
        }
        
        .alternative-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          font-weight: bold;
        }
        
        .alternative-tension {
          color: #fcd34d;
          font-size: 1.2rem;
        }
        
        .alternative-score {
          background-color: rgba(34, 197, 94, 0.3);
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
        }
        
        .alternative-details {
          font-size: 0.9rem;
          opacity: 0.9;
        }
        
        .alternative-details p {
          margin: 5px 0;
        }
      `}</style>
    </div>
  )
}

export default ResultatsDimensionnement
