
const mongoose = require('mongoose');

const maintenanceRecordSchema = new mongoose.Schema({
  issue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue',
    required: true
  },
  technician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  inspectionNotes: {
    type: String
  },
  workPerformed: {
    type: String
  },
  partsUsed: [{
    type: String
  }],
  cost: {
    type: Number,
    min: 0,
    required: true
  },
  evidenceImages: [{
    type: String
  }],
  completedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MaintenanceRecord', maintenanceRecordSchema);
