import Button from "../Button";
import CoursesData from "../../js/CardCouData";

function CardCou() {
  return (
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
  );
}

export default CardCou;
