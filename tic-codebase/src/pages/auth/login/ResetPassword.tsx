import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../../services/api";
import { toast } from "react-toastify";
import { toastOptions } from "../../../utils/toastOptions";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [tokenValid, setTokenValid] = useState<null | boolean>(null);
  const [tokenError, setTokenError] = useState("");

  // Extract token from query string
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  useEffect(() => {
    async function validateToken() {
      if (!token) {
        setTokenValid(false);
        setTokenError("Missing or invalid token.");
        return;
      }
      setLoading(true);
      try {
        // Validate token with backend
        const res = await api.post("/password-reset/validate-token", { token });
        if (res.data && typeof res.data.valid !== "undefined") {
          if (res.data.valid) {
            setTokenValid(true);
          } else {
            setTokenValid(false);
            setTokenError(
              res.data.message ||
                "Invalid or expired token. Please request a new password reset link."
            );
          }
        } else {
          setTokenValid(false);
          setTokenError(
            "Invalid or expired token. Please request a new password reset link."
          );
        }
      } catch (err) {
        setTokenValid(false);
        setTokenError(
          "Invalid or expired token. Please request a new password reset link."
        );
      } finally {
        setLoading(false);
      }
    }
    validateToken();
    // eslint-disable-next-line
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields.", toastOptions);
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.", toastOptions);
      return;
    }
    if (!token) {
      toast.error("Invalid or missing token.", toastOptions);
      return;
    }
    setLoading(true);
    try {
      await api.post("/password-reset/confirm", {
        token,
        password,
        password_confirm: confirmPassword,
      });
      setSubmitted(true);
      toast.success(
        "Password reset successful! You can now log in.",
        toastOptions
      );
    } catch (err) {
      toast.error("Failed to reset password.", toastOptions);
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

            {loading && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  background: "rgb(255,255,255)",
                  zIndex: 9999,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  className="spinner-border text-primary"
                  style={{ width: 48, height: 48 }}
                  role="status"
                  aria-hidden="true"
                ></span>
                <span className="ms-2 mt-2">Loading...</span>
              </div>
            )}
            {tokenValid === false && (
              <div className="alert alert-danger">{tokenError}</div>
            )}
            {tokenValid && !submitted && (
              <>
                <h3 className="mb-3">Reset Password</h3>
                <p className="text-muted mb-4">
                  Enter your new password below.
                </p>
                <form onSubmit={handleSubmit} autoComplete="off">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control mb-3"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control mb-3"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                        Resetting...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </form>
              </>
            )}
            {submitted && (
              <div className="">
                Password reset successful!{" "}
                <button
                  className="btn btn-link p-0"
                  onClick={() => navigate("/login")}
                >
                  Go to Login
                </button>
              </div>
            )}
            {/* <button
              className="btn btn-link mt-3"
              onClick={() => navigate("/login")}
            >
              Back
            </button> */}
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
          </div>
        </div>
      </div>
    </div>
  );
}
