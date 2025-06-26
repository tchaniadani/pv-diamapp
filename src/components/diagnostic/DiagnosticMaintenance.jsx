"use client"

import { useState } from "react"
import MaintenancePreventive from "./MaintenancePreventive"
import MaintenanceCurative from "./MaintenanceCurative"
import "../../styles.css"

const DiagnosticMaintenance = () => {
  const [maintenanceType, setMaintenanceType] = useState("")

  const handleReset = () => {
    setMaintenanceType("")
  }

  return (
    <div className="form-container">
      <h1>🛠️⚙️ Diagnostic et Maintenance</h1>
      <h3 className="Eff-Maint">Effectuez une maintenance sur votre installation.</h3>

      {!maintenanceType && (
       
          <div className="maintenance-options">
            <div className="maintenance-option preventive" onClick={() => setMaintenanceType("preventive")}>
              <div className="option-icon">🔧</div>
              <h5>Maintenance Préventive</h5>
              <p>Actions de maintenance régulière pour prévenir les pannes et optimiser les performances</p>
            </div>

            <div className="maintenance-option curative" onClick={() => setMaintenanceType("curative")}>
              <div className="option-icon">🚨</div>
              <h5>Maintenance Curative</h5>
              <p>Diagnostic et réparation suite à une panne ou un dysfonctionnement</p>
            </div>
          </div>
        
      )}

      {maintenanceType === "preventive" && <MaintenancePreventive onBack={handleReset} />}

      {maintenanceType === "curative" && <MaintenanceCurative onBack={handleReset} />}
    </div>
  )
}

export default DiagnosticMaintenance
