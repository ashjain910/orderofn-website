import { useNavigate } from "react-router-dom";
import "./login.css";
import api from "../../../services/api";

import { useState } from "react";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import type { ToastPosition } from "react-toastify";

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
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Login
  interface LoginResponse {
    access: string;
    refresh: string;
    user?: any;
  }

  interface RefreshResponse {
    access: string;
  }

  const handleLogin = async (
    email: string,
    password: string
  ): Promise<void> => {
    try {
      const response = await api.post<LoginResponse>("/login", {
        email,
        password,
      });
      if (
        response.status === 200 &&
        response.data.access &&
        response.data.refresh
      ) {
        Cookies.set("access", response.data.access, { secure: true });
        Cookies.set("refresh", response.data.refresh, { secure: true });
        if (response.status === 200 && response.data.user) {
          sessionStorage.setItem("user", JSON.stringify(response.data.user));
        }
        navigate("/jobs");
        // Redirect to dashboard
      }
    } catch (error: any) {
      // If access token expired, use refresh token
      if (error.response?.status === 401 && Cookies.get("refresh")) {
        const refreshResponse = await api.post<RefreshResponse>(
          "/token/refresh",
          {
            refresh: Cookies.get("refresh"),
          }
        );
        if (refreshResponse.data.access) {
          Cookies.set("access", refreshResponse.data.access, { secure: true });
          // Retry login or redirect
        }
      } else {
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
      }
    }
  };

  const handlePreRegister = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate("/pre-register");
  };

  return (
    <div className="login-full-bg">
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
            <ToastContainer />
            <h3 className="mb-3">Login</h3>
            <p className="text-muted mb-4">
              Enter your email and password to access your account.
            </p>
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control mb-3"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password */}
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control mb-2"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Remember + Forgot */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="remember"
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
              className="btn btn-primary w-100 py-2"
              onClick={() => handleLogin(email, password)}
            >
              Login
            </button>

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
