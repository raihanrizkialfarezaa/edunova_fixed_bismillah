const express = require('express');
const router = express.Router();
const payoutController = require('../controllers/payout');
const { authenticate } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/authorization');

// GET pending payouts (Admin only)
router.get('/payouts/pending', 
  authenticate, 
  isAdmin,
  payoutController.getPendingPayouts
);

module.exports = router;