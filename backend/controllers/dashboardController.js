const Asset = require('../models/Asset');
const Issue = require('../models/Issue');
const User = require('../models/User');

// GET /api/dashboard/stats — admin only
const getDashboardStats = async (req, res) => {
  try {
    // --- Asset counts ---
    const [
      totalAssets,
      operationalAssets,
      outOfServiceAssets,
      retiredAssets
    ] = await Promise.all([
      Asset.countDocuments(),
      Asset.countDocuments({ status: 'Operational' }),
      Asset.countDocuments({ status: 'Out of Service' }),
      Asset.countDocuments({ status: 'Retired' })
    ]);

    // --- Issue counts ---
    const closedStatuses = ['Resolved', 'Closed'];

    const [totalIssues, openIssues, criticalIssues] = await Promise.all([
      Issue.countDocuments(),
      Issue.countDocuments({ status: { $nin: closedStatuses } }),
      Issue.countDocuments({
        priority: 'Critical',
        status: { $nin: closedStatuses }
      })
    ]);

    // --- Issues grouped by status ---
    const statusAgg = await Issue.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const issuesByStatus = {};
    statusAgg.forEach((row) => {
      issuesByStatus[row._id] = row.count;
    });

    // --- Issues grouped by priority ---
    const priorityAgg = await Issue.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    const issuesByPriority = {};
    priorityAgg.forEach((row) => {
      issuesByPriority[row._id] = row.count;
    });

    // --- Recent 5 issues ---
    const recentIssues = await Issue.find()
      .populate('asset', 'name assetCode')
      .populate('assignedTechnician', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    // Assets needing service: overdue OR due within next 7 days
    const now = new Date();
    const inSevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const assetsNeedingService = await Asset.find({
      nextServiceDate: { $lte: inSevenDays },
      status: { $ne: 'Retired' }
    })
      .select('name assetCode location nextServiceDate status')
      .sort({ nextServiceDate: 1 })
      .limit(10);

    // --- Top 5 assets with most issues ---
    const topFailingAgg = await Issue.aggregate([
      { $group: { _id: '$asset', issueCount: { $sum: 1 } } },
      { $sort: { issueCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'assets',
          localField: '_id',
          foreignField: '_id',
          as: 'asset'
        }
      },
      { $unwind: '$asset' },
      {
        $project: {
          _id: 0,
          assetId: '$asset._id',
          name: '$asset.name',
          assetCode: '$asset.assetCode',
          status: '$asset.status',
          issueCount: 1
        }
      }
    ]);

    // --- Technician count (for metric card) ---
    const totalTechnicians = await User.countDocuments({ role: 'technician' });

    res.json({
      success: true,
      data: {
        totalAssets,
        operationalAssets,
        outOfServiceAssets,
        retiredAssets,
        totalIssues,
        openIssues,
        criticalIssues,
        totalTechnicians,
        issuesByStatus,
        issuesByPriority,
        recentIssues,
        assetsNeedingService,
        topFailingAssets: topFailingAgg
      }
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats: ' + err.message
    });
  }
};

module.exports = { getDashboardStats };
