import { Check, Clock, Dumbbell } from "lucide-react";
import traineesImg2 from "../assets/33333.png";

function ForTrainees() {
  return (
    <section className="w-full bg-[#FFFFFF] ">
      <div className="flex flex-col lg:flex-row  w-full overflow-hidden">
        <div className="w-[50%] relative">
          <div className="w-full h-full">
            <img
              src={traineesImg2}
              alt="trainees"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        {/* -------------------------------------------------------------------- */}
        <div className="w-[100%]  flex flex-col justify-center">
          <div className=" w-[90%] mx-auto mt-[3.75rem]">
            <div>
              <h3 className="text-[2.5rem] font-bold text-[#FF8211] uppercase tracking-wider font-bebas ">
                For Trainers
              </h3>
            </div>
            <div className="mt-[0.5rem] w-[100%]">
              <p className="lg:text-[1.5rem] md:text-xl  text-[#555555] poppins-regular leading-[2rem] w-[100%] ">
                Grow your fitness career by connecting with motivated trainees.
                Offer classes, manage bookings, and build your reputation — all
                in one place.
              </p>
            </div>
          </div>
          {/* -------------------------------------------------------------------- */}
          <div className=" mt-[3.75rem] w-[90%] mx-auto ">
            <div>
              <div className="flex items-start ">
                <Check className="w-5 h-5 text-[#6AA84F] mr-3 mt-[2px] flex-shrink-0" />
                <h4 className="text-[1rem] font-semibold text-[#333333] poppins-medium">
                  Reach More Clients
                </h4>
              </div>
              <div className="pt-[0.5rem]">
                <p className="text-gray-700 text-base ml-8 poppins-regular">
                  Get discovered by trainees looking for personal training or
                  classes.
                </p>
              </div>
            </div>

            <div className="pt-[1rem]">
              <div className="flex items-start ">
                <Clock className="w-5 h-5 text-[#4A86E8] mr-3 mt-[2px] flex-shrink-0" />
                <h4 className="text-lg font-semibold text-[#333333] poppins-medium">
                  Easy Booking & Scheduling
                </h4>
              </div>
              <div className="pt-[0.5rem]">
                <p className="text-gray-700 text-base ml-8 poppins-regular">
                  Manage your sessions, availability, and payments all from one
                  dashboard.
                </p>
              </div>
            </div>

            <div className="pt-[1rem]">
              <div className="flex items-start mb-1">
                <Dumbbell className="w-5 h-5 text-[#134F5C] mr-3 mt-[2px] flex-shrink-0" />
                <h4 className="text-lg font-semibold text-[#333333] poppins-regular">
                  Build Your Brand
                </h4>
              </div>
              <div className="pt-[0.5rem]">
                <p className="text-gray-700 text-base ml-8 poppins-regular">
                  Showcase your expertise with a personalized trainer profile —
                  complete with reviews, achievements, and photos of your work.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-end w-full items-end pb-[1rem]">
            <a
              href="#"
              className="mt-12 text-[#FF8211] poppins-regular text-lg hover:text-[#FFAB63]   transition duration-300 "
            >
              Become a Coach Today
              <span className="mr-[12px] text-xl">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ForTrainees;
