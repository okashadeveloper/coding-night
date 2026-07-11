const express = require('express');
const { createIssue, getIssues, getIssueById, updateIssueStatus, assignIssue, getTechnicians } = require('../controllers/issueController');
const { createMaintenanceRecord, getMaintenanceRecords } = require('../controllers/maintenanceController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { publicLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Public route - anyone can report an issue
router.post('/', publicLimiter, createIssue);

// Technicians list must be before /:id or "technician" gets treated as an id
router.get('/technician/list', protect, authorize('admin'), getTechnicians);

// Protected routes
router.get('/', protect, getIssues);
router.get('/:id', protect, getIssueById);
router.put('/:id/status', protect, updateIssueStatus);
router.put('/:id/assign', protect, authorize('admin'), assignIssue);

// Maintenance routes
router.post('/:id/maintenance', protect, authorize('technician', 'admin'), createMaintenanceRecord);
router.get('/:id/maintenance', protect, getMaintenanceRecords);

module.exports = router;
