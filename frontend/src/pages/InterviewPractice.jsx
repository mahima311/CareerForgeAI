
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw,
  ChevronRight,
  Clock,
  Sparkles,
  Brain,
  Star,
  Lightbulb,
  Target,
  BookOpen,
  RefreshCw
} from "lucide-react";

import interviewQuestions from "../data/interviewQuestions";
import "./InterviewPractice.css";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

function InterviewPractice() {
  const navigate = useNavigate();
  const location = useLocation();

  const category = location.state?.category || "technical";
  const questions = interviewQuestions[category] || interviewQuestions.technical;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [evaluationError, setEvaluationError] = useState("");

  const question = questions[currentQuestion];

  const categoryTitle = {
    technical: "Technical Interview",
    hr: "HR Interview",
    aptitude: "Aptitude Interview"
  };

  const isSubjective = question.type === "subjective";

  const handleSubmit = async () => {
    if (
      isSubjective
        ? !userAnswer.trim() || evaluating
        : selectedAnswer === null
    ) {
      return;
    }

    // AI evaluation for subjective answers
    if (isSubjective) {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      if (!API_URL) {
        setEvaluationError("API URL is not configured. Please try again later.");
        return;
      }

      setEvaluating(true);
      setEvaluationError("");

      try {
        const response = await fetch(
          `${API_URL}/api/career/evaluate-interview`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              question: question.question,
              answer: userAnswer,
              category
            })
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to evaluate your answer."
          );
        }

        if (!data.evaluation) {
          throw new Error("Invalid evaluation received from AI.");
        }

        setEvaluation(data.evaluation);
        setSubmitted(true);

      } catch (error) {
        setEvaluationError(
          error.message || "Unable to connect to AI evaluator."
        );
      } finally {
        setEvaluating(false);
      }

      return;
    }

    // Existing MCQ scoring
    if (selectedAnswer === question.correctAnswer) {
      setScore((previous) => previous + 1);
    }

    setSubmitted(true);
  };

  const handleNext = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion((previous) => previous + 1);
      setSelectedAnswer(null);
      setUserAnswer("");
      setSubmitted(false);
      setEvaluation(null);
      setEvaluationError("");
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setUserAnswer("");
    setSubmitted(false);
    setScore(0);
    setCompleted(false);
    setEvaluation(null);
    setEvaluationError("");
  };

  const percentage = Math.round(
    ((currentQuestion + (submitted ? 1 : 0)) / questions.length) * 100
  );

  return (
    <div className="practice-page">
      <header className="practice-header">
        <button onClick={() => navigate("/interview")}>
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="practice-brand">
          <Sparkles size={21} />
          CareerForgeAI
        </div>
      </header>

      <main className="practice-content">
        {!completed ? (
          <>
            <section className="practice-heading">
              <span>INTERVIEW PRACTICE</span>
              <h1>{categoryTitle[category]}</h1>
              <p>
                Read each question carefully and submit your answer.
              </p>
            </section>

            <section className="practice-progress-card">
              <div className="practice-progress-info">
                <span>
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span>{percentage}% Completed</span>
              </div>

              <div className="practice-progress-track">
                <div
                  className="practice-progress-fill"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </section>

            <section className="practice-question-card">
              <div className="practice-question-number">
                <span>QUESTION {currentQuestion + 1}</span>
                <span>
                  <Clock size={15} />
                  Practice
                </span>
              </div>

              <h2>{question.question}</h2>

              {isSubjective ? (
                <textarea
                  className="practice-answer-textarea"
                  placeholder="Write your answer here..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  disabled={submitted || evaluating}
                />
              ) : (
                <div className="practice-options">
                  {question.options.map((option, index) => {
                    let optionClass = "";

                    if (submitted && index === question.correctAnswer) {
                      optionClass = "correct";
                    } else if (
                      submitted &&
                      index === selectedAnswer &&
                      selectedAnswer !== question.correctAnswer
                    ) {
                      optionClass = "incorrect";
                    } else if (selectedAnswer === index) {
                      optionClass = "selected";
                    }

                    return (
                      <button
                        key={index}
                        className={`practice-option ${optionClass}`}
                        onClick={() => setSelectedAnswer(index)}
                        disabled={submitted}
                      >
                        <span className="practice-option-letter">
                          {String.fromCharCode(65 + index)}
                        </span>

                        {option}

                        {submitted && index === question.correctAnswer && (
                          <CheckCircle size={19} />
                        )}

                        {submitted &&
                          index === selectedAnswer &&
                          selectedAnswer !== question.correctAnswer && (
                            <XCircle size={19} />
                          )}
                      </button>
                    );
                  })}
                </div>
              )}

              {evaluationError && (
                <div className="practice-ai-error">
                  <p>{evaluationError}</p>
                  <p>
                    Your answer is still available. You can try evaluating it again.
                  </p>
                </div>
              )}

              {submitted && isSubjective && evaluation && (
                <div className="practice-ai-evaluation">
                  <div className="practice-ai-title">
                    <Sparkles size={20} />
                    <h3>AI Interview Evaluation</h3>
                  </div>

                  <div className="practice-ai-score">
                    <div className="practice-ai-score-icon">
                      <Trophy size={27} />
                    </div>

                    <div>
                      <strong>{evaluation.score}/10</strong>
                      <span>{evaluation.rating}</span>
                    </div>
                  </div>

                  <div className="practice-ai-feedback">
                    <h4>
                      <CheckCircle size={18} />
                      Strengths
                    </h4>

                    {evaluation.strengths.map((item, index) => (
                      <p key={index}>• {item}</p>
                    ))}
                  </div>

                  <div className="practice-ai-feedback">
                    <h4>
                      <Target size={18} />
                      Areas to Improve
                    </h4>

                    {evaluation.improvements.map((item, index) => (
                      <p key={index}>• {item}</p>
                    ))}
                  </div>

                  {evaluation.missingPoints?.length > 0 && (
                    <div className="practice-ai-feedback">
                      <h4>
                        <Lightbulb size={18} />
                        Missing Important Points
                      </h4>

                      {evaluation.missingPoints.map((item, index) => (
                        <p key={index}>• {item}</p>
                      ))}
                    </div>
                  )}

                  <div className="practice-ai-better-answer">
                    <h4>
                      <BookOpen size={18} />
                      Improved Sample Answer
                    </h4>

                    <p>{evaluation.betterAnswer}</p>
                  </div>

                  <div className="practice-ai-overall">
                    <Star size={18} />
                    <div>
                      <strong>Overall Feedback</strong>
                      <p>{evaluation.overallFeedback}</p>
                    </div>
                  </div>
                </div>
              )}

              {submitted && !isSubjective && (
                <div className="practice-feedback">
                  <h3>
                    {selectedAnswer === question.correctAnswer
                      ? "Correct Answer!"
                      : "Incorrect Answer"}
                  </h3>

                  <p>{question.explanation}</p>
                </div>
              )}

              {!submitted ? (
                <button
                  className="practice-submit-button"
                  onClick={handleSubmit}
                  disabled={
                    evaluating ||
                    (isSubjective
                      ? !userAnswer.trim()
                      : selectedAnswer === null)
                  }
                >
                  {evaluating ? (
                    <>
                      <RefreshCw
                        size={18}
                        className="practice-spin"
                      />
                      AI Evaluating Your Answer...
                    </>
                  ) : (
                    <>
                      {isSubjective ? "Evaluate My Answer" : "Submit Answer"}
                      {isSubjective && <Sparkles size={18} />}
                      {!isSubjective && <ChevronRight size={18} />}
                    </>
                  )}
                </button>
              ) : (
                <button
                  className="practice-submit-button"
                  onClick={handleNext}
                >
                  {currentQuestion + 1 === questions.length
                    ? "View Results"
                    : "Next Question"}
                  <ChevronRight size={18} />
                </button>
              )}
            </section>
          </>
        ) : (
          <section className="practice-result-card">
            <div className="practice-result-icon">
              <Trophy size={38} />
            </div>

            <span>PRACTICE COMPLETED</span>
            <h1>Well Done!</h1>

            <p>
              You have completed your {categoryTitle[category]} session.
            </p>

            <div className="practice-result-score">
              <h2>
                {score}/
                {questions.filter(
                  (item) => item.type !== "subjective"
                ).length}
              </h2>
              <p>Correct Answers</p>
            </div>

            <p className="practice-result-note">
              Subjective answers are AI-evaluated separately and are not
              included in the MCQ score.
            </p>

            <button onClick={handleRestart}>
              <RotateCcw size={18} />
              Practice Again
            </button>

            <button
              className="practice-back-button"
              onClick={() => navigate("/interview")}
            >
              Back to Categories
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

export default InterviewPractice;
