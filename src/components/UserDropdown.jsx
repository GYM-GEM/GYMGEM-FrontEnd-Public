import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaUserCircle, 
  FaDumbbell, 
  FaStore, 
  FaBuilding, 
  FaUserGraduate, 
  FaUserTie 
} from "react-icons/fa";
import { 
  ChevronDown, 
  LayoutDashboard, 
  Settings, 
  UserPlus, 
  LogOut, 
  ChevronLeft, 
  Check 
} from "lucide-react";
import { getCreatedProfileTypes } from "../utils/auth";

const UserDropdown = ({ 
  user, 
  logout, 
  dashboardPath = "/dashboard", 
  settingsPath = "/settings"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuView, setMenuView] = useState("main"); // 'main' | 'profiles'
  const [createdProfiles, setCreatedProfiles] = useState([]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Load createdProfiles from localStorage
  useEffect(() => {
    // Use the utility function to get profile types
    const profileTypes = getCreatedProfileTypes();
    setCreatedProfiles(profileTypes);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setMenuView("main"); // Reset view on close
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (isOpen) setTimeout(() => setMenuView("main"), 200); // Reset after animation
  };

  const handleProfileSwitch = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  // Profile definitions with metadata
  const profiles = [
    {
      type: "Trainee",
      path: "/trainee",
      icon: FaUserGraduate,
      colorClass: "bg-blue-100 text-blue-600"
    },
    {
      type: "Trainer",
      path: "/trainer",
      icon: FaUserTie,
      colorClass: "bg-purple-100 text-purple-600"
    },
    {
      type: "Gym",
      path: "/gym",
      icon: FaBuilding,
      colorClass: "bg-orange-100 text-orange-600"
    },
    {
      type: "Store",
      path: "/store",
      icon: FaStore,
      colorClass: "bg-green-100 text-green-600"
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#ff8211]/20"
      >
        <FaUserCircle className="text-lg text-[#ff8211]" />
        <span className="max-w-[100px] truncate hidden sm:inline">
          {user?.username || "User"}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg animate-in fade-in zoom-in-95 duration-200 z-50">
          
          {/* Container for sliding views */}
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: menuView === 'profiles' ? 'translateX(-100%)' : 'translateX(0)' }}
          >
            
            {/* MAIN VIEW */}
            <div className="w-64 flex-shrink-0">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {user?.username || "User"}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>

              <div className="p-1">
                <Link
                  to={dashboardPath}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-[#ff8211] transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  to={settingsPath}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-[#ff8211] transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                
                <button
                  onClick={() => setMenuView("profiles")}
                  className="w-full flex items-center justify-between rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-[#ff8211] transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Change Profile
                  </div>
                  <ChevronDown className="h-4 w-4 -rotate-90 text-slate-400 group-hover:text-[#ff8211]" />
                </button>
              </div>

              <div className="border-t border-slate-100 p-1">
                <button
                  onClick={(e) => {
                    setIsOpen(false);
                    logout(e);
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>

            {/* PROFILES VIEW */}
            <div className="w-64 flex-shrink-0 bg-slate-50/30">
              <div className="px-2 py-2 border-b border-slate-100 flex items-center gap-2">
                <button 
                  onClick={() => setMenuView("main")}
                  className="p-1 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-semibold text-slate-900">Switch Profile</span>
              </div>

              <div className="p-1 space-y-0.5">
                {profiles.map((profile) => {
                  const isEnabled = createdProfiles.includes(profile.type);
                  const Icon = profile.icon;
                  
                  return (
                    <button
                      key={profile.type}
                      onClick={() => isEnabled && handleProfileSwitch(profile.path)}
                      disabled={!isEnabled}
                      className={`w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all
                        ${isEnabled 
                          ? "text-slate-700 hover:bg-white hover:shadow-sm hover:text-[#ff8211] cursor-pointer" 
                          : "text-slate-400 opacity-50 cursor-not-allowed bg-slate-50"
                        }`}
                    >
                      <div className={`p-1.5 rounded-full ${isEnabled ? profile.colorClass : "bg-slate-200 text-slate-400"}`}>
                        <Icon className="text-xs" />
                      </div>
                      <div className="text-left flex-1 flex items-center justify-between">
                        <p className="font-medium">{profile.type}</p>
                        {!isEnabled && <span className="text-[10px] bg-slate-200 px-1.5 rounded text-slate-500">Create</span>}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="p-2 mt-1 border-t border-slate-100">
                <button
                  onClick={() => handleProfileSwitch("/role")}
                  className="w-full flex items-center justify-center gap-2 rounded-md bg-[#ff8211] px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#ff7906] transition-colors"
                >
                  <UserPlus className="h-4 w-4" />
                  Create Profile
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
