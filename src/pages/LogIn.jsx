import Cover_img from "../assets/fitCartoon3.png";
import Login from "../components/LoginForm";

const RightImg = () => {
  return (
    <div className="w-full h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 h-full flex items-center justify-center bg-white px-6 md:px-12">
        <Login />
      </div>
      <div className="hidden md:flex md:w-1/2 h-full bg-[#FF8211] relative overflow w-0.5">
        <img
          src={Cover_img}
          alt="cover"
          className="absolute top-0 left-0 h-full object-cover w-full "
        />
      </div>
    </div>
  );
};

export default RightImg;
