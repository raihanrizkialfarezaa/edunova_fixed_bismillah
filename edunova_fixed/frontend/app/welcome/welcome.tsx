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
  CurrencyDollarIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleBottomCenterTextIcon,
  PresentationChartLineIcon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export function Welcome() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [currentBenefit, setCurrentBenefit] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const stats = [
    { number: '25,000+', label: 'Siswa Aktif', color: 'text-emerald-400', icon: UsersIcon, growth: '+15%' },
    { number: '750+', label: 'Kursus Premium', color: 'text-blue-400', icon: BookOpenIcon, growth: '+25%' },
    { number: '99.2%', label: 'Tingkat Kepuasan', color: 'text-yellow-400', icon: StarIcon, growth: '+0.7%' },
    { number: '24/7', label: 'Dukungan Belajar', color: 'text-purple-400', icon: ShieldCheckIcon, growth: 'Live' },
  ];

  const features = [
    {
      icon: RocketLaunchIcon,
      title: 'Pembelajaran AI-Powered',
      desc: 'Teknologi machine learning canggih untuk jalur pembelajaran yang dipersonalisasi secara otomatis sesuai gaya dan kecepatan belajar unik Anda',
      color: 'bg-gradient-to-br from-purple-600/40 to-pink-600/30',
      iconColor: 'text-purple-400',
      borderColor: 'border-purple-500/50',
      glowColor: 'group-hover:shadow-purple-500/30',
      badge: 'AI-Powered',
      badgeColor: 'bg-purple-500/20 text-purple-300',
    },
    {
      icon: TrophyIcon,
      title: 'Sertifikat Terakreditasi Global',
      desc: 'Sertifikat berstandar internasional yang diakui oleh 500+ perusahaan multinasional dan startup unicorn untuk meningkatkan kredibilitas profesional',
      color: 'bg-gradient-to-br from-yellow-600/40 to-orange-600/30',
      iconColor: 'text-yellow-400',
      borderColor: 'border-yellow-500/50',
      glowColor: 'group-hover:shadow-yellow-500/30',
      badge: 'Terakreditasi',
      badgeColor: 'bg-yellow-500/20 text-yellow-300',
    },
    {
      icon: BoltIcon,
      title: 'Akses Seketika Tanpa Batas',
      desc: 'Platform cloud enterprise dengan teknologi CDN global dan infrastruktur 99.9% uptime untuk pengalaman belajar yang seamless dimana saja',
      color: 'bg-gradient-to-br from-blue-600/40 to-cyan-600/30',
      iconColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/50',
      glowColor: 'group-hover:shadow-cyan-500/30',
      badge: 'Cloud-Native',
      badgeColor: 'bg-cyan-500/20 text-cyan-300',
    },
    {
      icon: GlobeAltIcon,
      title: 'Komunitas Global Elite',
      desc: 'Jaringan pembelajaran internasional dengan 50,000+ profesional dari 120+ negara, forum diskusi premium, dan program mentoring eksklusif',
      color: 'bg-gradient-to-br from-green-600/40 to-emerald-600/30',
      iconColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/50',
      glowColor: 'group-hover:shadow-emerald-500/30',
      badge: 'Global Network',
      badgeColor: 'bg-emerald-500/20 text-emerald-300',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Wijaya',
      role: 'Senior Software Engineer',
      content: 'EduNova mengubah hidup saya sepenuhnya! Dalam 8 bulan, saya berhasil mendapat promosi ke senior engineer dan gaji naik 200%. Platform ini benar-benar luar biasa!',
      rating: 5,
      avatar: '👩‍💻',
      company: 'Tokopedia',
      salary: '+200%',
      time: '8 bulan',
    },
    {
      name: 'Ahmad Rahman',
      role: 'Digital Marketing Director',
      content: 'Platform terbaik yang pernah saya gunakan! Materinya selalu up-to-date dengan trend industry terbaru. Sekarang saya memimpin tim marketing digital di unicorn startup.',
      rating: 5,
      avatar: '👨‍💼',
      company: 'Shopee',
      salary: '+180%',
      time: '6 bulan',
    },
    {
      name: 'Lisa Chen',
      role: 'Head of Design',
      content: 'Instruktur world-class dan metode pembelajaran yang sangat efektif. Portfolio saya sekarang level internasional dan berhasil join perusahaan impian!',
      rating: 5,
      avatar: '👩‍🎨',
      company: 'Gojek',
      salary: '+250%',
      time: '10 bulan',
    },
  ];

  const courseCategories = [
    {
      name: 'Web Development',
      count: '150+ Kursus',
      color: 'from-blue-500 to-indigo-600',
      icon: CodeBracketIcon,
      students: '18K+ siswa',
      level: 'Pemula - Expert',
      duration: '3-12 bulan',
      salary: 'Rp 8-25 juta',
    },
    {
      name: 'Data Science & AI',
      count: '120+ Kursus',
      color: 'from-green-500 to-emerald-600',
      icon: ChartBarIcon,
      students: '12K+ siswa',
      level: 'Menengah - Expert',
      duration: '6-18 bulan',
      salary: 'Rp 12-35 juta',
    },
    {
      name: 'Digital Marketing',
      count: '130+ Kursus',
      color: 'from-pink-500 to-rose-600',
      icon: SparklesIcon,
      students: '22K+ siswa',
      level: 'Pemula - Expert',
      duration: '2-8 bulan',
      salary: 'Rp 6-20 juta',
    },
    {
      name: 'Mobile Development',
      count: '100+ Kursus',
      color: 'from-purple-500 to-violet-600',
      icon: DevicePhoneMobileIcon,
      students: '14K+ siswa',
      level: 'Pemula - Expert',
      duration: '4-12 bulan',
      salary: 'Rp 10-30 juta',
    },
    {
      name: 'AI & Machine Learning',
      count: '85+ Kursus',
      color: 'from-orange-500 to-red-600',
      icon: BeakerIcon,
      students: '8K+ siswa',
      level: 'Menengah - Expert',
      duration: '8-24 bulan',
      salary: 'Rp 15-50 juta',
    },
    {
      name: 'Cybersecurity',
      count: '75+ Kursus',
      color: 'from-teal-500 to-cyan-600',
      icon: ShieldCheckIcon,
      students: '6K+ siswa',
      level: 'Menengah - Expert',
      duration: '6-18 bulan',
      salary: 'Rp 12-40 juta',
    },
  ];

  const benefits = [
    {
      icon: CurrencyDollarIcon,
      title: 'Garansi Kerja 100%',
      desc: 'Jaminan mendapat pekerjaan dalam 6 bulan atau uang kembali penuh',
      color: 'text-emerald-400',
    },
    {
      icon: ClockIcon,
      title: 'Belajar Fleksibel',
      desc: 'Akses 24/7 dengan progress tracking dan reminder pintar',
      color: 'text-blue-400',
    },
    {
      icon: UsersIcon,
      title: 'Mentoring 1-on-1',
      desc: 'Sesi konsultasi personal dengan industry expert',
      color: 'text-purple-400',
    },
    {
      icon: TrophyIcon,
      title: 'Job Placement',
      desc: 'Bantuan penempatan kerja di 1000+ perusahaan partner',
      color: 'text-yellow-400',
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
    }, 2500);

    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    const benefitInterval = setInterval(() => {
      setCurrentBenefit((prev) => (prev + 1) % benefits.length);
    }, 3000);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      clearInterval(statInterval);
      clearInterval(testimonialInterval);
      clearInterval(benefitInterval);
    };
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Ultra Enhanced Background Effects - Optimized for Mobile */}
      <div className="absolute inset-0">
        {/* Layered Mesh Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-600/25 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-600/25 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-600/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-600/15 via-transparent to-transparent"></div>

        {/* Responsive Floating Orbs */}
        <div className="absolute top-0 left-0 w-[400px] md:w-[600px] xl:w-[800px] h-[400px] md:h-[600px] xl:h-[800px] bg-gradient-to-r from-purple-600/20 to-pink-600/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[400px] md:w-[600px] xl:w-[800px] h-[400px] md:h-[600px] xl:h-[800px] bg-gradient-to-r from-blue-600/20 to-cyan-600/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-[300px] md:w-[500px] xl:w-[600px] h-[300px] md:h-[500px] xl:h-[600px] bg-gradient-to-r from-indigo-600/15 to-purple-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>

        {/* Enhanced Grid Pattern - Mobile Optimized */}
        <div
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:40px_40px] md:bg-[size:60px_60px] xl:bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_60%,transparent_100%)]"
          style={{
            transform: `translateY(${scrollY * 0.1}px) rotate(${scrollY * 0.005}deg)`,
          }}
        ></div>

        {/* Mouse Follow Effect - Disabled on Mobile */}
        <div
          className="hidden md:block absolute w-[600px] xl:w-[1200px] h-[600px] xl:h-[1200px] bg-gradient-to-r from-indigo-600/10 to-purple-600/8 rounded-full blur-3xl transition-all duration-1000 ease-out pointer-events-none"
          style={{
            left: mousePosition.x - (window.innerWidth < 768 ? 300 : 600),
            top: mousePosition.y - (window.innerWidth < 768 ? 300 : 600),
          }}
        ></div>

        {/* Reduced Floating Particles for Mobile */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(window.innerWidth < 768 ? 15 : 40)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-gradient-to-r from-white/30 to-purple-400/30 rounded-full animate-float"
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${6 + Math.random() * 8}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Animated Geometric Shapes - Simplified for Mobile */}
        <div className="absolute inset-0 overflow-hidden opacity-20 md:opacity-30">
          <div className="absolute top-10 md:top-20 left-10 md:left-20 w-16 md:w-24 xl:w-32 h-16 md:h-24 xl:h-32 border border-purple-500/30 rounded-lg rotate-45 animate-spin-slow"></div>
          <div className="absolute bottom-10 md:bottom-20 right-10 md:right-20 w-12 md:w-18 xl:w-24 h-12 md:h-18 xl:h-24 border border-blue-500/30 rounded-full animate-bounce"></div>
        </div>
      </div>

      {/* Responsive Navigation */}
      <nav className="relative z-50 py-3 md:py-6 px-4 lg:px-8 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="relative p-2 md:p-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl md:rounded-2xl shadow-2xl shadow-indigo-500/30 transform hover:scale-105 transition-transform duration-300">
              <AcademicCapIcon className="h-5 w-5 md:h-8 md:w-8 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse shadow-lg"></div>
            </div>
            <div>
              <div className="flex items-center space-x-1 md:space-x-2">
                <span className="text-xl md:text-3xl font-black bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">EduNova</span>
                <div className="px-2 py-0.5 md:px-3 md:py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-black rounded-full">PREMIUM</div>
              </div>
              <div className="text-xs md:text-sm text-gray-400 font-medium hidden sm:block">Platform Pembelajaran #1 Indonesia</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8 text-gray-300">
            <Link to="/course" className="relative group hover:text-white transition-all duration-300 font-semibold text-lg">
              Kursus
              <div className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300 rounded-full"></div>
            </Link>
            <Link to="/instructors" className="relative group hover:text-white transition-all duration-300 font-semibold text-lg">
              Instruktur
              <div className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300 rounded-full"></div>
            </Link>
            <Link to="/about" className="relative group hover:text-white transition-all duration-300 font-semibold text-lg">
              Tentang
              <div className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300 rounded-full"></div>
            </Link>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <Link
              to="/login"
              className="px-4 lg:px-8 py-2 lg:py-3 text-gray-300 hover:text-white transition-all duration-300 font-semibold rounded-xl hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20 text-sm lg:text-base"
            >
              Masuk
            </Link>
            <Link
              to="/register"
              className="relative px-4 lg:px-8 py-2 lg:py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 overflow-hidden group text-sm lg:text-base"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative flex items-center">
                <RocketLaunchIcon className="w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2 group-hover:animate-bounce" />
                Daftar Gratis
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-white hover:text-gray-300 transition-colors duration-200">
            {isMobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-2xl border-b border-white/10 z-50">
            <div className="px-4 py-6 space-y-4">
              <Link to="/course" className="block text-gray-300 hover:text-white font-semibold py-2 transition-colors duration-200">
                Kursus
              </Link>
              <Link to="/instructors" className="block text-gray-300 hover:text-white font-semibold py-2 transition-colors duration-200">
                Instruktur
              </Link>
              <Link to="/about" className="block text-gray-300 hover:text-white font-semibold py-2 transition-colors duration-200">
                Tentang
              </Link>
              <div className="pt-4 border-t border-gray-700 space-y-3">
                <Link
                  to="/login"
                  className="block w-full text-center px-4 py-3 text-gray-300 hover:text-white transition-all duration-300 font-semibold rounded-xl hover:bg-white/10 backdrop-blur-sm border border-gray-600 hover:border-white/20"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center px-4 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-xl font-bold transition-all duration-300 shadow-xl"
                >
                  Daftar Gratis
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Responsive Hero Section */}
      <section className="relative z-10 pt-8 md:pt-16 xl:pt-24 pb-16 md:pb-32 xl:pb-40 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-16 xl:gap-24 items-center">
            {/* Left Content - Mobile Optimized */}
            <div className={`text-center lg:text-left space-y-6 md:space-y-8 xl:space-y-10 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              {/* Mobile Optimized Badge */}
              <div className="inline-flex items-center space-x-2 md:space-x-4 bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-pink-600/30 backdrop-blur-2xl border border-indigo-500/40 rounded-xl md:rounded-2xl px-4 md:px-8 py-2 md:py-4 shadow-2xl shadow-indigo-500/20">
                <div className="flex items-center space-x-1 md:space-x-2">
                  <FireIcon className="w-4 h-4 md:w-6 md:h-6 text-orange-400 animate-pulse" />
                  <span className="text-orange-400 font-black text-xs md:text-base tracking-wide uppercase">🔥 Platform Terbaik</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full animate-ping"></div>
                  <span className="text-green-400 font-bold text-xs md:text-sm">LIVE</span>
                </div>
              </div>

              {/* Responsive Main Title */}
              <div className="space-y-4 md:space-y-6 xl:space-y-8">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black text-white leading-tight">
                  <span className="inline-block animate-fade-in-up">Revolusi</span>
                  <br />
                  <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x inline-block">Masa Depan</span>
                  <br />
                  <span className="inline-block animate-fade-in-up delay-200">Karir Anda</span>
                </h1>

                <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-300 leading-relaxed max-w-3xl animate-fade-in-up delay-300">
                  Bergabunglah dengan <span className="font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">25,000+ profesional elite</span> yang telah mengubah hidupnya secara total melalui pembelajaran
                  premium berkelas dunia dari instruktur terbaik global.
                </p>
              </div>

              {/* Responsive CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 pt-6 md:pt-10">
                <Link
                  to="/register"
                  className="group relative inline-flex items-center justify-center px-6 md:px-12 py-4 md:py-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-black text-base md:text-xl rounded-xl md:rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl hover:shadow-purple-500/30 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <RocketLaunchIcon className="mr-2 md:mr-4 w-5 h-5 md:w-7 md:h-7 group-hover:animate-bounce" />
                  <span className="relative">Mulai Revolusi Sekarang</span>
                  <ArrowRightIcon className="ml-2 md:ml-4 w-4 h-4 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform duration-300" />
                </Link>

                <Link
                  to="/course"
                  className="group inline-flex items-center justify-center px-6 md:px-12 py-4 md:py-6 border-2 border-gray-600 hover:border-purple-500 text-gray-300 hover:text-white font-bold text-base md:text-xl rounded-xl md:rounded-2xl transition-all duration-300 transform hover:scale-105 backdrop-blur-2xl hover:bg-purple-500/20 hover:shadow-2xl"
                >
                  <MagnifyingGlassIcon className="mr-2 md:mr-4 w-5 h-5 md:w-6 md:h-6 group-hover:animate-pulse" />
                  <span className="hidden sm:inline">Jelajahi Kursus Premium</span>
                  <span className="sm:hidden">Lihat Kursus</span>
                </Link>
              </div>

              {/* Responsive Trust Indicators */}
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 pt-8 md:pt-12">
                <div className="flex items-center justify-center">
                  <div className="flex -space-x-2 md:-space-x-3">
                    {['👩‍💻', '👨‍💼', '👩‍🎨', '👨‍🚀', '👩‍🔬'].map((emoji, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full border-2 md:border-4 border-white flex items-center justify-center text-sm md:text-xl shadow-2xl transform hover:scale-125 hover:z-10 transition-all duration-300 cursor-pointer"
                      >
                        {emoji}
                      </div>
                    ))}
                    <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-r from-gray-800 to-gray-700 rounded-full border-2 md:border-4 border-white flex items-center justify-center text-white font-black text-xs md:text-sm shadow-2xl">
                      +25K
                    </div>
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start space-x-1 md:space-x-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 md:w-6 md:h-6 text-yellow-400 fill-current animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                    <span className="text-yellow-400 font-black ml-2 md:ml-3 text-lg md:text-2xl">4.9/5</span>
                  </div>
                  <p className="text-sm md:text-base text-gray-400 font-medium">Dipercaya puluhan ribu profesional Indonesia & global</p>
                </div>
              </div>

              {/* Mobile Optimized Benefits Carousel */}
              <div className="mt-8 md:mt-12 p-4 md:p-6 bg-gray-900/50 backdrop-blur-2xl border border-gray-700/50 rounded-xl md:rounded-2xl">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className={`p-2 md:p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg md:rounded-xl`}>
                    {(() => {
                      const IconComponent = benefits[currentBenefit].icon;
                      return <IconComponent className={`w-5 h-5 md:w-6 md:h-6 ${benefits[currentBenefit].color}`} />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-base md:text-lg">{benefits[currentBenefit].title}</h4>
                    <p className="text-gray-400 text-xs md:text-sm">{benefits[currentBenefit].desc}</p>
                  </div>
                </div>
                <div className="flex justify-center space-x-2 mt-3 md:mt-4">
                  {benefits.map((_, index) => (
                    <div key={index} className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300 ${index === currentBenefit ? 'bg-indigo-500 scale-125' : 'bg-gray-600'}`}></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Content - Mobile Optimized */}
            <div className={`space-y-6 md:space-y-8 xl:space-y-10 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              {/* Responsive Stats Grid */}
              <div className="grid grid-cols-2 gap-3 md:gap-6">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className={`relative group p-4 md:p-6 xl:p-8 bg-gray-900/70 backdrop-blur-2xl border border-gray-700/50 rounded-2xl md:rounded-3xl transition-all duration-500 hover:scale-105 hover:bg-gray-800/70 cursor-pointer ${
                      currentStat === index ? 'ring-2 ring-indigo-500 scale-105 shadow-2xl shadow-indigo-500/30' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                      <stat.icon className={`w-6 h-6 md:w-8 md:h-8 xl:w-10 xl:h-10 ${stat.color} group-hover:animate-pulse`} />
                      <div className="flex flex-col items-end">
                        <div className="w-2 h-2 md:w-3 md:h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs md:text-xs text-green-400 font-bold mt-1">{stat.growth}</span>
                      </div>
                    </div>
                    <div className={`text-2xl md:text-3xl xl:text-4xl font-black ${stat.color} mb-1 md:mb-2 group-hover:scale-110 transition-transform duration-300`}>{stat.number}</div>
                    <div className="text-xs md:text-sm text-gray-400 font-semibold">{stat.label}</div>
                    {currentStat === index && <div className="absolute bottom-0 left-0 w-full h-1 md:h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-b-2xl md:rounded-b-3xl animate-pulse"></div>}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl md:rounded-3xl"></div>
                  </div>
                ))}
              </div>

              {/* Responsive Testimonial Card */}
              <div className="relative p-4 md:p-6 xl:p-8 bg-gray-900/70 backdrop-blur-2xl border border-gray-700/50 rounded-2xl md:rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500">
                <div className="absolute top-3 md:top-4 right-3 md:right-4 flex space-x-1">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <StarIcon key={i} className="w-3 h-3 md:w-4 md:h-4 xl:w-5 xl:h-5 text-yellow-400 fill-current animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>

                <div className="flex items-start space-x-3 md:space-x-4 xl:space-x-6">
                  <div className="text-2xl md:text-3xl xl:text-5xl animate-bounce">{testimonials[currentTestimonial].avatar}</div>
                  <div className="flex-1">
                    <p className="text-gray-300 mb-3 md:mb-4 italic text-sm md:text-base xl:text-lg leading-relaxed font-medium">"{testimonials[currentTestimonial].content}"</p>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 md:gap-0">
                      <div>
                        <div className="font-bold text-white text-sm md:text-base xl:text-lg">{testimonials[currentTestimonial].name}</div>
                        <div className="text-xs md:text-sm text-gray-400">{testimonials[currentTestimonial].role}</div>
                        <div className="text-xs md:text-xs text-indigo-400 font-semibold">{testimonials[currentTestimonial].company}</div>
                      </div>

                      <div className="text-left sm:text-right">
                        <div className="text-green-400 font-black text-sm md:text-base xl:text-lg">{testimonials[currentTestimonial].salary}</div>
                        <div className="text-xs text-gray-500">dalam {testimonials[currentTestimonial].time}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center space-x-2 md:space-x-3 mt-4 md:mt-6">
                  {testimonials.map((_, index) => (
                    <div key={index} className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 cursor-pointer ${index === currentTestimonial ? 'bg-indigo-500 scale-125' : 'bg-gray-600 hover:bg-gray-500'}`}></div>
                  ))}
                </div>
              </div>

              {/* Mobile Optimized Achievement Tracker */}
              <div className="p-4 md:p-6 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 backdrop-blur-2xl border border-emerald-500/30 rounded-xl md:rounded-2xl">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <h4 className="text-white font-bold text-sm md:text-base xl:text-lg">🏆 Pencapaian Terbaru</h4>
                  <div className="px-2 md:px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full animate-pulse">LIVE</div>
                </div>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs">S</div>
                    <div className="flex-1">
                      <p className="text-white text-xs md:text-sm font-medium">Sarah baru saja menyelesaikan "Advanced React Development"</p>
                      <p className="text-gray-400 text-xs">2 menit yang lalu</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">A</div>
                    <div className="flex-1">
                      <p className="text-white text-xs md:text-sm font-medium">Ahmad mendapat pekerjaan baru sebagai Senior Developer</p>
                      <p className="text-gray-400 text-xs">5 menit yang lalu</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Responsive Features Section */}
      <section className="relative z-10 py-12 md:py-20 xl:py-24 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16 xl:mb-20">
            <div className="inline-flex items-center space-x-1 md:space-x-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-4 md:px-6 py-2 md:py-3 mb-6 md:mb-8">
              <SparklesIcon className="w-4 h-4 md:w-5 md:h-5 text-purple-400 animate-pulse" />
              <span className="text-purple-400 font-bold text-xs md:text-sm uppercase tracking-wide">Teknologi Terdepan</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 md:mb-8">
              Mengapa <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">EduNova</span>
              <br />
              Menjadi Pilihan Terbaik?
            </h2>
            <p className="text-base md:text-xl xl:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Platform pembelajaran revolusioner dengan teknologi AI terdepan dan metode pembelajaran yang telah terbukti mengakselerasi karir lebih dari 25,000 profesional Indonesia
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 xl:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative p-6 md:p-8 xl:p-10 bg-gray-900/60 backdrop-blur-2xl border ${
                  feature.borderColor
                } rounded-2xl md:rounded-3xl transition-all duration-500 hover:scale-105 hover:bg-gray-800/70 transform cursor-pointer ${feature.glowColor} hover:shadow-3xl ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Premium Badge */}
                <div className="absolute top-3 md:top-4 right-3 md:right-4">
                  <div className={`px-2 md:px-3 py-1 ${feature.badgeColor} backdrop-blur-sm rounded-full text-xs font-bold uppercase`}>{feature.badge}</div>
                </div>

                <div className={`relative p-4 md:p-6 ${feature.color} rounded-2xl md:rounded-3xl backdrop-blur-sm border ${feature.borderColor} mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-300 overflow-hidden`}>
                  <feature.icon className={`w-6 h-6 md:w-8 md:h-8 xl:w-10 xl:h-10 ${feature.iconColor} group-hover:animate-pulse relative z-10`} />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/15 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-2xl md:rounded-3xl"></div>
                </div>

                <h3 className="text-lg md:text-xl xl:text-2xl font-black text-white mb-3 md:mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm md:text-base">{feature.desc}</p>

                <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl md:rounded-3xl"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Responsive Course Categories */}
      <section className="relative z-10 py-12 md:py-20 xl:py-24 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16 xl:mb-20">
            <div className="inline-flex items-center space-x-1 md:space-x-2 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 backdrop-blur-sm border border-emerald-500/30 rounded-full px-4 md:px-6 py-2 md:py-3 mb-6 md:mb-8">
              <ChartBarIcon className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-bold text-xs md:text-sm uppercase tracking-wide">Karir Masa Depan</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 md:mb-8">
              Bidang Keahlian <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">Terpopuler</span>
            </h2>
            <p className="text-base md:text-xl xl:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Jelajahi berbagai bidang keahlian yang paling diminati oleh industri global dan teknologi masa depan dengan potensi gaji hingga puluhan juta rupiah
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 xl:gap-8">
            {courseCategories.map((category, index) => (
              <div
                key={index}
                className="group relative p-6 md:p-8 xl:p-10 bg-gray-900/60 backdrop-blur-2xl border border-gray-700/50 rounded-2xl md:rounded-3xl transition-all duration-500 hover:scale-105 hover:bg-gray-800/70 cursor-pointer hover:shadow-3xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-15 transition-opacity duration-300 rounded-2xl md:rounded-3xl`}></div>

                <div className="relative">
                  <div className="flex items-start justify-between mb-4 md:mb-6">
                    <div className={`p-3 md:p-4 bg-gradient-to-r ${category.color} rounded-xl md:rounded-2xl mr-3 md:mr-4 group-hover:scale-110 transition-transform duration-300 shadow-2xl`}>
                      <category.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-lg md:text-xl xl:text-2xl font-black text-green-400">{category.salary}</div>
                      <div className="text-xs text-gray-500 font-medium">rata-rata gaji</div>
                    </div>
                  </div>

                  <h3 className="text-lg md:text-xl xl:text-2xl font-black text-white mb-2 md:mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                    {category.name}
                  </h3>

                  <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-gray-400">Kursus Tersedia</span>
                      <span className="text-white font-bold">{category.count}</span>
                    </div>
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-gray-400">Siswa Aktif</span>
                      <span className="text-purple-400 font-bold">{category.students}</span>
                    </div>
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-gray-400">Level</span>
                      <span className="text-yellow-400 font-bold">{category.level}</span>
                    </div>
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-gray-400">Durasi</span>
                      <span className="text-cyan-400 font-bold">{category.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center text-indigo-400 font-bold text-sm md:text-base xl:text-lg group-hover:text-white transition-colors duration-300">
                    <span>Mulai Belajar Sekarang</span>
                    <ArrowRightIcon className="w-4 h-4 md:w-5 md:h-5 ml-2 md:ml-3 group-hover:translate-x-3 transition-transform duration-300" />
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl md:rounded-3xl"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Responsive CTA Section */}
      <section className="relative z-10 py-12 md:py-20 xl:py-24 px-4 lg:px-8">
        <div className="max-w-4xl xl:max-w-5xl mx-auto text-center">
          <div className="relative p-8 md:p-12 xl:p-16 bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-pink-600/30 backdrop-blur-2xl border border-gray-700/50 rounded-2xl md:rounded-3xl xl:rounded-[3rem] shadow-3xl overflow-hidden">
            {/* Enhanced Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10 rounded-2xl md:rounded-3xl xl:rounded-[3rem] animate-pulse"></div>
            <div className="absolute top-0 left-0 w-full h-1 md:h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-2xl md:rounded-t-3xl xl:rounded-t-[3rem]"></div>

            <div className="relative">
              <div className="mb-6 md:mb-8 xl:mb-10">
                <div className="inline-flex items-center space-x-2 md:space-x-3 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 backdrop-blur-sm border border-yellow-500/40 rounded-xl md:rounded-2xl px-4 md:px-6 xl:px-8 py-2 md:py-3 xl:py-4 mb-6 md:mb-8 animate-bounce">
                  <SparklesIcon className="w-4 h-4 md:w-5 md:h-5 xl:w-6 xl:h-6 text-yellow-400 animate-spin" />
                  <span className="text-yellow-400 font-black text-xs md:text-sm xl:text-lg uppercase tracking-wide">⚡ Penawaran Terbatas Hari Ini</span>
                  <div className="px-2 md:px-3 py-1 bg-red-500 text-white text-xs font-black rounded-full animate-pulse">HANYA 24 JAM</div>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-6 md:mb-8 leading-tight">
                  Siap Mengubah Hidup
                  <br />
                  <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent animate-gradient-x">Secara Total?</span>
                </h2>

                <p className="text-base md:text-xl xl:text-2xl text-gray-300 mb-6 md:mb-8 xl:mb-10 max-w-3xl mx-auto leading-relaxed">
                  Bergabunglah sekarang dan dapatkan akses ke <span className="text-white font-black">750+ kursus premium</span> dengan
                  <span className="text-yellow-400 font-black animate-pulse"> diskon 70%</span> + <span className="text-green-400 font-black">garansi kerja 100%</span>
                  untuk 100 pendaftar pertama hari ini!
                </p>

                {/* Responsive Countdown Timer */}
                <div className="flex justify-center space-x-2 md:space-x-4 mb-6 md:mb-8">
                  {['23', '59', '47'].map((time, index) => (
                    <div key={index} className="text-center">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg md:rounded-xl flex items-center justify-center text-white font-black text-base md:text-xl animate-pulse">{time}</div>
                      <div className="text-xs text-gray-400 mt-1 font-medium">{index === 0 ? 'JAM' : index === 1 ? 'MENIT' : 'DETIK'}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mb-6 md:mb-8 xl:mb-10">
                <Link
                  to="/register"
                  className="group relative inline-flex items-center justify-center px-8 md:px-12 xl:px-16 py-4 md:py-6 xl:py-8 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 text-white font-black text-base md:text-xl xl:text-2xl rounded-2xl md:rounded-3xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl hover:shadow-orange-500/30 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <TrophyIcon className="mr-2 md:mr-4 w-6 h-6 md:w-7 md:h-7 xl:w-8 xl:h-8 animate-bounce" />
                  <span className="relative">Daftar Sekarang</span>
                  <div className="ml-2 md:ml-3 px-3 md:px-4 py-1 md:py-2 bg-red-600 text-sm md:text-base rounded-full animate-pulse shadow-lg">GRATIS</div>
                </Link>

                <Link
                  to="/course"
                  className="group inline-flex items-center justify-center px-8 md:px-12 xl:px-16 py-4 md:py-6 xl:py-8 border-2 md:border-3 border-gray-600 hover:border-orange-500 text-gray-300 hover:text-white font-black text-base md:text-xl xl:text-2xl rounded-2xl md:rounded-3xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm hover:bg-orange-500/20"
                >
                  <EyeIcon className="mr-2 md:mr-4 w-6 h-6 md:w-7 md:h-7 xl:w-8 xl:h-8 group-hover:animate-pulse" />
                  <span className="hidden sm:inline">Lihat Semua Kursus</span>
                  <span className="sm:hidden">Lihat Kursus</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 text-xs md:text-sm text-gray-400 max-w-3xl mx-auto">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-400" />
                  <span>✅ Tanpa biaya tersembunyi</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-400" />
                  <span>✅ Garansi uang kembali 30 hari</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-400" />
                  <span>✅ Sertifikat internasional</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-16 px-4 lg:px-8 bg-gray-900/40 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="relative p-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl">
                <AcademicCapIcon className="h-10 w-10 text-white" />
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse shadow-lg"></div>
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-black text-white">EduNova</span>
                  <div className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-black rounded-full">PREMIUM</div>
                </div>
                <div className="text-sm text-gray-400 font-medium">Platform Pembelajaran #1 Indonesia</div>
              </div>
            </div>

            <p className="text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">Bergabunglah dengan kami dan tingkatkan keterampilan Anda ke level selanjutnya dengan kursus-kursus terbaik dari para ahli industri.</p>

            <div className="flex justify-center space-x-12 text-gray-400 mb-12 text-lg">
              <Link to="/privacy" className="hover:text-white transition-colors duration-300 relative group font-semibold">
                Kebijakan Privasi
                <div className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300 rounded-full"></div>
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors duration-300 relative group font-semibold">
                Syarat & Ketentuan
                <div className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300 rounded-full"></div>
              </Link>
              <Link to="/contact" className="hover:text-white transition-colors duration-300 relative group font-semibold">
                Hubungi Kami
                <div className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300 rounded-full"></div>
              </Link>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-lg">&copy; 2025 EduNova Indonesia "RizkiGroups ". Project iseng semoga tetap keep up to date.</p>
            <p className="text-gray-600 text-sm mt-2">Dibuat dengan ❤️ untuk masa depan pendidikan Indonesia</p>
          </div>
        </div>
      </footer>

      <style>{`
        .animate-spin-slow {
          animation: spin 30s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-15px) rotate(5deg); }
          50% { transform: translateY(-25px) rotate(0deg); }
          75% { transform: translateY(-15px) rotate(-5deg); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 1.2s ease-out forwards;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-gradient-x {
          animation: gradient-x 4s ease infinite;
          background-size: 300% 300%;
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
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
        .hover\:shadow-3xl:hover {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.4);
        }
      `}</style>
    </main>
  );
}
