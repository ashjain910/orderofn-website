// Helper to get a random color based on job title
function getRandomColor(str: string) {
  const colors = [
    "#0d3b85",
    "#0d3b85",
    "#0d3b85",
    "#0d3b85",
    "#0d3b85",
    "#0d3b85",
    "#0d3b85",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}
import React, { useState } from "react";
import PostJobModal from "../../components/admin/PostJobModal";
import { toast } from "react-toastify";
import { toastOptions } from "../../utils/toastOptions";
import AdminBaseApi from "../../services/admin-base";
import { useParams } from "react-router-dom";

import { FaChevronDown } from "react-icons/fa";
function AdminJobDetail() {
  // Track loading state for status change per applicant
  const [statusLoadingIdx, setStatusLoadingIdx] = useState<number | null>(null);
  // Handler for closing job
  const handleCloseJob = async () => {
    if (!job?.id) return;
    setLoading(true);
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
  // ...existing code...
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

  const [showEditModal, setShowEditModal] = useState(false);
  const handleEditJob = () => {
    setShowEditModal(true);
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

  // Sorting logic
  let sortedTeachers = [...teachers];
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
      <div className="row">
        <div className="col-lg-4 col-md-4 col-sm-12 col-12 ">
          <div className="col-12 d-flex justify-content-end mb-3">
            {job?.is_expired && (
              <button className="btn btn-secondary me-3">Expired</button>
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
          <div className="card">
            <div className="row">
              <div className="col-lg-9 col-md-9 col-sm-9 col-12">
                <div className="d-flex" style={{ width: "100%" }}>
                  <div
                    className="job-avatar me-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      background: "#ffffff",
                      border: `3px solid ${getRandomColor(job.title)}`,
                      fontSize: 24,
                      fontWeight: 600,
                      color: getRandomColor(job.title),
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
                  {job.school_type}
                </p>
                <p className="txt__regular__  mb-1">
                  <strong>Job Type: </strong>
                  {job.job_type}
                </p>
                <p className="txt__regular__  mb-1">
                  <strong>Posted on: </strong>{" "}
                  {formatDateTime(job.date_posted).date} -{" "}
                  {formatDateTime(job.date_posted).time}
                </p>
                <p className="txt__regular__  mb-1">
                  <strong>Subjects: </strong>{" "}
                  {Array.isArray(job.subjects)
                    ? job.subjects.filter((s: any) => s).join(", ")
                    : job.subjects}
                </p>
                <p className="txt__regular__  mb-1">
                  <strong>Closing date: </strong>{" "}
                  {formatDateTime(job.closing_date).date}
                </p>
              </div>
            </div>
            <div className="row">
              {/* <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                <h4 className="job__headings__admin mt-3">Job requirements</h4>
                <p className="txt__regular__">{job.requirements}</p>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                <h4 className="job__headings__admin mt-3">Job Summary</h4>
                <p className="txt__regular__">{job.summary}</p>
              </div> */}
              <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                <h4 className="job__headings__admin mt-3">Job Description</h4>
                <p className="txt__regular__">{job.description}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-8 col-md-8 col-sm-12 col-12">
          <div className="row mb-3">
            <div className="col-12 d-flex justify-content-end">
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
                            <div style={{ fontWeight: 600 }}>
                              {teacher?.applicant_name || "-"}
                            </div>
                            <div className="d-flex flex-column">
                              <div
                                className="text-muted mb-1"
                                style={{ display: "flex", flexWrap: "wrap" }}
                              >
                                <div
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
                                ></span>
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
                                  }}
                                ></span>
                                <div
                                  className="d-block d-sm-inline"
                                  style={{ fontSize: 14, color: "#000000" }}
                                >
                                  {teacher?.phone || "-"}
                                </div>
                              </div>
                            </div>

                            <div className="d-flex align-items-center text-muted mb-1">
                              <span
                                style={{
                                  fontSize: 14,
                                  color: "#555",
                                  marginRight: 4,
                                }}
                                className=""
                              >
                                Download:
                              </span>
                              <a
                                href={teacher?.applicant_profile?.resume || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Resume
                              </a>
                              <span
                                className="mx-2"
                                style={{
                                  width: "1px",
                                  height: "14px",
                                  background: "#ccc",
                                }}
                              ></span>
                              <a
                                href={
                                  teacher?.applicant_profile?.cover_letter ||
                                  "#"
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Cover Letter
                              </a>
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
    </div>
  );
}

export default AdminJobDetail;
