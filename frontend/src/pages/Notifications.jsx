import React from 'react';
import {
  HiOutlineExclamation,
  HiOutlineClipboardList,
  HiOutlineCog,
  HiOutlineBell
} from 'react-icons/hi';
import { useWorkspace } from '../context/WorkspaceContext';

const typeMeta = {
  'Critical Alert': {
    icon: HiOutlineExclamation,
    badge: 'bg-rose-50 text-rose-700 ring-rose-200',
    iconWrap: 'bg-rose-50 text-rose-600'
  },
  'Task Assignment': {
    icon: HiOutlineClipboardList,
    badge: 'bg-sky-50 text-sky-700 ring-sky-200',
    iconWrap: 'bg-sky-50 text-sky-600'
  },
  'System Update': {
    icon: HiOutlineCog,
    badge: 'bg-slate-100 text-slate-600 ring-slate-200',
    iconWrap: 'bg-slate-100 text-slate-600'
  }
};

/**
 * Notifications — interactive system alert stream
 */
const Notifications = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead
  } = useWorkspace();

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="page-shell">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            System Alerts
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Recent Activity Stream
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Live feed of critical reports, assignments, and asset status changes.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllNotificationsRead}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Mark all as read ({unreadCount})
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <ul className="divide-y divide-slate-100">
          {notifications.map((alert) => {
            const meta = typeMeta[alert.type] || {
              icon: HiOutlineBell,
              badge: 'bg-slate-100 text-slate-600 ring-slate-200',
              iconWrap: 'bg-slate-100 text-slate-600'
            };
            const Icon = meta.icon;

            return (
              <li key={alert.id}>
                <button
                  type="button"
                  onClick={() => markNotificationRead(alert.id)}
                  className={`flex w-full items-start gap-4 px-5 py-4 text-left transition hover:bg-slate-50/80 sm:px-6 ${
                    alert.unread ? 'bg-sky-50/40' : 'bg-white'
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.iconWrap}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${meta.badge}`}
                      >
                        [{alert.type}]
                      </span>
                      {alert.unread && (
                        <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                      )}
                    </div>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-slate-800">
                      {alert.message}
                    </p>
                    <p className="mt-1.5 text-xs text-slate-400">{alert.timestamp}</p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Notifications;
