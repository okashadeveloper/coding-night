import React, { useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import { useWorkspace } from '../context/WorkspaceContext';

/**
 * Issues directory — admin can assign / change status
 */
const Issues = () => {
  const { isAdmin, issues, technicians, assignIssue, updateIssue } = useWorkspace();
  const [selectedId, setSelectedId] = useState(null);
  const selected = issues.find((i) => i.id === selectedId) || null;

  return (
    <div className="page-shell">
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          Active Reports
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Issues
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Track reported faults, priority, assignment, and update history across campus assets.
          {isAdmin && (
            <span className="ml-1 font-medium text-cyan-700">
              Administrator dispatch controls enabled.
            </span>
          )}
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                {[
                  'Issue',
                  'Asset',
                  'Title',
                  'Reporter',
                  'Priority',
                  'Status',
                  'Assigned Technician',
                  'Reported',
                  'Last Updated',
                  'Actions'
                ].map((h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr
                  key={issue.id}
                  className="border-b border-slate-100 transition hover:bg-slate-50/80 last:border-b-0"
                >
                  <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs font-semibold text-slate-700">
                    {issue.issueNumber}
                  </td>
                  <td className="px-4 py-3.5 text-sm font-medium text-slate-800">
                    {issue.asset}
                  </td>
                  <td className="max-w-[220px] px-4 py-3.5">
                    <p className="truncate text-sm text-slate-700">{issue.title}</p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-600">
                    {issue.reporter}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={issue.priority} type="priority" />
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={issue.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-600">
                    {issue.assignedTechnician === 'Unassigned' ? (
                      <span className="font-medium text-slate-400">Unassigned</span>
                    ) : (
                      issue.assignedTechnician
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-500">
                    {issue.reportedAt}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-500">
                    {issue.lastUpdated}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedId(issue.id)}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                      >
                        Open
                      </button>
                      {isAdmin && (
                        <>
                          {(issue.assignedTechnician === 'Unassigned' ||
                            issue.status === 'Reported') && (
                            <select
                              defaultValue=""
                              onChange={(e) => {
                                if (e.target.value) assignIssue(issue.id, e.target.value);
                              }}
                              className="rounded-lg border border-sky-200 bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-800 outline-none"
                            >
                              <option value="">Assign tech…</option>
                              {technicians.map((t) => (
                                <option key={t.id} value={t.name}>
                                  {t.name}
                                </option>
                              ))}
                            </select>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              updateIssue(issue.id, {
                                status: 'Closed',
                                lastUpdated: 'Just now'
                              })
                            }
                            className="text-xs font-semibold text-rose-600 underline-offset-2 hover:underline"
                          >
                            Close Issue
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/30"
            aria-label="Close panel"
            onClick={() => setSelectedId(null)}
          />
          <aside className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-xl">
            <div className="border-b border-slate-100 px-6 py-5">
              <p className="font-mono text-xs font-semibold text-slate-400">
                {selected.issueNumber}
              </p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">{selected.title}</h2>
              <p className="mt-1 text-sm text-slate-500">{selected.asset}</p>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={selected.priority} type="priority" />
                <StatusBadge status={selected.status} />
              </div>
              {[
                ['Reporter', selected.reporter],
                ['Assigned technician', selected.assignedTechnician],
                ['Reported', selected.reportedAt],
                ['Last updated', selected.lastUpdated]
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    {label}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-800">{value}</p>
                </div>
              ))}
              {isAdmin && (
                <div className="rounded-xl border border-cyan-100 bg-cyan-50/50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-cyan-700">
                    Administrator
                  </p>
                  <label className="mt-2 block text-xs font-medium text-slate-600">
                    Reassign technician
                  </label>
                  <select
                    className="input-light mt-1.5"
                    value={
                      selected.assignedTechnician === 'Unassigned'
                        ? ''
                        : selected.assignedTechnician
                    }
                    onChange={(e) => {
                      if (e.target.value) assignIssue(selected.id, e.target.value);
                    }}
                  >
                    <option value="">Select…</option>
                    {technicians.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="border-t border-slate-100 px-6 py-4">
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Issues;
