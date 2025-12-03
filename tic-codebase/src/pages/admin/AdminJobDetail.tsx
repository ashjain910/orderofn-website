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
import AdminBaseApi from "../../services/admin-base";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { MdOutlineFileDownload } from "react-icons/md";
import { RxDropdownMenu } from "react-icons/rx";
function AdminJobDetail() {
  // Sample teacher data for table view
  const initialTeachers = [
    {
      name: "Alice Johnson",
      role: "Math Teacher",
      email: "alice.johnson@example.com",
      phone: "+1 555-1234",
      subjects: "Mathematics",
      lookingFor: "Full-time",
      gender: "Female",
      nationality: "USA",
      selectedAction: "",
      status: "Hired",
      date_applied: "21-10-2025",
    },
    {
      name: "Bob Smith",
      role: "Science Teacher",
      email: "bob.smith@example.com",
      phone: "+1 555-5678",
      subjects: "Science",
      lookingFor: "Part-time",
      gender: "Male",
      nationality: "Canada",
      selectedAction: "",
      status: "Hired",
      date_applied: "25-10-2025",
    },
    {
      name: "Carol Lee",
      role: "English Teacher",
      email: "carol.lee@example.com",
      phone: "+1 555-8765",
      subjects: "English",
      lookingFor: "Full-time",
      gender: "Female",
      nationality: "UK",
      selectedAction: "",
      status: "Shortlisted",
      date_applied: "22-10-2025",
    },
    {
      name: "David Kim",
      role: "History Teacher",
      email: "david.kim@example.com",
      phone: "+1 555-4321",
      subjects: "History",
      lookingFor: "Casual",
      gender: "Male",
      nationality: "South Korea",
      selectedAction: "",
      status: "",
      date_applied: "23-10-2025",
    },
  ];
  const [teachers, setTeachers] = useState(initialTeachers);
  const [sortBy, setSortBy] = useState<string>("");
  const [dropdownOpenIdx, setDropdownOpenIdx] = useState<number | null>(null);
  const { id } = useParams();
  const defaultSampleJob = {
    id: 1,
    title: "Computer Science Teacher",
    school_avatar: "/school_image.png",
    badge: "Remote",
    is_expired: false,
    status: "active",
    school_name: "Lincoln High School",
    location: "New York, NY",
    job_type: "Remote",
    level: "High School",
    closing_date: "2025-12-31",
    subjects: "Mathematics",
    description:
      "Teach high school math classes. Help students succeed in mathematics.",
  };
  const [job, setJob] = React.useState<any | null>(defaultSampleJob);
  const [resumeFile, setResumeFile] = React.useState<File | null>(null);
  const [coverFile, setCoverFile] = React.useState<File | null>(null);

  const hasFetched = React.useRef(false);
  React.useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    const fetchJob = async () => {
      try {
        const response = await AdminBaseApi.get(`/jobs/${id}`);
        if (response.data) {
          setJob(response.data);
        } else {
          setJob(defaultSampleJob);
        }
      } catch (error) {
        setJob(defaultSampleJob);
        console.error(error);
      }
    };
    fetchJob();
  }, [id]);

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
  if (sortBy === "hired") {
    sortedTeachers = sortedTeachers.sort((a, b) => {
      if (a.status === "Hired" && b.status !== "Hired") return -1;
      if (a.status !== "Hired" && b.status === "Hired") return 1;
      return 0;
    });
  } else if (sortBy === "shortlisted") {
    sortedTeachers = sortedTeachers.sort((a, b) => {
      if (a.status === "Shortlisted" && b.status !== "Shortlisted") return -1;
      if (a.status !== "Shortlisted" && b.status === "Shortlisted") return 1;
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

  return (
    <div className="container mt-5">
      <div className="row mb-3">
        <div className="col-12 d-flex justify-content-end">
          <button className="btn btn-secondary me-3">Close Job</button>
          <button className="btn btn-primary me-2">Edit Job</button>
          <select
            className="form-select form-select-sm w-auto"
            style={{ minWidth: 140 }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="hired">Hired</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="date">Date Applied</option>
          </select>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-4 col-md-4 col-sm-12 col-12 ">
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
                  <div style={{ flex: 1 }}>
                    <h5 className=" mb-1">{job.title}</h5>
                    <p className="job__description__ad">{job.school_name}</p>
                    <p className="job__description__ad mb-1">{job.location}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                <h4 className="job__headings__admin mt-3">
                  Who we are looking for
                </h4>
                <ul className="txt__regular__ list__none__">
                  <li>Retired teachers or teacher aides are warmly welcomed</li>
                  <li>
                    Must be patient, responsible and committed to helping
                    students succeed
                  </li>
                  <li>Passionate about education and working with children </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-8 col-md-8 col-sm-12 col-12">
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
                    {sortedTeachers.map((teacher, idx) => (
                      <tr key={idx}>
                        <td className="txt__regular__">{idx + 1}</td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{teacher.name}</div>
                          <div className="d-flex flex-column">
                            <div
                              className="text-muted mb-1"
                              style={{ display: "flex", flexWrap: "wrap" }}
                            >
                              <div
                                className="d-block d-sm-inline"
                                style={{ fontSize: 13, color: "#000000" }}
                              >
                                {teacher.role}
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
                                style={{ fontSize: 13, color: "#000000" }}
                              >
                                {teacher.email}
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
                                style={{ fontSize: 13, color: "#000000" }}
                              >
                                {teacher.phone}
                              </div>
                            </div>
                          </div>

                          <div className="d-flex align-items-center text-muted mb-1">
                            <span
                              style={{
                                fontSize: 13,
                                color: "#555",
                                marginRight: 4,
                              }}
                              className=""
                            >
                              Download:
                            </span>
                            <a href="{teacher.subjects}">
                              {/* <MdOutlineFileDownload
                                style={{
                                  fontSize: 16,
                                  color: "#0F3F93",
                                  marginRight: 2,
                                }}
                              /> */}
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
                            <a href="{teacher.subjects}">
                              {/* <MdOutlineFileDownload
                                style={{
                                  fontSize: 16,
                                  color: "#0F3F93",
                                  marginRight: 2,
                                }}
                              /> */}
                              Cover Letter
                            </a>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center justify-content-end position-relative">
                            {/* Show status or selected value with icon if any */}
                            {(teacher.selectedAction || teacher.status) && (
                              <span
                                style={{
                                  fontWeight: 600,
                                  fontSize: 13,
                                  color: "#0F3F93",
                                  marginRight: 8,
                                }}
                              >
                                {teacher.selectedAction || teacher.status}
                              </span>
                            )}
                            {/* Action icon button */}
                            <a
                              role="button"
                              className=""
                              style={{ padding: "2px 8px" }}
                              onClick={() =>
                                setDropdownOpenIdx(
                                  dropdownOpenIdx === idx ? null : idx
                                )
                              }
                            >
                              <RxDropdownMenu style={{ fontSize: 27 }} />
                            </a>
                            {/* Dropdown menu */}
                            {dropdownOpenIdx === idx && (
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
                                <button
                                  className="dropdown-item txt__regular__"
                                  onClick={() => {
                                    const updatedTeachers = teachers.map(
                                      (t, i) =>
                                        i === idx
                                          ? {
                                              ...t,
                                              selectedAction: "Shortlist",
                                            }
                                          : t
                                    );
                                    setTeachers(updatedTeachers);
                                    setDropdownOpenIdx(null);
                                  }}
                                >
                                  Shortlist
                                </button>
                                <button
                                  className="dropdown-item txt__regular__"
                                  onClick={() => {
                                    const updatedTeachers = teachers.map(
                                      (t, i) =>
                                        i === idx
                                          ? { ...t, selectedAction: "Hired" }
                                          : t
                                    );
                                    setTeachers(updatedTeachers);
                                    setDropdownOpenIdx(null);
                                  }}
                                >
                                  Hired
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
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
