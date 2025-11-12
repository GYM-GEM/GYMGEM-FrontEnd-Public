import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaGem, FaUserCircle } from "react-icons/fa";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

const NavBarDash = () => {
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: "Home" },
    { to: "/TrainerprofileDash", label: "Profile" },
    { to: "/dashboardtrainer", label: "Dashboard" },
    { to: "/coursestrainerdash", label: "Courses" },
    { to: "/clienttrainerdash", label: "Clients" },
  ];

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
      <nav className="fixed w-full top-0 left-0 z-50 bg-background/80 backdrop-blur-sm border-b border-muted">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="flex items-center gap-2 text-lg font-semibold tracking-wide text-primary transition hover:text-primary/80"
            >
              <FaGem
                className={`text-secondary transition-transform duration-500 ${
                  showFullName ? "scale-105" : "scale-100"
                }`}
              />
              <span className="relative h-6 w-24 overflow-hidden">
                <span
                  className={`absolute inset-0 font-bebas text-2xl transition-all duration-500 ${
                    showGG
                      ? "translate-y-0 opacity-100"
                      : "-translate-y-2 opacity-0"
                  }`}
                >
                  GG
                </span>
                <span className="absolute inset-0 flex items-center font-bebas text-2xl tracking-tight">
                  {"GYMGEM".split("").map((char, index, arr) => {
                    const delay = showFullName
                      ? index * 0.1
                      : (arr.length - index - 1) * 0.1;
                    return (
                      <span
                        key={char + index}
                        style={{ transitionDelay: `${delay}s` }}
                        className={`transition-all duration-300 ${
                          showFullName
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

            <div className="hidden md:flex flex-1 justify-center">
              <div className="inline-flex items-center gap-6 bg-transparent px-4 py-1 rounded-full">
                {links.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end
                    className={({ isActive }) =>
                      [
                        "relative inline-block mx-3 px-3 py-2 transition-colors duration-200",
                        isActive
                          ? "text-[#ff7906]"
                          : "text-gray-900 hover:text-[#ff7906]",
                        "after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2",
                        "after:-bottom-3 after:h-[4px] after:rounded-full after:transition-all after:duration-200",
                        "after:bg-[#dca16d]",
                        isActive
                          ? "after:w-[100%] after:opacity-100"
                          : "after:w-0 after:opacity-0",
                      ].join(" ")
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-3">
              <NavLink
                to="/notifications"
                className="text-xl text-muted-foreground hover:text-primary"
                aria-label="Notifications"
              >
                <MdOutlineNotificationsActive />
              </NavLink>
              <NavLink
                to="/TrainerprofileDash"
                className="text-2xl text-muted-foreground hover:text-primary"
                aria-label="Profile"
              >
                <FaUserCircle />
              </NavLink>

              {/* Mobile toggle */}
              <button
                className="md:hidden p-2 rounded-md bg-background/60 border border-muted text-foreground"
                onClick={() => setOpen((s) => !s)}
                aria-label="Toggle menu"
              >
                {open ? (
                  <HiOutlineX className="h-5 w-5" />
                ) : (
                  <HiOutlineMenu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu panel */}
        <div className={`${open ? "block" : "hidden"} md:hidden px-4 pb-4`}>
          <div className="mt-3 bg-surface rounded-lg shadow-sm border border-muted p-4 space-y-2">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "block text-primary px-3 py-2 rounded"
                    : "block text-foreground px-3 py-2 rounded hover:bg-background/50"
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* spacer so content isn't hidden behind fixed nav */}
      <div className="h-16" />
    </>
  );
};

export default NavBarDash;
