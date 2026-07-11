const express = require('express');
const Asset = require('../models/Asset');
const AssetHistory = require('../models/AssetHistory');

const router = express.Router();

// @desc    Get asset public data by asset code
// @route   GET /api/public/asset/:assetCode
// @access  Public (No authentication required)
router.get('/asset/:assetCode', async (req, res) => {
  try {
    const { assetCode } = req.params;

    // Find asset by assetCode
    const asset = await Asset.findOne({ assetCode })
      .populate('assignedTechnician', 'name email -_id');

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: `Asset with code "${assetCode}" not found`
      });
    }

    // Get recent history entries (last 3-4 actions, without sensitive info)
    const history = await AssetHistory.find({ asset: asset._id })
      .select('action timestamp -actor -_id')
      .sort({ timestamp: -1 })
      .limit(4)
      .lean();

    // Build public-safe response
    const publicData = {
      name: asset.name,
      assetCode: asset.assetCode,
      category: asset.category,
      location: asset.location,
      condition: asset.condition || 'Not specified',
      status: asset.status,
      lastServiceDate: asset.lastServiceDate || null,
      nextServiceDate: asset.nextServiceDate || null,
      isRetired: asset.status === 'Retired',
      recentActivity: history.map(entry => ({
        action: entry.action,
        timestamp: entry.timestamp
      })),
      createdAt: asset.createdAt
    };

    // Include assigned technician name if available (but not email or _id)
    if (asset.assignedTechnician) {
      publicData.assignedTechnician = {
        name: asset.assignedTechnician.name
      };
    }

    res.status(200).json({
      success: true,
      data: publicData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching asset information'
    });
  }
});

module.exports = router;
