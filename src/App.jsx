import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// pages
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Trainees from "./pages/Trainees";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Trainers from "./pages/Trainers";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard";
import NotFound from "./components/NotFound.jsx";
import Community from "./pages/Community.jsx";
import Coursedetails from "./components/courses/CourseDetails.jsx";
import Viewprofile from "./components/Viewprofile.jsx";

// forms
import Selectrole from "./components/SelectRole";
import Trainerform from "./components/Formes/TrainerForm";
import Trainerform2 from "./components/Formes/TrainerForm2";
import Trainerform3 from "./components/Formes/TrainerForm3";
import Traineeform from "./components/Formes/TraineeForm";
import Traineeinfo from "./components/Formes/TraineeInfoForm.jsx";

// layout
import RootLayout from "./Layout/Rootlayout";

// details
import RequestDetails from "./pages/DetailsTrainees";
import AddCourse from "./components/courses/AddCourse.jsx";
import NewLeason from "./components/courses/NewLesson.jsx";

// dashboard trainer
import DashboardTrainer from "./components/Dashboard/Trainer/DashboardTrainer.jsx";
import CoursesTrainerDash from "./components/Dashboard/Trainer/CoursesTrainerDash.jsx";
import ClientTrainerDash from "./components/Dashboard/Trainer/ClientTrainerDash.jsx";
import TrainerprofileDash from "./components/Dashboard/Trainer/TrainerprofileDash.jsx";

// dashboard trainee
import TraineeDash from "./components/Dashboard/Traine/TraineeDash.jsx";
import TraineProfileDash from "./components/Dashboard/Traine/TraineProfileDash.jsx";
import CoursesTraineDash from "./components/Dashboard/Traine/CoursesTraineDash.jsx";

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* -------------------- PUBLIC + LAYOUT -------------------- */}
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="courses" element={<Courses />} />
          <Route path="trainers" element={<Trainers />} />
          <Route path="trainees" element={<Trainees />} />
          <Route path="about" element={<About />} />
          <Route path="profile" element={<Profile />} />
          <Route path="requestdetails" element={<RequestDetails />} />
          <Route path="addcourse" element={<AddCourse />} />
          <Route path="newlesson" element={<NewLeason />} />
          <Route path="community" element={<Community />} />
          <Route path="coursedetails" element={<Coursedetails />} />
          <Route path="viewprofile" element={<Viewprofile />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* -------------------- TRAINER DASHBOARD -------------------- */}
        <Route path="trainer">
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardTrainer />} />
          <Route path="courses" element={<CoursesTrainerDash />} />
          <Route path="clients" element={<ClientTrainerDash />} />
          <Route path="profile" element={<TrainerprofileDash />} />
        </Route>

        {/* -------------------- TRAINEE DASHBOARD -------------------- */}
        <Route path="traine">
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TraineeDash />} />
          <Route path="courses" element={<CoursesTraineDash />} />
          <Route path="profile" element={<TraineProfileDash />} />
        </Route>

        {/* -------------------- AUTH + FORMS -------------------- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/role" element={<Selectrole />} />
        <Route path="/trainerform" element={<Trainerform />} />
        <Route path="/trainerform2" element={<Trainerform2 />} />
        <Route path="/trainerform3" element={<Trainerform3 />} />
        <Route path="/traineeform" element={<Traineeform />} />
        <Route path="/traineeinfo" element={<Traineeinfo />} />

        {/* -------------------- CATCH ALL -------------------- */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
