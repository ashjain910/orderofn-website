import { useState } from "react";
import {
  FaShareAlt,
  FaRegBookmark,
  FaBookmark,
  FaLocationArrow,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const longDescription = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc ut laoreet dictum, enim erat dictum erat, nec dictum enim erat nec enim. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam euismod, nunc ut laoreet dictum, enim erat dictum erat, nec dictum enim erat nec enim. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam euismod, nunc ut laoreet dictum, enim erat dictum erat, nec dictum enim erat nec enim. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam euismod, nunc ut laoreet dictum, enim erat dictum erat, nec dictum enim erat nec enim. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam euismod, nunc ut laoreet dictum, enim erat dictum erat, nec dictum enim erat nec enim. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam euismod, nunc ut laoreet dictum, enim erat dictum erat, nec dictum enim erat nec enim. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam euismod, nunc ut laoreet dictum, enim erat dictum erat, nec dictum enim erat nec enim. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.`;

const initialJobsData = [
  // All Jobs
  {
    id: 1,
    title: "Math Teacher",
    datePosted: "2025-11-20",
    location: "New York, NY",
    badge: "Remote",
    description: longDescription,
    status: "all",
    job_status: "active",
    avatar: "/tic/school_image.png",
  },
  {
    id: 2,
    title: "History Teacher",
    datePosted: "2025-11-19",
    location: "Chicago, IL",
    badge: "Casual",
    description: "Teach history classes for middle school students.",
    status: "all",
    job_status: "expired",
    avatar: "/tic/school_image.png",
  },
  {
    id: 3,
    title: "Biology Teacher",
    datePosted: "2025-11-18",
    location: "Houston, TX",
    badge: "Full-time",
    description: "Full-time biology teacher for high school.",
    status: "all",
    job_status: "active",
    avatar: "/tic/school_image.png",
  },
  {
    id: 4,
    title: "Chemistry Tutor",
    datePosted: "2025-11-17",
    location: "Remote",
    badge: "Remote",
    description: "Online chemistry tutoring for college students.",
    status: "all",
    job_status: "expired",
    avatar: "/tic/school_image.png",
  },
  {
    id: 5,
    title: "Physics Lecturer",
    datePosted: "2025-11-16",
    location: "Boston, MA",
    badge: "Remote",
    description: "Remote physics lectures for college students.",
    status: "all",
    job_status: "active",
    avatar: "/tic/school_image.png",
  },
  {
    id: 6,
    title: "Geography Teacher",
    datePosted: "2025-11-15",
    location: "San Diego, CA",
    badge: "Casual",
    description: "Casual geography teacher for weekend classes.",
    status: "all",
    job_status: "expired",
    avatar: "/tic/school_image.png",
  },
  {
    id: 7,
    title: "Art Instructor",
    datePosted: "2025-11-14",
    location: "Miami, FL",
    badge: "Part-time",
    description: "Part-time art instructor for summer camp.",
    status: "all",
    job_status: "active",
    avatar: "/tic/school_image.png",
  },
  {
    id: 8,
    title: "Music Teacher",
    datePosted: "2025-11-13",
    location: "Seattle, WA",
    badge: "Full-time",
    description: "Full-time music teacher for elementary school.",
    status: "all",
    job_status: "expired",
    avatar: "/tic/school_image.png",
  },
  {
    id: 9,
    title: "Physical Education Coach",
    datePosted: "2025-11-12",
    location: "Denver, CO",
    badge: "Casual",
    description: "Casual PE coach for after-school program.",
    status: "all",
    job_status: "active",
    avatar: "/tic/school_image.png",
  },
  {
    id: 10,
    title: "Computer Science Teacher",
    datePosted: "2025-11-11",
    location: "Austin, TX",
    badge: "Remote",
    description: "Remote computer science teacher for coding bootcamp.",
    status: "all",
    job_status: "expired",
    avatar: "/tic/school_image.png",
  },
  // Saved Jobs
  {
    id: 11,
    title: "Science Instructor",
    datePosted: "2025-11-18",
    location: "San Francisco, CA",
    badge: "Casual",
    description: "Part-time science instructor for weekend workshops.",
    status: "saved",
    job_status: "active",
    avatar: "/tic/school_image.png",
  },
  {
    id: 12,
    title: "Math Tutor",
    datePosted: "2025-11-17",
    location: "Remote",
    badge: "Remote",
    description: "Remote math tutoring for high school students.",
    status: "saved",
    job_status: "expired",
    avatar: "/tic/school_image.png",
  },
  {
    id: 13,
    title: "English Teacher",
    datePosted: "2025-11-16",
    location: "Chicago, IL",
    badge: "Full-time",
    description: "Full-time English teacher for middle school.",
    status: "saved",
    job_status: "active",
    avatar: "/tic/school_image.png",
  },
  {
    id: 14,
    title: "History Tutor",
    datePosted: "2025-11-15",
    location: "Remote",
    badge: "Remote",
    description: "Online history tutoring for college students.",
    status: "saved",
    job_status: "expired",
    avatar: "/tic/school_image.png",
  },
  {
    id: 15,
    title: "Physics Instructor",
    datePosted: "2025-11-14",
    location: "Boston, MA",
    badge: "Casual",
    description: "Casual physics instructor for weekend classes.",
    status: "saved",
    job_status: "active",
    avatar: "/tic/school_image.png",
  },
  {
    id: 16,
    title: "Chemistry Teacher",
    datePosted: "2025-11-13",
    location: "Houston, TX",
    badge: "Full-time",
    description: "Full-time chemistry teacher for high school.",
    status: "saved",
    job_status: "expired",
    avatar: "/tic/school_image.png",
  },
  {
    id: 17,
    title: "Art Tutor",
    datePosted: "2025-11-12",
    location: "Miami, FL",
    badge: "Part-time",
    description: "Part-time art tutor for summer camp.",
    status: "saved",
    job_status: "active",
    avatar: "/tic/school_image.png",
  },
  {
    id: 18,
    title: "Music Instructor",
    datePosted: "2025-11-11",
    location: "Seattle, WA",
    badge: "Full-time",
    description: "Full-time music instructor for elementary school.",
    status: "saved",
    job_status: "expired",
    avatar: "/tic/school_image.png",
  },
  {
    id: 19,
    title: "PE Coach",
    datePosted: "2025-11-10",
    location: "Denver, CO",
    badge: "Casual",
    description: "Casual PE coach for after-school program.",
    status: "saved",
    job_status: "active",
    avatar: "/tic/school_image.png",
  },
  {
    id: 20,
    title: "Computer Science Tutor",
    datePosted: "2025-11-09",
    location: "Austin, TX",
    badge: "Remote",
    description: "Remote computer science tutor for coding bootcamp.",
    status: "saved",
    job_status: "expired",
    avatar: "/tic/school_image.png",
  },
  // Applied Jobs
  {
    id: 21,
    title: "English Tutor",
    datePosted: "2025-11-15",
    location: "Remote",
    badge: "Remote",
    description: "Online English tutoring for international students.",
    status: "applied",
    job_status: "active",
    avatar: "/tic/school_image.png",
  },
  {
    id: 22,
    title: "Math Instructor",
    datePosted: "2025-11-14",
    location: "New York, NY",
    badge: "Full-time",
    description: "Full-time math instructor for high school.",
    status: "applied",
    job_status: "expired",
    avatar: "/tic/school_image.png",
  },
  {
    id: 23,
    title: "Science Teacher",
    datePosted: "2025-11-13",
    location: "San Francisco, CA",
    badge: "Casual",
    description: "Casual science teacher for weekend workshops.",
    status: "applied",
    job_status: "active",
    avatar: "/tic/school_image.png",
  },
  {
    id: 24,
    title: "History Instructor",
    datePosted: "2025-11-12",
    location: "Chicago, IL",
    badge: "Remote",
    description: "Remote history instructor for college students.",
    status: "applied",
    job_status: "expired",
    avatar: "/tic/school_image.png",
  },
  {
    id: 25,
    title: "Physics Tutor",
    datePosted: "2025-11-11",
    location: "Boston, MA",
    badge: "Casual",
    description: "Casual physics tutor for weekend classes.",
    status: "applied",
    job_status: "active",
    avatar: "/tic/school_image.png",
  },
  {
    id: 26,
    title: "Chemistry Instructor",
    datePosted: "2025-11-10",
    location: "Houston, TX",
    badge: "Full-time",
    description: "Full-time chemistry instructor for high school.",
    status: "applied",
    job_status: "expired",
    avatar: "/tic/school_image.png",
  },
  {
    id: 27,
    title: "Art Teacher",
    datePosted: "2025-11-09",
    location: "Miami, FL",
    badge: "Part-time",
    description: "Part-time art teacher for summer camp.",
    status: "applied",
    job_status: "active",
    avatar: "/tic/school_image.png",
  },
  {
    id: 28,
    title: "Music Tutor",
    datePosted: "2025-11-08",
    location: "Seattle, WA",
    badge: "Full-time",
    description: "Full-time music tutor for elementary school.",
    status: "applied",
    job_status: "expired",
    avatar: "/tic/school_image.png",
  },
  {
    id: 29,
    title: "PE Instructor",
    datePosted: "2025-11-07",
    location: "Denver, CO",
    badge: "Casual",
    description: "Casual PE instructor for after-school program.",
    status: "applied",
    job_status: "active",
    avatar: "/tic/school_image.png",
  },
  {
    id: 30,
    title: "Computer Science Teacher",
    datePosted: "2025-11-06",
    location: "Austin, TX",
    badge: "Remote",
    description: "Remote computer science teacher for coding bootcamp.",
    status: "applied",
    job_status: "expired",
    avatar: "/tic/school_image.png",
  },
];

const statusTabs = [
  { key: "all", label: "All Jobs" },
  { key: "saved", label: "Saved Jobs" },
  { key: "applied", label: "Applied Jobs" },
];

const JOBS_PER_PAGE = 6;

const jobTypes = ["Remote", "Casual", "Full-time", "Part-time"];
const schoolTypes = ["Public", "Private", "Charter", "International"];
const genders = ["Any", "Male", "Female", "Other"];

// Icons for each tab
const tabIcons = {
  all: <FaRegBookmark />,
  saved: <FaBookmark />,
  applied: <FaShareAlt />,
};

function Jobs() {
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [savingJobId, setSavingJobId] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(true);

  // Filter states
  const [filterTitle, setFilterTitle] = useState("");
  const [filterJobType, setFilterJobType] = useState("");
  const [filterSchoolType, setFilterSchoolType] = useState("");
  const [filterGender, setFilterGender] = useState("");

  // Jobs data state (for API updates)
  const [jobsData, setJobsData] = useState(initialJobsData);

  const navigate = useNavigate();

  // Filter jobs based on active tab
  let filteredJobs =
    activeTab === "all"
      ? jobsData
      : jobsData.filter((job) => job.status === activeTab);

  // Apply filters
  filteredJobs = filteredJobs.filter((job) => {
    let match = true;
    if (
      filterTitle &&
      !job.title.toLowerCase().includes(filterTitle.toLowerCase())
    )
      match = false;
    if (filterJobType && job.badge !== filterJobType) match = false;
    // schoolType and gender are not in jobsData, so just placeholders for now
    // if (filterSchoolType && job.schoolType !== filterSchoolType) match = false;
    // if (filterGender && job.gender !== filterGender) match = false;
    return match;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const paginatedJobs = filteredJobs.slice(
    (page - 1) * JOBS_PER_PAGE,
    page * JOBS_PER_PAGE
  );

  // Handle tab change: reset to page 1
  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
    setPage(1);
  };

  // Lazy load and call saveJob
  const handleSaveJob = async (jobId: number) => {
    setSavingJobId(jobId);
    try {
      const jobService = await import("../../services/jobService");
      const response = await jobService.saveJob(jobId);
      if (!response.ok) throw new Error("Failed to save job");
    } catch (error) {
      console.error(error);
    } finally {
      setSavingJobId(null);
    }
  };

  // API call to send filters and update jobs data
  const sendFiltersToApi = async (filters: any) => {
    try {
      const response = await fetch("/api/filter-jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      });
      if (response.ok) {
        const data = await response.json();
        setJobsData(data.jobs || []); // expects { jobs: [...] }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Handle filter apply
  const handleApplyFilters = async () => {
    setPage(1);
    await sendFiltersToApi({
      title: filterTitle,
      jobType: filterJobType,
      schoolType: filterSchoolType,
      gender: filterGender,
      tab: activeTab,
      page: 1,
      action: "apply",
    });
  };

  // Handle filter clear
  const handleClearFilters = async () => {
    setFilterTitle("");
    setFilterJobType("");
    setFilterSchoolType("");
    setFilterGender("");
    setPage(1);
    await sendFiltersToApi({
      title: "",
      jobType: "",
      schoolType: "",
      gender: "",
      tab: activeTab,
      page: 1,
      action: "clear",
    });
  };

  return (
    <div className="container">
      <div className="row">
        {/* Left column: tabs, filters, job cards */}
        <div className="col-lg-9">
          {/* Tabs for filtering */}
          <div className="card card__tab__ mb-3">
            <div className="d-flex align-items-center">
              <ul className="ul d-flex align-items-center">
                {statusTabs.map((tab) => {
                  // Count jobs for each tab
                  const count =
                    tab.key === "all"
                      ? jobsData.length
                      : jobsData.filter((job) => job.status === tab.key).length;
                  return (
                    <li
                      key={tab.key}
                      className={`btn btn__tab__${
                        activeTab === tab.key ? " active" : ""
                      }`}
                      onClick={() => handleTabChange(tab.key)}
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      {/* Icon before tab text */}
                      {tabIcons[tab.key as keyof typeof tabIcons]}
                      <span>{tab.label}</span>
                      {/* Count in rounded grey background */}
                      <span className="count__badge__">{count}</span>
                    </li>
                  );
                })}
              </ul>
              {/* Show/Hide filter switch */}
              <div className="form-switch ms-3 d-flex align-items-center">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="showFiltersSwitch"
                  checked={showFilters}
                  onChange={() => setShowFilters((prev) => !prev)}
                />
                <label
                  className="form-check-label ml-2"
                  htmlFor="showFiltersSwitch"
                >
                  {showFilters ? "Show Filters" : "Hide Filters"}
                </label>
              </div>
            </div>
          </div>
          {/* Filters below tabs */}
          {showFilters && (
            <div className="card mb-3">
              <div className="row">
                <div className="mb-1 col-lg-4 col-md-4 col-sm-6 col-12">
                  <label className="form-label">Job Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={filterTitle}
                    onChange={(e) => setFilterTitle(e.target.value)}
                    placeholder="Enter job title"
                  />
                </div>
                <div className="mb-1 col-lg-4 col-md-4 col-sm-6 col-12">
                  <label className="form-label">Job Type</label>
                  <select
                    className="form-select"
                    value={filterJobType}
                    onChange={(e) => setFilterJobType(e.target.value)}
                  >
                    <option value="">Select job type</option>
                    {jobTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-1 col-lg-4 col-md-4 col-sm-6 col-12">
                  <label className="form-label">School Type</label>
                  <select
                    className="form-select"
                    value={filterSchoolType}
                    onChange={(e) => setFilterSchoolType(e.target.value)}
                  >
                    <option value="">Select school type</option>
                    {schoolTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-1 col-lg-4 col-md-4 col-sm-6 col-12">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-select"
                    value={filterGender}
                    onChange={(e) => setFilterGender(e.target.value)}
                  >
                    <option value="">Select gender</option>
                    {genders.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-1 col-lg-8 col-md-8 col-sm-6 col-12">
                  <div className="d-flex gap-2 mt-25">
                    <button
                      className="btn btn-primary"
                      onClick={handleApplyFilters}
                    >
                      <FaBookmark /> Apply filters
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={handleClearFilters}
                    >
                      Clear filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Job cards */}
          {paginatedJobs.map((job) => (
            <div
              key={job.id}
              className={`card mb-3 shadow-sm${
                job.job_status === "expired" ? "" : ""
              }`}
              style={{
                cursor: "pointer",
                ...(job.job_status === "expired"
                  ? { backgroundColor: "#FFEDED" }
                  : {}),
              }}
              onClick={() => navigate(`/jobs/${job.id}`, { state: { job } })}
            >
              <div className="card-body d-flex justify-content-between align-items-center">
                <div className="d-flex" style={{ width: "100%" }}>
                  <img
                    src={job.avatar || "/tic/school_image.png"}
                    alt="Profile"
                    className="job-avatar me-3"
                  />
                  <div style={{ flex: 1 }}>
                    <h5 className="job-title mb-1">
                      {job.title}
                      <span
                        className={`badge ms-2 ${
                          job.badge === "Remote"
                            ? "remote__badge__"
                            : "causual__badge__"
                        }`}
                      >
                        {job.badge}
                      </span>
                      {job.job_status === "expired" && (
                        <span className="expired__badge__ ms-2">Expired</span>
                      )}
                      {/* Applied status for all jobs tab */}
                      {activeTab === "all" && job.status === "applied" && (
                        <span className="badge bg-success  txt__regular__sub__ ml-2">
                          Applied
                        </span>
                      )}
                    </h5>
                    <p className="job-school">{job.title}</p>
                    <p className="job-school mb-1">
                      <FaLocationArrow style={{ marginRight: 4 }} /> Auckland,
                      55 Mountain Road, Epsom
                    </p>
                    {/* <div className="text-muted small mb-1">
                      <FaLocationArrow style={{ marginRight: 4 }} />
                      {job.location} &bull; Posted: {job.datePosted}
                    </div> */}
                    {/* <div className="text-muted small mb-1">
                      {job.location} &bull; Posted: {job.datePosted}
                    </div> */}
                    <p className="job-description mb-0">
                      {job.description.length > 200
                        ? job.description.slice(0, 200) + "..."
                        : job.description}
                    </p>
                  </div>
                </div>
                <div className="d-flex flex-column align-items-end gap-2">
                  <button className="btn btn-light btn-sm" title="Share Job">
                    <FaShareAlt />
                  </button>
                  <button
                    className="btn btn-light btn-sm"
                    title="Save Job"
                    onClick={() => handleSaveJob(job.id)}
                    disabled={savingJobId === job.id}
                  >
                    {job.status === "saved" ? (
                      <FaBookmark />
                    ) : (
                      <FaRegBookmark />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {/* Pagination controls */}
          {totalPages > 1 && (
            <nav className="mt-3">
              <ul className="pagination">
                <li className={`page-item${page === 1 ? " disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </button>
                </li>
                {[...Array(totalPages)].map((_, idx) => (
                  <li
                    key={idx + 1}
                    className={`page-item${page === idx + 1 ? " active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setPage(idx + 1)}
                    >
                      {idx + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item${
                    page === totalPages ? " disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
        {/* Remove right column */}
      </div>
    </div>
  );
}

export default Jobs;
