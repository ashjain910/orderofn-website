import React, { useState } from "react";
import {
  SUBJECT_OPTIONS,
  POSITIONTYPE_OPTIONS,
} from "../../common/subjectOptions";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "./PostJobModal.css";
import AdminBaseApi from "../../services/admin-base";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { toastOptions } from "../../utils/toastOptions";

const benefitOptions = [
  { value: "Medical Insurance", label: "Medical Insurance" },
  { value: "Annual Flight", label: "Annual Flight" },
  { value: "Housing", label: "Housing" },
  { value: "Tuition Concession", label: "Tuition Concession" },
];

export interface PostJobModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialValues?: PostJobModalInitialValues;
}

export interface PostJobModalInitialValues {
  id?: string | number;
  title?: string;
  job_type?: any[];
  package?: string;
  contract_type?: string;
  curriculum?: any[];
  education_stage?: any[];
  school_type?: any[];
  closing_date?: Date | string | null;
  summary?: string;
  requirements?: string;
  description?: string;
  international_package?: string;
  salary?: string;
  benefits?: any[];
  job_start_date?: Date | string | null;
  location?: string;
  subjects?: string;
  school_name?: string;
  school_logo?: File | null;
}

const positionTypeOptions = POSITIONTYPE_OPTIONS;

const curriculumOptions = [
  { value: "American", label: "American" },
  { value: "Australian", label: "Australian" },
  { value: "Canadian", label: "Canadian" },
  { value: "IB Dip", label: "IB Dip" },
  { value: "IB MYP", label: "IB MYP" },
  { value: "IB PYP", label: "IB PYP" },
  { value: "Indian", label: "Indian" },
  { value: "IPC", label: "IPC" },
  { value: "New zealand", label: "New zealand" },
  { value: "South African", label: "South African" },
  { value: "UK National", label: "UK National" },
];

const educationStageOptions = [
  { value: "Early Years", label: "Early Years" },
  { value: "Primary", label: "Primary" },
  { value: "Secondary", label: "Secondary" },
  { value: "Whole School", label: "Whole School" },
];
const schoolTypeMultiOptions = [
  { value: "public", label: "Public" },
  { value: "international", label: "International" },
];

