import { useState } from "react";
import { useForm } from "react-hook-form";
import form3 from "../../assets/form3.png";
import form2 from "../../assets/form2.svg";

const TrainerFormProfessional = () => {
  const [step, setStep] = useState(1);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const onSubmit = (data) => {
    console.log("Trainer Form Data:", data);
    alert("Trainer form submitted successfully!");
  };

  const handleSkip = () => {
    alert("Step skipped!");
  };

  return (
    <section
      className="w-full h-screen bg-no-repeat bg-center bg-cover flex items-center justify-center relative"
      style={{ backgroundImage: `url(${form3})` }}
    >
      <div
        className="relative w-[45rem] h-full bg-no-repeat bg-center bg-cover rounded-lg shadow-lg p-8 flex flex-col justify-center ms-15"
        style={{ backgroundImage: `url(${form2})` }}
      >
        <div className="w-[100%] flex flex-col justify-center items-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="relative z-10 flex flex-col gap-4 w-[50%]"
          >
            <h2 className="text-2xl font-bold text-[#FF8211] text-center">
              Trainer Professional Info
            </h2>

            {/* Specialization */}
            <div>
              <label className="block text-sm font-medium text-black poppins-medium">
                Specialization
              </label>
              <input
                placeholder="Enter your specialization"
                {...register("specialization", {
                  required: "Specialization is required",
                  maxLength: { value: 100, message: "Max 100 characters" },
                })}
                className="block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {errors.specialization && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.specialization.message}
                </p>
              )}
            </div>

            {/* Years of Experience */}
            <div>
              <label className="block text-sm font-medium text-black poppins-medium">
                Years of Experience
              </label>
              <input
                type="number"
                placeholder="Enter years of experience"
                {...register("years_of_experience", {
                  required: "Years of experience is required",
                  min: { value: 0, message: "Minimum is 0" },
                  max: { value: 50, message: "Maximum is 50" },
                })}
                className="block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {errors.years_of_experience && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.years_of_experience.message}
                </p>
              )}
            </div>

            {/* Hourly Rate */}
            <div>
              <label className="block text-sm font-medium text-black poppins-medium">
                Hourly Rate ($)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="Enter your hourly rate"
                {...register("hourly_rate", {
                  required: "Hourly rate is required",
                  min: { value: 0, message: "Minimum rate is 0" },
                })}
                className="block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {errors.hourly_rate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.hourly_rate.message}
                </p>
              )}
            </div>

            {/* Service Location */}
            <div>
              <label className="block text-sm font-medium text-black poppins-medium">
                Service Location
              </label>
              <select
                {...register("service_location", {
                  required: "Please select a service location",
                })}
                className="block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select your service location</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="both">Both</option>
              </select>
              {errors.service_location && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.service_location.message}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-2">
              <button
                type="button"
                onClick={handleSkip}
                className="bg-gray-500 text-white py-2 px-4 rounded transition hover:bg-gray-600"
              >
                Skip
              </button>
              <button
                type="submit"
                className="bg-[#FF8211] text-white py-2 px-4 rounded transition hover:bg-[#e9750f]"
              >
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default TrainerFormProfessional;
