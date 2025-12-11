import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Send
} from "lucide-react";
import { FaGem } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-900 pt-16 pb-8 text-gray-300 w-full">
      <div className="mx-auto w-[85%] max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-4 md:grid-cols-2">

          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-white">
              <FaGem className="text-2xl text-orange-500" />
              <span className="font-bebas text-3xl tracking-wide">GYMGEM</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
              The unified ecosystem for fitness professionals and enthusiasts.
              Elevate your journey with clarity, community, and purpose.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bebas text-xl text-white mb-6 tracking-wide">Explore</h3>
            <ul className="space-y-3 text-sm">
              {['Courses', 'Trainers', 'Gyms', 'Store'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-orange-500 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-bebas text-xl text-white mb-6 tracking-wide">Support</h3>
            <ul className="space-y-3 text-sm">
              {['Help Center', 'Terms of Service', 'Privacy Policy', 'Contact Us'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-orange-500 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bebas text-xl text-white mb-6 tracking-wide">Stay Updated</h3>
            <p className="text-sm text-gray-400 mb-4">
              Join our newsletter for the latest tips, ideas, and exclusive offers.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-500"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-orange-600 rounded-md text-white hover:bg-orange-500 transition-colors">
                <Send size={16} />
              </button>
            </div>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} GymGem. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
