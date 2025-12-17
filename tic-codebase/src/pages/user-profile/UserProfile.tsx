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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { fetchUserProfile, updateUserProfile } from "./api";
import { toast } from "react-toastify";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
// import { FaUserEdit } from "react-icons/fa";

const sampleProfile = {
  // Step1
  email: "",
  password: "",
  qualified: "",
  english: "",
  position: "",
  phone_number: "",
  // Step2
  firstName: "",
  lastName: "",
  gender: "",
  nationality: "",
  secondNationality: "",
  cvFile: null,
  hearFrom: "",
  // Step3
  roles: "",
  subjects: "",
  ageGroup: "",
  curriculum: "",
  // Step4
  leadershipRoles: "",
  // Step5
  job_alerts: "",
  available_day: "",
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
      name: "roles",
      type: "multi-select",
      options: [
        { value: "academic_registrar", label: "Academic registrar" },
        { value: "business_manager", label: "Business manager" },
        { value: "careers_counsellor", label: "Careers Counsellor" },
        { value: "deputy_head_primary", label: "Deputy Head of Primary" },
        { value: "deputy_head_secondary", label: "Deputy Head of Secondary" },
        { value: "deputy_head_school", label: "Deputy Head of School" },
        { value: "director", label: "Director" },
        { value: "director_of_studies", label: "Director of Studies" },
        { value: "grade_level_coordinator", label: "Grade level Coordinator" },
        { value: "head_of_department", label: "Head of Department" },
        { value: "head_of_early_years", label: "Head of Early Years" },
        { value: "head_of_prep_school", label: "Head of Prep School" },
        { value: "head_of_primary", label: "Head of Primary" },
        { value: "head_of_secondary", label: "Head of Secondary" },
        { value: "head_of_section", label: "Head of Section" },
        { value: "head_of_subject", label: "Head of Subject" },
        { value: "head_of_year", label: "Head of Year" },
        { value: "head_teacher", label: "Head Teacher" },
        { value: "house_master", label: "House Master" },
        { value: "house_mistress", label: "House Mistress" },
        { value: "ib_coordinator", label: "IB Coordinator" },
        { value: "inspector", label: "Inspector" },
        { value: "phase_coordinator", label: "Phase Coordinator" },
        { value: "principal", label: "Principal" },
        { value: "principal_inspector", label: "Principal Inspector" },
        { value: "psychologist", label: "Psychologist" },
        { value: "second_in_department", label: "Second in Department" },
        { value: "senior_inspector", label: "Senior Inspector" },
        { value: "teacher", label: "Teacher" },
        { value: "vice_director", label: "Vice Director" },
        { value: "vice_principal", label: "Vice Principal" },
      ],
    },
    {
      label: "Subject",
      name: "subjects",
      type: "multi-select",
      options: [
        { value: "academic_registrar", label: "Academic Registrar" },
        { value: "american_studies", label: "American Studies" },
        { value: "arabic", label: "Arabic" },
        { value: "art_and_design", label: "Art and Design" },
        { value: "biology", label: "Biology" },
        { value: "business_studies", label: "Business Studies" },
        { value: "calculus", label: "Calculus" },
        { value: "careers", label: "Careers" },
        { value: "chemistry", label: "Chemistry" },
        { value: "chinese", label: "Chinese" },
        { value: "citizenship", label: "Citizenship" },
        { value: "classical_studies", label: "Classical Studies" },
        { value: "computer_science", label: "Computer Science" },
        { value: "computer_studies", label: "Computer Studies" },
        { value: "dance", label: "Dance" },
        { value: "design_technology", label: "Design Technology" },
        { value: "drama", label: "Drama" },
        { value: "eal", label: "EAL" },
        { value: "early_years", label: "Early Years" },
        { value: "economics", label: "Economics" },
        { value: "education", label: "Education" },
        { value: "english", label: "English" },
        {
          value: "english_as_additional_language",
          label: "English as an Additional Language",
        },
        { value: "environmental_studies", label: "Environmental Studies" },
        { value: "film_studies", label: "Film Studies" },
        { value: "french", label: "French" },
        { value: "geography", label: "Geography" },
        { value: "geology", label: "Geology" },
        { value: "german", label: "German" },
        { value: "global_perspectives", label: "Global Perspectives" },
        { value: "health", label: "Health" },
        { value: "history", label: "History" },
        { value: "home_economics", label: "Home Economics" },
        { value: "head_teacher", label: "Head Teacher" },
        { value: "house_master", label: "House Master" },
        { value: "house_mistress", label: "House Mistress" },
        { value: "humanities", label: "Humanities" },
        { value: "ict", label: "ICT" },
        { value: "inspector", label: "Inspector" },
        { value: "japanese", label: "Japanese" },
        { value: "learning_support", label: "Learning Support" },
        { value: "legal_studies", label: "Legal Studies" },
        { value: "librarianship", label: "Librarianship" },
        { value: "literature", label: "Literature" },
        { value: "mathematics", label: "Mathematics" },
        { value: "media_studies", label: "Media Studies" },
        { value: "mfl", label: "MFL" },
        {
          value: "middle_school_generalist",
          label: "Middle School Generalist",
        },
        { value: "music", label: "Music" },
        { value: "outdoor_education", label: "Outdoor Education" },
        { value: "philosophy", label: "Philosophy" },
        { value: "physical_education", label: "Physical Education" },
        { value: "physics", label: "Physics" },
        { value: "politics", label: "Politics" },
        { value: "primary", label: "Primary" },
        { value: "pshe", label: "PSHE" },
        { value: "psychology", label: "Psychology" },
        { value: "religious_education", label: "Religious Education" },
        { value: "russian", label: "Russian" },
        { value: "school_counselor", label: "School Counselor" },
        { value: "school_psychologist", label: "School Psychologist" },
        { value: "science", label: "Science" },
        { value: "secondary", label: "Secondary" },
        { value: "social_sciences", label: "Social Sciences" },
        { value: "sociology", label: "Sociology" },
        { value: "spanish", label: "Spanish" },
        { value: "special_needs", label: "Special Needs" },
        { value: "statistics", label: "Statistics" },
        { value: "thai", label: "Thai" },
        { value: "theatre_studies", label: "Theatre Studies" },
        { value: "theory_of_knowledge", label: "Theory of Knowledge" },
      ],
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
      name: "leadershipRoles",
      type: "multi-select",
      options: [
        { value: "coordinator", label: "Coordinator" },
        { value: "hod", label: "HOD" },
        { value: "assistant_principal", label: "Assistant Principal" },
        { value: "principal", label: "Principal" },
      ],
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
    // Removed Available Month and Available Year
  ],
];

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [editData, setEditData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [editSection, setEditSection] = useState<number | null>(null);

  // Helper to reset editData to empty values
  const resetEditData = () => setEditData({ ...sampleProfile });

  // When API works, replace sampleProfile with fetched data
  useEffect(() => {
    fetchUserProfile()
      .then((data) => {
        // Merge teacher_profile and root fields for UI compatibility
        const merged = {
          ...data.teacher_profile,
          // Remove all snake_case keys if present
          ...(data.teacher_profile && {
            leadership_role: undefined,
            hear_from: undefined,
            second_nationality: undefined,
            cv_file: undefined,
          }),
          email: data.email,
          firstName: data.first_name || data.teacher_profile?.first_name || "",
          lastName: data.last_name || data.teacher_profile?.last_name || "",
          phone_number:
            data.phone_number || data.teacher_profile?.phone_number || "",
          // Map other fields as needed
          curriculum: data.curriculum || data.teacher_profile?.curriculum || [],
          subjects: data.subjects || data.teacher_profile?.subjects || "",
          roles: data.roles || data.teacher_profile?.roles || "",
          ageGroup: data.age_group || data.teacher_profile?.age_group || "",
          leadershipRole:
            data.leadership_role || data.teacher_profile?.leadership_role || "",
          day: data.available_day || data.teacher_profile?.available_day || "",
          month:
            data.available_month || data.teacher_profile?.available_month || "",
          year:
            data.available_year || data.teacher_profile?.available_year || "",
          hearFrom: data.hear_from || data.teacher_profile?.hear_from || "",
          secondNationality:
            data.second_nationality ||
            data.teacher_profile?.second_nationality ||
            false,
          cvFile: data.cv_file || data.teacher_profile?.cv_file || null,
        };
        // Explicitly delete all snake_case keys if they exist
        delete merged.leadership_role;
        delete merged.hear_from;
        delete merged.second_nationality;
        delete merged.cv_file;
        setProfile(merged);
        setEditData(merged);
      })
      .catch(() => {
        setProfile({});
        setEditData({});
      });
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

  if (!profile || !editData) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: 300 }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

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
                className="btn btn-primary"
                onClick={() => setEditSection(1)}
              >
                Edit
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
          {editSection !== null && (
            <Modal
              show
              centered
              onHide={() => {
                setEditSection(null);
                resetEditData();
              }}
              size="lg"
              onShow={() => setEditData(profile)}
            >
              <Modal.Header closeButton>
                <Modal.Title>Edit Profile</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <div className="row">
                    {/* All fields from sectionFields[1] (except password) */}
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
                                  f.options.map((opt: any) => {
                                    const value =
                                      typeof opt === "string" ? opt : opt.value;
                                    const label =
                                      typeof opt === "string" ? opt : opt.label;
                                    return (
                                      <option key={value} value={value}>
                                        {label || "Please select"}
                                      </option>
                                    );
                                  })}
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
                    {/* All fields from sectionFields[2], [3], [4] */}
                    {[
                      ...sectionFields[2],
                      ...sectionFields[3],
                      ...sectionFields[4],
                    ].map((f) => {
                      if (f.type === "multi-select") {
                        return (
                          <div
                            className="col-md-6 col-lg-6 col-sm-12 col-12"
                            key={f.name}
                          >
                            <Form.Group className="mb-3">
                              <Form.Label>{f.label}</Form.Label>
                              <Select
                                isMulti
                                options={f.options}
                                closeMenuOnSelect={false}
                                value={editData[f.name] || []}
                                onChange={(selected: any) =>
                                  setEditData((prev: any) => ({
                                    ...prev,
                                    [f.name]: Array.isArray(selected)
                                      ? selected
                                      : [],
                                  }))
                                }
                                classNamePrefix={"react-select"}
                                placeholder={`Select ${f.label.toLowerCase()}...`}
                              />
                            </Form.Group>
                          </div>
                        );
                      } else if (f.name === "curriculum") {
                        return (
                          <div
                            className="col-12 col-lg-12 col-md-12 col-sm-12"
                            key={f.name}
                          >
                            <Form.Group className="mb-3">
                              <Form.Label>{f.label}</Form.Label>
                              <div className="row">
                                {Array.isArray(f.options) &&
                                  f.options.map((item: any) => {
                                    const value =
                                      typeof item === "string"
                                        ? item
                                        : item.value;
                                    const label =
                                      typeof item === "string"
                                        ? item
                                        : item.label;
                                    return (
                                      <div className="col-4 mb-2" key={value}>
                                        <Form.Check
                                          type="checkbox"
                                          label={label}
                                          checked={editData[f.name]?.includes(
                                            value
                                          )}
                                          onChange={() =>
                                            handleCurriculumChange(value)
                                          }
                                        />
                                      </div>
                                    );
                                  })}
                              </div>
                            </Form.Group>
                          </div>
                        );
                      } else if (f.name === "available_day") {
                        return (
                          <div
                            className="col-md-6 col-lg-6 col-sm-12 col-12"
                            key={f.name}
                          >
                            <Form.Group className="mb-3">
                              <Form.Label>{f.label}</Form.Label>
                              <DatePicker
                                selected={
                                  editData.available_day
                                    ? new Date(editData.available_day)
                                    : null
                                }
                                onChange={(date: Date | null) =>
                                  setEditData((prev: any) => ({
                                    ...prev,
                                    available_day: date
                                      ? date.toISOString().split("T")[0]
                                      : "",
                                  }))
                                }
                                className="form-control"
                                placeholderText="Select available date"
                                dateFormat="yyyy-MM-dd"
                                isClearable
                                autoComplete="off"
                                minDate={new Date()}
                              />
                            </Form.Group>
                          </div>
                        );
                      } else {
                        return (
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
                                    f.options.map((opt: any) => {
                                      const value =
                                        typeof opt === "string"
                                          ? opt
                                          : opt.value;
                                      const label =
                                        typeof opt === "string"
                                          ? opt
                                          : opt.label;
                                      return (
                                        <option key={value} value={value}>
                                          {label || "Please select"}
                                        </option>
                                      );
                                    })}
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
                        );
                      }
                    })}
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
