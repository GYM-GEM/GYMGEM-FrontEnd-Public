import { useEffect, useState, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaGem, FaUserCircle } from "react-icons/fa";
import axios from "axios";

function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showFullName, setShowFullName] = useState(false);
  const [showGG, setShowGG] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const menuRef = useRef(null);

  const logout = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('refresh');
    const access = localStorage.getItem('access');
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/logout",
        {},
        {
          headers: { Authorization: `Bearer ${access} `, refresh: token },
        }
      );

      localStorage.removeItem("user");

      console.log("Response:", response.data);
      alert("logout is successful!");
      navigate("/login");
    } catch (error) {
      console.error("Error during login:", error);
      alert("Logout failed. Please try again.");
    }
  };

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const linkBase =
    "rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200";
  const resolveLinkClass = (isActive) =>
    `${linkBase} ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <nav className="relative z-40 border-b border-border bg-background/80 text-foreground backdrop-blur supports-[backdrop-filter]:backdrop-blur">
      <div className="mx-auto flex w-[80%] items-center justify-between px-4 py-4 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-wide transition hover:text-primary/80"
        >
          <FaGem
            className={`text-[#86ac55] transition-transform duration-500 ${showFullName ? "scale-105" : "scale-100"
              }`}
          />
          <span className="relative h-6 w-24 overflow-hidden">
            <span
              className={` absolute inset-0 font-bebas text-2xl  text-[#ff8211] transition-all duration-500 ${showGG
                ? "translate-y-0 opacity-100"
                : "-translate-y-2 opacity-0"
                }`}
            >
              GG
            </span>
            <span className="absolute inset-0 flex items-center text-[#ff8211] font-bebas text-2xl tracking-tight ">
              {"GYMGEM".split("").map((char, index, arr) => {
                const delay = showFullName
                  ? index * 0.1
                  : (arr.length - index - 1) * 0.1;
                return (
                  <span
                    key={char + index}
                    style={{ transitionDelay: `${delay}s` }}
                    className={` transition-all duration-300 ${showFullName
                      ? "translate-y-0 opacity-100"
                      : "translate-y-2 opacity-0"
                      }`}
                  >
                    {char}
                  </span>
                );
              })}
            </span>
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:hidden"
          aria-expanded={isOpen}
          aria-controls="primary-navigation"
        >
          <span className="sr-only">Toggle navigation</span>
          <span className="text-lg">{isOpen ? "×" : "☰"}</span>
        </button>

        <div
          id="primary-navigation"
          className={`absolute left-0 top-full w-full border-b border-border bg-background px-4 pb-4 pt-2 shadow-lg transition-all duration-200 md:static md:flex md:w-auto md:items-center md:gap-4 md:border-none md:bg-transparent md:p-0 md:shadow-none ${isOpen ? "flex flex-col" : "hidden md:flex"
            }`}
        >
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              [
                "relative inline-block mx-2 px-3 py-2 transition-colors duration-200",
                isActive
                  ? "text-[#ff7906]"
                  : "text-gray-900 hover:text-[#ff7906]",
                "after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2",
                "after:-bottom-[1.05rem] after:h-[4px] after:rounded-full after:transition-all after:duration-200",
                "after:bg-[#ff8211]/90",
                isActive
                  ? "after:w-[100%] after:opacity-100"
                  : "after:w-0 after:opacity-0",
              ].join(" ")
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/Courses"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              [
                "relative inline-block  px-3 py-2 transition-colors duration-200",
                isActive
                  ? "text-[#ff7906]"
                  : "text-gray-900 hover:text-[#ff7906]",
                "after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2",
                "after:-bottom-[1.05rem] after:h-[4px] after:rounded-full after:transition-all after:duration-200",
                "after:bg-[#ff8211]/90",
                isActive
                  ? "after:w-[100%] after:opacity-100"
                  : "after:w-0 after:opacity-0",
              ].join(" ")
            }
          >
            Courses
          </NavLink>
          <NavLink
            to="/Trainers"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              [
                "relative inline-block  px-3 py-2 transition-colors duration-200",
                isActive
                  ? "text-[#ff7906]"
                  : "text-gray-900 hover:text-[#ff7906]",
                "after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2",
                "after:-bottom-[1.05rem] after:h-[4px] after:rounded-full after:transition-all after:duration-200",
                "after:bg-[#ff8211]/90",
                isActive
                  ? "after:w-[100%] after:opacity-100"
                  : "after:w-0 after:opacity-0",
              ].join(" ")
            }
          >
            Trainers
          </NavLink>
          <NavLink
            to="/Trainees"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              [
                "relative inline-block  px-3 py-2 transition-colors duration-200",
                isActive
                  ? "text-[#ff7906]"
                  : "text-gray-900 hover:text-[#ff7906]",
                "after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2",
                "after:-bottom-[1.05rem] after:h-[4px] after:rounded-full after:transition-all after:duration-200",
                "after:bg-[#ff8211]/90",
                isActive
                  ? "after:w-[100%] after:opacity-100"
                  : "after:w-0 after:opacity-0",
              ].join(" ")
            }
          >
            Trainees
          </NavLink>
          <NavLink
            to="/community"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              [
                "relative inline-block  px-3 py-2 transition-colors duration-200",
                isActive
                  ? "text-[#ff7906]"
                  : "text-gray-900 hover:text-[#ff7906]",
                "after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2",
                "after:-bottom-[1.05rem] after:h-[4px] after:rounded-full after:transition-all after:duration-200",
                "after:bg-[#ff8211]/90",
                isActive
                  ? "after:w-[100%] after:opacity-100"
                  : "after:w-0 after:opacity-0",
              ].join(" ")
            }
          >
            Community
          </NavLink>
          <NavLink
            to="/About"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              [
                "relative inline-block  px-3 py-2 transition-colors duration-200",
                isActive
                  ? "text-[#ff7906]"
                  : "text-gray-900 hover:text-[#ff7906]",
                "after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2",
                "after:-bottom-[1.05rem] after:h-[4px] after:rounded-full after:transition-all after:duration-200",
                "after:bg-[#ff8211]/90",
                isActive
                  ? "after:w-[100%] after:opacity-100"
                  : "after:w-0 after:opacity-0",
              ].join(" ")
            }
          >
            About
          </NavLink>
          <div className="relative" ref={menuRef}>
            {user ? (
              <>
                {/* User logged in */}
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setUserMenuOpen((s) => !s);
                  }}
                  className={`${resolveLinkClass(
                    false
                  )} flex items-center gap-2`}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <FaUserCircle className="text-lg" />
                  <span className="text-sm">{user.username}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-44 rounded-md border border-border bg-white/85 shadow-lg">
                    <NavLink
                      to="/trainer"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      Dashboard
                    </NavLink>
                    <NavLink
                      to="/trainer/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                    >
                      Profile
                    </NavLink>
                    <button
                      onClick={(event) => logout(event)}
                      className="w-full text-left px-4 py-2 text-sm text-foreground hover:black cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* No user logged in */}
                <NavLink
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `${resolveLinkClass(isActive)} flex items-center gap-2`
                  }
                >
                  <FaUserCircle className="text-lg" />
                  <span className="text-sm">Sign In</span>
                </NavLink>
              </>
            )}
          </div>

          {/* {user && (
            <button
              onClick={(event) => {
                setIsOpen(false);
                logout(event);
              }}
              className="mt-2 inline-flex items-center justify-center rounded-lg bg-destructive px-3 py-2 text-sm font-semibold text-destructive-foreground transition hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:mt-0"
            >
              Logout
            </button>
          )} */}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
