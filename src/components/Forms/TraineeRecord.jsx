import { useForm } from "react-hook-form";
import form3 from "../../assets/form3.png";
import form2 from "../../assets/form2.svg";
import { useToast } from "../../context/ToastContext";
import { useNavigate } from "react-router-dom";


const TraineeRecordForm = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const { showToast } = useToast();

  const onSubmit = (data) => {
    console.log("Trainee Record Data:", data);
    showToast("Record submitted successfully!", { type: "success" });
  };

  return (
    <section
      className="w-full h-screen bg-no-repeat bg-center bg-cover flex items-center justify-center relative"
      style={{ backgroundImage: `url(${form3})` }}
    >
      <div
        className="relative w-[45rem] h-full bg-no-repeat bg-center bg-cover rounded-lg shadow-lg p-8 flex flex-col justify-center"
        style={{ backgroundImage: `url(${form2})` }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative z-10 flex flex-col gap-4 w-[50%] mx-auto"
        >
          <h2 className="bebas-bold text-[2.5rem] text-[#FF8211] text-center">
            Trainee Record
          </h2>

          {/* ================= Record Date ================= */}
          <div>
            <label className="poppins-medium">Record Date</label>
            <input
              type="date"
              {...register("record_date", {
                required: "Record date is required",
              })}
              className="block w-full rounded bg-white border border-black px-3 py-1.5"
            />
            {errors.record_date && (
              <p className="text-red-500">{errors.record_date.message}</p>
            )}
          </div>

          {/* ================= Weight ================= */}
          <div>
            <label className="poppins-medium">Weight (kg)</label>
            <input
              type="number"
              step="0.01"
              {...register("weight", {
                required: "Weight is required",
                min: { value: 20, message: "Too low" },
                max: { value: 350, message: "Too high" },
              })}
              className="block w-full rounded bg-white border border-black px-3 py-1.5"
            />
            {errors.weight && (
              <p className="text-red-500">{errors.weight.message}</p>
            )}
          </div>

          {/* ================= Height ================= */}
          <div>
            <label className="poppins-medium">Height (cm)</label>
            <input
              type="number"
              step="0.01"
              {...register("height", {
                required: "Height is required",
                min: { value: 50, message: "Too low" },
                max: { value: 250, message: "Too high" },
              })}
              className="block w-full rounded bg-white border border-black px-3 py-1.5"
            />
            {errors.height && (
              <p className="text-red-500">{errors.height.message}</p>
            )}
          </div>

          {/* ================= Body Fat ================= */}
          <div>
            <label className="poppins-medium">Body Fat %</label>
            <input
              type="number"
              step="0.01"
              {...register("body_fat_percentage", {
                required: "Body fat percentage is required",
                min: { value: 1, message: "Too low" },
                max: { value: 70, message: "Too high" },
              })}
              className="block w-full rounded bg-white border border-black px-3 py-1.5"
            />
            {errors.body_fat_percentage && (
              <p className="text-red-500">
                {errors.body_fat_percentage.message}
              </p>
            )}
          </div>

          {/* ================= Muscle Mass ================= */}
          <div>
            <label className="poppins-medium">Muscle Mass (kg)</label>
            <input
              type="number"
              step="0.01"
              {...register("muscle_mass", {
                required: "Muscle mass is required",
              })}
              className="block w-full rounded bg-white border border-black px-3 py-1.5"
            />
            {errors.muscle_mass && (
              <p className="text-red-500">{errors.muscle_mass.message}</p>
            )}
          </div>

          {/* ================= Bone Mass ================= */}
          <div>
            <label className="poppins-medium">Bone Mass (kg)</label>
            <input
              type="number"
              step="0.01"
              {...register("bone_mass", { required: "Bone mass is required" })}
              className="block w-full rounded bg-white border border-black px-3 py-1.5"
            />
            {errors.bone_mass && (
              <p className="text-red-500">{errors.bone_mass.message}</p>
            )}
          </div>

          {/* ================= Body Water ================= */}
          <div>
            <label className="poppins-medium">Body Water %</label>
            <input
              type="number"
              step="0.01"
              {...register("body_water_percentage", {
                required: "Body water percentage is required",
              })}
              className="block w-full rounded bg-white border border-black px-3 py-1.5"
            />
            {errors.body_water_percentage && (
              <p className="text-red-500">
                {errors.body_water_percentage.message}
              </p>
            )}
          </div>

          {/* ================= BMR ================= */}
          <div>
            <label className="poppins-medium">BMR</label>
            <input
              type="number"
              step="0.01"
              {...register("BMR", {
                required: "BMR is required",
              })}
              className="block w-full rounded bg-white border border-black px-3 py-1.5"
            />
            {errors.BMR && <p className="text-red-500">{errors.BMR.message}</p>}
          </div>

          <div className="flex justify-between mt-2">
            {/* Skip Button */}
            <button
              type="button"
              onClick={() => navigate("/traine/profile")}
              className="bg-gray-500 text-white py-2 px-4 rounded transition hover:bg-gray-600"
            >
              Skip
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-[#FF8211] text-white py-2 px-4 rounded transition hover:bg-[#e9750f]"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default TraineeRecordForm;
