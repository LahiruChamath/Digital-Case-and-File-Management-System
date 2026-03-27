import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CaseManagement from './pages/CaseManagement';
import ClientProfiles from './pages/ClientProfiles';
import CourtCalendar from './pages/CourtCalendar';
import Documents from './pages/Documents';
import ExpensesBilling from './pages/ExpensesBilling';
import AdminPanel from './pages/AdminPanel';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import ProtectedRoute from './components/common/ProtectedRoute';

import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="cases" element={<CaseManagement />} />
              <Route path="clients" element={<ClientProfiles />} />
              <Route path="calendar" element={<CourtCalendar />} />
              <Route path="documents" element={<Documents />} />
              <Route path="expenses" element={<ExpensesBilling />} />
              
              {/* Admin Only Routes */}
              <Route element={<ProtectedRoute allowedRoles={['Senior Lawyer']} />}>
                <Route path="admin" element={<AdminPanel />} />
              </Route>
            </Route>
          </Route>

          {/* Catch all - Redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
    </ToastProvider>
  );
}

export default App;