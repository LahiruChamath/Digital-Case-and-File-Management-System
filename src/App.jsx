import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import MatterManagement from './pages/MatterManagement';
import ClientProfiles from './pages/ClientProfiles';
import CourtCalendar from './pages/CourtCalendar';
import Documents from './pages/Documents';
import ExpensesBilling from './pages/ExpensesBilling';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="matters" element={<MatterManagement />} />
          <Route path="clients" element={<ClientProfiles />} />
          <Route path="calendar" element={<CourtCalendar />} />
          <Route path="documents" element={<Documents />} />
          <Route path="expenses" element={<ExpensesBilling />} />
          <Route path="admin" element={<AdminPanel />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;