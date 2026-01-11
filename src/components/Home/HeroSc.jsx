import Hero1 from "../../assets/hero.mp4";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

function HeroSc() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [userProfileType, setUserProfileType] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    // Hero is visible on page load
    setIsVisible(true);

    // Get user profile type from localStorage
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        // Find the current active profile from the profiles array
        if (userData.profiles && userData.current_profile) {
          const currentProfileId = userData.current_profile;
          const activeProfile = userData.profiles.find(p => p.id === currentProfileId);
          if (activeProfile) {
            setUserProfileType(activeProfile.type);
          }
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // Check if user is a trainer
  const isTrainer = userProfileType?.toLowerCase() === "trainer";

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-[70vh] items-center justify-center overflow-hidden bg-gradient-to-br from-background via-orange-50/30 to-background text-foreground w-full"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            className="h-full w-full object-cover opacity-80"
          >
            <source src={Hero1} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-br from-background/70 via-orange-900/20 to-background/70" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center gap-8 px-4 py-20 text-center sm:px-6">
          <h1
            className={`font-bebas text-4xl tracking-tight text-foreground transition-all duration-1000 ease-out sm:text-5xl lg:text-6xl ${isVisible
              ? "translate-y-0 opacity-100"
              : "-translate-y-8 opacity-0"
              }`}
          >
            Your fitness network starts here
          </h1>
       

          <div
            className={`flex flex-col items-center gap-3 transition-all duration-1000 delay-300 ease-out sm:flex-row ${isVisible
              ? "translate-y-0 opacity-100"
              : "-translate-y-8 opacity-0"
              }`}
          >
            {isTrainer ? (
              <>
                {/* Trainer Buttons */}
                <button
                  onClick={() => navigate("/community")}
                  className="inline-flex h-12 min-w-[180px] items-center bg-gradient-to-r from-[#ff8211] to-orange-600 text-white justify-center rounded-xl px-6 text-sm font-semibold shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:from-orange-600 hover:to-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background group relative"
                >
                  Go to Community
                </button>
                <button
                  onClick={() => navigate("/trainer/addcourse")}
                  className="inline-flex h-12 min-w-[180px] items-center justify-center bg-gradient-to-r from-white to-gray-100 rounded-xl border-2 border-[#ff8211] px-6 text-sm font-semibold text-[#ff8211] shadow-md transition-all duration-300 hover:scale-110 hover:from-orange-50 hover:to-orange-100 hover:shadow-lg hover:text-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Create Course
                </button>
              </>
            ) : (
              <>
                {/* Default Buttons for non-trainers */}
                <button
                  onClick={() => navigate("/Trainers")}
                  className="inline-flex h-12 min-w-[180px] items-center bg-gradient-to-r from-[#ff8211] to-orange-600 text-white justify-center rounded-xl px-6 text-sm font-semibold shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:from-orange-600 hover:to-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background group relative"
                >
                  Find a trainer
                </button>
                <button
                  onClick={() => {
                    const user = localStorage.getItem("user");
                    navigate(user ? "/role" : "/signup");
                  }}
                  className="inline-flex h-12 min-w-[180px] items-center justify-center bg-gradient-to-r from-white to-gray-100 rounded-xl border-2 border-[#ff8211] px-6 text-sm font-semibold text-[#ff8211] shadow-md transition-all duration-300 hover:scale-110 hover:from-orange-50 hover:to-orange-100 hover:shadow-lg hover:text-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Join as a trainer
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSc;
