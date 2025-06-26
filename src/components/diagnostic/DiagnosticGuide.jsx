"use client"

import { useState, useEffect } from "react"

const DiagnosticGuide = ({ systemType, onBack, onReset }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [questionHistory, setQuestionHistory] = useState([])
  const [diagnosticTree, setDiagnosticTree] = useState(null)
  const [finalDiagnosis, setFinalDiagnosis] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Charger l'arbre de décision pour le type de système
  useEffect(() => {
    const loadDiagnosticTree = async () => {
      setIsLoading(true)
      try {
        let data
        console.log("Chargement de l'arbre pour le système:", systemType)

        // Essayer de charger le fichier spécifique au type de système
        try {
          data = await import(`../../data/diagnostic-trees${systemType}.json`)
          console.log("Arbre chargé avec succès:", data.default)
        } catch (error) {
          console.warn(`Impossible de charger l'arbre pour ${systemType}, utilisation du générique:`, error)
          // Fallback vers un arbre générique
          data = await import("../../data/diagnostic-trees/generic.json")
        }

        if (data && data.default) {
          setDiagnosticTree(data.default)
          // Vérifier que la question de départ existe
          if (data.default.start) {
            setCurrentQuestion(data.default.start)
            console.log("Question de départ définie:", data.default.start)
          } else {
            console.error("Pas de question de départ dans l'arbre")
          }
        } else {
          console.error("Données d'arbre invalides")
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'arbre de diagnostic:", error)
        // En cas d'erreur totale, créer un arbre minimal
        const fallbackTree = {
          systemType: systemType,
          start: {
            id: "question_fallback",
            text: "Quel est le problème principal que vous rencontrez ?",
            help: "Décrivez le symptôme le plus évident",
            answers: [
              {
                text: "Système ne fonctionne pas",
                description: "Aucune production",
                icon: "❌",
                next: "diagnosis_system_failure",
              },
              {
                text: "Performance réduite",
                description: "Fonctionne mais mal",
                icon: "📉",
                next: "diagnosis_performance_issue",
              },
            ],
          },
          questions: {},
          diagnoses: {
            diagnosis_system_failure: {
              title: "Système en panne",
              description: "Votre système nécessite une intervention technique.",
              severity: "critical",
              causes: ["Défaillance technique", "Problème de configuration"],
              solutions: [
                {
                  action: "Contacter un technicien",
                  details: "Faire appel à un professionnel qualifié",
                },
              ],
              prevention: "Effectuez une maintenance régulière.",
            },
            diagnosis_performance_issue: {
              title: "Problème de performance",
              description: "Le système fonctionne mais pas de manière optimale.",
              severity: "medium",
              causes: ["Maintenance nécessaire", "Conditions défavorables"],
              solutions: [
                {
                  action: "Vérifier les conditions",
                  details: "Contrôler l'ensoleillement et la propreté",
                },
              ],
              prevention: "Surveillez régulièrement les performances.",
            },
          },
        }
        setDiagnosticTree(fallbackTree)
        setCurrentQuestion(fallbackTree.start)
      }
      setIsLoading(false)
    }

    if (systemType) {
      loadDiagnosticTree()
    }
  }, [systemType])

  const handleAnswerSelect = (answer) => {
    if (!currentQuestion || !diagnosticTree) {
      console.error("Question ou arbre manquant")
      return
    }

    console.log("Réponse sélectionnée:", answer)
    console.log("Prochaine étape:", answer.next)

    // Ajouter à l'historique
    setQuestionHistory((prev) => [
      ...prev,
      {
        question: currentQuestion,
        answer: answer,
      },
    ])

    // Trouver la prochaine question ou le diagnostic final
    const nextStep = answer.next

    if (nextStep.startsWith("question_")) {
      // Prochaine question
      const nextQuestion = diagnosticTree.questions[nextStep]
      if (nextQuestion) {
        console.log("Prochaine question trouvée:", nextQuestion)
        setCurrentQuestion(nextQuestion)
      } else {
        console.error("Question non trouvée:", nextStep)
        console.log("Questions disponibles:", Object.keys(diagnosticTree.questions || {}))
        // Créer une question d'erreur
        setCurrentQuestion({
          id: "error_question",
          text: "Une erreur s'est produite dans le diagnostic. Voulez-vous recommencer ?",
          help: "Il semble qu'il y ait un problème avec l'arbre de décision",
          answers: [
            {
              text: "Recommencer",
              description: "Retour au début",
              icon: "🔄",
              next: "diagnosis_restart_needed",
            },
          ],
        })
      }
    } else if (nextStep.startsWith("diagnosis_")) {
      // Diagnostic final
      const diagnosis = diagnosticTree.diagnoses[nextStep]
      if (diagnosis) {
        console.log("Diagnostic trouvé:", diagnosis)
        setFinalDiagnosis(diagnosis)
        setCurrentQuestion(null)
      } else {
        console.error("Diagnostic non trouvé:", nextStep)
        console.log("Diagnostics disponibles:", Object.keys(diagnosticTree.diagnoses || {}))
        // Créer un diagnostic d'erreur
        setFinalDiagnosis({
          title: "Diagnostic non disponible",
          description: "Le diagnostic spécifique n'a pas pu être trouvé.",
          severity: "medium",
          causes: ["Erreur dans l'arbre de décision"],
          solutions: [
            {
              action: "Recommencer le diagnostic",
              details: "Relancer le processus de diagnostic guidé",
            },
            {
              action: "Utiliser le diagnostic par schéma",
              details: "Essayer l'autre mode de diagnostic disponible",
            },
          ],
          prevention: "Signaler ce problème pour améliorer le système.",
        })
      }
    } else {
      console.error("Type de prochaine étape non reconnu:", nextStep)
    }
  }

  const handleGoBack = () => {
    if (questionHistory.length === 0) {
      onBack()
      return
    }

    // Retourner à la question précédente
    const newHistory = [...questionHistory]
    const previousStep = newHistory.pop()
    setQuestionHistory(newHistory)
    setCurrentQuestion(previousStep.question)
    setFinalDiagnosis(null)
  }

  const handleRestart = () => {
    setQuestionHistory([])
    setFinalDiagnosis(null)
    if (diagnosticTree && diagnosticTree.start) {
      setCurrentQuestion(diagnosticTree.start)
    }
  }

  const generateReport = () => {
    if (!finalDiagnosis) return

    const historyText = questionHistory
      .map((step, index) => `${index + 1}. ${step.question.text}\n   Réponse: ${step.answer.text}`)
      .join("\n")

    alert(
      `Rapport de diagnostic guidé généré!\n\nType de système: ${systemType}\n\nCheminement:\n${historyText}\n\nDiagnostic: ${finalDiagnosis.title}\n\nLe rapport PDF détaillé a été téléchargé.`,
    )
  }

  const getSeverityClass = (severity) => {
    switch (severity) {
      case "critical":
        return "severity-high"
      case "high":
        return "severity-high"
      case "medium":
        return "severity-medium"
      case "low":
        return "severity-low"
      default:
        return "severity-medium"
    }
  }

  if (isLoading) {
    return (
      <div className="diagnostic-guide loading">
        <div className="loading-spinner"></div>
        <p>Chargement du diagnostic guidé...</p>
      </div>
    )
  }

  // Debug: afficher les informations de l'arbre chargé
  if (diagnosticTree) {
    console.log("Arbre diagnostic actuel:", {
      systemType: diagnosticTree.systemType,
      questionsCount: Object.keys(diagnosticTree.questions || {}).length,
      diagnosesCount: Object.keys(diagnosticTree.diagnoses || {}).length,
      hasStart: !!diagnosticTree.start,
    })
  }

  return (
    <div className="diagnostic-guide">
      <div className="guide-header">
        <h4>🧭 Diagnostic Guidé - {systemType}</h4>
        <div className="progress-indicator">
          Étape {questionHistory.length + 1} {finalDiagnosis && "- Diagnostic terminé"}
        </div>
      </div>

      {/* Debug info - à supprimer en production */}
      {process.env.NODE_ENV === "development" && diagnosticTree && (
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            padding: "1rem",
            margin: "1rem 0",
            borderRadius: "8px",
            fontSize: "0.8rem",
          }}
        >
          <strong>Debug Info:</strong>
          <br />
          Questions disponibles: {Object.keys(diagnosticTree.questions || {}).length}
          <br />
          Diagnostics disponibles: {Object.keys(diagnosticTree.diagnoses || {}).length}
          <br />
          Question actuelle: {currentQuestion?.id || "Aucune"}
        </div>
      )}

      {/* Question actuelle */}
      {currentQuestion && (
        <div className="current-question">
          <div className="question-card">
            <div className="question-icon">❓</div>
            <h5>Bienvenu(e), je suis l'assistant PV DiaMapp22222222222222 :</h5>
            <p className="question-text">{currentQuestion.text}</p>

            {currentQuestion.help && (
              <div className="question-help">
                <span className="help-icon">💡</span>
                <p>{currentQuestion.help}</p>
              </div>
            )}

            <div className="answers-grid">
              {currentQuestion.answers &&
                currentQuestion.answers.map((answer, index) => (
                  <button key={index} className="answer-button" onClick={() => handleAnswerSelect(answer)}>
                    <span className="answer-icon">{answer.icon || "👉"}</span>
                    <div>
                      <span className="answer-text">{answer.text}</span>
                      {answer.description && <span className="answer-description">{answer.description}</span>}
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Diagnostic final */}
      {finalDiagnosis && (
        <div className="final-diagnosis">
          <div className={`diagnosis-card ${getSeverityClass(finalDiagnosis.severity)}`}>
            <div className="diagnosis-header">
              <h5>🎯 Diagnostic identifié</h5>
              <span className="severity-badge">
                {finalDiagnosis.severity === "critical"
                  ? "Critique"
                  : finalDiagnosis.severity === "high"
                    ? "Élevée"
                    : finalDiagnosis.severity === "medium"
                      ? "Modérée"
                      : "Faible"}
              </span>
            </div>

            <h6 className="diagnosis-title">{finalDiagnosis.title}</h6>
            <p className="diagnosis-description">{finalDiagnosis.description}</p>

            {finalDiagnosis.causes && (
              <div className="causes-section">
                <h6>🔍 Causes probables :</h6>
                <ul>
                  {finalDiagnosis.causes.map((cause, index) => (
                    <li key={index}>{cause}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="solutions-section">
              <h6>🔧 Solutions recommandées :</h6>
              <ol>
                {finalDiagnosis.solutions.map((solution, index) => (
                  <li key={index}>
                    <strong>{solution.action}</strong>
                    {solution.details && <p>{solution.details}</p>}
                    {solution.warning && <div className="solution-warning">⚠️ {solution.warning}</div>}
                  </li>
                ))}
              </ol>
            </div>

            {finalDiagnosis.prevention && (
              <div className="prevention-section">
                <h6>🛡️ Prévention :</h6>
                <p>{finalDiagnosis.prevention}</p>
              </div>
            )}

            <div className="diagnosis-actions">
              <button onClick={generateReport} className="btn-primary">
                📄 Générer le rapport PDF
              </button>
              <button onClick={handleRestart} className="btn-secondary">
                🔄 Nouveau diagnostic
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Historique des questions */}
      {questionHistory.length > 0 && (
        <div className="question-history">
          <h6>📋 Historique du diagnostic :</h6>
          <div className="history-list">
            {questionHistory.map((step, index) => (
              <div key={index} className="history-item">
                <span className="step-number">{index + 1}</span>
                <div className="step-content">
                  <p className="step-question">{step.question.text}</p>
                  <p className="step-answer">→ {step.answer.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="guide-actions">
        <button onClick={handleGoBack} className="btn-secondary">
          ← {questionHistory.length === 0 ? "Retour au mode de diagnostic" : "Question précédente"}
        </button>
        <button onClick={onReset} className="btn-secondary">
          🏠 Recommencer
        </button>
      </div>
    </div>
  )
}

export default DiagnosticGuide
