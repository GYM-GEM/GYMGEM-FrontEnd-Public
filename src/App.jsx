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
import RootLayout from "./Layout/Rootlayout";
import LoginPage from "./pages/LoginPage";

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
      </Route>

      {/* <Route path="/login" element={<LogIn />} /> */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/role" element={<Selectrole />} />
      <Route path="/trainerform" element={<Trainerform />} />
    </Routes>
  );
}

export default App;
