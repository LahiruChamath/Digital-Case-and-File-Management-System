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
} from 'lucide-react';
import BillingChart from '../components/charts/BillingChart';
import CaseDistributionChart from '../components/charts/CaseDistributionChart';
import { caseService } from '../services/caseService';
import { clientService } from '../services/clientService';
import { calendarService } from '../services/calendarService';
import { notificationService } from '../services/notificationService';
import { adminService } from '../services/adminService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeCases: 0,
    totalClients: 0,
    pendingInvoices: 0,
    winRate: '0%',
    billingChart: [],
    caseDistribution: []
  });
  const [upcomingDates, setUpcomingDates] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [cases, clients, events, notifs, sysStats] = await Promise.all([
        caseService.getAll(),
        clientService.getAll(),
        calendarService.getAll(),
        notificationService.getAll(),
        adminService.getSystemStats()
      ]);

      const closedCases = cases.filter(c => c.status === 'Closed').length;
      const winRatePercent = cases.length > 0 ? Math.round((closedCases / cases.length) * 100) : 0;

      setStats({
        activeCases: cases.filter(c => c.status === 'Active').length,
        totalClients: clients.length,
        pendingInvoices: sysStats.pendingInvoicesCount || 0,
        winRate: `${winRatePercent}%`,
        billingChart: sysStats.billingChart || [],
        caseDistribution: sysStats.caseDistribution || []
      });

      setUpcomingDates(events.slice(0, 3).map(e => ({
        month: new Date(e.start).toLocaleDateString(undefined, { month: 'short' }),
        day: new Date(e.start).getDate(),
        title: e.title,
        time: new Date(e.start).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
        location: e.location || 'N/A'
      })));

      setNotifications(notifs.slice(0, 3).map(n => ({
        icon: n.type === 'Alert' ? AlertCircle : n.type === 'Reminder' ? Clock : FileText,
        iconBg: n.type === 'Alert' ? 'bg-red-50 text-red-500' : 'bg-primary-50 text-primary-500',
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
    },
    {
      label: 'Total Clients',
      value: stats.totalClients,
      change: '+4',
      trend: 'up',
      icon: Users,
    },
    {
      label: 'Pending Invoices',
      value: stats.pendingInvoices.toString(),
      change: stats.pendingInvoices > 0 ? '+1' : '0',
      trend: stats.pendingInvoices > 0 ? 'up' : 'down',
      icon: Clock,
    },
    {
      label: 'Closed Cases',
      value: stats.winRate,
      change: 'Win Rate',
      trend: 'up',
      icon: CheckCircle,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-apple-text tracking-tight">Overview</h1>
        <p className="text-gray-500 mt-1.5 text-sm">Welcome back. Here's what's happening today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.label} className="card p-6 flex flex-col justify-between">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 bg-gray-50 rounded-xl">
                <card.icon className="w-5 h-5 text-gray-600" />
              </div>
              <div className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                card.trend === 'up' ? 'text-status-active bg-status-active/10' : 'text-status-overdue bg-status-overdue/10'
              }`}>
                {card.trend === 'up' ? (
                  <TrendingUp className="w-3 h-3" strokeWidth={3} />
                ) : (
                  <TrendingDown className="w-3 h-3" strokeWidth={3} />
                )}
                {card.change}
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-apple-text tracking-tight">{card.value}</p>
              <p className="text-[11px] font-semibold text-gray-500 mt-1 uppercase tracking-wider">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Billing Performance */}
        <div className="col-span-12 lg:col-span-7 card p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-semibold text-apple-text">Billing Performance</h2>
            <select className="clean-input py-2 px-3 w-auto text-xs min-h-0 bg-white">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
          <BillingChart data={stats.billingChart} />
        </div>

        {/* Case Distribution */}
        <div className="col-span-12 lg:col-span-5 card p-6">
          <h2 className="text-lg font-semibold text-apple-text mb-8">Case Distribution</h2>
          <CaseDistributionChart data={stats.caseDistribution} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Court Dates */}
        <div className="card">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-apple-text">Upcoming Court Dates</h2>
            <button className="text-sm text-primary-500 hover:text-primary-600 font-semibold transition-colors">View All</button>
          </div>
          <div className="p-4">
            {upcomingDates.map((date, index) => (
              <div key={index} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="bg-primary-50 rounded-xl px-4 py-2.5 text-center min-w-[64px] group-hover:bg-primary-100 transition-colors">
                  <p className="text-[10px] font-bold tracking-widest text-primary-600 uppercase mb-0.5">{date.month}</p>
                  <p className="text-xl font-bold text-primary-700 leading-none">{date.day}</p>
                </div>
                <div className="flex-1 mt-1">
                  <p className="text-sm font-semibold text-apple-text">{date.title}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5" /> {date.time}
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                      <MapPin className="w-3.5 h-3.5" /> {date.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="card">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-apple-text">Recent Notifications</h2>
            <button className="text-sm text-primary-500 hover:text-primary-600 font-semibold transition-colors">Mark as Read</button>
          </div>
          <div className="p-4 space-y-1">
            {notifications.map((notif, index) => (
              <div key={index} className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className={`${notif.iconBg} p-2.5 rounded-full shrink-0 mt-0.5`}>
                  <notif.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm text-apple-text font-medium leading-snug">{notif.text}</p>
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mt-1.5">{notif.time}</p>
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