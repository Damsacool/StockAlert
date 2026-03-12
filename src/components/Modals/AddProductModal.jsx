import React from 'react';
import { Camera } from 'lucide-react';

const AddProductModal = ({ 
  show, 
  onClose, 
  formData, 
  setFormData, 
  onSubmit, 
  onImageUpload 
}) => {
  if (!show) return null;

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
        <div className='modal-body'>
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

          <div className='form-row'>
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

          <div className='form-row'>
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
                <label> Prix de Vente (CFA) *</label>
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

        {formData.costPrice && formData.sellingPrice && (
            <div className='profit-preview'>
                 <p>
                Bénéfice par unité: <strong style={{ color: '#10b981' }}>
                    {(parseInt(formData.sellingPrice) - parseInt(formData.costPrice)).toLocaleString()} CFA 
                </strong>
                </p>
                </div>
             )}

          <div className='form-group'>
            <label>Photos du Produit (jusqu'à 4 angles)</label>
            <div className='image-upload-grid'>
              {[0, 1, 2, 3].map(index => (
                <div key={index} className='image-upload-slot'>
                  <label className='image-slot-label'>
                    Angle {index + 1} {index === 0 && '*'}
                  </label>

                  {formData.images[index] ? (
                    <div className='image-preview'>
                      <img
                        src={formData.images[index]}
                        alt={`Angle ${index + 1}`}
                        className='preview-image'
                      />
                      <button
                        type='button'
                        className='btn-remove-image'
                        onClick={() => {
                          const newImages = [...formData.images];
                          newImages[index] = '';
                          setFormData({ ...formData, images: newImages });
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label className='upload-button'>
                      <input
                        type='file'
                        accept='image/*'
                        onChange={(e) => onImageUpload(index, e.target.files[0])}
                        style={{ display: 'none' }}
                      />
                      <div className='upload-placeholder'>
                        <Camera size={32} strokeWidth={1.5} />
                        <span>Ajouter</span>
                      </div>
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='modal-footer'>
          <button className='btn-secondary' onClick={onClose}>
            Annuler
          </button>
          <button className='btn-primary' onClick={onSubmit}>
            Ajouter Produit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;