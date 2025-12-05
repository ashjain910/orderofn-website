import React from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { FaLocationArrow, FaRegFileAlt, FaArrowRight } from "react-icons/fa";
import "./JobDetail.css";

function JobDetail() {
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
  const [resumeFile, setResumeFile] = React.useState<File | null>(null);
  const [coverFile, setCoverFile] = React.useState<File | null>(null);

  const hasFetched = React.useRef(false);
  React.useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    const fetchJob = async () => {
      try {
        const response = await api.get(`/jobs/${id}`);
        setJob(response.data);
        setFetchError(null);
      } catch (error: any) {
        setJob(null);
        setFetchError("Job not found");
        if (error?.response?.data) {
          toast.error(error.response.data);
        } else {
          toast.error("Failed to fetch job details.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  // Handler for job application
  const handleApplyJob = async () => {
    if (!job) return;
    const formData = new FormData();
    if (resumeFile) formData.append("resume", resumeFile);
    if (coverFile) formData.append("cover_letter", coverFile);
    try {
      const accessToken = Cookies.get("access");
      await api.post(`jobs/${job.id}/apply`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });
      toast.success("Application submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit application.");
      console.error(error);
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
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-lg-9 col-md-9 col-sm-9 col-12">
                  <div className="d-flex" style={{ width: "100%" }}>
                    <div className="posted_div">
                      <span className="text-muted small">
                        Posted: {formatDateTime(job.date_posted).date} -{" "}
                        {formatDateTime(job.date_posted).time}
                      </span>
                    </div>
                    <img
                      src={job.school_avatar || "/tic/school_image.png"}
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
                        {job.is_expired && (
                          <span className="expired__badge__ ms-2">Expired</span>
                        )}
                        {/* Applied status for all jobs tab */}
                        {job.status === "applied" && (
                          <span className="badge bg-success  txt__regular__sub__ ml-2">
                            Applied
                          </span>
                        )}
                      </h5>
                      <p className="job-school">{job.school_name}</p>
                      <p className="job-school mb-1">
                        <FaLocationArrow style={{ marginRight: 4 }} />{" "}
                        {job.location}
                      </p>
                      {/* <div className="text-muted small mb-1">
                           <FaLocationArrow style={{ marginRight: 4 }} />
                           {job.location} &bull; Posted: {job.datePosted}
                         </div> */}
                      {/* <div className="text-muted small mb-1">
                           {job.location} &bull; Posted: {job.datePosted}
                         </div> */}
                    </div>
                  </div>
                </div>
                {/* 
                <div className="col-lg-3 col-md-4 col-sm-4 col-12">
                  <button className="btn btn-light btn-sm" title="Share Job">
                    <FaShareAlt />
                  </button>
                  <button className="btn btn-light btn-sm" title="Save Job">
                    {job.status === "saved" ? (
                      <FaBookmark />
                    ) : (
                      <FaRegBookmark />
                    )}
                  </button>
                </div> */}
              </div>
            </div>
            <ul className="ul txt__regular__">
              <div className="row px-20">
                <div className="col-lg-3 col-md-3 col-sm-4 col-6 list-item">
                  <li>
                    <h4 className="job__headings__ mt-3">Job type</h4>
                    <p className="job-description mb-0">{job.job_type}</p>
                  </li>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-4 col-6 list-item">
                  <li>
                    <h4 className="job__headings__ mt-3">Level</h4>
                    <p className="job-description mb-0">{job.level}</p>
                  </li>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-4 col-6 list-item">
                  <li>
                    <h4 className="job__headings__ mt-3">Closing Date</h4>
                    <p className="job-description mb-0">{job.closing_date}</p>
                  </li>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-4 col-6 list-item">
                  <li>
                    <h4 className="job__headings__ mt-3">Subjects</h4>
                    <p className="job-description mb-0">{job.subjects}</p>
                  </li>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-12 list-item">
                  <li>
                    <h4 className="job__headings__ mt-3">Job requirements</h4>
                    <p className="job-description mb-0">{job.requirements}</p>
                  </li>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-12 list-item">
                  <li>
                    <h4 className="job__headings__ mt-3">Job summary</h4>
                    <p className="job-description mb-0">{job.summary}</p>
                  </li>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-12 list-item">
                  <li>
                    <h4 className="job__headings__ mt-3">Job description</h4>
                    <p className="job-description mb-0">{job.description}</p>
                  </li>
                </div>
              </div>
            </ul>
          </div>

          <div className="card mt-3">
            <div className="col-lg-12 col-md-12 col-sm-12 col-12 ">
              <li className="job__headings__">
                Quick apply to this job with your TIC profile. You may also
                upload your updated resume and cover letter if you wish to do
                so.
              </li>
              <div className="upload-box__ mt-3 d-flex flex-column align-items-center justify-content-center">
                <label htmlFor="resume-upload" className="upload-label__">
                  <span className="upload-icon__">
                    <FaRegFileAlt />
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
                    disabled={job.is_expired}
                    onChange={(e) => {
                      if (job.is_expired) return;
                      const file = e.target.files?.[0];
                      if (file) {
                        setResumeFile(file);
                      }
                    }}
                  />
                </label>
                {resumeFile && (
                  <div className="uploaded-file__ mt-2 d-flex align-items-center">
                    <b className="me-2 txt__regular__ text-success">
                      {resumeFile.name}
                    </b>
                    <button
                      type="button"
                      className="btn  p-0 text-danger"
                      title="Remove file"
                      onClick={() => setResumeFile(null)}
                      style={{ fontSize: 24 }}
                    >
                      &times;
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="card mt-3">
            <div className="col-lg-12 col-md-12 col-sm-12 col-12 ">
              <li className="job__headings__">
                Applicants who include a cover letter are more likely to get
                hired.
              </li>
              <div className="upload-box__ mt-3 d-flex flex-column align-items-center justify-content-center">
                <label htmlFor="cover-upload" className="upload-label__">
                  <span className="upload-icon__">
                    <FaRegFileAlt />
                  </span>
                  <span className="upload-text__">
                    Click here or drag and drop to upload
                  </span>
                  <span className="upload-note__">
                    Upload .pdf or .docx files
                  </span>
                  <input
                    id="cover-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="upload-input__"
                    disabled={job.is_expired}
                    onChange={(e) => {
                      if (job.is_expired) return;
                      const file = e.target.files?.[0];
                      if (file) {
                        setCoverFile(file);
                      }
                    }}
                  />
                </label>
                {coverFile && (
                  <div className="uploaded-file__ mt-2 d-flex align-items-center">
                    <b className="me-2 txt__regular__ text-success">
                      {coverFile.name}
                    </b>
                    <button
                      type="button"
                      className="btn  p-0 text-danger"
                      title="Remove file"
                      onClick={() => setCoverFile(null)}
                      style={{ fontSize: 24 }}
                    >
                      &times;
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="card mt-3">
            <div className="col-lg-12 col-md-12 col-sm-12 col-12 ">
              <li className="txt__regular__">
                This application is to apply to be on the school's casual list.
                Make sure your availability is up to date before applying.
              </li>
              <li className="txt__regular__ mt-3">
                By applying for this position, you are giving permission to
                share your TIC profile with this school.
              </li>
              <div className="d-flex justify-content-end">
                {!job.is_applied && !job.is_expired && (
                  <button
                    className="btn btn-primary mt-3 mb-3 px-4 "
                    onClick={handleApplyJob}
                  >
                    <FaArrowRight style={{ marginRight: 10 }} />
                    Apply job
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetail;
