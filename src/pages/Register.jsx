import cover_img from "../assets/cover.svg";
import SignUp from "../components/SignUpForm";

const LiftImg = () => {
  return (
    <div className="w-full h-screen flex flex-col md:flex-row">
      <div className="hidden md:block md:w-1/2 h-full bg-[#FF8211]">
        <img
          src={cover_img}
          alt="cover"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-full md:w-1/2 h-full flex items-center justify-center bg-white">
        <div className="w-full h-full flex items-center justify-center px-6 md:px-12">
          <SignUp />
        </div>
      </div>
    </div>
  );
};

export default LiftImg;
