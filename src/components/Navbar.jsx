import { useEffect, useState, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { FaGem } from "react-icons/fa";
import { MdOutlineNotificationsActive, MdKeyboardArrowDown, MdSportsMartialArts } from "react-icons/md";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../context/ToastContext";
import axiosInstance from "../utils/axiosConfig";
import UserDropdown from "./UserDropdown";
import GemsBadge from "./GemsBadge";
import AddGemsModal from "./AddGemsModal";
import getBalance from "../utils/balance";
import {
  ChevronDown, BookOpen, Users, ShoppingBag, Info, Users as CommunityIcon,
  Utensils, Sparkles, MessageSquare, Bot, LayoutDashboard, Settings,
  ClipboardList, Calendar, Heart, Package, ShoppingCart, User, Home,
  Store, Dumbbell, UserCircle
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  // -- State --
  const [isOpen, setIsOpen] = useState(false); // Mobile menu
  const [showFullName, setShowFullName] = useState(false);
  const [showGG, setShowGG] = useState(true);

  // Dropdown states
  const [trainingOpen, setTrainingOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [managementDropdownOpen, setManagementDropdownOpen] = useState(false);

  // Refs for click outside
  const trainingRef = useRef(null);
  const aiRef = useRef(null);
  const managementRef = useRef(null);

  // User Data
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Gems Balance State
  const [gemsBalance, setGemsBalance] = useState(() => {
    const saved = localStorage.getItem("gems_balance");
    return saved ? parseInt(saved, 10) : null;
  });
  const [isAddGemsModalOpen, setIsAddGemsModalOpen] = useState(false);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  // -- Role & Link Logic --

  // Helper: Get user role from URL or active profile
  const getCurrentRole = () => {
    if (user?.current_profile && user.profiles) {
      const activeProfile = user.profiles.find(p => p.id === user.current_profile);
      if (activeProfile) return activeProfile.type.toLowerCase();
    }
    return 'guest';
  };

  const role = getCurrentRole();
  const isTrainer = role === 'trainer';
  const isTrainee = role === 'trainee';

  // Check if we're in a dashboard route
  const isInDashboard = location.pathname.startsWith('/trainer/') ||
    location.pathname.startsWith('/trainee/') ||
    location.pathname.startsWith('/store/') ||
    location.pathname.startsWith('/settings/') ||
    location.pathname.startsWith('/gym/');

  // Get Profile IDs
  const trainerProfile = user?.profiles?.find(p => p.type === "trainer");
  const currentProfileId = trainerProfile?.id || user?.current_profile || user?.id;
  const storeProfile = user?.profiles?.find(p => p.type === "store");
  const storeId = storeProfile?.id;

  // -- Link Configurations --

  // 1. Common Public Links (Home, About, etc.)
  const publicLinks = [
    { to: "/", label: "Home" },
  ];

  const aboutLink = { to: "/about", label: "About", icon: <Info size={16} /> };

  // 2. Dashboard Specific Links
  const getContextSpecificLinks = () => {
    switch (role) {
      case 'trainer':
        return [
          { to: `/trainer/profile/${currentProfileId}`, label: "Profile", icon: <UserCircle size={18} /> },
          { to: "/trainer/message", label: "Messages", icon: <MessageSquare size={18} /> },
          { to: "/trainer/calendar", label: "My Calendar", icon: <Calendar size={18} /> },
          { to: "/trainer/settings", label: "Settings", icon: <Settings size={18} /> },
        ];
      case 'trainee':
        return [
          { to: "/trainee", label: "Profile", icon: <UserCircle size={18} /> },
          { to: "/trainee/message", label: "Messages", icon: <MessageSquare size={18} /> },
          { to: "/trainee/settings", label: "Settings", icon: <Settings size={18} /> },
        ];
      case 'store':
        return [
          { to: "/store/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
          { to: `/store/profile/${storeId}`, label: "Profile", icon: <Store size={18} /> },
          { to: "/store/message", label: "Messages", icon: <MessageSquare size={18} /> },
          { to: "/store/settings", label: "Settings", icon: <Settings size={18} /> },
        ];
      case 'gym':
        return [
          { to: "/gym/Gymprofile", label: "Profile", icon: <Dumbbell size={18} /> },
          { to: "/gym", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
          { to: "/gym/GymMember", label: "Member", icon: <Users size={18} /> },
          { to: "/gym/GymSessions", label: "Sessions", icon: <Calendar size={18} /> },
          { to: "/gym/GymClasses", label: "Classes", icon: <BookOpen size={18} /> },
        ];
      default:
        // Guest / Public Mode
        return [];
    }
  };

  const contextLinks = getContextSpecificLinks();

  // 3. Management / Activity Dropdowns (For Dashboards)
  const getManagementLinks = () => {
    switch (role) {
      case 'trainer':
        return {
          label: 'My Work',
          links: [
            { to: "/trainer/courses", label: "Courses", icon: <BookOpen size={18} /> },
            { to: "/trainer/myorder", label: "My Orders", icon: <ClipboardList size={18} /> },
            { to: "/trainer/sessions", label: "My Sessions", icon: <Calendar size={18} /> },
          ]
        };
      case 'trainee':
        return {
          label: 'My Activity',
          links: [
            { to: "/trainee/sessions", label: "My Sessions", icon: <Calendar size={18} /> },
            { to: "/trainee/courses", label: "Courses", icon: <BookOpen size={18} /> },
            { to: "/trainee/favorite", label: "Favorites", icon: <Heart size={18} /> },
            { to: "/trainee/myorder", label: "My Orders", icon: <ClipboardList size={18} /> },
          ]
        };
      case 'store':
        return {
          label: 'Management',
          links: [
            { to: "/store/product", label: "Products", icon: <Package size={18} /> },
            { to: "/store/order", label: "Orders", icon: <ShoppingCart size={18} /> },
          ]
        };
      default:
        return null;
    }
  };

  const managementConfig = getManagementLinks();


  // 4. Public Dropdowns (Training, AI, Store, Community, About)
  // Show public navigation only when NOT in dashboard
  const showPublicDropdowns = !isInDashboard;

  const trainingLinks = [
    { to: "/courses", label: "Courses", icon: <BookOpen size={16} /> },
    { to: "/trainers", label: "Trainers", icon: <Users size={16} /> },
  ];

  const aiLinks = [
    { to: "/ai-trainer", label: "AI Personal Trainer", icon: <MdSportsMartialArts size={18} /> },
    { to: "/ai-food", label: "AI Food Analyzer", icon: <Utensils size={18} /> },
    { to: "/ai-chat", label: "Chatbot", icon: <Bot size={18} /> },
  ];

  // -- Effects --

  // Balance logic with 2-minute cache
  useEffect(() => {
    const fetchBalance = async () => {
      if (!user) return;

      const lastFetch = localStorage.getItem("gems_balance_last_fetch");
      const now = Date.now();
      const TWO_MINUTES = 5 * 60 * 1000;

      // Only fetch if no balance exists or if 2 minutes have passed
      if (!localStorage.getItem("gems_balance") || !lastFetch || (now - parseInt(lastFetch)) > TWO_MINUTES) {
        // Only show loader on initial fetch (no existing balance)
        if (!localStorage.getItem("gems_balance")) setIsLoadingBalance(true);

        const balance = await getBalance();
        if (balance !== null) {
          setGemsBalance(balance);
          localStorage.setItem("gems_balance_last_fetch", now.toString());
        }
        setIsLoadingBalance(false);
      }
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
  }, [user]);

  // Logo Animation
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

  // Click Outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (trainingRef.current && !trainingRef.current.contains(e.target)) setTrainingOpen(false);
      if (aiRef.current && !aiRef.current.contains(e.target)) setAiOpen(false);
      if (managementRef.current && !managementRef.current.contains(e.target)) setManagementDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  // -- Handlers --
  const handleAddGems = async (pkg) => {
    setIsAddGemsModalOpen(false);
    try {
      const token = localStorage.getItem('access');
      const response = await axiosInstance.post('/api/payment/start/',
        { amount: pkg.price },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/checkout', {
        state: {
          type: 'gems', gems: pkg.gems, price: pkg.price, user: user,
          iframeUrl: response.data.iframe_url, paymentId: response.data.payment_id
        }
      });
    } catch (error) {
      console.error('Error starting payment:', error);
      showToast('Failed to start payment process.', { type: 'error' });
      setIsAddGemsModalOpen(true);
    }
  };

  const logout = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('refresh');
    try {
      await axiosInstance.post("/api/auth/logout", {}, { headers: { refresh: token } });
      localStorage.clear();
      showToast("Logout successful!", { type: "success" });
      navigate("/login");
    } catch (error) {
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
      case 'trainer': return `/trainer/profile/${currentProfileId}`;
      case 'trainee': return '/trainee/dashboard';
      case 'gym': return '/gym/dashboard';
      case 'store': return '/store/dashboard';
      default: return '/role';
    }
  };

  // -- Render Helpers --
  const NavItem = ({ to, label, icon, end = false }) => (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `relative px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 
        ${isActive ? "text-[#ff8211] bg-white shadow-sm ring-1 ring-gray-100" : "text-gray-600 hover:text-[#ff8211] hover:bg-white/50"}`
      }
    >
      {icon}
      {label}
    </NavLink>
  );

  return (
    <>
      <nav className="fixed w-full top-0 left-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="mx-auto flex h-16 md:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-semibold tracking-wide transition hover:opacity-80"
          >
            <FaGem
              className={`text-[#86ac55] transition-transform duration-500 ${showFullName ? "scale-110" : "scale-100"}`}
            />
            {/* Full text on Desktop, Condensed on Mobile if requested? User asked: "don't display the full logo" */}
            {/* We will hide the text on very small screens, or keep the animation but scale it down? */}
            {/* Let's hide the text on mobile (< sm) */}
            <span className="hidden sm:block relative h-6 w-32 overflow-hidden">
              <span className={`absolute inset-0 font-bebas text-2xl text-[#ff8211] transition-all duration-500 ${showGG ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}>
                GG
              </span>
              <span className="absolute inset-0 flex items-center font-bebas text-2xl text-[#ff8211] tracking-tight">
                {"GYMGEM".split("").map((c, i, a) => (
                  <span key={i} style={{ transitionDelay: `${showFullName ? i * 0.05 : (a.length - i - 1) * 0.05}s` }}
                    className={`transition-all duration-300 ${showFullName ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}>
                    {c}
                  </span>
                ))}
              </span>
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex lg:items-center lg:gap-2">

            {/* 1. Public Base Links */}
            {/* Always show Home */}
            <NavItem to="/" label="Home" icon={<Home size={18} />} end />

            {/* 2. Context Specific Links (Dashboard Only) */}
            {isInDashboard && contextLinks.map(link => (
              <NavItem key={link.to} {...link} />
            ))}

            {/* 3. Management Dropdown (Dashboard Only) */}
            {isInDashboard && managementConfig && (
              <div className="relative" ref={managementRef}>
                <button
                  onClick={() => setManagementDropdownOpen(!managementDropdownOpen)}
                  className={`relative px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1 group outline-none
                  ${managementDropdownOpen || managementConfig.links.some(l => location.pathname.startsWith(l.to))
                      ? "text-[#ff8211] bg-white shadow-sm ring-1 ring-gray-100"
                      : "text-gray-600 hover:text-[#ff8211] hover:bg-white/50"}`}
                >
                  {managementConfig.label}
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${managementDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {managementDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 mt-2 w-48 rounded-2xl border border-gray-100 bg-white p-1 shadow-xl z-50 overflow-hidden"
                    >
                      {managementConfig.links.map(link => (
                        <NavLink
                          key={link.to}
                          to={link.to}
                          onClick={() => setManagementDropdownOpen(false)}
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

            {/* 4. Public Feature Links (Only if Public/Guest/Trainee) */}
            {/* Showing Store, etc */}
            {showPublicDropdowns && (
              <>
                {/* Training Dropdown */}
                {isTrainee && !isInDashboard && (
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
                          className="absolute left-0 mt-2 w-48 rounded-2xl border border-gray-100 bg-white p-1 shadow-xl z-50"
                        >
                          {trainingLinks.map((link) => (
                            <NavLink
                              key={link.to}
                              to={link.to}
                              onClick={() => setTrainingOpen(false)}
                              className={({ isActive }) => `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${isActive ? "text-[#ff8211] bg-orange-50" : "text-gray-600 hover:bg-gray-50"}`}
                            >
                              {link.icon} {link.label}
                            </NavLink>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                <NavItem to="/stores" label="Store" icon={<ShoppingBag size={16} />} />

                {/* Community */}
                {user && <NavItem to="/community" label="Community" icon={<CommunityIcon size={16} />} />}

                {/* AI Assistant */}
                {user && (
                  <div className="relative" ref={aiRef}>
                    <button
                      onClick={() => setAiOpen(!aiOpen)}
                      className={`relative px-3 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-1 group outline-none overflow-hidden
                             ${aiOpen || aiLinks.some(l => location.pathname.startsWith(l.to))
                          ? "text-white bg-[#ff8211] shadow-md shadow-orange-500/20"
                          : "text-gray-700 hover:text-[#ff8211] hover:bg-orange-50"}`}
                    >
                      <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
                      <Sparkles size={18} className="relative z-20" />
                      <span className="relative z-20">AI Assistant</span>
                      <ChevronDown className={`h-4 w-4 relative z-20 transition-transform duration-300 ${aiOpen ? "rotate-180" : ""}`} />
                      <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5 z-20">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-white"></span>
                      </span>
                    </button>
                    <AnimatePresence>
                      {aiOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute left-0 mt-2 w-56 rounded-2xl border border-gray-100 bg-white p-1 shadow-xl z-50"
                        >
                          {aiLinks.map((link) => (
                            <NavLink
                              key={link.to}
                              to={link.to}
                              onClick={() => setAiOpen(false)}
                              className={({ isActive }) => `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${isActive ? "text-[#ff8211] bg-orange-50" : "text-gray-600 hover:bg-gray-50"}`}
                            >
                              {link.icon} {link.label}
                            </NavLink>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </>
            )}

            {/* About - only show when not in dashboard */}
            {!isInDashboard && <NavItem {...aboutLink} />}

          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-3">
            {/* Mobile Gems (visible if user) */}
            {user && (
              <div className="lg:hidden">
                <GemsBadge balance={gemsBalance} onAddClick={() => setIsAddGemsModalOpen(true)} isLoading={isLoadingBalance} />
              </div>
            )}

            {/* Desktop Right */}
            <div className="hidden lg:flex lg:items-center lg:gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <GemsBadge balance={gemsBalance} onAddClick={() => setIsAddGemsModalOpen(true)} isLoading={isLoadingBalance} />
                  {/* <NotificationDropdown /> */}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="px-5 py-2.5 rounded-full text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all">Log in</Link>
                  <Link to="/signup" className="px-5 py-2.5 rounded-full bg-[#ff8211] text-sm font-semibold text-white shadow hover:bg-[#ff8211]/90 hover:shadow-md transition-all active:scale-95">Sign up</Link>
                </div>
              )}
            </div>

            {/* User Dropdown */}
            {user && (
              <UserDropdown
                user={user}
                logout={logout}
                dashboardPath={getDashboardPath()}
                settingsPath="/settings"
              />
            )}

            {/* Mobile Menu Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="lg:hidden p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <HiOutlineX className="h-6 w-6" /> : <HiOutlineMenu className="h-6 w-6" />}
            </motion.button>
          </div>

        </div>

        {/* MOBILE MENU CONTENT */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden bg-white border-t border-gray-100 shadow-xl"
            >
              <div className="px-4 py-6 space-y-4">
                {/* Public Links */}
                <div className="space-y-1">
                  <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Menu</p>
                  <NavLink to="/" onClick={() => setIsOpen(false)} className={({ isActive }) => `block px-4 py-3 rounded-xl font-medium transition-all ${isActive ? "bg-orange-50 text-[#ff8211]" : "text-gray-600"}`}>Home</NavLink>

                  {/* Dashboard Links in Mobile (only in dashboard) */}
                  {isInDashboard && contextLinks.map(link => (
                    <NavLink key={link.to} to={link.to} onClick={() => setIsOpen(false)} className={({ isActive }) => `flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${isActive ? "bg-orange-50 text-[#ff8211]" : "text-gray-600"}`}>
                      {link.icon} {link.label}
                    </NavLink>
                  ))}
                </div>

                {/* Management Mobile (Dashboard Only) */}
                {isInDashboard && managementConfig && (
                  <div className="pt-4 border-t border-gray-100 space-y-1">
                    <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{managementConfig.label}</p>
                    {managementConfig.links.map(link => (
                      <NavLink key={link.to} to={link.to} onClick={() => setIsOpen(false)} className={({ isActive }) => `flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${isActive ? "bg-orange-50 text-[#ff8211]" : "text-gray-600"}`}>
                        {link.icon} {link.label}
                      </NavLink>
                    ))}
                  </div>
                )}

                {/* Public Mobile Links (Store, Community, AI) */}
                {showPublicDropdowns && (
                  <div className="pt-4 border-t border-gray-100 space-y-1">
                    <NavLink to="/stores" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-gray-600"><ShoppingBag size={18} /> Store</NavLink>
                    {user && <NavLink to="/community" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-gray-600"><CommunityIcon size={18} /> Community</NavLink>}
                    {user && (
                      <div className="space-y-1">
                        <div className="px-4 py-3 text-base font-bold flex items-center gap-2"><Sparkles size={20} /> AI Assistant</div>
                        {aiLinks.map(link => (
                          <NavLink key={link.to} to={link.to} onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-8 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-[#ff8211]">{link.icon} {link.label}</NavLink>
                        ))}
                      </div>
                    )}
                    <NavLink to="/about" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-gray-600"><Info size={18} /> About</NavLink>
                  </div>
                )}

                {/* Auth Mobile */}
                {!user && (
                  <div className="grid grid-cols-2 gap-4 px-2 pt-4 border-t border-gray-100">
                    <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 shadow-sm">Log in</Link>
                    <Link to="/signup" onClick={() => setIsOpen(false)} className="flex items-center justify-center rounded-xl bg-[#ff8211] px-4 py-3 text-sm font-bold text-white shadow">Sign up</Link>
                  </div>
                )}

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

      {/* Spacer */}
      <div className="h-16 md:h-20" />
    </>
  );
};

export default Navbar;
