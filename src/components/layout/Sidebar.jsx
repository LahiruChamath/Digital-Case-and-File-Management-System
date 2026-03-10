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
  Scale
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/matters', label: 'Matter Management', icon: Briefcase },
  { path: '/clients', label: 'Client Profiles', icon: Users },
  { path: '/calendar', label: 'Court Calendar', icon: Calendar },
  { path: '/documents', label: 'Documents', icon: FileText },
  { path: '/expenses', label: 'Finance', icon: DollarSign },
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
    <aside className="fixed left-0 top-0 h-screen w-64 bg-apple-surface border-r border-gray-200 flex flex-col z-50">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-100 flex items-center gap-3">
        <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center text-white shadow-apple-sm">
          <Scale className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-apple-text font-bold text-base leading-tight">LexSystem</h1>
          <p className="text-apple-textMuted text-[10px] uppercase tracking-widest mt-0.5 font-semibold">Legal Tech</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-apple-text'
              }`
            }
          >
            <item.icon className={`w-5 h-5`} strokeWidth={2} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="px-5 py-5 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-4">
           <Avatar initials={user.name.split(' ').map(n => n[0]).join('')} size="md" />
          <div className="flex-1 min-w-0">
            <p className="text-apple-text text-sm font-semibold truncate">{user.name}</p>
            <p className="text-apple-textMuted text-[11px] truncate uppercase tracking-widest font-semibold">{user.role}</p>
          </div>
          <button className="text-gray-400 hover:text-apple-text transition-colors rounded-full p-1.5 hover:bg-gray-100">
            <Bell className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;