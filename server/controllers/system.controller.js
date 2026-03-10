const si = require('systeminformation');
const User = require('../models/User');
const Case = require('../models/Case');
const Document = require('../models/Document');

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
