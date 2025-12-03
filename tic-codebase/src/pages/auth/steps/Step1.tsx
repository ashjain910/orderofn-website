type Step1Props = {
  formData: any;
  setFormData: (d: any) => void;
  nextStep: () => void;
};
export default function Step1({ formData, setFormData, nextStep }: Step1Props) {
  return (
    <div className="step-left">
      <div className="step-card">
        <div className="progress-title">
          <span className="stepNumber">1</span> Lets get started
        </div>
        <div className="progress">
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: "20%" }}
          />
        </div>

        <span className="step-count txt__regular__ mt-1">Step 1 of 5</span>

        <div className="">
          <label className="form-label">
            What is your email?{" "}
            <span
              style={{ color: "red", fontWeight: "bold", fontSize: "16px" }}
            >
              *
            </span>
          </label>
          <input
            type="text"
            placeholder="What is your email"
            className="form-control"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <div className="">
          <label className="form-label">
            Password{" "}
            <span
              style={{ color: "red", fontWeight: "bold", fontSize: "16px" }}
            >
              *
            </span>
          </label>
          <input
            type="password"
            placeholder="Set password"
            className="form-control"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>
        {/* Qualified Teacher */}
        <div className="">
          <label className="form-label">
            Are you a fully qualified teacher / senior leader?{" "}
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
                name="qualified"
                id="qualifiedYes"
                value="yes"
                checked={formData.qualified === "yes"}
                onChange={(e) =>
                  setFormData({ ...formData, qualified: e.target.value })
                }
              />
              <label className="form-check-label ml-2" htmlFor="qualifiedYes">
                Yes
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="qualified"
                id="qualifiedNo"
                value="no"
                checked={formData.qualified === "no"}
                onChange={(e) =>
                  setFormData({ ...formData, qualified: e.target.value })
                }
              />
              <label className="form-check-label ml-2" htmlFor="qualifiedNo">
                No
              </label>
            </div>
          </div>
        </div>
        {/* Fluent English Speaker */}
        <label className="form-label">
          Are you a fluent English speaker?{" "}
          <span style={{ color: "red", fontWeight: "bold", fontSize: "16px" }}>
            *
          </span>
        </label>
        <div className="d-flex gap-3">
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="english"
              id="englishYes"
              value="yes"
              checked={formData.english === "yes"}
              onChange={(e) =>
                setFormData({ ...formData, english: e.target.value })
              }
            />
            <label className="form-check-label ml-2" htmlFor="englishYes">
              Yes
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="english"
              id="englishNo"
              value="no"
              checked={formData.english === "no"}
              onChange={(e) =>
                setFormData({ ...formData, english: e.target.value })
              }
            />
            <label className="form-check-label ml-2" htmlFor="englishNo">
              No
            </label>
          </div>
        </div>
        {/* Position Preference */}
        <label className="form-label">
          What positions are you looking for?{" "}
          <span style={{ color: "red", fontWeight: "bold", fontSize: "16px" }}>
            *
          </span>
        </label>
        <div className="d-flex gap-3">
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="position"
              id="positionTeacher"
              value="teacher"
              checked={formData.position === "teacher"}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
            />
            <label className="form-check-label ml-2" htmlFor="positionTeacher">
              Teacher
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="position"
              id="positionLeader"
              value="leader"
              checked={formData.position === "leader"}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
            />
            <label className="form-check-label ml-2" htmlFor="positionLeader">
              Senior Leader
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="position"
              id="positionOther"
              value="other"
              checked={formData.position === "other"}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
            />
            <label className="form-check-label ml-2" htmlFor="positionOther">
              Other
            </label>
          </div>
        </div>

        <div className="mt-3 d-flex justify-content-end">
          <button className="btn btn-primary " onClick={nextStep}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
