import React, { useState } from 'react';
import { Camera, Trash2, X } from 'lucide-react';
import ImageZoomModal from './ImageZoomModal';

const ImageEditorModal = ({ show, onClose, product, setProduct, updateImages }) => {
  const [localImages, setLocalImages] = useState([]);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);

  React.useEffect(() => {
    if (show && product) {
      const images = product.images || [];
      const paddedImages = [...images, '', '', '', ''].slice(0, 4);
      setLocalImages(paddedImages);
    }
  }, [show, product]);

  if (!show || !product) return null;

  const handleImageUpload = (index, file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newImages = [...localImages];
      newImages[index] = reader.result;
      setLocalImages(newImages);
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = (index) => {
    const newImages = [...localImages];
    newImages[index] = '';
    setLocalImages(newImages);
  };

  const handleSave = async () => {
    try {
      const validImages = localImages.filter(img => img && img.trim() !== '');
      await updateImages(product.id, validImages);
      setProduct({ ...product, images: validImages });
      onClose();
      alert('✓ Images mises à jour!');
    } catch (err) {
      console.error('Failed to update images:', err);
      alert('Erreur lors de la mise à jour des images');
    }
  };

  const handleImageClick = (index) => {
    if (localImages[index]) {
      setZoomIndex(index);
      setShowZoom(true);
    }
  };

  const validImages = localImages.filter(img => img && img.trim() !== '');

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}
        onClick={onClose}
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'var(--surface)',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}
        >
          {/* Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px' 
          }}>
            <h2 style={{ 
              margin: 0, 
              fontSize: '20px', 
              fontWeight: '700',
              color: 'var(--text-primary)'
            }}>
              Modifier les photos
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                padding: '8px'
              }}
            >
              <X size={24} />
            </button>
          </div>

          {/* Product Name */}
          <p style={{ 
            margin: '0 0 20px 0',
            fontSize: '15px',
            fontWeight: '600',
            color: 'var(--text-secondary)'
          }}>
            {product.name}
          </p>

          {/* Image Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            marginBottom: '24px'
          }}>
            {[0, 1, 2, 3].map(index => (
              <div key={index}>
                <label style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  marginBottom: '6px',
                  display: 'block'
                }}>
                  ANGLE {index + 1} {index === 0 && '*'}
                </label>

                {localImages[index] ? (
                  <div style={{ position: 'relative' }}>
                    <img
                      src={localImages[index]}
                      alt={`Product ${index + 1}`}
                      onClick={() => handleImageClick(index)}
                      style={{
                        width: '100%',
                        height: '140px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        cursor: 'pointer'
                      }}
                    />
                    <button
                      onClick={() => handleImageRemove(index)}
                      style={{
                        position: 'absolute',
                        top: '6px',
                        right: '6px',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: 'none',
                        background: 'rgba(239, 68, 68, 0.9)',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <label style={{
                    display: 'block',
                    height: '140px',
                    border: '2px dashed var(--border)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}>
                    <input
                      type='file'
                      accept='image/*'
                      onChange={(e) => handleImageUpload(index, e.target.files[0])}
                      style={{ display: 'none' }}
                    />
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      color: 'var(--text-tertiary)'
                    }}>
                      <Camera size={32} strokeWidth={1.5} />
                      <span style={{ fontSize: '13px', marginTop: '8px' }}>Ajouter</span>
                    </div>
                  </label>
                )}
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '12px',
            borderTop: '1px solid var(--border)',
            paddingTop: '20px'
          }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '14px',
                border: '2px solid var(--border)',
                borderRadius: '10px',
                background: 'transparent',
                color: 'var(--text-primary)',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Annuler
            </button>
            
            <button
              onClick={handleSave}
              style={{
                flex: 1,
                padding: '14px',
                border: 'none',
                borderRadius: '10px',
                background: 'var(--primary)',
                color: 'white',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>

      {/* Zoom Modal */}
      {showZoom && (
        <ImageZoomModal
          images={validImages}
          initialIndex={validImages.indexOf(localImages[zoomIndex])}
          onClose={() => setShowZoom(false)}
        />
      )}
    </>
  );
};

export default ImageEditorModal;