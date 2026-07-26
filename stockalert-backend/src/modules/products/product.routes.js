const express = require('express');
const controller = require('./product.controller');

const router = express.Router();

router.get('/', controller.getAll);
router.post('/', controller.create);
router.patch('/:id/stock', controller.updateStock);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
