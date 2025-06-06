import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { AcademicCapIcon, BookOpenIcon, SparklesIcon, UsersIcon, ArrowRightIcon, ChartBarIcon, LightBulbIcon, FireIcon, TrophyIcon, RocketLaunchIcon, StarIcon, BoltIcon } from '@heroicons/react/24/outline';

export function Welcome() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);

  const stats = [
    { number: '5000+', label: 'Happy Students', color: 'text-indigo-400' },
    { number: '150+', label: 'Premium Courses', color: 'text-blue-400' },
    { number: '99.9%', label: 'Success Rate', color: 'text-green-400' },
    { number: '24/7', label: 'Learning Support', color: 'text-purple-400' },
  ];

  const features = [
    {
      icon: RocketLaunchIcon,
      title: 'AI-Powered Learning',
      desc: 'Smart recommendations',
      color: 'bg-gradient-to-r from-purple-600/20 to-pink-600/20',
      iconColor: 'text-purple-400',
    },
    {
      icon: TrophyIcon,
      title: 'Earn Certificates',
      desc: 'Industry recognized',
      color: 'bg-gradient-to-r from-yellow-600/20 to-orange-600/20',
      iconColor: 'text-yellow-400',
    },
    {
      icon: BoltIcon,
      title: 'Lightning Fast',
      desc: 'Instant access',
      color: 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20',
      iconColor: 'text-cyan-400',
    },
  ];

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const statInterval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 2000);

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(statInterval);
    };
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-indigo-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 rounded-full blur-2xl animate-spin slow"></div>

        {/* Mouse Follow Effect */}
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-indigo-600/5 to-purple-600/5 rounded-full blur-3xl transition-all duration-1000 ease-out pointer-events-none"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        ></div>

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          {/* Left Side - Epic Hero Content */}
          <div className={`text-center lg:text-left space-y-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="space-y-6">
              {/* Epic Badge */}
              <div className="flex items-center justify-center lg:justify-start space-x-3 mb-8">
                <div className="relative p-3 bg-gradient-to-r from-indigo-600/30 to-purple-600/30 rounded-2xl backdrop-blur-sm border border-indigo-500/30">
                  <FireIcon className="w-8 h-8 text-orange-400 animate-bounce" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-orange-400 tracking-wide uppercase animate-pulse">🔥 TRENDING NOW</span>
                  <span className="text-xs text-indigo-300">#1 Learning Platform</span>
                </div>
              </div>

              {/* Epic Title */}
              <h1 className="text-7xl lg:text-8xl font-black text-white leading-none">
                <span className="bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent animate-pulse">Edu</span>
                <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Nova</span>
                <div className="relative inline-block ml-4">
                  <StarIcon className="w-16 h-16 text-yellow-400 animate-spin absolute -top-4 -right-4" />
                </div>
              </h1>

              {/* Epic Subtitle */}
              <div className="space-y-4">
                <p className="text-2xl lg:text-3xl text-gray-200 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-bold">UNLEASH YOUR POTENTIAL</span>
                  <br />
                  Join the learning revolution that's changing lives worldwide!
                </p>
                <p className="text-lg text-indigo-300 font-semibold animate-bounce">🚀 From Zero to Hero in Record Time! 🏆</p>
              </div>
            </div>

            {/* Epic Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center lg:items-start space-y-3 transform transition-all duration-500 hover:scale-110 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className={`p-4 ${feature.color} rounded-2xl backdrop-blur-sm border border-white/10 relative overflow-hidden group`}>
                    <feature.icon className={`w-8 h-8 ${feature.iconColor} group-hover:animate-bounce`} />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </div>
                  <div className="text-center lg:text-left">
                    <h3 className="font-bold text-white text-lg">{feature.title}</h3>
                    <p className="text-sm text-gray-300">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center lg:justify-start space-x-6 pt-6">
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-sm">
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
                <div className="w-10 h-10 bg-gray-800 rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-xs">+5K</div>
              </div>
              <div className="text-left">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-300">Trusted by thousands of students!</p>
              </div>
            </div>
          </div>

          {/* Right Side - Epic Action Center */}
          <div className={`flex flex-col space-y-8 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {/* Main Epic Card */}
            <div className="relative group">
              {/* Glowing Border Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl blur opacity-40 group-hover:opacity-70 transition duration-1000 group-hover:duration-200 animate-pulse"></div>

              <div className="relative bg-gray-900/90 backdrop-blur-2xl border border-gray-700/50 rounded-3xl p-10 shadow-2xl">
                <div className="text-center space-y-8">
                  {/* Epic Icon */}
                  <div className="relative flex justify-center">
                    <div className="p-6 bg-gradient-to-r from-indigo-600/30 to-purple-600/30 rounded-full backdrop-blur-sm border border-indigo-500/30">
                      <RocketLaunchIcon className="w-16 h-16 text-indigo-400 animate-bounce" />
                    </div>
                    <div className="absolute -top-2 -right-2 animate-ping">
                      <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                    </div>
                  </div>

                  {/* Epic CTA */}
                  <div className="space-y-4">
                    <h2 className="text-3xl font-black text-white">
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">READY TO DOMINATE?</span>
                    </h2>
                    <p className="text-gray-300 text-lg">
                      Join the elite community of learners and
                      <span className="text-green-400 font-bold"> TRANSFORM YOUR FUTURE</span> today!
                    </p>
                  </div>

                  {/* Epic Buttons */}
                  <div className="space-y-4">
                    <Link
                      to="/login"
                      className="group relative w-full inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-black text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      <BoltIcon className="mr-3 w-6 h-6 animate-pulse" />
                      <span>LAUNCH MY JOURNEY</span>
                      <ArrowRightIcon className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                    </Link>

                    <Link
                      to="/register"
                      className="group relative w-full inline-flex items-center justify-center px-10 py-5 bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-sm text-white font-bold text-lg rounded-2xl border-2 border-gray-600 hover:border-indigo-500 transition-all duration-300 transform hover:scale-105 hover:shadow-xl overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 to-indigo-600/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                      <SparklesIcon className="mr-3 w-6 h-6" />
                      <span>CREATE ACCOUNT FREE</span>
                      <span className="ml-2 px-2 py-1 bg-green-500 text-xs rounded-full animate-pulse">FREE</span>
                    </Link>

                    <Link
                      to="/course"
                      className="group relative w-full inline-flex items-center justify-center px-10 py-4 border-2 border-gray-600 hover:border-purple-500 text-gray-300 hover:text-white font-semibold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                    >
                      <BookOpenIcon className="mr-3 w-6 h-6" />
                      <span>EXPLORE COURSES</span>
                      <div className="ml-2 px-2 py-1 bg-orange-500/80 text-xs rounded-full animate-bounce">HOT</div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Epic Stats */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`text-center p-6 bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-700/50 transform transition-all duration-500 hover:scale-110 hover:bg-gray-700/60 ${
                    currentStat === index ? 'ring-2 ring-indigo-500 scale-105' : ''
                  }`}
                >
                  <div className={`text-3xl font-black ${stat.color} mb-2`}>{stat.number}</div>
                  <div className="text-xs text-gray-400 font-semibold">{stat.label}</div>
                  {currentStat === index && (
                    <div className="mt-2">
                      <div className="w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Limited Time Offer */}
            <div className="relative p-6 bg-gradient-to-r from-red-600/20 to-orange-600/20 backdrop-blur-sm rounded-2xl border border-red-500/30">
              <div className="absolute -top-2 -right-2">
                <div className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">LIMITED TIME</div>
              </div>
              <div className="text-center">
                <p className="text-yellow-300 font-bold text-lg">🎉 SPECIAL LAUNCH OFFER!</p>
                <p className="text-gray-300 text-sm mt-1">Get 50% OFF on all premium courses this week!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Epic Bottom Elements */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20 fill-gradient-to-r from-gray-800/50 to-purple-800/50">
          <path d="M0,60 C200,20 400,100 600,60 C800,20 1000,100 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>

      {/* Epic Floating Elements */}
      <div className="absolute top-20 left-20 animate-bounce delay-1000">
        <div className="p-4 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-full backdrop-blur-sm border border-yellow-500/30">
          <TrophyIcon className="w-8 h-8 text-yellow-400" />
        </div>
      </div>
      <div className="absolute bottom-32 right-20 animate-bounce delay-2000">
        <div className="p-4 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full backdrop-blur-sm border border-indigo-500/30">
          <RocketLaunchIcon className="w-8 h-8 text-indigo-400" />
        </div>
      </div>
      <div className="absolute top-1/2 right-10 animate-pulse">
        <div className="p-3 bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-full backdrop-blur-sm">
          <StarIcon className="w-6 h-6 text-pink-400" />
        </div>
      </div>

      <style>{`
        .animate-spin.slow {
          animation: spin 20s linear infinite;
        }
        @keyframes spin {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
      `}</style>
    </main>
  );
}
