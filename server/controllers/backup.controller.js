const Backup = require('../models/Backup');
const User = require('../models/User');
const Case = require('../models/Case');
const Client = require('../models/Client');
const Invoice = require('../models/Invoice');
const Expense = require('../models/Expense');
const Event = require('../models/Event');
const Document = require('../models/Document');
const AccessRequest = require('../models/AccessRequest');

// @desc    Trigger system backup (Store in Atlas)
// @route   POST /api/admin/backup
// @access  Private/Admin
exports.triggerBackup = async (req, res) => {
  try {
    const [users, cases, clients, invoices, expenses, events, docs, requests] = await Promise.all([
      User.find({}),
      Case.find({}),
      Client.find({}),
      Invoice.find({}),
      Expense.find({}),
      Event.find({}),
      Document.find({}),
      AccessRequest.find({})
    ]);

    const backupData = {
      timestamp: new Date(),
      users,
      cases,
      clients,
      invoices,
      expenses,
      events,
      documents: docs,
      accessRequests: requests,
      version: '2.0.0'
    };

    const name = `Full_System_Backup_${new Date().toISOString().split('T')[0]}_${Date.now()}`;
    const size = Buffer.byteLength(JSON.stringify(backupData));

    const backupRecord = await Backup.create({
      name,
      data: backupData,
      size,
      triggeredBy: req.user._id,
      status: 'Success'
    });

    res.status(201).json({
      _id: backupRecord._id,
      name: backupRecord.name,
      size: backupRecord.size,
      createdAt: backupRecord.createdAt,
      status: backupRecord.status
    });
  } catch (error) {
    res.status(500).json({ message: 'Backup failed', error: error.message });
  }
};

// @desc    Get backup history
// @route   GET /api/admin/backups
// @access  Private/Admin
exports.getBackups = async (req, res) => {
  try {
    // Exclude the large 'data' field from the list for performance
    const backups = await Backup.find().select('-data').populate('triggeredBy', 'name').sort({ createdAt: -1 });
    res.json(backups);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch backup history', error: error.message });
  }
};
