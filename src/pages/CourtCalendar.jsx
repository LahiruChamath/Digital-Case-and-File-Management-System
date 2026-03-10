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
      color: event.type === 'Court Date' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
             event.type === 'Meeting' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-slate-700/50 text-slate-300 border border-slate-600/50',
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
          <h1 className="text-2xl font-bold text-white tracking-wide">Court Calendar</h1>
          <p className="text-slate-400 mt-1">Track hearings, deadlines, and client meetings.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex bg-slate-900/60 backdrop-blur-md p-1 rounded-xl border border-slate-700/50">
            <button 
              onClick={() => setViewMode('shared')}
              className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${viewMode === 'shared' ? 'bg-slate-700 shadow-[0_0_10px_rgba(0,0,0,0.3)] text-blue-400 border border-slate-600' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
            >
              <UsersIcon className="w-4 h-4" /> Shared
            </button>
            <button 
              onClick={() => setViewMode('personal')}
              className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${viewMode === 'personal' ? 'bg-slate-700 shadow-[0_0_10px_rgba(0,0,0,0.3)] text-blue-400 border border-slate-600' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
            >
              <User className="w-4 h-4" /> My Events
            </button>
          </div>
          <button className="btn-primary">
            <Plus className="w-4 h-4" /> Add Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-9 card p-5 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white tracking-wide">{currentMonth}</h2>
            <div className="flex items-center gap-3">
              <button className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors border border-transparent hover:border-slate-700"><ChevronLeft className="w-5 h-5" /></button>
              <button className="px-4 py-1.5 text-xs font-bold text-slate-200 tracking-wide uppercase bg-slate-800/50 hover:bg-slate-700 rounded-lg border border-slate-700/50 transition-colors">Today</button>
              <button className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors border border-transparent hover:border-slate-700"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 mb-2 bg-slate-800/40 rounded-t-xl border border-slate-700/50">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center text-[10px] font-bold text-slate-400 uppercase py-3 tracking-widest">{day}</div>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center p-20 border border-slate-800 border-t-0 rounded-b-xl">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-7 border-l border-t border-slate-700/50 bg-slate-900/20 rounded-b-xl overflow-hidden">
              {calendarDays.map((item, index) => (
                <div key={index} className={`min-h-[110px] border-r border-b border-slate-700/50 p-2 transition-colors hover:bg-white/5 ${!item.isCurrentMonth ? 'bg-slate-900/60' : 'bg-transparent'}`}>
                  <span className={`inline-flex items-center justify-center w-7 h-7 text-xs rounded-full font-semibold ${!item.isCurrentMonth ? 'text-slate-600' : item.day === 14 ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)] text-white' : 'text-slate-300'}`}>
                    {item.day}
                  </span>
                  {item.isCurrentMonth && mappedEvents[item.day] && (
                    <div className="mt-1.5 space-y-1.5">
                      {mappedEvents[item.day].map((event, idx) => (
                        <div key={idx} className={`text-[10px] px-2 py-1 flex items-center gap-1.5 rounded-md truncate font-medium tracking-wide ${event.color}`} title={event.title}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
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
            <h2 className="text-sm font-bold tracking-widest uppercase text-slate-400 mb-5 border-b border-slate-800 pb-3">Upcoming Events</h2>
            <div className="space-y-4">
              {sortedUpcomingEvents.map((event) => (
                <div key={event._id} className="border-l-2 pl-4 py-2 hover:bg-white/5 rounded-r-xl transition-colors" style={{ borderColor: event.type === 'Court Date' ? '#ef4444' : event.type === 'Meeting' ? '#3b82f6' : '#94a3b8' }}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-100 truncate pr-2">{event.title}</h3>
                    <span className="text-[10px] tracking-wide text-slate-500 font-bold uppercase">{new Date(event.start).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-[10px] tracking-widest uppercase font-semibold text-slate-400 flex items-center gap-1.5"><Clock className="w-3 h-3 text-slate-500" /> {new Date(event.start).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</p>
                    <span className="text-[9px] uppercase font-bold tracking-widest bg-blue-500/10 border border-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded shadow-[0_0_5px_rgba(59,130,246,0.1)]">{event.createdBy?.name || 'Staff'}</span>
                  </div>
                </div>
              ))}
              {sortedUpcomingEvents.length === 0 && <p className="text-center text-sm font-medium tracking-wide text-slate-500 py-10 bg-slate-800/20 rounded-xl border border-slate-800 border-dashed">No upcoming events</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourtCalendar;
