import React from 'react';

/**
 * Lightweight placeholder for nav destinations not yet fully built.
 */
const PlaceholderPage = ({ title, description }) => (
  <div className="page-shell">
    <div className="mb-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        Workspace
      </p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
      <p className="mt-1.5 text-sm text-slate-500">
        {description || 'This workspace section is ready for upcoming content.'}
      </p>
    </div>

    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <p className="text-sm text-slate-600">
        Content for <span className="font-semibold text-slate-900">{title}</span> will appear
        here. Use the sidebar to switch between Dashboard, Assets, and Issues.
      </p>
    </div>
  </div>
);

export default PlaceholderPage;
