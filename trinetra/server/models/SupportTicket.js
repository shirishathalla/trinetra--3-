const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'resolved'],
    default: 'open'
  }
}, { timestamps: true });

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
