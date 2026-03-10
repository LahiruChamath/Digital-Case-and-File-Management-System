import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Calendar,
  FileText,
  DollarSign,
  Settings,
  LogOut,
  Bell,
  Building2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/matters', label: 'Matter Management', icon: Briefcase },
  { path: '/clients', label: 'Client Profiles', icon: Users },
  { path: '/calendar', label: 'Court Calendar', icon: Calendar },
  { path: '/documents', label: 'Documents', icon: FileText },
  { path: '/expenses', label: 'Expenses & Billing', icon: DollarSign },
  { path: '/admin', label: 'Admin Panel', icon: Settings },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900/40 backdrop-blur-xl border-r border-slate-800/50 flex flex-col z-50">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-base leading-tight tracking-wide">Law Firm</h1>
            <h2 className="text-blue-400 font-semibold text-sm leading-tight tracking-wider">Management</h2>
            <p className="text-slate-400 text-[10px] uppercase tracking-widest mt-0.5">Legal System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`
            }
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="px-3 py-4 border-t border-slate-800/50">
        <div className="flex items-center gap-3 px-3 py-2 bg-slate-800/30 rounded-xl border border-slate-700/30 mb-2">
          <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-[0_0_10px_rgba(79,70,229,0.4)]">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-200 text-sm font-semibold truncate tracking-wide">{user.name}</p>
            <p className="text-blue-400 text-xs truncate uppercase tracking-widest">{user.role}</p>
          </div>
          <button className="text-slate-400 hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.2)] transition-all rounded-full p-1">
            <Bell className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="sidebar-link sidebar-link-inactive w-full text-slate-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;