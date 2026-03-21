const express = require('express');
const router = express.Router();
const backupController = require('../controllers/backup.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);
router.use(authorize('admin'));

router.post('/create', backupController.createBackup);
router.get('/', backupController.getBackups);
router.get('/:id', backupController.getBackupById);
router.post('/:id/verify', backupController.verifyBackup);
router.post('/:id/restore', backupController.restoreBackup);
router.delete('/:id', backupController.deleteBackup);
router.get('/status/latest', backupController.getLatestBackupStatus);

module.exports = router;
