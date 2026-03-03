'use client';
import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  { src: '/ad1.jpg', alt: 'Advertisement 1' },
  { src: '/ad2.jpg', alt: 'Advertisement 2' },
  { src: '/ad3.jpg', alt: 'Advertisement 3' },
  { src: '/ad4.jpg', alt: 'Advertisement 4' },
  { src: '/ad5.jpg', alt: 'Advertisement 5' },
];

export default function Contact() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* 16:9 Slideshow - Reduced height for desktop */}
      <div className="relative w-full max-w-6xl mx-auto">
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <div className="absolute inset-0 bg-gray-900 rounded-lg overflow-hidden">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 md:p-3 rounded-full transition-all duration-300 z-10"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 md:p-3 rounded-full transition-all duration-300 z-10"
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-white w-8'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Get in Touch Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
          Contact Us
        </h1>
        <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Get in touch with us for any inquiries about our services, products, or partnerships.
        </p>
        
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a 
              href="https://www.google.com/maps/search/S1+RBS+Complex+Near+Chennai+Mobiles+Dharapuram+Road+Tirupur" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center text-center gap-4 hover:bg-gray-50 p-6 rounded-xl transition-all duration-300 cursor-pointer border border-gray-200 hover:border-blue-300 hover:shadow-lg"
            >
              <div className="bg-blue-100 p-4 rounded-full text-blue-600">
                <MapPin size={32} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">Address</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  KNIT INFO, S1 RBS Complex<br />
                  Near Chennai Mobiles<br />
                  Dharapuram Road<br />
                  Tirupur - 4
                </p>
              </div>
            </a>
            
            <a 
              href="tel:+919943632229"
              className="flex flex-col items-center text-center gap-4 hover:bg-gray-50 p-6 rounded-xl transition-all duration-300 cursor-pointer border border-gray-200 hover:border-blue-300 hover:shadow-lg"
            >
              <div className="bg-blue-100 p-4 rounded-full text-blue-600">
                <Phone size={32} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">Phone</h3>
                <p className="text-gray-600 text-lg font-medium">9943632229</p>
              </div>
            </a>
            
            <a 
              href="mailto:knitinfo.in@gmail.com"
              className="flex flex-col items-center text-center gap-4 hover:bg-gray-50 p-6 rounded-xl transition-all duration-300 cursor-pointer border border-gray-200 hover:border-blue-300 hover:shadow-lg"
            >
              <div className="bg-blue-100 p-4 rounded-full text-blue-600">
                <Mail size={32} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">Email</h3>
                <p className="text-gray-600 text-sm break-all">knitinfo.in@gmail.com</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
