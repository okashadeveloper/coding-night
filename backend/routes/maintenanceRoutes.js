const express = require('express');
const { createMaintenanceRecord, getMaintenanceRecords } = require('../controllers/maintenanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Create maintenance record
router.post('/:issueId/maintenance', protect, authorize('technician', 'admin'), createMaintenanceRecord);

// Get maintenance records for an issue
router.get('/:issueId/maintenance', protect, getMaintenanceRecords);

module.exports = router;
