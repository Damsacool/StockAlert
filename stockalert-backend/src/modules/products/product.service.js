const prisma = require('../../config/database');
const productRepository = require('./product.repository');

class ProductService {
  async getAllForTenant(tenantId) {
    return productRepository.findManyByTenant(tenantId);
  }

  async createProduct(productData, userId, tenantId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('USER_NOT_FOUND');

    const existingProductsCount = await prisma.product.count({ where: { tenantId } });
    const maxProducts = this.getMaxProducts(user.plan);

    if (existingProductsCount >= maxProducts) {
      throw new Error('PLAN_LIMIT_REACHED');
    }

    const product = await productRepository.create({
      ...productData,
      tenantId,
      createdBy: userId,
      user: {
        connect: { id: userId },
      },
    });

    return product;
  }

  async updateStock(productId, quantity, userId, tenantId) {
    return prisma.$transaction(async (tx) => {
      const product = await tx.product.findFirst({
        where: { id: productId, tenantId },
      });

      if (!product) throw new Error('PRODUCT_NOT_FOUND');

      const newStock = product.stock + quantity;
      if (newStock < 0) throw new Error('INSUFFICIENT_STOCK');

      const updated = await tx.product.update({
        where: { id: productId },
        data: { stock: newStock },
      });

      await tx.transaction.create({
        data: {
          productId,
          tenantId,
          type: quantity < 0 ? 'SALE' : 'RESTOCK',
          quantity: Math.abs(quantity),
          stockBefore: product.stock,
          stockAfter: newStock,
          createdBy: userId,
        },
      });

      return updated;
    });
  }

  async updateProduct(productId, updates, tenantId) {
    const existing = await productRepository.findById(productId, tenantId);
    if (!existing) throw new Error('PRODUCT_NOT_FOUND');

    return productRepository.update(productId, updates);
  }

  async deleteProduct(productId, tenantId, userRole) {
    if (userRole !== 'OWNER') {
      throw new Error('FORBIDDEN');
    }

    const existing = await productRepository.findById(productId, tenantId);
    if (!existing) throw new Error('PRODUCT_NOT_FOUND');

    return productRepository.delete(productId);
  }

  getMaxProducts(plan) {
    if (plan === 'PRO') return 500;
    if (plan === 'BUSINESS') return Number.MAX_SAFE_INTEGER;
    return 30;
  }
}

module.exports = new ProductService();
