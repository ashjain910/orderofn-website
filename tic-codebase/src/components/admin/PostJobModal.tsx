import React, { useState } from "react";
import AdminBaseApi from "../../services/admin-base";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { MultiValue } from "react-select";
import { toast } from "react-toastify";
import { toastOptions } from "../../utils/toastOptions";

export interface PostJobModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialValues?: {
    id?: number;
    title?: string;
    school_name?: string;
    job_type?: string;
    school_type?: string;
    subjects?: any[];
    description?: string;
    location?: string;
    gender_preference?: string;
    closing_date?: Date | string | null;
  };
}

export default function PostJobModal({
  show,
  onClose,
  onSuccess,
  initialValues,
}: PostJobModalProps) {
  type SubjectOption = { value: string; label: string };
  const [form, setForm] = useState({
    title: initialValues?.title || "",
    school_name: initialValues?.school_name || "",
    job_type: initialValues?.job_type || "",
    school_type: initialValues?.school_type || "",
    subjects: initialValues?.subjects
      ? initialValues.subjects.map((s: any) =>
          typeof s === "object" && s.value && s.label
            ? s
            : { value: s, label: s }
        )
      : [],
    description: initialValues?.description || "",
    location: initialValues?.location || "",
    gender_preference: initialValues?.gender_preference || "",
    closing_date: initialValues?.closing_date
      ? typeof initialValues.closing_date === "string"
        ? new Date(initialValues.closing_date)
        : initialValues.closing_date
      : null,
  });
  const subjectOptions: SubjectOption[] = [
    { value: "Math", label: "Math" },
    { value: "Science", label: "Science" },
    { value: "English", label: "English" },
    { value: "History", label: "History" },
    { value: "Art", label: "Art" },
    { value: "Physical Education", label: "Physical Education" },
    { value: "Other", label: "Other" },
  ];
  const jobTypes = [
    { title: "Casual", value: "casual" },
    { title: "Remote", value: "remote" },
    { title: "Part-time", value: "part-time" },
    { title: "Full-time", value: "full-time" },
  ];
  const schoolTypes = [
    { title: "Public", value: "public" },
    { title: "Private", value: "private" },
    { title: "Charter", value: "charter" },
    { title: "International", value: "international" },
  ];
  const [errors, setErrors] = useState<any>({});

  // Clear errors when modal is closed
  React.useEffect(() => {
    if (!show) {
      setErrors({});
    }
  }, [show]);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: any = {};
    if (!form.title) newErrors.title = "Job title is required";
    if (!form.school_name) newErrors.school_name = "School name is required";
    if (!form.job_type) newErrors.job_type = "Job type is required";
    if (!form.school_type) newErrors.school_type = "School type is required";
    if (!form.subjects || form.subjects.length === 0)
      newErrors.subjects = "Subject is required";
    // if (!form.summary) newErrors.summary = "Summary is required";
    if (!form.description) newErrors.description = "Description required";
    if (!form.location) newErrors.location = "Location required";
    if (!form.closing_date) newErrors.closing_date = "Close date required";
    // if (!form.requirements) newErrors.requirements = "Requirements required";
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
      if (initialValues && initialValues.id) {
        // Editing existing job
        response = await AdminBaseApi.put(`/jobs/${initialValues.id}/update`, {
          ...form,
          subjects: form.subjects.map((s) => s.value),
          closing_date: formatDate(form.closing_date),
        });
      } else {
        // Creating new job
        response = await AdminBaseApi.post("/jobs/create", {
          ...form,
          subjects: form.subjects.map((s) => s.value),
          closing_date: formatDate(form.closing_date),
        });
      }
      if (response.status === 200 || response.status === 201) {
        const msg =
          response.data?.message ||
          (initialValues
            ? "Job updated successfully!"
            : "Job posted successfully!");
        toast.success(msg, toastOptions);
        setForm({
          title: "",
          school_name: "",
          job_type: "",
          school_type: "",
          subjects: [],
          description: "",
          location: "",
          gender_preference: "",
          closing_date: null,
        });
        setErrors({});
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err: any) {
      let errorMsg = initialValues
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
      toast.error(errorMsg, toastOptions);
    }
    setLoading(false);
  };

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
                  {/* Job Title */}
                  <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="mb-3">
                      <label className="form-label">Job Title</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.title ? "is-invalid" : ""
                        }`}
                        value={form.title}
                        onChange={(e) =>
                          setForm({ ...form, title: e.target.value })
                        }
                        placeholder="Enter job title"
                      />
                      {errors.title && (
                        <div className="invalid-feedback">{errors.title}</div>
                      )}
                    </div>
                  </div>
                  {/* School Name */}
                  <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="mb-3">
                      <label className="form-label">School Name</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.school_name ? "is-invalid" : ""
                        }`}
                        value={form.school_name}
                        onChange={(e) =>
                          setForm({ ...form, school_name: e.target.value })
                        }
                        placeholder="Enter school name"
                      />
                      {errors.school_name && (
                        <div className="invalid-feedback">
                          {errors.school_name}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Job Type */}
                  <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="mb-3">
                      <label className="form-label">Job Type</label>
                      <select
                        className={`form-select ${
                          errors.job_type ? "is-invalid" : ""
                        }`}
                        value={form.job_type}
                        onChange={(e) =>
                          setForm({ ...form, job_type: e.target.value })
                        }
                      >
                        <option value="" disabled>
                          Select job type
                        </option>
                        {jobTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.title}
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
                  {/* School Type */}
                  <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="mb-3">
                      <label className="form-label">School Type</label>
                      <select
                        className={`form-select ${
                          errors.school_type ? "is-invalid" : ""
                        }`}
                        value={form.school_type}
                        onChange={(e) =>
                          setForm({ ...form, school_type: e.target.value })
                        }
                      >
                        <option value="" disabled>
                          Select school type
                        </option>
                        {schoolTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.title}
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
                  {/* Subject */}
                  <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="mb-3">
                      <label className="form-label">Subject</label>
                      <Select<SubjectOption, true>
                        isMulti
                        options={subjectOptions}
                        closeMenuOnSelect={false}
                        value={form.subjects}
                        onChange={(selected: MultiValue<SubjectOption>) =>
                          setForm({
                            ...form,
                            subjects: Array.isArray(selected)
                              ? (selected as SubjectOption[])
                              : [],
                          })
                        }
                        classNamePrefix={errors.subject ? "is-invalid" : ""}
                        placeholder="Enter subject(s)..."
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
                  {/* Closing Date */}
                  <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="mb-3">
                      <label className="form-label">Closing Date</label>
                      <DatePicker
                        selected={form.closing_date}
                        onChange={(date: Date | null) =>
                          setForm({ ...form, closing_date: date })
                        }
                        className={`form-control ${
                          errors.closing_date ? "is-invalid" : ""
                        }`}
                        placeholderText="Select close date"
                        dateFormat="yyyy-MM-dd"
                        isClearable
                        autoComplete="off"
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
                  {/* Location */}
                  <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                    <div className="mb-3">
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.location ? "is-invalid" : ""
                        }`}
                        value={form.location}
                        onChange={(e) =>
                          setForm({ ...form, location: e.target.value })
                        }
                        placeholder="Enter location"
                      />
                      {errors.location && (
                        <div className="invalid-feedback">
                          {errors.location}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Gender Preference */}
                  <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                    <div className="mb-3">
                      <label className="form-label">Gender Preference</label>
                      <select
                        className={`form-select ${
                          errors.gender_preference ? "is-invalid" : ""
                        }`}
                        value={form.gender_preference}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            gender_preference: e.target.value,
                          })
                        }
                      >
                        <option value="">Select gender preference</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="others">Others</option>
                        <option value="any">Any</option>
                      </select>
                      {errors.gender_preference && (
                        <div className="invalid-feedback">
                          {errors.gender_preference}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Description */}
                  <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className={`form-control ${
                          errors.description ? "is-invalid" : ""
                        }`}
                        value={form.description}
                        onChange={(e) =>
                          setForm({ ...form, description: e.target.value })
                        }
                        rows={4}
                      />
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
