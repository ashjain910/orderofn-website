// Add global type for preview teachers to avoid TS2339 error
declare global {
  interface Window {
    __tic_selectedTeachersPreview?: any[];
  }
}
// Add position type options for label lookup
const positionTypeOptions = [
  { value: "teacher", label: "Teacher" },
  { value: "senior_leader", label: "Senior Leader" },
  { value: "other", label: "Other" },
];

// Helper to get label from options
// function getLabelFromOptions(
//   value: string,
//   options: { value: string; label: string }[]
// ): string {
//   if (!value) return "";
//   const found = options.find((opt) => opt.value === value);
//   return found ? found.label : value;
// }

import { IoMdInformationCircle, IoMdRemoveCircle } from "react-icons/io";
import { IoPersonSharp } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
  Modal,
  Button,
  Form,
  OverlayTrigger,
  Tooltip,
  Spinner,
} from "react-bootstrap";
import TeacherProfileModal from "../../components/TeacherProfileModal";
import AdminBaseApi from "../../services/admin-base";
import SendMessageModal from "../../components/SendMessageModal";
import { toast } from "react-toastify";
import { SUBJECT_OPTIONS } from "../../common/subjectOptions";
import Select from "react-select";
// Sample jobs for demo (fallback)
const SAMPLE_JOBS = [
  {
    id: 1,
    title: "Math Teacher",
    subject: "Mathematics",
    description:
      "Teach mathematics to high school students. Must have experience with IGCSE curriculum.",
  },
  {
    id: 2,
    title: "English Teacher",
    subject: "English",
    description:
      "Responsible for English language classes for grades 6-8. Strong communication skills required.",
  },
  {
    id: 3,
    title: "Science Coordinator",
    subject: "Science",
    description:
      "Coordinate science curriculum and mentor science teachers. Leadership experience preferred.",
  },
];

