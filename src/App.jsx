import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// pages
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Trainees from "./pages/Trainees";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Trainers from "./pages/Trainers";
import LoginPage from "./pages/auth/LoginPage.jsx";
import SignUpPage from "./pages/auth/Register.jsx";
import Dashboard from "./pages/Dashboard";
import NotFound from "./components/NotFound.jsx";
import Community from "./pages/Community.jsx";
import Coursedetails from "./components/courses/CourseDetails.jsx";
import Viewprofile from "./components/Viewprofile.jsx";
import Store from "./pages/Store.jsx";

// forms
import Selectrole from "./components/SelectRole";
import Trainerform from "./components/Forms/TrainerForm.jsx";
import TrainerSpecialization from "./components/Forms/TrainerSpecialization.jsx";
import TrainerExperience from "./components/Forms/TrainerExperience.jsx";
import Traineeform from "./components/Forms/TraineeForm.jsx";
import TraineeRecord from "./components/Forms/TraineeRecord.jsx";

// layout
import RootLayout from "./Layout/Rootlayout";

// details
import RequestDetails from "./pages/DetailsTrainees";
import AddCourse from "./components/courses/AddCourse.jsx";
import NewLeason from "./components/courses/NewLesson.jsx";
import AddSection from "./components/courses/AddSection.jsx";

// dashboard trainer
import DashboardTrainer from "./components/Dashboard/Trainer/DashboardTrainer.jsx";
import CoursesTrainerDash from "./components/Dashboard/Trainer/CoursesTrainerDash.jsx";
import ClientTrainerDash from "./components/Dashboard/Trainer/ClientTrainerDash.jsx";
import TrainerprofileDash from "./components/Dashboard/Trainer/TrainerprofileDash.jsx";
import CourseDetailsDash from "./components/Dashboard/Trainer/CourseDetailsDash.jsx";

// dashboard trainee
import TraineeDash from "./components/Dashboard/Traine/TraineeDash.jsx";
import SettingsTrainee from "./components/Dashboard/Traine/SettingsTrainee.jsx";
import CoursesTraineDash from "./components/Dashboard/Traine/CoursesTraineDash.jsx";
import CourseDetails from "./components/courses/CourseDetails.jsx";
import Settings from "./components/Settings.jsx";
import PublicTrainerProfile from "./components/PublicTrainerProfile.jsx";
// dashboard gym
import GymDashboard from "./components/Dashboard/GYM/GymDashboard.jsx";
import GymMember from "./components/Dashboard/GYM/GymMember.jsx";
import GymSessions from "./components/Dashboard/GYM/GymSessions.jsx";
import GymClasses from "./components/Dashboard/GYM/GymClasses.jsx";
import Gymprofile from "./components/Dashboard/GYM/Gymprofile.jsx";

// dashboard store
import StoreDashboard from "./components/Dashboard/Store/StoreDashboard.jsx";
import Storeprofile from "./components/Dashboard/Store/Storeprofile.jsx";
import StoreProduct from "./components/Dashboard/Store/StoreProduct.jsx";
import StoreOrder from "./components/Dashboard/Store/StoreOrder.jsx";




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
          <Route path="addlesson" element={<NewLeason />} />
          <Route path="addsection" element={<AddSection />} />
          <Route path="community" element={<Community />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/trainer-profile" element={<PublicTrainerProfile />} />
          <Route path="viewprofile" element={<Viewprofile />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/stores" element={<Store />} />
        </Route>

        {/* -------------------- TRAINER DASHBOARD -------------------- */}
        <Route path="trainer">
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardTrainer />} />
          <Route path="courses" element={<CoursesTrainerDash />} />
          <Route path="courses/:id" element={<CourseDetailsDash />} />
          <Route path="clients" element={<ClientTrainerDash />} />
          <Route path="profile" element={<TrainerprofileDash />} />
        </Route>

        {/* -------------------- TRAINEE DASHBOARD -------------------- */}
        <Route path="traine">
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TraineeDash />} />
          <Route path="courses" element={<CoursesTraineDash />} />
          <Route path="settings" element={<SettingsTrainee />} />
        </Route>
        {/* -------------------- GYM DASHBOARD -------------------- */}
        <Route path="gym">
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<GymDashboard />} />
          <Route path="gymMember" element={<GymMember />} />
          <Route path="gymSessions" element={<GymSessions />} />
          <Route path="gymClasses" element={<GymClasses />} />
          <Route path="gymprofile" element={<Gymprofile />} />
        </Route>

        {/* --------------------Store DASHBOARD -------------------- */}
        <Route path="store">
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StoreDashboard />} />
          <Route path="product" element={<StoreProduct />} />
          <Route path="order" element={<StoreOrder />} />
          <Route path="profile" element={<Storeprofile />} />
        </Route>

        {/* -------------------- AUTH + FORMS -------------------- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/role" element={<Selectrole />} />
        {/* -------------------- Trainer Form -------------------- */}
        <Route path="/trainerform" element={<Trainerform />} />
        <Route path="/trainerSpecialization" element={<TrainerSpecialization />} />
        <Route path="/trainerExperience" element={<TrainerExperience />} />
        {/* -------------------- Tarinee Form -------------------- */}
        <Route path="/traineeform" element={<Traineeform />} />
        <Route path="/traineerecord" element={<TraineeRecord />} />

        {/* -------------------- CATCH ALL -------------------- */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
