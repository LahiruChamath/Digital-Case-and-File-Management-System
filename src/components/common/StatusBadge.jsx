import React from 'react';

const statusStyles = {
  Active: 'bg-green-100 text-green-700',
  Pending: 'bg-amber-100 text-amber-700',
  Closed: 'bg-slate-100 text-slate-600',
  Paid: 'bg-green-100 text-green-700',
  Overdue: 'bg-red-100 text-red-700',
  Inactive: 'bg-slate-100 text-slate-500',
};

const StatusBadge = ({ status }) => {
  const style = statusStyles[status] || 'bg-slate-100 text-slate-600';
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {status}
    </span>
  );
};

export default StatusBadge;