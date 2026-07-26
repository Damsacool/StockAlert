const express = require('express');
const controller = require('./user.controller');

const router = express.Router();

router.get('/me', controller.getMe);
router.patch('/me', controller.updateMe);
router.post('/workers', controller.createWorker);
router.get('/workers', controller.listWorkers);

module.exports = router;
