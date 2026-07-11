import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import StatusBadge from '../components/StatusBadge';
import {
  ANALYTICS_CONDITION,
  ANALYTICS_PRIORITY,
  ANALYTICS_REPEAT_REPAIRS,
  ANALYTICS_UPCOMING_MAINTENANCE,
  DEMO_ISSUES
} from '../data/demoWorkspace';

const DonutCard = ({ eyebrow, title, centerLabel, centerValue, data, legend }) => {
  const chartData = data.filter((d) => d.value > 0);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-lg font-semibold text-slate-900">{title}</h2>

      <div className="mt-5 flex items-center gap-5">
        <div className="relative h-40 w-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={68}
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
            <span className="text-[11px] font-medium text-slate-500">{centerLabel}</span>
            <span className="text-2xl font-bold tabular-nums text-slate-900">{centerValue}</span>
          </div>
        </div>

        <ul className="min-w-0 flex-1 space-y-2.5">
          {(legend || data).map((item) => (
            <li key={item.name} className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-sm text-slate-600">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
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
  );
};

/**
 * Analytics workspace — condition/priority rings, live queue, planning, repeat repairs
 */
const Analytics = () => {
  const conditionTotal = ANALYTICS_CONDITION.reduce((s, d) => s + d.value, 0);
  const priorityTotal = ANALYTICS_PRIORITY.reduce((s, d) => s + d.value, 0);
  const recentIssues = DEMO_ISSUES;

  return (
    <div className="page-shell">
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          Operations intelligence
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Analytics
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Condition mix, issue priority load, live reports, and repair frequency across campus
          assets.
        </p>
      </div>

      {/* Dual donut boards */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DonutCard
          eyebrow="Asset health"
          title="Condition distribution"
          centerLabel="Condition"
          centerValue={conditionTotal}
          data={ANALYTICS_CONDITION}
        />
        <DonutCard
          eyebrow="Issue load"
          title="Priority distribution"
          centerLabel="Priority"
          centerValue={priorityTotal}
          data={ANALYTICS_PRIORITY}
        />
      </div>

      {/* Streams + bar chart */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Live queue */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 xl:col-span-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Live queue
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">Recently reported issues</h2>
          <ul className="mt-5 space-y-3">
            {recentIssues.map((issue) => (
              <li
                key={issue.id}
                className="rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 transition hover:border-slate-300 hover:bg-white"
              >
                <p className="text-sm font-semibold text-slate-900">{issue.title}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {issue.issueNumber} • {issue.asset}
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  <StatusBadge status={issue.status} />
                  <StatusBadge status={issue.priority} type="priority" />
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Planning stream */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 xl:col-span-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Planning stream
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">Upcoming maintenance</h2>
          <ul className="mt-5 space-y-3">
            {ANALYTICS_UPCOMING_MAINTENANCE.map((job) => (
              <li
                key={job.id}
                className="rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{job.asset}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-slate-400">{job.code}</p>
                  </div>
                  {job.overdue ? (
                    <span className="shrink-0 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700 ring-1 ring-inset ring-rose-200">
                      Overdue
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                      Planned
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs text-slate-500">{job.type}</p>
                <p className="mt-1 text-xs font-medium text-slate-700">Due {job.due}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Repeat work bar chart */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 xl:col-span-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Repeat work
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">
            Most frequently repaired assets
          </h2>
          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ANALYTICS_REPEAT_REPAIRS}
                layout="vertical"
                margin={{ top: 4, right: 12, left: 8, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={108}
                  tick={{ fontSize: 11, fill: '#475569' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(6, 45, 61, 0.04)' }}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #e2e8f0',
                    fontSize: 12
                  }}
                />
                <Bar dataKey="count" name="Repairs" fill="#0e7490" radius={[0, 6, 6, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Analytics;
