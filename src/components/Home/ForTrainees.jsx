import { Check, Clock, Dumbbell } from "lucide-react";
import traineesImg from "../../assets/trainees.png";

function ForTrainees() {
  return (
    <section className="w-full  pt-[3.75rem] pb-[3.75rem]">
      <div className="flex flex-col lg:flex-row  w-full overflow-hidden bg-[#FFF8F0]">
        <div className="lg:w-[75%] flex flex-col justify-center">
          {/* -------------------------------------------------------------------- */}
          <div className=" w-[80%] mx-auto mt-[3.75rem]">
            <div>
              <h3 className="text-[2.5rem] font-bold text-[#FF8211] uppercase tracking-wider font-bebas ">
                FOR TRAINEES
              </h3>
            </div>
            <div className="mt-[0.5rem] w-[100%]">
              <p className="lg:text-[1.5rem] md:text-xl  text-[#555555] poppins-regular leading-[2rem]  ">
                Everything you need to reach your fitness goals — with expert
                trainers, flexible classes, and top gyms in one place.
              </p>
            </div>
          </div>
          {/* -------------------------------------------------------------------- */}
          <div className=" mt-[3.75rem] w-[80%] mx-auto ">
            <div>
              <div className="flex items-start ">
                <Check className="w-5 h-5 text-[#6AA84F] mr-3 mt-[2px] flex-shrink-0" />
                <h4 className="text-[1rem] font-semibold text-[#333333] poppins-medium">
                  Personalized Training Plans
                </h4>
              </div>
              <div className="pt-[0.5rem]">
                <p className="text-gray-700 text-base ml-8 poppins-regular">
                  Work with certified trainers who tailor workouts to your
                  goals.
                </p>
              </div>
            </div>

            <div className="pt-[1rem]">
              <div className="flex items-start ">
                <Clock className="w-5 h-5 text-[#4A86E8] mr-3 mt-[2px] flex-shrink-0" />
                <h4 className="text-lg font-semibold text-[#333333] poppins-medium">
                  Flexible Classes
                </h4>
              </div>
              <div className="pt-[0.5rem]">
                <p className="text-gray-700 text-base ml-8 poppins-regular">
                  Join live or recorded sessions anytime, anywhere.
                </p>
              </div>
            </div>

            <div className="pt-[1rem]">
              <div className="flex items-start mb-1">
                <Dumbbell className="w-5 h-5 text-[#134F5C] mr-3 mt-[2px] flex-shrink-0" />
                <h4 className="text-lg font-semibold text-[#333333] poppins-medium">
                  Access to Top Gyms
                </h4>
              </div>
              <div className="pt-[0.5rem]">
                <p className="text-gray-700 text-base ml-8 poppins-regular">
                  Discover and compare gyms near you for the best experience.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-end w-full items-end pb-[1rem]">
            <a
              href="#"
              className="mt-12 pe-[0.5rem] text-[#FF8211] poppins-regular text-lg hover:text-[#FFAB63]   transition duration-300 "
            >
              Find Your Trainer Now
              <span className="ml-2 text-xl">→</span>
            </a>
          </div>
        </div>

        <div className="lg:w-[50%] relative">
          <div
            className="w-full h-full bg-cover bg-center clip-diagonal2"
            style={{ backgroundImage: `url(${traineesImg})` }}
          ></div>
        </div>
      </div>
    </section>
  );
}

export default ForTrainees;
