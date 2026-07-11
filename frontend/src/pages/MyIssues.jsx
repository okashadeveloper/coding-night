import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatusBadge from '../components/StatusBadge';
import MaintenanceForm from '../components/MaintenanceForm';

const MyIssues = ({ token, user }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);

  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [maintenanceIssue, setMaintenanceIssue] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchMyIssues = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/issues`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const myIssues = (response.data.data || []).filter(
        (issue) => issue.assignedTechnician?._id === user?.id
      );

      setIssues(myIssues);
    } catch (err) {
      console.error('Error fetching issues:', err);
      setError(err.response?.data?.message || 'Failed to fetch issues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user?.id) {
      fetchMyIssues();
    }
  }, [token, user?.id]);

  const handleStatusSubmit = async (e) => {
    e.preventDefault();

    if (!newStatus) {
      setError('Please select a status');
      return;
    }

    setStatusLoading(true);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/issues/${selectedIssue._id}/status`,
        { newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIssues(issues.map((i) => (i._id === selectedIssue._id ? response.data.data : i)));
      setShowStatusModal(false);
      setSelectedIssue(null);
      setNewStatus('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating status');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleMaintenanceSuccess = (updatedIssue) => {
    if (updatedIssue) {
      setIssues(issues.map((i) => (i._id === updatedIssue._id ? updatedIssue : i)));
    } else {
      fetchMyIssues();
    }
  };

  const getValidNextStatuses = (currentStatus) => {
    const transitions = {
      Reported: ['Assigned'],
      Assigned: ['Inspection Started'],
      'Inspection Started': ['Maintenance In Progress', 'Waiting for Parts'],
      'Maintenance In Progress': ['Waiting for Parts', 'Resolved'],
      'Waiting for Parts': ['Maintenance In Progress'],
      Resolved: ['Closed', 'Reopened'],
      Closed: ['Reopened'],
      Reopened: ['Assigned', 'Inspection Started']
    };
    return transitions[currentStatus] || [];
  };

  const canAddMaintenance = (status) => {
    return ['Inspection Started', 'Maintenance In Progress', 'Waiting for Parts'].includes(
      status
    );
  };

  return (
    <div className="page-shell">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="page-title">My Issues</h1>
          <p className="page-subtitle">Issues assigned to you</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
            <button
              type="button"
              onClick={() => setError('')}
              className="float-right text-rose-300 hover:text-rose-100"
            >
              &times;
            </button>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
          </div>
        )}

        {!loading && (
          <>
            {issues.length === 0 ? (
              <div className="empty-state">
                <p className="mb-1 text-sm font-medium text-slate-300">
                  No issues assigned to you
                </p>
                <p className="text-xs text-slate-500">Check back later for new assignments</p>
              </div>
            ) : (
              <div className="space-y-4">
                {issues.map((issue) => (
                  <div
                    key={issue._id}
                    className="glass-panel p-6 transition hover:border-white/15"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-display text-lg font-semibold text-white">
                          {issue.issueNumber}: {issue.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-400">
                          Asset:{' '}
                          <span className="font-medium text-slate-200">
                            {issue.asset?.name}
                          </span>
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <StatusBadge status={issue.priority} type="priority" />
                        <StatusBadge status={issue.status} />
                      </div>
                    </div>

                    <div className="mb-4 grid grid-cols-2 gap-4 border-y border-white/10 py-4 md:grid-cols-4">
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-slate-500">
                          Asset Code
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-slate-200">
                          {issue.asset?.assetCode}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-slate-500">
                          Category
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-slate-200">
                          {issue.category}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-slate-500">
                          Asset Location
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-slate-200">
                          {issue.asset?.location}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-slate-500">
                          Reported Date
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-slate-200">
                          {new Date(issue.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-[11px] uppercase tracking-wide text-slate-500">
                        Issue Description
                      </p>
                      <p className="mt-1 text-sm text-slate-300">{issue.description}</p>
                    </div>

                    <div className="mb-4 rounded-xl border border-white/5 bg-white/[0.03] p-3">
                      <p className="text-[11px] uppercase tracking-wide text-slate-500">
                        Reported By
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-slate-200">
                        {issue.reporterName}
                        {issue.reporterContact && ` • ${issue.reporterContact}`}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {getValidNextStatuses(issue.status).length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedIssue(issue);
                            setNewStatus('');
                            setShowStatusModal(true);
                          }}
                          className="btn-primary"
                        >
                          Update Status
                        </button>
                      )}

                      {canAddMaintenance(issue.status) && (
                        <button
                          type="button"
                          onClick={() => {
                            setMaintenanceIssue(issue);
                            setShowMaintenanceForm(true);
                          }}
                          className="btn-ghost border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/10"
                        >
                          Add Maintenance Note
                        </button>
                      )}

                      {(issue.status === 'Resolved' || issue.status === 'Closed') && (
                        <span className="flex items-center gap-2 text-sm font-medium text-emerald-300">
                          ✓ Completed
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && issues.length > 0 && (
              <p className="mt-6 text-center text-sm text-slate-500">
                Showing {issues.length} issue{issues.length !== 1 ? 's' : ''}
              </p>
            )}
          </>
        )}
      </div>

      {showStatusModal && selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="glass-panel-solid w-full max-w-md p-6">
            <h2 className="mb-4 font-display text-xl font-semibold text-white">
              Update Issue Status
            </h2>
            <p className="mb-1 text-sm text-slate-400">
              {selectedIssue.issueNumber}: {selectedIssue.title}
            </p>
            <p className="mb-4 text-sm text-slate-500">
              Current Status:{' '}
              <strong className="text-slate-200">{selectedIssue.status}</strong>
            </p>

            <form onSubmit={handleStatusSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Next Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="select-dark"
                >
                  <option value="">-- Select Status --</option>
                  {getValidNextStatuses(selectedIssue.status).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowStatusModal(false);
                    setSelectedIssue(null);
                  }}
                  className="btn-ghost flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={statusLoading}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {statusLoading ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMaintenanceForm && maintenanceIssue && (
        <MaintenanceForm
          issue={maintenanceIssue}
          token={token}
          onClose={() => {
            setShowMaintenanceForm(false);
            setMaintenanceIssue(null);
          }}
          onSuccess={handleMaintenanceSuccess}
        />
      )}
    </div>
  );
};

export default MyIssues;
