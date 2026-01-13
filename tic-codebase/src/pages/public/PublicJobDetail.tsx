import React from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import "./publicJobDetails.css";
import { job_types } from "../../constants/jobOptions";
import { FaArrowLeft } from "react-icons/fa6";
import { POSITIONTYPE_OPTIONS } from "../../common/subjectOptions";
import PublicHeader from "./PublicHeader";

function JobDetail() {
  // Get job id from params (must be before any use of id)
  const { id } = useParams();

  // Similar jobs state
  const [similarJobs, setSimilarJobs] = React.useState<any[]>([]);
  const [similarLoading, setSimilarLoading] = React.useState(true);

  // Fetch similar jobs (reuse jobs page logic, but exclude current job)
  React.useEffect(() => {
    const fetchSimilarJobs = async () => {
      setSimilarLoading(true);
      try {
        const params: any = {
          page: 1,
          action: "init",
          page_size: 5,
          status: "active",
          is_expired: false,
        };
        const response = await api.get("/jobs", { params });
        // Exclude current job from similar jobs
        const jobs = (response.data.results || []).filter(
          (j: any) => String(j.id) !== String(id)
        );
        setSimilarJobs(jobs);
      } catch (e) {
        setSimilarJobs([]);
      } finally {
        setSimilarLoading(false);
      }
    };
    fetchSimilarJobs();
  }, [id]);
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [fetchError, setFetchError] = React.useState<string | null>(null);
  // Toast import
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
  const [job, setJob] = React.useState<any | null>(null);
  // null = nothing selected, 'profile' = quick apply, 'upload' = upload resume

  const fetchJobAndProfile = React.useCallback(async () => {
    let isMounted = true;
    try {
      const response = await api.get(`/jobs/${id}`);
      if (isMounted) {
        setJob(response.data);
        setFetchError && setFetchError(null);
      }
    } catch (error: any) {
      if (isMounted) {
        setJob(null);
        setFetchError && setFetchError("Job not found");
        if (error?.response?.data) {
          toast.error(error.response.data);
        } else {
          toast.error("Failed to fetch job details.");
        }
      }
    } finally {
      if (isMounted) setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [id, setJob, setFetchError, setLoading]);
  React.useEffect(() => {
    fetchJobAndProfile();
    // eslint-disable-next-line
  }, [fetchJobAndProfile]);

  // Loader for apply button

  if (loading) {
    return (
      <div
        className="container"
        style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  if (fetchError || !job) {
    return (
      <div
        className="container"
        style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h2>Job not found</h2>
      </div>
    );
  }

  // Helper to get a stable color based on job id (or any number)
  function getAvatarColor(id: number): React.CSSProperties["backgroundColor"] {
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
    if (typeof id !== "number" || isNaN(id)) return colors[0];
    return colors[Math.abs(id) % colors.length];
  }
  return (
    <>
      <PublicHeader />
      <div className="container mt-3">
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12 col-12 mb-3 mt-2">
            <a
              style={{ textDecoration: "none", width: "fit-content" }}
              role="button"
              href="/#/public-jobs"
              className=""
            >
              <FaArrowLeft style={{ marginRight: 5 }} />
              Back to Jobs
            </a>
          </div>
          <div className="col-lg-9 col-md-9 col-sm-12 col-12">
            {/* <div className="card note_card mb-3">
            <p className="txt__regular__">
              Applicants who include a cover letter are more likely to get
              hired.
            </p>
          </div> */}
            {/* <hr></hr> */}
            {/* Job Title Section */}
            <div className="card">
              <Row className="mb-2">
                <Col md={12}>
                  <p className="">
                    {job.is_expired && (
                      <span className="badge bg-danger txt__regular__ mb-2 me-2">
                        Job Expired
                      </span>
                    )}
                    {job.status == "closed" && (
                      <span className="badge bg-secondary txt__regular__ mb-2  me-2">
                        Job Closed
                      </span>
                    )}
                    {job.is_applied && (
                      <span className="badge bg-success  txt__regular__ mb-2  me-2">
                        Applied
                      </span>
                    )}
                  </p>
                  <h3 className="mb-1 job-title">{job.title}</h3>
                  <div className="text-muted">
                    {job.school_name} • {job.location}
                  </div>
                  <div className="text-muted small">
                    Posted - {formatDateTime(job.date_posted).date} -{" "}
                    {formatDateTime(job.date_posted).time}
                  </div>
                  <div className="mb-1 d-flex flex-wrap  align-items-center">
                    <div className="job-info-item txt__regular__ me-4 mt-2">
                      <span className="txt__regular__bold__">
                        Position type:
                      </span>{" "}
                      {POSITIONTYPE_OPTIONS.find(
                        (t) => t.value === job.job_type
                      )?.label || job.job_type}
                    </div>
                  </div>
                  <div className="mb-1 d-flex flex-wrap  align-items-center">
                    <div className="job-info-item txt__regular__ me-4 mt-2">
                      <span className="txt__regular__bold__">Subjects:</span>{" "}
                      {Array.isArray(job.subjects)
                        ? job.subjects.filter((s: any) => s).join(", ")
                        : job.subjects}
                    </div>
                  </div>
                </Col>

                {/* <Col
                md={4}
                className="d-flex justify-content-md-end justify-content-start mt-3 mt-md-0 gap-2"
              >
                <Button variant="primary">Quick Apply with TIC Profile</Button>
              </Col> */}
              </Row>

              {/* Job Info Row - Simple List */}
              <div className="mb-1 d-flex flex-wrap  align-items-center">
                <div className="job-info-item txt__regular__ me-4 ">
                  <span className="txt__regular__bold__">Education Stage:</span>{" "}
                  {Array.isArray(job.education_stage)
                    ? job.education_stage.filter((s: any) => s).join(", ")
                    : job.education_stage}
                </div>
              </div>
              {/* Job Info Row - Simple List */}
              <div className="mb-1 d-flex flex-wrap  align-items-center">
                <div className="job-info-item txt__regular__ me-4 mt-2">
                  <span className="txt__regular__bold__">Curriculum:</span>{" "}
                  {(() => {
                    let curr = job.curriculum;
                    // If curriculum is a string, try to parse
                    if (typeof curr === "string") {
                      try {
                        const parsed = JSON.parse(curr);
                        if (Array.isArray(parsed)) curr = parsed;
                      } catch {
                        // not JSON, leave as is
                      }
                    }
                    // If curriculum is an array, check for stringified arrays inside
                    if (Array.isArray(curr)) {
                      // Flatten any stringified arrays inside
                      let flat: any[] = [];
                      curr.forEach((item: any) => {
                        if (typeof item === "string" && item.startsWith("[")) {
                          try {
                            const parsed = JSON.parse(item);
                            if (Array.isArray(parsed)) {
                              flat.push(...parsed);
                            } else {
                              flat.push(item);
                            }
                          } catch {
                            flat.push(item);
                          }
                        } else {
                          flat.push(item);
                        }
                      });
                      return flat
                        .filter((s: any) => s)
                        .map((c: any) =>
                          typeof c === "object" && c.label ? c.label : c
                        )
                        .join(", ");
                    }
                    return curr;
                  })()}
                </div>
              </div>
              {/* Job Info Row - Simple List */}
              <div className="mb-4 d-flex flex-wrap  align-items-center">
                <div className="job-info-item me-4 txt__regular__ mt-2">
                  <span className="txt__regular__bold__">Contract Type:</span>{" "}
                  {job.contract_type}
                </div>
                <div className="job-info-item me-4 txt__regular__ mt-2">
                  <span className="txt__regular__bold__">Package:</span>{" "}
                  {job.package}
                </div>

                <div className="job-info-item  me-4  mt-2 txt__regular__">
                  <span className="txt__regular__bold__">Job start date:</span>{" "}
                  {job.job_start_date}
                </div>
                <div className="job-info-item mt-2 txt__regular__">
                  <span className="txt__regular__bold__">Close date:</span>{" "}
                  {job.closing_date}
                </div>
              </div>

              {/* Overview */}
              <div className="mb-4">
                <h5 className="job-sub-title mb-2">Summary</h5>
                <p
                  className="text-muted txt__regular__"
                  dangerouslySetInnerHTML={{ __html: job.summary }}
                ></p>
              </div>
              {/* Overview */}
              <div className="mb-4">
                <h5 className="job-sub-title mb-2">Requirements</h5>
                <p
                  className="text-muted txt__regular__"
                  dangerouslySetInnerHTML={{ __html: job.requirements }}
                ></p>
              </div>
              <div className="mb-4">
                <h5 className=" job-sub-title mb-2">Description</h5>
                <p
                  className="text-muted txt__regular__"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                ></p>
              </div>
            </div>

            <>
              <div className="card note_card mt-4 mb-4 p-3 text-center">
                <div className="txt-muted text-center">
                  <h6 className="fw-bold mb-2">
                    Create your account to apply for jobs and receive the latest
                    job alerts.
                  </h6>
                  <div className="mb-3">
                    Hundreds of international schools and education
                    organisations use Teachers International Consultancy to find
                    top teaching talent.
                  </div>
                  <button
                    onClick={() => navigate("/pre-register")}
                    className="btn btn-primary mt-1 me-2"
                  >
                    Sign up
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className="btn btn-primary mt-1"
                  >
                    Already have an account? Log in
                  </button>
                </div>
              </div>
            </>
          </div>

          <div className="col-lg-3 col-md-3 col-sm-12 col-12">
            <div className="card shadow-sm border-0 job-simi-card mb-4">
              <div className="card-body p-2">
                <h5 className=" mb-3">Similar Jobs</h5>
                {similarLoading ? (
                  <div className="text-center py-3">
                    <div
                      className="spinner-border text-primary"
                      role="status"
                      style={{ width: 24, height: 24 }}
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : similarJobs.length === 0 ? (
                  <div className="text-muted text-center py-3">
                    No similar jobs found.
                  </div>
                ) : (
                  <div>
                    {similarJobs.slice(0, 7).map((sj, idx, arr) => (
                      <div
                        key={sj.id}
                        className="d-flex align-items-start p-2 mt-2 mb-2 rounded hover-bg-light"
                        style={{
                          cursor: "pointer",
                          transition: "background 0.2s",
                          borderBottom:
                            idx !== arr.length - 1
                              ? "1px solid #e5e5e5"
                              : undefined,
                          marginBottom: idx !== arr.length - 1 ? 0 : undefined,
                        }}
                        onClick={() => navigate(`/public-jobs/${sj.id}`)}
                      >
                        <div
                          className="rounded-circle me-2 d-flex align-items-center justify-content-center"
                          style={{
                            width: 40,
                            height: 40,
                            backgroundColor: getAvatarColor(sj.id || 0),
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: 16,
                            textTransform: "uppercase",
                            flexShrink: 0,
                            userSelect: "none",
                          }}
                        >
                          {sj.title?.slice(0, 2) || "?"}
                        </div>
                        <div className="flex-grow-1">
                          <h6
                            className="mb-0 fw-semibold"
                            style={{ fontSize: 16 }}
                          >
                            {sj.title || "Job Title"}
                          </h6>
                          <small className="text-muted">
                            {sj.school_name && sj.school_name + " |"}{" "}
                            {sj.location || ""}
                          </small>

                          <div className="small">
                            <span>Position - </span>
                            {job_types.find((t) => t.value === sj.job_type)
                              ?.label ||
                              sj.job_type ||
                              "Not specified"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default JobDetail;
