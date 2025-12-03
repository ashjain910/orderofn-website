import React, { useState } from "react";
// import { useJsApiLoader } from "@react-google-maps/api";
import AdminBaseApi from "../../services/admin-base";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { MultiValue } from "react-select";

function AdminPostJob() {
  type SubjectOption = { value: string; label: string };
  const [form, setForm] = useState({
    job_title: "",
    school_name: "",
    job_type: "",
    role_type: "",
    subject: [] as SubjectOption[],
    looking_for: "",
    description: "",
    location: "",
    close_date: null as Date | null,
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

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const jobTypes = ["Casual", "Remote", "Part-time", "Full-time"];
  const roleTypes = ["Teacher", "Assistant", "Admin", "Other"];

  // Google Maps Autocomplete
  //   const [autocomplete, setAutocomplete] = useState<any>(null);
  //   const { isLoaded } = useJsApiLoader({
  //     googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY", // Replace with your key
  //     libraries: ["places"],
  //   });
  //   const handlePlaceChanged = () => {
  //     if (autocomplete) {
  //       const place = autocomplete.getPlace();
  //       setForm({ ...form, location: place.formatted_address || "" });
  //     }
  //   };

  // CKEditor handler
  const handleDescriptionChange = (_event: any, editor: any) => {
    setForm({ ...form, description: editor.getData() });
  };

  const validate = () => {
    const newErrors: any = {};
    if (!form.job_title) newErrors.job_title = "Job title is required";
    if (!form.school_name) newErrors.school_name = "School name is required";
    if (!form.job_type) newErrors.job_type = "Job type is required";
    if (!form.role_type) newErrors.role_type = "Role type is required";
    if (!form.subject || form.subject.length === 0)
      newErrors.subject = "Subject is required";
    if (!form.looking_for)
      newErrors.looking_for = "Who we are looking for is required";
    if (!form.description) newErrors.description = "Description required";
    if (!form.location) newErrors.location = "Location required";
    if (!form.close_date) newErrors.close_date = "Close date required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Submitting form:", form);

    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      console.log("Submitting form:", form);
      await AdminBaseApi.post("/post-job", {
        ...form,
        close_date: form.close_date
          ? form.close_date.toISOString().split("T")[0]
          : "",
      });
      alert("Job posted successfully!");
      setForm({
        job_title: "",
        school_name: "",
        job_type: "",
        role_type: "",
        subject: [],
        looking_for: "",
        description: "",
        location: "",
        close_date: null,
      });
      setErrors({});
    } catch (err) {
      alert("Failed to post job");
    }
    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-lg-8 col-md-8 col-sm-12 col-12">
          <div className="card">
            <div className="card-body">
              <h4 className="mb-4">Post a Job</h4>
              <form onSubmit={handleSubmit} autoComplete="off">
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="mb-3">
                      <label className="form-label">Job Title</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.job_title ? "is-invalid" : ""
                        }`}
                        value={form.job_title}
                        onChange={(e) =>
                          setForm({ ...form, job_title: e.target.value })
                        }
                        placeholder="Enter job title"
                      />
                      {errors.job_title && (
                        <div className="invalid-feedback">
                          {errors.job_title}
                        </div>
                      )}
                    </div>
                  </div>
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
                          <option key={type} value={type}>
                            {type}
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
                  <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="mb-3">
                      <label className="form-label">Role Type</label>
                      <select
                        className={`form-select ${
                          errors.role_type ? "is-invalid" : ""
                        }`}
                        value={form.role_type}
                        onChange={(e) =>
                          setForm({ ...form, role_type: e.target.value })
                        }
                      >
                        <option value="" disabled>
                          Select role type
                        </option>
                        {roleTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      {errors.role_type && (
                        <div className="invalid-feedback">
                          {errors.role_type}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="mb-3">
                      <label className="form-label">Subject</label>
                      <Select<SubjectOption, true>
                        isMulti
                        options={subjectOptions}
                        closeMenuOnSelect={false}
                        value={form.subject}
                        onChange={(selected: MultiValue<SubjectOption>) =>
                          setForm({
                            ...form,
                            subject: Array.isArray(selected)
                              ? (selected as SubjectOption[])
                              : [],
                          })
                        }
                        classNamePrefix={errors.subject ? "is-invalid" : ""}
                        placeholder="Enter subject(s)..."
                      />
                      {errors.subject && (
                        <div
                          className="invalid-feedback"
                          style={{ display: "block" }}
                        >
                          {errors.subject}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="mb-3">
                      <label className="form-label">Close Date</label>
                      <DatePicker
                        selected={form.close_date}
                        onChange={(date: Date | null) =>
                          setForm({ ...form, close_date: date })
                        }
                        className={`form-control ${
                          errors.close_date ? "is-invalid" : ""
                        }`}
                        placeholderText="Select close date"
                        dateFormat="yyyy-MM-dd"
                        isClearable
                        autoComplete="off"
                      />
                      {errors.close_date && (
                        <div
                          className="invalid-feedback"
                          style={{ display: "block" }}
                        >
                          {errors.close_date}
                        </div>
                      )}
                      {errors.close_date && (
                        <div className="invalid-feedback">
                          {errors.close_date}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-12">
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
                  <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                    <div className="mb-3">
                      <label className="form-label">
                        Who we are looking for
                      </label>
                      <textarea
                        className={`form-control ${
                          errors.looking_for ? "is-invalid" : ""
                        }`}
                        value={form.looking_for}
                        onChange={(e) =>
                          setForm({ ...form, looking_for: e.target.value })
                        }
                        rows={2}
                        placeholder="Enter who you are looking for"
                      />
                      {errors.looking_for && (
                        <div className="invalid-feedback">
                          {errors.looking_for}
                        </div>
                      )}
                    </div>
                  </div>
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

                  {/* <div className="mb-3">
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
                        placeholder="Search location"
                        ref={(input) => {
                          if (isLoaded && input && !autocomplete) {
                            const ac =
                              new window.google.maps.places.Autocomplete(
                                input,
                                {
                                  types: ["geocode"],
                                }
                              );
                            ac.addListener("place_changed", () => {
                              const place = ac.getPlace();
                              setForm((f) => ({
                                ...f,
                                location:
                                  place.formatted_address || input.value,
                              }));
                            });
                            setAutocomplete(ac);
                          }
                        }}
                      />
                      {errors.location && (
                        <div className="invalid-feedback">
                          {errors.location}
                        </div>
                      )}
                    </div> */}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdminPostJob;
