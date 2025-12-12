import { toast } from "react-toastify";
type Step1Props = {
  formData: any;
  setFormData: (d: any) => void;
  nextStep: () => void;
};
export default function Step1({ formData, setFormData, nextStep }: Step1Props) {
  const handleNextStep = () => {
    // Required fields
    if (
      !formData.email ||
      !formData.phone_number ||
      !formData.password ||
      !formData.qualified ||
      !formData.english ||
      !formData.position ||
      (Array.isArray(formData.position) && formData.position.length === 0)
    ) {
      toast.error("Please fill all required fields.");
      return;
    }
    // Password validation
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    nextStep();
  };
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
            Phone number{" "}
            <span
              style={{ color: "red", fontWeight: "bold", fontSize: "16px" }}
            >
              *
            </span>
          </label>
          <input
            type="text"
            placeholder="Enter your phone number"
            className="form-control"
            value={formData.phone_number}
            onChange={(e) =>
              setFormData({ ...formData, phone_number: e.target.value })
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
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
            }}
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
          {[
            { label: "Teacher", value: "teacher" },
            { label: "Senior Leader", value: "leader" },
            { label: "Other", value: "other" },
          ].map((option) => (
            <div className="form-check" key={option.value}>
              <input
                className="form-check-input"
                type="checkbox"
                id={`position_${option.value}`}
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
                    if (!newPositions.includes(option.value))
                      newPositions.push(option.value);
                  } else {
                    newPositions = newPositions.filter(
                      (v) => v !== option.value
                    );
                  }
                  setFormData({ ...formData, position: newPositions });
                }}
              />
              <label
                className="form-check-label ml-2"
                htmlFor={`position_${option.value}`}
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>

        <div className="mt-3 d-flex justify-content-end">
          <button className="btn btn-primary " onClick={handleNextStep}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
