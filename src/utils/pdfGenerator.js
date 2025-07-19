import jsPDF from "jspdf"
import "jspdf-autotable"

// Configuration des polices et couleurs
const COLORS = {
  primary: "#65bdb8",
  accent: "#fcd34d",
  text: "#333333",
  lightGray: "#f5f5f5",
  darkGray: "#666666",
}

// Fonction pour remplacer les émojis par du texte
const replaceEmojisWithText = (text) => {
  if (!text) return text

  const emojiMap = {
    // Émojis de diagnostic
    "🧭": "[DIAGNOSTIC]",
    "🎯": "[RESULTAT]",
    "🔍": "[ANALYSE]",
    "🔧": "[SOLUTION]",
    "🛡️": "[PREVENTION]",
    "⚠️": "[ATTENTION]",
    "❌": "[ERREUR]",
    "✅": "[OK]",
    "📉": "[BAISSE]",
    "📊": "[GRAPHIQUE]",
    "📋": "[RAPPORT]",
    "📄": "[DOCUMENT]",
    "💡": "[CONSEIL]",
    "🔄": "[REDEMARRER]",
    "🏠": "[ACCUEIL]",
    "👷🏾": "[ASSISTANT]",
    "👉": "[FLECHE]",

    // Émojis de maintenance
    "🔆": "[PANNEAUX]",
    "⚡": "[ONDULEUR]",
    "🔋": "[BATTERIES]",
    "🎛️": "[REGULATEUR]",
    "🔌": "[CABLAGE]",
    "💰": "[COUT]",
    "📐": "[DIMENSIONNEMENT]",
    "➗": "[CALCUL]",
    "📺": "[EQUIPEMENTS]",
    "📈": "[PERFORMANCE]",

    // Symboles de navigation
    "←": "<-",
    "→": "->",
    "↑": "^",
    "↓": "v",
  }

  let cleanText = text
  Object.entries(emojiMap).forEach(([emoji, replacement]) => {
    cleanText = cleanText.replace(new RegExp(emoji, "g"), replacement)
  })

  // Supprimer tous les autres émojis non mappés
  cleanText = cleanText.replace(
    /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu,
    "[EMOJI]",
  )

  return cleanText
}

