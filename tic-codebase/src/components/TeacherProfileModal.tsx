import React, { useState } from "react";
import "./TeacherProfileModal.css";
import { Modal } from "react-bootstrap";
import SendMessageModal from "./SendMessageModal";
import { ROLES_OPTIONS, SUBJECT_OPTIONS } from "../common/subjectOptions";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import { LEADERSHIP_OPTIONS } from "../common/subjectOptions";

const POSITION_OPTIONS = [
  { label: "Teacher", value: "teacher" },
  { label: "Senior Leader", value: "leader" },
  { label: "Other", value: "other" },
];
const AGE_GROUP_OPTIONS = [
  { value: "3-5 Years", label: "3-5 Years" },
  { value: "6-10 Years", label: "6-10 Years" },
  { value: "11-15 Years", label: "11-15 Years" },
  { value: "16+ Years", label: "16+ Years" },
];

interface Option {
  label: string;
  value: string;
}

function getLabels(
  values: string | string[] | undefined,
  options: Option[]
): string {
  if (!values) return "-";
  const arr = Array.isArray(values) ? values : [values];
  return arr
    .map((v) => {
      const found = options.find((o) => o.value === v);
      return found ? found.label : v;
    })
    .join(", ");
}

interface TeacherProfileModalProps {
  show: boolean;
  onClose: () => void;
  teacher: any;
}

