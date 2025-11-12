import trainer from "../assets/1trainer.png";
import trainer1 from "../assets/trainer1.png";
import weight from "../assets/weight.png";
import store from "../assets/store.png";
import Nutrition from "../assets/nutritionist.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { Pause } from "lucide-react";
const Selectrole = () => {
  const navigate = useNavigate();



  const [selectedRole, setSelectedRole] = useState("");



  const onSubmit = async () => {
    if (!selectedRole) {
      alert("Please select a role first!");
      return;
    }
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const payload = { profile_type: selectedRole, account: user.account.id };
      console.log(user)
      console.log(payload)
      const token = user.access
      console.log(token)
      const response = await axios.post(
        "http://127.0.0.1:8000/api/profiles/create",
        payload,
        {
          headers: {Authorization: `Bearer ${token}`}
        }
      );
      console.log("Response:", response.data);
      alert(`${selectedRole} profile created successfully!`);

      if (selectedRole === "trainer") navigate("/trainerform");
      else if (selectedRole === "trainee") navigate("/traineeform");
      else navigate("/");
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Failed. Please try again.");
    }
  };






  return (
    <>
      <section className="w-full bg-white">
        <div className="w-[80%] mx-auto">
          <div className="flex flex-col justify-center items-center w-full pt-[4rem] pb-[72px]">
            <h1 className="bebas-bold text-[64px] text-[#FF8211]">Select Your Role</h1>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-[1rem]">
            <div
              onClick={() => setSelectedRole("trainee")}
              className={`group rounded-[1rem] p-[2rem] w-[30%] h-[270px] shadow-md transition-all duration-300 cursor-pointer border border-transparent
    ${selectedRole === "trainee"
                  ? "bg-[#FF8211] text-white shadow-lg -translate-y-1"
                  : "bg-white text-[#111111] hover:bg-[#FF8211] hover:text-white hover:shadow-lg hover:-translate-y-1"
                }`}
            >
              <div className="pb-[0.25rem]">
                <img src={trainer1} width="50px" height="50px" />
              </div>
              <div className={`pb-[0.75rem] bebas-bold text-[2rem] ${selectedRole === "trainee" ? "text-white" : "text-[#111111] group-hover:text-white"}`}>
                <h4>Trainee</h4>
              </div>
              <p className={`${selectedRole === "trainee" ? "text-white" : "text-[#555555] group-hover:text-white"} poppins-regular text-[1.5rem]`}>
                Find courses, trainers, and nutrition plans to reach your goals.
              </p>
            </div>


            <div
              onClick={() => setSelectedRole("trainer")}
              className={`group rounded-[1rem] p-[2rem] w-[30%] h-[270px] shadow-md transition-all duration-300 cursor-pointer border border-transparent
           ${selectedRole === "trainer"
                  ? "bg-[#FF8211] text-white shadow-lg -translate-y-1"
                  : "bg-white text-[#111111] hover:bg-[#FF8211] hover:text-white hover:shadow-lg hover:-translate-y-1"
                }`}
            >
              <div className="pb-[0.25rem]">
                <img src={trainer} width="50px" height="50px" />
              </div>
              <div className={`pb-[0.75rem] bebas-bold text-[2rem] ${selectedRole === "trainer" ? "text-white" : "text-[#111111] group-hover:text-white"}`}>
                <h4>Trainer</h4>
              </div>
              <p className={`${selectedRole === "trainer" ? "text-white" : "text-[#555555] group-hover:text-white"} poppins-regular text-[1.5rem]`}>
                Create programs, guide trainees, and manage your sessions.
              </p>
            </div>


            <div
              onClick={() => setSelectedRole("gym")}
              className={`group rounded-[1rem] p-[2rem] w-[30%] h-[270px] shadow-md transition-all duration-200 cursor-pointer border border-transparent
    ${selectedRole === "gym"
                  ? "bg-[#FF8211] text-white shadow-lg -translate-y-1"
                  : "bg-white text-[#111111] hover:bg-[#FF8211] hover:text-white hover:shadow-lg hover:-translate-y-1"
                }`}
            >
              <div className="pb-[0.25rem]">
                <img src={weight} width="50px" height="50px" />
              </div>
              <div className={`pb-[0.75rem] bebas-bold text-[2rem] ${selectedRole === "gym" ? "text-white" : "text-[#111111] group-hover:text-white"}`}>
                <h4>Gym</h4>
              </div>
              <p className={`${selectedRole === "gym" ? "text-white" : "text-[#555555] group-hover:text-white"} poppins-regular text-[1.5rem]`}>
                Manage your gym, trainers, and members easily.
              </p>
            </div>


            <div
              onClick={() => setSelectedRole("store")}
              className={`group rounded-[1rem] p-[2rem] w-[30%] h-[270px] shadow-md transition-all duration-200 cursor-pointer border border-transparent
    ${selectedRole === "store"
                  ? "bg-[#FF8211] text-white shadow-lg -translate-y-1"
                  : "bg-white text-[#111111] hover:bg-[#FF8211] hover:text-white hover:shadow-lg hover:-translate-y-1"
                }`}
            >
              <div className="pb-[0.25rem]">
                <img src={store} width="50px" height="50px" />
              </div>
              <div className={`pb-[0.75rem] bebas-bold text-[2rem] ${selectedRole === "store" ? "text-white" : "text-[#111111] group-hover:text-white"}`}>
                <h4>Store</h4>
              </div>
              <p className={`${selectedRole === "store" ? "text-white" : "text-[#555555] group-hover:text-white"} poppins-regular text-[1.5rem]`}>
                Sell fitness products, supplements, and gear online.
              </p>
            </div>

            <div
              onClick={() => setSelectedRole("nutrition")}
              className={`group rounded-[1rem] p-[2rem] w-[30%] h-[270px] shadow-md transition-all duration-200 cursor-pointer border border-transparent
    ${selectedRole === "nutrition"
                  ? "bg-[#FF8211] text-white shadow-lg -translate-y-1"
                  : "bg-white text-[#111111] hover:bg-[#FF8211] hover:text-white hover:shadow-lg hover:-translate-y-1"
                }`}
            >
              <div className="pb-[0.25rem]">
                <img src={Nutrition} width="50px" height="50px" />
              </div>
              <div className={`pb-[0.75rem] bebas-bold text-[2rem] ${selectedRole === "nutrition" ? "text-white" : "text-[#111111] group-hover:text-white"}`}>
                <h4>Nutrition Specialist</h4>
              </div>
              <p className={`${selectedRole === "nutrition" ? "text-white" : "text-[#555555] group-hover:text-white"} poppins-regular text-[1.5rem]`}>
                Offer diet plans and guide clients to healthier lifestyles.
              </p>
            </div>
          </div>


          <div className="flex justify-center mt-6">
            <button
              onClick={onSubmit}
              disabled={!selectedRole}
              className="py-3 px-6 bg-[#FF8211] text-white rounded-md font-bold hover:bg-[#e9750f] disabled:opacity-50"
            >
              Confirm Role
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Selectrole;
