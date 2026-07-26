const prisma = require('../../config/database');

class ProductRepository {
  async create(data) {
    return prisma.product.create({ data });
  }

  async findManyByTenant(tenantId) {
    return prisma.product.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(productId, tenantId) {
    return prisma.product.findFirst({
      where: { id: productId, tenantId },
    });
  }

  async update(productId, data) {
    return prisma.product.update({
      where: { id: productId },
      data,
    });
  }

  async delete(productId) {
    return prisma.product.delete({ where: { id: productId } });
  }
}

module.exports = new ProductRepository();
