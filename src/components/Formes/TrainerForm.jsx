import { useForm } from "react-hook-form";
import form3 from "../../assets/form3.png";
import form2 from "../../assets/form2.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Trainerform = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

 

  const onSubmit = async (data) => {

    const user = JSON.parse(localStorage.getItem("user"));
    const payload = { ...data ,account_id: user.account.id };
    console.log(payload)
    const token = user.access
    try {
      // Send POST request to backend
      const response = await axios.post("http://127.0.0.1:8000/api/trainers/create", payload, 
        {
          headers: {Authorization: `Bearer ${token}`}
        }
       ) ;
      console.log("Response:", response.data);
      alert("trainer successful!");
      navigate("/trainerform2");
    } catch (error) {
      console.error("Error during registration:", error);
      alert("failed. Please try again.");
    }
  };


  return (
    <>
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
              {/* <h2 className="text-2xl font-bold text-white text-center"> */}
              <h2 className="bebas-bold text-[2.5rem] text-[#FF8211] text-center">
                Trainer Form
              </h2>

              {/* ================= Name ================= */}
              <div>
                <label
                  htmlFor="name"
                  className=" text-[1.1rem] text-black "
                >
                  Name
                </label>
                <input
                  id="name"
                  placeholder="Enter your name"
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                  className="block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* ================= Age ================= */}
              {/* <div>
                <label
                  htmlFor="age"
                  className="font-bebas text-md  font-medium text-black poppins-medium"
                >
                  Age
                </label>
                <input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  {...register("age", {
                    required: "Age is required",
                    min: { value: 18, message: "Minimum age is 18" },
                    max: { value: 70, message: "Maximum age is 70" },
                  })}
                  className="block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {errors.age && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.age.message}
                  </p>
                )}
              </div> */}

              {/* ================= Gender ================= */}
              <div>
                <label
                  htmlFor="gender"
                  className="font-bebas text-md font-medium text-black poppins-medium"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  {...register("gender", {
                    required: "Please select your gender",
                  })}
                  className="block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select your gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.gender.message}
                  </p>
                )}
              </div>

              {/* ================= Date of Birth ================= */}
              <div>
                <label
                  htmlFor="dob"
                  className="font-bebas text-md font-medium text-black poppins-medium"
                >
                  Date of Birth
                </label>
                <input
                  id="dob"
                  type="date"
                  {...register("dob", {
                    required: "Date of birth is required",
                  })}
                  className="block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {errors.dob && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.dob.message}
                  </p>
                )}
              </div>

              {/* ================= Country ================= */}
              <div>
                <label
                  htmlFor="country"
                  className="font-bebas text-md font-medium text-black poppins-medium"
                >
                  Country
                </label>
                <input
                  id="country"
                  placeholder="Enter your country"
                  {...register("country", {
                    required: "Country is required",
                  })}
                  className="block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {errors.country && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.country.message}
                  </p>
                )}
              </div>

              {/* ================= ZIP Code ================= */}
              <div>
                <label
                  htmlFor="zip"
                  className="font-bebas text-md font-medium text-black poppins-medium"
                >
                  ZIP Code
                </label>
                <input
                  id="zip"
                  placeholder="Enter your ZIP code"
                  {...register("zip", {
                    required: "ZIP code is required",
                    pattern: {
                      value: /^[0-9]{4,6}$/,
                      message: "Invalid ZIP code format",
                    },
                  })}
                  className="block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {errors.zip && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.zip.message}
                  </p>
                )}
              </div>

              {/* ================= Phone ================= */}
              <div>
                <label
                  htmlFor="phone"
                  className="font-bebas text-md font-medium text-black poppins-medium"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{10,15}$/,
                      message: "Phone must be 10–15 digits",
                    },
                  })}
                  className="block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* ================= Submit ================= */}
              <button
                type="submit"
                className="w-full py-2 rounded-[0.5rem] bg-[#FF8211] text-white font-bebas text-[22px]  transition hover:bg-[#e9750f]"
              >
                Next
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Trainerform;
