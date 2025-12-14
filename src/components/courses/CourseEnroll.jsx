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
  Lock,
  MessageCircle,
  FileText,
  Video,
  File,
  Image as ImageIcon,
} from "lucide-react";
import ReactPlayer from "react-player";
import Navbar from "../Navbar";
import Footer from "../Footer";
import axiosInstance from "../../utils/axiosConfig";

const VideoPlayer = ({ url }) => {
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    setVideoError(false);
  }, [url]);

  return (
    <div className="w-full h-[500px] bg-black flex items-center justify-center relative">
       {/* ReactPlayer handles both file paths and YouTube/Vimeo URLs */}
       {!videoError && url ? (
         <ReactPlayer
           key={url}
           url={url}
           controls={true}
           width="100%"
           height="100%"
           className="react-player"
           config={{
             youtube: {
               playerVars: { origin: window.location.origin },
             },
           }}
           onError={(e) => {
             console.error("Video Error:", e);
             setVideoError(true);
           }}
         />
       ) : (
         <div className="text-white flex flex-col items-center gap-2">
            <Video className="w-12 h-12 opacity-50" />
            <p>{videoError ? "Unable to play video. Format may be unsupported." : "No video URL provided"}</p>
         </div>
       )}
    </div>
  );
};

const CourseEnroll = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [expandedSections, setExpandedSections] = useState(new Set([0]));
  const [currentSection, setCurrentSection] = useState(null);
  const [completedSections, setCompletedSections] = useState(new Set());
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // Use axiosInstance for global loader support
        const response = await axiosInstance.get(`/api/courses/courses/${id}/detail/`);
        setCourse(response.data);
      } catch (error) {
        console.error("Failed to fetch course:", error);
      }
    };
    if (id) {
      fetchCourse();
    }
  }, [id]);

  // Load user, comments, and progress on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user);

    // Load progress
    const savedProgress = JSON.parse(localStorage.getItem(`course_progress_${id}`)) || [];
    setCompletedSections(new Set(savedProgress));

    // Load comments
    const storedComments = JSON.parse(localStorage.getItem(`course_comments_${id}`)) || [];
    if (storedComments.length === 0) {
      // Mock comments if none
      const mockComments = [
        { id: 1, user: "John Doe", avatar: "JD", avatarColor: "bg-[#FF8211]", text: "Great content!", time: "2 days ago" },
      ];
      setComments(mockComments);
    } else {
      setComments(storedComments);
    }
  }, [id]);

  // Set initial current section once course is loaded
  useEffect(() => {
    if (course && !currentSection) {
      const lessonsToUse = course.lessons_details || course.lessons;
      if (lessonsToUse && lessonsToUse.length > 0) {
        // Try to find the first section of the first lesson
        const firstLesson = lessonsToUse[0];
        if (firstLesson.sections && firstLesson.sections.length > 0) {
          setCurrentSection(firstLesson.sections[0]);
        }
      }
    }
  }, [course, currentSection]);

  const handlePostComment = () => {
    if (!newComment.trim()) return;
    const comment = {
      id: Date.now(),
      user: currentUser?.name || "Guest User",
      avatar: currentUser?.name ? currentUser.name.substring(0, 2).toUpperCase() : "GU",
      avatarColor: "bg-[#FF8211]",
      text: newComment,
      time: "Just now"
    };
    const updatedComments = [comment, ...comments];
    setComments(updatedComments);
    setNewComment("");
    localStorage.setItem(`course_comments_${id}`, JSON.stringify(updatedComments));
  };

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
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleComplete = () => {
    if (currentSection) {
      setCompletedSections((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(currentSection.id)) {
          newSet.delete(currentSection.id);
        } else {
          newSet.add(currentSection.id);
        }
        // Save to local storage
        localStorage.setItem(`course_progress_${id}`, JSON.stringify([...newSet]));
        return newSet;
      });
    }
  };

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
    if (!section) return <div className="p-8 text-center text-gray-500">Select a lesson to view content</div>;

    const type = section.content_type?.toLowerCase();
    const url = section.content_url || section.file; // Handle both potential keys

    if (type === "video") {
      return <VideoPlayer url={url} />;
    }

    if (type === "pdf") {
      return (
        <div className="h-[600px] bg-gray-100 flex items-center justify-center">
             {url ? (
               <iframe src={url} className="w-full h-full" title="PDF Viewer" />
             ) : (
                <div className="text-gray-500">No PDF URL provided</div>
             )}
        </div>
      );
    }
    
    if (type === "image") {
        return (
            <div className="flex justify-center bg-gray-100 p-4">
                <img src={url} alt={section.title} className="max-h-[600px] object-contain" />
            </div>
        )
    }

    if (type === "audio") {
      return (
        <div className="w-full p-6 bg-gray-50 flex items-center justify-center">
             {url ? (
               <audio controls className="w-full" src={url}>
                  Your browser does not support the audio element.
               </audio>
             ) : (
                <div className="text-gray-500">No audio URL provided</div>
             )}
        </div>
      );
    }

    // Default: Article/Text
    return (
      <div className="p-6 bg-white">
         {section.content_text && (
             <div className="prose max-w-none text-gray-800 poppins-regular whitespace-pre-wrap">
                 {section.content_text}
             </div>
         )}
         {url && (type !== 'video' && type !== 'pdf' && type !== 'image') && (
            <div className="mt-4">
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-[#FF8211] hover:underline flex items-center gap-2">
                    <Download className="w-4 h-4" /> Open Attachment
                </a>
            </div>
         )}
      </div>
    );
  };

  if (!course) {
     // Start loading state handled by GlobalLoader, but we can return null or a skeleton here if preferred
     // Returning mostly empty structure to avoid flash
     return (
        <>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center">
                
            </div>
            <Footer />
        </>
     )
  }
  
  // Calculations
  const totalSections = (course.lessons_details || course.lessons)?.reduce((acc, lesson) => acc + (lesson.sections?.length || 0), 0) || 0;
  const completionPercentage = totalSections > 0 ? Math.round((completedSections.size / totalSections) * 100) : 0;


  return (
    <>
      <Navbar />

      {/* Hero Header */}
      <div className="w-full bg-gradient-to-r from-[#FF8211]/10 to-[#86ac55]/10 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Link
            to="/courses"
            className="text-[#FF8211] text-sm font-medium hover:underline poppins-regular inline-flex items-center gap-1 mb-4"
          >
            ← Back to courses
          </Link>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 bebas-regular mb-3">
            {course.title}
          </h1>

          <p className="text-lg text-gray-600 poppins-regular max-w-3xl mb-6">
            {course.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-[#FF8211]/10 text-[#FF8211] rounded-full text-sm font-medium poppins-regular">
              {course.category || "General"}
            </span>
             <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium poppins-regular flex items-center gap-1">
              <Award className="w-4 h-4" />
              {course.level || "All Levels"}
            </span>
          </div>
          
           {/* Stats */}
           <div className="flex flex-wrap items-center gap-6 mb-6">
             <div className="flex items-center gap-2 text-gray-600 poppins-regular">
               <Users className="w-5 h-5" />
               <span className="text-sm">
                 {course.enrolled_count || 0} students enrolled
               </span>
             </div>
           </div>

        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Player / Content Viewer */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header for content */}
                {currentSection && (
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <h2 className="text-xl font-bold text-gray-900 bebas-regular">{currentSection.title}</h2>
                         <button
                            onClick={toggleComplete}
                            className={`px-4 py-2 rounded-lg font-medium poppins-regular text-sm flex items-center gap-2 transition-colors ${
                              completedSections.has(currentSection.id)
                                ? "bg-[#86ac55] text-white"
                                : "bg-[#FF8211] text-white hover:bg-[#ff7906]"
                            }`}
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            {completedSections.has(currentSection.id) ? "Completed" : "Mark Complete"}
                        </button>
                    </div>
                )}
                
                {/* Content Render */}
                {renderContent(currentSection)}

            </div>
            
             {/* Description Card (if displaying simple content, maybe redundant, but good for lesson details) */}
             {currentSection && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                   <h3 className="text-lg font-semibold mb-2">About this lesson</h3>
                   <p className="text-gray-600">{currentSection.description || currentSection.content_text || "No specific description available."}</p>
                </div>
             )}

            {/* Comments Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 bebas-regular mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#FF8211]" />
                Discussion
              </h3>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                      <div className={`w-10 h-10 rounded-full ${comment.avatarColor} flex items-center justify-center text-white font-semibold shrink-0`}>
                        {comment.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="font-semibold text-gray-900 text-sm poppins-medium mb-1">
                            {comment.user}
                          </p>
                          <p className="text-gray-700 text-sm poppins-regular">
                            {comment.text}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 poppins-regular">{comment.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 poppins-regular py-4">No comments yet. Be the first to start the discussion!</p>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <textarea
                  placeholder={currentUser ? "Add your comment..." : "Please log in to comment"}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={!currentUser}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8211] focus:border-transparent poppins-regular text-sm resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                  rows={3}
                />
                <button
                  onClick={handlePostComment}
                  disabled={!currentUser || !newComment.trim()}
                  className="mt-3 px-6 py-2 bg-[#FF8211] text-white rounded-lg font-medium bebas-regular hover:bg-[#ff7906] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Progress Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 bebas-regular text-xl mb-4">
                  Your Progress
                </h3>
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#f3f4f6"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#FF8211"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - completionPercentage / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-[#FF8211] bebas-regular">
                      {completionPercentage}%
                    </span>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-600 poppins-regular">
                  {completedSections.size} of {totalSections} lessons completed
                </p>
              </div>

              {/* Curriculum */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 bebas-regular text-xl mb-4">
                  Course Curriculum
                </h3>

                <div className="space-y-2">
                  {(() => {
                     const lessonsToUse = course.lessons_details || course.lessons;
                     return lessonsToUse && lessonsToUse.length > 0 ? (
                      lessonsToUse.map((lesson, lessonIndex) => (
                        <div key={lesson.id || lessonIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => toggleSection(lessonIndex)}
                            className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              {expandedSections.has(lessonIndex) ? <ChevronDown className="w-4 h-4 text-gray-600" /> : <ChevronRight className="w-4 h-4 text-gray-600" />}
                              <span className="font-semibold text-gray-900 text-sm poppins-medium text-left">
                                {lesson.title}
                              </span>
                            </div>
                    
                          </button>

                          {expandedSections.has(lessonIndex) && (
                            <div className="bg-white">
                              {lesson.sections && lesson.sections.length > 0 ? (
                                lesson.sections.map((section) => (
                                  <button
                                    key={section.id}
                                    onClick={() => handleSectionClick(section)}
                                    className={`w-full px-4 py-3 border-t border-gray-100 hover:bg-gray-50 transition-colors flex items-center justify-between group ${
                                      currentSection?.id === section.id
                                        ? "bg-[#FF8211]/5 border-l-4 border-l-[#FF8211]"
                                        : ""
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="text-gray-500 group-hover:text-[#FF8211] transition-colors">
                                        {getContentIcon(section.content_type)}
                                      </div>
                                      <span className="text-sm text-gray-700 poppins-regular text-left">
                                        {section.title}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {completedSections.has(section.id) && (
                                        <CheckCircle2 className="w-4 h-4 text-[#86ac55]" />
                                      )}
                                    </div>
                                  </button>
                                ))
                              ) : (
                                <div className="px-4 py-3 border-t border-gray-100 text-sm text-gray-500 poppins-regular">
                                  — No sections —
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">No content available</div>
                    );
                  })()}
              </div>
            </div>

               {/* Instructor (Using course data if available, else simple layout) */}
               {course.trainer_profile && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="font-bold text-gray-900 bebas-regular text-xl mb-4">Instructor</h3>
                        {/* Instructor details would typically require another fetch or be included in course detail. 
                            If not in detail, we skip or show what's available. 
                            Assuming basic trainer info might be embedded or we skip deep details. 
                        */}
                         <Link
                            to={`/trainer-profile/${course.trainer_profile}`}
                            className="block w-full text-center px-4 py-2 border-2 border-[#FF8211] text-[#FF8211] rounded-lg font-semibold bebas-regular hover:bg-[#FF8211]/10 transition-colors"
                        >
                            View Instructor Profile
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

export default CourseEnroll;
