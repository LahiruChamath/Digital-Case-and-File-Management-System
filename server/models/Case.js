const mongoose = require('mongoose');
const Counter  = require('./Counter');

const caseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  caseNumber: {
    type: String,
    required: true,
    unique: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  type: {
    type: String,
    enum: ['Litigation', 'Notarial', 'Oath Commissioner', 'Company Secretarial'],
    required: true
  },
  court: {
    type: String
  },
  status: {
    type: String,
    enum: ['Active', 'Pending', 'Closed', 'Archived'],
    default: 'Active'
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  assignedTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  notes: [
    {
      content: String,
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  timeline: [
    {
      activity: String,
      timestamp: {
        type: Date,
        default: Date.now
      },
      performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

caseSchema.pre('validate', async function () {
  if (!this.caseNumber) {
    const counter = await Counter.findOneAndUpdate(
      { _id: 'caseNumber' },
      { $inc: { seq: 1 } },
      { returnDocument: 'after', upsert: true }
    );
    this.caseNumber = `CASE-${String(counter.seq).padStart(5, '0')}`;
  }
});

// Indexes for common query patterns
caseSchema.index({ status: 1 });
caseSchema.index({ client: 1 });
caseSchema.index({ type: 1 });
// Note: caseNumber is already indexed via unique:true on the field
caseSchema.index({ status: 1, type: 1 });

const Case = mongoose.model('Case', caseSchema);

module.exports = Case;
