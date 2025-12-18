import Navbar from "../Navbar";
import Footer from "../Footer";
import UploadImage from "../UploadImage";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import axiosInstance from "../../utils/axiosConfig";

const VITE_API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const AddCourse = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const { showToast } = useToast();

  const onSubmit = async (data) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const payload = {
        title: data.title,
        price: data.price,
        cover: data.coverUrl || "http://example.com",
        // status: data.status || "draft",                         
        description: data.description,
        preview_video: data.previewUrl || "http://example.com",
        trainer_profile: user?.id || 0,
        category: parseInt(data.category),
        level: parseInt(data.level),
        language: data.language,
      };

      const response = await axiosInstance.post(
        `${VITE_API_URL}/api/courses/courses/create/`,
        payload
      );

      showToast("Course created successfully!", { type: "success" });
      navigate("/trainer/addlesson", { state: { course: response.data } });
    } catch (error) {
      console.error("Error creating course:", error);
      showToast(
        error.response?.data?.detail || "Failed to create course. Please try again.",
        { type: "error" }
      );
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
              Add Course
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base text-[#555555]">
              Fill out the details below to create your course.
            </p>
          </header>

          {/* Form Card */}
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm sm:p-10">
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">

              {/* Cover Image */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Cover Image</label>
                <div className="flex flex-col items-center sm:items-start gap-4 p-4 border rounded-xl bg-gray-50/50">
                  <UploadImage onUpload={(url) => setValue("coverUrl", url)} />
                  <input type="hidden" {...register("coverUrl", { required: "Cover image is required" })} />
                </div>
                {errors.coverUrl && (
                  <p className="text-xs text-destructive text-red-500">{errors.coverUrl.message}</p>
                )}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Course Title
                </label>
                <input
                  {...register("title", { required: "Title is required" })}
                  placeholder="Strength Training for Beginners"
                  className="h-11 w-full rounded-xl border border-border bg-background/80 px-3 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted-foreground"
                />
                {errors.title && (
                  <p className="text-xs text-destructive text-red-500">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Category */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Category</label>
                  <select
                    {...register("category", { required: "Category is required" })}
                    className="h-11 w-full rounded-xl border border-border bg-background/80 px-3 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <option value="">Select Category</option>
                    <option value={1}>Strength Training</option>
                    <option value={2}>Cardio & Endurance</option>
                    <option value={3}>Flexibility & Mobility</option>
                    <option value={4}>Bodyweight Only</option>
                    <option value={5}>Yoga</option>
                    <option value={6}>Pilates</option>
                    <option value={7}>Recovery & Prehab</option>
                    <option value={8}>Meditation & Breathwork</option>
                    <option value={9}>Beginner's Journey</option>
                    <option value={10}>Fat Loss & Toning</option>
                    <option value={11}>Build Muscle Mass</option>
                    <option value={12}>Prenatal & Postnatal</option>
                    <option value={13}>Dance Fitness</option>
                    <option value={14}>Sport-Specific Training</option>
                    <option value={15}>Equipment Specific</option>
                  </select>
                  {errors.category && (
                    <p className="text-xs text-destructive text-red-500">{errors.category.message}</p>
                  )}
                </div>

                {/* Level */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Level</label>
                  <select
                    {...register("level", { required: "Level is required" })}
                    className="h-11 w-full rounded-xl border border-border bg-background/80 px-3 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <option value="">Select Level</option>
                    <option value={1}>Beginner</option>
                    <option value={2}>Intermediate</option>
                    <option value={3}>Advanced</option>
                  </select>
                  {errors.level && (
                    <p className="text-xs text-destructive text-red-500">{errors.level.message}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Language */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Language</label>
                  <select
                    {...register("language", { required: "Language is required" })}
                    className="h-11 w-full rounded-xl border border-border bg-background/80 px-3 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <option value="">Select Language</option>
                    <option value="AR">Arabic</option>
                    <option value="EN">English</option>
                  </select>
                  {errors.language && (
                    <p className="text-xs text-destructive text-red-500">{errors.language.message}</p>
                  )}
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Price</label>
                  <input
                    {...register("price", {
                      required: "Price is required",
                      pattern: {
                        value: /^\d+(\.\d{1,2})?$/,
                        message: "Enter a valid price (max 2 decimals)",
                      },
                    })}
                    placeholder="99.99"
                    className="h-11 w-full rounded-xl border border-border bg-background/80 px-3 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted-foreground"
                  />
                  {errors.price && (
                    <p className="text-xs text-destructive text-red-500">{errors.price.message}</p>
                  )}
                </div>
              </div>



              {/* Preview Video */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Preview Video URL</label>
                <input
                  {...register("previewUrl")}
                  placeholder="Paste your course preview video link"
                  className="h-11 w-full rounded-xl border border-border bg-background/80 px-3 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted-foreground"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <textarea
                  {...register("description", { required: "Description is required" })}
                  placeholder="Write a short description about your course"
                  className="w-full rounded-xl border border-border bg-background/80 px-3 py-2 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted-foreground min-h-[120px]"
                  rows={4}
                ></textarea>
                {errors.description && (
                  <p className="text-xs text-destructive text-red-500">{errors.description.message}</p>
                )}
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
                  <p className="text-xs text-destructive text-red-500">{errors.status.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[#ff8211] px-6 text-sm font-semibold text-white transition hover:bg-[#ff8211]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Next
              </button>

            </form>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};
export default AddCourse;