export default function PostJobModal({
  show,
  onClose,
  onSuccess,
  initialValues,
}: PostJobModalProps) {
  const mapSubjectsToOptions = (subjects: any) => {
    if (!subjects) return [];
    // If already array of {label, value}
    if (
      Array.isArray(subjects) &&
      subjects.length > 0 &&
      subjects[0].value &&
      subjects[0].label
    ) {
      return subjects;
    }
    // If comma-separated string
    if (typeof subjects === "string") {
      try {
        // Try to parse as JSON array
        const parsed = JSON.parse(subjects);
        if (Array.isArray(parsed)) {
          return SUBJECT_OPTIONS.filter((opt) => parsed.includes(opt.value));
        }
      } catch {
        // Not JSON, treat as single subject string
        return SUBJECT_OPTIONS.filter((opt) => opt.value === subjects);
      }
    }
    // If array of strings
    if (Array.isArray(subjects)) {
      return SUBJECT_OPTIONS.filter((opt) => subjects.includes(opt.value));
    }
    return [];
  };

  const mapSchoolTypeToOptions = (schoolType: any) => {
    if (!schoolType) return [];
    if (
      Array.isArray(schoolType) &&
      schoolType.length > 0 &&
      schoolType[0].value &&
      schoolType[0].label
    ) {
      return schoolType;
    }
    if (typeof schoolType === "string") {
      return schoolTypeMultiOptions.filter((opt) => opt.value === schoolType);
    }
    if (Array.isArray(schoolType)) {
      return schoolTypeMultiOptions.filter((opt) =>
        schoolType.includes(opt.value)
      );
    }
    return [];
  };

  const mapCurriculumToOptions = (curriculum: any) => {
    if (!curriculum) return [];
    if (
      Array.isArray(curriculum) &&
      curriculum.length > 0 &&
      curriculum[0].value &&
      curriculum[0].label
    ) {
      return curriculum;
    }
    if (typeof curriculum === "string") {
      return curriculumOptions.filter((opt) => opt.value === curriculum);
    }
    if (Array.isArray(curriculum)) {
      return curriculumOptions.filter((opt) => curriculum.includes(opt.value));
    }
    return [];
  };

  const mapEducationStageToOptions = (educationStage: any) => {
    if (!educationStage) return [];
    if (
      Array.isArray(educationStage) &&
      educationStage.length > 0 &&
      educationStage[0].value &&
      educationStage[0].label
    ) {
      return educationStage;
    }
    if (typeof educationStage === "string") {
      return educationStageOptions.filter(
        (opt) => opt.value === educationStage
      );
    }
    if (Array.isArray(educationStage)) {
      return educationStageOptions.filter((opt) =>
        educationStage.includes(opt.value)
      );
    }
    return [];
  };

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [form, setForm] = useState(() => ({
    title: initialValues?.title || "",
    job_type: mapJobTypeToOptions(initialValues?.job_type),
    package: initialValues?.package || "",
    contract_type: initialValues?.contract_type || "",
    curriculum: mapCurriculumToOptions(initialValues?.curriculum),
    education_stage: mapEducationStageToOptions(initialValues?.education_stage),
    school_type: mapSchoolTypeToOptions(initialValues?.school_type),
    closing_date: initialValues?.closing_date
      ? typeof initialValues.closing_date === "string"
        ? new Date(initialValues.closing_date)
        : initialValues.closing_date
      : null,
    summary: initialValues?.summary || "",
    requirements: initialValues?.requirements || "",
    description: initialValues?.description || "",
    international_package: initialValues?.international_package || "",
    salary: initialValues?.salary || "",
    benefits: initialValues?.benefits
      ? initialValues.benefits.map((b: any) =>
          typeof b === "object" && b.value && b.label
            ? b
            : { value: b, label: b }
        )
      : [],
    job_start_date: initialValues?.job_start_date
      ? typeof initialValues.job_start_date === "string"
        ? new Date(initialValues.job_start_date)
        : initialValues.job_start_date
      : null,
    location: initialValues?.location || "",
    subjects: mapSubjectsToOptions(initialValues?.subjects),
    school_name: initialValues?.school_name || "",
    school_logo: initialValues?.school_logo || null,
  }));
  const [errors, setErrors] = useState<any>({});
  React.useEffect(() => {
    if (!show) {
      setErrors({});
    }
  }, [show]);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: any = {};
    if (
      form.school_name === undefined ||
      form.school_name === null ||
      form.school_name.trim() === ""
    )
      newErrors.school_name = "School name is required";
    // Only validate a field if it is empty or not entered
    if (form.title === undefined || form.title === null || form.title === "")
      newErrors.title = "title is required";
    if (!Array.isArray(form.job_type) || form.job_type.length === 0)
      newErrors.job_type = "title type is required";
    if (
      form.location === undefined ||
      form.location === null ||
      form.location === ""
    )
      newErrors.location = "Location is required";
    if (!Array.isArray(form.subjects) || form.subjects.length === 0)
      newErrors.subjects = "Subjects are required";
    if (
      form.package === undefined ||
      form.package === null ||
      form.package === ""
    )
      newErrors.package = "Package is required";
    if (
      form.contract_type === undefined ||
      form.contract_type === null ||
      form.contract_type === ""
    )
      newErrors.contract_type = "Contract type is required";
    if (!Array.isArray(form.curriculum) || form.curriculum.length === 0)
      newErrors.curriculum = "Curriculum is required";
    if (
      !Array.isArray(form.education_stage) ||
      form.education_stage.length === 0
    )
      newErrors.education_stage = "Education stage is required";
    if (!Array.isArray(form.school_type) || form.school_type.length === 0)
      newErrors.school_type = "School type is required";
    if (!form.closing_date) newErrors.closing_date = "Closing date is required";
    if (
      form.summary === undefined ||
      form.summary === null ||
      form.summary.trim() === ""
    )
      newErrors.summary = "Job summary is required";
    if (
      form.requirements === undefined ||
      form.requirements === null ||
      form.requirements.trim() === ""
    )
      newErrors.requirements = "Job requirements are required";
    if (
      form.description === undefined ||
      form.description === null ||
      form.description === ""
    )
      newErrors.description = "Job description is required";
    // if (
    //   form.international_package === undefined ||
    //   form.international_package === null ||
    //   form.international_package === ""
    // )
    //   newErrors.international_package = "International package is required";
    // if (
    //   form.international_package === "competitive" &&
    //   (form.salary === undefined ||
    //     form.salary === null ||
    //     form.salary.trim() === "")
    // ) {
    //   newErrors.salary = "Salary is required for competitive package";
    // }
    if (!Array.isArray(form.benefits) || form.benefits.length === 0)
      newErrors.benefits = "At least one benefit is required";
    if (!form.job_start_date)
      newErrors.job_start_date = "Start date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const formatDate = (date: Date | null) => {
        if (!date) return "";
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };
      let response;
      const toValueArray = (arr: any[]) =>
        arr.map((item) => (item && item.value ? item.value : item));
      const getSingleValue = (arr: any[]) =>
        Array.isArray(arr) && arr[0] && arr[0].value ? arr[0].value : "";
      let isMultipart = !!form.school_logo;
      if (isMultipart) {
        // Prepare FormData for file upload
        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("job_type", getSingleValue(form.job_type));
        formData.append("package", form.package);
        formData.append("contract_type", form.contract_type);
        formData.append("curriculum", getSingleValue(form.curriculum));
        formData.append(
          "education_stage",
          getSingleValue(form.education_stage)
        );
        formData.append("school_type", getSingleValue(form.school_type));
        formData.append("closing_date", formatDate(form.closing_date));
        formData.append("summary", form.summary);
        formData.append("requirements", form.requirements);
        formData.append("description", form.description);
        formData.append("international_package", form.international_package);
        formData.append("salary", form.salary);
        formData.append("location", form.location);
        formData.append("school_name", form.school_name);
        formData.append("job_start_date", formatDate(form.job_start_date));
        // Array fields
        toValueArray(form.benefits).forEach((b: any) =>
          formData.append("benefits", b)
        );
        (Array.isArray(form.subjects)
          ? toValueArray(form.subjects)
          : [form.subjects]
        ).forEach((s: any) => formData.append("subjects", s));
        // Logo file
        if (form.school_logo) {
          formData.append("school_logo", form.school_logo);
        }
        if (initialValues && initialValues.id) {
          // PATCH update job
          response = await AdminBaseApi.patch(
            `/jobs/${initialValues.id}/update`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
        } else {
          // POST create job
          response = await AdminBaseApi.post("/jobs/create", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      } else {
        // Send as JSON if no file
        const payload = {
          ...form,
          job_type: getSingleValue(form.job_type),
          curriculum: getSingleValue(form.curriculum),
          education_stage: getSingleValue(form.education_stage),
          school_type: getSingleValue(form.school_type),
          closing_date: formatDate(form.closing_date),
          job_start_date: formatDate(form.job_start_date),
          benefits: toValueArray(form.benefits),
          subjects: Array.isArray(form.subjects)
            ? toValueArray(form.subjects)
            : form.subjects,
        };
        if (initialValues && initialValues.id) {
          response = await AdminBaseApi.patch(
            `/jobs/${initialValues.id}/update`,
            payload
          );
        } else {
          response = await AdminBaseApi.post("/jobs/create", payload);
        }
      }
      if (response.status === 200 || response.status === 201) {
        const msg =
          response.data?.message ||
          (initialValues && initialValues.id
            ? "Job updated successfully!"
            : "Job posted successfully!");
        setLoading(false);
        toast.success(msg, toastOptions);
        setForm({
          title: "",
          job_type: [],
          package: "",
          contract_type: "",
          curriculum: [],
          education_stage: [],
          school_type: [],
          closing_date: null,
          summary: "",
          requirements: "",
          description: "",
          international_package: "",
          salary: "",
          benefits: [],
          job_start_date: null,
          location: "",
          subjects: [],
          school_name: "",
          school_logo: null,
        });
        setLogoPreview(null);
        setErrors({});
        if (onSuccess) onSuccess();
        // setTimeout(() => {
        //   // Force a page refresh by navigating to the same path with a unique query param
        //   window.location.reload();
        //   setLoading(false);
        // }, 3000);
        onClose();
      }
    } catch (err: any) {
      setLoading(false);
      let errorMsg =
        initialValues && initialValues.id
          ? "Failed to update job"
          : "Failed to post job";
      if (err?.response?.data) {
        const errorData = err.response.data;
        errorMsg = Object.entries(errorData)
          .map(([field, messages]) => {
            if (Array.isArray(messages)) {
              return `${field}: ${messages.join(", ")}`;
            }
            return `${field}: ${messages}`;
          })
          .join(" | ");
      }
      setLoading(false);
      toast.error(errorMsg || "Something went wrong", toastOptions);
    }
  };

  if (!show) return null;

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      role="dialog"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Post a Job</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => {
                setErrors({});
                onClose();
              }}
            ></button>
          </div>
          <div className="modal-body">
            {loading ? (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: 200 }}
              >
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} autoComplete="off">
                <div className="row">
                  {/* title */}
                  <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="mb-3">
                      <label className="form-label">Position</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.title ? "is-invalid" : ""
                        }`}
                        value={form.title}
                        onChange={(e) => {
                          setForm({ ...form, title: e.target.value });
                          if (errors.title)
                            setErrors((prev: any) => ({
                              ...prev,
                              title: undefined,
                            }));
                        }}
                        placeholder="Enter title"
                      />
                      {errors.title && (
                        <div className="invalid-feedback">{errors.title}</div>
                      )}
                    </div>
                  </div>
                  {/* title Type (Single Select) */}
                  <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="mb-3">
                      <label className="form-label">Postion Type</label>
                      <select
                        className={`form-select ${
                          errors.job_type ? "is-invalid" : ""
                        }`}
                        value={form.job_type[0]?.value || ""}
                        onChange={(e) => {
                          const selected = positionTypeOptions.find(
                            (opt) => opt.value === e.target.value
                          );
                          setForm({
                            ...form,
                            job_type: selected ? [selected] : [],
                          });
                          if (errors.job_type)
                            setErrors((prev: any) => ({
                              ...prev,
                              job_type: undefined,
                            }));
                        }}
                      >
                        <option value="">Select title type</option>
                        {positionTypeOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      {errors.job_type && (
                        <div className="invalid-feedback">
                          {errors.job_type}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* School Name & Logo */}
                  <div className="col-lg-6 col-md-6 col-sm-12 col-12 mb-2">
                    <div>
                      <label className="form-label">School Name</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.school_name ? "is-invalid" : ""
                        }`}
                        value={form.school_name}
                        onChange={(e) => {
                          setForm({ ...form, school_name: e.target.value });
                          if (errors.school_name)
                            setErrors((prev: any) => ({
                              ...prev,
                              school_name: undefined,
                            }));
                        }}
                        placeholder="Enter school name"
                      />
                      {errors.school_name && (
                        <div className="invalid-feedback">
                          {errors.school_name}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* 
                  <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                    <label className="form-label">School Logo</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={(e) => {
                        const file = e.target.files && e.target.files[0];
                        if (file) {
                          setForm({ ...form, school_logo: file });
                          const reader = new FileReader();
                          reader.onloadend = () =>
                            setLogoPreview(reader.result as string);
                          reader.readAsDataURL(file);
                        } else {
                          setForm({ ...form, school_logo: null });
                          setLogoPreview(null);
                        }
                      }}
                    />
                    {logoPreview && (
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        style={{
                          width: 80,
                          height: 80,
                          objectFit: "contain",
                          marginTop: 8,
                          borderRadius: 50,
                          border: "1px solid #eee",
                        }}
                      />
                    )}
                  </div> */}
                  {/* Location */}
                  <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="mb-3">
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.location ? "is-invalid" : ""
                        }`}
                        value={form.location}
                        onChange={(e) => {
                          setForm({ ...form, location: e.target.value });
                          if (errors.location)
                            setErrors((prev: any) => ({
                              ...prev,
                              location: undefined,
                            }));
                        }}
                        placeholder="Enter location"
                      />
                      {errors.location && (
                        <div className="invalid-feedback">
                          {errors.location}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Subjects (Multi-Select) */}
                  <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="mb-3">
                      <label className="form-label">Subjects</label>
                      <Select
                        isMulti
                        options={SUBJECT_OPTIONS}
                        closeMenuOnSelect={false}
                        value={form.subjects}
                        onChange={(selected: any) => {
                          setForm({ ...form, subjects: selected });
                          if (errors.subjects)
                            setErrors((prev: any) => ({
                              ...prev,
                              subjects: undefined,
                            }));
                        }}
                        placeholder="Select subjects"
                      />
                      {errors.subjects && (
                        <div
                          className="invalid-feedback"
                          style={{ display: "block" }}
                        >
                          {errors.subjects}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Package */}
                  <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="mb-3">
                      <label className="form-label">Package</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.package ? "is-invalid" : ""
                        }`}
                        value={form.package}
                        onChange={(e) => {
                          setForm({ ...form, package: e.target.value });
                          if (errors.package)
                            setErrors((prev: any) => ({
                              ...prev,
                              package: undefined,
                            }));
                        }}
                        placeholder="Enter package"
                      />
                      {errors.package && (
                        <div className="invalid-feedback">{errors.package}</div>
                      )}
                    </div>
                  </div>
                  {/* Contract Type */}
                  <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="mb-3">
                      <label className="form-label">Contract Type</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.contract_type ? "is-invalid" : ""
                        }`}
                        value={form.contract_type}
                        onChange={(e) => {
                          setForm({ ...form, contract_type: e.target.value });
                          if (errors.contract_type)
                            setErrors((prev: any) => ({
                              ...prev,
                              contract_type: undefined,
                            }));
                        }}
                        placeholder="Enter contract type"
                      />
                      {errors.contract_type && (
                        <div className="invalid-feedback">
                          {errors.contract_type}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Curriculum (Single Select) */}
                  <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="mb-3">
                      <label className="form-label">Curriculum</label>
                      <select
                        className={`form-select ${
                          errors.curriculum ? "is-invalid" : ""
                        }`}
                        value={form.curriculum[0]?.value || ""}
                        onChange={(e) => {
                          const selected = curriculumOptions.find(
                            (opt) => opt.value === e.target.value
                          );
                          setForm({
                            ...form,
                            curriculum: selected ? [selected] : [],
                          });
                          if (errors.curriculum)
                            setErrors((prev: any) => ({
                              ...prev,
                              curriculum: undefined,
                            }));
                        }}
                      >
                        <option value="">Select curriculum</option>
                        {curriculumOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      {errors.curriculum && (
                        <div className="invalid-feedback">
                          {errors.curriculum}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Education Stage (Single Select) */}
                  <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="mb-3">
                      <label className="form-label">Education Stage</label>
                      <select
                        className={`form-select ${
                          errors.education_stage ? "is-invalid" : ""
                        }`}
                        value={form.education_stage[0]?.value || ""}
                        onChange={(e) => {
                          const selected = educationStageOptions.find(
                            (opt) => opt.value === e.target.value
                          );
                          setForm({
                            ...form,
                            education_stage: selected ? [selected] : [],
                          });
                          if (errors.education_stage)
                            setErrors((prev: any) => ({
                              ...prev,
                              education_stage: undefined,
                            }));
                        }}
                      >
                        <option value="">Select education stage</option>
                        {educationStageOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      {errors.education_stage && (
                        <div className="invalid-feedback">
                          {errors.education_stage}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* School Type (Single Select) */}
                  <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="mb-3">
                      <label className="form-label">School Type</label>
                      <select
                        className={`form-select ${
                          errors.school_type ? "is-invalid" : ""
                        }`}
                        value={form.school_type[0]?.value || ""}
                        onChange={(e) => {
                          const selected = schoolTypeMultiOptions.find(
                            (opt) => opt.value === e.target.value
                          );
                          setForm({
                            ...form,
                            school_type: selected ? [selected] : [],
                          });
                          if (errors.school_type)
                            setErrors((prev: any) => ({
                              ...prev,
                              school_type: undefined,
                            }));
                        }}
                      >
                        <option value="">Select school type</option>
                        {schoolTypeMultiOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      {errors.school_type && (
                        <div className="invalid-feedback">
                          {errors.school_type}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Closing Date */}
                  <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="mb-3">
                      <label className="form-label">Closing Date</label>
                      <DatePicker
                        selected={form.closing_date}
                        onChange={(date: Date | null) => {
                          setForm({ ...form, closing_date: date });
                          if (errors.closing_date)
                            setErrors((prev: any) => ({
                              ...prev,
                              closing_date: undefined,
                            }));
                        }}
                        className={`form-control ${
                          errors.closing_date ? "is-invalid" : ""
                        }`}
                        placeholderText="Select close date"
                        dateFormat="yyyy-MM-dd"
                        isClearable
                        autoComplete="off"
                        minDate={(() => {
                          const d = new Date();
                          d.setDate(d.getDate() + 1);
                          return d;
                        })()}
                      />
                      {errors.closing_date && (
                        <div
                          className="invalid-feedback"
                          style={{ display: "block" }}
                        >
                          {errors.closing_date}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* International Package: Salary */}
                  <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                    <div className="mb-3">
                      <label className="form-label">
                        International Package: Salary
                      </label>
                      <select
                        className={`form-select ${
                          errors.international_package ? "is-invalid" : ""
                        }`}
                        value={form.international_package}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            international_package: e.target.value,
                            salary: "",
                          });
                          if (errors.international_package)
                            setErrors((prev: any) => ({
                              ...prev,
                              international_package: undefined,
                            }));
                        }}
                      >
                        <option value="">Select option</option>
                        <option value="to_be_confirmed">To Be confirmed</option>
                        <option value="tax_free">Tax Free Salary</option>
                        <option value="competitive">
                          Competitive salary based on experience Visa
                        </option>
                      </select>
                      {form.international_package === "competitive" && (
                        <div
                          className="input-group mt-2"
                          style={{
                            width: "150px",
                            textAlign: "right",
                            float: "right",
                          }}
                        >
                          <span className="input-group-text">$</span>
                          <input
                            type="text"
                            className={`form-control ${
                              errors.salary ? "is-invalid" : ""
                            }`}
                            placeholder="Enter salary"
                            value={form.salary}
                            onChange={(e) => {
                              setForm({
                                ...form,
                                salary: e.target.value,
                              });
                              if (errors.salary)
                                setErrors((prev: any) => ({
                                  ...prev,
                                  salary: undefined,
                                }));
                            }}
                          />
                        </div>
                      )}
                      {errors.international_package && (
                        <div className="invalid-feedback">
                          {errors.international_package}
                        </div>
                      )}
                      {form.international_package === "competitive" &&
                        errors.salary && (
                          <div className="invalid-feedback">
                            {errors.salary}
                          </div>
                        )}
                    </div>
                  </div>
                  {/* Benefits */}
                  <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                    <div className="mb-3">
                      <label className="form-label">Benefits</label>
                      <Select
                        isMulti
                        options={benefitOptions}
                        closeMenuOnSelect={false}
                        value={form.benefits || []}
                        onChange={(selected: any) => {
                          setForm({
                            ...form,
                            benefits: Array.isArray(selected) ? selected : [],
                          });
                          if (errors.benefits)
                            setErrors((prev: any) => ({
                              ...prev,
                              benefits: undefined,
                            }));
                        }}
                        classNamePrefix={"react-select"}
                        placeholder="Select benefits..."
                      />
                      {errors.benefits && (
                        <div
                          className="invalid-feedback"
                          style={{ display: "block" }}
                        >
                          {errors.benefits}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Start Date */}
                  <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                    <div className="mb-3">
                      <label className="form-label">Start Date</label>
                      <DatePicker
                        selected={form.job_start_date}
                        onChange={(date: Date | null) => {
                          setForm({ ...form, job_start_date: date });
                          if (errors.job_start_date)
                            setErrors((prev: any) => ({
                              ...prev,
                              job_start_date: undefined,
                            }));
                        }}
                        className={`form-control ${
                          errors.job_start_date ? "is-invalid" : ""
                        }`}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select start date"
                        isClearable
                        minDate={(() => {
                          const d = new Date();
                          d.setDate(d.getDate() + 1);
                          return d;
                        })()}
                      />
                      {errors.job_start_date && (
                        <div
                          className="invalid-feedback"
                          style={{ display: "block" }}
                        >
                          {errors.job_start_date}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Job Summary */}
                  <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                    <div className="mb-3">
                      <label className="form-label">Job Summary</label>
                      <div
                        className={`ckeditor-editor ${
                          errors.summary ? "is-invalid" : ""
                        }`}
                      >
                        {/* @ts-ignore: CKEditor5 ClassicEditor type incompatibility is safe to ignore */}
                        <CKEditor
                          // @ts-ignore
                          editor={ClassicEditor}
                          config={{
                            toolbar: [
                              "bold",
                              "italic",
                              "underline",
                              "heading",
                              "|",
                              "bulletedList",
                              "numberedList",
                              "|",
                              "undo",
                              "redo",
                            ],
                          }}
                          data={form.summary}
                          onChange={(_event: unknown, editor: any) => {
                            const data = editor.getData();
                            setForm((prev: any) => ({
                              ...prev,
                              summary: data,
                            }));
                            if (errors.summary)
                              setErrors((prev: any) => ({
                                ...prev,
                                summary: undefined,
                              }));
                          }}
                        />
                      </div>
                      {errors.summary && (
                        <div className="invalid-feedback">{errors.summary}</div>
                      )}
                    </div>
                  </div>
                  {/* Job Requirements */}
                  <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                    <div className="mb-3">
                      <label className="form-label">Job Requirements</label>
                      <div
                        className={`ckeditor-editor ${
                          errors.requirements ? "is-invalid" : ""
                        }`}
                      >
                        {/* @ts-ignore: CKEditor5 ClassicEditor type incompatibility is safe to ignore */}
                        <CKEditor
                          // @ts-ignore
                          editor={ClassicEditor}
                          config={{
                            toolbar: [
                              "bold",
                              "italic",
                              "underline",
                              "heading",
                              "|",
                              "bulletedList",
                              "numberedList",
                              "|",
                              "undo",
                              "redo",
                            ],
                          }}
                          data={form.requirements}
                          onChange={(_event: unknown, editor: any) => {
                            const data = editor.getData();
                            setForm((prev: any) => ({
                              ...prev,
                              requirements: data,
                            }));
                            if (errors.requirements)
                              setErrors((prev: any) => ({
                                ...prev,
                                requirements: undefined,
                              }));
                          }}
                        />
                      </div>
                      {errors.requirements && (
                        <div className="invalid-feedback">
                          {errors.requirements}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Job Description */}
                  <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                    <div className="mb-3">
                      <label className="form-label">Job Description</label>
                      <div
                        className={`ckeditor-editor ${
                          errors.description ? "is-invalid" : ""
                        }`}
                      >
                        {/* @ts-ignore: CKEditor5 ClassicEditor type incompatibility is safe to ignore */}
                        <CKEditor
                          // @ts-ignore
                          editor={ClassicEditor}
                          config={{
                            toolbar: [
                              "bold",
                              "italic",
                              "underline",
                              "heading",
                              "|",
                              "bulletedList",
                              "numberedList",
                              "|",
                              "undo",
                              "redo",
                            ],
                          }}
                          data={form.description}
                          onChange={(_event: unknown, editor: any) => {
                            const data = editor.getData();
                            setForm((prev: any) => ({
                              ...prev,
                              description: data,
                            }));
                            if (errors.description)
                              setErrors((prev: any) => ({
                                ...prev,
                                description: undefined,
                              }));
                          }}
                        />
                      </div>
                      {errors.description && (
                        <div className="invalid-feedback">
                          {errors.description}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-12 d-flex justify-content-end">
                  <button
                    type="submit"
                    className="btn btn-primary d-flex justify-content-center align-items-center"
                    disabled={loading}
                  >
                    {loading
                      ? initialValues && initialValues.id
                        ? "Updating..."
                        : "Posting..."
                      : initialValues && initialValues.id
                      ? "Update Job"
                      : "Post Job"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
function mapJobTypeToOptions(job_type: any[] | string | undefined): any[] {
  if (!job_type) return [];
  // Already array of {label, value}
  if (
    Array.isArray(job_type) &&
    job_type.length > 0 &&
    job_type[0].value &&
    job_type[0].label
  ) {
    return job_type;
  }
  // If string
  if (typeof job_type === "string") {
    return positionTypeOptions.filter((opt) => opt.value === job_type);
  }
  // If array of strings
  if (Array.isArray(job_type)) {
    return positionTypeOptions.filter((opt) => job_type.includes(opt.value));
  }
  return [];
}
