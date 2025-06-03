const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload video to Cloudinary as authenticated (private) resource
 * @param {Buffer} buffer - Video file buffer
 * @param {Object} options - Upload options
 * @returns {Promise} - Cloudinary upload result
 */
const uploadVideo = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const defaultOptions = {
      resource_type: 'video',
      type: 'authenticated', // Make video private/authenticated
      folder: 'edunova/videos',
      chunk_size: 20000000, // 20MB chunks
      timeout: 600000, // 10 minutes timeout
      access_mode: 'authenticated', // Require authentication to access
    };

    const uploadOptions = { ...defaultOptions, ...options };

    // Create readable stream from buffer
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    // Create readable stream from buffer and pipe to upload stream
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
};

/**
 * Generate signed URL for authenticated video
 * @param {string} publicId - Public ID of the video
 * @param {Object} options - Signing options
 * @returns {string} - Signed URL
 */
const generateSignedVideoUrl = (publicId, options = {}) => {
  const defaultOptions = {
    resource_type: 'video',
    type: 'authenticated',
    expires_at: Math.floor(Date.now() / 1000) + 3600, // Expire in 1 hour
    secure: true,
    ...options
  };

  return cloudinary.utils.private_download_url(publicId, 'video', defaultOptions);
};

/**
 * Generate streaming signed URL with transformation
 * @param {string} publicId - Public ID of the video
 * @param {Object} options - Transformation and signing options
 * @returns {string} - Signed streaming URL
 */
const generateSignedStreamingUrl = (publicId, options = {}) => {
  const defaultOptions = {
    resource_type: 'video',
    type: 'authenticated',
    expires_at: Math.floor(Date.now() / 1000) + 3600, // Expire in 1 hour
    secure: true,
    streaming_profile: 'hd',
    format: 'm3u8', // HLS streaming
    ...options
  };

  return cloudinary.url(publicId, defaultOptions);
};

/**
 * Delete video from Cloudinary
 * @param {string} publicId - Public ID of the video to delete
 * @returns {Promise} - Cloudinary deletion result
 */
const deleteVideo = (publicId) => {
  return cloudinary.uploader.destroy(publicId, { 
    resource_type: 'video',
    type: 'authenticated'
  });
};

/**
 * Get video details from Cloudinary
 * @param {string} publicId - Public ID of the video
 * @returns {Promise} - Video details
 */
const getVideoDetails = (publicId) => {
  return cloudinary.api.resource(publicId, { 
    resource_type: 'video',
    type: 'authenticated'
  });
};

// Upload function for public files (assignment submissions)
const uploadPublicFile = (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        ...options,
        type: 'upload',
        access_mode: 'public' // Make it publicly accessible
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    
    uploadStream.end(fileBuffer);
  });
};

// FIXED: Upload function for documents (PDF, DOC, etc.) - with proper PDF handling
const uploadAssignmentDocument = (fileBuffer, options = {}) => {
  const fileExtension = options.originalName ? 
    options.originalName.split('.').pop().toLowerCase() : 'unknown';

  // Untuk file PDF, gunakan resource_type: 'raw' dengan konfigurasi khusus
  if (fileExtension === 'pdf') {
    return uploadPublicFile(fileBuffer, {
      resource_type: 'raw', // Gunakan raw untuk PDF agar dapat diakses browser
      use_filename: true,
      unique_filename: false,
      folder: 'edunova/assignments/pdfs',
      // Tambahkan format dan access mode yang tepat
      access_mode: 'public',
      type: 'upload',
      context: {
        alt: options.originalName || 'PDF Document',
        caption: options.description || 'Assignment submission PDF'
      },
      ...options
    });
  }

  // Untuk dokumen lainnya, tetap gunakan raw resource type
  return uploadPublicFile(fileBuffer, {
    resource_type: 'raw',
    use_filename: true,
    unique_filename: false,
    folder: 'edunova/assignments/documents',
    access_mode: 'public',
    type: 'upload',
    context: {
      alt: options.originalName || 'Document',
      caption: options.description || 'Assignment submission'
    },
    ...options
  });
};

/**
 * Generate viewable URL untuk PDF files
 * @param {string} publicId - Public ID dari PDF
 * @param {Object} options - URL generation options
 * @returns {string} - Direct viewable URL
 */
const generatePdfViewUrl = (publicId, options = {}) => {
  // Untuk PDF yang diupload sebagai raw resource type
  return cloudinary.url(publicId, {
    resource_type: 'raw',
    secure: true,
    sign_url: false, // Jangan sign URL untuk akses publik
    type: 'upload',
    ...options
  });
};

/**
 * Generate download URL untuk file apapun
 * @param {string} publicId - Public ID dari file
 * @param {string} resourceType - Resource type ('image', 'raw', 'video')
 * @param {Object} options - URL generation options
 * @returns {string} - Download URL
 */
const generateDownloadUrl = (publicId, resourceType = 'raw', options = {}) => {
  return cloudinary.url(publicId, {
    resource_type: resourceType,
    flags: 'attachment', // Force download
    secure: true,
    type: 'upload',
    ...options
  });
};

module.exports = {
  cloudinary,
  uploadVideo,
  deleteVideo,
  getVideoDetails,
  generateSignedVideoUrl,
  generateSignedStreamingUrl,
  uploadPublicFile,
  uploadAssignmentDocument,
  generatePdfViewUrl,
  generateDownloadUrl,
};