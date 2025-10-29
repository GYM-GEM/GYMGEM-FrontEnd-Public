import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useFormHandler from "./useFormHandler";
import { Link } from "react-router-dom";

const Login = () => {
  const {
    formData,
    errors,
    handleChange,
    handleSubmit,
    showPassword,
    setShowPassword,
  } = useFormHandler();

  return (
    <div className="bg-white flex flex-col items-center justify-center p-2 sm:p-10 md:p-20 w-full h-auto md:h-full mx-auto">
      <div className="w-full max-w-md flex flex-col">
        <div>
          <h3 className="font-bebas text-2xl sm:text-3xl md:text-4xl font-bold text-center md:text-left ">
            WELCOME BACK!
          </h3>
        </div>
        <div className="pt-[6px]">
          <p className="poppins-semibold text-sm sm:text-md text-gray-500 text-center md:text-left font-poppins">
            Log in to continue your fitness journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 w-full">
          {/* ================= Email ================= */}
          <div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm poppins-medium text-black "
              >
                Email or username
              </label>
            </div>

            <div className="mt-[3px]">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email or username"
                value={formData.email}
                onChange={handleChange}
                className=" block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500 poppins-light"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="flex justify-between w-full mt-[1rem]">
            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-black poppins-medium"
              >
                Password
              </label>
            </div>

            <div>
              <a
                href="#"
                className="text-sm font-semibold text-[#FF8211] hover:text-indigo-300 poppins-medium"
              >
                Forgot password?
              </a>
            </div>
          </div>

          <div className="mt-[3px] relative">
            <div>
              <input
                id="password"
                name="password"
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className="poppins-light block w-full rounded-md bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-gray-600 "
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="mt-[1rem]">
            <button
              type="submit"
              className="w-full py-2 rounded-[0.5rem] bg-[#FF8211] text-white font-bebas text-[18px] transition duration-300 ease-in-out hover:bg-[#e9750f] "
            >
              SIGN IN
            </button>
          </div>

          <div className="text-center mt-[0.5rem]">
            <Link to="/register">
              {" "}
              <p className="font-[500] text-[0.875rem] text-[#666666] poppins-">
                Don’t have an account? [Join the GymGem]
              </p>{" "}
            </Link>
          </div>
          {/* ================= Divider ================= */}
          <div className="flex items-center justify-center gap-3 pt-[1rem] pb-[1rem]">
            <div className="h-px w-1/4 bg-gray-300"></div>
            <span className="text-gray-500 text-sm font-medium poppins-medium">
              or
            </span>
            <div className="h-px w-1/4 bg-gray-300"></div>
          </div>

          {/* ================= Google Login ================= */}
          <button
            type="button"
            className="flex items-center justify-center gap-2 w-full py-2 rounded-md bg-white poppins-medium border border-gray-300 text-black transition duration-300 ease-in-out hover:bg-gray-100"
          >
            <FcGoogle className="text-xl" />
            LOG IN WITH GOOGLE
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
