const { Category } = require('../models');
const { authenticate } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/authorization');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new category (Admin only)
exports.createCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  try {
    // Check if category already exists
    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const newCategory = await Category.create({ name });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a category (Admin only)
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  try {
    const category = await Category.findByPk(id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if new name already exists in another category
    const existingCategory = await Category.findOne({ 
      where: { 
        name,
        id: { [require('sequelize').Op.ne]: id } // Not equal to current id
      } 
    });
    
    if (existingCategory) {
      return res.status(400).json({ message: 'Category name already exists' });
    }

    await category.update({ name });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};