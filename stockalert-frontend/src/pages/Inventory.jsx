import React, { useEffect, useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useSync } from '../hooks/useSync';
import ProductGrid from '../components/products/ProductGrid';
import OfflineBanner from '../components/common/OfflineBanner';
import Button from '../components/common/Button';

const Inventory = () => {
  const { products, loading, error, updateStock } = useProducts();
  useSync();

  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleStatus = () => setOffline(!navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  if (loading) return <p>Chargement...</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <OfflineBanner offline={offline} />
      <h2>Inventaire</h2>
      <Button>Ajouter un produit</Button>
      {error ? <p>Erreur de chargement</p> : <ProductGrid products={products} onUpdateStock={updateStock} />}
    </div>
  );
};

export default Inventory;
