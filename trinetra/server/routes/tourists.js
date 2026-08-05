const express = require('express');
const router = express.Router();
const { createProfile, getMyProfile, getTouristByQR, updateMyProfile, updateTourStatus, getJourneyLog } = require('../controllers/touristController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, createProfile);
router.get('/me', protect, getMyProfile);
router.get('/me/journey', protect, getJourneyLog);
router.put('/me', protect, updateMyProfile);
router.put('/me/tour-status', protect, updateTourStatus);
router.get('/qr/:touristId', getTouristByQR); // Public for scanning

module.exports = router;
