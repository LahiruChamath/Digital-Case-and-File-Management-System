import React from 'react';

const priorityStyles = {
  High: 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]',
  Medium: 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]',
  Low: 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]',
};

const PriorityBadge = ({ priority }) => {
  const style = priorityStyles[priority] || 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] uppercase tracking-widest font-black ${style}`}>
      {priority}
    </span>
  );
};

export default PriorityBadge;