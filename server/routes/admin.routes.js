const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getAllUsers, toggleUserStatus, createUser, updateUserRole } = require('../controllers/admin.controller');
const { getSystemHealth } = require('../controllers/system.controller');
const { triggerBackup, getBackups } = require('../controllers/backup.controller');

// Middleware to check if user is Admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

router.use(protect);
router.use(admin);

router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.put('/users/:id/role', updateUserRole);
router.get('/system/health', getSystemHealth);
router.post('/backup', triggerBackup);
router.get('/backups', getBackups);

module.exports = router;
