const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tag');
const { authenticate } = require('../middlewares/auth');
const { isInstructorOrAdmin } = require('../middlewares/authorization');

// GET all tags - public access
router.get('/', tagController.getAllTags);

// POST create new tag - instructors and admins
router.post('/create', authenticate, isInstructorOrAdmin, tagController.createTag);

module.exports = router;