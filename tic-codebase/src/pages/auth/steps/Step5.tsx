import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Cookies from "js-cookie";
interface Step5Props {
  formData: any;
  setFormData: (data: any) => void;
  nextStep: () => void; // final submit
  prevStep: () => void;
}

import { useState } from "react";

function Step5({ formData, setFormData, nextStep, prevStep }: Step5Props) {
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = () => {
    Cookies.set("accept_terms", acceptTerms ? "true" : "false");
    nextStep();
  };
  // const days = Array.from({ length: 31 }, (_, i) => i + 1);
  // const months = [
  //   { label: "January", value: "01" },
  //   { label: "February", value: "02" },
  //   { label: "March", value: "03" },
  //   { label: "April", value: "04" },
  //   { label: "May", value: "05" },
  //   { label: "June", value: "06" },
  //   { label: "July", value: "07" },
  //   { label: "August", value: "08" },
  //   { label: "September", value: "09" },
  //   { label: "October", value: "10" },
  //   { label: "November", value: "11" },
  //   { label: "December", value: "12" },
  // ];
  // const years = Array.from({ length: 60 }, (_, i) => 2025 - i);

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
            <label className="form-label">Please send me job alerts</label>
            <div className="radio-group d-flex gap-3 mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="job_alerts"
                  id="job_alertsYes"
                  value="yes"
                  checked={formData.job_alerts === "yes"}
                  onChange={(e) =>
                    setFormData({ ...formData, job_alerts: e.target.value })
                  }
                />
                <label className="form-check-label" htmlFor="job_alertsYes">
                  Yes
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="job_alerts"
                  id="job_alertsNo"
                  value="no"
                  checked={formData.job_alerts === "no"}
                  onChange={(e) =>
                    setFormData({ ...formData, job_alerts: e.target.value })
                  }
                />
                <label className="form-check-label" htmlFor="job_alertsNo">
                  No
                </label>
              </div>
            </div>
            <label className="form-label w-100 ">
              I will be available from
            </label>
            <div className="date-row w-100">
              <DatePicker
                selected={
                  formData.available_date
                    ? new Date(formData.available_date)
                    : null
                }
                onChange={(date: Date | null) =>
                  setFormData({
                    ...formData,
                    available_date: date
                      ? date.toISOString().split("T")[0]
                      : "",
                  })
                }
                className="form-control"
                placeholderText="Select available date"
                dateFormat="yyyy-MM-dd"
                isClearable
                autoComplete="off"
                minDate={new Date()}
              />
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="form-check mb-2  mt-4">
              <input
                className="form-check-input"
                type="checkbox"
                id="acceptTerms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
              />
              <label
                className="form-check-label"
                style={{ color: "#000000" }}
                htmlFor="acceptTerms"
              >
                By clicking this, I have read and accept the{" "}
                <a
                  href="https://ticrecruitment.com/accept-terms-and-conditions/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms and Conditions.
                </a>
              </label>
            </div>
            <div className="button-row d-flex justify-content-between mt-3">
              <button className="btn btn-secondary" onClick={prevStep}>
                Previous
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={!acceptTerms}
              >
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
