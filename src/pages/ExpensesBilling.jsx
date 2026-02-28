import React, { useState } from 'react';
import {
  Plus,
  FileText,
  TrendingUp,
  TrendingDown,
  Clock,
  Download,
  MoreVertical,
  DollarSign,
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';

const financialCards = [
  {
    label: 'Total Revenue (MTD)',
    value: '$45,280.00',
    change: '+15.2% from last month',
    changeType: 'positive',
    icon: TrendingUp,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    label: 'Outstanding Invoices',
    value: '$18,450.00',
    change: 'Across 12 pending payments',
    changeType: 'neutral',
    icon: Clock,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    label: 'Firm Expenses',
    value: '$6,840.00',
    change: '+2.4% from last month',
    changeType: 'negative',
    icon: TrendingDown,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600',
  },
];

const invoicesData = [
  { id: 'INV-8841', date: 'Feb 12, 2024', client: 'TechCorp Inc.', amount: '$4,200.00', status: 'Paid' },
  { id: 'INV-8840', date: 'Feb 10, 2024', client: 'Alice Smith', amount: '$1,500.00', status: 'Pending' },
  { id: 'INV-8839', date: 'Jan 28, 2024', client: 'Robert Miller', amount: '$2,850.00', status: 'Overdue' },
  { id: 'INV-8838', date: 'Jan 25, 2024', client: 'Sarah Johnson', amount: '$850.00', status: 'Paid' },
];

const ExpensesBilling = () => {
  const [expenseForm, setExpenseForm] = useState({
    description: '',
    amount: '',
    category: 'Notarial Fees',
    relatedCase: 'Smith vs. Global Dynamics',
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Financial Management</h1>
          <p className="text-slate-500 mt-1">Track firm expenses, generate invoices, and manage client payments.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-outline">
            <Plus className="w-4 h-4" />
            Track Expense
          </button>
          <button className="btn-primary">
            <FileText className="w-4 h-4" />
            Create Invoice
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-3 gap-5">
        {financialCards.map((card) => (
          <div key={card.label} className="card p-5">
            <div className="flex items-start justify-between">
              <p className="text-sm text-slate-500">{card.label}</p>
              <div className={`${card.iconBg} p-2 rounded-lg`}>
                <card.icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{card.value}</p>
            <p className={`text-xs mt-1 ${
              card.changeType === 'positive' ? 'text-green-600' :
              card.changeType === 'negative' ? 'text-red-500' : 'text-slate-500'
            }`}>
              {card.change}
            </p>
          </div>
        ))}
      </div>

      {/* Content Row */}
      <div className="grid grid-cols-12 gap-5">
        {/* Recent Invoices */}
        <div className="col-span-7 card p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-slate-900">Recent Invoices</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="table-header text-left py-3">Invoice #</th>
                <th className="table-header text-left py-3">Client</th>
                <th className="table-header text-left py-3">Amount</th>
                <th className="table-header text-left py-3">Status</th>
                <th className="table-header text-right py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoicesData.map((inv) => (
                <tr key={inv.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-3">
                    <p className="text-sm font-semibold text-red-600">{inv.id}</p>
                    <p className="text-xs text-slate-500">{inv.date}</p>
                  </td>
                  <td className="py-3 text-sm text-slate-700">{inv.client}</td>
                  <td className="py-3 text-sm font-semibold text-slate-900">{inv.amount}</td>
                  <td className="py-3">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Expense Entry */}
        <div className="col-span-5 card p-5">
          <h2 className="text-lg font-semibold text-slate-900 mb-5">Quick Expense Entry</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
              <input
                type="text"
                placeholder="e.g. Filing Fees"
                value={expenseForm.description}
                onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="0.00"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option>Notarial Fees</option>
                  <option>Filing Fees</option>
                  <option>Court Fees</option>
                  <option>Travel Expenses</option>
                  <option>Office Supplies</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Related Case</label>
              <select
                value={expenseForm.relatedCase}
                onChange={(e) => setExpenseForm({ ...expenseForm, relatedCase: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option>Smith vs. Global Dynamics</option>
                <option>TechCorp IP Dispute</option>
                <option>Miller Criminal Case</option>
                <option>Johnson Family Law</option>
              </select>
            </div>
            <button
              type="button"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg font-medium transition-colors text-sm"
            >
              Log Expense
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExpensesBilling;