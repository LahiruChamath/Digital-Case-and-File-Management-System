const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  case: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    enum: ['Court Fee', 'Travel', 'Filing', 'Miscellaneous'],
    default: 'Miscellaneous'
  },
  status: {
    type: String,
    enum: ['Pending', 'Reimbursed', 'Billed'],
    default: 'Pending'
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for case-based expense lookups
expenseSchema.index({ case: 1 });
expenseSchema.index({ status: 1 });

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
