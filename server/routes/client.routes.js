const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { autoAudit } = require('../middleware/audit.middleware');
const { registerClient, getClients, updateClient, deleteClient, addCommunicationLog } = require('../controllers/client.controller');
const { clientValidation } = require('../middleware/validation.middleware');

router.use(protect);
router.use(autoAudit);

router.post('/', authorize('Senior Lawyer'), clientValidation, registerClient);
router.get('/', getClients);
router.put('/:id', authorize('Senior Lawyer', 'Junior Lawyer'), clientValidation, updateClient);
router.delete('/:id', authorize('Senior Lawyer'), deleteClient);
router.post('/:id/communication', addCommunicationLog);

module.exports = router;
