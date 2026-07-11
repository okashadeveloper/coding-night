import React, { useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import AssetDetailPanel from '../components/AssetDetailPanel';
import AssetQrModal from '../components/AssetQrModal';
import { useWorkspace } from '../context/WorkspaceContext';

/**
 * Asset Directory — table + admin management actions + detail/QR
 */
const Assets = () => {
  const { isAdmin, assets, deleteAsset, updateAsset } = useWorkspace();
  const [qrAsset, setQrAsset] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const selected = assets.find((a) => a.id === selectedId) || null;

  if (selected) {
    return (
      <>
        <AssetDetailPanel
          asset={selected}
          onBack={() => setSelectedId(null)}
          onShowQr={setQrAsset}
          isAdmin={isAdmin}
          onDelete={() => {
            deleteAsset(selected.id);
            setSelectedId(null);
          }}
          onMarkOutOfService={() =>
            updateAsset(selected.id, { status: 'Out of Service' })
          }
        />
        <AssetQrModal asset={qrAsset} onClose={() => setQrAsset(null)} />
      </>
    );
  }

  return (
    <div className="page-shell">
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          Asset Directory
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {assets.length} assets
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Browse campus assets, condition, service windows, and open issues.
          {isAdmin && (
            <span className="ml-1 font-medium text-cyan-700">
              Administrator controls enabled.
            </span>
          )}
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                {[
                  'Asset',
                  'Category',
                  'Location',
                  'Condition',
                  'Status',
                  'Last Service',
                  'Next Service',
                  'Open Issues',
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
              {assets.map((asset) => (
                <tr
                  key={asset.id}
                  className="border-b border-slate-100 transition hover:bg-slate-50/80 last:border-b-0"
                >
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-semibold text-slate-900">{asset.name}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-slate-400">{asset.code}</p>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-600">{asset.category}</td>
                  <td className="px-4 py-3.5 text-sm text-slate-600">{asset.location}</td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={asset.condition} type="condition" />
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={asset.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-600">
                    {asset.lastService}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-600">
                    {asset.nextService}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex min-w-[1.75rem] items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${
                        asset.openIssues > 0
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {asset.openIssues}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedId(asset.id)}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                      >
                        Open
                      </button>
                      {asset.actions?.includes('QR') && (
                        <button
                          type="button"
                          onClick={() => setQrAsset(asset)}
                          className="rounded-lg border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-800 transition hover:bg-cyan-100"
                        >
                          QR
                        </button>
                      )}
                      {isAdmin && (
                        <>
                          {asset.status !== 'Out of Service' && (
                            <button
                              type="button"
                              onClick={() =>
                                updateAsset(asset.id, { status: 'Out of Service' })
                              }
                              className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 transition hover:bg-amber-100"
                            >
                              Change Status to Out of Service
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Delete asset “${asset.name}”? This cannot be undone.`
                                )
                              ) {
                                deleteAsset(asset.id);
                              }
                            }}
                            className="text-xs font-semibold text-rose-600 underline-offset-2 hover:underline"
                          >
                            Delete Asset
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

      <AssetQrModal asset={qrAsset} onClose={() => setQrAsset(null)} />
    </div>
  );
};

export default Assets;
