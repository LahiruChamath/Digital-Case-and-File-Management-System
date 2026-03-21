import React from 'react';

const ErrorMessage = ({ message, onRetry, type = 'error' }) => {
  const styles = { error: 'bg-red-50 border-red-200 text-red-800', warning: 'bg-yellow-50 border-yellow-200 text-yellow-800', info: 'bg-blue-50 border-blue-200 text-blue-800' };
  const icons = { error: '❌', warning: '⚠️', info: 'ℹ️' };
  return (
    <div className={`border rounded-lg p-4 ${styles[type]}`}>
      <div className="flex items-center gap-3">
        <span className="text-xl">{icons[type]}</span>
        <p className="text-sm font-medium flex-1">{message || 'Something went wrong'}</p>
        {onRetry && <button onClick={onRetry} className="px-3 py-1 text-xs font-medium bg-white border rounded hover:bg-gray-50">Retry</button>}
      </div>
    </div>
  );
};

export default ErrorMessage;
