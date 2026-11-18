
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import InterviewPreparation from "./pages/InterviewPreparation";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import JobOpportunities from "./pages/JobOpportunities";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CareerGuidance from "./pages/CareerGuidance";
import ResumeBuilder from "./pages/ResumeBuilder";
import InterviewPractice from "./pages/InterviewPractice";
import SavedCareerPlans from "./pages/SavedCareerPlans";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/resume-builder" element={<ResumeBuilder />} />

        <Route path="/career-guidance" element={<CareerGuidance />} />

        <Route
          path="/saved-career-plans"
          element={<SavedCareerPlans />}
        />

        <Route path="/jobs" element={<JobOpportunities />} />

        <Route
          path="/interview"
          element={<InterviewPreparation />}
        />

        <Route
          path="/interview-practice"
          element={<InterviewPractice />}
        />

        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
