const { getVideoDetails } = require('../config/cloudinary');

class VideoService {
  /**
   * Process video after upload
   * @param {Object} params - Video processing parameters
   * @param {string} params.url - Video URL
   * @param {number} params.courseId - Course ID
   * @param {number} params.sectionId - Section ID
   * @param {number} params.duration - Video duration
   */
  static async processVideo({ url, courseId, sectionId, duration }) {
    try {
      console.log('Processing video:', {
        url,
        courseId,
        sectionId,
        duration
      });

      // Extract public ID from Cloudinary URL
      const publicId = this.extractPublicIdFromUrl(url);
      
      if (publicId) {
        // Get additional video metadata from Cloudinary
        const videoDetails = await getVideoDetails(publicId);
        
        console.log('Video metadata:', {
          duration: videoDetails.duration,
          width: videoDetails.width,
          height: videoDetails.height,
          format: videoDetails.format,
          bytes: videoDetails.bytes
        });

        // You can add additional processing logic here
        // For example: generating thumbnails, extracting subtitles, etc.
      }

      return {
        success: true,
        processedAt: new Date(),
        metadata: {
          duration,
          url
        }
      };
    } catch (error) {
      console.error('Video processing error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Extract public ID from Cloudinary URL
   * @param {string} url - Cloudinary URL
   * @returns {string|null} - Public ID or null
   */
  static extractPublicIdFromUrl(url) {
    try {
      const regex = /\/v\d+\/(.+)\.[^.]+$/;
      const match = url.match(regex);
      return match ? match[1] : null;
    } catch (error) {
      console.error('Error extracting public ID:', error);
      return null;
    }
  }

  /**
   * Generate video thumbnail URL
   * @param {string} videoUrl - Original video URL
   * @param {Object} options - Thumbnail options
   * @returns {string} - Thumbnail URL
   */
  static generateThumbnailUrl(videoUrl, options = {}) {
    const defaultOptions = {
      width: 320,
      height: 240,
      crop: 'fill',
      quality: 'auto',
      format: 'jpg'
    };

    const thumbnailOptions = { ...defaultOptions, ...options };
    
    try {
      // For Cloudinary URLs, replace the file extension and add transformation parameters
      const publicId = this.extractPublicIdFromUrl(videoUrl);
      if (publicId) {
        const baseUrl = videoUrl.substring(0, videoUrl.lastIndexOf('/') + 1);
        const transformation = `w_${thumbnailOptions.width},h_${thumbnailOptions.height},c_${thumbnailOptions.crop},q_${thumbnailOptions.quality}`;
        return `${baseUrl}${transformation}/${publicId}.${thumbnailOptions.format}`;
      }
    } catch (error) {
      console.error('Error generating thumbnail URL:', error);
    }

    return null;
  }

  /**
   * Validate video file
   * @param {Object} file - Multer file object
   * @returns {Object} - Validation result
   */
  static validateVideoFile(file) {
    const allowedMimeTypes = [
      'video/mp4',
      'video/avi',
      'video/quicktime',
      'video/x-msvideo',
      'video/x-ms-wmv',
      'video/webm',
      'video/x-matroska',
      'video/x-flv'
    ];

    const maxSize = 500 * 1024 * 1024; // 500MB

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return {
        valid: false,
        error: 'Invalid file type. Only video files are allowed.'
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File too large. Maximum size is 500MB.'
      };
    }

    return {
      valid: true,
      fileInfo: {
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size
      }
    };
  }
}

module.exports = VideoService;