export default function MyTeachers() {
  // Ensure preview teachers are available globally for email preview
  // Selection state (persist across all pages)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  // Track all selected teacher objects globally
  const [selectedTeachers, setSelectedTeachers] = useState<any[]>([]);
  // Jobs for dropdown
  const [jobs, setJobs] = useState<any[]>(SAMPLE_JOBS);
  // Fetch jobs from API on mount
  const fetchJobs = useCallback(async () => {
    try {
      const response = await AdminBaseApi.get("/jobs", {
        params: {
          page: 1,
          page_size: 100,
        },
      });
      if (
        response.data &&
        Array.isArray(response.data.results) &&
        response.data.results.length > 0
      ) {
        setJobs(response.data.results);
      } else {
        setJobs(SAMPLE_JOBS);
      }
    } catch {
      setJobs(SAMPLE_JOBS);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);
  // Ensure preview teachers are available globally for email preview (must be after all hooks)
  useEffect(() => {
    window.__tic_selectedTeachersPreview = selectedTeachers.filter((t) =>
      selectedIds.has(getTeacherId(t)),
    );
    return () => {
      window.__tic_selectedTeachersPreview = undefined;
    };
  }, [selectedTeachers, selectedIds]);
  // Interactive React email preview component
  function EmailPreview({
    job,
  }: {
    job: any;
    teachers: any[];
    onRemoveTeacher: (id: number) => void;
  }) {
    if (!job) return <span className="text-muted">No template available.</span>;
    const jobTitle = job.title || "Job Title";
    const schoolName = job.school_name || job.school || "School Name";
    const location = job.location || "Location";
    const description = job.description || "No description provided.";
    const requirements =
      job.requirements ||
      job.requirement ||
      "See job details for requirements.";

    // Show first 2, rest in custom card popup
    const [showPopup, setShowPopup] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);

    // Hide popup if click outside
    useEffect(() => {
      if (!showPopup) return;
      function handleClick(e: MouseEvent) {
        if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
          setShowPopup(false);
        }
      }
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }, [showPopup]);

    return (
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          color: "#333",
          margin: "0 auto",
          background: "#fff",
          borderRadius: 5,
          overflow: "hidden",
          border: "1px solid #eee",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderBottom: "3px solid #0047AB",
            textAlign: "center",
            padding: "30px 20px",
          }}
        >
          <img
            src="https://app.ticrecruitment.com/tic_logo.png"
            alt="TIC - Teachers International Consultancy"
            style={{
              maxWidth: 300,
              height: "auto",
              display: "block",
              margin: "0 auto",
            }}
          />
        </div>
        <div style={{ background: "#f9f9f9", padding: 30 }}>
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Dear Candidate name
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="candidate-name-tooltip">
                  This will be replaced with the candidate's name in the actual
                  email.
                </Tooltip>
              }
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  cursor: "pointer",
                  marginLeft: 2,
                }}
              >
                <IoMdInformationCircle style={{ fontSize: 20 }} />
              </span>
            </OverlayTrigger>
          </div>
          <div
            style={{
              background: "#e8f0fe",
              padding: 20,
              margin: "20px 0",
              borderLeft: "4px solid #0047AB",
              borderRadius: 4,
            }}
          >
            <h2 style={{ marginTop: 0, fontSize: 18 }}>
              A New Position That May Interest You
            </h2>
            <p style={{ marginBottom: 0 }}>
              We have an exciting opportunity that we think could be a great fit
              for your profile. Please take a moment to review the details
              below.
            </p>
          </div>
          <div
            style={{
              background: "#fff",
              padding: 15,
              margin: "20px 0",
              borderLeft: "4px solid #3498db",
            }}
          >
            <h2 style={{ fontSize: 18, marginTop: 0 }}>Position Details</h2>
            <p>
              <strong>Job Title:</strong> {jobTitle}
            </p>
            <p>
              <strong>School:</strong> {schoolName}
            </p>
            <p>
              <strong>Location:</strong> {location}
            </p>
          </div>
          <p
            style={{
              color: "#2c3e50",
              fontSize: 16,
              fontWeight: "bold",
              margin: "20px 0 8px 0",
              borderBottom: "1px solid #ddd",
              paddingBottom: 4,
            }}
          >
            Job Description
          </p>
          <div
            style={{
              background: "#fff",
              padding: 15,
              margin: "10px 0 20px 0",
              border: "1px solid #eee",
              borderRadius: 4,
            }}
            dangerouslySetInnerHTML={{ __html: description }}
          />
          <p
            style={{
              color: "#2c3e50",
              fontSize: 16,
              fontWeight: "bold",
              margin: "20px 0 8px 0",
              borderBottom: "1px solid #ddd",
              paddingBottom: 4,
            }}
          >
            Requirements
          </p>
          <div
            style={{
              background: "#fff",
              padding: 15,
              margin: "10px 0 20px 0",
              border: "1px solid #eee",
              borderRadius: 4,
            }}
            dangerouslySetInnerHTML={{ __html: requirements }}
          />
          <p>
            If you are interested in this role or would like more information,
            please reply to this email or contact us at{" "}
            <a
              href="mailto:enquiries@ticrecruitment.com"
              style={{ color: "#3498db" }}
            >
              enquiries@ticrecruitment.com
            </a>
            .
          </p>
          <p>
            Kind regards,
            <br />
            <strong>The TIC Recruitment Team</strong>
          </p>
        </div>
        <div
          style={{
            background: "#ecf0f1",
            padding: 20,
            textAlign: "center",
            borderRadius: "0 0 5px 5px",
            fontSize: 12,
            color: "#7f8c8d",
          }}
        >
          <p>
            <a
              href="https://www.ticrecruitment.com"
              style={{ color: "#3498db", textDecoration: "none" }}
            >
              www.ticrecruitment.com
            </a>
          </p>
          <p>
            You are receiving this email because you are registered with TIC
            Recruitment.
          </p>
        </div>
      </div>
    );
  }
  // Helper to get unique teacher ID (for selection)
  function getTeacherId(teacher: any) {
    return teacher.id;
  }

  // ...existing code...
  // State for manual email input
  const [manualEmail, setManualEmail] = useState("");
  const [manualEmailError, setManualEmailError] = useState("");

  // Helper to validate email
  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Handler to add manual email
  function handleAddManualEmail() {
    const email = manualEmail.trim();
    if (!isValidEmail(email)) {
      setManualEmailError("Enter a valid email address");
      return;
    }
    // Prevent duplicates (by email)
    if (selectedTeachers.some((t) => t.email === email)) {
      setManualEmailError("Email already added");
      return;
    }
    // Add to selectedTeachers and selectedIds (use negative id for manual)
    const manualId = -(Date.now() + Math.floor(Math.random() * 1000));
    setSelectedTeachers((prev) => [
      { id: manualId, full_name: email, email, _manual: true },
      ...prev,
    ]);
    setSelectedIds((prev) => new Set([manualId, ...prev]));
    setManualEmail("");
    setManualEmailError("");
  }
  // Helper to fetch a teacher by ID if not present in loaded data
  const fetchTeacherById = async (id: number) => {
    try {
      const res = await AdminBaseApi.get(`/candidates/${id}`);
      return res.data;
    } catch {
      return null;
    }
  };
  const location = useLocation();
  // Modal state for send email (must be inside component)
  const [showSendEmailModal, setShowSendEmailModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState("");

  // Close Send Email modal if all selected teachers are removed
  useEffect(() => {
    if (showSendEmailModal && selectedIds.size === 0) {
      setShowSendEmailModal(false);
    }
  }, [showSendEmailModal, selectedIds]);
  // On mount, check for job param in URL and set default job selection
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const jobParam = params.get("job");
    if (jobParam && jobs.length > 0) {
      // Try to match by id first, then by name (case-insensitive)
      let found = jobs.find((j) => String(j.id) === jobParam);
      if (!found) {
        found = jobs.find(
          (j) => j.title.toLowerCase() === jobParam.toLowerCase(),
        );
      }
      if (found) setSelectedJobId(String(found.id));
    }
    // eslint-disable-next-line
  }, [jobs, location.search]);
  const [emailLoading, setEmailLoading] = useState(false);
  const selectedJob = jobs.find((j) => String(j.id) === String(selectedJobId));
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageTeacherIdx] = useState<number | null>(null);

  const [dropdownOpenIdx, setDropdownOpenIdx] = useState<number | null>(null);
  // Close action dropdown on outside click
  useEffect(() => {
    if (dropdownOpenIdx === null) return;
    const handleClick = (e: MouseEvent) => {
      // Only close if click is outside any dropdown menu or trigger
      const dropdowns = document.querySelectorAll(".dropdown-menu.show");
      let clickedInside = false;
      dropdowns.forEach((dropdown) => {
        if (dropdown.contains(e.target as Node)) clickedInside = true;
      });
      // Also check triggers
      const triggers = document.querySelectorAll('[role="button"]');
      triggers.forEach((trigger) => {
        if (trigger.contains(e.target as Node)) clickedInside = true;
      });
      if (!clickedInside) setDropdownOpenIdx(null);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpenIdx]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_SIZE = 50;
  const [filters, setFilters] = useState({
    search: "",
    qualified: "",
    position: "",
    subjects: [] as string[],
    subscribed: false,
    page: 1,
    page_size: PAGE_SIZE,
  });
  // Local state for filter form inputs
  const [filterInputs, setFilterInputs] = useState({
    search: "",
    qualified: "",
    position: "",
    subjects: [] as string[],
    subscribed: false,
  });
  const [loading, setLoading] = useState(false);

  // ...moved above...

  useEffect(() => {
    fetchTeachers();
    // eslint-disable-next-line
  }, [
    filters.search,
    filters.qualified,
    filters.position,
    filters.page,
    filters.subjects,
    filters.subscribed,
  ]);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await AdminBaseApi.get("/candidates", {
        params: {
          page: filters.page,
          search: filters.search,
          qualified: filters.qualified,
          position: filters.position,
          subjects:
            filters.subjects.length > 0 ? filters.subjects.join(",") : "",
          subscribed: filters.subscribed,
          page_size: PAGE_SIZE,
        },
      });
      const newTeachers =
        res.data.results && res.data.results.length ? res.data.results : [];
      setTeachers(newTeachers);
      setTotalCount(res.data.count || 0);
      // No need to reset selectedIds on page change; keep global selection
    } catch (err) {
      setTeachers([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Handle Apply Filters button

  // Handle Clear Filters button
  const handleClearFilters = () => {
    setFilterInputs({
      search: "",
      qualified: "",
      position: "",
      subjects: [],
      subscribed: false,
    });
    setFilters({
      search: "",
      qualified: "",
      position: "",
      subjects: [],
      subscribed: false,
      page: 1,
      page_size: PAGE_SIZE,
    });
  };

  useEffect(() => {
    const handleReopenProfileModal = () => {
      setShowProfileModal(true);
    };
    window.addEventListener("reopenProfileModal", handleReopenProfileModal);
    return () => {
      window.removeEventListener(
        "reopenProfileModal",
        handleReopenProfileModal,
      );
    };
  }, []);

  function onRemoveTeacher(id: any): void {
    const newSet = new Set(selectedIds);
    newSet.delete(id);
    setSelectedIds(newSet);
    setSelectedTeachers((prev) => prev.filter((t) => getTeacherId(t) !== id));
  }
  // Inline popup component for showing extra recipients in modal
  function MoreRecipientsPopup({
    teachers,
    onRemoveTeacher,
  }: {
    teachers: any[];
    onRemoveTeacher: (id: number) => void;
  }) {
    const [showPopup, setShowPopup] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
      if (!showPopup) return;
      function handleClick(e: MouseEvent) {
        const popup = popupRef.current;
        const trigger = triggerRef.current;
        if (
          popup &&
          !popup.contains(e.target as Node) &&
          trigger &&
          !trigger.contains(e.target as Node)
        ) {
          setShowPopup(false);
        }
      }
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }, [showPopup]);

    const handleRemoveTeacher = (id: number) => {
      onRemoveTeacher(id);
      // Popup stays open
    };

    return (
      <span style={{ position: "relative" }}>
        <span
          ref={triggerRef}
          className="more-recipients-trigger"
          style={{
            display: "inline-block",
            cursor: "pointer",
            color: "#0047AB",
            fontWeight: 500,
            padding: "2px 8px",
            background: "#f8f9fa",
            border: "1px solid #eee",
            borderRadius: 6,
          }}
          onClick={() => setShowPopup((v) => !v)}
        >
          +{teachers.length - 6} more
        </span>
        {showPopup && (
          <div
            ref={popupRef}
            style={{
              position: "absolute",
              left: 0,
              top: 30,
              width: 400,
              maxHeight: 400,
              overflowY: "auto",
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: 8,
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              zIndex: 1000,
              padding: 12,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 4 }}>
              Other Recipients
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              {teachers.slice(6).map((t) => (
                <div
                  key={getTeacherId(t)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "#f8f9fa",
                    border: "1px solid #eee",
                    borderRadius: 6,
                    padding: "2px 8px",
                    fontSize: 13,
                  }}
                >
                  <span>{t.full_name || t.email || "Teacher"}</span>
                  <span
                    style={{
                      color: "#d00",
                      cursor: "pointer",
                      fontWeight: "bold",
                      marginLeft: 8,
                    }}
                    title="Remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleRemoveTeacher(getTeacherId(t));
                    }}
                  >
                    &#10005;
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </span>
    );
  }

  return (
    <>
      <TeacherProfileModal
        show={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        teacher={selectedTeacher}
      />
      <div className="container">
        <div className="row">
          {/* Filter section - left side */}

          {/* Teachers list - center */}
          <div className="col-lg-9 col-md-8 col-sm-12">
            {/* <div
              className="d-flex justify-content-end align-items-center mb-1"
              style={{ gap: 12 }}
            >
              <Form.Select
                className="me-2 mb-3"
                style={{ maxWidth: 220, minWidth: 180 }}
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                disabled={teachers.length === 0}
              >
                <option value="">-- Select a job --</option>
                {SAMPLE_JOBS.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </Form.Select>
              <button
                className="btn btn-primary mb-3"
                disabled={selectedIds.size === 0 || !selectedJobId}
                style={{
                  minWidth: 120,
                  opacity: selectedIds.size === 0 || !selectedJobId ? 0.6 : 1,
                }}
                onClick={() => setShowSendEmailModal(true)}
              >
                Send Email
              </button>
            </div> */}
            {/* Send Email Modal */}
            <Modal
              show={showSendEmailModal}
              onHide={() => setShowSendEmailModal(false)}
              size="lg"
              onShow={() => {
                // Modal opens with the job selected in the dropdown
                // (selectedJobId is already set)
              }}
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  Send Email to {selectedIds.size} Teacher
                  {selectedIds.size > 1 ? "s" : ""}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="mb-2">
                  <Form.Label>Job</Form.Label>
                  <Form.Select
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    size="sm"
                  >
                    <option value="">-- Select a job --</option>
                    {jobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title}
                      </option>
                    ))}
                  </Form.Select>
                </div>
                {/* TO Recipients at top of modal */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>To:</div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    {selectedTeachers
                      .filter((t) => selectedIds.has(getTeacherId(t)))
                      .slice(0, 6)
                      .map((t) => (
                        <div
                          key={getTeacherId(t)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            background: "#f8f9fa",
                            border: "1px solid #eee",
                            borderRadius: 6,
                            padding: "2px 8px",
                            fontSize: 13,
                          }}
                        >
                          <span>{t.full_name || t.email || "Teacher"}</span>
                          <span
                            style={{
                              color: "#d00",
                              cursor: "pointer",
                              fontWeight: "bold",
                              marginLeft: 8,
                            }}
                            title="Remove"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              onRemoveTeacher(getTeacherId(t));
                            }}
                          >
                            &#10005;
                          </span>
                        </div>
                      ))}
                    {selectedTeachers.filter((t) =>
                      selectedIds.has(getTeacherId(t)),
                    ).length > 6 && (
                      <MoreRecipientsPopup
                        teachers={selectedTeachers.filter((t) =>
                          selectedIds.has(getTeacherId(t)),
                        )}
                        onRemoveTeacher={onRemoveTeacher}
                      />
                    )}
                  </div>
                </div>
                <div className="mb-2">
                  <strong>Preview email</strong>
                  <div
                    style={{
                      border: "1px solid #eee",
                      borderRadius: 6,
                      padding: 16,
                      marginTop: 8,
                      background: "#fafbff",
                      minHeight: 80,
                    }}
                  >
                    {emailLoading ? (
                      <div className="d-flex align-items-center gap-2">
                        <Spinner size="sm" /> Loading template...
                      </div>
                    ) : (
                      <EmailPreview
                        job={selectedJob}
                        teachers={selectedTeachers.filter((t) =>
                          selectedIds.has(getTeacherId(t)),
                        )}
                        onRemoveTeacher={(id) => {
                          const newSet = new Set(selectedIds);
                          newSet.delete(id);
                          setSelectedIds(newSet);
                          setSelectedTeachers((prev) =>
                            prev.filter((pt) => getTeacherId(pt) !== id),
                          );
                        }}
                      />
                    )}
                  </div>
                </div>
                <div className="d-flex justify-content-end">
                  <Button
                    variant="primary"
                    disabled={
                      !selectedJob || emailLoading || selectedIds.size === 0
                    }
                    onClick={async () => {
                      if (!selectedJobId || selectedIds.size === 0) return;
                      setEmailLoading(true);
                      try {
                        // Separate manual emails (negative id) and teacher ids
                        const manualEmails = selectedTeachers
                          .filter((t) => t.id < 0 && t.email)
                          .map((t) => t.email);
                        const teacherIds = Array.from(selectedIds).filter(
                          (id) => id > 0,
                        );
                        const response = await AdminBaseApi.post(
                          "/send-job-email",
                          {
                            teacher_ids: teacherIds,
                            emails: manualEmails,
                            job_id: selectedJobId,
                          },
                        );
                        if (!response || response.status !== 200)
                          throw new Error("Failed to send email");
                        setShowSendEmailModal(false);
                        setSelectedJobId("");
                        setSelectedIds(new Set());
                        setSelectedTeachers([]);
                        setManualEmail("");
                        setManualEmailError("");
                        toast.success("Email sent successfully!");
                      } catch (err) {
                        toast.error("Failed to send email. Please try again.");
                      } finally {
                        setEmailLoading(false);
                      }
                    }}
                  >
                    {emailLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Sending...
                      </>
                    ) : (
                      "Send email"
                    )}
                  </Button>
                </div>
              </Modal.Body>
            </Modal>
            <div className="card">
              <div className="row">
                <div className="mb-1 col-4">
                  <label className="form-label">Search by name / email</label>
                  <input
                    type="text"
                    placeholder="Search by name / email"
                    value={filterInputs.search}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFilterInputs((f) => ({ ...f, search: value }));
                      setFilters((f) => ({ ...f, search: value, page: 1 }));
                    }}
                    className="form-control"
                  />
                </div>
                <div className="mb-1 col-4">
                  <label className="form-label">Qualified</label>
                  <select
                    className="form-select"
                    value={filterInputs.qualified}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFilterInputs((f) => ({ ...f, qualified: value }));
                      setFilters((f) => ({ ...f, qualified: value, page: 1 }));
                    }}
                  >
                    <option value="">All</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div className="mb-1 col-4">
                  <label className="form-label">Position</label>
                  <select
                    className="form-select"
                    value={filterInputs.position}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFilterInputs((f) => ({ ...f, position: value }));
                      setFilters((f) => ({ ...f, position: value, page: 1 }));
                    }}
                  >
                    <option value="">All</option>
                    {positionTypeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Subjects multi-select filter */}
                <div className="mb-1 col-12">
                  <label className="form-label">Subjects</label>
                  <Select
                    isMulti
                    options={SUBJECT_OPTIONS}
                    closeMenuOnSelect={false}
                    value={SUBJECT_OPTIONS.filter((opt) =>
                      filterInputs.subjects.includes(opt.value),
                    )}
                    onChange={(selected: any) => {
                      // selected is array of option objects
                      const values = Array.isArray(selected)
                        ? selected.map((opt) => opt.value)
                        : [];
                      setFilterInputs((f) => ({ ...f, subjects: values }));
                      setFilters((f) => ({ ...f, subjects: values, page: 1 }));
                    }}
                    placeholder="Select subjects"
                  />
                </div>
                {/* Subscribed checkbox filter (no label) */}
                <div className="mb-1 col-12 d-flex mt-2">
                  <div className="form-check mr-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="subscribedFilter"
                      checked={!!filterInputs.subscribed}
                      onChange={(e) => {
                        const value = e.target.checked;
                        setFilterInputs((f) => ({ ...f, subscribed: value }));
                        setFilters((f) => ({
                          ...f,
                          subscribed: value,
                          page: 1,
                        }));
                      }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="subscribedFilter"
                    >
                      Subscribed Only
                    </label>
                  </div>
                  <a
                    role="button"
                    onClick={handleClearFilters}
                    className="ml-1"
                  >
                    Clear filters
                  </a>
                </div>
              </div>
            </div>
            <div className="card mt-3">
              <div className="card-body teacher-applicants-table">
                {/* Send Email button and selection summary */}
                <div
                  className="d-flex align-items-center mb-3"
                  style={{ minHeight: 32 }}
                >
                  {teachers.length > 0 && (
                    <div
                      className="d-flex align-items-center"
                      style={{ gap: 8 }}
                    >
                      <input
                        type="checkbox"
                        id="selectAllTeachers"
                        style={{
                          width: 20,
                          height: 20,
                          verticalAlign: "middle",
                        }}
                        checked={
                          teachers.length > 0 &&
                          teachers.every((t) =>
                            selectedIds.has(getTeacherId(t)),
                          )
                        }
                        onChange={async (e) => {
                          const newSet = new Set(selectedIds);
                          let newSelectedTeachers = [...selectedTeachers];
                          if (e.target.checked) {
                            for (const t of teachers) {
                              const id = getTeacherId(t);
                              newSet.add(id);
                              if (
                                !newSelectedTeachers.some(
                                  (sel) => getTeacherId(sel) === id,
                                )
                              ) {
                                newSelectedTeachers.push(t);
                              }
                            }
                          } else {
                            teachers.forEach((t) => {
                              const id = getTeacherId(t);
                              newSet.delete(id);
                              newSelectedTeachers = newSelectedTeachers.filter(
                                (sel) => getTeacherId(sel) !== id,
                              );
                            });
                          }
                          setSelectedIds(newSet);
                          setSelectedTeachers(newSelectedTeachers);
                        }}
                      />
                      <label
                        htmlFor="selectAllTeachers"
                        className=" mb-0"
                        style={{
                          userSelect: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          height: 22,
                        }}
                      >
                        Select All
                      </label>
                    </div>
                  )}
                  <div
                    className="ms-3"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      height: 32,
                    }}
                  >
                    <span className="small">
                      Selected:{" "}
                      {Array.from(selectedIds).filter((id) => id > 0).length}
                    </span>
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
                ) : teachers.length === 0 ? (
                  <div
                    style={{
                      minHeight: "200px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div className="mb-3">
                      No results found. Try resetting filters.
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
                    <div className="table-responsive">
                      <table className="table align-middle table-striped table-hover">
                        <tbody>
                          {teachers.map((teacher, idx) => {
                            const id = getTeacherId(teacher);
                            const isSelected = selectedIds.has(id);
                            return (
                              <tr
                                key={id}
                                style={{
                                  cursor: "pointer",
                                  background: isSelected
                                    ? "#e6f0ff"
                                    : undefined,
                                }}
                              >
                                <td>
                                  <input
                                    type="checkbox"
                                    style={{ width: 20, height: 20 }}
                                    checked={isSelected}
                                    onChange={async (e) => {
                                      const newSet = new Set(selectedIds);
                                      let newSelectedTeachers = [
                                        ...selectedTeachers,
                                      ];
                                      if (e.target.checked) {
                                        newSet.add(id);
                                        if (
                                          !newSelectedTeachers.some(
                                            (sel) => getTeacherId(sel) === id,
                                          )
                                        ) {
                                          // If teacher is not in loaded data, fetch it
                                          let teacherObj = teacher;
                                          if (!teacherObj) {
                                            teacherObj =
                                              await fetchTeacherById(id);
                                          }
                                          if (teacherObj)
                                            newSelectedTeachers.push(
                                              teacherObj,
                                            );
                                        }
                                      } else {
                                        newSet.delete(id);
                                        newSelectedTeachers =
                                          newSelectedTeachers.filter(
                                            (sel) => getTeacherId(sel) !== id,
                                          );
                                      }
                                      setSelectedIds(newSet);
                                      setSelectedTeachers(newSelectedTeachers);
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </td>
                                <td className="txt__regular__">
                                  {(filters.page - 1) * PAGE_SIZE + idx + 1}
                                </td>
                                <td
                                  onClick={() => {
                                    setSelectedTeacher(teacher);
                                    setShowProfileModal(true);
                                  }}
                                >
                                  <div
                                    style={{
                                      fontWeight: 600,
                                      cursor: "pointer",
                                      color: "#0F3F93",
                                    }}
                                  >
                                    {teacher.full_name}
                                  </div>
                                  <div className="d-flex flex-column">
                                    <div
                                      className="text-muted mb-1"
                                      style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                      }}
                                    >
                                      <div
                                        className="d-block d-sm-inline"
                                        style={{
                                          fontSize: 14,
                                          color: "#000000",
                                          marginTop: "5px",
                                        }}
                                      >
                                        {teacher.email}
                                      </div>
                                      {teacher.phone && (
                                        <span
                                          className="mx-2 d-none d-sm-inline"
                                          style={{
                                            width: "1px",
                                            height: "14px",
                                            background: "#ccc",
                                            marginTop: "2px",
                                          }}
                                        ></span>
                                      )}
                                      <div
                                        className="d-block d-sm-inline"
                                        style={{
                                          fontSize: 14,
                                          color: "#000000",
                                        }}
                                      >
                                        {teacher.phone}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="d-flex flex-wrap mb-2 ">
                                    <small
                                      style={{ width: 300 }}
                                      className="text-muted mr-2"
                                    >
                                      <span
                                        style={{
                                          fontSize: 14,
                                          color: "#000000",
                                          fontWeight: 500,
                                        }}
                                      >
                                        Subjects :{" "}
                                      </span>
                                      {(() => {
                                        const subjects =
                                          teacher.teacher_profile.subjects;
                                        if (
                                          Array.isArray(subjects) &&
                                          subjects.length > 0
                                        ) {
                                          const shown = subjects.slice(0, 3);
                                          const hidden =
                                            subjects.length > 3
                                              ? subjects.slice(3)
                                              : [];
                                          return (
                                            <>
                                              {shown.join(", ")}
                                              {hidden.length > 0 && (
                                                <OverlayTrigger
                                                  placement="top"
                                                  overlay={
                                                    <Tooltip
                                                      id={`subjects-tooltip-${teacher.id}`}
                                                      style={{
                                                        whiteSpace: "pre-line",
                                                      }}
                                                    >
                                                      {subjects.join(", ")}
                                                    </Tooltip>
                                                  }
                                                >
                                                  <span
                                                    style={{
                                                      color: "#0047AB",
                                                      cursor: "pointer",
                                                      marginLeft: 4,
                                                      fontWeight: 500,
                                                      textDecoration:
                                                        "underline dotted",
                                                    }}
                                                  >
                                                    +{hidden.length} more
                                                  </span>
                                                </OverlayTrigger>
                                              )}
                                            </>
                                          );
                                        } else if (
                                          typeof subjects === "string" &&
                                          subjects.trim()
                                        ) {
                                          return subjects;
                                        } else {
                                          return (
                                            <span className="text-muted">
                                              -
                                            </span>
                                          );
                                        }
                                      })()}
                                    </small>
                                    {/* <small className="">
                                      {getLabels(
                                        teacher.subjects,
                                        SUBJECT_OPTIONS,
                                      )}
                                    </small> */}
                                  </div>
                                </td>
                                <td className="txt__regular__">
                                  <p style={{ fontSize: 14, color: "#000000" }}>
                                    {Array.isArray(
                                      teacher.teacher_profile.position,
                                    )
                                      ? teacher.teacher_profile.position
                                          .map(
                                            (pos: any) =>
                                              positionTypeOptions.find(
                                                (opt) => opt.value === pos,
                                              )?.label || pos,
                                          )
                                          .join(", ")
                                      : positionTypeOptions.find(
                                          (opt) =>
                                            opt.value ===
                                            teacher.teacher_profile.position,
                                        )?.label ||
                                        teacher.teacher_profile.position ||
                                        ""}
                                  </p>
                                  <p style={{ marginTop: "5px" }}>
                                    <span
                                      style={{
                                        fontSize: 12,
                                        color: "#333333",
                                        marginRight: 4,
                                      }}
                                    >
                                      Qualifed:{" "}
                                      {teacher.teacher_profile.qualified ===
                                      "yes"
                                        ? "Yes"
                                        : "No"}
                                    </span>
                                  </p>
                                </td>
                                <td>
                                  <p
                                    className={`txt__regular_sub ${
                                      teacher.subscription_status === "active"
                                        ? "text-success"
                                        : "text-danger"
                                    }`}
                                    style={{ fontSize: 13, fontWeight: 500 }}
                                  >
                                    {teacher.subscription_status === "active"
                                      ? "Subscribed"
                                      : "Not Subscribed"}
                                  </p>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {/* Pagination */}
                    {totalCount > PAGE_SIZE && (
                      <nav className="mt-3">
                        <ul className="pagination">
                          <li
                            className={`page-item${
                              filters.page === 1 ? " disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() =>
                                setFilters((f) => ({ ...f, page: f.page - 1 }))
                              }
                              disabled={filters.page === 1}
                            >
                              Previous
                            </button>
                          </li>
                          {Array.from({
                            length: Math.ceil(totalCount / PAGE_SIZE),
                          }).map((_, idx) => (
                            <li
                              key={idx + 1}
                              className={`page-item${
                                filters.page === idx + 1 ? " active" : ""
                              }`}
                            >
                              <button
                                className="page-link"
                                onClick={() =>
                                  setFilters((f) => ({ ...f, page: idx + 1 }))
                                }
                              >
                                {idx + 1}
                              </button>
                            </li>
                          ))}
                          <li
                            className={`page-item${
                              filters.page === Math.ceil(totalCount / PAGE_SIZE)
                                ? " disabled"
                                : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() =>
                                setFilters((f) => ({ ...f, page: f.page + 1 }))
                              }
                              disabled={
                                filters.page ===
                                Math.ceil(totalCount / PAGE_SIZE)
                              }
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
          <div className="col-lg-3 col-md-4 col-sm-12 mb-3">
            <div
              className="card sticky-top"
              style={{ top: 80, zIndex: 2, width: "100%" }}
            >
              <div className="card-body">
                {selectedIds.size === 0 ? (
                  <div className="text-center text-muted py-4">
                    <div style={{ fontSize: 18, fontWeight: 500 }}>
                      No teacher selected
                    </div>
                    <div style={{ fontSize: 14 }}>
                      Select a teacher to see details and actions here.
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div style={{ fontWeight: 500, fontSize: 14 }}>
                        Selected Teachers
                      </div>
                      <button
                        className="btn btn-sm"
                        style={{ fontSize: 13, padding: "2px 10px" }}
                        onClick={() => {
                          setSelectedIds(new Set());
                          setSelectedTeachers([]);
                        }}
                        title="Clear all selected teachers"
                      >
                        Clear All
                      </button>
                    </div>
                    <div>
                      <div
                        style={{
                          maxHeight: 400,
                          overflowY: "auto",
                          marginTop: 8,
                          marginBottom: 8,
                        }}
                      >
                        {selectedTeachers
                          .filter((t) => selectedIds.has(getTeacherId(t)))
                          .map((t) => (
                            <div
                              key={t.id}
                              className="d-flex align-items-center justify-content-between border rounded px-2 py-1 mb-1"
                              style={{ background: "#f8f9fa" }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  maxWidth: 180,
                                }}
                              >
                                <span
                                  style={{
                                    fontWeight: 500,
                                    fontSize: 13,
                                    display: "block",
                                    alignItems: "center",
                                    gap: 4,
                                  }}
                                >
                                  {t._manual ? (
                                    <MdEmail
                                      style={{
                                        marginRight: 4,
                                        color: "#0F3F93",
                                        verticalAlign: "middle",
                                      }}
                                    />
                                  ) : t.email ? (
                                    <IoPersonSharp
                                      style={{
                                        marginRight: 4,
                                        color: "#0F3F93",
                                        verticalAlign: "middle",
                                      }}
                                    />
                                  ) : null}
                                  {t.full_name}
                                </span>
                              </div>
                              <button
                                className="btn btn-link "
                                style={{
                                  textDecoration: "none",
                                  fontSize: 17,
                                  padding: 0,
                                }}
                                onClick={() => {
                                  const newSet = new Set(selectedIds);
                                  newSet.delete(getTeacherId(t));
                                  setSelectedIds(newSet);
                                  setSelectedTeachers((prev) =>
                                    prev.filter(
                                      (pt) =>
                                        getTeacherId(pt) !== getTeacherId(t),
                                    ),
                                  );
                                }}
                                title="Remove teacher"
                              >
                                <IoMdRemoveCircle />
                              </button>
                            </div>
                          ))}
                      </div>
                    </div>
                  </>
                )}
                {/* Manual email add */}
                <div
                  className="mb-2 d-flex align-items-center"
                  style={{ gap: 8 }}
                >
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    style={{ maxWidth: 180 }}
                    placeholder="Add email manually"
                    value={manualEmail}
                    onChange={(e) => {
                      setManualEmail(e.target.value);
                      setManualEmailError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddManualEmail();
                      }
                    }}
                  />
                  <button
                    className="btn btn-sm btn-primary"
                    style={{ minWidth: 48 }}
                    onClick={handleAddManualEmail}
                  >
                    Add
                  </button>
                </div>
                {manualEmailError && (
                  <div className="text-danger mb-2" style={{ fontSize: 13 }}>
                    {manualEmailError}
                  </div>
                )}
                <div className="mb-2">
                  <Form.Label>Job</Form.Label>
                  <Form.Select
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    size="sm"
                  >
                    <option value="">-- Select a job --</option>
                    {jobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title}
                      </option>
                    ))}
                  </Form.Select>
                </div>
                <button
                  className="btn btn-primary w-100 mt-2"
                  disabled={selectedIds.size === 0 || !selectedJobId}
                  style={{
                    opacity: selectedIds.size === 0 || !selectedJobId ? 0.6 : 1,
                  }}
                  onClick={() => setShowSendEmailModal(true)}
                >
                  Preview Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Common Send Message Modal */}
      <SendMessageModal
        show={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        teacherId={
          messageTeacherIdx !== null ? teachers[messageTeacherIdx]?.id : ""
        }
      />
    </>
  );
}
