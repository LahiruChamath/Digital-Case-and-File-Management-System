const express = require('express');
const router = express.Router();
const { login, register, requestAccess, getLawyers } = require('../controllers/auth.controller');
const { loginValidation, registerValidation } = require('../middleware/validation.middleware');
const { protect } = require('../middleware/auth.middleware');

router.post('/login', loginValidation, login);
router.post('/register', registerValidation, register);
router.post('/request-access', requestAccess);
router.get('/lawyers', protect, getLawyers);

module.exports = router;
