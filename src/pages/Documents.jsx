import React, { useState } from 'react';
import { Search, Upload, Filter, FileText, Calendar, MoreVertical, FolderOpen, HardDrive } from 'lucide-react';

const categories = [
  { name: 'All Documents', count: 156, active: true, icon: FolderOpen },
  { name: 'Court Filings', count: 42, active: false, icon: FolderOpen },
  { name: 'Evidence', count: 89, active: false, icon: FolderOpen },
  { name: 'Contracts', count: 15, active: false, icon: FolderOpen },
  { name: 'Internal Notes', count: 10, active: false, icon: FolderOpen },
];

const documentsData = [
  {
    name: 'Initial_Complaint.pdf',
    relatedCase: 'Smith vs. Global',
    size: '2.4 MB',
    dateModified: 'Feb 10, 2024',
  },
  {
    name: 'Evidence_Photos.ZIP.zip',
    relatedCase: 'Miller Criminal',
    size: '45 MB',
    dateModified: 'Feb 12, 2024',
  },
  {
    name: 'Settlement_Agreement_V2.docx',
    relatedCase: 'Johnson Family',
    size: '850 KB',
    dateModified: 'Feb 08, 2024',
  },
  {
    name: 'Court_Order_Feb.pdf',
    relatedCase: 'Smith vs. Global',
    size: '1.2 MB',
    dateModified: 'Feb 14, 2024',
  },
  {
    name: 'Discovery_Response.pdf',
    relatedCase: 'TechCorp IP',
    size: '3.6 MB',
    dateModified: 'Feb 05, 2024',
  },
];

const Documents = () => {
  const [activeCategory, setActiveCategory] = useState('All Documents');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Document Management</h1>
          <p className="text-slate-500 mt-1">Secure storage for legal filings, evidence, and contracts.</p>
        </div>
        <button className="btn-primary">
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Categories Sidebar */}
        <div className="col-span-3 space-y-5">
          <div className="card p-5">
            <h2 className="text-base font-semibold text-slate-900 mb-3">Categories</h2>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeCategory === cat.name
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4" />
                    <span className="font-medium">{cat.name}</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      activeCategory === cat.name
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Storage Usage */}
          <div className="card p-5">
            <h2 className="text-base font-semibold text-slate-900 mb-3">Storage Usage</h2>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <p className="text-xs text-slate-500">6.5 GB of 10 GB used (65%)</p>
          </div>
        </div>

        {/* Documents Table */}
        <div className="col-span-9 card p-5">
          {/* Search and Filters */}
          <div className="flex items-center justify-between mb-5">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <button className="btn-outline">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Table */}
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="table-header text-left py-3 px-4">Name</th>
                <th className="table-header text-left py-3 px-4">Related Case</th>
                <th className="table-header text-left py-3 px-4">Size</th>
                <th className="table-header text-left py-3 px-4">Date Modified</th>
                <th className="table-header text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documentsData.map((doc) => (
                <tr key={doc.name} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <span className="text-sm font-medium text-slate-900">{doc.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-sm text-slate-600">{doc.relatedCase}</td>
                  <td className="py-3.5 px-4 text-sm text-slate-600">{doc.size}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {doc.dateModified}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center justify-end">
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600">
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
    </div>
  );
};

export default Documents;