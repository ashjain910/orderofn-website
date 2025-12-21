import { getLeadershipRoleLabel } from "../../constants/leadershipRoles";
import React, { useEffect, useState, useMemo } from "react";
import DocViewer, { DocViewerRenderers } from "react-doc-viewer";
import { fetchUserProfile } from "./api";
import EditProfileModal from "../../components/EditProfileModal";
import { ROLES_OPTIONS, SUBJECT_OPTIONS } from "../../common/subjectOptions";

const POSITION_OPTIONS = [
  { label: "Teacher", value: "teacher" },
  { label: "Senior Leader", value: "leader" },
  { label: "Other", value: "other" },
];

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchUserProfile().then((data) => {
      if (isMounted) setProfile(data);
      if (isMounted) setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const openEdit = () => {
    setShowEdit(true);
  };

  // Memoize editFormData so it only changes when profile or showEdit changes
  const memoizedEditFormData = useMemo(() => {
    if (!profile) return null;
    const p = profile || {};
    return {
      email: p.email || "",
      password: "",
      qualified: p.teacher_profile?.qualified || "",
      english: p.teacher_profile?.english || "",
      position: p.teacher_profile?.position || "",
      phone: p.phone || "",
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
      leadership_role: p.teacher_profile?.leadership_role || [],
      job_alerts:
        p.teacher_profile?.job_alerts === true
          ? "yes"
          : p.teacher_profile?.job_alerts === false
          ? "no"
          : p.teacher_profile?.job_alerts || "",
      available_date: p.teacher_profile?.available_date || "",
    };
  }, [profile]);

  const closeEdit = () => setShowEdit(false);

  // After saving, refetch profile data and close modal (no reload)
  const handleEditSave = async () => {
    setShowEdit(false);
    setLoading(true);
    const data = await fetchUserProfile();
    setProfile(data);
    setLoading(false);
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
                  {profile?.teacher_profile?.gender
                    ? profile.teacher_profile.gender[0].toUpperCase() +
                      profile.teacher_profile.gender.slice(1)
                    : "-"}
                </small>
              </div>
              <div className="d-flex mb-2 ">
                <small className="text-muted">
                  Are you a fully qualified teacher / senior leader? :
                </small>
                <small className="ml-2">
                  {profile?.teacher_profile?.qualified
                    ? profile.teacher_profile.qualified[0].toUpperCase() +
                      profile.teacher_profile.qualified.slice(1)
                    : "-"}
                </small>
              </div>
              <div className="d-flex mb-2 ">
                <small className="text-muted">
                  Are you a fluent English speaker? :
                </small>
                <small className="ml-2">
                  {profile?.teacher_profile?.english
                    ? profile.teacher_profile.english[0].toUpperCase() +
                      profile.teacher_profile.english.slice(1)
                    : "-"}
                </small>
              </div>
              <div className="d-flex mb-2 ">
                <small className="text-muted">
                  What positions are you looking for? :
                </small>
                <small className="ml-2">
                  {Array.isArray(profile?.teacher_profile?.position)
                    ? profile.teacher_profile.position
                        .map((posVal: string) => {
                          const found = POSITION_OPTIONS.find(
                            (p) => p.value === posVal
                          );
                          return found ? found.label : posVal;
                        })
                        .join(", ")
                    : (() => {
                        const found = POSITION_OPTIONS.find(
                          (p) => p.value === profile?.teacher_profile?.position
                        );
                        return found
                          ? found.label
                          : profile?.teacher_profile?.position;
                      })()}
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
                  {(() => {
                    const AGE_GROUP_OPTIONS = [
                      { value: "3-5 Years", label: "3-5 Years" },
                      { value: "6-10 Years", label: "6-10 Years" },
                      { value: "11-15 Years", label: "11-15 Years" },
                      { value: "16+ Years", label: "16+ Years" },
                    ];
                    const val = profile?.teacher_profile?.age_group;
                    if (Array.isArray(val)) {
                      return val
                        .map((ag: string) => {
                          const found = AGE_GROUP_OPTIONS.find(
                            (opt) => opt.value === ag
                          );
                          return found ? found.label : ag;
                        })
                        .join(", ");
                    } else {
                      const found = AGE_GROUP_OPTIONS.find(
                        (opt) => opt.value === val
                      );
                      return found ? found.label : val;
                    }
                  })()}
                </small>
              </div>
              <div className="d-flex mb-2 ">
                <small className="text-muted">Curriculum experience :</small>
                <small className="ml-2">
                  {Array.isArray(profile?.teacher_profile?.curriculum)
                    ? profile.teacher_profile.curriculum.join(", ")
                    : profile?.teacher_profile?.curriculum}
                </small>
              </div>
              <div className="d-flex mb-2 ">
                <small className="text-muted">Leadership roles :</small>
                <small className="ml-2">
                  {Array.isArray(profile?.teacher_profile?.leadership_role)
                    ? profile.teacher_profile.leadership_role.map(
                        (role: string, idx: number) => (
                          <span key={role}>
                            {getLeadershipRoleLabel(role)}
                            {idx <
                            profile.teacher_profile.leadership_role.length - 1
                              ? ", "
                              : ""}
                          </span>
                        )
                      )
                    : getLeadershipRoleLabel(
                        profile.teacher_profile?.leadership_role
                      )}
                </small>
              </div>
              <div className="d-flex mb-2 ">
                <small className="text-muted">Send me job alerts:</small>
                <small className="ml-2">
                  {profile?.teacher_profile?.job_alerts === true
                    ? "Yes"
                    : profile?.teacher_profile?.job_alerts === false
                    ? "No"
                    : profile?.teacher_profile?.job_alerts}
                </small>
              </div>
              <div className="d-flex mb-2 ">
                <small className="text-muted">I will be available from :</small>
                <small className="ml-2">
                  {profile?.teacher_profile?.available_date}
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
                  <DocViewer
                    key={showEdit ? "editing" : "preview"}
                    documents={[{ uri: profile.teacher_profile.cv_file }]}
                    pluginRenderers={DocViewerRenderers}
                    style={{ height: 300 }}
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
              {profile?.subscription_status &&
              profile.subscription_status !== "none" ? (
                <div className="text-success">
                  <strong>Congratulations!</strong> Your plan is{" "}
                  <strong>
                    {profile.subscription_status.charAt(0).toUpperCase() +
                      profile.subscription_status.slice(1)}
                  </strong>{" "}
                  and active. Enjoy full access!
                </div>
              ) : (
                <div className="txt-muted text-center">
                  No active subscription
                  <br></br> Subscribe to get the benefit of full access.
                  <br />
                  <button className="btn btn-primary mt-3">
                    Subscribe now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
