import { useParams, Link, useNavigate } from "react-router-dom"; // Pastikan Link dan useNavigate diimpor dari 'react-router-dom'
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axiosInstance from "../lib/axios";

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
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
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
      setError(err.response?.data?.message || "Gagal mengambil bagian kursus");
    } finally {
      setLoading(false);
    }
  };

  const createSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionTitle.trim()) return;

    try {
      await axiosInstance.post(`/courses/${courseId}/sections/create`, {
        title: newSectionTitle
      });
      setNewSectionTitle("");
      setShowCreateForm(false);
      fetchSections();
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal membuat bagian kursus");
    }
  };

  const updateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection || !editTitle.trim()) return;

    try {
      await axiosInstance.put(`/sections/${editingSection.id}`, {
        title: editTitle
      });
      setEditingSection(null);
      setEditTitle("");
      fetchSections();
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal memperbarui bagian kursus");
    }
  };

  const deleteSection = async (sectionId: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus bagian ini? Ini juga akan menghapus pelajaran di dalamnya.")) return;

    try {
      await axiosInstance.delete(`/sections/${sectionId}`);
      fetchSections();
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menghapus bagian kursus");
    }
  };

  const moveSection = async (sectionId: number, direction: "up" | "down") => {
    const sectionIndex = sections.findIndex(s => s.id === sectionId);
    if (sectionIndex === -1) return;

    const newSections = [...sections];
    const targetIndex = direction === "up" ? sectionIndex - 1 : sectionIndex + 1;
    
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    [newSections[sectionIndex], newSections[targetIndex]] = [newSections[targetIndex], newSections[sectionIndex]];
    
    // Optimistically update UI
    setSections(newSections);

    const sectionOrders = newSections.map((section, index) => ({
      id: section.id,
      order: index + 1
    }));

    try {
      await axiosInstance.put(`/courses/${courseId}/sections/reorder`, {
        sectionOrders
      });
      // Re-fetch to ensure server state matches
      fetchSections(); 
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal mengubah urutan bagian kursus");
      // Revert to original sections if API call fails
      fetchSections(); 
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-300 font-sans">
      <p className="text-lg">Memuat bagian kursus...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans p-8">
      <div className="max-w-4xl mx-auto bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-800">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="text-blue-500 hover:text-blue-400 transition duration-200 flex items-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Kembali ke Dashboard
          </Link>
          <h1 className="text-4xl font-extrabold text-blue-400 mb-2">Kelola Bagian Kursus</h1>
          {course && <p className="text-lg text-gray-400">Kursus: <span className="font-semibold text-blue-300">{course.title}</span></p>}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 bg-opacity-30 text-red-400 p-4 rounded-lg mb-6 flex justify-between items-center font-medium">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-300 hover:text-red-100 transition-colors duration-200 text-2xl leading-none">×</button>
          </div>
        )}

        {/* Add Section Form/Button */}
        {(user?.role === "INSTRUCTOR" || user?.role === "ADMIN") && (
          <div className="mb-8 p-6 bg-gray-800 rounded-lg shadow-md border border-gray-700">
            {!showCreateForm ? (
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md w-full"
              >
                Tambah Bagian Baru
              </button>
            ) : (
              <form onSubmit={createSection} className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  placeholder="Judul bagian kursus (e.g., Pengantar React)"
                  className="flex-1 px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-500
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-inner"
                  autoFocus
                  required
                />
                <div className="flex gap-2">
                  <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-semibold transition duration-300 shadow-sm">
                    Buat
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewSectionTitle("");
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-3 rounded-lg font-semibold transition duration-300 shadow-sm"
                  >
                    Batal
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Sections List */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div key={section.id} className="bg-gray-800 rounded-xl p-6 shadow-md border border-gray-700 hover:border-blue-600 transition-all duration-300">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                {editingSection?.id === section.id ? (
                  <form onSubmit={updateSection} className="flex-1 flex flex-col sm:flex-row gap-3 w-full">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-500
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-inner"
                      autoFocus
                      required
                    />
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition duration-300 shadow-sm">
                        Simpan
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSection(null);
                          setEditTitle("");
                        }}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition duration-300 shadow-sm"
                      >
                        Batal
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-blue-300">
                      {section.order}. {section.title}
                    </h3>
                    {(user?.role === "INSTRUCTOR" || user?.role === "ADMIN") && (
                      <div className="flex flex-wrap gap-2 justify-end sm:justify-start">
                        <button
                          onClick={() => moveSection(section.id, "up")}
                          disabled={index === 0}
                          className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-1 rounded-lg text-sm transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          onClick={() => moveSection(section.id, "down")}
                          disabled={index === sections.length - 1}
                          className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-1 rounded-lg text-sm transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setEditingSection(section);
                            setEditTitle(section.title);
                          }}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition duration-300 shadow-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteSection(section.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition duration-300 shadow-sm"
                        >
                          Hapus
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              {/* Lessons List within Section */}
              {section.Lessons && section.Lessons.length > 0 && (
                <div className="mt-4 pl-6 border-l-4 border-blue-700 bg-gray-850 p-4 rounded-md">
                  <p className="text-base font-semibold text-gray-300 mb-3">Pelajaran:</p>
                  <div className="space-y-2">
                    {section.Lessons.map((lesson: any) => (
                      <Link 
                        key={lesson.id} 
                        to={`/lessons/${lesson.id}/edit`} // Assuming a route to edit lessons
                        className="flex items-center text-gray-400 hover:text-blue-400 transition duration-200 text-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        {lesson.order}. {lesson.title} 
                        {lesson.duration && <span className="ml-2 text-gray-500 text-xs">({lesson.duration} menit)</span>}
                      </Link>
                    ))}
                    {(user?.role === "INSTRUCTOR" || user?.role === "ADMIN") && (
                       <Link 
                         to={`/courses/${courseId}/sections/${section.id}/lessons/create`} 
                         className="flex items-center text-green-500 hover:text-green-400 transition duration-200 text-sm mt-3"
                       >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                         </svg>
                         Tambah Pelajaran
                       </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* No Sections Found Message */}
        {sections.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-xl font-medium bg-gray-800 rounded-xl shadow-lg mt-8">
            Tidak ada bagian kursus ditemukan. Buat bagian kursus pertama Anda untuk memulai!
          </div>
        )}
      </div>
    </div>
  );
}