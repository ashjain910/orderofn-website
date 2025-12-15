// Helper to format UTC date string
const formatDateTime = (utcString: string) => {
  if (!utcString) return { date: "", time: "" };
  const dateObj = new Date(utcString);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = dateObj.getDate();
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  let hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return {
    date: `${day} ${month} ${year}`,
    time: `${hours}:${minStr} ${ampm}`,
  };
};
import { useState } from "react";
import { toast } from "react-toastify";
import BaseApi from "../../services/api";
import Cookies from "js-cookie";
import {
  FaShareAlt,
  FaRegBookmark,
  FaBookmark,
  FaSpinner,
} from "react-icons/fa";
import { MdLocationPin } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import React from "react";

const statusTabs = [
  { key: "all", label: "All Jobs" },
  { key: "saved", label: "Saved Jobs" },
  { key: "applied", label: "Applied Jobs" },
];

const JOBS_PER_PAGE = 5;

const job_types = ["remote", "casual", "full-time", "part-time"];
const schoolTypes = ["public", "private", "charter", "international"];
// const genders = ["any", "male", "female", "other"];

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
  tabStatus: string;
  job_status: string;
  appliedStatus: boolean;
  avatar: string;
  timePosted: string;
  school_name?: string;
  status?: string;
  is_expired?: boolean;
  is_applied?: boolean;
  is_saved?: boolean;
  file_name?: string;
}

