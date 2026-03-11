const express = require('express');
const router = express.Router();
const systemController = require('../controllers/system.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

// router.get('/settings', authorize('admin'), systemController.getSettings);
// router.put('/settings', authorize('admin'), systemController.updateSettings);
// router.get('/audit-logs', authorize('admin'), systemController.getAuditLogs);
// router.get('/audit-logs/export', authorize('admin'), systemController.exportAuditLogs);
router.get('/health', systemController.getSystemHealth);
router.get('/stats', systemController.getSystemStats);

module.exports = router;
