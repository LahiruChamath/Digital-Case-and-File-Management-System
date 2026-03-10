import React, { useState, useEffect } from 'react';
import {
  Users,
  Shield,
  FileText,
  Settings,
  UserPlus,
  MoreVertical,
  CheckCircle,
  XCircle,
  Database,
  Activity
} from 'lucide-react';
import Avatar from '../components/common/Avatar';
import { adminService } from '../services/adminService';

const adminTabs = [
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'health', label: 'System Health', icon: Activity },
  { id: 'backups', label: 'Backup & Restore', icon: Database },
  { id: 'roles', label: 'Roles & Permissions', icon: Shield },
  { id: 'audit', label: 'Audit Logs', icon: FileText },
  { id: 'settings', label: 'System Settings', icon: Settings },
];

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [health, setHealth] = useState(null);
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const data = await adminService.getSystemHealth();
      setHealth(data);
    } catch (error) {
      console.error('Failed to fetch health', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBackups = async () => {
    setLoading(true);
    try {
      const data = await adminService.getBackups();
      setBackups(data);
    } catch (error) {
      console.error('Failed to fetch backups', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackup = async () => {
    try {
      await adminService.triggerBackup();
      alert('Snapshot created successfully');
      fetchBackups();
    } catch (error) {
      alert('Backup failed');
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await adminService.toggleUserStatus(userId);
      fetchUsers();
    } catch (error) {
      alert('Failed to update user status');
    }
  };

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'health') fetchHealth();
    if (activeTab === 'backups') fetchBackups();
  }, [activeTab]);

  return (
    <div className="space-y-6 flex flex-col items-stretch h-[calc(100vh-theme(spacing.24))]">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wide">Admin Control Panel</h1>
        <p className="text-slate-400 mt-1">Manage firm users, roles, security settings, and audit logs.</p>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Sidebar Tabs */}
        <div className="col-span-12 md:col-span-3">
          <div className="card p-3 space-y-2 h-full">
            {adminTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all group ${
                  activeTab === tab.id
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent'
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-colors ${activeTab === tab.id ? 'bg-blue-500/20' : 'bg-slate-800/50 group-hover:bg-slate-700/50'}`}>
                  <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-400'}`} />
                </div>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="col-span-12 md:col-span-9 card p-6 overflow-y-auto w-full h-full relative">
          {activeTab === 'users' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white tracking-wide">Firm Personnel</h2>
                <button className="btn-primary">
                  <UserPlus className="w-4 h-4" />
                  Add User
                </button>
              </div>

              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/50 bg-slate-900/40">
                      <th className="table-header text-left py-4 px-5 rounded-tl-xl">User</th>
                      <th className="table-header text-left py-4 px-5">Role</th>
                      <th className="table-header text-left py-4 px-5">Status</th>
                      <th className="table-header text-left py-4 px-5">Last Login</th>
                      <th className="table-header text-right py-4 px-5 rounded-tr-xl">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.email} className="border-b border-slate-800/40 hover:bg-white/5 transition-colors group">
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-800 text-blue-400 border border-blue-500/20 rounded-xl flex items-center justify-center text-sm font-black tracking-wider shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                              {user.name.split(' ').map(n=>n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-100 group-hover:text-blue-400 transition-colors tracking-wide">{user.name}</p>
                              <p className="text-xs font-medium text-slate-500 mt-0.5">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-300 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">{user.role}</span>
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-2">
                            {user.isActive ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-400" />
                            )}
                            <span className={`text-[11px] font-bold uppercase tracking-widest ${
                              user.isActive ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {user.isActive ? 'Active' : 'Deactivated'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <span className="text-xs font-medium text-slate-500 border border-slate-800 bg-slate-900/50 px-2 py-1 rounded">N/A</span>
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex justify-end items-center gap-3">
                            <button 
                              onClick={() => handleToggleStatus(user._id)}
                              className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-lg transition-colors border ${
                                user.isActive ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20'
                              }`}
                            >
                              {user.isActive ? 'Deactivate' : 'Activate'}
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
              </div>
            </>
          )}

          {activeTab === 'health' && health && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <h2 className="text-lg font-bold text-white tracking-wide">System Health & Security</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { label: 'CPU Usage', value: health.hardware.cpuUsage, color: 'blue' },
                  { label: 'Memory (RAM)', value: health.hardware.memUsed, color: 'violet' },
                  { label: 'Disk Storage', value: health.hardware.diskUsed, color: 'amber' }
                ].map((stat, i) => (
                  <div key={i} className="p-5 bg-slate-800/40 rounded-2xl border border-slate-700/50 text-center relative overflow-hidden group hover:border-slate-600 transition-colors">
                    <div className={`absolute -right-4 -top-4 w-16 h-16 bg-${stat.color}-500/10 rounded-full blur-xl group-hover:bg-${stat.color}-500/20 transition-all`}></div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 relative z-10">{stat.label}</p>
                    <p className="text-3xl font-black text-white relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">{stat.value}%</p>
                    <div className="w-full bg-slate-900 h-1.5 rounded-full mt-4 overflow-hidden border border-slate-800 relative z-10">
                      <div className={`bg-${stat.color}-500 h-full transition-all duration-1000 shadow-[0_0_10px_rgba(var(--${stat.color}-500),0.5)]`} style={{ width: `${stat.value}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="p-6 border border-slate-700/50 rounded-2xl bg-slate-900/40 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl pointer-events-none"></div>
                  <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-3 tracking-wide">
                    <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                      <Shield className="w-4 h-4 text-emerald-400" />
                    </div>
                    Security Status
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-800/50">
                      <span className="text-sm font-medium text-slate-400">Rate Limiting</span>
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest shadow-[0_0_8px_rgba(16,185,129,0.1)]">{health.security.rateLimitSetting}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-800/50">
                      <span className="text-sm font-medium text-slate-400">Security Headers (Helmet)</span>
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest shadow-[0_0_8px_rgba(16,185,129,0.1)]">Enabled</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-400">SSL Configuration</span>
                      <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border shadow-sm ${health.security.sslConfigured ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.1)]' : 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.1)]'}`}>
                        {health.security.sslConfigured ? 'Production Ready' : 'Development'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 border border-slate-700/50 rounded-2xl bg-slate-900/40 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl pointer-events-none"></div>
                  <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-3 tracking-wide">
                    <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                      <Database className="w-4 h-4 text-blue-400" />
                    </div>
                    Database Metrics
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-800/50">
                      <span className="text-sm font-medium text-slate-400">Total Personnel</span>
                      <span className="font-black text-white px-3 py-1 bg-slate-800 rounded-md border border-slate-700">{health.stats.users}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-800/50">
                      <span className="text-sm font-medium text-slate-400">Active Cases</span>
                      <span className="font-black text-white px-3 py-1 bg-slate-800 rounded-md border border-slate-700">{health.stats.activeCases}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-400">Indexed Documents</span>
                      <span className="font-black text-white px-3 py-1 bg-slate-800 rounded-md border border-slate-700">{health.stats.totalDocuments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backups' && (
            <div className="space-y-8">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-wide">Database Snapshots</h2>
                  <p className="text-xs font-medium text-slate-400 mt-1">Maintain system safety with manual or automated backups.</p>
                </div>
                <button 
                  onClick={handleBackup}
                  className="btn-primary"
                >
                  <Database className="w-4 h-4" /> Create Snapshot Now
                </button>
              </div>

              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute -left-10 -top-10 w-32 h-32 bg-emerald-500/10 blur-3xl pointer-events-none"></div>
                <div className="flex items-center gap-5 relative z-10">
                  <div className="bg-emerald-500/20 border border-emerald-500/30 p-4 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <CheckCircle className="w-8 h-8 text-emerald-400 relative z-10" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white tracking-wide">All Systems Standard</h3>
                    <p className="text-sm font-medium text-emerald-400/70 mt-1 tracking-wide">Automated daily backups are configured and running. Last auto-run: <b className="text-emerald-400">12 hours ago</b>.</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4 ml-2">Backup History</h3>
                <div className="overflow-hidden border border-slate-700/50 rounded-2xl bg-slate-900/40">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-800/50 border-b border-slate-700/50">
                        <tr>
                          <th className="text-left py-3.5 px-5 text-[10px] font-black tracking-widest text-slate-500 uppercase">Filename</th>
                          <th className="text-left py-3.5 px-5 text-[10px] font-black tracking-widest text-slate-500 uppercase">Size</th>
                          <th className="text-left py-3.5 px-5 text-[10px] font-black tracking-widest text-slate-500 uppercase">Triggered By</th>
                          <th className="text-left py-3.5 px-5 text-[10px] font-black tracking-widest text-slate-500 uppercase">Date</th>
                          <th className="text-right py-3.5 px-5 text-[10px] font-black tracking-widest text-slate-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {backups.map((b) => (
                          <tr key={b._id} className="hover:bg-white/5 transition-colors">
                            <td className="py-4 px-5 text-sm font-bold tracking-wide text-slate-200">{b.filename}</td>
                            <td className="py-4 px-5 text-sm font-medium text-slate-400">{(b.size / 1024).toFixed(2)} <span className="text-[10px] uppercase font-bold ml-0.5">KB</span></td>
                            <td className="py-4 px-5">
                              <span className="text-xs font-semibold tracking-wide text-slate-300 bg-slate-800 px-2 py-1 rounded border border-slate-700">{b.triggeredBy?.name || 'System'}</span>
                            </td>
                            <td className="py-4 px-5 text-xs font-medium text-slate-400 uppercase tracking-wide">{new Date(b.createdAt).toLocaleString()}</td>
                            <td className="py-4 px-5 text-right">
                              <span className="bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.15)] text-emerald-400 px-2.5 py-1 rounded-md text-[10px] font-black tracking-widest">SUCCESS</span>
                            </td>
                          </tr>
                        ))}
                        {backups.length === 0 && (
                          <tr>
                            <td colSpan="5" className="py-12 text-center text-sm font-medium text-slate-500 bg-slate-900/20">No backups have been recorded yet.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'roles' || activeTab === 'audit' || activeTab === 'settings') && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/20 rounded-3xl">
              <div className="text-center p-8 bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-sm w-full relative overflow-hidden">
                <div className="absolute top-0 right-0 -m-10 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl"></div>
                {activeTab === 'roles' && <Shield className="w-16 h-16 text-slate-600 mx-auto mb-6 relative z-10" />}
                {activeTab === 'audit' && <FileText className="w-16 h-16 text-slate-600 mx-auto mb-6 relative z-10" />}
                {activeTab === 'settings' && <Settings className="w-16 h-16 text-slate-600 mx-auto mb-6 relative z-10" />}
                <h3 className="text-xl font-bold text-white mb-2 relative z-10 tracking-wide">
                  {activeTab === 'roles' && 'Roles & Permissions'}
                  {activeTab === 'audit' && 'Audit Logs'}
                  {activeTab === 'settings' && 'System Settings'}
                </h3>
                <p className="text-sm font-medium text-slate-400 tracking-wide relative z-10">
                  {activeTab === 'roles' && 'Configure role-based access control.'}
                  {activeTab === 'audit' && 'View system activity logs.'}
                  {activeTab === 'settings' && 'Configure system preferences.'}
                </p>
                <div className="mt-8 relative z-10 inline-block px-4 py-1.5 rounded-full bg-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-500 border border-slate-700">Module Upcoming</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;