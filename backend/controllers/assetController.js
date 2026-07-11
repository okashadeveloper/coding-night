
const Asset = require('../models/Asset');
const AssetHistory = require('../models/AssetHistory');
const QRCode = require('qrcode');

// @desc    Create new asset
// @route   POST /api/assets
// @access  Private/Admin
exports.createAsset = async (req, res) => {
  try {
    const { name, assetCode, category, location, condition, status, assignedTechnician, lastServiceDate, nextServiceDate } = req.body;

    // Validate nextServiceDate is not before lastServiceDate
    if (lastServiceDate && nextServiceDate) {
      if (new Date(nextServiceDate) < new Date(lastServiceDate)) {
        return res.status(400).json({
          success: false,
          message: 'nextServiceDate cannot be before the last maintenance / service date'
        });
      }
    }

    // Create asset
    const asset = await Asset.create({
      name,
      assetCode,
      category,
      location,
      condition,
      status: status || 'Operational',
      assignedTechnician,
      lastServiceDate,
      nextServiceDate
    });

    // Generate QR code for public URL
    try {
      const publicUrl = `${process.env.PUBLIC_URL || 'http://localhost:5173'}/public/asset/${asset.assetCode}`;
      const qrCodeDataUrl = await QRCode.toDataURL(publicUrl, {
        width: 200,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' }
      });
      
      // Update asset with QR code
      asset.qrCode = qrCodeDataUrl;
      await asset.save();
    } catch (qrError) {
      console.error('QR code generation error:', qrError);
      // Continue without QR code - don't fail the asset creation
    }

    // Add asset history entry
    await AssetHistory.create({
      asset: asset._id,
      action: 'Asset created',
      actor: req.user._id
    });

    res.status(201).json({
      success: true,
      data: asset
    });
  } catch (error) {
    console.error(error);
    // Check for duplicate key error (assetCode)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Asset code already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all assets with filtering and search
// @route   GET /api/assets
// @access  Private
exports.getAssets = async (req, res) => {
  try {
    let query = {};

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by location
    if (req.query.location) {
      query.location = req.query.location;
    }

    // Search by name or assetCode
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { assetCode: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Get assets
    const assets = await Asset.find(query).populate('assignedTechnician', 'name email role');

    res.status(200).json({
      success: true,
      count: assets.length,
      data: assets
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single asset by ID
// @route   GET /api/assets/:id
// @access  Private
exports.getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id).populate('assignedTechnician', 'name email role');

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    res.status(200).json({
      success: true,
      data: asset
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update asset
// @route   PUT /api/assets/:id
// @access  Private/Admin
exports.updateAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    // Prevent changing assetCode if already set
    if (req.body.assetCode && asset.assetCode) {
      delete req.body.assetCode;
    }

    // nextServiceDate must not be before lastServiceDate / maintenance completion
    const lastService = req.body.lastServiceDate
      ? new Date(req.body.lastServiceDate)
      : asset.lastServiceDate;
    const nextService = req.body.nextServiceDate
      ? new Date(req.body.nextServiceDate)
      : null;

    if (nextService && lastService && nextService < lastService) {
      return res.status(400).json({
        success: false,
        message: 'nextServiceDate cannot be before the last maintenance / service date'
      });
    }

    // Update asset
    const updatedAsset = await Asset.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // Add asset history entry
    await AssetHistory.create({
      asset: asset._id,
      action: 'Asset updated',
      actor: req.user._id
    });

    res.status(200).json({
      success: true,
      data: updatedAsset
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete asset (soft delete - mark as Retired)
// @route   DELETE /api/assets/:id
// @access  Private/Admin
exports.deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    // Soft delete - set status to Retired
    asset.status = 'Retired';
    await asset.save();

    // Add asset history entry
    await AssetHistory.create({
      asset: asset._id,
      action: 'Asset retired',
      actor: req.user._id
    });

    res.status(200).json({
      success: true,
      message: 'Asset retired successfully'
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get asset history
// @route   GET /api/assets/:id/history
// @access  Private
exports.getAssetHistory = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    const User = require('../models/User');

    // Newest first
    const history = await AssetHistory.find({ asset: req.params.id })
      .populate('relatedIssue', 'issueNumber title status')
      .sort({ timestamp: -1 });

    // actor is Mixed (ObjectId or embedded object) — resolve names manually
    const data = await Promise.all(
      history.map(async (entry) => {
        const item = entry.toObject();

        if (!item.actor) {
          item.actor = { name: 'Public / System' };
        } else if (typeof item.actor === 'object' && item.actor.name) {
          // already has name embedded
        } else {
          const user = await User.findById(item.actor).select('name email');
          item.actor = user || { name: 'Unknown' };
        }

        return item;
      })
    );

    res.json({
      success: true,
      data,
      count: data.length
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
