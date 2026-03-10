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
    iconBg: 'bg-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.15)]',
    iconColor: 'text-green-400',
    changeColor: 'text-green-400',
  },
  {
    label: 'Outstanding Invoices',
    value: '$18,450.00',
    change: 'Across 12 pending payments',
    changeType: 'neutral',
    icon: Clock,
    iconBg: 'bg-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.15)]',
    iconColor: 'text-amber-400',
    changeColor: 'text-amber-400',
  },
  {
    label: 'Firm Expenses',
    value: '$6,840.00',
    change: '+2.4% from last month',
    changeType: 'negative',
    icon: TrendingDown,
    iconBg: 'bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]',
    iconColor: 'text-red-400',
    changeColor: 'text-red-400',
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Financial Management</h1>
          <p className="text-slate-400 mt-1">Track firm expenses, generate invoices, and manage client payments.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-outline">
            <Plus className="w-4 h-4" />
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {financialCards.map((card) => (
          <div key={card.label} className="card p-5 group hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{card.label}</p>
              <div className={`${card.iconBg} p-2 rounded-xl border border-white/5 group-hover:bg-white/10 transition-colors`}>
                <card.icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
            </div>
            <p className="text-3xl font-black text-white">{card.value}</p>
            <p className={`text-[11px] font-semibold uppercase tracking-widest mt-2 px-2 py-1 inline-block rounded-md bg-white/5 border border-white/5 ${card.changeColor}`}>
              {card.change}
            </p>
          </div>
        ))}
      </div>

      {/* Content Row */}
      <div className="grid grid-cols-12 gap-6">
        {/* Recent Invoices */}
        <div className="col-span-12 lg:col-span-7 card p-5 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white tracking-wide">Recent Invoices</h2>
            <button className="text-sm text-blue-400 hover:text-blue-300 font-semibold tracking-wide">View All</button>
          </div>
          <div className="overflow-x-auto -mx-5 px-5 pb-2">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-700/50 bg-slate-900/40">
                  <th className="table-header text-left py-3 px-4">Invoice #</th>
                  <th className="table-header text-left py-3 px-4">Client</th>
                  <th className="table-header text-left py-3 px-4">Amount</th>
                  <th className="table-header text-left py-3 px-4">Status</th>
                  <th className="table-header text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoicesData.map((inv) => (
                  <tr key={inv.id} className="border-b border-slate-800/40 hover:bg-white/5 transition-colors group">
                    <td className="py-4 px-4">
                      <p className="text-sm font-black text-red-500 tracking-wider group-hover:text-red-400 transition-colors">{inv.id}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">{inv.date}</p>
                    </td>
                    <td className="py-4 px-4 text-sm font-bold text-slate-300">{inv.client}</td>
                    <td className="py-4 px-4 text-sm font-black text-white">{inv.amount}</td>
                    <td className="py-4 px-4">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-500 hover:text-white border border-transparent hover:border-white/10">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-500 hover:text-white border border-transparent hover:border-white/10">
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
        <div className="col-span-12 lg:col-span-5 card p-6 relative overflow-hidden">
          {/* subtle glow bg */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <h2 className="text-lg font-bold text-white tracking-wide mb-6">Quick Expense Entry</h2>
          <form className="space-y-5 relative z-10" onSubmit={handleLogExpense}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Description</label>
              <input
                type="text"
                placeholder="e.g. Filing Fees"
                required
                value={expenseForm.title}
                onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                className="futuristic-input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Amount</label>
                <div className="relative group">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    className="futuristic-input pl-11"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Category</label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  className="futuristic-input"
                >
                  <option className="bg-slate-800 text-white" value="Court Fee">Court Fees</option>
                  <option className="bg-slate-800 text-white" value="Travel">Travel</option>
                  <option className="bg-slate-800 text-white" value="Filing">Filing</option>
                  <option className="bg-slate-800 text-white" value="Miscellaneous">Miscellaneous</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Related Case</label>
              <select
                required
                value={expenseForm.caseId}
                onChange={(e) => setExpenseForm({ ...expenseForm, caseId: e.target.value })}
                className="futuristic-input"
              >
                <option className="bg-slate-800 text-white" value="" disabled>Select a case</option>
                {cases.map(c => (
                  <option className="bg-slate-800 text-white" key={c._id} value={c._id}>{c.title} ({c.caseNumber})</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 mt-2"
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