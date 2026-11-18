
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import {
  ArrowLeft,
  FileText,
  User,
  GraduationCap,
  Code,
  BriefcaseBusiness,
  Award,
  Plus,
  Trash2,
  Download,
  Sparkles,
  Eye,
  Pencil
} from "lucide-react";

import "./ResumeBuilder.css";

function ResumeBuilder() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    education: [
      { degree: "", institution: "", year: "", grade: "" }
    ],
    skills: "",
    projects: [
      { title: "", description: "", technologies: "" }
    ],
    certifications: ""
  });

  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEducationChange = (index, e) => {
    const updated = [...formData.education];
    updated[index][e.target.name] = e.target.value;

    setFormData({
      ...formData,
      education: updated
    });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        { degree: "", institution: "", year: "", grade: "" }
      ]
    });
  };

  const removeEducation = (index) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_, i) => i !== index)
    });
  };

  const handleProjectChange = (index, e) => {
    const updated = [...formData.projects];
    updated[index][e.target.name] = e.target.value;

    setFormData({
      ...formData,
      projects: updated
    });
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [
        ...formData.projects,
        { title: "", description: "", technologies: "" }
      ]
    });
  };

  const removeProject = (index) => {
    setFormData({
      ...formData,
      projects: formData.projects.filter((_, i) => i !== index)
    });
  };

  // Generate Resume Preview
  const handleGenerate = (e) => {
    e.preventDefault();
    setShowPreview(true);

    setTimeout(() => {
      document.getElementById("resume-preview")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 100);
  };

  // Download Resume PDF
  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    const pageWidth = 210;
    const margin = 18;
    const contentWidth = pageWidth - margin * 2;
    let y = 20;

    const addText = (text, size = 10, bold = false) => {
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setFontSize(size);

      const lines = doc.splitTextToSize(
        String(text || ""),
        contentWidth
      );

      if (y + lines.length * (size * 0.45) > 280) {
        doc.addPage();
        y = 20;
      }

      doc.text(lines, margin, y);
      y += lines.length * (size * 0.45) + 3;
    };

    const addHeading = (heading) => {
      y += 3;
      doc.setDrawColor(99, 91, 219);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 7;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(75, 68, 175);
      doc.text(heading.toUpperCase(), margin, y);

      y += 7;
      doc.setTextColor(35, 40, 55);
    };

    // Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(23);
    doc.setTextColor(55, 55, 100);

    const nameLines = doc.splitTextToSize(
      formData.name || "Your Name",
      contentWidth
    );

    doc.text(nameLines, margin, y);
    y += nameLines.length * 10;

    // Contact
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(90, 100, 115);

    const contact = [
      formData.email,
      formData.phone,
      formData.location
    ].filter(Boolean).join(" | ");

    const contactLines = doc.splitTextToSize(
      contact,
      contentWidth
    );

    if (contactLines.length) {
      doc.text(contactLines, margin, y);
      y += contactLines.length * 5 + 3;
    }

    // Summary
    if (formData.summary.trim()) {
      addHeading("Professional Summary");
      addText(formData.summary);
    }

    // Education
    if (formData.education.length) {
      addHeading("Education");

      formData.education.forEach((item) => {
        if (item.degree || item.institution) {
          addText(item.degree, 10, true);

          addText(
            [
              item.institution,
              item.year,
              item.grade
            ].filter(Boolean).join(" | "),
            9
          );
        }
      });
    }

    // Skills
    if (formData.skills.trim()) {
      addHeading("Technical Skills");
      addText(formData.skills);
    }

    // Projects
    if (formData.projects.length) {
      addHeading("Projects");

      formData.projects.forEach((project) => {
        if (project.title || project.description) {
          addText(project.title, 10, true);

          if (project.description) {
            addText(project.description, 9);
          }

          if (project.technologies) {
            addText(
              `Technologies: ${project.technologies}`,
              9
            );
          }
        }
      });
    }

    // Certifications
    if (formData.certifications.trim()) {
      addHeading("Certifications");
      addText(formData.certifications);
    }

    const safeName = (formData.name || "Resume")
      .trim()
      .replace(/[^a-z0-9_-]/gi, "_");

    doc.save(`${safeName}_Resume.pdf`);
  };

  const skillsList = formData.skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  return (
    <div className="resume-builder-page">

      <header className="resume-header">
        <button
          className="resume-back-button"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={19} />
          Dashboard
        </button>

        <div className="resume-brand">
          <Sparkles size={22} />
          CareerForgeAI
        </div>
      </header>

      <main className="resume-content">

        <section className="resume-hero">
          <div className="resume-hero-icon">
            <FileText size={30} />
          </div>

          <span>PROFESSIONAL RESUME BUILDER</span>

          <h1>Build Your Professional Resume</h1>

          <p>
            Create your professional resume and download it
            in PDF format.
          </p>
        </section>

        <form onSubmit={handleGenerate} className="resume-form">

          {/* Personal Information */}
          <section className="resume-section">
            <div className="resume-section-heading">
              <User size={21} />
              <div>
                <h2>Personal Information</h2>
                <p>Enter your basic contact details.</p>
              </div>
            </div>

            <div className="resume-form-grid">
              <div className="resume-field">
                <label>Full Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="resume-field">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="resume-field">
                <label>Phone Number</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="resume-field">
                <label>Location</label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, State"
                />
              </div>
            </div>

            <div className="resume-field">
              <label>Professional Summary</label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                placeholder="Write a short professional introduction..."
                rows="4"
              />
            </div>
          </section>

          {/* Education */}
          <section className="resume-section">
            <div className="resume-section-heading">
              <GraduationCap size={21} />
              <div>
                <h2>Education</h2>
                <p>Add your academic qualifications.</p>
              </div>
            </div>

            {formData.education.map((education, index) => (
              <div className="resume-repeat-card" key={index}>
                {formData.education.length > 1 && (
                  <button
                    type="button"
                    className="resume-remove-button"
                    onClick={() => removeEducation(index)}
                  >
                    <Trash2 size={17} />
                  </button>
                )}

                <div className="resume-form-grid">
                  <div className="resume-field">
                    <label>Degree / Qualification</label>
                    <input
                      name="degree"
                      value={education.degree}
                      onChange={(e) => handleEducationChange(index, e)}
                      placeholder="B.Tech Computer Science"
                      required
                    />
                  </div>

                  <div className="resume-field">
                    <label>Institution</label>
                    <input
                      name="institution"
                      value={education.institution}
                      onChange={(e) => handleEducationChange(index, e)}
                      placeholder="College / University"
                      required
                    />
                  </div>

                  <div className="resume-field">
                    <label>Passing Year</label>
                    <input
                      name="year"
                      value={education.year}
                      onChange={(e) => handleEducationChange(index, e)}
                      placeholder="2027"
                    />
                  </div>

                  <div className="resume-field">
                    <label>CGPA / Percentage</label>
                    <input
                      name="grade"
                      value={education.grade}
                      onChange={(e) => handleEducationChange(index, e)}
                      placeholder="8.4 CGPA"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="resume-add-button"
              onClick={addEducation}
            >
              <Plus size={17} />
              Add Education
            </button>
          </section>

          {/* Skills */}
          <section className="resume-section">
            <div className="resume-section-heading">
              <Code size={21} />
              <div>
                <h2>Technical Skills</h2>
                <p>List your technical and professional skills.</p>
              </div>
            </div>

            <div className="resume-field">
              <label>Skills</label>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Python, SQL, JavaScript, React.js..."
                rows="3"
                required
              />
            </div>
          </section>

          {/* Projects */}
          <section className="resume-section">
            <div className="resume-section-heading">
              <BriefcaseBusiness size={21} />
              <div>
                <h2>Projects</h2>
                <p>Showcase your practical work and projects.</p>
              </div>
            </div>

            {formData.projects.map((project, index) => (
              <div className="resume-repeat-card" key={index}>
                {formData.projects.length > 1 && (
                  <button
                    type="button"
                    className="resume-remove-button"
                    onClick={() => removeProject(index)}
                  >
                    <Trash2 size={17} />
                  </button>
                )}

                <div className="resume-field">
                  <label>Project Title</label>
                  <input
                    name="title"
                    value={project.title}
                    onChange={(e) => handleProjectChange(index, e)}
                    placeholder="Enter project name"
                    required
                  />
                </div>

                <div className="resume-field">
                  <label>Project Description</label>
                  <textarea
                    name="description"
                    value={project.description}
                    onChange={(e) => handleProjectChange(index, e)}
                    placeholder="Describe your project and its features..."
                    rows="3"
                    required
                  />
                </div>

                <div className="resume-field">
                  <label>Technologies Used</label>
                  <input
                    name="technologies"
                    value={project.technologies}
                    onChange={(e) => handleProjectChange(index, e)}
                    placeholder="Python, React, SQL..."
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              className="resume-add-button"
              onClick={addProject}
            >
              <Plus size={17} />
              Add Project
            </button>
          </section>

          {/* Certifications */}
          <section className="resume-section">
            <div className="resume-section-heading">
              <Award size={21} />
              <div>
                <h2>Certifications</h2>
                <p>Add your professional certifications.</p>
              </div>
            </div>

            <div className="resume-field">
              <label>Certifications</label>
              <textarea
                name="certifications"
                value={formData.certifications}
                onChange={handleChange}
                placeholder="Deloitte Data Analytics, Cisco Certification..."
                rows="3"
              />
            </div>
          </section>

          <button
            type="submit"
            className="resume-generate-button"
          >
            <Eye size={19} />
            Generate Resume Preview
            <ArrowRightIcon />
          </button>

        </form>

        {/* Resume Preview */}
        {showPreview && (
          <section className="resume-preview-section" id="resume-preview">

            <div className="resume-preview-heading">
              <div>
                <span>YOUR RESUME</span>
                <h2>Resume Preview</h2>
              </div>

              <div className="resume-preview-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowPreview(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <Pencil size={17} />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={downloadPDF}
                >
                  <Download size={17} />
                  Download PDF
                </button>
              </div>
            </div>

            <div className="resume-paper">

              <div className="preview-personal">
                <h1>{formData.name}</h1>

                <p>
                  {[
                    formData.email,
                    formData.phone,
                    formData.location
                  ].filter(Boolean).join(" | ")}
                </p>
              </div>

              {formData.summary && (
                <div className="preview-section">
                  <h2>PROFESSIONAL SUMMARY</h2>
                  <p>{formData.summary}</p>
                </div>
              )}

              <div className="preview-section">
                <h2>EDUCATION</h2>

                {formData.education.map((item, index) => (
                  <div key={index} className="preview-item">
                    <h3>{item.degree}</h3>
                    <p>
                      {[
                        item.institution,
                        item.year,
                        item.grade
                      ].filter(Boolean).join(" | ")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="preview-section">
                <h2>TECHNICAL SKILLS</h2>

                <div className="preview-skills">
                  {skillsList.map((skill, index) => (
                    <span key={index}>{skill}</span>
                  ))}
                </div>
              </div>

              <div className="preview-section">
                <h2>PROJECTS</h2>

                {formData.projects.map((project, index) => (
                  <div key={index} className="preview-item">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>

                    {project.technologies && (
                      <p>
                        <strong>Technologies:</strong>{" "}
                        {project.technologies}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {formData.certifications && (
                <div className="preview-section">
                  <h2>CERTIFICATIONS</h2>
                  <p>{formData.certifications}</p>
                </div>
              )}

            </div>

            <button
              className="resume-generate-button"
              onClick={downloadPDF}
              type="button"
            >
              <Download size={19} />
              Download My Resume
            </button>

          </section>
        )}

      </main>
    </div>
  );
}

function ArrowRightIcon() {
  return <Download size={19} />;
}

export default ResumeBuilder;
