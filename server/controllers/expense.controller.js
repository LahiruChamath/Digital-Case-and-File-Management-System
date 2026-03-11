const Expense = require('../models/Expense');

// @desc    Record new expense
// @route   POST /api/expenses
// @access  Private
exports.recordExpense = async (req, res) => {
  try {
    const expense = await Expense.create({ ...req.body, loggedBy: req.user._id });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Failed to record expense', error: error.message });
  }
};

// @desc    Get expenses for a case
// @route   GET /api/expenses/case/:caseId
// @access  Private
exports.getCaseExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ case: req.params.caseId });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch expenses', error: error.message });
  }
};
