import Select from "react-select";
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
            options={[
              { value: "academic_registrar", label: "Academic registrar" },
              { value: "business_manager", label: "Business manager" },
              { value: "careers_counsellor", label: "Careers Counsellor" },
              { value: "deputy_head_primary", label: "Deputy Head of Primary" },
              {
                value: "deputy_head_secondary",
                label: "Deputy Head of Secondary",
              },
              { value: "deputy_head_school", label: "Deputy Head of School" },
              { value: "director", label: "Director" },
              { value: "director_of_studies", label: "Director of Studies" },
              {
                value: "grade_level_coordinator",
                label: "Grade level Coordinator",
              },
              { value: "head_of_department", label: "Head of Department" },
              { value: "head_of_early_years", label: "Head of Early Years" },
              { value: "head_of_prep_school", label: "Head of Prep School" },
              { value: "head_of_primary", label: "Head of Primary" },
              { value: "head_of_secondary", label: "Head of Secondary" },
              { value: "head_of_section", label: "Head of Section" },
              { value: "head_of_subject", label: "Head of Subject" },
              { value: "head_of_year", label: "Head of Year" },
              { value: "head_teacher", label: "Head Teacher" },
              { value: "house_master", label: "House Master" },
              { value: "house_mistress", label: "House Mistress" },
              { value: "ib_coordinator", label: "IB Coordinator" },
              { value: "inspector", label: "Inspector" },
              { value: "phase_coordinator", label: "Phase Coordinator" },
              { value: "principal", label: "Principal" },
              { value: "principal_inspector", label: "Principal Inspector" },
              { value: "psychologist", label: "Psychologist" },
              { value: "second_in_department", label: "Second in Department" },
              { value: "senior_inspector", label: "Senior Inspector" },
              { value: "teacher", label: "Teacher" },
              { value: "vice_director", label: "Vice Director" },
              { value: "vice_principal", label: "Vice Principal" },
            ]}
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
            options={[
              { value: "academic_registrar", label: "Academic Registrar" },
              { value: "american_studies", label: "American Studies" },
              { value: "arabic", label: "Arabic" },
              { value: "art_and_design", label: "Art and Design" },
              { value: "biology", label: "Biology" },
              { value: "business_studies", label: "Business Studies" },
              { value: "calculus", label: "Calculus" },
              { value: "careers", label: "Careers" },
              { value: "chemistry", label: "Chemistry" },
              { value: "chinese", label: "Chinese" },
              { value: "citizenship", label: "Citizenship" },
              { value: "classical_studies", label: "Classical Studies" },
              { value: "computer_science", label: "Computer Science" },
              { value: "computer_studies", label: "Computer Studies" },
              { value: "dance", label: "Dance" },
              { value: "design_technology", label: "Design Technology" },
              { value: "drama", label: "Drama" },
              { value: "eal", label: "EAL" },
              { value: "early_years", label: "Early Years" },
              { value: "economics", label: "Economics" },
              { value: "education", label: "Education" },
              { value: "english", label: "English" },
              {
                value: "english_as_additional_language",
                label: "English as an Additional Language",
              },
              {
                value: "environmental_studies",
                label: "Environmental Studies",
              },
              { value: "film_studies", label: "Film Studies" },
              { value: "french", label: "French" },
              { value: "geography", label: "Geography" },
              { value: "geology", label: "Geology" },
              { value: "german", label: "German" },
              { value: "global_perspectives", label: "Global Perspectives" },
              { value: "health", label: "Health" },
              { value: "history", label: "History" },
              { value: "home_economics", label: "Home Economics" },
              { value: "head_teacher", label: "Head Teacher" },
              { value: "house_master", label: "House Master" },
              { value: "house_mistress", label: "House Mistress" },
              { value: "humanities", label: "Humanities" },
              { value: "ict", label: "ICT" },
              { value: "inspector", label: "Inspector" },
              { value: "japanese", label: "Japanese" },
              { value: "learning_support", label: "Learning Support" },
              { value: "legal_studies", label: "Legal Studies" },
              { value: "librarianship", label: "Librarianship" },
              { value: "literature", label: "Literature" },
              { value: "mathematics", label: "Mathematics" },
              { value: "media_studies", label: "Media Studies" },
              { value: "mfl", label: "MFL" },
              {
                value: "middle_school_generalist",
                label: "Middle School Generalist",
              },
              { value: "music", label: "Music" },
              { value: "outdoor_education", label: "Outdoor Education" },
              { value: "philosophy", label: "Philosophy" },
              { value: "physical_education", label: "Physical Education" },
              { value: "physics", label: "Physics" },
              { value: "politics", label: "Politics" },
              { value: "primary", label: "Primary" },
              { value: "pshe", label: "PSHE" },
              { value: "psychology", label: "Psychology" },
              { value: "religious_education", label: "Religious Education" },
              { value: "russian", label: "Russian" },
              { value: "school_counselor", label: "School Counselor" },
              { value: "school_psychologist", label: "School Psychologist" },
              { value: "science", label: "Science" },
              { value: "secondary", label: "Secondary" },
              { value: "social_sciences", label: "Social Sciences" },
              { value: "sociology", label: "Sociology" },
              { value: "spanish", label: "Spanish" },
              { value: "special_needs", label: "Special Needs" },
              { value: "statistics", label: "Statistics" },
              { value: "thai", label: "Thai" },
              { value: "theatre_studies", label: "Theatre Studies" },
              { value: "theory_of_knowledge", label: "Theory of Knowledge" },
            ]}
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
          <label className="form-label">Curriculum experience</label>

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
