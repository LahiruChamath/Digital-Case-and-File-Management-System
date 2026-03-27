import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, Scale, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-apple-bg p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-apple-lg overflow-hidden p-8 sm:p-10 animate-in fade-in zoom-in-95 duration-300">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-10 text-center">
          <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center shadow-apple-sm">
            <Scale className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="block text-xl font-bold tracking-tight text-apple-text">W P Law</span>
          </div>
        </div>

        {success ? (
          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-20 h-20 bg-green-50 text-status-active rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10" strokeWidth={2} />
            </div>
            <h2 className="text-2xl font-bold text-apple-text mb-3 tracking-tight">Check your email</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              We've sent a password reset link to <span className="font-bold text-apple-text">{email}</span>. 
              Please check your inbox and follow the instructions.
            </p>
            <Link 
              to="/login"
              className="flex items-center justify-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-apple-text mb-2 tracking-tight">Forgot Password?</h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                Enter your registered email address and we'll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2 pl-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="clean-input pl-12"
                    placeholder="name@wplaw.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-base font-bold shadow-apple-sm transition-all active:scale-[0.98] flex items-center justify-center gap-3"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : null}
                {loading ? 'Sending link...' : 'Send Reset Link'}
              </button>

              <div className="text-center pt-2">
                <Link 
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-apple-text transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Return to Sign In
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
