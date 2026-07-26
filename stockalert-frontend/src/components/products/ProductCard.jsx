import React from 'react';

const ProductCard = ({ product, onUpdateStock }) => {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1rem' }}>
      <h3 style={{ margin: '0 0 0.35rem' }}>{product.name}</h3>
      <p style={{ margin: '0 0 0.35rem' }}>Stock : {product.stock}</p>
      <p style={{ margin: '0 0 0.75rem' }}>Stock minimum : {product.minStock}</p>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={() => onUpdateStock(product.id, -1)}>-1</button>
        <button onClick={() => onUpdateStock(product.id, 1)}>+1</button>
      </div>
    </div>
  );
};

export default ProductCard;
