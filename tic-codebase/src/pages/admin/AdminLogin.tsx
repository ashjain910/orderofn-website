import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Cookies from "js-cookie";
import "../auth/login/login.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (email: string, password: string) => {
    navigate("/admin/dashboard");

    try {
      const response = await api.post("/login", { email, password });
      if (
        response.status === 200 &&
        response.data.access &&
        response.data.refresh
      ) {
        Cookies.set("access", response.data.access, { secure: true });
        Cookies.set("refresh", response.data.refresh, { secure: true });
        if (response.data.admin) {
          sessionStorage.setItem("admin", JSON.stringify(response.data.admin));
        }
        navigate("/admin/dashboard");
      }
    } catch (error: any) {
      console.error("Admin login error:", error);
    }
  };

  return (
    <div className="login-full-bg">
      <div className="container-fluid login-container bg-white pt_rem-3 vh-100 d-flex ">
        <div
          className="d-flex flex-column align-items-center"
          style={{ width: 350, margin: "0 auto" }}
        >
          <img
            src="/tic/tic_logo.png"
            alt="TIC Logo"
            style={{ width: "120px", marginBottom: "20px" }}
          />
          <h3 className="mb-3">Admin Login</h3>

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
            onClick={() => handleLogin(email, password)}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
