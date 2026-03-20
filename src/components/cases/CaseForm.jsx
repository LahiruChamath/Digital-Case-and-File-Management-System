import React, { useState, useEffect } from 'react';
import clientService from '../../services/clientService';

const CaseForm = ({ initialData = {}, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({ caseNumber: '', title: '', description: '', caseType: 'civil', status: 'active', court: '', judge: '', client: '', opposingParty: '', opposingCounsel: '', filingDate: '', priority: 'medium', notes: '', ...initialData });
  const [clients, setClients] = useState([]);
  useEffect(() => { clientService.getClients().then((data) => setClients(data.clients || data || [])).catch(console.error); }, []);
  const handleChange = (e) => { const { name, value } = e.target; setFormData((prev) => ({ ...prev, [name]: value })); };
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Case Number *</label><input type="text" name="caseNumber" value={formData.caseNumber} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="e.g., HC/2026/001" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Case Title *</label><input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Case Type *</label><select name="caseType" value={formData.caseType} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"><option value="civil">Civil</option><option value="criminal">Criminal</option><option value="commercial">Commercial</option><option value="family">Family</option><option value="labor">Labor</option><option value="land">Land</option><option value="notarial">Notarial</option><option value="corporate">Corporate</option><option value="other">Other</option></select></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label><select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"><option value="active">Active</option><option value="pending">Pending</option><option value="closed">Closed</option><option value="on_hold">On Hold</option><option value="appealed">Appealed</option></select></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Client *</label><select name="client" value={formData.client} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"><option value="">Select Client</option>{clients.map((c) => (<option key={c._id} value={c._id}>{c.name}</option>))}</select></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Court</label><input type="text" name="court" value={formData.court} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Judge</label><input type="text" name="judge" value={formData.judge} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Priority</label><select name="priority" value={formData.priority} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option></select></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Opposing Party</label><input type="text" name="opposingParty" value={formData.opposingParty} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Filing Date</label><input type="date" name="filingDate" value={formData.filingDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
      </div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" /></div>
      <div className="flex justify-end gap-3 pt-4">
        {onCancel && <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50">Cancel</button>}
        <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">{loading ? 'Saving...' : initialData._id ? 'Update Case' : 'Create Case'}</button>
      </div>
    </form>
  );
};

export default CaseForm;
