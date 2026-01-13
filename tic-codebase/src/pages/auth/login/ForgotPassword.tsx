import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { toast } from "react-toastify";
import { toastOptions } from "../../../utils/toastOptions";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      await api.post("/password-reset/request", { email });
      setSubmitted(true);
    } catch (err) {
      toast.error("No account found with this email address", toastOptions);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-full-bg">
      <div className="container-fluid login-container bg-white p-0 m-0">
        <div className="row vh-100">
          <div className="col-md-6 d-flex flex-column login__section__  position-relative">
            <img
              src="/tic_logo.png"
              alt="TIC Logo"
              style={{
                width: "200px",
                marginBottom: "30px",
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            />

            {submitted ? (
              <>
                <h3 className="text-center">Check your email</h3>
                <div className="">
                  {`We've sent you a link at ${email} that will allow for you to reset your password`}
                </div>
              </>
            ) : (
              <>
                <h3 className="mb-3">Forgot Password</h3>

                <p className="text-muted mb-4">
                  Enter your email address to receive a password reset link.
                </p>
                <form onSubmit={handleSubmit} autoComplete="on">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control mb-3"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username"
                    required
                  />
                  <button
                    className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center"
                    type="submit"
                    disabled={loading}
                    style={{ minHeight: 40 }}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                </form>
              </>
            )}
            <button className="btn btn-link mt-3" onClick={() => navigate(-1)}>
              Back to Login
            </button>
          </div>
          <div
            className="col-md-6 d-none d-md-flex justify-content-center align-items-center position-relative"
            style={{ background: "#DDEFFF" }}
          >
            <img
              style={{
                maxWidth: "450px",
                height: "450px",
                position: "relative",
              }}
              src="/Mobile_login_pana.png"
              alt="Illustration"
              className=""
            />
            <p className="login-image-text text-center">
              Find teaching jobs and manage bookings
              <span className="login-image-text-sub"> all in one place.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
