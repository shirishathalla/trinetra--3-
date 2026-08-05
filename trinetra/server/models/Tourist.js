const mongoose = require('mongoose');

const touristSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  countryCode: {
    type: String,
    default: '+91'
  },
  photoUrl: {
    type: String,
    default: 'default.jpg'
  },
  dateOfBirth: {
    type: Date
  },
  age: {
    type: Number
  },
  isTourActive: {
    type: Boolean,
    default: false
  },
  nationality: {
    type: String,
    default: 'India'
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say']
  },
  identificationNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  idDocumentUrl: { // Passport or Aadhaar
    type: String,
    required: true
  },
  touristId: {
    type: String,
    unique: true
  },
  qrCodeUrl: {
    type: String
  },
  medicalDetails: {
    bloodGroup: String,
    allergies: String,
    chronicConditions: String,
  },
  emergencyContacts: [{
    name: String,
    relation: String,
    phone: String,
    countryCode: { type: String, default: '+91' }
  }],
  travelInformation: {
    destination: String,
    arrivalDate: Date,
    departureDate: Date,
    hotelName: String,
    hotelAddress: String
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tourist', touristSchema);
