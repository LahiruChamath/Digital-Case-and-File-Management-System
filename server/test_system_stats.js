const mongoose = require('mongoose');
const { getSystemHealth, getSystemStats } = require('./controllers/system.controller');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');
  
  const req = {};
  const res = {
    status: (code) => { console.log('STATUS:', code); return res; },
    json: (data) => console.log('JSON returned', Object.keys(data))
  };

  try {
    console.log('--- Testing getSystemStats ---');
    await getSystemStats(req, res);
  } catch (e) { console.error('getSystemStats ERRROR', e); }

  mongoose.disconnect();
}
run();
