const express = require('express');
const alertService = require('./alert.service');
const ApiResponse = require('../../utils/ApiResponse');

const router = express.Router();

router.post('/test', async (req, res, next) => {
  try {
    await alertService.sendLowStockAlerts();
    res.json(ApiResponse.success(null, 'Alert job triggered successfully'));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
