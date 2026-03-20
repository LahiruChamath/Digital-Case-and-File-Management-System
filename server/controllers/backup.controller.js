const Backup = require('../models/Backup');
const User = require('../models/User');
const Case = require('../models/Case');
const fs = require('fs');
const path = require('path');

// @desc    Trigger system backup
// @route   POST /api/admin/backup
// @access  Private/Admin
exports.triggerBackup = async (req, res) => {
  try {
    // For this demonstration, we'll create a JSON snapshot of key collections
    const [users, cases] = await Promise.all([
      User.find({}),
      Case.find({})
    ]);

    const backupData = {
      timestamp: new Date(),
      users,
      cases,
      version: '1.0.0'
    };

    const filename = `backup_${Date.now()}.json`;
    const backupDir = path.join(__dirname, '../backups');
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }

    const filePath = path.join(backupDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2));

    const stats = fs.statSync(filePath);

    const backupRecord = await Backup.create({
      filename,
      size: stats.size,
      triggeredBy: req.user._id,
      status: 'Success'
    });

    res.status(201).json(backupRecord);
  } catch (error) {
    res.status(500).json({ message: 'Backup failed', error: error.message });
  }
};

// @desc    Get backup history
// @route   GET /api/admin/backups
// @access  Private/Admin
exports.getBackups = async (req, res) => {
  try {
    const backups = await Backup.find().populate('triggeredBy', 'name').sort({ createdAt: -1 });
    res.json(backups);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch backup history', error: error.message });
  }
};
