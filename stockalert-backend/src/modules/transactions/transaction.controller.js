const transactionService = require('./transaction.service');
const ApiResponse = require('../../utils/ApiResponse');

class TransactionController {
  async getAll(req, res, next) {
    try {
      const transactions = await transactionService.getAllForTenant(req.tenantId);
      res.json(ApiResponse.success(transactions));
    } catch (err) {
      next(err);
    }
  }

  async getByProduct(req, res, next) {
    try {
      const transactions = await transactionService.getByProduct(req.params.productId, req.tenantId);
      res.json(ApiResponse.success(transactions));
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new TransactionController();
