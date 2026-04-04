import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, CheckCircle, Info, AlertCircle, Menu } from 'lucide-react';
import Avatar from '../common/Avatar';
import { notificationService } from '../../services/notificationService';

const breadcrumbMap = {
  '/dashboard': 'Dashboard Overview',
  '/cases': 'Case Management',
  '/clients': 'Client Profiles',
  '/calendar': 'Court Calendar',
  '/documents': 'Document Repository',
  '/expenses': 'Finance & Billing',
  '/admin': 'System Administration',
};

const TopBar = ({ onToggleSidebar }) => {
  const location = useLocation();
  const currentPage = breadcrumbMap[location.pathname] || 'Dashboard';
  
  const [notifications, setNotifications] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getAll();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Refresh notifications periodically
    const intervalId = setInterval(fetchNotifications, 60000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type) => {
    switch(type) {
      case 'System': return <Info className="w-4 h-4 text-blue-500" />;
      case 'Alert': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'Task': return <CheckCircle className="w-4 h-4 text-status-active" />;
      default: return <Info className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40 transition-all">
      {/* Search and Menu */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-apple-textMuted font-semibold tracking-wider text-[11px] uppercase hidden md:inline">W P Law</span>
          <span className="text-gray-300 hidden md:inline">/</span>
          <span className="text-apple-text font-bold whitespace-nowrap">{currentPage}</span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 hidden sm:flex">
          <span className="w-2 h-2 bg-status-active rounded-full relative">
             <span className="absolute inset-0 bg-status-active rounded-full animate-ping opacity-75"></span>
          </span>
          <span className="text-[11px] text-gray-600 font-bold uppercase tracking-wider">System Online</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="p-2 relative text-gray-400 hover:text-apple-text hover:bg-gray-100 rounded-full transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1.5 w-2 h-2 bg-status-overdue rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-apple border border-gray-100 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-sm font-bold text-apple-text">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-primary-100 text-primary-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <div className="max-h-[28rem] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-sm font-medium text-gray-500">
                    No notifications right now.
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {notifications.map((notif) => (
                      <div key={notif._id} className={`p-4 transition-colors hover:bg-gray-50/50 ${!notif.isRead ? 'bg-primary-50/30' : ''}`}>
                        <div className="flex gap-3">
                          <div className={`mt-0.5 p-1.5 rounded-full shrink-0 ${!notif.isRead ? 'bg-white shadow-sm' : 'bg-gray-50'}`}>
                            {getIcon(notif.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm tracking-tight ${!notif.isRead ? 'font-bold text-apple-text' : 'font-medium text-gray-600'}`}>
                              {notif.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                {new Date(notif.createdAt).toLocaleDateString()}
                              </span>
                              {!notif.isRead && (
                                <button 
                                  onClick={(e) => handleMarkAsRead(notif._id, e)}
                                  className="text-[10px] font-bold uppercase tracking-wider text-primary-600 hover:text-primary-700 transition-colors"
                                >
                                  Mark Read
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-gray-200"></div>
        <Avatar initials="JD" size="sm" />
      </div>
    </header>
  );
};

export default TopBar;