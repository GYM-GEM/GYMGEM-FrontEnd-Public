import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Send,
  Mail,
  MapPin,
  Phone
} from "lucide-react";
import { FaGem } from "react-icons/fa";

function Footer() {
  const [userProfileType, setUserProfileType] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Get user profile type from localStorage
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        setIsLoggedIn(true);
        // Find the current active profile from the profiles array
        if (userData.profiles && userData.current_profile) {
          const currentProfileId = userData.current_profile;
          const activeProfile = userData.profiles.find(p => p.id === currentProfileId);
          if (activeProfile) {
            setUserProfileType(activeProfile.type?.toLowerCase());
          }
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // Define links based on profile type
  const getExploreLinks = () => {
    if (userProfileType === "trainer") {
      return [
        { label: "My Courses", path: "/trainer/courses" },
        { label: "Community", path: "/community" },
        { label: "Store", path: "/stores" },
        { label: "About", path: "/about" }
      ];
    } else {
      // For trainees and guests
      return [
        { label: "Courses", path: "/courses" },
        { label: "Trainers", path: "/trainers" },
        { label: "Store", path: "/stores" },
        { label: "Community", path: "/community" }
      ];
    }
  };

  const supportLinks = [
    { label: "About Us", path: "/about" },
    { label: "Terms of Service", path: "/terms" },
    { label: "Privacy Policy", path: "/privacy" },
    { label: "Contact Us", path: "/contact" }
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 pt-16 pb-8 text-gray-300 w-full">
      <div className="mx-auto w-[85%] max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-4 md:grid-cols-2">

          {/* Brand Column */}
          <div className="space-y-6 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-white group">
              <FaGem className="text-2xl text-orange-500 group-hover:text-orange-400 transition-colors" />
              <span className="font-bebas text-3xl tracking-wide">GYMGEM</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
              Your all-in-one fitness ecosystem connecting trainers, trainees, and fitness enthusiasts worldwide.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Mail size={16} className="text-orange-500" />
                <span>support@gymgem.com</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Phone size={16} className="text-orange-500" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {[
                { Icon: Facebook, href: "#" },
                { Icon: Twitter, href: "#" },
                { Icon: Instagram, href: "#" },
                { Icon: Youtube, href: "#" }
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="text-gray-400 hover:text-orange-500 transition-colors p-2 hover:bg-gray-800 rounded-lg"
                  aria-label={`Social link ${i + 1}`}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h3 className="font-bebas text-xl text-white mb-6 tracking-wide flex items-center gap-2">
              <span className="w-1 h-6 bg-orange-500 rounded"></span>
              Explore
            </h3>
            <ul className="space-y-3 text-sm">
              {getExploreLinks().map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="hover:text-orange-500 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-orange-500 group-hover:w-4 transition-all duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-bebas text-xl text-white mb-6 tracking-wide flex items-center gap-2">
              <span className="w-1 h-6 bg-orange-500 rounded"></span>
              Support
            </h3>
            <ul className="space-y-3 text-sm">
              {supportLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="hover:text-orange-500 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-orange-500 group-hover:w-4 transition-all duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bebas text-xl text-white mb-6 tracking-wide flex items-center gap-2">
              <span className="w-1 h-6 bg-orange-500 rounded"></span>
              Stay Updated
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Get fitness tips, exclusive offers, and community updates.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 pr-12 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-gray-500"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-orange-600 rounded-md text-white hover:bg-orange-500 transition-colors active:scale-95">
                <Send size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <p className="text-center md:text-left">
              © {new Date().getFullYear()} GymGem. All rights reserved. Made with 💪 for fitness enthusiasts.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-orange-500 transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-orange-500 transition-colors">Terms</Link>
              <Link to="/cookies" className="hover:text-orange-500 transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
