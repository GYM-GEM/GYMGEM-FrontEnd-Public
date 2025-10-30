import { useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import cover_img from "../assets/cover.svg";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    alert("Sign up successful!");
    navigate("/role");
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row">
      {/* ========== Left Side (Image) ========== */}
      <div className="hidden md:block md:w-1/2 h-full bg-[#FF8211]">
        <img
          src={cover_img}
          alt="cover"
          className="w-full h-full object-cover"
        />
      </div>

      {/* ========== Right Side (Form) ========== */}
      <div className="w-full md:w-1/2 h-full flex items-center justify-center bg-white">
        <div className="bg-white flex flex-col items-center justify-center p-2 sm:p-10 md:p-20 w-full h-auto md:h-full mx-auto">
          <div className="w-full max-w-md flex flex-col">
            <div className="pb-[2.375rem]">
              <h3 className="text-[23px] sm:text-[25px] md:text-[27px] font-bold text-center md:text-left font-bebas">
                THE HIDDEN GEMS OF FITNESS — ALL IN ONE PLACE
              </h3>
              <p className="poppins-medium text-sm sm:text-md text-gray-500 text-center md:text-left ">
                Sign up and begin your fitness journey
              </p>
            </div>

            {/* --------------------------------------------- Form ------------------------------------------ */}
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              {/* First Name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-black poppins-medium"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  {...register("firstName", {
                    required: "First name is required",
                    minLength: {
                      value: 2,
                      message: "Minimum 2 characters",
                    },
                  })}
                  className="mt-[3px] block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="mt-[1rem]">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-black poppins-medium"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                  className="mt-[3px] block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              {/* Username */}
              <div className="mt-[1rem]">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-black poppins-medium"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  {...register("username", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "At least 3 characters",
                    },
                  })}
                  className="mt-[3px] block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="mt-[1rem]">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-black poppins-medium"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address such as example@ex.com",
                    },
                  })}
                  className="mt-[3px] block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="mt-[1rem]">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-black poppins-medium"
                >
                  Password
                </label>
                <div className="mt-[3px] relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password", {
                      required: "Password is required",
                      pattern: {
                        value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/,
                        message:
                          "Must contain uppercase, lowercase and a number",
                      },
                    })}
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
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mt-[1rem]">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-black poppins-medium"
                >
                  Confirm Password
                </label>
                <div className="mt-[3px] relative">
                  <input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm your password"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (val) =>
                        val === watch("password") || "Passwords do not match",
                    })}
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
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <div className="mt-[1rem] cursor-pointer">
                <button
                  type="submit"
                  className="cursor-pointer w-full py-2 rounded-[0.5rem] bg-[#FF8211] text-white font-bebas transition duration-300 ease-in-out hover:bg-[#e9750f]"
                >
                  SIGN UP
                </button>
              </div>

              <div className="text-center mt-[0.5rem]">
                <Link to="/Login">
                  <p className="font-[500] text-[0.875rem] poppins-medium text-[#666666]">
                    Already have an account?
                  </p>
                </Link>
              </div>

              {/* Divider */}
              <div className="flex items-center align-middle justify-center gap-3 pt-[1rem] pb-[1rem] ">
                <div className="h-px w-1/4 bg-gray-300"></div>
                <span className="text-gray-500 text-sm poppins-medium">or</span>
                <div className="h-px w-1/4 bg-gray-300"></div>
              </div>

              {/* Google Button */}
              <button
                type="button"
                className="flex items-center justify-center gap-2 w-full py-2 rounded-[0.5rem] bg-white border border-gray-300 text-black poppins-medium transition duration-300 ease-in-out hover:bg-gray-100"
              >
                <FcGoogle className="text-xl" />
                LOG IN WITH GOOGLE
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
