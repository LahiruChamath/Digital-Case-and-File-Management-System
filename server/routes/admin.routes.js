const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getAllUsers, toggleUserStatus } = require('../controllers/admin.controller');

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
router.put('/users/:id/toggle-status', toggleUserStatus);

module.exports = router;
