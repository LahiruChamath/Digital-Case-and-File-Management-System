const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { registerClient, getClients, addCommunicationLog } = require('../controllers/client.controller');

router.use(protect);

router.post('/', registerClient);
router.get('/', getClients);
router.post('/:id/communication', addCommunicationLog);

module.exports = router;
