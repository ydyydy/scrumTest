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
import { getExamResult, ExamResult } from "../services/exam.service";

export function ExamResultPage() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<ExamResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!examId) return;

    async function loadResult() {
      try {
        const data = await getExamResult(examId!);
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
  }, [examId, navigate]);

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
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          padding: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        ↑
      </Button>

      <Row className="mb-3 align-items-center">
        <Col>
          <h3 style={{ margin: 0 }}>Resultado del examen</h3>
        </Col>
        <Col className="text-end">
          <Button variant="warning" size="sm" onClick={() => navigate("/home")}>
            Salir
          </Button>
        </Col>
      </Row>

      <Card className="mb-3 p-2">
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
        <Card key={q.questionId} className="mb-2 p-2">
          <h6 className="mb-2" style={{ fontSize: "0.95rem" }}>
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
                  className={selected ? "fw-bold" : ""}
                  style={{
                    backgroundColor: selected
                      ? "rgba(87, 204, 130, 0.2)"
                      : undefined,
                    padding: "4px 8px",
                    fontSize: "0.85rem",
                  }}
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
