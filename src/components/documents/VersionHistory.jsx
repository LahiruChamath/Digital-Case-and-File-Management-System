import React from 'react';

const VersionHistory = ({ versions = [], onDownload, onRestore }) => {
  if (!versions.length) return <p className="text-center text-gray-500 text-sm py-4">No version history available</p>;
  return (
    <div className="space-y-2">
      {versions.map((v, i) => (
        <div key={v._id || i} className={`flex items-center justify-between p-3 rounded-lg border ${i === 0 ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>v{versions.length - i}</div>
            <div><p className="text-sm font-medium">{i === 0 ? 'Current Version' : `Version ${versions.length - i}`}</p><p className="text-xs text-gray-500">{new Date(v.uploadedAt || v.createdAt).toLocaleString()}{v.uploadedBy && ` • ${v.uploadedBy.name || v.uploadedBy}`}</p></div>
          </div>
          <div className="flex items-center gap-2">
            {onDownload && <button onClick={() => onDownload(v)} className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-100 rounded">Download</button>}
            {onRestore && i !== 0 && <button onClick={() => onRestore(v)} className="px-2 py-1 text-xs text-orange-600 hover:bg-orange-100 rounded">Restore</button>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VersionHistory;
