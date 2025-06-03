// YouTube utility functions
const axios = require('axios');

/**
 * Validate and extract YouTube video ID from URL
 * @param {string} url - YouTube URL
 * @returns {string|null} - Video ID or null if invalid
 */
const extractYouTubeId = (url) => {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
};

/**
 * Validate YouTube URL accessibility
 * @param {string} url - YouTube URL
 * @returns {Promise<boolean>} - True if accessible
 */
const validateYouTubeUrl = async (url) => {
  try {
    const videoId = extractYouTubeId(url);
    if (!videoId) return false;
    
    // Check if video exists by trying to access YouTube oEmbed API
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await axios.get(oembedUrl, { timeout: 5000 });
    
    return response.status === 200 && response.data.title;
  } catch (error) {
    console.warn('YouTube URL validation failed:', error.message);
    return false;
  }
};

/**
 * Get embeddable YouTube URL
 * @param {string} url - Original YouTube URL
 * @returns {string|null} - Embeddable URL or null
 */
const getEmbeddableYouTubeUrl = (url) => {
  const videoId = extractYouTubeId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

/**
 * Get YouTube video thumbnail
 * @param {string} url - YouTube URL
 * @returns {string|null} - Thumbnail URL or null
 */
const getYouTubeThumbnail = (url) => {
  const videoId = extractYouTubeId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
};

module.exports = {
  extractYouTubeId,
  validateYouTubeUrl,
  getEmbeddableYouTubeUrl,
  getYouTubeThumbnail
};