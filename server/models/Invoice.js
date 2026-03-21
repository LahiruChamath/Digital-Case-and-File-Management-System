const mongoose = require('mongoose');
const Counter  = require('./Counter');

const invoiceItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  unitPrice: { type: Number, required: true },
  amount: { type: Number, required: true },
  expense: { type: mongoose.Schema.Types.ObjectId, ref: 'Expense' },
});

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    case: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    items: [invoiceItemSchema],
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
      default: 'draft',
    },
    issueDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    paidDate: { type: Date },
    paidAmount: { type: Number, default: 0 },
    notes: { type: String },
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pdfUrl: { type: String },
  },
  { timestamps: true }
);

invoiceSchema.pre('validate', async function () {
  if (!this.invoiceNumber) {
    // Atomic counter — findOneAndUpdate with $inc is a single MongoDB operation.
    // Guaranteed unique even when two users create invoices at the exact same time.
    const counter = await Counter.findOneAndUpdate(
      { _id: 'invoiceNumber' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.invoiceNumber = `INV-${String(counter.seq).padStart(5, '0')}`;
  }
});

invoiceSchema.methods.checkOverdue = function () {
  if (this.status === 'sent' && new Date() > this.dueDate) {
    this.status = 'overdue';
  }
  return this;
};

module.exports = mongoose.model('Invoice', invoiceSchema);
