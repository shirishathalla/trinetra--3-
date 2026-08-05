const mongoose = require('mongoose');

const sosAlertSchema = new mongoose.Schema({
  tourist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tourist',
    required: true
  },
  incidentId: {
    type: String,
    unique: true
  },
  location: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true // [longitude, latitude]
    }
  },
  deviceInfo: {
    batteryLevel: Number,
    networkStatus: String,
    deviceType: String,
    userAgent: String
  },
  status: {
    type: String,
    enum: ['active', 'resolving', 'resolved', 'false_alarm'],
    default: 'active'
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolutionNotes: String
}, {
  timestamps: true
});

// Index for geospatial queries
sosAlertSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('SOSAlert', sosAlertSchema);
