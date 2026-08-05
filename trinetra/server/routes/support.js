const express = require('express');
const router = express.Router();
const { createTicket, getTickets, resolveTicket } = require('../controllers/supportController');
const { protect, authorize } = require('../middleware/auth');

// Public route for tourists to submit forms
router.post('/', createTicket);

// Protected routes for authorities
router.get('/', protect, authorize('authority', 'admin'), getTickets);
router.put('/:id/resolve', protect, authorize('authority', 'admin'), resolveTicket);

module.exports = router;
