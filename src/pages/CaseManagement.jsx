import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Edit2, CheckCircle2, MoreVertical, Briefcase, Calendar, MapPin, AlertCircle, TrendingUp, Filter, Sparkles, X } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import PriorityBadge from '../components/common/PriorityBadge';
import Avatar from '../components/common/Avatar';
import { caseService } from '../services/caseService';
import { clientService } from '../services/clientService';
import { useToast } from '../context/ToastContext';

// Defined at module level to prevent React from treating it as a new
// component type on every parent re-render (which causes full unmount/remount).
const CaseTable = ({ data, title, onEdit, onClose }) => (
  <div className="card overflow-hidden flex flex-col mb-8">
    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
      <h3 className="text-sm font-bold text-apple-text uppercase tracking-widest">{title}</h3>
      <span className="text-[10px] font-bold bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-500">{data.length} Cases</span>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="table-header py-4 px-6">Case Info</th>
            <th className="table-header py-4 px-6">Client</th>
            <th className="table-header py-4 px-6">Practice Area</th>
            <th className="table-header py-4 px-6">Status</th>
            <th className="table-header py-4 px-6">Priority</th>
            <th className="table-header py-4 px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item) => (
            <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
              <td className="py-4 px-6">
                <p className="text-sm font-bold text-apple-text group-hover:text-primary-600 transition-colors">{item.title}</p>
                <p className="text-[11px] font-semibold text-gray-500 mt-1.5 uppercase tracking-wider">{item.caseNumber}</p>
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                  <Avatar initials={item.client?.name ? item.client.name.split(' ').map(n => n[0]).join('') : '??'} size="sm" />
                  <span className="text-sm font-semibold text-gray-700">{item.client?.name || 'Unknown'}</span>
                </div>
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs font-semibold text-gray-600">{item.type}</span>
                </div>
              </td>
              <td className="py-4 px-6"><StatusBadge status={item.status} /></td>
              <td className="py-4 px-6"><PriorityBadge priority={item.priority} /></td>
              <td className="py-4 px-6">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Update Case"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {item.status !== 'Closed' && (
                    <button
                      onClick={() => onClose(item._id)}
                      className="p-2 text-gray-400 hover:text-status-active hover:bg-status-active/10 rounded-lg transition-colors"
                      title="Mark as Closed"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                  <button className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan="6" className="py-16 text-center text-sm font-medium text-gray-500">
                No {title.toLowerCase()} found matching your criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const CaseManagement = () => {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [cases, setCases] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [currentCase, setCurrentCase] = useState(null);
  const [newCaseForm, setNewCaseForm] = useState({
    title: '', caseNumber: '', client: '', type: 'Litigation', court: '', priority: 'Medium'
  });
  const [filters, setFilters] = useState({
    status: '',
    type: ''
  });

  const fetchCases = useCallback(async () => {
    setLoading(true);
    try {
      const [casesData, clientsData] = await Promise.all([
        caseService.getAll({ 
          search: searchTerm,
          status: filters.status,
          type: filters.type
        }),
        clientService.getAll()
      ]);
      setCases(casesData);
      setClients(clientsData);
      if (clientsData.length > 0 && !newCaseForm.client) {
        setNewCaseForm(prev => ({...prev, client: clientsData[0]._id}));
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
      showToast('Failed to load cases', 'error');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filters]);

  const handleEditOpen = useCallback((item) => {
    setCurrentCase(item);
    setIsEditModalOpen(true);
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const createdCase = await caseService.create(newCaseForm);
      setCases([createdCase, ...cases]);
      setIsAddModalOpen(false);
      setNewCaseForm({ title: '', caseNumber: '', client: clients[0]?._id, type: 'Litigation', court: '', priority: 'Medium' });
      showToast('Case created successfully!', 'success');
    } catch (error) {
      showToast('Failed to create case. Ensure Case Number is unique.', 'error');
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await caseService.update(currentCase._id, currentCase);
      setCases(cases.map(c => c._id === updated._id ? updated : c));
      setIsEditModalOpen(false);
      showToast('Case updated successfully!', 'success');
    } catch (error) {
      showToast('Failed to update case', 'error');
    }
  };

  const handleCloseCase = async (id) => {
    if (!window.confirm('Are you sure you want to mark this case as Closed?')) return;
    try {
      const closed = await caseService.close(id);
      setCases(cases.map(c => c._id === id ? closed : c));
      setIsSuccessModalOpen(true);
    } catch (error) {
      showToast('Failed to close case', 'error');
    }
  };

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const activeCases = cases.filter(c => c.status !== 'Closed');
  const closedCasesList = cases.filter(c => c.status === 'Closed');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-apple-text tracking-tight">Case Management</h1>
          <p className="text-gray-500 mt-1.5 text-sm">Track and manage active litigation and notarial cases.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4" />
          New Case
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
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl">
               <Filter className="w-3.5 h-3.5 text-gray-400" />
               <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Filter By</span>
            </div>
            <select 
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="clean-input w-full lg:w-auto bg-white border-gray-100"
            >
              <option value="">All Practice Areas</option>
              <option value="Litigation">Litigation</option>
              <option value="Notarial">Notarial</option>
              <option value="Oath Commissioner">Oath Commissioner</option>
              <option value="Company Secretarial">Company Secretarial</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          <CaseTable data={activeCases} title="Active Cases" onEdit={handleEditOpen} onClose={handleCloseCase} />
          <CaseTable data={closedCasesList} title="Closed Cases" onEdit={handleEditOpen} onClose={handleCloseCase} />
        </>
      )}

      {/* Add Case Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card p-8 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-6 text-apple-text tracking-tight border-b border-gray-100 pb-4">Open New Case</h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Case Title</label>
                  <input type="text" required className="clean-input" placeholder="Smith vs Jones"
                    value={newCaseForm.title} onChange={e => setNewCaseForm({...newCaseForm, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Case Number</label>
                  <input type="text" disabled className="clean-input bg-gray-50 cursor-not-allowed font-mono text-gray-400" placeholder="CASE-00001 (Auto)"
                    value={newCaseForm.caseNumber} />
                </div>
              </div>
              
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Client</label>
                <select required className="clean-input border-gray-200"
                  value={newCaseForm.client} onChange={e => setNewCaseForm({...newCaseForm, client: e.target.value})}>
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
                    value={newCaseForm.type} onChange={e => setNewCaseForm({...newCaseForm, type: e.target.value})}>
                    <option value="Litigation">Litigation</option>
                    <option value="Notarial">Notarial</option>
                    <option value="Oath Commissioner">Oath Commissioner</option>
                    <option value="Company Secretarial">Company Secretarial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Priority</label>
                  <select className="clean-input border-gray-200"
                    value={newCaseForm.priority} onChange={e => setNewCaseForm({...newCaseForm, priority: e.target.value})}>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Court / Jurisdiction (Optional)</label>
                <input type="text" className="clean-input" placeholder="e.g., Supreme Court"
                  value={newCaseForm.court} onChange={e => setNewCaseForm({...newCaseForm, court: e.target.value})} />
              </div>

              <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-gray-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">Cancel</button>
                <button type="submit" className="btn-primary">Create Case</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Case Modal */}
      {isEditModalOpen && currentCase && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card p-8 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-6 text-apple-text tracking-tight border-b border-gray-100 pb-4">Update Case Details</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Case Title</label>
                  <input type="text" required className="clean-input"
                    value={currentCase.title} onChange={e => setCurrentCase({...currentCase, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Case Number</label>
                  <input type="text" required className="clean-input" disabled
                    value={currentCase.caseNumber} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Practice Area</label>
                  <select className="clean-input border-gray-200"
                    value={currentCase.type} onChange={e => setCurrentCase({...currentCase, type: e.target.value})}>
                    <option value="Litigation">Litigation</option>
                    <option value="Notarial">Notarial</option>
                    <option value="Oath Commissioner">Oath Commissioner</option>
                    <option value="Company Secretarial">Company Secretarial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Priority</label>
                  <select className="clean-input border-gray-200"
                    value={currentCase.priority} onChange={e => setCurrentCase({...currentCase, priority: e.target.value})}>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Court / Jurisdiction</label>
                <input type="text" className="clean-input"
                  value={currentCase.court} onChange={e => setCurrentCase({...currentCase, court: e.target.value})} />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Current Status</label>
                <select className="clean-input border-gray-200"
                  value={currentCase.status} onChange={e => setCurrentCase({...currentCase, status: e.target.value})}>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Closed">Closed</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-gray-100">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">Cancel</button>
                <button type="submit" className="btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Case Closed Success Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-primary-900/20 backdrop-blur-md flex items-center justify-center z-[60] p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-apple-soft text-center relative overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
            {/* Animated Background Elements */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-status-active via-primary-500 to-status-active animate-pulse"></div>
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-status-active/5 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-primary-500/5 rounded-full blur-2xl"></div>

            <div className="relative mb-6 mx-auto w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 bg-status-active/10 rounded-full animate-ping duration-[3000ms]"></div>
              <div className="absolute inset-0 bg-status-active/5 rounded-full animate-pulse"></div>
              <div className="relative z-10 w-20 h-20 bg-status-active rounded-full flex items-center justify-center shadow-lg shadow-status-active/30">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1">
                <div className="p-1.5 bg-primary-500 rounded-full shadow-lg animate-bounce duration-[2000ms]">
                   <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-black text-apple-text mb-2 tracking-tight">Case Filed Successfully</h2>
            <p className="text-gray-500 text-sm font-medium mb-8 leading-relaxed">
              Justice served. This case has been officially archived and settled in our records.
            </p>

            <div className="p-4 bg-gray-50 rounded-2xl mb-8 border border-gray-100/50">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status Updated To</p>
              <p className="text-sm font-bold text-status-active flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-status-active animate-pulse"></div>
                PERMANENTLY CLOSED
              </p>
            </div>

            <button 
              onClick={() => setIsSuccessModalOpen(false)}
              className="w-full py-4 bg-apple-text text-white rounded-2xl font-bold text-sm hover:bg-gray-800 active:scale-[0.98] transition-all shadow-xl shadow-gray-200"
            >
              Continue to Dashboard
            </button>

            <button 
              onClick={() => setIsSuccessModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseManagement;