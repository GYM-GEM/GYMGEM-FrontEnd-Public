import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Star,
  Users,
  Globe,
  Award,
  Clock,
  PlayCircle,
  FileText,
  Download,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Heart,
  Share2,
  Lock,
  Video,
  File,
  Image as ImageIcon,
} from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";

const CourseDetails = () => {
  const { id } = useParams();
  const courses = JSON.parse(localStorage.getItem("courses")) || [];
  const course = courses.find((c) => String(c.id) === id);

  const [expandedSections, setExpandedSections] = useState(new Set());
  const [showLockModal, setShowLockModal] = useState(false);

  if (!course) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#FF8211] bebas-medium mb-4">
              Course Not Found
            </h1>
            <Link
              to="/courses"
              className="text-[#FF8211] hover:underline poppins-regular"
            >
              ← Back to Courses
            </Link>
          </div>
        </main>
      </>
    );
  }

  // Course data
  const courseData = {
    rating: 4.8,
    reviewsCount: 1247,
    enrolledCount: 5832,
    price: course.price || 49.99,
    instructor: (() => {
      const savedProfile = JSON.parse(localStorage.getItem("trainerProfile"));
      return {
        name: savedProfile?.name || "Mahmoud Gado",
        title: savedProfile?.job || "Certified Fitness Trainer",
        bio: savedProfile?.bio || "Passionate about helping people achieve their fitness goals through proper strength training and nutrition guidance.",
        avatar: savedProfile?.avatar || "https://i.pravatar.cc/150?img=3",
        totalCourses: 12, // This could be dynamic based on courses length
        totalTrainees: 25000,
      };
    })(),
    lastUpdated: "December 2024",
    language: course.language || "English",
    totalVideoHours: 12,
    totalLessons: course.lessons?.reduce((acc, l) => acc + (l.sections?.length || 0), 0) || 0,
    whatYouLearn: [
      "Master the fundamentals of strength training",
      "Create personalized workout routines",
      "Understand proper form and technique",
      "Learn nutrition strategies for muscle building",
      "Prevent common injuries and setbacks",
      "Track progress and set achievable goals",
    ],
    includes: [
      { icon: Video, text: `${12} hours of on-demand video` },
      { icon: FileText, text: `${course.lessons?.reduce((acc, l) => acc + (l.sections?.length || 0), 0) || 0} lessons` },
      { icon: Download, text: "Downloadable resources" },
      { icon: Award, text: "Certificate of completion" },
    ],
    reviews: [
      {
        name: "Michael Turner",
        avatar: "MT",
        rating: 5,
        date: "2 weeks ago",
        comment: "Excellent course! The techniques are easy to follow and very effective. I've seen great results in just a few weeks.",
      },
      {
        name: "Emma Rodriguez",
        avatar: "ER",
        rating: 5,
        date: "1 month ago",
        comment: "This transformed my approach to fitness. The trainer is knowledgeable and explains everything clearly.",
      },
      {
        name: "David Chen",
        avatar: "DC",
        rating: 4,
        date: "1 month ago",
        comment: "Great content and clear instruction. The workout plans are practical and effective.",
      },
    ],
  };

  const toggleSection = (index) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleLockedLessonClick = () => {
    setShowLockModal(true);
  };

  const getContentIcon = (type) => {
    switch (type) {
      case "Video":
        return <Video className="w-4 h-4" />;
      case "Article":
        return <FileText className="w-4 h-4" />;
      case "PDF":
      case "DOC":
        return <File className="w-4 h-4" />;
      case "Image":
        return <ImageIcon className="w-4 h-4" />;
      default:
        return <PlayCircle className="w-4 h-4" />;
    }
  };

  const handleBuyNow = () => {
    alert("Purchase flow would be implemented here");
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div className="w-full bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Link
            to="/courses"
            className="text-[#FF8211] text-sm font-medium hover:underline poppins-regular inline-flex items-center gap-1 mb-4"
          >
            ← Back to courses
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 bebas-regular mb-3">
                {course.title}
              </h1>

              <p className="text-lg text-gray-600 poppins-regular mb-6">
                {course.description || "Master the fundamentals and transform your approach to fitness"}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-[#FF8211]/10 text-[#FF8211] rounded-lg text-sm font-medium poppins-regular">
                  {course.category || "Fitness"}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium poppins-regular flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  {course.level || "Beginner"}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium poppins-regular flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  {courseData.language}
                </span>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center gap-1">
                  <div className="flex text-[#FF8211]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" strokeWidth={0} />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-900 ml-2 poppins-regular">
                    {courseData.rating}
                  </span>
                  <span className="text-sm text-gray-600 poppins-regular">
                    ({courseData.reviewsCount.toLocaleString()} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 poppins-regular">
                  <Users className="w-5 h-5" />
                  <span className="text-sm">
                    {courseData.enrolledCount.toLocaleString()} students enrolled
                  </span>
                </div>
              </div>

              {/* CTA Buttons (Mobile) */}
              <div className="flex flex-wrap items-center gap-4 lg:hidden mb-6">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 px-8 py-3 bg-[#FF8211] text-white rounded-lg font-semibold bebas-regular text-lg hover:bg-[#ff7906] transition-colors shadow-sm"
                >
                  Buy Now - ${courseData.price}
                </button>
                <button className="px-6 py-3 border-2 border-[#FF8211] text-[#FF8211] rounded-lg hover:bg-[#FF8211]/10 transition-colors flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Course Preview (Desktop) */}
            <div className="lg:col-span-1">
              <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-200">
                <img
                  src={course.img || "https://via.placeholder.com/400x225"}
                  alt={course.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-center">
                    <Lock className="w-16 h-16 text-white mx-auto mb-3 opacity-90" />
                    <p className="text-white poppins-medium text-sm px-4">
                      🔒 You must enroll before accessing this course
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* What You'll Learn */}
            {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 bebas-regular mb-6">
                What You'll Learn
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courseData.whatYouLearn.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#86ac55] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 poppins-regular text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div> */}

            {/* Curriculum (Locked) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 bebas-regular">
                  Course Curriculum
                </h2>
                <span className="text-sm text-gray-500 poppins-regular">
                  {course.lessons?.length || 0} sections
                </span>
              </div>

              <div className="space-y-2">
                {course.lessons && course.lessons.length > 0 ? (
                  course.lessons.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection(lessonIndex)}
                        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          {expandedSections.has(lessonIndex) ? (
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                          )}
                          <span className="font-semibold text-gray-900 text-sm poppins-medium text-left">
                            {lesson.title}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 poppins-regular">
                          {lesson.duration || "45min"}
                        </span>
                      </button>

                      {expandedSections.has(lessonIndex) && (
                        <div className="bg-white">
                          {lesson.sections && lesson.sections.length > 0 ? (
                            lesson.sections.map((section) => (
                              <button
                                key={section.id}
                                onClick={handleLockedLessonClick}
                                className="w-full px-4 py-3 border-t border-gray-100 hover:bg-gray-50 transition-colors flex items-center justify-between group"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="text-gray-400">
                                    {getContentIcon(section.contentType)}
                                  </div>
                                  <span className="text-sm text-gray-700 poppins-regular text-left">
                                    {section.title}
                                  </span>
                                </div>
                                <Lock className="w-4 h-4 text-gray-400" />
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-3 border-t border-gray-100 text-sm text-gray-500 poppins-regular">
                              No sections available
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 poppins-regular text-center py-8">
                    No curriculum available
                  </p>
                )}
              </div>
            </div>

            {/* Course Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 bebas-regular mb-4">
                Course Description
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700 poppins-regular leading-relaxed">
                  {course.description || "Transform your fitness journey with this comprehensive strength training course designed for all levels."}
                </p>

              </div>
            </div>

            {/* Instructor */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 bebas-regular mb-6">
                Your Trainer
              </h2>
              <div className="flex items-start gap-6 mb-6">
                <img
                  src={courseData.instructor.avatar}
                  alt={courseData.instructor.name}
                  className="w-20 h-20 rounded-full border-2 border-[#FF8211] flex-shrink-0"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 poppins-medium mb-1">
                    {courseData.instructor.name}
                  </h3>
                  <p className="text-gray-600 poppins-regular text-sm mb-4">
                    {courseData.instructor.title}
                  </p>
                  <div className="flex flex-wrap gap-6 text-sm text-gray-600 poppins-regular mb-4">
                    <div className="flex items-center gap-2">
                      <PlayCircle className="w-4 h-4 text-[#FF8211]" />
                      <span>{courseData.instructor.totalCourses} Courses</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#FF8211]" />
                      <span>{courseData.instructor.totalTrainees.toLocaleString()} Trainees</span>
                    </div>
                  </div>
                  <p className="text-gray-700 poppins-regular text-sm leading-relaxed mb-4">
                    {courseData.instructor.bio}
                  </p>
                  <Link 
                    to="/trainer-profile"
                    className="px-4 py-2 border-2 border-[#FF8211] text-[#FF8211] rounded-lg font-medium poppins-regular text-sm hover:bg-[#FF8211]/10 transition-colors inline-block"
                  >
                    View Trainer Profile
                  </Link>
                </div>
              </div>
            </div>

            {/* Client Reviews */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 bebas-regular mb-6">
                Client Reviews
              </h2>
              <div className="space-y-6">
                {courseData.reviews.map((review, idx) => (
                  <div key={idx} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#FF8211] flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {review.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 poppins-medium">
                            {review.name}
                          </h4>
                          <span className="text-xs text-gray-500 poppins-regular">
                            {review.date}
                          </span>
                        </div>
                        <div className="flex text-[#FF8211] mb-2">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" strokeWidth={0} />
                          ))}
                        </div>
                        <p className="text-gray-700 poppins-regular text-sm">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar (Desktop) */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {/* Price Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="mb-6">
                  <span className="text-4xl font-bold text-[#FF8211] bebas-regular">
                    ${courseData.price}
                  </span>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleBuyNow}
                    className="w-full px-6 py-3 bg-[#FF8211] text-white rounded-lg font-semibold bebas-regular text-lg hover:bg-[#ff7906] transition-colors shadow-sm"
                  >
                    Buy Now
                  </button>
                  <button className="w-full px-6 py-3 border-2 border-[#FF8211] text-[#FF8211] rounded-lg font-semibold bebas-regular text-lg hover:bg-[#FF8211]/10 transition-colors flex items-center justify-center gap-2">
                    <Heart className="w-5 h-5" />
                    Add to Wishlist
                  </button>
                  <button className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium poppins-regular hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>

              {/* What's Included */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 bebas-regular text-xl mb-4">
                  What's Included
                </h3>
                <div className="space-y-3">
                  {courseData.includes.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-[#FF8211]" />
                      <span className="text-sm text-gray-700 poppins-regular">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-2xl font-bold text-[#FF8211] bebas-regular">
              ${courseData.price}
            </span>
          </div>
          <button
            onClick={handleBuyNow}
            className="flex-1 px-6 py-3 bg-[#FF8211] text-white rounded-lg font-semibold bebas-regular hover:bg-[#ff7906] transition-colors shadow-sm"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* Lock Modal */}
      {showLockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FF8211]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-[#FF8211]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 bebas-regular mb-2">
                This lesson is locked
              </h3>
              <p className="text-gray-600 poppins-regular mb-6">
                Purchase the course to continue learning and access all lessons.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowLockModal(false);
                    handleBuyNow();
                  }}
                  className="w-full px-6 py-3 bg-[#FF8211] text-white rounded-lg font-semibold bebas-regular hover:bg-[#ff7906] transition-colors"
                >
                  Buy Course - ${courseData.price}
                </button>
                <button
                  onClick={() => setShowLockModal(false)}
                  className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium poppins-regular hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default CourseDetails;
