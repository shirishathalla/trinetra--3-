const GPSLog = require('../models/GPSLog');
const Tourist = require('../models/Tourist');

// @desc    Update GPS Location
// @route   POST /api/gps/update
// @access  Private (Tourist)
exports.updateLocation = async (req, res) => {
  try {
    const { coordinates } = req.body; // [longitude, latitude]

    const tourist = await Tourist.findOne({ user: req.user._id });
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist profile not found' });
    }

    const log = await GPSLog.create({
      tourist: tourist._id,
      location: {
        type: 'Point',
        coordinates
      }
    });

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get GPS history for a tourist
// @route   GET /api/gps/history/:touristId
// @access  Private (Authority)
exports.getGPSHistory = async (req, res) => {
  try {
    const logs = await GPSLog.find({ tourist: req.params.touristId })
      .sort({ timestamp: -1 })
      .limit(50); // Get last 50 locations
    
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Get latest locations of all tourists
// @route   GET /api/gps/latest
// @access  Private (Authority)
exports.getLatestLocations = async (req, res) => {
  try {
    const latestLogs = await GPSLog.aggregate([
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: '$tourist',
          location: { $first: '$location' },
          timestamp: { $first: '$timestamp' },
          logId: { $first: '$_id' }
        }
      },
      {
        $lookup: {
          from: 'tourists',
          localField: '_id',
          foreignField: '_id',
          as: 'tourist'
        }
      },
      { $unwind: '$tourist' },
      {
        $project: {
          _id: '$logId',
          location: 1,
          timestamp: 1,
          'tourist._id': 1,
          'tourist.firstName': 1,
          'tourist.lastName': 1,
          'tourist.phone': 1,
          'tourist.touristId': 1
        }
      }
    ]);
    
    res.json(latestLogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
