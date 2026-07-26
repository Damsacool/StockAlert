import * as productsApi from '../api/products.api';
import * as productStore from './stores/productStore';
import * as queueStore from './stores/queueStore';

export const syncQueue = async () => {
  if (!navigator.onLine) return;

  const queue = await queueStore.getAll();
  if (queue.length === 0) return;

  for (const item of queue) {
    try {
      if (item.action === 'UPDATE_STOCK') {
        const { productId, quantity } = item.payload;
        const updated = await productsApi.updateStock(productId, quantity);
        await productStore.upsert(updated);
      }
    } catch (err) {
      console.error('Failed to sync queue item', err);
    }
  }

  await queueStore.clear();
};
