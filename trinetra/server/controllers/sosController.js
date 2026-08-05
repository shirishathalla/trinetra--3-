const SOSAlert = require('../models/SOSAlert');
const Tourist = require('../models/Tourist');
const AuditLog = require('../models/AuditLog');

// @desc    Trigger SOS Alert
// @route   POST /api/sos/trigger
// @access  Private (Tourist)
exports.triggerSOS = async (req, res) => {
  try {
    const coordinates = req.body.coordinates || req.body.location?.coordinates;
    const { batteryLevel, networkStatus, deviceType, userAgent } = req.body;

    const tourist = await Tourist.findOne({ user: req.user._id });
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist profile not found' });
    }

    const incidentId = 'SOS-' + Date.now();

    const sos = await SOSAlert.create({
      tourist: tourist._id,
      incidentId,
      location: {
        type: 'Point',
        coordinates // [longitude, latitude]
      },
      deviceInfo: {
        batteryLevel,
        networkStatus,
        deviceType,
        userAgent
      },
      status: 'active'
    });

    // In a real app, you would integrate Twilio / Nodemailer / WhatsApp API here.

    res.status(201).json(sos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get active SOS alerts
// @route   GET /api/sos/active
// @access  Private (Authority)
exports.getActiveSOS = async (req, res) => {
  try {
    const sosAlerts = await SOSAlert.find({ status: 'active' })
      .populate('tourist')
      .sort({ createdAt: -1 });

    res.json(sosAlerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Resolve SOS Alert
// @route   PUT /api/sos/:id/resolve
// @access  Private (Authority)
exports.resolveSOS = async (req, res) => {
  try {
    const { resolutionNotes, status } = req.body; // status could be 'resolved' or 'false_alarm'
    
    const sos = await SOSAlert.findById(req.params.id);
    if (!sos) {
      return res.status(404).json({ message: 'SOS Alert not found' });
    }

    sos.status = status || 'resolved';
    sos.resolvedBy = req.user._id;
    sos.resolutionNotes = resolutionNotes;
    await sos.save();

    await AuditLog.create({
      action: 'SOS_RESOLVED',
      performedBy: req.user._id,
      targetModel: 'SOSAlert',
      targetId: sos._id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: {
        incidentId: sos.incidentId,
        status: sos.status,
        notes: resolutionNotes
      }
    });

    res.json(sos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
