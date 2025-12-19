import React, { useEffect, useState, useMemo } from "react";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import { fetchUserProfile } from "./api";
import { ROLES_OPTIONS, SUBJECT_OPTIONS } from "../../common/subjectOptions";
import EditProfileModal from "../../components/EditProfileModal";

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchUserProfile().then((data) => {
      setProfile(data);
      setLoading(false);
    });
  }, []);

  const openEdit = () => {
    setShowEdit(true);
  };

  // Memoize editFormData so it only changes when profile or showEdit changes
  const memoizedEditFormData = useMemo(() => {
    if (!showEdit || !profile) return null;
    const p = profile || {};
    return {
      email: p.email || "",
      password: "",
      qualified: p.teacher_profile?.qualified || "",
      english: p.teacher_profile?.english || "",
      position: p.teacher_profile?.position || "",
      phone_number: p.phone || "",
      firstName: p.first_name || "",
      lastName: p.last_name || "",
      gender: p.teacher_profile?.gender || "",
      nationality: p.teacher_profile?.nationality || "",
      secondNationality: p.teacher_profile?.second_nationality || "",
      cvFile: p.teacher_profile?.cv_file || null,
      hearFrom: p.teacher_profile?.hear_from || "",
      roles: p.teacher_profile?.roles || [],
      subjects: p.teacher_profile?.subjects || [],
      ageGroup: p.teacher_profile?.age_group || "",
      curriculum: p.teacher_profile?.curriculum || [],
      leadershipRoles: p.teacher_profile?.leadership_role || [],
      job_alerts: p.teacher_profile?.job_alerts || "",
      available_day: p.teacher_profile?.available_day || "",
    };
  }, [profile, showEdit]);

  const closeEdit = () => setShowEdit(false);

  const handleEditSave = () => {
    setShowEdit(false);
    window.location.reload(); // reload page after edit
  };

  if (loading) {
    return (
      <div
        className="container p-4 d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-4">
      <EditProfileModal
        show={showEdit}
        onClose={closeEdit}
        initialData={memoizedEditFormData}
        onSave={handleEditSave}
      />
      <div className="container my-4">
        <div className="row g-4">
          {/* LEFT SIDE */}
          <div className="col-lg-8">
            <div className="d-flex align-items-center gap-3">
              <div
                className="col-auto w-100 gap-3 p-3 d-flex align-items-center"
                style={{
                  background: "#fff",
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
                  {profile?.first_name
                    ? profile.first_name[0].toUpperCase()
                    : profile.email
                    ? profile.email[0].toUpperCase()
                    : "?"}
                </div>
                <div>
                  <h4>{profile.full_name}</h4>
                  <div className="text-muted small mt-1">{profile.email}</div>
                  <div className="text-muted small mt-1">{profile.phone}</div>
                </div>
              </div>
            </div>

            {/* Personal Info */}
            <div className="card p-4 mb-3">
              <div className="d-flex justify-content-between mb-3">
                <h6 className="mb-0">Personal Info</h6>
                <button className="btn btn-light btn-sm" onClick={openEdit}>
                  Edit
                </button>
              </div>
              <div className="d-flex mb-1">
                <small className="text-muted">First Name :</small>
                <small className="ml-2">{profile.first_name}</small>
              </div>
              <div className="mb-1">
                <small className="text-muted">Last Name :</small>
                <small className="ml-2">{profile.last_name}</small>
              </div>
              <div className="mb-1">
                <small className="text-muted">Gender :</small>
                <small className="ml-2">
                  {profile?.teacher_profile?.gender}
                </small>
              </div>
              <div className="d-flex mb-2 ">
                <small className="text-muted">
                  Are you a fully qualified teacher / senior leader? :
                </small>
                <small className="ml-2">
                  {profile?.teacher_profile?.qualified}
                </small>
              </div>
              <div className="d-flex mb-2 ">
                <small className="text-muted">
                  Are you a fluent English speaker? :
                </small>
                <small className="ml-2">
                  {profile?.teacher_profile?.english}
                </small>
              </div>
              <div className="d-flex mb-2 ">
                <small className="text-muted">
                  What positions are you looking for? :
                </small>
                <small className="ml-2">
                  {profile?.teacher_profile?.positions}
                </small>
              </div>
              <div className="d-flex mb-2 ">
                <small className="text-muted">Nationality :</small>
                <small className="ml-2">
                  {profile?.teacher_profile?.nationality}
                </small>
              </div>
              <div className="d-flex mb-2 ">
                <small className="text-muted">Second nationality :</small>
                <small className="ml-2">
                  {profile?.teacher_profile?.second_nationality}
                </small>
              </div>
              <div className="d-flex mb-2 ">
                <small className="text-muted">
                  Where did you hear about us? :
                </small>
                <small className="ml-2">
                  {profile?.teacher_profile?.hear_from}
                </small>
              </div>
              <div className="d-flex mb-2 ">
                <small className="text-muted">Teacher Role :</small>
                <small className="ml-2">
                  {Array.isArray(profile?.teacher_profile?.roles)
                    ? profile.teacher_profile.roles
                        .map((roleVal: string) => {
                          const found = ROLES_OPTIONS.find(
                            (r: any) => r.value === roleVal
                          );
                          return found ? found.label : roleVal;
                        })
                        .join(", ")
                    : (() => {
                        const found = ROLES_OPTIONS.find(
                          (r: any) =>
                            r.value === profile?.teacher_profile?.roles
                        );
                        return found
                          ? found.label
                          : profile?.teacher_profile?.roles;
                      })()}
                </small>
              </div>
              <div className="d-flex mb-2 ">
                <small className="text-muted">Subjects :</small>
                <small className="ml-2">
                  {Array.isArray(profile?.teacher_profile?.subjects)
                    ? profile.teacher_profile.subjects
                        .map((subjVal: string) => {
                          const found = SUBJECT_OPTIONS.find(
                            (s: any) => s.value === subjVal
                          );
                          return found ? found.label : subjVal;
                        })
                        .join(", ")
                    : (() => {
                        const found = SUBJECT_OPTIONS.find(
                          (s: any) =>
                            s.value === profile?.teacher_profile?.subjects
                        );
                        return found
                          ? found.label
                          : profile?.teacher_profile?.subjects;
                      })()}
                </small>
              </div>
              <div className="d-flex mb-2 ">
                <small className="text-muted">Age group :</small>
                <small className="ml-2">
                  {profile?.teacher_profile?.age_group}
                </small>
              </div>
              <div className="d-flex mb-2 ">
                <small className="text-muted">Curriculum experience :</small>
                <small className="ml-2">
                  {profile?.teacher_profile?.curriculum}
                </small>
              </div>
              <div className="d-flex mb-2 ">
                <small className="text-muted">Leadership roles :</small>
                <small className="ml-2">
                  {profile?.teacher_profile?.leadership_role}
                </small>
              </div>
              <div className="d-flex mb-2 ">
                <small className="text-muted">Send me job alerts:</small>
                <small className="ml-2">
                  {profile?.teacher_profile?.job_alerts}
                </small>
              </div>
              <div className="d-flex mb-2 ">
                <small className="text-muted">I will be available from :</small>
                <small className="ml-2">
                  {profile?.teacher_profile?.available_day}
                </small>
              </div>
            </div>

            {/* Bio */}
            {/* <div className="card p-4">
              <div className="d-flex justify-content-between mb-2">
                <h6 className="mb-0">Bio</h6>
                <button className="btn btn-light btn-sm">Edit</button>
              </div>
              <p className="text-muted mb-0">
                Hi 👋, I'm Ronald, a passionate UX designer with 10 years of
                experience in creating intuitive and user-centered digital
                experiences.
              </p>
            </div> */}
          </div>

          {/* RIGHT SIDE */}
          <div className="col-lg-4">
            <div className="card p-4">
              <h6>Resume</h6>
              {profile?.teacher_profile?.cv_file ? (
                <>
                  <div className="text-end mb-2">
                    <a
                      href={profile.teacher_profile.cv_file}
                      download
                      className="btn btn-secondary btn-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  </div>
                  <DocViewer
                    documents={[{ uri: profile.teacher_profile.cv_file }]}
                    pluginRenderers={DocViewerRenderers}
                    style={{ height: 500 }}
                    // @ts-ignore
                    onError={() => {
                      /* Optionally handle preview errors here */
                    }}
                  />
                </>
              ) : (
                <div className="text-muted">No CV uploaded.</div>
              )}
            </div>
            <div className="card p-4 mt-4">
              <h6>Subcription</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
