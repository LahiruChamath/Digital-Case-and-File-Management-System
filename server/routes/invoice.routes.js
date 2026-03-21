const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { generateInvoice, getAllInvoices } = require('../controllers/invoice.controller');

router.use(protect);

router.get('/', getAllInvoices);
router.get('/generate/:caseId', generateInvoice);

module.exports = router;
