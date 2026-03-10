import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type) => { const icons = { court_reminder: '⚖️', deadline: '⏰', document: '📄', case_update: '📋', billing: '💰' }; return icons[type] || '🔔'; };
  const timeAgo = (date) => { const s = Math.floor((new Date() - new Date(date)) / 1000); if (s < 60) return 'Just now'; const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`; const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`; return `${Math.floor(h / 24)}d ago`; };

  return (
    <div ref={dropdownRef} className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        {unreadCount > 0 && <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">{unreadCount > 99 ? '99+' : unreadCount}</span>}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b"><h3 className="text-sm font-semibold">Notifications</h3>
            {unreadCount > 0 && <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:text-blue-800">Mark all as read</button>}</div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? <div className="px-4 py-8 text-center text-gray-500 text-sm">No notifications</div> :
              notifications.slice(0, 20).map((n) => (
                <div key={n._id} className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!n.read ? 'bg-blue-50' : ''}`} onClick={() => markAsRead(n._id)}>
                  <div className="flex items-start gap-3"><span className="text-lg mt-0.5">{getIcon(n.type)}</span>
                    <div className="flex-1 min-w-0"><p className={`text-sm ${!n.read ? 'font-semibold' : ''}`}>{n.title}</p><p className="text-xs text-gray-500 mt-1 truncate">{n.message}</p><p className="text-xs text-gray-400 mt-1">{timeAgo(n.createdAt)}</p></div>
                    <button onClick={(e) => { e.stopPropagation(); deleteNotification(n._id); }} className="text-gray-400 hover:text-red-500 text-xs">✕</button></div></div>))}
          </div>
          {notifications.length > 0 && <div className="px-4 py-2 border-t text-center"><a href="/notifications" className="text-xs text-blue-600">View all</a></div>}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
