import React from 'react';
import { Plus, Mail, Phone, ExternalLink, MoreHorizontal } from 'lucide-react';
import Avatar from '../components/common/Avatar';

const clientsData = [
  {
    initials: 'AS',
    name: 'Alice Smith',
    type: 'Individual Client',
    email: 'alice.smith@example.com',
    phone: '(555) 123-4567',
    activeCases: 2,
    progress: 70,
  },
  {
    initials: 'RM',
    name: 'Robert Miller',
    type: 'Individual Client',
    email: 'r.miller@law.net',
    phone: '(555) 987-6543',
    activeCases: 1,
    progress: 40,
  },
  {
    initials: 'TI',
    name: 'TechCorp Inc.',
    type: 'Corporate Client',
    email: 'legal@techcorp.com',
    phone: '(555) 555-0199',
    activeCases: 4,
    progress: 85,
  },
  {
    initials: 'SJ',
    name: 'Sarah Johnson',
    type: 'Individual Client',
    email: 'sarah.j@gmail.com',
    phone: '(555) 444-3322',
    activeCases: 1,
    progress: 30,
  },
  {
    initials: 'BC',
    name: 'BuildIt Co.',
    type: 'Corporate Client',
    email: 'admin@buildit.io',
    phone: '(555) 111-2233',
    activeCases: 1,
    progress: 45,
  },
];

const ClientProfiles = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Client Profiles</h1>
          <p className="text-slate-500 mt-1">Manage directory of individuals and corporate entities.</p>
        </div>
        <button className="btn-primary" onClick={handleAddClient}>
          <Plus className="w-4 h-4" />
          Add New Client
        </button>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-10 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Client Cards Grid */}
      {loading ? (
        <div className="flex justify-center p-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {clients.map((client) => (
            <div key={client._id} className="card p-5 hover:shadow-md transition-shadow">
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <Avatar initials={client.name?.split(' ').map(n => n[0]).join('') || '??'} size="lg" />
                <button className="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Client Info */}
              <h3 className="text-base font-semibold text-slate-900">{client.name}</h3>
              <p className="text-sm text-slate-500 mt-0.5">{client.type}</p>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{client.phone || 'No phone'}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-medium">Communication Logs</p>
                    <p className="text-lg font-bold text-slate-900">{client.communicationHistory?.length || 0}</p>
                  </div>
                  <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientProfiles;