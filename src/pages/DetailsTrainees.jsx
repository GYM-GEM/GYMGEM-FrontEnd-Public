import Button from "../components/Button";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const RequestDetails = () => {
  return (
    <>
      <Navbar />
      <section className="w-full flex items-center mt-[1.5rem] mb-[3rem]">
        <div className="w-[80%] m-auto flex justify-start items-center bg-[#fff]">
          <div className="w-[60%] bg-white  ">
            <div className="">
              <h2 className="text-[2.25rem]  text-[#1F2937] bebas-regular ">
                REQUEST DETAILS
              </h2>
            </div>
            <div className="mt-[1.5rem]">
              <h3 className="text-[2rem]  text-[#1E1E1E] bebas-regular ">
                LOOKING FOR PERSONAL TRAINER FOR WEIGHT LOSS
              </h3>
            </div>
            <div className="mt-[1rem] mb-[1rem]">
              <p className="text-[#6B7280] text-[0.95rem] ">
                Posted by Ahmed Khaled · 2 days ago · 📍 Cairo, Egypt ·
              </p>
            </div>

            <div className="w-full h-[200px] bg-[#E5E7EB] rounded-md mb-[2.5rem]"></div>

            <div className="mb-[1.5rem]">
              <div>
                <h4 className="text-[1.5rem]  text-[#111] bebas-regular ">
                  ABOUT THE REQUEST
                </h4>
              </div>
              <div className="mt-[1rem]">
                <p className="text-[#4B5563] text-[1rem] leading-relaxed">
                  “I’m looking for a certified trainer who can help me lose 5kg
                  in 8 weeks.
                  <br />I prefer online sessions 3 times per week, with guidance
                  on workouts and nutrition.”
                </p>
              </div>
            </div>

            <div className="border border-[#E5E7EB] rounded-2xl w-full">
              <div className="w-[75%] m-auto items-center pt-[3.125rem]">
                <div className="mb-[2.25rem]">
                  <div>
                    <h4 className="text-[#FF8211] text-[1.5rem]  bebas-regular">
                      Apply for this request
                    </h4>
                  </div>
                  <div className="mt-[8px] ">
                    <p className="text-[#4B5563] text-[1rem] poppins-regular">
                      Send your proposal and introduce yourself to the trainee.
                    </p>
                  </div>
                </div>

                <form className="flex flex-col gap-4 mb-[2.625rem]">
                  {/* <div>
                    <label className="block text-[#111] text-[1rem] mb-1 poppins-regular">
                      Your Message
                    </label>
                    <input
                      type="text"
                      placeholder="Write a short message..."
                      className="border border-[#000] w-full h-[50px] p-[1rem] focus:outline-none focus:border-[#FF8211]"
                    />
                  </div> */}
                  <div className="relative mb-[33px]">
                    <input
                      type="text"
                      id="message"
                      placeholder=" "
                      className="peer border border-[#000] w-full h-[50px] p-[1rem] focus:outline-none focus:border-[#FF8211]"
                    />
                    <label
                      htmlFor="message"
                      className="absolute left-[1rem] top-1/2 -translate-y-1/2 text-[#111] text-[1rem] poppins-regular transition-all duration-200 
                              peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-[#aaa] peer-placeholder-shown:text-[1rem]
                              peer-focus:top-0 peer-focus:text-[1rem] peer-focus:text-[#000] bg-white px-1"
                    >
                      Your Message
                    </label>
                  </div>

                  {/* <div>
                    <label className="block text-[#111] text-[1rem] mb-1 poppins-regular">
                      Expected Price ($)
                    </label>
                    <input
                      type="number"
                      placeholder="Enter your price"
                      className="border border-[#000] w-full h-[50px] p-[1rem] focus:outline-none focus:border-[#FF8211]"
                    />
                  </div> */}
                  <div className="relative">
                    <input
                      type="number"
                      id="price"
                      placeholder=" "
                      className="peer border border-[#000] w-full h-[50px] p-[1rem] focus:outline-none focus:border-[#FF8211]"
                    />
                    <label
                      htmlFor="price"
                      className="absolute left-[1rem] top-1/2 -translate-y-1/2 text-[#111] text-[1rem] poppins-regular transition-all duration-200 
                              peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-[#aaa] peer-placeholder-shown:text-[1rem]
                              peer-focus:top-0 peer-focus:text-[1rem] peer-focus:text-[#000] bg-white px-1"
                    >
                      Expected Price ($)
                    </label>
                  </div>
                  <div className="mt-[21px]">
                    <Button
                      text="Apply Now"
                      color="#FF8211"
                      textColor="#fff"
                      width="100%"
                      height="50px"
                      to="/#"
                      rounded="2xl"
                      uppercase={false}
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default RequestDetails;
