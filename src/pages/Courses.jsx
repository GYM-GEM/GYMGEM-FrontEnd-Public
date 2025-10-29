import HeroSec from "../components/courses/HeroSec";
import Button from "../components/courses/Button";
import CardCou from "../components/courses/CardCou";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

function Courses() {
  return (
    <>
      <Navbar />
      <section className="w-full">
        <HeroSec />
        <div className="w-[90%] m-auto s  flex justify-center items-center gap-[11px] flex-wrap mb-[2rem]">
          <Button
            text="All Courses"
            color="#FFF3E6"
            textColor="#FF8211"
            width="15%"
            height="70px"
            to="/courses"
          />
          <Button
            text="🧘 Yoga & Flexibility"
            color="#A3D9A5"
            textColor="#000000"
            width="15%"
            height="70px"
            to="/courses"
          />
          <Button
            text="🏃 Weight Loss & Cardio"
            color="#FFB56B"
            textColor="#000000"
            width="15%"
            height="70px"
            to="/courses"
          />
          <Button
            text="🥗 Nutrition Coaches"
            color="#C8E57C"
            textColor="#fff"
            width="15%"
            height="70px"
            to="/courses"
          />
          <Button
            text="🏋️ Strength & Conditioning"
            color="#D0D4E4"
            textColor="#000000"
            width="15%"
            height="70px"
            to="/courses"
          />
          <Button
            text="🥊 Boxing & MMA"
            color="#FF5C5C"
            textColor="#fff"
            width="15%"
            height="70px"
            to="/courses"
          />
        </div>
        <CardCou />
      </section>
      <Footer />
    </>
  );
}

export default Courses;
