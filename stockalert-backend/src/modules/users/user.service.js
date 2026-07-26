const userRepository = require('./user.repository');
const prisma = require('../../config/database');

class UserService {
  async getProfile(userId) {
    return userRepository.findById(userId);
  }

  async updateProfile(userId, updates) {
    return userRepository.update(userId, updates);
  }

  async createWorker(workerData, requesterId) {
    const requester = await userRepository.findById(requesterId);
    if (!requester || requester.role !== 'OWNER') {
      throw new Error('FORBIDDEN');
    }

    const maxWorkers = this.getMaxWorkers(requester.plan);
    const currentWorkers = await prisma.user.count({
      where: { tenantId: requester.tenantId, role: 'WORKER' },
    });

    if (currentWorkers >= maxWorkers) {
      throw new Error('PLAN_LIMIT_REACHED');
    }

    return userRepository.createWorker({
      ...workerData,
      tenantId: requester.tenantId,
      role: 'WORKER',
      plan: 'FREE',
    });
  }

  async listWorkers(tenantId) {
    return userRepository.findWorkers(tenantId);
  }

  getMaxWorkers(plan) {
    if (plan === 'PRO') return 3;
    if (plan === 'BUSINESS') return 10;
    return 0;
  }
}

module.exports = new UserService();
