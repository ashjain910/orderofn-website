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
          {/* ROLE */}
          <label className="form-label">Role *</label>
          <select
            className="form-control"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="">Please select</option>
            <option>Teacher</option>
            <option>Assistant Teacher</option>
            <option>Senior Leader</option>
          </select>

          {/* SUBJECT */}
          <label className="form-label">Subject *</label>
          <select
            className="form-control"
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
          >
            <option value="">Please select</option>
            <option>Mathematics</option>
            <option>Science</option>
            <option>English</option>
            <option>History</option>
          </select>

          {/* AGE GROUP */}
          <label className="form-label">Age group *</label>
          <select
            className="form-control"
            value={formData.ageGroup}
            onChange={(e) =>
              setFormData({ ...formData, ageGroup: e.target.value })
            }
          >
            <option value="">Please select</option>
            <option>3-5 Years</option>
            <option>6-10 Years</option>
            <option>11-15 Years</option>
            <option>16+ Years</option>
          </select>

          {/* CURRICULUM EXPERIENCE */}
          <label className="form-label">Curriculum experience *</label>

          <div className="row form-check d-flex align-items-center">
            {curriculumList.map((item) => (
              <div className="col-4 mb-3" key={item}>
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
