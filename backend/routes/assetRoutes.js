
const express = require('express');
const {
  createAsset,
  getAssets,
  getAssetById,
  updateAsset,
  deleteAsset,
  getAssetHistory
} = require('../controllers/assetController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router
  .route('/')
  .post(protect, authorize('admin'), createAsset)
  .get(protect, getAssets);

// History before :id so path matches correctly
router.get('/:id/history', protect, getAssetHistory);

router
  .route('/:id')
  .get(protect, getAssetById)
  .put(protect, authorize('admin'), updateAsset)
  .delete(protect, authorize('admin'), deleteAsset);

module.exports = router;
