const express = require('express');
const controller = require('./transaction.controller');

const router = express.Router();

router.get('/', controller.getAll);
router.get('/:productId', controller.getByProduct);

module.exports = router;
