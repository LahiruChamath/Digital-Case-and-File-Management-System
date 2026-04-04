require('dotenv').config();
const mongoose = require('mongoose');

async function fixAdmin() {
  await mongoose.connect('mongodb://127.0.0.1:27017/lawfirm');
  const User = require('./models/User');

  const email = 'admin@lawfirm.com';
  const password = 'Admin@1234';

  let user = await User.findOne({ email });
  
  if (!user) {
    console.log("Admin user not found. Creating...");
    user = new User({
      name: 'System Admin',
      email: email,
      password: password,
      role: 'Senior Lawyer',
      isActive: true
    });
    
    await user.save();
    console.log("Admin created.");
  } else {
    console.log("Admin user found. Validating password and role...");
    user.password = password; // pre-save hook will hash it
    user.role = 'Senior Lawyer'; // ensuring valid role
    await user.save();
    console.log("Password and role updated.");
  }
  
  process.exit(0);
}

fixAdmin().catch(console.error);
