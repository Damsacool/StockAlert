import { productGuard } from '../offline/offlineGuard';

export const productService = {
  async getAll() {
    return productGuard.getAll();
  },

  async updateStock(productId, quantity) {
    return productGuard.updateStock(productId, quantity);
  },
};