function Jobs() {
  const [loading, setLoading] = React.useState(true);

  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [savingJobId, setSavingJobId] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(true);

  // Filter states
  const [filterTitle, setFilterTitle] = useState("");
  const [filterjob_type, setFilterjob_type] = useState("");
  const [filterSchoolType, setFilterSchoolType] = useState("");
  const [filterGender, setFilterGender] = useState("");

  // Jobs data state (for API updates)
  const [jobsData, setJobsData] = useState<Job[]>([]);
  const [resultsCount, setResultsCount] = useState(0);

  const navigate = useNavigate();

  // Fetch jobs on initial page load with all filters
  useEffect(() => {
    const fetchInitialJobs = async () => {
      try {
        const response = await BaseApi.get("/jobs", {
          params: {
            title: filterTitle,
            jobType: filterjob_type,
            schoolType: filterSchoolType,
            gender: filterGender,
            status: "all",
            page: 1,
            action: "init",
            page_size: JOBS_PER_PAGE,
            is_applied: activeTab === "applied" ? true : undefined,
            is_saved: activeTab === "saved" ? true : undefined,
          },
        });
        setJobsData(response.data.results || []);
        setResultsCount(response.data.count || 0);
        console.log("Initial jobs fetched:", response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialJobs();
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
    if (filterjob_type && job.job_type !== filterjob_type) match = false;
    // schoolType and gender are not in jobsData, so just placeholders for now
    // if (filterSchoolType && job.schoolType !== filterSchoolType) match = false;
    // if (filterGender && job.gender !== filterGender) match = false;
    return match;
  });

  // Pagination logic using backend count
  const totalPages = Math.ceil(resultsCount / JOBS_PER_PAGE);
  // jobsData is already paginated from backend

  // API call for pagination with filters
  const fetchJobsWithFiltersAndPage = async (pageNum: number) => {
    try {
      const response = await BaseApi.get("/jobs", {
        params: {
          title: filterTitle,
          jobType: filterjob_type,
          schoolType: filterSchoolType,
          gender: filterGender,
          status: activeTab,
          page: pageNum,
          action: "paginate",
          page_size: JOBS_PER_PAGE,
          is_applied: activeTab === "applied" ? true : undefined,
          is_saved: activeTab === "saved" ? true : undefined,
        },
      });
      console.log("Pagination API response:", response.data);
      setJobsData(response.data.results || []);
      setResultsCount(response.data.count || 0);
      setPage(pageNum);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // API call to fetch jobs for a tab with all filters
  const fetchJobsForTab = async (tabKey: string) => {
    try {
      const response = await BaseApi.get("/jobs", {
        params: {
          title: filterTitle,
          jobType: filterjob_type,
          schoolType: filterSchoolType,
          gender: filterGender,
          status: tabKey,
          page: 1,
          action: "tab",
          page_size: JOBS_PER_PAGE,
          is_applied: tabKey === "applied" ? true : undefined,
          is_saved: tabKey === "saved" ? true : undefined,
        },
      });
      setJobsData(response.data.results || []);
      setResultsCount(response.data.count || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle tab change: reset to page 1 and fetch jobs with all filters
  const handleTabChange = async (tabKey: string) => {
    if (activeTab === tabKey) return; // Prevent duplicate call
    setLoading(true); // Show loader immediately on tab switch
    setActiveTab(tabKey);
    setPage(1);
    await fetchJobsForTab(tabKey);
    // setLoading(false) is handled in fetchJobsForTab finally block
  };

  // Lazy load and call saveJob
  const handleSaveJob = async (jobId: number) => {
    setSavingJobId(jobId);
    try {
      const accessToken =
        Cookies.get("access") ||
        localStorage.getItem("access") ||
        sessionStorage.getItem("access");
      const response = await BaseApi.post(
        `/jobs/${jobId}/save`,
        { job_id: jobId },
        accessToken
          ? { headers: { Authorization: `Bearer ${accessToken}` } }
          : undefined
      );
      if (response.status === 200 || response.status === 201) {
        toast.success("Saved successfully!");
      } else if (
        response.status === 400 &&
        response.data &&
        response.data.error
      ) {
        toast.error(response.data.error);
      } else {
        toast.error("Failed to save job. Please try again.");
      }
    } catch (error: any) {
      // If error response is available, show error message
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data &&
        error.response.data.error
      ) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to save job. Please try again.");
      }
      console.error(error);
    } finally {
      setSavingJobId(null);
      setLoading(false);
    }
  };
  const handleUnSaveJob = async (jobId: number) => {
    setSavingJobId(jobId);
    try {
      const accessToken =
        Cookies.get("access") ||
        localStorage.getItem("access") ||
        sessionStorage.getItem("access");
      const response = await BaseApi.post(
        `/jobs/${jobId}/unsave`,
        { job_id: jobId },
        accessToken
          ? { headers: { Authorization: `Bearer ${accessToken}` } }
          : undefined
      );
      if (response.status === 200 || response.status === 201) {
        toast.success("Unsaved successfully!");
      } else if (
        response.status === 400 &&
        response.data &&
        response.data.error
      ) {
        toast.error(response.data.error);
      } else {
        toast.error("Failed to unsave job. Please try again.");
      }
    } catch (error: any) {
      // If error response is available, show error message
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data &&
        error.response.data.error
      ) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to unsave job. Please try again.");
      }
      console.error(error);
    } finally {
      setSavingJobId(null);
      setLoading(false);
    }
  };
  // API call to send filters and update jobs data
  // API call for job details
  const handleViewJobDetails = async (jobId: number) => {
    try {
      const response = await BaseApi.get(`/jobs/${jobId}`);
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
    } finally {
      setLoading(false);
    }
  };
  const sendFiltersToApi = async (filters: any) => {
    try {
      const response = await BaseApi.get("/jobs", { params: filters });
      setJobsData(response.data.results || []); // expects { results: [...] }
      setResultsCount(response.data.count || 0);
    } catch (error) {
      console.error(error);
    }
  };

  // Handle filter apply
  const handleApplyFilters = async () => {
    setLoading(true);
    setPage(1);
    await sendFiltersToApi({
      title: filterTitle,
      jobType: filterjob_type,
      schoolType: filterSchoolType,
      gender: filterGender,
      status: activeTab,
      page: 1,
      action: "apply",
      page_size: JOBS_PER_PAGE,
      is_applied: activeTab === "applied" ? true : undefined,
      is_saved: activeTab === "saved" ? true : undefined,
    });
    setLoading(false);
  };

  // Handle filter clear
  const handleClearFilters = async () => {
    setLoading(true);
    setFilterTitle("");
    setFilterjob_type("");
    setFilterSchoolType("");
    setFilterGender("");
    setPage(1);
    await sendFiltersToApi({
      title: "",
      jobType: "",
      schoolType: "",
      gender: "",
      status: activeTab,
      page: 1,
      action: "clear",
      page_size: JOBS_PER_PAGE,
      is_applied: activeTab === "applied" ? true : undefined,
      is_saved: activeTab === "saved" ? true : undefined,
    });
    setLoading(false);
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
                  // Show correct count for each tab
                  let count = 0;
                  if (tab.key === "all") {
                    count = resultsCount;
                  } else {
                    count = jobsData.filter(
                      (job) => job.tabStatus === tab.key
                    ).length;
                  }
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
                    value={filterjob_type}
                    onChange={(e) => setFilterjob_type(e.target.value)}
                  >
                    <option value="">Select job type</option>
                    {job_types.map((type) => (
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
          {loading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: 200 }}
            >
<<<<<<< HEAD
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
=======
              <FaSpinner className="fa-spin" size={32} />
              <span className="ms-2">Loading jobs...</span>
            </div>
          ) : jobsData.length === 0 ? (
            <div
              className="d-flex flex-column align-items-center justify-content-center"
              style={{ minHeight: 200 }}
            >
              <div className="mb-2">No jobs found.</div>
              <button
                className="btn btn-outline-primary"
                onClick={handleClearFilters}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              {jobsData.map((job) => (
                <div
                  key={job.id}
                  className={`card mb-3 shadow-sm${job.is_expired ? "" : ""}`}
                  style={{
                    cursor: "pointer",
                    ...(job.is_expired
                      ? { backgroundColor: "rgb(250 240 240)" }
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
                        <div className="posted_div">
                          <span className="text-muted small">
                            Posted: {formatDateTime(job.date_posted).date} -{" "}
                            {formatDateTime(job.date_posted).time}
                          </span>
                        </div>
                        <h5 className="job-title  d-flex align-items-center mb-1">
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
                          {job.is_expired && (
                            <span className="badge bg-danger txt__regular__  ms-2">
                              Expired
                            </span>
                          )}
                          {job.status === "closed" && (
                            <span className="badge bg-secondary txt__regular__  ms-2">
                              Job Closed
                            </span>
                          )}
                          {/* Applied status for all jobs tab */}
                          {activeTab === "all" && job.is_applied && (
                            <span className="badge bg-success  txt__regular__ ml-2">
                              Applied
                            </span>
                          )}
                        </h5>
                        <p className="job-school  mb-1">{job.school_name}</p>
>>>>>>> 447c7429e3a6c848e5ac8cd06d8381dc3515617f

                        <p className="job-school mb-1">
                          <MdLocationPin style={{ color: "#0d3b85" }} />{" "}
                          {job.location}
                        </p>
                        <p className="job-description mb-0">
                          <span
                            dangerouslySetInnerHTML={{
                              __html:
                                job.description.length > 200
                                  ? job.description.slice(0, 200) + "..."
                                  : job.description,
                            }}
                          />
                        </p>
                      </div>
                    </div>
                    <div className="d-flex flex-column align-items-end gap-2">
                      <button
                        className="btn btn-light btn-sm"
                        title={job.is_saved ? "Unsave Job" : "Save Job"}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (job.is_saved) {
                            handleUnSaveJob(job.id);
                          } else {
                            handleSaveJob(job.id);
                          }
                        }}
                        disabled={savingJobId === job.id}
                      >
                        {job.is_saved ? (
                          <FaBookmark style={{ color: "#0d3b85" }} />
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
                        className={`page-item${
                          page === idx + 1 ? " active" : ""
                        }`}
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
            </>
          )}
        </div>
        {/* Remove right column */}
      </div>
    </div>
  );
}

export default Jobs;
