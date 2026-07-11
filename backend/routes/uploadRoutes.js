const express = require('express');
const { upload, handleUploadError } = require('../middleware/uploadMiddleware');
const { uploadImages } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/upload — upload one or more images (max 5)
router.post(
  '/',
  protect,
  (req, res, next) => {
    upload.array('images', 5)(req, res, (err) => {
      if (err) return handleUploadError(err, req, res, next);
      next();
    });
  },
  uploadImages
);

module.exports = router;
