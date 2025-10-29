import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaGem, FaUserCircle } from "react-icons/fa";
import Login from "./LoginForm";
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white text-black py-4 px-8 flex justify-between items-center w-[80%] m-auto relative">
      <Link
        to="/"
        className="flex items-center gap-2 text-2xl font-bold text-[#FF7A00]"
      >
        <FaGem className="text-[#7e9c4a]" />
        GYMGEM
      </Link>

      <button
        className="block md:hidden text-blue-400 text-2xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      <div
        className={`flex-col md:flex-row md:flex gap-[1rem] absolute md:static bg-white md:bg-transparent left-0 w-full md:w-auto top-[70px] md:top-auto shadow-md md:shadow-none transition-all duration-300 ease-in-out ${
          isOpen ? "flex" : "hidden"
        }`}
      >
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
          to="/Courses"
          onClick={() => setIsOpen(false)}
          className={({ isActive }) =>
            isActive
              ? "text-[#ff7906] px-4 py-2"
              : "hover:text-[#ff7906] px-4 py-2"
          }
        >
          Courses
        </NavLink>
        {/* ------------------------------------- */}

        <NavLink
          to="/Trainers"
          onClick={() => setIsOpen(false)}
          className={({ isActive }) =>
            isActive
              ? "text-[#ff7906] px-4 py-2"
              : "hover:text-[#ff7906] px-4 py-2"
          }
        >
          Trainers
        </NavLink>
        {/* ------------------------------------- */}
        {/* ------------------------------------- */}

        <NavLink
          to="/Trainees"
          onClick={() => setIsOpen(false)}
          className={({ isActive }) =>
            isActive
              ? "text-[#ff7906] px-4 py-2"
              : "hover:text-[#ff7906] px-4 py-2"
          }
        >
          Trainees
        </NavLink>
        {/* ------------------------------------- */}
        <NavLink
          to="/About"
          onClick={() => setIsOpen(false)}
          className={({ isActive }) =>
            isActive
              ? "text-[#ff7906] px-4 py-2"
              : "hover:text-[#ff7906] px-4 py-2"
          }
        >
          About
        </NavLink>
        {/* ------------------------------------- */}
        <NavLink
          to="/Login"
          onClick={() => setIsOpen(false)}
          className={({ isActive }) =>
            isActive
              ? "text-[#ff7906] px-4 py-2 flex items-center gap-2"
              : "hover:text-[#ff7906] px-4 py-2 flex items-center gap-2"
          }
        >
          <FaUserCircle className="text-2xl" />
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
