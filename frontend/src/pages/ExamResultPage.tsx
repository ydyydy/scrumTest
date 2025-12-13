import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Row,
  Col,
  Badge,
  ListGroup,
  Button,
} from "react-bootstrap";
import { getExamResult } from "../services/exam.service";
import { ExamResult } from "../utils/exam.dto";
import { useAuth } from "../context/AuthContext";

export function ExamResultPage() {
  const { examId } = useParams<{ examId: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [result, setResult] = useState<ExamResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    if (!examId) return;

    async function loadResult() {
      try {
        const data = await getExamResult(examId!, token!);
        setResult(data);
      } catch (err) {
        console.error(err);
        alert("Error cargando el resultado del examen");
        navigate("/home");
      } finally {
        setLoading(false);
      }
    }

    loadResult();
  }, [examId, navigate, token]);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading || !result) {
    return <div className="text-center p-5">Cargando resultado…</div>;
  }

  return (
    <Container className="py-4 position-relative">
      {/* Botón redondo subir al inicio */}
      <Button
        variant="primary"
        onClick={handleScrollTop}
        className="scroll-top-btn"
      >
        ↑
      </Button>

      <Row className="mb-3 align-items-center">
        <Col>
          <h3 className="exam-title">Resultado del examen</h3>
        </Col>
        <Col className="text-end">
          <Button variant="warning" size="sm" onClick={() => navigate("/home")}>
            Salir
          </Button>
        </Col>
      </Row>

      <Card className="mb-3 exam-summary-card">
        <Row>
          <Col>
            <strong>Puntuación:</strong> {result.score} puntos
          </Col>
          <Col>
            <strong>Duración:</strong> {result.duration} seg
          </Col>
        </Row>
      </Card>

      {result.questions.map((q, idx) => (
        <Card key={q.questionId} className="mb-2 exam-question-card">
          <h6 className="question-text">
            {idx + 1}. {q.text}{" "}
            <Badge bg={q.isCorrect ? "success" : "danger"} pill>
              {q.isCorrect ? "Correcta" : "Incorrecta"}
            </Badge>
          </h6>
          <ListGroup variant="flush">
            {q.answers.map((a) => {
              const selected = q.userAnswerIds.includes(a.id);
              return (
                <ListGroup.Item
                  key={a.id}
                  className={`answer-item ${selected ? "selected" : ""}`}
                >
                  {a.text}
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </Card>
      ))}
    </Container>
  );
}
