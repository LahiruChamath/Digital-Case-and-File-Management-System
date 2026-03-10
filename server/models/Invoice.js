const mongoose = require('mongoose');

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

invoiceSchema.pre('save', async function (next) {
  if (!this.invoiceNumber) {
    const count = await mongoose.model('Invoice').countDocuments();
    this.invoiceNumber = `INV-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

invoiceSchema.methods.checkOverdue = function () {
  if (this.status === 'sent' && new Date() > this.dueDate) {
    this.status = 'overdue';
  }
  return this;
};

module.exports = mongoose.model('Invoice', invoiceSchema);
