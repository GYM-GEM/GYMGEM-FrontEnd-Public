import Navbar from "../Navbar";
import Footer from "../Footer";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosConfig";
import UploadImage from "../UploadImage";

const NewLesson = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const course = location.state?.course;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (lessonData) => {
    if (!course) return;

    try {
      const payload = {
        title: lessonData.title,
        cover: lessonData.cover,
        duration: lessonData.duration,
        description: lessonData.description,
        status: lessonData.status,
        order: lessonData.order,
      };

      const res = await axiosInstance.post(`/api/courses/lessons/${course.id}/create/`, payload);
      console.log(res.data);
      const createdlesson = res.data;

      navigate("/trainer/addsection", {
        state: {
          course: course,
          lesson: createdlesson,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-background px-4 py-16 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">

          {/* Header */}
          <header className="text-center">
            <h2 className="font-bebas text-4xl tracking-tight text-[#ff8211]">
              New Lesson
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base text-[#555555]">
              Fill in the details below to create a lesson for your course.
            </p>
          </header>

          {/* Form Card */}
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm sm:p-10">
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">

              
              {/* Cover Image */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Cover Image</label>
                <div className="flex flex-col items-center sm:items-start gap-4 p-4 border rounded-xl bg-gray-50/50">
                  <UploadImage onUpload={(url) => setValue("cover", url)} />
                  <input type="hidden" {...register("cover", { required: "Cover image is required" })} />
                </div>
                {errors.cover && (
                  <p className="text-xs text-destructive text-red-500">
                    {errors.cover.message}
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Lesson Title */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Lesson Title
                  </label>
                  <input
                    {...register("title", { required: "Title is required" })}
                    placeholder="Introduction to Strength Training"
                    className="h-11 w-full rounded-xl border border-border bg-background/80 px-3 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted-foreground"
                  />
                  {errors.title && (
                    <p className="text-xs text-destructive text-red-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Lesson Order */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Lesson Order</label>
                  <input
                    type="number"
                    {...register("order", { required: "Order is required" })}
                    placeholder="Lesson number"
                    className="h-11 w-full rounded-xl border border-border bg-background/80 px-3 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted-foreground"
                  />
                  {errors.order && (
                    <p className="text-xs text-destructive text-red-500">
                      {errors.order.message}
                    </p>
                  )}
                </div>
              </div>


              {/* Duration */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Duration</label>
                <input
                  {...register("duration")}
                  placeholder="HH:MM:SS (e.g. 00:45:00)"
                  className="h-11 w-full rounded-xl border border-border bg-background/80 px-3 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted-foreground"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Lesson Description
                </label>
                <textarea
                  {...register("description")}
                  placeholder="Write a short description about your lesson"
                  className="w-full rounded-xl border border-border bg-background/80 px-3 py-2 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted-foreground min-h-[120px]"
                  rows={4}
                ></textarea>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Status</label>
                <select
                  {...register("status", { required: "Status is required" })}
                  className="h-11 w-full rounded-xl border border-border bg-background/80 px-3 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <option value="">Select Status</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
                {errors.status && (
                  <p className="text-xs text-destructive text-red-500">
                    {errors.status.message}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between pt-4">
                <Link
                  to={`/trainer/courses/${course?.id}`}
                  className="text-sm font-medium text-[#FF8211] hover:text-[#FFAB63] transition-colors"
                >
                  ← Back to Course Details
                </Link>

                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-[#ff8211] px-8 text-sm font-semibold text-white transition hover:bg-[#ff8211]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Submit
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
export default NewLesson;
