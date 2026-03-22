import React, { useState, useEffect } from 'react';
import {
  Plus,
  FileText,
  TrendingUp,
  TrendingDown,
  Clock,
  Download,
  MoreVertical,
  Banknote,
  Check,
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import { expenseService } from '../services/expenseService';
import { caseService } from '../services/caseService';
import { invoiceService } from '../services/invoiceService';
import { adminService } from '../services/adminService';
import { useToast } from '../context/ToastContext';

const ExpensesBilling = () => {
  const { showToast } = useToast();
  const expenseFormRef = React.useRef(null);
  const [cases, setCases] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [sysStats, setSysStats] = useState(null);
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
      const [casesData, invoicesData, statsData, expensesData] = await Promise.all([
        caseService.getAll(),
        invoiceService.getAll(),
        adminService.getSystemStats(),
        expenseService.getAll()
      ]);
      setCases(casesData);
      setInvoices(invoicesData);
      setExpenses(expensesData);
      setSysStats(statsData);
      if (casesData.length > 0 && !expenseForm.caseId) {
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
      showToast('Expense logged successfully!', 'success');
      setExpenseForm({ title: '', amount: '', category: 'Court Fee', caseId: cases[0]?._id || '' });
      fetchData(); // Auto reload to update stats, invoices, expenses
    } catch (error) {
      console.error('Failed to log expense', error);
    }
  };

  const handleDownloadInvoice = async () => {
    if (!expenseForm.caseId) return showToast('Please select a case first', 'error');
    setDownloading(true);
    try {
      const selectedCase = cases.find(c => c._id === expenseForm.caseId);
      await invoiceService.generateAndDownload(expenseForm.caseId, selectedCase?.caseNumber || 'INV');
      showToast('Invoice generated and downloaded!', 'success');
      fetchData();
    } catch (error) {
      showToast('Failed to generate invoice', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadInvoiceFromTable = async (inv) => {
    setDownloading(true);
    try {
      await invoiceService.generateAndDownload(inv.case._id, inv.invoiceNumber);
      showToast('Invoice downloaded successfully!', 'success');
    } catch (error) {
      showToast('Failed to download invoice', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const handleMarkAsPaid = async (id) => {
    try {
      await invoiceService.updateStatus(id, 'paid');
      showToast('Invoice marked as paid!', 'success');
      fetchData(); // Refresh to update charts & table
    } catch (error) {
      showToast('Failed to update invoice', 'error');
    }
  };

  const handleScrollToForm = () => {
    if (expenseFormRef.current) {
      expenseFormRef.current.scrollIntoView({ behavior: 'smooth' });
      // small delay to allow scroll, then focus the first input
      setTimeout(() => {
        const titleInput = expenseFormRef.current.querySelector('input[type="text"]');
        if (titleInput) titleInput.focus();
      }, 500);
    }
  };

  const dynamicFinancialCards = [
    {
      label: 'Total Revenue',
      value: sysStats ? `LKR ${sysStats.totalRevenue.toLocaleString()}` : 'LKR 0',
      change: 'Paid Invoices',
      icon: TrendingUp,
      iconBg: 'bg-green-50 text-green-600',
      changeColor: 'text-status-active bg-status-active/10',
    },
    {
      label: 'Outstanding Invoices',
      value: sysStats ? sysStats.pendingInvoicesCount : '0',
      change: 'Sent & Draft Payments',
      icon: Clock,
      iconBg: 'bg-amber-50 text-amber-600',
      changeColor: 'text-status-pending bg-status-pending/10',
    },
    {
      label: 'Firm Expenses',
      value: sysStats ? `LKR ${sysStats.totalExpenses.toLocaleString()}` : 'LKR 0',
      change: 'Logged Expenses',
      icon: TrendingDown,
      iconBg: 'bg-red-50 text-red-600',
      changeColor: 'text-status-overdue bg-status-overdue/10',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-apple-text tracking-tight">Financial Management</h1>
          <p className="text-gray-500 mt-1.5 text-sm">Track firm expenses, generate invoices, and manage client payments.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-outline" onClick={handleScrollToForm}>
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
        {dynamicFinancialCards.map((card) => (
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
                {invoices.map((inv) => (
                  <tr key={inv._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <p className="text-sm font-bold text-apple-text tracking-wide group-hover:text-primary-600 transition-colors">{inv.invoiceNumber}</p>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mt-1">{new Date(inv.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="py-4 px-6 text-sm font-semibold text-gray-600">{inv.client?.name || 'Unknown Client'}</td>
                    <td className="py-4 px-6 text-sm font-bold text-apple-text">LKR {inv.totalAmount.toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <StatusBadge status={inv.status.charAt(0).toUpperCase() + inv.status.slice(1)} />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-1">
                        {inv.status !== 'paid' && (
                          <button 
                            onClick={() => handleMarkAsPaid(inv._id)}
                            className="p-2 hover:bg-white rounded-lg transition-colors text-status-active border border-transparent hover:border-status-active/20 hover:bg-status-active/5"
                            title="Mark as Paid"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDownloadInvoiceFromTable(inv)}
                          disabled={downloading}
                          className="p-2 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-primary-600 shadow-sm border border-transparent hover:border-gray-200"
                        >
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
        <div className="col-span-1 lg:col-span-5 card" ref={expenseFormRef}>
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
                  <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="number"
                    step="1"
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

      {/* Recent Expenses Table */}
      <div className="card overflow-hidden flex flex-col min-h-[400px]">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-apple-text">Recent Expenses</h2>
          <button className="text-sm text-primary-500 hover:text-primary-600 font-semibold transition-colors">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="table-header py-4 px-6">Description</th>
                <th className="table-header py-4 px-6">Category</th>
                <th className="table-header py-4 px-6">Case</th>
                <th className="table-header py-4 px-6 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {expenses.map((exp) => (
                <tr key={exp._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <p className="text-sm font-bold text-apple-text tracking-wide group-hover:text-primary-600 transition-colors">{exp.title}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mt-1">{new Date(exp.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="py-4 px-6 text-sm font-semibold text-gray-600">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold tracking-wider uppercase">{exp.category}</span>
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-600">{exp.case?.title || 'Unknown Case'}</td>
                  <td className="py-4 px-6 text-sm font-bold text-apple-text text-right">LKR {exp.amount.toLocaleString()}</td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-400 text-sm">No expenses logged yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpensesBilling;