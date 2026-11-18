
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, GraduationCap, Code, Heart, ArrowLeft, Save } from "lucide-react";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    qualification: "",
    skills: "",
    interests: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to fetch profile");
        }

        setFormData({
          name: data.user.name || "",
          email: data.user.email || "",
          qualification: data.user.qualification || "",
          skills: (data.user.skills || []).join(", "),
          interests: (data.user.interests || []).join(", ")
        });

      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      setMessage("");

      const response = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          qualification: formData.qualification,
          skills: formData.skills.split(",").map(item => item.trim()).filter(Boolean),
          interests: formData.interests.split(",").map(item => item.trim()).filter(Boolean)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Profile update failed");
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      setMessage("Profile updated successfully!");

    } catch (error) {
      setMessage(error.message);
    }
  };

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-topbar">
        <Link to="/dashboard" className="profile-back">
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>
        <h2>CareerForgeAI</h2>
      </div>

      <div className="profile-container">
        <div className="profile-heading">
          <div className="profile-avatar">
            {formData.name.charAt(0).toUpperCase() || "U"}
          </div>
          <h1>My Profile</h1>
          <p>Manage your personal and career information.</p>
        </div>

        <form className="profile-form" onSubmit={handleUpdate}>
          <div className="profile-field">
            <label><User size={17} /> Full Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="profile-field">
            <label><Mail size={17} /> Email Address</label>
            <input
              type="email"
              value={formData.email}
              disabled
            />
          </div>

          <div className="profile-field">
            <label><GraduationCap size={17} /> Qualification</label>
            <input
              name="qualification"
              placeholder="e.g. B.Tech Computer Science"
              value={formData.qualification}
              onChange={handleChange}
            />
          </div>

          <div className="profile-field">
            <label><Code size={17} /> Skills</label>
            <textarea
              name="skills"
              placeholder="Python, SQL, React.js"
              value={formData.skills}
              onChange={handleChange}
              rows={3}
            />
            <small>Separate skills using commas.</small>
          </div>

          <div className="profile-field">
            <label><Heart size={17} /> Career Interests</label>
            <textarea
              name="interests"
              placeholder="Software Development, Data Analytics"
              value={formData.interests}
              onChange={handleChange}
              rows={3}
            />
            <small>Separate interests using commas.</small>
          </div>

          {message && (
            <div className="profile-message">{message}</div>
          )}

          <button type="submit" className="profile-save">
            <Save size={18} /> Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
