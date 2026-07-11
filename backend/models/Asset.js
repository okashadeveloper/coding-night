
const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  assetCode: {
    type: String,
    unique: true
  },
  category: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  condition: {
    type: String
  },
  status: {
    type: String,
    enum: [
      'Operational',
      'Issue Reported',
      'Under Inspection',
      'Under Maintenance',
      'Out of Service',
      'Retired'
    ],
    default: 'Operational'
  },
  assignedTechnician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastServiceDate: {
    type: Date
  },
  nextServiceDate: {
    type: Date
  },
  qrCode: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to auto-generate assetCode if not provided
assetSchema.pre('save', async function (next) {
  if (!this.assetCode) {
    // Find the highest asset number
    const lastAsset = await this.constructor.findOne(
      {},
      { assetCode: 1 }
    ).sort({ createdAt: -1 });

    let nextNumber = 1001;
    if (lastAsset && lastAsset.assetCode) {
      const lastNum = parseInt(lastAsset.assetCode.split('-')[1]);
      nextNumber = lastNum + 1;
    }
    this.assetCode = `AST-${nextNumber}`;
  }
  next();
});

module.exports = mongoose.model('Asset', assetSchema);
