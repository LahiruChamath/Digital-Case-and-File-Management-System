import React from 'react';
import { useLocation } from 'react-router-dom';
import Avatar from '../common/Avatar';

const breadcrumbMap = {
  '/dashboard': 'Dashboard Overview',
  '/matters': 'Matter Management',
  '/clients': 'Client Profiles',
  '/calendar': 'Court Calendar',
  '/documents': 'Document Repository',
  '/expenses': 'Finance & Billing',
  '/admin': 'System Administration',
};

const TopBar = () => {
  const location = useLocation();
  const currentPage = breadcrumbMap[location.pathname] || 'Dashboard';

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40 transition-all">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-apple-textMuted font-semibold tracking-wider text-[11px] uppercase">W P Law</span>
        <span className="text-gray-300">/</span>
        <span className="text-apple-text font-bold">{currentPage}</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
          <span className="w-2 h-2 bg-status-active rounded-full relative">
             <span className="absolute inset-0 bg-status-active rounded-full animate-ping opacity-75"></span>
          </span>
          <span className="text-[11px] text-gray-600 font-bold uppercase tracking-wider">System Online</span>
        </div>
        <div className="w-px h-6 bg-gray-200"></div>
        <Avatar initials="JD" size="sm" />
      </div>
    </header>
  );
};

export default TopBar;