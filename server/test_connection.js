const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB connection to:', process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':****@'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('SUCCESS: Connected to MongoDB');
    process.exit(0);
  })
  .catch(err => {
    console.error('FAILURE: MongoDB connection error:', err);
    process.exit(1);
  });
