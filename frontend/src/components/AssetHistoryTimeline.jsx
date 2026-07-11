import React from 'react';
import { Link } from 'react-router-dom';

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getActorName = (actor) => {
  if (!actor) return 'System';
  if (typeof actor === 'object') return actor.name || 'Unknown';
  return 'Unknown';
};

const AssetHistoryTimeline = ({ history = [], loading = false }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
      </div>
    );
  }

  if (!history.length) {
    return (
      <div className="empty-state py-10">
        <p className="text-sm text-slate-400">No history recorded for this asset yet.</p>
      </div>
    );
  }

  return (
    <div className="relative pl-1">
      {history.map((entry, index) => {
        const isLast = index === history.length - 1;

        return (
          <div key={entry._id || index} className="relative flex gap-4 pb-6">
            <div className="flex flex-col items-center">
              <div className="z-10 mt-1 h-3 w-3 shrink-0 rounded-full border-2 border-surface bg-accent shadow-glow" />
              {!isLast && <div className="mt-1 w-0.5 flex-1 bg-white/10" />}
            </div>

            <div className="min-w-0 flex-1 pb-1">
              <p className="mb-0.5 text-xs text-slate-500">{formatDate(entry.timestamp)}</p>
              <p className="text-sm font-medium leading-snug text-slate-100">{entry.action}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500">
                  by <span className="font-medium text-slate-300">{getActorName(entry.actor)}</span>
                </span>

                {entry.relatedIssue && (
                  <Link
                    to="/issues"
                    className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-xs text-accent transition hover:bg-accent/20"
                    title={entry.relatedIssue.title}
                  >
                    {entry.relatedIssue.issueNumber || 'Issue'}
                  </Link>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AssetHistoryTimeline;
