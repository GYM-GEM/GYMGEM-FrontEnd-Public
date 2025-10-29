import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useFormHandler from "./useFormHandler";
import { Link } from "react-router-dom";

const SignUp = () => {
  const {
    formData,
    errors,
    handleChange,
    handleSubmit,
    showPassword,
    setShowPassword,
    showConfirm,
    setShowConfirm,
  } = useFormHandler();

  return (
    <div className="bg-white flex flex-col items-center justify-center p-2 sm:p-10 md:p-20 w-full h-auto md:h-full mx-auto">
      <div className="w-full max-w-md flex flex-col">

        <div className="pb-[2.375rem]">
          <div>
            <h3 className="text-[23px] sm:text-[25px] md:text-[27px] font-bold text-center md:text-left font-bebas">
              THE HIDDEN GEMS OF FITNESS — ALL IN ONE PLACE
            </h3>
          </div>

          <div>
            <p className="font-medium text-sm sm:text-md text-gray-500 text-center md:text-left ">
              Sign up and begin your fitness journey
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className=" w-full">

          {/* Full Name */}

          <div>
            <div>
              <label
                htmlFor="Full Name"
                className="block text-sm font-medium text-black"
              >
                Full Name
              </label>
            </div>
            {/* ------------------------------------ */}
            <div>
              <input
                id="Full name"
                name="Full name"
                type="Full name"
                placeholder="Enter your full name"
                // value={formData.email}
                onChange={handleChange}
                className="mt-[3px] block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

          </div>
          {/*========================================================== Email============================================================ */}

          <div className="mt-[1rem]">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-black"
            >
              Email or username
            </label>
          </div>
          {/* ------------------------------------ */}
          <div>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email or username"
              value={formData.email}
              onChange={handleChange}
              className="mt-[3px] block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/*============================================================Password============================================================ */}
          <div className="mt-[1rem]">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-black"
              >
                Password
              </label>
            </div>
            <div className="mt-[3px] relative">
              {/* ------------------------------------ */}
              <input
                id="password"
                name="password"
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className="block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* ============================================================Confirm Password============================================================ */}
          <div className="mt-[1rem]">
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-black"
              >
                Confirm Password
              </label>
            </div>

            <div className="mt-[3px] relative">
              {/* ------------------------------------ */}
              <input
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your Password"
                type={showConfirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                className="block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-2 text-gray-600"
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* ============================================================Submit ============================================================*/}
          <div className="mt-[1rem]">
            <button
              type="submit"
              className="w-full py-2 rounded-[0.5rem] bg-[#FF8211] text-white font-semibold transition duration-300 ease-in-out hover:bg-[#e9750f]"
            >
              SIGN UP
            </button>
          </div>
          <div className="text-center mt-[0.5rem]">
            <Link to="/signup"> <p className="font-[500] text-[0.875rem] text-[#666666]">Already have an account?</p> </Link>
          </div>
          {/* ============================================================Divider============================================================ */}
          <div className="flex items-center align-middle justify-center gap-3 pt-[1rem] pb-[1rem] ">
            <div className="h-px w-1/4 bg-gray-300"></div>
            <div> <span className="text-gray-500 text-sm font-medium">or</span></div>
            <div className="h-px w-1/4 bg-gray-300"></div>
          </div>

          <button
            type="button"
            className="flex items-center justify-center gap-2 w-full py-2 rounded-[0.5rem] bg-white border border-gray-300 text-black font-medium transition duration-300 ease-in-out hover:bg-gray-100"
          >
            <FcGoogle className="text-xl" />
            LOG IN WITH GOOGLE
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
