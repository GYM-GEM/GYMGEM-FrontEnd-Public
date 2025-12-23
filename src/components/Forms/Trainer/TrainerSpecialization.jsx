import { useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../context/ToastContext";

const TrainerSpecialization = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1);
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });


  const onSubmit = async (data) => {
    const user = JSON.parse(localStorage.getItem("user"));

    const payload = {
      specialization: data.specialization,
      years_of_experience: data.years_of_experience,
      service_location: data.service_location,
      account: user.id
    };

    console.log(payload);

    try {
      const response = await axiosInstance.post(
        "/api/trainers/specializations",
        payload
      );

      showToast("trainer successful!", { type: "success" });
      navigate("/trainerExperience");
    } catch (error) {
      console.error("Error during registration:", error);
      showToast("failed. Please try again.", { type: "error" });
    }
  };





  return (
    <section className="min-h-screen bg-background px-4 py-16 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
        <header className="text-center">
          <h2 className="font-bebas text-4xl tracking-tight text-[#ff8211]">
            Trainer Specialization
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base text-[#555555]">
            Tell us about your expertise and rates.
          </p>
        </header>

        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm sm:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">

            {/* Specialization */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Specialization
              </label>
              <select
                {...register("specialization", {
                  required: "Specialization is required",
                })}
                className="h-11 w-full rounded-xl border border-border bg-background/80 px-3 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <option value="">Select your specialization</option>
                <option value={5}>Lifting</option>
                <option value={4}>Cardio</option>
                <option value={3}>Yoga</option>
                <option value={2}>Fitness</option>
                <option value={1}>Boxing</option>
              </select>
              {errors.specialization && (
                <p className="text-xs text-destructive">
                  {errors.specialization.message}
                </p>
              )}
            </div>

            {/* Years of Experience */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
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
                className="h-11 w-full rounded-xl border border-border bg-background/80 px-3 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted-foreground"
              />
              {errors.years_of_experience && (
                <p className="text-xs text-destructive">
                  {errors.years_of_experience.message}
                </p>
              )}
            </div>

            {/* Service Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Service Location
              </label>
              <select
                {...register("service_location", {
                  required: "Please select a service location",
                })}
                className="h-11 w-full rounded-xl border border-border bg-background/80 px-3 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <option value="">Select your service location</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="both">Both</option>
              </select>
              {errors.service_location && (
                <p className="text-xs text-destructive">
                  {errors.service_location.message}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-between gap-4 mt-4">
              <button
                type="button"
                onClick={() => navigate("/trainerExperience")}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-input bg-background px-6 text-sm font-medium transition hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Skip
              </button>
              <button
                type="submit"
                className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-[#ff8211] px-6 text-sm font-semibold text-white transition hover:bg-[#ff8211]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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

export default TrainerSpecialization;
