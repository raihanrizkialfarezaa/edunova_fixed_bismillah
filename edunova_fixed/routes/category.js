const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category');
const { authenticate } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/authorization');

// GET all categories - public access
router.get('/', categoryController.getAllCategories);

// POST create new category - admin only
router.post('/create', authenticate, isAdmin, categoryController.createCategory);

// PUT update category - admin only
router.put('/update/:id', authenticate, isAdmin, categoryController.updateCategory);

module.exports = router;