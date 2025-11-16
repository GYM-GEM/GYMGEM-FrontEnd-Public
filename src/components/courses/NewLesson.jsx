import Navbar from "../Navbar";
import Footer from "../Footer";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const NewLeason = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };
  return (
    <>
      <Navbar />
      <section className="w-full flex pt-[2rem] pb-[2rem]">
        <div className="w-[80%] m-auto   flex justify-center items-center  flex-wrap ">
          <div className="flex flex-col justify-center max-w-md  w-[100%] pt-[2rem] pb-[2rem]">
            <div className="">
              <h1 className="text-[#FF8211] text-[4rem] bebas-medium">
                New lesson
              </h1>
            </div>
            <div className="">
              <p className="text-[#555555] text-[1rem] poppins-regular">
                Fill in the details below to create a lesson for your course
              </p>
            </div>
          </div>
          <div className="flex  justify-center w-[100%] ">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full max-w-md flex flex-col gap-4"
            >
              <div>
                <div>
                  <label className="poppins-medium text-[1rem]">
                    Lesson Title
                  </label>
                </div>
                <div>
                  <input
                    {...register("title", { required: true })}
                    placeholder="Introduction to Strength Training"
                    className="w-full border rounded-md p-[10px]  text-[#000] poppins-extralight"
                  />
                </div>
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    This field is required
                  </p>
                )}
              </div>

              <div>
                <div>
                  <label className="poppins-medium text-[1rem]">
                    Cover URL
                  </label>
                </div>
                <div>
                  <input
                    {...register("title", { required: true })}
                    placeholder="Paste your course cover image link"
                    className="w-full border rounded-md p-[10px]  text-[#000] poppins-extralight"
                  />
                </div>
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    This field is required
                  </p>
                )}
              </div>

              <div>
                <div>
                  <label className="poppins-medium text-[1rem]">Duration</label>
                </div>
                <div>
                  <input
                    {...register("coverUrl")}
                    placeholder="e.g. 00:45:00"
                    className="w-full border rounded-md p-[10px]  text-[#000] poppins-extralight"
                  />
                </div>
              </div>

              <div>
                <div>
                  <label className="poppins-medium text-[1rem]">
                    Lesson Description
                  </label>
                </div>
                <div>
                  <textarea
                    {...register("description", { required: true })}
                    placeholder="Write a short description about your course"
                    className="w-full border rounded-md p-[10px]  text-[#000] poppins-extralight h-[125px]"
                    rows={4}
                  ></textarea>
                </div>
              </div>

              <div>
                <div>
                  <label className="poppins-medium text-[1rem]">Status</label>
                </div>
                <div>
                  <select
                    {...register("status", { required: true })}
                    className="w-full border rounded-md p-[10px]  text-[#000] poppins-extralight"
                  >
                    <option
                      className=" p-[10px]  text-[#000] poppins-extralight"
                      value=""
                    >
                      Select Status
                    </option>
                    <option
                      className=" p-[10px]  text-[#000] poppins-extralight"
                      value="draft"
                    >
                      Draft
                    </option>
                    <option
                      className=" p-[10px]  text-[#000] poppins-extralight"
                      value="published"
                    >
                      Published
                    </option>
                  </select>
                </div>
              </div>
              <div className="flex  w-full mt-[41px]">
                <div className="w-full ">
                  <Link
                    to="/addcourse"
                    className=" text-[#FF8211] poppins-regular text-[14px] hover:text-[#FFAB63]   transition duration-300 "
                  >
                    ← Back to Course Details
                  </Link>
                </div>
                <div className="flex justify-end w-full ">
                  <button
                    type="submit"
                    className="bg-[#FF8211] text-white text-[18px] items-center h-[32px] w-[121px] rounded-full  shadow-md transition duration-150 ease-in-out hover:opacity-80 focus:opacity-90 active:opacity-100 bebas-regular"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};
export default NewLeason;
