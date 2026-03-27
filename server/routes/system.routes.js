const express = require('express');
const router = express.Router();
const systemController = require('../controllers/system.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/settings', authorize('Senior Lawyer'), systemController.getSettings);
router.put('/settings', authorize('Senior Lawyer'), systemController.updateSettings);
router.get('/audit-logs', authorize('Senior Lawyer'), systemController.getAuditLogs);
router.get('/health', systemController.getSystemHealth);
router.get('/stats', systemController.getSystemStats);

module.exports = router;
