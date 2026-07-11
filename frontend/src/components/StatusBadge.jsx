import React from 'react';

const STATUS_STYLES = {
  Reported: 'bg-amber-50 text-amber-700 ring-amber-200',
  Assigned: 'bg-sky-50 text-sky-700 ring-sky-200',
  'Inspection Started': 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  'Maintenance In Progress': 'bg-orange-50 text-orange-700 ring-orange-200',
  'In Progress': 'bg-orange-50 text-orange-700 ring-orange-200',
  'Waiting for Parts': 'bg-slate-100 text-slate-600 ring-slate-200',
  Resolved: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Closed: 'bg-slate-100 text-slate-500 ring-slate-200',
  Reopened: 'bg-rose-50 text-rose-700 ring-rose-200',
  Operational: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  'Out of Service': 'bg-rose-50 text-rose-700 ring-rose-200',
  'Under Maintenance': 'bg-amber-50 text-amber-700 ring-amber-200',
  Retired: 'bg-slate-100 text-slate-500 ring-slate-200',
  Pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  Scheduled: 'bg-sky-50 text-sky-700 ring-sky-200',
  Completed: 'bg-emerald-50 text-emerald-700 ring-emerald-200'
};

const PRIORITY_STYLES = {
  Low: 'bg-slate-100 text-slate-600 ring-slate-200',
  Medium: 'bg-teal-50 text-teal-700 ring-teal-200',
  High: 'bg-orange-50 text-orange-700 ring-orange-200',
  Critical: 'bg-rose-50 text-rose-700 ring-rose-200'
};

const CONDITION_STYLES = {
  Poor: 'bg-rose-50 text-rose-700 ring-rose-200',
  Fair: 'bg-amber-50 text-amber-700 ring-amber-200',
  Good: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Excellent: 'bg-emerald-50 text-emerald-700 ring-emerald-200'
};

const StatusBadge = ({ status, type = 'status' }) => {
  const map =
    type === 'priority'
      ? PRIORITY_STYLES
      : type === 'condition'
        ? CONDITION_STYLES
        : STATUS_STYLES;

  const colorClass = map[status] || 'bg-slate-100 text-slate-600 ring-slate-200';

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ring-1 ring-inset ${colorClass}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
