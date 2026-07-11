import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useWorkspace } from '../context/WorkspaceContext';
import AdminDashboard from './AdminDashboard';

const ASSIGNED_ISSUES = [
  {
    id: 'ISS-2026-0045',
    title: 'Hot water tap leaking',
    asset: 'Water Dispenser 05',
    location: 'Cafeteria',
    status: 'Assigned',
    priority: 'Low'
  },
  {
    id: 'ISS-2026-0046',
    title: 'Visitor check-in software freezing',
    asset: 'Reception Laptop 04',
    location: 'Reception',
    status: 'Assigned',
    priority: 'Medium'
  }
];

const priorityPill = (priority) => {
  const map = {
    Low: 'bg-slate-100 text-slate-600',
    Medium: 'bg-teal-50 text-teal-700',
    High: 'bg-orange-50 text-orange-700',
    Critical: 'bg-rose-50 text-rose-700'
  };
  return map[priority] || map.Low;
};

/**
 * Role-aware dashboard entry — Admin Management vs Technician work queue
 */
const Dashboard = () => {
  const { isAdmin, technicianKpis } = useWorkspace();

  if (isAdmin) {
    return <AdminDashboard />;
  }

  const { assignedIssues, highPriority, dueToday, inProgress, priorityMix } =
    technicianKpis;

  const kpiCards = [
    {
      title: 'Assigned issues',
      value: assignedIssues,
      hint: 'All issues currently visible to you',
      badge: 'bg-sky-100 text-sky-700'
    },
    {
      title: 'High priority',
      value: highPriority,
      hint: 'High and critical work items',
      badge: 'bg-amber-100 text-amber-700'
    },
    {
      title: 'Due today',
      value: dueToday,
      hint: 'Scheduled maintenance that needs attention today',
      badge: 'bg-rose-100 text-rose-700'
    },
    {
      title: 'In progress',
      value: inProgress,
      hint: 'Inspections, repairs, and parts waits underway',
      badge: 'bg-emerald-100 text-emerald-700'
    }
  ];

  const priorityLegend = [
    { name: 'Low', value: priorityMix.low, color: '#94a3b8' },
    { name: 'Medium', value: priorityMix.medium, color: '#14b8a6' },
    { name: 'High', value: priorityMix.high, color: '#f97316' },
    { name: 'Critical', value: priorityMix.critical, color: '#ef4444' }
  ];

  const assignedTotal = priorityLegend.reduce((sum, p) => sum + p.value, 0);
  const chartData = priorityLegend.filter((p) => p.value > 0);

  return (
    <div className="page-shell">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Technician Dashboard
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Focus on your assigned work, due schedules, and active maintenance tasks.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-slate-600">{card.title}</p>
              <span
                className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${card.badge}`}
              >
                {card.value}
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold tabular-nums tracking-tight text-slate-900">
              {card.value}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">{card.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:col-span-8">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Assigned Issues
              </p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900">Work queue</h2>
            </div>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
              Technician
            </span>
          </div>

          <ul className="space-y-3">
            {ASSIGNED_ISSUES.map((issue) => (
              <li key={issue.id}>
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-left transition hover:border-slate-300 hover:bg-slate-50/80"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[11px] font-medium text-slate-400">
                      {issue.id}
                    </p>
                    <p className="mt-1 truncate text-sm font-semibold text-slate-900">
                      <span className="mr-1 text-slate-400">•</span>
                      {issue.title}
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {issue.asset} • {issue.location}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5 sm:flex-row sm:items-center">
                    <span className="inline-flex rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-semibold text-sky-700">
                      {issue.status}
                    </span>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${priorityPill(
                        issue.priority
                      )}`}
                    >
                      {issue.priority}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:col-span-4">
          <div className="mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Maintenance Status
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">Priority mix</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative h-36 w-36 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={64}
                    paddingAngle={2}
                    strokeWidth={0}
                  >
                    {chartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[11px] font-medium leading-tight text-slate-500">
                  Assigned
                </span>
                <span className="text-2xl font-bold tabular-nums text-slate-900">
                  {assignedTotal}
                </span>
              </div>
            </div>

            <ul className="min-w-0 flex-1 space-y-2.5">
              {priorityLegend.map((item) => (
                <li key={item.name} className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-sm text-slate-600">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}
                  </span>
                  <span className="text-sm font-semibold tabular-nums text-slate-900">
                    {item.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
