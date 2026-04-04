const axios = require('axios');
const jwt = require('jsonwebtoken');

const secret = 'dev_secret_key_12345';
// We need a valid user ID. Let's fetch one from DB.
const mongoose = require('mongoose');

async function run() {
  await mongoose.connect('mongodb://127.0.0.1:27017/lawfirm');
  const User = require('./models/User');
  const user = await User.findOne();
  if(!user) { console.log('No user'); process.exit(1); }
  
  const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
  const api = axios.create({
    baseURL: 'http://localhost:5005/api',
    headers: { Authorization: `Bearer ${token}` }
  });

  try {
    console.log("Testing /calendar");
    await api.get('/calendar');
    console.log("Testing /notifications");
    await api.get('/notifications');
    console.log("Testing /system/stats");
    await api.get('/system/stats');
    console.log("ALL SUCCESS!");
  } catch(err) {
    if (err.response) {
      console.error("API ERROR:", err.response.status, err.response.data);
    } else {
      console.error(err.message);
    }
  }
  process.exit(0);
}
run();
