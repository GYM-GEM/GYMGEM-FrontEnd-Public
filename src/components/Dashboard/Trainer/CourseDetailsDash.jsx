import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Book,
  Clock,
  Award,
  Globe,
  Video,
  FileText,
  File as FileIcon,
  Image as ImageIcon,
  PlayCircle,
  Save,
  X,
} from "lucide-react";
import NavBarDash from "./NavBarDash";
import FooterDash from "../FooterDash";
import axiosInstance from "../../../utils/axiosConfig";

const CourseDetailsDash = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [expandedSections, setExpandedSections] = useState(new Set());

  // Editing States
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [isEditingLearn, setIsEditingLearn] = useState(false);
  const [isEditingSection, setIsEditingSection] = useState(false);
  const [editingSectionData, setEditingSectionData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingSectionData, setDeletingSectionData] = useState(null);

  // Form States
  const [infoForm, setInfoForm] = useState({});
  const [descForm, setDescForm] = useState("");
  const [learnForm, setLearnForm] = useState([]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axiosInstance.get(`/api/courses/courses/${id}/detail/`);
        const foundCourse = response.data;

        // Ensure whatYouLearn exists (if backend doesn't provide it, keep default or empty)
        if (!foundCourse.whatYouLearn) {
          foundCourse.whatYouLearn = [
            "Master the fundamentals of strength training",
            "Create personalized workout routines",
            "Understand proper form and technique",
            "Learn nutrition strategies for muscle building",
            "Prevent common injuries and setbacks",
            "Track progress and set achievable goals",
          ];
        }
        setCourse(foundCourse);
        setInfoForm({
          title: foundCourse.title,
          price: foundCourse.price,
          category: foundCourse.category,
          level: foundCourse.level,
          language: foundCourse.language,
        });
        setDescForm(foundCourse.description || "");
        setLearnForm(foundCourse.whatYouLearn);
      } catch (error) {
        console.error("Failed to fetch course details:", error);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  const updateCourseInStorage = (updatedCourse) => {
    const courses = JSON.parse(localStorage.getItem("courses")) || [];
    const updatedCourses = courses.map((c) =>
      c.id === updatedCourse.id ? updatedCourse : c
    );
    localStorage.setItem("courses", JSON.stringify(updatedCourses));
    setCourse(updatedCourse);
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

  const getContentIcon = (type) => {
    const t = type?.toLowerCase();
    switch (t) {
      case "video":
        return <Video className="w-4 h-4" />;
      case "article":
      case "text":
        return <FileText className="w-4 h-4" />;
      case "pdf":
      case "doc":
        return <FileIcon className="w-4 h-4" />;
      case "image":
        return <ImageIcon className="w-4 h-4" />;
      case "audio":
        return <PlayCircle className="w-4 h-4" />;
      default:
        return <PlayCircle className="w-4 h-4" />;
    }
  };

  const handlePublishToggle = () => {
    if (!course) return;
    const newStatus = course.status === "Published" ? "Draft" : "Published";
    const updatedCourse = { ...course, status: newStatus };
    updateCourseInStorage(updatedCourse);
  };

  const handleDeleteCourse = () => {
    if (!course) return;
    const confirmed = window.confirm(
      `Are you sure you want to delete "${course.title}"? This action cannot be undone.`
    );
    if (confirmed) {
      const courses = JSON.parse(localStorage.getItem("courses")) || [];
      const updatedCourses = courses.filter((c) => c.id !== course.id);
      localStorage.setItem("courses", JSON.stringify(updatedCourses));
      navigate("/trainer/courses");
    }
  };

  // Save Handlers
  const handleSaveInfo = () => {
    const updatedCourse = { ...course, ...infoForm };
    updateCourseInStorage(updatedCourse);
    setIsEditingInfo(false);
  };

  const handleSaveDesc = () => {
    const updatedCourse = { ...course, description: descForm };
    updateCourseInStorage(updatedCourse);
    setIsEditingDesc(false);
  };

  const handleSaveLearn = () => {
    const updatedCourse = { ...course, whatYouLearn: learnForm };
    updateCourseInStorage(updatedCourse);
    setIsEditingLearn(false);
  };

  // Learn Section Helpers
  const handleAddLearnItem = () => {
    setLearnForm([...learnForm, ""]);
  };

  const handleRemoveLearnItem = (index) => {
    const newItems = learnForm.filter((_, i) => i !== index);
    setLearnForm(newItems);
  };

  const handleLearnItemChange = (index, value) => {
    const newItems = [...learnForm];
    newItems[index] = value;
    setLearnForm(newItems);
  };

  // Section Handlers
  const handleEditSection = (section, lessonIndex) => {
    setEditingSectionData({ ...section, lessonIndex });
    setIsEditingSection(true);
  };

  const handleDeleteSection = (sectionId, lessonIndex) => {
    setDeletingSectionData({ sectionId, lessonIndex });
    setShowDeleteModal(true);
  };

  const confirmDeleteSection = async () => {
    if (!deletingSectionData) return;

    const { sectionId, lessonIndex } = deletingSectionData;

    try {
      // Call backend to delete section
      await axiosInstance.delete(`/api/courses/sections/${sectionId}/`);

      // Update local state
      const updatedCourse = { ...course };
      const lessons = updatedCourse.lessons_details || updatedCourse.lessons;
      if (lessons && lessons[lessonIndex]) {
        lessons[lessonIndex].sections = lessons[lessonIndex].sections.filter(
          (s) => s.id !== sectionId
        );
      }
      setCourse(updatedCourse);
      setShowDeleteModal(false);
      setDeletingSectionData(null);
      alert("Section deleted successfully!");
    } catch (error) {
      console.error("Failed to delete section:", error);
      alert("Failed to delete section. Please try again.");
    }
  };

  const handleSaveSection = async () => {
    if (!editingSectionData) return;

    try {
      // Call backend to update section
      const response = await axiosInstance.patch(
        `/api/courses/sections/${editingSectionData.id}/`,
        {
          title: editingSectionData.title,
          content_type: editingSectionData.content_type,
          content_url: editingSectionData.content_url,
          content_text: editingSectionData.content_text,
        }
      );

      // Update local state
      const updatedCourse = { ...course };
      const lessons = updatedCourse.lessons_details || updatedCourse.lessons;
      if (lessons && lessons[editingSectionData.lessonIndex]) {
        const sectionIndex = lessons[editingSectionData.lessonIndex].sections.findIndex(
          (s) => s.id === editingSectionData.id
        );
        if (sectionIndex !== -1) {
          lessons[editingSectionData.lessonIndex].sections[sectionIndex] = response.data;
        }
      }
      setCourse(updatedCourse);
      setIsEditingSection(false);
      setEditingSectionData(null);
      alert("Section updated successfully!");
    } catch (error) {
      console.error("Failed to update section:", error);
      alert("Failed to update section. Please try again.");
    }
  };

  if (!course) {
    return (
      <>
        <NavBarDash />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Course not found
            </h2>
            <Link
              to="/trainer/courses"
              className="text-[#FF8211] hover:underline"
            >
              ← Back to Courses
            </Link>
          </div>
        </div>
      </>
    );
  }

  const clientReviews = [
    {
      id: 1,
      name: "Michael Turner",
      avatar: "MT",
      rating: 5,
      date: "2 weeks ago",
      comment:
        "Excellent course! The techniques are easy to follow and very effective. I've seen great results in just a few weeks.",
    },
    {
      id: 2,
      name: "Emma Rodriguez",
      avatar: "ER",
      rating: 5,
      date: "1 month ago",
      comment:
        "This transformed my approach to fitness. The trainer is knowledgeable and explains everything clearly.",
    },
    {
      id: 3,
      name: "David Chen",
      avatar: "DC",
      rating: 4,
      date: "1 month ago",
      comment:
        "Great content and clear instruction. The workout plans are practical and effective.",
    },
  ];

  return (
    <>
      <NavBarDash />
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            to="/trainer/courses"
            className="inline-flex items-center text-[#FF8211] hover:underline mb-6 poppins-regular text-sm"
          >
            ← Back to Courses
          </Link>

          {/* Top Section - Course Info */}
          <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Course Image */}
              <div className="md:col-span-1">
                <img
                  src={course.cover || "https://via.placeholder.com/400x300"}
                  alt={course.title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>

              {/* Course Details */}
              <div className="md:col-span-2 p-6">
                {isEditingInfo ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Course Title
                      </label>
                      <input
                        type="text"
                        value={infoForm.title}
                        onChange={(e) =>
                          setInfoForm({ ...infoForm, title: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8211]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <input
                          type="text"
                          value={infoForm.category}
                          onChange={(e) =>
                            setInfoForm({
                              ...infoForm,
                              category: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8211]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Level
                        </label>
                        <select
                          value={infoForm.level}
                          onChange={(e) =>
                            setInfoForm({ ...infoForm, level: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8211]"
                        >
                          <option>Beginner</option>
                          <option>Intermediate</option>
                          <option>Advanced</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Language
                        </label>
                        <input
                          type="text"
                          value={infoForm.language}
                          onChange={(e) =>
                            setInfoForm({
                              ...infoForm,
                              language: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8211]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price ($)
                        </label>
                        <input
                          type="number"
                          value={infoForm.price}
                          onChange={(e) =>
                            setInfoForm({ ...infoForm, price: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8211]"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        onClick={() => setIsEditingInfo(false)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveInfo}
                        className="px-4 py-2 bg-[#FF8211] text-white rounded-md hover:bg-[#ff7906]"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 bebas-regular">
                      {course.title}
                    </h1>

                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-[#FF8211]/10 text-[#FF8211] rounded-lg text-sm font-medium poppins-regular flex items-center gap-1">
                        <Book className="w-4 h-4" />
                        {course.category || "Fitness"}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium poppins-regular flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        {course.level || "Beginner"}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium poppins-regular flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        {course.language || "English"}
                      </span>
                    </div>

                    {/* Price and Status */}
                    <div className="flex flex-wrap items-center gap-6 mb-6">
                      <div>
                        <span className="text-sm text-muted-foreground poppins-regular block mb-1">
                          Price
                        </span>
                        <span className="text-2xl font-bold text-[#86ac55] bebas-regular">
                          ${course.price || "0"}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground poppins-regular block mb-1">
                          Status
                        </span>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium poppins-regular ${course.status?.toLowerCase() === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                            }`}
                        >
                          {course.status?.toLowerCase() === "published" ? (
                            <Eye className="w-4 h-4 mr-1" />
                          ) : (
                            <EyeOff className="w-4 h-4 mr-1" />
                          )}
                          {course.status || "Draft"}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground poppins-regular block mb-1">
                          Students
                        </span>
                        <span className="text-xl font-semibold text-foreground poppins-medium">
                          {course.students_enrolled || 0}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-card rounded-lg shadow-sm border border-border p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground bebas-regular">
                Course Description
              </h2>
              {!isEditingDesc && (
                <button
                  onClick={() => setIsEditingDesc(true)}
                  className="text-[#FF8211] hover:text-[#ff7906] poppins-regular text-sm flex items-center gap-1"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              )}
            </div>
            {isEditingDesc ? (
              <div className="space-y-4">
                <textarea
                  value={descForm}
                  onChange={(e) => setDescForm(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8211]"
                  placeholder="Enter course description..."
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setIsEditingDesc(false);
                      setDescForm(course.description || "");
                    }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md flex items-center gap-1"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                  <button
                    onClick={handleSaveDesc}
                    className="px-4 py-2 bg-[#FF8211] text-white rounded-md hover:bg-[#ff7906] flex items-center gap-1"
                  >
                    <Save className="w-4 h-4" /> Save
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground poppins-regular leading-relaxed whitespace-pre-wrap">
                {course.description ||
                  "Transform your fitness journey with this comprehensive course designed for all levels. Learn proper techniques, build strength safely, and achieve your goals with expert guidance."}
              </p>
            )}
          </div>



          {/* Curriculum Section */}
          <div className="bg-card rounded-lg shadow-sm border border-border p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground bebas-regular">
                Course Curriculum
              </h2>
              <div className="flex gap-2">
                <Link
                  to="/trainer/addlesson"
                  state={{ course }}
                  className="px-4 py-2 bg-[#FF8211] text-white rounded-lg hover:bg-[#ff7906] transition-colors poppins-regular text-sm flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Lesson
                </Link>
              </div>
            </div>

            {(course.lessons_details || course.lessons) && (course.lessons_details || course.lessons).length > 0 ? (
              <div className="space-y-2">
                {(course.lessons_details || course.lessons).map((lesson, lessonIndex) => (
                  <div
                    key={lessonIndex}
                    className="border border-border rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleSection(lessonIndex)}
                      className="w-full px-4 py-3 bg-muted hover:bg-muted/80 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {expandedSections.has(lessonIndex) ? (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        )}
                        <span className="font-semibold text-foreground poppins-medium">
                          {lesson.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground poppins-regular">
                          {lesson.sections?.length || 0} sections
                        </span>
                        <span className="text-sm text-muted-foreground poppins-regular flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {lesson.duration || "45min"}
                        </span>
                      </div>
                    </button>

                    {expandedSections.has(lessonIndex) && (
                      <div className="bg-background">
                        {lesson.sections && lesson.sections.length > 0 ? (
                          lesson.sections.map((section) => (
                            <div
                              key={section.id}
                              className="px-4 py-3 border-t border-border flex items-center justify-between hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="text-muted-foreground">
                                  {getContentIcon(section.content_type || section.contentType)}
                                </div>
                                <span className="text-sm text-foreground poppins-regular">
                                  {section.title}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEditSection(section, lessonIndex)}
                                  className="text-[#FF8211] hover:text-[#ff7906] p-1 cursor-pointer"
                                  title="Edit section"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSection(section.id, lessonIndex)}
                                  className="text-red-600 hover:text-red-700 p-1 cursor-pointer"
                                  title="Delete section"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 border-t border-border text-sm text-muted-foreground poppins-regular">
                            No sections added yet
                          </div>
                        )}
                        <div className="px-4 py-3 border-t border-border">
                          <Link
                            to="/trainer/addsection"
                            state={{ course, lesson }}
                            className="text-[#FF8211] hover:text-[#ff7906] poppins-regular text-sm flex items-center gap-1"
                          >
                            <Plus className="w-4 h-4" />
                            Add Section
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground poppins-regular mb-4">
                  No lessons added yet
                </p>
                <Link
                  to="/trainer/addlesson"
                  state={{ course }}
                  className="inline-flex items-center px-4 py-2 bg-[#FF8211] text-white rounded-lg hover:bg-[#ff7906] transition-colors poppins-regular text-sm gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create First Lesson
                </Link>
              </div>
            )}
          </div>

          {/* Client Reviews Section */}
          <div className="bg-card rounded-lg shadow-sm border border-border p-6 mb-8">
            <h2 className="text-2xl font-bold text-foreground bebas-regular mb-6">
              Client Reviews
            </h2>
            <div className="space-y-6">
              {clientReviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-border pb-6 last:border-0 last:pb-0"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#FF8211] flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {review.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-foreground poppins-medium">
                          {review.name}
                        </h4>
                        <span className="text-xs text-muted-foreground poppins-regular">
                          {review.date}
                        </span>
                      </div>
                      <div className="flex text-[#FF8211] mb-2">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-current"
                            strokeWidth={0}
                          />
                        ))}
                      </div>
                      <p className="text-muted-foreground poppins-regular text-sm">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-end">
            <button
              onClick={() => setIsEditingInfo(true)}
              className="px-6 py-3 border-2 border-[#FF8211] text-[#FF8211] rounded-lg hover:bg-[#FF8211]/10 transition-colors poppins-medium flex items-center gap-2 cursor-pointer"
            >
              <Edit className="w-5 h-5" />
              Edit Course
            </button>
            <button
              onClick={handlePublishToggle}
              className={`px-6 py-3 rounded-lg transition-colors poppins-medium flex items-center gap-2 cursor-pointer ${course.status?.toLowerCase() === "published"
                ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                : "bg-[#86ac55] text-white hover:bg-[#86ac55]/90"
                }`}
            >
              {course.status?.toLowerCase() === "published" ? (
                <>
                  <EyeOff className="w-5 h-5" />
                  Unpublish
                </>
              ) : (
                <>
                  <Eye className="w-5 h-5" />
                  Publish
                </>
              )}
            </button>
            <button
              onClick={handleDeleteCourse}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors poppins-medium flex items-center gap-2 cursor-pointer"
            >
              <Trash2 className="w-5 h-5" />
              Delete Course
            </button>
          </div>
        </div>
      </div>

      {/* Edit Section Modal */}
      {isEditingSection && editingSectionData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-foreground bebas-regular">
                  Edit Section
                </h3>
                <button
                  onClick={() => {
                    setIsEditingSection(false);
                    setEditingSectionData(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={editingSectionData.title}
                    onChange={(e) =>
                      setEditingSectionData({
                        ...editingSectionData,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8211]"
                    placeholder="Enter section title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content Type
                  </label>
                  <select
                    value={editingSectionData.content_type}
                    onChange={(e) =>
                      setEditingSectionData({
                        ...editingSectionData,
                        content_type: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8211]"
                  >
                    <option value="video">Video</option>
                    <option value="article">Article</option>
                    <option value="pdf">PDF</option>
                    <option value="image">Image</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content URL
                  </label>
                  <input
                    type="url"
                    value={editingSectionData.content_url || ""}
                    onChange={(e) =>
                      setEditingSectionData({
                        ...editingSectionData,
                        content_url: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8211]"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content Description
                  </label>
                  <textarea
                    value={editingSectionData.content_text || ""}
                    onChange={(e) =>
                      setEditingSectionData({
                        ...editingSectionData,
                        content_text: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8211]"
                    placeholder="Enter section description..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setIsEditingSection(false);
                    setEditingSectionData(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSection}
                  className="px-4 py-2 bg-[#FF8211] text-white rounded-md hover:bg-[#ff7906] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
                Delete Section
              </h3>

              <p className="text-center text-gray-600 mb-6">
                Are you sure you want to delete this section? This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletingSectionData(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteSection}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <FooterDash />
    </>
  );
};

export default CourseDetailsDash;
