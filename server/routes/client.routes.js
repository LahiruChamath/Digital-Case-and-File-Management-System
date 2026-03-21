const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { registerClient, getClients, updateClient, deleteClient, addCommunicationLog } = require('../controllers/client.controller');
const { clientValidation } = require('../middleware/validation.middleware');

router.use(protect);

router.post('/', clientValidation, registerClient);
router.get('/', getClients);
router.put('/:id', clientValidation, updateClient);
router.delete('/:id', deleteClient);
router.post('/:id/communication', addCommunicationLog);

module.exports = router;
