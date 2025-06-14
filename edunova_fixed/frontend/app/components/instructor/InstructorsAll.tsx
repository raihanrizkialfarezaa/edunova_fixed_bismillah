import React, { useEffect, useState, useMemo } from 'react';
import { instructorAPI } from '~/lib/instructor';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  UsersIcon,
  MagnifyingGlassIcon,
  CodeBracketIcon,
  UserCircleIcon,
  BookOpenIcon,
  ArrowTopRightOnSquareIcon,
  IdentificationIcon,
  ChartBarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
  AcademicCapIcon,
  SparklesIcon,
  XMarkIcon,
  FunnelIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';

type Instructor = {
  id: number;
  name: string;
  email: string;
  bio: string;
  expertise: string[];
  profileImage: string;
  totalCourses: number;
};

// Fungsi untuk menghitung jarak Levenshtein (edit distance)
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

// Fungsi fuzzy search dengan toleransi kesalahan
function fuzzyMatch(searchTerm: string, targetText: string, threshold = 0.7): boolean {
  if (!searchTerm || !targetText) return false;

  searchTerm = searchTerm.toLowerCase().trim();
  targetText = targetText.toLowerCase();

  // Exact match
  if (targetText.includes(searchTerm)) return true;

  // Split into words for better matching
  const searchWords = searchTerm.split(/\s+/);
  const targetWords = targetText.split(/\s+/);

  return searchWords.some((searchWord) => {
    if (searchWord.length < 3) return false; // Skip very short words

    return targetWords.some((targetWord) => {
      if (targetWord.includes(searchWord)) return true;

      const maxLength = Math.max(searchWord.length, targetWord.length);
      const distance = levenshteinDistance(searchWord, targetWord);
      const similarity = 1 - distance / maxLength;

      return similarity >= threshold;
    });
  });
}

