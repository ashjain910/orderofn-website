// Helper to get a random color based on job title
function getRandomColor(str: string) {
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
    "#343a40", // darkk
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}
import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { FaChevronDown } from "react-icons/fa";
import { useParams } from "react-router-dom";
import AdminBaseApi from "../../services/admin-base";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TeacherProfileModal from "../../components/TeacherProfileModal";
import PostJobModal from "../../components/admin/PostJobModal";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import { toastOptions } from "../../utils/toastOptions";
import { POSITIONTYPE_OPTIONS } from "../../common/subjectOptions";

// Minimal ResumeModalState type
type ResumeModalState = {
  show: boolean;
  url: string | null;
  name: string;
};
function AdminJobDetail() {
  const navigate = useNavigate();
  // Loader for interview invitation
  // Interview modal validation state (must be at top level)
  const [interviewErrors, setInterviewErrors] = useState({
    interview_date: "",
    interview_time: "",
    interview_format: "",
    interview_panel: "",
  });
  // Interview modal state
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  type InterviewFormState = {
    applicationId: number | null;
    interview_date: Date | null;
    interview_time: string;
    interview_format: string;
    interview_panel: string;
  };
  const [interviewForm, setInterviewForm] = useState<InterviewFormState>({
    applicationId: null,
    interview_date: null,
    interview_time: "",
    interview_format: "",
    interview_panel: "",
  });
  // Track loading state for status change per applicant
  const [statusLoadingIdx, setStatusLoadingIdx] = useState<number | null>(null);
  // State for confirmation modal
  const [showCloseModal, setShowCloseModal] = useState(false);

  // State for resume preview modal
  const [resumeModal, setResumeModal] = useState<ResumeModalState>({
    show: false,
    url: null,
    name: "Resume",
  });
  // Track which applicant's resume is being viewed
  const [selectedResumeApplicant, setSelectedResumeApplicant] = useState<
    any | null
  >(null);
  // State for cover letter preview modal
  const [coverLetterModal, setCoverLetterModal] = useState<ResumeModalState>({
    show: false,
    url: null,
    name: "Cover Letter",
  });
  // Handler for closing job with confirmation modal
  const handleCloseJob = async () => {
    if (!job?.id) return;
    setShowCloseModal(true);
  };
  window.addEventListener("unhandledrejection", (event) => {
    if (event.reason?.name === "AbortError") {
      event.preventDefault();
    }
  });
  // Actual close job action
  const confirmCloseJob = async () => {
    if (!job?.id) return;
    setLoading(true);
    setShowCloseModal(false);
    try {
      const closingDate = job.closing_date || new Date();
      const formattedDate =
        typeof closingDate === "string"
          ? closingDate
          : `${closingDate.getFullYear()}-${String(
              closingDate.getMonth() + 1,
            ).padStart(2, "0")}-${String(closingDate.getDate()).padStart(
              2,
              "0",
            )}`;
      const response = await AdminBaseApi.patch(`/jobs/${job.id}/update`, {
        status: "closed",
        closing_date: formattedDate,
      });
      if (response.status === 200) {
        toast.success(
          response.data?.message || "Job closed successfully",
          toastOptions,
        );
        // Refetch job details
        const jobRes = await AdminBaseApi.get(`/jobs/${job.id}`);
        if (jobRes.data) {
          setJob(jobRes.data);
          if (Array.isArray(jobRes.data.applications)) {
            setTeachers(jobRes.data.applications);
          } else {
            setTeachers([]);
          }
        }
      } else {
        toast.error("Failed to close job", toastOptions);
      }
    } catch (err) {
      toast.error("Failed to close job", toastOptions);
    }
    setLoading(false);
  };
  // const positionTypeOptions = [
  //   { value: "teacher", label: "Teacher" },
  //   { value: "deputy_principal", label: "Deputy Principal" },
  //   { value: "head_of_school", label: "Head of School" },
  // ];
  const schoolTypeMultiOptions = [
    { value: "public", label: "Public" },
    { value: "international", label: "International" },
  ];

  interface Option {
    value: string;
    label: string;
  }

  function getLabelFromOptions(value: string, options: Option[]): string {
    if (!value) return "";
    const found = options.find((opt) => opt.value === value);
    return found ? found.label : value;
  }
  const [loading, setLoading] = React.useState(true);
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
  // Teachers state will be set from API job.applications
  const [teachers, setTeachers] = useState<any[]>([]);
  // ... keep other state and logic ...

  // ... other state and logic ...

  const [job, setJob] = React.useState<any | null>(null);

  // Email stats: fetch from jobs/<job_id>/email-logs
  type EmailSentTo = {
    name: string;
    email: string;
    sent_at?: string;
  };
  const [emailsSentTo, setEmailsSentTo] = useState<EmailSentTo[]>([]);
  useEffect(() => {
    if (!job?.id) return;
    const fetchEmailLogs = async () => {
      try {
        const res = await AdminBaseApi.get(`/jobs/${job.id}/email-logs`);
        if (res.data && Array.isArray(res.data.emails)) {
          setEmailsSentTo(
            res.data.emails.map((e: any) => ({
              name:
                e.name ||
                e.full_name ||
                e.applicant_name ||
                e.email ||
                "Unknown",
              email: e.email,
              sent_at: e.sent_at,
            })),
          );
        } else {
          setEmailsSentTo([]);
        }
      } catch {
        setEmailsSentTo([]);
      }
    };
    fetchEmailLogs();
  }, [job?.id]);
  const [sortBy, setSortBy] = useState<string>("");
  const [filterBy, setFilterBy] = useState<string>("");
  const [dropdownOpenIdx, setDropdownOpenIdx] = useState<number | null>(null);
  // Close dropdown on outside click
  React.useEffect(() => {
    if (dropdownOpenIdx === null) return;
    const handleClick = (e: MouseEvent) => {
      // Only close if click is outside any dropdown menu or trigger
      const dropdowns = document.querySelectorAll(".dropdown-menu.show");
      let clickedInside = false;
      dropdowns.forEach((dropdown) => {
        if (dropdown.contains(e.target as Node)) clickedInside = true;
      });
      // Also check triggers
      const triggers = document.querySelectorAll("[data-dropdown-trigger]");
      triggers.forEach((trigger) => {
        if (trigger.contains(e.target as Node)) clickedInside = true;
      });
      if (!clickedInside) setDropdownOpenIdx(null);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpenIdx]);
  const { id } = useParams();

  // const navigate = useNavigate();
  // const navigate = useNavigate();

  const hasFetched = React.useRef(false);
  React.useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    const fetchJob = async () => {
      try {
        const response = await AdminBaseApi.get(`/jobs/${id}`);
        if (response.data) {
          setJob(response.data);
          // Set teachers from API applications array
          if (
            response.data.applications &&
            Array.isArray(response.data.applications)
          ) {
            setTeachers(response.data.applications);
          } else {
            setTeachers([]);
          }
        }
      } catch (error) {
        setTeachers([]);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  // Remove API call for filterBy, filter on frontend

  // Filtering and sorting logic
  let sortedTeachers = filterBy
    ? teachers.filter((t) => t.status === filterBy)
    : [...teachers];
  if (["accepted", "reviewed", "pending", "rejected"].includes(sortBy)) {
    sortedTeachers = sortedTeachers.sort((a, b) => {
      if (a.status === sortBy && b.status !== sortBy) return -1;
      if (a.status !== sortBy && b.status === sortBy) return 1;
      return 0;
    });
  } else if (sortBy === "date") {
    // Accept DD-MM-YYYY, YYYY-MM-DD, or fallback to earliest date if invalid
    const parseDate = (d: string | undefined | null) => {
      if (!d || typeof d !== "string") return new Date(0).getTime();
      let parts = d.split("-");
      if (parts.length === 3) {
        // Try DD-MM-YYYY
        let [p1, p2, p3] = parts.map(Number);
        // If year is first (YYYY-MM-DD)
        if (p1 > 1900 && p1 < 2100) {
          return new Date(p1, p2 - 1, p3).getTime();
        }
        // If year is last (DD-MM-YYYY)
        if (p3 > 1900 && p3 < 2100) {
          return new Date(p3, p2 - 1, p1).getTime();
        }
      }
      // Fallback: treat as earliest
      return new Date(0).getTime();
    };
    sortedTeachers = sortedTeachers.sort((a, b) => {
      return parseDate(a.applied_at) - parseDate(b.applied_at);
    });
  }

  const [showEditModal, setShowEditModal] = useState(false);
  const [repostMode, setRepostMode] = useState(false);
  // Open edit modal for edit or repost
  const handleEditJob = (isRepost = false) => {
    setRepostMode(isRepost);
    setShowEditModal(true);
  };

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);

  // Add a state for doc viewer error
  const [docError, setDocError] = useState<string | null>(null);

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
  if (!job) {
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

  return (
    <div className="container-fluid mt-5">
      {/* Interview Scheduling Modal (rendered once at root) */}
      {showInterviewModal && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
          tabIndex={-1}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Schedule Interview</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowInterviewModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    // Validate form
                    let errors = {
                      interview_date: "",
                      interview_time: "",
                      interview_format: "",
                      interview_panel: "",
                    };
                    let hasError = false;
                    if (!interviewForm.interview_date) {
                      errors.interview_date = "Interview date is required";
                      hasError = true;
                    }
                    if (!interviewForm.interview_time) {
                      errors.interview_time = "Interview time is required";
                      hasError = true;
                    }
                    if (!interviewForm.interview_format) {
                      errors.interview_format = "Interview format is required";
                      hasError = true;
                    }
                    if (!interviewForm.interview_panel) {
                      errors.interview_panel = "Interview panel is required";
                      hasError = true;
                    }
                    setInterviewErrors(errors);
                    if (hasError) return;

                    // Prepare payload
                    const payload = {
                      interview_date: interviewForm.interview_date
                        ? interviewForm.interview_date
                            .toISOString()
                            .split("T")[0]
                        : null,
                      interview_time: interviewForm.interview_time,
                      interview_format: interviewForm.interview_format,
                      interview_panel: interviewForm.interview_panel,
                    };
                    try {
                      // Assume endpoint: /applications/<applicationId>/schedule-interview
                      const res = await AdminBaseApi.post(
                        `/applications/${interviewForm.applicationId}/schedule-interview`,
                        payload,
                      );
                      if (res.status === 200 || res.status === 201) {
                        toast.success(
                          "Interview scheduled successfully",
                          toastOptions,
                        );
                        setShowInterviewModal(false);
                        // Optionally update teacher/interview state here
                        // Refetch job/applications if needed
                        const response = await AdminBaseApi.get(
                          `/jobs/${job.id}`,
                        );
                        if (response.data) {
                          setJob(response.data);
                          if (
                            response.data.applications &&
                            Array.isArray(response.data.applications)
                          ) {
                            setTeachers(response.data.applications);
                          } else {
                            setTeachers([]);
                          }
                        }
                      } else {
                        toast.error(
                          "Failed to schedule interview",
                          toastOptions,
                        );
                      }
                    } catch (err) {
                      toast.error("Failed to schedule interview", toastOptions);
                    }
                  }}
                >
                  <div className="mb-3">
                    <label className="form-label">Interview Date</label>
                    <input
                      type="date"
                      className={`form-control${interviewErrors.interview_date ? " is-invalid" : ""}`}
                      value={
                        interviewForm.interview_date
                          ? interviewForm.interview_date
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setInterviewForm((f) => ({
                          ...f,
                          interview_date: e.target.value
                            ? new Date(e.target.value)
                            : null,
                        }))
                      }
                    />
                    {interviewErrors.interview_date && (
                      <div className="invalid-feedback">
                        {interviewErrors.interview_date}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Interview Time</label>
                    <input
                      type="time"
                      className={`form-control${interviewErrors.interview_time ? " is-invalid" : ""}`}
                      value={interviewForm.interview_time}
                      onChange={(e) =>
                        setInterviewForm((f) => ({
                          ...f,
                          interview_time: e.target.value,
                        }))
                      }
                    />
                    {interviewErrors.interview_time && (
                      <div className="invalid-feedback">
                        {interviewErrors.interview_time}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Interview Format</label>
                    <input
                      type="text"
                      className={`form-control${interviewErrors.interview_format ? " is-invalid" : ""}`}
                      value={interviewForm.interview_format}
                      onChange={(e) =>
                        setInterviewForm((f) => ({
                          ...f,
                          interview_format: e.target.value,
                        }))
                      }
                      placeholder="e.g. In-person, Zoom, Phone"
                    />
                    {interviewErrors.interview_format && (
                      <div className="invalid-feedback">
                        {interviewErrors.interview_format}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Interview Panel</label>
                    <input
                      type="text"
                      className={`form-control${interviewErrors.interview_panel ? " is-invalid" : ""}`}
                      value={interviewForm.interview_panel}
                      onChange={(e) =>
                        setInterviewForm((f) => ({
                          ...f,
                          interview_panel: e.target.value,
                        }))
                      }
                      placeholder="e.g. John Doe, Jane Smith"
                    />
                    {interviewErrors.interview_panel && (
                      <div className="invalid-feedback">
                        {interviewErrors.interview_panel}
                      </div>
                    )}
                  </div>
                  <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary">
                      Schedule Interview
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Close Job Confirmation Modal */}
      {showCloseModal && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
          tabIndex={-1}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowCloseModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="txt__regular__">
                  Are you sure you want to close the job{" "}
                  <strong>{job.title}</strong>
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCloseModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={confirmCloseJob}
                >
                  Close Job
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="row">
        <div className="col-lg-5 col-md-5 col-sm-12 col-12 ">
          <div className="col-12 d-flex justify-content-end mb-3">
            {/* Send Email Action Button */}
            {job?.id && job?.status !== "closed" && !job?.is_expired && (
              <button
                className="btn btn-primary me-3"
                onClick={() => {
                  navigate(`/admin/teachers?job=${job.id}`);
                }}
              >
                Send Email
              </button>
            )}
            {job?.is_expired && (
              <>
                <button className="btn btn-secondary me-3">Expired</button>
                <button
                  className="btn btn-primary me-3"
                  onClick={handleCloseJob}
                  disabled={loading || job?.status === "closed"}
                >
                  {job?.status === "closed" ? "Job Closed" : "Close Job"}
                </button>
              </>
            )}
            {!job?.is_expired && (
              <button
                className="btn btn-secondary me-3"
                onClick={handleCloseJob}
                disabled={loading || job?.status === "closed"}
              >
                {job?.status === "closed" ? "Job Closed" : "Close Job"}
              </button>
            )}
            {job?.status !== "closed" && !job?.is_expired && (
              <button
                className="btn btn-primary me-2"
                onClick={() => handleEditJob(false)}
              >
                Edit Job
              </button>
            )}
            {(job?.status === "closed" || job?.is_expired) && (
              <button
                className="btn btn-primary me-2"
                onClick={() => handleEditJob(true)}
              >
                Repost
              </button>
            )}
            {/* Edit/Repost Job Modal */}
            {showEditModal && (
              <PostJobModal
                show={showEditModal}
                onClose={() => {
                  setShowEditModal(false);
                  setRepostMode(false);
                }}
                repostMode={repostMode}
                onSuccess={async () => {
                  setShowEditModal(false);
                  setRepostMode(false);
                  setLoading(true);
                  try {
                    // Always refetch job details after successful edit or repost
                    const response = await AdminBaseApi.get(`/jobs/${id}`);
                    if (response.data) {
                      setJob(response.data);
                      if (
                        response.data.applications &&
                        Array.isArray(response.data.applications)
                      ) {
                        setTeachers(response.data.applications);
                      } else {
                        setTeachers([]);
                      }
                    }
                  } catch (error) {
                    setTeachers([]);
                    console.error(error);
                  } finally {
                    setLoading(false);
                  }
                }}
                initialValues={job}
              />
            )}
          </div>
          <div
            className={`card job__${job?.status}__  job__${job?.is_expired}__`}
          >
            <div className="row">
              <div className="col-lg-9 col-md-9 col-sm-9 col-12">
                <div className="d-flex" style={{ width: "100%" }}>
                  <div
                    className="job-avatar me-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      background: `${getRandomColor(job.id)}`,
                      border: `3px solid #ffffff}`,
                      fontSize: 24,
                      fontWeight: 600,
                      color: "#ffffff",
                      textTransform: "uppercase",
                    }}
                  >
                    {job.title ? job.title[0] : "?"}
                  </div>
                  <div style={{ flex: 1 }} className=" mb-3">
                    <h5 className=" mb-1">{job.title}</h5>
                    <p className="job__description__ad">{job.school_name}</p>
                    <p className="job__description__ad mb-1">{job.location}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                <p className="txt__regular__  mb-1">
                  <strong>School Type: </strong>
                  {getLabelFromOptions(job.school_type, schoolTypeMultiOptions)}
                </p>
                <p className="txt__regular__  mb-1">
                  <strong>Postion Type: </strong>
                  {getLabelFromOptions(job.job_type, POSITIONTYPE_OPTIONS)}
                </p>

                <p className="txt__regular__  mb-1">
                  <strong>Subjects: </strong>{" "}
                  {Array.isArray(job.subjects)
                    ? job.subjects.filter((s: any) => s).join(", ")
                    : job.subjects}
                </p>
                <p className="txt__regular__  mb-1">
                  <strong>Curriculum: </strong>{" "}
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
                          typeof c === "object" && c.label ? c.label : c,
                        )
                        .join(", ");
                    }
                    return curr;
                  })()}
                </p>
                <p className="txt__regular__  mb-1">
                  <strong>Contract Type: </strong>{" "}
                  {Array.isArray(job.contract_type)
                    ? job.contract_type.filter((s: any) => s).join(", ")
                    : job.contract_type}
                </p>
                <p className="txt__regular__  mb-1">
                  <strong>Education Stage: </strong>{" "}
                  {Array.isArray(job.education_stage)
                    ? job.education_stage.filter((s: any) => s).join(", ")
                    : job.education_stage}
                </p>
                <p className="txt__regular__  mb-1">
                  <strong>Benefits: </strong>{" "}
                  {Array.isArray(job.benefits)
                    ? job.benefits.filter((s: any) => s).join(", ")
                    : job.benefits}
                </p>
                <p className="txt__regular__  mb-1">
                  <strong>Posted on: </strong>{" "}
                  {formatDateTime(job.date_posted).date} -{" "}
                  {formatDateTime(job.date_posted).time}
                </p>
                <p className="txt__regular__  mb-1">
                  <strong>Closing date: </strong>{" "}
                  {formatDateTime(job.closing_date).date}
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                <h4 className="job__headings__admin mt-3">Job Summary</h4>
                <p
                  className="txt__regular__"
                  dangerouslySetInnerHTML={{ __html: job.summary }}
                ></p>{" "}
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                <h4 className="job__headings__admin mt-3">Job requirements</h4>
                <p
                  className="txt__regular__"
                  dangerouslySetInnerHTML={{ __html: job.requirements }}
                ></p>{" "}
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                <h4 className="job__headings__admin mt-3">Job Description</h4>
                <p
                  className="txt__regular__"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                ></p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-7 col-md-7 col-sm-12 col-12">
          <div className="row mb-3">
            <div className="col-12 d-flex align-items-center justify-content-between gap-2">
              <div>
                <p className="txt__regular__">
                  Total applicants - {job.applications_count}
                </p>
              </div>
              <div className="d-flex flex-wrap gap-3">
                <select
                  className="form-select form-select-sm w-auto"
                  style={{ minWidth: 140 }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="">Sort By</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  {/* <option value="date">Date Applied</option> */}
                </select>
                <select
                  className="form-select form-select-sm w-auto"
                  style={{ minWidth: 140 }}
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                >
                  <option value="">Filter By</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-body teacher-applicants-table">
              <div className="table-responsive">
                <table className="table table-hover">
                  {/* <thead>
                    <tr>
                      <th style={{ width: 20 }}>S.No</th>
                      <th>Details</th>
                      <th style={{ width: 160 }}>Action</th>
                    </tr>
                  </thead> */}
                  <tbody>
                    {sortedTeachers.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center text-muted py-4">
                          No applicants found.
                        </td>
                      </tr>
                    ) : (
                      sortedTeachers.map((teacher, idx) => (
                        <tr key={idx}>
                          <td className="txt__regular__">{idx + 1}</td>
                          <td>
                            <div
                              style={{
                                fontWeight: 600,
                                cursor: "pointer",
                                color: "#0F3F93",
                                marginBottom: 4,
                              }}
                              onClick={() => {
                                setSelectedTeacher(teacher.applicant_profile);
                                setShowProfileModal(true);
                              }}
                            >
                              {teacher?.applicant_name || "-"}
                            </div>
                            <div className="d-flex flex-column">
                              <div
                                className="text-muted mb-1"
                                style={{ display: "flex", flexWrap: "wrap" }}
                              >
                                {/* <div
                                  className="d-block d-sm-inline"
                                  style={{ fontSize: 14, color: "#000000" }}
                                >
                                  {teacher?.applicant_profile?.role || "-"}
                                </div>
                                <span
                                  className="mx-2 d-none d-sm-inline"
                                  style={{
                                    width: "1px",
                                    height: "14px",
                                    background: "#ccc",
                                  }}
                                ></span> */}
                                <div
                                  className="d-block d-sm-inline"
                                  style={{ fontSize: 14, color: "#000000" }}
                                >
                                  {teacher?.applicant_email || "-"}
                                </div>
                                <span
                                  className="mx-2 d-none d-sm-inline"
                                  style={{
                                    width: "1px",
                                    height: "14px",
                                    background: "#ccc",
                                    marginTop: 4,
                                  }}
                                ></span>
                                <div
                                  className="d-block d-sm-inline"
                                  style={{ fontSize: 14, color: "#000000" }}
                                >
                                  {teacher?.applicant_profile?.phone || "-"}
                                </div>
                              </div>
                            </div>

                            <div className="d-flex flex-wrap align-items-center text-muted mb-1">
                              <span
                                style={{
                                  fontSize: 12,
                                  color: "#555",
                                  marginRight: 4,
                                }}
                                className=""
                              >
                                View:
                              </span>
                              <button
                                className="btn btn-link p-0"
                                style={{ fontSize: 12 }}
                                onClick={() => {
                                  setResumeModal({
                                    show: true,
                                    url: teacher?.resume || null,
                                    name: teacher?.applicant_name || "Resume",
                                  });
                                  setSelectedResumeApplicant(teacher);
                                }}
                              >
                                View CV
                              </button>
                              {/* Resume Preview Modal (rendered once at top level, not inside map) */}
                              {resumeModal.show && selectedResumeApplicant && (
                                <div
                                  className="modal fade show"
                                  style={{
                                    display: "block",
                                    background: "rgba(0,0,0,0.2)",
                                  }}
                                  tabIndex={-1}
                                >
                                  <div className="modal-dialog modal-lg">
                                    <div className="modal-content">
                                      <div className="modal-header">
                                        <h5 className="modal-title">
                                          {resumeModal.name}'s CV
                                        </h5>
                                        <button
                                          type="button"
                                          className="btn-close"
                                          aria-label="Close"
                                          onClick={() => {
                                            setResumeModal({
                                              show: false,
                                              url: null,
                                              name: "Resume",
                                            });
                                            setDocError(null);
                                            setSelectedResumeApplicant(null);
                                          }}
                                        ></button>
                                      </div>
                                      <div
                                        className="modal-body"
                                        style={{ minHeight: 500 }}
                                      >
                                        {resumeModal.url ? (
                                          <>
                                            <div className="text-end">
                                              <a
                                                href={resumeModal.url}
                                                download
                                                className="btn btn-secondary btn-sm"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                              >
                                                Download
                                              </a>
                                            </div>
                                            {docError ? (
                                              <>
                                                <div className="alert alert-danger mt-3">
                                                  {docError}
                                                </div>
                                                {/* Fallback to iframe for PDF */}
                                                {resumeModal.url &&
                                                  resumeModal.url.endsWith(
                                                    ".pdf",
                                                  ) && (
                                                    <iframe
                                                      src={resumeModal.url}
                                                      width="100%"
                                                      height="500"
                                                      style={{ border: "none" }}
                                                      title="PDF Preview"
                                                    />
                                                  )}
                                              </>
                                            ) : (
                                              <DocViewer
                                                documents={[
                                                  resumeModal.url &&
                                                  resumeModal.url.endsWith(
                                                    ".docx",
                                                  )
                                                    ? {
                                                        uri: resumeModal.url,
                                                        fileType: "docx",
                                                      }
                                                    : { uri: resumeModal.url },
                                                ]}
                                                pluginRenderers={
                                                  DocViewerRenderers
                                                }
                                                style={{ height: 500 }}
                                              />
                                            )}
                                          </>
                                        ) : (
                                          <div className="text-danger">
                                            No CV available.
                                          </div>
                                        )}
                                      </div>
                                      <div className="modal-footer">
                                        <button
                                          type="button"
                                          className="btn btn-secondary"
                                          onClick={() => {
                                            setResumeModal({
                                              show: false,
                                              url: null,
                                              name: "Resume",
                                            });
                                            setDocError(null);
                                            setSelectedResumeApplicant(null);
                                          }}
                                        >
                                          Close
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {teacher?.cover_letter && (
                                <>
                                  <span
                                    className="mx-2"
                                    style={{
                                      width: "1px",
                                      height: "14px",
                                      background: "#ccc",
                                    }}
                                  ></span>
                                  <button
                                    className="btn btn-link p-0"
                                    style={{ fontSize: 12 }}
                                    onClick={() =>
                                      setCoverLetterModal({
                                        show: true,
                                        url: teacher?.cover_letter || null,
                                        name:
                                          teacher?.applicant_name ||
                                          "Cover Letter",
                                      })
                                    }
                                  >
                                    View Cover Letter
                                  </button>
                                </>
                              )}
                              {/* Cover Letter Preview Modal (rendered once at top level) */}
                              {coverLetterModal.show && (
                                <div
                                  className="modal fade show"
                                  style={{
                                    display: "block",
                                    background: "rgba(0,0,0,0.2)",
                                  }}
                                  tabIndex={-1}
                                >
                                  <div className="modal-dialog modal-lg">
                                    <div className="modal-content">
                                      <div className="modal-header">
                                        <h5 className="modal-title">
                                          {coverLetterModal.name}
                                        </h5>
                                        <button
                                          type="button"
                                          className="btn-close"
                                          aria-label="Close"
                                          onClick={() => {
                                            setCoverLetterModal({
                                              show: false,
                                              url: null,
                                              name: "Cover Letter",
                                            });
                                            setDocError(null);
                                          }}
                                        ></button>
                                      </div>
                                      <div
                                        className="modal-body"
                                        style={{ minHeight: 500 }}
                                      >
                                        {coverLetterModal.url ? (
                                          <>
                                            <div className="text-end">
                                              <a
                                                href={coverLetterModal.url}
                                                download
                                                className="btn btn-secondary btn-sm"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                              >
                                                Download
                                              </a>
                                            </div>
                                            {docError ? (
                                              <>
                                                <div className="alert alert-danger mt-3">
                                                  {docError}
                                                </div>
                                                {/* Fallback to iframe for PDF */}
                                                {coverLetterModal.url &&
                                                  coverLetterModal.url.endsWith(
                                                    ".pdf",
                                                  ) && (
                                                    <iframe
                                                      src={coverLetterModal.url}
                                                      width="100%"
                                                      height="500"
                                                      style={{ border: "none" }}
                                                      title="PDF Preview"
                                                    />
                                                  )}
                                              </>
                                            ) : (
                                              <DocViewer
                                                documents={[
                                                  { uri: coverLetterModal.url },
                                                ]}
                                                pluginRenderers={
                                                  DocViewerRenderers
                                                }
                                                style={{ height: 500 }}
                                                // @ts-ignore
                                                onError={(e) =>
                                                  setDocError(
                                                    "Failed to preview document. Try downloading instead.",
                                                  )
                                                }
                                              />
                                            )}
                                          </>
                                        ) : (
                                          <div className="text-danger">
                                            No cover letter available.
                                          </div>
                                        )}
                                      </div>
                                      <div className="modal-footer">
                                        <button
                                          type="button"
                                          className="btn btn-secondary"
                                          onClick={() => {
                                            setCoverLetterModal({
                                              show: false,
                                              url: null,
                                              name: "Cover Letter",
                                            });
                                            setDocError(null);
                                          }}
                                        >
                                          Close
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-end position-relative">
                              {/* Show status or selected value with icon if any */}
                              {(teacher?.selectedAction || teacher?.status) && (
                                <a
                                  role="button"
                                  className=""
                                  style={{
                                    fontWeight: 600,
                                    fontSize: 14,
                                    color: "#0F3F93",
                                    padding: "2px ",
                                    textDecoration: "underline",
                                    cursor:
                                      job?.status === "closed" ||
                                      job?.is_expired
                                        ? "not-allowed"
                                        : "pointer",
                                    opacity:
                                      job?.status === "closed" ||
                                      job?.is_expired
                                        ? 0.5
                                        : 1,
                                  }}
                                  data-dropdown-trigger
                                  onClick={() => {
                                    if (
                                      job?.status === "closed" ||
                                      job?.is_expired
                                    )
                                      return;
                                    setDropdownOpenIdx(idx);
                                  }}
                                >
                                  {statusLoadingIdx === idx && (
                                    <span
                                      className="spinner-border spinner-border-sm me-2"
                                      role="status"
                                      aria-hidden="true"
                                    ></span>
                                  )}
                                  {teacher?.selectedAction ||
                                    (teacher?.status
                                      ? teacher.status.charAt(0).toUpperCase() +
                                        teacher.status.slice(1)
                                      : "")}
                                </a>
                              )}
                              {/* Action icon button */}
                              <a
                                role="button"
                                className=""
                                style={{
                                  padding: "2px",
                                  cursor:
                                    job?.status === "closed" || job?.is_expired
                                      ? "not-allowed"
                                      : "pointer",
                                  opacity:
                                    job?.status === "closed" || job?.is_expired
                                      ? 0.5
                                      : 1,
                                }}
                                onClick={() => {
                                  if (
                                    job?.status === "closed" ||
                                    job?.is_expired
                                  )
                                    return;
                                  setDropdownOpenIdx(
                                    dropdownOpenIdx === idx ? null : idx,
                                  );
                                }}
                              >
                                <FaChevronDown />{" "}
                              </a>
                              {/* Dropdown menu */}
                              {dropdownOpenIdx === idx &&
                                !(
                                  job?.status === "closed" || job?.is_expired
                                ) && (
                                  <div
                                    className="dropdown-menu show"
                                    style={{
                                      minWidth: "max-content",
                                      position: "absolute",
                                      top: 30,
                                      right: 0,
                                      zIndex: 10,
                                    }}
                                  >
                                    {[
                                      { label: "Pending", value: "pending" },
                                      { label: "Reviewed", value: "reviewed" },
                                      { label: "Accepted", value: "accepted" },
                                      { label: "Rejected", value: "rejected" },
                                    ].map((statusObj) => (
                                      <button
                                        key={statusObj.value}
                                        className="dropdown-item txt__regular__"
                                        disabled={statusLoadingIdx === idx}
                                        onClick={async () => {
                                          setStatusLoadingIdx(idx);
                                          const applicationId = teacher?.id;
                                          try {
                                            const response =
                                              await AdminBaseApi.patch(
                                                `/applications/${applicationId}/status`,
                                                { status: statusObj.value },
                                              );
                                            if (response.status === 200) {
                                              toast.success(
                                                response.data?.message ||
                                                  "Status updated successfully",
                                                toastOptions,
                                              );
                                              // Use response.data.application to update the teacher
                                              const updatedApp =
                                                response.data?.application;
                                              const updatedTeachers =
                                                teachers.map((t, i) =>
                                                  i === idx && updatedApp
                                                    ? { ...t, ...updatedApp }
                                                    : t,
                                                );
                                              setTeachers(updatedTeachers);
                                            } else {
                                              toast.error(
                                                "Failed to update status",
                                                toastOptions,
                                              );
                                            }
                                          } catch (err) {
                                            toast.error(
                                              "Failed to update status",
                                              toastOptions,
                                            );
                                          }
                                          setStatusLoadingIdx(null);
                                          setDropdownOpenIdx(null);
                                        }}
                                      >
                                        {statusLoadingIdx === idx ? (
                                          <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                            aria-hidden="true"
                                          ></span>
                                        ) : null}
                                        {statusObj.label}
                                      </button>
                                    ))}
                                  </div>
                                )}
                            </div>
                            {/* Schedule Interview button as separate button for reviewed/accepted, only if job is not expired or closed */}
                            {!teacher.interview_invitation_sent &&
                              (teacher.status === "reviewed" ||
                                teacher.status === "accepted") &&
                              !job?.is_expired &&
                              job?.status !== "closed" && (
                                <a
                                  role="button"
                                  className="ms-2 float-end mt-3"
                                  onClick={() => {
                                    setInterviewForm({
                                      applicationId: teacher.id,
                                      interview_date: null,
                                      interview_time: "",
                                      interview_format: "",
                                      interview_panel: "",
                                    });
                                    setShowInterviewModal(true);
                                  }}
                                >
                                  Schedule Interview
                                </a>
                              )}
                            {teacher.interview_invitation_sent && (
                              <small className="ms-2 float-end mt-3 text-muted">
                                Interview scheduled
                              </small>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* Email Stats Accordion - show at top of applicants section */}
          <Accordion className="mt-3">
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                Email Stats ({emailsSentTo.length} sent)
              </Accordion.Header>
              <Accordion.Body>
                {emailsSentTo.length === 0 ? (
                  <div className="text-muted">No emails sent yet.</div>
                ) : (
                  <ul className="list-group">
                    {emailsSentTo.map((t, idx) => {
                      let sentDate = "";
                      if (t.sent_at) {
                        const d = new Date(t.sent_at);
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
                        // Only show date in 'dd MMM yyyy' format
                        sentDate = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
                      }
                      return (
                        <li
                          key={idx}
                          className="list-group-item d-flex flex-column flex-md-row align-items-md-center align-items-start"
                        >
                          <span style={{ fontWeight: 500, marginRight: 8 }}>
                            {t.name}
                          </span>
                          <span
                            className="text-muted"
                            style={{ fontSize: 13, marginRight: 8 }}
                          >
                            {t.email}
                          </span>
                          {sentDate && (
                            <span
                              className="badge bg-light text-dark ms-md-auto mt-1 mt-md-0"
                              style={{ fontSize: 12 }}
                            >
                              Sent: {sentDate}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>
      {/* Teacher Profile Modal */}
      <TeacherProfileModal
        show={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        teacher={selectedTeacher}
      />
    </div>
  );
}

export default AdminJobDetail;
