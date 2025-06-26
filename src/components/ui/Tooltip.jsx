import { useState } from "react"

/**
 * Composant de tooltip personnalisé
 * @param {Object} props - Les propriétés du composant
 * @param {React.ReactNode} props.children - L'élément déclencheur du tooltip
 * @param {string} props.content - Le contenu du tooltip
 * @param {string} props.position - La position du tooltip (top, right, bottom, left)
 */
export const Tooltip = ({ children, content, position = "top" }) => {
  const [isVisible, setIsVisible] = useState(false)

  const showTooltip = () => setIsVisible(true)
  const hideTooltip = () => setIsVisible(false)

  return (
    <div
      className="tooltip-container"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}

      {isVisible && <div className={`tooltip tooltip-${position}`}>{content}</div>}
    </div>
  )
}