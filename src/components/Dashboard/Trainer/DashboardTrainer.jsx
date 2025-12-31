import Navbar from "../../Navbar.jsx";
import FooterDash from "../FooterDash.jsx";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosConfig";

const DashboardTrainer = () => {
  const [courses, setCourses] = useState([]);
  const [trainer, setTrainer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const trainerProfile = user.profiles?.find(p => p.type === "trainer");
  const currentProfileId = trainerProfile?.id || user.current_profile || user.id;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all courses for the trainer to compute dashboard stats
        const response = await axiosInstance.get("/api/courses/courses/my-courses");
        let coursesData = response.data;

        if (coursesData.results) {
          coursesData = coursesData.results;
        }

        const coursesArray = Array.isArray(coursesData) ? coursesData : [];
        setCourses(coursesArray);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchTrainerProfile = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const id = user.current_profile;

      if (!id) return;

      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`/api/trainers/create?profile_id=${id}`);
        const trainer = response.data.trainer || response.data;
        console.log("Fetched trainer data:", trainer)
        setTrainer(trainer);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching trainer profile:", error);
        setIsLoading(false);
      }
    };

    fetchTrainerProfile();
  }, []);


  const totalCourses = courses.length;

  // Calculate stats
  const coursesWithRevenue = courses.map((course) => ({
    ...course,
    title: course.title || "Untitled Course",
    clients: Number(course.level || course.client || 0),
    revenue: Number(course.level || course.client || 0) * Number(course.price || 0),
    id: course.id
  }));

  const totalRevenue = coursesWithRevenue.reduce((acc, course) => acc + (course.revenue || 0), 0);


  const topCourses = [...coursesWithRevenue]
    .sort((a, b) => b.clients - a.clients)
    .slice(0, 3);

  const recentCourses = [...coursesWithRevenue]
    .sort((a, b) => b.id - a.id)
    .slice(0, 3);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-slate-50 text-slate-900">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* HEADER */}
              <section className="mb-6 lg:mb-8">
                <h1 className="font-bebas text-3xl sm:text-4xl text-center text-[#ff8211] tracking-wide">
                  Dashboard
                </h1>
                <p className="mt-2 text-center text-sm text-slate-500">
                  Overview of your courses, students and revenue.
                </p>
              </section>

              {/* STATS CARDS */}
              <section className="mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <div className="bg-white border border-orange-100 rounded-2xl p-6 shadow-sm text-center">
                    <p className="text-xs font-semibold text-[#ff8211] uppercase">Total Subs</p>
                    <p className="mt-2 font-bebas text-3xl text-slate-900">250</p>
                    <p className="text-xs text-slate-500 mt-1">Active subscribers</p>
                  </div>
                  <div className="bg-white border border-orange-100 rounded-2xl p-6 shadow-sm text-center">
                    <p className="text-xs font-semibold text-green-600 uppercase">Total Courses</p>
                    <p className="mt-2 font-bebas text-3xl text-slate-900">{totalCourses}</p>
                    <p className="text-xs text-slate-500 mt-1">Published courses</p>
                  </div>
                  <div className="bg-white border border-orange-100 rounded-2xl p-6 shadow-sm text-center">
                    <p className="text-xs font-semibold text-blue-600 uppercase">Revenue</p>
                    <p className="mt-2 font-bebas text-3xl text-slate-900">${totalRevenue.toFixed(2)}</p>
                    <p className="text-xs text-slate-500 mt-1">Total revenue</p>
                  </div>
                </div>
              </section>

              {/* TOP COURSES */}
              <section className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <h2 className="font-bebas text-xl text-slate-900">Top Courses</h2>
                  <span className="flex-1 h-px bg-slate-200" />
                </div>
                <div className="space-y-3">
                  {isLoading ? (
                    <div className="text-center py-4 text-slate-500">Loading courses...</div>
                  ) : topCourses.length > 0 ? (
                    topCourses.map((c, index) => (
                      <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-slate-100 p-4 rounded-xl shadow-sm gap-2 sm:gap-0">
                        <div className="flex-1 min-w-0 pr-2">
                          <p className="font-semibold text-slate-800 truncate">{c.title}</p>
                          <p className="text-xs text-slate-500 mt-1">{c.level} clients</p>
                        </div>
                        <div className="text-right sm:text-right flex justify-between sm:block items-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-50 w-full sm:w-auto">
                          <span className="sm:hidden text-xs text-slate-400 font-medium">Revenue</span>
                          <p className="font-bebas text-xl text-green-600">${c.revenue.toFixed(2)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white border border-slate-100 p-6 rounded-xl shadow-sm text-center">
                      <p className="text-slate-500 text-sm">No courses available yet</p>
                    </div>
                  )}
                </div>
              </section>

              {/* RECENT COURSES */}
              <section className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <h2 className="font-bebas text-xl text-slate-900">Recent Courses</h2>
                  <span className="flex-1 h-px bg-slate-200" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {isLoading ? (
                    <div className="col-span-full text-center py-4 text-slate-500">Loading...</div>
                  ) : recentCourses.length > 0 ? (
                    recentCourses.map((course, index) => (
                      <div key={index} className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
                        <p className="font-semibold text-slate-800 truncate">{course.title}</p>
                        <div className="mt-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${course.status === "Published"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                              }`}
                          >
                            {course.status || "Published"}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full bg-white border border-slate-100 p-6 rounded-xl shadow-sm text-center">
                      <p className="text-slate-500 text-sm">No recent courses</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1 lg:border-l lg:border-slate-200 lg:pl-6">
              <div className="space-y-6">
                {/* PROFILE CARD */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                  <h4 className="font-bebas text-xl text-[#ff8211] tracking-wide">Profile</h4>
                  <div className="mt-4">
                    <p className="font-semibold text-slate-900">{trainer?.name}</p>
                    <p className="text-sm text-slate-500 mt-1">Trainer</p>
                    <p className="text-sm text-slate-500 mt-1">Total courses: {totalCourses}</p>
                  </div>
                </div>

                {/* QUICK PANEL */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                  <h4 className="font-bebas text-xl text-[#ff8211] tracking-wide">Quick Actions</h4>
                  <div className="mt-4 flex flex-col gap-3 text-sm">
                    <Link to="/trainer/courses" className="text-left text-slate-700 hover:text-[#ff8211] hover:underline">
                      📚 View my courses
                    </Link>
                    <a href="#" className="text-left text-slate-700 hover:text-[#ff8211] hover:underline">
                      🧾 Transactions
                    </a>
                    <Link to={`/trainer/profile/${currentProfileId}`} className="text-left text-slate-700 hover:text-[#ff8211] hover:underline">
                      ⚙️ Edit profile
                    </Link>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <FooterDash />
    </>
  );
};

export default DashboardTrainer;
