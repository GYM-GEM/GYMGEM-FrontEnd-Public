import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import CoursesData from "../js/CardCouData";
import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

function Courses() {
  const [selectedFilter, setSelectedFilter] = useState("All Courses");
  const [courses, setCourses] = useState([]);
  const [displayedCourses, setDisplayedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);

  const coursesPerPage = 9;

  const getCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/utils/categories');
      setCategories(response.data.results);

    } catch (error) {
      console.log("Faild to load categories");
    }
  }

  const getAllCourses = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('access');

    try {
      const response = await axios.get('http://localhost:8000/api/courses/courses/for-trainees',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      let filteredCourses = response.data;
      
      // Filter by category if not "All Courses"
      if (selectedFilter !== "All Courses") {
        const selectedCategory = categories.find(cat => cat.name === selectedFilter);
        if (selectedCategory) {
          filteredCourses = response.data.filter(course => course.category === selectedCategory.id);
        }
      }

      setCourses(filteredCourses);
      setCurrentPage(1);
      setDisplayedCourses(filteredCourses.slice(0, coursesPerPage));
    } catch (error) {
      console.log("Failed to fetch courses")
    } finally {
      setIsLoading(false);
    }
  }

  const loadMoreCourses = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const startIdx = nextPage * coursesPerPage - coursesPerPage;
      const endIdx = nextPage * coursesPerPage;

      setDisplayedCourses([...displayedCourses, ...courses.slice(startIdx, endIdx)]);
      setCurrentPage(nextPage);
      setIsLoadingMore(false);
    }, 300);
  };

  const hasMoreCourses = displayedCourses.length < courses.length;


  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    getAllCourses();
  }, [selectedFilter, categories]);

  const filterOptions = [
    {
      label: "All Courses",
      icon: "✨",
      bgColor: "bg-muted",
      textColor: "text-muted-foreground",
      hoverColor: "hover:bg-primary/10 hover:text-primary hover:shadow-sm",
      activeColor:
        "bg-primary/10 text-primary shadow-sm ring-2 ring-primary/20",
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
        label: category.name,
        categoryId: category.id,
        icon: icons[idx % icons.length],
        ...colorScheme
      };
    })
  ];

  return (
    <div className="bg-background text-foreground">
      <Navbar />
      <section className="w-full bg-background">
        <div className="mx-auto flex w-[80%] flex-col gap-6 px-4 py-16 sm:px-6 lg:px-8">
          <header className="space-y-4 text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Courses
            </p>
            <h1 className="font-bebas text-4xl tracking-tight text-[#ff8211] text-foreground sm:text-5xl">
              Find your perfect fitness course
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg text-[#555555]">
              Explore curated programs for every ambition—from mindful mobility
              to high-energy conditioning—crafted by trusted GymGem coaches.
            </p>
          </header>

          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              Filter by category:
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {filterOptions.map((option) => {
                const isActive = selectedFilter === option.label;
                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => setSelectedFilter(option.label)}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-xs font-medium transition-all duration-200 ease-in-out ${isActive
                      ? option.activeColor
                      : `${option.bgColor} ${option.textColor} ${option.hoverColor}`
                      } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95`}
                  >
                    <span className="text-sm leading-none">{option.icon}</span>
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <section className="w-full bg-background pb-20">
        <div className="mx-auto grid w-[80%] gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
          {isLoading ? (
            // Skeleton loading state
            [...Array(9)].map((_, idx) => (
              <div
                key={idx}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm animate-pulse"
              >
                <div className="relative h-48 w-full overflow-hidden bg-gray-300" />
                <div className="flex flex-1 flex-col gap-6 p-6">
                  <div className="space-y-3">
                    <div className="h-6 bg-gray-300 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="h-6 bg-gray-300 rounded w-20" />
                    <div className="h-10 bg-gray-300 rounded w-24" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            displayedCourses.map((item) => (
              <article
                key={item.id || item.title}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    src={item.cover}
                    alt={item.title}
                    loading="lazy"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-6 p-6">
                  <div className="space-y-3">
                    <h2 className="font-bebas text-2xl uppercase text-foreground">
                      {item.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      By Coach <Link className="hover:text-orange-600" to={`trainer-profile/${item.trainer_profile}`}>{item.trainer_profile_name}</Link> · 4 Weeks
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-bebas text-xl text-foreground">
                      {`$${item.price || 0}`}
                    </span>

                    <Link
                      to={`/courses/${item.id}`}
                      className="inline-flex items-center justify-center rounded-xl border border-border bg-[#ff8211] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#e97108] hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        {/* Load More Button */}
        {hasMoreCourses && !isLoading && (
          <div className="mx-auto w-[80%] flex justify-center mt-12 px-4">
            <button
              onClick={loadMoreCourses}
              disabled={isLoadingMore}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff8211] px-8 py-3 text-base font-semibold text-white transition hover:bg-[#e97108] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load More Courses"
              )}
            </button>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}

export default Courses;
