const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Individual', 'Corporate'],
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  identificationNumber: {
    type: String, // ID or Registration Number
    unique: true
  },
  communicationHistory: [
    {
      type: {
        type: String,
        enum: ['Email', 'Phone call', 'Meeting', 'Other']
      },
      summary: String,
      date: {
        type: Date,
        default: Date.now
      },
      loggedBy: {
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

// Indexes for common query patterns
// Note: email and identificationNumber are already indexed via unique:true on the fields
clientSchema.index({ name: 1 });

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
