import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaGem, FaUserCircle } from "react-icons/fa";
import { MdOutlineNotificationsActive } from "react-icons/md";

const NavBarDash = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showFullName, setShowFullName] = useState(false);
  const [showGG, setShowGG] = useState(true);
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
  return (
    <>
      <nav className="bg-white text-black  flex justify-between items-center w-full relative border-0 border-b-1 border-[#6B7280]">
        <div className="w-[80%] mx-auto flex justify-between align-middle items-center p-4 ">
          <div className="relative flex items-center">
            <Link
              to="/"
              className="relative flex items-center gap-2 text-2xl font-bold text-[#FF7A00] overflow-hidden group"
            >
              <FaGem
                className={`text-[#7e9c4a] transition-transform duration-500 ${
                  showFullName ? "rotate-12 scale-110" : ""
                }`}
              />

              <div className="relative w-[8rem] h-[2rem] flex items-center">
                {/* GG */}
                <span
                  className={`absolute left-0 top-0 transition-all duration-500 ${
                    showGG
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-3"
                  }`}
                >
                  GG
                </span>

                {/* GYMGEM */}
                <span className={`absolute left-0 top-0 flex`}>
                  {"GYMGEM".split("").map((char, i, arr) => {
                    const delay = showFullName
                      ? i * 0.15
                      : (arr.length - i - 1) * 0.15;

                    return (
                      <span
                        key={i}
                        style={{
                          transitionDelay: `${delay}s`,
                        }}
                        className={`transition-all duration-300 ${
                          showFullName
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-2"
                        }`}
                      >
                        {char}
                      </span>
                    );
                  })}
                </span>
              </div>
            </Link>
          </div>

          <button
            className="block md:hidden text-blue-400 text-2xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>

          <div
            className={`flex-col md:flex-row md:flex gap-[14px] absolute md:static bg-white md:bg-transparent left-0 w-full md:w-auto top-[70px] md:top-auto shadow-md md:shadow-none transition-all duration-300 ease-in-out ${
              isOpen ? "flex" : "hidden"
            }`}
          >
            {/* ------------------------------------- */}

            <NavLink
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "text-[#ff7906] px-2 py-2 flex items-center"
                  : "hover:text-[#ff7906] px-2 py-2 flex items-center "
              }
            >
              <MdOutlineNotificationsActive className="text-[2rem] " />
            </NavLink>
            {/* ------------------------------------- */}

            <NavLink
              to="/#"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "text-[#ff7906] px-2 py-2 flex items-center "
                  : "hover:text-[#ff7906] px-2 py-2 flex items-center "
              }
            >
              <FaUserCircle className="text-[2rem]" />
            </NavLink>
          </div>
        </div>
      </nav>
      <nav className="bg-white text-black  flex justify-between items-center w-full relative border-0 border-b-1 border-[#6B7280]">
        <div className="w-[80%] mx-auto flex justify-start align-middle items-center p-2 ">
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              isActive
                ? "text-[#ff7906] px-4 py-2"
                : "hover:text-[#ff7906] px-4 py-2"
            }
          >
            Home
          </NavLink>
          {/* ------------------------------------- */}
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              isActive
                ? "text-[#ff7906] px-4 py-2"
                : "hover:text-[#ff7906] px-4 py-2"
            }
          >
            Profile
          </NavLink>
          {/* ------------------------------------- */}
          <NavLink
            to="/dashboardtrainer"
            onClick={() => setIsOpen(false)}
            end
            className={({ isActive }) =>
              [
                "relative inline-block px-2 py-2 transition-colors",
                "after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2",
                "after:-bottom-2 after:h-1 after:rounded after:transition-all after:duration-200",
                isActive
                  ? "text-[#ff7906] after:w-[100%] after:bg-[#ff7906] after:opacity-100"
                  : "text-black hover:text-[#ff7906] after:w-0 after:opacity-0",
              ].join(" ")
            }
          >
            Dashboard
          </NavLink>
          {/* ------------------------------------- */}
          <NavLink
            to="/coursestrainerdash"
            onClick={() => setIsOpen(false)}
            end
            className={({ isActive }) =>
              [
                "relative inline-block px-2 py-2 transition-colors",
                "after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2",
                "after:-bottom-2 after:h-1 after:rounded after:transition-all after:duration-200",
                isActive
                  ? "text-[#ff7906] after:w-[100%] after:bg-[#ff7906] after:opacity-100"
                  : "text-black hover:text-[#ff7906] after:w-0 after:opacity-0",
              ].join(" ")
            }
          >
            Courses
          </NavLink>
          {/* ------------------------------------- */}
          <NavLink
            to="/clienttrainerdash"
            onClick={() => setIsOpen(false)}
            end
            className={({ isActive }) =>
              [
                "relative inline-block px-2 py-2 transition-colors",
                "after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2",
                "after:-bottom-2 after:h-1 after:rounded after:transition-all after:duration-200",
                isActive
                  ? "text-[#ff7906] after:w-[100%] after:bg-[#ff7906] after:opacity-100"
                  : "text-black hover:text-[#ff7906] after:w-0 after:opacity-0",
              ].join(" ")
            }
          >
            Clients
          </NavLink>
          {/* ------------------------------------- */}
        </div>
      </nav>
    </>
  );
};

export default NavBarDash;
