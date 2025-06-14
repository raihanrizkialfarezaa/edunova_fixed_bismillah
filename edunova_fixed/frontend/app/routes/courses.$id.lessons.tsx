import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../lib/axios';
import {
  FaPlay,
  FaClock,
  FaVideo,
  FaYoutube,
  FaFileAlt,
  FaArrowLeft,
  FaBookOpen,
  FaGraduationCap,
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
  FaSave,
  FaChevronDown,
  FaChevronUp,
  FaLayerGroup,
  FaEye,
  FaQuestionCircle,
  FaCheckCircle,
  FaLock,
  FaUnlock,
} from 'react-icons/fa';

// Video Player Component dengan UI yang lebih bagus
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    if (isOpen && videoData) {
      setLoading(true);
      setError(null);
      // Auto-hide controls after 3 seconds
      const timer = setTimeout(() => setShowControls(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, videoData]);

  useEffect(() => {
    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleVideoLoad = () => {
    setLoading(false);
    setError(null);
  };

  const handleVideoError = () => {
    setLoading(false);
    setError('Gagal memuat video. Silakan coba lagi.');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    const timer = setTimeout(() => setShowControls(false), 3000);
    return () => clearTimeout(timer);
  };

  if (!isOpen || !videoData) return null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-50 transition-all duration-500">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div
        className={`relative bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 transition-all duration-700 ${
          isFullscreen ? 'w-full h-full rounded-none' : 'max-w-7xl w-full max-h-[95vh] mx-4'
        }`}
        onMouseMove={handleMouseMove}
      >
        {/* Enhanced Header with glassmorphism */}
        <div
          className={`flex justify-between items-center p-6 border-b border-white/10 bg-white/5 backdrop-blur-3xl transition-all duration-500 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'} ${
            isFullscreen ? 'absolute top-0 left-0 right-0 z-20' : ''
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="relative p-3 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-2xl shadow-xl">
              <FaPlay className="text-white text-xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-2xl animate-pulse" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white truncate max-w-md bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">{videoData.title}</h3>
              {videoData.duration && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <p className="text-gray-300 text-sm font-medium">{videoData.duration} menit</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={toggleFullscreen} className="group p-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 transform hover:scale-110" title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
              {isFullscreen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              )}
            </button>

            <button onClick={onClose} className="group p-3 text-gray-300 hover:text-white hover:bg-red-500/20 rounded-xl transition-all duration-300 transform hover:scale-110 hover:rotate-90" title="Close (ESC)">
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Enhanced Video Container with improved aspect ratio */}
        <div className={`relative bg-black transition-all duration-700 ${isFullscreen ? 'h-full' : 'aspect-video'}`}>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black/70 via-purple-900/30 to-black/70 backdrop-blur-md">
              <div className="text-center">
                <div className="relative mb-8">
                  {/* Multiple spinning rings for enhanced loading */}
                  <div className="w-24 h-24 border-4 border-purple-200/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
                  <div className="absolute inset-2 w-20 h-20 border-4 border-transparent border-t-blue-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                  <div className="absolute inset-4 w-16 h-16 border-3 border-transparent border-t-indigo-300 rounded-full animate-spin mx-auto" style={{ animationDuration: '2s' }}></div>

                  {/* Pulsing center dot */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl px-8 py-6 border border-white/20 shadow-2xl">
                  <p className="text-white font-bold text-xl mb-2">Memuat Video...</p>
                  <p className="text-purple-200 text-sm">Menyiapkan pengalaman pembelajaran terbaik</p>

                  {/* Progress bar simulation */}
                  <div className="mt-4 w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black/80 via-red-900/20 to-black/80 backdrop-blur-xl">
              <div className="text-center max-w-md mx-auto p-8">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-3">Video Tidak Dapat Dimuat</h4>
                  <p className="text-red-200 mb-6 leading-relaxed">{error}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => window.open(videoData.url, '_blank')}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Buka di Tab Baru
                  </button>

                  <button
                    onClick={() => {
                      setError(null);
                      setLoading(true);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Coba Lagi
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Video Player */}
          {videoData.type === 'youtube' ? (
            <iframe
              className="absolute inset-0 w-full h-full rounded-lg"
              src={videoData.url}
              title={videoData.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onLoad={handleVideoLoad}
              onError={handleVideoError}
            />
          ) : (
            <video
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
              controls
              preload="metadata"
              onLoadedData={handleVideoLoad}
              onError={handleVideoError}
              poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225' viewBox='0 0 400 225'%3E%3Crect width='400' height='225' fill='%23000'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23fff' font-size='16'%3ELoading...%3C/text%3E%3C/svg%3E"
            >
              <source src={videoData.url} type="video/mp4" />
              <source src={videoData.url} type="video/webm" />
              <source src={videoData.url} type="video/ogg" />
              Your browser does not support the video tag.
            </video>
          )}

          {/* Video overlay gradient */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
        </div>

        {/* Enhanced Footer with better controls */}
        <div
          className={`p-6 bg-white/5 backdrop-blur-3xl border-t border-white/10 transition-all duration-500 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'} ${
            isFullscreen ? 'absolute bottom-0 left-0 right-0 z-20' : ''
          }`}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Video Info */}
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-lg px-3 py-2 border border-white/20">
                {videoData.type === 'youtube' ? <FaYoutube className="text-red-500 text-lg" /> : <FaVideo className="text-blue-500 text-lg" />}
                <span className="font-medium">{videoData.type === 'youtube' ? 'YouTube' : 'Video File'}</span>
              </div>

              {videoData.duration && (
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-lg px-3 py-2 border border-white/20">
                  <FaClock className="text-green-400" />
                  <span className="font-medium">{videoData.duration} menit</span>
                </div>
              )}

              <div className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-lg px-3 py-2 border border-white/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="font-medium text-green-400">Streaming</span>
              </div>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.open(videoData.url, '_blank')}
                className="group px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Tab Baru
              </button>

              <button
                onClick={onClose}
                className="group px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-white/40 text-white rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <FaTimes className="group-hover:rotate-90 transition-transform duration-300" />
                Tutup
              </button>
            </div>
          </div>

          {/* Keyboard shortcuts hint */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-gray-400 text-center">
              💡 Tips: Tekan <kbd className="px-2 py-1 bg-white/10 rounded text-xs">ESC</kbd> untuk menutup,
              <kbd className="px-2 py-1 bg-white/10 rounded text-xs ml-1">F</kbd> untuk fullscreen
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface Quiz {
  id: number;
  title: string;
}

// Main interfaces
interface Lesson {
  id: number;
  title: string;
  content: string;
  duration: number | null;
  order: number;
  videoUrl: string | null;
  youtubeUrl: string | null;
  videoType: string | null;
  hasVideo: boolean;
  quiz?: Quiz;
}

interface Section {
  id: number;
  title: string;
  description: string;
  order: number;
  lessons?: Lesson[];
}

interface Course {
  id: number;
  title: string;
}

export default function CourseLessons() {
  const { id: courseId } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const [showLessonForm, setShowLessonForm] = useState<number | null>(null);
  const [lessonForm, setLessonForm] = useState({
    title: '',
    content: '',
    duration: '',
    youtubeUrl: '',
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Video player state
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<{
    type: 'youtube' | 'cloudinary';
    url: string;
    title: string;
    duration?: number;
  } | null>(null);

  useEffect(() => {
    fetchCourse();
    fetchSections();
    checkEnrollmentStatus();
  }, [courseId]);

  // Auto-expand specific section if section parameter is provided
  useEffect(() => {
    const sectionParam = searchParams.get('section');
    if (sectionParam && sections.length > 0) {
      const targetSectionId = parseInt(sectionParam);
      setExpandedSection(targetSectionId);

      // Scroll to the specific section after it's expanded
      setTimeout(() => {
        const sectionElement = document.getElementById(`section-${targetSectionId}`);
        if (sectionElement) {
          sectionElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
          });
        }
      }, 100);

      const section = sections.find((s) => s.id === targetSectionId);
      if (section && !section.lessons) {
        fetchLessons(targetSectionId);
      }
    }
  }, [searchParams, sections]);

  const fetchCourse = async () => {
    try {
      const response = await axiosInstance.get(`/courses/${courseId}`);
      setCourse(response.data.course);
    } catch (error) {
      setError('Gagal mengambil data kursus');
      console.error('Gagal mengambil kursus:', error);
    }
  };

  const enrollCourse = async (id: number) => {
    try {
      const response = await axiosInstance.post(`/courses/${id}/enroll`);
      const enrollmentId = response.data.enrollment.id;
      navigate(`/enrollments/${enrollmentId}/payment`);
    } catch (error: any) {
      console.error('Gagal mendaftar:', error);
      setError(error.response?.data?.message || 'Gagal mendaftar kursus');
    }
  };

  const fetchSections = async () => {
    try {
      const response = await axiosInstance.get(`/courses/${courseId}/sections`);
      setSections(response.data.sections || []);
    } catch (error) {
      setError('Gagal mengambil bagian kursus');
      console.error('Gagal mengambil bagian:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLessons = async (sectionId: number) => {
    try {
      const response = await axiosInstance.get(`/sections/${sectionId}/lessons`);
      const lessons = response.data.lessons || [];

      setSections((prev) => prev.map((section) => (section.id === sectionId ? { ...section, lessons } : section)));
    } catch (error) {
      setError('Gagal mengambil pelajaran');
      console.error('Gagal mengambil pelajaran:', error);
    }
  };

  const toggleSection = async (sectionId: number) => {
    if (expandedSection === sectionId) {
      setExpandedSection(null);
    } else {
      setExpandedSection(sectionId);
      const section = sections.find((s) => s.id === sectionId);
      if (!section?.lessons) {
        await fetchLessons(sectionId);
      }
    }
  };

  const handleLessonSubmit = async (e: React.FormEvent, sectionId: number) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('title', lessonForm.title);
      formData.append('content', lessonForm.content);
      if (lessonForm.duration) formData.append('duration', lessonForm.duration);
      if (lessonForm.youtubeUrl) formData.append('youtubeUrl', lessonForm.youtubeUrl);
      if (videoFile) formData.append('video', videoFile);

      await axiosInstance.post(`/sections/${sectionId}/lessons`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setLessonForm({ title: '', content: '', duration: '', youtubeUrl: '' });
      setVideoFile(null);
      setShowLessonForm(null);
      await fetchLessons(sectionId);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Gagal membuat pelajaran');
    } finally {
      setUploading(false);
    }
  };

  const deleteLesson = async (lessonId: number, sectionId: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pelajaran ini?')) return;

    try {
      await axiosInstance.delete(`/lessons/${lessonId}`);
      await fetchLessons(sectionId);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Gagal menghapus pelajaran');
    }
  };

  const streamVideo = async (lessonId: number, lessonTitle: string) => {
    try {
      setLoading(true); // Add loading state for better UX
      const response = await axiosInstance.get(`/lessons/${lessonId}/stream`);
      const videoData = response.data;

      setCurrentVideo({
        type: videoData.type,
        url: videoData.url || videoData.streamUrl || videoData.embedUrl,
        title: lessonTitle,
        duration: videoData.duration,
      });
      setShowVideoPlayer(true);
    } catch (error: any) {
      console.error('Gagal memutar video:', error);
      setError(error.response?.data?.message || 'Gagal memuat video');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = async () => {
    if (user?.role !== 'STUDENT') return;

    try {
      const response = await axiosInstance.get(`/courses/${courseId}/enrollment-status`);
      setIsEnrolled(response.data.isEnrolled);
    } catch (error) {
      console.error('Failed to check enrollment status:', error);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-blue-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-8 py-6 border border-white/20">
            <p className="text-xl font-medium text-white mb-2">Memuat pelajaran...</p>
            <p className="text-purple-200">Menyiapkan materi pembelajaran</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, white 2px, transparent 2px),
                           radial-gradient(circle at 80% 50%, white 2px, transparent 2px)`,
            backgroundSize: '100px 100px',
          }}
        ></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/" className="inline-flex items-center gap-3 text-purple-300 hover:text-white transition-all duration-300 group">
              <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                <FaArrowLeft className="text-lg group-hover:-translate-x-1 transition-transform duration-300" />
              </div>
              <span className="font-medium">Kembali ke Dashboard</span>
            </Link>

            <Link to={`/courses/${courseId}/sections`} className="inline-flex items-center gap-3 text-blue-300 hover:text-white transition-all duration-300 group">
              <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                <FaLayerGroup className="text-lg" />
              </div>
              <span className="font-medium">Kelola Bagian</span>
            </Link>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                  <FaGraduationCap className="text-3xl text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">Pembelajaran Kursus</h1>
                  {course && (
                    <p className="text-xl text-purple-200">
                      <span className="font-semibold text-blue-300">{course.title}</span>
                    </p>
                  )}
                </div>
              </div>

              {user?.role === 'STUDENT' && (
                <button
                  onClick={() => enrollCourse(Number(courseId))}
                  disabled={isEnrolled}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isEnrolled ? (
                    <>
                      <FaCheckCircle />
                      Telah Terdaftar
                    </>
                  ) : (
                    <>
                      <FaGraduationCap />
                      Daftar Kursus
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 backdrop-blur-md border border-red-500/30 text-red-300 p-6 rounded-2xl mb-8 shadow-xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <FaTimes className="text-red-400" />
                </div>
                <span className="font-medium">{error}</span>
              </div>
              <button onClick={() => setError(null)} className="text-red-300 hover:text-white transition-colors duration-200 p-2 hover:bg-red-500/20 rounded-lg">
                <FaTimes />
              </button>
            </div>
          </div>
        )}

        {/* Sections List */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div
              key={section.id}
              id={`section-${section.id}`}
              className={`group bg-white/10 backdrop-blur-xl rounded-3xl border shadow-2xl hover:border-blue-400/50 transition-all duration-500 overflow-hidden ${
                expandedSection === section.id ? 'border-blue-400/50 ring-2 ring-blue-400/30' : 'border-white/20'
              }`}
            >
              {/* Section Header */}
              <div className="p-8 cursor-pointer hover:bg-white/5 transition-all duration-300" onClick={() => toggleSection(section.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold text-white">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">{section.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <FaBookOpen />
                          {section.lessons?.length || 0} Pelajaran
                        </span>
                        {section.lessons && section.lessons.length > 0 && (
                          <span className="flex items-center gap-1">
                            <FaClock />
                            {section.lessons.reduce((total: number, lesson: any) => total + (lesson.duration || 0), 0)} menit
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {(user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowLessonForm(section.id);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 text-sm font-semibold"
                      >
                        <FaPlus />
                        Tambah Pelajaran
                      </button>
                    )}

                    <div className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
                      {expandedSection === section.id ? <FaChevronUp className="text-white text-lg" /> : <FaChevronDown className="text-white text-lg" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Section Content */}
              {expandedSection === section.id && (
                <div className="bg-black/20 backdrop-blur-md border-t border-white/10">
                  <div className="p-8">
                    {/* Add Lesson Form */}
                    {showLessonForm === section.id && (user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN') && (
                      <div className="mb-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                            <FaPlus className="text-white text-lg" />
                          </div>
                          <h4 className="text-xl font-bold text-white">Tambah Pelajaran Baru</h4>
                        </div>

                        <form onSubmit={(e) => handleLessonSubmit(e, section.id)} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-semibold text-gray-300 mb-3">Judul Pelajaran *</label>
                              <input
                                type="text"
                                placeholder="Masukkan judul pelajaran"
                                value={lessonForm.title}
                                onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                                className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-300 mb-3">Durasi (menit)</label>
                              <input
                                type="number"
                                placeholder="30"
                                value={lessonForm.duration}
                                onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                                className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-3">Konten Pelajaran *</label>
                            <textarea
                              placeholder="Jelaskan konten pelajaran..."
                              value={lessonForm.content}
                              onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                              className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                              rows={4}
                              required
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-semibold text-gray-300 mb-3">URL YouTube (opsional)</label>
                              <input
                                type="url"
                                placeholder="https://youtube.com/watch?v=..."
                                value={lessonForm.youtubeUrl}
                                onChange={(e) => setLessonForm({ ...lessonForm, youtubeUrl: e.target.value })}
                                className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-300 mb-3">File Video (opsional)</label>
                              <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                                className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition-all duration-300"
                              />
                            </div>
                          </div>

                          <div className="flex gap-4">
                            <button
                              type="submit"
                              disabled={uploading}
                              className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                              {uploading ? (
                                <>
                                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  Membuat...
                                </>
                              ) : (
                                <>
                                  <FaSave />
                                  Buat Pelajaran
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowLessonForm(null)}
                              className="px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white rounded-xl font-semibold transition-all duration-300 flex items-center gap-2"
                            >
                              <FaTimes />
                              Batal
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Lessons List */}
                    <div className="space-y-4">
                      {section.lessons?.length ? (
                        section.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lesson.id}
                            className="group/lesson p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/10 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 flex-1">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                  <span className="text-white text-sm font-bold">{lessonIndex + 1}</span>
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-semibold text-white group-hover/lesson:text-blue-300 transition-colors duration-300 mb-2">{lesson.title}</h5>
                                  <p className="text-sm text-gray-400 line-clamp-2 mb-3">{lesson.content}</p>
                                  <div className="flex items-center gap-4 text-xs text-gray-500">
                                    {lesson.duration && (
                                      <span className="flex items-center gap-1 bg-blue-900/30 px-2 py-1 rounded-lg">
                                        <FaClock />
                                        {lesson.duration} menit
                                      </span>
                                    )}
                                    {lesson.hasVideo && (
                                      <span className="flex items-center gap-1 bg-green-900/30 px-2 py-1 rounded-lg text-green-400">
                                        {lesson.videoType === 'youtube' ? <FaYoutube /> : <FaVideo />}
                                        {lesson.videoType || 'Video'}
                                      </span>
                                    )}
                                    {lesson.quiz && (
                                      <span className="flex items-center gap-1 bg-yellow-900/30 px-2 py-1 rounded-lg text-yellow-400">
                                        <FaQuestionCircle />
                                        Kuis
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {lesson.hasVideo && (
                                  <button
                                    onClick={() => streamVideo(lesson.id, lesson.title)}
                                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 text-sm font-medium"
                                  >
                                    <FaPlay className="text-xs" />
                                    Putar
                                  </button>
                                )}

                                {lesson.quiz && (
                                  <Link
                                    to={`/quiz/${lesson.quiz.id}/take`}
                                    className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 text-sm font-medium"
                                  >
                                    <FaQuestionCircle className="text-xs" />
                                    Kuis
                                  </Link>
                                )}

                                {(user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN') && (
                                  <button
                                    onClick={() => deleteLesson(lesson.id, section.id)}
                                    className="px-3 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 text-sm"
                                  >
                                    <FaTrash className="text-xs" />
                                    Hapus
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <div className="mb-6">
                            <FaBookOpen className="text-5xl text-gray-500 mx-auto mb-4" />
                            <h5 className="text-xl font-bold text-white mb-2">Belum Ada Pelajaran</h5>
                            <p className="text-gray-400">Bagian ini belum memiliki pelajaran</p>
                          </div>
                          {(user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN') && (
                            <button
                              onClick={() => setShowLessonForm(section.id)}
                              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold flex items-center gap-2 mx-auto"
                            >
                              <FaPlus />
                              Tambah Pelajaran Pertama
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* No Sections Found */}
          {sections.length === 0 && (
            <div className="text-center py-20">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-12 max-w-2xl mx-auto">
                <div className="mb-8">
                  <div className="inline-flex p-6 bg-gradient-to-br from-gray-600 to-gray-700 rounded-3xl shadow-lg mb-6">
                    <FaLayerGroup className="text-5xl text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">Belum Ada Bagian Kursus</h3>
                  <p className="text-xl text-gray-300 leading-relaxed">Kursus ini belum memiliki bagian. Silakan hubungi instructor untuk menambahkan konten pembelajaran.</p>
                </div>
                <Link
                  to={`/courses/${courseId}/sections`}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <FaLayerGroup />
                  Kelola Bagian Kursus
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Player Modal */}
      <VideoPlayer isOpen={showVideoPlayer} onClose={() => setShowVideoPlayer(false)} videoData={currentVideo} />
    </div>
  );
}
