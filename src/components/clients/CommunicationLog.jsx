import React, { useState } from 'react';

const CommunicationLog = ({ communications = [], onAdd, loading = false }) => {
  const [entry, setEntry] = useState({ type: 'phone', summary: '', date: '' });
  const handleSubmit = (e) => { e.preventDefault(); if (!entry.summary.trim()) return; onAdd({ ...entry, date: entry.date || new Date().toISOString() }); setEntry({ type: 'phone', summary: '', date: '' }); };
  const icons = { phone: '📞', email: '📧', meeting: '🤝', letter: '✉️', court: '⚖️', other: '💬' };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select value={entry.type} onChange={(e) => setEntry((p) => ({ ...p, type: e.target.value }))} className="px-3 py-2 border rounded-lg text-sm"><option value="phone">Phone Call</option><option value="email">Email</option><option value="meeting">Meeting</option><option value="letter">Letter</option><option value="court">Court</option><option value="other">Other</option></select>
          <input type="datetime-local" value={entry.date} onChange={(e) => setEntry((p) => ({ ...p, date: e.target.value }))} className="px-3 py-2 border rounded-lg text-sm" />
          <button type="submit" disabled={!entry.summary.trim() || loading} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">{loading ? 'Adding...' : 'Add Entry'}</button>
        </div>
        <textarea value={entry.summary} onChange={(e) => setEntry((p) => ({ ...p, summary: e.target.value }))} placeholder="Summary..." rows={2} className="w-full px-3 py-2 border rounded-lg text-sm" />
      </form>
      <div className="space-y-2">
        {!communications.length ? <p className="text-center text-gray-500 text-sm py-4">No communication records</p> :
          communications.map((c, i) => (<div key={c._id || i} className="flex items-start gap-3 p-3 border rounded-lg"><span className="text-lg mt-0.5">{icons[c.type] || '💬'}</span><div className="flex-1"><div className="flex justify-between"><span className="text-xs font-medium capitalize">{c.type}</span><span className="text-xs text-gray-400">{new Date(c.date).toLocaleString()}</span></div><p className="text-sm mt-1">{c.summary}</p></div></div>))}
      </div>
    </div>
  );
};

export default CommunicationLog;
