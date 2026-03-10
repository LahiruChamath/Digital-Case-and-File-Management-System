const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/auth.controller');

router.post('/login', login);
router.post('/register', register); // Should eventually be protected by admin middleware

module.exports = router;
