import Select from "react-select";
import { SUBJECT_OPTIONS, ROLES_OPTIONS } from "../../../common/subjectOptions";
type StepProps = {
  nextStep: () => void;
  prevStep: () => void;
  formData: any;
  setFormData: (data: any) => void;
};

const Step3 = ({ nextStep, prevStep, formData, setFormData }: StepProps) => {
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
    "New zealand",
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
          <label className="form-label">Teacher Role</label>
          <Select
            isMulti
            options={ROLES_OPTIONS}
            closeMenuOnSelect={false}
            value={formData.roles || []}
            onChange={(selected: any) =>
              setFormData({
                ...formData,
                roles: Array.isArray(selected) ? selected : [],
              })
            }
            classNamePrefix={"react-select"}
            placeholder="Select role(s)..."
          />

          {/* SUBJECT (Multi-select) */}
          <label className="form-label">Subject</label>
          <Select
            isMulti
            options={SUBJECT_OPTIONS}
            closeMenuOnSelect={false}
            value={formData.subjects || []}
            onChange={(selected: any) =>
              setFormData({
                ...formData,
                subjects: Array.isArray(selected) ? selected : [],
              })
            }
            classNamePrefix={"react-select"}
            placeholder="Select subject(s)..."
          />

          {/* AGE GROUP */}
          <label className="form-label">Age group</label>
          <select
            className="form-control"
            value={
              typeof formData.ageGroup === "string"
                ? formData.ageGroup
                : Array.isArray(formData.ageGroup) &&
                  formData.ageGroup.length > 0
                ? formData.ageGroup[0]
                : ""
            }
            onChange={(e) =>
              setFormData({ ...formData, ageGroup: e.target.value })
            }
          >
            <option value="">Please select</option>
            <option value="3-5 Years">3-5 Years</option>
            <option value="6-10 Years">6-10 Years</option>
            <option value="11-15 Years">11-15 Years</option>
            <option value="16+ Years">16+ Years</option>
          </select>

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

            <button onClick={nextStep} className="btn btn-primary px-4">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3;
