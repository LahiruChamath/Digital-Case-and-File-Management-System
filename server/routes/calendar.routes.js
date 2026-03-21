const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { createEvent, getEvents, updateEvent } = require('../controllers/calendar.controller');

router.use(protect);

router.post('/', createEvent);
router.get('/', getEvents);
router.put('/:id', updateEvent);

module.exports = router;
