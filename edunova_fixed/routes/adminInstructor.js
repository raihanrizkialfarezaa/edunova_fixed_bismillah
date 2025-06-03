const express = require('express');
const router = express.Router();
const userController = require('../controllers/userInstructor');
const { authenticate } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/authorization');

// Get all instructor requests (Admin only)
router.get('/instructor-requests', authenticate, isAdmin, userController.getInstructorRequests);

// Approve or reject instructor request (Admin only)
router.put('/users/:id/approve-instructor', authenticate, isAdmin, userController.approveInstructor);

module.exports = router;