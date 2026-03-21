const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { createCase, getCases, updateCaseStatus, addCaseNote } = require('../controllers/case.controller');
const { caseValidation } = require('../middleware/validation.middleware');

router.use(protect);

router.post('/', caseValidation, createCase);
router.get('/', getCases);
router.put('/:id/status', updateCaseStatus);
router.post('/:id/notes', addCaseNote);

module.exports = router;
