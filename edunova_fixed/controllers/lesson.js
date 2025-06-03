const { Course, Section, Lesson, User, Quiz } = require('../models');
const { Op } = require('sequelize');
const VideoService = require('../services/videoService');
const { uploadVideo, deleteVideo } = require('../config/cloudinary');
const { validateYouTubeUrl, getEmbeddableYouTubeUrl } = require('../utils/youtube');
const multer = require('multer');

// Configure multer for memory storage (no local folders needed)
const storage = multer.memoryStorage();

// File filter for videos only
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm', 'video/mkv', 'video/flv'];
  const allowedMimes = ['video/mp4', 'video/avi', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv', 'video/webm', 'video/x-matroska', 'video/x-flv'];

  if (allowedMimes.includes(file.mimetype) || allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed (mp4, avi, mov, wmv, webm, mkv, flv)'), false);
  }
};

// Configure multer with memory storage
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit for video files
  },
});

// Middleware for single video upload
exports.uploadVideoMiddleware = upload.single('video');

// Error handling middleware for multer
exports.handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File too large. Maximum size is 500MB',
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        message: 'Unexpected field. Please use "video" as the field name for video upload.',
      });
    }
    return res.status(400).json({
      message: 'File upload error: ' + error.message,
    });
  } else if (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
  next();
};

