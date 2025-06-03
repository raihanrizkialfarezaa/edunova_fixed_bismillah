const { Tag } = require('../models');
const { authenticate } = require('../middlewares/auth');
const { isAdmin, isInstructorOrAdmin } = require('../middlewares/authorization');

// Get all tags
exports.getAllTags = async (req, res) => {
  try {
    const tags = await Tag.findAll();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new tag (Instructors and Admins)
exports.createTag = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Tag name is required' });
  }

  try {
    // Check if tag already exists
    const existingTag = await Tag.findOne({ where: { name } });
    if (existingTag) {
      return res.status(400).json({ message: 'Tag already exists' });
    }

    const newTag = await Tag.create({ name });
    res.status(201).json(newTag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};