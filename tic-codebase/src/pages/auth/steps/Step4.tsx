import { Form, Button } from "react-bootstrap";
import Select from "react-select";

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
              <Form.Label>Leadership role</Form.Label>
              <Select
                isMulti
                options={[
                  { value: "coordinator", label: "Coordinator" },
                  { value: "hod", label: "HOD" },
                  {
                    value: "assistant_principal",
                    label: "Assistant Principal",
                  },
                  { value: "principal", label: "Principal" },
                ]}
                closeMenuOnSelect={false}
                value={formData.leadership_role || []}
                onChange={(selected: any) =>
                  setFormData({
                    ...formData,
                    leadership_role: Array.isArray(selected) ? selected : [],
                  })
                }
                classNamePrefix={"react-select"}
                placeholder="Select leadership role(s)..."
              />
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
