import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import { WorkspaceProvider } from './context/WorkspaceContext';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import StaffAuthPage from './pages/StaffAuthPage';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import AssetDetails from './pages/AssetDetails';
import PublicAssetPage from './pages/PublicAssetPage';
import ReportIssue from './pages/ReportIssue';
import Issues from './pages/Issues';
import MyIssues from './pages/MyIssues';
import Analytics from './pages/Analytics';
import ScheduledMaintenance from './pages/ScheduledMaintenance';
import Technicians from './pages/Technicians';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (!parsed.id && parsed._id) parsed.id = parsed._id;
        setToken(savedToken);
        setUser(parsed);
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    setReady(true);
  }, []);

  const saveSession = (data) => {
    const sessionUser = {
      id: data._id,
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role
    };
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(sessionUser));
    setToken(data.token);
    setUser(sessionUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = Boolean(token && user);
  const isAdmin = user?.role === 'admin';
  const homePath = '/dashboard';

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-deep">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/public/asset/:assetCode" element={<PublicAssetPage />} />
        <Route path="/public/asset/:assetCode/report" element={<ReportIssue />} />

        {!isAuthenticated ? (
          <>
            <Route path="/login" element={<LoginPage onAuthSuccess={saveSession} />} />
            <Route
              path="/signup"
              element={<StaffAuthPage onAuthSuccess={saveSession} />}
            />
            <Route path="/admin" element={<AdminLoginPage onAuthSuccess={saveSession} />} />
            <Route path="/admin-login" element={<Navigate to="/admin" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Navigate to={homePath} replace />} />
            <Route path="/signup" element={<Navigate to={homePath} replace />} />
            <Route path="/admin" element={<Navigate to={homePath} replace />} />
            <Route path="/admin-login" element={<Navigate to={homePath} replace />} />

            <Route
              element={
                <WorkspaceProvider sessionUser={user}>
                  <AppLayout user={user} onLogout={handleLogout} isAdmin={isAdmin} />
                </WorkspaceProvider>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/assets" element={<Assets />} />
              <Route
                path="/assets/:id"
                element={<AssetDetails token={token} isAdmin={isAdmin} />}
              />
              <Route path="/issues" element={<Issues />} />
              <Route
                path="/my-issues"
                element={<MyIssues token={token} user={user} />}
              />
              <Route path="/scheduled-maintenance" element={<ScheduledMaintenance />} />
              <Route path="/technicians" element={<Technicians />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/" element={<Navigate to={homePath} replace />} />
              <Route path="*" element={<Navigate to={homePath} replace />} />
            </Route>
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
