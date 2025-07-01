"use client"

import { useState } from "react"
import "../../styles.css"

const SiteEstimation = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [imageLoadStates, setImageLoadStates] = useState({})

  // Liste des images/flyers - MODIFIEZ ICI pour utiliser directement des placeholders
  const images = [
    {
      id: 1,
      title: "➡️Catalogues ASE - Dla/Yde/⤵️⤵️⤵️",
      description: "Gamme complète chez ASE",
      src: "/images/flyers/Fly Ase.png",
      category: "Gamme",
    },
    {
      id: 2,
      title: "ASE",
      description: "Offres spéciales",
      src: "/images/flyers/Fly Ase2.jpg",
      category: "Catalogues",
    },
    {
      id: 3,
      title: "ASE",
      description: " Systèmes Hybrides ",
      src: "/images/flyers/Fly Ase3.jpg",
      category: "Promotions",
    },
    {
      id: 4,
      title: "➡️Catalogues SOLKAMTECH ⤵️⤵️⤵️",
      description: "Service En cours d'actualisation",
      src: "/placeholder.svg?height=300&width=400&text=Guide%20Installation", // Placeholder direct
      category: "Guides",
    },
     {
      id: 5,
      title: "Service en cours d'actualisation",
      description: "Service en cours d'actualisation",
      src: "/placeholder.svg?height=300&width=400&text=Guide%20Installation", // Placeholder direct
      category: "Guides",
    },
     {
      id: 6,
      title: "➡️Catalogues SAHEL SOLAR-Maroua ⤵️⤵️⤵️",
      description: "Service En cours d'actualisation",
      src: "/placeholder.svg?height=300&width=400&text=Guide%20Installation", // Placeholder direct
      category: "Guides",
    },
     {
      id: 7,
      title: "Service en cours d'actualisation",
      description: "Service en cours d'actualisation",
      src: "/placeholder.svg?height=300&width=400&text=Guide%20Installation", // Placeholder direct
      category: "Guides",
    },
     {
      id: 8,
      title: "➡️Catalogues BERCOTECH-Yde/Mra ⤵️⤵️⤵️",
      description: "Service En cours d'actualisation",
      src: "/placeholder.svg?height=300&width=400&text=Guide%20Installation", // Placeholder direct
      category: "Guides",
    },
    {
      id: 9,
      title: "Service en cours d'actualisation",
      description: "Service en cours d'actualisation",
      src: "/placeholder.svg?height=300&width=400&text=Guide%20Installation", // Placeholder direct
      category: "Guides",
    },
    // Quand vous ajoutez vos vraies images, remplacez par :
    // src: "/images/flyers/nom-de-votre-image.jpg",
  ]

  const handleImageLoad = (imageId) => {
    setImageLoadStates((prev) => ({
      ...prev,
      [imageId]: "loaded",
    }))
  }

  const handleImageError = (imageId, originalSrc) => {
    setImageLoadStates((prev) => ({
      ...prev,
      [imageId]: "error",
    }))
  }

  const openImage = (image) => {
    setSelectedImage(image)
  }

  const closeImage = () => {
    setSelectedImage(null)
  }

  return (
    <div className="form-container">
      <h1>📈🛒 MarketPlace & Estimation</h1>
      <h3 className="Eff-Maint">Consultez les services de nos entreprises partenaires.</h3>

      {/* Galerie d'images */}
      <div className="gallery-container">
        <div className="images-grid">
          {images.map((image) => (
            <div key={image.id} className="image-card" onClick={() => openImage(image)}>
              <div className="image-wrapper">
                {/* Indicateur de chargement */}
                {!imageLoadStates[image.id] && (
                  <div className="image-loading">
                    <div className="loading-placeholder">📄</div>
                  </div>
                )}

                <img
                  src={image.src || "/placeholder.svg"}
                  alt={image.title}
                  onLoad={() => handleImageLoad(image.id)}
                  onError={() => handleImageError(image.id, image.src)}
                  style={{
                    opacity: imageLoadStates[image.id] === "loaded" ? 1 : 0,
                    transition: "opacity 0.3s ease",
                  }}
                />

                <div className="image-overlay">
                  <span className="zoom-icon">🔍</span>
                </div>
              </div>
              <div className="image-info">
                <h5>{image.title}</h5>
                <p>{image.description}</p>
                <span className="image-category">{image.category}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Message si aucune image */}
        {images.length === 0 && (
          <div className="no-images">
            <p>Aucun catalogue disponible pour le moment.</p>
            <p>Les images seront ajoutées prochainement.</p>
          </div>
        )}
      </div>

      {/* Modal pour agrandir l'image */}
      {selectedImage && (
        <div className="image-modal" onClick={closeImage}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeImage}>
              ❌
            </button>
            <img src={selectedImage.src || "/placeholder.svg"} alt={selectedImage.title} />
            <div className="modal-info">
              <h4>{selectedImage.title}</h4>
              <p>{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Instructions pour ajouter des images */}
      <div className="instructions-section">
        <h4>📞 Demande d'assistance pour amples informations, bien vouloir contactez les fournisseurs!</h4>
        <div className="instructions-content">
          
          
         
          
        </div>
      </div>
    </div>
  )
}

export default SiteEstimation
