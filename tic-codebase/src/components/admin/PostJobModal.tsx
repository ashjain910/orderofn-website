import React, { useState } from "react";
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
  { value: "medical_insurance", label: "Medical Insurance" },
  { value: "annual_flight", label: "Annual Flight" },
  { value: "housing", label: "Housing" },
  { value: "tuition_concession", label: "Tuition Concession" },
];

export interface PostJobModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialValues?: PostJobModalInitialValues;
}

export interface PostJobModalInitialValues {
  position?: string;
  position_type?: any[];
  package?: string;
  contract_type?: string;
  curriculum?: any[];
  education_stage?: any[];
  school_type_multi?: any[];
  closing_date?: Date | string | null;
  summary?: string;
  requirements?: string;
  description?: string;
  international_package?: string;
  salary?: string;
  benefits?: any[];
  job_start_date?: Date | string | null;
}

const positionTypeOptions = [
  { value: "Teacher", label: "Teacher" },
  { value: "Deputy Principal", label: "Deputy Principal" },
  { value: "Head of School", label: "Head of School" },
];
const curriculumOptions = [{ value: "IB PYP", label: "IB PYP" }];
const educationStageOptions = [
  { value: "Early Years", label: "Early Years" },
  { value: "Primary", label: "Primary" },
  { value: "Secondary", label: "Secondary" },
  { value: "Whole School", label: "Whole School" },
];
const schoolTypeMultiOptions = [
  { value: "Public", label: "Public" },
  { value: "International", label: "International" },
];

export default function PostJobModal({
  show,
  onClose,
  onSuccess,
  initialValues,
}: PostJobModalProps) {
  const [form, setForm] = useState(() => ({
    position: initialValues?.position || "",
    position_type: initialValues?.position_type || [],
    package: initialValues?.package || "",
    contract_type: initialValues?.contract_type || "",
    curriculum: initialValues?.curriculum || [],
    education_stage: initialValues?.education_stage || [],
    school_type_multi: initialValues?.school_type_multi || [],
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
    // Only validate a field if it is empty or not entered
    if (
      form.position === undefined ||
      form.position === null ||
      form.position === ""
    )
      newErrors.position = "Position is required";
    if (!Array.isArray(form.position_type) || form.position_type.length === 0)
      newErrors.position_type = "Position type is required";
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
    if (
      !Array.isArray(form.school_type_multi) ||
      form.school_type_multi.length === 0
    )
      newErrors.school_type_multi = "School type is required";
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
    if (
      form.international_package === undefined ||
      form.international_package === null ||
      form.international_package === ""
    )
      newErrors.international_package = "International package is required";
    if (
      form.international_package === "competitive" &&
      (form.salary === undefined ||
        form.salary === null ||
        form.salary.trim() === "")
    ) {
      newErrors.salary = "Salary is required for competitive package";
    }
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
      // Only create new job, editing by id is not supported with current fields
      response = await AdminBaseApi.post("/jobs/create", {
        ...form,
        closing_date: formatDate(form.closing_date),
      });
      if (response.status === 200 || response.status === 201) {
        const msg =
          response.data?.message ||
          (initialValues
            ? "Job updated successfully!"
            : "Job posted successfully!");
        toast.success(msg, toastOptions);
        setForm({
          position: "",
          position_type: [],
          package: "",
          contract_type: "",
          curriculum: [],
          education_stage: [],
          school_type_multi: [],
          closing_date: null,
          summary: "",
          requirements: "",
          description: "",
          international_package: "",
          salary: "",
          benefits: [],
          job_start_date: null,
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
                  {/* Position */}
                  <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="mb-3">
                      <label className="form-label">Position</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.position ? "is-invalid" : ""
                        }`}
                        value={form.position}
                        onChange={(e) => {
                          setForm({ ...form, position: e.target.value });
                          if (errors.position)
                            setErrors((prev: any) => ({
                              ...prev,
                              position: undefined,
                            }));
                        }}
                        placeholder="Enter position"
                      />
                      {errors.position && (
                        <div className="invalid-feedback">
                          {errors.position}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Position Type */}
                  <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="mb-3">
                      <label className="form-label">Position Type</label>
                      <Select
                        isMulti
                        options={positionTypeOptions}
                        closeMenuOnSelect={false}
                        value={form.position_type}
                        onChange={(selected: any) => {
                          setForm({ ...form, position_type: selected });
                          if (errors.position_type)
                            setErrors((prev: any) => ({
                              ...prev,
                              position_type: undefined,
                            }));
                        }}
                        placeholder="Select position type(s)"
                      />
                      {errors.position_type && (
                        <div
                          className="invalid-feedback"
                          style={{ display: "block" }}
                        >
                          {errors.position_type}
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
                  {/* Curriculum */}
                  <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="mb-3">
                      <label className="form-label">Curriculum</label>
                      <Select
                        isMulti
                        options={curriculumOptions}
                        closeMenuOnSelect={false}
                        value={form.curriculum}
                        onChange={(selected: any) => {
                          setForm({ ...form, curriculum: selected });
                          if (errors.curriculum)
                            setErrors((prev: any) => ({
                              ...prev,
                              curriculum: undefined,
                            }));
                        }}
                        placeholder="Select curriculum(s)"
                      />
                      {errors.curriculum && (
                        <div
                          className="invalid-feedback"
                          style={{ display: "block" }}
                        >
                          {errors.curriculum}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Education Stage */}
                  <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="mb-3">
                      <label className="form-label">Education Stage</label>
                      <Select
                        isMulti
                        options={educationStageOptions}
                        closeMenuOnSelect={false}
                        value={form.education_stage}
                        onChange={(selected: any) => {
                          setForm({ ...form, education_stage: selected });
                          if (errors.education_stage)
                            setErrors((prev: any) => ({
                              ...prev,
                              education_stage: undefined,
                            }));
                        }}
                        placeholder="Select education stage(s)"
                      />
                      {errors.education_stage && (
                        <div
                          className="invalid-feedback"
                          style={{ display: "block" }}
                        >
                          {errors.education_stage}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* School Type */}
                  <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="mb-3">
                      <label className="form-label">School Type</label>
                      <Select
                        isMulti
                        options={schoolTypeMultiOptions}
                        closeMenuOnSelect={false}
                        value={form.school_type_multi}
                        onChange={(selected: any) => {
                          setForm({ ...form, school_type_multi: selected });
                          if (errors.school_type_multi)
                            setErrors((prev: any) => ({
                              ...prev,
                              school_type_multi: undefined,
                            }));
                        }}
                        placeholder="Select school type(s)"
                      />
                      {errors.school_type_multi && (
                        <div
                          className="invalid-feedback"
                          style={{ display: "block" }}
                        >
                          {errors.school_type_multi}
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
                        <option value="tbc">To Be confirmed</option>
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
                              "link",
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
                              "link",
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
                              "link",
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
                    {loading ? "Posting..." : "Post Job"}
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
