import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import {
  AcademicCapIcon,
  BookOpenIcon,
  SparklesIcon,
  UsersIcon,
  ArrowRightIcon,
  ChartBarIcon,
  LightBulbIcon,
  FireIcon,
  TrophyIcon,
  RocketLaunchIcon,
  StarIcon,
  BoltIcon,
  PlayIcon,
  CheckCircleIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

export function Welcome() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const stats = [
    { number: '15,000+', label: 'Siswa Aktif', color: 'text-emerald-400', icon: UsersIcon },
    { number: '500+', label: 'Kursus Premium', color: 'text-blue-400', icon: BookOpenIcon },
    { number: '98.5%', label: 'Tingkat Kepuasan', color: 'text-yellow-400', icon: StarIcon },
    { number: '24/7', label: 'Dukungan Belajar', color: 'text-purple-400', icon: ShieldCheckIcon },
  ];

  const features = [
    {
      icon: RocketLaunchIcon,
      title: 'Pembelajaran AI-Powered',
      desc: 'Rekomendasi cerdas dan jalur pembelajaran yang dipersonalisasi',
      color: 'bg-gradient-to-br from-purple-600/20 to-pink-600/20',
      iconColor: 'text-purple-400',
      borderColor: 'border-purple-500/30',
    },
    {
      icon: TrophyIcon,
      title: 'Sertifikat Terakreditasi',
      desc: 'Sertifikat yang diakui industri untuk meningkatkan karir Anda',
      color: 'bg-gradient-to-br from-yellow-600/20 to-orange-600/20',
      iconColor: 'text-yellow-400',
      borderColor: 'border-yellow-500/30',
    },
    {
      icon: BoltIcon,
      title: 'Akses Seketika',
      desc: 'Belajar kapan saja, di mana saja dengan teknologi cloud terdepan',
      color: 'bg-gradient-to-br from-blue-600/20 to-cyan-600/20',
      iconColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/30',
    },
    {
      icon: GlobeAltIcon,
      title: 'Komunitas Global',
      desc: 'Bergabung dengan jutaan pembelajar dari seluruh dunia',
      color: 'bg-gradient-to-br from-green-600/20 to-emerald-600/20',
      iconColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Wijaya',
      role: 'Software Engineer di Tokopedia',
      content: 'EduNova mengubah karir saya sepenuhnya. Dalam 6 bulan, saya berhasil mendapat promosi!',
      rating: 5,
      avatar: '👩‍💻',
    },
    {
      name: 'Ahmad Rahman',
      role: 'Digital Marketing Manager',
      content: 'Platform terbaik untuk belajar skill digital. Materinya selalu up-to-date dan praktis.',
      rating: 5,
      avatar: '👨‍💼',
    },
    {
      name: 'Lisa Chen',
      role: 'UI/UX Designer',
      content: 'Instruktur berkualitas dan metode pembelajaran yang sangat efektif. Highly recommended!',
      rating: 5,
      avatar: '👩‍🎨',
    },
  ];

  const courseCategories = [
    { name: 'Web Development', count: '120+ Kursus', color: 'from-blue-500 to-indigo-600' },
    { name: 'Data Science', count: '85+ Kursus', color: 'from-green-500 to-emerald-600' },
    { name: 'Digital Marketing', count: '95+ Kursus', color: 'from-pink-500 to-rose-600' },
    { name: 'Mobile Development', count: '75+ Kursus', color: 'from-purple-500 to-violet-600' },
    { name: 'AI & Machine Learning', count: '60+ Kursus', color: 'from-orange-500 to-red-600' },
    { name: 'Cybersecurity', count: '45+ Kursus', color: 'from-teal-500 to-cyan-600' },
  ];

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const statInterval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);

    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(statInterval);
      clearInterval(testimonialInterval);
    };
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        {/* Animated Mesh Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent"></div>

        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>

        {/* Mouse Follow Effect */}
        <div
          className="absolute w-[600px] h-[600px] bg-gradient-to-r from-indigo-600/5 to-purple-600/5 rounded-full blur-3xl transition-all duration-1000 ease-out pointer-events-none"
          style={{
            left: mousePosition.x - 300,
            top: mousePosition.y - 300,
          }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 py-6 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
              <AcademicCapIcon className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">EduNova</span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-gray-300">
            <Link to="/course" className="hover:text-white transition-colors duration-300">
              Kursus
            </Link>
            <Link to="/instructors" className="hover:text-white transition-colors duration-300">
              Instruktur
            </Link>
            <Link to="/about" className="hover:text-white transition-colors duration-300">
              Tentang
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="px-6 py-2 text-gray-300 hover:text-white transition-colors duration-300">
              Masuk
            </Link>
            <Link to="/register" className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
              Daftar Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left Content */}
            <div className={`text-center lg:text-left space-y-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              {/* Badge */}
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-sm border border-indigo-500/30 rounded-full px-6 py-3">
                <FireIcon className="w-5 h-5 text-orange-400" />
                <span className="text-orange-400 font-bold text-sm tracking-wide uppercase">🔥 Platform #1 di Indonesia</span>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              </div>

              {/* Main Title */}
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight">
                  Wujudkan Impian
                  <br />
                  <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Karir Anda</span>
                  <br />
                  Bersama EduNova
                </h1>

                <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-2xl">
                  Bergabunglah dengan <span className="text-indigo-400 font-bold">15,000+ profesional</span> yang telah mengubah hidup mereka melalui pembelajaran berkualitas tinggi.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <Link
                  to="/register"
                  className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <RocketLaunchIcon className="mr-3 w-6 h-6" />
                  <span>Mulai Gratis Sekarang</span>
                  <ArrowRightIcon className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>

                <Link
                  to="/course"
                  className="group inline-flex items-center justify-center px-8 py-4 border-2 border-gray-600 hover:border-purple-500 text-gray-300 hover:text-white font-semibold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                >
                  <PlayIcon className="mr-3 w-5 h-5" />
                  <span>Jelajahi Kursus</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-col sm:flex-row items-center gap-8 pt-8">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {['👩‍💻', '👨‍💼', '👩‍🎨', '👨‍🚀', '👩‍🔬'].map((emoji, i) => (
                      <div key={i} className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full border-2 border-white flex items-center justify-center text-lg">
                        {emoji}
                      </div>
                    ))}
                    <div className="w-10 h-10 bg-gray-800 rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-xs">+15K</div>
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start space-x-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                    <span className="text-yellow-400 font-bold ml-2">4.9/5</span>
                  </div>
                  <p className="text-sm text-gray-400">Dipercaya ribuan siswa di seluruh Indonesia</p>
                </div>
              </div>
            </div>

            {/* Right Content - Stats & Features */}
            <div className={`space-y-8 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className={`relative group p-6 bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl transition-all duration-500 hover:scale-105 hover:bg-gray-800/60 ${
                      currentStat === index ? 'ring-2 ring-indigo-500 scale-105' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    <div className={`text-3xl font-black ${stat.color} mb-1`}>{stat.number}</div>
                    <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
                    {currentStat === index && <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-b-2xl"></div>}
                  </div>
                ))}
              </div>

              {/* Testimonial Card */}
              <div className="relative p-6 bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">{testimonials[currentTestimonial].avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-3 italic">"{testimonials[currentTestimonial].content}"</p>
                    <div>
                      <div className="font-semibold text-white">{testimonials[currentTestimonial].name}</div>
                      <div className="text-sm text-gray-400">{testimonials[currentTestimonial].role}</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center space-x-2 mt-4">
                  {testimonials.map((_, index) => (
                    <div key={index} className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentTestimonial ? 'bg-indigo-500 scale-125' : 'bg-gray-600'}`}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Mengapa Memilih <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">EduNova?</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">Platform pembelajaran terdepan dengan teknologi AI dan metode pembelajaran yang terbukti efektif</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative p-8 bg-gray-900/40 backdrop-blur-xl border ${feature.borderColor} rounded-2xl transition-all duration-500 hover:scale-105 hover:bg-gray-800/60 transform ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className={`relative p-4 ${feature.color} rounded-2xl backdrop-blur-sm border ${feature.borderColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 ${feature.iconColor} group-hover:animate-pulse`} />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-2xl"></div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="relative z-10 py-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Kategori <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Terpopuler</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">Jelajahi berbagai bidang keahlian yang paling diminati di industri digital</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseCategories.map((category, index) => (
              <div key={index} className="group relative p-6 bg-gray-900/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl transition-all duration-500 hover:scale-105 hover:bg-gray-800/60 cursor-pointer">
                <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>
                <div className="relative">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                    {category.name}
                  </h3>
                  <p className="text-gray-400 mb-4">{category.count}</p>
                  <div className="flex items-center text-indigo-400 font-semibold group-hover:text-white transition-colors duration-300">
                    <span>Jelajahi Kursus</span>
                    <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative p-12 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-gray-700/50 rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 via-purple-600/5 to-pink-600/5 rounded-3xl"></div>
            <div className="relative">
              <div className="mb-8">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-full px-4 py-2 mb-4">
                  <SparklesIcon className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-400 font-bold text-sm">PENAWARAN TERBATAS</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                  Siap Memulai Perjalanan
                  <br />
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Pembelajaran Anda?</span>
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Bergabunglah sekarang dan dapatkan akses ke 500+ kursus premium dengan <span className="text-yellow-400 font-bold">diskon 50%</span> untuk pendaftar baru!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="group relative inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 text-white font-black text-xl rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <TrophyIcon className="mr-3 w-6 h-6 animate-bounce" />
                  <span>Daftar Sekarang</span>
                  <div className="ml-2 px-2 py-1 bg-red-500 text-xs rounded-full animate-pulse">GRATIS</div>
                </Link>

                <Link
                  to="/course"
                  className="group inline-flex items-center justify-center px-10 py-5 border-2 border-gray-600 hover:border-orange-500 text-gray-300 hover:text-white font-bold text-xl rounded-2xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                >
                  <BookOpenIcon className="mr-3 w-6 h-6" />
                  <span>Lihat Semua Kursus</span>
                </Link>
              </div>

              <div className="mt-8 text-sm text-gray-400">
                <p>✅ Tanpa komitmen • ✅ Batal kapan saja • ✅ Sertifikat resmi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-12 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
              <AcademicCapIcon className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">EduNova</span>
          </div>
          <p className="text-gray-400 mb-6">Platform pembelajaran terdepan untuk mengembangkan karir dan mencapai impian Anda.</p>
          <div className="flex justify-center space-x-8 text-gray-400">
            <Link to="/privacy" className="hover:text-white transition-colors duration-300">
              Kebijakan Privasi
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors duration-300">
              Syarat & Ketentuan
            </Link>
            <Link to="/contact" className="hover:text-white transition-colors duration-300">
              Kontak
            </Link>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-gray-500">
            <p>&copy; 2024 EduNova. Seluruh hak cipta dilindungi undang-undang.</p>
          </div>
        </div>
      </footer>

      <style>{`
        .animate-spin.slow {
          animation: spin 20s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </main>
  );
}
