import { useState, useEffect } from "react";
import AdminBaseApi from "../../services/admin-base";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { MdLocationPin } from "react-icons/md";
import { useNavigate } from "react-router-dom";

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
}

function Jobs() {
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
      filterTitle: prev.filterTitle,
      filterjob_type: prev.filterjob_type,
      filterSchoolType: prev.filterSchoolType,
    }));
  };

  const handleClearFilters = () => {
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
  const {
    tab: activeTab,
    page,
    filterTitle,
    filterjob_type,
    filterSchoolType,
  } = query;

  return (
    <div className="container">
      <div className="row">
        {/* Filter section - left side */}
        <div className="col-lg-3 col-md-4 col-sm-12 mb-3">
          <div className="card mb-3">
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
                  value={filterjob_type}
                  onChange={(e) =>
                    setQuery((prev) => ({
                      ...prev,
                      filterjob_type: e.target.value,
                    }))
                  }
                >
                  <option value="">Select job type</option>
                  {/* ...existing code... */}
                </select>
              </div>
              <div className="mb-1 col-12">
                <label className="form-label">School Type</label>
                <select
                  className="form-select"
                  value={filterSchoolType}
                  onChange={(e) =>
                    setQuery((prev) => ({
                      ...prev,
                      filterSchoolType: e.target.value,
                    }))
                  }
                >
                  <option value="">Select school type</option>
                  {/* ...existing code... */}
                </select>
              </div>
              <div className="mb-1 col-12">
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
          ) : (
            <>
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
                        <div className="posted_div">
                          <span className="text-muted small">
                            Posted: {formatDateTime(job.date_posted).date} at{" "}
                            {formatDateTime(job.date_posted).time}
                          </span>
                          {typeof job.applications_count !== "undefined" && (
                            <span className="text-muted small d-block mt-1">
                              Applications: {job.applications_count}
                            </span>
                          )}
                        </div>
                        <h5 className="job-title d-flex align-items-center mb-1">
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

                          {activeTab === "active" &&
                            job.status === "applied" && (
                              <span className="badge bg-success  txt__regular__sub__ ml-2">
                                Applied
                              </span>
                            )}
                        </h5>
                        <p className="job-school  mb-1">{job.school_name}</p>
                        <p className="job-school mb-1">
                          <MdLocationPin style={{ marginRight: 4 }} />{" "}
                          {job.location}
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
