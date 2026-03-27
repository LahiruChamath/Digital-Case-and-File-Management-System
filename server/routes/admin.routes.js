const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { autoAudit } = require('../middleware/audit.middleware');
const { getAllUsers, toggleUserStatus, createUser, updateUserRole, deleteUser, getAccessRequests, approveAccessRequest, rejectAccessRequest } = require('../controllers/admin.controller');
const { createCase, getCases, updateCase, updateCaseStatus, closeCase, addCaseNote } = require('../controllers/case.controller');
const { getSystemHealth } = require('../controllers/system.controller');
const { registerClient, getClients, updateClient, addCommunicationLog } = require('../controllers/client.controller');
const { triggerBackup, getBackups } = require('../controllers/backup.controller');

// Middleware to check if user is Admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'Senior Lawyer') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

router.use(protect);
router.use(admin);
router.use(autoAudit);

router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/system/health', getSystemHealth);
router.post('/backup', triggerBackup);
router.get('/backups', getBackups);

// Access Request Management
router.get('/requests', getAccessRequests);
router.put('/requests/:id/approve', approveAccessRequest);
router.put('/requests/:id/reject', rejectAccessRequest);

module.exports = router;