const TeacherProfileModal: React.FC<TeacherProfileModalProps> = ({
  show,
  onClose,
  teacher,
}) => {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [cvError, setCvError] = useState<string | null>(null);
  if (!show) return null;
  // Support both teacher_profile and applicant_profile as the profile source
  const profile =
    teacher && (teacher.teacher_profile || teacher.applicant_profile)
      ? teacher.teacher_profile || teacher.applicant_profile
      : {};

  // Helper to get a random color based on teacher id (same as job listing)
  function getAvatarColor(id: number) {
    const colors = [
      "#0d6efd", // blue
      "#6610f2", // indigo
      "#6f42c1", // purple
      "#d63384", // pink
      "#fd7e14", // orange
      "#20c997", // teal
      "#198754", // green
      "#ffc107", // yellow
      "#dc3545", // red
      "#343a40", // dark
    ];
    if (typeof id !== "number" || isNaN(id)) return colors[0];
    return colors[Math.abs(id) % colors.length];
  }

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Teacher Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: 0 }}>
        {!teacher ? (
          <div className="p-4 text-center text-muted">
            No teacher data available.
          </div>
        ) : (
          <div className="container my-4">
            <div className="row g-4">
              {/* LEFT SIDE */}
              <div className="col-lg-12 d-flex  align-items-center">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mb-1"
                  style={{
                    width: "60px",
                    height: "60px",
                    background: getAvatarColor(teacher.id),
                    color: "#fff",
                    fontSize: "28px",
                    fontWeight: "bold",
                  }}
                >
                  {teacher.full_name ? teacher.full_name[0].toUpperCase() : "?"}
                </div>
                <div style={{ marginLeft: "15px" }}>
                  <h4>{teacher.full_name}</h4>
                  <div className="text-muted small">{teacher.email}</div>
                  {teacher.location && (
                    <div className="text-muted small mt-1">
                      {teacher.location}
                    </div>
                  )}
                </div>
              </div>
              {/* RIGHT SIDE */}
              <div className="col-lg-12">
                <div className=" p-2 mb-3">
                  <h6 className="mb-3">Personal Info</h6>
                  <div className="d-flex mb-1">
                    <small className="text-muted">First Name :</small>
                    <small className="ml-2">{teacher.first_name}</small>
                  </div>
                  <div className="mb-1">
                    <small className="text-muted">Last Name :</small>
                    <small className="ml-2">{teacher.last_name}</small>
                  </div>
                  <div className="mb-1">
                    <small className="text-muted">Gender :</small>
                    <small className="ml-2">
                      {profile.gender
                        ? profile.gender.charAt(0).toUpperCase() +
                          profile.gender.slice(1).toLowerCase()
                        : "-"}
                    </small>
                  </div>
                  <div className="d-flex mb-2 ">
                    <small className="text-muted">
                      Are you a fully qualified teacher / senior leader? :
                    </small>
                    <small className="ml-2">
                      {profile.qualified
                        ? profile.qualified.charAt(0).toUpperCase() +
                          profile.qualified.slice(1).toLowerCase()
                        : "-"}
                    </small>
                  </div>
                  <div className="d-flex mb-2 ">
                    <small className="text-muted">
                      Are you a fluent English speaker? :
                    </small>
                    <small className="ml-2">
                      {profile.english
                        ? profile.english.charAt(0).toUpperCase() +
                          profile.english.slice(1).toLowerCase()
                        : "-"}
                    </small>
                  </div>
                  <div className="d-flex mb-2 ">
                    <small className="text-muted">
                      What positions are you looking for? :
                    </small>
                    <small className="ml-2">
                      {getLabels(profile.position, POSITION_OPTIONS)}
                    </small>
                  </div>
                  <div className="d-flex mb-2 ">
                    <small className="text-muted">Nationality :</small>
                    <small className="ml-2">{profile.nationality}</small>
                  </div>
                  <div className="d-flex mb-2 ">
                    <small className="text-muted">Second nationality :</small>
                    <small className="ml-2">{profile.second_nationality}</small>
                  </div>
                  <div className="d-flex mb-2 ">
                    <small className="text-muted">
                      Where did you hear about us? :
                    </small>
                    <small className="ml-2">{profile.hear_from}</small>
                  </div>
                  <div className="d-flex flex-wrap mb-2 ">
                    <small className="text-muted mr-2">Teacher Role :</small>
                    <small className="">
                      {getLabels(profile.roles, ROLES_OPTIONS)}
                    </small>
                  </div>
                  <div className="d-flex flex-wrap mb-2 ">
                    <small className="text-muted mr-2">Subjects :</small>
                    <small className="">
                      {getLabels(profile.subjects, SUBJECT_OPTIONS)}
                    </small>
                  </div>
                  <div className="d-flex mb-2 ">
                    <small className="text-muted">Age group :</small>
                    <small className="ml-2">
                      {getLabels(profile.age_group, AGE_GROUP_OPTIONS)}
                    </small>
                  </div>
                  <div className="d-flex mb-2 ">
                    <small className="text-muted">
                      Curriculum experience :
                    </small>
                    <small className="ml-2">
                      {Array.isArray(profile.curriculum)
                        ? profile.curriculum.join(", ")
                        : profile.curriculum}
                    </small>
                  </div>
                  <div className="d-flex mb-2 ">
                    <small className="text-muted">Leadership roles :</small>
                    <small className="ml-2">
                      {Array.isArray(profile.leadership_role)
                        ? profile.leadership_role.map(
                            (role: string, idx: number) => {
                              const found = LEADERSHIP_OPTIONS.find(
                                (opt) => opt.value === role
                              );
                              return (
                                <span key={role}>
                                  {found ? found.label : role}
                                  {idx <
                                  (profile.leadership_role as string[]).length -
                                    1
                                    ? ", "
                                    : ""}
                                </span>
                              );
                            }
                          )
                        : (() => {
                            const found = LEADERSHIP_OPTIONS.find(
                              (opt) => opt.value === profile.leadership_role
                            );
                            return found
                              ? found.label
                              : profile.leadership_role;
                          })()}
                    </small>
                  </div>
                  <div className="d-flex mb-2 ">
                    <small className="text-muted">Send me job alerts:</small>
                    <small className="ml-2">
                      {profile.job_alerts === true
                        ? "Yes"
                        : profile.job_alerts === false
                        ? "No"
                        : profile.job_alerts}
                    </small>
                  </div>
                  <div className="d-flex mb-2 ">
                    <small className="text-muted">
                      I will be available from :
                    </small>
                    <small className="ml-2">
                      {profile.available_from || profile.available_date || "-"}
                    </small>
                  </div>
                </div>
                <div className="col-lg-12">
                  <h6 className="mt-3">CV</h6>
                  {profile?.cv_file ? (
                    cvError ? (
                      <>
                        <div className="alert alert-danger mt-3">{cvError}</div>
                        {/* Fallback to iframe for PDF */}
                        {profile.cv_file.endsWith(".pdf") && (
                          <iframe
                            src={profile.cv_file}
                            width="100%"
                            height="400"
                            style={{ border: "none" }}
                            title="PDF Preview"
                          />
                        )}
                      </>
                    ) : profile.cv_file.endsWith(".docx") ? (
                      <DocViewer
                        documents={[{ uri: profile.cv_file }]}
                        pluginRenderers={DocViewerRenderers}
                        style={{ height: 300 }}
                        // @ts-ignore
                        onError={() =>
                          setCvError(
                            "Failed to preview document. Try downloading instead."
                          )
                        }
                      />
                    ) : profile.cv_file.endsWith(".pdf") ? (
                      <iframe
                        src={profile.cv_file}
                        width="100%"
                        height="400"
                        style={{ border: "none" }}
                        title="PDF Preview"
                      />
                    ) : (
                      <div className="text-muted">
                        Preview not supported for this file type.
                      </div>
                    )
                  ) : (
                    <div className="text-muted">No CV uploaded.</div>
                  )}
                  <div className="mt-2">
                    {profile.cv_file ? (
                      <a
                        href={profile.cv_file}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download
                      </a>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Common Send Message Modal */}
            <SendMessageModal
              show={showMessageModal}
              onClose={() => setShowMessageModal(false)}
              teacherId={teacher.id}
            />
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};
export default TeacherProfileModal;
