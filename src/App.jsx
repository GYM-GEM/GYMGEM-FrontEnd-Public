import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Trainees from "./pages/Trainees";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Trainers from "./pages/Trainers";
import Register from "./pages/Register";
import Selectrole from "./components/SelectRole";
import Trainerform from "./components/Formes/TrainerForm";
import Trainerform2 from "./components/Formes/TrainerForm2";
import Traineeform from "./components/Formes/TraineeForm";
import Traineeinfo from "./components/Formes/TraineeInfoForm.jsx";
import RootLayout from "./Layout/Rootlayout";
import LoginPage from "./pages/LoginPage";
import RequestDetails from "./pages/DetailsTrainees";
import AddCourse from "./components/courses/AddCourse.jsx";
import NewLeason from "./components/courses/NewLeason.jsx";
import DashboardTrainer from "./components/Dashboard/DashboardTrainer.jsx";
import CoursesTrainerDash from "./components/Dashboard/CoursesTrainerDash.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="Courses" element={<Courses />} />
        <Route path="trainers" element={<Trainers />} />
        <Route path="trainees" element={<Trainees />} />
        <Route path="about" element={<About />} />
        <Route path="profile" element={<Profile />} />
        <Route path="requestdetails" element={<RequestDetails />} />
        <Route path="addcourse" element={<AddCourse />} />
        <Route path="newleason" element={<NewLeason />} />
        <Route path="dashboardtrainer" element={<DashboardTrainer />} />
        <Route path="coursestrainerdash" element={<CoursesTrainerDash />} />
      </Route>

      {/* <Route path="/login" element={<LogIn />} /> */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/role" element={<Selectrole />} />
      <Route path="/trainerform" element={<Trainerform />} />
      <Route path="/trainerform2" element={<Trainerform2 />} />
      <Route path="/traineeform" element={<Traineeform />} />
      <Route path="/traineeinfo" element={<Traineeinfo />} />
    </Routes>
  );
}

export default App;
