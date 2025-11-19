import { Link, useParams } from "react-router-dom";
import Navbar from "../Navbar";
import yogoForNoha from "../../assets/yogoForNoha.jpg";
const CourseDetails = () => {
  const { id } = useParams();
  const courses = JSON.parse(localStorage.getItem("courses")) || [];
  const course = courses.find((c) => String(c.id) === id);

  if (!course) {
    
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <p>Course not found</p>
        </main>
      </>
    );
  }



  // const course = {
  //   title: "Strength Training for Beginners",
  //   description:
  //     "Boost endurance and burn calories fast with high-energy interval workouts.",
  //   category: "Fitness",
  //   level: "Beginner",
  //   language: "English",
  //   price: "$29",
  //   status: "Published",
  //   hero: yogoForNoha,
  // };

  return (
    <>
      <Navbar />

      <main className=" w-full min-h-screen bg-background text-foreground">
        <div className="mx-auto w-[80%]  px-6 py-12">
          <div className="bg-card p-10 rounded-lg shadow-lg border border-border">
            <div className="pb-[1rem]">
              <Link
                to="/Courses"
                className="text-[#ff8211] text-sm font-semibold hover:underline"
              >
                &larr; Back to courses
              </Link>
            </div>
            <h1 className="mt-0 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight font-bebas text-foreground">
              {course.title}
            </h1>

            <div className="mt-6">
              <div className="w-full h-48 md:h-64 lg:h-80 rounded-lg overflow-hidden shadow-sm border border-border bg-muted">
                <img
                  src={course.img}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="mt-4 text-muted-foreground max-w-3xl">
                {course.description || "No description provided"}
              </p>
            </div>

            <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  Course Info
                </h3>
                <div className="rounded-xl p-6 shadow-sm border border-border bg-card">
                  <ul className="text-sm text-muted-foreground space-y-3">
                    <li>
                      <strong className="inline-block w-28">Category:</strong>
                      <span className="ml-2 text-foreground">
                        {course.category}
                      </span>
                    </li>
                    <li>
                      <strong className="inline-block w-28">Level:</strong>
                      <span className="ml-2 text-foreground">
                        {course.level}
                      </span>
                    </li>
                    <li>
                      <strong className="inline-block w-28">Language:</strong>
                      <span className="ml-2 text-foreground">
                        {course.language}
                      </span>
                    </li>
                    <li>
                      <strong className="inline-block w-28">Price:</strong>
                      <span className="ml-2 text-foreground">
                        {course.price}
                      </span>
                    </li>
                    <li>
                      <strong className="inline-block w-28">Status:</strong>
                      <span className="ml-2 text-foreground">
                        {course.status}
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4 text-foreground">
                    Lessons
                  </h3>
                  {course.lessons && course.lessons.length > 0 ? (
                    <ul className="list-disc list-inside text-muted-foreground space-y-2">
                      {course.lessons.map((lesson, index) => (
                        <li key={index} className="text-foreground">
                          {lesson.title || `Lesson ${index + 1}`}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">
                      No lessons added yet.
                    </p>
                  )}
                </div>
                <div className="mt-8">
                  <h4 className="text-lg font-bold mb-4 text-foreground">
                    Title: "Preview Video"
                  </h4>
                  <div className="w-full rounded-lg bg-muted border border-border h-44 md:h-64" />
                </div>
              </div>

              <aside className="hidden md:block">
                {/* right column for CTA, instructor info etc. */}
                <div className="rounded-xl p-6 shadow-sm border border-border bg-card">
                  <h5 className="font-semibold text-foreground mb-2">
                    Instructor
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    {course.instructor || "Unknown"}
                  </p>
                  <div className="mt-4">
                    <button className="inline-flex w-full items-center justify-center rounded-xl bg-[#ff8211] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                      Enroll Now
                    </button>
                  </div>
                </div>
              </aside>
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

export default CourseDetails;
