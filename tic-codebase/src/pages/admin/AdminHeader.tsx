import { useEffect, useState } from "react";
import Nav from "react-bootstrap/esm/Nav";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function AdminHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("");
  const logout = () => {
    Cookies.remove("access");
    Cookies.remove("refresh");
    Cookies.remove("admin_access");
    Cookies.remove("admin_refresh");
    sessionStorage.clear();
    navigate("/");
  };
  useEffect(() => {
    const admin = sessionStorage.getItem("admin");
    if (admin) {
      try {
        const parsed = JSON.parse(admin);
        setAdminName(parsed.name || "Admin");
      } catch {
        setAdminName("Admin");
      }
    } else {
      setAdminName("Admin");
    }
  }, []);

  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-4"
        style={{ minHeight: 60 }}
      >
        <div className="container-fluid">
          <Link
            to="/admin/dashboard"
            className="navbar-brand d-flex align-items-center"
          >
            <img
              src="/tic/tic_logo.png"
              alt="Admin Logo"
              style={{ width: 120, marginRight: 12 }}
            />
            <span style={{ fontWeight: 600, fontSize: 20 }}>Admin Panel</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#adminNavbar"
            aria-controls="adminNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="adminNavbar">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center justify-content-end w-100">
              <Nav.Link
                className="mr-20"
                active={location.pathname === "/admin/dashboard"}
                onClick={() => navigate("/admin/dashboard")}
              >
                Dashboard
              </Nav.Link>
              <Nav.Link
                className="mr-20"
                active={location.pathname === "/admin/jobs"}
                onClick={() => navigate("/admin/jobs")}
              >
                Jobs
              </Nav.Link>
              <Nav.Link
                className="mr-20"
                active={location.pathname === "/admin/teachers"}
                onClick={() => navigate("/admin/teachers")}
              >
                My Teachers
              </Nav.Link>
              <Nav.Link
                className="mr-20"
                active={location.pathname === "/admin/post-job"}
                onClick={() => navigate("/admin/post-job")}
              >
                Post a Job
              </Nav.Link>
              <li
                role="button"
                className="nav-item dropdown ml-2"
                id="adminProfileDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {adminName}

                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="adminProfileDropdown"
                >
                  <li>
                    <Link className="dropdown-item" to="/admin/settings">
                      My Settings
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={logout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div style={{ marginTop: 80, paddingBottom: 80 }}>
        <Outlet />
      </div>
    </>
  );
}
