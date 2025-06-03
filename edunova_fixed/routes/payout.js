const express = require('express');
const router = express.Router();
const payoutController = require('../controllers/payout');
const { authenticate } = require('../middlewares/auth');
const { isAdmin, isInstructor, isInstructorOrAdmin } = require('../middlewares/authorization');

// POST create payout request (Instructor only)
router.post('/', 
  authenticate, 
  isInstructor,
  payoutController.createPayout
);

// GET payout details (Instructor can see their own, Admin can see all)
router.get('/:id', 
  authenticate, 
  isInstructorOrAdmin,
  payoutController.getPayoutDetails
);

// PUT update payout status (Admin only)
router.put('/:id/status', 
  authenticate, 
  isAdmin,
  payoutController.updatePayoutStatus
);

// GET instructor's own payouts (Instructor only)
router.get('/instructor/my-payouts', 
  authenticate, 
  isInstructor,
  payoutController.getInstructorPayouts
);

// GET instructor's total balance across all courses (NEW ENDPOINT)
router.get('/instructor/total-balance', 
  authenticate, 
  isInstructor,
  payoutController.getInstructorTotalBalance
);

// GET available balance for a specific course (Instructor only)
router.get('/course/:courseId/balance', 
  authenticate, 
  isInstructor,
  payoutController.getCourseAvailableBalance
);

// GET debug info for instructor (development only)
router.get('/debug/instructor-info', 
  authenticate, 
  isInstructor,
  payoutController.getInstructorDebugInfo
);

module.exports = router;