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
        iconBg: n.type === 'Alert' ? 'bg-red-50' : 'bg-blue-50',
        iconColor: n.type === 'Alert' ? 'text-red-600' : 'text-blue-600',
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
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Total Clients',
      value: stats.totalClients,
      change: '+4',
      trend: 'up',
      icon: Users,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
    },
    {
      label: 'Pending Invoices',
      value: `$${stats.pendingInvoices * 1037}`,
      change: '-2%',
      trend: 'down',
      icon: Clock,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      label: 'Won Cases',
      value: stats.winRate,
      change: '+3%',
      trend: 'up',
      icon: CheckCircle,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
    },
  ];



  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Firm Overview</h1>
        <p className="text-slate-500 mt-1">Welcome back, counselor. Here's what's happening today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <div key={card.label} className="card p-5">
            <div className="flex items-start justify-between">
              <div className={`${card.iconBg} p-2.5 rounded-lg`}>
                <card.icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${
                card.trend === 'up' ? 'text-green-600' : 'text-red-500'
              }`}>
                {card.trend === 'up' ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                {card.change}
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-3">{card.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-12 gap-5">
        {/* Billing Performance */}
        <div className="col-span-7 card p-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Billing Performance</h2>
            <select className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
          <BillingChart />
        </div>

        {/* Case Distribution */}
        <div className="col-span-5 card p-5">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Case Distribution</h2>
          <CaseDistributionChart />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-5">
        {/* Upcoming Court Dates */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-slate-900">Upcoming Court Dates</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {upcomingDates.map((date, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="bg-blue-50 rounded-lg px-3 py-2 text-center min-w-[56px]">
                  <p className="text-xs font-semibold text-blue-600">{date.month}</p>
                  <p className="text-lg font-bold text-slate-900">{date.day}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{date.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5" /> {date.time}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5" /> {date.location}
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
            <h2 className="text-lg font-semibold text-slate-900">Recent Notifications</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Mark as Read</button>
          </div>
          <div className="space-y-4">
            {notifications.map((notif, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`${notif.iconBg} p-2 rounded-lg`}>
                  <notif.icon className={`w-4 h-4 ${notif.iconColor}`} />
                </div>
                <div>
                  <p className="text-sm text-slate-700">{notif.text}</p>
                  <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
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