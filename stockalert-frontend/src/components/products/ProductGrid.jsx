import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, onUpdateStock }) => {
  if (!products.length) {
    return <p>Aucun produit pour le moment.</p>;
  }

  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onUpdateStock={onUpdateStock} />
      ))}
    </div>
  );
};

export default ProductGrid;
