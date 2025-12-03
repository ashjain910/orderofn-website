import { Outlet, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import { useLocation } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
function NavScrollExample() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <>
      <Navbar expand="lg" className="" collapseOnSelect>
        <Container fluid>
          <Navbar.Brand onClick={() => navigate("/")}>
            <img
              src="/tic/image_logo.png"
              alt="TIC Logo"
              style={{ width: "60px", height: "60px" }}
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="ms-auto my-2 my-lg-0 header-nav-links">
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
              <Nav.Link
                className="mr-20"
                active={location.pathname === "/settings"}
                onClick={() => navigate("/settings")}
              >
                My settings
              </Nav.Link>
              <div className="d-flex">
                <img
                  src="/tic/profile_image.jpg"
                  alt="User Avatar"
                  className="profile-image mr-2"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    marginRight: "5px",
                  }}
                />
                <NavDropdown title="john williams" id="navbarScrollingDropdown">
                  <NavDropdown.Item onClick={() => navigate("/")}>
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
