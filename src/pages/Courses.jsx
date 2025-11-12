import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import CoursesData from "../js/CardCouData";
import { Link } from "react-router-dom";
import { useState } from "react";

function Courses() {
  const [selectedFilter, setSelectedFilter] = useState("All Courses");

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
    {
      label: "Yoga & Flexibility",
      icon: "🧘",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      hoverColor: "hover:bg-green-100 hover:shadow-md hover:-translate-y-0.5",
      activeColor:
        "bg-green-100 text-green-800 shadow-md ring-2 ring-green-300",
    },
    {
      label: "Weight Loss & Cardio",
      icon: "🏃",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
      hoverColor: "hover:bg-orange-100 hover:shadow-md hover:-translate-y-0.5",
      activeColor:
        "bg-orange-100 text-orange-800 shadow-md ring-2 ring-orange-300",
    },
    {
      label: "Nutrition Coaches",
      icon: "🥗",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
      hoverColor: "hover:bg-amber-100 hover:shadow-md hover:-translate-y-0.5",
      activeColor:
        "bg-amber-100 text-amber-800 shadow-md ring-2 ring-amber-300",
    },
    {
      label: "Strength & Conditioning",
      icon: "🏋️",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      hoverColor: "hover:bg-blue-100 hover:shadow-md hover:-translate-y-0.5",
      activeColor: "bg-blue-100 text-blue-800 shadow-md ring-2 ring-blue-300",
    },
    {
      label: "Boxing & MMA",
      icon: "🥊",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      hoverColor: "hover:bg-red-100 hover:shadow-md hover:-translate-y-0.5",
      activeColor: "bg-red-100 text-red-800 shadow-md ring-2 ring-red-300",
    },
  ];

  return (
    <div className="bg-background text-foreground">
      <Navbar />
      <section className="w-full bg-background">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-16 sm:px-6 lg:px-8">
          <header className="space-y-4 text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Courses
            </p>
            <h1 className="font-bebas text-4xl tracking-tight text-foreground sm:text-5xl">
              Find your perfect fitness course
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
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
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-xs font-medium transition-all duration-200 ease-in-out ${
                      isActive
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
      <section className="bg-background pb-20">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
          {CoursesData.map((item) => (
            <article
              key={item.title}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  src={item.image}
                  alt={item.title}
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
                    {item.ByCoach}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <span className="font-bebas text-xl text-foreground">
                    {item.price}
                  </span>
                  <Link
                    to="#"
                    className="inline-flex items-center justify-center rounded-xl border border-border bg-background/80 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {item.buttonText}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Courses;
