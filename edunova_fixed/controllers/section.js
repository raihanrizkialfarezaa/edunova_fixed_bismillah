const { Course, Section, Lesson, User } = require('../models');
const { Op } = require('sequelize');

// Create new section for a course
exports.createSection = async (req, res) => {
  try {
    const { id: courseId } = req.params;
    const { title, order } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({ 
        message: 'Section title is required' 
      });
    }

    // Check if course exists and user has permission
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is course owner or admin
    if (course.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ 
        message: 'You are not authorized to add sections to this course' 
      });
    }

    // If order is not provided, set it to the next available order
    let sectionOrder = order;
    if (!sectionOrder) {
      const maxOrder = await Section.max('order', {
        where: { courseId }
      });
      sectionOrder = (maxOrder || 0) + 1;
    }

    // Check if order already exists for this course
    if (order) {
      const existingSection = await Section.findOne({
        where: { courseId, order: sectionOrder }
      });
      
      if (existingSection) {
        return res.status(400).json({ 
          message: 'Section with this order already exists for this course' 
        });
      }
    }

    const newSection = await Section.create({
      title,
      order: sectionOrder,
      courseId
    });

    res.status(201).json({
      message: 'Section created successfully',
      section: newSection
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all sections for a course
exports.getCourseSections = async (req, res) => {
  try {
    const { id: courseId } = req.params;
    const { includeLessons = 'false' } = req.query;

    // Check if course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const includeOptions = [];
    
    if (includeLessons === 'true') {
      includeOptions.push({
        model: Lesson,
        as: 'Lessons',
        attributes: ['id', 'title', 'duration', 'order', 'videoUrl'],
        order: [['order', 'ASC']]
      });
    }

    const sections = await Section.findAll({
      where: { courseId },
      include: includeOptions,
      order: [['order', 'ASC']],
      ...(includeLessons === 'true' && {
        order: [
          ['order', 'ASC'],
          [{ model: Lesson, as: 'Lessons' }, 'order', 'ASC']
        ]
      })
    });

    res.json({
      message: 'Course sections retrieved successfully',
      sections,
      course: {
        id: course.id,
        title: course.title
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update section
exports.updateSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, order } = req.body;

    const section = await Section.findByPk(id, {
      include: [{
        model: Course,
        as: 'course',
        attributes: ['id', 'instructorId']
      }]
    });

    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    // Check if user has permission
    if (section.course.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ 
        message: 'You are not authorized to update this section' 
      });
    }

    // If order is being updated, check for conflicts
    if (order && order !== section.order) {
      const existingSection = await Section.findOne({
        where: { 
          courseId: section.courseId, 
          order,
          id: { [Op.ne]: id }
        }
      });
      
      if (existingSection) {
        return res.status(400).json({ 
          message: 'Section with this order already exists for this course' 
        });
      }
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (order !== undefined) updateData.order = order;

    await section.update(updateData);

    const updatedSection = await Section.findByPk(id, {
      include: [{
        model: Lesson,
        as: 'Lessons',
        attributes: ['id', 'title', 'duration', 'order'],
        order: [['order', 'ASC']]
      }]
    });

    res.json({
      message: 'Section updated successfully',
      section: updatedSection
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete section
exports.deleteSection = async (req, res) => {
  try {
    const { id } = req.params;

    const section = await Section.findByPk(id, {
      include: [{
        model: Course,
        as: 'course',
        attributes: ['id', 'instructorId']
      }]
    });

    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    // Check if user has permission
    if (section.course.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ 
        message: 'You are not authorized to delete this section' 
      });
    }

    // Check if section has lessons
    const lessonsCount = await Lesson.count({
      where: { sectionId: id }
    });

    if (lessonsCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete section that contains lessons. Please delete all lessons first.' 
      });
    }

    await section.destroy();

    res.json({ message: 'Section deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reorder sections for a course
exports.reorderSections = async (req, res) => {
  try {
    const { id: courseId } = req.params;
    const { sectionOrders } = req.body; // Array of { id, order }

    if (!sectionOrders || !Array.isArray(sectionOrders)) {
      return res.status(400).json({ 
        message: 'sectionOrders array is required' 
      });
    }

    // Check if course exists and user has permission
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ 
        message: 'You are not authorized to reorder sections for this course' 
      });
    }

    // Verify all sections belong to this course
    const sectionIds = sectionOrders.map(item => item.id);
    const sections = await Section.findAll({
      where: { 
        id: { [Op.in]: sectionIds },
        courseId 
      }
    });

    if (sections.length !== sectionIds.length) {
      return res.status(400).json({ 
        message: 'One or more sections do not belong to this course' 
      });
    }

    // Update section orders
    const updatePromises = sectionOrders.map(({ id, order }) => 
      Section.update({ order }, { where: { id } })
    );

    await Promise.all(updatePromises);

    // Fetch updated sections
    const updatedSections = await Section.findAll({
      where: { courseId },
      order: [['order', 'ASC']]
    });

    res.json({
      message: 'Sections reordered successfully',
      sections: updatedSections
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};