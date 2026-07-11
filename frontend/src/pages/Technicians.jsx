import React from 'react';
import { useWorkspace } from '../context/WorkspaceContext';

const availabilityStyles = {
  'On-Duty': {
    pill: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    dot: 'bg-emerald-500'
  },
  'On Leave': {
    pill: 'bg-amber-50 text-amber-700 ring-amber-200',
    dot: 'bg-amber-500'
  },
  Offline: {
    pill: 'bg-slate-100 text-slate-600 ring-slate-200',
    dot: 'bg-slate-400'
  }
};

/**
 * Technician Directory — professional staff profile cards
 */
const Technicians = () => {
  const { technicians, updateTechnician } = useWorkspace();

  return (
    <div className="page-shell">
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          Technician Directory
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Active Maintenance Staff
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Campus crew roster, specialization, and current assignment load.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {technicians.map((tech) => {
          const style =
            availabilityStyles[tech.availability] || availabilityStyles.Offline;

          return (
            <article
              key={tech.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#062d3d] text-sm font-bold text-white">
                  {tech.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-base font-bold text-slate-900">{tech.name}</h2>
                  <p className="mt-0.5 text-xs text-slate-500">{tech.role}</p>
                  <span
                    className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${style.pill}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                    {tech.availability}
                  </span>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Specialization
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {tech.specialization}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Active load
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {tech.activeLoadLabel}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Availability
                </label>
                <select
                  value={tech.availability}
                  onChange={(e) =>
                    updateTechnician(tech.id, { availability: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-600/20"
                >
                  <option value="On-Duty">On-Duty</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default Technicians;
