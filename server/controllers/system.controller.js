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
    const closedCasesCount = await Case.countDocuments({ status: 'Closed' });
    
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

    // Real Billing Chart Data for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const billingAgg = await Invoice.aggregate([
      { 
        $match: { 
          status: 'paid',
          updatedAt: { $gte: sevenDaysAgo }
        } 
      },
      {
        $group: {
          _id: { $dayOfWeek: "$updatedAt" },
          value: { $sum: "$totalAmount" },
          date: { $min: "$updatedAt" }
        }
      },
      { $sort: { date: 1 } }
    ]);

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
      closedCasesCount, // New field for user
      totalRevenue,
      totalExpenses,
      caseDistribution: distribution,
      billingChart
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch system stats', error: error.message });
  }
};
