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
    "#343a40", // dark
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}
import React, { useState } from "react";
import DatePicker from "react-datepicker";
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

// Minimal ResumeModalState type
type ResumeModalState = {
  show: boolean;
  url: string | null;
  name: string;
};
function AdminJobDetail() {
  // Loader for interview invitation
  const [interviewLoading, setInterviewLoading] = useState(false);
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
              closingDate.getMonth() + 1
            ).padStart(2, "0")}-${String(closingDate.getDate()).padStart(
              2,
              "0"
            )}`;
      const response = await AdminBaseApi.patch(`/jobs/${job.id}/update`, {
        status: "closed",
        closing_date: formattedDate,
      });
      if (response.status === 200) {
        toast.success(
          response.data?.message || "Job closed successfully",
          toastOptions
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
  const positionTypeOptions = [
    { value: "teacher", label: "Teacher" },
    { value: "deputy_principal", label: "Deputy Principal" },
    { value: "head_of_school", label: "Head of School" },
  ];
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

  const [job, setJob] = React.useState<any | null>(null);
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
    sortedTeachers = sortedTeachers.sort((a, b) => {
      // date_applied format: DD-MM-YYYY
      const parseDate = (d: string) => {
        const [day, month, year] = d.split("-").map(Number);
        return new Date(year, month - 1, day).getTime();
      };
      return parseDate(a.date_applied) - parseDate(b.date_applied);
    });
  }

  const [showEditModal, setShowEditModal] = useState(false);
  const handleEditJob = () => {
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
                    const errors: any = {};
                    if (!interviewForm.interview_date) {
                      errors.interview_date = "Interview date is required.";
                    }
                    if (!interviewForm.interview_time) {
                      errors.interview_time = "Interview time is required.";
                    }

                    setInterviewErrors(errors);
                    const firstError = Object.values(errors)[0];
                    if (firstError) {
                      return;
                    }
                    try {
                      setInterviewLoading(true);
                      const dateObj = interviewForm.interview_date;
                      let formattedDate = "";
                      if (dateObj instanceof Date) {
                        const year = dateObj.getFullYear();
                        const month = String(dateObj.getMonth() + 1).padStart(
                          2,
                          "0"
                        );
                        const day = String(dateObj.getDate()).padStart(2, "0");
                        formattedDate = `${year}-${month}-${day}`;
                      } else if (typeof dateObj === "string") {
                        formattedDate = dateObj;
                      }
                      const payload = {
                        interview_date: formattedDate,
                        interview_time: interviewForm.interview_time,
                        interview_format: interviewForm.interview_format,
                        interview_panel: interviewForm.interview_panel,
                      };
                      const res = await AdminBaseApi.post(
                        `/applications/${interviewForm.applicationId}/send-interview-invitation`,
                        payload
                      );
                      if (res.status === 200 || res.status === 201) {
                        toast.success(
                          res.data?.message || "Interview invitation sent!",
                          toastOptions
                        );
                        setShowInterviewModal(false);
                        setInterviewErrors({
                          interview_date: "",
                          interview_time: "",
                          interview_format: "",
                          interview_panel: "",
                        });
                      } else {
                        toast.error("Failed to send invitation.", toastOptions);
                      }
                    } catch (err) {
                      toast.error("Failed to send invitation.", toastOptions);
                    } finally {
                      setInterviewLoading(false);
                    }
                  }}
                >
                  <div className="mb-3">
                    <label className="form-label">Interview Date</label>
                    <DatePicker
                      selected={interviewForm.interview_date}
                      onChange={(date) => {
                        setInterviewForm((f) => ({
                          ...f,
                          interview_date: date,
                        }));
                        setInterviewErrors((e) => ({
                          ...e,
                          interview_date: date
                            ? ""
                            : "Interview date is required.",
                        }));
                      }}
                      className="form-control"
                      dateFormat="EEEE, d MMMM yyyy"
                      placeholderText="Select date"
                    />
                    {interviewErrors.interview_date && (
                      <div className="text-danger small mt-1">
                        {interviewErrors.interview_date}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Interview Time</label>
                    <DatePicker
                      selected={
                        interviewForm.interview_time
                          ? new Date(
                              `1970-01-01T${interviewForm.interview_time}`
                            )
                          : null
                      }
                      onChange={(date: Date | null) => {
                        setInterviewForm((f) => ({
                          ...f,
                          interview_time: date
                            ? date.toTimeString().slice(0, 5)
                            : "",
                        }));
                        setInterviewErrors((er) => ({
                          ...er,
                          interview_time: date
                            ? ""
                            : "Interview time is required.",
                        }));
                      }}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={1}
                      timeCaption="Time"
                      dateFormat="HH:mm"
                      className="form-control"
                      placeholderText="Select time"
                    />
                    {interviewErrors.interview_time && (
                      <div className="text-danger small mt-1">
                        {interviewErrors.interview_time}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Interview Format</label>
                    <input
                      type="text"
                      className="form-control"
                      value={interviewForm.interview_format}
                      onChange={(e) => {
                        setInterviewForm((f) => ({
                          ...f,
                          interview_format: e.target.value,
                        }));
                        setInterviewErrors((er) => ({
                          ...er,
                          interview_format: e.target.value
                            ? ""
                            : "Interview format is required.",
                        }));
                      }}
                      placeholder="e.g. Online via Zoom"
                    />
                    {interviewErrors.interview_format && (
                      <div className="text-danger small mt-1">
                        {interviewErrors.interview_format}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Interview Panel</label>
                    <input
                      type="text"
                      className="form-control"
                      value={interviewForm.interview_panel}
                      onChange={(e) => {
                        setInterviewForm((f) => ({
                          ...f,
                          interview_panel: e.target.value,
                        }));
                        setInterviewErrors((er) => ({
                          ...er,
                          interview_panel: e.target.value
                            ? ""
                            : "Interview panel is required.",
                        }));
                      }}
                      placeholder="e.g. Principal and Head of Department"
                    />
                    {interviewErrors.interview_panel && (
                      <div className="text-danger small mt-1">
                        {interviewErrors.interview_panel}
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowInterviewModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {interviewLoading ? (
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : null}
                      {interviewLoading ? "Sending..." : "Send Invitation"}
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
              <button className="btn btn-primary me-2" onClick={handleEditJob}>
                Edit Job
              </button>
            )}
            {/* Edit Job Modal */}
            {showEditModal && (
              <PostJobModal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSuccess={async () => {
                  // Refetch job details after successful edit
                  setShowEditModal(false);
                  setLoading(true);
                  try {
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
                // Pass initialValues for editing
                initialValues={job}
              />
            )}
          </div>
          <div className={`card job__${job?.status}__`}>
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
                  {getLabelFromOptions(job.job_type, positionTypeOptions)}
                </p>

                <p className="txt__regular__  mb-1">
                  <strong>Subjects: </strong>{" "}
                  {Array.isArray(job.subjects)
                    ? job.subjects.filter((s: any) => s).join(", ")
                    : job.subjects}
                </p>
                <p className="txt__regular__  mb-1">
                  <strong>Curriculum: </strong>{" "}
                  {Array.isArray(job.curriculum)
                    ? job.curriculum.filter((s: any) => s).join(", ")
                    : job.curriculum}
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
                  <option value="date">Date Applied</option>
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
                                setSelectedTeacher(teacher);
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
                                View Resume
                              </button>
                              {/* Resume Preview Modal (rendered once at top level, not inside map) */}
                              {resumeModal.show && selectedResumeApplicant && (
                                <div
                                  className="modal fade show"
                                  style={{
                                    display: "block",
                                    background: "rgba(0,0,0,0.5)",
                                  }}
                                  tabIndex={-1}
                                >
                                  <div className="modal-dialog modal-lg">
                                    <div className="modal-content">
                                      <div className="modal-header">
                                        <h5 className="modal-title">
                                          {resumeModal.name}'s Resume
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
                                                    ".pdf"
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
                                                    ".docx"
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
                                            No resume available.
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
                                      teacher?.applicant_name || "Cover Letter",
                                  })
                                }
                              >
                                View Cover Letter
                              </button>
                              {/* Cover Letter Preview Modal (rendered once at top level) */}
                              {coverLetterModal.show && (
                                <div
                                  className="modal fade show"
                                  style={{
                                    display: "block",
                                    background: "rgba(0,0,0,0.5)",
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
                                                    ".pdf"
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
                                                    "Failed to preview document. Try downloading instead."
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
                                    dropdownOpenIdx === idx ? null : idx
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
                                                { status: statusObj.value }
                                              );
                                            if (response.status === 200) {
                                              toast.success(
                                                response.data?.message ||
                                                  "Status updated successfully",
                                                toastOptions
                                              );
                                              // Use response.data.application to update the teacher
                                              const updatedApp =
                                                response.data?.application;
                                              const updatedTeachers =
                                                teachers.map((t, i) =>
                                                  i === idx && updatedApp
                                                    ? { ...t, ...updatedApp }
                                                    : t
                                                );
                                              setTeachers(updatedTeachers);
                                            } else {
                                              toast.error(
                                                "Failed to update status",
                                                toastOptions
                                              );
                                            }
                                          } catch (err) {
                                            toast.error(
                                              "Failed to update status",
                                              toastOptions
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
                            {/* Schedule Interview button as separate button for reviewed/accepted */}
                            {(teacher.status === "reviewed" ||
                              teacher.status === "accepted") && (
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
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
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
