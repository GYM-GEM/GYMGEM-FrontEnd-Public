import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Star,
  Clock,
  Award,
  BookOpen,
  ChevronRight,
  ChevronDown,
  PlayCircle,
  Users,
  CheckCircle2,
  FileText,
  Video,
  File,
  Image as ImageIcon,
  Globe,
  Target,
  Flame,
  Zap,
  Loader2,
} from "lucide-react";
import ReactPlayer from "react-player";
import Navbar from "../Navbar.jsx";
import Footer from "../Footer.jsx";
import axiosInstance from "../../utils/axiosConfig";
import VideoPlayer from "./VideoPlayer";
import axios from "axios";

const CourseLearn = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [expandedSections, setExpandedSections] = useState(new Set([0]));
  const [currentSection, setCurrentSection] = useState(null);
  const [completedSections, setCompletedSections] = useState(new Set());
  const [updatingSectionId, setUpdatingSectionId] = useState(null);

  // Review modal states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Debug: Log completed sections changes
  useEffect(() => {
    console.log("CompletedSections changed:", Array.from(completedSections));
  }, [completedSections]);


  // Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axiosInstance.get(`/api/courses/courses/${id}/detail/`);
        setCourse(response.data);

        // Initialize completed sections from backend
        let completedIds = [];
        let sectionIdType = 'number'; // Default assumption

        // Detect section ID type from the first available section
        const lessons = response.data.lessons_details || response.data.lessons;

        if (lessons && lessons.length > 0) {
          // Detect Type
          for (const lesson of lessons) {
            if (lesson.sections && lesson.sections.length > 0) {
              sectionIdType = typeof lesson.sections[0].id;
              console.log("Detected section ID type:", sectionIdType);
              break;
            }
          }
        }

        // Helper to normalize ID to the detected type
        const normalizeId = (id) => {
          if (sectionIdType === 'string') return String(id);
          return Number(id);
        };

        // Extract completed sections from each lesson
        if (lessons && lessons.length > 0) {
          lessons.forEach(lesson => {
            // Check if lesson has completed_section_ids array
            if (lesson.completed_section_ids && Array.isArray(lesson.completed_section_ids)) {
              console.log(`Found completed IDs in lesson ${lesson.id || lesson.title}:`, lesson.completed_section_ids);
              const lessonCompletedIds = lesson.completed_section_ids.map(normalizeId);
              completedIds = [...completedIds, ...lessonCompletedIds];
            }
            // Fallback: Check is_done on sections if no completed_section_ids
            else if (lesson.sections) {
              lesson.sections.forEach(section => {
                if (section.is_done) {
                  completedIds.push(normalizeId(section.id));
                }
              });
            }
          });
        }

        // Also check root level just in case (for backward compatibility or different API structure)
        if (response.data.completed_section_ids && Array.isArray(response.data.completed_section_ids)) {
          console.log("Found root level completed_section_ids:", response.data.completed_section_ids);
          const rootIds = response.data.completed_section_ids.map(normalizeId);
          completedIds = [...completedIds, ...rootIds];
        }

        // Deduplicate IDs (backend may return duplicates across lessons or within arrays)
        const uniqueCompletedIds = [...new Set(completedIds)];
        console.log("Final unique completed sections:", uniqueCompletedIds);

        const completedSet = new Set(uniqueCompletedIds);
        setCompletedSections(completedSet);
        localStorage.setItem(`course_progress_${id}`, JSON.stringify(uniqueCompletedIds));

        console.log("CompletedSections state after initialization:", completedSet);
      } catch (error) {
        console.error("Failed to fetch course:", error);
      }
    };
    if (id) {
      fetchCourse();
    }
  }, [id]);

  // Set initial current section once course is loaded
  useEffect(() => {
    if (course && !currentSection) {
      const lessonsToUse = course.lessons_details || course.lessons;
      if (lessonsToUse && lessonsToUse.length > 0) {
        const firstLesson = lessonsToUse[0];
        if (firstLesson.sections && firstLesson.sections.length > 0) {
          setCurrentSection(firstLesson.sections[0]);
        }
      }
    }
  }, [course, currentSection]);

  const toggleSection = (index) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) newSet.delete(index);
      else newSet.add(index);
      return newSet;
    });
  };

  const handleSectionClick = (section) => {
    setCurrentSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleComplete = async () => {
    if (currentSection) {
      console.log("Toggling completion for section:", currentSection.id, "(Type:", typeof currentSection.id, ")");

      if (updatingSectionId === currentSection.id) return; // Prevent double clicks

      const isCompleted = completedSections.has(currentSection.id);
      console.log("Is already completed?", isCompleted);

      // Don't allow un-completing - one-way operation only
      if (isCompleted) return;

      // Set loading state
      setUpdatingSectionId(currentSection.id);

      // Optimistically update UI
      const previousState = new Set(completedSections);
      setCompletedSections((prev) => {
        const newSet = new Set(prev);
        newSet.add(currentSection.id);
        localStorage.setItem(`course_progress_${id}`, JSON.stringify([...newSet]));
        return newSet;
      });

      // Call the API to mark as completed
      try {
        const response = await axiosInstance.post(
          `/api/courses/progress/${currentSection.id}/mark-section-completed/`,
          {},
          { skipGlobalLoader: true }
        );

        // Update with the actual completed sections from backend response
        if (response.data && response.data.completed_section_ids) {
          const completedIds = response.data.completed_section_ids;
          // Deduplicate IDs (backend may return duplicates)
          const uniqueCompletedIds = [...new Set(completedIds)];
          setCompletedSections(new Set(uniqueCompletedIds));
          localStorage.setItem(`course_progress_${id}`, JSON.stringify(uniqueCompletedIds));
          console.log("Updated completed sections from backend (raw):", completedIds);
          console.log("Unique completed sections:", uniqueCompletedIds);
        }
      } catch (error) {
        console.error("Failed to mark section as done:", error);
        // Revert on error
        setCompletedSections(previousState);
        localStorage.setItem(`course_progress_${id}`, JSON.stringify([...previousState]));
      } finally {
        setUpdatingSectionId(null);
      }
    }
  };

  const handleSubmitReview = async () => {
    const payload = {
      rating,
      review: reviewText

    }
    try {
      const res = await axiosInstance.post(`/api/courses/enrollments/${course.id}/review-and-complete-enrollment/`, payload)
      console.log(res)
      setShowReviewModal(false);
      setRating(0);
      setReviewText("");
      alert("Thank you for your review!");
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert("Failed to submit review. Please try again.");
    }
  }
  //   if (rating === 0) {
  //     alert("Please select a rating");
  //     return;
  //   }

  //   if (!reviewText.trim()) {
  //     alert("Please write a review");
  //     return;
  //   }

  //   setIsSubmittingReview(true);
  //   try {
  //     await axiosInstance.post(
  //       `/api/courses/courses/${id}/reviews/`,
  //       {
  //         rating: rating,
  //         review: reviewText
  //       },
  //       { skipGlobalLoader: true }
  //     );

  //     // Success - close modal and reset
  //     setShowReviewModal(false);
  //     setRating(0);
  //     setReviewText("");
  //     alert("Thank you for your review!");

  //     // Optionally refresh course data to show new review
  //     const response = await axiosInstance.get(`/api/courses/courses/${id}/detail/`);
  //     setCourse(response.data);
  //   } catch (error) {
  //     console.error("Failed to submit review:", error);
  //     alert("Failed to submit review. Please try again.");
  //   } finally {
  //     setIsSubmittingReview(false);
  //   }
  // };

  const getContentIcon = (type) => {
    const t = type?.toLowerCase();
    if (t === "video") return <Video className="w-4 h-4" />;
    if (t === "article" || t === "text") return <FileText className="w-4 h-4" />;
    if (t === "pdf" || t === "doc") return <File className="w-4 h-4" />;
    if (t === "image") return <ImageIcon className="w-4 h-4" />;
    return <PlayCircle className="w-4 h-4" />;
  };

  // Render the active content based on type
  const renderContent = (section) => {
    if (!section) {
      return (
        <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300">
          <div className="text-center">
            <PlayCircle className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 poppins-regular">Select a lesson to begin</p>
          </div>
        </div>
      );
    }

    const type = section.content_type?.toLowerCase();
    const url = section.content_url || section.file;

    console.log(`Rendering content for section: ${section.title}`, { type, url, section });

    if (type === "video") {
      return <VideoPlayer url={url} />;
    }

    if (type === "pdf") {
      return (
        <div className="aspect-video bg-gray-100 flex items-center justify-center rounded-xl overflow-hidden">
          {url ? (
            <iframe src={url} className="w-full h-full" title="PDF Viewer" />
          ) : (
            <div className="text-gray-500">No PDF available</div>
          )}
        </div>
      );
    }

    if (type === "image") {
      return (
        <div className="flex justify-center bg-gray-50 p-8 rounded-xl">
          <img src={url} alt={section.title} className="max-h-[600px] object-contain rounded-lg shadow-lg" />
        </div>
      );
    }

    if (type === "audio") {
      return (
        <div className="w-full p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center">
          {url ? (
            <audio controls className="w-full max-w-2xl" src={url}>
              Your browser does not support the audio element.
            </audio>
          ) : (
            <div className="text-gray-500">No audio available</div>
          )}
        </div>
      );
    }

    // Default: Article/Text
    return (
      <div className="p-8 bg-white rounded-xl border border-gray-200">
        {section.content_text && (
          <div className="prose max-w-none text-gray-800 poppins-regular whitespace-pre-wrap leading-relaxed">
            {section.content_text}
          </div>
        )}
        {url && (type !== 'video' && type !== 'pdf' && type !== 'image') && (
          <div className="mt-6">
            <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#FF8211] hover:text-[#ff7906] font-medium transition-colors">
              <File className="w-4 h-4" /> Download Resource
            </a>
          </div>
        )}
      </div>
    );
  };

  if (!course) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50"></div>
        <Footer />
      </>
    );
  }

  // Calculations
  const totalSections = (course.lessons_details || course.lessons)?.reduce((acc, lesson) => acc + (lesson.sections?.length || 0), 0) || 0;
  const completionPercentage = totalSections > 0 ? Math.round((completedSections.size / totalSections) * 100) : 0;

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const averageRating = course.ratings?.average_rating;
  const totalRatings = course.ratings?.total_ratings || 0;
  const displayRating = averageRating ? averageRating.toFixed(1) : "NEW";

  // Get motivational message based on progress
  const getProgressMessage = () => {
    if (completionPercentage === 0) return "Let's start your fitness journey!";
    if (completionPercentage < 25) return "Great start! Keep going!";
    if (completionPercentage < 50) return "You're making progress!";
    if (completionPercentage < 75) return "Over halfway there! Stay strong!";
    if (completionPercentage < 100) return "Almost done! Finish strong!";
    return "Course completed! Amazing work!";
  };

  return (
    <>
      <NavTraineeDash />

      {/* Compact Hero Header with Course Info */}
      <div className="w-full bg-gradient-to-br from-[#FF8211]/5 via-[#86ac55]/5 to-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <Link
            to="/trainee/courses"
            className="text-[#FF8211] text-sm font-medium hover:underline poppins-regular inline-flex items-center gap-1 mb-3"
          >
            ← Back to My Courses
          </Link>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-[300px]">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 bebas-regular mb-2">
                {course.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mb-3">
                {course.category_name && (
                  <span className="px-2.5 py-1 bg-[#FF8211]/10 text-[#FF8211] rounded-full text-xs font-medium poppins-regular">
                    {course.category_name}
                  </span>
                )}
                <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium poppins-regular flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  {course.level_name || course.level || "All Levels"}
                </span>
                {course.language && (
                  <span className="px-2.5 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-medium poppins-regular flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" />
                    {course.language}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 poppins-regular">
                {averageRating && (
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-[#FF8211] text-[#FF8211]" />
                    <span className="font-medium text-gray-900">{displayRating}</span>
                    <span className="text-xs">({totalRatings})</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>{course.students_enrolled || 0} students</span>
                </div>
                {course.total_duration && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(course.total_duration)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Badge */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 min-w-[180px]">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#FF8211] bebas-regular mb-1">
                  {completionPercentage}%
                </div>
                <div className="text-xs text-gray-600 poppins-regular mb-2">Course Progress</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-[#FF8211] to-[#86ac55] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Main Content Area - Left Side */}
          <div className="lg:col-span-8 space-y-6">
            {/* Video/Content Player */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {currentSection && (
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 bebas-regular">{currentSection.title}</h2>
                    <p className="text-sm text-gray-600 poppins-regular mt-0.5">
                      {currentSection.content_type && (
                        <span className="capitalize">{currentSection.content_type}</span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={toggleComplete}
                    disabled={updatingSectionId === currentSection.id || completedSections.has(currentSection.id)}
                    className={`px-5 py-2.5 rounded-lg font-medium poppins-medium text-sm flex items-center gap-2 transition-all ${completedSections.has(currentSection.id)
                      ? "bg-[#86ac55] text-white cursor-not-allowed"
                      : "bg-[#FF8211] text-white hover:bg-[#ff7906]"
                      } ${updatingSectionId === currentSection.id ? "opacity-75 cursor-not-allowed" : ""}`}
                  >
                    {updatingSectionId === currentSection.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    {updatingSectionId === currentSection.id
                      ? "Updating..."
                      : completedSections.has(currentSection.id) ? "Completed" : "Mark Complete"
                    }
                  </button>
                </div>
              )}

              <div className="p-6">
                {renderContent(currentSection)}
              </div>

              {/* Lesson Description */}
              {currentSection && currentSection.description && (
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#FF8211]" />
                    About This Lesson
                  </h3>
                  <p className="text-sm text-gray-700 poppins-regular leading-relaxed">
                    {currentSection.description || currentSection.content_text || "No additional details available."}
                  </p>
                </div>
              )}
            </div>

            {/* Motivational Progress Card */}
            <div className="bg-gradient-to-br from-[#FF8211] to-[#ff9933] rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Flame className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold bebas-regular mb-1">{getProgressMessage()}</h3>
                  <p className="text-white/90 text-sm poppins-regular">
                    {completedSections.size} of {totalSections} lessons completed
                  </p>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="text-4xl font-bold bebas-regular">{completionPercentage}%</div>
                </div>
              </div>
            </div>

            {/* Review Course Button - Appears at 100% completion */}
            {completionPercentage === 100 && (
              <div className="bg-gradient-to-br from-[#86ac55] to-[#6d8c44] rounded-2xl shadow-lg p-6 text-white">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Star className="w-6 h-6 fill-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold bebas-regular">Congratulations! 🎉</h3>
                      <p className="text-white/90 text-sm poppins-regular">Share your experience with others</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="px-6 py-3 bg-white text-[#86ac55] rounded-lg font-bold bebas-regular text-lg hover:bg-gray-50 transition-all shadow-md hover:shadow-lg active:scale-95"
                  >
                    Review Course
                  </button>
                </div>
              </div>
            )}

            {/* Review Modal */}
            {showReviewModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowReviewModal(false)}>
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                  <div className="sticky top-0 bg-gradient-to-r from-[#FF8211] to-[#ff9933] text-white p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold bebas-regular">Review This Course</h2>
                        <p className="text-white/90 text-sm poppins-regular mt-1">{course.title}</p>
                      </div>
                      <button
                        onClick={() => setShowReviewModal(false)}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Star Rating */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3 poppins-semibold">
                        Rate Your Experience
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="transition-all transform hover:scale-110 active:scale-95"
                          >
                            <Star
                              className={`w-10 h-10 ${star <= (hoverRating || rating)
                                ? 'fill-[#FF8211] text-[#FF8211]'
                                : 'text-gray-300'
                                }`}
                            />
                          </button>
                        ))}
                        {rating > 0 && (
                          <span className="ml-3 text-sm font-medium text-gray-600 poppins-medium">
                            {rating} {rating === 1 ? 'star' : 'stars'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Review Text */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3 poppins-semibold">
                        Share Your Thoughts
                      </label>
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Tell us about your experience with this course..."
                        rows={6}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#FF8211] focus:outline-none resize-none poppins-regular text-gray-900 placeholder-gray-400"
                      />
                      <p className="text-xs text-gray-500 mt-2 poppins-regular">
                        {reviewText.length} characters
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setShowReviewModal(false);
                          setRating(0);
                          setReviewText("");
                        }}
                        className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold poppins-semibold hover:bg-gray-50 transition-colors"
                        disabled={isSubmittingReview}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitReview}
                        disabled={isSubmittingReview || rating === 0 || !reviewText.trim()}
                        className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF8211] to-[#ff9933] text-white font-bold bebas-regular text-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        {isSubmittingReview ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          'Submit Review'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Section */}
            {course.reviews && course.reviews.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-2xl font-bold text-gray-900 bebas-regular mb-4 flex items-center gap-2">
                  <Star className="w-6 h-6 text-[#FF8211]" />
                  Student Reviews ({course.reviews.length})
                </h3>
                <div className="space-y-4">
                  {course.reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                      <div className="flex items-start gap-3 mb-2">
                        {/* Profile Picture */}
                        {review.profile_picture ? (
                          <img
                            src={review.profile_picture}
                            alt={review.username || 'Anonymous'}
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF8211] to-[#ff9933] flex items-center justify-center text-white font-semibold text-sm">
                            {review.username ? review.username.charAt(0).toUpperCase() : 'A'}
                          </div>
                        )}

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-gray-900 poppins-semibold">
                              {review.username || 'Anonymous Student'}
                            </span>
                            {review.review_date && (
                              <span className="text-xs text-gray-500">
                                · {new Date(review.review_date).toLocaleDateString()}
                              </span>
                            )}
                          </div>

                          {/* Star Rating */}
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < (review.rating || 0)
                                  ? 'fill-[#FF8211] text-[#FF8211]'
                                  : 'text-gray-300'
                                  }`}
                              />
                            ))}
                          </div>

                          {/* Review Text */}
                          {review.review && (
                            <p className="text-sm text-gray-700 poppins-regular leading-relaxed">
                              {review.review}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-4">
            <div className="sticky top-20 space-y-6">

              {/* Course Stats Card */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-sm border border-gray-200 p-5 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF8211]/5 rounded-full -mr-16 -mt-16"></div>
                <h3 className="font-bold text-gray-900 bebas-regular text-xl mb-4 relative">Course Overview</h3>
                <div className="space-y-3 relative">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-[#FF8211]/10 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-[#FF8211]" />
                      </div>
                      <span className="text-sm text-gray-600 poppins-regular">Lessons</span>
                    </div>
                    <span className="font-semibold text-gray-900 poppins-semibold">
                      {(course.lessons_details || course.lessons)?.length || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-[#86ac55]/10 rounded-lg flex items-center justify-center">
                        <Target className="w-4 h-4 text-[#86ac55]" />
                      </div>
                      <span className="text-sm text-gray-600 poppins-regular">Sections</span>
                    </div>
                    <span className="font-semibold text-gray-900 poppins-semibold">{totalSections}</span>
                  </div>

                  {course.total_duration && (
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                          <Clock className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-600 poppins-regular">Duration</span>
                      </div>
                      <span className="font-semibold text-gray-900 poppins-semibold">
                        {formatDuration(course.total_duration)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Curriculum */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 bebas-regular text-xl mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#FF8211]" />
                  Curriculum
                </h3>

                <div className="space-y-2">
                  {(() => {
                    const lessonsToUse = course.lessons_details || course.lessons;
                    return lessonsToUse && lessonsToUse.length > 0 ? (
                      lessonsToUse.map((lesson, lessonIndex) => (
                        <div key={lesson.id || lessonIndex} className="border border-gray-200 rounded-xl overflow-hidden hover:border-[#FF8211]/50 transition-colors">
                          <button
                            onClick={() => toggleSection(lessonIndex)}
                            className="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-all flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2.5 flex-1 min-w-0">
                              <div className="shrink-0">
                                {expandedSections.has(lessonIndex) ?
                                  <ChevronDown className="w-4 h-4 text-[#FF8211]" /> :
                                  <ChevronRight className="w-4 h-4 text-gray-400" />
                                }
                              </div>
                              <span className="font-semibold text-gray-900 text-sm poppins-semibold text-left truncate">
                                {lesson.title}
                              </span>
                            </div>
                            {lesson.duration && (
                              <span className="text-xs text-gray-500 poppins-regular flex items-center gap-1 ml-2 shrink-0">
                                <Clock className="w-3 h-3" />
                                {lesson.duration}
                              </span>
                            )}
                          </button>

                          {expandedSections.has(lessonIndex) && (
                            <div className="bg-white">
                              {lesson.sections && lesson.sections.length > 0 ? (
                                lesson.sections.map((section) => (
                                  <button
                                    key={section.id}
                                    onClick={() => handleSectionClick(section)}
                                    className={`w-full px-4 py-3 border-t border-gray-100 hover:bg-gradient-to-r hover:from-[#FF8211]/5 hover:to-transparent transition-all flex items-center justify-between group ${currentSection?.id === section.id
                                      ? "bg-gradient-to-r from-[#FF8211]/10 to-transparent border-l-4 border-l-[#FF8211]"
                                      : ""
                                      }`}
                                  >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                      <div className="text-gray-400 group-hover:text-[#FF8211] transition-colors shrink-0">
                                        {getContentIcon(section.content_type)}
                                      </div>
                                      <span className="text-sm text-gray-700 poppins-regular text-left truncate">
                                        {section.title}
                                      </span>
                                    </div>
                                    {completedSections.has(section.id) && (
                                      <CheckCircle2 className="w-4 h-4 text-[#86ac55] shrink-0" />
                                    )}
                                  </button>
                                ))
                              ) : (
                                <div className="px-4 py-3 border-t border-gray-100 text-sm text-gray-500 poppins-regular text-center">
                                  No sections available
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500 text-sm">No content available</div>
                    );
                  })()}
                </div>
              </div>

              {/* Instructor Card */}
              {course.trainer_data && (
                <div className="bg-gradient-to-br from-[#86ac55] to-[#6d8c44] rounded-2xl shadow-lg p-5 text-white">
                  <h3 className="font-bold bebas-regular text-xl mb-3">Your Instructor</h3>

                  <div className="flex items-center gap-3 mb-4">
                    {course.trainer_data.profile_picture ? (
                      <img
                        src={course.trainer_data.profile_picture}
                        alt={course.trainer_data.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                        {course.trainer_data.name?.charAt(0).toUpperCase() || 'T'}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-white poppins-semibold">
                        {course.trainer_data.name || 'Trainer'}
                      </p>
                      <p className="text-white/80 text-xs poppins-regular">Course Instructor</p>
                    </div>
                  </div>

                  <Link
                    to={`/trainer-profile/${course.trainer_data.id || course.trainer_profile}`}
                    className="block w-full text-center px-4 py-2.5 bg-white text-[#86ac55] rounded-lg font-semibold bebas-regular hover:bg-gray-50 transition-colors text-lg"
                  >
                    View Profile
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CourseLearn;
