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
import { useToast } from '../context/ToastContext';

const adminTabs = [
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'requests', label: 'Access Requests', icon: UserPlus },
  { id: 'health', label: 'System Health', icon: Activity },
  { id: 'backups', label: 'Backup & Restore', icon: Database },
  { id: 'audit', label: 'Audit Logs', icon: FileText },
  { id: 'settings', label: 'System Settings', icon: Settings },
];

const AdminPanel = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [health, setHealth] = useState(null);
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: '', email: '', password: '', role: 'Legal Staff'
  });

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

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAccessRequests();
      setRequests(data);
    } catch (error) {
      console.error('Failed to fetch requests', error);
      showToast('Failed to load access requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBackup = async () => {
    try {
      await adminService.triggerBackup();
      showToast('Snapshot created successfully', 'success');
      fetchBackups();
    } catch (error) {
      showToast('Backup failed', 'error');
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await adminService.toggleUserStatus(userId);
      fetchUsers();
    } catch (error) {
      showToast('Failed to update user status', 'error');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      fetchUsers();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to update user role', 'error');
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService.createUser(newUserForm);
      setIsAddModalOpen(false);
      setNewUserForm({ name: '', email: '', password: '', role: 'Legal Staff' });
      fetchUsers();
      showToast('User successfully added!', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to add user', 'error');
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      const res = await adminService.approveAccessRequest(requestId);
      showToast(`Request approved! Temp Password: ${res.tempPassword}`, 'success', 10000);
      fetchRequests();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to approve request', 'error');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await adminService.rejectAccessRequest(requestId);
      showToast('Request rejected', 'info');
      fetchRequests();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to reject request', 'error');
    }
  };

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'requests') fetchRequests();
    if (activeTab === 'health') fetchHealth();
    if (activeTab === 'backups') fetchBackups();
  }, [activeTab]);

  return (
    <div className="space-y-6 flex flex-col items-stretch h-[calc(100vh-theme(spacing.24))] animate-in fade-in duration-500">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-apple-text tracking-tight">Admin Control Panel</h1>
        <p className="text-gray-500 mt-1.5 text-sm">Manage firm users, roles, security settings, and audit logs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Sidebar Tabs */}
        <div className="col-span-1 lg:col-span-3">
          <div className="card p-4 space-y-1 h-full">
            {adminTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-apple-text'
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-colors ${activeTab === tab.id ? 'bg-primary-100' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                  <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
                </div>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="col-span-1 lg:col-span-9 card overflow-hidden w-full h-full relative flex flex-col">
          {activeTab === 'users' && (
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
                <h2 className="text-lg font-semibold text-apple-text">Firm Personnel</h2>
                <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
                  <UserPlus className="w-4 h-4" />
                  Add User
                </button>
              </div>

              <div className="overflow-x-auto overflow-y-auto flex-1 bg-white">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50 sticky top-0 z-10">
                      <th className="table-header py-4 px-6">User</th>
                      <th className="table-header py-4 px-6">Role</th>
                      <th className="table-header py-4 px-6">Status</th>
                      <th className="table-header py-4 px-6">Last Login</th>
                      <th className="table-header py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((user) => (
                      <tr key={user.email} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <Avatar initials={user.name.split(' ').map(n=>n[0]).join('')} size="md" />
                            <div>
                              <p className="text-sm font-semibold text-apple-text tracking-wide group-hover:text-primary-600 transition-colors">{user.name}</p>
                              <p className="text-[11px] font-medium text-gray-500 mt-0.5">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <select 
                            value={user.role}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            className="bg-gray-100 border border-gray-200 text-[10px] font-bold uppercase tracking-widest text-gray-600 rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-primary-500/20 transition-all cursor-pointer hover:bg-gray-200"
                          >
                            <option value="Admin">Admin</option>
                            <option value="Attorney">Attorney</option>
                            <option value="Legal Staff">Legal Staff</option>
                          </select>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            {user.isActive ? (
                              <div className="flex items-center gap-1.5 text-status-active bg-status-active/10 px-2 py-1 rounded">
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Active</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-status-overdue bg-status-overdue/10 px-2 py-1 rounded">
                                <XCircle className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Deactivated</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-xs font-semibold text-gray-500">N/A</span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-end items-center gap-3">
                            <button 
                              onClick={() => handleToggleStatus(user._id)}
                              className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-lg transition-colors ${
                                user.isActive ? 'text-gray-500 hover:text-status-overdue bg-gray-50 hover:bg-status-overdue/10' : 'text-gray-500 hover:text-status-active bg-gray-50 hover:bg-status-active/10'
                              }`}
                            >
                              {user.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="flex flex-col h-full animate-in fade-in duration-500">
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
                <div>
                  <h2 className="text-lg font-semibold text-apple-text">Access Requests</h2>
                  <p className="text-xs text-gray-500 mt-1">Review and approve new personnel onboarding requests.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-primary-50 text-primary-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {requests.filter(r => r.status === 'pending').length} Pending
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto overflow-y-auto flex-1 bg-white">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50 sticky top-0 z-10">
                      <th className="table-header py-4 px-6">Requester</th>
                      <th className="table-header py-4 px-6">Requested Role</th>
                      <th className="table-header py-4 px-6">Purpose/Reason</th>
                      <th className="table-header py-4 px-6">Status</th>
                      <th className="table-header py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {requests.map((request) => (
                      <tr key={request._id} className="hover:bg-gray-50/30 transition-colors group">
                        <td className="py-4 px-6">
                          <div>
                            <p className="text-sm font-semibold text-apple-text tracking-wide">{request.fullName}</p>
                            <p className="text-[11px] font-medium text-gray-400 mt-0.5">{request.email}</p>
                            <p className="text-[10px] text-gray-400 mt-1 font-medium">{new Date(request.createdAt).toLocaleDateString()}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                            {request.role}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-xs text-gray-500 max-w-xs line-clamp-2 italic">"{request.reason}"</p>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                            request.status === 'pending' ? 'bg-status-pending/10 text-status-pending' :
                            request.status === 'approved' ? 'bg-status-active/10 text-status-active' :
                            'bg-status-overdue/10 text-status-overdue'
                          }`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {request.status === 'pending' ? (
                            <div className="flex justify-end items-center gap-2">
                              <button 
                                onClick={() => handleApproveRequest(request._id)}
                                className="p-2 text-status-active hover:bg-status-active/10 rounded-lg transition-colors flex items-center gap-1.5"
                                title="Approve & Create User"
                              >
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Approve</span>
                              </button>
                              <button 
                                onClick={() => handleRejectRequest(request._id)}
                                className="p-2 text-status-overdue hover:bg-status-overdue/10 rounded-lg transition-colors flex items-center gap-1.5"
                                title="Reject Request"
                              >
                                <XCircle className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Reject</span>
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-end text-[10px] font-bold text-gray-400 uppercase tracking-widest italic pr-4">
                              Processed
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {requests.length === 0 && !loading && (
                      <tr>
                        <td colSpan="5" className="py-16 text-center text-sm font-medium text-gray-400 italic">No access requests found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'health' && health && (
            <div className="h-full overflow-y-auto p-6 space-y-8 animate-in fade-in duration-500">
              <h2 className="text-lg font-semibold text-apple-text">System Health & Security</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'CPU Usage', value: health.hardware.cpuUsage, color: 'blue' },
                  { label: 'Memory (RAM)', value: health.hardware.memUsed, color: 'purple' },
                  { label: 'Disk Storage', value: health.hardware.diskUsed, color: 'orange' }
                ].map((stat, i) => (
                  <div key={i} className="card p-6 border-b-4 rounded-b-sm border-gray-200 hover:border-blue-500 transition-colors">
                    <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mb-2">{stat.label}</p>
                    <p className="text-3xl font-black text-apple-text">{stat.value}%</p>
                    <div className="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden">
                      <div className="bg-primary-500 h-full transition-all duration-1000" style={{ width: `${stat.value}%`, backgroundColor: stat.color === 'blue' ? '#3b82f6' : stat.color === 'purple' ? '#8b5cf6' : '#f97316' }}></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="card p-6 border-t-4 border-t-status-active rounded-t-sm">
                  <h3 className="text-sm font-bold text-apple-text mb-6 flex items-center gap-3">
                    <div className="p-2 bg-status-active/10 rounded-lg">
                      <Shield className="w-4 h-4 text-status-active" />
                    </div>
                    Security Status
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-sm font-semibold text-gray-600">Rate Limiting</span>
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest">{health.security.rateLimitSetting}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-sm font-semibold text-gray-600">Security Headers (Helmet)</span>
                      <span className="bg-status-active/10 text-status-active px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest">Enabled</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-600">SSL Configuration</span>
                      <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${health.security.sslConfigured ? 'bg-status-active/10 text-status-active' : 'bg-status-pending/10 text-status-pending'}`}>
                        {health.security.sslConfigured ? 'Production Ready' : 'Development'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card p-6 border-t-4 border-t-blue-500 rounded-t-sm">
                  <h3 className="text-sm font-bold text-apple-text mb-6 flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Database className="w-4 h-4 text-blue-500" />
                    </div>
                    Database Metrics
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-sm font-semibold text-gray-600">Total Personnel</span>
                      <span className="font-bold text-apple-text px-3 py-1 bg-gray-50 rounded-md border border-gray-200">{health.stats.users}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                      <span className="text-sm font-semibold text-gray-600">Active Cases</span>
                      <span className="font-bold text-apple-text px-3 py-1 bg-gray-50 rounded-md border border-gray-200">{health.stats.activeCases}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-600">Indexed Documents</span>
                      <span className="font-bold text-apple-text px-3 py-1 bg-gray-50 rounded-md border border-gray-200">{health.stats.totalDocuments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backups' && (
            <div className="h-full overflow-y-auto p-6 space-y-8 animate-in fade-in duration-500">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-apple-text">Database Snapshots</h2>
                  <p className="text-sm font-medium text-gray-500 mt-1">Maintain system safety with manual or automated backups.</p>
                </div>
                <button 
                  onClick={handleBackup}
                  className="btn-primary"
                >
                  <Database className="w-4 h-4" /> Create Snapshot Now
                </button>
              </div>

              <div className="bg-status-active/5 border border-status-active/20 rounded-2xl p-6">
                <div className="flex items-center gap-5">
                  <div className="bg-status-active/10 p-4 rounded-full">
                    <CheckCircle className="w-8 h-8 text-status-active" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-apple-text tracking-tight">All Systems Standard</h3>
                    <p className="text-sm font-medium text-gray-600 mt-1">Automated daily backups are configured and running. Last auto-run: <b className="text-status-active font-semibold">12 hours ago</b>.</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4 ml-2">Backup History</h3>
                <div className="overflow-hidden border border-gray-100 rounded-2xl bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50/80 border-b border-gray-100">
                        <tr>
                          <th className="table-header py-4 px-6">Filename</th>
                          <th className="table-header py-4 px-6">Size</th>
                          <th className="table-header py-4 px-6">Triggered By</th>
                          <th className="table-header py-4 px-6">Date</th>
                          <th className="table-header py-4 px-6 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {backups.map((b) => (
                          <tr key={b._id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-4 px-6 text-sm font-semibold text-apple-text">{b.filename}</td>
                            <td className="py-4 px-6 text-sm text-gray-500 font-medium">{(b.size / 1024).toFixed(2)} <span className="text-[10px] uppercase font-bold ml-0.5">KB</span></td>
                            <td className="py-4 px-6">
                              <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-md">{b.triggeredBy?.name || 'System'}</span>
                            </td>
                            <td className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">{new Date(b.createdAt).toLocaleString()}</td>
                            <td className="py-4 px-6 text-right">
                              <span className="bg-status-active/10 text-status-active px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest">SUCCESS</span>
                            </td>
                          </tr>
                        ))}
                        {backups.length === 0 && (
                          <tr>
                            <td colSpan="5" className="py-16 text-center text-sm font-medium text-gray-500">No backups have been recorded yet.</td>
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
            <div className="absolute inset-0 flex items-center justify-center p-6 bg-gray-50/50">
              <div className="text-center p-10 bg-white rounded-3xl border border-gray-100 shadow-apple max-w-sm w-full">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                   {activeTab === 'roles' && <Shield className="w-10 h-10 text-gray-400" />}
                   {activeTab === 'audit' && <FileText className="w-10 h-10 text-gray-400" />}
                   {activeTab === 'settings' && <Settings className="w-10 h-10 text-gray-400" />}
                </div>
                <h3 className="text-xl font-bold text-apple-text mb-2 tracking-tight">
                  {activeTab === 'roles' && 'Roles & Permissions'}
                  {activeTab === 'audit' && 'Audit Logs'}
                  {activeTab === 'settings' && 'System Settings'}
                </h3>
                <p className="text-sm text-gray-500 mb-8">
                  {activeTab === 'roles' && 'Configure role-based access control.'}
                  {activeTab === 'audit' && 'View system activity logs.'}
                  {activeTab === 'settings' && 'Configure system preferences.'}
                </p>
                <div className="inline-block px-4 py-1.5 rounded-full bg-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-500">Module Upcoming</div>
              </div>
            </div>
          )}
          {/* Add User Modal */}
          {activeTab === 'users' && isAddModalOpen && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="card p-8 w-full max-w-md shadow-2xl">
                <h2 className="text-xl font-bold mb-6 text-apple-text tracking-tight">Add New Personnel</h2>
                <form onSubmit={handleAddSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Full Name</label>
                    <input type="text" required className="clean-input" placeholder="Jane Doe"
                      value={newUserForm.name} onChange={e => setNewUserForm({...newUserForm, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Email Address</label>
                    <input type="email" required className="clean-input" placeholder="jane@lawfirm.com"
                      value={newUserForm.email} onChange={e => setNewUserForm({...newUserForm, email: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Temporary Password</label>
                    <input type="password" required className="clean-input" placeholder="••••••••" minLength={6}
                      value={newUserForm.password} onChange={e => setNewUserForm({...newUserForm, password: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">System Role</label>
                    <select className="clean-input" value={newUserForm.role} onChange={e => setNewUserForm({...newUserForm, role: e.target.value})}>
                      <option value="Admin">Admin</option>
                      <option value="Attorney">Attorney</option>
                      <option value="Legal Staff">Legal Staff</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-gray-100">
                    <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">Cancel</button>
                    <button type="submit" className="btn-primary">Create User</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;