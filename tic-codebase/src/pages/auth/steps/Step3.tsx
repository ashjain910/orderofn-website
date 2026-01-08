import Select from "react-select";
import { SUBJECT_OPTIONS, ROLES_OPTIONS } from "../../../common/subjectOptions";
type StepProps = {
  nextStep: () => void;
  prevStep: () => void;
  formData: any;
  setFormData: (data: any) => void;
};

import { useState } from "react";

const Step3 = ({ nextStep, prevStep, formData, setFormData }: StepProps) => {
  const [touched, setTouched] = useState<any>({});
  const handleBlur = (field: string) => {
    setTouched((prev: any) => ({ ...prev, [field]: true }));
  };
  const handleNext = () => {
    setTouched({
      roles: true,
      subjects: true,
      age_group: true,
    });
    if (
      formData.roles &&
      formData.roles.length > 0 &&
      formData.subjects &&
      formData.subjects.length > 0 &&
      formData.age_group &&
      formData.age_group.length > 0
    ) {
      nextStep();
    }
  };

  const toggleCurriculum = (item: string) => {
    const exists = formData.curriculum?.includes(item);
    if (exists) {
      setFormData({
        ...formData,
        curriculum: formData.curriculum.filter((x: string) => x !== item),
      });
    } else {
      setFormData({
        ...formData,
        curriculum: [...(formData.curriculum || []), item],
      });
    }
  };

  const curriculumList = [
    "American",
    "Australian",
    "Canadian",
    "IB Dip",
    "IB MYP",
    "IB PYP",
    "Indian",
    "IPC",
    "New Zealand",
    "South African",
    "UK National",
  ];

  return (
    <div className="step-left">
      <div className="step-card">
        <div className="progress-title">
          <span className="stepNumber">3</span> Your teaching experience
        </div>
        <div className="progress">
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: "60%" }}
          />
        </div>

        <span className="step-count">Step 3 of 5</span>
        <div className="step-card">
          {/* ROLE (Multi-select) */}
          <label className="form-label">
            Teacher Role <span style={{ color: "red" }}>*</span>
            {touched.roles &&
              (!formData.roles || formData.roles.length === 0) && (
                <span style={{ color: "red", marginLeft: 8, fontSize: 13 }}>
                  Role is required
                </span>
              )}
          </label>
          <Select
            isMulti
            options={ROLES_OPTIONS}
            closeMenuOnSelect={false}
            value={formData.roles || []}
            onChange={(selected: any) => {
              setFormData({
                ...formData,
                roles: Array.isArray(selected) ? selected : [],
              });
            }}
            onBlur={() => handleBlur("roles")}
            classNamePrefix={"react-select"}
            placeholder="Select role(s)..."
          />

          {/* SUBJECT (Multi-select) */}
          <label className="form-label">
            Subject <span style={{ color: "red" }}>*</span>
            {touched.subjects &&
              (!formData.subjects || formData.subjects.length === 0) && (
                <span style={{ color: "red", marginLeft: 8, fontSize: 13 }}>
                  Subject is required
                </span>
              )}
          </label>
          <Select
            isMulti
            options={SUBJECT_OPTIONS}
            closeMenuOnSelect={false}
            value={formData.subjects || []}
            onChange={(selected: any) => {
              setFormData({
                ...formData,
                subjects: Array.isArray(selected) ? selected : [],
              });
            }}
            onBlur={() => handleBlur("subjects")}
            classNamePrefix={"react-select"}
            placeholder="Select subject(s)..."
          />

          {/* AGE GROUP */}
          <label className="form-label">
            Age group <span style={{ color: "red" }}>*</span>
            {touched.age_group &&
              (!formData.age_group || formData.age_group.length === 0) && (
                <span style={{ color: "red", marginLeft: 8, fontSize: 13 }}>
                  Age group is required
                </span>
              )}
          </label>
          <Select
            isMulti
            options={[
              { value: "3-5 Years", label: "3-5 Years" },
              { value: "6-10 Years", label: "6-10 Years" },
              { value: "11-15 Years", label: "11-15 Years" },
              { value: "16+ Years", label: "16+ Years" },
            ]}
            closeMenuOnSelect={false}
            value={formData.age_group || []}
            onChange={(selected: any) => {
              setFormData({
                ...formData,
                age_group: Array.isArray(selected) ? selected : [],
              });
            }}
            onBlur={() => handleBlur("age_group")}
            classNamePrefix={"react-select"}
            placeholder="Select age group(s)..."
          />

          {/* CURRICULUM EXPERIENCE */}
          <label className="form-label">Curriculum experience</label>

          <div className="row form-check d-flex align-items-center">
            {curriculumList.map((item, idx) => (
              <div className="col-4 mb-3" key={`curriculum-${item}-${idx}`}>
                <label className="d-flex form-check-label">
                  <input
                    type="checkbox"
                    className="me-2 form-check-input"
                    checked={formData.curriculum?.includes(item)}
                    onChange={() => toggleCurriculum(item)}
                  />
                  {item}
                </label>
              </div>
            ))}
          </div>

          {/* BUTTONS */}
          <div className="d-flex justify-content-between mt-3">
            <button onClick={prevStep} className="btn btn-secondary px-4">
              Previous
            </button>

            <button onClick={handleNext} className="btn btn-primary px-4">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3;
