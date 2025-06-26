"use client"

import { useState } from "react"

const MaintenancePreventive = ({ onBack }) => {
  const [checkedActions, setCheckedActions] = useState({})
  const [completedSections, setCompletedSections] = useState({})

  const maintenanceActions = {
    panneaux: {
      title: "🔆 Panneaux Solaires",
      actions: [
        "Nettoyer la surface des panneaux",
        "Vérifier l'absence de fissures ou dommages",
        "Contrôler la fixation des panneaux",
        "Vérifier l'absence d'ombrage",
        "Mesurer la tension de sortie",
        "Contrôler les connecteurs MC4",
      ],
    },
    onduleur: {
      title: "⚡ Onduleur",
      actions: [
        "Vérifier l'affichage et les voyants",
        "Contrôler la ventilation",
        "Nettoyer les filtres à air",
        "Vérifier les connexions électriques",
        "Contrôler la température de fonctionnement",
        "Tester les protections",
      ],
    },
    batteries: {
      title: "🔋 Batteries (si applicable)",
      actions: [
        "Mesurer la tension de chaque batterie",
        "Contrôler le niveau d'électrolyte",
        "Nettoyer les bornes",
        "Vérifier l'étanchéité",
        "Contrôler la température",
        "Tester la capacité",
      ],
    },
    regulateur: {
      title: "🎛️ Régulateur de Charge",
      actions: [
        "Vérifier l'affichage LCD",
        "Contrôler les paramètres de charge",
        "Vérifier les connexions",
        "Tester les modes de fonctionnement",
        "Contrôler la ventilation",
        "Vérifier les fusibles",
      ],
    },
    cablage: {
      title: "🔌 Câblage et Connexions",
      actions: [
        "Vérifier l'état des câbles",
        "Contrôler les connexions",
        "Mesurer la résistance d'isolement",
        "Vérifier les protections",
        "Contrôler la mise à la terre",
        "Tester la continuité",
      ],
    },
  }

  const handleActionCheck = (section, actionIndex) => {
    const key = `${section}-${actionIndex}`
    setCheckedActions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSectionComplete = (section) => {
    const sectionActions = maintenanceActions[section].actions
    const allChecked = sectionActions.every((_, index) => checkedActions[`${section}-${index}`])

    if (allChecked) {
      setCompletedSections((prev) => ({
        ...prev,
        [section]: true,
      }))
    }
  }

  const getCompletionPercentage = () => {
    const totalActions = Object.values(maintenanceActions).reduce((total, section) => total + section.actions.length, 0)
    const checkedCount = Object.values(checkedActions).filter(Boolean).length
    return Math.round((checkedCount / totalActions) * 100)
  }

  const generateReport = () => {
    const completionRate = getCompletionPercentage()
    const completedActions = Object.entries(checkedActions)
      .filter(([_, checked]) => checked)
      .map(([key, _]) => {
        const [section, index] = key.split("-")
        return `${maintenanceActions[section].title}: ${maintenanceActions[section].actions[index]}`
      })

    alert(
      `Rapport de maintenance préventive généré!\n\nTaux de completion: ${completionRate}%\nActions réalisées: ${completedActions.length}\n\nLe rapport PDF a été téléchargé.`,
    )
  }

  return (
    <div className="maintenance-preventive">
      <div className="maintenance-header">
        <h3>🔧 Maintenance Préventive</h3>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${getCompletionPercentage()}%` }}></div>
          <span className="progress-text">{getCompletionPercentage()}% complété</span>
        </div>
      </div>

      <div className="maintenance-sections">
        {Object.entries(maintenanceActions).map(([sectionKey, section]) => (
          <div key={sectionKey} className={`maintenance-section ${completedSections[sectionKey] ? "completed" : ""}`}>
            <h4>{section.title}</h4>
            <div className="actions-list">
              {section.actions.map((action, index) => (
                <div key={index} className="action-item">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={checkedActions[`${sectionKey}-${index}`] || false}
                      onChange={() => handleActionCheck(sectionKey, index)}
                    />
                    <span className="checkmark"></span>
                    <span className="action-text">{action}</span>
                  </label>
                </div>
              ))}
            </div>
            <button
              className="btn-section-complete"
              onClick={() => handleSectionComplete(sectionKey)}
              disabled={!section.actions.every((_, index) => checkedActions[`${sectionKey}-${index}`])}
            >
              ✅ Section terminée
            </button>
          </div>
        ))}
      </div>

      <div className="maintenance-actions">
        <button onClick={generateReport} className="btn-primary">
          📄 Générer le rapport PDF
        </button>
        <button onClick={onBack} className="btn-secondary">
          ← Retour
        </button>
      </div>
    </div>
  )
}

export default MaintenancePreventive
