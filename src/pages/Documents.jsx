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
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-apple-text tracking-tight">Document Repository</h1>
          <p className="text-gray-500 mt-1.5 text-sm">Secure storage and retrieval for all firm documentation.</p>
        </div>
        <button className="btn-primary" onClick={handleUpload}>
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar / Folders */}
        <div className="col-span-1 lg:col-span-3 space-y-6">
          <div className="card p-6">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-4 ml-2">Collections</h2>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                    activeCategory === cat.name
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-apple-text'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FolderOpen className={`w-4 h-4 ${activeCategory === cat.name ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-600'}`} />
                    <span>{cat.name}</span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-md font-bold tracking-wider ${
                      activeCategory === cat.name
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Storage Usage Widget */}
          <div className="card p-6 border-t-4 border-t-primary-500 rounded-t-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-gray-50 rounded-lg">
                <HardDrive className="w-4 h-4 text-gray-500" />
              </div>
              <h2 className="text-sm font-bold text-apple-text">Storage Usage</h2>
            </div>
            
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-primary-500 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <p className="text-[11px] font-semibold text-gray-400 tracking-wider flex justify-between uppercase">
              <span className="text-gray-600 text-xs">6.5 GB</span>
              <span>10 GB Total</span>
            </p>
          </div>
        </div>

        {/* Documents Main Area */}
        <div className="col-span-1 lg:col-span-9 card flex flex-col min-h-[600px] overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-96 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search documents by name or phrase..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="clean-input pl-11"
                />
              </div>
              <button className="btn-outline w-full sm:w-auto">
                <Filter className="w-4 h-4" />
                Sort & Filter
              </button>
            </div>
          </div>

          {/* Table */}
          {loading ? (
             <div className="flex justify-center items-center flex-1 p-20">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
             </div>
          ) : (
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="table-header py-4 px-6">Name</th>
                    <th className="table-header py-4 px-6">Related Case</th>
                    <th className="table-header py-4 px-6">Format</th>
                    <th className="table-header py-4 px-6">Date Modified</th>
                    <th className="table-header py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {documents.map((doc) => (
                    <tr key={doc._id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-50 group-hover:bg-white border border-gray-100 rounded-lg shadow-sm transition-colors">
                            <FileText className="w-4 h-4 text-gray-500 group-hover:text-primary-500 transition-colors" />
                          </div>
                          <span className="text-sm font-semibold text-apple-text group-hover:text-primary-600 transition-colors">{doc.title}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-500">{doc.case?.title || 'Unknown Default'}</td>
                      <td className="py-4 px-6">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">{doc.format}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(doc.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end">
                          <button className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {documents.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-20 text-center text-sm font-medium text-gray-500">
                        No documents found in this collection.
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