const express = require('express');
const router = express.Router();
const { login, register, requestAccess, getLawyers, forgotPassword, resetPassword } = require('../controllers/auth.controller');
const { loginValidation, registerValidation } = require('../middleware/validation.middleware');
const { protect } = require('../middleware/auth.middleware');

router.post('/login', loginValidation, login);
router.post('/register', registerValidation, register);
router.post('/request-access', requestAccess);
router.get('/lawyers', protect, getLawyers);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);

module.exports = router;
