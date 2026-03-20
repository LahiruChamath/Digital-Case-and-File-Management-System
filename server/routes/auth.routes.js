const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/auth.controller');
const { loginValidation, registerValidation } = require('../middleware/validation.middleware');

router.post('/login', loginValidation, login);
router.post('/register', registerValidation, register);

module.exports = router;
