const MaintenanceRecord = require('../models/MaintenanceRecord');
const Issue = require('../models/Issue');
const AssetHistory = require('../models/AssetHistory');

// POST /api/issues/:id/maintenance
const createMaintenanceRecord = async (req, res) => {
  try {
    const { inspectionNotes, workPerformed, partsUsed, cost, evidenceImages } = req.body;
    const issueId = req.params.id;

    // Cost is required and must not be negative
    if (cost === undefined || cost === null || cost === '') {
      return res.status(400).json({ message: 'Cost is required' });
    }

    const costNum = Number(cost);
    if (Number.isNaN(costNum)) {
      return res.status(400).json({ message: 'Cost must be a number' });
    }

    if (costNum < 0) {
      return res.status(400).json({ message: 'Cost cannot be negative' });
    }

    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    const record = new MaintenanceRecord({
      issue: issueId,
      technician: req.user._id,
      inspectionNotes,
      workPerformed,
      partsUsed: partsUsed || [],
      cost: costNum,
      evidenceImages: evidenceImages || []
    });

    await record.save();

    // Log maintenance on the asset timeline
    const workSummary = workPerformed
      ? (workPerformed.length > 100 ? workPerformed.slice(0, 100) + '...' : workPerformed)
      : 'No details provided';

    await AssetHistory.create({
      asset: issue.asset,
      action: `Maintenance performed: ${workSummary}`,
      actor: req.user._id,
      relatedIssue: issueId
    });

    await record.populate('technician', 'name email');

    res.status(201).json({
      success: true,
      data: record,
      message: 'Maintenance record created successfully'
    });
  } catch (err) {
    console.error('Error creating maintenance record:', err);
    res.status(500).json({ message: 'Error creating maintenance record: ' + err.message });
  }
};

// GET /api/issues/:id/maintenance
const getMaintenanceRecords = async (req, res) => {
  try {
    const issueId = req.params.id;

    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    const records = await MaintenanceRecord.find({ issue: issueId })
      .populate('technician', 'name email')
      .sort({ completedAt: -1 });

    res.json({
      success: true,
      data: records,
      count: records.length
    });
  } catch (err) {
    console.error('Error fetching maintenance records:', err);
    res.status(500).json({ message: 'Error fetching maintenance records: ' + err.message });
  }
};

module.exports = {
  createMaintenanceRecord,
  getMaintenanceRecords
};
