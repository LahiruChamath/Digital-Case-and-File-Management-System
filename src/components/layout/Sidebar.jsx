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

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar-bg flex flex-col z-50">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-base leading-tight">Law Firm</h1>
            <h2 className="text-white font-semibold text-sm leading-tight">Management</h2>
            <p className="text-slate-500 text-xs">Legal Management Suite</p>
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
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="px-3 py-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">John Doe, Esq.</p>
            <p className="text-slate-500 text-xs truncate">Senior Partner</p>
          </div>
          <button className="text-slate-500 hover:text-slate-300 transition-colors">
            <Bell className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="sidebar-link sidebar-link-inactive w-full mt-2"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;