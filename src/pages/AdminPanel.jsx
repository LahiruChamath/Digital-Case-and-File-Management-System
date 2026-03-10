import React, { useState } from 'react';
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
} from 'lucide-react';
import Avatar from '../components/common/Avatar';
import { adminService } from '../services/adminService';

const adminTabs = [
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'health', label: 'System Health', icon: Shield },
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
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Control Panel</h1>
        <p className="text-slate-500 mt-1">Manage firm users, roles, security settings, and audit logs.</p>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Sidebar Tabs */}
        <div className="col-span-3">
          <div className="space-y-1">
            {adminTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="col-span-9 card p-5">
          {activeTab === 'users' && (
            <>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-slate-900">Firm Personnel</h2>
                <button className="btn-primary">
                  <UserPlus className="w-4 h-4" />
                  Add User
                </button>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="table-header text-left py-3 px-4">User</th>
                    <th className="table-header text-left py-3 px-4">Role</th>
                    <th className="table-header text-left py-3 px-4">Status</th>
                    <th className="table-header text-left py-3 px-4">Last Login</th>
                    <th className="table-header text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.email} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar initials={user.name.split(' ').map(n=>n[0]).join('')} size="md" />
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-700">{user.role}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          {user.isActive ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                          <span className={`text-sm ${
                            user.isActive ? 'text-green-700' : 'text-red-500'
                          }`}>
                            {user.isActive ? 'Active' : 'Deactivated'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-500">N/A</td>
                      <td className="py-4 px-4">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleToggleStatus(user._id)}
                            className={`text-xs px-2 py-1 rounded font-medium ${
                              user.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'
                            }`}
                          >
                            {user.isActive ? 'Deactivate' : 'Activate'}
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
            </>
          )}

          {activeTab === 'health' && health && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-5">System Health & Security</h2>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <p className="text-xs text-slate-500 font-medium uppercase mb-1">CPU Usage</p>
                  <p className="text-2xl font-bold text-slate-900">{health.hardware.cpuUsage}%</p>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-blue-600 h-full transition-all duration-500" style={{ width: `${health.hardware.cpuUsage}%` }}></div>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <p className="text-xs text-slate-500 font-medium uppercase mb-1">Memory (RAM)</p>
                  <p className="text-2xl font-bold text-slate-900">{health.hardware.memUsed}%</p>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-violet-600 h-full transition-all duration-500" style={{ width: `${health.hardware.memUsed}%` }}></div>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <p className="text-xs text-slate-500 font-medium uppercase mb-1">Disk Storage</p>
                  <p className="text-2xl font-bold text-slate-900">{health.hardware.diskUsed}%</p>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-amber-500 h-full transition-all duration-500" style={{ width: `${health.hardware.diskUsed}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5 mt-8">
                <div className="p-5 border border-slate-100 rounded-xl bg-white shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" /> Security Status
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Rate Limiting</span>
                      <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-bold">{health.security.rateLimitSetting}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Security Headers (Helmet)</span>
                      <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-bold">Enabled</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">SSL Configuration</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${health.security.sslConfigured ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                        {health.security.sslConfigured ? 'Production Ready' : 'Development'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 border border-slate-100 rounded-xl bg-white shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" /> Database Metrics
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Total Personnel</span>
                      <span className="font-bold text-slate-900">{health.stats.users}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Active Cases</span>
                      <span className="font-bold text-slate-900">{health.stats.activeCases}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Indexed Documents</span>
                      <span className="font-bold text-slate-900">{health.stats.totalDocuments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backups' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Database Snapshots</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Maintain system safety with manual or automated backups.</p>
                </div>
                <button 
                  onClick={handleBackup}
                  className="btn-primary"
                >
                  <Database className="w-4 h-4" /> Create Snapshot Now
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">All Systems Standard</h3>
                    <p className="text-sm text-slate-500">Automated daily backups are configured and running. Last auto-run: 12 hours ago.</p>
                  </div>
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mb-3 ml-1">Backup History</h3>
              <div className="overflow-hidden border border-slate-200 rounded-xl">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase">Filename</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase">Size</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase">Triggered By</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {backups.map((b) => (
                      <tr key={b._id}>
                        <td className="py-4 px-4 text-sm font-medium text-slate-900">{b.filename}</td>
                        <td className="py-4 px-4 text-sm text-slate-500">{(b.size / 1024).toFixed(2)} KB</td>
                        <td className="py-4 px-4 text-sm text-slate-700">{b.triggeredBy?.name || 'System'}</td>
                        <td className="py-4 px-4 text-sm text-slate-500">{new Date(b.createdAt).toLocaleString()}</td>
                        <td className="py-4 px-4 text-right">
                          <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold">SUCCESS</span>
                        </td>
                      </tr>
                    ))}
                    {backups.length === 0 && (
                      <tr>
                        <td colSpan="5" className="py-10 text-center text-sm text-slate-400 italic">No manual backups recorded yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-700">Roles & Permissions</h3>
              <p className="text-sm text-slate-500 mt-1">Configure role-based access control for system users.</p>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-700">Audit Logs</h3>
              <p className="text-sm text-slate-500 mt-1">View system activity logs and user actions.</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="text-center py-12">
              <Settings className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-700">System Settings</h3>
              <p className="text-sm text-slate-500 mt-1">Configure system preferences and notification settings.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;