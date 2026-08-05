const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  targetModel: {
    type: String,
    required: true,
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
