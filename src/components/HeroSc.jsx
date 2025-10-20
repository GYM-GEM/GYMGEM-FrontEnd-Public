import Hero from "../assets/hero.svg";
import Hero1 from "../assets/hero.mp4";

function HeroSc() {
  return (
    <div className="relative w-full flex justify-center items-center">
      {/* <img src={Hero} alt="Hero image" className="w-full h-full" /> */}
      {/* <img src={Hero} alt="Hero image" className="w-full h-full" /> */}
      <div className="w-full   bg-black ">
        <video
          autoPlay
          loop
          muted
          className="w-full h-[600px] object-cover  opacity-20"
        >
          <source src={Hero1} type="video/mp4" />
        </video>
      </div>

      <div className="absolute text-center text-white">
        <div className="flex justify-center">
          <h1 className="text-[48px] font-bold font-bebas-bold">
            Your Fitness Network Starts Here.
          </h1>
        </div>
        <div className="flex justify-center w-[70%] m-auto ">
          <p className="text-[1rem] mt-[1rem] text-left poppins-medium leading-[1.5rem]">
            Find certified personal trainers, book classes, and achieve your
            fitness goals — all in one place.
          </p>
        </div>
        <div className="flex justify-center gap-[1rem] mt-[2rem]">
          <button className="font-bebas w-[200px] h-[55px] bg-[#FF8211] text-white  rounded-[1rem] text-[1.125rem]">
            Find a Trainer
          </button>
          <button className="font-bebas w-[200px] h-[55px] bg-[#FF8211] text-white  rounded-[1rem] text-[1.125rem]">
            Join as a Trainer
          </button>
        </div>
      </div>
    </div>
  );
}

export default HeroSc;
