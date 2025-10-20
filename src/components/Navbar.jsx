import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white text-black py-4 px-8 flex justify-between items-center w-[90%] m-auto relative">
      <Link to="/" className="text-2xl font-bold text-blue-400">
        Logo
      </Link>

      <button
        className="block md:hidden text-blue-400 text-2xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      <div
        className={`flex-col md:flex-row md:flex gap-[2rem] absolute md:static bg-white md:bg-transparent left-0 w-full md:w-auto top-[70px] md:top-auto shadow-md md:shadow-none transition-all duration-300 ease-in-out ${
          isOpen ? "flex" : "hidden"
        }`}
      >
        <NavLink
          to="/"
          onClick={() => setIsOpen(false)}
          className={({ isActive }) =>
            isActive
              ? "text-blue-400 px-4 py-2"
              : "hover:text-blue-300 px-4 py-2"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          onClick={() => setIsOpen(false)}
          className={({ isActive }) =>
            isActive
              ? "text-blue-400 px-4 py-2"
              : "hover:text-blue-300 px-4 py-2"
          }
        >
          About
        </NavLink>
        <NavLink
          to="/contact"
          onClick={() => setIsOpen(false)}
          className={({ isActive }) =>
            isActive
              ? "text-blue-400 px-4 py-2"
              : "hover:text-blue-300 px-4 py-2"
          }
        >
          Contact
        </NavLink>
        <NavLink
          to="/contact"
          onClick={() => setIsOpen(false)}
          className={({ isActive }) =>
            isActive ? "text-blue-400 px-4 " : "hover:text-blue-300 px-4 py-2"
          }
        >
          Contact
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
