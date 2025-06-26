"use client"
import { useTranslation } from "react-i18next"

/**
 * Composant pour changer la langue de l'application
 */
const LanguageSwitcher = () => {
  const { i18n } = useTranslation()

  /**
   * Change la langue de l'application
   * @param {string} language - Le code de la langue
   */
  const changeLanguage = (language) => {
    i18n.changeLanguage(language)
    localStorage.setItem("language", language)
  }

  return (
    <div className="language-switcher">
      <button className={i18n.language === "fr" ? "active" : ""} onClick={() => changeLanguage("fr")}>
        FR
      </button>
      <button className={i18n.language === "en" ? "active" : ""} onClick={() => changeLanguage("en")}>
        EN
      </button>
      <button className={i18n.language === "ff" ? "active" : ""} onClick={() => changeLanguage("ff")}>
        FF
      </button>
    </div>
  )
}

export default LanguageSwitcher
