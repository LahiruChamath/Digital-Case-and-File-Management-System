import React from 'react';

const statusStyles = {
  Active: 'bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]',
  Pending: 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]',
  Closed: 'bg-slate-500/10 text-slate-400 border border-slate-500/20 shadow-[0_0_10px_rgba(100,116,139,0.1)]',
  Paid: 'bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]',
  Overdue: 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]',
  Inactive: 'bg-slate-500/10 text-slate-500 border border-slate-500/20 shadow-[0_0_10px_rgba(100,116,139,0.1)]',
};

const StatusBadge = ({ status }) => {
  const style = statusStyles[status] || 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] uppercase tracking-widest font-black ${style}`}>
      {status}
    </span>
  );
};

export default StatusBadge;