import React from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { FaRegFileAlt, FaArrowRight, FaPlus } from "react-icons/fa";
import { HiLightBulb } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { Row, Col } from "react-bootstrap";
import "./JobDetail.css";
import { job_types } from "../../constants/jobOptions";

function JobDetail() {
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
  const { id } = useParams();
  const [job, setJob] = React.useState<any | null>(null);
  const [profile, setProfile] = React.useState<any | null>(null);
  // null = nothing selected, 'profile' = quick apply, 'upload' = upload resume
  const [applyMethod, setApplyMethod] = React.useState<
    null | "profile" | "upload"
  >(null);
  const [resumeFile, setResumeFile] = React.useState<File | null>(null);
  const [coverFile, setCoverFile] = React.useState<File | null>(null);
  // Expose fetchJobAndProfile for re-use after apply (must be inside component for state setters)
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
    try {
      const profileRes = await api.get("/profile");
      if (isMounted) setProfile(profileRes.data);
    } catch (e) {
      if (isMounted) setProfile(null);
    }
    return () => {
      isMounted = false;
    };
  }, [id, setJob, setFetchError, setLoading, setProfile]);
  React.useEffect(() => {
    fetchJobAndProfile();
    // eslint-disable-next-line
  }, [fetchJobAndProfile]);

  // Loader for apply button
  const [applying, setApplying] = React.useState(false);
  // Handler for job application
  const handleApplyJob = async () => {
    if (!job) return;
    setApplying(true);
    const formData = new FormData();
    if (applyMethod === "profile") {
      // User chose TIC profile, no validation, just send flag
      formData.append("use_profile_resume", "true");
      if (coverFile) {
        formData.append("cover_letter", coverFile);
      } else {
        formData.append("cover_letter", "");
      }
    } else if (applyMethod === "upload") {
      if (!resumeFile) {
        toast.error("Please upload a resume before applying.");
        setApplying(false);
        return;
      }
      formData.append("use_profile_resume", "false");
      formData.append("resume", resumeFile);
      if (coverFile) {
        formData.append("cover_letter", coverFile);
      } else {
        formData.append("cover_letter", "");
      }
    } else {
      toast.error("Please select an application method.");
      setApplying(false);
      return;
    }
    try {
      const accessToken = Cookies.get("access");
      const response = await api.post(`jobs/${job.id}/apply`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });
      if (response.status === 200 || response.status === 201) {
        toast.success("Application submitted successfully!");
        // Keep loader until new data is fetched
        setTimeout(async () => {
          setLoading(true);
          await fetchJobAndProfile();
          window.scrollTo({ top: 0, behavior: "smooth" });
          setApplying(false);
        }, 1200);
      } else if (
        response.status === 400 &&
        response.data &&
        response.data.error
      ) {
        toast.error(response.data.error);
        setApplying(false);
      } else {
        toast.error("Failed to submit application. Please try again.");
        setApplying(false);
      }
    } catch (error: any) {
      toast.error(error.data?.error || "An error occurred while applying.");
      console.error(error);
      setApplying(false);
    }
  };

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

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-lg-9 col-md-9 col-sm-12 col-12">
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
                    <span className="txt__regular__bold__">Position type:</span>{" "}
                    {job_types.find((t) => t.value === job.job_type)?.label ||
                      job.job_type}
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
                {Array.isArray(job.curriculum)
                  ? job.curriculum.filter((s: any) => s).join(", ")
                  : job.curriculum}
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

          {job.status !== "closed" && !job.is_expired && !job.is_applied && (
            <>
              {profile && profile.subscription_status === "none" && (
                <div className="card note_card mt-4 mb-4 p-3 text-center">
                  <div
                    className="mb-3"
                    style={{ fontWeight: 400, fontSize: 16 }}
                  >
                    This job requires Premium access. Upgrade now to submit your
                    application with enhanced visibility and priority review.
                  </div>
                  <button
                    onClick={() => navigate("/subscription-plans")}
                    className="btn btn-primary p-3 py-2 d-flex align-items-center justify-content-center mx-auto"
                    style={{
                      fontWeight: 600,
                      fontSize: 16,
                      width: "max-content",
                    }}
                  >
                    Subscribe <FaPlus style={{ marginLeft: 5 }} />
                  </button>
                </div>
              )}
              {profile && profile.subscription_status === "active" && (
                <div className="row mt-4">
                  {/* Quick Apply Card */}
                  <div className="col-md-12 col-lg-12 col-sm-12 mb-3">
                    <div className="card note_card h-100">
                      <div className="d-flex align-items-center">
                        <input
                          className="form-check-input me-2 m-0"
                          type="radio"
                          name="applyMethod"
                          id="quick-apply"
                          checked={applyMethod === "profile"}
                          onChange={() => {
                            setApplyMethod("profile");
                            setResumeFile(null);
                          }}
                          disabled={
                            job.is_applied ||
                            !profile ||
                            !profile.teacher_profile ||
                            !profile.teacher_profile.cv_file
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="quick-apply"
                        >
                          Quick Apply with TIC Profile
                        </label>
                      </div>
                      {/* Show file name if available */}
                      {profile &&
                        profile.teacher_profile &&
                        profile.teacher_profile.cv_file && (
                          <div className="fw-semibold mb-2 mt-2 pl-10">
                            {profile.teacher_profile.cv_file.split("/").pop()}
                          </div>
                        )}
                      {/* If no CV file, show a message */}
                      {profile &&
                        profile.teacher_profile &&
                        !profile.teacher_profile.cv_file && (
                          <div className="text-danger mb-2">
                            No CV found in your profile. Please upload a CV to
                            use Quick Apply.
                          </div>
                        )}
                    </div>
                  </div>
                  {/* Upload Resume Card */}
                  <div className="col-md-12 col-lg-12 col-sm-12 mb-3">
                    <div className="card note_card">
                      <div className="d-flex align-items-center mb-2">
                        <input
                          className="form-check-input me-2 m-0"
                          type="radio"
                          name="applyMethod"
                          id="upload-resume"
                          checked={applyMethod === "upload"}
                          onChange={() => {
                            setApplyMethod("upload");
                            setResumeFile(null);
                          }}
                          disabled={job.is_applied}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="upload-resume"
                        >
                          Upload Resume
                        </label>
                      </div>
                      <div className="mb-2">
                        <span className="txt__regular__">
                          Upload your updated resume for this application.
                        </span>
                      </div>
                      <div
                        className="upload-box__ d-flex flex-column align-items-center justify-content-center mb-2"
                        style={{
                          opacity: applyMethod === "upload" ? 1 : 0.3,
                          transition: "opacity 0.2s",
                        }}
                      >
                        <label
                          htmlFor="resume-upload"
                          className="upload-label__ w-100"
                        >
                          <span className="upload-icon__">
                            <FaRegFileAlt size={30} />
                          </span>
                          <span className="upload-text__">
                            Click here or drag and drop to upload
                          </span>
                          <span className="upload-note__">
                            Upload .pdf or .docx files
                          </span>
                          <input
                            id="resume-upload"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="upload-input__"
                            disabled={
                              job.is_expired || applyMethod !== "upload"
                            }
                            onChange={(e) => {
                              if (job.is_expired) return;
                              const file = e.target.files?.[0];
                              if (file) {
                                setResumeFile(file);
                              } else {
                                setResumeFile(null);
                              }
                            }}
                          />
                        </label>
                        <div className="mt-2">
                          {resumeFile && resumeFile.name && (
                            <div className="uploaded-file__ d-flex align-items-center">
                              <span className="file-name__">
                                {resumeFile.name}
                              </span>
                              <a
                                role="button"
                                className="ms-1"
                                onClick={() => {
                                  setResumeFile(null);
                                  const input = document.getElementById(
                                    "resume-upload"
                                  ) as HTMLInputElement | null;
                                  if (input) input.value = "";
                                }}
                              >
                                <IoClose
                                  style={{
                                    cursor: "pointer",
                                    fontSize: "22px",
                                  }}
                                />{" "}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="card note_card mb-2 mt-3">
                      {/* Cover Letter Upload (optional, always enabled, outside upload section) */}
                      <div className="w-100 mb-2">
                        <span className="txt__regular__">
                          <HiLightBulb
                            style={{
                              fontSize: 25,
                              marginBottom: 3,
                              color: "rgb(237 190 49)",
                              marginRight: 6,
                            }}
                          />
                          Applicants who include a cover letter are more likely
                          to get hired. (Optional)
                        </span>
                      </div>
                      <div className="upload-box__ d-flex flex-column align-items-center justify-content-center mb-2">
                        <label
                          htmlFor="cover-upload"
                          className="upload-label__ w-100"
                        >
                          <span className="upload-icon__">
                            <FaRegFileAlt size={30} />
                          </span>
                          <span className="upload-text__">
                            Upload Cover Letter (Optional)
                          </span>
                          <span className="upload-note__">
                            Upload .pdf or .docx files
                          </span>
                          <input
                            id="cover-upload"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="upload-input__"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setCoverFile(file);
                              } else {
                                setCoverFile(null);
                              }
                            }}
                          />
                        </label>
                        <div className="mt-2">
                          {coverFile && coverFile.name && (
                            <div className="uploaded-file__ d-flex align-items-center">
                              <span className="file-name__">
                                {coverFile.name}
                              </span>
                              <a
                                className="ms-1"
                                role="button"
                                onClick={() => {
                                  setCoverFile(null);
                                  const input = document.getElementById(
                                    "cover-upload"
                                  ) as HTMLInputElement | null;
                                  if (input) input.value = "";
                                }}
                              >
                                <IoClose
                                  style={{
                                    cursor: "pointer",
                                    fontSize: "22px",
                                  }}
                                />{" "}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <>
                    <div className="d-flex justify-content-end">
                      <button
                        className="btn btn-primary d-flex align-items-center justify-content-center"
                        onClick={handleApplyJob}
                        disabled={
                          applying ||
                          job.is_applied ||
                          applyMethod === null ||
                          (applyMethod === "upload" &&
                            (!resumeFile || !resumeFile.name))
                        }
                        style={{ minWidth: 100 }}
                      >
                        {applying ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Applying...
                          </>
                        ) : (
                          <>
                            Apply <FaArrowRight className="ms-1" />
                          </>
                        )}
                      </button>
                    </div>
                  </>
                </div>
              )}
            </>
          )}
        </div>

        {/* <div className="col-lg-3 col-md-3 col-sm-12 col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="text-center">School Information</h5>
              <div className="text-center">
                <img
                  src={job.school_avatar || "/tic/school_image.png"}
                  alt="School"
                  className="school-avatar img-fluid mb-3"
                />
              </div>
              <p className="text-muted small mb-1">
                <FaLocationArrow style={{ marginRight: 4 }} /> {job.location}
              </p>
              <p className="text-muted small">
                Posted: {formatDateTime(job.date_posted).date} -{" "}
                {formatDateTime(job.date_posted).time}
              </p>
              <div className="mt-3">
                <a
                  href={`/school/${job.school_id}`}
                  className="btn btn-outline-primary w-100"
                >
                  View School Profile
                </a>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default JobDetail;
