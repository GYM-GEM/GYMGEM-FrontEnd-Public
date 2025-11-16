import NavTraineeDash from "./NavTraineDash";
import FooterDash from "../FooterDash";
import card1 from "../../../assets/cardCo1.png";
import card2 from "../../../assets/cardCo1.png";
import card3 from "../../../assets/cardCo1.png";
import { Link } from "react-router-dom";
const TraineeDash = () => {
  const user = {
    name: "Trainee",
    /* fetch user data here */
  };
  // Sample course data---------------------------------------------
  const CoursesData = [
    {
      id: 1,
      image: card1,
      title: "Total Body Strength",
      description:
        "Boost endurance and burn calories fast with high-energy interval workouts.",
      ByCoach: "By Coach Sarah Ahmed · 4 Weeks",
    },
    {
      id: 2,
      image: card2,
      title: "Total Body Strength",
      description:
        "Boost endurance and burn calories fast with high-energy interval workouts.",
      ByCoach: "By Coach Sarah Ahmed · 4 Weeks",
    },
    {
      id: 3,
      image: card3,
      title: "Total Body Strength",
      description:
        "Boost endurance and burn calories fast with high-energy interval workouts.",
      ByCoach: "By Coach Sarah Ahmed · 4 Weeks",
    },
  ];
  // sample Trainers data------------------------------------------
  const TrainersData = [
    {
      id: 1,
      image: card1,
      title: "Coach Mahmoud ",
      description: "Specialty: Strength",
      buttonText: "View Profile",
    },
    {
      id: 1,
      image: card1,
      title: "Coach ALI",
      description: "Specialty: Strength",
      buttonText: "View Profile",
    },
    {
      id: 1,
      image: card1,
      title: "Coach Sayed",
      description: "Specialty: Strength",
      buttonText: "View Profile",
    },
  ];

  return (
    <>
      <NavTraineeDash />
      <main className="bg-background text-foreground min-h-screen">
        <div className="w-[80%] mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="font-bebas text-4xl text-start text-[#ff8211]">
              Welcome back, {user.name}!
            </h1>
            <p className="mt-2 text-start text-muted-foreground">
              Track your courses and stay connected with your coach.
            </p>
          </div>

          <section className="mb-12 w-full">
            <div>
              <h2 className="text-2xl font-semibold mb-4">📚 Your Courses</h2>
            </div>

            <div className="w-full flex flex-wrap justify-center gap-5 px-4 sm:px-6 lg:px-8">
              {CoursesData.map((item) => (
                <article
                  key={item.title}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-md w-[80%] mx-auto sm:w-[46%] md:w-[40%] lg:w-[30%]"
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
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* -------------------------------------- */}

          <section className="mb-12 w-full">
            <div>
              <h2 className="text-2xl font-semibold mb-4">💪 Your Trainers</h2>
            </div>
            <div className=" mx-auto flex flex-wrap justify-center gap-6 px-4 sm:px-6 lg:px-8">
              {TrainersData.map((item) => (
                <article
                  key={item.title}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-md w-[80%] mx-auto sm:w-[46%] md:w-[40%] lg:w-[30%]"
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

                    <div className="mt-auto flex items-center justify-end">
                      <Link
                        to="#"
                        className="inline-flex items-end justify-center rounded-xl border border-border bg-[#ff8211] px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background text-white"
                      >
                        {item.buttonText}
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
      <FooterDash />
    </>
  );
};

export default TraineeDash;
