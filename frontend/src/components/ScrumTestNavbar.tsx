import { Container, Navbar, Nav, Button } from "react-bootstrap";
import logo from "../assets/images/logo_navbar.png";
import { Link } from "react-router-dom";

export const ScrumTestNavbar = () => {
  return (
    <Navbar className="backgroudColor" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src={logo}
            alt="ScrumTest Logo"
            width="30"
            height="30"
            className="d-inline-block align-top me-2"
          />
          ScrumTest
        </Navbar.Brand>

        {/* Hamburger Menu Toggle */}
        <Navbar.Toggle aria-controls="navbar-nav" />

        {/* Navbar Collapse */}
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Button
              as={Link}
              to="/login"
              variant="light"
              className="me-2 transition-all duration-300 ease-in-out transform hover:bg-gray-200"
            >
              Iniciar Sesión
            </Button>
            <Button
              as={Link}
              to="/register"
              variant="outline-light"
              className="transition-all duration-300 ease-in-out transform hover:bg-gray-200"
            >
              Registrarse
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
