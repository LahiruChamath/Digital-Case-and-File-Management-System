import React from 'react';
import { useLocation } from 'react-router-dom';

const breadcrumbMap = {
  '/dashboard': 'Dashboard',
  '/matters': 'Matter Management',
  '/clients': 'Clients',
  '/calendar': 'Calendar',
  '/documents': 'Documents',
  '/expenses': 'Finance',
  '/admin': 'Admin',
};

const TopBar = () => {
  const location = useLocation();
  const currentPage = breadcrumbMap[location.pathname] || 'Dashboard';

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-500 font-medium">LAW FIRM MANAGEMENT SYSTEM</span>
        <span className="text-slate-400">/</span>
        <span className="text-slate-800 font-medium">{currentPage}</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-sm text-slate-600 font-medium">Practice Sync: 4 Areas Active</span>
        </div>
        <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold cursor-pointer hover:bg-blue-700 transition-colors">
          JD
        </div>
      </div>
    </header>
  );
};

export default TopBar;