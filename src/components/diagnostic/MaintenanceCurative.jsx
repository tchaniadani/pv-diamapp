"use client"

import { useState } from "react"
import SystemTypeSelector from "./SystemTypeSelector"
import DiagnosticModeSelector from "./DiagnosticModeSelector"
import DiagnosticGuide from "./DiagnosticGuide"
import SystemSchematic from "./SystemSchematic"
import ErrorCodeDiagnostic from "./ErrorCodeDiagnostic"

const MaintenanceCurative = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState("system-type") // 'system-type', 'diagnostic-mode', 'guided-diagnostic', 'schematic', 'diagnostic'
  const [selectedSystemType, setSelectedSystemType] = useState("")
  // Variable supprimée car non utilisée
  const [selectedComponent, setSelectedComponent] = useState("")

  const handleSystemTypeSelect = (systemType) => {
    setSelectedSystemType(systemType)
    setCurrentStep("diagnostic-mode")
  }

  const handleDiagnosticModeSelect = (mode) => {
    if (mode === "guided") {
      setCurrentStep("guided-diagnostic")
    } else if (mode === "schematic") {
      setCurrentStep("schematic")
    }
  }

  const handleComponentSelect = (component) => {
    setSelectedComponent(component)
    setCurrentStep("diagnostic")
  }

  const handleReset = () => {
    setCurrentStep("system-type")
    setSelectedSystemType("")
    setSelectedComponent("")
  }

  const handleBackToSystemType = () => {
    setCurrentStep("system-type")
    setSelectedSystemType("")
    setSelectedComponent("")
  }

  const handleBackToDiagnosticMode = () => {
    setCurrentStep("diagnostic-mode")
    setSelectedComponent("")
  }

  const handleBackToSchematic = () => {
    setCurrentStep("schematic")
    setSelectedComponent("")
  }

  return (
    <div className="maintenance-curative">
      <div className="curative-header">
        <h3>🚨 Maintenance Curative</h3>
        <div className="breadcrumb">
          <span className={currentStep === "system-type" ? "active" : ""}>1- Type de système</span>
          <span className={currentStep === "diagnostic-mode" ? "active" : ""}>2- Mode de diagnostic</span>
          <span className={currentStep === "guided-diagnostic" ? "active" : ""}>3a- Diagnostic guidé</span>
          <span className={currentStep === "schematic" ? "active" : ""}>3b- Identification</span>
          <span className={currentStep === "diagnostic" ? "active" : ""}>4- Diagnostic</span>
        </div>
      </div>

      {currentStep === "system-type" && <SystemTypeSelector onSystemSelect={handleSystemTypeSelect} onBack={onBack} />}

      {currentStep === "diagnostic-mode" && (
        <DiagnosticModeSelector
          systemType={selectedSystemType}
          onModeSelect={handleDiagnosticModeSelect}
          onBack={handleBackToSystemType}
        />
      )}

      {currentStep === "guided-diagnostic" && (
        <DiagnosticGuide systemType={selectedSystemType} onBack={handleBackToDiagnosticMode} onReset={handleReset} />
      )}

      {currentStep === "schematic" && (
        <SystemSchematic
          systemType={selectedSystemType}
          onComponentSelect={handleComponentSelect}
          onBack={handleBackToDiagnosticMode}
        />
      )}

      {currentStep === "diagnostic" && (
        <ErrorCodeDiagnostic
          systemType={selectedSystemType}
          component={selectedComponent}
          onBack={handleBackToSchematic}
          onReset={handleReset}
        />
      )}
    </div>
  )
}

export default MaintenanceCurative
