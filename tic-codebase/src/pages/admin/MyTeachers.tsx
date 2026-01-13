// Add position type options for label lookup
const positionTypeOptions = [
  { value: "teacher", label: "Teacher" },
  { value: "leader", label: "Leader" },
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
import { useState } from "react";
import { useEffect } from "react";
import TeacherProfileModal from "../../components/TeacherProfileModal";
import AdminBaseApi from "../../services/admin-base";
import { FaBookmark } from "react-icons/fa";
import SendMessageModal from "../../components/SendMessageModal";

export default function MyTeachers() {
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
    page: 1,
    page_size: PAGE_SIZE,
  });
  // Local state for filter form inputs
  const [filterInputs, setFilterInputs] = useState({
    search: "",
    qualified: "",
    position: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTeachers();
    // eslint-disable-next-line
  }, [filters.search, filters.qualified, filters.position, filters.page]);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await AdminBaseApi.get("/candidates", {
        params: {
          page: filters.page,
          search: filters.search,
          qualified: filters.qualified,
          position: filters.position,
          page_size: PAGE_SIZE,
        },
      });
      setTeachers(
        res.data.results && res.data.results.length ? res.data.results : []
      );
      setTotalCount(res.data.count || 0);
    } catch (err) {
      setTeachers([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Handle Apply Filters button
  const handleApplyFilters = () => {
    setFilters((f) => ({
      ...f,
      search: filterInputs.search,
      qualified: filterInputs.qualified,
      position: filterInputs.position,
      page: 1,
    }));
  };

  // Handle Clear Filters button
  const handleClearFilters = () => {
    setFilterInputs({
      search: "",
      qualified: "",
      position: "",
    });
    setFilters({
      search: "",
      qualified: "",
      position: "",
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
            <div
              className="card sticky-top"
              style={{ top: 80, zIndex: 2, width: "100%" }}
            >
              <div className="row">
                <div className="mb-1 col-12">
                  <label className="form-label">Search by name / email</label>
                  <input
                    type="text"
                    placeholder="Search by name / email"
                    value={filterInputs.search}
                    onChange={(e) =>
                      setFilterInputs((f) => ({ ...f, search: e.target.value }))
                    }
                    className="form-control"
                  />
                </div>
                <div className="mb-1 col-12">
                  <label className="form-label">Qualified</label>
                  <select
                    className="form-select"
                    value={filterInputs.qualified}
                    onChange={(e) =>
                      setFilterInputs((f) => ({
                        ...f,
                        qualified: e.target.value,
                      }))
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
                    value={filterInputs.position}
                    onChange={(e) =>
                      setFilterInputs((f) => ({
                        ...f,
                        position: e.target.value,
                      }))
                    }
                  >
                    <option value="">All</option>
                    <option value="teacher">Teacher</option>
                    <option value="leader">Leader</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                {/* Page Size input removed as per request; page_size is sent to backend only */}
                <div className="mb-1 col-12">
                  <div className="d-flex flex-wrap gap-2 mt-25">
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
                  <>
                    <div className="table-responsive">
                      <table className="table align-middle table-striped table-hover">
                        <tbody>
                          {teachers.map((teacher, idx) => (
                            <tr
                              key={idx}
                              onClick={() => {
                                setSelectedTeacher(teacher);
                                setShowProfileModal(true);
                              }}
                              style={{
                                cursor: "pointer",
                              }}
                            >
                              <td className="txt__regular__">
                                {(filters.page - 1) * PAGE_SIZE + idx + 1}
                              </td>
                              <td>
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
                                  {Array.isArray(
                                    teacher.teacher_profile.position
                                  )
                                    ? teacher.teacher_profile.position
                                        .map(
                                          (pos: any) =>
                                            positionTypeOptions.find(
                                              (opt) => opt.value === pos
                                            )?.label || pos
                                        )
                                        .join(", ")
                                    : positionTypeOptions.find(
                                        (opt) =>
                                          opt.value ===
                                          teacher.teacher_profile.position
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
                                    {teacher.teacher_profile.qualified === "yes"
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
                          ))}
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
