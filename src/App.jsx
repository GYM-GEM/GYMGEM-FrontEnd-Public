import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Trainees from "./pages/Trainees";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Trainers from "./pages/Trainers";
import LogIn from "./pages/LogIn";
import Register from "./pages/Register";
import Selectrole from "./components/SelectRole";
import Trainerform from "./components/trainerForm";
import RootLayout from "./Layout/Rootlayout";

function App() {
  return (
    <Routes>
    
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="Courses" element={<Courses />} />
        <Route path="Trainers" element={<Trainers />} />
        <Route path="Trainees" element={<Trainees />} />
        <Route path="About" element={<About />} />
        <Route path="Profile" element={<Profile />} />
      </Route>

      <Route path="/login" element={<LogIn />} />
      <Route path="/register" element={<Register />} />
      <Route path="/role" element={<Selectrole />} />
      <Route path="/trainerform" element={<Trainerform />} />
    </Routes>
  );
}

export default App;
