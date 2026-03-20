import React from 'react';
import Modal from './Modal';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title = 'Confirm Action', message = 'Are you sure?', confirmText = 'Confirm', cancelText = 'Cancel', type = 'danger', loading = false }) => {
  const btnStyles = { danger: 'bg-red-600 hover:bg-red-700 text-white', warning: 'bg-yellow-500 hover:bg-yellow-600 text-white', info: 'bg-blue-600 hover:bg-blue-700 text-white' };
  const icons = { danger: '🗑️', warning: '⚠️', info: 'ℹ️' };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm" footer={<>
      <button onClick={onClose} disabled={loading} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50">{cancelText}</button>
      <button onClick={onConfirm} disabled={loading} className={`px-4 py-2 text-sm font-medium rounded-lg ${btnStyles[type]} disabled:opacity-50`}>{loading ? 'Processing...' : confirmText}</button></>}>
      <div className="flex items-start gap-4"><span className="text-2xl">{icons[type]}</span><p className="text-sm text-gray-600">{message}</p></div>
    </Modal>
  );
};

export default ConfirmDialog;
