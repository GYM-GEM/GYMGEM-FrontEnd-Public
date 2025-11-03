import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import TraineesCardData from "../js/TraineesCardData";
function Trainees() {
  return (
    <>
      <Navbar />
      <section className="w-full">
        <div className="w-[80%] m-auto s  flex justify-center items-center gap-[11px] flex-wrap mb-[2rem]">
          <div className="flex flex-col justify-start w-[100%] pt-[2rem] pb-[3rem]">
            <div className="pb-[3px]">
              <h1 className="text-[#FF8211] text-[4rem] bebas-medium">
                Connect with Trainees Who Need Your Expertise
              </h1>
            </div>
            <div>
              <p className="text-[#555555] text-[1rem] poppins-regular">
                Browse personalized training requests and help clients achieve
                their fitness goals.
              </p>
            </div>
          </div>
          <div className="w-full flex justify-center gap-[1rem] pb-[40px]">
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
          {/*-------------------------------- card-------------------------- */}
          {TraineesCardData.map((item) => (
            <div className="w-full flex justify-center">
              <div className="w-[75%]  justify-between items-center border border-[#E5E7EB] rounded-2xl  bg-white">
                <div className="flex justify-between items-center w-full pt-[1.5rem] pb-[1.5rem] pl-[1rem] pr-[1rem]  ">
                  <div>
                    <h3 className="text-[#000] text-[1.5rem] bebas-regular">
                      {item.title}
                    </h3>
                  </div>
                  <div>
                    <Button
                      text="Apply Now"
                      color="#FF8211"
                      textColor="#fff"
                      width="109px"
                      height="40px"
                      to="/requestdetails"
                      rounded="md"
                      uppercase={false}
                    />
                  </div>
                </div>
                <div className="border-t border-[#E5E7EB] justify-center items-center w-full">
                  <div className="pl-[3.1875rem] pr-[3.1875rem]">
                    <p className="pt-[1rem] text-[#4B5563] text-[1rem]">
                      {item.desc}
                    </p>
                  </div>
                  <div className="flex justify-around pt-[1rem] pb-[3.875rem]">
                    <h4 className="text-[1rem] text-[#6B7280] bebas-regular">
                      📍 Location: {item.Location}
                    </h4>
                    <h4 className="text-[1rem] text-[#6B7280] bebas-regular">
                      🕒 Duration: {item.Duration}
                    </h4>
                    <h4 className="text-[1rem] text-[#6B7280] bebas-regular">
                      💪 Goal: {item.Goal}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Trainees;
