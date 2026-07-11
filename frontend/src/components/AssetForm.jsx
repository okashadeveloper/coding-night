import React, { useState, useEffect } from 'react';

const AssetForm = ({ asset = null, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    location: '',
    condition: '',
    status: 'Operational',
    lastServiceDate: '',
    nextServiceDate: ''
  });

  useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.name || '',
        category: asset.category || '',
        location: asset.location || '',
        condition: asset.condition || '',
        status: asset.status || 'Operational',
        lastServiceDate: asset.lastServiceDate
          ? new Date(asset.lastServiceDate).toISOString().split('T')[0]
          : '',
        nextServiceDate: asset.nextServiceDate
          ? new Date(asset.nextServiceDate).toISOString().split('T')[0]
          : ''
      });
    }
  }, [asset]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.lastServiceDate && formData.nextServiceDate) {
      if (new Date(formData.nextServiceDate) < new Date(formData.lastServiceDate)) {
        alert('Next service date cannot be before the last service date');
        return;
      }
    }

    onSubmit(formData);
  };

  const field = (label, children) => (
    <div className="mb-4">
      <label className="mb-1.5 block text-sm font-medium text-slate-300">{label}</label>
      {children}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="glass-panel-solid w-full max-w-md p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-white">
            {asset ? 'Edit Asset' : 'Add Asset'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-slate-400 hover:text-white"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {field(
            'Name',
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-dark"
            />
          )}
          {field(
            'Category',
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="input-dark"
            />
          )}
          {field(
            'Location',
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="input-dark"
            />
          )}
          {field(
            'Condition',
            <input
              type="text"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="input-dark"
            />
          )}
          {field(
            'Status',
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="select-dark"
            >
              <option value="Operational">Operational</option>
              <option value="Issue Reported">Issue Reported</option>
              <option value="Under Inspection">Under Inspection</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Out of Service">Out of Service</option>
              <option value="Retired">Retired</option>
            </select>
          )}
          {field(
            'Last Service Date',
            <input
              type="date"
              name="lastServiceDate"
              value={formData.lastServiceDate}
              onChange={handleChange}
              className="input-dark"
            />
          )}
          {field(
            'Next Service Date',
            <input
              type="date"
              name="nextServiceDate"
              value={formData.nextServiceDate}
              onChange={handleChange}
              className="input-dark"
            />
          )}
          <div className="mt-2 flex gap-3">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              {asset ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssetForm;
