const express = require('express');
const router = express.Router();
const { triggerSOS, getActiveSOS, resolveSOS } = require('../controllers/sosController');
const { protect, authorize } = require('../middleware/auth');

router.post('/trigger', protect, triggerSOS);
router.get('/active', protect, authorize('authority', 'admin'), getActiveSOS);
router.put('/:id/resolve', protect, authorize('authority', 'admin'), resolveSOS);

module.exports = router;
