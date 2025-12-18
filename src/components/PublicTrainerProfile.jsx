import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
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
  Loader2,
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CourseCard from "./CourseCard";

const PublicTrainerProfile = () => {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);

  // Availability Data
  const [availableEvents, setAvailableEvents] = useState([]);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Generate next 7 days
  const getNext7Days = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push({
        day: weekDays[d.getDay()],
        date: d.getDate(),
        fullDate: d, // Keep object for comparison
        isToday: i === 0
      });
    }
    return dates;
  };

  const next7Days = getNext7Days();
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  // Fetch Trainer's Calendar Events from LocalStorage
  // NOTE: In a real app, this would be an API call. 
  // ensuring we are on the same machine/browser for the demo to work.
  useEffect(() => {
    if (id) {
      try {
        const specificKey = `wc_events_16`;
        console.log(`PublicTrainerProfile: Trying specific key: ${specificKey}`);

        let savedEvents = localStorage.getItem(specificKey);

        // Fallback for debugging/legacy
        if (!savedEvents) {
          console.log(`PublicTrainerProfile: Specific key not found. Trying fallback: wc_events_v1`);
          savedEvents = localStorage.getItem("wc_events_v1");
        }

        console.log("PublicTrainerProfile: savedEvents raw:", savedEvents);

        if (savedEvents) {
          setAvailableEvents(JSON.parse(savedEvents));
        } else {
          setAvailableEvents([]);
        }
      } catch (e) {
        console.error("Failed to load trainer schedule", e);
      }
    }
  }, [id]);

  // Derive slots for the currently selected day
  const getCurrentSlots = () => {
    if (!availableEvents.length) return [];

    const selectedDayDate = next7Days[activeDayIndex].fullDate;
    const startOfDay = new Date(selectedDayDate);
    startOfDay.setHours(0, 0, 0, 0);

    // Use local date string for comparison (YYYY-MM-DD)
    const targetDateStr = next7Days[activeDayIndex].fullDate.toLocaleDateString('en-CA');

    // Debug Filter
    console.log("Filtering for Date (Local String):", targetDateStr);

    return availableEvents
      .filter(ev => {
        if (!ev.start) return false;
        const eventStart = new Date(ev.start);
        const eventDateStr = eventStart.toLocaleDateString('en-CA');

        const match = eventDateStr === targetDateStr;
        // console.log(`Checking Event: ${ev.title} (${eventDateStr}) vs ${targetDateStr} => ${match}`);
        return match;
      })
      .sort((a, b) => new Date(a.start) - new Date(b.start))
      .map(ev => {
        // Format time: "02:00 PM"
        return {
          id: ev.id,
          time: new Date(ev.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
          status: ev.status || 'available'
        };
      });
  };

  const currentSlots = getCurrentSlots();
  const [selectedSlotId, setSelectedSlotId] = useState(null);

  const [user] = useState(() => JSON.parse(localStorage.getItem("user") || "{}"));

  const handleConfirmBooking = () => {
    if (!selectedSlotId) {
      alert("Please select a time slot first.");
      return;
    }

    if (!user || !user.id) {
      alert("You must be logged in to book a session.");
      return;
    }

    try {
      const specificKey = `wc_events_16`; // Or fallback to 'wc_events_16' as user hardcoded
      const savedEventsStr = localStorage.getItem(specificKey) || localStorage.getItem("wc_events_v1");

      if (!savedEventsStr) return;

      let events = JSON.parse(savedEventsStr);
      let bookedEvent = null;

      // Find and update event for TRAINER
      const updatedEvents = events.map(ev => {
        if (ev.id === selectedSlotId) {
          bookedEvent = { ...ev }; // Copy for Trainee
          return {
            ...ev,
            title: `Session: ${user.username || "Trainee"}`, // Trainer sees Trainee Name
            status: "pending",
            color: "#F59E0B", // Amber for pending
            traineeId: user.id,
            traineeName: user.username || "Trainee"
          };
        }
        return ev;
      });

      // Save to TRAINER storage
      localStorage.setItem(specificKey, JSON.stringify(updatedEvents));

      // Save to TRAINEE storage
      if (bookedEvent) {
        const traineeKey = `trainee_bookings_${user.id}`;
        const traineeEvents = JSON.parse(localStorage.getItem(traineeKey) || "[]");

        const traineeVersion = {
          ...bookedEvent,
          title: `Session with ${profileData?.profile?.name || "Trainer"}`, // Trainee sees Trainer Name
          status: "pending", // Pending initially
          color: "#F59E0B",
          trainerId: id
        };

        traineeEvents.push(traineeVersion);
        localStorage.setItem(traineeKey, JSON.stringify(traineeEvents));
      }

      // Update local state to reflect change
      setAvailableEvents(updatedEvents);
      setSelectedSlotId(null);
      alert("Booking request sent! Check your My Sessions page.");

    } catch (e) {
      console.error("Booking failed", e);
      alert("Failed to book session.");
    }
  };

  useEffect(() => {
    // Fetch Categories for mapping
    const getCategories = async () => {
      try {
        const response = await axiosInstance.get('/api/utils/categories');
        setCategories(response.data.results);
        console.log("categories:", response.data.results);
      } catch (error) {
        console.log("Failed to load categories");
      }
    };
    getCategories();
  }, []);

  useEffect(() => {
    const fetchTrainerProfile = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`/api/trainers/create?profile_id=${id}`);

        // Map API response to component state structure
        const apiData = response.data;
        const trainer = apiData.trainer;

        // This is the structure expected by the UI populated from the API
        setProfileData({
          profile: {
            name: trainer.name,
            avatar: trainer.profile_picture || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541", // Fallback image
            email: null, // API doesn't seem to return email in the provided example
            country: trainer.country || "Location not specified",
            state: trainer.state || "",
            bio: trainer.bio || "",
            linkedin: null, // Not in provided response example
            phone: trainer.phone_number,
            rating: trainer.rating // Assuming rating might come from API eventually
          },
          specializations: apiData.specializations ? apiData.specializations.map(spec => ({
            id: spec.specialization, // This is the category ID
            yearsExperience: spec.years_of_experience,
            hourlyRate: spec.hourly_rate,
            location: spec.service_location,
            // name will be resolved in render
          })) : [],
          workExperience: apiData.experiences ? apiData.experiences.map(exp => ({
            position: exp.position,
            workplace: exp.work_place,
            startDate: exp.start_date,
            endDate: exp.end_date,
            description: exp.description
          })) : [],
        });

      } catch (err) {
        console.error("Failed to fetch trainer profile:", err);
        setError("Failed to load trainer profile.");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get(`/api/courses/courses/for-trainees?trainer_profile=${id}`);

        const data = response.data;

        // Determine response type (Paginated vs Array)
        if (data && Array.isArray(data)) {
          setCourses(data);
        } else {
          // Unexpected format, fallback to empty
          setCourses([]);
        }

      } catch (error) {
        console.log("Failed to fetch courses");
        // Optionally handle error state
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchTrainerProfile();
      fetchCourses();
    }
  }, [id]);

  // Generate category styles logic (Reused from Courses.jsx)
  const categoryOptions = [
    {
      id: "",
      name: "All Courses",
      icon: "✨",
      bgColor: "bg-muted",
      textColor: "text-muted-foreground",
      hoverColor: "hover:bg-primary/10 hover:text-primary hover:shadow-sm",
      activeColor: "bg-primary/10 text-primary shadow-sm ring-2 ring-primary/20",
    },
    ...categories.map((category, idx) => {
      const colors = [
        { bgColor: "bg-green-50", textColor: "text-green-700", hoverColor: "hover:bg-green-100 hover:shadow-md hover:-translate-y-0.5", activeColor: "bg-green-100 text-green-800 shadow-md ring-2 ring-green-300" },
        { bgColor: "bg-orange-50", textColor: "text-orange-700", hoverColor: "hover:bg-orange-100 hover:shadow-md hover:-translate-y-0.5", activeColor: "bg-orange-100 text-orange-800 shadow-md ring-2 ring-orange-300" },
        { bgColor: "bg-amber-50", textColor: "text-amber-700", hoverColor: "hover:bg-amber-100 hover:shadow-md hover:-translate-y-0.5", activeColor: "bg-amber-100 text-amber-800 shadow-md ring-2 ring-amber-300" },
        { bgColor: "bg-blue-50", textColor: "text-blue-700", hoverColor: "hover:bg-blue-100 hover:shadow-md hover:-translate-y-0.5", activeColor: "bg-blue-100 text-blue-800 shadow-md ring-2 ring-blue-300" },
        { bgColor: "bg-red-50", textColor: "text-red-700", hoverColor: "hover:bg-red-100 hover:shadow-md hover:-translate-y-0.5", activeColor: "bg-red-100 text-red-800 shadow-md ring-2 ring-red-300" },
        { bgColor: "bg-purple-50", textColor: "text-purple-700", hoverColor: "hover:bg-purple-100 hover:shadow-md hover:-translate-y-0.5", activeColor: "bg-purple-100 text-purple-800 shadow-md ring-2 ring-purple-300" },
        { bgColor: "bg-pink-50", textColor: "text-pink-700", hoverColor: "hover:bg-pink-100 hover:shadow-md hover:-translate-y-0.5", activeColor: "bg-pink-100 text-pink-800 shadow-md ring-2 ring-pink-300" },
        { bgColor: "bg-indigo-50", textColor: "text-indigo-700", hoverColor: "hover:bg-indigo-100 hover:shadow-md hover:-translate-y-0.5", activeColor: "bg-indigo-100 text-indigo-800 shadow-md ring-2 ring-indigo-300" },
        { bgColor: "bg-cyan-50", textColor: "text-cyan-700", hoverColor: "hover:bg-cyan-100 hover:shadow-md hover:-translate-y-0.5", activeColor: "bg-cyan-100 text-cyan-800 shadow-md ring-2 ring-cyan-300" },
        { bgColor: "bg-lime-50", textColor: "text-lime-700", hoverColor: "hover:bg-lime-100 hover:shadow-md hover:-translate-y-0.5", activeColor: "bg-lime-100 text-lime-800 shadow-md ring-2 ring-lime-300" },
      ];
      const colorScheme = colors[idx % colors.length];
      const icons = ["💪", "🏃", "🧘", "🏋️", "🧘‍♀️", "🤸", "🩹", "🧠", "🌱", "⚖️"];

      return {
        ...category,
        label: category.name,
        icon: icons[idx % icons.length],
        ...colorScheme
      };
    })
  ];

  const publishedCourses = courses.filter((c) => c.status && c.status.toLowerCase() === "published");

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-[#FF8211] animate-spin" />
        </div>
        <Footer />
      </>
    );
  }

  if (error || !profileData) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "We couldn't find the trainer you're looking for."}</p>
          <Link to="/trainers" className="px-6 py-2 bg-[#FF8211] text-white rounded-lg font-medium hover:bg-[#ff7906] transition-colors">
            Browse Trainers
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const { profile, specializations, workExperience } = profileData;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pb-12">

        {/* Header / Hero Section */}
        <div className="bg-white border-b border-gray-200">
          {/* Cover Photo Area */}
          <div className="h-32 bg-gradient-to-r from-gray-100 to-gray-200 w-full relative">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#FF8211 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-6">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-2 right-2 bg-[#FF8211] text-white p-1.5 rounded-full shadow border-2 border-white">
                  <Award className="w-4 h-4 md:w-5 md:h-5" />
                </div>
              </div>

              {/* Name & Title & Stats */}
              <div className="flex-1 text-center md:text-left mb-2 md:mb-0">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 bebas-regular">
                  {profile.name}
                </h1>
                <p className="text-[#FF8211] font-semibold poppins-medium text-lg">
                  Personal Trainer & Fitness Expert
                </p>
                <div className="flex items-center justify-center md:justify-start gap-4 mt-3 text-sm text-gray-600 poppins-regular">
                  {profile.country && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {profile.country}, {profile.state}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-yellow-500 font-medium">
                    <Star className="w-4 h-4 fill-current" />
                    {profile.rating || "4.9"} (120 reviews)
                  </span>
                </div>
              </div>

              {/* Action Button (Mobile Only - Desktop has sidebar) */}
              <div className="md:hidden w-full sm:w-auto">
                <button className="w-full bg-[#FF8211] text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-orange-200 active:scale-95 transition-transform">
                  Book Session
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Layout Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column: Main Content */}
            <div className="lg:col-span-2 space-y-8">

              {/* About Me */}
              <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 bebas-regular mb-4 flex items-center gap-2">
                  <span className="w-1 h-8 bg-[#FF8211] rounded-full block"></span>
                  About Me
                </h2>
                <p className="text-gray-600 poppins-regular leading-relaxed whitespace-pre-line">
                  {profile.bio || "No bio available."}
                </p>
              </section>

              {/* Specializations */}
              {specializations && specializations.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 bebas-regular mb-6 flex items-center gap-2">
                    <span className="w-1 h-8 bg-[#86ac55] rounded-full block"></span>
                    Specializations
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {specializations.map((spec, idx) => {
                      const category = categories.find(c => c.id === spec.id);
                      const specName = category ? category.name : "Unknown Specialization";

                      return (
                        <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-[#86ac55]/30 hover:shadow-md transition-all group">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-bold text-lg text-gray-900 poppins-semibold group-hover:text-[#86ac55] transition-colors">{specName}</h3>
                            <div className="bg-[#86ac55]/10 text-[#86ac55] p-2 rounded-lg">
                              <Award className="w-5 h-5" />
                            </div>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between border-b border-dashed border-gray-100 pb-2">
                              <span className="text-gray-500">Experience</span>
                              <span className="font-medium text-gray-900">{spec.yearsExperience} years</span>
                            </div>
                            <div className="flex justify-between border-b border-dashed border-gray-100 pb-2">
                              <span className="text-gray-500">Rate</span>
                              <span className="font-medium text-gray-900">${spec.hourlyRate}/hr</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Location</span>
                              <span className="font-medium text-gray-900 capitalize">{spec.location}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )}

              {/* Work Experience */}
              {workExperience && workExperience.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 bebas-regular mb-6 flex items-center gap-2">
                    <span className="w-1 h-8 bg-blue-500 rounded-full block"></span>
                    Experience
                  </h2>
                  <div className="space-y-0">
                    {workExperience.map((exp, idx) => (
                      <div key={idx} className="flex gap-4 pb-8 last:pb-0 relative">
                        {/* Timeline Line */}
                        {idx < workExperience.length - 1 && (
                          <div className="absolute left-[19px] top-8 bottom-0 w-0.5 bg-gray-200"></div>
                        )}

                        <div className="flex-shrink-0 mt-1">
                          <div className="w-10 h-10 rounded-full bg-blue-50 border-2 border-blue-100 flex items-center justify-center text-blue-500 z-10 relative">
                            <Briefcase className="w-5 h-5" />
                          </div>
                        </div>
                        <div className="flex-1 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                            <div>
                              <h3 className="font-bold text-lg text-gray-900">{exp.position}</h3>
                              <p className="text-blue-600 font-medium">{exp.workplace}</p>
                            </div>
                            <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full mt-2 sm:mt-0 inline-block w-fit">
                              {exp.startDate} — {exp.endDate || 'Present'}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">{exp.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Courses */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 bebas-regular mb-6 flex items-center gap-2">
                  <span className="w-1 h-8 bg-[#FF8211] rounded-full block"></span>
                  My Courses ({publishedCourses.length})
                </h2>

                {publishedCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {publishedCourses.map((course) => {
                      const theme = categoryOptions.find(opt => opt.id === course.category);
                      return (
                        <div key={course.id} className="h-full">
                          <CourseCard key={course.id || course.title} course={course} categoryTheme={theme} />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
                    <p className="text-gray-500">No courses published yet.</p>
                  </div>
                )}
              </section>
            </div>

            {/* Right Column: Sticky Sidebar (Availability & Contact) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">

                {/* Availability Calendar Widget */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="p-4 bg-gray-900 text-white">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[#FF8211]" />
                      Book a Session
                    </h3>
                    <p className="text-gray-400 text-xs mt-1">Select a time slot to book a 1-on-1 session.</p>
                  </div>

                  <div className="p-4">
                    {/* Days Row */}
                    <div className="flex justify-between mb-6 overflow-x-auto pb-2 no-scrollbar gap-2">
                      {next7Days.map((day, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveDayIndex(idx)}
                          className={`flex flex-col items-center justify-center min-w-[44px] h-[60px] rounded-xl transition-all ${activeDayIndex === idx
                            ? "bg-[#FF8211] text-white shadow-md shadow-orange-200 scale-105"
                            : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                            }`}
                        >
                          <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">{day.day}</span>
                          <span className="text-lg font-bold">{day.date}</span>
                        </button>
                      ))}
                    </div>

                    {/* Time Slots */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-gray-900 flex justify-between">
                        Available Slots
                        <span className="text-gray-400 font-normal text-xs">{currentSlots.length} slots (Loaded: {availableEvents.length})</span>
                      </h4>

                      {currentSlots.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                          {currentSlots.map((slot) => (
                            <button
                              key={slot.id}
                              onClick={() => setSelectedSlotId(slot.id)}
                              disabled={slot.status !== 'available'}
                              className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all text-center
                                    ${selectedSlotId === slot.id
                                  ? "border-[#FF8211] bg-[#FF8211] text-white shadow-md"
                                  : "border-gray-200 text-gray-700 hover:border-[#FF8211] hover:text-[#FF8211] hover:bg-orange-50"}
                                    ${slot.status !== 'available' ? 'opacity-50 cursor-not-allowed bg-gray-100 border-gray-100 text-gray-400' : ''}
                                `}
                            >
                              {slot.time}
                              {slot.status === 'pending' && <span className="block text-[10px] lowercase">(Pending)</span>}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                          <p className="text-gray-500 text-sm">No slots available on this day.</p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleConfirmBooking}
                      disabled={!selectedSlotId}
                      className={`w-full mt-6 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 group
                            ${selectedSlotId
                          ? "bg-gray-900 text-white hover:bg-gray-800 shadow-lg"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"}
                        `}>
                      Confirm Booking
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Contact Info Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider text-gray-400">Contact Info</h3>
                  <div className="space-y-4">
                    {profile.email && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#FF8211]">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Email Address</p>
                          <a href={`mailto:${profile.email}`} className="text-sm font-medium text-gray-900 hover:text-[#FF8211] truncate block max-w-[200px]">{profile.email}</a>
                        </div>
                      </div>
                    )}
                    {profile.phone && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                          <Phone className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Phone Number</p>
                          <p className="text-sm font-medium text-gray-900">{profile.phone}</p>
                        </div>
                      </div>
                    )}

                    {/* Socials */}
                    <div className="pt-4 mt-2 border-t border-gray-100 flex gap-2">
                      {profile.linkedin && (
                        <a href={`https://${profile.linkedin}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-lg bg-[#0077b5] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default PublicTrainerProfile;
