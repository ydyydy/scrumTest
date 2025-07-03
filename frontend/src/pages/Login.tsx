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

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
  };

  const handleRegister = () => {
    console.log("Redirigir a registro");
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
              <h2 className="text-center mb-4">Iniciar Sesión</h2>
              <Form onSubmit={handleSubmit}>
                <FloatingLabel
                  controlId="formEmail"
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
                  controlId="formPassword"
                  label="Contraseña"
                  className="mb-4"
                >
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Contraseña"
                    autoComplete="current-password"
                  />
                </FloatingLabel>

                <div className="d-grid gap-2">
                  <Button type="submit" className="btn-scrum">
                    Iniciar Sesión
                  </Button>

                  <Button
                    as={Link}
                    to="/register"
                    variant="outline-danger"
                    type="button"
                    onClick={handleRegister}
                  >
                    Crear una cuenta
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
