'use client';

import {
  Scissors,
  Layers,
  Shirt,
  Users,
  Printer,
  Droplet,
  Settings,
  Wrench,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  User,
  Bell,
  Eye,
  TrendingUp,
  Building2,
  Wind,
  Palette,
  Zap,
  Package,
  Wrench as Spanner,
  FlaskConical
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useVisitorStats } from '@/hooks/useVisitorStats';
import StatCard from '@/components/StatCard';
import { booksAPI, categoriesAPI } from '@/lib/api';

const categories = [
  { name: 'Yarn', icon: Layers, color: 'bg-blue-100 text-blue-600' },
  { name: 'Fabric Suppliers', icon: Shirt, color: 'bg-green-100 text-green-600' },
  { name: 'Knitting', icon: Zap, color: 'bg-purple-100 text-purple-600' },
  { name: 'Buying Agents', icon: Users, color: 'bg-orange-100 text-orange-600' },
  { name: 'Printing', icon: Printer, color: 'bg-yellow-100 text-yellow-600' },
  { name: 'Threads', icon: Wind, color: 'bg-pink-100 text-pink-600' },
  { name: 'Trims & Accessories', icon: Package, color: 'bg-red-100 text-red-600' },
  { name: 'Dyes & Chemicals', icon: FlaskConical, color: 'bg-indigo-100 text-indigo-600' },
  { name: 'Machineries', icon: Settings, color: 'bg-teal-100 text-teal-600' },
  { name: 'Machine Spares', icon: Spanner, color: 'bg-gray-100 text-gray-600' },
];

const stories = [
  { title: 'Knit Info Launched by EX.M.L.A', date: 'April-2007', image: '/s1.jpg' },
  { title: 'Knit Info Office Opened By Tripur Garments Head', date: 'May-2008', image: '/s2.jpg' },
  { title: 'Meeting Honourable Dhayanithi Maran Sir M.P', date: 'June-2009', image: '/s3.jpg' },
];

