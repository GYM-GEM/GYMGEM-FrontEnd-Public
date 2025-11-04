import Button from "../components/Button";
// import CardCou from "../components/courses/CardCou";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import CoursesData from "../js/CardCouData";

function Courses() {
  return (
    <>
      <Navbar />
      <section className="w-full">
        <div className="bg-white py-4   justify-between items-center w-[80%] m-auto mt[40px] mb-[60px] ">
          <div className="">
            <h1 className="text-[#FF8211] text-[4rem] bebas-medium">
              FIND YOUR PERFECT FITNESS COURSE
            </h1>
          </div>
          <div className="">
            <p className="text-[#555555] text-[1rem] poppins-regular">
              Explore fitness courses for every level and lifestyle.
            </p>
          </div>
        </div>
        <div className="w-[80%] m-auto s  flex justify-center items-center gap-[11px] flex-wrap mb-[2rem]">
          <Button
            text="All Courses"
            color="#FFF3E6"
            textColor="#FF8211"
            width="15%"
            height="70px"
            to="/courses"
            rounded="full"
            uppercase={true}
          />
          <Button
            text="🧘 Yoga & Flexibility"
            color="#A3D9A5"
            textColor="#000000"
            width="15%"
            height="70px"
            to="/courses"
            rounded="full"
          />
          <Button
            text="🏃 Weight Loss & Cardio"
            color="#FFB56B"
            textColor="#000000"
            width="15%"
            height="70px"
            rounded="full"
            to="/courses"
          />
          <Button
            text="🥗 Nutrition Coaches"
            color="#C8E57C"
            textColor="#fff"
            width="15%"
            height="70px"
            rounded="full"
            to="/courses"
          />
          <Button
            text="🏋️ Strength & Conditioning"
            color="#D0D4E4"
            textColor="#000000"
            width="15%"
            height="70px"
            rounded="full"
            to="/courses"
          />
          <Button
            text="🥊 Boxing & MMA"
            color="#FF5C5C"
            textColor="#fff"
            width="15%"
            height="70px"
            rounded="full"
            to="/courses"
          />
        </div>
        {/* <CardCou /> */}
      </section>
      <section className="flex  w-[80%] mx-auto justify-center gap-[1rem] flex-wrap pb-[3.75rem]">
        {CoursesData.map((item) => (
          <div className="rounded-[1rem] bg-white shadow-md overflow-hidden dark:bg-white w-[30%] mt[1rem]">
            <div className="p-[0.5rem]">
              <div className="relative overflow-hidden">
                <img
                  className="rounded-[1rem] w-full h-48 object-cover"
                  src={item.image}
                  alt={item.title}
                />
              </div>

              {/* content */}
              <div className="p-6 text-black  flex flex-col justify-between ">
                <div>
                  <div>
                    <h5 className="mb-[12px] text-[1.625rem] bebas-regular uppercase ">
                      {item.title}
                    </h5>
                  </div>
                  <div>
                    <p className="mb-[10px] text-[1rem] text-[#555555] poppins-regular">
                      {item.description}
                    </p>
                  </div>
                  <div>
                    <p className="mb-[2.25rem] text-[14px] text-[#888888] poppins-regular">
                      {item.ByCoach}
                    </p>
                  </div>
                </div>
                {/* price + button */}
                <div className="flex justify-between items-center ">
                  <div className="">
                    <span className="text-[18px] bebas-regular text-[#000000]">
                      {item.price}
                    </span>
                  </div>
                  <div className="">
                    <Button
                      text={item.buttonText}
                      color={item.buttonColor}
                      textColor={item.buttonTextColor}
                      onClick={item.onButtonClick}
                      width="103px"
                      height="32px"
                      fontSize="18px"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
      <Footer />
    </>
  );
}

export default Courses;
