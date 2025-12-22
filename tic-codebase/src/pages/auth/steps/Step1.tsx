// import { toast } from "react-toastify";
type Step1Props = {
  formData: any;
  setFormData: (d: any) => void;
  nextStep: () => void;
  validateStep?: () => boolean;
};
import { useState } from "react";

export default function Step1({
  formData,
  setFormData,
  nextStep,
  validateStep,
}: Step1Props) {
  // Robust validation for all required fields
  const defaultValidateStep = () => {
    let valid = true;
    // Email
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      valid = false;
    }
    // Phone
    if (!formData.phone) {
      valid = false;
    }
    // Password
    if (!formData.password || formData.password.length < 8) {
      valid = false;
    }
    // Qualified
    if (!formData.qualified) {
      valid = false;
    }
    // English
    if (!formData.english) {
      valid = false;
    }
    // Position
    if (!Array.isArray(formData.position) || formData.position.length === 0) {
      valid = false;
    }
    return valid;
  };
  const [touched, setTouched] = useState<any>({});
  const handleBlur = (field: string) => {
    setTouched((prev: any) => ({ ...prev, [field]: true }));
  };
  const handleNextStep = () => {
    // Mark all as touched on submit
    setTouched({
      email: true,
      phone: true,
      password: true,
      qualified: true,
      english: true,
      position: true,
    });
    // Use provided validateStep or fallback to default
    const isValid = validateStep ? validateStep() : defaultValidateStep();
    if (isValid) {
      console.log("Step 1 data is valid:", isValid, formData);
      nextStep();
    }
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

        {/* Email */}
        <div className="">
          <label className="form-label">
            What is your email?{" "}
            <span
              style={{ color: "red", fontWeight: "bold", fontSize: "16px" }}
            >
              *
            </span>
            {touched.email && !formData.email && (
              <span style={{ color: "red", marginLeft: 8, fontSize: 13 }}>
                Email is required
              </span>
            )}
            {touched.email &&
              formData.email &&
              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                <span style={{ color: "red", marginLeft: 8, fontSize: 13 }}>
                  Enter a valid email address
                </span>
              )}
          </label>
          <input
            style={{ color: undefined }}
            type="text"
            placeholder="What is your email"
            className="form-control"
            value={formData.email || ""}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            onBlur={() => handleBlur("email")}
          />
        </div>
        {/* Phone number */}
        <div className="">
          <label className="form-label">
            Phone number{" "}
            <span
              style={{ color: "red", fontWeight: "bold", fontSize: "16px" }}
            >
              *
            </span>
            {touched.phone && !formData.phone && (
              <span style={{ color: "red", marginLeft: 8, fontSize: 13 }}>
                Phone number is required
              </span>
            )}
          </label>
          <input
            style={{ color: undefined }}
            type="text"
            placeholder="Enter your phone number"
            className="form-control"
            value={formData.phone || ""}
            onChange={(e) => {
              // Allow only digits, plus, and spaces
              const val = e.target.value;
              if (/^[0-9+ ]*$/.test(val)) {
                setFormData({ ...formData, phone: val });
              }
            }}
            onBlur={() => handleBlur("phone")}
          />
          {touched.phone &&
            formData.phone &&
            !/^[0-9+ ]+$/.test(formData.phone) && (
              <span style={{ color: "red", marginLeft: 8, fontSize: 13 }}>
                Only numbers, + and spaces allowed
              </span>
            )}
        </div>
        {/* Password */}
        <div className="">
          <label className="form-label">
            Password{" "}
            <span
              style={{ color: "red", fontWeight: "bold", fontSize: "16px" }}
            >
              *
            </span>
            {touched.password && !formData.password && (
              <span style={{ color: "red", marginLeft: 8, fontSize: 13 }}>
                Password is required
              </span>
            )}
            {touched.password &&
              formData.password &&
              formData.password.length < 8 && (
                <span style={{ color: "red", marginLeft: 8, fontSize: 13 }}>
                  Password must be at least 8 characters.
                </span>
              )}
          </label>
          <input
            style={{ color: undefined }}
            type="password"
            placeholder="Set password"
            className="form-control"
            value={formData.password || ""}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            onBlur={() => handleBlur("password")}
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
            {touched.qualified && !formData.qualified && (
              <span style={{ color: "red", marginLeft: 8, fontSize: 13 }}>
                Qualified is required
              </span>
            )}
          </label>
          <div className="d-flex  flex-wrap gap-3 ">
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
                onBlur={() => handleBlur("qualified")}
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
                onBlur={() => handleBlur("qualified")}
              />
              <label className="form-check-label ml-2" htmlFor="qualifiedNo">
                No
              </label>
            </div>
          </div>
        </div>

        {/* Fluent English Speaker */}
        <div className="">
          <label className="form-label">
            Are you a fluent English speaker?{" "}
            <span
              style={{ color: "red", fontWeight: "bold", fontSize: "16px" }}
            >
              *
            </span>
            {touched.english && !formData.english && (
              <span style={{ color: "red", marginLeft: 8, fontSize: 13 }}>
                English is required
              </span>
            )}
          </label>
          <div className="d-flex  flex-wrap gap-3">
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
                onBlur={() => handleBlur("english")}
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
                onBlur={() => handleBlur("english")}
              />
              <label className="form-check-label ml-2" htmlFor="englishNo">
                No
              </label>
            </div>
          </div>
        </div>

        {/* Position Preference */}
        <div className="">
          <label className="form-label">
            What positions are you looking for?{" "}
            <span
              style={{ color: "red", fontWeight: "bold", fontSize: "16px" }}
            >
              *
            </span>
            {touched.position &&
              (!formData.position ||
                (Array.isArray(formData.position) &&
                  formData.position.length === 0)) && (
                <span style={{ color: "red", marginLeft: 8, fontSize: 13 }}>
                  Position is required
                </span>
              )}
          </label>
          <div className="d-flex  flex-wrap gap-3">
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
                    Array.isArray(formData.position)
                      ? formData.position.includes(option.value)
                      : false
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
                  onBlur={() => handleBlur("position")}
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
        </div>

        <div className="mt-3 d-flex  flex-wrap justify-content-end">
          <button className="btn btn-primary " onClick={handleNextStep}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
