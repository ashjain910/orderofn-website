import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { SUBJECT_OPTIONS, ROLES_OPTIONS } from "../common/subjectOptions";
import { countries } from "../pages/auth/steps/Step2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../services/api";
import { toast } from "react-toastify";
import { toastOptions } from "../utils/toastOptions";
import { getLeadershipRoleLabel } from "../constants/leadershipRoles";
import { FaRegFileAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

interface EditProfileModalProps {
  show: boolean;
  onClose: () => void;
  initialData: any;
  onSave: (data: any) => void;
  leadershipOptions: Array<{ label: string; value: string }>;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  show,
  onClose,
  initialData,
  leadershipOptions,
}) => {
  const [formData, setFormData] = useState<any>(initialData || {});
  const [saving, setSaving] = useState(false);
  console.log("Form data initialized:", initialData);

  React.useEffect(() => {
    if (
      show &&
      initialData &&
      JSON.stringify(formData) !== JSON.stringify(initialData)
    ) {
      setFormData(initialData);
    }
  }, [show, initialData]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        // Handle multi-select fields (roles, subjects, leadership_role)
        if (
          ["roles", "subjects", "leadership_role", "age_group"].includes(key) &&
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
      if (response.status === 200 || response.status === 201) {
        toast.success("Profile updated successfully!", toastOptions);
        setTimeout(() => {
          onClose();
          setSaving(false);
        }, 4000);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        return;
      }
      // If not 200/201 or missing tokens, show error
      toast.error("Profile update failed. Please try again.", toastOptions);
      setSaving(false);
    } catch (error: any) {
      let message = "Profile update failed. Please try again.";
      if (
        error?.response?.status === 400 &&
        typeof error.response.data === "object"
      ) {
        const data = error.response.data;
        function flattenErrors(errObj: any): string[] {
          if (typeof errObj === "string") return [errObj];
          if (Array.isArray(errObj)) return errObj.flatMap(flattenErrors);
          if (typeof errObj === "object" && errObj !== null)
            return Object.values(errObj).flatMap(flattenErrors);
          return [];
        }
        const allErrors = flattenErrors(data);
        allErrors.forEach((err: string) => {
          toast.error(err, toastOptions);
        });
      } else if (error?.response?.data) {
        toast.error(error.response.data, toastOptions);
      } else if (error?.message) {
        toast.error(error.message, toastOptions);
      } else {
        toast.error(message, toastOptions);
      }
      setSaving(false);
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
        {saving && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(255,255,255,0.7)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Saving...</span>
            </div>
          </div>
        )}
        <Form onSubmit={handleSave} autoComplete="off">
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
                  value={formData.phone || ""}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            {/* Qualified (Radio) */}
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Are you a fully qualified teacher / senior leader?
                </Form.Label>
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
            {/* English (Radio) and Position (Checkbox group) */}

            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Are you a fluent English speaker?</Form.Label>
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
            {/* Gender (Radio) */}
            <Col md={12}>
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
                    value="others"
                    checked={formData.gender === "others"}
                    onChange={(e) => handleChange("gender", e.target.value)}
                  />
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>What positions are you looking for?</Form.Label>
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
            <Col md={12}>
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
          </Row>

          <Row>
            {/* Nationality Dropdown */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nationality</Form.Label>
                <Form.Select
                  value={
                    typeof formData.nationality === "string"
                      ? formData.nationality
                      : ""
                  }
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
            {/* Second Nationality Dropdown and CV Upload */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Second Nationality</Form.Label>
                <Form.Select
                  value={
                    typeof formData.second_nationality === "string"
                      ? formData.second_nationality
                      : ""
                  }
                  onChange={(e) =>
                    handleChange("second_nationality", e.target.value)
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
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>CV File</Form.Label>
                <div
                  className={`upload-box__ d-flex flex-column align-items-center justify-content-center mb-2`}
                  style={{
                    opacity: 1,
                    transition: "opacity 0.2s",
                    border: "2px dashed #ccc",
                    background: "#d8ecff",
                    padding: 16,
                  }}
                >
                  <label
                    htmlFor="cv-upload"
                    className="upload-label__ w-100"
                    style={{ cursor: "pointer" }}
                  >
                    <span className="upload-icon__">
                      <FaRegFileAlt size={30} />
                    </span>
                    <span className="upload-text__">
                      Click here to upload resume
                    </span>
                    <span className="upload-note__">
                      Upload .pdf or .docx files
                    </span>
                    <input
                      id="cv-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="upload-input__"
                      style={{ display: "none" }}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChange("cv_file", e.target.files?.[0] || null)
                      }
                    />
                  </label>
                  {/* Show file name and remove button if CV file exists */}
                  {formData.cv_file && (
                    <div className="mt-2 d-flex align-items-center gap-2">
                      {typeof formData.cv_file === "string" ? (
                        <>
                          <a
                            href={formData.cv_file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="fw-semibold"
                            style={{
                              textDecoration: "underline",
                              color: "#123a93",
                            }}
                          >
                            {formData.cv_file.split("/").pop()}
                          </a>
                        </>
                      ) : formData.cv_file.name ? (
                        <span
                          className="fw-semibold"
                          style={{ color: "#123a93" }}
                        >
                          {formData.cv_file.name}
                        </span>
                      ) : null}
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          handleChange("cv_file", null);
                          const input = document.getElementById(
                            "cv-upload"
                          ) as HTMLInputElement | null;
                          if (input) input.value = "";
                        }}
                        style={{ padding: "2px 8px", fontSize: 14 }}
                      >
                        <IoClose size={16} />
                      </Button>
                    </div>
                  )}
                </div>
              </Form.Group>
            </Col>

            <Col md={6}>
              {/* Where did you hear about us? (Select) */}
              <Form.Group className="mb-3">
                <Form.Label>Where did you hear about us?</Form.Label>
                <Form.Select
                  value={
                    typeof formData.hear_from === "string"
                      ? formData.hear_from
                      : ""
                  }
                  onChange={(e) => handleChange("hear_from", e.target.value)}
                >
                  <option value="">Please select</option>
                  <option>LinkedIn</option>
                  <option>Google Search</option>
                  <option>Referral</option>
                  <option>Social media</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Roles, Subjects (Multi-select) */}
          <Row>
            <Col md={12}>
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
            <Col md={12}>
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
            {/* Leadership Roles (Multi-select) */}
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Leadership Roles</Form.Label>
                <Select
                  isMulti
                  options={leadershipOptions}
                  value={
                    Array.isArray(formData.leadership_role)
                      ? formData.leadership_role
                          .map((role: any) =>
                            typeof role === "string"
                              ? leadershipOptions.find(
                                  (opt) => opt.value === role
                                ) || null
                              : role
                          )
                          .filter(Boolean)
                      : []
                  }
                  onChange={(selected) =>
                    handleChange("leadership_role", selected)
                  }
                  classNamePrefix="react-select"
                  placeholder="Select leadership role(s)..."
                />
                {/* Leadership Roles Preview (if needed) */}
                {Array.isArray(formData.leadership_role) &&
                  formData.leadership_role.length > 0 && (
                    <div className="mb-2">
                      <small className="text-muted">
                        Selected Leadership roles:{" "}
                      </small>
                      <small>
                        {formData.leadership_role
                          .map((role: any) =>
                            getLeadershipRoleLabel(
                              typeof role === "string" ? role : role.value
                            )
                          )
                          .join(", ")}
                      </small>
                    </div>
                  )}
              </Form.Group>
            </Col>
          </Row>
          {/* Age Group (Dropdown) and Curriculum (Checkbox group) */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Age Group</Form.Label>
                <Select
                  isMulti
                  options={[
                    { value: "3-5 Years", label: "3-5 Years" },
                    { value: "6-10 Years", label: "6-10 Years" },
                    { value: "11-15 Years", label: "11-15 Years" },
                    { value: "16+ Years", label: "16+ Years" },
                  ]}
                  closeMenuOnSelect={false}
                  value={
                    Array.isArray(formData.age_group)
                      ? formData.age_group
                          .map((ag: any) =>
                            typeof ag === "string"
                              ? [
                                  { value: "3-5 Years", label: "3-5 Years" },
                                  { value: "6-10 Years", label: "6-10 Years" },
                                  {
                                    value: "11-15 Years",
                                    label: "11-15 Years",
                                  },
                                  { value: "16+ Years", label: "16+ Years" },
                                ].find((opt) => opt.value === ag) || null
                              : ag
                          )
                          .filter(Boolean)
                      : []
                  }
                  onChange={(selected: any) =>
                    handleChange(
                      "age_group",
                      Array.isArray(selected) ? selected : []
                    )
                  }
                  classNamePrefix={"react-select"}
                  placeholder="Select age group(s)..."
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>I will be available from</Form.Label>
                <DatePicker
                  selected={(() => {
                    if (!formData.available_date) return null;
                    const d = new Date(formData.available_date);
                    return isNaN(d.getTime()) ? null : d;
                  })()}
                  onChange={(date) =>
                    handleChange(
                      "available_date",
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
            <Col md={12}>
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
                    "New Zealand",
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
