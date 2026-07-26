import { useEffect, useState } from 'react';
import { productService } from '../services/product.service';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await productService.getAll();
        setProducts(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const updateStock = async (productId, quantity) => {
    try {
      const updated = await productService.updateStock(productId, quantity);
      setProducts((current) =>
        current.map((product) => (product.id === productId ? updated : product))
      );
      return updated;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  return { products, loading, error, updateStock };
};
