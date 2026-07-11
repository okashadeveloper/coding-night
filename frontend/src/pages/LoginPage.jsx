import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const DEMO_ADMIN = {
  email: 'admin@assetcare.demo',
  password: 'admin123',
  name: 'Alen Malkoč',
  role: 'admin',
  label: 'Administrator'
};

const DEMO_TECH = {
  email: 'technician@assetcare.demo',
  password: 'tech123',
  name: 'Ahmed Raza',
  role: 'technician',
  label: 'Technician'
};

const FEATURES = [
  {
    title: 'QR asset access',
    body: 'Public, mobile-first pages for reporting issues in seconds.'
  },
  {
    title: 'Operational visibility',
    body: 'Track issue priority, technician load, maintenance schedules, and evidence.'
  },
  {
    title: 'Maintenance history',
    body: 'Keep a full timeline of inspections, repairs, and service records.'
  }
];

const isAdminDemo = (email, password) =>
  email === DEMO_ADMIN.email && password === DEMO_ADMIN.password;

const isTechDemo = (email, password) =>
  email === DEMO_TECH.email && password === DEMO_TECH.password;

/**
 * Public sign-in — Administrator + Technician demo roles
 */
const LoginPage = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeDemo, setActiveDemo] = useState(null); // 'admin' | 'tech' | null

  const fillDemo = (type) => {
    if (type === 'admin') {
      setEmail(DEMO_ADMIN.email);
      setPassword(DEMO_ADMIN.password);
    } else {
      setEmail(DEMO_TECH.email);
      setPassword(DEMO_TECH.password);
    }
    setActiveDemo(type);
    setError('');
  };

  const completeSession = (payload) => {
    void remember;
    onAuthSuccess(payload);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    try {
      // ——— Administrator demo ———
      if (isAdminDemo(trimmedEmail, trimmedPassword)) {
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/admin-login`, {
            email: DEMO_ADMIN.email,
            password: DEMO_ADMIN.password
          });
          const data = res.data?.data;
          if (data?.token) {
            completeSession({
              ...data,
              name: DEMO_ADMIN.name,
              role: 'admin',
              email: DEMO_ADMIN.email
            });
            return;
          }
        } catch {
          // Backend unavailable — still accept admin demo credentials
        }

        completeSession({
          _id: 'demo-admin-alen',
          name: DEMO_ADMIN.name,
          email: DEMO_ADMIN.email,
          role: 'admin',
          token: 'demo-admin-token'
        });
        return;
      }

      // ——— Technician demo / DB users ———
      let res;
      try {
        res = await axios.post(`${API_BASE_URL}/auth/login`, {
          email: trimmedEmail,
          password: trimmedPassword
        });
      } catch (loginErr) {
        if (isTechDemo(trimmedEmail, trimmedPassword)) {
          try {
            await axios.post(`${API_BASE_URL}/auth/register`, {
              name: DEMO_TECH.name,
              email: DEMO_TECH.email,
              password: DEMO_TECH.password,
              role: 'technician'
            });
            res = await axios.post(`${API_BASE_URL}/auth/login`, {
              email: DEMO_TECH.email,
              password: DEMO_TECH.password
            });
          } catch {
            // Backend unavailable — accept technician demo locally
            completeSession({
              _id: 'demo-tech-ahmed',
              name: DEMO_TECH.name,
              email: DEMO_TECH.email,
              role: 'technician',
              token: 'demo-tech-token'
            });
            return;
          }
        } else {
          throw loginErr;
        }
      }

      const data = res.data?.data;
      if (!data?.token) {
        setError('Unexpected response from server');
        return;
      }

      // Normalize technician demo display name
      if (isTechDemo(trimmedEmail, trimmedPassword)) {
        completeSession({
          ...data,
          name: DEMO_TECH.name,
          role: data.role || 'technician',
          email: DEMO_TECH.email
        });
        return;
      }

      completeSession(data);
    } catch (err) {
      setError(
        err.code === 'ERR_NETWORK'
          ? 'Cannot reach backend at localhost:5000'
          : err.response?.data?.message || 'Invalid email or password'
      );
    } finally {
      setLoading(false);
    }
  };

  const demoCardClass = (type) =>
    `w-full rounded-xl border px-4 py-3 text-left transition ${
      activeDemo === type
        ? 'border-cyan-600 bg-cyan-50 ring-1 ring-cyan-600/20'
        : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
    }`;

  return (
    <div className="flex min-h-screen bg-brand-deep font-sans text-slate-900">
      <aside className="relative hidden w-[58%] flex-col overflow-hidden bg-gradient-to-br from-brand-deep via-brand to-[#0c4a6e] px-10 py-8 lg:flex xl:px-14">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(8,145,178,0.35), transparent 45%), radial-gradient(circle at 80% 80%, rgba(14,116,144,0.25), transparent 40%)'
          }}
        />

        <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-sm font-bold tracking-tight text-white ring-1 ring-white/20">
              AC
            </div>
            <div>
              <p className="text-base font-semibold text-white">AssetCare</p>
              <p className="text-xs text-cyan-100/70">Scan. Report. Maintain.</p>
            </div>
          </div>

          <div className="mt-16 flex flex-1 flex-col justify-center xl:mt-20">
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] xl:items-start xl:gap-10">
              <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-white xl:text-6xl">
                Scan.
                <br />
                Report.
                <br />
                Maintain.
              </h1>
              <p className="max-w-md text-sm leading-relaxed text-cyan-50/80 xl:pt-3 xl:text-[15px]">
                Every physical asset deserves a complete digital maintenance history.
                AssetCare helps teams move from QR access to issue reporting, technician
                execution, and immutable service records in one workflow.
              </p>
            </div>

            <div className="mt-12 max-w-xl space-y-3">
              {FEATURES.map((f) => (
                <div key={f.title} className="feature-capsule">
                  <p className="text-sm font-semibold text-white">{f.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-cyan-100/65">{f.body}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 mt-auto pt-8 text-xs text-cyan-100/40">
            © {new Date().getFullYear()} AssetCare · SMIT Technology Campus
          </p>
        </div>
      </aside>

      <main className="flex w-full flex-1 items-center justify-center bg-slate-100 px-4 py-10 sm:px-8 lg:w-[42%]">
        <div className="w-full max-w-[420px]">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-sm font-bold text-white">
              AC
            </div>
            <div>
              <p className="font-semibold text-slate-900">AssetCare</p>
              <p className="text-xs text-slate-500">Scan. Report. Maintain.</p>
            </div>
          </div>

          <div className="card-light p-7 sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-700">
              SMIT Technology Campus
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
              Sign in to your workspace
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Use the demo accounts below to experience the admin and technician flows.
            </p>

            {error && (
              <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4" autoComplete="off">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  name="assetcare-email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setActiveDemo(null);
                  }}
                  required
                  autoComplete="off"
                  placeholder="name@assetcare.demo"
                  className="input-light"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  name="assetcare-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setActiveDemo(null);
                  }}
                  required
                  autoComplete="new-password"
                  placeholder="Enter your password"
                  className="input-light"
                />
              </div>

              <label className="flex cursor-pointer items-center gap-2.5 select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-cyan-700 focus:ring-cyan-600/30"
                />
                <span className="text-sm text-slate-600">Remember me on this device</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary mt-1 w-full rounded-xl py-3 text-[15px] disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Login to AssetCare'}
              </button>
            </form>

            <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Demo access
              </p>

              <button
                type="button"
                onClick={() => fillDemo('admin')}
                className={demoCardClass('admin')}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Administrator</p>
                    <p className="mt-0.5 font-mono text-[11px] text-slate-500">
                      {DEMO_ADMIN.email} / {DEMO_ADMIN.password}
                    </p>
                  </div>
                  <span className="shrink-0 text-[11px] font-semibold text-cyan-700">
                    Use admin account
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => fillDemo('tech')}
                className={demoCardClass('tech')}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Technician</p>
                    <p className="mt-0.5 font-mono text-[11px] text-slate-500">
                      {DEMO_TECH.email} / {DEMO_TECH.password}
                    </p>
                  </div>
                  <span className="shrink-0 text-[11px] font-semibold text-cyan-700">
                    Use technician account
                  </span>
                </div>
              </button>
            </div>

            <p className="mt-5 text-center text-xs text-slate-400">
              Need a new technician account?{' '}
              <Link to="/signup" className="font-medium text-cyan-700 hover:text-cyan-800">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
