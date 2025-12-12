const curriculumList = [
  "American",
  "Australian",
  "Canadian",
  "IB Dip",
  "IB MYP",
  "IB PYP",
  "Indian",
  "IPC",
  "New zealand",
  "South African",
  "UK National",
];
import React, { useEffect, useState } from "react";
import { fetchUserProfile, updateUserProfile } from "./api";
import { toast } from "react-toastify";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { FaUserEdit } from "react-icons/fa";

const sampleProfile = {
  email: "henry.wilson@example.com",
  phone_number: "+123 456 7890",
  password: "password123",
  qualified: "yes",
  english: "Fluent",
  position: "Teacher",
  firstName: "Henry",
  lastName: "Wilson",
  gender: "male",
  nationality: "American",
  secondNationality: false,
  cvFile: null,
  hearFrom: "LinkedIn",
  role: "Teacher",
  subject: "Mathematics",
  ageGroup: "11-15 Years",
  curriculum: [],
  leadershipRole: "Coordinator",
  day: "15",
  month: "08",
  year: "2020",
};

const sectionFields = [
  // Step 1 (removed, merged into Step 2)
  [],
  // Step 2 (Personal Information + Account Info, except password)
  [
    { label: "First Name", name: "firstName", type: "text" },
    { label: "Last Name", name: "lastName", type: "text" },
    { label: "Email", name: "email", type: "text" },
    { label: "Phone Number", name: "phone_number", type: "text" },
    {
      label: "Gender",
      name: "gender",
      type: "select",
      options: ["", "male", "female", "others"],
    },
    {
      label: "Qualified",
      name: "qualified",
      type: "select",
      options: ["", "yes", "no"],
    },
    { label: "English", name: "english", type: "text" },
    { label: "Position", name: "position", type: "text" },
    { label: "Nationality", name: "nationality", type: "text" },
    {
      label: "Second Nationality",
      name: "secondNationality",
      type: "checkbox",
    },
    { label: "CV Upload", name: "cvFile", type: "file" },
    { label: "Where did you hear about us?", name: "hearFrom", type: "text" },
  ],
  // Step 3
  [
    {
      label: "Role",
      name: "role",
      type: "select",
      options: ["", "Teacher", "Assistant Teacher", "Senior Leader"],
    },
    {
      label: "Subject",
      name: "subject",
      type: "select",
      options: ["", "Mathematics", "Science", "English", "History"],
    },
    {
      label: "Age Group",
      name: "ageGroup",
      type: "select",
      options: ["", "3-5 Years", "6-10 Years", "11-15 Years", "16+ Years"],
    },
    {
      label: "Curriculum",
      name: "curriculum",
      type: "multi-checkbox",
      options: curriculumList,
    },
  ],
  // Step 4
  [
    {
      label: "Leadership Role",
      name: "leadershipRole",
      type: "select",
      options: ["", "Coordinator", "HOD", "Assistant Principal", "Principal"],
    },
  ],
  // Step 5
  [
    {
      label: "Available Day",
      name: "day",
      type: "select",
      options: [
        "",
        ...Array.from({ length: 31 }, (_, i) => (i + 1).toString()),
      ],
    },
    {
      label: "Available Month",
      name: "month",
      type: "select",
      options: [
        "",
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
      ],
    },
    {
      label: "Available Year",
      name: "year",
      type: "select",
      options: [
        "",
        ...Array.from({ length: 60 }, (_, i) => (2025 - i).toString()),
      ],
    },
  ],
];

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>(sampleProfile);

  const [editData, setEditData] = useState<any>(sampleProfile);
  const [saving, setSaving] = useState(false);
  const [editSection, setEditSection] = useState<number | null>(null);

  // When API works, replace sampleProfile with fetched data
  useEffect(() => {
    fetchUserProfile()
      .then((data) => {
        setProfile(data);
        setEditData(data);
      })
      .catch(() => {});
  }, []);

  // Fix for React-Bootstrap Form event types
  const handleEditChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setEditData((prev: any) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setEditData((prev: any) => ({ ...prev, [name]: files && files[0] }));
    } else {
      setEditData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleCurriculumChange = (item: string) => {
    setEditData((prev: any) => {
      const exists = prev.curriculum?.includes(item);
      return {
        ...prev,
        curriculum: exists
          ? prev.curriculum.filter((x: string) => x !== item)
          : [...(prev.curriculum || []), item],
      };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUserProfile(editData);
      setProfile(editData);

      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // renderEditModal removed as it was unused and caused a TS warning

  return (
    <div className="container p-4">
      {/* HEADER - TeacherProfileModal style with background */}
      <div className="row align-items-center mb-2">
        <div className="col-lg-9 col-md-9 col-sm-12">
          <div
            className="col-auto w-100 gap-3 p-3 d-flex align-items-center"
            style={{
              background: "#e6f2ff",
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              minHeight: 120,
              marginBottom: 20,
              padding: 0,
            }}
          >
            <div
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: "80px",
                height: "80px",
                background: "#0d3b85",
                color: "#fff",
                fontSize: "36px",
                fontWeight: "bold",
              }}
            >
              {profile.firstName
                ? profile.firstName[0].toUpperCase()
                : profile.email
                ? profile.email[0].toUpperCase()
                : "?"}
            </div>
            <div className="col d-flex flex-column justify-content-center">
              <h4 className="fw-bold m-0">
                {profile.firstName} {profile.lastName}
              </h4>
              <div className="text-muted small">{profile.email}</div>
              <div className="text-muted small">
                {profile.phone_number ? `  ${profile.phone_number}` : ""}
              </div>
            </div>
            {/* <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => setEditSection(1)}
            >
              Edit
            </button> */}
          </div>
          {/* 
        <div
          className="col-auto d-flex align-items-center"
          style={{ height: 120 }}
        ></div> */}
          {/* SECTIONS */}
          {/* Only render the merged Personal Information card, but exclude Email and Phone Number from display */}
          <div className="card mb-4 pb-3 border-bottom">
            <div className="d-flex justify-content-end align-items-center mb-2">
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={() => setEditSection(1)}
              >
                <FaUserEdit size={16} className="me-1" /> Edit
              </button>
            </div>
            <div className="row">
              {sectionFields[1]
                .filter((f) => f.name !== "email" && f.name !== "phone_number")
                .map((f) => (
                  <div className="col-md-4 mb-3" key={f.name}>
                    <div className="text-muted small">{f.label}</div>
                    <div className="fw-semibold">
                      {f.type === "checkbox"
                        ? profile[f.name]
                          ? "Yes"
                          : "No"
                        : f.type === "multi-checkbox"
                        ? Array.isArray(profile[f.name])
                          ? profile[f.name].join(", ")
                          : ""
                        : profile[f.name] || "-"}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Merge all other sections into one info card, using the provided design */}
          <div className="p-4 bg-white rounded shadow-sm info-card">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-2">Other Information</h5>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={() => setEditSection(99)}
              >
                <FaUserEdit size={16} className="me-1" /> Edit
              </button>
            </div>
            {/* Rows for each field in Professional, Leadership, Availability */}
            {[
              ...sectionFields[2],
              ...sectionFields[3],
              ...sectionFields[4],
            ].map((f) => (
              <React.Fragment key={f.name}>
                <Row className="mb-2 align-items-center">
                  {/* <Col xs={1}></Col> */}
                  <Col>
                    <span className="text-muted small">{f.label}</span>
                  </Col>
                  <Col className="text-end fw-semibold">
                    {f.type === "checkbox"
                      ? profile[f.name]
                        ? "Yes"
                        : "No"
                      : f.type === "multi-checkbox"
                      ? Array.isArray(profile[f.name])
                        ? profile[f.name].join(", ")
                        : ""
                      : profile[f.name] || "-"}
                  </Col>
                </Row>
              </React.Fragment>
            ))}
          </div>
          {/* Edit modal for merged info card */}
          {editSection === 99 && (
            <Modal show centered onHide={() => setEditSection(null)} size="lg">
              <Modal.Header closeButton>
                <Modal.Title>Edit Information</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <div className="row">
                    {[
                      ...sectionFields[2],
                      ...sectionFields[3],
                      ...sectionFields[4],
                    ].map((f) =>
                      f.name === "curriculum" ? (
                        <div
                          className="col-12 col-lg-12 col-md-12 col-sm-12"
                          key={f.name}
                        >
                          <Form.Group className="mb-3">
                            <Form.Label>{f.label}</Form.Label>
                            <div className="row">
                              {Array.isArray(f.options) &&
                                f.options.map((item: string) => (
                                  <div className="col-4 mb-2" key={item}>
                                    <Form.Check
                                      type="checkbox"
                                      label={item}
                                      checked={editData[f.name]?.includes(item)}
                                      onChange={() =>
                                        handleCurriculumChange(item)
                                      }
                                    />
                                  </div>
                                ))}
                            </div>
                          </Form.Group>
                        </div>
                      ) : (
                        <div
                          className="col-md-6 col-lg-6 col-sm-12 col-12"
                          key={f.name}
                        >
                          <Form.Group className="mb-3">
                            <Form.Label>{f.label}</Form.Label>
                            {f.type === "text" ? (
                              <Form.Control
                                type={f.type}
                                name={f.name}
                                value={editData[f.name] || ""}
                                onChange={handleEditChange}
                              />
                            ) : f.type === "select" ? (
                              <Form.Select
                                name={f.name}
                                value={editData[f.name] || ""}
                                onChange={handleEditChange}
                              >
                                {Array.isArray(f.options) &&
                                  f.options.map((opt: string) => (
                                    <option key={opt} value={opt}>
                                      {opt || "Please select"}
                                    </option>
                                  ))}
                              </Form.Select>
                            ) : f.type === "checkbox" ? (
                              <Form.Check
                                type="checkbox"
                                name={f.name}
                                checked={!!editData[f.name]}
                                onChange={handleEditChange}
                              />
                            ) : f.type === "file" ? (
                              <Form.Control
                                type="file"
                                name={f.name}
                                onChange={handleEditChange}
                              />
                            ) : null}
                          </Form.Group>
                        </div>
                      )
                    )}
                  </div>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setEditSection(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </Modal.Footer>
            </Modal>
          )}
          {/* Edit modal for Personal Information card */}
          {editSection === 1 && (
            <Modal show centered onHide={() => setEditSection(null)} size="lg">
              <Modal.Header closeButton>
                <Modal.Title>Edit Personal Information</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <div className="row">
                    {sectionFields[1]
                      .filter((f) => f.name !== "password")
                      .map((f) => (
                        <div
                          className="col-md-6 col-lg-6 col-sm-12 col-12"
                          key={f.name}
                        >
                          <Form.Group className="mb-3">
                            <Form.Label>{f.label}</Form.Label>
                            {f.type === "text" ? (
                              <Form.Control
                                type={f.type}
                                name={f.name}
                                value={editData[f.name] || ""}
                                onChange={handleEditChange}
                              />
                            ) : f.type === "select" ? (
                              <Form.Select
                                name={f.name}
                                value={editData[f.name] || ""}
                                onChange={handleEditChange}
                              >
                                {Array.isArray(f.options) &&
                                  f.options.map((opt: string) => (
                                    <option key={opt} value={opt}>
                                      {opt || "Please select"}
                                    </option>
                                  ))}
                              </Form.Select>
                            ) : f.type === "checkbox" ? (
                              <Form.Check
                                type="checkbox"
                                name={f.name}
                                checked={!!editData[f.name]}
                                onChange={handleEditChange}
                              />
                            ) : f.type === "file" ? (
                              <Form.Control
                                type="file"
                                name={f.name}
                                onChange={handleEditChange}
                              />
                            ) : null}
                          </Form.Group>
                        </div>
                      ))}
                  </div>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setEditSection(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </Modal.Footer>
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
