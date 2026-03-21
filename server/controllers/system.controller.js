const si = require('systeminformation');
const User = require('../models/User');
const Case = require('../models/Case');
const Document = require('../models/Document');
const Invoice = require('../models/Invoice');
const Expense = require('../models/Expense');

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
    const pendingInvoicesCount = await Invoice.countDocuments({ status: { $in: ['sent', 'draft'] } });
    
    // Total Revenue (Paid Invoices)
    const revenueAgg = await Invoice.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // Total Expenses
    const expenseAgg = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalExpenses = expenseAgg[0]?.total || 0;

    // Case Distribution
    const caseDist = await Case.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    const distribution = caseDist.map(d => ({
      name: d._id,
      value: d.count,
      color: d._id === 'Litigation' ? '#3b82f6' : d._id === 'Notarial' ? '#ef4444' : d._id === 'Oath Commissioner' ? '#22c55e' : '#f59e0b'
    }));

    // Dummy Billing Chart Data for now, representing last 7 days
    const billingChart = [
      { name: 'Mon', value: 4000 },
      { name: 'Tue', value: 3000 },
      { name: 'Wed', value: 5000 },
      { name: 'Thu', value: 4500 },
      { name: 'Fri', value: 6000 },
      { name: 'Sat', value: 3500 },
      { name: 'Sun', value: Math.round(totalRevenue / 7) || 4200 },
    ];

    res.json({
      pendingInvoicesCount,
      totalRevenue,
      totalExpenses,
      caseDistribution: distribution,
      billingChart
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch system stats', error: error.message });
  }
};
