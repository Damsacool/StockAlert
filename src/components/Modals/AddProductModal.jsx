import React from 'react';
import { Camera } from 'lucide-react';

const AddProductModal = ({ 
  show, 
  onClose, 
  formData, 
  setFormData, 
  onSubmit, 
  onImageUpload,
  isSubmitting
}) => {
  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div 
      className='modal-overlay' 
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
        className='modal-content' 
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
        <form onSubmit={handleSubmit}>
          {/* Product Name */}
          <div className='form-group'>
            <label>Nom du Produit *</label>
            <input
              type='text'
              className='form-input'
              placeholder='Ex: Disques de frein Toyota'
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              autoFocus
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: '15px'
              }}
            />
          </div>

          {/* Stock Initial & Min Stock */}
          <div className='form-row' style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className='form-group'>
              <label>Stock Initial *</label>
              <input
                type='number'
                className='form-input'
                placeholder='50'
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '15px'
                }}
              />
            </div>

            <div className='form-group'>
              <label>Alerte si moins de *</label>
              <input 
                type='number'
                className='form-input'
                placeholder='10'
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '15px'
                }}
              />
            </div>
          </div>

          {/* Cost Price & Selling Price */}
          <div className='form-row' style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className='form-group'>
              <label>Prix d'Achat (CFA) *</label>
              <input
                type='number'
                className='form-input'
                placeholder='5000'
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '15px'
                }}
              />
            </div>

            <div className='form-group'>
              <label>Prix de Vente (CFA) *</label>
              <input 
                type='number'
                className='form-input'
                placeholder='7500'
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '15px'
                }}
              />
            </div>
          </div>

          {/* Profit Preview */}
          {formData.costPrice && formData.sellingPrice && (
            <div style={{
              padding: '12px',
              background: 'var(--success-light)',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-primary)' }}>
                Bénéfice par unité: <strong style={{ color: 'var(--success)' }}>
                  {(parseInt(formData.sellingPrice) - parseInt(formData.costPrice)).toLocaleString()} CFA 
                </strong>
              </p>
            </div>
          )}

          {/* Image Upload */}
          <div className='form-group'>
            <label>Photos du Produit (jusqu'à 4 angles)</label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
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

                  {formData.images[index] ? (
                    <div style={{ position: 'relative' }}>
                      <img
                        src={formData.images[index]}
                        alt={`Angle ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '120px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid var(--border)'
                        }}
                      />
                      <button
                        type='button'
                        onClick={() => {
                          const newImages = [...formData.images];
                          newImages[index] = '';
                          setFormData({ ...formData, images: newImages });
                        }}
                        style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          border: 'none',
                          background: 'rgba(0, 0, 0, 0.7)',
                          color: 'white',
                          fontSize: '16px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label style={{
                      display: 'block',
                      height: '120px',
                      border: '2px dashed var(--border)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}>
                      <input
                        type='file'
                        accept='image/*'
                        onChange={(e) => onImageUpload(index, e.target.files[0])}
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
          </div>

          {/* Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '12px',
            marginTop: '24px',
            borderTop: '1px solid var(--border)',
            paddingTop: '20px'
          }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                flex: 1,
                padding: '14px',
                border: '2px solid var(--border)',
                borderRadius: '10px',
                background: 'transparent',
                color: 'var(--text-primary)',
                fontSize: '15px',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.5 : 1
              }}
            >
              Annuler
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                flex: 1,
                padding: '14px',
                border: 'none',
                borderRadius: '10px',
                background: isSubmitting ? 'var(--text-tertiary)' : 'var(--primary)',
                color: 'white',
                fontSize: '15px',
                fontWeight: '700',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              {isSubmitting ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid white',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  Ajout...
                </>
              ) : (
                'Ajouter Produit'
              )}
            </button>
          </div>
        </form>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default AddProductModal;