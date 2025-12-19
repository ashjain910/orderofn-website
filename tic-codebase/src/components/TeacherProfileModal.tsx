import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import SendMessageModal from "./SendMessageModal";

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
  if (!show) return null;
  // Support both teacher_profile and applicant_profile as the profile source
  const profile =
    teacher && (teacher.teacher_profile || teacher.applicant_profile)
      ? teacher.teacher_profile || teacher.applicant_profile
      : {};

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
          <div
            className="modal-content p-0"
            style={{ background: "#f8f9fa", border: "none" }}
          >
            {/* Cover Banner */}
            <div
              className=" d-flex"
              style={{
                height: "120px",
                background: "#e6f2ff",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
                borderBottomLeftRadius: "20px",
                borderBottomRightRadius: "20px",
              }}
            >
              {/* Name + Email + Location */}
              <div className="d-flex justify-content-between w-100 px-3 align-items-center">
                <div className="col d-flex flex-grid gap-3 align-items-center p-2">
                  {/* Avatar (first letter) */}
                  <div className="col-auto">
                    <div
                      className="rounded-circle d-flex  align-items-center justify-content-center"
                      style={{
                        width: "100px",
                        height: "100px",
                        border: "4px solid #fff",
                        background: "#0d3b85",
                        color: "#fff",
                        fontSize: "48px",
                        fontWeight: "bold",
                      }}
                    >
                      {teacher.full_name
                        ? teacher.full_name[0].toUpperCase()
                        : "?"}
                    </div>
                  </div>
                  <div className="">
                    <h4 className="mb-1">{teacher.full_name}</h4>
                    <p className="txt__regular__ mb-0">
                      {teacher.email}
                      {teacher.location ? ` • ${teacher.location}` : ""}
                    </p>
                    <div className="mt-2 d-flex gap-2">
                      {profile.role && (
                        <span className="txt__small__ ">
                          {profile.role || "-"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Send Message Button */}
                <div className="justify-content-end">
                  <Button
                    variant="secondary"
                    onClick={() => setShowMessageModal(true)}
                  >
                    Send Message
                  </Button>
                </div>
              </div>
            </div>

            <div className="container bg-white p-4 rounded shadow-sm">
              <div className="row py-2 border-bottom">
                <div className="col-6 text-muted">Curriculum</div>
                <div className="col-6 text-end fw-semibold">
                  {Array.isArray(profile.curriculum)
                    ? profile.curriculum.join(", ")
                    : profile.curriculum || "-"}
                </div>
              </div>

              {/* --- Section: Details --- */}
              <h5 className="fw-semibold mt-4 mb-3">Details</h5>
              <div className="row py-2">
                <div className="col-6 text-muted">Qualified</div>
                <div className="col-6 text-end fw-semibold">
                  {profile.qualified ? "Yes" : "No"}
                </div>
              </div>
              <div className="row py-2">
                <div className="col-6 text-muted">English</div>
                <div className="col-6 text-end fw-semibold">
                  {profile.english || "-"}
                </div>
              </div>
              <div className="row py-2">
                <div className="col-6 text-muted">Position</div>
                <div className="col-6 text-end fw-semibold">
                  {profile.position || "-"}
                </div>
              </div>
              <div className="row py-2">
                <div className="col-6 text-muted">Gender</div>
                <div className="col-6 text-end fw-semibold">
                  {profile.gender || "-"}
                </div>
              </div>
              <div className="row py-2">
                <div className="col-6 text-muted">Nationality</div>
                <div className="col-6 text-end fw-semibold">
                  {profile.nationality || "-"}
                </div>
              </div>
              <div className="row py-2 border-bottom">
                <div className="col-6 text-muted">Second Nationality</div>
                <div className="col-6 text-end fw-semibold">
                  {profile.second_nationality ? "Yes" : "No"}
                </div>
              </div>

              {/* --- Section: Availability --- */}
              <h5 className="fw-semibold mt-4 mb-3">Availability</h5>
              <div className="row py-2">
                <div className="col-6 text-muted">Age Group</div>
                <div className="col-6 text-end fw-semibold">
                  {(teacher.teacher_profile &&
                    teacher.teacher_profile.age_group) ||
                    "-"}
                </div>
              </div>
              <div className="row py-2">
                <div className="col-6 text-muted">Available from</div>
                <div className="col-6 text-end fw-semibold">
                  {(teacher.teacher_profile &&
                    teacher.teacher_profile.available_from) ||
                    "-"}
                </div>
              </div>

              {/* --- Section: Job Alerts --- */}
              <h5 className="fw-semibold mt-4 mb-3">Job Alerts</h5>
              <div className="row py-2 border-bottom">
                <div className="col-6 text-muted">Job Alerts</div>
                <div className="col-6 text-end fw-semibold">
                  {profile.job_alerts ? "Yes" : "No"}
                </div>
              </div>

              {/* --- Section: Applications --- */}
              <h5 className="fw-semibold mt-4 mb-3">Applications</h5>
              <div className="row py-2">
                <div className="col-6 text-muted">Total Applications</div>
                <div className="col-6 text-end fw-semibold">
                  {profile.total_applications || "-"}
                </div>
              </div>
              <div className="row py-2 ">
                <div className="col-6 text-muted">CV File</div>
                <div className="col-6 text-end fw-semibold">
                  {profile.cv_file ? (
                    <a
                      href={profile.cv_file}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  ) : (
                    "-"
                  )}
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
