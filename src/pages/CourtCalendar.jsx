import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react';

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const calendarEvents = {
  5: [{ title: 'Case #1024 Review', color: 'bg-blue-100 text-blue-700' }],
  14: [{ title: '', color: 'bg-blue-500 text-white', isHighlight: true }],
  15: [{ title: 'State vs. Miller', color: 'bg-green-100 text-green-700' }],
  16: [{ title: 'TechCorp Strategy', color: 'bg-orange-100 text-orange-700' }],
};

const upcomingEvents = [
  {
    title: 'Client Consultation',
    subtitle: 'New Case: Estate Miller',
    time: '02:00 PM',
    date: 'TODAY',
    borderColor: 'border-l-blue-500',
  },
  {
    title: 'Court Hearing',
    subtitle: 'State vs. Miller (Preliminary)',
    time: '09:00 AM',
    date: 'FEB 13',
    borderColor: 'border-l-red-500',
  },
  {
    title: 'Settlement Conf.',
    subtitle: 'Johnson Family Law',
    time: '11:00 AM',
    date: 'FEB 14',
    borderColor: 'border-l-amber-500',
  },
];

const CourtCalendar = () => {
  const [currentMonth] = useState('February 2026');

  // Generate calendar days for February 2026
  const generateCalendarDays = () => {
    const days = [];
    // Previous month's days (Jan 26-31)
    for (let i = 26; i <= 31; i++) {
      days.push({ day: i, isCurrentMonth: false });
    }
    // Current month's days (Feb 1-28)
    for (let i = 1; i <= 28; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Court Calendar</h1>
          <p className="text-slate-500 mt-1">Track hearings, deadlines, and client meetings.</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Calendar */}
        <div className="col-span-9 card p-5">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">{currentMonth}</h2>
            <div className="flex items-center gap-3">
              <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
              <button className="px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                Today
              </button>
              <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 mb-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-slate-500 uppercase py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          {loading ? (
            <div className="flex justify-center p-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-7 border-t border-l border-slate-200">
              {calendarDays.map((item, index) => (
                <div
                  key={index}
                  className={`min-h-[100px] border-r border-b border-slate-200 p-2 ${
                    !item.isCurrentMonth ? 'bg-slate-50' : 'bg-white'
                  }`}
                >
                  <span
                    className={`inline-flex items-center justify-center w-7 h-7 text-sm rounded-full ${
                      !item.isCurrentMonth
                        ? 'text-slate-400'
                        : item.day === 14
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-700'
                    }`}
                  >
                    {item.day}
                  </span>
                  {/* Events */}
                  {item.isCurrentMonth && mappedEvents[item.day] && (
                    <div className="mt-1 space-y-1">
                      {mappedEvents[item.day].map((event, idx) => (
                        <div
                          key={idx}
                          className={`text-xs px-1.5 py-0.5 rounded truncate ${event.color}`}
                        >
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

        {/* Upcoming Events Sidebar */}
        <div className="col-span-3">
          <div className="card p-5">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Upcoming Events</h2>
            <div className="space-y-4">
              {sortedUpcomingEvents.map((event, index) => (
                <div
                  key={event._id}
                  className={`border-l-3 border-l-blue-500 pl-3 py-1`}
                  style={{ borderLeftWidth: '3px' }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900 truncate pr-2">{event.title}</h3>
                    <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">
                      {new Date(event.start).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{event.case?.title || 'General'}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    {new Date(event.start).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
              {sortedUpcomingEvents.length === 0 && (
                <p className="text-center text-sm text-slate-500 py-10">No upcoming events</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourtCalendar;