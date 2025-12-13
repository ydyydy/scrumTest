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
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/user.service";
import { MessageBox } from "../components/MessageBox";
import { useAuth } from "../context/AuthContext";

export function Login() {
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginUser(email, password);
      setSuccess(true);
      // Guardar sesión en AuthContext y localStorage
      login(data);
      navigate("/home");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Error durante el inicio de sesión"
      );
      setSuccess(false);
      setErrorCount((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigate("/register");
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
                  duration={3000}
                />
              )}
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
                    variant="outline-danger"
                    type="button"
                    onClick={handleRegister}
                  >
                    Crear una cuenta
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
