import { useForm } from "react-hook-form";
import form3 from "../../assets/form3.png";
import form2 from "../../assets/form2.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Trainerexp = () => {
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ mode: "onChange" });



    const onSubmit = async (data) => {

        const user = JSON.parse(localStorage.getItem("user"));
        const payload = { ...data, account_id: user.id };
        console.log(payload)
        const token = localStorage.getItem("access");
        try {
            // Send POST request to backend
            const response = await axios.post("http://127.0.0.1:8000/api/trainers/experiences", payload,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            console.log("Response:", response.data);
            alert("trainer successful!");
            navigate("/");
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
                                Trainer Experience
                            </h2>

                            {/* ================= Work Place ================= */}
                            <div>
                                <label className="block text-md bebas-regular font-medium text-black poppins-medium">
                                    Work Place
                                </label>
                                <input
                                    placeholder="Enter your workplace"
                                    {...register("work_place")}
                                    className="block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            {/* ================= Position ================= */}
                            <div>
                                <label className="block text-md bebas-regular font-medium text-black poppins-medium">
                                    Position
                                </label>
                                <input
                                    placeholder="Enter your position"
                                    {...register("position")}
                                    className="block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            {/* ================= Start Date ================= */}
                            <div>
                                <label className="block text-md bebas-regular font-medium text-black poppins-medium">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    {...register("start_date")}
                                    className="block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            {/* ================= End Date ================= */}
                            <div>
                                <label className="block text-md bebas-regular font-medium text-black poppins-medium">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    {...register("end_date")}
                                    className="block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            {/* ================= Description ================= */}
                            <div>
                                <label className="block text-md bebas-regular font-medium text-black poppins-medium">
                                    Description
                                </label>
                                <textarea
                                    placeholder="Describe your work experience"
                                    {...register("description")}
                                    className="block w-full rounded-[0.5rem] bg-white border border-black px-3 py-1.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                                ></textarea>
                            </div>


                            {/* ================= Submit ================= */}
                            <div className="flex justify-between mt-2">
                                <button
                                    type="button"
                                     onClick={() => navigate("/")}
                                    className="bg-gray-500 text-white py-2 px-4 rounded transition hover:bg-gray-600"
                                >
                                    Skip
                                </button>
                                <button
                                    type="submit"
                                    className="bg-[#FF8211] text-white py-2 px-4 rounded transition hover:bg-[#e9750f]"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Trainerexp;
