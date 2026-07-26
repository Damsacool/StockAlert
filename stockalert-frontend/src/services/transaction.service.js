import * as transactionsApi from '../api/transactions.api';

export const transactionService = {
  async getAll() {
    return transactionsApi.getAll();
  },

  async getByProduct(productId) {
    return transactionsApi.getByProduct(productId);
  },
};
