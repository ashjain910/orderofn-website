import { useNavigate } from "react-router-dom";
import "./login.css";
export default function Login() {
  const navigate = useNavigate();
  const handleLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate("/jobs");
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

            <h2 className="mb-2">Login</h2>
            <p className="text-muted mb-4">
              Enter your email and password to access your account.
            </p>

            {/* Email */}
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control mb-3"
              placeholder="Enter email"
            />

            {/* Password */}
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control mb-2"
              placeholder="Enter password"
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
              onClick={handleLogin}
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
