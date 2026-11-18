
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Search,
  Bookmark,
  MapPin,
  Clock,
  Building2,
  ExternalLink,
  X,
  SlidersHorizontal,
  RefreshCw,
  AlertCircle,
  GraduationCap,
  CalendarDays
} from "lucide-react";

import "./JobOpportunities.css";

const API_URL = "http://localhost:5000/api/jobs";
const SAVED_JOBS_KEY = "careerforge_saved_jobs";

// Normalize different API job type values into one standard value.
const normalizeJobType = (value) => {
  const type = String(value || "")
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .trim();

  if (!type) return "";

  if (type.includes("full")) return "full-time";
  if (type.includes("part") || type.includes("half")) return "part-time";
  if (type.includes("contract")) return "contract";
  if (type.includes("intern")) return "internship";
  if (type.includes("freelance")) return "freelance";
  if (type.includes("temporary") || type.includes("temp")) return "temporary";
  if (type.includes("permanent")) return "permanent";

  return type;
};

const JOB_TYPE_LABELS = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  internship: "Internship",
  freelance: "Freelance",
  temporary: "Temporary",
  permanent: "Permanent"
};

const getJobTypeLabel = (value) => {
  if (JOB_TYPE_LABELS[value]) {
    return JOB_TYPE_LABELS[value];
  }

  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getJobTypes = (type) => {
  if (Array.isArray(type)) {
    return type
      .flatMap((item) => String(item).split(","))
      .map(normalizeJobType)
      .filter(Boolean);
  }

  return String(type || "")
    .split(",")
    .map(normalizeJobType)
    .filter(Boolean);
};

const formatDate = (date) => {
  if (!date) return "Recently posted";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Recently posted";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};

const stripHtml = (html = "") => {
  return String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
};

function JobOpportunities() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedRegion, setSelectedRegion] = useState("All Jobs");

  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [showFresherOnly, setShowFresherOnly] = useState(false);

  const [selectedJob, setSelectedJob] = useState(null);

  const [savedJobs, setSavedJobs] = useState(() => {
    try {
      const saved = localStorage.getItem(SAVED_JOBS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Fetch jobs from backend.
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to fetch job listings. Please try again later.");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Unable to load jobs.");
      }

      const fresherJobIds = new Set(
        (data.fresherJobs || []).map((job) => String(job.id))
      );

      const formattedJobs = (data.jobs || []).map((job) => ({
        id: String(job.id),
        title: job.title || "Untitled Position",
        company: job.company || "Company Not Specified",
        companyLogo: job.companyLogo || "",
        location: job.location || "Location Not Specified",
        type: Array.isArray(job.type)
          ? job.type.join(", ")
          : job.type || "Not Specified",
        mode: job.mode || (
          /remote/i.test(job.location || "") ? "remote" : "onsite"
        ),
        category: Array.isArray(job.category)
          ? job.category.join(", ")
          : job.category || "General",
        experience: job.experience || "Not Specified",
        description: job.description || "No description available.",
        fullDescription: job.fullDescription || job.description || "",
        url: job.url || "",
        jobPageUrl: job.jobPageUrl || job.url || "",
        postedDate: job.postedDate || "",
        region: job.region || "International",
        source: job.source || "Jobicy",
        isFresher:
          job.isFresher === true || fresherJobIds.has(String(job.id))
      }));

      // Show India jobs first.
      formattedJobs.sort((a, b) => {
        if (a.region === "India" && b.region !== "India") return -1;
        if (a.region !== "India" && b.region === "India") return 1;
        return 0;
      });

      setJobs(formattedJobs);
    } catch (err) {
      setError(err.message || "Something went wrong while loading jobs.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Save bookmarks in localStorage.
  useEffect(() => {
    localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(savedJobs));
  }, [savedJobs]);

  // Category dropdown options.
  const categories = useMemo(() => {
    const allCategories = jobs.flatMap((job) =>
      job.category
        .split(",")
        .map((category) => category.trim())
        .filter(Boolean)
    );

    return [
      "All Categories",
      ...Array.from(new Set(allCategories)).sort((a, b) =>
        a.localeCompare(b)
      )
    ];
  }, [jobs]);

  // Job type dropdown options: unique normalized values only.
  const jobTypes = useMemo(() => {
    const uniqueTypes = new Set();

    jobs.forEach((job) => {
      getJobTypes(job.type).forEach((type) => {
        uniqueTypes.add(type);
      });
    });

    return [
      { value: "All Types", label: "All Types" },
      ...Array.from(uniqueTypes)
        .sort((a, b) => a.localeCompare(b))
        .map((type) => ({
          value: type,
          label: getJobTypeLabel(type)
        }))
    ];
  }, [jobs]);

  // Filter jobs.
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchText = searchTerm.toLowerCase().trim();

      const searchableText = [
        job.title,
        job.company,
        job.location,
        job.category,
        job.type,
        job.experience,
        job.description,
        job.region
      ]
        .map((value) => stripHtml(value).toLowerCase())
        .join(" ");

      const matchesSearch =
        !searchText || searchableText.includes(searchText);

      const matchesCategory =
        selectedCategory === "All Categories" ||
        job.category
          .split(",")
          .some((category) => category.trim() === selectedCategory);

      const matchesType =
        selectedType === "All Types" ||
        getJobTypes(job.type).includes(selectedType);

      const matchesRegion =
        selectedRegion === "All Jobs" ||
        job.region === selectedRegion;

      const matchesSaved =
        !showSavedOnly ||
        savedJobs.includes(job.id);

      const matchesFresher =
        !showFresherOnly ||
        job.isFresher;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesType &&
        matchesRegion &&
        matchesSaved &&
        matchesFresher
      );
    });
  }, [
    jobs,
    searchTerm,
    selectedCategory,
    selectedType,
    selectedRegion,
    showSavedOnly,
    showFresherOnly,
    savedJobs
  ]);

  const toggleSaveJob = (jobId) => {
    setSavedJobs((previous) => {
      if (previous.includes(jobId)) {
        return previous.filter((id) => id !== jobId);
      }

      return [...previous, jobId];
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All Categories");
    setSelectedType("All Types");
    setSelectedRegion("All Jobs");
    setShowSavedOnly(false);
    setShowFresherOnly(false);
  };

  const activeFilterCount = [
    searchTerm.trim() !== "",
    selectedCategory !== "All Categories",
    selectedType !== "All Types",
    selectedRegion !== "All Jobs",
    showSavedOnly,
    showFresherOnly
  ].filter(Boolean).length;

  const getTypeDisplay = (type) => {
    const types = getJobTypes(type);

    if (types.length === 0) {
      return type || "Not Specified";
    }

    return types.map(getJobTypeLabel).join(", ");
  };

  return (
    <div className="jobs-page">
      {/* Header */}
      <header className="jobs-header">
        <button
          className="jobs-back-button"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={18} />
          <span>Back to Dashboard</span>
        </button>

        <div className="jobs-header-actions">
          <button
            className={`saved-jobs-button ${showSavedOnly ? "active" : ""}`}
            onClick={() => setShowSavedOnly((previous) => !previous)}
          >
            <Bookmark size={17} />
            <span>Saved Jobs</span>
            <span className="saved-jobs-count">{savedJobs.length}</span>
          </button>
        </div>
      </header>

      <main className="jobs-content">
        {/* Hero */}
        <section className="jobs-hero">
          <div className="jobs-tag">
            <BriefcaseBusiness size={15} />
            CAREER OPPORTUNITIES
          </div>

          <h1>Find Your Next Opportunity</h1>

          <p>
            Explore job opportunities from companies around the world
            and take the next step in your career.
          </p>

          <div className="jobs-live-indicator">
            <span className="live-dot"></span>
            Live Job Listings
          </div>
        </section>

        {/* Search and Filters */}
        <section className="jobs-search-card">
          <div className="jobs-search-box">
            <Search size={20} />

            <input
              type="text"
              placeholder="Search job title, company, skills or location..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            {searchTerm && (
              <button
                className="search-clear-button"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                <X size={17} />
              </button>
            )}
          </div>

          <div className="jobs-filters">
            <div className="jobs-filter-item">
              <SlidersHorizontal size={16} />

              <select
                value={selectedRegion}
                onChange={(event) => setSelectedRegion(event.target.value)}
              >
                <option value="All Jobs">All Jobs</option>
                <option value="India">India</option>
                <option value="International">International</option>
              </select>
            </div>

            <div className="jobs-filter-item">
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="jobs-filter-item">
              <select
                value={selectedType}
                onChange={(event) => setSelectedType(event.target.value)}
              >
                {jobTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              className={`fresher-filter-button ${showFresherOnly ? "active" : ""}`}
              onClick={() => setShowFresherOnly((previous) => !previous)}
            >
              <GraduationCap size={16} />
              Fresher Friendly
            </button>

            <button
              className="jobs-clear-button"
              onClick={clearFilters}
              disabled={activeFilterCount === 0}
            >
              Clear Filters
            </button>

            <button
              className="jobs-refresh-button"
              onClick={fetchJobs}
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? "spin" : ""} />
              Refresh
            </button>
          </div>
        </section>

        {/* Results heading */}
        <section className="jobs-results-heading">
          <div>
            <h2>
              {showSavedOnly
                ? "Saved Jobs"
                : showFresherOnly
                  ? "Fresher Opportunities"
                  : "Explore Opportunities"}
            </h2>

            <p>
              {loading
                ? "Loading opportunities..."
                : `${filteredJobs.length} jobs found`}
            </p>
          </div>
        </section>

        {/* Error */}
        {error && !loading && (
          <div className="jobs-error-state">
            <AlertCircle size={24} />
            <h3>Unable to Load Jobs</h3>
            <p>{error}</p>
            <button onClick={fetchJobs}>Try Again</button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="jobs-loading-state">
            <RefreshCw className="spin" size={28} />
            <p>Finding opportunities for you...</p>
          </div>
        )}

        {/* Job cards */}
        {!loading && !error && filteredJobs.length > 0 && (
          <section className="jobs-grid">
            {filteredJobs.map((job) => {
              const isSaved = savedJobs.includes(job.id);

              return (
                <article className="job-card" key={job.id}>
                  <div className="job-card-header">
                    <div className="job-company-icon">
                      {job.companyLogo ? (
                        <img
                          src={job.companyLogo}
                          alt={`${job.company} logo`}
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <Building2 size={25} />
                      )}
                    </div>

                    <button
                      className={`job-save-button ${isSaved ? "saved" : ""}`}
                      onClick={() => toggleSaveJob(job.id)}
                      aria-label={isSaved ? "Remove saved job" : "Save job"}
                    >
                      <Bookmark size={19} fill={isSaved ? "currentColor" : "none"} />
                    </button>
                  </div>

                  <div className="job-details">
                    <div className="job-badges">
                      <span className="job-category">{job.category}</span>

                      {job.isFresher && (
                        <span className="job-fresher-badge">
                          Fresher Friendly
                        </span>
                      )}
                    </div>

                    <h3>{job.title}</h3>
                    <p className="job-company">{job.company}</p>

                    <div className="job-location">
                      <MapPin size={15} />
                      <span>{job.location}</span>
                    </div>

                    <div className="job-tags">
                      <span>
                        <BriefcaseBusiness size={14} />
                        {getTypeDisplay(job.type)}
                      </span>

                      <span>
                        <Clock size={14} />
                        {job.experience}
                      </span>
                    </div>

                    <p className="job-description">
                      {stripHtml(job.description).slice(0, 150)}
                      {stripHtml(job.description).length > 150 ? "..." : ""}
                    </p>
                  </div>

                  <div className="job-card-footer">
                    <div className="job-posted-date">
                      <CalendarDays size={14} />
                      {formatDate(job.postedDate)}
                    </div>

                    <button
                      className="job-view-button"
                      onClick={() => setSelectedJob(job)}
                    >
                      View Details
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {/* Empty state */}
        {!loading && !error && filteredJobs.length === 0 && (
          <div className="jobs-empty-state">
            <BriefcaseBusiness size={42} />

            <h3>
              {showSavedOnly
                ? "No Saved Jobs Yet"
                : "No Jobs Found"}
            </h3>

            <p>
              {showSavedOnly
                ? "Save jobs that interest you and find them here."
                : "Try changing your search or filters to explore more opportunities."}
            </p>

            <button onClick={clearFilters}>Clear Filters</button>
          </div>
        )}

        <div className="jobs-api-notice">
          <AlertCircle size={16} />
          <span>
            Job listings are collected from external job sources.
            Always verify eligibility, experience requirements and
            application details on the original job website.
          </span>
        </div>
      </main>

      {/* Job Details Modal */}
      {selectedJob && (
        <div
          className="job-modal-overlay"
          onClick={() => setSelectedJob(null)}
        >
          <div
            className="job-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="job-modal-close"
              onClick={() => setSelectedJob(null)}
              aria-label="Close job details"
            >
              <X size={21} />
            </button>

            <div className="job-modal-icon">
              {selectedJob.companyLogo ? (
                <img
                  src={selectedJob.companyLogo}
                  alt={`${selectedJob.company} logo`}
                />
              ) : (
                <Building2 size={30} />
              )}
            </div>

            <h2>{selectedJob.title}</h2>
            <p className="job-modal-company">{selectedJob.company}</p>

            <div className="job-modal-details">
              <span>
                <MapPin size={15} />
                {selectedJob.location}
              </span>

              <span>
                <BriefcaseBusiness size={15} />
                {getTypeDisplay(selectedJob.type)}
              </span>

              <span>
                <Clock size={15} />
                {selectedJob.experience}
              </span>

              <span>
                <CalendarDays size={15} />
                {formatDate(selectedJob.postedDate)}
              </span>
            </div>

            {selectedJob.isFresher && (
              <span className="job-fresher-badge modal-fresher-badge">
                Fresher Friendly
              </span>
            )}

            <div className="job-modal-section">
              <h3>Job Description</h3>
              <p>
                {stripHtml(
                  selectedJob.fullDescription ||
                  selectedJob.description
                ) || "No description available."}
              </p>
            </div>

            <div className="job-modal-section">
              <h3>Job Category</h3>
              <p>{selectedJob.category}</p>
            </div>

            <div className="job-modal-section">
              <h3>Source</h3>
              <p>{selectedJob.source}</p>
            </div>

            <div className="job-modal-notice">
              Please review the complete job requirements on the
              employer's website before applying.
            </div>

            <div className="job-modal-actions">
              <button
                className="job-modal-save"
                onClick={() => toggleSaveJob(selectedJob.id)}
              >
                <Bookmark
                  size={17}
                  fill={
                    savedJobs.includes(selectedJob.id)
                      ? "currentColor"
                      : "none"
                  }
                />
                {savedJobs.includes(selectedJob.id)
                  ? "Saved"
                  : "Save Job"}
              </button>

              {selectedJob.url ? (
                <a
                  className="job-modal-apply"
                  href={selectedJob.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Apply Now
                  <ExternalLink size={16} />
                </a>
              ) : (
                <button className="job-modal-apply" disabled>
                  Apply Link Unavailable
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobOpportunities;
