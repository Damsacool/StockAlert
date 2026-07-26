import * as productsApi from '../api/products.api';
import * as productStore from './stores/productStore';
import * as queueStore from './stores/queueStore';

export const productGuard = {
  async getAll(tenantId) {
    if (navigator.onLine) {
      const products = await productsApi.getAll();
      await productStore.replaceAll(products);
      return products;
    }
    return productStore.getAll();
  },

  async updateStock(productId, quantity) {
    if (navigator.onLine) {
      const updated = await productsApi.updateStock(productId, quantity);
      await productStore.upsert(updated);
      return updated;
    }
    const updated = await productStore.updateStock(productId, quantity);
    await queueStore.add({
      action: 'UPDATE_STOCK',
      payload: { productId, quantity, clientTimestamp: Date.now() },
    });
    return updated;
  },
};
