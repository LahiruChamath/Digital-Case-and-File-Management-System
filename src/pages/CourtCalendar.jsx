import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, Users as UsersIcon, User } from 'lucide-react';
import { calendarService } from '../services/calendarService';

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const CourtCalendar = () => {
  const [currentMonth] = useState('February 2026');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('shared');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await calendarService.getAll();
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch events', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const filteredEvents = viewMode === 'shared' 
    ? events 
    : events.filter(e => e.createdBy?._id === currentUser?._id);

  const mappedEvents = {};
  filteredEvents.forEach(event => {
    const day = new Date(event.start).getDate();
    if (!mappedEvents[day]) mappedEvents[day] = [];
    mappedEvents[day].push({
      title: event.title,
      color: event.type === 'Court Date' ? 'bg-status-overdue/10 text-status-overdue border-l-2 border-l-status-overdue' : 
             event.type === 'Meeting' ? 'bg-blue-50 text-blue-600 border-l-2 border-l-blue-500' : 'bg-gray-100 text-gray-600 border-l-2 border-l-gray-400',
      ...event
    });
  });

  const sortedUpcomingEvents = [...filteredEvents]
    .filter(e => new Date(e.start) >= new Date())
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, 5);

  const generateCalendarDays = () => {
    const days = [];
    for (let i = 26; i <= 31; i++) days.push({ day: i, isCurrentMonth: false });
    for (let i = 1; i <= 28; i++) days.push({ day: i, isCurrentMonth: true });
    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-apple-text tracking-tight">Court Calendar</h1>
          <p className="text-gray-500 mt-1.5 text-sm">Track hearings, deadlines, and client meetings.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('shared')}
              className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${viewMode === 'shared' ? 'bg-white shadow-sm text-apple-text' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <UsersIcon className="w-4 h-4" /> Shared
            </button>
            <button 
              onClick={() => setViewMode('personal')}
              className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${viewMode === 'personal' ? 'bg-white shadow-sm text-apple-text' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <User className="w-4 h-4" /> My Events
            </button>
          </div>
          <button className="btn-primary">
            <Plus className="w-4 h-4" /> Add Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="col-span-1 xl:col-span-9 card p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-apple-text tracking-tight">{currentMonth}</h2>
            <div className="flex items-center gap-2">
              <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
              <button className="px-4 py-1.5 text-xs font-bold text-gray-700 uppercase tracking-wider bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Today</button>
              <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center text-[10px] font-bold text-gray-400 uppercase py-2 tracking-widest">{day}</div>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center p-20 border-t border-gray-100">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-7 border-t border-l border-gray-100 rounded-b-xl overflow-hidden bg-gray-50/30">
              {calendarDays.map((item, index) => (
                <div key={index} className={`min-h-[120px] border-r border-b border-gray-100 p-2 transition-colors hover:bg-gray-50 ${!item.isCurrentMonth ? 'bg-gray-50/50' : 'bg-white'}`}>
                  <span className={`inline-flex items-center justify-center w-7 h-7 text-xs rounded-full font-bold ${!item.isCurrentMonth ? 'text-gray-400' : item.day === 14 ? 'bg-primary-500 text-white shadow-sm' : 'text-gray-700'}`}>
                    {item.day}
                  </span>
                  {item.isCurrentMonth && mappedEvents[item.day] && (
                    <div className="mt-2 space-y-1.5">
                      {mappedEvents[item.day].map((event, idx) => (
                        <div key={idx} className={`text-[10px] px-2 py-1 rounded truncate font-semibold ${event.color}`} title={event.title}>
                          {event.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-span-1 xl:col-span-3">
          <div className="card">
            <h2 className="text-[11px] font-bold tracking-widest uppercase text-gray-400 px-6 py-5 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">Upcoming Events</h2>
            <div className="p-4 space-y-1">
              {sortedUpcomingEvents.map((event) => (
                <div key={event._id} className="p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className={`w-1 h-10 rounded-full ${event.type === 'Court Date' ? 'bg-status-overdue' : event.type === 'Meeting' ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-semibold text-apple-text truncate pr-2 group-hover:text-primary-600 transition-colors">{event.title}</h3>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                           {new Date(event.start).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-gray-400" /> 
                          {new Date(event.start).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <span className="text-[9px] uppercase font-bold tracking-wider bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                           {event.createdBy?.name || 'Staff'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {sortedUpcomingEvents.length === 0 && (
                <p className="text-center text-sm font-medium text-gray-500 py-10">No upcoming events.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourtCalendar;
