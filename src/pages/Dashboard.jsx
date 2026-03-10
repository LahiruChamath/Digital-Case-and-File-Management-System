import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Calendar,
  MapPin,
  AlertCircle,
  FileText,
  DollarSign,
} from 'lucide-react';
import BillingChart from '../components/charts/BillingChart';
import CaseDistributionChart from '../components/charts/CaseDistributionChart';
import { caseService } from '../services/caseService';
import { clientService } from '../services/clientService';
import { calendarService } from '../services/calendarService';
import { notificationService } from '../services/notificationService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeCases: 0,
    totalClients: 0,
    pendingInvoices: 0,
    winRate: '89%'
  });
  const [upcomingDates, setUpcomingDates] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [cases, clients, events, notifs] = await Promise.all([
        caseService.getAll(),
        clientService.getAll(),
        calendarService.getAll(),
        notificationService.getAll()
      ]);

      setStats({
        activeCases: cases.filter(c => c.status === 'Active').length,
        totalClients: clients.length,
        pendingInvoices: 12,
        winRate: '89%'
      });

      setUpcomingDates(events.slice(0, 3).map(e => ({
        month: new Date(e.start).toLocaleDateString(undefined, { month: 'short' }).toUpperCase(),
        day: new Date(e.start).getDate(),
        title: e.title,
        time: new Date(e.start).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
        location: e.location || 'N/A'
      })));

      setNotifications(notifs.slice(0, 3).map(n => ({
        icon: n.type === 'Alert' ? AlertCircle : n.type === 'Reminder' ? Clock : FileText,
        iconBg: n.type === 'Alert' ? 'bg-red-500/20' : 'bg-blue-500/20',
        iconColor: n.type === 'Alert' ? 'text-red-400' : 'text-blue-400',
        text: n.message,
        time: new Date(n.createdAt).toLocaleTimeString()
      })));

    } catch (error) {
      console.error('Dashboard fetch failed', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    {
      label: 'Active Cases',
      value: stats.activeCases,
      change: '+12%',
      trend: 'up',
      icon: Briefcase,
      iconBg: 'bg-blue-500/20',
      iconColor: 'text-blue-400',
    },
    {
      label: 'Total Clients',
      value: stats.totalClients,
      change: '+4',
      trend: 'up',
      icon: Users,
      iconBg: 'bg-violet-500/20',
      iconColor: 'text-violet-400',
    },
    {
      label: 'Pending Invoices',
      value: `$${stats.pendingInvoices * 1037}`,
      change: '-2%',
      trend: 'down',
      icon: Clock,
      iconBg: 'bg-amber-500/20',
      iconColor: 'text-amber-400',
    },
    {
      label: 'Won Cases',
      value: stats.winRate,
      change: '+3%',
      trend: 'up',
      icon: CheckCircle,
      iconBg: 'bg-green-500/20',
      iconColor: 'text-green-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wide">Firm Overview</h1>
        <p className="text-slate-400 mt-1">Welcome back, counselor. Here's what's happening today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <div key={card.label} className="card p-5 group hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className={`${card.iconBg} p-2.5 rounded-xl border border-white/5 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all`}>
                <card.icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                card.trend === 'up' ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'
              }`}>
                {card.trend === 'up' ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                {card.change}
              </div>
            </div>
            <p className="text-sm text-slate-400 mt-4 tracking-wide uppercase font-semibold text-[10px]">{card.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-12 gap-5">
        {/* Billing Performance */}
        <div className="col-span-7 card p-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white tracking-wide">Billing Performance</h2>
            <select className="futuristic-input py-1.5 w-auto text-xs bg-slate-800/80">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
          <BillingChart />
        </div>

        {/* Case Distribution */}
        <div className="col-span-5 card p-5">
          <h2 className="text-lg font-bold text-white tracking-wide mb-6">Case Distribution</h2>
          <CaseDistributionChart />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-5">
        {/* Upcoming Court Dates */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white tracking-wide">Upcoming Court Dates</h2>
            <button className="text-sm text-blue-400 hover:text-blue-300 font-semibold tracking-wide">View All</button>
          </div>
          <div className="space-y-4">
            {upcomingDates.map((date, index) => (
              <div key={index} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl px-3 py-2 text-center min-w-[56px] shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                  <p className="text-[10px] font-bold tracking-widest text-blue-400">{date.month}</p>
                  <p className="text-lg font-black text-white">{date.day}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-white tracking-wide">{date.title}</p>
                  <div className="flex items-center gap-4 mt-1.5">
                    <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 uppercase tracking-widest">
                      <Clock className="w-3.5 h-3.5 text-slate-500" /> {date.time}
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 uppercase tracking-widest">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" /> {date.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white tracking-wide">Recent Notifications</h2>
            <button className="text-sm text-blue-400 hover:text-blue-300 font-semibold tracking-wide">Mark as Read</button>
          </div>
          <div className="space-y-4">
            {notifications.map((notif, index) => (
              <div key={index} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                <div className={`${notif.iconBg} p-2.5 rounded-xl border border-white/5`}>
                  <notif.icon className={`w-4 h-4 ${notif.iconColor}`} />
                </div>
                <div>
                  <p className="text-sm text-slate-200 font-medium">{notif.text}</p>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest mt-1.5">{notif.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;