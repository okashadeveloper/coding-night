import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReportIssue = () => {
  const { assetCode } = useParams();
  const navigate = useNavigate();

  // Asset info
  const [asset, setAsset] = useState(null);
  const [assetLoading, setAssetLoading] = useState(true);

  // Form fields
  const [complaint, setComplaint] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [possibleCauses, setPossibleCauses] = useState([]);
  const [initialChecks, setInitialChecks] = useState([]);
  const [recurringWarning, setRecurringWarning] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');

  // UI state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successData, setSuccessData] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch asset info
  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/public/asset/${assetCode}`);
        setAsset(response.data.data);
      } catch (err) {
        console.error('Error fetching asset:', err);
      } finally {
        setAssetLoading(false);
      }
    };

    if (assetCode) {
      fetchAsset();
    }
  }, [assetCode, API_BASE_URL]);

  // Get AI suggestions
  const handleGetAISuggestion = async () => {
    if (!complaint.trim()) {
      setAiError('Please describe the issue first');
      return;
    }

    setAiLoading(true);
    setAiError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/ai/triage`, {
        assetCategory: asset?.category || '',
        assetLocation: asset?.location || '',
        assetCondition: asset?.condition || '',
        complaint: complaint.trim()
      }, {
        timeout: 15000 // 15 second timeout
      });

      const data = response.data;

      // Pre-fill form with AI suggestions
      setTitle(data.title || '');
      setCategory(data.category || 'General');
      setPriority(data.priority || 'Medium');
      setPossibleCauses(data.possibleCauses || []);
      setInitialChecks(data.initialChecks || []);
      setRecurringWarning(data.recurringWarning || '');

      if (!data.aiGenerated) {
        setAiError(data.error || 'AI service not available - please fill in details manually');
      }
    } catch (err) {
      console.error('AI triage error:', err);
      setAiError('Could not get AI suggestions. Please fill in the details manually.');
    } finally {
      setAiLoading(false);
    }
  };

  // Submit issue
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!title.trim() || !category.trim() || !complaint.trim()) {
      setSubmitError('Title, category, and complaint are required');
      return;
    }

    setSubmitLoading(true);
    setSubmitError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/issues`, {
        assetCode,
        title: title.trim(),
        description: complaint.trim(),
        category: category.trim(),
        priority,
        reporterName: reporterName.trim() || 'Anonymous',
        reporterContact: reporterContact.trim() || 'Not provided'
      });

      // Show success
      setSuccessData({
        issueNumber: response.data.data.issueNumber,
        title: response.data.data.title
      });
    } catch (err) {
      console.error('Error submitting issue:', err);
      setSubmitError(err.response?.data?.message || 'Error submitting issue');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Success screen
  if (successData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Issue Reported</h2>
          <p className="text-gray-600 mb-4">Thank you for reporting this issue. Our team will review it shortly.</p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Issue Number</p>
            <p className="text-xl font-bold text-blue-600">{successData.issueNumber}</p>
            <p className="text-sm text-gray-600 mt-2">Keep this for reference</p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => navigate(`/public/asset/${assetCode}`)}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Back to Asset
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading asset
  if (assetLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Asset not found
  if (!asset) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Asset Not Found</h2>
          <p className="text-gray-600 mb-6">The asset you're trying to report an issue for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(`/public/asset/${assetCode}`)}
          className="text-blue-600 hover:text-blue-700 font-medium mb-6 flex items-center gap-2"
        >
          ← Back to Asset
        </button>

        {/* Asset Info Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-blue-600">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{asset.name}</h1>
              <p className="text-gray-600 mt-1">Asset Code: {asset.assetCode}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              asset.status === 'Operational' ? 'bg-green-100 text-green-800' :
              asset.status === 'Issue Reported' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {asset.status}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
            <div>
              <p className="text-sm text-gray-600">Category</p>
              <p className="font-medium text-gray-900">{asset.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-medium text-gray-900">{asset.location}</p>
            </div>
          </div>
        </div>

        {/* Report Issue Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Report an Issue</h2>

          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              ⚠️ {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Complaint Textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Describe the Issue *
              </label>
              <p className="text-sm text-gray-600 mb-2">
                Describe what you've noticed in simple terms. For example: "The AC is leaking water..."
              </p>
              <textarea
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                placeholder="Describe the issue here..."
                rows={5}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* AI Suggestion Button */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-3">
                💡 <strong>Tip:</strong> Use AI to help categorize and prioritize this issue.
              </p>
              <button
                type="button"
                onClick={handleGetAISuggestion}
                disabled={aiLoading || !complaint.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {aiLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Getting AI Suggestion...
                  </span>
                ) : (
                  '✨ Get AI Suggestion'
                )}
              </button>
              {aiError && (
                <p className="text-sm text-red-600 mt-2">⚠️ {aiError}</p>
              )}
            </div>

            {/* AI Suggestions Display */}
            {(title || possibleCauses.length > 0) && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm font-medium text-purple-900 mb-2">✓ AI Suggestions (Edit as needed)</p>
                
                {possibleCauses.length > 0 && (
                  <div className="text-sm text-purple-700">
                    <strong>Possible causes:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {possibleCauses.map((cause, idx) => (
                        <li key={idx}>{cause}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {initialChecks.length > 0 && (
                  <div className="text-sm text-purple-700 mt-3">
                    <strong>Initial checks:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {initialChecks.map((check, idx) => (
                        <li key={idx}>{check}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {recurringWarning && (
                  <div className="text-sm text-red-700 mt-3 bg-red-50 border border-red-200 rounded px-3 py-2">
                    <strong>⚠️ Warning:</strong> {recurringWarning}
                  </div>
                )}
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Issue Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Short description of the issue"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Category *
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Mechanical, Electrical, Performance"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            {/* Reporter Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-900 mb-4">Your Information (Optional)</p>
              <div className="space-y-3">
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  placeholder="Your name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={reporterContact}
                  onChange={(e) => setReporterContact(e.target.value)}
                  placeholder="Your contact (phone/email)"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate(`/public/asset/${assetCode}`)}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitLoading}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Submitting...
                  </span>
                ) : (
                  '✓ Submit Issue Report'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;
