

import React from 'react';
import { AuthProvider, useAuth } from './components/AuthProvider';
import Login from './components/Login';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import DataManagement from './pages/DataManagement';
import Transactions from './components/ui/Transactions';
import Funds from './pages/Funds';
import Tasks from './pages/Tasks';
import Placeholder from './pages/Placeholder';
import Payroll from './pages/Payroll';
import Invoices from './pages/Invoices';
import Employees from './pages/Employees';
import Vendors from './pages/Vendors';
import Reports from './pages/Reports';
import Timesheets from './pages/Timesheets';

function ProtectedRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (!user) return <Login />;
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/data" element={<DataManagement />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/funds" element={<Funds />} />
        <Route path="/timesheets" element={<Timesheets />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <ProtectedRoutes />
      </HashRouter>
    </AuthProvider>
  );
}

export default App;