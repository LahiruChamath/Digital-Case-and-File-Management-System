const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 requests per hour for auth
  message: 'Too many login attempts, please try again after an hour'
});

app.use('/api/', limiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Routes
app.use('/api/auth', require('./routes/auth.routes.js'));
app.use('/api/documents', require('./routes/document.routes.js'));
app.use('/api/cases', require('./routes/case.routes.js'));
app.use('/api/clients', require('./routes/client.routes.js'));
app.use('/api/notifications', require('./routes/notification.routes.js'));
app.use('/api/calendar', require('./routes/calendar.routes.js'));
app.use('/api/expenses', require('./routes/expense.routes.js'));
app.use('/api/search', require('./routes/search.routes.js'));
app.use('/api/invoices', require('./routes/invoice.routes.js'));
app.use('/api/admin', require('./routes/admin.routes.js'));

// Initialize Cron Jobs
if (process.env.NODE_ENV !== 'test') {
  const startReminderJob = require('./utils/reminderJob.js');
  startReminderJob();
}

// Root Route
app.get('/', (req, res) => {
  res.send('Digital Case Management API is running...');
});

// Only connect and listen if not in test mode
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
