'use client';
import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-green-50 min-h-screen">
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
              href="https://www.google.com/maps/search/Winner+Traders+51+RPS+Complex+KSC+School+Road+Dharapuram+Road+Tirupur" 
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
                  N.Mohanraj (Knit Info)<br />
                  Winner Traders<br />
                  51, RPS Complex, KSC School Road<br />
                  Near Shri Paper Mart<br />
                  Dharapuram Road<br />
                  Tirupur - 641 604
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
