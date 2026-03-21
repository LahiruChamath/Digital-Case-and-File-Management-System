import React, { useState, useEffect } from 'react';
import caseService from '../../services/caseService';

const EventForm = ({ initialData = {}, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({ title: '', type: 'court_date', case: '', date: '', time: '', court: '', description: '', reminderDays: [7, 3, 1], ...initialData });
  const [cases, setCases] = useState([]);
  useEffect(() => { caseService.getCases().then((data) => setCases(data.cases || data || [])).catch(console.error); }, []);
  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label><input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label><select name="type" value={formData.type} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm"><option value="court_date">Court Date</option><option value="filing_deadline">Filing Deadline</option><option value="client_meeting">Client Meeting</option><option value="hearing">Hearing</option><option value="mediation">Mediation</option><option value="other">Other</option></select></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Case</label><select name="case" value={formData.case} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm"><option value="">Select Case</option>{cases.map((c) => (<option key={c._id} value={c._id}>{c.caseNumber} - {c.title}</option>))}</select></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Date *</label><input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Time</label><input type="time" name="time" value={formData.time} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Court / Location</label><input type="text" name="court" value={formData.court} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Reminder Days</label><input type="text" value={formData.reminderDays.join(', ')} onChange={(e) => setFormData((p) => ({ ...p, reminderDays: e.target.value.split(',').map((v) => parseInt(v.trim())).filter((v) => !isNaN(v)) }))} className="w-full px-3 py-2 border rounded-lg text-sm" /><p className="text-xs text-gray-500 mt-1">Days before event for reminders</p></div>
      </div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
      <div className="flex justify-end gap-3 pt-4">
        {onCancel && <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-50">Cancel</button>}
        <button type="submit" disabled={loading} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">{loading ? 'Saving...' : initialData._id ? 'Update Event' : 'Schedule Event'}</button>
      </div>
    </form>
  );
};

export default EventForm;
