'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Rocket, Building2, Handshake, Monitor, Smartphone, Sparkles, Search, TrendingUp, Users } from 'lucide-react';

export default function About() {
  const [activeStory, setActiveStory] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stories = [
    {
      year: "2007",
      month: "April",
      title: "The Beginning",
      subtitle: "Knit Info Launched",
      description: "Our journey began when Knit Info was launched by EX.M.L.A",
      mobileDescription: "Launched by EX.M.L.A",
      details: "Starting as a simple directory to bridge the gap in knitwear industry.",
      mobileDetails: "Simple directory for knitwear industry",
      icon: Rocket,
      color: "from-blue-500 to-blue-600"
    },
    {
      year: "2008",
      month: "June",
      title: "Expansion",
      subtitle: "Office Opening",
      description: "Office opened by Head of Tripur Garments",
      mobileDescription: "Office opened by Tripur Garments",
      details: "Transition from startup to established business entity.",
      mobileDetails: "Became established business",
      icon: Building2,
      color: "from-green-500 to-green-600"
    },
    {
      year: "2010",
      month: "March",
      title: "Recognition",
      subtitle: "Honourable Meeting",
      description: "Met Honourable Dhayanithi Maran Sir M.P",
      mobileDescription: "Met Hon. Dhayanithi Maran M.P",
      details: "Recognition at highest levels, opening new opportunities.",
      mobileDetails: "Gained industry recognition",
      icon: Handshake,
      color: "from-purple-500 to-purple-600"
    },
    {
      year: "2015",
      month: "September",
      title: "Digital Evolution",
      subtitle: "Online Platform",
      description: "Launched comprehensive online platform",
      mobileDescription: "Launched online platform",
      details: "Digital transformation for global reach.",
      mobileDetails: "Went digital globally",
      icon: Monitor,
      color: "from-orange-500 to-orange-600"
    },
    {
      year: "2020",
      month: "January",
      title: "Innovation",
      subtitle: "Mobile-First",
      description: "Redesigned with mobile-first approach",
      mobileDescription: "Mobile-first redesign",
      details: "300% increase in user engagement.",
      mobileDetails: "300% more engagement",
      icon: Smartphone,
      color: "from-red-500 to-red-600"
    },
    {
      year: "2024",
      month: "Present",
      title: "Future Ready",
      subtitle: "AI-Powered",
      description: "AI-powered features for smart connections",
      mobileDescription: "AI-powered platform",
      details: "Most comprehensive textile directory globally.",
      mobileDetails: "Leading textile directory",
      icon: Sparkles,
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden bg-gradient-to-r from-blue-900 to-blue-700 py-16"
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Our Story
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto"
          >
            A journey of innovation, growth, and connecting the textile industry worldwide
          </motion.p>
        </div>
      </motion.div>

      {/* About Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            About KnitInfo
          </motion.h2>
          <div className="max-w-4xl mx-auto">
            <motion.p variants={itemVariants} className="text-lg text-gray-600 mb-6 leading-relaxed">
              Welcome to Knit Info - a powerful and effective platform for advertising suppliers of all kinds of products, processes & services to the knitwear industry.
            </motion.p>
            <motion.p variants={itemVariants} className="text-lg text-gray-600 mb-6 leading-relaxed">
              As an effective sourcing tool for various textile industry requirements, we bridge the gap between suppliers and manufacturers worldwide.
            </motion.p>
            <motion.p variants={itemVariants} className="text-lg text-gray-600 mb-8 leading-relaxed">
              Available both as a printed directory and an online digital portal, Knit Info ensures easy access to information and greater reach.
            </motion.p>
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-full text-lg font-semibold"
            >
              <Search size={20} />
              <span>Discover</span>
              <span>•</span>
              <Users size={20} />
              <span>Connect</span>
              <span>•</span>
              <TrendingUp size={20} />
              <span>Grow</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Interactive Timeline */}
        <div className="mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12"
          >
            Our Journey Through Time
          </motion.h2>
          
          {/* Timeline Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {stories.map((story, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveStory(index)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeStory === index
                    ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-200'
                }`}
              >
                {story.year}
              </motion.button>
            ))}
          </div>

          {/* Active Story Display */}
          <div className="max-w-4xl mx-auto">
            <motion.div 
              key={activeStory}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className={`bg-gradient-to-r ${stories[activeStory].color} rounded-2xl p-4 md:p-8 text-white shadow-2xl`}
            >
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <div className="flex items-center space-x-2 md:space-x-4">
                  <div className="text-2xl md:text-4xl">
                    {(() => {
                      const Icon = stories[activeStory].icon;
                      return <Icon className="w-8 h-8 md:w-12 md:h-12" />;
                    })()}
                  </div>
                  <div>
                    <div className="text-xs md:text-sm opacity-90">{stories[activeStory].month}</div>
                    <div className="text-xl md:text-3xl font-bold">{stories[activeStory].year}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs md:text-sm opacity-90">Chapter {activeStory + 1}</div>
                  <div className="text-sm md:text-xl font-semibold">{stories[activeStory].title}</div>
                </div>
              </div>
              
              <h3 className="text-lg md:text-3xl font-bold mb-2 md:mb-4">
                {stories[activeStory].subtitle}
              </h3>
              
              <p className="text-sm md:text-lg mb-2 md:mb-4 opacity-95">
                <span className="hidden md:inline">{stories[activeStory].description}</span>
                <span className="md:hidden">{stories[activeStory].mobileDescription}</span>
              </p>
              
              <p className="text-xs md:text-base opacity-90 leading-relaxed">
                <span className="hidden md:inline">{stories[activeStory].details}</span>
                <span className="md:hidden">{stories[activeStory].mobileDetails}</span>
              </p>
            </motion.div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-center space-x-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveStory(activeStory > 0 ? activeStory - 1 : stories.length - 1)}
              className="bg-white text-gray-600 hover:text-blue-600 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveStory(activeStory < stories.length - 1 ? activeStory + 1 : 0)}
              className="bg-white text-gray-600 hover:text-blue-600 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Timeline Overview - Mobile Friendly */}
        <div className="bg-white rounded-2xl p-4 md:p-8 shadow-xl">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 text-center mb-6 md:mb-8">Complete Timeline</h3>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 w-0.5 md:w-1 bg-gradient-to-b from-blue-500 to-blue-600 h-full rounded-full"></div>
            
            {/* Timeline Items */}
            <div className="space-y-8 md:space-y-12">
              {stories.map((story, index) => {
                const Icon = story.icon;
                const isLeft = index % 2 === 0;
                
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    {/* Mobile Layout */}
                    <div className="md:hidden w-full pl-10">
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="bg-white border border-gray-200 rounded-xl p-4 shadow-lg transition-all duration-300 cursor-pointer"
                        onClick={() => setActiveStory(index)}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <Icon className="w-5 h-5 text-gray-700" />
                          <div>
                            <div className="text-xs text-gray-500">{story.month} {story.year}</div>
                            <div className="text-sm font-semibold text-gray-900">{story.title}</div>
                          </div>
                        </div>
                        <h4 className="font-bold text-base text-gray-900 mb-1">{story.subtitle}</h4>
                        <p className="text-gray-600 text-xs">{story.mobileDescription}</p>
                      </motion.div>
                      
                      {/* Mobile Timeline Dot */}
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <motion.div 
                          whileHover={{ scale: 1.3 }}
                          className={`w-4 h-4 bg-gradient-to-r ${story.color} rounded-full border-2 border-white shadow-lg`}
                        ></motion.div>
                      </div>
                    </div>

                    {/* Desktop Layout - Alternating Left/Right */}
                    <div className="hidden md:flex md:items-center md:justify-between">
                      {/* Left Side Content (for even index) */}
                      {isLeft && (
                        <div className="w-5/12 pr-8 text-right">
                          <motion.div 
                            whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                            className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg transition-all duration-300 cursor-pointer"
                            onClick={() => setActiveStory(index)}
                          >
                            <div className="flex items-center space-x-3 mb-3 justify-end">
                              <div className="text-right">
                                <div className="text-sm text-gray-500">{story.month} {story.year}</div>
                                <div className="font-semibold text-gray-900">{story.title}</div>
                              </div>
                              <Icon className="w-6 h-6 text-gray-700" />
                            </div>
                            <h4 className="font-bold text-lg text-gray-900 mb-2">{story.subtitle}</h4>
                            <p className="text-gray-600 text-sm">{story.description}</p>
                          </motion.div>
                        </div>
                      )}
                      
                      {/* Empty space for left side when content is on right */}
                      {!isLeft && <div className="w-5/12"></div>}
                      
                      {/* Timeline Dot */}
                      <div className="w-2/12 flex justify-center">
                        <motion.div 
                          whileHover={{ scale: 1.3 }}
                          className={`w-6 h-6 bg-gradient-to-r ${story.color} rounded-full border-4 border-white shadow-lg`}
                        ></motion.div>
                      </div>
                      
                      {/* Empty space for right side when content is on left */}
                      {isLeft && <div className="w-5/12"></div>}
                      
                      {/* Right Side Content (for odd index) */}
                      {!isLeft && (
                        <div className="w-5/12 pl-8 text-left">
                          <motion.div 
                            whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                            className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg transition-all duration-300 cursor-pointer"
                            onClick={() => setActiveStory(index)}
                          >
                            <div className="flex items-center space-x-3 mb-3 justify-start">
                              <Icon className="w-6 h-6 text-gray-700" />
                              <div className="text-left">
                                <div className="text-sm text-gray-500">{story.month} {story.year}</div>
                                <div className="font-semibold text-gray-900">{story.title}</div>
                              </div>
                            </div>
                            <h4 className="font-bold text-lg text-gray-900 mb-2">{story.subtitle}</h4>
                            <p className="text-gray-600 text-sm">{story.description}</p>
                          </motion.div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Join Our Story</h3>
            <p className="text-lg mb-6 opacity-95">
              Be part of the next chapter in textile industry innovation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/contact" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300">
                  Contact Us
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/catalogue" className="inline-block border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-300">
                  Explore Catalogue
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
