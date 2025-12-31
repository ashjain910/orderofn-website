import { Outlet, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function NavScrollExample() {
  const navigate = useNavigate();

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
            <Nav className="d-flex justify-content-end">
              <button
                className="btn btn-secondary mt-2"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="btn btn-secondary mt-2 ms-3"
                onClick={() => navigate("/pre-register")}
              >
                Sign up
              </button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div style={{ paddingBottom: 80 }}>
        <Outlet />
      </div>
    </>
  );
}

export default NavScrollExample;
