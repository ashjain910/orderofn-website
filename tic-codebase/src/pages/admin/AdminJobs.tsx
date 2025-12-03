import { useState } from "react";
import AdminBaseApi from "../../services/admin-base";
import {
  FaShareAlt,
  FaRegBookmark,
  FaBookmark,
  FaLocationArrow,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const statusTabs = [
  { key: "active", label: "Active Jobs" },
  { key: "closed", label: "Closed Jobs" },
];

const JOBS_PER_PAGE = 5;

// const job_types = ["remote", "casual", "full-time", "part-time"];
// const schoolTypes = ["public", "private", "charter", "international"];

// Icons for each tab
const tabIcons = {
  all: <FaRegBookmark />,
  saved: <FaBookmark />,
  applied: <FaShareAlt />,
};

import { useEffect } from "react";

// Type for job objects
interface Job {
  id: number;
  title: string;
  school: string;
  date_posted: string;
  location: string;
  job_type: string;
  description: string;
  avatar: string;
  timePosted: string;
  school_name?: string;
  status?: string;
  is_expired?: boolean;
}

function Jobs() {
  const [activeTab, setActiveTab] = useState("active");
  const [page, setPage] = useState(1);

  // Filter states
  const [filterTitle, setFilterTitle] = useState("");
  const [filterjob_type, setFilterjob_type] = useState("");
  const [filterSchoolType, setFilterSchoolType] = useState("");

  // Sample initial jobs data (replace with real data or keep empty array)
  const initialJobsData: Job[] = [];

  // Jobs data state (for API updates)
  // Use sample data for now
  const [jobsData, setJobsData] = useState<Job[]>(initialJobsData);
  const [resultsCount, setResultsCount] = useState(initialJobsData.length);

  const navigate = useNavigate();

  //   Fetch jobs on initial page load with all filters
  useEffect(() => {
    const fetchInitialJobs = async () => {
      try {
        const response = await AdminBaseApi.get("/jobs", {
          params: {
            search: filterTitle,
            job_type: filterjob_type,
            school_type: filterSchoolType,
            status: "active",
            page: 1,
            page_size: JOBS_PER_PAGE,
          },
        });
        setJobsData(response.data.results || []);
        setResultsCount(response.data.count || 0);
        console.log("Initial jobs fetched:", response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchInitialJobs();
    // Only runs once due to []
  }, []);

  // Filter jobs based on active tab
  let filteredJobs =
    activeTab === "active"
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
    if (filterjob_type && job.job_type !== filterjob_type) match = false;
    // schoolType and gender are not in jobsData, so just placeholders for now
    // if (filterSchoolType && job.schoolType !== filterSchoolType) match = false;
    // if (filterGender && job.gender !== filterGender) match = false;
    return match;
  });

  // Pagination logic using backend count
  const totalPages = Math.ceil(resultsCount / JOBS_PER_PAGE);
  // jobsData is already paginated from backend

  // Pagination logic for sample data
  const fetchJobsWithFiltersAndPage = async (pageNum: number) => {
    setPage(pageNum);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Tab change logic: fetch jobs for clicked tab
  const handleTabChange = async (tabKey: string) => {
    if (activeTab === tabKey) return; // Prevent duplicate call
    setActiveTab(tabKey);
    setPage(1);
    try {
      const response = await AdminBaseApi.get("/jobs", {
        params: {
          search: filterTitle,
          job_type: filterjob_type,
          school_type: filterSchoolType,
          status: tabKey,
          page: 1,
          page_size: JOBS_PER_PAGE,
        },
      });
      setJobsData(response.data.results || []);
      setResultsCount(response.data.count || 0);
    } catch (error) {
      setJobsData(initialJobsData);
      setResultsCount(initialJobsData.length);
    }
  };

  // Use sample data for job details
  const handleViewJobDetails = async (jobId: number) => {
    const sampleJob = jobsData.find((job) => job.id === jobId);
    if (sampleJob) {
      navigate(`/admin/job-details/${jobId}`, { state: { job: sampleJob } });
    } else {
      alert("No sample data found for this job.");
    }
  };

  // Handle filter apply (no API)
  const handleApplyFilters = async () => {
    setPage(1);
  };

  // Handle filter clear (no API)
  const handleClearFilters = async () => {
    setFilterTitle("");
    setFilterjob_type("");
    setFilterSchoolType("");
    setPage(1);
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
                    tab.key === "active"
                      ? resultsCount
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
            </div>
          </div>
          {/* Filters below tabs */}
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

          {/* Job cards */}
          {jobsData.map((job) => (
            <div
              key={job.id}
              className={`card mb-3 shadow-sm${job.is_expired ? "" : ""}`}
              style={{
                cursor: "pointer",
                ...(job.is_expired ? { backgroundColor: "#FFEDED" } : {}),
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
                          job.job_type === "Remote"
                            ? "remote__badge__"
                            : "casual__badge__"
                        }`}
                      >
                        {job.job_type}
                      </span>
                    </h5>
                    <p className="job-school  mb-1">{job.school_name}</p>

                    <p className="job-school mb-1">
                      <FaLocationArrow style={{ marginRight: 4 }} />{" "}
                      {job.location}
                    </p>
                    {/* <div className="text-muted small mb-1">
                      <FaLocationArrow style={{ marginRight: 4 }} />
                      {job.location} &bull; Posted: {job.date_posted}
                    </div> */}
                    {/* <div className="text-muted small mb-1">
                      {job.location} &bull; Posted: {job.date_posted}
                    </div> */}
                    <p className="job-description mb-0">
                      {job.description.length > 200
                        ? job.description.slice(0, 200) + "..."
                        : job.description}
                    </p>
                  </div>
                </div>
                <div className="d-flex flex-column align-items-end gap-2"></div>
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
