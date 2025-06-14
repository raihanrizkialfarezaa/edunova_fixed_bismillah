import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../lib/axios';
import { FaPlus, FaEdit, FaTrash, FaChevronUp, FaChevronDown, FaBookOpen, FaPlay, FaClock, FaGraduationCap, FaArrowLeft, FaSave, FaTimes, FaEye, FaLayerGroup, FaVideo, FaQuestionCircle, FaFileAlt } from 'react-icons/fa';

interface Section {
  id: number;
  title: string;
  order: number;
  courseId: number;
  Lessons?: any[];
}

interface Course {
  id: number;
  title: string;
}

export default function CourseSections() {
  const { id: courseId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [sections, setSections] = useState<Section[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchSections();
  }, [courseId, isAuthenticated]);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/courses/${courseId}/sections?includeLessons=true`);
      setSections(response.data.sections);
      setCourse(response.data.course);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengambil bagian kursus');
    } finally {
      setLoading(false);
    }
  };

  const createSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionTitle.trim()) return;

    try {
      await axiosInstance.post(`/courses/${courseId}/sections/create`, {
        title: newSectionTitle,
      });
      setNewSectionTitle('');
      setShowCreateForm(false);
      fetchSections();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal membuat bagian kursus');
    }
  };

  const updateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection || !editTitle.trim()) return;

    try {
      await axiosInstance.put(`/sections/${editingSection.id}`, {
        title: editTitle,
      });
      setEditingSection(null);
      setEditTitle('');
      fetchSections();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memperbarui bagian kursus');
    }
  };

  const deleteSection = async (sectionId: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus bagian ini? Ini juga akan menghapus pelajaran di dalamnya.')) return;

    try {
      await axiosInstance.delete(`/sections/${sectionId}`);
      fetchSections();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menghapus bagian kursus');
    }
  };

  const moveSection = async (sectionId: number, direction: 'up' | 'down') => {
    const sectionIndex = sections.findIndex((s) => s.id === sectionId);
    if (sectionIndex === -1) return;

    const newSections = [...sections];
    const targetIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1;

    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    [newSections[sectionIndex], newSections[targetIndex]] = [newSections[targetIndex], newSections[sectionIndex]];

    // Optimistically update UI
    setSections(newSections);

    const sectionOrders = newSections.map((section, index) => ({
      id: section.id,
      order: index + 1,
    }));

    try {
      await axiosInstance.put(`/courses/${courseId}/sections/reorder`, {
        sectionOrders,
      });
      // Re-fetch to ensure server state matches
      fetchSections();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengubah urutan bagian kursus');
      // Revert to original sections if API call fails
      fetchSections();
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
            <p className="text-xl font-medium text-white mb-2">Memuat bagian kursus...</p>
            <p className="text-purple-200">Menyiapkan struktur pembelajaran</p>
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
        {/* Header Section */}
        <div className="mb-12">
          <Link to="/" className="inline-flex items-center gap-3 text-purple-300 hover:text-white transition-all duration-300 mb-6 group">
            <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 group-hover:bg-white/20 transition-all duration-300">
              <FaArrowLeft className="text-lg group-hover:-translate-x-1 transition-transform duration-300" />
            </div>
            <span className="font-medium">Kembali ke Dashboard</span>
          </Link>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <FaLayerGroup className="text-3xl text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Kelola Bagian Kursus</h1>
                {course && (
                  <p className="text-xl text-purple-200">
                    Kursus: <span className="font-semibold text-blue-300">{course.title}</span>
                  </p>
                )}
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">Atur dan kelola struktur pembelajaran kursus Anda. Buat bagian-bagian yang terorganisir untuk pengalaman belajar yang optimal.</p>
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

        {/* Add Section Form/Button */}
        {(user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN') && (
          <div className="mb-12">
            {!showCreateForm ? (
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 text-center">
                <div className="mb-6">
                  <div className="inline-flex p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg mb-4">
                    <FaPlus className="text-3xl text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Tambah Bagian Baru</h3>
                  <p className="text-gray-300">Buat bagian baru untuk mengorganisir konten pembelajaran</p>
                </div>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl flex items-center gap-3 mx-auto"
                >
                  <FaPlus className="group-hover:rotate-90 transition-transform duration-300" />
                  Mulai Membuat Bagian
                </button>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                    <FaPlus className="text-xl text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Buat Bagian Baru</h3>
                </div>
                <form onSubmit={createSection} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">Judul Bagian Kursus</label>
                    <input
                      type="text"
                      value={newSectionTitle}
                      onChange={(e) => setNewSectionTitle(e.target.value)}
                      placeholder="Contoh: Pengantar React, Konsep Dasar JavaScript, dll..."
                      className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-lg"
                      autoFocus
                      required
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <FaSave />
                      Buat Bagian
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateForm(false);
                        setNewSectionTitle('');
                      }}
                      className="px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white rounded-xl font-semibold transition-all duration-300 flex items-center gap-2"
                    >
                      <FaTimes />
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Sections List */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div key={section.id} className="group bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl hover:border-blue-400/50 transition-all duration-500 overflow-hidden">
              {/* Section Header */}
              <div className="p-8">
                {editingSection?.id === section.id ? (
                  <form onSubmit={updateSection} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-3">Edit Judul Bagian</label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-lg"
                        autoFocus
                        required
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                      >
                        <FaSave />
                        Simpan
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSection(null);
                          setEditTitle('');
                        }}
                        className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white rounded-xl font-semibold transition-all duration-300 flex items-center gap-2"
                      >
                        <FaTimes />
                        Batal
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-2xl font-bold text-white">{section.order}</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">{section.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <FaBookOpen />
                            {section.Lessons?.length || 0} Pelajaran
                          </span>
                          {section.Lessons && section.Lessons.length > 0 && (
                            <span className="flex items-center gap-1">
                              <FaClock />
                              {section.Lessons.reduce((total: number, lesson: any) => total + (lesson.duration || 0), 0)} menit
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {(user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN') && (
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => moveSection(section.id, 'up')}
                          disabled={index === 0}
                          className="p-3 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-lg"
                          title="Pindah ke atas"
                        >
                          <FaChevronUp />
                        </button>
                        <button
                          onClick={() => moveSection(section.id, 'down')}
                          disabled={index === sections.length - 1}
                          className="p-3 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-lg"
                          title="Pindah ke bawah"
                        >
                          <FaChevronDown />
                        </button>
                        <button
                          onClick={() => {
                            setEditingSection(section);
                            setEditTitle(section.title);
                          }}
                          className="px-4 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                        >
                          <FaEdit />
                          Edit
                        </button>
                        <button
                          onClick={() => deleteSection(section.id)}
                          className="px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                        >
                          <FaTrash />
                          Hapus
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Lessons List within Section */}
              {section.Lessons && section.Lessons.length > 0 && (
                <div className="bg-black/20 backdrop-blur-md border-t border-white/10">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-xl font-bold text-white flex items-center gap-3">
                        <FaBookOpen className="text-blue-400" />
                        Daftar Pelajaran ({section.Lessons.length})
                      </h4>
                      {(user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN') && (
                        <Link
                          to={`/courses/${courseId}/sections/${section.id}/lessons/create`}
                          className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 text-sm font-semibold"
                        >
                          <FaPlus />
                          Tambah Pelajaran
                        </Link>
                      )}
                    </div>
                    <div className="grid gap-4">
                      {section.Lessons.map((lesson: any, lessonIndex: number) => (
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
                                <h5 className="font-semibold text-white group-hover/lesson:text-blue-300 transition-colors duration-300 mb-1">{lesson.title}</h5>
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                  {lesson.duration && (
                                    <span className="flex items-center gap-1">
                                      <FaClock />
                                      {lesson.duration} menit
                                    </span>
                                  )}
                                  {lesson.videoUrl && (
                                    <span className="flex items-center gap-1">
                                      <FaVideo />
                                      Video
                                    </span>
                                  )}
                                  {lesson.content && (
                                    <span className="flex items-center gap-1">
                                      <FaFileAlt />
                                      Konten
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Button untuk melihat/belajar lesson - Fixed navigation */}
                              <Link
                                to={`/courses/${courseId}/lessons?section=${section.id}`}
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 text-sm font-medium"
                                title="Mulai belajar pelajaran ini"
                              >
                                <FaPlay className="text-xs" />
                                Belajar
                              </Link>

                              {/* Button untuk instructor/admin */}
                              {(user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN') && (
                                <>
                                  <button
                                    onClick={() => navigate(`/lessons/${lesson.id}/edit`)}
                                    className="px-3 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 text-sm"
                                    title="Edit pelajaran"
                                  >
                                    <FaEdit className="text-xs" />
                                    Edit
                                  </button>

                                  <button
                                    onClick={() => {
                                      if (confirm(`Apakah Anda yakin ingin menghapus pelajaran "${lesson.title}"?`)) {
                                        // Implementasi delete lesson
                                        console.log('Delete lesson:', lesson.id);
                                      }
                                    }}
                                    className="px-3 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 text-sm"
                                    title="Hapus pelajaran"
                                  >
                                    <FaTrash className="text-xs" />
                                    Hapus
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Preview konten lesson */}
                          {lesson.content && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                              <p className="text-gray-300 text-sm line-clamp-2">{lesson.content}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Quick Actions untuk Section */}
                    <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                      <div className="text-sm text-gray-400">
                        Total {section.Lessons.length} pelajaran • {section.Lessons.reduce((total: number, lesson: any) => total + (lesson.duration || 0), 0)} menit
                      </div>
                      <Link
                        to={`/courses/${courseId}/lessons?section=${section.id}`}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 text-sm font-medium"
                      >
                        <FaEye />
                        Belajar Bagian Ini
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Add Lesson Button for Empty Sections */}
              {(!section.Lessons || section.Lessons.length === 0) && (user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN') && (
                <div className="bg-black/20 backdrop-blur-md border-t border-white/10 p-8">
                  <div className="text-center">
                    <div className="mb-6">
                      <FaGraduationCap className="text-5xl text-gray-500 mx-auto mb-4" />
                      <h5 className="text-xl font-bold text-white mb-2">Bagian Ini Masih Kosong</h5>
                      <p className="text-gray-400 mb-6">Mulai dengan menambahkan pelajaran pertama untuk bagian ini</p>
                    </div>
                    <Link
                      to={`/courses/${courseId}/sections/${section.id}/lessons/create`}
                      className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
                    >
                      <FaPlus />
                      Tambah Pelajaran Pertama
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* No Sections Found Message */}
        {sections.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-12 max-w-2xl mx-auto">
              <div className="mb-8">
                <div className="inline-flex p-6 bg-gradient-to-br from-gray-600 to-gray-700 rounded-3xl shadow-lg mb-6">
                  <FaLayerGroup className="text-5xl text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Belum Ada Bagian Kursus</h3>
                <p className="text-xl text-gray-300 leading-relaxed">Mulai dengan membuat bagian kursus pertama Anda untuk mengorganisir materi pembelajaran</p>
              </div>
              {(user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN') && !showCreateForm && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl flex items-center gap-3 mx-auto"
                >
                  <FaPlus />
                  Buat Bagian Pertama
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
