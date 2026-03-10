import React, { useState, useEffect } from 'react';
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
import { expenseService } from '../services/expenseService';
import { caseService } from '../services/caseService';
import { invoiceService } from '../services/invoiceService';

const financialCards = [
  {
    label: 'Total Revenue (MTD)',
    value: '$45,280.00',
    change: '+15.2% from last month',
    changeType: 'positive',
    icon: TrendingUp,
    iconBg: 'bg-green-50 text-green-600',
    changeColor: 'text-status-active bg-status-active/10',
  },
  {
    label: 'Outstanding Invoices',
    value: '$18,450.00',
    change: 'Across 12 pending payments',
    changeType: 'neutral',
    icon: Clock,
    iconBg: 'bg-amber-50 text-amber-600',
    changeColor: 'text-status-pending bg-status-pending/10',
  },
  {
    label: 'Firm Expenses',
    value: '$6,840.00',
    change: '+2.4% from last month',
    changeType: 'negative',
    icon: TrendingDown,
    iconBg: 'bg-red-50 text-red-600',
    changeColor: 'text-status-overdue bg-status-overdue/10',
  },
];

const invoicesData = [
  { id: 'INV-8841', date: 'Feb 12, 2024', client: 'TechCorp Inc.', amount: '$4,200.00', status: 'Paid' },
  { id: 'INV-8840', date: 'Feb 10, 2024', client: 'Alice Smith', amount: '$1,500.00', status: 'Pending' },
  { id: 'INV-8839', date: 'Jan 28, 2024', client: 'Robert Miller', amount: '$2,850.00', status: 'Overdue' },
  { id: 'INV-8838', date: 'Jan 25, 2024', client: 'Sarah Johnson', amount: '$850.00', status: 'Paid' },
];

const ExpensesBilling = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    amount: '',
    category: 'Court Fee',
    caseId: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const casesData = await caseService.getAll();
      setCases(casesData);
      if (casesData.length > 0) {
        setExpenseForm(prev => ({ ...prev, caseId: casesData[0]._id }));
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogExpense = async (e) => {
    e.preventDefault();
    try {
      await expenseService.record({
        ...expenseForm,
        case: expenseForm.caseId
      });
      alert('Expense logged successfully!');
      setExpenseForm({ title: '', amount: '', category: 'Court Fee', caseId: cases[0]?._id || '' });
    } catch (error) {
      console.error('Failed to log expense', error);
    }
  };

  const handleDownloadInvoice = async () => {
    if (!expenseForm.caseId) return alert('Please select a case first');
    setDownloading(true);
    try {
      const selectedCase = cases.find(c => c._id === expenseForm.caseId);
      await invoiceService.generateAndDownload(expenseForm.caseId, selectedCase?.caseNumber || 'INV');
    } catch (error) {
      alert('Failed to generate invoice');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-apple-text tracking-tight">Financial Management</h1>
          <p className="text-gray-500 mt-1.5 text-sm">Track firm expenses, generate invoices, and manage client payments.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-outline">
            <Plus className="w-4 h-4 text-gray-500" />
            Track Expense
          </button>
          <button 
            className="btn-primary" 
            onClick={handleDownloadInvoice}
            disabled={downloading}
          >
            <FileText className="w-4 h-4" />
            {downloading ? 'Generating...' : 'Create Invoice'}
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {financialCards.map((card) => (
          <div key={card.label} className="card p-6 flex flex-col justify-between">
            <div className="flex items-start justify-between mb-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">{card.label}</p>
              <div className={`${card.iconBg} p-2 rounded-xl`}>
                <card.icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-apple-text tracking-tight">{card.value}</p>
              <p className={`text-[10px] font-bold uppercase tracking-wider mt-2.5 px-2 py-1 inline-block rounded-md ${card.changeColor}`}>
                {card.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Content Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Invoices */}
        <div className="col-span-1 lg:col-span-7 card overflow-hidden flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-apple-text">Recent Invoices</h2>
            <button className="text-sm text-primary-500 hover:text-primary-600 font-semibold transition-colors">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="table-header py-4 px-6">Invoice #</th>
                  <th className="table-header py-4 px-6">Client</th>
                  <th className="table-header py-4 px-6">Amount</th>
                  <th className="table-header py-4 px-6">Status</th>
                  <th className="table-header py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoicesData.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <p className="text-sm font-bold text-apple-text tracking-wide group-hover:text-primary-600 transition-colors">{inv.id}</p>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mt-1">{inv.date}</p>
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-gray-600">{inv.client}</td>
                    <td className="py-4 px-6 text-sm font-bold text-apple-text">{inv.amount}</td>
                    <td className="py-4 px-6">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-2 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-primary-600 shadow-sm border border-transparent hover:border-gray-200">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-800">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Expense Entry */}
        <div className="col-span-1 lg:col-span-5 card">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
             <h2 className="text-lg font-semibold text-apple-text">Quick Expense Entry</h2>
          </div>
          <form className="p-6 space-y-5" onSubmit={handleLogExpense}>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Description</label>
              <input
                type="text"
                placeholder="e.g. Filing Fees"
                required
                value={expenseForm.title}
                onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                className="clean-input"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Amount</label>
                <div className="relative group">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    className="clean-input pl-11"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Category</label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  className="clean-input"
                >
                  <option value="Court Fee">Court Fees</option>
                  <option value="Travel">Travel</option>
                  <option value="Filing">Filing</option>
                  <option value="Miscellaneous">Miscellaneous</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Related Case</label>
              <select
                required
                value={expenseForm.caseId}
                onChange={(e) => setExpenseForm({ ...expenseForm, caseId: e.target.value })}
                className="clean-input"
              >
                <option value="" disabled>Select a case</option>
                {cases.map(c => (
                  <option key={c._id} value={c._id}>{c.title} ({c.caseNumber})</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 mt-4"
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