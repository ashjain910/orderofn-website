import React from "react";
import { Form, Button } from "react-bootstrap";

type Step4Props = {
  formData: any;
  setFormData: (data: any) => void;
  nextStep: () => void;
  prevStep: () => void;
};

function Step4({ formData, setFormData, nextStep, prevStep }: Step4Props) {
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
              <Form.Label>Role*</Form.Label>
              <Form.Select
                value={formData.leadershipRole}
                onChange={(e) =>
                  setFormData({ ...formData, leadershipRole: e.target.value })
                }
              >
                <option value="">Please select</option>
                <option>Coordinator</option>
                <option>HOD</option>
                <option>Assistant Principal</option>
                <option>Principal</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-between mt-3">
              <Button variant="secondary" onClick={prevStep}>
                Previous
              </Button>
              <Button variant="primary" onClick={nextStep}>
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
