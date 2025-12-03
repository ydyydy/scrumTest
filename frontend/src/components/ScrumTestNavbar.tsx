import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/images/logo_navbar.png";
import { useAuth } from "../context/AuthContext";

export function ScrumTestNavbar() {
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <Navbar expand="lg" className="backgroudColor">
      <Container>
        {/* Logo */}
        <Navbar.Brand
          as={Link}
          to="/home"
          className="text-light d-flex align-items-center"
        >
          <img
            src={logo}
            alt="ScrumTest Logo"
            width="32"
            height="32"
            className="d-inline-block align-top me-2"
          />
          ScrumTest
        </Navbar.Brand>

        {/* ⭐ Home al lado del logo */}
        <Nav className="ms-2">
          <Nav.Link
            as={NavLink}
            to="/home"
            className="text-light"
            style={{ padding: "0.5rem 1rem" }}
          >
            Home
          </Nav.Link>
        </Nav>

        {/* Botón hamburguesa */}
        <Navbar.Toggle aria-controls="navbar-nav" />

        {/* Menú colapsable */}
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            {/* Si NO está logueado → Mostrar solo Login/Register */}
            {!isLoggedIn && (
              <>
                <Nav.Link
                  as={NavLink}
                  to="/login"
                  className="text-light mx-2"
                  style={{ padding: "0.5rem 1rem" }}
                >
                  Iniciar Sesión
                </Nav.Link>

                <Nav.Link
                  as={NavLink}
                  to="/register"
                  className="text-light mx-2"
                  style={{ padding: "0.5rem 1rem" }}
                >
                  Registrarse
                </Nav.Link>
              </>
            )}

            {/* Si está logueado → Mostrar dropdown con nombre */}
            {isLoggedIn && (
              <NavDropdown
                title={<span className="text-light">{user?.username}</span>}
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item as={NavLink} to="/profile">
                  Perfil
                </NavDropdown.Item>

                <NavDropdown.Divider />

                <NavDropdown.Item onClick={logout}>
                  Cerrar sesión
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
