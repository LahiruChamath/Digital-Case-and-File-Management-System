import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, Users as UsersIcon, User } from 'lucide-react';
import { calendarService } from '../services/calendarService';

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const CourtCalendar = () => {
  const [currentMonth] = useState('February 2026');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('shared'); // 'shared' or 'personal'

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

  // Filter events based on viewMode (Assuming we have user info in localStorage or context)
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const filteredEvents = viewMode === 'shared' 
    ? events 
    : events.filter(e => e.createdBy?._id === currentUser?._id);

  // Map events to days for the calendar grid
  const mappedEvents = {};
  filteredEvents.forEach(event => {
    const day = new Date(event.start).getDate();
    if (!mappedEvents[day]) mappedEvents[day] = [];
    mappedEvents[day].push({
      title: event.title,
      color: event.type === 'Court Date' ? 'bg-red-100 text-red-700' : 
             event.type === 'Meeting' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700',
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
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Court Calendar</h1>
          <p className="text-slate-500 mt-1">Track hearings, deadlines, and client meetings.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setViewMode('shared')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'shared' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <UsersIcon className="w-3.5 h-3.5" /> Shared
            </button>
            <button 
              onClick={() => setViewMode('personal')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'personal' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <User className="w-3.5 h-3.5" /> My Events
            </button>
          </div>
          <button className="btn-primary">
            <Plus className="w-4 h-4" /> Add Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-9 card p-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">{currentMonth}</h2>
            <div className="flex items-center gap-3">
              <button className="p-1.5 hover:bg-slate-100 rounded-lg"><ChevronLeft className="w-5 h-5 text-slate-600" /></button>
              <button className="px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg">Today</button>
              <button className="p-1.5 hover:bg-slate-100 rounded-lg"><ChevronRight className="w-5 h-5 text-slate-600" /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-slate-500 uppercase py-2">{day}</div>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center p-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-7 border-t border-l border-slate-200">
              {calendarDays.map((item, index) => (
                <div key={index} className={`min-h-[100px] border-r border-b border-slate-200 p-2 ${!item.isCurrentMonth ? 'bg-slate-50' : 'bg-white'}`}>
                  <span className={`inline-flex items-center justify-center w-7 h-7 text-sm rounded-full ${!item.isCurrentMonth ? 'text-slate-400' : item.day === 14 ? 'bg-blue-600 text-white font-semibold' : 'text-slate-700'}`}>
                    {item.day}
                  </span>
                  {item.isCurrentMonth && mappedEvents[item.day] && (
                    <div className="mt-1 space-y-1">
                      {mappedEvents[item.day].map((event, idx) => (
                        <div key={idx} className={`text-[10px] px-1.5 py-0.5 rounded truncate ${event.color}`} title={event.title}>
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

        <div className="col-span-3">
          <div className="card p-5">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Upcoming Events</h2>
            <div className="space-y-4">
              {sortedUpcomingEvents.map((event) => (
                <div key={event._id} className="border-l-3 border-l-blue-500 pl-3 py-1" style={{ borderLeftWidth: '3px' }}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900 truncate pr-2">{event.title}</h3>
                    <span className="text-[10px] text-slate-500 font-medium">{new Date(event.start).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[10px] text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(event.start).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</p>
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-1 rounded">{event.createdBy?.name || 'Staff'}</span>
                  </div>
                </div>
              ))}
              {sortedUpcomingEvents.length === 0 && <p className="text-center text-sm text-slate-500 py-10">No upcoming events</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourtCalendar;
