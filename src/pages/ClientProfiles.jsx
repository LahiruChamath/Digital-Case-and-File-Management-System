import React, { useState, useEffect } from 'react';
import { Plus, Mail, Phone, ExternalLink, MoreHorizontal, Search, Trash2 } from 'lucide-react';
import Avatar from '../components/common/Avatar';
import { clientService } from '../services/clientService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const ClientProfiles = () => {
  const { showToast } = useToast();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [commForm, setCommForm] = useState({ type: 'Email', summary: '' });
  const [newClientForm, setNewClientForm] = useState({ name: '', email: '', phone: '', address: '', type: 'Individual' });
  const [editClientForm, setEditClientForm] = useState({ name: '', email: '', phone: '', address: '', type: 'Individual' });
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const data = await clientService.getAll({ search: searchTerm });
        setClients(data);
      } catch (error) {
        console.error('Failed to fetch clients');
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, [searchTerm]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const newClient = await clientService.register(newClientForm);
      setClients([...clients, newClient]);
      setIsAddModalOpen(false);
      setNewClientForm({ name: '', email: '', phone: '', address: '', type: 'Individual' });
      showToast('Client successfully added!', 'success');
    } catch (error) {
      showToast('Failed to add client. Please check details.', 'error');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await clientService.update(selectedClient._id, editClientForm);
      setClients(clients.map(c => c._id === updated._id ? updated : c));
      setIsEditModalOpen(false);
      showToast('Client profile updated!', 'success');
    } catch (error) {
      showToast('Failed to update client', 'error');
    }
  };

  const handleLogCommunication = async (e) => {
    e.preventDefault();
    if (!selectedClient) return;
    try {
      await clientService.addCommunication(selectedClient._id, commForm);
      setClients(clients.map(c => 
        c._id === selectedClient._id 
          ? { ...c, communicationHistory: [...(c.communicationHistory || []), commForm] }
          : c
      ));
      setIsLogModalOpen(false);
      setCommForm({ type: 'Email', summary: '' });
      showToast('Communication logged successfully', 'success');
    } catch (error) {
      showToast('Failed to log communication', 'error');
    }
  };

  const handleDeleteClient = async (clientId) => {
    if (!window.confirm('Are you sure you want to permanently delete this client? This cannot be undone and will fail if the client has active cases.')) return;
    try {
      await clientService.delete(clientId);
      setClients(clients.filter(c => c._id !== clientId));
      showToast('Client deleted successfully', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to delete client', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-apple-text tracking-tight">Client Profiles</h1>
          <p className="text-gray-500 mt-1.5 text-sm">Manage your directory of individuals and corporate entities.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Client
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by name, email or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="clean-input pl-11"
            />
          </div>
        </div>
      </div>

      {/* Client Cards Grid */}
      {loading ? (
        <div className="flex justify-center p-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <div key={client._id} className="card p-6 flex flex-col group hover:-translate-y-1 transition-transform duration-300">
              {/* Card Header */}
              <div className="flex items-start justify-between mb-5">
                <Avatar initials={client.name?.split(' ').map(n => n[0]).join('') || '??'} size="lg" />
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => {
                      setSelectedClient(client);
                      setEditClientForm({
                        name: client.name,
                        email: client.email,
                        phone: client.phone || '',
                        address: client.address || '',
                        type: client.type
                      });
                      setIsEditModalOpen(true);
                    }}
                    className="p-2 hover:bg-primary-50 rounded-lg transition-colors text-gray-400 hover:text-primary-600"
                    title="Edit Profile"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                  {currentUser?.role === 'Senior Lawyer' && (
                    <button 
                      onClick={() => handleDeleteClient(client._id)}
                      className="p-2 hover:bg-status-overdue/10 rounded-lg transition-colors text-gray-400 hover:text-status-overdue"
                      title="Delete Client"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Client Info */}
              <h3 className="text-lg font-bold text-apple-text group-hover:text-primary-600 transition-colors">{client.name}</h3>
              <p className="text-[11px] font-semibold text-gray-500 mt-1 uppercase tracking-wider">{client.type}</p>

              <div className="mt-6 flex-1 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600 p-2.5 bg-gray-50 rounded-xl">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="truncate font-medium">{client.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 p-2.5 bg-gray-50 rounded-xl">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{client.phone || 'No phone'}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Logs</p>
                  <p className="text-xl font-bold text-apple-text">{client.communicationHistory?.length || 0}</p>
                </div>
                <div className="flex gap-2.5">
                  <button 
                    onClick={() => { setSelectedClient(client); setIsLogModalOpen(true); }}
                    className="text-[11px] font-bold uppercase tracking-wider bg-primary-50 text-primary-600 hover:bg-primary-500 hover:text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Log
                  </button>
                  <button className="flex items-center justify-center p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Log Communication Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card p-6 sm:p-8 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-6 text-apple-text tracking-tight border-b border-gray-100 pb-4">
              Log Communication<br/>
              <span className="text-primary-600 text-sm font-bold mt-1 inline-block">{selectedClient?.name}</span>
            </h2>
            <form onSubmit={handleLogCommunication} className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Type</label>
                <select 
                  className="clean-input"
                  value={commForm.type}
                  onChange={e => setCommForm({...commForm, type: e.target.value})}
                >
                  <option>Email</option>
                  <option>Phone call</option>
                  <option>Meeting</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Summary</label>
                <textarea 
                  className="clean-input h-32 resize-none"
                  placeholder="What was discussed?"
                  required
                  value={commForm.summary}
                  onChange={e => setCommForm({...commForm, summary: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-gray-100">
                <button type="button" onClick={() => setIsLogModalOpen(false)} className="px-5 py-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">Cancel</button>
                <button type="submit" className="btn-primary">Save Log</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card p-6 sm:p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-6 text-apple-text tracking-tight border-b border-gray-100 pb-4">Add New Client</h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Name / Entity Name</label>
                <input 
                  type="text" required className="clean-input" placeholder="John Doe or Acme Corp"
                  value={newClientForm.name} onChange={e => setNewClientForm({...newClientForm, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Email</label>
                <input 
                  type="email" required className="clean-input" placeholder="john@example.com"
                  value={newClientForm.email} onChange={e => setNewClientForm({...newClientForm, email: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Phone</label>
                  <input 
                    type="text" className="clean-input" placeholder="+1..."
                    value={newClientForm.phone} onChange={e => setNewClientForm({...newClientForm, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Type</label>
                  <select 
                    className="clean-input"
                    value={newClientForm.type} onChange={e => setNewClientForm({...newClientForm, type: e.target.value})}
                  >
                    <option value="Individual">Individual</option>
                    <option value="Corporate">Corporate</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-gray-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">Cancel</button>
                <button type="submit" className="btn-primary">Create Client</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Client Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card p-6 sm:p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-6 text-apple-text tracking-tight border-b border-gray-100 pb-4">Update Client Profile</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Name / Entity Name</label>
                <input 
                  type="text" required className="clean-input"
                  value={editClientForm.name} onChange={e => setEditClientForm({...editClientForm, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Email</label>
                <input 
                  type="email" required className="clean-input"
                  value={editClientForm.email} onChange={e => setEditClientForm({...editClientForm, email: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Phone</label>
                  <input 
                    type="text" className="clean-input" 
                    value={editClientForm.phone} onChange={e => setEditClientForm({...editClientForm, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Type</label>
                  <select 
                    className="clean-input"
                    value={editClientForm.type} onChange={e => setEditClientForm({...editClientForm, type: e.target.value})}
                  >
                    <option value="Individual">Individual</option>
                    <option value="Corporate">Corporate</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Address</label>
                <textarea 
                  className="clean-input h-20 resize-none"
                  value={editClientForm.address} onChange={e => setEditClientForm({...editClientForm, address: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-gray-100">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">Cancel</button>
                <button type="submit" className="btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientProfiles;