import React from 'react';
import { X } from 'lucide-react';

const BulkEditModal = ({ show, onClose, product, bulkType, bulkAmount, setBulkAmount, onSubmit }) => {
  if (!show) return null;

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
          maxWidth: '400px',
          width: '100%',
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
            {bulkType === 'increase' ? 'Augmenter le stock' : 'Diminuer le stock'}
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

        <div style={{ marginBottom: '20px' }}>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '14px',
            margin: '0 0 8px 0'
          }}>
            Produit: <strong style={{ color: 'var(--text-primary)' }}>{product?.name}</strong>
          </p>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '14px',
            margin: 0
          }}>
            Stock actuel: <strong style={{ color: 'var(--text-primary)' }}>{product?.stock}</strong>
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '8px'
          }}>
            Quantité
          </label>
          <input
            type="number"
            value={bulkAmount}
            onChange={(e) => setBulkAmount(e.target.value)}
            placeholder="Entrez la quantité"
            min="1"
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
            onClick={onSubmit}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              background: bulkType === 'increase' ? 'var(--success)' : 'var(--danger)',
              color: 'white',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkEditModal;