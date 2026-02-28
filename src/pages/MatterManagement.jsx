import React, { useState } from 'react';
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
    practiceAreaColor: 'text-blue-600 bg-blue-50',
    status: 'Active',
    priority: 'High',
  },
  {
    id: 'NOT-2024-045',
    title: 'Property Deed Authentication',
    client: 'Robert Miller',
    clientInitials: 'RM',
    practiceArea: 'Notarial',
    practiceAreaColor: 'text-red-600 bg-red-50',
    status: 'Active',
    priority: 'Medium',
  },
  {
    id: 'SEC-2024-012',
    title: 'TechCorp Annual Filing',
    client: 'TechCorp Inc.',
    clientInitials: 'TI',
    practiceArea: 'Company Secretarial',
    practiceAreaColor: 'text-violet-600 bg-violet-50',
    status: 'Pending',
    priority: 'Medium',
  },
  {
    id: 'OATH-2024-089',
    title: 'Affidavit of Residency',
    client: 'Sarah Johnson',
    clientInitials: 'SJ',
    practiceArea: 'Oath Commissioner',
    practiceAreaColor: 'text-emerald-600 bg-emerald-50',
    status: 'Active',
    priority: 'Low',
  },
  {
    id: 'LIT-2023-091',
    title: 'Shareholder Dispute',
    client: 'BuildIt Co.',
    clientInitials: 'BC',
    practiceArea: 'Litigation',
    practiceAreaColor: 'text-blue-600 bg-blue-50',
    status: 'Closed',
    priority: 'Low',
  },
];

const MatterManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Matter Management</h1>
          <p className="text-slate-500 mt-1">Track and manage Litigation, Notarial, Oath, and Secretarial matters.</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          New Matter
        </button>
      </div>

      {/* Filters */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by matter #, title, or client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <select className="text-sm border border-slate-300 rounded-lg px-3 py-2 text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Practice Areas</option>
              <option>Litigation</option>
              <option>Notarial</option>
              <option>Oath Commissioner</option>
              <option>Company Secretarial</option>
            </select>
            <select className="text-sm border border-slate-300 rounded-lg px-3 py-2 text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Statuses</option>
              <option>Active</option>
              <option>Pending</option>
              <option>Closed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="table-header text-left py-3 px-4">Matter Info</th>
                <th className="table-header text-left py-3 px-4">Client</th>
                <th className="table-header text-left py-3 px-4">Practice Area</th>
                <th className="table-header text-left py-3 px-4">Status</th>
                <th className="table-header text-left py-3 px-4">Priority</th>
                <th className="table-header text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mattersData.map((matter) => (
                <tr key={matter.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4">
                    <p className="text-sm font-semibold text-slate-900">{matter.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{matter.id}</p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar initials={matter.clientInitials} size="sm" />
                      <span className="text-sm text-slate-700">{matter.client}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${matter.practiceAreaColor}`}>
                      {matter.practiceArea}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={matter.status} />
                  </td>
                  <td className="py-4 px-4">
                    <PriorityBadge priority={matter.priority} />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600">
                        <ExternalLink className="w-4 h-4" />
                      </button>
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

        {/* Pagination */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
          <p className="text-sm text-slate-500">Showing 5 of 124 matters</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors">
              Previous
            </button>
            <button className="w-8 h-8 bg-blue-600 text-white rounded-lg text-sm font-medium">1</button>
            <button className="w-8 h-8 hover:bg-slate-100 rounded-lg text-sm text-slate-600">2</button>
            <button className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatterManagement;