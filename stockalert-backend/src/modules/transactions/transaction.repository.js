const prisma = require('../../config/database');

class TransactionRepository {
  async findManyByTenant(tenantId) {
    return prisma.transaction.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByProduct(productId, tenantId) {
    return prisma.transaction.findMany({
      where: { productId, tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

module.exports = new TransactionRepository();
