const express = require('express');
const router = express.Router();
const adminDashboardController = require('../controllers/adminDashboard');
const { authenticate } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/authorization');

// Apply authentication and admin authorization to all routes
router.use(authenticate);
router.use(isAdmin);

// GET admin dashboard statistics
router.get('/dashboard', adminDashboardController.getDashboardStats);

// GET all users with filtering and pagination
router.get('/users', adminDashboardController.getAllUsers);

// GET all courses with comprehensive filtering and statistics
router.get('/courses', adminDashboardController.getAllCoursesAdmin);

module.exports = router;