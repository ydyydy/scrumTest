import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
  Badge,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaSave } from "react-icons/fa";
import { MessageBox } from "../components/MessageBox";
import { getUserProfile, updateUser } from "../services/user.service";
import { getUserExamHistory } from "../services/exam.service";
import { useAuth } from "../context/AuthContext";
import { ScrumPagination } from "../components/ScrumPagination";
import { ExamHistoryItemDto } from "../utils/exam.dto";

export function UserProfile() {
  const { user, setUser, token, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState(user?.username || "");
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  const [history, setHistory] = useState<ExamHistoryItemDto[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 5;

  // Cargar perfil
  useEffect(() => {
    async function fetchUser() {
      if (!user || !token) {
        navigate("/login");
        return;
      }
      try {
        const profile = await getUserProfile(user!.sub.value, token!);
        setUsername(profile.username);
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Error cargando usuario"
        );
        setSuccess(false);
        setErrorCount((prev) => prev + 1);
      }
    }
    fetchUser();
  }, [user]);

  // Cargar historial SOLO si NO es administrador
  useEffect(() => {
    async function loadHistory() {
      if (!token) return;
      try {
        const res = await getUserExamHistory(
          user!.sub.value,
          page,
          limit,
          token
        );
        setHistory(res.items);
        setTotal(res.total);
      } catch (err) {
        console.error(err);
      }
    }
    loadHistory();
  }, [page, token, user]);

  const handleSaveUsername = async () => {
    if (!token) return;
    setLoading(true);
    try {
      await updateUser(user!.sub.value, { username }, token!);
      setUser && setUser({ ...user!, username });
      setMessage("Username actualizado correctamente");
      setSuccess(true);
      setEditing(false);
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

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "--:--";
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={7}>
          <Card className="shadow-sm" style={{ borderRadius: "15px" }}>
            <Card.Body>
              {/* Botón Salir */}
              <div className="d-flex justify-content-end mb-3">
                <Button variant="warning" onClick={() => navigate("/home")}>
                  Salir
                </Button>
              </div>

              {message && (
                <MessageBox
                  key={errorCount}
                  message={message}
                  success={success}
                  duration={3000}
                />
              )}

              {/* PERFIL */}
              <h2 className="mb-4 text-center">Perfil de Usuario</h2>
              <InputGroup className="mb-4">
                <Form.Control
                  type="text"
                  value={username}
                  disabled={!editing}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Button
                  variant={editing ? "success" : "outline-primary"}
                  onClick={() =>
                    editing ? handleSaveUsername() : setEditing(true)
                  }
                >
                  {editing ? <FaSave /> : <FaEdit />}
                </Button>
              </InputGroup>

              {/* HISTORIAL SOLO SI NO ES ADMIN */}
              {!isAdmin && (
                <>
                  <h4 className="mb-3 text-center">Historial de Exámenes</h4>
                  {history.length === 0 && (
                    <p className="text-center text-muted">
                      Sin exámenes todavía
                    </p>
                  )}

                  {/* Encabezado */}
                  <Row
                    className="align-items-center text-center mb-2 p-2 fw-bold"
                    style={{
                      borderRadius: "12px",
                      backgroundColor: "#e9ecef",
                    }}
                  >
                    <Col>Fecha</Col>
                    <Col>Puntuación</Col>
                    <Col>Correctas</Col>
                    <Col>Incorrectas</Col>
                    <Col>Duración</Col>
                  </Row>

                  {/* Filas de examen */}
                  {history.map((item) => (
                    <Row
                      key={item.examId}
                      className="align-items-center text-center mb-2 p-2 shadow-sm"
                      style={{
                        borderRadius: "12px",
                        backgroundColor: "#f8f9fa",
                      }}
                    >
                      <Col>
                        {item.finishDate
                          ? new Date(item.finishDate).toLocaleDateString()
                          : "--:--"}
                      </Col>
                      <Col>
                        <Badge bg={item.score! > 0 ? "success" : "secondary"}>
                          {item.score ?? 0}
                        </Badge>
                      </Col>
                      <Col>{item.correct}</Col>
                      <Col>{item.incorrect}</Col>
                      <Col>{formatDuration(item.duration)}</Col>
                    </Row>
                  ))}
                  {/* PAGINACIÓN */}
                  <ScrumPagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(p) => setPage(p)}
                  />
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
