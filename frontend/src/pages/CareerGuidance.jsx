
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  GraduationCap,
  Code,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Target,
  BookOpen,
  TrendingUp,
  Lightbulb,
  Route,
  FolderKanban,
  CheckCircle2,
  RefreshCw,
  Bookmark,
  Check
} from "lucide-react";

import "./CareerGuidance.css";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

function CareerGuidance() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    qualification: "",
    skills: "",
    interests: ""
  });

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analyzedQualification, setAnalyzedQualification] = useState("");

  const [savedPlans, setSavedPlans] = useState([]);
  const [savingCareer, setSavingCareer] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!API_URL) {
      setError("API URL is not configured. Please try again later.");
      return;
    }

    setLoading(true);
    setError("");
    setSaveMessage("");
    setRecommendations([]);
    setSavedPlans([]);

    try {
      const response = await fetch(
        `${API_URL}/api/career/recommend`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Career analysis failed.");
      }

      if (
        !Array.isArray(data.recommendations) ||
        data.recommendations.length === 0
      ) {
        throw new Error("No career recommendations were generated.");
      }

      setRecommendations(data.recommendations);

      setAnalyzedQualification(
        data.qualification || formData.qualification
      );

      // Fetch already saved career plans
      const savedResponse = await fetch(
        `${API_URL}/api/career-plans`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (savedResponse.ok) {
        const savedData = await savedResponse.json();

        setSavedPlans(
          (savedData.careerPlans || []).map(
            (plan) => plan.careerTitle.toLowerCase()
          )
        );
      }

    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCareer = async (career) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!API_URL) {
      setSaveMessage("API URL is not configured. Please try again later.");
      return;
    }

    const careerKey = career.title.toLowerCase();

    if (savedPlans.includes(careerKey)) {
      return;
    }

    setSavingCareer(career.title);
    setSaveMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/career-plans`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            careerTitle: career.title,
            matchScore: career.matchScore,
            description: career.description,
            whyMatch: career.whyMatch,
            skillsToLearn: career.skillsToLearn || [],
            learningRoadmap: career.learningRoadmap || [],
            suggestedProjects: career.suggestedProjects || []
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save career plan.");
      }

      setSavedPlans((previous) => [...previous, careerKey]);
      setSaveMessage(`${career.title} saved successfully!`);

    } catch (err) {
      setSaveMessage(err.message || "Unable to save career plan.");
    } finally {
      setSavingCareer("");
    }
  };

  const handleReset = () => {
    setRecommendations([]);
    setError("");
    setSaveMessage("");
    setSavedPlans([]);
    setAnalyzedQualification("");

    setFormData({
      qualification: "",
      skills: "",
      interests: ""
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className="career-guidance-page">

      <header className="career-guidance-header">
        <button
          onClick={() => navigate("/dashboard")}
          className="back-button"
        >
          <ArrowLeft size={19} />
          Back to Dashboard
        </button>

        <div className="career-brand">
          <Sparkles size={22} />
          CareerForgeAI
        </div>
      </header>

      <main className="career-guidance-content">

        <section className="career-hero">
          <div className="career-hero-icon">
            <Target size={30} />
          </div>

          <span className="career-tag">
            AI-POWERED CAREER GUIDANCE
          </span>

          <h1>Discover Your Ideal Career Path</h1>

          <p>
            Tell us about your education, skills and interests.
            Get personalized career recommendations and a practical
            learning roadmap powered by AI.
          </p>
        </section>

        <section className="career-form-card">
          <h2>Build Your Career Profile</h2>

          <p className="career-form-subtitle">
            Enter your details to get personalized career guidance.
          </p>

          <form onSubmit={handleSubmit}>

            <div className="career-form-group">
              <label>
                <GraduationCap size={18} />
                Qualification
              </label>

              <select
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                required
              >
                <option value="">Select qualification</option>
                <option value="Diploma">Diploma</option>
                <option value="Bachelor's Degree">
                  Bachelor's Degree
                </option>
                <option value="B.Tech Computer Science Engineering">
                  B.Tech Computer Science Engineering
                </option>
                <option value="BCA">BCA</option>
                <option value="B.Sc">B.Sc</option>
                <option value="BBA">BBA</option>
                <option value="Master's Degree">
                  Master's Degree
                </option>
                <option value="MCA">MCA</option>
                <option value="M.Tech">M.Tech</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="career-form-group">
              <label>
                <Code size={18} />
                Your Skills
              </label>

              <textarea
                name="skills"
                placeholder="Example: Python, C++, JavaScript, React.js, SQL..."
                value={formData.skills}
                onChange={handleChange}
                required
              />

              <small>
                Enter your skills separated by commas.
              </small>
            </div>

            <div className="career-form-group">
              <label>
                <BriefcaseBusiness size={18} />
                Career Interests
              </label>

              <textarea
                name="interests"
                placeholder="Example: Software Development, Data Analytics, AI..."
                value={formData.interests}
                onChange={handleChange}
                required
              />

              <small>
                Mention the fields you are interested in.
              </small>
            </div>

            <button
              type="submit"
              className="career-submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="career-spin" />
                  Analyzing Your Profile...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate AI Recommendations
                </>
              )}
            </button>

          </form>

          {error && (
            <div className="career-error">
              {error}
            </div>
          )}
        </section>

        {recommendations.length > 0 && (
          <section className="career-results">

            <div className="career-results-heading">
              <span className="career-tag">
                <Sparkles size={14} />
                YOUR AI CAREER ANALYSIS
              </span>

              <h2>Your Personalized Career Roadmap</h2>

              <p>
                AI has analyzed your profile and identified
                these suitable career opportunities.
              </p>

              <div className="career-analysis-info">
                <GraduationCap size={17} />
                <span>
                  Qualification: {analyzedQualification}
                </span>
              </div>
            </div>

            {saveMessage && (
              <div className="career-analysis-info">
                <CheckCircle2 size={17} />
                <span>{saveMessage}</span>
              </div>
            )}

            <div className="career-results-grid">

              {recommendations.map((career, index) => {
                const isSaved = savedPlans.includes(
                  career.title.toLowerCase()
                );

                const isSaving = savingCareer === career.title;

                return (
                  <article
                    className="career-result-card"
                    key={`${career.title}-${index}`}
                  >

                    <div className="career-result-top">
                      <div className="career-result-icon">
                        <TrendingUp size={22} />
                      </div>

                      <span className="career-match">
                        {career.matchScore}% Match
                      </span>
                    </div>

                    <span className="career-result-number">
                      CAREER OPTION {index + 1}
                    </span>

                    <h3>{career.title}</h3>

                    <p className="career-result-description">
                      {career.description}
                    </p>

                    <div className="career-progress">
                      <div
                        className="career-progress-fill"
                        style={{
                          width: `${career.matchScore}%`
                        }}
                      />
                    </div>

                    {career.whyMatch && (
                      <div className="career-detail-section">
                        <h4>
                          <Lightbulb size={18} />
                          Why This Career Matches You
                        </h4>

                        <p>{career.whyMatch}</p>
                      </div>
                    )}

                    {career.skillsToLearn?.length > 0 && (
                      <div className="career-detail-section">
                        <h4>
                          <BookOpen size={18} />
                          Skills to Learn
                        </h4>

                        <div className="career-skills-list">
                          {career.skillsToLearn.map((skill, skillIndex) => (
                            <span key={`${skill}-${skillIndex}`}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {career.learningRoadmap?.length > 0 && (
                      <div className="career-detail-section">
                        <h4>
                          <Route size={18} />
                          Learning Roadmap
                        </h4>

                        <div className="career-roadmap">
                          {career.learningRoadmap.map((step, stepIndex) => (
                            <div
                              className="career-roadmap-item"
                              key={stepIndex}
                            >
                              <div className="career-roadmap-marker">
                                {step.step || stepIndex + 1}
                              </div>

                              <div className="career-roadmap-content">
                                <h5>{step.title}</h5>
                                <p>{step.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {career.suggestedProjects?.length > 0 && (
                      <div className="career-detail-section">
                        <h4>
                          <FolderKanban size={18} />
                          Suggested Projects
                        </h4>

                        <div className="career-project-list">
                          {career.suggestedProjects.map((project, projectIndex) => (
                            <div
                              className="career-project-item"
                              key={`${project}-${projectIndex}`}
                            >
                              <CheckCircle2 size={17} />
                              <span>{project}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      className="career-submit-button career-save-button"
                      onClick={() => handleSaveCareer(career)}
                      disabled={isSaved || isSaving}
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw size={18} className="career-spin" />
                          Saving...
                        </>
                      ) : isSaved ? (
                        <>
                          <Check size={18} />
                          Saved
                        </>
                      ) : (
                        <>
                          <Bookmark size={18} />
                          Save Career Plan
                        </>
                      )}
                    </button>

                  </article>
                );
              })}

            </div>

            <div className="career-regenerate">
              <button
                type="button"
                onClick={handleReset}
                className="career-submit-button"
              >
                <RefreshCw size={18} />
                Analyze Another Profile
              </button>
            </div>

          </section>
        )}

        {!loading &&
          !error &&
          recommendations.length === 0 && (
            <div className="career-empty-state">
              <Target size={25} />

              <h3>Your Career Journey Starts Here</h3>

              <p>
                Submit your profile to discover matching career paths,
                required skills and a personalized learning roadmap.
              </p>
            </div>
          )}

        <section className="career-benefits">

          <div>
            <ChartNoAxesCombined size={23} />
            <h3>Career Matches</h3>
            <p>
              Explore career options based on your profile.
            </p>
          </div>

          <div>
            <Target size={23} />
            <h3>Skill Insights</h3>
            <p>
              Discover the skills required for your target roles.
            </p>
          </div>

          <div>
            <BookOpen size={23} />
            <h3>Learning Roadmap</h3>
            <p>
              Follow practical steps to prepare for your career.
            </p>
          </div>

        </section>

      </main>
    </div>
  );
}

export default CareerGuidance;
