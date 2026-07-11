import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';

const ToggleRow = ({ label, description, checked, onChange }) => (
  <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-4">
    <div className="min-w-0 pr-2">
      <p className="text-sm font-semibold text-slate-900">{label}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">{description}</p>
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition ${
        checked ? 'bg-[#0e7490]' : 'bg-slate-300'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

/**
 * Settings — account profile + preference toggles
 */
const Settings = () => {
  const { account, settingsPrefs, toggleSetting } = useWorkspace();

  return (
    <div className="page-shell">
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          Workspace Settings
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Account & Profile Preferences
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Manage your technician identity and notification preferences for this campus
          workspace.
        </p>
      </div>

      <div className="mx-auto max-w-3xl space-y-6">
        {/* Profile — read-only */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            Profile
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">Logged-in account</h2>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Full name
              </label>
              <input
                type="text"
                readOnly
                value={account.name}
                className="w-full cursor-default rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Email
              </label>
              <input
                type="email"
                readOnly
                value={account.email}
                className="w-full cursor-default rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Role
              </label>
              <input
                type="text"
                readOnly
                value={account.role}
                className="w-full cursor-default rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Campus
              </label>
              <input
                type="text"
                readOnly
                value={account.campus}
                className="w-full cursor-default rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 outline-none"
              />
            </div>
          </div>
        </section>

        {/* Preference toggles */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            Preferences
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">Notification & sync</h2>

          <div className="mt-5 space-y-3">
            <ToggleRow
              label="Push Notifications on New Issue Assignment"
              description="Get an immediate alert when a new issue is assigned to you."
              checked={settingsPrefs.pushOnAssignment}
              onChange={() => toggleSetting('pushOnAssignment')}
            />
            <ToggleRow
              label="Email Daily Maintenance Digests"
              description="Receive a morning summary of due routines and open work."
              checked={settingsPrefs.emailDailyDigest}
              onChange={() => toggleSetting('emailDailyDigest')}
            />
            <ToggleRow
              label="Enable Offline Workspace Caching"
              description="Keep recent asset and issue data available without a network connection."
              checked={settingsPrefs.offlineCaching}
              onChange={() => toggleSetting('offlineCaching')}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
