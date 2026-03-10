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
    <header className="h-14 bg-slate-900/40 backdrop-blur-xl border-b border-slate-800/50 flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-400 font-medium tracking-widest text-[10px]">LAW FIRM MANAGEMENT SYSTEM</span>
        <span className="text-slate-600">/</span>
        <span className="text-slate-200 font-semibold">{currentPage}</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
          <span className="text-xs text-slate-300 font-medium tracking-wide">Practice Sync: Active</span>
        </div>
        <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.4)] rounded-full flex items-center justify-center text-white text-sm font-semibold cursor-pointer hover:shadow-[0_0_20px_rgba(79,70,229,0.6)] transition-all">
          JD
        </div>
      </div>
    </header>
  );
};

export default TopBar;