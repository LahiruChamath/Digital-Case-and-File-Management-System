import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Scale, AlertCircle, ShieldCheck, X, UserPlus, FileText, Check, Settings, Briefcase, Users as UsersIcon, HardDrive } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PermissionTable = ({ onClose }) => {
  const permissions = [
    { feature: 'User Management', admin: true, attorney: false, staff: false },
    { feature: 'System Backup/Settings', admin: true, attorney: false, staff: false },
    { feature: 'Case Management', admin: true, attorney: true, staff: true },
    { feature: 'Client Profiles', admin: true, attorney: true, staff: true },
    { feature: 'Document Management', admin: true, attorney: true, staff: true },
    { feature: 'Financial/Invoicing', admin: true, attorney: true, staff: false },
    { feature: 'Expense Tracking', admin: true, attorney: true, staff: true },
    { feature: 'Global Search', admin: true, attorney: true, staff: true },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-apple-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-apple-text tracking-tight">System Permissions</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-gray-500">Feature Area</th>
                <th className="py-4 px-4 text-center text-[11px] font-bold uppercase tracking-wider text-gray-500">Admin</th>
                <th className="py-4 px-4 text-center text-[11px] font-bold uppercase tracking-wider text-gray-500">Attorney</th>
                <th className="py-4 px-4 text-center text-[11px] font-bold uppercase tracking-wider text-gray-500">Staff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {permissions.map((p, idx) => (
                <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                  <td className="py-4 px-6 text-sm font-semibold text-apple-text">{p.feature}</td>
                  <td className="py-4 px-4 text-center">
                    {p.admin ? <Check className="w-5 h-5 text-status-active mx-auto" strokeWidth={3} /> : <X className="w-4 h-4 text-gray-200 mx-auto" />}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {p.attorney ? <Check className="w-5 h-5 text-status-active mx-auto" strokeWidth={3} /> : <X className="w-4 h-4 text-gray-200 mx-auto" />}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {p.staff ? <Check className="w-5 h-5 text-status-active mx-auto" strokeWidth={3} /> : <X className="w-4 h-4 text-gray-200 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-gray-50/50 text-center border-t border-gray-100">
          <p className="text-xs text-gray-500 font-medium">Please review these roles before requesting access to the system.</p>
        </div>
      </div>
    </div>
  );
};

import api from '../services/api';

const RequestAccessModal = ({ onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'Attorney',
    reason: ''
  });
  
  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.post('/auth/request-access', formData);
      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-apple-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-apple-text tracking-tight">Request System Access</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        {submitted ? (
          <div className="p-12 text-center animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-green-50 text-status-active rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10" strokeWidth={3} />
            </div>
            <h3 className="text-xl font-bold text-apple-text mb-2 tracking-tight">Request Sent</h3>
            <p className="text-gray-500 text-sm">Our administration team will review your request and get back to you shortly.</p>
          </div>
        ) : (
          <form className="p-6 space-y-5" onSubmit={handleRequest}>
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-lg border border-red-100 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">FullName</label>
              <input 
                type="text" 
                required 
                placeholder="John Doe" 
                className="clean-input" 
                value={formData.fullName} 
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} 
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Work Email</label>
              <input 
                type="email" 
                required 
                placeholder="name@wplaw.com" 
                className="clean-input" 
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Desired Role</label>
              <select 
                className="clean-input"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="Attorney">Attorney</option>
                <option value="Legal Staff">Legal Staff</option>
                <option value="Admin">System Administrator</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Purpose of Access</label>
              <textarea 
                placeholder="Briefly explain your role..." 
                className="clean-input min-h-[100px] py-3" 
                required
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              ></textarea>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-4 font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <UserPlus className="w-5 h-5" />
              )}
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: true,
  });

  const { login } = useAuth();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-apple-bg">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
        <div className="w-full max-w-md relative z-10">
          {/* Logo */}
          <div className="flex justify-center mb-12">
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center shadow-apple-sm">
                <Scale className="w-7 h-7 text-white" />
              </div>
              <div className="text-center">
                <span className="block text-2xl font-bold tracking-tight text-apple-text">W P Law</span>
                <span className="block text-[11px] font-bold tracking-widest uppercase text-apple-textMuted mt-1">Digital Case and File Management System</span>
              </div>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-apple-text mb-2 tracking-tight">Portal Sign In</h1>
            <p className="text-gray-500 text-sm">Enter your credentials to manage records securely.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="clean-input pl-12"
                  placeholder="name@wplaw.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500">Password</label>
                <button type="button" className="text-[11px] text-primary-500 hover:text-primary-600 font-bold tracking-wide transition-colors">
                  Forgot Password?
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="clean-input pl-12 pr-12"
                  placeholder="••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 py-2">
              <input
                type="checkbox"
                id="remember"
                checked={formData.remember}
                onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                className="w-4 h-4 rounded-lg border-gray-300 text-primary-500 focus:ring-primary-500 transition-all cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm text-gray-600 font-medium cursor-pointer">
                Remember this device
              </label>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-4 text-base font-bold shadow-apple-sm transition-all active:scale-[0.98]"
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-12 flex flex-col items-center gap-4">
            <button 
              onClick={() => setShowPermissions(true)}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-apple-text transition-colors"
            >
              <ShieldCheck className="w-4 h-4" /> View Roles & Permissions
            </button>
            <p className="text-sm text-gray-500">
              Access requires authorization.{' '}
              <button 
                onClick={() => setShowRequest(true)}
                className="text-primary-600 font-bold hover:text-primary-700 transition-colors underline underline-offset-4"
              >
                Request Access
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Quote */}
      <div className="hidden lg:flex w-1/2 relative items-end p-16 overflow-hidden bg-gray-100">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        <div className="relative z-10 max-w-xl">
          <blockquote className="text-white text-3xl font-semibold leading-snug mb-8 tracking-tight">
            "W P Law defines the modern approach to legal management. The interface is remarkably intuitive and responsive."
          </blockquote>
          <div>
            <p className="text-white font-bold tracking-wide">Eleanor Vance</p>
            <p className="text-gray-300 text-sm font-medium mt-1 uppercase tracking-wider">Managing Partner, Vance & Associates</p>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showPermissions && <PermissionTable onClose={() => setShowPermissions(false)} />}
      {showRequest && <RequestAccessModal onClose={() => setShowRequest(false)} />}
    </div>
  );
};

export default LoginPage;