// Helper to check authentication
// ...existing code...
import "./public-jobs.css";
import { useState } from "react";
import BaseApi from "../../services/api";
import { FaBookmark, FaSpinner } from "react-icons/fa";
import React from "react";

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

const JOBS_PER_PAGE = 30;

import { schoolTypes } from "../../constants/jobOptions";
import { POSITIONTYPE_OPTIONS } from "../../common/subjectOptions";
// const genders = ["any", "male", "female", "other"];

// ...existing code...

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PublicHeader from "./PublicHeader";

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
  school_type?: string;
}

function Jobs() {
  const location = useLocation();
  const [loading, setLoading] = React.useState(true);

  const [page, setPage] = useState(1);

  // Filter states
  const [filterTitle, setFilterTitle] = useState("");
  const [filterjob_type, setFilterjob_type] = useState("");
  const [filterSchoolType, setFilterSchoolType] = useState("");
  const [filterGender, setFilterGender] = useState("");
  // New: Active jobs filter (checked by default)
  const [filterActive, setFilterActive] = useState(true);

  // Jobs data state (for API updates)
  const [jobsData, setJobsData] = useState<Job[]>([]);
  const [resultsCount, setResultsCount] = useState(0);

  const navigate = useNavigate();

  // Show payment status popup and redirect if needed
  useEffect(() => {}, [location.search, navigate]);

  useEffect(() => {
    const fetchInitialJobs = async () => {
      try {
        const params: any = {
          title: filterTitle,
          jobType: filterjob_type,
          schoolType: filterSchoolType,
          gender: filterGender,
          page: 1,
          action: "init",
          page_size: JOBS_PER_PAGE,
        };
        if (filterActive) {
          params.status = "active";
          params.is_expired = false;
        } else {
          params.status = "all";
        }
        const response = await BaseApi.get("/jobs", { params });
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

  // Filter jobs based on active tab (if not authenticated, always show all jobs)
  let filteredJobs = jobsData;
  // ...existing code...
  // Apply filters
  filteredJobs = filteredJobs.filter((job) => {
    let match = true;
    if (
      filterTitle &&
      !job.title.toLowerCase().includes(filterTitle.toLowerCase())
    )
      match = false;
    if (filterjob_type && job.job_type !== filterjob_type) match = false;
    return match;
  });

  // Pagination logic using backend count
  const totalPages = Math.ceil(resultsCount / JOBS_PER_PAGE);
  // jobsData is already paginated from backend

  // API call for pagination with filters
  const fetchJobsWithFiltersAndPage = async (pageNum: number) => {
    try {
      const params: any = {
        title: filterTitle,
        jobType: filterjob_type,
        schoolType: filterSchoolType,
        gender: filterGender,
        page: pageNum,
        action: "paginate",
        page_size: JOBS_PER_PAGE,
      };
      if (filterActive) {
        params.status = "active";
        params.is_expired = false;
      } else {
        params.status = "all";
      }
      const response = await BaseApi.get("/jobs", { params });
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

  // API call to send filters and update jobs data
  // API call for job details
  const handleViewJobDetails = async (jobId: number) => {
    navigate(`/public-jobs/${jobId}`);
  };
  const sendFiltersToApi = async (filters: any) => {
    try {
      const params: any = { ...filters };
      if (filterActive) {
        params.status = "active";
        params.is_expired = false;
      }
      const response = await BaseApi.get("/jobs", { params });
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
      page: 1,
      action: "apply",
      page_size: JOBS_PER_PAGE,
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
    setFilterActive(true); // Reset to checked on clear
    setPage(1);
    await sendFiltersToApi({
      title: "",
      jobType: "",
      schoolType: "",
      gender: "",
      status: "all",
      page: 1,
      action: "clear",
      page_size: JOBS_PER_PAGE,
    });
    setLoading(false);
  };

  return (
    <>
      <PublicHeader />
      <div className="container mt-3">
        <div className="row">
          {/* Left column: tabs, filters, job cards */}
          <div className="col-lg-9">
            {/* Filters below tabs */}
            <div className="card mb-3">
              <div className="row">
                <div className="mb-1 col-lg-4 col-md-4 col-sm-6 col-12">
                  <label className="form-label">Position</label>
                  <input
                    type="text"
                    className="form-control"
                    value={filterTitle}
                    onChange={(e) => setFilterTitle(e.target.value)}
                    placeholder="Enter job title"
                  />
                </div>
                <div className="mb-1 col-lg-4 col-md-4 col-sm-6 col-12">
                  <label className="form-label">Position Type</label>
                  <select
                    className="form-select"
                    value={filterjob_type}
                    onChange={(e) => setFilterjob_type(e.target.value)}
                  >
                    <option value="">Select position type</option>
                    {POSITIONTYPE_OPTIONS.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
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
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Active jobs filter always true for public, checkbox hidden */}

                <div className="mb-1 col-lg-12 col-md-12 col-sm-12 col-12">
                  <div className="d-flex  flex-wrap gap-2 mt-2">
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
            {loading ? (
              <div
                className="d-flex  flex-wrap justify-content-center align-items-center"
                style={{ minHeight: 200 }}
              >
                <FaSpinner className="fa-spin" size={32} />
                <span className="ms-2">Loading jobs...</span>
              </div>
            ) : jobsData.length === 0 ? (
              <div
                className="d-flex  text-center flex-wrap flex-column align-items-center justify-content-center"
                style={{ minHeight: 200 }}
              >
                <div className="mb-2">
                  <img
                    src="/tic/error.svg"
                    alt="No data"
                    style={{ width: 200, marginBottom: 10 }}
                  />
                  <h5>No jobs found.</h5>
                </div>
                <button
                  className="btn btn-secondary"
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
                    className={`card mb-3 shadow-sm job-card${
                      job.is_expired ? "" : ""
                    }`}
                    style={{
                      cursor: "pointer",
                      ...(job.is_expired
                        ? { backgroundColor: "rgb(250 240 240)" }
                        : {}),
                    }}
                    onClick={() => handleViewJobDetails(job.id)}
                  >
                    <div className="card-body d-flex  justify-content-between align-items-center">
                      <div className="d-flex" style={{ width: "100%" }}>
                        {/* Avatar replacement: Circle with first 2 letters of job title and random color */}
                        {/* Avatar removed as getAvatarColor is unused */}
                        <div style={{ flex: 1 }}>
                          <div className="posted_div sm__d_none__">
                            <span className="text-muted small">
                              Posted: {formatDateTime(job.date_posted).date} -{" "}
                              {formatDateTime(job.date_posted).time}
                            </span>
                          </div>
                          <h5 className="job-title  d-flex  flex-wrap align-items-center mb-1">
                            {job.title}

                            <span className={`badge casual__badge__ ms-2 `}>
                              {schoolTypes.find(
                                (t) => t.value === job.school_type
                              )?.label || job.school_type}
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
                          </h5>
                          <p className="job-school  mb-1">
                            {POSITIONTYPE_OPTIONS.find(
                              (type) => type.value === job.job_type
                            )?.label || job.job_type}
                            {job.job_type && job.location && " • "}
                            {job.school_name}
                            {job.school_name && job.location && " • "}
                            {job.location}{" "}
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
                    </div>
                  </div>
                ))}
                {totalPages > 1 && (
                  <nav className="mt-3">
                    <ul className="pagination">
                      <li
                        className={`page-item${page === 1 ? " disabled" : ""}`}
                      >
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
          <div className="col-lg-3 sm__d_none__">
            <div className="card  mb-3 text-center p-3">
              <img
                src="/tic/cv_writing_guide.svg"
                alt=""
                style={{ width: 150, display: "block", margin: "0 auto" }}
              />
              <h6 className="text__regular__ mt-2" style={{ fontWeight: 600 }}>
                <a
                  target="_blank"
                  href="/cv-writing-guide"
                  style={{ textDecoration: "auto", color: "#0d3b85" }}
                >
                  CV writing guide
                </a>
              </h6>
            </div>
            <div className="card  mb-3 text-center p-3">
              <img
                src="/tic/cv_template.svg"
                alt=""
                style={{ width: 150, display: "block", margin: "0 auto" }}
              />
              <h6 className="text__regular__ mt-2" style={{ fontWeight: 600 }}>
                <a
                  target="_blank"
                  href="/cv-writing-guide"
                  style={{ textDecoration: "auto", color: "#0d3b85" }}
                >
                  International school interview questions
                </a>
              </h6>
            </div>
            <div className="card  mb-3 text-center p-3">
              <img
                src="/tic/sample_resume.svg"
                alt=""
                style={{ width: 150, display: "block", margin: "0 auto" }}
              />
              <h6 className="text__regular__ mt-2" style={{ fontWeight: 600 }}>
                <a
                  target="_blank"
                  href="/cv-writing-guide"
                  style={{ textDecoration: "auto", color: "#0d3b85" }}
                >
                  Download CV template
                </a>
              </h6>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Jobs;
