require('dotenv').config();
const mongoose = require('mongoose');

async function check() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lawfirm');
  console.log("DB Connected.");

  const Case = require('./models/Case');
  const Invoice = require('./models/Invoice');
  const Expense = require('./models/Expense');
  const Client = require('./models/Client');

  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

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
      Client.countDocuments(),
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
            // Note: $dayOfWeek returns 1 (Sun) to 7 (Sat)
            _id: { $dayOfWeek: '$updatedAt' },
            value: { $sum: '$totalAmount' },
            date: { $min: '$updatedAt' }
          }
        },
        { $sort: { date: 1 } }
      ])
    ]);
    console.log("SUCCESS");
  } catch (err) {
    console.error("ERROR IN STATS:", err);
  }
  process.exit(0);
}
check();
