
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  Code,
  Users,
  Brain,
  Target,
  Clock,
  ChevronRight,
  MessageSquare,
  Trophy
} from "lucide-react";

import "./InterviewPreparation.css";

const interviewCategories = [
  {
    id: "technical",
    title: "Technical Interview",
    description: "Practice programming, databases and computer science questions.",
    icon: Code,
    color: "purple",
    duration: "15-20 minutes"
  },
  {
    id: "hr",
    title: "HR Interview",
    description: "Prepare for common HR and behavioral interview questions.",
    icon: Users,
    color: "blue",
    duration: "10-15 minutes"
  },
  {
    id: "aptitude",
    title: "Aptitude Interview",
    description: "Improve logical reasoning and quantitative problem-solving.",
    icon: Brain,
    color: "orange",
    duration: "15-20 minutes"
  }
];

function InterviewPreparation() {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("");

 const handleStart = (category) => {
  navigate("/interview-practice", {
    state: {
      category: category
    }
  });
};

  return (
    <div className="interview-page">

      {/* Header */}
      <header className="interview-header">
        <button
          className="interview-back-button"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={19} />
          Dashboard
        </button>

        <div className="interview-brand">
          <Sparkles size={22} />
          CareerForgeAI
        </div>
      </header>

      <main className="interview-content">

        {/* Hero */}
        <section className="interview-hero">
          <div className="interview-hero-icon">
            <MessageSquare size={30} />
          </div>

          <span>INTERVIEW PREPARATION</span>

          <h1>Prepare. Practice. Succeed.</h1>

          <p>
            Improve your interview skills with structured
            practice sessions designed to help you prepare
            for your next opportunity.
          </p>
        </section>

        {/* Statistics */}
        <section className="interview-stats">

          <div className="interview-stat-card">
            <div className="interview-stat-icon purple">
              <Target size={22} />
            </div>

            <div>
              <h3>3</h3>
              <p>Practice Categories</p>
            </div>
          </div>

          <div className="interview-stat-card">
            <div className="interview-stat-icon blue">
              <Clock size={22} />
            </div>

            <div>
              <h3>10-20 min</h3>
              <p>Practice Duration</p>
            </div>
          </div>

          <div className="interview-stat-card">
            <div className="interview-stat-icon orange">
              <Trophy size={22} />
            </div>

            <div>
              <h3>Beginner</h3>
              <p>Learning Friendly</p>
            </div>
          </div>

        </section>

        {/* Categories */}
        <section className="interview-categories">

          <div className="interview-section-heading">
            <div>
              <h2>Choose Your Practice Area</h2>
              <p>
                Select a category to begin your interview preparation.
              </p>
            </div>
          </div>

          <div className="interview-category-grid">

            {interviewCategories.map((category) => {
              const Icon = category.icon;

              return (
                <div
                  className={`interview-category-card ${
                    selectedCategory === category.id
                      ? "selected"
                      : ""
                  }`}
                  key={category.id}
                >
                  <div className={`interview-category-icon ${category.color}`}>
                    <Icon size={27} />
                  </div>

                  <h3>{category.title}</h3>

                  <p>{category.description}</p>

                  <div className="interview-duration">
                    <Clock size={15} />
                    {category.duration}
                  </div>

                  <button
                    onClick={() => handleStart(category.id)}
                  >
                    Start Practice
                    <ChevronRight size={18} />
                  </button>
                </div>
              );
            })}

          </div>
        </section>

        {/* Selected Category Message */}
        {selectedCategory && (
          <section className="interview-selected-message">
            <Sparkles size={23} />

            <div>
              <h3>
                {interviewCategories.find(
                  (item) => item.id === selectedCategory
                )?.title} Selected!
              </h3>

              <p>
                Your practice area is selected.
                The question practice system will be connected next.
              </p>
            </div>
          </section>
        )}

        {/* Tips */}
        <section className="interview-tips">
          <h2>Interview Preparation Tips</h2>

          <div className="interview-tips-grid">
            <div>
              <Target size={22} />
              <h3>Understand Concepts</h3>
              <p>
                Focus on understanding concepts instead of
                memorizing answers.
              </p>
            </div>

            <div>
              <MessageSquare size={22} />
              <h3>Practice Speaking</h3>
              <p>
                Explain your answers clearly and confidently.
              </p>
            </div>

            <div>
              <Trophy size={22} />
              <h3>Stay Consistent</h3>
              <p>
                Practice regularly to improve your performance.
              </p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

export default InterviewPreparation;
