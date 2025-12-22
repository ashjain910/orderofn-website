// Add at the top or after imports
import "./admin-jobs.css";
import { useState, useEffect } from "react";
import AdminBaseApi from "../../services/admin-base";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { job_types, schoolTypes } from "../../constants/jobOptions";

const statusTabs = [
  { key: "active", label: "Active Jobs" },
  { key: "closed", label: "Closed Jobs" },
];

const JOBS_PER_PAGE = 5;

const tabIcons = {
  active: <FaRegBookmark />,
  closed: <FaBookmark />,
};

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
  applications_count?: number;
  school_type?: string;
}
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
function Jobs() {
  // State to control post job modal
  const [showPostJobModal, setShowPostJobModal] = useState(false);
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
  const [query, setQuery] = useState({
    tab: "active",
    page: 1,
    filterTitle: "",
    filterjob_type: "",
    filterSchoolType: "",
  });
  // Temporary filter states for controlled selects
  const [tempFilterJobType, setTempFilterJobType] = useState("");
  const [tempFilterSchoolType, setTempFilterSchoolType] = useState("");
  const [jobsData, setJobsData] = useState<Job[]>([]);
  const [resultsCount, setResultsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs(query);
    // eslint-disable-next-line
  }, [
    query.tab,
    query.page,
    query.filterTitle,
    query.filterjob_type,
    query.filterSchoolType,
  ]);

  const fetchJobs = async (q: typeof query) => {
    setLoading(true);
    try {
      const response = await AdminBaseApi.get("/jobs", {
        params: {
          search: q.filterTitle,
          job_type: q.filterjob_type,
          school_type: q.filterSchoolType,
          status: q.tab,
          page: q.page,
          page_size: JOBS_PER_PAGE,
        },
      });
      setJobsData(response.data.results || []);
      setResultsCount(response.data.count || 0);
    } catch (error) {
      setJobsData([]);
      setResultsCount(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobsWithFiltersAndPage = (pageNum: number) => {
    setQuery((prev) => ({ ...prev, page: pageNum }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTabChange = (tabKey: string) => {
    if (query.tab === tabKey) return;
    setQuery((prev) => ({ ...prev, tab: tabKey, page: 1 }));
  };

  const handleApplyFilters = () => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      filterjob_type: tempFilterJobType,
      filterSchoolType: tempFilterSchoolType,
    }));
  };

  const handleClearFilters = () => {
    setTempFilterJobType("");
    setTempFilterSchoolType("");
    setQuery((prev) => ({
      ...prev,
      page: 1,
      filterTitle: "",
      filterjob_type: "",
      filterSchoolType: "",
    }));
  };

  const handleViewJobDetails = (jobId: number) => {
    const job = jobsData.find((job) => job.id === jobId);
    if (job) {
      navigate(`/admin/job-details/${jobId}`, { state: { job } });
    }
  };

  const totalPages = Math.ceil(resultsCount / JOBS_PER_PAGE);
  const { tab: activeTab, page, filterTitle } = query;

  return (
    <div className="container">
      <div className="row">
        {/* Filter section - left side */}
        <div className="col-lg-3 col-md-4 col-sm-12 mb-3">
          <div
            className="card sticky-top"
            style={{ top: 80, zIndex: 2, width: "100%" }}
          >
            {" "}
            <div className="row">
              <div className="mb-1 col-12">
                <label className="form-label">Position</label>
                <input
                  type="text"
                  className="form-control"
                  value={filterTitle}
                  onChange={(e) =>
                    setQuery((prev) => ({
                      ...prev,
                      filterTitle: e.target.value,
                    }))
                  }
                  placeholder="Enter job title"
                />
              </div>
              <div className="mb-1 col-12">
                <label className="form-label">Position Type</label>
                <select
                  className="form-select"
                  value={tempFilterJobType}
                  onChange={(e) => setTempFilterJobType(e.target.value)}
                >
                  <option value="">Select position type</option>
                  {job_types.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-1 col-12">
                <label className="form-label">School Type</label>
                <select
                  className="form-select"
                  value={tempFilterSchoolType}
                  onChange={(e) => setTempFilterSchoolType(e.target.value)}
                >
                  <option value="">Select school type</option>
                  {schoolTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-1 col-12">
                <div className="d-flex flex-wrap gap-2 mt-25">
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
        </div>
        {/* Jobs list - right side */}
        <div className="col-lg-9 col-md-8 col-sm-12">
          <div className="card card__tab__ mb-3">
            <div className="d-flex align-items-center">
              <ul className="ul d-flex align-items-center">
                {statusTabs.map((tab) => {
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
                      {tabIcons[tab.key as keyof typeof tabIcons]}
                      <span>{tab.label}</span>
                      <span className="count__badge__">{count}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          {loading ? (
            <div
              style={{
                minHeight: "200px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : jobsData.length === 0 ? (
            <div
              className="d-flex flex-column align-items-center justify-content-center"
              style={{ minHeight: 200 }}
            >
              {query.filterTitle ||
              query.filterjob_type ||
              query.filterSchoolType ? (
                <>
                  <div className="mb-2">No data found.</div>
                  <button
                    className="btn btn-outline-primary"
                    onClick={handleClearFilters}
                  >
                    Clear filters
                  </button>
                </>
              ) : (
                <>
                  <div className="mb-2">
                    No jobs found. Post a job to see here.
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowPostJobModal(true)}
                  >
                    Post Job
                  </button>
                  {/* Post Job Modal */}
                  {showPostJobModal && (
                    <div
                      className="modal fade show"
                      style={{ display: "block" }}
                      tabIndex={-1}
                    >
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title">Post Job</h5>
                            <button
                              type="button"
                              className="btn-close"
                              onClick={() => setShowPostJobModal(false)}
                            ></button>
                          </div>
                          <div className="modal-body">
                            {/* TODO: Add post job form here */}
                            <p>Post job form goes here.</p>
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => setShowPostJobModal(false)}
                            >
                              Close
                            </button>
                            <button type="button" className="btn btn-primary">
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="modal-backdrop fade show"></div>
                    </div>
                  )}
                </>
              )}
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
                    ...(job.is_expired ? { backgroundColor: "#FFEDED" } : {}),
                  }}
                  onClick={() => handleViewJobDetails(job.id)}
                >
                  <div className="card-body d-flex justify-content-between align-items-center">
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
                          <span className=" txt__regular__sub__">
                            Posted: {formatDateTime(job.date_posted).date} at{" "}
                            {formatDateTime(job.date_posted).time}
                          </span>
                          {typeof job.applications_count !== "undefined" && (
                            <span className=" text-success  txt__regular__sub__ d-block mt-1">
                              Applications: {job.applications_count}
                            </span>
                          )}
                        </div>
                        <h5 className="job-title d-flex align-items-center mb-1">
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

                          {activeTab === "active" &&
                            job.status === "applied" && (
                              <span className="badge bg-success  txt__regular__sub__ ml-2">
                                Applied
                              </span>
                            )}
                        </h5>
                        <p className="job-school  mb-1">
                          {job_types.find((type) => type.value === job.job_type)
                            ?.label || job.job_type}
                          {job.job_type && job.location && " • "}
                          {job.school_name}
                          {job.school_name && job.location && " • "}
                          {job.location}{" "}
                        </p>

                        <div
                          className="job-description mb-0"
                          style={{ overflowWrap: "anywhere" }}
                        >
                          {/* Truncate HTML to 200 characters, preserving tags */}
                          <span
                            dangerouslySetInnerHTML={{
                              __html:
                                job.description.length > 200
                                  ? job.description.slice(0, 200) + "..."
                                  : job.description,
                            }}
                          />
                        </div>
                      </div>
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
      </div>
    </div>
  );
}

export default Jobs;
