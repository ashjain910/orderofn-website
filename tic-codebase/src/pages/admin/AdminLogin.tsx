import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Cookies from "js-cookie";
import "../auth/login/login.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  // On mount, check for remembered credentials
  useEffect(() => {
    const savedEmail = localStorage.getItem("admin_remember_email") || "";
    const savedPassword = localStorage.getItem("admin_remember_password") || "";
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    const access = Cookies.get("access");
    const refresh = Cookies.get("refresh");
    if (access && refresh) {
      navigate("/admin/jobs");
    }
  }, [navigate]);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post("/login", { email, password });
      if (
        response.status === 200 &&
        response.data.access &&
        response.data.refresh
      ) {
        Cookies.set("access", response.data.access, { secure: true });
        Cookies.set("refresh", response.data.refresh, { secure: true });
        if (rememberMe) {
          // Store email and password in localStorage for autofill
          localStorage.setItem("admin_remember_email", email);
          localStorage.setItem("admin_remember_password", password);
        } else {
          localStorage.removeItem("admin_remember_email");
          localStorage.removeItem("admin_remember_password");
        }
        if (response.data.user) {
          Cookies.set("user", JSON.stringify(response.data.user), {
            secure: true,
          });
        }
        navigate("/admin/jobs");
      }
    } catch (error: any) {
      console.error("Admin login error:", error);
    } finally {
      setLoading(false);
    }
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
      <div className="container-fluid login-container bg-white pt_rem-3 vh-100 d-flex ">
        <div
          className="d-flex flex-column align-items-center"
          style={{ width: 350, margin: "0 auto" }}
        >
          <img
            src="/tic_logo.png"
            alt="TIC Logo"
            style={{ width: "120px", marginBottom: "20px" }}
          />
          <h3 className="mb-3">Admin Login</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin(email, password);
            }}
            style={{ width: "100%" }}
          >
            <label className="form-label w-100" style={{ fontSize: 13 }}>
              Email
            </label>
            <input
              type="email"
              className="form-control mb-3"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="form-label w-100" style={{ fontSize: 13 }}>
              Password
            </label>
            <input
              type="password"
              className="form-control mb-2"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="d-flex  align-items-center mb-3 w-100">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="rememberAdmin"
                  checked={rememberMe}
                  onChange={() => {
                    setRememberMe((prev) => {
                      const newVal = !prev;
                      if (!newVal) {
                        localStorage.removeItem("admin_remember_email");
                        localStorage.removeItem("admin_remember_password");
                      }
                      return newVal;
                    });
                  }}
                />
                <label
                  className="form-check-label"
                  htmlFor="rememberAdmin"
                  style={{ fontSize: 13 }}
                >
                  Remember me
                </label>
              </div>
            </div>
            <button
              className="btn btn-primary w-100 mb-3"
              type="submit"
              disabled={loading}
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
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
