
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Sparkles, ArrowRight } from "lucide-react";
import "./Signup.css";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      alert("Account created successfully! Please login.");
      navigate("/login");

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-brand">
        <div className="signup-brand-icon">
          <Sparkles size={23} />
        </div>
        <span>CareerForgeAI</span>
      </div>

      <div className="signup-container">
        <div className="signup-heading">
          <div className="signup-badge">
            <Sparkles size={14} />
            AI-Powered Career Platform
          </div>

          <h1>Create Account</h1>
          <p>Start building your future with CareerForgeAI.</p>
        </div>

        <form className="signup-form" onSubmit={handleSignup}>
          <div className="signup-group">
            <label>Full Name</label>
            <div className="signup-input">
              <User size={19} />
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="signup-group">
            <label>Email Address</label>
            <div className="signup-input">
              <Mail size={19} />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="signup-group">
            <label>Password</label>
            <div className="signup-input">
              <Lock size={19} />
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
                required
              />
            </div>
          </div>

          <button type="submit" className="signup-button">
            Create Account
            <ArrowRight size={19} />
          </button>
        </form>

        <div className="signup-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>

      <p className="signup-copyright">
        © 2026 CareerForgeAI. All rights reserved.
      </p>
    </div>
  );
}

export default Signup;
