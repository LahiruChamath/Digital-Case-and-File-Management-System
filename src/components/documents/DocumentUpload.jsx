import React, { useState, useRef } from 'react';

const DocumentUpload = ({ onUpload, caseId, loading = false }) => {
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const formatSize = (bytes) => { if (!bytes) return '0 B'; const k = 1024; const s = ['B', 'KB', 'MB']; const i = Math.floor(Math.log(bytes) / Math.log(k)); return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + s[i]; };
  const handleDrag = (e) => { e.preventDefault(); e.stopPropagation(); setDragActive(e.type === 'dragenter' || e.type === 'dragover'); };
  const handleDrop = (e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); setFiles((p) => [...p, ...Array.from(e.dataTransfer.files)]); };
  const handleSubmit = (e) => { e.preventDefault(); if (!files.length) return; const fd = new FormData(); files.forEach((f) => fd.append('documents', f)); if (description) fd.append('description', description); if (tags) fd.append('tags', tags); if (caseId) fd.append('case', caseId); onUpload(fd); setFiles([]); setDescription(''); setTags(''); };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
        onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}>
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
        <p className="mt-2 text-sm text-gray-600"><span className="font-semibold text-blue-600">Click to upload</span> or drag and drop</p>
        <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, XLS, JPG, PNG up to 10MB</p>
        <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt" onChange={(e) => setFiles((p) => [...p, ...Array.from(e.target.files)])} className="hidden" />
      </div>
      {files.length > 0 && <div className="space-y-2">{files.map((f, i) => (<div key={i} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"><div className="flex items-center gap-2"><span>📄</span><span className="text-sm truncate">{f.name}</span><span className="text-xs text-gray-500">({formatSize(f.size)})</span></div><button type="button" onClick={() => setFiles((p) => p.filter((_, j) => j !== i))} className="text-red-500 text-sm">✕</button></div>))}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label><input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
      </div>
      <div className="flex justify-end"><button type="submit" disabled={!files.length || loading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">{loading ? 'Uploading...' : `Upload ${files.length} File${files.length !== 1 ? 's' : ''}`}</button></div>
    </form>
  );
};

export default DocumentUpload;
