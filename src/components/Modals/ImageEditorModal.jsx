import React, { useState } from 'react';
import { X, Camera, Trash2 } from 'lucide-react';

const ImageEditorModal = ({ show, onClose, product, setProduct, updateImages }) => {
  const [images, setImages] = useState(product?.images || ['', '', '', '']);

  if (!show || !product) return null;

  const handleImageUpload = (index, file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newImages = [...images];
      newImages[index] = reader.result;
      setImages(newImages);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages[index] = '';
    setImages(newImages);
  };

  const handleSave = async () => {
    const validImages = images.filter(img => img && img.trim() !== '');
    await updateImages(product.id, validImages);
    onClose();
  };

  return (
    <div 
      className="modal-overlay"
      onClick={onClose}
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
    >
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
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
            Modifier les images
          </h2>
          <button 
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--bg-tertiary)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <p style={{ 
          color: 'var(--text-secondary)', 
          fontSize: '14px',
          margin: '0 0 20px 0'
        }}>
          Produit: <strong style={{ color: 'var(--text-primary)' }}>{product.name}</strong>
        </p>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginBottom: '20px'
        }}>
          {images.map((img, index) => (
            <div 
              key={index}
              style={{
                position: 'relative',
                paddingTop: '100%',
                borderRadius: '12px',
                overflow: 'hidden',
                background: 'var(--bg-secondary)',
                border: '2px dashed var(--border)'
              }}
            >
              {img ? (
                <>
                  <img
                    src={img}
                    alt={`Product ${index + 1}`}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      border: 'none',
                      background: 'var(--danger)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              ) : (
                <label
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-tertiary)'
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(index, e.target.files[0])}
                    style={{ display: 'none' }}
                  />
                  <Camera size={32} strokeWidth={1.5} />
                  <span style={{ marginTop: '8px', fontSize: '12px' }}>
                    Ajouter
                  </span>
                </label>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              background: 'var(--surface)',
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
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              background: 'var(--primary)',
              color: 'white',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageEditorModal;