import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, Users as UsersIcon, User } from 'lucide-react';
import { calendarService } from '../services/calendarService';
import { caseService } from '../services/caseService';
import { useToast } from '../context/ToastContext';

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const CourtCalendar = () => {
  const { showToast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('shared');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEventForm, setNewEventForm] = useState({
    title: '', type: 'Court Date', case: '', start: '', location: '', description: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eventsData, casesData] = await Promise.all([
        calendarService.getAll(),
        caseService.getAll()
      ]);
      setEvents(eventsData);
      setCases(casesData);
      if (casesData.length > 0 && !newEventForm.case) {
        setNewEventForm(prev => ({...prev, case: casesData[0]._id}));
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const newEvent = await calendarService.create(newEventForm);
      setEvents([...events, newEvent]);
      setIsAddModalOpen(false);
      setNewEventForm({ title: '', type: 'Court Date', case: cases[0]?._id, start: '', location: '', description: '' });
      showToast('Event successfully added to calendar!', 'success');
    } catch (error) {
      showToast('Failed to add event. Please check the details.', 'error');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const filteredEvents = viewMode === 'shared' 
    ? events 
    : events.filter(e => e.createdBy?._id === currentUser?._id);

  // Filter events by the current viewing month/year
  const eventsInMonth = filteredEvents.filter(e => {
    const d = new Date(e.start);
    return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
  });

  const mappedEvents = {};
  eventsInMonth.forEach(event => {
    const day = new Date(event.start).getDate();
    if (!mappedEvents[day]) mappedEvents[day] = [];
    
    let colorClass = 'bg-gray-100 text-gray-600 border-l-2 border-l-gray-400';
    if (event.status === 'Done') {
      colorClass = 'bg-gray-50 text-gray-400 border-l-2 border-l-gray-300 opacity-60 line-through';
    } else {
      if (event.type === 'Court Date') {
        colorClass = 'bg-status-overdue/10 text-status-overdue border-l-2 border-l-status-overdue animate-blink';
      } else if (event.type === 'Meeting') {
        colorClass = 'bg-blue-50 text-blue-600 border-l-2 border-l-blue-500 animate-blink';
      }
    }

    mappedEvents[day].push({
      title: event.title,
      color: colorClass,
      ...event
    });
  });

  const sortedUpcomingEvents = [...filteredEvents]
    .filter(e => new Date(e.start) >= new Date())
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, 5);

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get the first day of the month
    const firstDay = new Date(year, month, 1).getDay();
    // Get the number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Get the number of days in the previous month
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const days = [];
    
    // Add days from the previous month
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
    }
    
    // Add days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }
    
    // Fill the rest of the grid with next month's days (up to 42 cells total)
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({ day: i, isCurrentMonth: false });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const currentMonthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleToggleDone = async (event) => {
    try {
      const newStatus = event.status === 'Done' ? 'Pending' : 'Done';
      const updatedEvent = await calendarService.update(event._id, { status: newStatus });
      setEvents(events.map(e => e._id === event._id ? updatedEvent : e));
      setIsViewModalOpen(false);
      showToast(`Event marked as ${newStatus}`, 'success');
    } catch (error) {
      showToast('Failed to update event status', 'error');
    }
  };

  const handleOpenDetails = (event) => {
    setSelectedEvent(event);
    setIsViewModalOpen(true);
  };

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
          <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4" /> Add Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="col-span-1 xl:col-span-9 card p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-apple-text tracking-tight">{currentMonthName}</h2>
            <div className="flex items-center gap-2">
              <button onClick={handlePrevMonth} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
              <button onClick={handleToday} className="px-4 py-1.5 text-xs font-bold text-gray-700 uppercase tracking-wider bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Today</button>
              <button onClick={handleNextMonth} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[700px] md:min-w-0">
              <div className="grid grid-cols-7 mb-2 px-1">
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
              {calendarDays.map((item, index) => {
                const isToday = item.isCurrentMonth && item.day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
                return (
                <div key={index} className={`min-h-[120px] border-r border-b border-gray-100 p-2 transition-colors hover:bg-gray-50 ${!item.isCurrentMonth ? 'bg-gray-50/50' : 'bg-white'}`}>
                  <span className={`inline-flex items-center justify-center w-7 h-7 text-xs rounded-full font-bold ${!item.isCurrentMonth ? 'text-gray-400' : isToday ? 'bg-primary-500 text-white shadow-sm' : 'text-gray-700'}`}>
                    {item.day}
                  </span>
                  {item.isCurrentMonth && mappedEvents[item.day] && (
                    <div className="mt-2 space-y-1.5">
                      {mappedEvents[item.day].map((event, idx) => (
                        <div key={idx} 
                          onClick={() => handleOpenDetails(event)}
                          className={`text-[10px] px-2 py-1 rounded truncate font-semibold cursor-pointer transition-transform hover:scale-[1.02] ${event.color}`} title={event.title}>
                          {event.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
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

      {/* Add Event Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card p-8 w-full max-w-lg shadow-2xl">
            <h2 className="text-xl font-bold mb-6 text-apple-text tracking-tight">Schedule Event</h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Event Title</label>
                <input type="text" required className="clean-input" placeholder="e.g. Initial Hearing"
                  value={newEventForm.title} onChange={e => setNewEventForm({...newEventForm, title: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Event Type</label>
                  <select className="clean-input" value={newEventForm.type} onChange={e => setNewEventForm({...newEventForm, type: e.target.value})}>
                    <option value="Court Date">Court Date</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Deadline">Deadline</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Related Case</label>
                  <select required className="clean-input" value={newEventForm.case} onChange={e => setNewEventForm({...newEventForm, case: e.target.value})}>
                    <option value="" disabled>Select a case</option>
                    {cases.map(c => (
                      <option key={c._id} value={c._id}>{c.title} ({c.caseNumber})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Date & Time</label>
                  <input type="datetime-local" required className="clean-input" 
                    value={newEventForm.start} onChange={e => setNewEventForm({...newEventForm, start: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Location</label>
                  <input type="text" className="clean-input" placeholder="e.g. Room 402"
                    value={newEventForm.location} onChange={e => setNewEventForm({...newEventForm, location: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Description (Optional)</label>
                <textarea className="clean-input h-20 resize-none" placeholder="Additional details..."
                  value={newEventForm.description} onChange={e => setNewEventForm({...newEventForm, description: e.target.value})} />
              </div>

              <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-gray-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">Cancel</button>
                <button type="submit" className="btn-primary">Schedule Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* View Event Modal */}
      {isViewModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className={`badge mb-2 ${selectedEvent.status === 'Done' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600 animate-blink'}`}>
                  {selectedEvent.status || 'Pending'}
                </span>
                <h2 className="text-2xl font-bold text-apple-text tracking-tight">{selectedEvent.title}</h2>
              </div>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-100">
                  <Clock className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <p className="font-bold text-apple-text">{new Date(selectedEvent.start).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                  <p className="text-gray-500">{new Date(selectedEvent.start).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>

              {selectedEvent.location && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="font-bold uppercase tracking-widest text-[10px] text-gray-400">Location:</span>
                  <span className="font-semibold">{selectedEvent.location}</span>
                </div>
              )}

              {selectedEvent.description && (
                <div className="space-y-2">
                  <span className="font-bold uppercase tracking-widest text-[10px] text-gray-400">Description:</span>
                  <p className="text-sm text-gray-600 leading-relaxed bg-gray-50/50 p-3 rounded-xl border border-gray-100/50">{selectedEvent.description}</p>
                </div>
              )}

              <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded-lg border-gray-300 text-primary-600 focus:ring-primary-500 transition-all cursor-pointer"
                    checked={selectedEvent.status === 'Done'}
                    onChange={() => handleToggleDone(selectedEvent)}
                  />
                  <span className="text-sm font-bold text-gray-700 group-hover:text-primary-600 transition-colors">Mark as Done</span>
                </label>
                <button 
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold uppercase tracking-wider rounded-full transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourtCalendar;
