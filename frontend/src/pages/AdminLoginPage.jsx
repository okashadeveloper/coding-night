import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Dedicated administrator sign-in (separate from public technician login)
 */
const AdminLoginPage = ({ onAuthSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/admin-login`, {
        email: email.trim().toLowerCase(),
        password
      });

      const data = res.data.data;
      if (!data?.token) {
        setError('Unexpected response from server');
        return;
      }

      onAuthSuccess(data);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(
        err.code === 'ERR_NETWORK'
          ? 'Cannot reach backend at localhost:5000'
          : err.response?.data?.message || 'Invalid administrator credentials'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-deep px-4 py-10 font-sans">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-sm font-bold text-white ring-1 ring-white/20">
            AC
          </div>
          <div>
            <p className="font-semibold text-white">AssetCare</p>
            <p className="text-xs text-cyan-100/70">Administrator access</p>
          </div>
        </div>

        <div className="card-light p-7 sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-700">
            Restricted
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">Admin sign-in</h1>
          <p className="mt-2 text-sm text-slate-500">
            Platform administrators use this dedicated route. Technician workspace login is
            available at the public sign-in page.
          </p>

          {error && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" autoComplete="off">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@assetcare.demo"
                className="input-light"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter admin password"
                className="input-light"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading ? 'Signing in...' : 'Sign in as administrator'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
