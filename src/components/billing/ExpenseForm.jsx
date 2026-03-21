import React, { useState, useEffect } from 'react';
import caseService from '../../services/caseService';

const ExpenseForm = ({ initialData = {}, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({ description: '', amount: '', category: 'court_fee', case: '', date: new Date().toISOString().split('T')[0], notes: '', ...initialData });
  const [cases, setCases] = useState([]);
  useEffect(() => { caseService.getCases().then((data) => setCases(data.cases || data || [])).catch(console.error); }, []);
  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); onSubmit({ ...formData, amount: parseFloat(formData.amount) }); };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Description *</label><input type="text" name="description" value={formData.description} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Amount (LKR) *</label><input type="number" name="amount" value={formData.amount} onChange={handleChange} required min="0" step="0.01" className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm"><option value="court_fee">Court Fee</option><option value="filing_fee">Filing Fee</option><option value="consultation">Consultation</option><option value="notarial_fee">Notarial Fee</option><option value="transport">Transport</option><option value="stationery">Stationery</option><option value="communication">Communication</option><option value="professional_fee">Professional Fee</option><option value="other">Other</option></select></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Case *</label><select name="case" value={formData.case} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg text-sm"><option value="">Select Case</option>{cases.map((c) => (<option key={c._id} value={c._id}>{c.caseNumber} - {c.title}</option>))}</select></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Date *</label><input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
      </div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Notes</label><textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
      <div className="flex justify-end gap-3 pt-4">
        {onCancel && <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-50">Cancel</button>}
        <button type="submit" disabled={loading} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">{loading ? 'Saving...' : initialData._id ? 'Update Expense' : 'Record Expense'}</button>
      </div>
    </form>
  );
};

export default ExpenseForm;
