// import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
// import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useLocation, useNavigate } from "react-router-dom";
import "./Header.css";
import { Outlet } from "react-router-dom";

function NavScrollExample() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <>
      <Navbar expand="lg" className="">
        <Container fluid>
          <Navbar.Brand
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/dashboard")}
          >
            <img src="/tic/image_logo.png" alt="Logo" height={60} />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            />
            <Nav className="d-flex">
              <Nav.Link
                active={location.pathname === "/dashboard"}
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </Nav.Link>
              <Nav.Link
                active={location.pathname === "/jobs"}
                onClick={() => navigate("/jobs")}
              >
                Jobs
              </Nav.Link>
              <Nav.Link
                active={location.pathname === "/my-schools"}
                onClick={() => navigate("/my-schools")}
              >
                My schools
              </Nav.Link>
              <NavDropdown title="Link" id="navbarScrollingDropdown">
                <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action4">
                  Another action
                </NavDropdown.Item>
              </NavDropdown>
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