// Fonction utilitaire pour formater la date
const formatDate = () => {
  return new Date().toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Fonction pour ajouter l'en-tête du document
const addHeader = (doc, title, systemType = null) => {
  // Logo/Titre principal
  doc.setFontSize(20)
  doc.setTextColor(COLORS.primary)
  doc.text("PV DiaMapp", 20, 25)

  // Titre du rapport
  doc.setFontSize(16)
  doc.setTextColor(COLORS.text)
  doc.text(replaceEmojisWithText(title), 20, 40)

  // Type de système si fourni
  if (systemType) {
    doc.setFontSize(12)
    doc.setTextColor(COLORS.darkGray)
    doc.text(`Type de systeme: ${systemType}`, 20, 50)
  }

  // Date de génération
  doc.setFontSize(10)
  doc.setTextColor(COLORS.darkGray)
  doc.text(`Genere le: ${formatDate()}`, 20, 60)

  // Ligne de séparation
  doc.setDrawColor(COLORS.accent)
  doc.setLineWidth(0.5)
  doc.line(20, 65, 190, 65)

  return 75 // Position Y pour le contenu suivant
}

// Fonction pour ajouter le pied de page
const addFooter = (doc) => {
  const pageHeight = doc.internal.pageSize.height
  doc.setFontSize(8)
  doc.setTextColor(COLORS.darkGray)
  doc.text("(c) 2024 PV DiaMapp - Tous droits reserves - Par DANIEL TCHANIA", 20, pageHeight - 10)
  doc.text(`Page ${doc.internal.getNumberOfPages()}`, 170, pageHeight - 10)
}

// RAPPORT DE DIMENSIONNEMENT
export const generateSizingReport = (systemData, results) => {
  const doc = new jsPDF()

  let yPosition = addHeader(doc, "RAPPORT DE DIMENSIONNEMENT SOLAIRE")

  // Paramètres du système
  yPosition += 10
  doc.setFontSize(14)
  doc.setTextColor(COLORS.accent)
  doc.text("PARAMETRES DU SYSTEME", 20, yPosition)
  yPosition += 10

  doc.setFontSize(10)
  doc.setTextColor(COLORS.text)

  if (systemData) {
    Object.entries(systemData).forEach(([key, value]) => {
      if (typeof value === "object") return // Ignorer les objets complexes

      const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
      doc.text(`${replaceEmojisWithText(label)}: ${replaceEmojisWithText(String(value))}`, 25, yPosition)
      yPosition += 6
    })
    yPosition += 10
  }

  // Résultats du dimensionnement
  if (results) {
    doc.setFontSize(14)
    doc.setTextColor(COLORS.accent)
    doc.text("RESULTATS DU DIMENSIONNEMENT", 20, yPosition)
    yPosition += 10

    // Tableau des composants
    const tableData = []

    if (results.panneaux) {
      tableData.push([
        "Panneaux solaires",
        `${results.panneaux.nombre} x ${results.panneaux.puissance}W`,
        `${results.panneaux.puissanceTotal}W`,
        results.panneaux.type || "Monocristallin",
      ])
    }

    if (results.batteries) {
      tableData.push([
        "Batteries",
        `${results.batteries.nombre} x ${results.batteries.capacite}Ah`,
        `${results.batteries.capaciteTotal}Ah`,
        results.batteries.type || "AGM",
      ])
    }

    if (results.onduleur) {
      tableData.push(["Onduleur", results.onduleur.type, `${results.onduleur.puissance}W`, results.onduleur.tension])
    }

    if (results.regulateur) {
      tableData.push([
        "Regulateur",
        results.regulateur.type,
        `${results.regulateur.courant}A`,
        results.regulateur.tensionMax,
      ])
    }

    if (tableData.length > 0) {
      doc.autoTable({
        startY: yPosition,
        head: [["Composant", "Specification", "Valeur", "Details"]],
        body: tableData,
        theme: "grid",
        headStyles: { fillColor: [101, 189, 184] },
        margin: { left: 20, right: 20 },
        styles: { fontSize: 9 },
      })

      yPosition = doc.lastAutoTable.finalY + 15
    }
  }

  // Coûts estimés
  if (results && results.couts) {
    if (yPosition > 180) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFontSize(14)
    doc.setTextColor(COLORS.accent)
    doc.text("ESTIMATION DES COUTS", 20, yPosition)
    yPosition += 10

    const costData = []
    Object.entries(results.couts).forEach(([item, cost]) => {
      const label = item.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
      costData.push([replaceEmojisWithText(label), `${cost.toLocaleString("fr-FR")} FCFA`])
    })

    if (costData.length > 0) {
      doc.autoTable({
        startY: yPosition,
        head: [["Element", "Cout"]],
        body: costData,
        theme: "grid",
        headStyles: { fillColor: [252, 211, 77] },
        margin: { left: 20, right: 20 },
        styles: { fontSize: 10 },
      })

      yPosition = doc.lastAutoTable.finalY + 15
    }
  }

  // Performance estimée
  if (results && results.performance) {
    if (yPosition > 200) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFontSize(14)
    doc.setTextColor(COLORS.accent)
    doc.text("PERFORMANCE ESTIMEE", 20, yPosition)
    yPosition += 10

    doc.setFontSize(10)
    doc.setTextColor(COLORS.text)

    Object.entries(results.performance).forEach(([key, value]) => {
      const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
      doc.text(`${replaceEmojisWithText(label)}: ${replaceEmojisWithText(String(value))}`, 25, yPosition)
      yPosition += 6
    })
  }

  // Recommandations
  if (yPosition > 240) {
    doc.addPage()
    yPosition = 20
  }

  doc.setFontSize(14)
  doc.setTextColor(COLORS.accent)
  doc.text("RECOMMANDATIONS", 20, yPosition)
  yPosition += 10

  doc.setFontSize(10)
  doc.setTextColor(COLORS.text)

  const recommendations = [
    "Faire installer le systeme par un professionnel qualifie",
    "Respecter les normes de securite en vigueur",
    "Prevoir une maintenance preventive reguliere",
    "Surveiller les performances du systeme",
    "Conserver les garanties des equipements",
  ]

  recommendations.forEach((rec) => {
    doc.text(`• ${rec}`, 25, yPosition)
    yPosition += 6
  })

  addFooter(doc)
  doc.save(`Dimensionnement_Solaire_${new Date().toISOString().split("T")[0]}.pdf`)
}

// RAPPORT DE DIAGNOSTIC GUIDÉ
export const generateDiagnosticReport = (systemType, questionHistory, finalDiagnosis) => {
  const doc = new jsPDF()

  let yPosition = addHeader(doc, "RAPPORT DE DIAGNOSTIC GUIDE", systemType)

  // Résumé du diagnostic
  yPosition += 10
  doc.setFontSize(14)
  doc.setTextColor(COLORS.accent)
  doc.text("RESUME DU DIAGNOSTIC", 20, yPosition)

  yPosition += 10
  doc.setFontSize(12)
  doc.setTextColor(COLORS.text)

  if (finalDiagnosis) {
    // Titre du diagnostic
    doc.setFont(undefined, "bold")
    doc.text(`Diagnostic: ${replaceEmojisWithText(finalDiagnosis.title)}`, 20, yPosition)
    yPosition += 8

    // Sévérité
    doc.setFont(undefined, "normal")
    const severityText =
      finalDiagnosis.severity === "critical"
        ? "Critique"
        : finalDiagnosis.severity === "high"
          ? "Elevee"
          : finalDiagnosis.severity === "medium"
            ? "Moderee"
            : "Faible"
    doc.text(`Severite: ${severityText}`, 20, yPosition)
    yPosition += 8

    // Description
    const description = doc.splitTextToSize(replaceEmojisWithText(finalDiagnosis.description), 150)
    doc.text(description, 20, yPosition)
    yPosition += description.length * 6 + 10
  }

  addFooter(doc)
  doc.save(`Diagnostic_${systemType}_${new Date().toISOString().split("T")[0]}.pdf`)
}

// RAPPORT DE MAINTENANCE PRÉVENTIVE
export const generateMaintenanceReport = (checkedActions, maintenanceActions) => {
  const doc = new jsPDF()

  let yPosition = addHeader(doc, "RAPPORT DE MAINTENANCE PREVENTIVE")

  // Calcul du taux de completion
  const totalActions = Object.values(maintenanceActions).reduce((total, section) => total + section.actions.length, 0)
  const checkedCount = Object.values(checkedActions).filter(Boolean).length
  const completionRate = Math.round((checkedCount / totalActions) * 100)

  // Résumé
  yPosition += 10
  doc.setFontSize(14)
  doc.setTextColor(COLORS.accent)
  doc.text("RESUME DE LA MAINTENANCE", 20, yPosition)

  yPosition += 10
  doc.setFontSize(12)
  doc.setTextColor(COLORS.text)
  doc.text(`Taux de completion: ${completionRate}%`, 20, yPosition)
  yPosition += 8
  doc.text(`Actions realisees: ${checkedCount} sur ${totalActions}`, 20, yPosition)
  yPosition += 15

  addFooter(doc)
  doc.save(`Maintenance_Preventive_${new Date().toISOString().split("T")[0]}.pdf`)
}

// FONCTION GÉNÉRIQUE POUR AUTRES RAPPORTS
export const generateGenericReport = (title, data, sections = []) => {
  const doc = new jsPDF()

  let yPosition = addHeader(doc, replaceEmojisWithText(title))

  sections.forEach((section) => {
    if (yPosition > 220) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFontSize(14)
    doc.setTextColor(COLORS.accent)
    doc.text(replaceEmojisWithText(section.title), 20, yPosition)
    yPosition += 10

    doc.setFontSize(10)
    doc.setTextColor(COLORS.text)

    if (section.content) {
      const content = doc.splitTextToSize(replaceEmojisWithText(section.content), 150)
      doc.text(content, 20, yPosition)
      yPosition += content.length * 6 + 10
    }

    if (section.items) {
      section.items.forEach((item) => {
        doc.text(`• ${replaceEmojisWithText(item)}`, 25, yPosition)
        yPosition += 6
      })
      yPosition += 5
    }
  })

  addFooter(doc)
  doc.save(`${title.replace(/[^a-zA-Z0-9]/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`)
}
