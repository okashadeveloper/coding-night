
const mongoose = require('mongoose');

const assetHistorySchema = new mongoose.Schema({
  asset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
    required: true
  },
  action: {
    type: String,
    required: true
  },
  actor: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  relatedIssue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AssetHistory', assetHistorySchema);
