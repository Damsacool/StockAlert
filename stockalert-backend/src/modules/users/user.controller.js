const userService = require('./user.service');
const ApiResponse = require('../../utils/ApiResponse');

class UserController {
  async getMe(req, res, next) {
    try {
      const profile = await userService.getProfile(req.user.id);
      res.json(ApiResponse.success(profile));
    } catch (err) {
      next(err);
    }
  }

  async updateMe(req, res, next) {
    try {
      const updated = await userService.updateProfile(req.user.id, req.body);
      res.json(ApiResponse.success(updated, 'Profile updated successfully'));
    } catch (err) {
      next(err);
    }
  }

  async createWorker(req, res, next) {
    try {
      const worker = await userService.createWorker(req.body, req.user.id);
      res.status(201).json(ApiResponse.success(worker, 'Worker created successfully'));
    } catch (err) {
      next(err);
    }
  }

  async listWorkers(req, res, next) {
    try {
      const workers = await userService.listWorkers(req.tenantId);
      res.json(ApiResponse.success(workers));
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
