import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const getStatusBadgeStyle = (status) => {
  switch (status) {
    case 'Operational':
      return 'bg-green-100 text-green-800';
    case 'Issue Reported':
      return 'bg-yellow-100 text-yellow-800';
    case 'Under Inspection':
    case 'Under Maintenance':
      return 'bg-blue-100 text-blue-800';
    case 'Out of Service':
      return 'bg-red-100 text-red-800';
    case 'Retired':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatDate = (date) => {
  if (!date) return 'Not scheduled';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatActivityDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const PublicAssetPage = () => {
  const { assetCode } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchAsset = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/public/asset/${assetCode}`
        );
        setAsset(response.data.data);
      } catch (err) {
        console.error('Error fetching asset:', err);
        setError(err.response?.data?.message || 'Asset not found');
      } finally {
        setLoading(false);
      }
    };

    if (assetCode) {
      fetchAsset();
    }
  }, [assetCode, API_BASE_URL]);

  const handleCopyLink = () => {
    const publicUrl = `${window.location.origin}/public/asset/${assetCode}`;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenPublicPage = () => {
    window.open(window.location.href, '_self');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Asset Not Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn't find asset code <span className="font-mono font-semibold">{assetCode}</span>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            {error}
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!asset) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{asset.name}</h1>
          <p className="text-xl text-gray-600 font-mono">{asset.assetCode}</p>
        </div>

        {/* Status Badge */}
        <div className="text-center mb-6">
          <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadgeStyle(asset.status)}`}>
            {asset.status}
          </span>
          {asset.isRetired && (
            <div className="mt-2 text-red-600 font-semibold text-sm">
              ⚠️ This asset has been retired
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Asset Details Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Asset Details</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="text-base font-medium text-gray-900">{asset.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="text-base font-medium text-gray-900">{asset.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Condition</p>
                <p className="text-base font-medium text-gray-900">{asset.condition}</p>
              </div>
              {asset.assignedTechnician && (
                <div>
                  <p className="text-sm text-gray-500">Assigned To</p>
                  <p className="text-base font-medium text-gray-900">{asset.assignedTechnician.name}</p>
                </div>
              )}
            </div>
          </div>

          {/* Service Dates Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Schedule</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Last Service Date</p>
                <p className="text-base font-medium text-gray-900">
                  {formatDate(asset.lastServiceDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Next Service Date</p>
                <p className="text-base font-medium text-gray-900">
                  {formatDate(asset.nextServiceDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="text-base font-medium text-gray-900">
                  {formatDate(asset.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {asset.recentActivity && asset.recentActivity.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {asset.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 pb-3 border-b last:border-b-0">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatActivityDate(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QR Code and Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">Share This Asset</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* QR Code */}
            <div className="flex flex-col items-center justify-center">
              {asset.qrCode ? (
                <div>
                  <img
                    src={asset.qrCode}
                    alt="Asset QR Code"
                    className="w-48 h-48 border-2 border-gray-300 rounded-lg p-2 bg-white"
                  />
                  <p className="text-center text-sm text-gray-600 mt-3">
                    Scan to view this asset
                  </p>
                </div>
              ) : (
                <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <p className="text-sm text-gray-500">QR Code not available</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col justify-center space-y-3">
              <button
                onClick={handleCopyLink}
                className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition font-medium text-sm"
              >
                {copied ? '✓ Link Copied' : 'Copy Public Link'}
              </button>
              
              <button
                onClick={() => navigate(`/public/asset/${assetCode}/report`)}
                className="bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition font-medium text-sm"
              >
                Report an Issue
              </button>

              <button
                onClick={() => window.print()}
                className="bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition font-medium text-sm"
              >
                Print Details
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>Asset Code: <span className="font-mono font-semibold">{assetCode}</span></p>
          <p className="mt-1">Last updated: {formatDate(asset.createdAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default PublicAssetPage;
