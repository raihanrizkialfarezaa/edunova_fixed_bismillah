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
  CubeTransparentIcon,
  BeakerIcon,
  CodeBracketIcon,
} from '@heroicons/react/24/outline';

export function Welcome() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [scrollY, setScrollY] = useState(0);

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
      desc: 'Teknologi machine learning untuk jalur pembelajaran yang dipersonalisasi sesuai gaya belajar Anda',
      color: 'bg-gradient-to-br from-purple-600/30 to-pink-600/20',
      iconColor: 'text-purple-400',
      borderColor: 'border-purple-500/40',
      glowColor: 'group-hover:shadow-purple-500/25',
    },
    {
      icon: TrophyIcon,
      title: 'Sertifikat Terakreditasi',
      desc: 'Sertifikat yang diakui oleh industri global untuk meningkatkan kredibilitas profesional Anda',
      color: 'bg-gradient-to-br from-yellow-600/30 to-orange-600/20',
      iconColor: 'text-yellow-400',
      borderColor: 'border-yellow-500/40',
      glowColor: 'group-hover:shadow-yellow-500/25',
    },
    {
      icon: BoltIcon,
      title: 'Akses Seketika',
      desc: 'Platform cloud canggih dengan teknologi CDN global untuk pengalaman belajar tanpa batas',
      color: 'bg-gradient-to-br from-blue-600/30 to-cyan-600/20',
      iconColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/40',
      glowColor: 'group-hover:shadow-cyan-500/25',
    },
    {
      icon: GlobeAltIcon,
      title: 'Komunitas Global',
      desc: 'Jaringan pembelajar internasional dengan forum diskusi dan mentoring peer-to-peer',
      color: 'bg-gradient-to-br from-green-600/30 to-emerald-600/20',
      iconColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/40',
      glowColor: 'group-hover:shadow-emerald-500/25',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Wijaya',
      role: 'Software Engineer di Tokopedia',
      content: 'EduNova mengubah karir saya sepenuhnya. Dalam 6 bulan, saya berhasil mendapat promosi dan gaji naik 150%!',
      rating: 5,
      avatar: '👩‍💻',
      company: 'Tokopedia',
    },
    {
      name: 'Ahmad Rahman',
      role: 'Digital Marketing Manager',
      content: 'Platform terbaik untuk belajar skill digital. Materinya selalu up-to-date dan langsung applicable di dunia kerja.',
      rating: 5,
      avatar: '👨‍💼',
      company: 'Shopee',
    },
    {
      name: 'Lisa Chen',
      role: 'UI/UX Designer',
      content: 'Instruktur berkualitas dan metode pembelajaran yang sangat efektif. Portfolio saya sekarang jauh lebih profesional!',
      rating: 5,
      avatar: '👩‍🎨',
      company: 'Gojek',
    },
  ];

  const courseCategories = [
    {
      name: 'Web Development',
      count: '120+ Kursus',
      color: 'from-blue-500 to-indigo-600',
      icon: CodeBracketIcon,
      students: '12K+ siswa',
    },
    {
      name: 'Data Science',
      count: '85+ Kursus',
      color: 'from-green-500 to-emerald-600',
      icon: ChartBarIcon,
      students: '8K+ siswa',
    },
    {
      name: 'Digital Marketing',
      count: '95+ Kursus',
      color: 'from-pink-500 to-rose-600',
      icon: SparklesIcon,
      students: '15K+ siswa',
    },
    {
      name: 'Mobile Development',
      count: '75+ Kursus',
      color: 'from-purple-500 to-violet-600',
      icon: CubeTransparentIcon,
      students: '9K+ siswa',
    },
    {
      name: 'AI & Machine Learning',
      count: '60+ Kursus',
      color: 'from-orange-500 to-red-600',
      icon: BeakerIcon,
      students: '6K+ siswa',
    },
    {
      name: 'Cybersecurity',
      count: '45+ Kursus',
      color: 'from-teal-500 to-cyan-600',
      icon: ShieldCheckIcon,
      students: '4K+ siswa',
    },
  ];

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const statInterval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);

    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-600/15 via-transparent to-transparent"></div>

        {/* Enhanced Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/15 to-pink-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/15 to-cyan-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-indigo-600/10 to-purple-600/5 rounded-full blur-2xl animate-pulse delay-2000"></div>

        {/* Animated Grid Pattern */}
        <div
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)]"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        ></div>

        {/* Enhanced Mouse Follow Effect */}
        <div
          className="absolute w-[800px] h-[800px] bg-gradient-to-r from-indigo-600/8 to-purple-600/6 rounded-full blur-3xl transition-all duration-1000 ease-out pointer-events-none"
          style={{
            left: mousePosition.x - 400,
            top: mousePosition.y - 400,
          }}
        ></div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Enhanced Navigation */}
      <nav className="relative z-50 py-6 px-4 lg:px-8 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/25">
              <AcademicCapIcon className="h-8 w-8 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <span className="text-2xl font-black text-white">EduNova</span>
              <div className="text-xs text-gray-400 font-medium">Learning Platform</div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-gray-300">
            <Link to="/course" className="relative group hover:text-white transition-all duration-300 font-medium">
              Kursus
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link to="/instructors" className="relative group hover:text-white transition-all duration-300 font-medium">
              Instruktur
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link to="/about" className="relative group hover:text-white transition-all duration-300 font-medium">
              Tentang
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="px-6 py-2.5 text-gray-300 hover:text-white transition-all duration-300 font-medium rounded-lg hover:bg-white/5">
              Masuk
            </Link>
            <Link
              to="/register"
              className="relative px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative">Daftar Gratis</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left Content */}
            <div className={`text-center lg:text-left space-y-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              {/* Enhanced Badge */}
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-sm border border-indigo-500/30 rounded-full px-6 py-3 shadow-lg shadow-indigo-500/10">
                <FireIcon className="w-5 h-5 text-orange-400 animate-pulse" />
                <span className="text-orange-400 font-bold text-sm tracking-wide uppercase">🔥 Platform #1 di Indonesia</span>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
              </div>

              {/* Enhanced Main Title */}
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight">
                  <span className="inline-block animate-fade-in-up">Wujudkan Impian</span>
                  <br />
                  <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">Karir Anda</span>
                  <br />
                  <span className="inline-block animate-fade-in-up delay-200">Bersama EduNova</span>
                </h1>

                <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-2xl animate-fade-in-up delay-300">
                  Bergabunglah dengan <span className="font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">15,000+ profesional</span> yang telah mengubah hidup mereka melalui pembelajaran
                  berkualitas tinggi dari instruktur terbaik dunia.
                </p>
              </div>

              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <Link
                  to="/register"
                  className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <RocketLaunchIcon className="mr-3 w-6 h-6 group-hover:animate-bounce" />
                  <span className="relative">Mulai Gratis Sekarang</span>
                  <ArrowRightIcon className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>

                <Link
                  to="/course"
                  className="group inline-flex items-center justify-center px-8 py-4 border-2 border-gray-600 hover:border-purple-500 text-gray-300 hover:text-white font-semibold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm hover:bg-purple-500/10"
                >
                  <PlayIcon className="mr-3 w-5 h-5 group-hover:animate-pulse" />
                  <span>Jelajahi Kursus</span>
                </Link>
              </div>

              {/* Enhanced Trust Indicators */}
              <div className="flex flex-col sm:flex-row items-center gap-8 pt-8">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {['👩‍💻', '👨‍💼', '👩‍🎨', '👨‍🚀', '👩‍🔬'].map((emoji, i) => (
                      <div
                        key={i}
                        className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full border-3 border-white flex items-center justify-center text-lg shadow-lg transform hover:scale-110 transition-transform duration-300"
                      >
                        {emoji}
                      </div>
                    ))}
                    <div className="w-12 h-12 bg-gradient-to-r from-gray-800 to-gray-700 rounded-full border-3 border-white flex items-center justify-center text-white font-bold text-xs shadow-lg">+15K</div>
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start space-x-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                    <span className="text-yellow-400 font-bold ml-2 text-lg">4.9/5</span>
                  </div>
                  <p className="text-sm text-gray-400">Dipercaya ribuan siswa di seluruh Indonesia</p>
                </div>
              </div>
            </div>

            {/* Enhanced Right Content - Stats & Features */}
            <div className={`space-y-8 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              {/* Enhanced Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className={`relative group p-6 bg-gray-900/70 backdrop-blur-xl border border-gray-700/50 rounded-2xl transition-all duration-500 hover:scale-105 hover:bg-gray-800/70 cursor-pointer ${
                      currentStat === index ? 'ring-2 ring-indigo-500 scale-105 shadow-lg shadow-indigo-500/25' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <stat.icon className={`w-8 h-8 ${stat.color} group-hover:animate-pulse`} />
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    <div className={`text-3xl font-black ${stat.color} mb-1 group-hover:scale-110 transition-transform duration-300`}>{stat.number}</div>
                    <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
                    {currentStat === index && <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-b-2xl animate-pulse"></div>}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  </div>
                ))}
              </div>

              {/* Enhanced Testimonial Card */}
              <div className="relative p-6 bg-gray-900/70 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl animate-bounce">{testimonials[currentTestimonial].avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-current animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-3 italic text-sm leading-relaxed">"{testimonials[currentTestimonial].content}"</p>
                    <div>
                      <div className="font-semibold text-white">{testimonials[currentTestimonial].name}</div>
                      <div className="text-sm text-gray-400">{testimonials[currentTestimonial].role}</div>
                      <div className="text-xs text-indigo-400 font-medium">{testimonials[currentTestimonial].company}</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center space-x-2 mt-4">
                  {testimonials.map((_, index) => (
                    <div key={index} className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${index === currentTestimonial ? 'bg-indigo-500 scale-125' : 'bg-gray-600 hover:bg-gray-500'}`}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="relative z-10 py-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Mengapa Memilih <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">EduNova?</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">Platform pembelajaran terdepan dengan teknologi AI dan metode pembelajaran yang terbukti efektif untuk mengakselerasi karir Anda</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative p-8 bg-gray-900/50 backdrop-blur-xl border ${feature.borderColor} rounded-2xl transition-all duration-500 hover:scale-105 hover:bg-gray-800/70 transform cursor-pointer ${
                  feature.glowColor
                } hover:shadow-2xl ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className={`relative p-4 ${feature.color} rounded-2xl backdrop-blur-sm border ${feature.borderColor} mb-6 group-hover:scale-110 transition-transform duration-300 overflow-hidden`}>
                  <feature.icon className={`w-8 h-8 ${feature.iconColor} group-hover:animate-pulse relative z-10`} />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-2xl"></div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm">{feature.desc}</p>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Course Categories */}
      <section className="relative z-10 py-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Kategori <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Terpopuler</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">Jelajahi berbagai bidang keahlian yang paling diminati di industri digital dan teknologi masa depan</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseCategories.map((category, index) => (
              <div key={index} className="group relative p-8 bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl transition-all duration-500 hover:scale-105 hover:bg-gray-800/70 cursor-pointer hover:shadow-2xl">
                <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>
                <div className="relative">
                  <div className="flex items-center mb-4">
                    <div className={`p-3 bg-gradient-to-r ${category.color} rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300`}>
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500">{category.students}</p>
                    </div>
                  </div>
                  <p className="text-gray-400 mb-6 text-lg font-medium">{category.count}</p>
                  <div className="flex items-center text-indigo-400 font-semibold group-hover:text-white transition-colors duration-300">
                    <span>Jelajahi Kursus</span>
                    <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative z-10 py-20 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative p-12 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-gray-700/50 rounded-3xl shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 via-purple-600/5 to-pink-600/5 rounded-3xl animate-pulse"></div>
            <div className="relative">
              <div className="mb-8">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-full px-4 py-2 mb-4 animate-bounce">
                  <SparklesIcon className="w-5 h-5 text-yellow-400 animate-spin" />
                  <span className="text-yellow-400 font-bold text-sm">PENAWARAN TERBATAS</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                  Siap Memulai Perjalanan
                  <br />
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent animate-gradient-x">Pembelajaran Anda?</span>
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Bergabunglah sekarang dan dapatkan akses ke <span className="text-white font-bold">500+ kursus premium</span>
                  dengan <span className="text-yellow-400 font-bold animate-pulse">diskon 50%</span> untuk pendaftar baru!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="group relative inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 text-white font-black text-xl rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <TrophyIcon className="mr-3 w-6 h-6 animate-bounce" />
                  <span className="relative">Daftar Sekarang</span>
                  <div className="ml-2 px-2 py-1 bg-red-500 text-xs rounded-full animate-pulse">GRATIS</div>
                </Link>

                <Link
                  to="/course"
                  className="group inline-flex items-center justify-center px-10 py-5 border-2 border-gray-600 hover:border-orange-500 text-gray-300 hover:text-white font-bold text-xl rounded-2xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm hover:bg-orange-500/10"
                >
                  <BookOpenIcon className="mr-3 w-6 h-6 group-hover:animate-pulse" />
                  <span>Lihat Semua Kursus</span>
                </Link>
              </div>

              <div className="mt-8 text-sm text-gray-400">
                <p className="flex items-center justify-center space-x-4">
                  <span className="flex items-center">
                    <CheckCircleIcon className="w-4 h-4 mr-1 text-green-400" /> Tanpa komitmen
                  </span>
                  <span className="flex items-center">
                    <CheckCircleIcon className="w-4 h-4 mr-1 text-green-400" /> Batal kapan saja
                  </span>
                  <span className="flex items-center">
                    <CheckCircleIcon className="w-4 h-4 mr-1 text-green-400" /> Sertifikat resmi
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-12 px-4 lg:px-8 bg-gray-900/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="relative p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg">
              <AcademicCapIcon className="h-6 w-6 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <span className="text-xl font-bold text-white">EduNova</span>
              <div className="text-xs text-gray-400">Learning Platform</div>
            </div>
          </div>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">Platform pembelajaran terdepan untuk mengembangkan karir dan mencapai impian Anda dengan teknologi terdepan dan instruktur berkualitas global.</p>
          <div className="flex justify-center space-x-8 text-gray-400 mb-8">
            <Link to="/privacy" className="hover:text-white transition-colors duration-300 relative group">
              Kebijakan Privasi
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors duration-300 relative group">
              Syarat & Ketentuan
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link to="/contact" className="hover:text-white transition-colors duration-300 relative group">
              Kontak
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
            </Link>
          </div>
          <div className="pt-8 border-t border-gray-800 text-gray-500">
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
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
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
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
          background-size: 200% 200%;
        }
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </main>
  );
}
