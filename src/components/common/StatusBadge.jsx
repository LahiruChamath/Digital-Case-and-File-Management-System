import React from 'react';

const statusStyles = {
  Active: 'bg-status-active/10 text-status-active',
  Pending: 'bg-status-pending/10 text-status-pending',
  Closed: 'bg-status-closed/10 text-status-closed',
  Paid: 'bg-status-paid/10 text-status-paid',
  Overdue: 'bg-status-overdue/10 text-status-overdue',
  Inactive: 'bg-gray-100 text-gray-500',
};

const StatusBadge = ({ status }) => {
  const style = statusStyles[status] || 'bg-gray-100 text-gray-600';
  
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${style}`}>
      {status}
    </span>
  );
};

export default StatusBadge;