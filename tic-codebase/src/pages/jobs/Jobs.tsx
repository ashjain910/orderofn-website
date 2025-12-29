// Helper to get a random color based on job id (stable per job)
function getAvatarColor(id: number) {
  const colors = [
    "#0d6efd", // blue
    "#6610f2", // indigo
    "#6f42c1", // purple
    "#d63384", // pink
    "#fd7e14", // orange
    "#20c997", // teal
    "#198754", // green
    "#ffc107", // yellow
    "#dc3545", // red
    "#343a40", // dark
  ];
  return colors[id % colors.length];
}
import "./jobs.css";
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
import React from "react";
import { Modal } from "react-bootstrap";
import { HiLightBulb } from "react-icons/hi";

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

const statusTabs = [
  { key: "all", label: "All Jobs" },
  { key: "saved", label: "Saved Jobs" },
  { key: "applied", label: "Applied Jobs" },
];

const JOBS_PER_PAGE = 30;

import { schoolTypes } from "../../constants/jobOptions";
import { POSITIONTYPE_OPTIONS } from "../../common/subjectOptions";
// const genders = ["any", "male", "female", "other"];

// Icons for each tab
const tabIcons = {
  all: <FaRegBookmark />,
  saved: <FaBookmark />,
  applied: <FaShareAlt />,
};

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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

  // Modal for payment status (success/failure)
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "success" | "failed" | null
  >(null);

  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [savingJobId, setSavingJobId] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(true);

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
  // Tab counts for all, saved, applied
  const [tabCounts, setTabCounts] = useState<{
    all: number;
    saved: number;
    applied: number;
  }>({ all: 0, saved: 0, applied: 0 });

  const navigate = useNavigate();

  // Show payment status popup and redirect if needed
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const params = new URLSearchParams(location.search);
    if (params.get("checkout") === "success") {
      BaseApi.get("/profile")
        .then((res) => {
          if (res && res.data && res.data.subscription_status) {
            sessionStorage.setItem(
              "subscription_status",
              res.data.subscription_status
            );
          }
          setPaymentStatus("success");
        })
        .catch(() => {
          setPaymentStatus("failed");
        })
        .finally(() => {
          setShowPaymentModal(true);
          timeoutId = setTimeout(() => {
            setShowPaymentModal(false);
            navigate("/jobs", { replace: true });
          }, 5000);
        });
    } else if (params.get("checkout") === "canceled") {
      setPaymentStatus("failed");
      setShowPaymentModal(true);
      timeoutId = setTimeout(() => {
        setShowPaymentModal(false);
        navigate("/jobs", { replace: true });
      }, 5000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [location.search, navigate]);

  // Fetch jobs on initial page load with all filters
  // Helper to fetch tab counts (all, saved, applied)
  const fetchTabCounts = async () => {
    try {
      // You may want to optimize this with a single API endpoint that returns all counts at once
      const [allRes, savedRes, appliedRes] = await Promise.all([
        BaseApi.get("/jobs", {
          params: { status: "all", page: 1, page_size: 1 },
        }),
        BaseApi.get("/jobs", {
          params: { status: "saved", page: 1, page_size: 1, is_saved: true },
        }),
        BaseApi.get("/jobs", {
          params: {
            status: "applied",
            page: 1,
            page_size: 1,
            is_applied: true,
          },
        }),
      ]);
      setTabCounts({
        all: allRes.data.count || 0,
        saved: savedRes.data.count || 0,
        applied: appliedRes.data.count || 0,
      });
    } catch (error) {
      // fallback: don't update counts
      console.error("Error fetching tab counts", error);
    }
  };

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
          is_applied: activeTab === "applied" ? true : undefined,
          is_saved: activeTab === "saved" ? true : undefined,
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
        setTabCounts((prev) => ({ ...prev, all: response.data.count || 0 }));
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
      const params: any = {
        title: filterTitle,
        jobType: filterjob_type,
        schoolType: filterSchoolType,
        gender: filterGender,
        page: pageNum,
        action: "paginate",
        page_size: JOBS_PER_PAGE,
        is_applied: activeTab === "applied" ? true : undefined,
        is_saved: activeTab === "saved" ? true : undefined,
      };
      if (filterActive) {
        params.status = "active";
        params.is_expired = false;
      } else {
        params.status = activeTab;
      }
      const response = await BaseApi.get("/jobs", { params });
      console.log("Pagination API response:", response.data);
      setJobsData(response.data.results || []);
      setResultsCount(response.data.count || 0);
      setPage(pageNum);
      await fetchTabCounts();
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
      const params: any = {
        title: filterTitle,
        jobType: filterjob_type,
        schoolType: filterSchoolType,
        gender: filterGender,
        page: 1,
        action: "tab",
        page_size: JOBS_PER_PAGE,
        is_applied: tabKey === "applied" ? true : undefined,
        is_saved: tabKey === "saved" ? true : undefined,
      };
      if (filterActive) {
        params.status = "active";
        params.is_expired = false;
      } else {
        params.status = tabKey;
      }
      const response = await BaseApi.get("/jobs", { params });
      setJobsData(response.data.results || []);
      setResultsCount(response.data.count || 0);
      // Update the count for the selected tab with the count from the API response
      setTabCounts((prev) => ({ ...prev, [tabKey]: response.data.count || 0 }));
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
    // Only the selected tab's API is called; no extra tab API calls
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
        toast.success(response.data.message || "Saved successfully!");
        // Update the saved job in jobsData if response.data.saved_job exists
        if (response.data.saved_job && response.data.saved_job.id) {
          setJobsData((prevJobs) => {
            const idx = prevJobs.findIndex(
              (j) => j.id === response.data.saved_job.id
            );
            if (idx !== -1) {
              const updatedJobs = [...prevJobs];
              updatedJobs[idx] = {
                ...updatedJobs[idx],
                ...response.data.saved_job,
              };
              return updatedJobs;
            }
            return prevJobs;
          });
        }
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
    navigate(`/jobs/${jobId}`);
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
      status: activeTab,
      page: 1,
      action: "apply",
      page_size: JOBS_PER_PAGE,
      is_applied: activeTab === "applied" ? true : undefined,
      is_saved: activeTab === "saved" ? true : undefined,
    });
    await fetchTabCounts();
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
      status: activeTab,
      page: 1,
      action: "clear",
      page_size: JOBS_PER_PAGE,
      is_applied: activeTab === "applied" ? true : undefined,
      is_saved: activeTab === "saved" ? true : undefined,
    });
    await fetchTabCounts();
    setLoading(false);
  };

  return (
    <div className="container">
      <Modal show={showPaymentModal} backdrop="static" keyboard={false}>
        <Modal.Body>
          <div className="d-flex  flex-wrap align-items-center justify-content-center">
            <div className=" text-center p-4">
              {/* Icon */}
              <div className="d-flex  flex-wrap justify-content-center mb-3">
                <div
                  className="d-flex  flex-wrap align-items-center justify-content-center"
                  style={{
                    width: "90px",
                    height: "90px",
                    borderRadius: "50%",
                    backgroundColor:
                      paymentStatus === "success" ? "#0d3b85" : "#dc3545",
                    color: "#fff",
                    fontSize: "40px",
                  }}
                >
                  {paymentStatus === "success" ? "✓" : "✗"}
                </div>
              </div>
              {/* Title */}
              <h5 className="fw-semibold mb-2">
                {paymentStatus === "success"
                  ? "Subscription Successful"
                  : "Subscription Failed"}
              </h5>
              {/* Spinner */}
              <div className="d-flex  flex-wrap justify-content-center my-3">
                <span
                  className={`spinner-border ${
                    paymentStatus === "success" ? "text-primary" : "text-danger"
                  }`}
                  role="status"
                  aria-hidden="true"
                ></span>
              </div>
              {/* Description */}
              <p className="text-muted mb-4">
                Please wait
                <br /> while we redirect you
              </p>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <div className="row">
        {/* Left column: tabs, filters, job cards */}
        <div className="col-lg-9">
          {/* Tabs for filtering */}
          <div className="card card__tab__ mb-3">
            <div className="d-flex  flex-wrap align-items-center">
              <ul className="ul d-flex  flex-wrap align-items-center">
                {statusTabs.map((tab) => (
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
                    <span className="count__badge__">
                      {tabCounts[tab.key as keyof typeof tabCounts] ?? 0}
                    </span>
                  </li>
                ))}
              </ul>
              {/* Show/Hide filter switch */}
              <div className="form-switch ms-3 d-flex  flex-wrap align-items-center">
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
                {/* Active jobs filter checkbox */}
                <div className="mb-1 col-lg-4 col-md-4 col-sm-6 col-12 d-flex  flex-wrap align-items-center">
                  <input
                    type="checkbox"
                    className="form-check-input me-1"
                    id="activeJobsCheckbox"
                    checked={filterActive}
                    onChange={() => setFilterActive((prev) => !prev)}
                  />
                  <label
                    className="form-label mt-2"
                    style={{ fontSize: 14 }}
                    htmlFor="activeJobsCheckbox"
                  >
                    Active Jobs
                  </label>
                </div>

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
          )}
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
              className="d-flex  flex-wrap flex-column align-items-center justify-content-center"
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
                      <div
                        className="job-avatar me-3 d-flex align-items-center justify-content-center"
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          backgroundColor: getAvatarColor(job.id),
                          color: "#fff",
                          fontWeight: 500,
                          fontSize: 20,
                          textTransform: "uppercase",
                          flexShrink: 0,
                          userSelect: "none",
                        }}
                      >
                        {job.title?.slice(0, 2) || "?"}
                      </div>
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
                          {/* Applied status for all jobs tab */}
                          {activeTab === "all" && job.is_applied && (
                            <span className="badge bg-success  txt__regular__ ml-2">
                              Applied
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
                    <div className="d-flex  flex-wrap sm__d_none__ flex-column align-items-end gap-2">
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
        <div className="col-lg-3 sm__d_none__">
          <div className="card  mb-3 text-center p-3">
            <img
              src="/tic/cv_writing_guide.svg"
              alt=""
              style={{ width: 150, display: "block", margin: "0 auto" }}
            />
            <h6 className="text__regular__ mt-2" style={{ fontWeight: 600 }}>
              <a
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
                href="/cv-writing-guide"
                style={{ textDecoration: "auto", color: "#0d3b85" }}
              >
                Download CV template
              </a>
            </h6>
          </div>
          {/* Remove right column */}
          <div className="card note_card_ad mb-3">
            <p className="txt__regular__">
              <HiLightBulb
                style={{
                  fontSize: 25,
                  marginBottom: 3,
                  color: "rgb(237 190 49)",
                }}
              />{" "}
              Tip
            </p>
            <ul className="txt__regular__  mb-0">
              <li>
                Quick apply to this job with your TIC profile. You may also
                upload your updated resume and cover letter if you wish to do
                so.
              </li>
              <li>
                Applicants who include a cover letter are more likely to get
                hired.
              </li>
            </ul>
          </div>

          {(() => {
            // Prefer profile.subscription_status, else check session/local storage
            let subStatus =
              sessionStorage.getItem("profile_subscription_status") ||
              localStorage.getItem("profile_subscription_status") ||
              undefined;
            if (!subStatus) {
              subStatus =
                sessionStorage.getItem("subscription_status") ||
                localStorage.getItem("subscription_status") ||
                undefined;
            }
            if (subStatus === "none") {
              return (
                <div className="card p-4 mb-4">
                  <div className="txt-muted text-center">
                    <h6 className="fw-bold">No active subscription</h6>
                    <h6>Subscribe to get full access.</h6>
                    <button
                      onClick={() => navigate("/subscription-plans")}
                      className="btn btn-primary mt-1"
                    >
                      Subscribe now
                    </button>
                  </div>
                </div>
              );
            }
            return null;
          })()}
        </div>
      </div>
    </div>
  );
}

export default Jobs;
