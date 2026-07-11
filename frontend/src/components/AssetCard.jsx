import React from 'react';

const getStatusBadgeStyle = (status) => {
  switch (status) {
    case 'Operational':
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30';
    case 'Issue Reported':
      return 'bg-amber-500/15 text-amber-300 border-amber-400/30';
    case 'Under Inspection':
    case 'Under Maintenance':
      return 'bg-sky-500/15 text-sky-300 border-sky-400/30';
    case 'Out of Service':
      return 'bg-rose-500/15 text-rose-300 border-rose-400/30';
    case 'Retired':
      return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    default:
      return 'bg-white/5 text-slate-300 border-white/10';
  }
};

/**
 * Glassmorphic asset card.
 * actions: optional node — shown in a bottom bar on hover (never overlaps status badge)
 */
const AssetCard = ({ asset, actions = null, onClick }) => {
  return (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-teal-400/30 hover:shadow-[0_0_24px_rgba(45,212,191,0.12)] ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(e);
              }
            }
          : undefined
      }
    >
      {/* Header: title left, badge top-right — reserved space, no overlap */}
      <div className="mb-4 flex items-start gap-3">
        <div className="min-w-0 flex-1 pr-1">
          <h3 className="truncate font-display text-lg font-semibold leading-snug text-white">
            {asset.name}
          </h3>
          <p className="mt-1 text-sm text-slate-500">{asset.assetCode || '—'}</p>
        </div>
        <span
          className={`mt-0.5 max-w-[42%] shrink-0 truncate rounded-full border px-2.5 py-1 text-center text-[10px] font-semibold leading-tight sm:text-[11px] ${getStatusBadgeStyle(
            asset.status
          )}`}
          title={asset.status}
        >
          {asset.status}
        </span>
      </div>

      {/* Meta grid */}
      <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
            Category
          </p>
          <p className="mt-1 truncate font-medium text-slate-200">
            {asset.category || '—'}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
            Location
          </p>
          <p className="mt-1 truncate font-medium text-slate-200">
            {asset.location || '—'}
          </p>
        </div>
        <div className="col-span-2">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
            Condition
          </p>
          <p className="mt-1 truncate font-medium text-slate-200">
            {asset.condition || '—'}
          </p>
        </div>
        {asset.assignedTechnician?.name && (
          <div className="col-span-2">
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
              Assigned To
            </p>
            <p className="mt-1 truncate font-medium text-slate-200">
              {asset.assignedTechnician.name}
            </p>
          </div>
        )}
      </div>

      {/* Hover actions — bottom bar, never over badge */}
      {actions && (
        <div
          className="mt-4 flex flex-wrap items-center gap-2 border-t border-transparent pt-0 opacity-0 max-h-0 overflow-hidden transition-all duration-300 ease-in-out group-hover:max-h-20 group-hover:border-white/10 group-hover:pt-4 group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {actions}
        </div>
      )}
    </div>
  );
};

export default AssetCard;
