const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { recordExpense, getCaseExpenses } = require('../controllers/expense.controller');

router.use(protect);

router.post('/', recordExpense);
router.get('/case/:caseId', getCaseExpenses);

module.exports = router;
