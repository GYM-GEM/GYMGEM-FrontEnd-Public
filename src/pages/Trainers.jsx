import Button from "../components/Button";
import CardForTrainers from "../components/CardForTrainers";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
function Trainers() {
  return (
    <>
      <Navbar />
      <section className="w-full">
        <div className="w-[80%] m-auto s  flex justify-center items-center gap-[11px] flex-wrap mb-[2rem]">
          <div className="flex flex-col justify-start w-[100%] pt-[2rem] pb-[3rem]">
            <div className="pb-[3px]">
              <h1 className="text-[#FF8211] text-[4rem] bebas-medium">
                Find Your Perfect Coach
              </h1>
            </div>
            <div>
              <p className="text-[#555555] text-[1rem] poppins-regular">
                Certified professionals to help you reach your fitness goals.
              </p>
            </div>
          </div>
          <div className="w-full flex justify-center gap-[1rem]">
            <div className="w-full">
              {" "}
              <Button
                text="All Courses"
                color="#FFF3E6"
                textColor="#FF8211"
                width="100%"
                height="70px"
                to="/courses"
              />
            </div>
            <div className="w-full">
              {" "}
              <Button
                text="🧘 Yoga & Flexibility"
                color="#A3D9A5"
                textColor="#000000"
                width="100%"
                height="70px"
                to="/courses"
              />
            </div>
            <div className="w-full">
              {" "}
              <Button
                text="🏃 Weight Loss & Cardio"
                color="#FFB56B"
                textColor="#000000"
                width="100%"
                height="70px"
                to="/courses"
              />
            </div>
            <div className="w-full">
              {" "}
              <Button
                text="🥗 Nutrition Coaches"
                color="#C8E57C"
                textColor="#fff"
                width="100%"
                height="70px"
                to="/courses"
              />
            </div>
            <div className="w-full">
              {" "}
              <Button
                text="🏋️ Strength & Conditioning"
                color="#D0D4E4"
                textColor="#000000"
                width="100%"
                height="70px"
                to="/courses"
              />
            </div>
            <div className="w-full">
              {" "}
              <Button
                text="🥊 Boxing & MMA"
                color="#FF5C5C"
                textColor="#fff"
                width="100%"
                height="70px"
                to="/courses"
              />
            </div>
          </div>
        </div>
        <CardForTrainers />
      </section>
      <Footer />
    </>
  );
}

export default Trainers;
