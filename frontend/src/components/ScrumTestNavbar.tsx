import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/images/logo_navbar.png";

export function SolidarianNavbar() {
  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        {/* Logo */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src={logo}
            alt="Solidarian Logo"
            width="32"
            height="32"
            className="d-inline-block align-top me-2"
          />
          SolidarianID
        </Navbar.Brand>

        {/* Botón hamburguesa */}
        <Navbar.Toggle aria-controls="navbar-nav" />

        {/* Enlaces */}
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link
              as={NavLink}
              to="/login"
              className="text-light mx-2"
              style={{ padding: "0.5rem 1rem" }}
            >
              Login
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/register"
              className="text-light mx-2"
              style={{ padding: "0.5rem 1rem" }}
            >
              Register
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
