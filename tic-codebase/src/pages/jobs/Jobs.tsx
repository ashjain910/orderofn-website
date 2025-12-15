import { useState } from "react";
import api from "../../services/api";
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
    school: "Lincoln High School",
    datePosted: "2025-11-20",
    location: "New York, NY",
    JobType: "Remote",
    description: longDescription,
    tabStatus: "all",
    job_status: "active",
    appliedStatus: false,
    avatar: "/tic/school_image.png",
    timePosted: "10:00 AM",
  },
  {
    id: 2,
    title: "History Teacher",
    school: "Chicago High School",
    datePosted: "2025-11-19",
    location: "Chicago, IL",
    JobType: "Casual",
    description: "Teach history classes for middle school students.",
    tabStatus: "all",
    job_status: "expired",
    appliedStatus: false,
    avatar: "/tic/school_image.png",
    timePosted: "11:00 AM",
  },
  {
    id: 3,
    title: "Biology Teacher",
    school: "Houston High School",
    datePosted: "2025-11-18",
    location: "Houston, TX",
    JobType: "Full-time",
    description: "Full-time biology teacher for high school.",
    tabStatus: "all",
    job_status: "active",
    appliedStatus: false,
    avatar: "/tic/school_image.png",
    timePosted: "12:00 PM",
  },
  {
    id: 4,
    title: "Chemistry Tutor",
    school: "Remote College",
    datePosted: "2025-11-17",
    location: "Remote",
    JobType: "Remote",
    description: "Online chemistry tutoring for college students.",
    tabStatus: "all",
    job_status: "expired",
    appliedStatus: false,
    avatar: "/tic/school_image.png",
    timePosted: "01:00 PM",
  },
  {
    id: 5,
    title: "Physics Lecturer",
    school: "Boston College",
    datePosted: "2025-11-16",
    location: "Boston, MA",
    JobType: "Remote",
    description: "Remote physics lectures for college students.",
    tabStatus: "all",
    job_status: "active",
    appliedStatus: false,
    avatar: "/tic/school_image.png",
    timePosted: "02:00 PM",
  },
  {
    id: 6,
    title: "Geography Teacher",
    school: "San Diego School",
    datePosted: "2025-11-15",
    location: "San Diego, CA",
    JobType: "Casual",
    description: "Casual geography teacher for weekend classes.",
    tabStatus: "all",
    job_status: "expired",
    appliedStatus: false,
    avatar: "/tic/school_image.png",
    timePosted: "03:00 PM",
  },
  {
    id: 7,
    title: "Art Instructor",
    school: "Miami Art Camp",
    datePosted: "2025-11-14",
    location: "Miami, FL",
    JobType: "Part-time",
    description: "Part-time art instructor for summer camp.",
    tabStatus: "all",
    job_status: "active",
    appliedStatus: false,
    avatar: "/tic/school_image.png",
    timePosted: "04:00 PM",
  },
  {
    id: 8,
    title: "Music Teacher",
    school: "Seattle Elementary",
    datePosted: "2025-11-13",
    location: "Seattle, WA",
    JobType: "Full-time",
    description: "Full-time music teacher for elementary school.",
    tabStatus: "all",
    job_status: "expired",
    appliedStatus: false,
    avatar: "/tic/school_image.png",
    timePosted: "05:00 PM",
  },
  {
    id: 9,
    title: "Physical Education Coach",
    school: "Denver After School",
    datePosted: "2025-11-12",
    location: "Denver, CO",
    JobType: "Casual",
    description: "Casual PE coach for after-school program.",
    tabStatus: "all",
    job_status: "active",
    appliedStatus: false,
    avatar: "/tic/school_image.png",
    timePosted: "06:00 PM",
  },
  {
    id: 10,
    title: "Computer Science Teacher",
    school: "Austin Bootcamp",
    datePosted: "2025-11-11",
    location: "Austin, TX",
    JobType: "Remote",
    description: "Remote computer science teacher for coding bootcamp.",
    tabStatus: "all",
    job_status: "expired",
    appliedStatus: false,
    avatar: "/tic/school_image.png",
    timePosted: "07:00 PM",
  },
  // Saved Jobs
  {
    id: 11,
    title: "Science Instructor",
    school: "San Francisco Workshops",
    datePosted: "2025-11-18",
    location: "San Francisco, CA",
    JobType: "Casual",
    description: "Part-time science instructor for weekend workshops.",
    tabStatus: "saved",
    job_status: "active",
    appliedStatus: false,
    avatar: "/tic/school_image.png",
    timePosted: "08:00 PM",
  },
  {
    id: 12,
    title: "Math Tutor",
    school: "Remote High School",
    datePosted: "2025-11-17",
    location: "Remote",
    JobType: "Remote",
    description: "Remote math tutoring for high school students.",
    tabStatus: "saved",
    job_status: "active",
    appliedStatus: false,
    avatar: "/tic/school_image.png",
    timePosted: "09:00 PM",
  },
  {
    id: 13,
    title: "English Teacher",
    school: "Chicago Middle School",
    datePosted: "2025-11-16",
    location: "Chicago, IL",
    JobType: "Full-time",
    description: "Full-time English teacher for middle school.",
    tabStatus: "saved",
    job_status: "expired",
    appliedStatus: false,
    avatar: "/tic/school_image.png",
    timePosted: "10:00 PM",
  },
  {
    id: 14,
    title: "History Tutor",
    school: "Remote College",
    datePosted: "2025-11-15",
    location: "Remote",
    JobType: "Remote",
    description: "Online history tutoring for college students.",
    tabStatus: "saved",
    job_status: "expired",
    appliedStatus: false,
    avatar: "/tic/school_image.png",
    timePosted: "11:00 PM",
  },
  {
    id: 15,
    title: "Physics Instructor",
    school: "Boston Weekend Classes",
    datePosted: "2025-11-14",
    location: "Boston, MA",
    JobType: "Casual",
    description: "Casual physics instructor for weekend classes.",
    tabStatus: "saved",
    job_status: "active",
    appliedStatus: false,
    avatar: "/tic/school_image.png",
    timePosted: "12:00 AM",
  },
  {
    id: 16,
    title: "Chemistry Teacher",
    school: "Houston High School",
    datePosted: "2025-11-13",
    location: "Houston, TX",
    JobType: "Full-time",
    description: "Full-time chemistry teacher for high school.",
    tabStatus: "saved",
    job_status: "active",
    appliedStatus: false,
    avatar: "/tic/school_image.png",
    timePosted: "01:00 AM",
  },
  {
    id: 17,
    title: "Art Tutor",
    school: "Miami Summer Camp",
    datePosted: "2025-11-12",
    location: "Miami, FL",
    JobType: "Part-time",
    description: "Part-time art tutor for summer camp.",
    tabStatus: "saved",
    job_status: "expired",
    appliedStatus: false,
    avatar: "/tic/school_image.png",
    timePosted: "02:00 AM",
  },
  {
    id: 18,
    title: "Music Instructor",
    school: "Seattle Elementary",
    datePosted: "2025-11-11",
    location: "Seattle, WA",
    JobType: "Full-time",
    description: "Full-time music instructor for elementary school.",
    tabStatus: "saved",
    job_status: "expired",
    appliedStatus: false,
    avatar: "/tic/school_image.png",
    timePosted: "03:00 AM",
  },
  {
    id: 19,
    title: "PE Coach",
    school: "Denver After School",
    datePosted: "2025-11-10",
    location: "Denver, CO",
    JobType: "Casual",
    description: "Casual PE coach for after-school program.",
    tabStatus: "saved",
    job_status: "expired",
    appliedStatus: false,
    avatar: "/tic/school_image.png",
    timePosted: "04:00 AM",
  },
  {
    id: 20,
    title: "Computer Science Tutor",
    school: "Austin Bootcamp",
    datePosted: "2025-11-09",
    location: "Austin, TX",
    JobType: "Remote",
    description: "Remote computer science tutor for coding bootcamp.",
    tabStatus: "saved",
    job_status: "expired",
    appliedStatus: false,
    avatar: "/tic/school_image.png",
    timePosted: "05:00 AM",
  },
  // Applied Jobs
  {
    id: 21,
    title: "English Tutor",
    school: "Remote International",
    datePosted: "2025-11-15",
    location: "Remote",
    JobType: "Remote",
    description: "Online English tutoring for international students.",
    tabStatus: "applied",
    job_status: "active",
    appliedStatus: false,
    avatar: "/tic/school_image.png",
    timePosted: "06:00 AM",
  },
  {
    id: 22,
    title: "Math Instructor",
    school: "New York High School",
    datePosted: "2025-11-14",
    location: "New York, NY",
    JobType: "Full-time",
    description: "Full-time math instructor for high school.",
    tabStatus: "applied",
    job_status: "active",
    appliedStatus: false,
    avatar: "/tic/school_image.png",
    timePosted: "07:00 AM",
  },
  {
    id: 23,
    title: "Science Teacher",
    school: "San Francisco Workshops",
    datePosted: "2025-11-13",
    location: "San Francisco, CA",
    JobType: "Casual",
    description: "Casual science teacher for weekend workshops.",
    tabStatus: "applied",
    job_status: "expired",
    appliedStatus: false,
    avatar: "/tic/school_image.png",
    timePosted: "08:00 AM",
  },
  {
    id: 24,
    title: "History Instructor",
    school: "Remote College",
    datePosted: "2025-11-12",
    location: "Chicago, IL",
    JobType: "Remote",
    description: "Remote history instructor for college students.",
    tabStatus: "applied",
    job_status: "expired",
    appliedStatus: false,
    avatar: "/tic/school_image.png",
    timePosted: "09:00 AM",
  },
  {
    id: 25,
    title: "Physics Tutor",
    school: "Boston Weekend Classes",
    datePosted: "2025-11-11",
    location: "Boston, MA",
    JobType: "Casual",
    description: "Casual physics tutor for weekend classes.",
    tabStatus: "applied",
    job_status: "active",
    appliedStatus: false,
    avatar: "/tic/school_image.png",
    timePosted: "10:00 AM",
  },
  {
    id: 26,
    title: "Chemistry Instructor",
    school: "Houston High School",
    datePosted: "2025-11-10",
    location: "Houston, TX",
    JobType: "Full-time",
    description: "Full-time chemistry instructor for high school.",
    tabStatus: "applied",
    job_status: "active",
    appliedStatus: false,
    avatar: "/tic/school_image.png",
    timePosted: "11:00 AM",
  },
  {
    id: 27,
    title: "Art Teacher",
    school: "Miami Summer Camp",
    datePosted: "2025-11-09",
    location: "Miami, FL",
    JobType: "Part-time",
    description: "Part-time art teacher for summer camp.",
    tabStatus: "applied",
    job_status: "expired",
    appliedStatus: false,
    avatar: "/tic/school_image.png",
    timePosted: "12:00 PM",
  },
  {
    id: 28,
    title: "Music Tutor",
    school: "Seattle Elementary",
    datePosted: "2025-11-08",
    location: "Seattle, WA",
    JobType: "Full-time",
    description: "Full-time music tutor for elementary school.",
    tabStatus: "applied",
    job_status: "expired",
    appliedStatus: false,
    avatar: "/tic/school_image.png",
    timePosted: "01:00 PM",
  },
  {
    id: 29,
    title: "PE Instructor",
    school: "Denver After School",
    datePosted: "2025-11-07",
    location: "Denver, CO",
    JobType: "Casual",
    description: "Casual PE instructor for after-school program.",
    tabStatus: "applied",
    job_status: "expired",
    appliedStatus: false,
    avatar: "/tic/school_image.png",
    timePosted: "02:00 PM",
  },
  {
    id: 30,
    title: "Computer Science Teacher",
    school: "Austin Bootcamp",
    datePosted: "2025-11-06",
    location: "Austin, TX",
    JobType: "Remote",
    description: "Remote computer science teacher for coding bootcamp.",
    tabStatus: "applied",
    job_status: "expired",
    appliedStatus: false,
    avatar: "/tic/school_image.png",
    timePosted: "03:00 PM",
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

import { useEffect } from "react";

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

  // Fetch all jobs on initial page load (only once)
  useEffect(() => {
    fetchJobsForTab("all");
    // Only runs once due to []
  }, []);

  // Filter jobs based on active tab
  let filteredJobs =
    activeTab === "all"
      ? jobsData
      : jobsData.filter((job) => job.tabStatus === activeTab);

  // Apply filters
  filteredJobs = filteredJobs.filter((job) => {
    let match = true;
    if (
      filterTitle &&
      !job.title.toLowerCase().includes(filterTitle.toLowerCase())
    )
      match = false;
    if (filterJobType && job.JobType !== filterJobType) match = false;
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

  // API call for pagination with filters
  const fetchJobsWithFiltersAndPage = async (pageNum: number) => {
    try {
      const response = await api.post("/filter-jobs", {
        title: filterTitle,
        jobType: filterJobType,
        schoolType: filterSchoolType,
        gender: filterGender,
        tab: activeTab,
        page: pageNum,
        action: "paginate",
      });
      setJobsData(response.data.jobs || []);
      setPage(pageNum);
    } catch (error) {
      console.error(error);
    }
  };

  // API call to fetch jobs for a tab
  const fetchJobsForTab = async (tabKey: string) => {
    try {
      const response = await api.post("/jobs", { tabStatus: tabKey });
      setJobsData(response.data.jobs || []);
    } catch (error) {
      console.error(error);
    }
  };

  // Handle tab change: reset to page 1 and fetch jobs
  const handleTabChange = async (tabKey: string) => {
    if (activeTab === tabKey) return; // Prevent duplicate call
    setActiveTab(tabKey);
    setPage(1);
    fetchJobsForTab(tabKey);
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

  // API call for sharing a job
  const handleShareJob = async (jobId: number) => {
    try {
      const response = await api.post("/share-job", { jobId });
      if (response.status === 200) {
        alert("Job shared successfully!");
      } else {
        alert("Failed to share job.");
      }
    } catch (error) {
      alert("Error sharing job.");
      console.error(error);
    }
  };

  // API call to send filters and update jobs data
  // API call for job details
  const handleViewJobDetails = async (jobId: number) => {
    try {
      const response = await api.get(`/job-details/${jobId}`);
      navigate(`/jobs/${jobId}`, { state: { job: response.data } });
    } catch (error) {
      // Fallback: use sample job data if API fails
      const sampleJob = jobsData.find((job) => job.id === jobId);
      if (sampleJob) {
        navigate(`/jobs/${jobId}`, { state: { job: sampleJob } });
      } else {
        alert("Error fetching job details and no sample data found.");
      }
      console.error(error);
    }
  };
  const sendFiltersToApi = async (filters: any) => {
    try {
      const response = await api.post("/filter-jobs", filters);
      setJobsData(response.data.jobs || []); // expects { jobs: [...] }
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
      tabStatus: activeTab,
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
      tabStatus: activeTab,
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
                      : jobsData.filter((job) => job.tabStatus === tab.key)
                          .length;
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
              onClick={() => handleViewJobDetails(job.id)}
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
                          job.JobType === "Remote"
                            ? "remote__badge__"
                            : "casual__badge__"
                        }`}
                      >
                        {job.JobType}
                      </span>
                      {job.job_status === "expired" && (
                        <span className="expired__badge__ ms-2">Expired</span>
                      )}
                      {/* Applied status for all jobs tab */}
                      {activeTab === "all" && job.is_applied && (
                        <span className="badge bg-success  txt__regular__sub__ ml-2">
                          Applied
                        </span>
                      )}
                    </h5>
                    <p className="job-school  mb-1">{job.school}</p>

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
                  <button
                    className="btn btn-light btn-sm"
                    title="Share Job"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShareJob(job.id);
                    }}
                  >
                    <FaShareAlt />
                  </button>
                  <button
                    className="btn btn-light btn-sm"
                    title="Save Job"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveJob(job.id);
                    }}
                    disabled={savingJobId === job.id}
                  >
                    {job.job_status === "saved" ? (
                      <FaBookmark />
                    ) : (
                      <FaRegBookmark />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {totalPages > 1 && (
            <nav className="mt-3">
              <ul className="pagination">
                <li className={`page-item${page === 1 ? " disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => fetchJobsWithFiltersAndPage(page - 1)}
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
                      onClick={() => fetchJobsWithFiltersAndPage(idx + 1)}
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
                    onClick={() => fetchJobsWithFiltersAndPage(page + 1)}
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
