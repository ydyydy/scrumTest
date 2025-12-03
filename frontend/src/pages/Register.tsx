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
import { registerUser } from "../services/user.service";
import { useNavigate } from "react-router";
import { MessageBox } from "../components/MessageBox";

export function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  const navigate = useNavigate();
  const emailRef = useRef(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await registerUser({ email, username, password });
      setSuccess(true);
      setMessage("Registro exitoso. Redirigiendo al inicio de sesión...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Error during registration"
      );
      setSuccess(false);
      setErrorCount((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={6} lg={5}>
          <Card
            style={{ borderColor: "#8a94a0ff" }}
            className="shadow-sm"
            bg="light"
          >
            <Card.Body>
              {/* Mensaje de éxito o error */}
              {message && (
                <MessageBox
                  key={errorCount}
                  message={message}
                  success={success}
                  duration={4000}
                />
              )}

              <h2 className="text-center mb-4">Registrarse</h2>
              <Form onSubmit={handleSubmit}>
                <FloatingLabel
                  controlId="registerEmail"
                  label="Correo electrónico"
                  className="mb-3"
                >
                  <Form.Control
                    ref={emailRef}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Correo electrónico"
                    autoComplete="email"
                  />
                </FloatingLabel>

                <FloatingLabel
                  controlId="registerUsername"
                  label="Nombre de usuario"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Nombre de usuario"
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
                    variant="outline-danger"
                    type="button"
                    onClick={handleBackToLogin}
                  >
                    Volver a Iniciar Sesión
                  </Button>
                </div>
              </Form>

              {/* Loading Spinner */}
              {loading && (
                <div className="d-flex justify-content-center my-3">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
