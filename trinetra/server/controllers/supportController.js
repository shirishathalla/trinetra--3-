const SupportTicket = require('../models/SupportTicket');
const AuditLog = require('../models/AuditLog');

// @desc    Create a new support ticket
// @route   POST /api/support
// @access  Public
exports.createTicket = async (req, res) => {
  try {
    const { firstName, lastName, email, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ success: false, error: 'Please provide all required fields' });
    }

    const ticket = await SupportTicket.create({
      firstName,
      lastName,
      email,
      message
    });

    res.status(201).json({ success: true, data: ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get all support tickets
// @route   GET /api/support
// @access  Private (Authority/Admin)
exports.getTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Resolve a support ticket
// @route   PUT /api/support/:id/resolve
// @access  Private (Authority/Admin)
exports.resolveTicket = async (req, res) => {
  try {
    let ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, error: 'Ticket not found' });
    }

    ticket.status = 'resolved';
    await ticket.save();

    await AuditLog.create({
      action: 'TICKET_RESOLVED',
      performedBy: req.user._id,
      targetModel: 'SupportTicket',
      targetId: ticket._id,
      details: {
        ticketEmail: ticket.email
      }
    });

    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
