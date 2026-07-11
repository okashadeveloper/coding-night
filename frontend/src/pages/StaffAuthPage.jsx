import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/** Technician signup — light card on brand background */
const StaffAuthPage = ({ onAuthSuccess }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      const res = await axios.post(`${API_BASE_URL}/auth/register`, {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: 'technician'
      });

      const data = res.data.data;
      if (!data?.token) {
        setError('Unexpected response from server');
        return;
      }

      onAuthSuccess(data);
    } catch (err) {
      setError(
        err.code === 'ERR_NETWORK'
          ? 'Cannot reach backend at localhost:5000'
          : err.response?.data?.message || 'Registration failed'
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
            <p className="text-xs text-cyan-100/70">Technician signup</p>
          </div>
        </div>

        <div className="card-light p-7 sm:p-8">
          <h1 className="text-2xl font-semibold text-slate-900">Create technician account</h1>
          <p className="mt-2 text-sm text-slate-500">
            Public registration is limited to technician roles.
          </p>

          {error && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" autoComplete="off">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your name"
                className="input-light"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="email@example.com"
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
                minLength={6}
                placeholder="••••••••"
                className="input-light"
              />
            </div>

            <div className="rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3">
              <p className="text-sm font-semibold text-cyan-900">Role: Technician</p>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-cyan-700 hover:text-cyan-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StaffAuthPage;
