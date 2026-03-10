import React, { useState, useEffect } from 'react';
import { Plus, Mail, Phone, ExternalLink, MoreHorizontal } from 'lucide-react';
import Avatar from '../components/common/Avatar';
import { clientService } from '../services/clientService';

const ClientProfiles = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [commForm, setCommForm] = useState({ type: 'Email', summary: '' });

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const data = await clientService.getAll();
        setClients(data);
      } catch (error) {
        console.error('Failed to fetch clients');
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const handleAddClient = () => {
    console.log('Add client clicked');
  };

  const handleLogCommunication = async (e) => {
    e.preventDefault();
    if (!selectedClient) return;
    try {
      await clientService.logCommunication(selectedClient._id, commForm);
      setClients(clients.map(c => 
        c._id === selectedClient._id 
          ? { ...c, communicationHistory: [...(c.communicationHistory || []), commForm] }
          : c
      ));
      setIsLogModalOpen(false);
      setCommForm({ type: 'Email', summary: '' });
      alert('Communication logged successfully');
    } catch (error) {
      alert('Failed to log communication');
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
        <button className="btn-primary" onClick={handleAddClient}>
          <Plus className="w-4 h-4" />
          Add Client
        </button>
      </div>

      {/* Search */}
      <div className="card p-6">
        <div className="relative max-w-xl group">
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="clean-input"
          />
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
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
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
          <div className="card p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-6 text-apple-text tracking-tight">
              Log Communication<br/>
              <span className="text-gray-500 text-sm font-medium mt-1 inline-block">{selectedClient?.name}</span>
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
    </div>
  );
};

export default ClientProfiles;