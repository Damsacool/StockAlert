const productService = require('./product.service');
const ApiResponse = require('../../utils/ApiResponse');

class ProductController {
  async getAll(req, res, next) {
    try {
      const products = await productService.getAllForTenant(req.tenantId);
      res.json(ApiResponse.success(products));
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const product = await productService.createProduct(req.body, req.user.id, req.tenantId);
      res.status(201).json(ApiResponse.success(product, 'Product created successfully'));
    } catch (err) {
      next(err);
    }
  }

  async updateStock(req, res, next) {
    try {
      const { quantity } = req.body;
      const updated = await productService.updateStock(req.params.id, Number(quantity), req.user.id, req.tenantId);
      res.json(ApiResponse.success(updated, 'Stock updated successfully'));
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const updated = await productService.updateProduct(req.params.id, req.body, req.tenantId);
      res.json(ApiResponse.success(updated, 'Product updated successfully'));
    } catch (err) {
      next(err);
    }
  }

  async remove(req, res, next) {
    try {
      const deleted = await productService.deleteProduct(req.params.id, req.tenantId, req.userRole);
      res.json(ApiResponse.success(deleted, 'Product deleted successfully'));
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ProductController();
