const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

async function run() {
  const secret = 'dev_secret_key_12345';
  await mongoose.connect('mongodb://127.0.0.1:27017/lawfirm');
  const User = require('./models/User');
  const user = await User.findOne();
  if(!user) { console.log('No user'); process.exit(1); }
  
  const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
  const headers = { 'Authorization': `Bearer ${token}` };

  try {
    console.log("Testing /calendar");
    let res = await fetch('http://localhost:5005/api/calendar', { headers });
    if (!res.ok) throw new Error(await res.text());
    
    console.log("Testing /notifications");
    res = await fetch('http://localhost:5005/api/notifications', { headers });
    if (!res.ok) throw new Error(await res.text());
    
    console.log("Testing /system/stats");
    res = await fetch('http://localhost:5005/api/system/stats', { headers });
    if (!res.ok) throw new Error(await res.text());
    
    console.log("ALL SUCCESS!");
  } catch(err) {
    console.error("API ERROR:", err.message);
  }
  process.exit(0);
}
run();
