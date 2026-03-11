const mongoose = require('mongoose');
const Case = require('./models/Case');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const cases = await Case.find().populate('client');
  console.log('Cases:', cases.map(c => ({ _id: c._id, client: c.client ? c.client._id : null })));
  mongoose.disconnect();
}
run();
