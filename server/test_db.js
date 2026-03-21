const mongoose = require('mongoose');
const { getSystemHealth, getSystemStats } = require('./controllers/system.controller');
const { triggerBackup, getBackups } = require('./controllers/backup.controller');
const { getAllUsers } = require('./controllers/admin.controller');
const User = require('./models/User');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');
  
  const req = { user: { _id: new mongoose.Types.ObjectId() } };
  const res = {
    status: (code) => { console.log('STATUS:', code); return res; },
    json: (data) => console.log('JSON RETURNED')
  };

  try {
    console.log('--- Testing getSystemHealth ---');
    await getSystemHealth(req, res);
  } catch (e) { console.error('getSystemHealth ERRROR', e); }

  try {
    console.log('--- Testing getSystemStats ---');
    await getSystemStats(req, res);
  } catch (e) { console.error('getSystemStats ERRROR', e); }

  try {
    console.log('--- Testing triggerBackup ---');
    await triggerBackup(req, res);
  } catch (e) { console.error('triggerBackup ERRROR', e); }

  try {
    console.log('--- Testing getBackups ---');
    await getBackups(req, res);
  } catch (e) { console.error('getBackups ERRROR', e); }

  mongoose.disconnect();
}
run();
