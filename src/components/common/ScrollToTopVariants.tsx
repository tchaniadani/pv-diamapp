"use client"

import { useState, useEffect } from "react"

// Version avec différentes variantes du bouton
const ScrollToTopVariants = ({ variant = "default", threshold = 300 }) => {
  const [isVisible, setIsVisible] = useState(false)

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > threshold) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [threshold])

  // Différentes variantes du bouton
  const renderButton = () => {
    switch (variant) {
      case "minimal":
        return (
          <button
            onClick={scrollToTop}
            className="scroll-to-top-btn minimal"
            aria-label="Retour en haut"
            title="Retour en haut"
          >
            <span className="scroll-icon">↑</span>
          </button>
        )

      case "pulse":
        return (
          <button
            onClick={scrollToTop}
            className="scroll-to-top-btn pulse"
            aria-label="Retour en haut"
            title="Retour en haut"
          >
            <span className="scroll-icon">⬆️</span>
            <span className="scroll-text">Haut</span>
          </button>
        )

      case "custom":
        return (
          <button
            onClick={scrollToTop}
            className="scroll-to-top-btn custom-icon"
            aria-label="Retour en haut"
            title="Retour en haut"
          >
            <span className="scroll-icon">🚀</span>
          </button>
        )

      case "text":
        return (
          <button
            onClick={scrollToTop}
            className="scroll-to-top-btn text-only"
            aria-label="Retour en haut"
            title="Retour en haut"
          >
            <span className="scroll-text">TOP</span>
          </button>
        )

      default:
        return (
          <button
            onClick={scrollToTop}
            className="scroll-to-top-btn"
            aria-label="Retour en haut"
            title="Retour en haut"
          >
            <span className="scroll-icon">⬆️</span>
            <span className="scroll-text">Haut</span>
          </button>
        )
    }
  }

  return <>{isVisible && renderButton()}</>
}

export default ScrollToTopVariants
