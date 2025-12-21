import { useNavigate } from "react-router-dom";
import "./login.css";
import api from "../../../services/api";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { toastOptions } from "../../../utils/toastOptions";
import { FaSpinner } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // On mount, check for remembered credentials
  useEffect(() => {
    const savedEmail = localStorage.getItem("user_remember_email") || "";
    const savedPassword = localStorage.getItem("user_remember_password") || "";
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    const access = Cookies.get("access");
    if (access) {
      navigate("/jobs", { replace: true });
    }
  }, [navigate]);
  const [loading, setLoading] = useState(false);

  // Login
  interface LoginResponse {
    access: string;
    refresh: string;
    user?: any;
    teacher_profile?: any;
  }

  interface RefreshResponse {
    access: string;
  }

  const handleLogin = async (
    email: string,
    password: string
  ): Promise<void> => {
    try {
      setLoading(true);
      const response = await api.post<LoginResponse>("/login", {
        email,
        password,
      });
      if (
        response.status === 200 &&
        response.data.access &&
        response.data.refresh
      ) {
        if (rememberMe) {
          localStorage.setItem("user_remember_email", email);
          localStorage.setItem("user_remember_password", password);
        } else {
          localStorage.removeItem("user_remember_email");
          localStorage.removeItem("user_remember_password");
        }
        Cookies.set("access", response.data.access, { secure: true });
        Cookies.set("refresh", response.data.refresh, { secure: true });
        if (response.status === 200 && response.data.user) {
          sessionStorage.setItem("user", JSON.stringify(response.data.user));
        }

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
        // Redirect to dashboard
      }
    } catch (error: any) {
      // If access token expired, use refresh token
      const errorData = error?.response?.data;
      if (
        error.response?.status === 401 &&
        Cookies.get("refresh") &&
        (errorData?.code === "token_not_valid" ||
          errorData?.detail?.includes("token not valid"))
      ) {
        try {
          const refreshResponse = await api.post<RefreshResponse>(
            "/token/refresh",
            {
              refresh: Cookies.get("refresh"),
            }
          );
          if (refreshResponse.data.access) {
            Cookies.set("access", refreshResponse.data.access, {
              secure: true,
            });
            // Optionally retry the original request or redirect
            toast.info("Session refreshed. Please try again.", toastOptions);
            return;
          } else {
            // Refresh failed, logout
            Cookies.remove("access");
            Cookies.remove("refresh");
            sessionStorage.removeItem("user");
            navigate("/", { replace: true });
            toast.error("Session expired. Please log in again.", toastOptions);
            return;
          }
        } catch (refreshError) {
          // Refresh failed, logout
          Cookies.remove("access");
          Cookies.remove("refresh");
          sessionStorage.removeItem("user");
          navigate("/", { replace: true });
          toast.error("Session expired. Please log in again.", toastOptions);
          return;
        }
      }
      if (error?.response?.data && typeof error.response.data === "object") {
        const data = error.response.data;
        Object.entries(data).forEach(([field, errors]) => {
          if (Array.isArray(errors)) {
            errors.forEach((err: string, idx: number) => {
              setTimeout(() => {
                toast.error(`${field}: ${err}`, toastOptions);
              }, idx * 500);
            });
          } else {
            toast.error(`${field}: ${errors}`, toastOptions);
          }
        });
      }
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreRegister = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate("/pre-register");
  };

  return (
    <div className="login-full-bg">
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(255,255,255,0.8)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FaSpinner className="fa-spin" size={32} />
          <span className="ms-2 mt-2">Loading...</span>
        </div>
      )}
      <div className="container-fluid login-container bg-white p-0 m-0">
        <div className="row vh-100">
          {/* LEFT SIDE FORM */}
          <div className="col-md-6 d-flex flex-column login__section__ pl_rem-8 pr_rem-8 position-relative">
            {/* Logo */}
            <img
              src="/tic/tic_logo.png"
              alt="TIC Logo"
              style={{
                width: "200px",
                marginBottom: "30px",
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            />
            <h3 className="mb-3">Login</h3>
            <p className="text-muted mb-4">
              Enter your email and password to access your account.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin(email, password);
              }}
              autoComplete="on"
            >
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control mb-3"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />

              {/* Password */}
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control mb-2"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />

              {/* Remember + Forgot */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="remember"
                    checked={rememberMe}
                    onChange={() => {
                      setRememberMe((prev) => {
                        const newVal = !prev;
                        if (!newVal) {
                          localStorage.removeItem("user_remember_email");
                          localStorage.removeItem("user_remember_password");
                        }
                        return newVal;
                      });
                    }}
                  />
                  <label className="form-check-label" htmlFor="remember">
                    Remember me
                  </label>
                </div>

                <a
                  href="#"
                  className="text-primary txt__regular__ text-decoration-none"
                >
                  Forgot Password
                </a>
              </div>

              {/* Login Button */}
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
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            {/* Register Link */}
            <p className="text-center txt__regular__ mt-3">
              Seeking teaching opportunities?{" "}
              <a
                role="button"
                onClick={handlePreRegister}
                className="text-primary fw-semibold"
              >
                Set up your profile
              </a>
            </p>
            <p className="text-center text-muted txt__regular__ login-footer">
              © tic 2025
            </p>
          </div>

          {/* RIGHT SIDE IMAGE */}
          <div className="col-md-6 d-none d-md-flex justify-content-center align-items-center position-relative">
            <img
              src="/tic/login_img/Group_2.png"
              alt="Illustration"
              className="img-fluid w-100"
              style={{ position: "relative" }}
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

// CSS (add to login.css):
// .login-footer {
//   position: absolute;
//   bottom: 16px;
//   left: 0;
//   width: 100%;
//   text-align: center;
//   color: #888;
// }
// .login__section__ {
//   position: relative;
//   min-height: 100%;
// }
// .login-image-text {
//   position: absolute;
//   top: 32px;
//   left: 50%;
//   transform: translateX(-50%);
//   background: rgba(255, 255, 255, 0.85);
//   padding: 8px 16px;
//   border-radius: 8px;
//   font-size: 1.1rem;
//   z-index: 2;
// }
