import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineCube,
  HiOutlineCheckCircle,
  HiOutlineExclamation,
  HiOutlineFire,
  HiOutlineClock,
  HiOutlineUsers,
  HiOutlineX
} from 'react-icons/hi';
import StatusBadge from '../components/StatusBadge';
import { useWorkspace } from '../context/WorkspaceContext';

const CONDITIONS = ['Excellent', 'Good', 'Fair', 'Poor'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

/**
 * Admin Management Dashboard — quick actions + campus overview
 */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const {
    stats,
    profile,
    assets,
    issues,
    technicians,
    addAsset,
    assignIssue,
    addScheduledRoutine
  } = useWorkspace();

  const [panel, setPanel] = useState(null); // 'register' | 'dispatch' | 'routine' | null
  const [toast, setToast] = useState('');

  const [assetForm, setAssetForm] = useState({
    name: '',
    category: '',
    location: '',
    condition: 'Good'
  });

  const [routineForm, setRoutineForm] = useState({
    assetName: '',
    assetCode: '',
    task: '',
    assignedTo: 'Bilal Khan',
    dueDate: '',
    priority: 'Medium'
  });

  const [dispatchPick, setDispatchPick] = useState({});

  const unassignedIssues = useMemo(
    () =>
      issues.filter(
        (i) =>
          i.assignedTechnician === 'Unassigned' ||
          i.status === 'Reported'
      ),
    [issues]
  );

  const techNames = technicians.map((t) => t.name);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2800);
  };

  const closePanel = () => setPanel(null);

  const handleRegisterAsset = (e) => {
    e.preventDefault();
    if (!assetForm.name.trim() || !assetForm.category.trim() || !assetForm.location.trim()) {
      return;
    }
    addAsset({
      name: assetForm.name.trim(),
      category: assetForm.category.trim(),
      location: assetForm.location.trim(),
      condition: assetForm.condition
    });
    setAssetForm({ name: '', category: '', location: '', condition: 'Good' });
    closePanel();
    showToast('Asset registered successfully');
  };

  const handleDispatch = (issueId) => {
    const tech = dispatchPick[issueId];
    if (!tech) return;
    assignIssue(issueId, tech);
    showToast(`Issue assigned to ${tech}`);
  };

  const handleCreateRoutine = (e) => {
    e.preventDefault();
    if (!routineForm.assetName.trim() || !routineForm.task.trim() || !routineForm.dueDate.trim()) {
      return;
    }
    const formattedDue = (() => {
      const d = new Date(`${routineForm.dueDate}T12:00:00`);
      if (Number.isNaN(d.getTime())) return routineForm.dueDate;
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    })();
    addScheduledRoutine({ ...routineForm, dueDate: formattedDue });
    setRoutineForm({
      assetName: '',
      assetCode: '',
      task: '',
      assignedTo: 'Bilal Khan',
      dueDate: '',
      priority: 'Medium'
    });
    closePanel();
    showToast('Maintenance routine scheduled');
  };

  const cards = [
    {
      label: 'Total Assets',
      value: stats.totalAssets,
      hint: 'Assets registered across campus',
      badge: 'bg-sky-100 text-sky-700',
      to: '/assets'
    },
    {
      label: 'Operational',
      value: stats.operationalAssets,
      hint: 'Assets currently in service',
      badge: 'bg-emerald-100 text-emerald-700',
      to: '/assets'
    },
    {
      label: 'Under Maintenance',
      value: stats.assetsUnderMaintenance,
      hint: 'Assets in active service windows',
      badge: 'bg-amber-100 text-amber-700',
      to: '/scheduled-maintenance'
    },
    {
      label: 'Open Issues',
      value: stats.openIssues,
      hint: 'Unresolved campus reports',
      badge: 'bg-orange-100 text-orange-700',
      to: '/issues'
    },
    {
      label: 'Overdue Maintenance',
      value: stats.overdueMaintenance,
      hint: 'Past-due routines needing action',
      badge: 'bg-rose-100 text-rose-700',
      to: '/scheduled-maintenance'
    },
    {
      label: 'Resolved This Month',
      value: stats.resolvedThisMonth,
      hint: 'Closed work in the current period',
      badge: 'bg-teal-100 text-teal-700',
      to: '/issues'
    }
  ];

  const quickActions = [
    {
      label: 'Asset Directory',
      icon: HiOutlineCube,
      onClick: () => setPanel('register')
    },
    {
      label: 'Issue Board',
      icon: HiOutlineExclamation,
      onClick: () => setPanel('dispatch')
    },
    {
      label: 'Technicians',
      icon: HiOutlineUsers,
      onClick: () => navigate('/technicians')
    },
    {
      label: 'Scheduled Maintenance',
      icon: HiOutlineClock,
      onClick: () => setPanel('routine')
    }
  ];

  return (
    <div className="page-shell">
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          Admin Management
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Management Dashboard
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Welcome, {profile.name}. Oversee assets, issues, technicians, and campus
          maintenance health.
        </p>
      </div>

      {toast && (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-800">
          {toast}
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <button
            key={card.label}
            type="button"
            onClick={() => navigate(card.to)}
            className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-slate-300 hover:shadow"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-slate-600">{card.label}</p>
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
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            Quick actions
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">Administration</h2>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {quickActions.map(({ label, icon: Icon, onClick }) => (
              <button
                key={label}
                type="button"
                onClick={onClick}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-left transition hover:border-slate-300 hover:bg-white"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#062d3d]/5 text-[#062d3d]">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-slate-800">{label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            Health snapshot
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">Campus status</h2>
          <ul className="mt-5 space-y-3">
            <li className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3">
              <HiOutlineCheckCircle className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {stats.operationalAssets} operational assets
                </p>
                <p className="text-xs text-slate-500">Ready for campus use</p>
              </div>
            </li>
            <li className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3">
              <HiOutlineFire className="h-5 w-5 text-rose-600" />
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {stats.overdueMaintenance} overdue maintenance
                </p>
                <p className="text-xs text-slate-500">Requires administrator attention</p>
              </div>
            </li>
            <li className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3">
              <HiOutlineExclamation className="h-5 w-5 text-amber-600" />
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {stats.openIssues} open issues in queue
                </p>
                <p className="text-xs text-slate-500">Across all technicians</p>
              </div>
            </li>
          </ul>
        </section>
      </div>

      {/* ——— Register New Asset modal ——— */}
      {panel === 'register' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-[#062d3d]/50"
            aria-label="Close"
            onClick={closePanel}
          />
          <div className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Asset Directory
                </p>
                <h3 className="mt-1 text-xl font-bold text-slate-900">Register New Asset</h3>
              </div>
              <button
                type="button"
                onClick={closePanel}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleRegisterAsset} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Asset Name
                </label>
                <input
                  required
                  value={assetForm.name}
                  onChange={(e) => setAssetForm((f) => ({ ...f, name: e.target.value }))}
                  className="input-light"
                  placeholder="e.g. Backup Generator"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Category
                </label>
                <input
                  required
                  value={assetForm.category}
                  onChange={(e) => setAssetForm((f) => ({ ...f, category: e.target.value }))}
                  className="input-light"
                  placeholder="e.g. Generator"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Location
                </label>
                <input
                  required
                  value={assetForm.location}
                  onChange={(e) => setAssetForm((f) => ({ ...f, location: e.target.value }))}
                  className="input-light"
                  placeholder="e.g. Server Room"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Initial Condition
                </label>
                <select
                  value={assetForm.condition}
                  onChange={(e) =>
                    setAssetForm((f) => ({ ...f, condition: e.target.value }))
                  }
                  className="input-light"
                >
                  {CONDITIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn-primary w-full py-3">
                Register Asset
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ——— Issue dispatch slide panel ——— */}
      {panel === 'dispatch' && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            className="absolute inset-0 bg-[#062d3d]/45"
            aria-label="Close dispatch"
            onClick={closePanel}
          />
          <aside className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl">
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Issue Board
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-slate-900">Global Dispatch</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Assign unassigned reports to campus technicians.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closePanel}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
                >
                  <HiOutlineX className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
              {unassignedIssues.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center">
                  <p className="text-sm font-medium text-slate-600">No unassigned issues</p>
                </div>
              ) : (
                unassignedIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
                  >
                    <p className="font-mono text-[11px] text-slate-400">{issue.issueNumber}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{issue.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{issue.asset}</p>
                    <div className="mt-2 flex gap-1.5">
                      <StatusBadge status={issue.priority} type="priority" />
                      <StatusBadge status={issue.status} />
                    </div>
                    <div className="mt-3 flex gap-2">
                      <select
                        value={dispatchPick[issue.id] || ''}
                        onChange={(e) =>
                          setDispatchPick((p) => ({ ...p, [issue.id]: e.target.value }))
                        }
                        className="input-light flex-1 py-2 text-sm"
                      >
                        <option value="">Select technician…</option>
                        {techNames.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => handleDispatch(issue.id)}
                        disabled={!dispatchPick[issue.id]}
                        className="shrink-0 rounded-xl bg-[#062d3d] px-3 py-2 text-xs font-semibold text-white disabled:opacity-40"
                      >
                        Assign
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="border-t border-slate-100 px-6 py-4">
              <button
                type="button"
                onClick={() => {
                  closePanel();
                  navigate('/issues');
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Open full Issue Board
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ——— Create New Routine Window ——— */}
      {panel === 'routine' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-[#062d3d]/50"
            aria-label="Close"
            onClick={closePanel}
          />
          <div className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Scheduled Maintenance
                </p>
                <h3 className="mt-1 text-xl font-bold text-slate-900">
                  Create New Routine Window
                </h3>
              </div>
              <button
                type="button"
                onClick={closePanel}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateRoutine} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Asset
                </label>
                <select
                  required
                  value={routineForm.assetName}
                  onChange={(e) => {
                    const name = e.target.value;
                    const match = assets.find((a) => a.name === name);
                    setRoutineForm((f) => ({
                      ...f,
                      assetName: name,
                      assetCode: match?.code || ''
                    }));
                  }}
                  className="input-light"
                >
                  <option value="">Select asset…</option>
                  {assets.map((a) => (
                    <option key={a.id} value={a.name}>
                      {a.name} ({a.code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Inspection / Task
                </label>
                <input
                  required
                  value={routineForm.task}
                  onChange={(e) => setRoutineForm((f) => ({ ...f, task: e.target.value }))}
                  className="input-light"
                  placeholder="e.g. Quarterly Fuel Line Inspection"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Assigned To
                  </label>
                  <select
                    value={routineForm.assignedTo}
                    onChange={(e) =>
                      setRoutineForm((f) => ({ ...f, assignedTo: e.target.value }))
                    }
                    className="input-light"
                  >
                    {techNames.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Due Date
                  </label>
                  <input
                    required
                    type="date"
                    value={routineForm.dueDate}
                    onChange={(e) =>
                      setRoutineForm((f) => ({ ...f, dueDate: e.target.value }))
                    }
                    className="input-light"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Priority
                </label>
                <select
                  value={routineForm.priority}
                  onChange={(e) =>
                    setRoutineForm((f) => ({ ...f, priority: e.target.value }))
                  }
                  className="input-light"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn-primary w-full py-3">
                Schedule Routine
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
