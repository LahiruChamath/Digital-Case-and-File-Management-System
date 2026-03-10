import React, { useState, useEffect } from 'react';
import { Search, Plus, ExternalLink, MoreVertical, ChevronLeft, ChevronRight, Briefcase } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import PriorityBadge from '../components/common/PriorityBadge';
import Avatar from '../components/common/Avatar';
import { caseService } from '../services/caseService';
import { clientService } from '../services/clientService';

const MatterManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [matters, setMatters] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMatterForm, setNewMatterForm] = useState({
    title: '', caseNumber: '', client: '', type: 'Litigation', court: '', priority: 'Medium'
  });
  const [filters, setFilters] = useState({
    status: '',
    type: ''
  });

  const fetchMatters = async () => {
    setLoading(true);
    try {
      const [mattersData, clientsData] = await Promise.all([
        caseService.getAll({ 
          search: searchTerm,
          status: filters.status,
          type: filters.type
        }),
        clientService.getAll()
      ]);
      setMatters(mattersData);
      setClients(clientsData);
      if (clientsData.length > 0 && !newMatterForm.client) {
        setNewMatterForm(prev => ({...prev, client: clientsData[0]._id}));
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const newMatter = await caseService.create(newMatterForm);
      setMatters([newMatter, ...matters]);
      setIsAddModalOpen(false);
      setNewMatterForm({ title: '', caseNumber: '', client: clients[0]?._id, type: 'Litigation', court: '', priority: 'Medium' });
      alert('Matter created successfully!');
    } catch (error) {
      alert('Failed to create matter. Ensure Case Number is unique.');
    }
  };

  useEffect(() => {
    fetchMatters();
  }, [searchTerm, filters]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-apple-text tracking-tight">Matter Management</h1>
          <p className="text-gray-500 mt-1.5 text-sm">Track and manage active litigation and notarial matters.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4" />
          New Matter
        </button>
      </div>

      {/* Filters and Search Container */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by case number or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="clean-input pl-11"
            />
          </div>
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <select 
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="clean-input w-full lg:w-auto"
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
              className="clean-input w-full lg:w-auto"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="card overflow-hidden flex flex-col min-h-[400px]">
        {loading ? (
          <div className="flex justify-center items-center flex-1 p-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="table-header py-4 px-6">Matter Info</th>
                  <th className="table-header py-4 px-6">Client</th>
                  <th className="table-header py-4 px-6">Practice Area</th>
                  <th className="table-header py-4 px-6">Status</th>
                  <th className="table-header py-4 px-6">Priority</th>
                  <th className="table-header py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {matters.map((matter) => (
                  <tr key={matter._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <p className="text-sm font-bold text-apple-text group-hover:text-primary-600 transition-colors">{matter.title}</p>
                      <p className="text-[11px] font-semibold text-gray-500 mt-1.5 uppercase tracking-wider">{matter.caseNumber}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <Avatar initials={matter.client?.name ? matter.client.name.split(' ').map(n => n[0]).join('') : '??'} size="sm" />
                        <span className="text-sm font-semibold text-gray-700">{matter.client?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs font-semibold text-gray-600">
                          {matter.type}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={matter.status} />
                    </td>
                    <td className="py-4 px-6">
                      <PriorityBadge priority={matter.priority} />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {matters.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-16 text-center text-sm font-medium text-gray-500">
                       No matters found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gray-50/50 mt-auto">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Showing {matters.length} matters</p>
          <div className="flex items-center gap-1.5">
            <button className="p-1 text-gray-400 hover:text-gray-800 transition-colors"><ChevronLeft className="w-5 h-5"/></button>
            <button className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 text-apple-text rounded-md text-sm font-bold shadow-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-md text-sm font-medium text-gray-500 transition-colors">2</button>
            <button className="p-1 text-gray-400 hover:text-gray-800 transition-colors"><ChevronRight className="w-5 h-5"/></button>
          </div>
        </div>
      </div>

      {/* Add Matter Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card p-8 w-full max-w-lg shadow-2xl">
            <h2 className="text-xl font-bold mb-6 text-apple-text tracking-tight">Open New Matter</h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Matter Title</label>
                  <input type="text" required className="clean-input" placeholder="Smith vs Jones"
                    value={newMatterForm.title} onChange={e => setNewMatterForm({...newMatterForm, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Case Number</label>
                  <input type="text" required className="clean-input" placeholder="LIT-24-001"
                    value={newMatterForm.caseNumber} onChange={e => setNewMatterForm({...newMatterForm, caseNumber: e.target.value})} />
                </div>
              </div>
              
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Client</label>
                <select required className="clean-input border-gray-200"
                  value={newMatterForm.client} onChange={e => setNewMatterForm({...newMatterForm, client: e.target.value})}>
                  <option value="" disabled>Select a client</option>
                  {clients.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Practice Area</label>
                  <select className="clean-input border-gray-200"
                    value={newMatterForm.type} onChange={e => setNewMatterForm({...newMatterForm, type: e.target.value})}>
                    <option value="Litigation">Litigation</option>
                    <option value="Notarial">Notarial</option>
                    <option value="Oath Commissioner">Oath Commissioner</option>
                    <option value="Company Secretarial">Company Secretarial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Priority</label>
                  <select className="clean-input border-gray-200"
                    value={newMatterForm.priority} onChange={e => setNewMatterForm({...newMatterForm, priority: e.target.value})}>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Court / Jurisdiction (Optional)</label>
                <input type="text" className="clean-input" placeholder="e.g., Supreme Court"
                  value={newMatterForm.court} onChange={e => setNewMatterForm({...newMatterForm, court: e.target.value})} />
              </div>

              <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-gray-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">Cancel</button>
                <button type="submit" className="btn-primary">Create Matter</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatterManagement;