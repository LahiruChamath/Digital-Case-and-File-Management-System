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
} from 'lucide-react';
import Avatar from '../components/common/Avatar';

const adminTabs = [
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'roles', label: 'Roles & Permissions', icon: Shield },
  { id: 'audit', label: 'Audit Logs', icon: FileText },
  { id: 'settings', label: 'System Settings', icon: Settings },
];

const usersData = [
  {
    initials: 'JD',
    name: 'John Doe',
    email: 'john.doe@firm-management.com',
    role: 'Senior Partner',
    status: 'Active',
    lastLogin: '2 hours ago',
  },
  {
    initials: 'JS',
    name: 'Jane Smith',
    email: 'jane.s@firm-management.com',
    role: 'Associate Attorney',
    status: 'Active',
    lastLogin: '5 mins ago',
  },
  {
    initials: 'MJ',
    name: 'Mike Johnson',
    email: 'mike.j@firm-management.com',
    role: 'Paralegal',
    status: 'Active',
    lastLogin: 'Yesterday',
  },
  {
    initials: 'SW',
    name: 'Sarah Wilson',
    email: 'sarah.w@firm-management.com',
    role: 'Legal Secretary',
    status: 'Inactive',
    lastLogin: '1 week ago',
  },
];

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');

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
                  {usersData.map((user) => (
                    <tr key={user.email} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar initials={user.initials} size="md" />
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-700">{user.role}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          {user.status === 'Active' ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-slate-400" />
                          )}
                          <span className={`text-sm ${
                            user.status === 'Active' ? 'text-green-700' : 'text-slate-500'
                          }`}>
                            {user.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-500">{user.lastLogin}</td>
                      <td className="py-4 px-4">
                        <div className="flex justify-end">
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