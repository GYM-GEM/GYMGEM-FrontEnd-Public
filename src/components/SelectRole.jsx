import trainer from "../assets/1trainer.png";
import trainer1 from "../assets/trainer1.png";
import weight from "../assets/weight.png";
import store from "../assets/store.png";
import Nutrition from "../assets/nutritionist.png";
import { useNavigate } from "react-router-dom";

const Selectrole = () => {
  const navigate = useNavigate();
  return (
    <>
      <section className="w-full bg-white">
        <div className="w-[80%] mx-auto">
          <div className="flex flex-col justify-center items-center w-full pt-[4rem] pb-[72px]">
            <div>
              <h1 className="bebas-bold text-[64px] text-[#FF8211]">
                Select Your Role
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-[1rem]">
            <div class="group bg-white rounded-[1rem] p-[2rem]  w-[30%] h-[270px]  shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-transparent hover:bg-[#FF8211] hover:text-white">
              <div className="pb-[0.25rem]">
                <img src={trainer1} width="50px" height="50px" />
              </div>
              <div className="pb-[0.75rem] bebas-bold text-[2rem] text-[#111111] group-hover:text-white ">
                <h4>Trainee</h4>
              </div>
              <div>
                <p className="poppins-regular text-[1.5rem] text-[#555555] group-hover:text-white">
                  Find courses, trainers, and nutrition plans to reach your
                  goals.
                </p>
              </div>
            </div>
            <div
              onClick={() => navigate("/trainerform")}
              class="group bg-white rounded-[1rem] p-[2rem]  w-[30%] h-[270px] shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer border border-transparent hover:bg-[#FF8211] hover:text-white"
            >
              <div className="pb-[0.25rem]">
                <img src={trainer} width="50px" height="50px" />
              </div>
              <div className="pb-[0.75rem] bebas-bold text-[2rem] text-[#111111] group-hover:text-white ">
                <h4>Trainer</h4>
              </div>
              <div>
                <p className="poppins-regular text-[1.5rem] text-[#555555] group-hover:text-white">
                  Create programs, guide trainees, and manage your sessions.
                </p>
              </div>
            </div>
            <div class="group bg-white rounded-[1rem] p-[2rem]  w-[30%] h-[270px] shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer border border-transparent hover:bg-[#FF8211] hover:text-white">
              <div className="pb-[0.25rem]">
                <img src={weight} width="50px" height="50px" />
              </div>
              <div className="pb-[0.75rem] bebas-bold text-[2rem] text-[#111111] group-hover:text-white">
                <h4>Gym</h4>
              </div>
              <div>
                <p className="poppins-regular text-[1.5rem] text-[#555555] group-hover:text-white">
                  Manage your gym, trainers, and members easily.
                </p>
              </div>
            </div>
            <div class="group bg-white rounded-[1rem] p-[2rem]  w-[30%] h-[270px] shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer border border-transparent hover:bg-[#FF8211] hover:text-white">
              <div className="pb-[0.25rem]">
                <img src={store} width="50px" height="50px" />
              </div>
              <div className="pb-[0.75rem] bebas-bold text-[2rem] text-[#111111] group-hover:text-white">
                <h4>Store</h4>
              </div>
              <div>
                <p className="poppins-regular text-[1.5rem] text-[#555555] group-hover:text-white">
                  Sell fitness products, supplements, and gear online.
                </p>
              </div>
            </div>
            <div class="group bg-white rounded-[1rem] p-[2rem]  w-[30%] h-[270px] shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer border border-transparent hover:bg-[#FF8211] text-white">
              <div className="pb-[0.25rem]">
                <img src={Nutrition} width="50px" height="50px" />
              </div>
              <div className="pb-[0.75rem] bebas-bold text-[2rem] text-[#111111] group-hover:text-white">
                <h4>Nutrition Specialist</h4>
              </div>
              <div>
                <p className="poppins-regular text-[1.5rem] text-[#555555] group-hover:text-white">
                  Offer diet plans and guide clients to healthier lifestyles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Selectrole;
