const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { createCase, getCases, updateCase, updateCaseStatus, closeCase, addCaseNote, deleteCase } = require('../controllers/case.controller');
const { caseValidation } = require('../middleware/validation.middleware');

router.use(protect);

router.post('/', authorize('Senior Lawyer'), caseValidation, createCase);
router.get('/', getCases);
router.put('/:id', authorize('Senior Lawyer', 'Junior Lawyer'), caseValidation, updateCase);
router.put('/:id/status', authorize('Senior Lawyer', 'Junior Lawyer'), updateCaseStatus);
router.put('/:id/close', authorize('Senior Lawyer'), closeCase);
router.post('/:id/notes', addCaseNote);
router.delete('/:id', authorize('Senior Lawyer'), deleteCase);

module.exports = router;