// Create new lesson for a section with video upload to cloud
exports.createLesson = async (req, res) => {
  try {
    const { id: sectionId } = req.params;
    const { title, content, duration, order, youtubeUrl } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({
        message: 'Lesson title and content are required',
      });
    }

    // Check if both video file and YouTube URL are provided
    if (req.file && youtubeUrl) {
      return res.status(400).json({
        message: 'Please provide either a video file or YouTube URL, not both',
      });
    }

    // Check if section exists and get course info
    const section = await Section.findByPk(sectionId, {
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'instructorId', 'title'],
        },
      ],
    });

    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    // Check if user has permission
    if (section.course.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        message: 'You are not authorized to add lessons to this section',
      });
    }

    // If order is not provided, set it to the next available order
    let lessonOrder = order;
    if (!lessonOrder) {
      const maxOrder = await Lesson.max('order', {
        where: { sectionId },
      });
      lessonOrder = (maxOrder || 0) + 1;
    }

    // Check if order already exists for this section
    if (order) {
      const existingLesson = await Lesson.findOne({
        where: { sectionId, order: parseInt(lessonOrder) },
      });

      if (existingLesson) {
        return res.status(400).json({
          message: 'Lesson with this order already exists in this section',
        });
      }
    }

    let videoUrl = null;
    let videoPublicId = null;
    let videoDuration = duration ? parseInt(duration) : null;
    let finalYoutubeUrl = null;
    let videoType = null;

    // Handle YouTube URL if provided
    if (youtubeUrl) {
      try {
        console.log('Validating YouTube URL...');

        // Validate YouTube URL
        const isValidYouTube = await validateYouTubeUrl(youtubeUrl);
        if (!isValidYouTube) {
          return res.status(400).json({
            message: 'Invalid or inaccessible YouTube URL',
          });
        }

        finalYoutubeUrl = getEmbeddableYouTubeUrl(youtubeUrl);
        videoType = 'YOUTUBE';

        console.log('YouTube URL validated successfully:', finalYoutubeUrl);
      } catch (error) {
        console.error('YouTube URL validation error:', error);
        return res.status(400).json({
          message: 'Failed to validate YouTube URL: ' + error.message,
        });
      }
    }

    // Handle video upload to Cloudinary if file is provided
    if (req.file) {
      try {
        console.log('Uploading video to cloud storage...');

        const publicId = `courses/${section.course.id}/sections/${sectionId}/lessons/lesson-${Date.now()}`;

        // Upload video to Cloudinary
        const cloudinaryResult = await uploadVideo(req.file.buffer, {
          folder: `courses/${section.course.id}/sections/${sectionId}/lessons`,
          resource_type: 'video',
          public_id: publicId,
          chunk_size: 20000000, // 20MB chunks for large files
          eager: [
            { width: 720, height: 480, crop: 'limit', quality: 'auto:good' },
            { width: 1280, height: 720, crop: 'limit', quality: 'auto:best' },
          ],
          eager_async: true,
        });

        videoUrl = cloudinaryResult.secure_url;
        videoPublicId = cloudinaryResult.public_id;
        videoType = 'CLOUDINARY';

        // Try to get video duration from Cloudinary if not provided
        if (!videoDuration && cloudinaryResult.duration) {
          videoDuration = Math.round(cloudinaryResult.duration);
        }

        console.log('Video uploaded successfully:', {
          url: videoUrl,
          publicId: videoPublicId,
          duration: videoDuration,
        });

        // Optional: Use VideoService for additional processing
        if (VideoService && VideoService.processVideo) {
          await VideoService.processVideo({
            url: videoUrl,
            courseId: section.course.id,
            sectionId: sectionId,
            duration: videoDuration,
          });
        }
      } catch (uploadError) {
        console.error('Video upload error:', uploadError);
        return res.status(500).json({
          message: 'Failed to upload video: ' + uploadError.message,
        });
      }
    }

    // Create the lesson
    const newLesson = await Lesson.create({
      title,
      content,
      videoUrl: videoUrl,
      videoPublicId: videoPublicId,
      youtubeUrl: finalYoutubeUrl,
      videoType: videoType,
      duration: videoDuration,
      order: parseInt(lessonOrder),
      sectionId,
    });

    res.status(201).json({
      message: 'Lesson created successfully',
      lesson: newLesson,
      videoUploaded: !!req.file,
      youtubeUrlAdded: !!youtubeUrl,
    });
  } catch (error) {
    console.error('Create lesson error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update lesson with optional video upload
exports.updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, duration, order, youtubeUrl, removeVideo } = req.body;

    const lesson = await Lesson.findByPk(id, {
      include: [
        {
          model: Section,
          as: 'section',
          include: [
            {
              model: Course,
              as: 'course',
              attributes: ['id', 'instructorId'],
            },
          ],
        },
      ],
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Check if user has permission
    if (lesson.section.course.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        message: 'You are not authorized to update this lesson',
      });
    }

    // Check if both video file and YouTube URL are provided
    if (req.file && youtubeUrl) {
      return res.status(400).json({
        message: 'Please provide either a video file or YouTube URL, not both',
      });
    }

    // If order is being updated, check for conflicts
    if (order && parseInt(order) !== lesson.order) {
      const existingLesson = await Lesson.findOne({
        where: {
          sectionId: lesson.sectionId,
          order: parseInt(order),
          id: { [Op.ne]: id },
        },
      });

      if (existingLesson) {
        return res.status(400).json({
          message: 'Lesson with this order already exists in this section',
        });
      }
    }

    // Build update data object
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (duration !== undefined) updateData.duration = parseInt(duration);
    if (order !== undefined) updateData.order = parseInt(order);

    // Handle removing existing video
    if (removeVideo === 'true' || removeVideo === true) {
      // Delete old cloudinary video if exists
      if (lesson.videoPublicId) {
        try {
          await deleteVideo(lesson.videoPublicId);
          console.log('Old video deleted:', lesson.videoPublicId);
        } catch (deleteError) {
          console.warn('Failed to delete old video:', deleteError);
        }
      }

      updateData.videoUrl = null;
      updateData.videoPublicId = null;
      updateData.youtubeUrl = null;
      updateData.videoType = null;
    }

    // Handle YouTube URL update
    if (youtubeUrl !== undefined) {
      if (youtubeUrl) {
        try {
          console.log('Validating YouTube URL...');

          // Validate YouTube URL
          const isValidYouTube = await validateYouTubeUrl(youtubeUrl);
          if (!isValidYouTube) {
            return res.status(400).json({
              message: 'Invalid or inaccessible YouTube URL',
            });
          }

          // Delete old cloudinary video if switching to YouTube
          if (lesson.videoPublicId) {
            try {
              await deleteVideo(lesson.videoPublicId);
              console.log('Old cloudinary video deleted when switching to YouTube:', lesson.videoPublicId);
            } catch (deleteError) {
              console.warn('Failed to delete old cloudinary video:', deleteError);
            }
          }

          updateData.youtubeUrl = getEmbeddableYouTubeUrl(youtubeUrl);
          updateData.videoUrl = null;
          updateData.videoPublicId = null;
          updateData.videoType = 'YOUTUBE';

          console.log('YouTube URL validated successfully:', updateData.youtubeUrl);
        } catch (error) {
          console.error('YouTube URL validation error:', error);
          return res.status(400).json({
            message: 'Failed to validate YouTube URL: ' + error.message,
          });
        }
      } else {
        // If youtubeUrl is empty string or null, remove it
        updateData.youtubeUrl = null;
        if (lesson.videoType === 'YOUTUBE') {
          updateData.videoType = null;
        }
      }
    }

    // Handle video file upload if new video is provided
    if (req.file) {
      try {
        console.log('Uploading new video to cloud storage...');

        const publicId = `courses/${lesson.section.course.id}/sections/${lesson.sectionId}/lessons/lesson-${id}-${Date.now()}`;

        // Upload new video to Cloudinary
        const cloudinaryResult = await uploadVideo(req.file.buffer, {
          folder: `courses/${lesson.section.course.id}/sections/${lesson.sectionId}/lessons`,
          resource_type: 'video',
          public_id: publicId,
          chunk_size: 20000000,
          eager: [
            { width: 720, height: 480, crop: 'limit', quality: 'auto:good' },
            { width: 1280, height: 720, crop: 'limit', quality: 'auto:best' },
          ],
          eager_async: true,
        });

        // Delete old video if exists (both cloudinary and youtube)
        if (lesson.videoPublicId) {
          try {
            await deleteVideo(lesson.videoPublicId);
            console.log('Old cloudinary video deleted:', lesson.videoPublicId);
          } catch (deleteError) {
            console.warn('Failed to delete old video:', deleteError);
          }
        }

        updateData.videoUrl = cloudinaryResult.secure_url;
        updateData.videoPublicId = cloudinaryResult.public_id;
        updateData.youtubeUrl = null; // Remove YouTube URL when uploading new video
        updateData.videoType = 'CLOUDINARY';

        // Update duration if available from video metadata
        if (cloudinaryResult.duration && !duration) {
          updateData.duration = Math.round(cloudinaryResult.duration);
        }

        console.log('New video uploaded successfully:', {
          url: updateData.videoUrl,
          publicId: updateData.videoPublicId,
        });
      } catch (uploadError) {
        console.error('Video upload error:', uploadError);
        return res.status(500).json({
          message: 'Failed to upload video: ' + uploadError.message,
        });
      }
    }

    // Update lesson
    await lesson.update(updateData);

    const updatedLesson = await Lesson.findByPk(id);

    res.json({
      message: 'Lesson updated successfully',
      lesson: updatedLesson,
      videoUpdated: !!req.file,
      youtubeUrlUpdated: !!youtubeUrl,
    });
  } catch (error) {
    console.error('Update lesson error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Stream video for authenticated users
exports.streamVideo = async (req, res) => {
  try {
    const { lessonId } = req.params;

    // Get lesson with access check already done by middleware
    const lesson = req.lesson; // From middleware

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Check if lesson has any video content
    if (!lesson.videoUrl && !lesson.youtubeUrl) {
      return res.status(404).json({ message: 'No video content found for this lesson' });
    }

    // Return video info instead of redirect for both types
    const videoInfo = {
      lessonId: lesson.id,
      title: lesson.title,
      duration: lesson.duration
    };

    if (lesson.videoType === 'YOUTUBE' && lesson.youtubeUrl) {
      // For YouTube videos, return the embeddable URL
      res.json({
        ...videoInfo,
        type: 'youtube',
        url: lesson.youtubeUrl,
        embedUrl: lesson.youtubeUrl
      });
    } else if (lesson.videoType === 'CLOUDINARY' && lesson.videoUrl) {
      // For Cloudinary videos, return direct URL for video player
      res.json({
        ...videoInfo,
        type: 'cloudinary',
        url: lesson.videoUrl,
        streamUrl: lesson.videoUrl
      });
    } else {
      // Fallback logic for backward compatibility
      if (lesson.youtubeUrl) {
        res.json({
          ...videoInfo,
          type: 'youtube',
          url: lesson.youtubeUrl,
          embedUrl: lesson.youtubeUrl
        });
      } else if (lesson.videoUrl) {
        res.json({
          ...videoInfo,
          type: 'cloudinary',
          url: lesson.videoUrl,
          streamUrl: lesson.videoUrl
        });
      } else {
        return res.status(404).json({ message: 'Video not found' });
      }
    }

  } catch (error) {
    console.error('Stream video error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get video info (for players that need metadata)
exports.getVideoInfo = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = req.lesson; // From middleware

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Check if lesson has any video content
    if (!lesson.videoUrl && !lesson.youtubeUrl) {
      return res.status(404).json({ message: 'No video content found for this lesson' });
    }

    const videoInfo = {
      lessonId: lesson.id,
      title: lesson.title,
      duration: lesson.duration,
      videoType: lesson.videoType || (lesson.youtubeUrl ? 'YOUTUBE' : 'CLOUDINARY')
    };

    if (lesson.videoType === 'YOUTUBE' && lesson.youtubeUrl) {
      videoInfo.type = 'youtube';
      videoInfo.url = lesson.youtubeUrl;
      videoInfo.embedUrl = lesson.youtubeUrl;
    } else if (lesson.videoType === 'CLOUDINARY' && lesson.videoUrl) {
      videoInfo.type = 'cloudinary';
      videoInfo.url = lesson.videoUrl;
      videoInfo.streamUrl = lesson.videoUrl;
    } else {
      // Fallback logic for backward compatibility
      if (lesson.youtubeUrl) {
        videoInfo.type = 'youtube';
        videoInfo.url = lesson.youtubeUrl;
        videoInfo.embedUrl = lesson.youtubeUrl;
      } else if (lesson.videoUrl) {
        videoInfo.type = 'cloudinary';
        videoInfo.url = lesson.videoUrl;
        videoInfo.streamUrl = lesson.videoUrl;
      }
    }

    res.json(videoInfo);

  } catch (error) {
    console.error('Get video info error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete lesson
exports.deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findByPk(id, {
      include: [
        {
          model: Section,
          as: 'section',
          include: [
            {
              model: Course,
              as: 'course',
              attributes: ['id', 'instructorId'],
            },
          ],
        },
      ],
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Check if user has permission
    if (lesson.section.course.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        message: 'You are not authorized to delete this lesson',
      });
    }

    // Delete video from Cloudinary if exists
    if (lesson.videoPublicId) {
      try {
        await deleteVideo(lesson.videoPublicId);
        console.log('Video deleted from Cloudinary:', lesson.videoPublicId);
      } catch (deleteError) {
        console.warn('Failed to delete video from Cloudinary:', deleteError);
      }
    }

    await lesson.destroy();

    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all lessons for a section
exports.getSectionLessons = async (req, res) => {
  try {
    const { id: sectionId } = req.params;

    // Check if section exists
    const section = await Section.findByPk(sectionId, {
      include: [{
        model: Course,
        as: 'course',
        attributes: ['id', 'title']
      }]
    });

    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    const lessons = await Lesson.findAll({
      where: { sectionId },
      attributes: [
        'id', 
        'title', 
        'content', 
        'duration', 
        'order', 
        'videoUrl', 
        'youtubeUrl', 
        'videoType'
      ],
      order: [['order', 'ASC']],
      include: [
        {model: Quiz, as: 'quiz'}
      ]
    });

    // Transform lessons to include video info
    const transformedLessons = lessons.map(lesson => {
      const lessonData = lesson.toJSON();
      
      // Add video availability info
      lessonData.hasVideo = !!(lessonData.videoUrl || lessonData.youtubeUrl);
      lessonData.videoSource = lessonData.videoType || (
        lessonData.youtubeUrl ? 'YOUTUBE' : 
        lessonData.videoUrl ? 'CLOUDINARY' : 
        null
      );
      
      return lessonData;
    });

    res.json({
      message: 'Section lessons retrieved successfully',
      lessons: transformedLessons,
      section: {
        id: section.id,
        title: section.title,
        course: section.course
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get lesson by ID
exports.getLessonById = async (req, res) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findByPk(id, {
      include: [
        {
          model: Section,
          as: 'section',
          attributes: ['id', 'title'],
          include: [
            {
              model: Course,
              as: 'course',
              attributes: ['id', 'title', 'instructorId'],
              include: [
                {
                  model: User,
                  as: 'instructor',
                  attributes: ['id', 'name', 'email'],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.json({
      message: 'Lesson retrieved successfully',
      lesson,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reorder lessons for a section
exports.reorderLessons = async (req, res) => {
  try {
    const { id: sectionId } = req.params;
    const { lessonOrders } = req.body; // Array of { id, order }

    if (!lessonOrders || !Array.isArray(lessonOrders)) {
      return res.status(400).json({
        message: 'lessonOrders array is required',
      });
    }

    // Check if section exists and user has permission
    const section = await Section.findByPk(sectionId, {
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'instructorId'],
        },
      ],
    });

    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    if (section.course.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        message: 'You are not authorized to reorder lessons for this section',
      });
    }

    // Verify all lessons belong to this section
    const lessonIds = lessonOrders.map((item) => item.id);
    const lessons = await Lesson.findAll({
      where: {
        id: { [Op.in]: lessonIds },
        sectionId,
      },
    });

    if (lessons.length !== lessonIds.length) {
      return res.status(400).json({
        message: 'One or more lessons do not belong to this section',
      });
    }

    // Update lesson orders
    const updatePromises = lessonOrders.map(({ id, order }) => Lesson.update({ order }, { where: { id } }));

    await Promise.all(updatePromises);

    // Fetch updated lessons
    const updatedLessons = await Lesson.findAll({
      where: { sectionId },
      order: [['order', 'ASC']],
    });

    res.json({
      message: 'Lessons reordered successfully',
      lessons: updatedLessons,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
