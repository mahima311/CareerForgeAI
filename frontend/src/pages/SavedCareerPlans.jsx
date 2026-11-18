
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  BriefcaseBusiness,
  Trash2,
  RefreshCw,
  Target,
  BookOpen,
  Lightbulb,
  Route,
  FolderKanban,
  CheckCircle2,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  TrendingUp
} from "lucide-react";

import "./SavedCareerPlans.css";

function SavedCareerPlans() {
  const navigate = useNavigate();

  const [careerPlans, setCareerPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [updatingStep, setUpdatingStep] = useState("");
  const [expandedPlans, setExpandedPlans] = useState([]);

  // Fetch Saved Career Plans
  const fetchCareerPlans = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");

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
          data.message || "Unable to fetch saved career plans."
        );
      }

      setCareerPlans(data.careerPlans || []);

    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareerPlans();
  }, []);

  // Update Roadmap Step
  const handleToggleRoadmapStep = async (
    planId,
    stepIndex,
    completed
  ) => {
    const token = localStorage.getItem("token");
    const updateKey = `${planId}-${stepIndex}`;

    setUpdatingStep(updateKey);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/career-plans/${planId}/roadmap/${stepIndex}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ completed })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update roadmap progress."
        );
      }

      setCareerPlans((previous) =>
        previous.map((plan) =>
          plan._id === planId
            ? {
                ...plan,
                ...data.careerPlan,
                progress: data.progress,
                totalSteps: data.totalSteps,
                completedSteps: data.completedSteps
              }
            : plan
        )
      );

    } catch (err) {
      setError(err.message || "Unable to update progress.");
    } finally {
      setUpdatingStep("");
    }
  };

  // Delete Career Plan
  const handleDelete = async (planId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this career plan?"
    );

    if (!confirmed) return;

    const token = localStorage.getItem("token");

    setDeletingId(planId);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/career-plans/${planId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to delete career plan."
        );
      }

      setCareerPlans((previous) =>
        previous.filter((plan) => plan._id !== planId)
      );

    } catch (err) {
      setError(err.message || "Unable to delete career plan.");
    } finally {
      setDeletingId("");
    }
  };

  // Expand / Collapse Roadmap
  const togglePlan = (planId) => {
    setExpandedPlans((previous) =>
      previous.includes(planId)
        ? previous.filter((id) => id !== planId)
        : [...previous, planId]
    );
  };

  const handleExploreCareers = () => {
    navigate("/career-guidance");
  };

  return (
    <div className="saved-careers-page">

      {/* Header */}
      <header className="saved-careers-header">
        <button
          className="saved-back-button"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={19} />
          Back to Dashboard
        </button>

        <div className="saved-careers-brand">
          <Bookmark size={22} />
          CareerForgeAI
        </div>
      </header>

      <main className="saved-careers-content">

        {/* Hero Section */}
        <section className="saved-careers-hero">
          <div className="saved-careers-hero-icon">
            <BriefcaseBusiness size={28} />
          </div>

          <span className="saved-careers-tag">
            YOUR CAREER COLLECTION
          </span>

          <h1>Saved Career Plans</h1>

          <p>
            Explore your saved career opportunities, required skills
            and personalized learning roadmaps.
          </p>

          <div className="saved-careers-count">
            <Bookmark size={18} />
            {careerPlans.length} Saved Career Plans
          </div>
        </section>

        {/* Error Message */}
        {error && (
          <div className="saved-careers-error">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="saved-careers-loading">
            <RefreshCw size={28} className="saved-spin" />
            <h3>Loading Your Career Plans...</h3>
            <p>Please wait while we fetch your saved plans.</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && careerPlans.length === 0 && (
          <section className="saved-careers-empty">
            <div className="saved-empty-icon">
              <Bookmark size={35} />
            </div>

            <h2>No Saved Career Plans Yet</h2>

            <p>
              You haven't saved any career options yet.
              Explore AI career recommendations and save the
              opportunities that interest you.
            </p>

            <button
              className="saved-primary-button"
              onClick={handleExploreCareers}
            >
              <Target size={18} />
              Explore Career Options
            </button>
          </section>
        )}

        {/* Saved Plans */}
        {!loading && careerPlans.length > 0 && (
          <section className="saved-careers-list">

            {careerPlans.map((plan) => {
              const isExpanded = expandedPlans.includes(plan._id);
              const isDeleting = deletingId === plan._id;

              const roadmap = plan.learningRoadmap || [];
              const totalSteps = roadmap.length;

              const completedSteps = roadmap.filter(
                (step) => step.completed === true
              ).length;

              const progress = totalSteps > 0
                ? Math.round(
                    (completedSteps / totalSteps) * 100
                  )
                : 0;

              return (
                <article
                  className="saved-career-card"
                  key={plan._id}
                >

                  {/* Card Header */}
                  <div className="saved-career-card-header">

                    <div className="saved-career-icon">
                      <BriefcaseBusiness size={24} />
                    </div>

                    <div className="saved-career-title">
                      <span className="saved-career-label">
                        SAVED CAREER
                      </span>

                      <h2>{plan.careerTitle}</h2>
                    </div>

                    <div className="saved-career-match">
                      <strong>{plan.matchScore}%</strong>
                      <span>Match</span>
                    </div>

                  </div>

                  <p className="saved-career-description">
                    {plan.description}
                  </p>

                  {/* Why This Career */}
                  {plan.whyMatch && (
                    <div className="saved-career-section">
                      <h3>
                        <Lightbulb size={18} />
                        Why This Career Matches You
                      </h3>

                      <p>{plan.whyMatch}</p>
                    </div>
                  )}

                  {/* Skills */}
                  {plan.skillsToLearn?.length > 0 && (
                    <div className="saved-career-section">
                      <h3>
                        <BookOpen size={18} />
                        Skills to Learn
                      </h3>

                      <div className="saved-skills-list">
                        {plan.skillsToLearn.map((skill, index) => (
                          <span key={`${skill}-${index}`}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Roadmap Progress */}
                  {totalSteps > 0 && (
                    <div className="saved-progress-section">

                      <div className="saved-progress-heading">
                        <h3>
                          <TrendingUp size={19} />
                          Learning Progress
                        </h3>

                        <strong>{progress}%</strong>
                      </div>

                      <div
                        className="saved-progress-track"
                        role="progressbar"
                        aria-valuenow={progress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-label={`${plan.careerTitle} roadmap progress`}
                      >
                        <div
                          className="saved-progress-fill"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <p>
                        {completedSteps} of {totalSteps} steps completed
                      </p>

                      {progress === 100 && (
                        <span className="saved-completion-message">
                          <CheckCircle2 size={16} />
                          Career roadmap completed!
                        </span>
                      )}

                    </div>
                  )}

                  {/* Expand Button */}
                  <button
                    className="saved-expand-button"
                    onClick={() => togglePlan(plan._id)}
                  >
                    <Route size={18} />

                    {isExpanded
                      ? "Hide Learning Roadmap"
                      : "View Learning Roadmap"}

                    {isExpanded
                      ? <ChevronUp size={18} />
                      : <ChevronDown size={18} />}
                  </button>

                  {/* Expanded Roadmap */}
                  {isExpanded && (
                    <div className="saved-expanded-content">

                      {roadmap.length > 0 && (
                        <div className="saved-career-section">

                          <h3>
                            <Route size={18} />
                            Your Learning Roadmap
                          </h3>

                          <p className="saved-roadmap-instruction">
                            Tick each step after completing it.
                            Your progress will be saved automatically.
                          </p>

                          <div className="saved-roadmap">

                            {roadmap.map((step, index) => {
                              const isStepCompleted =
                                step.completed === true;

                              const updateKey =
                                `${plan._id}-${index}`;

                              const isUpdating =
                                updatingStep === updateKey;

                              return (
                                <div
                                  className={`saved-roadmap-item ${
                                    isStepCompleted
                                      ? "roadmap-completed"
                                      : ""
                                  }`}
                                  key={index}
                                >

                                  <div className="saved-roadmap-number">
                                    {step.step || index + 1}
                                  </div>

                                  <div className="saved-roadmap-details">
                                    <h4>{step.title}</h4>

                                    <p>{step.description}</p>

                                    <label className="saved-step-checkbox">
                                      <input
                                        type="checkbox"
                                        checked={isStepCompleted}
                                        disabled={
                                          isUpdating ||
                                          updatingStep !== ""
                                        }
                                        onChange={(event) =>
                                          handleToggleRoadmapStep(
                                            plan._id,
                                            index,
                                            event.target.checked
                                          )
                                        }
                                      />

                                      <span>
                                        {isUpdating
                                          ? "Saving..."
                                          : isStepCompleted
                                            ? "Completed"
                                            : "Mark as completed"}
                                      </span>

                                      {isStepCompleted && (
                                        <CheckCircle2 size={17} />
                                      )}
                                    </label>

                                  </div>
                                </div>
                              );
                            })}

                          </div>
                        </div>
                      )}

                      {/* Suggested Projects */}
                      {plan.suggestedProjects?.length > 0 && (
                        <div className="saved-career-section">

                          <h3>
                            <FolderKanban size={18} />
                            Suggested Projects
                          </h3>

                          <div className="saved-projects-list">
                            {plan.suggestedProjects.map(
                              (project, index) => (
                                <div
                                  className="saved-project-item"
                                  key={index}
                                >
                                  <CheckCircle2 size={17} />
                                  <span>{project}</span>
                                </div>
                              )
                            )}
                          </div>

                        </div>
                      )}

                    </div>
                  )}

                  {/* Footer */}
                  <div className="saved-career-footer">

                    <span className="saved-date">
                      <GraduationCap size={16} />
                      Saved on{" "}
                      {new Date(
                        plan.createdAt
                      ).toLocaleDateString("en-IN")}
                    </span>

                    <button
                      className="saved-delete-button"
                      onClick={() => handleDelete(plan._id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <RefreshCw
                          size={17}
                          className="saved-spin"
                        />
                      ) : (
                        <Trash2 size={17} />
                      )}

                      {isDeleting ? "Deleting..." : "Delete Plan"}
                    </button>

                  </div>

                </article>
              );
            })}

          </section>
        )}

        {/* Explore More */}
        {!loading && careerPlans.length > 0 && (
          <div className="saved-explore-more">

            <h3>Want to explore more career options?</h3>

            <p>
              Generate fresh AI recommendations based on your
              skills and interests.
            </p>

            <button
              className="saved-primary-button"
              onClick={handleExploreCareers}
            >
              <Target size={18} />
              Explore More Careers
            </button>

          </div>
        )}

      </main>
    </div>
  );
}

export default SavedCareerPlans;
