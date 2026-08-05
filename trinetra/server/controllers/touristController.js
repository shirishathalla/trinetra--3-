const Tourist = require('../models/Tourist');
const AuditLog = require('../models/AuditLog');
const SOSAlert = require('../models/SOSAlert');
const User = require('../models/User');

// @desc    Create tourist profile
// @route   POST /api/tourists
// @access  Private (Tourist only)
exports.createProfile = async (req, res) => {
  try {
    const {
      firstName, lastName, phone, idDocumentUrl,
      medicalDetails, emergencyContacts, travelInformation,
      age, dateOfBirth, nationality, gender, identificationNumber
    } = req.body;

    // Check if profile already exists for this user
    let tourist = await Tourist.findOne({ user: req.user._id });
    if (tourist) {
      return res.status(400).json({ message: 'Profile already exists for this user' });
    }

    // Generate Tourist ID automatically
    const touristId = 'TRI-' + Math.floor(100000 + Math.random() * 900000);

    tourist = await Tourist.create({
      user: req.user._id,
      firstName,
      lastName,
      phone,
      idDocumentUrl,
      touristId,
      medicalDetails,
      emergencyContacts,
      travelInformation,
      age,
      dateOfBirth,
      nationality: nationality || 'India',
      gender,
      identificationNumber
    });

    res.status(201).json(tourist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current tourist profile
// @route   GET /api/tourists/me
// @access  Private
exports.getMyProfile = async (req, res) => {
  try {
    const tourist = await Tourist.findOne({ user: req.user._id });
    if (!tourist) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(tourist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get tourist by QR code (or ID)
// @route   GET /api/tourists/qr/:touristId
// @access  Public / Authority
exports.getTouristByQR = async (req, res) => {
  try {
    const tourist = await Tourist.findOne({ touristId: req.params.touristId }).populate('user', 'email');
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }
    res.json(tourist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update current tourist profile
// @route   PUT /api/tourists/me
// @access  Private
exports.updateMyProfile = async (req, res) => {
  try {
    const {
      firstName, lastName, phone,
      medicalDetails, emergencyContacts,
      age, dateOfBirth, nationality, gender, identificationNumber
    } = req.body;

    let tourist = await Tourist.findOne({ user: req.user._id });
    if (!tourist) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    if (firstName) tourist.firstName = firstName;
    if (lastName) tourist.lastName = lastName;
    if (phone) tourist.phone = phone;
    if (age !== undefined) tourist.age = age;
    if (dateOfBirth) tourist.dateOfBirth = dateOfBirth;
    if (nationality) tourist.nationality = nationality;
    if (gender) tourist.gender = gender;
    if (identificationNumber) tourist.identificationNumber = identificationNumber;
    if (medicalDetails) tourist.medicalDetails = medicalDetails;
    if (emergencyContacts) tourist.emergencyContacts = emergencyContacts;

    await tourist.save();

    res.json(tourist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update tour status (active/inactive)
// @route   PUT /api/tourists/me/tour-status
// @access  Private
exports.updateTourStatus = async (req, res) => {
  try {
    const { isTourActive } = req.body;
    let tourist = await Tourist.findOne({ user: req.user._id });
    if (!tourist) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    tourist.isTourActive = isTourActive;
    await tourist.save();
    
    res.json({ message: 'Tour status updated', isTourActive: tourist.isTourActive });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get journey log for tourist
// @route   GET /api/tourists/me/journey
// @access  Private
exports.getJourneyLog = async (req, res) => {
  try {
    let tourist = await Tourist.findOne({ user: req.user._id });
    if (!tourist) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    let logs = [];
    
    // Registration event
    logs.push({
      id: 'reg_' + tourist._id,
      title: 'Registration Complete',
      description: 'Profile and biometrics acquired.',
      timestamp: tourist.createdAt,
      type: 'registration',
      color: 'slate'
    });

    // Verification event
    if (tourist.verificationStatus === 'verified') {
      const verifyLog = await AuditLog.findOne({ targetId: tourist._id, action: 'TOURIST_VERIFIED' });
      logs.push({
        id: 'ver_' + tourist._id,
        title: 'Identity Verified',
        description: 'Identity verified by local authority.',
        timestamp: verifyLog ? verifyLog.createdAt : tourist.updatedAt,
        type: 'verification',
        color: 'green'
      });
      logs.push({
        id: 'id_' + tourist._id,
        title: 'Digital ID Issued',
        description: 'Secure pass generated successfully.',
        timestamp: verifyLog ? verifyLog.createdAt : tourist.updatedAt,
        type: 'digital_id',
        color: 'blue'
      });
    }

    // SOS Alerts
    const alerts = await SOSAlert.find({ tourist: tourist._id });
    alerts.forEach(alert => {
      logs.push({
        id: 'sos_' + alert._id,
        title: 'Emergency SOS Triggered',
        description: `Alert ID: #${alert.incidentId}. Status: ${alert.status}`,
        timestamp: alert.createdAt,
        type: 'sos',
        color: 'red'
      });
    });

    // Sort by timestamp descending
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
