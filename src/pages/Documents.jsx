import React, { useState, useEffect } from 'react';
import { Search, Upload, Filter, FileText, Calendar, MoreVertical, FolderOpen, HardDrive } from 'lucide-react';
import { documentService } from '../services/documentService';

const categories = [
  { name: 'All Documents', count: 156, active: true },
  { name: 'Court Filings', count: 42, active: false },
  { name: 'Evidence', count: 89, active: false },
  { name: 'Contracts', count: 15, active: false },
  { name: 'Internal Notes', count: 10, active: false },
];

const Documents = () => {
  const [activeCategory, setActiveCategory] = useState('All Documents');
  const [searchTerm, setSearchTerm] = useState('');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDocuments = async (query = '') => {
    setLoading(true);
    try {
      const data = await documentService.search(query);
      setDocuments(data);
    } catch (error) {
      console.error('Failed to fetch documents', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments(searchTerm);
  }, [searchTerm]);

  const handleUpload = () => {
    console.log('Upload triggered');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Document Management</h1>
          <p className="text-slate-400 mt-1">Secure storage for legal filings, evidence, and contracts.</p>
        </div>
        <button className="btn-primary" onClick={handleUpload}>
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Categories Sidebar */}
        <div className="col-span-12 md:col-span-3 space-y-6">
          <div className="card p-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 px-2">Folders</h2>
            <div className="space-y-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all group border ${
                    activeCategory === cat.name
                      ? 'bg-blue-600/20 text-blue-400 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                      : 'text-slate-300 border-transparent hover:bg-slate-800/50 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FolderOpen className={`w-4 h-4 ${activeCategory === cat.name ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-400'}`} />
                    <span className="font-semibold tracking-wide">{cat.name}</span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded shadow-sm font-bold tracking-widest ${
                      activeCategory === cat.name
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Storage Usage */}
          <div className="card p-5 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl group-hover:bg-blue-600/20 transition-all"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-slate-800/50 rounded-lg border border-slate-700">
                <HardDrive className="w-4 h-4 text-blue-400" />
              </div>
              <h2 className="text-sm font-bold text-white tracking-wide">Storage Usage</h2>
            </div>
            
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3 border border-slate-700/50">
              <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)] relative" style={{ width: '65%' }}>
                <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/20"></div>
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-400 tracking-wide flex justify-between">
              <span>6.5 GB used</span>
              <span className="text-slate-500">10 GB total</span>
            </p>
          </div>
        </div>

        {/* Documents Table */}
        <div className="col-span-12 md:col-span-9 card p-5 pb-0 overflow-hidden flex flex-col min-h-[500px]">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
            <div className="relative w-full sm:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="futuristic-input pl-11"
              />
            </div>
            <button className="btn-outline w-full sm:w-auto">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Table */}
          {loading ? (
             <div className="flex justify-center items-center flex-1 p-10">
               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
             </div>
          ) : (
            <div className="overflow-x-auto flex-1 -mx-5">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50 bg-slate-900/40">
                    <th className="table-header text-left py-4 px-5">Name</th>
                    <th className="table-header text-left py-4 px-5">Related Case</th>
                    <th className="table-header text-left py-4 px-5">Format</th>
                    <th className="table-header text-left py-4 px-5">Date Modified</th>
                    <th className="table-header text-right py-4 px-5">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc._id} className="border-b border-slate-800/40 hover:bg-white/5 transition-colors group">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 group-hover:border-blue-500/40 transition-colors">
                            <FileText className="w-4 h-4 text-blue-400" />
                          </div>
                          <span className="text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors tracking-wide">{doc.title}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-sm font-medium text-slate-400">{doc.case?.title || 'Unknown'}</td>
                      <td className="py-4 px-5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-800 px-2 py-1 rounded shadow-sm border border-slate-700/50">{doc.format}</span>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          {new Date(doc.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center justify-end">
                          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-500 hover:text-white border border-transparent hover:border-white/10">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {documents.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-12 text-center text-sm font-medium text-slate-500">
                        No documents found matching criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Documents;