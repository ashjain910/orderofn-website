import React from "react";

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
  if (!show || !teacher) return null;
  return (
    <React.Fragment>
      <div
        className="modal fade show"
        style={{ display: "block", background: "rgba(0,0,0,0.4)" }}
        tabIndex={-1}
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Teacher Details</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-2">
                  <strong>Name:</strong> {teacher.full_name || "-"}
                </div>
                <div className="col-md-6 mb-2">
                  <strong>Email:</strong> {teacher.email || "-"}
                </div>
                <div className="col-md-6 mb-2">
                  <strong>Phone:</strong> {teacher.phone || "-"}
                </div>
                <div className="col-md-6 mb-2">
                  <strong>Role:</strong> {teacher.teacher_profile?.role || "-"}
                </div>
                <div className="col-md-6 mb-2">
                  <strong>Qualified:</strong>{" "}
                  {teacher.teacher_profile?.qualified || "-"}
                </div>
                <div className="col-md-6 mb-2">
                  <strong>English:</strong>{" "}
                  {teacher.teacher_profile?.english || "-"}
                </div>
                <div className="col-md-6 mb-2">
                  <strong>Position:</strong>{" "}
                  {teacher.teacher_profile?.position || "-"}
                </div>
                <div className="col-md-6 mb-2">
                  <strong>Gender:</strong>{" "}
                  {teacher.teacher_profile?.gender || "-"}
                </div>
                <div className="col-md-6 mb-2">
                  <strong>Nationality:</strong>{" "}
                  {teacher.teacher_profile?.nationality || "-"}
                </div>
                <div className="col-md-6 mb-2">
                  <strong>Second Nationality:</strong>{" "}
                  {teacher.teacher_profile?.second_nationality ? "Yes" : "No"}
                </div>
                <div className="col-md-6 mb-2">
                  <strong>Subject:</strong>{" "}
                  {teacher.teacher_profile?.subject || "-"}
                </div>
                <div className="col-md-6 mb-2">
                  <strong>Leadership Role:</strong>{" "}
                  {teacher.teacher_profile?.leadership_role || "-"}
                </div>
                <div className="col-md-6 mb-2">
                  <strong>Age Group:</strong> {teacher.age_group || "-"}
                </div>
                <div className="col-md-6 mb-2">
                  <strong>Available Day:</strong> {teacher.available_day || "-"}
                </div>
                <div className="col-md-6 mb-2">
                  <strong>Available From:</strong>{" "}
                  {teacher.available_from || "-"}
                </div>
                <div className="col-md-6 mb-2">
                  <strong>Available Month:</strong>{" "}
                  {teacher.available_month || "-"}
                </div>
                <div className="col-md-6 mb-2">
                  <strong>Available Year:</strong>{" "}
                  {teacher.available_year || "-"}
                </div>
                <div className="col-md-12 mb-2">
                  <strong>Curriculum:</strong>{" "}
                  {Array.isArray(teacher.teacher_profile?.curriculum)
                    ? teacher.teacher_profile.curriculum.join(", ")
                    : teacher.teacher_profile?.curriculum || "-"}
                </div>
                <div className="col-md-6 mb-2">
                  <strong>Job Alerts:</strong>{" "}
                  {teacher.teacher_profile?.job_alerts ? "Yes" : "No"}
                </div>
                <div className="col-md-6 mb-2">
                  <strong>Total Applications:</strong>{" "}
                  {teacher.teacher_profile?.total_applications || "-"}
                </div>
                <div className="col-md-12 mb-2">
                  <strong>CV File:</strong>{" "}
                  {teacher.teacher_profile?.cv_file ? (
                    <a
                      href={teacher.teacher_profile.cv_file}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  ) : (
                    "-"
                  )}
                </div>
                <div className="col-md-12 mb-2">
                  <strong>Created At:</strong>{" "}
                  {teacher.teacher_profile?.created_at || "-"}
                </div>
                <div className="col-md-12 mb-2">
                  <strong>Updated At:</strong>{" "}
                  {teacher.teacher_profile?.updated_at || "-"}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default TeacherProfileModal;
