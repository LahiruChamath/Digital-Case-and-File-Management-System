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
  Scale,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/cases', label: 'Case Management', icon: Briefcase },
  { path: '/clients', label: 'Client Profiles', icon: Users },
  { path: '/calendar', label: 'Court Calendar', icon: Calendar },
  { path: '/documents', label: 'Documents', icon: FileText },
  { path: '/expenses', label: 'Finance', icon: DollarSign },
  { path: '/admin', label: 'Admin Panel', icon: Settings },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <aside className={`fixed left-0 top-0 h-screen w-64 bg-apple-surface border-r border-gray-200 flex flex-col z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Logo Section - Match TopBar height and alignment */}
      <div className="h-16 px-4 py-0 border-b border-gray-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-500 rounded-xl shadow-lg shadow-primary-500/20">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-apple-text tracking-tighter">W P Law</span>
        </div>
        
        {/* Mobile close button - Aligned with the menu button in TopBar */}
        <button 
          onClick={() => setIsOpen(false)}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.filter(item => {
          if ((item.path === '/expenses' || item.path === '/admin') && user?.role !== 'Senior Lawyer') return false;
          return true;
        }).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsOpen(false)}
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
           <Avatar initials={(user?.name || 'User').split(' ').map(n => n[0]).join('')} size="md" />
          <div className="flex-1 min-w-0">
            <p className="text-apple-text text-sm font-semibold truncate">{user?.name || 'User'}</p>
            <p className="text-apple-textMuted text-[11px] truncate uppercase tracking-widest font-semibold">{user?.role || 'Guest'}</p>
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