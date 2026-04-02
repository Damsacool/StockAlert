import React, { useState } from 'react';
import { Camera, ChevronDown, X } from 'lucide-react';

// ── Default categories (auto parts + generic) ──────────────────
const DEFAULT_CATEGORIES = [
  'Filtres huile',
  'Filtres air',
  'Filtres climatisation',
  'Filtres gasoil',
  'Huiles & Lubrifiants',
  'Freins & Plaquettes',
  'Électrique & Batterie',
  'Carrosserie',
  'Moteur & Pistons',
  'Transmission',
  'Suspension & Amortisseurs',
  'Refroidissement',
  'Pneus & Roues',
  'Accessoires',
  'Autre',
];

// ── Category Selector (inline, no separate file needed) ─────────
const CategorySelector = ({ value, onChange, existingCategories = [] }) => {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState('');

  const allCats = [...new Set([...DEFAULT_CATEGORIES, ...existingCategories])];

  const select = (cat) => { onChange(cat); setOpen(false); setCustom(''); };
  const submitCustom = () => {
    if (custom.trim()) select(custom.trim());
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '12px 16px',
          border: '1px solid var(--border)', borderRadius: '8px',
          background: 'var(--bg-secondary)', color: value ? 'var(--text-primary)' : 'var(--text-tertiary)',
          fontSize: '15px', textAlign: 'left', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <span>{value || 'Choisir une catégorie (optionnel)'}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {value && (
            <span onClick={(e) => { e.stopPropagation(); onChange(''); }}
              style={{ color: 'var(--text-tertiary)', display: 'flex', cursor: 'pointer' }}>
              <X size={14} />
            </span>
          )}
          <ChevronDown size={16} color="var(--text-tertiary)"
            style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <>
          <div onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 10 }} />
          <div style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: '10px', boxShadow: 'var(--shadow-lg)',
            zIndex: 11, maxHeight: '260px', overflowY: 'auto',
          }}>
            {/* Custom input */}
            <div style={{
              padding: '10px', borderBottom: '1px solid var(--border)',
              display: 'flex', gap: '8px',
            }}>
              <input
                type="text" placeholder="Créer: ex. Joints, Bougies..."
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); submitCustom(); } }}
                autoFocus
                style={{
                  flex: 1, padding: '8px 12px',
                  border: '1px solid var(--border)', borderRadius: '6px',
                  background: 'var(--bg-secondary)', color: 'var(--text-primary)',
                  fontSize: '14px', outline: 'none',
                }}
              />
              {custom.trim() && (
                <button type="button" onClick={submitCustom} style={{
                  padding: '8px 14px', border: 'none', borderRadius: '6px',
                  background: 'var(--primary)', color: 'white',
                  fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                }}>OK</button>
              )}
            </div>
            {/* List */}
            {allCats.map(cat => (
              <button key={cat} type="button" onClick={() => select(cat)} style={{
                width: '100%', padding: '11px 16px',
                border: 'none', background: value === cat ? 'var(--primary-light)' : 'transparent',
                color: value === cat ? 'var(--primary)' : 'var(--text-primary)',
                fontSize: '14px', fontWeight: value === cat ? '600' : '400',
                textAlign: 'left', cursor: 'pointer', display: 'block',
              }}>
                {cat}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ── Main Modal ──────────────────────────────────────────────────
const AddProductModal = ({
  show,
  onClose,
  formData,
  setFormData,
  onSubmit,
  onImageUpload,
  isSubmitting,
  existingCategories = [],
}) => {
  if (!show) return null;

  const profit = formData.costPrice && formData.sellingPrice
    ? parseInt(formData.sellingPrice) - parseInt(formData.costPrice)
    : null;

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    background: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    fontSize: '15px',
    boxSizing: 'border-box',
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface)', borderRadius: '16px', padding: '24px',
          maxWidth: '500px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>
            Ajouter un produit
          </h2>
          <button onClick={onClose} style={{
            width: '32px', height: '32px', borderRadius: '8px', border: 'none',
            background: 'var(--bg-tertiary)', color: 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>

          {/* Product Name */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Nom du produit *
            </label>
            <input
              type="text" style={inputStyle}
              placeholder="Ex: Filtre à huile Toyota"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              autoFocus
            />
          </div>

          {/* Category */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Catégorie
            </label>
            <CategorySelector
              value={formData.category}
              onChange={(cat) => setFormData({ ...formData, category: cat })}
              existingCategories={existingCategories}
            />
          </div>

          {/* Stock row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>
                Stock initial *
              </label>
              <input type="number" style={inputStyle} placeholder="50"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>
                Alerte si moins de *
              </label>
              <input type="number" style={inputStyle} placeholder="10"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })} />
            </div>
          </div>

          {/* Price row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>
                Prix d'achat (CFA) *
              </label>
              <input type="number" style={inputStyle} placeholder="5000"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>
                Prix de vente (CFA) *
              </label>
              <input type="number" style={inputStyle} placeholder="7500"
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })} />
            </div>
          </div>

          {/* Profit preview */}
          {profit !== null && profit > 0 && (
            <div style={{
              padding: '12px 16px', background: 'var(--success-light)',
              borderRadius: '8px', marginBottom: '16px',
              border: '1px solid var(--success)',
            }}>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-primary)' }}>
                Bénéfice par unité:{' '}
                <strong style={{ color: 'var(--success)' }}>
                  {profit.toLocaleString()} CFA
                </strong>
              </p>
            </div>
          )}

          {/* Images */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Photos (jusqu'à 4)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {[0, 1, 2, 3].map((index) => (
                <div key={index}>
                  <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-tertiary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Angle {index + 1}
                  </p>
                  {formData.images[index] ? (
                    <div style={{ position: 'relative' }}>
                      <img src={formData.images[index]} alt={`Angle ${index + 1}`}
                        style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }} />
                      <button type="button"
                        onClick={() => {
                          const imgs = [...formData.images];
                          imgs[index] = '';
                          setFormData({ ...formData, images: imgs });
                        }}
                        style={{
                          position: 'absolute', top: '6px', right: '6px',
                          width: '28px', height: '28px', borderRadius: '50%',
                          border: 'none', background: 'rgba(0,0,0,0.7)', color: 'white',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        }}>
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label style={{
                      display: 'block', height: '110px',
                      border: '2px dashed var(--border)', borderRadius: '8px', cursor: 'pointer',
                    }}>
                      <input type="file" accept="image/*"
                        onChange={(e) => onImageUpload(index, e.target.files[0])}
                        style={{ display: 'none' }} />
                      <div style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        justifyContent: 'center', height: '100%', color: 'var(--text-tertiary)',
                      }}>
                        <Camera size={28} strokeWidth={1.5} />
                        <span style={{ fontSize: '12px', marginTop: '6px' }}>Ajouter</span>
                      </div>
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div style={{
            display: 'flex', gap: '12px',
            borderTop: '1px solid var(--border)', paddingTop: '20px',
          }}>
            <button type="button" onClick={onClose} disabled={isSubmitting} style={{
              flex: 1, padding: '14px', border: '2px solid var(--border)',
              borderRadius: '10px', background: 'transparent', color: 'var(--text-primary)',
              fontSize: '15px', fontWeight: '600', cursor: 'pointer',
            }}>
              Annuler
            </button>
            <button type="submit" disabled={isSubmitting} style={{
              flex: 1, padding: '14px', border: 'none', borderRadius: '10px',
              background: isSubmitting ? 'var(--text-tertiary)' : 'var(--primary)',
              color: 'white', fontSize: '15px', fontWeight: '700', cursor: isSubmitting ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}>
              {isSubmitting ? (
                <>
                  <div style={{
                    width: '16px', height: '16px', border: '2px solid white',
                    borderTopColor: 'transparent', borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  Ajout...
                </>
              ) : 'Ajouter le produit'}
            </button>
          </div>
        </form>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
};

export default AddProductModal;