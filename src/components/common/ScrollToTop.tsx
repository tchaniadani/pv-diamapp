"use client"

import { useState, useEffect } from "react"

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  // Fonction pour faire défiler vers le haut
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Gérer la visibilité du bouton selon la position de défilement
  useEffect(() => {
    const toggleVisibility = () => {
      // Afficher le bouton si on a défilé de plus de 300px
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    // Ajouter l'écouteur d'événement
    window.addEventListener("scroll", toggleVisibility)

    // Nettoyer l'écouteur lors du démontage du composant
    return () => {
      window.removeEventListener("scroll", toggleVisibility)
    }
  }, [])

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="scroll-to-top-btn"
          aria-label="Retour en haut de la page"
          title="Retour en haut"
        >
          <span className="scroll-icon">⬆️</span>
          <span className="scroll-text">Haut</span>
        </button>
      )}
    </>
  )
}

export default ScrollToTop
