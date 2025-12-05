import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  FloatingLabel,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MessageBox } from "../components/MessageBox";
import { getUserProfile, updateUser } from "../services/user.service";
import { useAuth } from "../context/AuthContext";

export function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const { user, setUser } = useAuth();
  const { token } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const navigate = useNavigate();

  // Cargar datos del usuario si no está en contexto
  useEffect(() => {
    async function fetchUser() {
      if (!user) {
        try {
          const profile = await getUserProfile(id!);
          setUsername(profile.username);
        } catch (error) {
          setMessage(
            error instanceof Error ? error.message : "Error cargando usuario"
          );
          setSuccess(false);
          setErrorCount((prev) => prev + 1);
        }
      }
    }
    fetchUser();
  }, [id, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!token) {
      navigate("/login");
    }
    try {
      // PATCH para actualizar el username
      await updateUser(id!, { username }, token!);

      // Actualizamos directamente el contexto para reflejar el cambio
      setUser && setUser({ ...user!, username });

      setMessage("Username actualizado correctamente");
      setSuccess(true);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Error actualizando usuario"
      );
      setSuccess(false);
      setErrorCount((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
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
              {message && (
                <MessageBox
                  key={errorCount}
                  message={message}
                  success={success}
                  duration={3000}
                />
              )}

              <h2 className="text-center mb-4">Perfil de Usuario</h2>

              <Form onSubmit={handleSubmit}>
                <FloatingLabel
                  controlId="formUsername"
                  label="Username"
                  className="mb-4"
                >
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                  />
                </FloatingLabel>

                <div className="d-grid gap-2">
                  <Button type="submit" className="btn-scrum">
                    Guardar Cambios
                  </Button>
                </div>
              </Form>

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
