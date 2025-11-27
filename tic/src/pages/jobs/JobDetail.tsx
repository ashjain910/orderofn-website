import React from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  FaShareAlt,
  FaRegBookmark,
  FaBookmark,
  FaLocationArrow,
  FaRegFileAlt,
  FaArrowRight,
} from "react-icons/fa";
import "./JobDetail.css";
// import { right } from "@popperjs/core";

function JobDetail({ jobsData }: { jobsData: any[] }) {
  const { id } = useParams();
  const location = useLocation();
  const job =
    location.state?.job ||
    (jobsData && jobsData.find((j) => String(j.id) === id));

  // State for uploaded files
  const [resumeFile, setResumeFile] = React.useState<File | null>(null);
  const [coverFile, setCoverFile] = React.useState<File | null>(null);

  if (!job) {
    return (
      <div className="container mt-5">
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
                    <img
                      src={job.avatar || "/assets/default-avatar.png"}
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
                        {job.job_status === "expired" && (
                          <span className="expired__badge__ ms-2">Expired</span>
                        )}
                        {/* Applied status for all jobs tab */}
                        {job.status === "applied" && (
                          <span className="badge bg-success  txt__regular__sub__ ml-2">
                            Applied
                          </span>
                        )}
                      </h5>
                      <p className="job-school">{job.title}</p>
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
                    </div>
                  </div>
                </div>

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
                </div>
              </div>
            </div>
            <ul className="ul txt__regular__">
              <div className="row px-20">
                <div className="col-lg-3 col-md-3 col-sm-4 col-6 list-item">
                  <li>
                    <h4 className="job__headings__ mt-3">Job summary</h4>
                    <p className="job-description mb-0">{job.job_status}</p>
                  </li>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-4 col-6 list-item">
                  <li>
                    <h4 className="job__headings__ mt-3">Level</h4>
                    <p className="job-description mb-0">{job.job_status}</p>
                  </li>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-4 col-6 list-item">
                  <li>
                    <h4 className="job__headings__ mt-3">Closing Date</h4>
                    <p className="job-description mb-0">{job.job_status}</p>
                  </li>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-4 col-6 list-item">
                  <li>
                    <h4 className="job__headings__ mt-3">Subjects</h4>
                    <p className="job-description mb-0">{job.job_status}</p>
                  </li>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-12 list-item">
                  <li>
                    <h4 className="job__headings__ mt-3">Job summary</h4>
                    <p className="job-description mb-0">{job.description}</p>
                  </li>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-12 list-item">
                  <li>
                    <h4 className="job__headings__ mt-3">
                      Who we are looking for
                    </h4>
                    <ul className="txt__regular__ pl-1 list_none_">
                      <li>
                        Retired teachers or teacher aides are warmly welcomed
                      </li>
                      <li>
                        Must be patient, responsible and committed to helping
                        students succeed
                      </li>
                      <li>
                        Passionate about education and working with children 
                      </li>
                    </ul>
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
                    onChange={(e) => {
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
                    onChange={(e) => {
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
                <button className="btn btn-primary mt-3 mb-3 px-4 ">
                  <FaArrowRight style={{ marginRight: 10 }} />
                  Apply job
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetail;
