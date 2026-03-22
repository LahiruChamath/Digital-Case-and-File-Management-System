const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Court Date', 'Meeting', 'Deadline', 'Other'],
    default: 'Court Date'
  },
  status: {
    type: String,
    enum: ['Pending', 'Done'],
    default: 'Pending'
  },
  case: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true
  },
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date
  },
  location: {
    type: String
  },
  description: {
    type: String
  },
  reminders: [
    {
      type: String, // e.g., '1 day', '3 days', '1 week'
      sent: {
        type: Boolean,
        default: false
      }
    }
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
