const User = require('../models/User');
const Tourist = require('../models/Tourist');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { email, password, role, profileData } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      email,
      password,
      role: role || 'tourist'
    });

    // If role is tourist and profileData is provided, create profile immediately
    if (user.role === 'tourist' && profileData) {
      try {
        const touristId = 'TRI-' + Math.floor(100000 + Math.random() * 900000);
        
        await Tourist.create({
          user: user._id,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phone: profileData.phone,
          countryCode: profileData.countryCode || '+91',
          idDocumentUrl: profileData.idDocumentUrl,
          touristId,
          medicalDetails: profileData.medicalDetails,
          emergencyContacts: profileData.emergencyContacts || [],
          travelInformation: profileData.travelInformation,
          age: profileData.age,
          dateOfBirth: profileData.dateOfBirth,
          nationality: profileData.nationality || 'India',
          gender: profileData.gender,
          identificationNumber: profileData.identificationNumber
        });
      } catch (profileError) {
        // Rollback user creation if profile creation fails
        await User.findByIdAndDelete(user._id);
        return res.status(400).json({ message: 'Failed to create tourist profile: ' + profileError.message });
      }
    }

    res.status(201).json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if current password matches
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ message: 'Incorrect current password' });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
