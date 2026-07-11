import React, { useMemo } from 'react';
import StatusBadge from './StatusBadge';
import { useWorkspace } from '../context/WorkspaceContext';

const Field = ({ label, children }) => (
  <div className="min-w-0">
    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
      {label}
    </label>
    <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-sm font-medium text-slate-800">
      {children}
    </div>
  </div>
);

/**
 * Full-viewport split panel for asset identity + parameters
 */
const AssetDetailPanel = ({
  asset,
  onBack,
  onShowQr,
  isAdmin = false,
  onDelete,
  onMarkOutOfService
}) => {
  const { issues } = useWorkspace();
  const relatedIssues = useMemo(
    () => issues.filter((i) => i.asset === asset.name),
    [issues, asset.name]
  );

  return (
    <div className="page-shell">
      <button
        type="button"
        onClick={onBack}
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-800"
      >
        <span aria-hidden>←</span> Back to asset directory
      </button>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Asset identity
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            {asset.name}
          </h1>
          <p className="mt-1 font-mono text-sm text-slate-500">{asset.code}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={asset.condition} type="condition" />
          <StatusBadge status={asset.status} />
          {asset.actions?.includes('QR') && (
            <button
              type="button"
              onClick={() => onShowQr(asset)}
              className="rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-800 transition hover:bg-cyan-100"
            >
              Show QR
            </button>
          )}
        </div>
      </div>

      {isAdmin && (
        <div className="mb-6 flex flex-wrap gap-2 rounded-xl border border-cyan-100 bg-cyan-50/60 px-4 py-3">
          <p className="mr-2 self-center text-[11px] font-semibold uppercase tracking-wide text-cyan-700">
            Admin controls
          </p>
          {asset.status !== 'Out of Service' && (
            <button
              type="button"
              onClick={onMarkOutOfService}
              className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100"
            >
              Change Status to Out of Service
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Delete asset “${asset.name}”?`)) onDelete?.();
            }}
            className="text-xs font-semibold text-rose-600 underline-offset-2 hover:underline"
          >
            Delete Asset
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-7">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            Parameters
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Category">{asset.category}</Field>
            <Field label="Location">{asset.location}</Field>
            <Field label="Condition">
              <StatusBadge status={asset.condition} type="condition" />
            </Field>
            <Field label="Status">
              <StatusBadge status={asset.status} />
            </Field>
            <Field label="Last service">{asset.lastService}</Field>
            <Field label="Next service">{asset.nextService}</Field>
            <Field label="Open issues">
              <span
                className={`tabular-nums ${
                  asset.openIssues > 0 ? 'text-rose-700' : 'text-slate-700'
                }`}
              >
                {asset.openIssues}
              </span>
            </Field>
            <Field label="Manufacturer">{asset.manufacturer || '—'}</Field>
            <Field label="Serial number">
              <span className="font-mono text-xs">{asset.serialNumber || '—'}</span>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Service notes">{asset.notes || '—'}</Field>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            Linked issues
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">Open work on this asset</h2>

          {relatedIssues.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center">
              <p className="text-sm font-medium text-slate-600">No linked issues</p>
            </div>
          ) : (
            <ul className="mt-5 space-y-3">
              {relatedIssues.map((issue) => (
                <li
                  key={issue.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3"
                >
                  <p className="font-mono text-[11px] text-slate-400">{issue.issueNumber}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{issue.title}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <StatusBadge status={issue.status} />
                    <StatusBadge status={issue.priority} type="priority" />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default AssetDetailPanel;
