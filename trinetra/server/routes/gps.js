const express = require('express');
const router = express.Router();
const { updateLocation, getGPSHistory, getLatestLocations } = require('../controllers/gpsController');
const { protect, authorize } = require('../middleware/auth');

router.post('/update', protect, updateLocation);
router.get('/latest', protect, authorize('authority', 'admin'), getLatestLocations);
router.get('/history/:touristId', protect, authorize('authority', 'admin'), getGPSHistory);

module.exports = router;
