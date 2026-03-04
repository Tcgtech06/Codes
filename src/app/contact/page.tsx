'use client';
import { useState } from 'react';
import { Mail, Phone, MapPin, X } from 'lucide-react';

export default function Contact() {
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  const phoneNumbers = [
    { number: '9943632229', label: 'Primary' },
    { number: '9843232229', label: 'Secondary' }
  ];

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
                <p className="text-gray-600 text-sm leading-relaxed mt-3 pt-3 border-t border-gray-300">
                  5/381, Edakattu Vayal<br />
                  Nallur Palayam<br />
                  Vadambachery (PO)<br />
                  Coimbatore - 641 669
                </p>
              </div>
            </a>
            
            <button
              onClick={() => setShowPhoneModal(true)}
              className="flex flex-col items-center text-center gap-4 hover:bg-gray-50 p-6 rounded-xl transition-all duration-300 cursor-pointer border border-gray-200 hover:border-blue-300 hover:shadow-lg"
            >
              <div className="bg-blue-100 p-4 rounded-full text-blue-600">
                <Phone size={32} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">Phone</h3>
                <p className="text-gray-600 text-lg font-medium">9943632229 / 9843232229</p>
              </div>
            </button>
            
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

      {/* Phone Number Selection Modal */}
      {showPhoneModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Select Phone Number</h3>
              <button
                onClick={() => setShowPhoneModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4 text-center">Choose a number to call:</p>
              <div className="space-y-3">
                {phoneNumbers.map((phone, index) => (
                  <a
                    key={index}
                    href={`tel:+91${phone.number}`}
                    className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-300 cursor-pointer border border-blue-200 hover:border-blue-400"
                    onClick={() => setShowPhoneModal(false)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-600 p-2 rounded-full">
                        <Phone size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{phone.number}</p>
                        <p className="text-sm text-gray-600">{phone.label}</p>
                      </div>
                    </div>
                    <div className="text-blue-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
