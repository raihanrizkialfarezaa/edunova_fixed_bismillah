import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../lib/axios';

// Video Player Component
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

  useEffect(() => {
    if (isOpen && videoData) {
      setLoading(true);
      setError(null);
    }
  }, [isOpen, videoData]);

  const handleVideoLoad = () => setLoading(false);
  const handleVideoError = () => {
    setLoading(false);
    setError('Gagal memuat video. Silakan coba lagi.');
  };

  if (!isOpen || !videoData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 font-sans">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden shadow-xl border border-gray-800">
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-white truncate">{videoData.title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300 text-2xl font-bold focus:outline-none">
            ×
          </button>
        </div>

        <div className="relative bg-black" style={{ paddingBottom: '56.25%' }}>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white">Memuat video...</div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-red-500 text-center">
                <p>{error}</p>
                <button
                  onClick={() => window.open(videoData.url, '_blank')}
                  className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded focus:outline-none"
                >
                  Buka di Tab Baru
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
              className="absolute inset-0 w-full h-full"
              controls
              preload="metadata"
              onLoadedData={handleVideoLoad}
              onError={handleVideoError}
            >
              <source src={videoData.url} type="video/mp4" />
              <source src={videoData.url} type="video/webm" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        <div className="p-4 bg-gray-800 flex justify-between items-center">
          <div className="text-sm text-gray-400">
            {videoData.duration && `Durasi: ${videoData.duration} menit`}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.open(videoData.url, '_blank')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm focus:outline-none"
            >
              Buka di Tab Baru
            </button>
            <button onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm focus:outline-none">
              Tutup
            </button>
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

export default function CourseSections() {
  const { id: courseId } = useParams();
  const { user } = useAuth();
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
  }, [courseId]);

  const navigate = useNavigate();
  const fetchCourse = async () => {
    try {
      const response = await axiosInstance.get(`/courses/${courseId}`);
      setCourse(response.data.course);
    } catch (error) {
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
      alert(error.response.data.message || 'Gagal mendaftar kursus');
    }
  };

  const fetchSections = async () => {
    try {
      const response = await axiosInstance.get(`/courses/${courseId}/sections`);
      console.log(response.data.sections);
      setSections(response.data.sections || []);
    } catch (error) {
      console.error('Gagal mengambil bagian:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLessons = async (sectionId: number) => {
    try {
      const response = await axiosInstance.get(`/sections/${sectionId}/lessons`);
      console.log(response.data.lessons);
      const lessons = response.data.lessons || [];

      setSections(prev =>
        prev.map(section =>
          section.id === sectionId
            ? { ...section, lessons }
            : section
        )
      );
    } catch (error) {
      console.error('Gagal mengambil pelajaran:', error);
    }
  };

  const toggleSection = async (sectionId: number) => {
    if (expandedSection === sectionId) {
      setExpandedSection(null);
    } else {
      setExpandedSection(sectionId);
      const section = sections.find(s => s.id === sectionId);
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
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setLessonForm({ title: '', content: '', duration: '', youtubeUrl: '' });
      setVideoFile(null);
      setShowLessonForm(null);
      await fetchLessons(sectionId);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Gagal membuat pelajaran');
    } finally {
      setUploading(false);
    }
  };

  const deleteLesson = async (lessonId: number, sectionId: number) => {
    if (!confirm('Hapus pelajaran ini?')) return;

    try {
      await axiosInstance.delete(`/lessons/${lessonId}`);
      await fetchLessons(sectionId);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Gagal menghapus pelajaran');
    }
  };

  // Updated streamVideo function
  const streamVideo = async (lessonId: number, lessonTitle: string) => {
    try {
      const response = await axiosInstance.get(`/lessons/${lessonId}/stream`);
      const videoData = response.data;

      setCurrentVideo({
        type: videoData.type,
        url: videoData.url || videoData.streamUrl || videoData.embedUrl,
        title: lessonTitle,
        duration: videoData.duration
      });
      setShowVideoPlayer(true);
    } catch (error: any) {
      console.error('Gagal memutar video:', error);
      alert(error.response?.data?.message || 'Gagal memuat video');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white font-sans">
      <p className="text-lg">Memuat...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans p-8">
      <div className="max-w-6xl mx-auto bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-800">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="text-blue-500 hover:text-blue-400 transition duration-200 flex items-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Kembali ke Beranda
          </Link>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-extrabold text-blue-400">{course?.title} - Bagian</h1>
            {user?.role === 'STUDENT' && (
              <button
                onClick={() => enrollCourse(Number(courseId))}
                disabled={isEnrolled}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEnrolled ? 'Telah Terdaftar' : 'Daftar'}
              </button>
            )}
          </div>
        </div>

        {/* Sections List */}
        <div className="space-y-6">
          {sections.map(section => (
            <div key={section.id} className="border rounded-lg bg-gray-800 border-gray-700 shadow-md">
              <div
                className="p-4 bg-gray-700 cursor-pointer flex justify-between items-center hover:bg-gray-600 transition-colors duration-200"
                onClick={() => toggleSection(section.id)}
              >
                <div>
                  <h3 className="font-semibold text-lg text-green-400">{section.title}</h3>
                  <p className="text-sm text-gray-400">{section.description}</p>
                </div>
                <span className="text-gray-300 text-xl">{expandedSection === section.id ? '−' : '+'}</span>
              </div>

              {expandedSection === section.id && (
                <div className="p-4 border-t border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-300">Pelajaran</h4>
                    {(user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN') && (
                      <button
                        onClick={() => setShowLessonForm(section.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm focus:outline-none"
                      >
                        Tambah Pelajaran
                      </button>
                    )}
                  </div>

                  {showLessonForm === section.id && (
                    <form onSubmit={(e) => handleLessonSubmit(e, section.id)} className="mb-4 p-4 border-2 border-blue-600 bg-blue-900 bg-opacity-20 rounded-lg shadow-sm">
                      <h5 className="text-lg font-medium text-gray-200 mb-3">Tambah Pelajaran Baru</h5>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Judul Pelajaran *
                          </label>
                          <input
                            type="text"
                            placeholder="Masukkan judul pelajaran"
                            value={lessonForm.title}
                            onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                            className="w-full border border-gray-600 rounded-md px-3 py-2 text-gray-100 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            Durasi (menit)
                          </label>
                          <input
                            type="number"
                            placeholder="mis., 30"
                            value={lessonForm.duration}
                            onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                            className="w-full border border-gray-600 rounded-md px-3 py-2 text-gray-100 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Konten Pelajaran *
                        </label>
                        <textarea
                          placeholder="Jelaskan konten pelajaran..."
                          value={lessonForm.content}
                          onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                          className="w-full border border-gray-600 rounded-md px-3 py-2 text-gray-100 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            URL YouTube (opsional)
                          </label>
                          <input
                            type="url"
                            placeholder="https://youtube.com/watch?v=..."
                            value={lessonForm.youtubeUrl}
                            onChange={(e) => setLessonForm({ ...lessonForm, youtubeUrl: e.target.value })}
                            className="w-full border border-gray-600 rounded-md px-3 py-2 text-gray-100 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            File Video (opsional)
                          </label>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                            className="w-full border border-gray-600 rounded-md px-3 py-2 text-gray-100 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-300 hover:file:bg-blue-100"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={uploading}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-sm font-medium focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {uploading ? 'Membuat...' : 'Buat Pelajaran'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowLessonForm(null)}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md text-sm font-medium focus:outline-none transition-colors"
                        >
                          Batal
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-2">
                    {section.lessons?.length ? (
                      section.lessons.map(lesson => (
                        <div key={lesson.id} className="border rounded p-3 flex justify-between items-center bg-gray-800 border-gray-700">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-200">{lesson.title}</h5>
                            <p className="text-sm text-gray-400">{lesson.content}</p>
                            <div className="text-xs text-gray-500 mt-1">
                              {lesson.duration && `${lesson.duration} min`}
                              {lesson.hasVideo && (
                                <span className="ml-2 bg-green-800 bg-opacity-20 text-green-400 px-2 py-1 rounded">
                                  {lesson.videoType || 'Video'}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {lesson.hasVideo && (
                              <button
                                onClick={() => streamVideo(lesson.id, lesson.title)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm focus:outline-none"
                              >
                                Putar
                              </button>
                            )}
                            {lesson.quiz != null && (
                              <Link
                                to={`/quiz/${lesson.quiz.id}/take`}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm focus:outline-none"
                              >
                                Ikuti Kuis
                              </Link>
                            )}
                            {(user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN') && (
                              <button
                                onClick={() => deleteLesson(lesson.id, section.id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm focus:outline-none"
                              >
                                Hapus
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">Tidak ada pelajaran ditemukan</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Video Player Modal */}
      <VideoPlayer
        isOpen={showVideoPlayer}
        onClose={() => setShowVideoPlayer(false)}
        videoData={currentVideo}
      />
    </div>
  );
}