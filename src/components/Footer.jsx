import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Send,
  Mail,
  Phone
} from "lucide-react";
import { FaGem } from "react-icons/fa";

function Footer() {
  const [userProfileType, setUserProfileType] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) return;

    try {
      const userData = JSON.parse(user);
      if (userData?.profiles && userData?.current_profile) {
        const activeProfile = userData.profiles.find(
          p => p.id === userData.current_profile
        );
        setUserProfileType(activeProfile?.type?.toLowerCase() || null);
      }
    } catch {
      // silent fail
    }
  }, []);

  const exploreLinks = useMemo(() => {
    return userProfileType === "trainer"
      ? [
          { label: "My Courses", path: "/trainer/courses" },
          { label: "Community", path: "/community" },
          { label: "Store", path: "/stores" },
          { label: "About", path: "/about" }
        ]
      : [
          { label: "Courses", path: "/courses" },
          { label: "Trainers", path: "/trainers" },
          { label: "Store", path: "/stores" },
          { label: "Community", path: "/community" }
        ];
  }, [userProfileType]);

  const supportLinks = [
    { label: "About Us", path: "/about" },
    { label: "Terms of Service", path: "/terms" },
    { label: "Privacy Policy", path: "/privacy" },
    { label: "Contact Us", path: "/contact" }
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 pt-16 pb-8 text-gray-300 w-full">
      <div className="mx-auto w-[85%] max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 text-white group">
              <FaGem className="text-2xl text-orange-500 group-hover:text-orange-400 transition-colors" />
              <span className="font-bebas text-3xl tracking-wide">GYMGEM</span>
            </Link>

            <p className="text-sm text-gray-400 max-w-xs">
              Your all-in-one fitness ecosystem connecting trainers and trainees worldwide.
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-orange-500" />
                <span>support@gymgem.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-orange-500" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>

            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="p-2 rounded-lg text-gray-400 hover:text-orange-500 hover:bg-gray-800 transition-colors"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-bebas text-xl text-white mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-orange-500 rounded" />
              Explore
            </h3>
            <ul className="space-y-3 text-sm">
              {exploreLinks.map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 hover:text-orange-500 transition-colors group"
                  >
                    <span className="w-0 h-0.5 bg-orange-500 group-hover:w-4 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bebas text-xl text-white mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-orange-500 rounded" />
              Support
            </h3>
            <ul className="space-y-3 text-sm">
              {supportLinks.map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 hover:text-orange-500 transition-colors group"
                  >
                    <span className="w-0 h-0.5 bg-orange-500 group-hover:w-4 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter (UI only) */}
          <div>
            <h3 className="font-bebas text-xl text-white mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-orange-500 rounded" />
              Stay Updated
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Get fitness tips and community updates.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 pr-12 text-sm text-white placeholder:text-gray-500 focus:ring-2 focus:ring-orange-500 outline-none"
              />
              <button
                aria-label="Subscribe"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-orange-600 rounded-md text-white hover:bg-orange-500 transition active:scale-95"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              We respect your privacy.
            </p>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} GymGem. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-orange-500">Privacy</Link>
            <Link to="/terms" className="hover:text-orange-500">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
