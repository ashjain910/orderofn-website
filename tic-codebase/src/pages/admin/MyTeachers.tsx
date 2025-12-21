import { useState } from "react";
import { useEffect } from "react";
import TeacherProfileModal from "../../components/TeacherProfileModal";
import AdminBaseApi from "../../services/admin-base";
import { FaBookmark } from "react-icons/fa";
import { LuMessageSquareText } from "react-icons/lu";
import SendMessageModal from "../../components/SendMessageModal";

export default function MyTeachers() {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageTeacherIdx, setMessageTeacherIdx] = useState<number | null>(
    null
  );

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
  const [filters, setFilters] = useState({
    search: "",
    qualified: "",
    position: "",
    page: 1,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTeachers();
    // eslint-disable-next-line
  }, [filters.search, filters.qualified, filters.page]);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await AdminBaseApi.get("/candidates", {
        params: {
          page: filters.page,
          search: filters.search,
          qualified: filters.qualified,
          position: filters.position,
        },
      });
      setTeachers(
        res.data.results && res.data.results.length ? res.data.results : []
      );
    } catch (err) {
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Apply Filters button
  const handleApplyFilters = () => {
    // Reset to page 1 and fetch with current filters
    setFilters((f) => ({ ...f, page: 1 }));
    fetchTeachers();
  };

  // Handle Clear Filters button
  const handleClearFilters = () => {
    setFilters({
      search: "",
      qualified: "",
      position: "",
      page: 1,
    });
    fetchTeachers();
  };

  useEffect(() => {
    const handleReopenProfileModal = () => {
      setShowProfileModal(true);
    };
    window.addEventListener("reopenProfileModal", handleReopenProfileModal);
    return () => {
      window.removeEventListener(
        "reopenProfileModal",
        handleReopenProfileModal
      );
    };
  }, []);

  return (
    <>
      <TeacherProfileModal
        show={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        teacher={selectedTeacher}
      />
      <div className="container mt-4">
        <div className="row">
          {/* Filter section - left side */}
          <div className="col-lg-3 col-md-4 col-sm-12 mb-3">
            <div className="card mb-3">
              <div className="row">
                <div className="mb-1 col-12">
                  <label className="form-label">Search by name / email</label>
                  <input
                    type="text"
                    placeholder="Search by name / email"
                    value={filters.search}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, search: e.target.value }))
                    }
                    className="form-control"
                  />
                </div>
                <div className="mb-1 col-12">
                  <label className="form-label">Qualified</label>
                  <select
                    className="form-select"
                    value={filters.qualified}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, qualified: e.target.value }))
                    }
                  >
                    <option value="">All</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div className="mb-1 col-12">
                  <label className="form-label">Position</label>
                  <select
                    className="form-select"
                    value={filters.position}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, position: e.target.value }))
                    }
                  >
                    <option value="">All</option>
                    <option value="teacher">Teacher</option>
                    <option value="leader">Leader</option>
                    <option value="other">Other</option>
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
          {/* Teachers list - right side */}
          <div className="col-lg-9 col-md-8 col-sm-12">
            <div className="card">
              <div className="card-body teacher-applicants-table">
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
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <tbody>
                        {teachers.map((teacher, idx) => (
                          <tr key={idx}>
                            <td className="txt__regular__">{idx + 1}</td>
                            <td>
                              <div
                                style={{
                                  fontWeight: 600,
                                  cursor: "pointer",
                                  color: "#0F3F93",
                                }}
                                onClick={() => {
                                  setSelectedTeacher(teacher);
                                  setShowProfileModal(true);
                                }}
                              >
                                {teacher.full_name}
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
                                    {teacher.email}
                                  </div>
                                  <span
                                    className="mx-2 d-none d-sm-inline"
                                    style={{
                                      width: "1px",
                                      height: "14px",
                                      background: "#ccc",
                                      marginTop: "2px",
                                    }}
                                  ></span>
                                  <div
                                    className="d-block d-sm-inline"
                                    style={{ fontSize: 14, color: "#000000" }}
                                  >
                                    {teacher.phone}
                                  </div>
                                </div>
                                {/* <div className="d-flex align-items-center text-muted mb-1">
                                  <span
                                    style={{
                                      fontSize: 14,
                                      color: "#555",
                                      marginRight: 4,
                                    }}
                                  >
                                    Subject:
                                  </span>
                                  <p style={{ fontSize: 14, color: "#000000" }}>
                                    {teacher.teacher_profile.subject}
                                  </p>
                                </div> */}
                              </div>
                            </td>
                            <td className="txt__regular__">
                              <p style={{ fontSize: 14, color: "#000000" }}>
                                <span
                                  style={{
                                    fontSize: 14,
                                    color: "#555",
                                    marginRight: 4,
                                  }}
                                >
                                  Role:
                                </span>
                                {teacher.teacher_profile.role}
                              </p>
                            </td>
                            <td>
                              <p
                                className={`txt__regular_sub__ ${
                                  teacher.teacher_profile.english === "yes"
                                    ? "text-success"
                                    : "text-danger"
                                }`}
                                style={{ fontSize: 14 }}
                              >
                                Subscribed
                              </p>
                            </td>
                            <td>
                              <div className="d-flex align-items-center justify-content-end position-relative">
                                <span
                                  style={{
                                    marginLeft: 10,
                                    color: "#0F3F93",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                  role="button"
                                  title="Send Message"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setMessageTeacherIdx(idx);
                                    setShowMessageModal(true);
                                  }}
                                >
                                  <LuMessageSquareText size={20} />
                                </span>
                                {/* <span
                                  role="button"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    fontWeight: 600,
                                    fontSize: 14,
                                    color: "#0F3F93",
                                    cursor: "pointer",
                                    marginLeft: teacher.selectedAction ? 0 : 8,
                                  }}
                                  onClick={() =>
                                    setDropdownOpenIdx(
                                      dropdownOpenIdx === idx ? null : idx
                                    )
                                  }
                                >
                                  Action{" "}
                                  <FaChevronDown style={{ marginLeft: 4 }} />
                                </span>
                                {dropdownOpenIdx === idx && (
                                  <div
                                    className="dropdown-menu show"
                                    style={{
                                      minWidth: 120,
                                      position: "absolute",
                                      top: 20,
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
                                                  selectedAction:
                                                    "Remove from list",
                                                }
                                              : t
                                        );
                                        setTeachers(updatedTeachers);
                                        setDropdownOpenIdx(null);
                                      }}
                                    >
                                      Remove from list
                                    </button>
                                  </div>
                                )} */}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
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
