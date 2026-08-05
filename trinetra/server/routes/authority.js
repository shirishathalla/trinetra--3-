const express = require('express');
const router = express.Router();
const { 
  getDashboardStats, 
  getAllTourists, 
  updateTouristVerification,
  updateTouristDetails,
  getAuditLogs,
  resetTouristPassword
} = require('../controllers/authorityController');
const { protect, authorize } = require('../middleware/auth');

// All routes here are protected and require 'authority' or 'admin' role
router.use(protect);
router.use(authorize('authority', 'admin'));

router.get('/dashboard', getDashboardStats);
router.get('/tourists', getAllTourists);
router.put('/tourists/:id/verify', updateTouristVerification);
router.put('/tourists/:id', updateTouristDetails);
router.put('/tourists/:id/password', resetTouristPassword);
router.get('/logs', getAuditLogs);

module.exports = router;
