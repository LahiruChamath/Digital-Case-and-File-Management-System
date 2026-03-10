import React, { useState, useEffect } from 'react';
import { Search, Plus, ExternalLink, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import PriorityBadge from '../components/common/PriorityBadge';
import Avatar from '../components/common/Avatar';

const mattersData = [
  {
    id: 'LIT-2024-001',
    title: 'Smith vs. Global Dynamics',
    client: 'Alice Smith',
    clientInitials: 'AS',
    practiceArea: 'Litigation',
    practiceAreaColor: 'text-blue-400 bg-blue-500/10 border border-blue-500/20',
    status: 'Active',
    priority: 'High',
  },
  {
    id: 'NOT-2024-045',
    title: 'Property Deed Authentication',
    client: 'Robert Miller',
    clientInitials: 'RM',
    practiceArea: 'Notarial',
    practiceAreaColor: 'text-red-400 bg-red-500/10 border border-red-500/20',
    status: 'Active',
    priority: 'Medium',
  },
  {
    id: 'SEC-2024-012',
    title: 'TechCorp Annual Filing',
    client: 'TechCorp Inc.',
    clientInitials: 'TI',
    practiceArea: 'Company Secretarial',
    practiceAreaColor: 'text-violet-400 bg-violet-500/10 border border-violet-500/20',
    status: 'Pending',
    priority: 'Medium',
  },
  {
    id: 'OATH-2024-089',
    title: 'Affidavit of Residency',
    client: 'Sarah Johnson',
    clientInitials: 'SJ',
    practiceArea: 'Oath Commissioner',
    practiceAreaColor: 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20',
    status: 'Active',
    priority: 'Low',
  },
  {
    id: 'LIT-2023-091',
    title: 'Shareholder Dispute',
    client: 'BuildIt Co.',
    clientInitials: 'BC',
    practiceArea: 'Litigation',
    practiceAreaColor: 'text-blue-400 bg-blue-500/10 border border-blue-500/20',
    status: 'Closed',
    priority: 'Low',
  },
];

import { caseService } from '../services/caseService';

const MatterManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [matters, setMatters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    type: ''
  });

  const fetchMatters = async () => {
    setLoading(true);
    try {
      const data = await caseService.getAll({ 
        search: searchTerm,
        status: filters.status,
        type: filters.type
      });
      setMatters(data);
    } catch (error) {
      console.error('Failed to fetch matters', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatters();
  }, [searchTerm, filters]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Matter Management</h1>
          <p className="text-slate-400 mt-1">Track and manage Litigation, Notarial, Oath, and Secretarial matters.</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          New Matter
        </button>
      </div>

      {/* Filters */}
      <div className="card p-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-5">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
            <input
              type="text"
              placeholder="Search by matter #, title, or client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="futuristic-input pl-11"
            />
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <select 
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="futuristic-input w-full md:w-auto"
            >
              <option value="">All Practice Areas</option>
              <option value="Litigation">Litigation</option>
              <option value="Notarial">Notarial</option>
              <option value="Oath Commissioner">Oath Commissioner</option>
              <option value="Company Secretarial">Company Secretarial</option>
            </select>
            <select 
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="futuristic-input w-full md:w-auto"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex justify-center p-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
            </div>
          ) : (
            <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="table-header text-left py-4 px-5">Matter Info</th>
                <th className="table-header text-left py-4 px-5">Client</th>
                <th className="table-header text-left py-4 px-5">Practice Area</th>
                <th className="table-header text-left py-4 px-5">Status</th>
                <th className="table-header text-left py-4 px-5">Priority</th>
                <th className="table-header text-right py-4 px-5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {matters.map((matter) => (
                <tr key={matter._id} className="border-b border-slate-800/40 hover:bg-white/5 transition-colors group">
                  <td className="py-4 px-5">
                    <p className="text-sm font-bold text-slate-100 group-hover:text-blue-400 transition-colors">{matter.title}</p>
                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">{matter.caseNumber}</p>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-800 text-blue-400 border border-blue-500/20 rounded-lg flex items-center justify-center text-xs font-black tracking-wider shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                        {matter.client?.name ? matter.client.name.split(' ').map(n => n[0]).join('') : '??'}
                      </div>
                      <span className="text-sm font-medium text-slate-300">{matter.client?.name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[11px] uppercase tracking-widest font-bold ${
                      matter.type === 'Litigation' ? 'text-blue-400 bg-blue-500/10 border border-blue-500/20' :
                      matter.type === 'Notarial' ? 'text-red-400 bg-red-500/10 border border-red-500/20' :
                      matter.type === 'Company Secretarial' ? 'text-violet-400 bg-violet-500/10 border border-violet-500/20' :
                      'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                    }`}>
                      {matter.type}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <StatusBadge status={matter.status} />
                  </td>
                  <td className="py-4 px-5">
                    <PriorityBadge priority={matter.priority} />
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-500 hover:text-white border border-transparent hover:border-white/10">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-500 hover:text-white border border-transparent hover:border-white/10">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-5 pt-5 border-t border-slate-700/50">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Showing {matters.length} matters</p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
              Prev
            </button>
            <button className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-bold shadow-[0_0_10px_rgba(79,70,229,0.4)] border border-indigo-400/20">1</button>
            <button className="w-8 h-8 hover:bg-white/5 rounded-lg text-sm font-bold text-slate-400 transition-colors">2</button>
            <button className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatterManagement;