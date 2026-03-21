const mongoose = require('mongoose');

// Generic atomic counter for generating sequential, unique IDs.
// Uses findOneAndUpdate with $inc which is a single atomic MongoDB operation —
// guaranteed unique even under high concurrency (multiple simultaneous users).
const counterSchema = new mongoose.Schema({
  _id:  { type: String, required: true }, // e.g. 'invoiceNumber'
  seq:  { type: Number, default: 0 }
});

module.exports = mongoose.model('Counter', counterSchema);
