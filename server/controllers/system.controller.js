const si = require('systeminformation');
const User = require('../models/User');
const Case = require('../models/Case');
const Document = require('../models/Document');
const Invoice = require('../models/Invoice');
const Expense = require('../models/Expense');
const AuditLog = require('../models/AuditLog');
const SystemSettings = require('../models/SystemSettings');

// @desc    Get system health & statistics
// @route   GET /api/admin/system/health
// @access  Private/Admin
exports.getSystemHealth = async (req, res) => {
  try {
    const [cpu, mem, disk] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize()
    ]);

    const stats = {
      users: await User.countDocuments(),
      activeCases: await Case.countDocuments({ status: 'Active' }),
      totalDocuments: await Document.countDocuments(),
      deactivatedUsers: await User.countDocuments({ isActive: false })
    };

    res.json({
      hardware: {
        cpuUsage: Math.round(cpu.currentLoad),
        memUsed: Math.round((mem.active / mem.total) * 100),
        diskUsed: disk[0] ? Math.round(disk[0].use) : 0
      },
      stats,
      security: {
        rateLimitSetting: '100 req/15min',
        helmetEnabled: true,
        sslConfigured: process.env.NODE_ENV === 'production'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch system health', error: error.message });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/system/stats
// @access  Private/Admin
exports.getSystemStats = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Run all DB operations in parallel for best performance
    const [
      pendingInvoicesCount,
      closedCasesCount,
      activeCasesCount,
      totalClientsCount,
      revenueAgg,
      expenseAgg,
      caseDist,
      billingAgg
    ] = await Promise.all([
      Invoice.countDocuments({ status: { $in: ['sent', 'draft'] } }),
      Case.countDocuments({ status: 'Closed' }),
      Case.countDocuments({ status: { $ne: 'Closed' } }),
      require('../models/Client').countDocuments(),
      Invoice.aggregate([
        { $match: { status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Expense.aggregate([
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Case.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ]),
      Invoice.aggregate([
        {
          $match: {
            status: 'paid',
            updatedAt: { $gte: sevenDaysAgo }
          }
        },
        {
          $group: {
            _id: { $dayOfWeek: '$updatedAt' },
            value: { $sum: '$totalAmount' },
            date: { $min: '$updatedAt' }
          }
        },
        { $sort: { date: 1 } }
      ])
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;
    const totalExpenses = expenseAgg[0]?.total || 0;
    const distribution = caseDist.map(d => ({
      name: d._id,
      value: d.count,
      color: d._id === 'Litigation' ? '#3b82f6' : d._id === 'Notarial' ? '#ef4444' : d._id === 'Oath Commissioner' ? '#22c55e' : '#f59e0b'
    }));

    // Ensure all 7 days are represented even if 0
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const currentDay = new Date().getDay(); // 0 is Sun
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7Days.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
    }

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const billingChart = last7Days.map(day => {
      // Find matches where dayNames mapping matches the numeric _id from Mongo
      // Note: $dayOfWeek returns 1 (Sun) to 7 (Sat)
      const match = billingAgg.find(b => dayNames[b._id - 1] === day);
      return { name: day, value: match ? match.value : 0 };
    });

    res.json({
      pendingInvoicesCount,
      closedCasesCount,
      activeCasesCount,
      totalClientsCount,
      totalRevenue,
      totalExpenses,
      caseDistribution: distribution,
      billingChart
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch system stats', error: error.message });
  }
};

// @desc    Get system audit logs
// @route   GET /api/system/audit-logs
// @access  Private/Admin
exports.getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, action, user } = req.query;
    const query = {};
    if (action) query.action = action;
    if (user) query.user = user;

    const logs = await AuditLog.find(query)
      .populate('user', 'name email')
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await AuditLog.countDocuments(query);

    res.json({
      logs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalLogs: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch audit logs', error: error.message });
  }
};

// @desc    Get system settings
// @route   GET /api/system/settings
// @access  Private/Admin
exports.getSettings = async (req, res) => {
  try {
    let settings = await SystemSettings.find({});
    
    // If no settings exist yet, seed defaults
    if (settings.length === 0) {
      const defaults = SystemSettings.getDefaults();
      settings = await SystemSettings.insertMany(defaults);
    }

    // Transform into a key-value object for easier frontend use
    const settingsObj = {};
    settings.forEach(s => {
      settingsObj[s.key] = s.value;
    });

    res.json(settingsObj);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch settings', error: error.message });
  }
};

// @desc    Update system settings
// @route   PUT /api/system/settings
// @access  Private/Admin
exports.updateSettings = async (req, res) => {
  try {
    const updates = req.body; // Expects an object { key: value, ... }
    
    const updatePromises = Object.keys(updates).map(key => {
      return SystemSettings.findOneAndUpdate(
        { key },
        { value: updates[key], updatedBy: req.user._id },
        { new: true, upsert: true }
      );
    });

    await Promise.all(updatePromises);
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update settings', error: error.message });
  }
};
