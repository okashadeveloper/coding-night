import React, { useState } from 'react';
import axios from 'axios';

const MaintenanceForm = ({ issue, token, onClose, onSuccess }) => {
  const [inspectionNotes, setInspectionNotes] = useState('');
  const [workPerformed, setWorkPerformed] = useState('');
  const [parts, setParts] = useState(['']);
  const [cost, setCost] = useState('');
  const [markResolved, setMarkResolved] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Add / remove part rows
  const addPart = () => setParts([...parts, '']);

  const removePart = (index) => {
    if (parts.length === 1) {
      setParts(['']);
      return;
    }
    setParts(parts.filter((_, i) => i !== index));
  };

  const updatePart = (index, value) => {
    const updated = [...parts];
    updated[index] = value;
    setParts(updated);
  };

  // Local image preview before upload
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
    const valid = [];

    for (const file of files) {
      if (!allowed.includes(file.type)) {
        setError('Only JPG, JPEG, and PNG images are allowed');
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError(`"${file.name}" is larger than 5MB`);
        continue;
      }
      valid.push(file);
    }

    if (!valid.length) return;

    setError('');
    setImageFiles((prev) => [...prev, ...valid]);

    // Create object URLs for preview
    const newPreviews = valid.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name
    }));
    setPreviews((prev) => [...prev, ...newPreviews]);

    // Reset input so same file can be picked again
    e.target.value = '';
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index].url);
    setPreviews(previews.filter((_, i) => i !== index));
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!workPerformed.trim()) {
      setError('Please describe the work performed');
      return;
    }

    if (cost === '' || cost === null) {
      setError('Cost is required');
      return;
    }

    const costNum = Number(cost);
    if (Number.isNaN(costNum) || costNum < 0) {
      setError('Cost cannot be negative');
      return;
    }

    setLoading(true);

    try {
      // Upload images first (if any)
      let evidenceImages = [];
      if (imageFiles.length > 0) {
        const formData = new FormData();
        imageFiles.forEach((file) => formData.append('images', file));

        const uploadRes = await axios.post(`${API_BASE_URL}/upload`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        evidenceImages = uploadRes.data.data?.files || [];
      }

      // Create maintenance record
      await axios.post(
        `${API_BASE_URL}/issues/${issue._id}/maintenance`,
        {
          inspectionNotes: inspectionNotes.trim(),
          workPerformed: workPerformed.trim(),
          partsUsed: parts.map((p) => p.trim()).filter(Boolean),
          cost: costNum,
          evidenceImages
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Optionally mark issue as resolved
      let updatedIssue = null;
      if (markResolved) {
        const statusRes = await axios.put(
          `${API_BASE_URL}/issues/${issue._id}/status`,
          { newStatus: 'Resolved' },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        updatedIssue = statusRes.data.data;
      }

      onSuccess?.(updatedIssue);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save maintenance record');
    } finally {
      setLoading(false);
    }
  };

  // Can only resolve from Maintenance In Progress
  const canResolve = issue.status === 'Maintenance In Progress';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="glass-panel-solid flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-surface-raised/95 px-6 py-4 backdrop-blur">
          <div>
            <h2 className="font-display text-xl font-semibold text-white">Add Maintenance Note</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {issue.issueNumber}: {issue.title}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-slate-400 hover:text-white"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto px-6 py-4">
          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300 mb-1">
              Inspection Notes
            </label>
            <textarea
              value={inspectionNotes}
              onChange={(e) => setInspectionNotes(e.target.value)}
              rows={3}
              placeholder="What did you find during inspection?"
              className="input-dark resize-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300 mb-1">
              Work Performed <span className="text-red-500">*</span>
            </label>
            <textarea
              value={workPerformed}
              onChange={(e) => setWorkPerformed(e.target.value)}
              rows={3}
              placeholder="Describe the work you performed..."
              required
              className="input-dark resize-none"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Parts Used</label>
              <button
                type="button"
                onClick={addPart}
                className="text-xs font-medium text-accent hover:text-teal-300"
              >
                + Add part
              </button>
            </div>
            <div className="space-y-2">
              {parts.map((part, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={part}
                    onChange={(e) => updatePart(index, e.target.value)}
                    placeholder={`Part ${index + 1}`}
                    className="input-dark flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removePart(index)}
                    className="px-2 text-red-500 hover:text-red-700 text-sm"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300 mb-1">
              Cost (PKR) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              required
              placeholder="0"
              className="input-dark"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300 mb-1">
              Evidence Images
            </label>
            <label className="flex h-28 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/15 transition hover:border-accent/40 hover:bg-accent/5">
              <span className="text-sm text-slate-400">Click to select images</span>
              <span className="mt-1 text-xs text-slate-500">JPG / PNG, max 5MB each</span>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>

            {previews.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview.url}
                      alt={preview.name}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100 transition"
                    >
                      ✕
                    </button>
                    <p className="mt-0.5 truncate text-xs text-slate-500">{preview.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {canResolve && (
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={markResolved}
                onChange={(e) => setMarkResolved(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-white/5 text-accent focus:ring-accent/40"
              />
              <span className="text-sm text-slate-300">Mark as resolved</span>
            </label>
          )}

          <div className="flex gap-3 pb-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn-ghost flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Maintenance Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceForm;
