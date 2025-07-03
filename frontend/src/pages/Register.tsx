import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  FloatingLabel,
} from "react-bootstrap";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";

export function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const emailRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Nombre de usuario:", username);
    console.log("Password:", password);
  };

  const handleBackToLogin = () => {
    console.log("Volver a iniciar sesión");
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={6} lg={5}>
          <Card
            style={{ borderColor: "#ced4da" }}
            className="shadow-sm"
            bg="light"
          >
            <Card.Body>
              <h2 className="text-center mb-4">Registrarse</h2>
              <Form onSubmit={handleSubmit}>
                <FloatingLabel
                  controlId="registerEmail"
                  label="Correo Electrónico"
                  className="mb-3"
                >
                  <Form.Control
                    ref={emailRef}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Correo Electrónico"
                    autoComplete="email"
                  />
                </FloatingLabel>

                <FloatingLabel
                  controlId="registerUsername"
                  label="Nombre de Usuario"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Nombre de Usuario"
                    autoComplete="username"
                  />
                </FloatingLabel>

                <FloatingLabel
                  controlId="registerPassword"
                  label="Contraseña"
                  className="mb-4"
                >
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Contraseña"
                    autoComplete="new-password"
                  />
                </FloatingLabel>

                <div className="d-grid gap-2">
                  <Button type="submit" className="btn-scrum">
                    Registrarse
                  </Button>

                  <Button
                    as={Link}
                    to="/login"
                    variant="outline-danger"
                    type="button"
                    onClick={handleBackToLogin}
                  >
                    Volver a Iniciar Sesión
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
