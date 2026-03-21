const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        const User = require('./models/User');
        const adminUser = await User.findOne();
        
        if (!adminUser) {
            console.log('No users found!');
            process.exit(0);
        }
        
        const Case = require('./models/Case');
        const testCase = await Case.findOne();
        
        if (!testCase) {
            console.log('No cases found!');
            process.exit(0);
        }

        const jwt = require('jsonwebtoken');
        const token = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        try {
            console.log(`Testing invoice generation for case ${testCase._id}...`);
            const response = await axios.get(`http://localhost:5005/api/invoices/generate/${testCase._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Success!', response.status);
        } catch (error) {
            console.error('Invoice Generation Failed:', error.response?.status);
            console.error('Error Data:', error.response?.data);
        }

        process.exit(0);
    } catch (error) {
        console.error('Test setup error:', error);
        process.exit(1);
    }
};

test();
