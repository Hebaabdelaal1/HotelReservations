import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-sky-800 text-white">

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          

          <div>
            <h3 className="text-2xl font-bold mb-4">Hotel</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Experience luxury and comfort at its finest. Book your perfect stay with us and create unforgettable memories.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-sky-950 rounded-full flex items-center justify-center hover:bg-blue-700 transition">
                <FaFacebookF size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-sky-950 rounded-full flex items-center justify-center hover:bg-blue-700 transition">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-sky-950 rounded-full flex items-center justify-center hover:bg-blue-700 transition">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-sky-950 rounded-full flex items-center justify-center hover:bg-blue-700 transition">
                <FaLinkedinIn size={18} />
              </a>
            </div>
          </div>

 
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-blue-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/reservations" className="text-gray-300 hover:text-blue-400 transition">
                  Reservations
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-blue-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-blue-400 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>


          <div>
            <h4 className="text-lg font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="hover:text-blue-400 transition cursor-pointer">Room Booking</li>
              <li className="hover:text-blue-400 transition cursor-pointer">Restaurant</li>
              <li className="hover:text-blue-400 transition cursor-pointer">Spa & Wellness</li>
              <li className="hover:text-blue-400 transition cursor-pointer">Event Hosting</li>
              <li className="hover:text-blue-400 transition cursor-pointer">Airport Shuttle</li>
            </ul>
          </div>


          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-300">
                <MdLocationOn size={20} className="mt-1 flex-shrink-0" />
                <span>123 Luxury Street, Downtown City, NY 10001</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <MdPhone size={20} className="flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <MdEmail size={20} className="flex-shrink-0" />
                <span>info@hotel.com</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Hotel. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-blue-400 transition">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-blue-400 transition">
                Terms of Service
              </Link>
              <Link to="/faq" className="text-gray-400 hover:text-blue-400 transition">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}