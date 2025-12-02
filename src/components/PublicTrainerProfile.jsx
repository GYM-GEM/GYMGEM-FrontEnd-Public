import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Award,
  Star,
  Book,
  ArrowRight,
  Briefcase,
  DollarSign,
  Clock,
  GraduationCap,
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const PublicTrainerProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const savedData = localStorage.getItem("trainerProfileData");
    if (savedData) {
      setProfileData(JSON.parse(savedData));
    } else {
      const legacyProfile = localStorage.getItem("trainerProfile");
      if (legacyProfile) {
        const legacy = JSON.parse(legacyProfile);
        setProfileData({
          profile: legacy,
          specializations: [],
          workExperience: [],
          records: []
        });
      }
    }

    const allCourses = JSON.parse(localStorage.getItem("courses")) || [];
    setCourses(allCourses.filter((c) => c.status === "Published"));
  }, []);

  if (!profileData) return null;

  const { profile, specializations, workExperience } = profileData;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Compact Centered Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 py-12 text-center">
            {/* Avatar */}
            <div className="inline-block relative mb-6">
              <div className="w-32 h-32 rounded-full border-4 border-[#FF8211] shadow-lg overflow-hidden">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#FF8211] text-white p-2 rounded-full shadow-md">
                <Award className="w-5 h-5" />
              </div>
            </div>

            {/* Name & Title */}
            <h1 className="text-5xl font-bold text-gray-900 bebas-regular mb-2">
              {profile.name}
            </h1>
            <p className="text-xl text-[#FF8211] font-semibold poppins-medium mb-4">
              Personal Trainer & Fitness Expert
            </p>

            {/* Contact Info - Compact */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600 poppins-regular mb-8">
              {profile.country && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#FF8211]" />
                  <span>{profile.country}, {profile.state}</span>
                </div>
              )}
              {profile.email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-[#FF8211]" />
                  <span>{profile.email}</span>
                </div>
              )}
            </div>

            {/* Stats Pills - Single Row */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="px-5 py-3 bg-white border-2 border-[#FF8211] rounded-full shadow-sm">
                <div className="flex items-center gap-2">
                  <Book className="w-5 h-5 text-[#FF8211]" />
                  <span className="text-2xl font-bold text-gray-900 bebas-regular">{courses.length}</span>
                  <span className="text-sm text-gray-600 poppins-medium">Courses</span>
                </div>
              </div>
              <div className="px-5 py-3 bg-white border-2 border-[#86ac55] rounded-full shadow-sm">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#86ac55]" />
                  <span className="text-2xl font-bold text-gray-900 bebas-regular">{specializations?.length || 0}</span>
                  <span className="text-sm text-gray-600 poppins-medium">Specializations</span>
                </div>
              </div>
              <div className="px-5 py-3 bg-white border-2 border-yellow-400 rounded-full shadow-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-2xl font-bold text-gray-900 bebas-regular">4.9</span>
                  <span className="text-sm text-gray-600 poppins-medium">Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - 2 Column Layout */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Left: Contact Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 bebas-regular mb-6">
                  Get In Touch
                </h2>
                <div className="space-y-4">
                  {profile.linkedin && (
                    <a
                      href={`https://${profile.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-[#0077b5]/10 rounded-lg flex items-center justify-center">
                        <Linkedin className="w-5 h-5 text-[#0077b5]" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 poppins-medium">LinkedIn</span>
                    </a>
                  )}
                  {profile.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-[#FF8211]/10 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-[#FF8211]" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 poppins-medium">Email</span>
                    </a>
                  )}
                  {profile.phone && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                      <div className="w-10 h-10 bg-[#86ac55]/10 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-[#86ac55]" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 poppins-medium">{profile.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Specializations */}
            {specializations && specializations.length > 0 && (
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold text-gray-900 bebas-regular mb-6">
                  Specializations & Services
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {specializations.map((spec, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                      <h3 className="text-xl font-bold text-gray-900 poppins-semibold mb-4">
                        {spec.name}
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4 text-[#86ac55]" />
                          <span className="poppins-regular">{spec.yearsExperience} years experience</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="w-4 h-4 text-[#86ac55]" />
                          <span className="font-bold text-[#86ac55] poppins-semibold">${spec.hourlyRate}/hour</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="poppins-regular">{spec.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Work Experience - Timeline */}
          {workExperience && workExperience.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 bebas-regular mb-8">
                Work Experience
              </h2>
              <div className="space-y-6">
                {workExperience.map((exp, idx) => (
                  <div key={idx} className="relative pl-10">
                    {/* Timeline Dot */}
                    <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-[#FF8211] border-4 border-white shadow" />
                    {/* Timeline Line */}
                    {idx < workExperience.length - 1 && (
                      <div className="absolute left-1.5 top-6 bottom-0 w-0.5 bg-gray-200" />
                    )}
                    
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 poppins-semibold mb-1">
                            {exp.position}
                          </h3>
                          <p className="text-[#FF8211] font-semibold poppins-medium">
                            {exp.workplace}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 poppins-regular mt-2 sm:mt-0">
                          <Clock className="w-4 h-4" />
                          <span>{exp.startDate} - {exp.endDate}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 poppins-regular leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* My Courses - Consistent Grid */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 bebas-regular mb-8">
              My Courses
            </h2>

            {courses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
                  >
                    <div className="relative h-48 overflow-hidden flex-shrink-0">
                      <img
                        src={course.img || "https://via.placeholder.com/400x300"}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-white px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-bold text-gray-900">4.8</span>
                      </div>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium poppins-medium">
                          {course.level || "All Levels"}
                        </span>
                        <span className="px-2.5 py-1 bg-[#FF8211]/10 text-[#FF8211] rounded-md text-xs font-semibold poppins-semibold">
                          {course.category || "Fitness"}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 poppins-semibold flex-1">
                        {course.title}
                      </h3>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                        <span className="text-2xl font-bold text-[#86ac55] bebas-regular">
                          ${course.price}
                        </span>
                        <Link
                          to={`/courses/${course.id}`}
                          className="px-4 py-2 bg-[#FF8211] text-white rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-[#ff7906] transition-colors poppins-medium"
                        >
                          View
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Book className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 bebas-regular">
                  No courses published yet
                </h3>
                <p className="text-gray-500 poppins-regular">
                  Check back later for new content!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PublicTrainerProfile;
