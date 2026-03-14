import React, { useState } from 'react';
import { Plus, Minus, ChevronDown, ChevronUp, Trash2, Image as ImageIcon } from 'lucide-react';
import ImageZoomModal from '../Modals/ImageZoomModal';
import './CompactProductCard.css';

const CompactProductCard = ({ product, onStockChange, onEdit, onDelete, userRole }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showImageZoom, setShowImageZoom] = useState(false);
  const [zoomImageIndex, setZoomImageIndex] = useState(0);

  console.log('Product:', product);
  const isLowStock = product.stock <= product.minStock;
  const profit = product.sellingPrice - product.costPrice;
  const profitMargin = ((profit / product.costPrice) * 100).toFixed(1);

  const handleImageClick = (index) => {
    setZoomImageIndex(index);
    setShowImageZoom(true);
  };

  return (
    <div className="compact-card">
      {/* Collapsed View - Always Visible */}
      <div className="compact-card-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="compact-info">
          <h3 className="compact-name">{product.name}</h3>
          <div className="compact-stock-row">
            <span className={`stock-badge ${isLowStock ? 'low' : 'normal'}`}>
              {product.stock} en stock
            </span>
            {isLowStock && <span className="alert-dot">●</span>}
          </div>
        </div>

        <div className="compact-actions">
          <button 
            className="compact-btn decrease"
            onClick={(e) => { e.stopPropagation(); onStockChange(product.id, 'decrement'); }}
          >
            <Minus size={16} />
          </button>
          <button 
            className="compact-btn increase"
            onClick={(e) => { e.stopPropagation(); onStockChange(product.id, 'increment'); }}
          >
            <Plus size={16} />
          </button>
          <button className="expand-btn">
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Expanded View - Details */}
      {isExpanded && (
        <div className="compact-card-details">
          {/* Images */}
          {product.images && product.images.length > 0 && (
            <div className="compact-images">
              {product.images.slice(0, 2).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.name} ${idx + 1}`}
                  className="compact-img"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleImageClick(idx)}
                  title="Click to zoom"
                />
              ))}
              {product.images.length > 2 && (
                <div
                  className="compact-img-more"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleImageClick(2)}
                  title="Click to zoom"
                >
                  +{product.images.length - 2}
                </div>
              )}
            </div>
          )}

          {/* Prices */}
<div className="compact-prices">
  {/* Selling Price - Everyone can see */}
  <div className="price-row">
    <span className="price-label">Prix de vente</span>
    <span className="price-value">{product.sellingPrice.toLocaleString()} F</span>
  </div>
  
  {/* Cost Price & Profit - Owner only */}
  {userRole === 'owner' && (
    <>
      <div className="price-row">
        <span className="price-label">Prix d'achat</span>
        <span className="price-value">{product.costPrice.toLocaleString()} F</span>
      </div>
      <div className="price-row profit">
        <span className="price-label">Bénéfice</span>
        <span className="price-value success">
          {profit.toLocaleString()} F ({profitMargin}%)
        </span>
      </div>
    </>
  )}
</div>

          {/* Stock Info */}
          <div className="compact-stock-info">
            <div className="stock-item">
              <span>Stock actuel</span>
              <strong>{product.stock}</strong>
            </div>
            <div className="stock-item">
              <span>Seuil minimum</span>
              <strong>{product.minStock}</strong>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="compact-actions-full">
            <button 
              className="action-btn secondary"
              onClick={() => onEdit(product)}
            >
              <ImageIcon size={16} />
              Images
            </button>
            {userRole === 'owner' && (
              <button 
                className="action-btn danger"
                onClick={() => onDelete(product.id)}
              >
                <Trash2 size={16} />
                Supprimer
              </button>
            )}
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {showImageZoom && product.images && product.images.length > 0 && (
        <ImageZoomModal
          images={product.images}
          initialIndex={zoomImageIndex}
          onClose={() => setShowImageZoom(false)}
        />
      )}
    </div>
  );
};

export default CompactProductCard;