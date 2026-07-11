const Issue = require('../models/Issue');
const Asset = require('../models/Asset');
const AssetHistory = require('../models/AssetHistory');
const MaintenanceRecord = require('../models/MaintenanceRecord');
const User = require('../models/User');

// Create new issue
const createIssue = async (req, res) => {
  try {
    const { assetCode, title, description, category, priority, reporterName, reporterContact, evidenceImages } = req.body;

    // Find asset by assetCode
    const asset = await Asset.findOne({ assetCode });
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    // Create issue
    const issue = new Issue({
      asset: asset._id,
      title,
      description,
      category,
      priority: priority || 'Medium',
      reporterName,
      reporterContact,
      evidenceImages: evidenceImages || []
    });

    await issue.save();

    // Update asset status to "Issue Reported" if it's Operational
    if (asset.status === 'Operational') {
      asset.status = 'Issue Reported';
      await asset.save();

      // Add entry to asset history
      await AssetHistory.create({
        asset: asset._id,
        action: `Issue reported: ${title}`,
        actor: { name: reporterName || 'Public' },
        relatedIssue: issue._id
      });
    }

    // Populate asset and return
    await issue.populate('asset');

    res.status(201).json({
      success: true,
      data: issue,
      message: 'Issue reported successfully'
    });
  } catch (err) {
    console.error('Error creating issue:', err);
    res.status(500).json({ message: 'Error creating issue: ' + err.message });
  }
};

// Get all issues with filters
const getIssues = async (req, res) => {
  try {
    const { status, priority, category, assignedTechnician } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (assignedTechnician) filter.assignedTechnician = assignedTechnician;

    const issues = await Issue.find(filter)
      .populate('asset')
      .populate('assignedTechnician', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: issues,
      count: issues.length
    });
  } catch (err) {
    console.error('Error fetching issues:', err);
    res.status(500).json({ message: 'Error fetching issues: ' + err.message });
  }
};

// Get single issue by ID
const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('asset')
      .populate('assignedTechnician', 'name email');

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    res.json({
      success: true,
      data: issue
    });
  } catch (err) {
    console.error('Error fetching issue:', err);
    res.status(500).json({ message: 'Error fetching issue: ' + err.message });
  }
};

// Assign issue to technician
const assignIssue = async (req, res) => {
  try {
    const { technicianId } = req.body;

    if (!technicianId) {
      return res.status(400).json({ message: 'Technician ID is required' });
    }

    // Find issue
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Check technician exists and is actually a technician
    const technician = await User.findById(technicianId);
    if (!technician || technician.role !== 'technician') {
      return res.status(400).json({ message: 'Invalid technician' });
    }

    // Assign and update status to "Assigned"
    issue.assignedTechnician = technicianId;
    issue.status = 'Assigned';
    await issue.save();

    // Log to asset history
    const asset = await Asset.findById(issue.asset);
    if (asset) {
      await AssetHistory.create({
        asset: asset._id,
        action: `Issue ${issue.issueNumber} assigned to ${technician.name}`,
        actor: req.user._id,
        relatedIssue: issue._id
      });
    }

    // Populate and return
    await issue.populate('asset');
    await issue.populate('assignedTechnician', 'name email');

    res.json({
      success: true,
      data: issue,
      message: `Issue assigned to ${technician.name}`
    });
  } catch (err) {
    console.error('Error assigning issue:', err);
    res.status(500).json({ message: 'Error assigning issue: ' + err.message });
  }
};

// Get all technicians (for assign dropdown)
const getTechnicians = async (req, res) => {
  try {
    const technicians = await User.find({ role: 'technician' }).select('_id name email');
    res.json({
      success: true,
      data: technicians,
      count: technicians.length
    });
  } catch (err) {
    console.error('Error fetching technicians:', err);
    res.status(500).json({ message: 'Error fetching technicians: ' + err.message });
  }
};

// Update issue status with strict validation
const updateIssueStatus = async (req, res) => {
  try {
    const { newStatus } = req.body;

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    const currentStatus = issue.status;

    // Valid state transitions map
    const validTransitions = {
      'Reported': ['Assigned'],
      'Assigned': ['Inspection Started'],
      'Inspection Started': ['Maintenance In Progress', 'Waiting for Parts'],
      'Maintenance In Progress': ['Waiting for Parts', 'Resolved'],
      'Waiting for Parts': ['Maintenance In Progress'],
      'Resolved': ['Closed', 'Reopened'],
      'Closed': ['Reopened'],
      'Reopened': ['Assigned', 'Inspection Started']
    };

    // Check if transition is valid
    if (!validTransitions[currentStatus] || !validTransitions[currentStatus].includes(newStatus)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from "${currentStatus}" to "${newStatus}". Allowed next statuses: ${validTransitions[currentStatus]?.join(', ') || 'None'}`
      });
    }

    // Permission check: assigned technician or admin can update
    if (currentStatus === 'Assigned' && issue.assignedTechnician) {
      const isAssignedTech = req.user.id === issue.assignedTechnician.toString();
      const isAdmin = req.user.role === 'admin';
      if (!isAssignedTech && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Only the assigned technician or admin can update this issue'
        });
      }
    }

    // Resolved requires at least one maintenance record
    if (newStatus === 'Resolved') {
      const maintenanceCount = await MaintenanceRecord.countDocuments({ issue: issue._id });
      if (maintenanceCount === 0) {
        return res.status(400).json({
          success: false,
          message: 'Please create a maintenance record before resolving this issue'
        });
      }
    }

    // Update issue status
    issue.status = newStatus;
    await issue.save();

    // Update asset status based on new issue status
    const asset = await Asset.findById(issue.asset);
    if (asset) {
      let statusChanged = false;

      if (newStatus === 'Inspection Started') {
        if (asset.status !== 'Under Maintenance' && asset.status !== 'Out of Service') {
          asset.status = 'Under Inspection';
          statusChanged = true;
        }
      } else if (newStatus === 'Maintenance In Progress') {
        if (asset.status !== 'Out of Service') {
          asset.status = 'Under Maintenance';
          statusChanged = true;
        }
      } else if (newStatus === 'Resolved' || newStatus === 'Closed') {
        asset.status = 'Operational';
        statusChanged = true;

        // On resolve: set lastServiceDate today, nextServiceDate +90 days
        if (newStatus === 'Resolved') {
          const today = new Date();
          asset.lastServiceDate = today;
          asset.nextServiceDate = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
        }
      }

      if (statusChanged) {
        await asset.save();
      }

      // Log to asset history
      await AssetHistory.create({
        asset: asset._id,
        action: `Issue ${newStatus}`,
        actor: req.user._id,
        relatedIssue: issue._id
      });
    }

    // Populate and return
    await issue.populate('asset');
    await issue.populate('assignedTechnician', 'name email');

    res.json({
      success: true,
      data: issue,
      message: `Issue status updated to "${newStatus}"`
    });
  } catch (err) {
    console.error('Error updating issue status:', err);
    res.status(500).json({
      success: false,
      message: 'Error updating issue status: ' + err.message
    });
  }
};

module.exports = {
  createIssue,
  getIssues,
  getIssueById,
  updateIssueStatus,
  assignIssue,
  getTechnicians
};
