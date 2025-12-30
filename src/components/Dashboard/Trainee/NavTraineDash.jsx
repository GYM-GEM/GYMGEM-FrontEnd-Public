import { useEffect, useState, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { FaGem } from "react-icons/fa";
import { MdOutlineNotificationsActive, MdOutlineMessage, MdKeyboardArrowDown } from "react-icons/md";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../../context/ToastContext";
import axiosInstance from "../../../utils/axiosConfig";
import UserDropdown from "../../UserDropdown";
import { ClipboardList, Calendar, Heart, MessageSquare, Settings } from "lucide-react"; // Import new icons
import NotificationDropdown from "../../NotificationDropdown";
import GemsBadge from "../../GemsBadge";
import AddGemsModal from "../../AddGemsModal";
import getBalance from "../../../utils/balance";

const NavTraineDash = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activityDropdownOpen, setActivityDropdownOpen] = useState(false);
  const userRef = useRef(null);
  const activityRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  // Main Navigation Links
  const mainLinks = [
    { to: "/trainee", label: "Profile" },
    { to: "/trainee/courses", label: "Courses" },
    // { to: "/trainee/calendar", label: "Calendar", icon: <Calendar size={18} /> },
    { to: "/trainee/message", label: "Messages", icon: <MessageSquare size={18} /> },
    { to: "/trainee/settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  // Activity Dropdown Links
  const activityLinks = [
    { to: "/trainee/sessions", label: "My Sessions", icon: <Calendar size={18} /> },
    { to: "/trainee/myorder", label: "My Orders", icon: <ClipboardList size={18} /> },
    { to: "/trainee/favorite", label: "Favorites", icon: <Heart size={18} /> },
  ];

  const [showFullName, setShowFullName] = useState(false);
  const [showGG, setShowGG] = useState(true);

  const [gemsBalance, setGemsBalance] = useState(() => {
    const saved = localStorage.getItem("gems_balance");
    return saved ? parseInt(saved, 10) : null;
  });
  const [isAddGemsModalOpen, setIsAddGemsModalOpen] = useState(false);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!localStorage.getItem("gems_balance")) {
        setIsLoadingBalance(true);
      }
      const balance = await getBalance();
      if (balance !== null) setGemsBalance(balance);
      setIsLoadingBalance(false);
    };

    fetchBalance();

    const handleStorageChange = () => {
      const saved = localStorage.getItem("gems_balance");
      if (saved) setGemsBalance(parseInt(saved, 10));
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('gemsUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('gemsUpdated', handleStorageChange);
    };
  }, []);

  const handleAddGems = (pkg) => {
    setIsAddGemsModalOpen(false);
    navigate('/checkout', {
      state: {
        type: 'gems',
        gems: pkg.gems,
        price: pkg.price,
        user: user
      }
    });
  };

  // Logout function
  const logout = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('refresh');
    try {
      await axiosInstance.post(
        "/api/auth/logout",
        {},
        {
          headers: { refresh: token },
        }
      );

      localStorage.clear();

      showToast("Logout successful!", { type: "success" });
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      localStorage.clear();
      showToast("Logged out", { type: "info" });
      navigate("/login");
    }
  };

  // Click outside handler for menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (activityRef.current && !activityRef.current.contains(event.target)) {
        setActivityDropdownOpen(false);
      }
    };

    if (userMenuOpen || activityDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [userMenuOpen, activityDropdownOpen]);

  useEffect(() => {
    let interval;

    const runAnimation = () => {
      setTimeout(() => {
        setShowGG(false);
        setShowFullName(true);

        setTimeout(() => {
          setShowFullName(false);

          setTimeout(() => {
            setShowGG(true);
          }, 1500);
        }, 5000);
      }, 8000);
    };

    runAnimation();

    interval = setInterval(runAnimation, 14500);

    return () => clearInterval(interval);
  }, []);

  const isActivityActive = activityLinks.some(link => location.pathname.startsWith(link.to));

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed w-full top-0 left-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* LOGO */}
            <Link
              to="/"
              className="flex items-center gap-2 text-lg font-semibold tracking-wide transition hover:opacity-80"
            >
              <FaGem
                className={`text-[#86ac55] transition-transform duration-500 ${showFullName ? "scale-110" : "scale-100"
                  }`}
              />
              <span className="relative h-6 w-32 overflow-hidden">
                <span
                  className={`absolute inset-0 font-bebas text-2xl transition-all text-[#ff8211] duration-500 ${showGG
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-4 opacity-0"
                    }`}
                >
                  GG
                </span>
                <span className="absolute inset-0 flex items-center font-bebas text-2xl text-[#ff8211] tracking-tight">
                  {"GYMGEM".split("").map((char, index, arr) => {
                    const delay = showFullName
                      ? index * 0.05
                      : (arr.length - index - 1) * 0.05;
                    return (
                      <span
                        key={char + index}
                        style={{ transitionDelay: `${delay}s` }}
                        className={`transition-all duration-300 ${showFullName
                          ? "translate-y-0 opacity-100"
                          : "translate-y-4 opacity-0"
                          }`}
                      >
                        {char}
                      </span>
                    );
                  })}
                </span>
              </span>
            </Link>

            {/* DESKTOP LINKS */}
            <div className="hidden lg:flex flex-1 justify-center items-center gap-2">
              <div className="flex items-center space-x-1 p-1.5 bg-gray-100/50 rounded-full border border-gray-200/50">
                <Link
                  to="/"
                  className="px-4 py-2 rounded-full text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-white transition-all"
                >
                  Home
                </Link>

                {mainLinks.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.to === '/trainee'}
                    className={({ isActive }) =>
                      `relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${isActive ? "text-[#ff8211] bg-white shadow-sm ring-1 ring-gray-100" : "text-gray-600 hover:text-[#ff8211] hover:bg-white/50"
                      }`
                    }
                  >
                    {l.icon}
                    {l.label}
                  </NavLink>
                ))}

                {/* My Activity Dropdown */}
                <div className="relative" ref={activityRef}>
                  <button
                    onClick={() => setActivityDropdownOpen(!activityDropdownOpen)}
                    className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1 group outline-none
                                            ${isActivityActive || activityDropdownOpen ? "text-[#ff8211] bg-white shadow-sm ring-1 ring-gray-100" : "text-gray-600 hover:text-[#ff8211] hover:bg-white/50"}`}
                  >
                    My Activity
                    <MdKeyboardArrowDown className={`transition-transform duration-300 ${activityDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {activityDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden py-2 z-50"
                      >
                        {activityLinks.map((link) => (
                          <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={() => setActivityDropdownOpen(false)}
                            className={({ isActive }) => `
                                                            flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors
                                                            ${isActive ? "text-[#ff8211] bg-orange-50" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}
                                                        `}
                          >
                            {link.icon}
                            {link.label}
                          </NavLink>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* RIGHT ICONS */}
            <div className="flex items-center gap-3 md:gap-5">

              {/* User Dropdown Menu */}
              {/* <NotificationDropdown /> */}
              <div className="flex items-center gap-3">
                <GemsBadge
                  balance={gemsBalance}
                  onAddClick={() => setIsAddGemsModalOpen(true)}
                  isLoading={isLoadingBalance}
                />
                <UserDropdown
                  user={user}
                  logout={logout}
                  dashboardPath="/trainee"
                  settingsPath="/settings"
                />
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                className="lg:hidden p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
                onClick={() => setOpen((s) => !s)}
                aria-label="Toggle menu"
              >
                {open ? (
                  <HiOutlineX className="h-6 w-6" />
                ) : (
                  <HiOutlineMenu className="h-6 w-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden bg-white border-t border-gray-100 shadow-xl"
            >
              <div className="px-4 py-6 space-y-4">
                <div className="space-y-1">
                  <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Menu</p>
                  <Link to="/" onClick={() => setOpen(false)} className="block px-4 py-3 rounded-xl text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all">
                    Home
                  </Link>
                  {[...mainLinks].map((l) => (
                    <NavLink
                      key={l.to}
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${isActive
                          ? "bg-orange-50 text-[#ff8211] shadow-sm"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`
                      }
                    >
                      {l.icon && <span className="opacity-80">{l.icon}</span>}
                      {l.label}
                    </NavLink>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-1">
                  <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">My Activity</p>
                  {activityLinks.map((l) => (
                    <NavLink
                      key={l.to}
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${isActive
                          ? "bg-orange-50 text-[#ff8211] shadow-sm"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`
                      }
                    >
                      {l.icon && <span className="opacity-80">{l.icon}</span>}
                      {l.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <AddGemsModal
        isOpen={isAddGemsModalOpen}
        onClose={() => setIsAddGemsModalOpen(false)}
        onContinue={handleAddGems}
      />

      {/* Spacer */}
      <div className="h-16 md:h-20" />
    </>
  );
};

export default NavTraineDash;
