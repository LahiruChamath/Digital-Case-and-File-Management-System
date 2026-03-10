import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Scale, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
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
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-apple-text mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-gray-500 text-sm">Please enter your credentials to access the secure portal.</p>
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
                className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
              />
              <label htmlFor="remember" className="text-sm text-gray-600 font-medium">
                Keep me signed in
              </label>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-3.5 text-base"
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Access requires authorization.{' '}
            <button className="text-apple-text font-semibold hover:underline transition-all">
              Request access
            </button>
          </p>
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
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        <div className="relative z-10 max-w-xl">
          <blockquote className="text-white text-3xl font-semibold leading-snug mb-8 tracking-tight">
            "W P Law defines the modern approach to legal management. The interface is remarkably intuitive and responsive."
          </blockquote>
          <div>
            <p className="text-white font-bold tracking-wide">Eleanor Vance</p>
            <p className="text-gray-300 text-sm font-medium mt-1">Managing Partner, Vance & Associates</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;