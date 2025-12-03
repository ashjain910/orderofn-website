import { useState } from "react";
import { useEffect } from "react";
import AdminBaseApi from "../../services/admin-base";
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
  },
];

export default function MyTeachers() {
  const [teachers, setTeachers] = useState(initialTeachers);
  const [dropdownOpenIdx, setDropdownOpenIdx] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    subscribed: false,
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchTeachers();
    // eslint-disable-next-line
  }, [filters.subscribed, filters.name, filters.email, filters.phone]);

  const fetchTeachers = async () => {
    try {
      const res = await AdminBaseApi.get("/candidates", {
        params: {
          subscribed: filters.subscribed,
          name: filters.name,
          email: filters.email,
          phone: filters.phone,
        },
      });
      setTeachers(res.data && res.data.length ? res.data : initialTeachers);
    } catch (err) {
      setTeachers(initialTeachers);
    }
  };
  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Teachers</h2>
      <div className="row">
        <div className="mb-3 d-flex flex-wrap gap-3 align-items-center">
          <input
            type="checkbox"
            checked={filters.subscribed}
            onChange={(e) =>
              setFilters((f) => ({ ...f, subscribed: e.target.checked }))
            }
          />
          <label className="me-2">Subscribed</label>
          <input
            type="text"
            placeholder="Search by name"
            value={filters.name}
            onChange={(e) =>
              setFilters((f) => ({ ...f, name: e.target.value }))
            }
            className="form-control w-auto"
          />
          <input
            type="text"
            placeholder="Search by email"
            value={filters.email}
            onChange={(e) =>
              setFilters((f) => ({ ...f, email: e.target.value }))
            }
            className="form-control w-auto"
          />
          <input
            type="text"
            placeholder="Search by phone"
            value={filters.phone}
            onChange={(e) =>
              setFilters((f) => ({ ...f, phone: e.target.value }))
            }
            className="form-control w-auto"
          />
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-12">
          <div className="card">
            <div className="card-body teacher-applicants-table">
              <div className="table-responsive">
                <table className="table table-hover">
                  <tbody>
                    {teachers.map((teacher, idx) => (
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
                            <div className="d-flex align-items-center text-muted mb-1">
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
                                Resume
                              </p>
                            </div>
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
                            {teacher.role}
                          </p>
                        </td>
                        <td>
                          <p className="status__subscribed">
                            {teacher.subjects}
                          </p>
                          <p className="txt__regular__sub__ mt-2">
                            <span>12 Feb 2024 to 12 Mar 2024</span>
                          </p>
                          <p className="txt__regular__sub__ mt-2">
                            <span>1 Month</span>
                          </p>
                        </td>
                        <td>
                          <div className="d-flex align-items-center justify-content-end position-relative">
                            {teacher.selectedAction && (
                              <span
                                style={{
                                  fontWeight: 600,
                                  fontSize: 14,
                                  color: "#0F3F93",
                                  marginRight: 8,
                                }}
                              >
                                {teacher.selectedAction}
                              </span>
                            )}
                            <button
                              type="button"
                              className="btn btn-light btn-sm border"
                              style={{ padding: "2px 8px" }}
                              onClick={() =>
                                setDropdownOpenIdx(
                                  dropdownOpenIdx === idx ? null : idx
                                )
                              }
                            >
                              ⋮
                            </button>
                            {dropdownOpenIdx === idx && (
                              <div
                                className="dropdown-menu show"
                                style={{
                                  minWidth: 120,
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
