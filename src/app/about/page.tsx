'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function About() {
  const [activeStory, setActiveStory] = useState(0);

  const stories = [
    {
      year: "2007",
      month: "April",
      title: "The Beginning",
      subtitle: "Knit Info Launched",
      description: "Our journey began when Knit Info was launched by EX.M.L.A, with a vision to revolutionize the textile industry's information exchange.",
      details: "Starting as a simple directory, we aimed to bridge the gap between suppliers and manufacturers in the knitwear industry.",
      icon: "🚀",
      color: "from-blue-500 to-blue-600"
    },
    {
      year: "2008",
      month: "June",
      title: "Expansion",
      subtitle: "Office Opening",
      description: "A significant milestone was achieved when our office was officially opened by the Head of Tripur Garments.",
      details: "This marked our transition from a startup to an established business entity, ready to serve the industry better.",
      icon: "🏢",
      color: "from-green-500 to-green-600"
    },
    {
      year: "2010",
      month: "March",
      title: "Recognition",
      subtitle: "Honourable Meeting",
      description: "We had the privilege of meeting Honourable Dhayanithi Maran Sir M.P, gaining recognition at the highest levels.",
      details: "This meeting opened doors to new opportunities and validated our contribution to the textile industry.",
      icon: "🤝",
      color: "from-purple-500 to-purple-600"
    },
    {
      year: "2015",
      month: "September",
      title: "Digital Evolution",
      subtitle: "Online Platform Launch",
      description: "Embracing the digital age, we launched our comprehensive online platform to reach a global audience.",
      details: "The digital transformation allowed us to serve thousands of businesses worldwide with instant access to information.",
      icon: "💻",
      color: "from-orange-500 to-orange-600"
    },
    {
      year: "2020",
      month: "January",
      title: "Innovation",
      subtitle: "Mobile-First Approach",
      description: "Recognizing the mobile revolution, we redesigned our platform with a mobile-first approach for better accessibility.",
      details: "This strategic move increased our user engagement by 300% and made information accessible anytime, anywhere.",
      icon: "📱",
      color: "from-red-500 to-red-600"
    },
    {
      year: "2024",
      month: "Present",
      title: "Future Ready",
      subtitle: "AI-Powered Directory",
      description: "Today, we continue to innovate with AI-powered features, making business connections smarter and more efficient.",
      details: "Our platform now serves as the most comprehensive textile industry directory, connecting thousands of businesses globally.",
      icon: "🌟",
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 to-blue-700 py-16">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Our Story
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            A journey of innovation, growth, and connecting the textile industry worldwide
          </p>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            About KnitInfo
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Welcome to Knit Info - a powerful and effective platform for advertising suppliers of all kinds of products, processes & services to the knitwear industry. We facilitate information exchange and provide links to various services relevant to this industry.
            </p>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              As an effective sourcing tool for various textile industry requirements, we bridge the gap between suppliers and manufacturers worldwide.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Available both as a printed directory and an online digital portal, Knit Info ensures easy access to information and greater reach among the business community.
            </p>
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-full text-lg font-semibold">
              <span>🔍</span>
              <span>Discover</span>
              <span>•</span>
              <span>📚</span>
              <span>Learn</span>
              <span>•</span>
              <span>🤝</span>
              <span>Connect</span>
              <span>•</span>
              <span>📈</span>
              <span>Grow</span>
            </div>
          </div>
        </div>

        {/* Interactive Timeline */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            Our Journey Through Time
          </h2>
          
          {/* Timeline Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {stories.map((story, index) => (
              <button
                key={index}
                onClick={() => setActiveStory(index)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeStory === index
                    ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-200'
                }`}
              >
                {story.year}
              </button>
            ))}
          </div>

          {/* Active Story Display */}
          <div className="max-w-4xl mx-auto">
            <div className={`bg-gradient-to-r ${stories[activeStory].color} rounded-2xl p-8 text-white shadow-2xl transform transition-all duration-500`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{stories[activeStory].icon}</div>
                  <div>
                    <div className="text-sm opacity-90">{stories[activeStory].month}</div>
                    <div className="text-3xl font-bold">{stories[activeStory].year}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm opacity-90">Chapter {activeStory + 1}</div>
                  <div className="text-xl font-semibold">{stories[activeStory].title}</div>
                </div>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                {stories[activeStory].subtitle}
              </h3>
              
              <p className="text-lg mb-4 opacity-95">
                {stories[activeStory].description}
              </p>
              
              <p className="text-base opacity-90 leading-relaxed">
                {stories[activeStory].details}
              </p>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={() => setActiveStory(activeStory > 0 ? activeStory - 1 : stories.length - 1)}
              className="bg-white text-gray-600 hover:text-blue-600 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setActiveStory(activeStory < stories.length - 1 ? activeStory + 1 : 0)}
              className="bg-white text-gray-600 hover:text-blue-600 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Timeline Overview */}
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Complete Timeline</h3>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-500 to-blue-600 h-full rounded-full"></div>
            
            {/* Timeline Items */}
            <div className="space-y-12">
              {stories.map((story, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                         onClick={() => setActiveStory(index)}>
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">{story.icon}</span>
                        <div>
                          <div className="text-sm text-gray-500">{story.month} {story.year}</div>
                          <div className="font-semibold text-gray-900">{story.title}</div>
                        </div>
                      </div>
                      <h4 className="font-bold text-lg text-gray-900 mb-2">{story.subtitle}</h4>
                      <p className="text-gray-600 text-sm">{story.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className="relative z-10">
                    <div className={`w-6 h-6 bg-gradient-to-r ${story.color} rounded-full border-4 border-white shadow-lg`}></div>
                  </div>
                  
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Join Our Story</h3>
            <p className="text-lg mb-6 opacity-95">
              Be part of the next chapter in textile industry innovation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300">
                Contact Us
              </Link>
              <Link href="/catalogue" className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-300">
                Explore Catalogue
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
