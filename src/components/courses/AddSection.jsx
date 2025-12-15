import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { useToast } from "../../context/ToastContext";
import axiosInstance from "../../utils/axiosConfig";
import UploadImage from "../../components/UploadImage";

const AddSection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const course = location.state?.course;
  const lesson = location.state?.lesson;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const saveSectionAPI = async (sectionData) => {
    if (!course || !lesson) {
      showToast("Missing course or lesson data", { type: "error" });
      return null;
    }

    const payload = {
      title: sectionData.title,
      content_type: sectionData.contentType,
      content_url: sectionData.contentUrl || "",
      content_text: sectionData.contentText || "",
      lesson: lesson.id,
      order: sectionData.order
    };

    try {
      const res = await axiosInstance.post(`/api/courses/sections/create/`, payload);
      return res.data;
    } catch (error) {
      showToast("Error saving section", { type: "error" });
      return null;
    }
  };

  const onSubmitAndCreateAnother = async (data) => {
    setIsSubmitting(true);
    const res = await saveSectionAPI(data);
    if (res) {
      showToast("Section created successfully!", { type: "success" });
      reset();
    }
    setIsSubmitting(false);
  };

  const onSubmitAndGoToNextLesson = async (data) => {
    setIsSubmitting(true);
    const res = await saveSectionAPI(data);
    if (res) {
      showToast("Section created successfully!", { type: "success" });
      navigate("/trainer/addlesson", { state: { course } });
    }
    setIsSubmitting(false);
  };

  const onSubmitAndFinish = async (data) => {
    setIsSubmitting(true);
    const res = await saveSectionAPI(data);
    if (res) {
      showToast("Section created successfully!", { type: "success" });
      navigate("/trainer/courses", { state: { course } });
    }
    setIsSubmitting(false);
  };

  if (!course || !lesson) {
    return (
      <>
        <Navbar />
        <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
          <h1 className="font-bebas text-4xl text-[#ff8211] mb-4">No Course or Lesson Data</h1>
          <p className="text-muted-foreground mb-6">Please start from creating a course and lesson first.</p>
          <button
            onClick={() => navigate("/addcourse")}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#ff8211] px-6 text-sm font-semibold text-white transition hover:bg-[#ff8211]/90"
          >
            Go to Add Course
          </button>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-background px-4 py-16 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">

          {/* Header */}
          <header className="text-center">
            <h2 className="font-bebas text-4xl tracking-tight text-[#ff8211]">
              Add Section
            </h2>
            <div className="mt-3 flex flex-col items-center gap-1 text-sm text-muted-foreground sm:text-base text-[#555555]">
              <p>Create content sections for: <strong className="text-foreground">{lesson.title}</strong></p>
              <p className="text-xs text-gray-400">Course: {course.title}</p>
            </div>
          </header>

          {/* Form Card */}
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm sm:p-10">
            <form className="grid gap-6">

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Section Title */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Section Title</label>
                  <input
                    {...register("title", { required: "Section title is required" })}
                    placeholder="Introduction to Warm-up Exercises"
                    className="h-11 w-full rounded-xl border border-border bg-background/80 px-3 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted-foreground"
                  />
                  {errors.title && (
                    <p className="text-xs text-destructive text-red-500">{errors.title.message}</p>
                  )}
                </div>

                {/* Section Order */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Section Order</label>
                  <input
                    type="number"
                    {...register("order", { required: "Order is required" })}
                    placeholder="Section number"
                    className="h-11 w-full rounded-xl border border-border bg-background/80 px-3 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted-foreground"
                  />
                  {errors.order && (
                    <p className="text-xs text-destructive text-red-500">{errors.order.message}</p>
                  )}
                </div>
              </div>

              {/* Content Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Content Type</label>
                <select
                  {...register("contentType", { required: "Content type is required" })}
                  className="h-11 w-full rounded-xl border border-border bg-background/80 px-3 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <option value="">Select Content Type</option>
                  <option value="video">Video</option>
                  <option value="article">Article</option>
                  <option value="pdf">PDF</option>
                  <option value="image">Image</option>
                  <option value="audio">Audio</option>
                  <option value="doc">DOC</option>
                  <option value="ppt">PPT</option>
                  <option value="other">Other</option>
                </select>
                {errors.contentType && (
                  <p className="text-xs text-destructive text-red-500">{errors.contentType.message}</p>
                )}
              </div>

              {/* Content URL */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Content URL</label>
                <div className="flex flex-col gap-4 p-4 border rounded-xl bg-gray-50/50">
                  <UploadImage
                    onUpload={(url, type) => {
                      setValue("contentUrl", url, { shouldValidate: true });
                      if (type === 'video' || type === 'image') {
                        setValue("contentType", type, { shouldValidate: true });
                      }
                    }}
                  />

                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink-0 mx-4 text-xs text-gray-400">OR ENTER URL MANUALLY</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                  </div>

                  <input
                    type="text"
                    {...register("contentUrl", { required: "Content URL is required" })}
                    placeholder="Paste video URL (YouTube, Vimeo) or file URL here"
                    className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted-foreground"
                  />
                  {errors.contentUrl && (
                    <p className="text-xs text-destructive text-red-500">{errors.contentUrl.message}</p>
                  )}
                </div>
              </div>

              {/* Content Text */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Content Text</label>
                <textarea
                  {...register("contentText")}
                  placeholder="Add any additional text, instructions, or description for this section"
                  className="w-full rounded-xl border border-border bg-background/80 px-3 py-2 text-sm text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background placeholder:text-muted-foreground min-h-[120px]"
                  rows={4}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleSubmit(onSubmitAndCreateAnother)}
                  disabled={isSubmitting}
                  className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#ff8211] text-sm font-semibold text-white shadow-md transition-all hover:bg-[#e67300] hover:shadow-lg disabled:opacity-50"
                >
                  <span className="mr-2 text-lg">+</span> Submit & Create Another Section
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleSubmit(onSubmitAndGoToNextLesson)}
                    disabled={isSubmitting}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-gray-900 text-sm font-semibold text-white shadow-md transition-all hover:bg-black hover:shadow-lg disabled:opacity-50"
                  >
                    Submit & Create Another Lesson <span className="ml-2">→</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmit(onSubmitAndFinish)}
                    disabled={isSubmitting}
                    className="inline-flex h-11 items-center justify-center rounded-xl border-2 border-green-600 bg-transparent text-sm font-semibold text-green-600 transition-all hover:bg-green-50 disabled:opacity-50"
                  >
                    Finish & Save ✓
                  </button>
                </div>
              </div>

              <div className="mt-2 text-center sm:text-left">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="text-sm font-medium text-[#FF8211] hover:text-[#FFAB63] transition-colors"
                >
                  ← Back
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

export default AddSection;