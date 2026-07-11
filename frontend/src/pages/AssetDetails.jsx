import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AssetHistoryTimeline from '../components/AssetHistoryTimeline';

const statusBadgeClass = (status) => {
  switch (status) {
    case 'Operational':
      return 'border-emerald-400/30 bg-emerald-500/15 text-emerald-300';
    case 'Issue Reported':
      return 'border-amber-400/30 bg-amber-500/15 text-amber-300';
    case 'Under Inspection':
    case 'Under Maintenance':
      return 'border-sky-400/30 bg-sky-500/15 text-sky-300';
    case 'Out of Service':
      return 'border-rose-400/30 bg-rose-500/15 text-rose-300';
    default:
      return 'border-white/10 bg-white/5 text-slate-400';
  }
};

const MetaField = ({ label, value }) => (
  <div className="rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
    <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{label}</p>
    <p className="mt-1.5 text-sm font-medium text-slate-100">{value || '—'}</p>
  </div>
);

const AssetDetails = ({ token, isAdmin }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [asset, setAsset] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('details');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!token || !id) return;

    const fetchAsset = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${API_BASE_URL}/assets/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAsset(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load asset');
      } finally {
        setLoading(false);
      }
    };

    const fetchHistory = async () => {
      setHistoryLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/assets/${id}/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(res.data.data || []);
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchAsset();
    fetchHistory();
  }, [id, token, API_BASE_URL]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString();
  };

  const handleDownloadQR = () => {
    if (!asset?.qrCode) return;
    const link = document.createElement('a');
    link.href = asset.qrCode;
    link.download = `${asset.assetCode || 'asset'}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-teal-400/30 border-t-teal-400" />
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="page-shell">
        <div className="empty-state mx-auto max-w-lg">
          <p className="mb-4 text-sm text-rose-300">{error || 'Asset not found'}</p>
          <button type="button" onClick={() => navigate('/assets')} className="btn-primary">
            ← Back to Assets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/assets"
            className="mb-3 inline-block text-sm font-medium text-teal-400 hover:text-teal-300"
          >
            ← Back to Assets
          </Link>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="page-title truncate">{asset.name}</h1>
              <p className="page-subtitle">{asset.assetCode || '—'}</p>
            </div>
            <span
              className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-semibold ${statusBadgeClass(
                asset.status
              )}`}
            >
              {asset.status}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 border-b border-white/10">
          {['details', 'history'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium capitalize transition ${
                activeTab === tab
                  ? 'border-teal-400 text-teal-300'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab}
              {tab === 'history' && history.length > 0 && (
                <span className="ml-1.5 rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] text-slate-400">
                  {history.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'details' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            {/* Left / main metadata */}
            <div className="glass-panel p-5 sm:p-6 lg:col-span-3">
              <h2 className="mb-4 font-display text-base font-semibold text-white">
                Asset metadata
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <MetaField label="Category" value={asset.category} />
                <MetaField label="Location" value={asset.location} />
                <MetaField label="Condition" value={asset.condition} />
                <MetaField
                  label="Assigned Technician"
                  value={asset.assignedTechnician?.name}
                />
                <MetaField
                  label="Last Service Date"
                  value={formatDate(asset.lastServiceDate)}
                />
                <MetaField
                  label="Next Service Date"
                  value={formatDate(asset.nextServiceDate)}
                />
                <MetaField label="Created" value={formatDate(asset.createdAt)} />
                <MetaField label="Status" value={asset.status} />
              </div>
              {isAdmin && (
                <p className="mt-5 text-xs text-slate-500">
                  Edit this asset from the Assets list.
                </p>
              )}
            </div>

            {/* Right QR panel */}
            <div className="glass-panel flex flex-col items-center p-5 sm:p-6 lg:col-span-2">
              <h2 className="mb-1 w-full text-center font-display text-base font-semibold text-white">
                QR Code
              </h2>
              <p className="mb-5 text-center text-xs text-slate-500">
                Scan for public asset page
              </p>

              {asset.qrCode ? (
                <>
                  <div className="flex flex-1 items-center justify-center rounded-2xl border border-white/10 bg-white p-3">
                    <img
                      src={asset.qrCode}
                      alt={`${asset.assetCode} QR`}
                      className="h-44 w-44 object-contain"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadQR}
                    className="btn-primary mt-5 w-full"
                  >
                    Download QR
                  </button>
                </>
              ) : (
                <div className="empty-state w-full flex-1 py-10">
                  <p className="text-sm text-slate-400">No QR code available</p>
                  <p className="mt-1 text-xs text-slate-500">—</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="glass-panel p-6">
            <h2 className="mb-4 font-display text-lg font-semibold text-white">
              Activity History
            </h2>
            <AssetHistoryTimeline history={history} loading={historyLoading} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetDetails;
