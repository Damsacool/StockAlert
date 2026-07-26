const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.message === 'PRODUCT_NOT_FOUND') {
    return res.status(404).json({
      success: false,
      error: 'PRODUCT_NOT_FOUND',
      message: 'Product not found',
    });
  }

  if (err.message === 'INSUFFICIENT_STOCK') {
    return res.status(400).json({
      success: false,
      error: 'INSUFFICIENT_STOCK',
      message: 'Stock cannot go below zero',
    });
  }

  if (err.message === 'PLAN_LIMIT_REACHED') {
    return res.status(403).json({
      success: false,
      error: 'PLAN_LIMIT_REACHED',
      message: 'Plan limit reached',
    });
  }

  return res.status(500).json({
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message: 'Something went wrong',
  });
};

module.exports = errorHandler;
