
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import "./Login.css";

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login successful!");
      navigate("/dashboard");

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-brand">
        <div className="brand-icon">
          <Sparkles size={23} />
        </div>
        <span>CareerForgeAI</span>
      </div>

      <div className="auth-container">

        <div className="auth-heading">
          <div className="welcome-badge">
            <Sparkles size={14} />
            AI-Powered Career Platform
          </div>

          <h1>Welcome Back!</h1>

          <p>
            Sign in to continue your journey towards
            a successful career.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>

          <div className="form-group">
            <label>Email Address</label>

            <div className="input-wrapper">
              <Mail size={19} />

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>

            <div className="input-wrapper">
              <Lock size={19} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="auth-options">
            <label className="remember-option">
              <input type="checkbox" />
              Remember me
            </label>

            <a href="#forgot-password">
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="auth-button">
            Sign In
            <ArrowRight size={19} />
          </button>

        </form>

        <div className="auth-footer">
          Don't have an account?
          {" "}
          <Link to="/signup">Create Account</Link>
        </div>

      </div>

      <p className="auth-copyright">
        © 2026 CareerForgeAI. All rights reserved.
      </p>

    </div>
  );
}

export default Login;
