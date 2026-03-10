import React from 'react';

const CaseTimeline = ({ activities = [] }) => {
  const getIcon = (type) => { const icons = { created: '🆕', updated: '✏️', document_added: '📄', court_date: '⚖️', note_added: '📝', status_changed: '🔄', payment: '💰', closed: '✅' }; return icons[type] || '📌'; };
  const getColor = (type) => { const colors = { created: 'bg-green-500', court_date: 'bg-red-500', closed: 'bg-gray-500', status_changed: 'bg-yellow-500' }; return colors[type] || 'bg-blue-500'; };
  if (activities.length === 0) return <div className="text-center py-8 text-gray-500 text-sm">No activity recorded yet.</div>;

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
      <div className="space-y-6">
        {activities.map((a, i) => (
          <div key={a._id || i} className="relative flex items-start gap-4 pl-10">
            <div className={`absolute left-2.5 w-3 h-3 rounded-full ${getColor(a.type)} ring-4 ring-white`}></div>
            <div className="flex-1 bg-white border rounded-lg p-3 shadow-sm">
              <div className="flex items-center justify-between mb-1"><div className="flex items-center gap-2"><span>{getIcon(a.type)}</span><span className="text-sm font-medium">{a.title || a.action}</span></div>
                <span className="text-xs text-gray-500">{new Date(a.timestamp || a.createdAt).toLocaleString()}</span></div>
              {a.description && <p className="text-sm text-gray-600">{a.description}</p>}
              {a.user && <p className="text-xs text-gray-400 mt-1">By: {a.user.name || a.user}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CaseTimeline;
