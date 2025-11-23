import { useState } from "react";
import { useForm } from "react-hook-form";
import form3 from "../../assets/form3.png";
import form2 from "../../assets/form2.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TrainerFormProfessional = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });


  const onSubmit = async (data) => {

    const user = JSON.parse(localStorage.getItem("user"));
    const payload = { ...data, account_id: user.id };
    console.log(payload)
    const token = localStorage.getItem('access')
    try {
      // Send POST request to backend
      const response = await axios.post("http://127.0.0.1:8000/api/trainers/specializations", payload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      console.log("Response:", response.data);
      alert("trainer successful!");
      navigate("/trainerform3");
    } catch (error) {
      console.error("Error during registration:", error);
      alert("failed. Please try again.");
    }
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
          <div className="w-full flex flex-col items-center pb-[1.5rem]">
            <h2 className="text-[2.5rem] bebas-regular  font-bold text-[#FF8211]">
              Trainer Professional Info
            </h2>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="relative z-10 flex flex-col gap-4 w-[50%]"
          >


            {/* Specialization */}
            <div>
              <label className="block text-md bebas-regular font-medium text-black poppins-medium">
                Specialization
              </label>
              <select
                {...register("specialization", {
                  required: "Specialization is required",
                })}
                className="block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select your specialization</option>
                <option value={5}>Lifting</option>
                <option value={4}>Cardio</option>
                <option value={3}>Yoga</option>
                <option value={2}>Fitness</option>
                <option value={1}>Boxing</option>
              </select>
              {errors.specialization && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.specialization.message}
                </p>
              )}
            </div>

            {/* Years of Experience */}
            <div>
              <label className="block text-md bebas-regularfont-medium text-black poppins-medium">
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
              <label className="block text-md bebas-regular font-medium text-black poppins-medium">
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
              <label className="block text-md bebas-regular font-medium text-black poppins-medium">
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
                onClick={() => navigate("/trainerform3")}
                className="bg-gray-500 text-white py-2 px-4 rounded transition hover:bg-gray-600"
              >
                Skip
              </button>
              <button
                type="submit"
                className="bg-[#FF8211] text-white py-2 px-4 rounded transition hover:bg-[#e9750f]"
              >
                Submit and go next
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default TrainerFormProfessional;
