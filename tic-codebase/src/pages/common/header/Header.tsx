import { Outlet, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import { useLocation } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Cookies from "js-cookie";
import "./Header.css";
function NavScrollExample() {
  const navigate = useNavigate();
  const location = useLocation();
  // Get user from sessionStorage
  const user = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();
  // Get subscription_status from sessionStorage
  const subscriptionStatus =
    sessionStorage.getItem("subscription_status") || "";

  const logout = () => {
    Cookies.remove("access");
    Cookies.remove("refresh");
    sessionStorage.clear();
    navigate("/");
  };
  return (
    <>
      <Navbar expand="lg" className="" collapseOnSelect>
        <Container fluid className="header_top">
          <Navbar.Brand onClick={() => navigate("/")}>
            <img src="/image_logo.png" alt="TIC Logo" className="logo_tic" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="ms-auto my-2 my-lg-0 header-nav-links w-100"
              style={{ textAlign: "center" }}
            >
              {/* <Nav.Link
                className="mr-20"
                active={location.pathname === "/dashboard"}
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </Nav.Link> */}
              <Nav.Link
                className="mr-20"
                active={location.pathname === "/jobs"}
                onClick={() => navigate("/jobs")}
              >
                Jobs
              </Nav.Link>
              {/* <Nav.Link
                className="mr-20"
                active={location.pathname === "/settings"}
                onClick={() => navigate("/settings")}
              >
                My settings
              </Nav.Link> */}
              <Nav.Link
                className="mr-20"
                active={location.pathname === "/subscription-plans"}
                onClick={() => navigate("/subscription-plans")}
              >
                Subscription
              </Nav.Link>

              <div className="d-flex align-items-center">
                <img
                  src="/profile_image.svg"
                  alt="User Avatar"
                  className="profile-image mr-2"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    marginRight: "5px",
                  }}
                />

                <NavDropdown
                  title={user?.full_name || user?.email || "User"}
                  id="navbarScrollingDropdown"
                >
                  <NavDropdown.Item onClick={() => navigate("/user-profile")}>
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    {subscriptionStatus && (
                      <span>Plan: {subscriptionStatus}</span>
                    )}
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => logout()}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div style={{ marginTop: 80, paddingBottom: 80 }}>
        <Outlet />
      </div>
    </>
  );
}

export default NavScrollExample;
