import Navbar from "../Navbar";
import Footer from "../Footer";
import { useForm } from "react-hook-form";

const AddCourse = () => {
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
      <section className="w-full flex items-center mt-[1.5rem] mb-[3rem]">
        <div className="w-[80%] m-auto s  flex justify-center items-center gap-[11px] flex-wrap mb-[2rem]">
          <div className="flex flex-col justify-start w-[100%] pt-[2rem] pb-[3rem]">
            <div className="">
              <h1 className="text-[#FF8211] text-[4rem] bebas-medium">
                Add course
              </h1>
            </div>
            <div className="mt-[6px]">
              <p className="text-[#555555] text-[1rem] poppins-regular">
                Fill out the details below to create your course
              </p>
            </div>
          </div>
          {/* -------------------------------------------------------------- */}
          <div className="flex flex-col justify-start w-[100%]  pb-[3rem] ">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full max-w-md flex flex-col gap-4"
            >
              <div>
                <div>
                  <label className="poppins-medium text-[1rem]">
                    Course Title
                  </label>
                </div>
                <div>
                  <input
                    {...register("title", { required: true })}
                    placeholder="Strength Training for Beginners"
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
                  <label className="poppins-medium text-[1rem]">Category</label>
                </div>
                <div>
                  <select
                    {...register("category", { required: true })}
                    className="w-full border rounded-md p-[10px]  text-[#000] poppins-extralight"
                  >
                    <option
                      className=" p-[10px]  text-[#000] poppins-extralight"
                      value=""
                    >
                      Select Category
                    </option>
                    <option
                      className=" p-[10px]  text-[#000] poppins-extralight"
                      value="fitness"
                    >
                      Fitness
                    </option>
                    <option
                      className=" p-[10px]  text-[#000] poppins-extralight"
                      value="yoga"
                    >
                      Yoga
                    </option>
                    <option
                      className=" p-[10px]  text-[#000] poppins-extralight"
                      value="nutrition"
                    >
                      Nutrition
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <div>
                  <label className="poppins-medium text-[1rem]">Level</label>
                </div>
                <div>
                  <select
                    {...register("level", { required: true })}
                    className="w-full border rounded-md p-[10px]  text-[#000] poppins-extralight"
                  >
                    <option
                      className=" p-[10px]  text-[#000] poppins-extralight"
                      value=""
                    >
                      Select Level
                    </option>
                    <option
                      className=" p-[10px]  text-[#000] poppins-extralight"
                      value="beginner"
                    >
                      Beginner
                    </option>
                    <option
                      className=" p-[10px]  text-[#000] poppins-extralight"
                      value="intermediate"
                    >
                      Intermediate
                    </option>
                    <option
                      className=" p-[10px]  text-[#000] poppins-extralight"
                      value="advanced"
                    >
                      Advanced
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <div>
                  <label className="poppins-medium text-[1rem]">Language</label>
                </div>
                <div>
                  <select
                    {...register("language", { required: true })}
                    className="w-full border rounded-md p-[10px]  text-[#000] poppins-extralight"
                  >
                    <option
                      className=" p-[10px]  text-[#000] poppins-extralight"
                      value=""
                    >
                      Select Language
                    </option>
                    <option
                      className=" p-[10px]  text-[#000] poppins-extralight"
                      value="english"
                    >
                      English
                    </option>
                    <option
                      className=" p-[10px]  text-[#000] poppins-extralight"
                      value="arabic"
                    >
                      Arabic
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <div>
                  <label className="poppins-medium text-[1rem]">
                    Cover URL
                  </label>
                </div>
                <div>
                  <input
                    {...register("coverUrl")}
                    placeholder="Paste your course cover image link"
                    className="w-full border rounded-md p-[10px]  text-[#000] poppins-extralight"
                  />
                </div>
              </div>

              <div>
                <div>
                  <label className="poppins-medium text-[1rem]">
                    Preview Video URL
                  </label>
                </div>
                <div>
                  <input
                    {...register("previewUrl")}
                    placeholder="Paste your course preview video link"
                    className="w-full border rounded-md p-[10px]  text-[#000] poppins-extralight"
                  />
                </div>
              </div>

              <div>
                <div>
                  <label className="poppins-medium text-[1rem]">
                    Description
                  </label>
                </div>
                <div>
                  {" "}
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
              <div className="flex justify-start w-full mt-[41px]">
                <button
                  type="submit"
                  className="bg-[#FF8211] text-white text-[18px] items-center h-[32px] w-[121px] rounded-full  shadow-md transition duration-150 ease-in-out hover:opacity-80 focus:opacity-90 active:opacity-100 bebas-regular"
                >
                  NEXT
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};
export default AddCourse;
