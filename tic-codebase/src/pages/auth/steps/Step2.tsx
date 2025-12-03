type StepProps = {
  nextStep: () => void;
  prevStep: () => void;
  formData: any;
  setFormData: (data: any) => void;
};

const Step2 = ({ nextStep, prevStep, formData, setFormData }: StepProps) => {
  return (
    <div className="step-left">
      <div className="step-card">
        <div className="progress-title">
          {" "}
          <span className="stepNumber">2</span> About you
        </div>
        <div className="progress">
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: "40%" }}
          />
        </div>

        <span className="step-count">Step 2 of 5</span>
        <div className="step-card">
          {/* FIRST NAME */}
          <label className="form-label">
            First name{" "}
            <span
              style={{ color: "red", fontWeight: "bold", fontSize: "16px" }}
            >
              *
            </span>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="John"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
          />

          {/* LAST NAME */}
          <label className="form-label">
            Last name{" "}
            <span
              style={{ color: "red", fontWeight: "bold", fontSize: "16px" }}
            >
              *
            </span>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Doe"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
          />

          {/* GENDER */}
          <label className="form-label">
            Gender{" "}
            <span
              style={{ color: "red", fontWeight: "bold", fontSize: "16px" }}
            >
              *
            </span>
          </label>
          <div className="d-flex gap-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="gender"
                id="genderMale"
                value="male"
                checked={formData.gender === "male"}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
              />
              <label className="form-check-label  ml-2" htmlFor="genderMale">
                Male
              </label>
            </div>
            <div className="form-check s">
              <input
                className="form-check-input"
                type="radio"
                name="gender"
                id="genderFemale"
                value="female"
                checked={formData.gender === "female"}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
              />
              <label className="form-check-label  ml-2" htmlFor="genderFemale">
                Female
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="gender"
                id="genderOthers"
                value="others"
                checked={formData.gender === "others"}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
              />
              <label className="form-check-label  ml-2" htmlFor="genderOthers">
                Others
              </label>
            </div>
          </div>

          {/* NATIONALITY */}
          <label className="form-label">
            Nationality{" "}
            <span
              style={{ color: "red", fontWeight: "bold", fontSize: "16px" }}
            >
              *
            </span>
          </label>
          <select
            className="form-control"
            value={formData.nationality}
            onChange={(e) =>
              setFormData({ ...formData, nationality: e.target.value })
            }
          >
            <option value="">Please select</option>
            <option>India</option>
            <option>UK</option>
            <option>USA</option>
          </select>

          {/* SECOND NATIONALITY CHECKBOX */}
          <div className="form-check mt-1">
            <input
              type="checkbox"
              className="form-check-input"
              id="secondNat"
              checked={Boolean(formData.secondNationality)}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  secondNationality: e.target.checked,
                })
              }
            />
            <label htmlFor="secondNat" className="form-check-label">
              Second nationality?
            </label>
          </div>

          {/* CV UPLOAD */}
          <label className="form-label">CV Upload</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) =>
              setFormData({ ...formData, cvFile: e.target.files?.[0] || null })
            }
          />

          {/* WHERE DID YOU HEAR ABOUT US */}
          <label className="form-label">Where did you hear about us?</label>
          <select
            className="form-control"
            value={formData.hearFrom}
            onChange={(e) =>
              setFormData({ ...formData, hearFrom: e.target.value })
            }
          >
            <option value="">Please select</option>
            <option>LinkedIn</option>
            <option>Google Search</option>
            <option>Referral</option>
          </select>

          {/* BUTTONS */}
          <div className="d-flex justify-content-between mt-3">
            <button onClick={prevStep} className="btn btn-secondary px-4">
              Previous
            </button>

            <button onClick={nextStep} className="btn btn-primary px-4">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2;
