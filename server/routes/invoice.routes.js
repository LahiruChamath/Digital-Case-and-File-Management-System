const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { generateInvoice, getAllInvoices, updateInvoiceStatus } = require('../controllers/invoice.controller');

router.use(protect);
router.use(authorize('Senior Lawyer'));

router.get('/', getAllInvoices);
router.get('/generate/:caseId', generateInvoice);
router.put('/:id/status', updateInvoiceStatus);

module.exports = router;
