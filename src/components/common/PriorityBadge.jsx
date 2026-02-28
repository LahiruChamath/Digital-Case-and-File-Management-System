import React from 'react';

const priorityStyles = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low: 'bg-blue-100 text-blue-700',
};

const PriorityBadge = ({ priority }) => {
  const style = priorityStyles[priority] || 'bg-slate-100 text-slate-600';
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {priority}
    </span>
  );
};

export default PriorityBadge;