import { useEffect, useState } from "react";
import api from "../../services/api";

interface SettingsData {
  allowProfile: boolean;
  emailOnJobNear: boolean;
  schoolLevel: string;
  jobType: string;
  schoolType: string;
  postcode: string;
  radius: string;
  roleType: string;
  bookingEmail: boolean;
  dayBeforeEmail: boolean;
  sundayBreakdown: boolean;
  sundayReminder: boolean;
  monthReminder: boolean;
  profileViewable: boolean;
  permanentRole: boolean;
  emailRoutine: string;
  account: {
    email: string;
  };
}

export default function MySettings() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<SettingsData>({
    allowProfile: false,
    emailOnJobNear: false,
    schoolLevel: "",
    jobType: "",
    schoolType: "",
    postcode: "",
    radius: "",
    roleType: "",
    bookingEmail: false,
    dayBeforeEmail: false,
    sundayBreakdown: false,
    sundayReminder: false,
    monthReminder: false,
    profileViewable: false,
    permanentRole: false,
    emailRoutine: "daily",
    account: { email: "" },
  });
  const [emailInput, setEmailInput] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [deactivateLoading, setDeactivateLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get("/settings");
      setForm(res.data);
      setEmailInput(res.data.account?.email || "");
    } catch (err) {}
  };

  const handleChange = (key: keyof SettingsData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submitForm = async () => {
    setLoading(true);
    // Only send left-side settings data, not account
    const { account, ...settingsData } = form;
    await api.post("/settings", settingsData);
    setLoading(false);
    alert("Settings Updated");
  };

  const updateEmail = async () => {
    setEmailLoading(true);
    await api.post("/update-email", { email: emailInput });
    setEmailLoading(false);
    alert("Email updated");
  };

  const updatePassword = async () => {
    setPasswordLoading(true);
    await api.post("/update-password", passwords);
    setPasswordLoading(false);
    alert("Password updated");
  };

  const deactivateAccount = async () => {
    setDeactivateLoading(true);
    await api.post("/deactivate-account");
    setDeactivateLoading(false);
    setShowDeactivate(false);
    alert("Account deactivated");
  };

  return (
    <div className="container py-4">
      <h3>My Settings</h3>
      <div className="row mt-4">
        <div className="col-12 col-lg-9">
          <form
            className="card p-4 mb-4"
            onSubmit={(e) => {
              e.preventDefault();
              submitForm();
            }}
          >
            <h5>Job Alert Settings</h5>
            <div className="form-check mt-3">
              <input
                type="checkbox"
                className="form-check-input"
                checked={form.allowProfile}
                onChange={(e) => handleChange("allowProfile", e.target.checked)}
              />
              <label className="form-check-label">
                Allow your profile to be found by schools and other hirers who
                have roles matched to you and can invite you to apply.
              </label>
            </div>
            <div className="form-check mt-2">
              <input
                type="checkbox"
                className="form-check-input"
                checked={form.emailOnJobNear}
                onChange={(e) =>
                  handleChange("emailOnJobNear", e.target.checked)
                }
              />
              <label className="form-check-label">
                Get email alerts when a job near me is posted and meets the
                criteria below.
              </label>
            </div>
            <div className="row mt-3 g-3">
              <div className="col-md-4">
                <label className="form-label">Level</label>
                <select
                  className="form-select"
                  value={form.schoolLevel}
                  onChange={(e) => handleChange("schoolLevel", e.target.value)}
                >
                  <option value="">Please select</option>
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="tertiary">Tertiary</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Job Type</label>
                <select
                  className="form-select"
                  value={form.jobType}
                  onChange={(e) => handleChange("jobType", e.target.value)}
                >
                  <option value="">Please select</option>
                  <option value="fulltime">Full Time</option>
                  <option value="parttime">Part Time</option>
                  <option value="casual">Casual</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">School Type</label>
                <select
                  className="form-select"
                  value={form.schoolType}
                  onChange={(e) => handleChange("schoolType", e.target.value)}
                >
                  <option value="">Please select</option>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="charter">Charter</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Postcode</label>
                <input
                  className="form-control"
                  value={form.postcode}
                  onChange={(e) => handleChange("postcode", e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Radius</label>
                <select
                  className="form-select"
                  value={form.radius}
                  onChange={(e) => handleChange("radius", e.target.value)}
                >
                  <option value="">Please select</option>
                  <option value="5">5 km</option>
                  <option value="10">10 km</option>
                  <option value="20">20 km</option>
                  <option value="50">50 km</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Role Type</label>
                <select
                  className="form-select"
                  value={form.roleType}
                  onChange={(e) => handleChange("roleType", e.target.value)}
                >
                  <option value="">Please select</option>
                  <option value="teacher">Teacher</option>
                  <option value="aide">Aide</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <hr></hr>
            <h5>Notification settings</h5>
            <div className="form-check mt-2">
              <input
                type="checkbox"
                className="form-check-input"
                checked={form.bookingEmail}
                onChange={(e) => handleChange("bookingEmail", e.target.checked)}
              />
              <label className="form-check-label">
                Receive an email for each booking request.
              </label>
            </div>
            <div className="form-check mt-2">
              <input
                type="checkbox"
                className="form-check-input"
                checked={form.dayBeforeEmail}
                onChange={(e) =>
                  handleChange("dayBeforeEmail", e.target.checked)
                }
              />
              <label className="form-check-label">
                Send me an email the day before a booking with the school's
                details.
              </label>
            </div>
            <div className="form-check mt-2">
              <input
                type="checkbox"
                className="form-check-input"
                checked={form.sundayBreakdown}
                onChange={(e) =>
                  handleChange("sundayBreakdown", e.target.checked)
                }
              />
              <label className="form-check-label">
                Send me an email on Sundays with a breakdown of my upcoming
                bookings for the week.
              </label>
            </div>
            <div className="form-check mt-2">
              <input
                type="checkbox"
                className="form-check-input"
                checked={form.sundayReminder}
                onChange={(e) =>
                  handleChange("sundayReminder", e.target.checked)
                }
              />
              <label className="form-check-label">
                Send me an email on a Sunday as a reminder to update my
                availability for the coming week.
              </label>
            </div>
            <div className="form-check mt-2">
              <input
                type="checkbox"
                className="form-check-input"
                checked={form.monthReminder}
                onChange={(e) =>
                  handleChange("monthReminder", e.target.checked)
                }
              />
              <label className="form-check-label">
                Send me a reminder email if it has been 29 days since I updated
                my availability.
              </label>
            </div>

            <hr></hr>
            <h5>View setting</h5>
            <div className="form-check mt-2">
              <input
                type="checkbox"
                className="form-check-input"
                checked={form.profileViewable}
                onChange={(e) =>
                  handleChange("profileViewable", e.target.checked)
                }
              />
              <label className="form-check-label">
                Profile viewable to every school
              </label>
            </div>
            <hr></hr>
            <h5>Other setting</h5>
            <div className="form-check mt-2">
              <input
                type="checkbox"
                className="form-check-input"
                checked={form.permanentRole}
                onChange={(e) =>
                  handleChange("permanentRole", e.target.checked)
                }
              />
              <label className="form-check-label">
                I am looking for a permanent teaching role
              </label>
            </div>

            <hr></hr>
            <h5>Email routine setting</h5>
            <div className="form-check mt-2">
              <input
                type="radio"
                name="routine"
                className="form-check-input"
                checked={form.emailRoutine === "daily"}
                onChange={() => handleChange("emailRoutine", "daily")}
              />
              <label className="form-check-label">Daily</label>
            </div>
            <div className="form-check mt-2">
              <input
                type="radio"
                name="routine"
                className="form-check-input"
                checked={form.emailRoutine === "weekly"}
                onChange={() => handleChange("emailRoutine", "weekly")}
              />
              <label className="form-check-label">Weekly</label>
            </div>
            <button
              className="btn btn-primary mt-4"
              type="submit"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Settings"}
            </button>
          </form>
        </div>
        <div className="col-12 col-lg-3">
          <div className="card p-4">
            <h5>Account Settings</h5>
            <label className="form-label mt-3">Update Email</label>
            <input
              className="form-control mb-2"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />
            <button
              className="btn btn-primary w-100 mb-3"
              type="button"
              onClick={updateEmail}
              disabled={emailLoading}
            >
              {emailLoading ? "Updating..." : "Update Email"}
            </button>
            <label className="form-label mt-3">Current Password</label>
            <input
              type="password"
              className="form-control mb-2"
              value={passwords.current}
              onChange={(e) =>
                setPasswords((p) => ({ ...p, current: e.target.value }))
              }
            />
            <label className="form-label mt-3">New Password</label>
            <input
              type="password"
              className="form-control mb-2"
              value={passwords.new}
              onChange={(e) =>
                setPasswords((p) => ({ ...p, new: e.target.value }))
              }
            />
            <label className="form-label mt-3">Confirm New Password</label>
            <input
              type="password"
              className="form-control mb-2"
              value={passwords.confirm}
              onChange={(e) =>
                setPasswords((p) => ({ ...p, confirm: e.target.value }))
              }
            />
            <button
              className="btn btn-primary w-100 mb-3"
              type="button"
              onClick={updatePassword}
              disabled={passwordLoading}
            >
              {passwordLoading ? "Updating..." : "Change Password"}
            </button>
            <button
              className="btn btn-danger w-100 mt-3"
              type="button"
              onClick={() => setShowDeactivate(true)}
            >
              Deactivate my account
            </button>
            {showDeactivate && (
              <div
                className="modal show"
                style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Confirm Deactivation</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowDeactivate(false)}
                      ></button>
                    </div>
                    <div className="modal-body">
                      Are you sure you want to deactivate your account?
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowDeactivate(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={deactivateAccount}
                        disabled={deactivateLoading}
                      >
                        {deactivateLoading ? "Deactivating..." : "Deactivate"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
