import React, { useState, useRef, useEffect } from 'react';

interface VideoPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  videoData: {
    type: 'youtube' | 'cloudinary';
    url: string;
    title: string;
    duration?: number;
  } | null;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ isOpen, onClose, videoData }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen && videoData) {
      setLoading(true);
      setError(null);
    }
  }, [isOpen, videoData]);

  const handleVideoLoad = () => {
    setLoading(false);
  };

  const handleVideoError = () => {
    setLoading(false);
    setError('Failed to load video. Please try again.');
  };

  if (!isOpen || !videoData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold truncate">{videoData.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Video Content */}
        <div className="relative bg-black" style={{ paddingBottom: '56.25%' }}>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white">Loading video...</div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-red-500 text-center">
                <p>{error}</p>
                <button
                  onClick={() => window.open(videoData.url, '_blank')}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Open in New Tab
                </button>
              </div>
            </div>
          )}

          {videoData.type === 'youtube' ? (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={videoData.url}
              title={videoData.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={handleVideoLoad}
              onError={handleVideoError}
            />
          ) : (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full"
              controls
              preload="metadata"
              onLoadedData={handleVideoLoad}
              onError={handleVideoError}
            >
              <source src={videoData.url} type="video/mp4" />
              <source src={videoData.url} type="video/webm" />
              <source src={videoData.url} type="video/avi" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {videoData.duration && `Duration: ${videoData.duration} minutes`}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.open(videoData.url, '_blank')}
              className="bg-blue-500 text-white px-4 py-2 rounded text-sm"
            >
              Open in New Tab
            </button>
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;