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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Client Profiles</h1>
          <p className="text-slate-400 mt-1">Manage directory of individuals and corporate entities.</p>
        </div>
        <button className="btn-primary" onClick={handleAddClient}>
          <Plus className="w-4 h-4" />
          Add New Client
        </button>
      </div>

      {/* Search */}
      <div className="card p-5">
        <div className="relative max-w-lg group">
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="futuristic-input"
          />
        </div>
      </div>

      {/* Client Cards Grid */}
      {loading ? (
        <div className="flex justify-center p-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <div key={client._id} className="card p-6 flex flex-col hover:-translate-y-1 transition-all duration-300 group">
              {/* Card Header */}
              <div className="flex items-start justify-between mb-5">
                <div className="w-14 h-14 bg-gradient-to-tr from-slate-800 to-slate-700 text-white rounded-2xl flex items-center justify-center text-xl font-black shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/5">
                  {client.name?.split(' ').map(n => n[0]).join('') || '??'}
                </div>
                <button className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-500 hover:text-white">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Client Info */}
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-blue-400 transition-colors">{client.name}</h3>
              <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-widest">{client.type}</p>

              <div className="mt-6 flex-1 space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-300 p-2 bg-slate-800/30 rounded-lg border border-transparent group-hover:border-slate-700/50 transition-colors">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <span className="truncate font-medium">{client.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300 p-2 bg-slate-800/30 rounded-lg border border-transparent group-hover:border-slate-700/50 transition-colors">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <span className="font-medium">{client.phone || 'No phone'}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-5 border-t border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Logs</p>
                    <p className="text-xl font-black text-white">{client.communicationHistory?.length || 0}</p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => { setSelectedClient(client); setIsLogModalOpen(true); }}
                      className="text-xs font-bold uppercase tracking-widest bg-slate-800 text-blue-400 hover:text-white px-3 py-1.5 rounded-lg border border-blue-500/20 hover:border-blue-400/50 transition-all shadow-[0_0_10px_rgba(59,130,246,0.1)] hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:bg-slate-700"
                    >
                      Log
                    </button>
                    <button className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                      View
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Log Communication Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card p-8 w-full max-w-md border-slate-600 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <h2 className="text-xl font-bold mb-6 text-white tracking-wide">Log Communication<br/><span className="text-blue-400 text-sm font-medium">{selectedClient?.name}</span></h2>
            <form onSubmit={handleLogCommunication} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Type</label>
                <select 
                  className="futuristic-input"
                  value={commForm.type}
                  onChange={e => setCommForm({...commForm, type: e.target.value})}
                >
                  <option className="bg-slate-800 text-white">Email</option>
                  <option className="bg-slate-800 text-white">Phone call</option>
                  <option className="bg-slate-800 text-white">Meeting</option>
                  <option className="bg-slate-800 text-white">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Summary</label>
                <textarea 
                  className="futuristic-input h-32 resize-none"
                  placeholder="What was discussed?"
                  required
                  value={commForm.summary}
                  onChange={e => setCommForm({...commForm, summary: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-4 pt-4 mt-2 border-t border-slate-700/50">
                <button type="button" onClick={() => setIsLogModalOpen(false)} className="text-sm font-bold tracking-wide text-slate-400 hover:text-white transition-colors">Cancel</button>
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