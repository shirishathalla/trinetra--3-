const Tourist = require('../models/Tourist');
const SOSAlert = require('../models/SOSAlert');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

// @desc    Get dashboard stats
// @route   GET /api/authority/dashboard
// @access  Private (Authority)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalTourists = await Tourist.countDocuments();
    const activeSOS = await SOSAlert.countDocuments({ status: 'active' });
    const verifiedTourists = await Tourist.countDocuments({ verificationStatus: 'verified' });
    const pendingTourists = await Tourist.countDocuments({ verificationStatus: 'pending' });

    res.json({
      totalTourists,
      activeSOS,
      verifiedTourists,
      pendingTourists
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tourists (with pagination)
// @route   GET /api/authority/tourists
// @access  Private (Authority)
exports.getAllTourists = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const tourists = await Tourist.find()
      .populate('user', 'email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Tourist.countDocuments();

    res.json({
      tourists,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update tourist verification status
// @route   PUT /api/authority/tourists/:id/verify
// @access  Private (Authority)
exports.updateTouristVerification = async (req, res) => {
  try {
    const { status } = req.body; // 'verified' or 'rejected'
    
    const tourist = await Tourist.findById(req.params.id);
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    tourist.verificationStatus = status;
    await tourist.save();

    await AuditLog.create({
      action: status === 'verified' ? 'TOURIST_VERIFIED' : 'TOURIST_REJECTED',
      performedBy: req.user._id,
      targetModel: 'Tourist',
      targetId: tourist._id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: {
        touristName: `${tourist.firstName} ${tourist.lastName}`,
        touristId: tourist.touristId
      }
    });

    res.json(tourist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update tourist details (Editable access)
// @route   PUT /api/authority/tourists/:id
// @access  Private (Authority)
exports.updateTouristDetails = async (req, res) => {
  try {
    const { firstName, lastName, phone, medicalDetails, emergencyContacts } = req.body;
    
    const tourist = await Tourist.findById(req.params.id);
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    const changesMade = {};
    if (firstName && tourist.firstName !== firstName) changesMade.firstName = { old: tourist.firstName, new: firstName };
    if (lastName && tourist.lastName !== lastName) changesMade.lastName = { old: tourist.lastName, new: lastName };
    if (phone && tourist.phone !== phone) changesMade.phone = { old: tourist.phone, new: phone };
    
    // Minimal tracking for nested objects just saying it changed
    if (medicalDetails && JSON.stringify(tourist.medicalDetails) !== JSON.stringify(medicalDetails)) changesMade.medicalDetails = 'Updated';
    if (emergencyContacts && JSON.stringify(tourist.emergencyContacts) !== JSON.stringify(emergencyContacts)) changesMade.emergencyContacts = 'Updated';

    if (firstName) tourist.firstName = firstName;
    if (lastName) tourist.lastName = lastName;
    if (phone) tourist.phone = phone;
    if (medicalDetails) tourist.medicalDetails = medicalDetails;
    if (emergencyContacts) tourist.emergencyContacts = emergencyContacts;

    await tourist.save();

    await AuditLog.create({
      action: 'TOURIST_PROFILE_EDITED',
      performedBy: req.user._id,
      targetModel: 'Tourist',
      targetId: tourist._id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: {
        touristName: `${tourist.firstName} ${tourist.lastName}`,
        touristId: tourist.touristId,
        changesMade
      }
    });

    res.json(tourist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get system audit logs
// @route   GET /api/authority/logs
// @access  Private (Authority)
exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('performedBy', 'firstName lastName email role')
      .sort({ createdAt: -1 })
      .limit(100);
      
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset tourist password
// @route   PUT /api/authority/tourists/:id/password
// @access  Private (Authority)
exports.resetTouristPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    
    const tourist = await Tourist.findById(req.params.id).populate('user');
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    const user = await User.findById(tourist.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User account not found' });
    }

    user.password = newPassword;
    await user.save(); // This will trigger the pre-save hook and hash the password

    await AuditLog.create({
      action: 'TOURIST_PASSWORD_RESET',
      performedBy: req.user._id,
      targetModel: 'User',
      targetId: user._id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      details: {
        touristName: `${tourist.firstName} ${tourist.lastName}`,
        touristId: tourist.touristId
      }
    });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
