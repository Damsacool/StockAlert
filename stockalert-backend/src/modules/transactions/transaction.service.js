const transactionRepository = require('./transaction.repository');

class TransactionService {
  async getAllForTenant(tenantId) {
    return transactionRepository.findManyByTenant(tenantId);
  }

  async getByProduct(productId, tenantId) {
    return transactionRepository.findByProduct(productId, tenantId);
  }
}

module.exports = new TransactionService();
