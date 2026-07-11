import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  HiOutlineViewGrid,
  HiOutlineCube,
  HiOutlineExclamationCircle,
  HiOutlineCalendar,
  HiOutlineUserGroup,
  HiOutlineChartBar,
  HiOutlineBell,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineMenuAlt2,
  HiOutlineX
} from 'react-icons/hi';
import { useWorkspace } from '../context/WorkspaceContext';

/** Technician workspace nav only — no admin-only menu configs */
const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: HiOutlineViewGrid, end: true },
  { to: '/assets', label: 'Assets', icon: HiOutlineCube },
  { to: '/issues', label: 'Issues', icon: HiOutlineExclamationCircle },
  {
    to: '/scheduled-maintenance',
    label: 'Scheduled Maintenance',
    icon: HiOutlineCalendar
  },
  { to: '/technicians', label: 'Technicians', icon: HiOutlineUserGroup },
  { to: '/analytics', label: 'Analytics', icon: HiOutlineChartBar },
  { to: '/notifications', label: 'Notifications', icon: HiOutlineBell },
  { to: '/settings', label: 'Settings', icon: HiOutlineCog }
];

const AppLayout = ({ onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { profile, workplace } = useWorkspace();

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
      isActive
        ? 'bg-white/15 font-semibold text-white'
        : 'font-medium text-slate-300 hover:bg-white/5 hover:text-white'
    }`;

  const SidebarBody = () => (
    <div className="flex h-full min-h-screen flex-col bg-[#062d3d]">
      {/* Brand header */}
      <div className="px-4 pt-6">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-sm font-bold text-white">
            AC
          </div>
          <div className="min-w-0">
            <p className="text-xl font-bold text-white">AssetCare</p>
            <p className="mt-0.5 text-xs text-teal-400">Scan. Report. Maintain.</p>
          </div>
        </div>

        {/* SMIT campus context card */}
        <div className="mx-2 my-4 rounded-xl border border-white/5 bg-white/10 p-4 backdrop-blur-md">
          <p className="text-sm font-bold text-white">{workplace.name}</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-300">
            {workplace.description}
          </p>
        </div>
      </div>

      {/* Navigation — technician routes only */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-2">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={navClass}
            onClick={() => setMobileOpen(false)}
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden />
            <span className="leading-snug">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Profile footer */}
      <div className="mt-auto border-t border-white/10 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-semibold text-white">
            {profile.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{profile.name}</p>
            <p className="truncate text-xs text-slate-400">{profile.title}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <HiOutlineLogout className="h-4 w-4 shrink-0" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900">
      {/* Desktop — solid dark teal, fixed full height */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden h-screen w-72 flex-col bg-[#062d3d] lg:flex">
        <SidebarBody />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex h-screen w-72 flex-col bg-[#062d3d] shadow-xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-4 z-10 rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
            >
              <HiOutlineX className="h-5 w-5" />
            </button>
            <SidebarBody />
          </aside>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col lg:pl-72">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200/80 bg-[#f8fafc]/95 px-4 py-3 backdrop-blur-md lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 shadow-sm"
          >
            <HiOutlineMenuAlt2 className="h-5 w-5" />
          </button>
          <span className="text-base font-semibold text-slate-900">AssetCare</span>
        </header>

        <main className="flex-1 overflow-x-hidden bg-[#f8fafc]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
