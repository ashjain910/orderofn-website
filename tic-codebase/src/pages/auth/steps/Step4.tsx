import { Form, Button } from "react-bootstrap";
import Select from "react-select";
import { useState } from "react";
import { LEADERSHIP_OPTIONS } from "../../../common/subjectOptions";

type Step4Props = {
  formData: any;
  setFormData: (data: any) => void;
  nextStep: () => void;
  prevStep: () => void;
};

function Step4({ formData, setFormData, nextStep, prevStep }: Step4Props) {
  const [touched, setTouched] = useState<any>({});
  const handleBlur = (field: string) => {
    setTouched((prev: any) => ({ ...prev, [field]: true }));
  };
  const handleNext = () => {
    setTouched({
      leadership_role: true,
    });
    if (formData.leadership_role && formData.leadership_role.length > 0) {
      nextStep();
    }
  };
  return (
    <div className="">
      <div className="step-left">
        <div className="step-card">
          <div className="progress-title">
            <span className="stepNumber">4</span> Your leadership experience
          </div>

          <div className="progress">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: "80%" }}
            />
          </div>

          <span className="step-count">Step 4 of 5</span>

          <Form className="">
            <Form.Group className="">
              <Form.Label>
                Leadership role <span style={{ color: "red" }}>*</span>
              </Form.Label>
              {touched.leadership_role &&
                (!formData.leadership_role ||
                  formData.leadership_role.length === 0) && (
                  <span style={{ color: "red", marginLeft: 8, fontSize: 13 }}>
                    Leadership role is required
                  </span>
                )}
              <Select
                isMulti
                options={LEADERSHIP_OPTIONS}
                closeMenuOnSelect={false}
                value={formData.leadership_role || []}
                onChange={(selected: any) =>
                  setFormData({
                    ...formData,
                    leadership_role: Array.isArray(selected) ? selected : [],
                  })
                }
                onBlur={() => handleBlur("leadership_role")}
                classNamePrefix={"react-select"}
                placeholder="Select leadership role(s)..."
              />
            </Form.Group>

            <div className="d-flex justify-content-between mt-3">
              <Button variant="secondary" onClick={prevStep}>
                Previous
              </Button>
              <Button variant="primary" onClick={handleNext}>
                Next
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Step4;
