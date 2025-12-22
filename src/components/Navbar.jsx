import { useEffect, useState, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { FaGem } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdSportsMartialArts } from "react-icons/md";

import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../context/ToastContext";
import axiosInstance from "../utils/axiosConfig";
import UserDropdown from "./UserDropdown";
import NotificationDropdown from "./NotificationDropdown";
import { ChevronDown, BookOpen, Users, ShoppingBag, Info, Users as CommunityIcon } from "lucide-react"; // Added Icons
import GemsBadge from "./GemsBadge";
import AddGemsModal from "./AddGemsModal";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showFullName, setShowFullName] = useState(false);
  const [showGG, setShowGG] = useState(true);

  // Dropdown states
  const [trainingOpen, setTrainingOpen] = useState(false);

  // Refs
  const trainingRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const { showToast } = useToast();

  const [gemsBalance, setGemsBalance] = useState(() => {
    const saved = localStorage.getItem("gems_balance");
    return saved ? parseInt(saved, 10) : 1200; // Mock initial balance
  });
  const [isAddGemsModalOpen, setIsAddGemsModalOpen] = useState(false);

  useEffect(() => {
    // Keep balance in sync with localStorage if updated elsewhere
    const handleStorageChange = () => {
      const saved = localStorage.getItem("gems_balance");
      if (saved) setGemsBalance(parseInt(saved, 10));
    };
    window.addEventListener('storage', handleStorageChange);
    // Custom event for same-window updates
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
      showToast("Logged out.", { type: "info" });
      navigate("/login");
    }
  };

  const getDashboardPath = () => {
    if (!user || !user.profiles || !user.current_profile) return "/role";
    const currentProfileId = user.current_profile;
    const activeProfile = user.profiles.find(p => p.id === currentProfileId);
    if (!activeProfile) return "/role";

    switch (activeProfile.type.toLowerCase()) {
      case 'trainer': return '/trainer/dashboard';
      case 'trainee': return '/trainee/dashboard';
      case 'gym': return '/gym/dashboard';
      case 'store': return '/store/dashboard';
      default: return '/role';
    }
  };

  const isTrainer = () => {
    if (!user || !user.profiles || !user.current_profile) return false;
    const currentProfileId = user.current_profile;
    const activeProfile = user.profiles.find(p => p.id === currentProfileId);
    return activeProfile?.type.toLowerCase() === 'trainer';
  };

  // Logo Animation Effect
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

  // Click Outside Handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (trainingRef.current && !trainingRef.current.contains(e.target)) {
        setTrainingOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Is Active Helper
  const isLinkActive = (path) => location.pathname === path;

  // Training Links
  const trainingLinks = [
    { to: "/courses", label: "Courses", icon: <BookOpen size={16} /> },
    { to: "/trainers", label: "Trainers", icon: <Users size={16} /> },
    // { to: "/trainees", label: "Trainees", icon: <Users size={16} /> }, // Commented out in original
  ];

  return (
    <>
      <nav
        className="fixed w-full top-0 left-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm"
      >
        <div className="mx-auto flex h-16 md:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo Section */}
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-semibold tracking-wide transition hover:opacity-80"
          >
            <FaGem
              className={`text-[#86ac55] transition-transform duration-500 ${showFullName ? "scale-110" : "scale-100"}`}
            />
            <span className="relative h-6 w-32 overflow-hidden">
              <span
                className={`absolute inset-0 font-bebas text-2xl text-[#ff8211] transition-all duration-500 ${showGG ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}
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
                      className={`transition-all duration-300 ${showFullName ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
                    >
                      {char}
                    </span>
                  );
                })}
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-2">

            {/* Home */}
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `relative px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 
                ${isActive ? "text-[#ff8211] bg-white shadow-sm ring-1 ring-gray-100" : "text-gray-600 hover:text-[#ff8211] hover:bg-white/50"}`
              }
            >
              Home
            </NavLink>

            {/* Training Dropdown - Hidden for Trainers */}
            {!isTrainer() && (
              <div className="relative" ref={trainingRef}>
                <button
                  onClick={() => setTrainingOpen(!trainingOpen)}
                  className={`relative px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1 group outline-none
                  ${trainingOpen || trainingLinks.some(l => location.pathname.startsWith(l.to))
                      ? "text-[#ff8211] bg-white shadow-sm ring-1 ring-gray-100"
                      : "text-gray-600 hover:text-[#ff8211] hover:bg-white/50"}`}
                >
                  Training
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${trainingOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {trainingOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 mt-2 w-48 rounded-2xl border border-gray-100 bg-white p-1 shadow-xl z-50 overflow-hidden"
                    >
                      {trainingLinks.map((link) => (
                        <NavLink
                          key={link.to}
                          to={link.to}
                          onClick={() => setTrainingOpen(false)}
                          className={({ isActive }) => `
                             flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors rounded-xl
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
            )}

            {/* Store */}
            <NavLink
              to="/stores"
              className={({ isActive }) =>
                `relative px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 
                ${isActive ? "text-[#ff8211] bg-white shadow-sm ring-1 ring-gray-100" : "text-gray-600 hover:text-[#ff8211] hover:bg-white/50"}`
              }
            >
              <ShoppingBag size={16} />
              Store
            </NavLink>

            {/* Gym - Soon */}
            {/* <div className="relative px-5 py-2 text-sm font-medium text-gray-400 cursor-not-allowed flex items-center gap-2 hover:bg-white/50 rounded-full transition-colors">
              Gym
              <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-orange-100 text-orange-600 rounded">Soon</span>
            </div> */}

            {/* Community */}
            <NavLink
              to="/community"
              className={({ isActive }) =>
                `relative px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 
                ${isActive ? "text-[#ff8211] bg-white shadow-sm ring-1 ring-gray-100" : "text-gray-600 hover:text-[#ff8211] hover:bg-white/50"}`
              }
            >
              <CommunityIcon size={16} />
              Community
            </NavLink>

            {/* AI Trainer */}
            <NavLink
              to="/ai-trainer"
              className={({ isActive }) =>
                `relative px-3 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 group overflow-hidden
                ${isActive 
                  ? "text-white bg-[#ff8211] shadow-md shadow-orange-500/20" 
                  : "text-gray-700 hover:text-[#ff8211] hover:bg-orange-50"}`
              }
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
              
              <MdSportsMartialArts size={20} className="relative z-20" />
              <span className="relative z-20">AI Trainer</span>
              
              {/* Badge */}
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5 z-20">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-white"></span>
              </span>
            </NavLink>

            {/* About */}
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `relative px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 
                ${isActive ? "text-[#ff8211] bg-white shadow-sm ring-1 ring-gray-100" : "text-gray-600 hover:text-[#ff8211] hover:bg-white/50"}`
              }
            >
              <Info size={16} />
              About
            </NavLink>
          </div>

          {/* User Section (Desktop) / Mobile Toggle */}
          <div className="flex items-center gap-3">
            {/* Desktop User Menu */}
            <div className="hidden md:flex md:items-center md:gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <GemsBadge 
                    balance={gemsBalance} 
                    onAddClick={() => setIsAddGemsModalOpen(true)} 
                  />
                  {/* <NotificationDropdown /> */}
                  <UserDropdown
                    user={user}
                    logout={logout}
                    dashboardPath={getDashboardPath()}
                    settingsPath="/settings"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-5 py-2.5 rounded-full text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="px-5 py-2.5 rounded-full bg-[#ff8211] text-sm font-semibold text-white shadow hover:bg-[#ff8211]/90 hover:shadow-md transition-all active:scale-95"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="md:hidden p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <HiOutlineX className="h-6 w-6" />
              ) : (
                <HiOutlineMenu className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden bg-white border-t border-gray-100 shadow-xl"
            >
              <div className="px-4 py-6 space-y-4">
                <div className="space-y-1">
                  <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Menu</p>

                  <NavLink
                    to="/"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${isActive
                        ? "bg-orange-50 text-[#ff8211] shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`
                    }
                  >
                    Home
                  </NavLink>

                  {/* Mobile Training Dropdown */}
                  {!isTrainer() && (
                    <div className="space-y-1">
                      <button
                        onClick={() => setTrainingOpen(!trainingOpen)}
                        className="flex w-full items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      >
                        <span className="flex items-center gap-2">Training</span>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${trainingOpen ? "rotate-180" : ""}`} />
                      </button>

                      <AnimatePresence>
                        {trainingOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden pl-4"
                          >
                            {trainingLinks.map((link) => (
                              <NavLink
                                key={link.to}
                                to={link.to}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                    ? "text-[#ff8211] bg-orange-50/50"
                                    : "text-gray-600 hover:text-[#ff8211]"}`
                                }
                              >
                                {link.icon}
                                {link.label}
                              </NavLink>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  <NavLink
                    to="/stores"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${isActive
                        ? "bg-orange-50 text-[#ff8211] shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`
                    }
                  >
                    <ShoppingBag size={18} />
                    Store
                  </NavLink>

                  {user && (
                    <NavLink
                      to="/my-orders"
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${isActive
                          ? "bg-orange-50 text-[#ff8211] shadow-sm"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`
                      }
                    >
                      My Orders
                    </NavLink>
                  )}

                  <div className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-gray-400 cursor-not-allowed hover:bg-gray-50">
                    <span>Gym</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-orange-100 text-orange-600 rounded">Soon</span>
                  </div>

                  <NavLink
                    to="/community"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${isActive
                        ? "bg-orange-50 text-[#ff8211] shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`
                    }
                  >
                    <CommunityIcon size={18} />
                    Community
                  </NavLink>

                  <NavLink
                    to="/ai-trainer"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold transition-all relative overflow-hidden group
                      ${isActive
                        ? "bg-[#ff8211] text-white shadow-md shadow-orange-500/20"
                        : "text-gray-700 hover:bg-orange-50 hover:text-[#ff8211]"}`
                    }
                  >
                    <MdSportsMartialArts size={20} className="relative z-20" />
                    <span className="relative z-20">AI Trainer</span>
                    
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />

                    {/* Badge */}
                    <span className="absolute top-3 right-4 flex h-2.5 w-2.5 z-20">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-white"></span>
                    </span>
                  </NavLink>

                  <NavLink
                    to="/about"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${isActive
                        ? "bg-orange-50 text-[#ff8211] shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`
                    }
                  >
                    <Info size={18} />
                    About
                  </NavLink>
                </div>

                {/* Mobile Auth/User Section */}
                <div className="pt-4 border-t border-gray-100">
                  {user ? (
                    <div className="space-y-2">
                      <NavLink
                        to={getDashboardPath()}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-base font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 transition-all"
                      >
                        <span>Dashboard</span>
                      </NavLink>

                      <button
                        onClick={(e) => {
                          setIsOpen(false);
                          logout(e);
                        }}
                        className="flex items-center justify-center w-full px-4 py-3 rounded-xl text-base font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-all"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 px-2">
                      <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition-all"
                      >
                        Log in
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-center rounded-xl bg-[#ff8211] px-4 py-3 text-sm font-bold text-white shadow hover:bg-[#ff8211]/90 hover:shadow-md transition-all"
                      >
                        Sign up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AddGemsModal 
        isOpen={isAddGemsModalOpen}
        onClose={() => setIsAddGemsModalOpen(false)}
        onContinue={handleAddGems}
      />

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16 md:h-20" />
    </>
  );
}

export default Navbar;
