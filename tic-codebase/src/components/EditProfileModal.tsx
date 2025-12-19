import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { SUBJECT_OPTIONS, ROLES_OPTIONS } from "../common/subjectOptions";
import { countries } from "../pages/auth/steps/Step2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../services/api";

interface EditProfileModalProps {
  show: boolean;
  onClose: () => void;
  initialData: any;
  onSave: (data: any) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  show,
  onClose,
  initialData,
  onSave,
}) => {
  const [formData, setFormData] = useState<any>(initialData || {});

  React.useEffect(() => {
    setFormData(initialData || {});
  }, [initialData, show]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        // Handle multi-select fields (roles, subjects, leadershipRoles)
        if (
          ["roles", "subjects", "leadershipRoles"].includes(key) &&
          Array.isArray(value)
        ) {
          value.forEach((v: any) => {
            if (typeof v === "object" && v.value) {
              form.append(key, v.value);
            } else {
              form.append(key, v);
            }
          });
        } else if (Array.isArray(value)) {
          // For curriculum and other string arrays
          value.forEach((v: any) => form.append(key, v));
        } else {
          if (value instanceof Blob || typeof value === "string") {
            form.append(key, value);
          } else if (value !== null && value !== undefined) {
            form.append(key, String(value));
          }
        }
      });
      const response = await api.patch("/profile/update", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (!response) {
        throw new Error("Failed to update profile");
      }
      const data = response.data;
      onSave(data);
      onClose();
    } catch (err: any) {
      alert(err.message || "Failed to update profile");
    }
  };

  if (!formData) return null;

  return (
    <Modal
      show={show}
      onHide={onClose}
      size="lg"
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSave} autoComplete="off">
          {/* Email and Phone */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.phone_number || ""}
                  onChange={(e) => handleChange("phone_number", e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          {/* Qualified (Radio) */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Qualified</Form.Label>
                <div className="d-flex gap-3">
                  <Form.Check
                    type="radio"
                    label="Yes"
                    name="qualified"
                    value="yes"
                    checked={formData.qualified === "yes"}
                    onChange={(e) => handleChange("qualified", e.target.value)}
                  />
                  <Form.Check
                    type="radio"
                    label="No"
                    name="qualified"
                    value="no"
                    checked={formData.qualified === "no"}
                    onChange={(e) => handleChange("qualified", e.target.value)}
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>
          {/* English (Radio) and Position (Checkbox group) */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Fluent English?</Form.Label>
                <div className="d-flex gap-3">
                  <Form.Check
                    type="radio"
                    label="Yes"
                    name="english"
                    value="yes"
                    checked={formData.english === "yes"}
                    onChange={(e) => handleChange("english", e.target.value)}
                  />
                  <Form.Check
                    type="radio"
                    label="No"
                    name="english"
                    value="no"
                    checked={formData.english === "no"}
                    onChange={(e) => handleChange("english", e.target.value)}
                  />
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Position</Form.Label>
                <div className="d-flex gap-3">
                  {[
                    { label: "Teacher", value: "teacher" },
                    { label: "Senior Leader", value: "leader" },
                    { label: "Other", value: "other" },
                  ].map((option) => (
                    <Form.Check
                      key={option.value}
                      type="checkbox"
                      label={option.label}
                      value={option.value}
                      checked={
                        Array.isArray(formData.position) &&
                        formData.position.includes(option.value)
                      }
                      onChange={(e) => {
                        let newPositions = Array.isArray(formData.position)
                          ? [...formData.position]
                          : [];
                        if (e.target.checked) {
                          newPositions.push(option.value);
                        } else {
                          newPositions = newPositions.filter(
                            (v) => v !== option.value
                          );
                        }
                        handleChange("position", newPositions);
                      }}
                    />
                  ))}
                </div>
              </Form.Group>
            </Col>
          </Row>
          {/* Name, Gender, Nationality, Second Nationality */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.firstName || ""}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.lastName || ""}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            {/* Gender (Radio) */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Gender</Form.Label>
                <div className="d-flex gap-3">
                  <Form.Check
                    type="radio"
                    label="Male"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={(e) => handleChange("gender", e.target.value)}
                  />
                  <Form.Check
                    type="radio"
                    label="Female"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={(e) => handleChange("gender", e.target.value)}
                  />
                  <Form.Check
                    type="radio"
                    label="Other"
                    name="gender"
                    value="other"
                    checked={formData.gender === "other"}
                    onChange={(e) => handleChange("gender", e.target.value)}
                  />
                </div>
              </Form.Group>
            </Col>
            {/* Nationality Dropdown */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nationality</Form.Label>
                <Form.Select
                  value={formData.nationality || ""}
                  onChange={(e) => handleChange("nationality", e.target.value)}
                  required
                >
                  <option value="">Please select</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          {/* Second Nationality Dropdown and CV Upload */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Second Nationality</Form.Label>
                <Form.Select
                  value={formData.secondNationality || ""}
                  onChange={(e) =>
                    handleChange("secondNationality", e.target.value)
                  }
                >
                  <option value="">Please select</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>CV File</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange("cvFile", e.target.files?.[0] || null)
                  }
                />
                {formData.cvFile && typeof formData.cvFile === "string" && (
                  <div className="mt-1">
                    <small>Current: {formData.cvFile.split("/").pop()}</small>
                  </div>
                )}
                {formData.cvFile &&
                  typeof formData.cvFile === "object" &&
                  formData.cvFile.name && (
                    <div className="mt-1">
                      <small>Current: {formData.cvFile.name}</small>
                    </div>
                  )}
              </Form.Group>
            </Col>
          </Row>
          {/* Where did you hear about us? (Select) */}
          <Form.Group className="mb-3">
            <Form.Label>Where did you hear about us?</Form.Label>
            <Form.Select
              value={formData.hearFrom || ""}
              onChange={(e) => handleChange("hearFrom", e.target.value)}
            >
              <option value="">Please select</option>
              <option>LinkedIn</option>
              <option>Google Search</option>
              <option>Referral</option>
              <option>Social media</option>
            </Form.Select>
          </Form.Group>
          {/* Roles, Subjects (Multi-select) */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Teacher Roles</Form.Label>
                <Select
                  isMulti
                  options={ROLES_OPTIONS}
                  value={
                    Array.isArray(formData.roles)
                      ? formData.roles
                          .map((role: any) =>
                            typeof role === "string"
                              ? ROLES_OPTIONS.find(
                                  (opt) => opt.value === role
                                ) || null
                              : role
                          )
                          .filter(Boolean)
                      : []
                  }
                  onChange={(selected) => handleChange("roles", selected)}
                  classNamePrefix="react-select"
                  placeholder="Select role(s)..."
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Subjects</Form.Label>
                <Select
                  isMulti
                  options={SUBJECT_OPTIONS}
                  value={
                    Array.isArray(formData.subjects)
                      ? formData.subjects
                          .map((subject: any) =>
                            typeof subject === "string"
                              ? SUBJECT_OPTIONS.find(
                                  (opt) => opt.value === subject
                                ) || null
                              : subject
                          )
                          .filter(Boolean)
                      : []
                  }
                  onChange={(selected) => handleChange("subjects", selected)}
                  classNamePrefix="react-select"
                  placeholder="Select subject(s)..."
                />
              </Form.Group>
            </Col>
          </Row>
          {/* Age Group (Dropdown) and Curriculum (Checkbox group) */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Age Group</Form.Label>
                <Form.Select
                  value={formData.ageGroup || ""}
                  onChange={(e) => handleChange("ageGroup", e.target.value)}
                >
                  <option value="">Please select</option>
                  <option value="3-5 Years">3-5 Years</option>
                  <option value="6-10 Years">6-10 Years</option>
                  <option value="11-15 Years">11-15 Years</option>
                  <option value="16+ Years">16+ Years</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Curriculum Experience</Form.Label>
                <div className="row">
                  {[
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
                  ].map((item, idx) => (
                    <div className="col-6" key={`curriculum-${item}-${idx}`}>
                      <Form.Check
                        type="checkbox"
                        label={item}
                        checked={
                          Array.isArray(formData.curriculum) &&
                          formData.curriculum.includes(item)
                        }
                        onChange={() => {
                          const exists =
                            Array.isArray(formData.curriculum) &&
                            formData.curriculum.includes(item);
                          let newCurriculum = Array.isArray(formData.curriculum)
                            ? [...formData.curriculum]
                            : [];
                          if (exists) {
                            newCurriculum = newCurriculum.filter(
                              (x) => x !== item
                            );
                          } else {
                            newCurriculum.push(item);
                          }
                          handleChange("curriculum", newCurriculum);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </Form.Group>
            </Col>
          </Row>
          {/* Leadership Roles (Multi-select) */}
          <Form.Group className="mb-3">
            <Form.Label>Leadership Roles</Form.Label>
            <Select
              isMulti
              options={[
                { value: "coordinator", label: "Coordinator" },
                { value: "hod", label: "HOD" },
                { value: "assistant_principal", label: "Assistant Principal" },
                { value: "principal", label: "Principal" },
              ]}
              value={
                Array.isArray(formData.leadershipRoles)
                  ? formData.leadershipRoles
                      .map((role: any) =>
                        typeof role === "string"
                          ? [
                              { value: "coordinator", label: "Coordinator" },
                              { value: "hod", label: "HOD" },
                              {
                                value: "assistant_principal",
                                label: "Assistant Principal",
                              },
                              { value: "principal", label: "Principal" },
                            ].find((opt) => opt.value === role) || null
                          : role
                      )
                      .filter(Boolean)
                  : []
              }
              onChange={(selected) => handleChange("leadershipRoles", selected)}
              classNamePrefix="react-select"
              placeholder="Select leadership role(s)..."
            />
          </Form.Group>
          {/* Job Alerts (Radio) and Available Day (DatePicker) */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Send me job alerts</Form.Label>
                <div className="d-flex gap-3">
                  <Form.Check
                    type="radio"
                    label="Yes"
                    name="job_alerts"
                    value="yes"
                    checked={formData.job_alerts === "yes"}
                    onChange={(e) => handleChange("job_alerts", e.target.value)}
                  />
                  <Form.Check
                    type="radio"
                    label="No"
                    name="job_alerts"
                    value="no"
                    checked={formData.job_alerts === "no"}
                    onChange={(e) => handleChange("job_alerts", e.target.value)}
                  />
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>I will be available from</Form.Label>
                <DatePicker
                  selected={
                    formData.available_day
                      ? new Date(formData.available_day)
                      : null
                  }
                  onChange={(date) =>
                    handleChange(
                      "available_day",
                      date ? date.toISOString().split("T")[0] : ""
                    )
                  }
                  className="form-control"
                  placeholderText="Select available date"
                  dateFormat="yyyy-MM-dd"
                  isClearable
                  autoComplete="off"
                  minDate={new Date()}
                />
              </Form.Group>
            </Col>
          </Row>
          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit">
              Save
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditProfileModal;
