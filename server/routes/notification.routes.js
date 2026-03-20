const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getNotifications, markAsRead } = require('../controllers/notification.controller');

router.use(protect);

router.get('/', getNotifications);
router.put('/:id/read', markAsRead);

module.exports = router;
