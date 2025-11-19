import NavBarDash from "./NavBarDash.jsx";
import FooterDash from "../FooterDash.jsx";
import { Link } from "react-router-dom";
import CardForTrainers from "../../CardForTrainers.jsx";
import Courses from "../../../pages/Courses.jsx";
import Chat from "../../Chat.jsx";
const DashboardTrainer = () => {
  const courses = JSON.parse(localStorage.getItem("courses")) || [];
  const totalCourses = courses.length;

  const coursesWithRevenue = courses.map((course) => ({
    title: course.title,
    clients: course.client || 0,
    revenue: (course.client || 0) * (parseFloat(course.price) || 0),
  }));

  // Sort by clients or revenue descending
  const topCourses = coursesWithRevenue
    .sort((a, b) => b.clients - a.clients) 
    .slice(0, 3); 

  const recentCourses = [...courses]
    .sort((a, b) => b.id - a.id) 
    .slice(0, 3); 
  return (
    <>
      <NavBarDash />
      <main className="bg-background text-foreground min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content (left 2 columns on large screens) */}
            <div className="lg:col-span-2">
              <section className="mb-8">
                <h1 className="font-bebas text-4xl text-center text-[#ff8211]">
                  Dashboard
                </h1>
                <p className="mt-2 text-center text-muted-foreground text-[#555555]">
                  Overview of your courses, students and revenue.
                </p>
              </section>

              <section className="mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-surface rounded-xl p-6 shadow-sm text-center">
                    <p className="text-sm text-primary">👨‍🎓 Total Subs</p>
                    <p className="mt-4 font-bebas text-3xl">250</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Active subscribers
                    </p>
                  </div>
                  <div className="bg-surface rounded-xl p-6 shadow-sm text-center">
                    <p className="text-sm text-primary">📚 Total Courses</p>
                    <p className="mt-4 font-bebas text-3xl">{totalCourses}</p>
                    {/* <p className="text-sm text-muted-foreground mt-2">
                      Published this month
                    </p> */}
                  </div>
                  <div className="bg-surface rounded-xl p-6 shadow-sm text-center">
                    <p className="text-sm text-primary">💰 Revenue</p>
                    <p className="mt-4 font-bebas text-3xl">$1,240</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      This month
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <div className="flex items-center gap-4">
                  <span className="flex-1 h-px bg-muted" />
                  <h2 className="font-bebas text-2xl">Top Courses</h2>
                  <span className="flex-1 h-px bg-muted" />
                </div>

                <div className="mt-6 overflow-x-auto">
                  <table className="w-full table-auto bg-surface rounded-lg shadow-sm">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="px-4 py-3">Course</th>
                        <th className="px-4 py-3">Clients</th>
                        <th className="px-4 py-3">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topCourses.map((c, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-3">{c.title}</td>
                          <td className="px-4 py-3">{c.clients}</td>
                          <td className="px-4 py-3">${c.revenue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-4">
                  <span className="flex-1 h-px bg-muted" />
                  <h2 className="font-bebas text-2xl">Recent Courses</h2>
                  <span className="flex-1 h-px bg-muted" />
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold">📚 Recently Added</h3>
                  <ul className="list-disc list-inside mt-3 space-y-2 text-sm text-muted-foreground">
                    {recentCourses.map((course, index) => (
                      <li key={index}>
                        {course.title} ({course.status || "Published"})
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </div>

            {/* Sidebar (right column) */}
            <aside className="lg:col-span-1 border-l border-muted-foreground pl-6 ">
              <div className="space-y-6">
                <div className="bg-surface rounded-xl p-6 shadow-sm">
                  <h4 className="font-bebas text-xl text-primary text-[#ff8211]">
                    Profile
                  </h4>
                  <div className="mt-4">
                    <p className="font-medium">Name: Ali Kamal</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Total courses: {totalCourses}
                    </p>
                  </div>
                </div>

                <div className="bg-surface rounded-xl p-6 shadow-sm">
                  <h4 className="font-bebas text-xl text-primary text-[#ff8211]">
                    Quick Panel
                  </h4>
                  <div className="mt-4 flex flex-col gap-3">
                    <Link
                      to="/trainer/courses"
                      className="text-sm hover:underline"
                    >
                      📚 View my courses
                    </Link>
                    <a href="" className="text-sm hover:underline">
                      🧾 Transactions
                    </a>
                    <Link to="/Profile" className="text-sm hover:underline">
                      ⚙️ Edit profile
                    </Link>
                  </div>
                </div>
                <div>
                  <Chat />
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
