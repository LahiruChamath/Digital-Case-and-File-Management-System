const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { registerClient, getClients, addCommunicationLog } = require('../controllers/client.controller');
const { clientValidation } = require('../middleware/validation.middleware');

router.use(protect);

router.post('/', clientValidation, registerClient);
router.get('/', getClients);
router.post('/:id/communication', addCommunicationLog);

module.exports = router;
