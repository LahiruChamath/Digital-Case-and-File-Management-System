const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { createCase, getCases, updateCase, updateCaseStatus, closeCase, addCaseNote } = require('../controllers/case.controller');
const { caseValidation } = require('../middleware/validation.middleware');

router.use(protect);

router.post('/', caseValidation, createCase);
router.get('/', getCases);
router.put('/:id', caseValidation, updateCase);
router.put('/:id/status', updateCaseStatus);
router.put('/:id/close', closeCase);
router.post('/:id/notes', addCaseNote);

module.exports = router;
