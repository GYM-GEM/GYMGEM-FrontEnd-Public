import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import traineeIcon from "../assets/trainer1.png";
import trainerIcon from "../assets/1trainer.png";
import gymIcon from "../assets/weight.png";
import storeIcon from "../assets/store.png";
import nutritionIcon from "../assets/nutritionist.png";

const roles = [
  {
    id: "trainee",
    title: "Trainee",
    description:
      "Find trainers, programs, and nutrition plans tailored to your pace.",
    icon: traineeIcon,
  },
  {
    id: "trainer",
    title: "Trainer",
    description:
      "Create programs, guide trainees, and manage your sessions with ease.",
    icon: trainerIcon,
  },
  {
    id: "gym",
    title: "Gym",
    description:
      "Manage facilities, trainers, and memberships from one calm dashboard.",
    icon: gymIcon,
  },
  {
    id: "store",
    title: "Store",
    description:
      "Showcase verified products, supplements, and gear to the GymGem community.",
    icon: storeIcon,
  },
  {
    id: "nutrition",
    title: "Nutrition Specialist",
    description:
      "Offer meal plans and ongoing nutrition support to motivated clients.",
    icon: nutritionIcon,
  },
];

const Selectrole = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");

  const onSubmit = async () => {
    if (!selectedRole) {
      alert("Please select a role first!");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const payload = { profile_type: selectedRole, account: user.account.id };
      const token = user.access;

      const response = await axios.post(
        "http://127.0.0.1:8000/api/profiles/create",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Response:", response.data);
      alert(`${selectedRole} profile created successfully!`);

      if (selectedRole === "trainer") navigate("/trainerform");
      else if (selectedRole === "trainee") navigate("/traineeform");
      else navigate("/");
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Failed. Please try again.");
    }
  };

  return (
    <section className="min-h-screen bg-background px-4 py-16 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Choose your role
          </p>
          <h1 className="font-bebas text-4xl tracking-tight sm:text-5xl text-[#ff8211]">
            Tell us how you want to use GymGem
          </h1>
          <p className="mx-auto max-w-3xl text-base text-muted-foreground  text-[#555555] sm:text-lg">
            Select the workspace that matches your goals. You can always add
            more roles later to collaborate across training, nutrition, and
            commerce.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => {
            const isSelected = role.id === selectedRole;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                className={`cursor-pointer group flex h-full flex-col justify-between rounded-3xl border border-border bg-card/80 p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:bg-[#ff8211] hover:text-white ${
                  isSelected ? "bg-[#ff8211] text-white" : ""
                }`}
              >
                <div className="space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                    <img
                      src={role.icon}
                      alt={role.title}
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                  <div className="space-y-2">
                    <h2 className="font-bebas text-2xl text-foreground">
                      {role.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {role.description}
                    </p>
                  </div>
                </div>
                <span
                  className={`pt-4 text-sm font-semibold transition ${
                    isSelected
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-primary"
                  }`}
                >
                  {isSelected ? "Selected" : "Select"} →
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex justify-center pt-4">
          <button
            onClick={onSubmit}
            disabled={!selectedRole}
            className="cursor-pointer inline-flex h-12 min-w-[200px] items-center justify-center rounded-xl bg-[#ff8211] px-6 text-sm font-semibold text-white transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
          >
            Confirm role
          </button>
        </div>
      </div>
    </section>
  );
};

export default Selectrole;
