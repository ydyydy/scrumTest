import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaBook, FaClipboardCheck, FaTrophy } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserProfile } from "../services/user.service";
import { getQuestionsCount } from "../services/question.service";
import { ConfirmModal } from "../components/ConfirmModal";

export function Games() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [points, setPoints] = useState(0);
  const [errorModalMessage, setErrorModalMessage] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchUserPoints = async () => {
      if (!user || !token) {
        navigate("/login");
        return;
      }
      try {
        const profile = await getUserProfile(user!.sub.value, token!);
        setPoints(profile.points ?? 0);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserPoints();
  }, [user, token, navigate]);

  const handleRepaso = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const totalQuestions = await getQuestionsCount(token);
      if (totalQuestions < 1) {
        setErrorModalMessage("No hay preguntas disponibles para repasar.");
        return;
      }
      navigate("/games/review");
    } catch (error) {
      console.error(error);
      setErrorModalMessage("Error al comprobar la disponibilidad de preguntas.");
    }
  };

  const handleExamen = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const totalQuestions = await getQuestionsCount(token);
      if (totalQuestions < 55) {
        setErrorModalMessage(
          "No hay suficientes preguntas (mínimo 55) para iniciar un examen."
        );
        return;
      }
      navigate("/games/exam");
    } catch (error) {
      console.error(error);
      setErrorModalMessage("Error al comprobar la disponibilidad de preguntas.");
    }
  };

  const handleRanking = () => navigate("/games/ranking");

  return (
    <Container className="py-5">
      {/* Modal de error */}
      {errorModalMessage && (
        <ConfirmModal
          show={!!errorModalMessage}
          title="Atención"
          message={errorModalMessage}
          onConfirm={() => setErrorModalMessage(null)}
          onCancel={() => setErrorModalMessage(null)}
        />
      )}

      <div className="medal d-flex flex-column justify-content-center align-items-center mb-4">
        <div className="medal-circle d-flex flex-column justify-content-center align-items-center">
          <span className="medal-points">{points}</span>
        </div>
        <span className="medal-label mt-2">Puntos actuales</span>
      </div>

      <Row className="justify-content-center">
        {/* Iniciar repaso */}
        <Col xs={12} md={6} lg={4} className="mb-4">
          <Card className="text-center shadow-lg hover-card custom-blue-card">
            <Card.Body>
              <div className="large-blue-title">
                <FaBook />
              </div>
              <Card.Title className="custom-blue-text">Iniciar repaso</Card.Title>
              <Card.Text>
                Practica con tus temas más importantes y mejora tu rendimiento.
              </Card.Text>
              <Button
                variant="primary"
                size="lg"
                onClick={handleRepaso}
                className="card-button-style"
              >
                Iniciar
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Simulación de examen */}
        <Col xs={12} md={6} lg={4} className="mb-4">
          <Card className="text-center shadow-lg hover-card custom-green-card">
            <Card.Body>
              <div className="large-green-title">
                <FaClipboardCheck />
              </div>
              <Card.Title className="custom-green-text">Simulación de examen</Card.Title>
              <Card.Text>
                Pon a prueba tus conocimientos con un examen simulado.
              </Card.Text>
              <Button
                variant="success"
                size="lg"
                onClick={handleExamen}
                className="card-button-style"
              >
                Comenzar
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Ranking */}
        <Col xs={12} md={6} lg={4} className="mb-4">
          <Card className="text-center shadow-lg hover-card custom-yellow-card">
            <Card.Body>
              <div className="large-yellow-title">
                <FaTrophy />
              </div>
              <Card.Title className="custom-yellow-text">Ranking</Card.Title>
              <Card.Text>
                Consulta los mejores jugadores y tu posición en la tabla.
              </Card.Text>
              <Button
                variant="warning"
                size="lg"
                onClick={handleRanking}
                className="card-button-style"
              >
                Ver Ranking
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
