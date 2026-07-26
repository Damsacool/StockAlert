const prisma = require('../../config/database');

class UserRepository {
  async findById(userId) {
    return prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async update(userId, data) {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async findWorkers(tenantId) {
    return prisma.user.findMany({
      where: { tenantId, role: 'WORKER' },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createWorker(data) {
    return prisma.user.create({ data });
  }
}

module.exports = new UserRepository();
