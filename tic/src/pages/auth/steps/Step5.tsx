import React from "react";

interface Step5Props {
  formData: any;
  setFormData: (data: any) => void;
  nextStep: () => void; // final submit
  prevStep: () => void;
}

function Step5({ formData, setFormData, nextStep, prevStep }: Step5Props) {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = Array.from({ length: 60 }, (_, i) => 2025 - i);

  return (
    <div className="step-left">
      <div className="step-card">
        <div className="progress-title">
          <span className="stepNumber">5</span> Your availability
        </div>
        <div className="progress">
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: "100%" }}
          />
        </div>

        <span className="step-count">Step 5 of 5</span>
        <div className="step-container">
          <div className="left-section">
            <label className="form-label">Please send me job alerts*</label>
            <div className="radio-group d-flex gap-3 mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="availability"
                  id="availabilityYes"
                  value="yes"
                  checked={formData.availability === "yes"}
                  onChange={(e) =>
                    setFormData({ ...formData, availability: e.target.value })
                  }
                />
                <label className="form-check-label" htmlFor="availabilityYes">
                  Yes
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="availability"
                  id="availabilityNo"
                  value="no"
                  checked={formData.availability === "no"}
                  onChange={(e) =>
                    setFormData({ ...formData, availability: e.target.value })
                  }
                />
                <label className="form-check-label" htmlFor="availabilityNo">
                  No
                </label>
              </div>
            </div>
            <label className="form-label w-100">
              I will be available from*
            </label>
            <div className="date-row d-flex gap-3">
              <select
                className="form-select"
                value={formData.day || ""}
                onChange={(e) =>
                  setFormData({ ...formData, day: e.target.value })
                }
              >
                <option value="">Day</option>
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <select
                className="form-select"
                value={formData.month || ""}
                onChange={(e) =>
                  setFormData({ ...formData, month: e.target.value })
                }
              >
                <option value="">Month</option>
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>

              <select
                className="form-select"
                value={formData.year || ""}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
              >
                <option value="">Year</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div className="button-row d-flex justify-content-between mt-3">
              <button className="btn btn-secondary" onClick={prevStep}>
                Previous
              </button>
              <button className="btn btn-primary" onClick={nextStep}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step5;
