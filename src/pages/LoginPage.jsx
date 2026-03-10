import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: 'john.doe@firm-management.com',
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
    <div className="min-h-screen flex bg-[#0B1120]">
      {/* Left Side - Login Form */}
      <div className="w-1/2 flex items-center justify-center p-12 relative overflow-hidden">
        {/* Abstract futuristic background glow */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-600/20 blur-[120px] rounded-full"></div>
          <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-indigo-600/20 blur-[120px] rounded-full"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-12 border border-slate-800 bg-slate-900/50 backdrop-blur-md p-4 rounded-2xl shadow-2xl">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="block text-xl font-black tracking-wide text-white">LAW FIRM</span>
              <span className="block text-xs font-bold tracking-widest uppercase text-blue-400">Management System</span>
            </div>
          </div>

          {/* Welcome Text */}
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Access Portal</h1>
          <p className="text-slate-400 mb-8 font-medium">Authenticate to enter the secure law firm workspace.</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="futuristic-input pl-12"
                  placeholder="john.doe@firm-management.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">Password</label>
                <button type="button" className="text-xs text-blue-400 hover:text-blue-300 font-bold tracking-wide transition-colors">
                  Forgot?
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="futuristic-input pl-12 pr-12"
                  placeholder="••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="remember"
                checked={formData.remember}
                onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
              />
              <label htmlFor="remember" className="text-sm font-medium text-slate-400">
                Maintain active session
              </label>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.1)] flex items-center gap-3">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-3.5 text-base tracking-wide"
            >
              {isSubmitting ? 'Authenticating...' : 'Enter Workspace'}
            </button>
          </form>

          <p className="text-center text-sm font-medium text-slate-500 mt-8">
            System access requires authorization.{' '}
            <button className="text-slate-300 font-bold hover:text-white transition-colors">
              Request access
            </button>
          </p>
        </div>
      </div>

      {/* Right Side - Image/Quote */}
      <div className="w-1/2 relative flex items-end p-16 overflow-hidden bg-slate-900 border-l border-slate-800">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
        
        <div className="relative z-10 max-w-xl backdrop-blur-md bg-slate-900/40 p-10 rounded-3xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          <div className="w-12 h-12 bg-blue-500/20 flex items-center justify-center rounded-2xl mb-8 border border-blue-500/30">
            <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
          </div>
          <blockquote className="text-white text-2xl font-bold leading-relaxed mb-8 tracking-wide">
            "This management system has transformed how we handle our high-stakes litigation. The case
            tracking and document storage are peerless."
          </blockquote>
          <div>
            <p className="text-blue-400 font-black tracking-widest uppercase text-sm">Eleanor Vance</p>
            <p className="text-slate-400 text-sm font-medium tracking-wide mt-1">Managing Partner, Vance & Associates</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;