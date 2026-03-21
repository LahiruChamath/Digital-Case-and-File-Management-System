import React from 'react';

const priorityStyles = {
  High: 'bg-status-overdue/10 text-status-overdue',
  Medium: 'bg-status-pending/10 text-status-pending',
  Low: 'bg-blue-500/10 text-blue-600',
};

const PriorityBadge = ({ priority }) => {
  const style = priorityStyles[priority] || 'bg-gray-100 text-gray-600';
  
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${style}`}>
      {priority}
    </span>
  );
};

export default PriorityBadge;