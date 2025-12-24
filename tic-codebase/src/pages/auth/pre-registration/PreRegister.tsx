import { useState, useEffect, useRef } from "react";
import api from "../../../services/api";
import Step1 from "../steps/Step1";
import Step2 from "../steps/Step2";
import Step3 from "../steps/Step3";
import Step4 from "../steps/Step4";
import Step5 from "../steps/Step5";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import type { ToastPosition } from "react-toastify";
import { useNavigate } from "react-router-dom";

const toastOptions: {
  position: ToastPosition;
  autoClose: number;
  hideProgressBar: boolean;
  closeOnClick: boolean;
  pauseOnHover: boolean;
  draggable: boolean;
  progress: undefined;
} = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};
const toastOptionsSucces: {
  position: ToastPosition;
  autoClose: number;
  hideProgressBar: boolean;
  closeOnClick: boolean;
  pauseOnHover: boolean;
  draggable: boolean;
  progress: undefined;
} = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export default function PreRegister() {
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(1);
  const formRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<any>({
    // Step1
    email: "",
    password: "",
    qualified: "", // <-- add this
    english: "", // <-- add this
    position: "", // <-- add this
    phone: "",
    // Step2
    first_name: "",
    last_name: "",
    gender: "",
    nationality: "",
    second_nationality: "",
    cv_file: null,
    hear_from: "",

    // Step3
    roles: "",
    subjects: "",
    age_group: "",
    curriculum: [],

    // Step4
    leadership_role: "",

    // Step5
    job_alerts: "",
    available_date: "",
  });

  // Loader state
  const [loading, setLoading] = useState(false);

  // Step-specific validation
  const validateStep = (step: number) => {
    const errors: string[] = [];
    if (step === 1) {
      if (!formData.email) {
        errors.push("Email is required");
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.push("Enter a valid email address");
      }
      if (!formData.phone) errors.push("Phone number is required");
      if (!formData.password) errors.push("Password is required");
      if (formData.password && formData.password.length < 8)
        errors.push("Password must be at least 8 characters.");
      if (!formData.qualified) errors.push("Qualified is required");
      if (!formData.english) errors.push("English is required");
      if (
        !formData.position ||
        (Array.isArray(formData.position) && formData.position.length === 0)
      )
        errors.push("Position is required");
    }
    if (step === 2) {
      if (!formData.first_name) errors.push("First name is required");
      if (!formData.last_name) errors.push("Last name is required");
      if (!formData.gender) errors.push("Gender is required");
      if (!formData.nationality) errors.push("Nationality is required");
    }
    // Add more for other steps if needed
    return errors;
  };
  const stepImages = [
    "",
    "/tic/login_img/Group_1.png",
    "/tic/login_img/Group_3.png",
    "/tic/login_img/Group_4.png",
    "/tic/login_img/Group_5.png",
    "/tic/login_img/Group_6.png",
  ];
  const stepTexts = [
    "",
    <>
      Find teaching jobs and manage bookings
      <span className="login-image-text-sub"> all in one place.</span>
    </>,
    <>
      Add your teaching credentials and{" "}
      <span className="login-image-text-sub">work history.</span>
    </>,
    <>
      Tell us about your{" "}
      <span className="login-image-text-sub">experience</span> in the classroom.
    </>,
    <>
      We’d like to hear about your{" "}
      <span className="login-image-text-sub">leadership experience.</span>
    </>,
    <>
      Set your start date and job alert{" "}
      <span className="login-image-text-sub">preferences.</span>
    </>,
  ];

  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step]);

  const nextStep = () => {
    const errors = validateStep(step);
    if (errors.length > 0) {
      // No toast for input validation; inline errors only
      return false;
    }
    setStep((s) => Math.min(s + 1, 5));
    return true;
  };
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));
  // Removed formErrors state

  // Registration
  const submitAll = async () => {
    setLoading(true);
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        // Handle multi-select fields (roles, subjects, leadership_roles)
        if (
          ["roles", "subjects", "leadership_role", "age_group"].includes(key) &&
          Array.isArray(value)
        ) {
          value.forEach((v) => {
            if (typeof v === "object" && v.value) {
              form.append(key, v.value);
            } else {
              form.append(key, v);
            }
          });
        } else if (Array.isArray(value)) {
          // For curriculum and other string arrays
          value.forEach((v) => form.append(key, v));
        } else {
          if (value instanceof Blob || typeof value === "string") {
            form.append(key, value);
          } else if (value !== null && value !== undefined) {
            form.append(key, String(value));
          }
        }
      });
      const response = await api.post("/pre-register", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (
        (response.status === 200 || response.status === 201) &&
        response.data.access &&
        response.data.refresh
      ) {
        Cookies.set("access", response.data.access, { secure: true });
        Cookies.set("refresh", response.data.refresh, { secure: true });
        toast.success("Registration successful!", toastOptionsSucces);
        sessionStorage.setItem("user", JSON.stringify(response.data.user));

        // Store teacher_profile from either top-level or nested in user
        const teacherProfile = response.data.user;
        if (teacherProfile) {
          if (teacherProfile.subscription_status) {
            sessionStorage.setItem(
              "subscription_status",
              teacherProfile.subscription_status
            );
          }
        }
        navigate("/jobs");

        // Redirect to dashboard or login
        return;
      }
      // If not 200/201 or missing tokens, show error
      toast.error("Registration failed. Please try again.", toastOptions);
    } catch (error: any) {
      let message = "Registration failed. Please try again.";
      if (error?.response?.status === 413) {
        toast.error(
          "File too large. Please upload a smaller file (within 1MB).",
          toastOptions
        );
      }
      if (
        error?.response?.status === 400 &&
        error?.response?.data &&
        typeof error.response.data === "object"
      ) {
        const data = error.response.data;
        console.log("API 400 error data:", data);

        // Helper to recursively flatten all error messages
        function flattenErrors(errObj: any): string[] {
          if (typeof errObj === "string") return [errObj];
          if (Array.isArray(errObj)) {
            return errObj.flatMap(flattenErrors);
          }
          if (typeof errObj === "object" && errObj !== null) {
            return Object.values(errObj).flatMap(flattenErrors);
          }
          return [];
        }

        const allErrors = flattenErrors(data);
        allErrors.forEach((err: string, idx: number) => {
          setTimeout(() => {
            toast.error(err, toastOptions);
          }, idx * 500);
        });
      } else if (error?.response?.data) {
        toast.error(error.response.data, toastOptions);
      } else if (error?.message) {
        toast.error(error.message, toastOptions);
      } else {
        toast.error(message, toastOptions);
      }
      console.error("API error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      {/* Loader overlay */}
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(255,255,255,0.7)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <div
        className="container-fluid login-container bg-white p-0 m-0"
        style={{ height: "100vh" }}
      >
        <div className="row" style={{ height: "100vh" }}>
          {/* LEFT SIDE — FORMS + STEPS */}
          <div
            className="col-md-6 preregister_form pt_rem-1 pb_rem-5"
            style={{
              height: "100vh",
              overflowY:
                step === 1 || step === 2 || step === 3 ? "auto" : "hidden",
            }}
          >
            {/* Logo */}
            <img
              src="/tic/tic_logo.png"
              alt="TIC Logo"
              style={{
                width: "200px",
                marginBottom: "30px",
                display: "block",
              }}
            />

            <h3 className="text-center mb-3">Registration</h3>

            <div className="card registration__card__">
              {step === 1 && (
                <Step1
                  formData={formData}
                  setFormData={setFormData}
                  nextStep={nextStep}
                />
              )}

              {step === 2 && (
                <Step2
                  formData={formData}
                  setFormData={setFormData}
                  prevStep={prevStep}
                  nextStep={nextStep}
                />
              )}

              {step === 3 && (
                <Step3
                  formData={formData}
                  setFormData={setFormData}
                  prevStep={prevStep}
                  nextStep={nextStep}
                />
              )}

              {step === 4 && (
                <Step4
                  formData={formData}
                  setFormData={setFormData}
                  prevStep={prevStep}
                  nextStep={nextStep}
                />
              )}

              {step === 5 && (
                <Step5
                  formData={formData}
                  setFormData={setFormData}
                  prevStep={prevStep}
                  nextStep={submitAll}
                />
              )}
            </div>
            <div className="text-center mt-3">
              <span className="text-muted txt__small__">
                Have an account? <a href="/tic/">Login</a>
              </span>
            </div>
          </div>

          {/* RIGHT SIDE — STATIC IMAGE */}
          <div
            className="col-md-6 d-none d-md-block p-0 position-relative"
            style={{ height: "100vh", minHeight: "400px" }}
          >
            <p
              className="login-image-text text-center"
              style={{
                position: "absolute",
                top: 32,
                left: "50%",
                transform: "translateX(-50%)",
                padding: "0px",
                borderRadius: "8px",
                fontWeight: 500,
                zIndex: 2,
                margin: 0,
                width: "auto",
                maxWidth: "90%",
              }}
            >
              {stepTexts[step]}
            </p>

            <img
              src={stepImages[step]}
              alt="Registration Visual"
              style={{
                width: "100%",
                objectFit: "cover",
                height: "100vh",
                minHeight: "400px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
