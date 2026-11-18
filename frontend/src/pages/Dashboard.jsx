
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  FileText,
  Compass,
  MessageSquare,
  BriefcaseBusiness,
  LogOut,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Target,
  TrendingUp,
  Bookmark,
  BookOpen,
  CheckCircle2,
  RefreshCw
} from "lucide-react";

import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // Learning Progress States
  const [careerPlans, setCareerPlans] = useState([]);
  const [progressLoading, setProgressLoading] = useState(true);
  const [progressError, setProgressError] = useState("");

  // Check Login Status
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token) {
      navigate("/login");
      return;
    }

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    }
  }, [navigate]);

  // Fetch Learning Progress
  useEffect(() => {
    const fetchLearningProgress = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setProgressLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/career-plans",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load learning progress."
          );
        }

        setCareerPlans(data.careerPlans || []);
        setProgressError("");

      } catch (error) {
        setProgressError(
          error.message || "Unable to load learning progress."
        );
      } finally {
        setProgressLoading(false);
      }
    };

    fetchLearningProgress();
  }, []);

  // Calculate Overall Learning Statistics
  const totalPlans = careerPlans.length;

  const totalSteps = careerPlans.reduce(
    (total, plan) =>
      total + (plan.learningRoadmap || []).length,
    0
  );

  const completedSteps = careerPlans.reduce(
    (total, plan) =>
      total +
      (plan.learningRoadmap || []).filter(
        (step) => step.completed === true
      ).length,
    0
  );

  const overallProgress = totalSteps > 0
    ? Math.round((completedSteps / totalSteps) * 100)
    : 0;

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const firstName = user?.name
    ? user.name.split(" ")[0]
    : "User";

  return (
    <div className="dashboard-page">

      {/* Sidebar */}
      <aside className="dashboard-sidebar">

        <div className="dashboard-logo">
          <div className="logo-icon">
            <Sparkles size={23} />
          </div>
          <span>CareerForgeAI</span>
        </div>

        <nav className="sidebar-nav">

          <p className="sidebar-heading">MENU</p>

          <button
            className="sidebar-link active"
            onClick={() => navigate("/dashboard")}
          >
            <LayoutDashboard size={19} />
            Dashboard
          </button>

          <button
            className="sidebar-link"
            onClick={() => navigate("/profile")}
          >
            <User size={19} />
            My Profile
          </button>

          <button
            className="sidebar-link"
            onClick={() => navigate("/resume-builder")}
          >
            <FileText size={19} />
            Resume Builder
          </button>

          <button
            className="sidebar-link"
            onClick={() => navigate("/career-guidance")}
          >
            <Compass size={19} />
            Career Guidance
          </button>

          <button
            className="sidebar-link"
            onClick={() => navigate("/saved-career-plans")}
          >
            <Bookmark size={19} />
            Saved Career Plans
          </button>

          <button
            className="sidebar-link"
            onClick={() => navigate("/interview")}
          >
            <MessageSquare size={19} />
            Interview Preparation
          </button>

          <button
            className="sidebar-link"
            onClick={() => navigate("/jobs")}
          >
            <BriefcaseBusiness size={19} />
            Job Opportunities
          </button>

        </nav>

        <div className="sidebar-bottom">
          <button
            className="sidebar-link logout-link"
            onClick={handleLogout}
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>

      </aside>

      {/* Main Content */}
      <main className="dashboard-main">

        {/* Header */}
        <header className="dashboard-header">

          <div>
            <h2>Dashboard</h2>
            <p>Manage your career journey in one place.</p>
          </div>

          <div className="dashboard-user">
            <div className="user-avatar">
              {firstName.charAt(0).toUpperCase()}
            </div>

            <div>
              <h4>{user?.name || "Welcome"}</h4>
              <span>{user?.email || "CareerForgeAI User"}</span>
            </div>
          </div>

        </header>

        {/* Welcome Section */}
        <section className="dashboard-welcome">

          <div className="welcome-content">
            <span className="welcome-tag">
              <Sparkles size={15} />
              YOUR CAREER JOURNEY
            </span>

            <h1>
              Welcome back, {firstName}!
            </h1>

            <p>
              Build your skills, create a professional resume
              and discover opportunities to achieve your career goals.
            </p>

            <button
              className="welcome-button"
              onClick={() => navigate("/career-guidance")}
            >
              Explore Career Guidance
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="welcome-illustration">
            <div className="illustration-circle">
              <GraduationCap size={75} />
            </div>

            <div className="illustration-star star-one">
              <Sparkles size={23} />
            </div>

            <div className="illustration-star star-two">
              <Target size={25} />
            </div>
          </div>

        </section>

        {/* My Learning Progress */}
        <section className="dashboard-progress-section">

          <div className="progress-section-heading">
            <div>
              <span className="progress-section-tag">
                <TrendingUp size={15} />
                YOUR LEARNING ACTIVITY
              </span>

              <h2>My Learning Progress</h2>

              <p>
                Track your career roadmaps and completed learning steps.
              </p>
            </div>

            <button
              className="progress-view-button"
              onClick={() => navigate("/saved-career-plans")}
            >
              View Career Plans
              <ArrowRight size={17} />
            </button>
          </div>

          {progressLoading ? (
            <div className="dashboard-progress-loading">
              <RefreshCw size={23} className="dashboard-spin" />
              <span>Loading your learning progress...</span>
            </div>
          ) : progressError ? (
            <div className="dashboard-progress-error">
              <p>{progressError}</p>

              <button
                onClick={() => navigate("/saved-career-plans")}
              >
                Open Saved Career Plans
              </button>
            </div>
          ) : (
            <>
              <div className="progress-stats-grid">

                <div className="progress-stat-card">
                  <div className="progress-stat-icon purple">
                    <Bookmark size={22} />
                  </div>

                  <div>
                    <span>Total Saved Plans</span>
                    <h3>{totalPlans}</h3>
                    <p>Your career collections</p>
                  </div>
                </div>

                <div className="progress-stat-card">
                  <div className="progress-stat-icon blue">
                    <BookOpen size={22} />
                  </div>

                  <div>
                    <span>Total Roadmap Steps</span>
                    <h3>{totalSteps}</h3>
                    <p>Across all saved plans</p>
                  </div>
                </div>

                <div className="progress-stat-card">
                  <div className="progress-stat-icon green">
                    <CheckCircle2 size={22} />
                  </div>

                  <div>
                    <span>Completed Steps</span>
                    <h3>{completedSteps}</h3>
                    <p>Successfully completed</p>
                  </div>
                </div>

                <div className="progress-stat-card">
                  <div className="progress-stat-icon orange">
                    <TrendingUp size={22} />
                  </div>

                  <div>
                    <span>Overall Progress</span>
                    <h3>{overallProgress}%</h3>
                    <p>Your combined progress</p>
                  </div>
                </div>

              </div>

              <div className="overall-progress-card">

                <div className="overall-progress-heading">
                  <div>
                    <h3>Overall Learning Journey</h3>
                    <p>
                      {completedSteps} of {totalSteps} learning steps completed
                    </p>
                  </div>

                  <strong>{overallProgress}%</strong>
                </div>

                <div
                  className="dashboard-progress-track"
                  role="progressbar"
                  aria-valuenow={overallProgress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-label="Overall learning progress"
                >
                  <div
                    className="dashboard-progress-fill"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>

                {totalSteps === 0 ? (
                  <p className="progress-bottom-message">
                    Save a career plan to start tracking your learning journey.
                  </p>
                ) : overallProgress === 100 ? (
                  <p className="progress-bottom-message completed">
                    <CheckCircle2 size={16} />
                    Congratulations! You have completed all your roadmap steps.
                  </p>
                ) : (
                  <p className="progress-bottom-message">
                    Keep learning! Every completed step brings you closer to your goal.
                  </p>
                )}

              </div>
            </>
          )}

        </section>

        {/* Dashboard Workspace */}
        <section className="dashboard-section">

          <div className="section-heading">
            <div>
              <h2>Your Career Workspace</h2>
              <p>Everything you need to move forward.</p>
            </div>
          </div>

          <div className="dashboard-tools">

            {/* Career Guidance */}
            <div className="tool-card">
              <div className="tool-icon purple">
                <Compass size={25} />
              </div>

              <h3>Career Guidance</h3>

              <p>
                Discover suitable career paths based on your
                skills, qualification and interests.
              </p>

              <button onClick={() => navigate("/career-guidance")}>
                Explore Careers
                <ArrowRight size={17} />
              </button>
            </div>

            {/* Resume Builder */}
            <div className="tool-card">
              <div className="tool-icon blue">
                <FileText size={25} />
              </div>

              <h3>Resume Builder</h3>

              <p>
                Create a professional resume by adding your
                education, skills and project details.
              </p>

              <button onClick={() => navigate("/resume-builder")}>
                Create Resume
                <ArrowRight size={17} />
              </button>
            </div>

            {/* Interview Preparation */}
            <div className="tool-card">
              <div className="tool-icon orange">
                <MessageSquare size={25} />
              </div>

              <h3>Interview Preparation</h3>

              <p>
                Prepare for interviews and improve your
                technical and communication skills.
              </p>

              <button onClick={() => navigate("/interview")}>
                Start Preparation
                <ArrowRight size={17} />
              </button>
            </div>

            {/* Job Opportunities */}
            <div className="tool-card">
              <div className="tool-icon green">
                <BriefcaseBusiness size={25} />
              </div>

              <h3>Job Opportunities</h3>

              <p>
                Explore job opportunities and find roles
                that match your career interests.
              </p>

              <button onClick={() => navigate("/jobs")}>
                Explore Jobs
                <ArrowRight size={17} />
              </button>
            </div>

            {/* Saved Career Plans */}
            <div className="tool-card">
              <div className="tool-icon purple">
                <Bookmark size={25} />
              </div>

              <h3>Saved Career Plans</h3>

              <p>
                View your saved career recommendations,
                required skills and personalized learning roadmaps.
              </p>

              <button onClick={() => navigate("/saved-career-plans")}>
                View Saved Plans
                <ArrowRight size={17} />
              </button>
            </div>

          </div>
        </section>

        {/* Career Motivation */}
        <section className="dashboard-insight">

          <div className="insight-icon">
            <TrendingUp size={25} />
          </div>

          <div>
            <h3>Keep Moving Forward!</h3>
            <p>
              Every skill you learn and every step you take
              brings you closer to your career goals.
            </p>
          </div>

        </section>

        {/* Footer */}
        <footer className="dashboard-footer">
          <p>
            © 2026 CareerForgeAI. All rights reserved.
          </p>
        </footer>

      </main>
    </div>
  );
}

export default Dashboard;
