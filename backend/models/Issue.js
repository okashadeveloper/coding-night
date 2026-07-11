
const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  issueNumber: {
    type: String,
    unique: true
  },
  asset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: [
      'Reported',
      'Assigned',
      'Inspection Started',
      'Maintenance In Progress',
      'Waiting for Parts',
      'Resolved',
      'Closed',
      'Reopened'
    ],
    default: 'Reported'
  },
  reporterName: {
    type: String,
    required: true
  },
  reporterContact: {
    type: String,
    required: true
  },
  assignedTechnician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  aiSuggested: {
    type: Boolean,
    default: false
  },
  evidenceImages: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to auto-generate issueNumber
issueSchema.pre('save', async function (next) {
  if (!this.issueNumber) {
    const lastIssue = await this.constructor.findOne(
      {},
      { issueNumber: 1 }
    ).sort({ createdAt: -1 });

    let nextNumber = 1001;
    if (lastIssue && lastIssue.issueNumber) {
      const lastNum = parseInt(lastIssue.issueNumber.split('-')[1]);
      nextNumber = lastNum + 1;
    }
    this.issueNumber = `ISS-${nextNumber}`;
  }
  next();
});

module.exports = mongoose.model('Issue', issueSchema);