const slides = [
  { src: '/s1.jpg', alt: 'Slide 1' },
  { src: '/s2.jpg', alt: 'Slide 2' },
  { src: '/s3.jpg', alt: 'Slide 3' },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animationStep, setAnimationStep] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);
  const [books, setBooks] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // Handle loop restart
  useEffect(() => {
    if (animationStep === -1) {
      // Wait for instant reset (or use timeout if we animated the reset)
      // With duration: 0 in the reset, we can switch back to 0 immediately? 
      // No, if duration is 0, it happens instantly.
      // But if we set state -1, then immediately 0, it might batch and skip -1 visual.
      // Framer Motion usually handles this, but a small timeout is safer.
      const timer = setTimeout(() => {
        setAnimationStep(0);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [animationStep]);

  // Visitor statistics
  const { stats, loading: statsLoading } = useVisitorStats();

  // Fetch books and categories
  // Fetch categories from API, use static books data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesRes = await categoriesAPI.getAll();
        setCategories(categoriesRes.categories || []);
        
        // Use static books data from local file
        const { books: staticBooks } = await import('@/data/books');
        setBooks(staticBooks);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to static books if API fails
        import('@/data/books').then(({ books: staticBooks }) => {
          setBooks(staticBooks);
        });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsNavVisible(false);
      } else {
        setIsNavVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwiping(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentTouch = e.targetTouches[0].clientX;
    setTouchEnd(currentTouch);

    if (touchStart !== null) {
      const distance = Math.abs(touchStart - currentTouch);
      if (distance > 5) {
        setIsSwiping(true);
      }
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || !isSwiping) return;

    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      // Swiped left - next slide
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      // Swiped right - previous slide
      prevSlide();
    }

    setTouchStart(null);
    setTouchEnd(null);
    setIsSwiping(false);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Profile Slide Panel */}
      <div className={`md:hidden fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-60 transform transition-transform duration-300 ease-in-out profile-menu ${showProfileMenu ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Menu</h2>
            <button
              onClick={() => setShowProfileMenu(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <span className="text-2xl text-gray-600">×</span>
            </button>
          </div>

          {/* Profile Section */}
          <div className="mb-8 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-[#1e3a8a] rounded-full flex items-center justify-center">
                <User size={32} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Welcome</h3>
                <p className="text-gray-600">Textile Professional</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-4">
            <Link
              href="/advertise"
              onClick={() => setShowProfileMenu(false)}
              className="w-full p-4 text-left hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-4 group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <span className="text-2xl">📢</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Advertise with us</h4>
                <p className="text-sm text-gray-600">Promote your business</p>
              </div>
            </Link>

            <Link
              href="/add-data"
              onClick={() => setShowProfileMenu(false)}
              className="w-full p-4 text-left hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-4 group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Add Your Data</h4>
                <p className="text-sm text-gray-600">Submit your information</p>
              </div>
            </Link>

            <Link
              href="/collaborate"
              onClick={() => setShowProfileMenu(false)}
              className="w-full p-4 text-left hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-4 group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <span className="text-2xl">🤝</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Collaborate With Us</h4>
                <p className="text-sm text-gray-600">Partner with our team</p>
              </div>
            </Link>
          </div>

          {/* Footer */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="text-center text-sm">
              <p className="text-gray-600 mb-1">Powered By</p>
              <a
                href="https://tcgtech.in"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-lg hover:opacity-80 transition-opacity"
              >
                <span className="text-red-600">T</span>
                <span className="text-green-600">C</span>
                <span className="text-yellow-600">G</span>
                <span className="text-blue-600"> TECHNOLOGIES</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {showProfileMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden transition-opacity duration-300"
          onClick={() => setShowProfileMenu(false)}
        ></div>
      )}

      {/* Logo for Mobile View */}
      <div className={`md:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-md px-4 py-3 transition-transform duration-300 ${isNavVisible ? 'translate-y-0' : '-translate-y-full'
        }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleProfileMenu}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
            >
              <User size={24} className="text-gray-700" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
              <Bell size={24} className="text-gray-700" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </button>
          </div>
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={120}
              height={50}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>
        </div>
      </div>

      {/* Spacer for fixed mobile nav */}
      <div className="md:hidden h-[58px]"></div>

      {/* Hero Section with Slideshow */}
      <section
        className="relative h-[300px] md:h-[400px] overflow-hidden select-none"
        style={{ touchAction: 'pan-y pinch-zoom' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="object-cover md:object-contain md:object-center"
              priority={index === 0}
            />
          </div>
        ))}

        {/* Arrow Navigation - Desktop Only */}
        <button
          onClick={prevSlide}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} className="text-gray-800" />
        </button>
        <button
          onClick={nextSlide}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all"
          aria-label="Next slide"
        >
          <ChevronRight size={24} className="text-gray-800" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-20 flex" style={{ gap: '4px' }}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                width: index === currentSlide ? '12px' : '4px',
                height: '4px',
                backgroundColor: index === currentSlide ? 'white' : 'rgba(255, 255, 255, 0.6)',
                borderRadius: '9999px',
                transition: 'all 0.3s',
                border: 'none',
                padding: 0,
                cursor: 'pointer'
              }}
              className="md:!w-2 md:!h-2"
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Books Section */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Physical Books</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {books.map((book, index) => (
              <Link key={index} href={`/books/${book.id}`}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow flex flex-col cursor-pointer">
                  <div className={`h-48 ${book.color} flex items-center justify-center p-6 text-white`}>
                    <BookOpen size={64} opacity={0.8} />
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{book.title}</h3>
                    <p className="text-gray-500 mb-4">{book.edition}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">₹{book.price}</span>
                      <button className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1e3a8a]/90 transition-colors">
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Our Vision Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Empowering the textile industry through innovation, connectivity, and excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Vision Card 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">🌐</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Global Connectivity</h3>
              <p className="text-gray-600 leading-relaxed">
                To create the world&apos;s most comprehensive textile industry network, connecting suppliers, manufacturers, and buyers across continents seamlessly.
              </p>
            </div>

            {/* Vision Card 2 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">💡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Innovation Leadership</h3>
              <p className="text-gray-600 leading-relaxed">
                To pioneer digital transformation in the textile sector, leveraging cutting-edge technology to simplify business operations and enhance productivity.
              </p>
            </div>

            {/* Vision Card 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Trust & Transparency</h3>
              <p className="text-gray-600 leading-relaxed">
                To build a trusted ecosystem where every business transaction is transparent, verified, and mutually beneficial for all stakeholders.
              </p>
            </div>

            {/* Vision Card 4 */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">📈</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Industry Growth</h3>
              <p className="text-gray-600 leading-relaxed">
                To accelerate the growth of textile businesses by providing access to resources, market intelligence, and strategic partnerships.
              </p>
            </div>

            {/* Vision Card 5 */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">🎓</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Knowledge Sharing</h3>
              <p className="text-gray-600 leading-relaxed">
                To become the premier knowledge hub for the textile industry, offering insights, trends, and best practices to empower informed decision-making.
              </p>
            </div>

            {/* Vision Card 6 */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">🌱</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Sustainable Future</h3>
              <p className="text-gray-600 leading-relaxed">
                To promote sustainable practices in the textile industry, supporting eco-friendly businesses and encouraging responsible manufacturing.
              </p>
            </div>
          </div>

          {/* Vision Statement Box */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white text-center shadow-2xl">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Our Commitment</h3>
              <p className="text-lg md:text-xl leading-relaxed opacity-95">
                We envision a future where every textile business, regardless of size or location, has equal access to opportunities, resources, and global markets. Through KnitInfo, we&apos;re not just building a directory – we&apos;re creating a movement that transforms how the textile industry connects, collaborates, and grows together.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm md:text-base">
                <span className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">Innovation</span>
                <span className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">Excellence</span>
                <span className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">Integrity</span>
                <span className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">Growth</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stories Section */}
      {/* Stories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl py-12 shadow-2xl mb-12 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-white mb-8">Our Stories</h2>
        <div className="flex flex-col w-full max-w-2xl items-center">
          {stories.map((story, index) => {
            // Calculate step indices
            // Story 0: step 0
            // Tube 0: step 1
            // Story 1: step 2
            // Tube 1: step 3
            // Story 2: step 4
            const storyStep = index * 2;
            const tubeStep = index * 2 + 1;

            return (
              <div key={index} className="flex flex-col w-full items-center">
                <div className="relative bg-white rounded-xl shadow-lg border-2 border-yellow-200 overflow-hidden group w-full flex flex-col md:flex-row min-h-[200px] z-10">
                  {/* Liquid Filling Animation Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-yellow-300/60 to-yellow-400/60 z-0"
                    initial={{ height: "0%" }}
                    animate={{
                      height: animationStep === -1 ? "0%" :
                        animationStep > storyStep ? "100%" :
                          animationStep === storyStep ? "100%" : "0%"
                    }}
                    transition={{
                      duration: animationStep === -1 ? 0 :
                        animationStep === storyStep ? 3 : 0.5,
                      ease: "linear"
                    }}
                    onAnimationComplete={() => {
                      if (animationStep === storyStep) {
                        if (index === stories.length - 1) {
                          // Reset to -1 to drain all
                          setAnimationStep(-1);
                        } else {
                          setAnimationStep(prev => prev + 1);
                        }
                      }
                    }}
                    style={{ top: 0, bottom: 'auto', width: '100%' }} // Fill top to bottom
                  />

                  {/* Content Container */}
                  <div className="relative z-10 p-6 flex flex-col gap-4 w-full h-full items-center">
                    <div className="relative w-full h-48 rounded-lg overflow-hidden shrink-0 bg-gray-50 border border-gray-100">
                      <Image
                        src={story.image}
                        alt={story.title}
                        fill
                        className="object-contain"
                      />
                    </div>

                    <div className="flex flex-col flex-grow justify-center text-center">
                      <span className="text-sm font-bold text-yellow-600 uppercase tracking-wide mb-2 inline-block">
                        {story.date}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 leading-snug">
                        {story.title}
                      </h3>
                    </div>
                  </div>

                  {/* Border Accent */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400 z-20"></div>
                </div>

                {/* Connecting Tube */}
                {index < stories.length - 1 && (
                  <div className="relative w-4 h-16 bg-gray-700/30 rounded-full my-[-4px] overflow-hidden z-0">
                    <motion.div
                      className="w-full bg-gradient-to-b from-yellow-300 to-yellow-500 shadow-[0_0_15px_rgba(250,204,21,0.9)]"
                      initial={{ height: "0%" }}
                      animate={{
                        height: animationStep === -1 ? "0%" :
                          animationStep > tubeStep ? "100%" :
                            animationStep === tubeStep ? "100%" : "0%"
                      }}
                      transition={{
                        duration: animationStep === -1 ? 0 :
                          animationStep === tubeStep ? 1 : 0,
                        ease: "linear"
                      }}
                      onAnimationComplete={() => {
                        if (animationStep === tubeStep) {
                          setAnimationStep(prev => prev + 1);
                        }
                      }}
                      style={{ top: 0 }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Live Visitor Statistics Section */}
      <section className="bg-gradient-to-br from-[#1e3a8a] via-blue-700 to-indigo-900 text-white py-12 mx-4 sm:mx-6 lg:mx-8 rounded-3xl mb-8 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-900/20"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Live Platform Statistics</h2>
            <p className="text-blue-200 text-lg">Real-time insights into our growing textile community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Live Visitors */}
            <StatCard
              icon={<Eye size={32} />}
              title="LIVE"
              value={stats.liveVisitors}
              subtitle="Active Visitors"
              description="Currently browsing"
              loading={statsLoading}
              isLive={true}
              color="green"
            />

            {/* Total Visitors */}
            <StatCard
              icon={<TrendingUp size={32} />}
              title="ALL TIME"
              value={stats.totalVisitors}
              subtitle="Total Visitors"
              description="Since launch"
              loading={statsLoading}
              color="blue"
            />

            {/* Total Companies */}
            <StatCard
              icon={<Building2 size={32} />}
              title="DATABASE"
              value={stats.totalCompanies}
              subtitle="Companies Listed"
              description="Verified businesses"
              loading={statsLoading}
              color="purple"
            />
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-blue-200">
                Statistics update every 30 seconds
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
