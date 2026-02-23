import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white md:block hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">KnitInfo</h3>
            <p className="text-gray-400 text-sm">
              Our directory is a powerful and effective platform for advertising for suppliers of all kinds of products, process & services to the knitwear industry.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/catalogue" className="hover:text-white transition-colors">Catalogue</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/advertise" className="hover:text-white transition-colors">Advertise with us</Link></li>
              <li><Link href="/add-data" className="hover:text-white transition-colors">Add Your Data</Link></li>
              <li><Link href="/collaborate" className="hover:text-white transition-colors">Collaborate With Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <MapPin size={16} className="shrink-0" />
                <span>123 Textile Street, Yarn City, NY</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="shrink-0" />
                <span>9943632229</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="shrink-0" />
                <span>knitinfo@knitinfo.com</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram size={24} /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Knit Info. All Rights Reserved. Powered by <a href="https://tcgtech.in" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity font-semibold"><span className="text-red-500">T</span><span className="text-green-500">C</span><span className="text-yellow-500">G</span> <span className="text-blue-500">TECH</span></a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
