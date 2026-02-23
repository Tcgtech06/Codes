'use client';
import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { contactAPI } from '@/lib/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Submit to API
      await contactAPI.submit(formData);
      setSuccess(true);
      
      // Create WhatsApp message
      const whatsappMessage = `*New Contact Form Submission*%0A%0A*Name:* ${formData.name}%0A*Email:* ${formData.email}%0A*Message:* ${formData.message}`;
      const phoneNumber = '919943632229';
      window.open(`https://wa.me/${phoneNumber}?text=${whatsappMessage}`, '_blank');
      
      // Reset form
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Contact Us
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Get in Touch</h2>
            <div className="space-y-6">
              <a 
                href="https://www.google.com/maps/search/123+Textile+Street,+Yarn+City,+NY" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start gap-4 hover:bg-gray-50 p-3 rounded-lg transition-colors cursor-pointer"
              >
                <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Address</h3>
                  <p className="text-gray-600">123 Textile Street, Yarn City, NY</p>
                </div>
              </a>
              
              <a 
                href="tel:+919943632229"
                className="flex items-start gap-4 hover:bg-gray-50 p-3 rounded-lg transition-colors cursor-pointer"
              >
                <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Phone</h3>
                  <p className="text-gray-600">+91 9943632229</p>
                </div>
              </a>
              
              <a 
                href="mailto:knitinfo@knitinfo.com"
                className="flex items-start gap-4 hover:bg-gray-50 p-3 rounded-lg transition-colors cursor-pointer"
              >
                <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Email</h3>
                  <p className="text-gray-600">knitinfo@knitinfo.com</p>
                </div>
              </a>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-gray-50 p-8 rounded-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                  placeholder="Your Name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none h-32" 
                  placeholder="How can we help?"
                  required
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Sending...' : success ? 'Sent!' : 'Send via WhatsApp'}
              </button>
              {success && (
                <p className="text-green-600 text-sm text-center">Message sent successfully!</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
