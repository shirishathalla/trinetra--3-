const mongoose = require('mongoose');

const gpsLogSchema = new mongoose.Schema({
  tourist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tourist',
    required: true
  },
  location: {
    type: {
      type: String, 
      enum: ['Point'], 
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true // [longitude, latitude]
    }
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for geospatial queries
gpsLogSchema.index({ location: '2dsphere' });
gpsLogSchema.index({ tourist: 1, timestamp: -1 });

module.exports = mongoose.model('GPSLog', gpsLogSchema);