export default function InstructorsAll() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [allInstructors, setAllInstructors] = useState<Instructor[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [expertise, setExpertise] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  const fetchInstructors = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await instructorAPI.getAllInstructors({
        page: 1,
        limit: 1000,
        search: '',
        expertise: '',
      });
      const data = res.data.data;
      setAllInstructors(data.instructors);
      setInstructors(data.instructors);
    } catch (err: any) {
      console.error('Failed to load instructors:', err);
      setError(err?.response?.data?.message || 'Gagal memuat data instruktur.');
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtering with fuzzy search
  const filteredInstructors = useMemo(() => {
    let filtered = allInstructors;

    if (search.trim()) {
      filtered = filtered.filter((inst) => {
        const searchableText = `${inst.name} ${inst.bio} ${inst.email}`;
        return fuzzyMatch(search, searchableText, 0.6); // 60% similarity threshold
      });
    }

    if (expertise.trim()) {
      filtered = filtered.filter((inst) => {
        return inst.expertise.some((exp) => fuzzyMatch(expertise, exp, 0.7)); // 70% similarity for skills
      });
    }

    return filtered;
  }, [allInstructors, search, expertise]);

  // Pagination
  const itemsPerPage = 6;
  const paginatedInstructors = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredInstructors.slice(startIndex, endIndex);
  }, [filteredInstructors, page]);

  const calculatedTotalPages = Math.ceil(filteredInstructors.length / itemsPerPage);

  useEffect(() => {
    fetchInstructors();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, expertise]);

  useEffect(() => {
    setInstructors(paginatedInstructors);
    setTotalPages(calculatedTotalPages);
  }, [paginatedInstructors, calculatedTotalPages]);

  const clearFilters = () => {
    setSearch('');
    setExpertise('');
    setPage(1);
  };

  // Loading state
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950">
        <div className="text-center p-10 bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-transparent border-t-indigo-500 border-b-purple-500 mx-auto"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-4 border-indigo-400/20 mx-auto"></div>
          </div>
          <p className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">Memuat Data Instruktur...</p>
          <p className="text-gray-400">Mohon tunggu sebentar</p>
        </div>
      </div>
    );

  // Error state
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-red-950 to-gray-900">
        <div className="text-center p-10 bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-red-700/50">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
            <XMarkIcon className="h-10 w-10 text-red-400" />
          </div>
          <p className="text-red-400 text-xl font-semibold mb-4">Terjadi Kesalahan: {error}</p>
          <button
            onClick={() => fetchInstructors()}
            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );

  // No results state
  if (!instructors.length && !loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950">
        <div className="text-center p-10 bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50">
          <div className="w-20 h-20 mx-auto mb-6 bg-indigo-500/20 rounded-full flex items-center justify-center">
            <UsersIcon className="h-10 w-10 text-indigo-400" />
          </div>
          <p className="text-white text-xl font-semibold mb-4">Tidak Ada Instruktur Ditemukan</p>
          <p className="text-gray-400 mb-6">Coba sesuaikan pencarian atau filter Anda</p>
          <button
            onClick={clearFilters}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Hapus Semua Filter
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-gray-800/40 via-gray-800/60 to-gray-800/40 backdrop-blur-xl rounded-3xl p-10 mb-10 shadow-2xl border border-gray-700/50">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10"></div>
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center">
            <div className="text-center lg:text-left mb-8 lg:mb-0">
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl mr-4 shadow-xl">
                  <AcademicCapIcon className="h-12 w-12 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-black bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent mb-2 tracking-tight">Semua Instruktur</h1>
                  <div className="flex items-center justify-center lg:justify-start">
                    <SparklesIcon className="h-5 w-5 text-yellow-400 mr-2" />
                    <span className="text-lg text-gray-300 font-medium">Pengalaman Belajar Premium</span>
                    <SparklesIcon className="h-5 w-5 text-yellow-400 ml-2" />
                  </div>
                </div>
              </div>
              <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">Temukan instruktur ahli kami dan jelajahi kursus-kursus berkualitas tinggi yang mereka tawarkan</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 border border-gray-600/30 shadow-xl">
                <p className="text-3xl font-bold text-white mb-2">{filteredInstructors.length}</p>
                <p className="text-gray-300 font-medium">Total Instruktur</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filter Section */}
        <div className="bg-gradient-to-r from-gray-800/30 via-gray-800/50 to-gray-800/30 backdrop-blur-xl rounded-2xl p-8 mb-10 shadow-2xl border border-gray-700/50">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl mr-3 shadow-lg">
              <MagnifyingGlassIcon className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Cari Instruktur Ideal Anda</h2>
          </div>

          {/* Search hint */}
          <div className="mb-6 bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-start">
              <LightBulbIcon className="h-5 w-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-blue-300 font-medium mb-1">💡 Tips Pencarian Cerdas:</p>
                <p className="text-blue-200 text-sm">
                  Pencarian kami toleran terhadap kesalahan ketik! Misalnya: <span className="font-mono bg-blue-800/30 px-2 py-1 rounded">"hanfik"</span> akan menemukan{' '}
                  <span className="font-mono bg-blue-800/30 px-2 py-1 rounded">"Hanafik"</span>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-300 mb-3">🔍 Cari berdasarkan Nama atau Bio</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ketik nama instruktur atau deskripsi..."
                  className="w-full bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-xl py-4 pl-12 pr-12 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 hover:bg-gray-700/70 group-hover:border-indigo-400/50"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <MagnifyingGlassIcon className="h-6 w-6 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-hover:text-indigo-400 transition-colors duration-300" />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors bg-gray-600/50 hover:bg-gray-500/50 rounded-full p-1">
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
              {search && <p className="mt-2 text-xs text-indigo-300">🎯 Mencocokkan: nama, bio, dan email dengan toleransi kesalahan ketik</p>}
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-gray-300 mb-3">🎯 Filter berdasarkan Keahlian</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Contoh: React, JavaScript, Python..."
                  className="w-full bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-xl py-4 pl-12 pr-12 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-gray-700/70 group-hover:border-purple-400/50"
                  value={expertise}
                  onChange={(e) => setExpertise(e.target.value)}
                />
                <CodeBracketIcon className="h-6 w-6 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-hover:text-purple-400 transition-colors duration-300" />
                {expertise && (
                  <button onClick={() => setExpertise('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors bg-gray-600/50 hover:bg-gray-500/50 rounded-full p-1">
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
              {expertise && <p className="mt-2 text-xs text-purple-300">🔧 Mencocokkan keahlian dengan toleransi kesalahan ketik</p>}
            </div>
          </div>

          {(search || expertise) && (
            <div className="mt-6 flex items-center justify-between bg-gradient-to-r from-gray-700/30 to-gray-600/30 backdrop-blur-sm rounded-xl p-4 border border-gray-600/30">
              <div className="flex items-center">
                <FunnelIcon className="h-5 w-5 text-indigo-400 mr-2" />
                <p className="text-gray-300">
                  Menampilkan <span className="font-bold text-white bg-indigo-600/20 px-2 py-1 rounded-lg">{filteredInstructors.length}</span> instruktur
                  {filteredInstructors.length !== 1 ? '' : ''}
                </p>
              </div>
              <button
                onClick={clearFilters}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                🗑️ Hapus Filter
              </button>
            </div>
          )}
        </div>

        {/* Enhanced Instructors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {instructors.map((inst, index) => (
            <div
              key={inst.id}
              className="group relative overflow-hidden bg-gradient-to-br from-gray-800/40 via-gray-800/60 to-gray-800/40 backdrop-blur-xl rounded-2xl p-7 shadow-2xl border border-gray-700/50 transition-all duration-500 hover:shadow-3xl hover:scale-[1.02] hover:border-indigo-500/50"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards',
              }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Enhanced Profile Image */}
                <div className="relative mb-6">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1">
                    <div className="w-full h-full rounded-full bg-gray-800 p-1">
                      {inst.profileImage ? (
                        <img
                          src={inst.profileImage}
                          alt={inst.name}
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.parentElement?.querySelector('.fallback-avatar') as HTMLElement;
                            if (fallback) {
                              fallback.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      <div
                        className={`fallback-avatar w-full h-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center ${inst.profileImage ? 'hidden' : 'flex'}`}
                        style={{ display: inst.profileImage ? 'none' : 'flex' }}
                      >
                        <UserCircleIcon className="h-16 w-16 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full p-2 shadow-lg animate-bounce">
                    <StarIcon className="h-4 w-4 text-white" />
                  </div>
                </div>

                {/* Enhanced Instructor Info */}
                <h3 className="text-xl font-bold text-white mb-3 break-all leading-tight px-2 group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                  {inst.name}
                </h3>
                <p
                  className="text-sm text-gray-400 mb-6 break-words leading-relaxed px-2 overflow-hidden"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {inst.bio || 'Instruktur berpengalaman yang berdedikasi untuk berbagi pengetahuan dan menginspirasi siswa-siswinya.'}
                </p>

                {/* Enhanced Stats Section */}
                <div className="w-full bg-gradient-to-r from-gray-700/30 to-gray-600/30 backdrop-blur-sm rounded-xl p-5 mb-6 border border-gray-600/30 shadow-inner">
                  <div className="grid grid-cols-2 gap-6 text-center">
                    <div>
                      <div className="flex items-center justify-center mb-3">
                        <div className="p-2 bg-purple-600/20 rounded-lg mr-2">
                          <CodeBracketIcon className="h-4 w-4 text-purple-400" />
                        </div>
                        <span className="text-xs font-semibold text-gray-300">Keahlian</span>
                      </div>
                      <div className="space-y-2">
                        {inst.expertise.length > 0 ? (
                          inst.expertise.slice(0, 2).map((exp, idx) => (
                            <span key={idx} className="inline-block text-xs bg-purple-900/50 text-purple-300 px-3 py-1 rounded-full mr-1 border border-purple-500/30 backdrop-blur-sm">
                              {exp}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500">Belum ada keahlian</span>
                        )}
                        {inst.expertise.length > 2 && <span className="inline-block text-xs bg-gray-600/50 text-gray-300 px-3 py-1 rounded-full border border-gray-500/30">+{inst.expertise.length - 2} lainnya</span>}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center mb-3">
                        <div className="p-2 bg-blue-600/20 rounded-lg mr-2">
                          <BookOpenIcon className="h-4 w-4 text-blue-400" />
                        </div>
                        <span className="text-xs font-semibold text-gray-300">Kursus</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{inst.totalCourses}</p>
                      <p className="text-xs text-gray-400">Total Kursus</p>
                    </div>
                  </div>
                </div>

                {/* Enhanced Action Buttons */}
                <div className="w-full space-y-4">
                  <Link
                    to={`/users/instructors/${inst.id}/courses`}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 px-5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25"
                  >
                    <ArrowTopRightOnSquareIcon className="h-5 w-5 mr-2" />
                    📚 Lihat Kursus
                  </Link>

                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to={`/users/instructor-profile/${inst.id}`}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-lg"
                    >
                      <IdentificationIcon className="h-4 w-4 mr-1" />
                      👤 Profil
                    </Link>

                    {user?.role === 'ADMIN' && (
                      <Link
                        to={`/instructors/${inst.id}/stats`}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2 px-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-lg"
                      >
                        <ChartBarIcon className="h-4 w-4 mr-1" />
                        📊 Statistik
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 bg-gradient-to-r from-gray-800/30 via-gray-800/50 to-gray-800/30 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-700/50">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:hover:scale-100 flex items-center shadow-lg transform hover:scale-105"
            >
              <ChevronLeftIcon className="h-5 w-5 mr-2" />
              ⬅️ Sebelumnya
            </button>

            <div className="flex items-center space-x-3">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-12 h-12 rounded-xl font-bold transition-all duration-300 transform hover:scale-110 shadow-lg ${
                      page === pageNum ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-500/25' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && (
                <>
                  <span className="text-gray-400 px-2 font-bold">...</span>
                  <button
                    onClick={() => setPage(totalPages)}
                    className={`w-12 h-12 rounded-xl font-bold transition-all duration-300 transform hover:scale-110 shadow-lg ${
                      page === totalPages ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-500/25' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:hover:scale-100 flex items-center shadow-lg transform hover:scale-105"
            >
              Selanjutnya ➡️
              <ChevronRightIcon className="h-5 w-5 ml-2" />
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
