import { useState, useEffect, useRef } from "react";
import Step1 from "../steps/Step1";
import Step2 from "../steps/Step2";
import Step3 from "../steps/Step3";
import Step4 from "../steps/Step4";
import Step5 from "../steps/Step5";

export default function PreRegister() {
  const [step, setStep] = useState<number>(1);
  const formRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<any>({
    // Step1
    fullName: "",
    qualified: "", // <-- add this
    english: "", // <-- add this
    position: "", // <-- add this

    // Step2
    firstName: "",
    lastName: "",
    gender: "",
    nationality: "",
    secondNationality: false,
    cvFile: null,
    hearFrom: "",

    // Step3
    role: "",
    subject: "",
    ageGroup: "",
    curriculum: [],

    // Step4
    leadershipRole: "",

    // Step5
    exampleRadio: false,
    day: "",
    month: "",
    year: "",
  });

  const stepImages = [
    "",
    "/src/assets/login_img/Group_1.png",
    "/src/assets/login_img/Group_3.png",
    "/src/assets/login_img/Group_4.png",
    "/src/assets/login_img/Group_5.png",
    "/src/assets/login_img/Group_6.png",
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

  const nextStep = () => setStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const submitAll = () => {
    console.log("Submitting formData:", formData);
    console.log("All form values:", JSON.stringify(formData, null, 2));
    // TODO: Call API here
  };

  return (
    <div className="">
      <div
        className="container-fluid login-container bg-white p-0 m-0"
        style={{ height: "100vh" }}
      >
        <div className="row" style={{ height: "100vh" }}>
          {/* LEFT SIDE — FORMS + STEPS */}
          <div
            className="col-md-6 pl-6 pr-6 pt_rem-3 pb_rem-5"
            style={{
              height: "100vh",
              overflowY: step === 2 || step === 3 ? "auto" : "hidden",
            }}
          >
            {/* Logo */}
            <img
              src="/src/assets/tic_logo.png"
              alt="TIC Logo"
              style={{
                width: "200px",
                marginBottom: "30px",
                display: "block",
              }}
            />
            <h3 className="text-center mb-3">Pre-Registration</h3>

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
