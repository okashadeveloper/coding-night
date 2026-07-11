import React from 'react';
import { HiOutlineCalendar } from 'react-icons/hi';
import StatusBadge from '../components/StatusBadge';
import { useWorkspace } from '../context/WorkspaceContext';

/**
 * Scheduled Maintenance — vertical timeline of upcoming routines
 */
const ScheduledMaintenance = () => {
  const { scheduledMaintenance, updateScheduleItem } = useWorkspace();

  return (
    <div className="page-shell">
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          Scheduled Maintenance
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Upcoming Routines
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Track planned inspections, service windows, and assigned maintenance crews.
        </p>
      </div>

      <div className="relative space-y-4">
        {/* Timeline rail */}
        <div
          className="absolute bottom-4 left-[27px] top-4 w-px bg-sky-100"
          aria-hidden
        />

        {scheduledMaintenance.map((item) => (
          <article
            key={item.id}
            className="relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 sm:p-6"
          >
            <div className="flex gap-4">
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-100">
                <HiOutlineCalendar className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900">
                      {item.assetName}{' '}
                      <span className="font-mono text-xs font-medium text-slate-400">
                        ({item.assetCode})
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-slate-700">{item.task}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <StatusBadge status={item.priority} type="priority" />
                    <StatusBadge status={item.status} />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Assigned to
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-800">{item.assignedTo}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Due date
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-800">{item.dueDate}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Status
                    </p>
                    <select
                      value={item.status}
                      onChange={(e) =>
                        updateScheduleItem(item.id, { status: e.target.value })
                      }
                      className="mt-1 w-full bg-transparent text-sm font-medium text-slate-800 outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ScheduledMaintenance;
