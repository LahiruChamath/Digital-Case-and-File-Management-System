import React from 'react';

const PaymentStatus = ({ status, dueDate }) => {
  const configs = {
    paid: { color: 'bg-green-100 text-green-800', icon: '✅', label: 'Paid' },
    sent: { color: 'bg-blue-100 text-blue-800', icon: '📨', label: 'Sent' },
    overdue: { color: 'bg-red-100 text-red-800', icon: '⚠️', label: 'Overdue' },
    draft: { color: 'bg-gray-100 text-gray-800', icon: '📝', label: 'Draft' },
    cancelled: { color: 'bg-yellow-100 text-yellow-800', icon: '❌', label: 'Cancelled' },
  };
  const isOverdue = status === 'sent' && dueDate && new Date(dueDate) < new Date();
  const config = configs[isOverdue ? 'overdue' : status] || configs.draft;
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
      {config.icon} {config.label}
    </span>
  );
};

export default PaymentStatus;
